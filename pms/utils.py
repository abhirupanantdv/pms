import frappe  # type: ignore
from frappe.utils import validate_phone_number  # type: ignore

def validate_tenant_onboarding_signed_document(doc, method=None):
    """
    Enforce Signed Document requirement before changing from Draft to Pending Approval.
    Applies ONLY for Tenant Onboarding.
    """
    if getattr(doc, "doctype", None) != "Tenant Onboarding":
        return

    curr_state = (doc.workflow_state or "").strip().lower()
    if not ("pending" in curr_state):
        return

    # Check previous workflow state in database
    db_state = ""
    if not getattr(doc, "is_new", lambda: False)():
        if hasattr(doc, "name") and doc.name and frappe.db.exists("Tenant Onboarding", doc.name):
            db_state = (frappe.db.get_value("Tenant Onboarding", doc.name, "workflow_state") or "Draft").strip().lower()
        else:
            db_state = "draft"
    else:
        db_state = "draft"

    # Only enforce when transitioning FROM Draft TO Pending Approval
    if db_state in ("draft", "drafted", ""):
        signed_doc = getattr(doc, "signed_document", None) or doc.get("signed_document")
        if not signed_doc or not str(signed_doc).strip():
            frappe.throw(
                frappe._("Please upload the Signed Document before changing status from Draft to Pending Approval."),
                title=frappe._("Signed Document Required")
            )


def validate_tenant_onboarding_phone(doc, method=None):
    if doc.contact_number:
        if not validate_phone_number(doc.contact_number):
            frappe.throw(
                msg=frappe._("Phone Number {0} set in field contact_number is not valid.").format(doc.contact_number),
                title=frappe._("Invalid Phone Number")
            )
    validate_tenant_onboarding_signed_document(doc, method)


def sync_quotation_tenant_onboarding(doc, method=None):
    """
    Ensures that when a Quotation is amended or created from an existing quotation,
    custom_tenant_onboarding is inherited from the previous/parent quotation.
    """
    if not doc.get("custom_tenant_onboarding"):
        parent_name = doc.get("amended_from")
        if not parent_name and doc.name and "-" in doc.name:
            parts = doc.name.split("-")
            if len(parts) > 3 and parts[-1].isdigit():
                parent_name = "-".join(parts[:-1])

        if parent_name and frappe.db.exists("Quotation", parent_name):
            try:
                onboarding_val = frappe.db.get_value("Quotation", parent_name, "custom_tenant_onboarding")
                if onboarding_val:
                    doc.custom_tenant_onboarding = onboarding_val
            except Exception:
                pass


def validate_quotation_payment_details(doc, method=None):
    # Skip validation if flagged (e.g. during automatic submission for cancellation/revision)
    if getattr(doc.flags, "ignore_payment_validation", False) or getattr(doc.flags, "ignore_validate", False):
        return

    # Apply validation only for non-service quotations
    if not doc.custom_service_quotation:
        text = (doc.custom_payment_details or "").strip()

        if len(text) < 40:
            frappe.throw(
                "Payment Details must contain at least 40 characters. "
                "Currently entered: " + str(len(text))
            )


@frappe.whitelist()
def create_maintenance_quotation(task_name=None):
    # 1. Get Task ID from API request
    if not task_name:
        task_name = frappe.form_dict.get("task_name")

    if not task_name:
        frappe.throw("Task ID is required.")

    # 2. Check whether Task exists
    if not frappe.db.exists("Task", task_name):
        frappe.throw("Task {0} does not exist.".format(task_name))

    # 3. Fetch Task
    task = frappe.get_doc("Task", task_name)

    # 4. Check custom_quotation_id first
    if task.get("custom_quotation_id"):
        quotation_id = task.custom_quotation_id

        # Verify that the linked Quotation still exists
        if frappe.db.exists("Quotation", quotation_id):
            res_data = {
                "status": "exists",
                "quotation": quotation_id,
                "task": task.name,
                "message": "Quotation has already been generated."
            }
            frappe.response["message"] = res_data
            return res_data
        else:
            frappe.throw(
                "Task {0} contains Quotation ID {1}, "
                "but that Quotation does not exist. "
                "Please verify the reference before creating another."
                .format(task.name, quotation_id)
            )

    else:
        # 5. Validate Task
        if task.status != "Open":
            frappe.throw(
                "Only Completed Tasks can create a Quotation."
            )

        if task.docstatus != 0:
            frappe.throw(
                "Please submit the Task before creating a Quotation."
            )

        customer_name = task.get("custom_customer_name") or task.get("customer")
        if not customer_name:
            frappe.throw("Customer is missing in the Task.")

        if not frappe.db.exists("Customer", customer_name):
            frappe.throw(
                "Customer {0} does not exist."
                .format(customer_name)
            )

        if not task.get("company"):
            frappe.throw("Company is missing in the Task.")

        if not task.get("custom_items_used_for_maintenance"):
            frappe.throw(
                "No maintenance items found in the Task."
            )

        # 6. Check for an existing Quotation linked to this Task
        quotation_meta = frappe.get_meta("Quotation")
        existing = None

        if quotation_meta.has_field("custom_task_reference"):
            existing = frappe.db.get_value(
                "Quotation",
                {
                    "custom_task_reference": task.name,
                    "docstatus": ["!=", 2]
                },
                "name"
            )

        if existing:
            # Save existing Quotation ID in Task
            task.db_set(
                "custom_quotation_id",
                existing,
                update_modified=False
            )

            res_data = {
                "status": "exists",
                "quotation": existing,
                "task": task.name,
                "message": "Existing Quotation linked to this Task."
            }
            frappe.response["message"] = res_data
            return res_data

        else:
            # 7. Create a new Quotation
            quotation = frappe.new_doc("Quotation")

            quotation.quotation_to = "Customer"
            quotation.party_name = customer_name
            quotation.company = task.company

            # Service Quotation checked
            if quotation_meta.has_field("custom_service_quotation"):
                quotation.custom_service_quotation = 1

            # Valid until 7 days from today
            quotation.valid_till = frappe.utils.add_days(
                frappe.utils.today(), 7
            )

            # Booking reference
            if task.get("custom_booking_id"):
                quotation.booking_id = task.custom_booking_id

            # Link Task to Quotation, if field exists
            if quotation_meta.has_field("custom_task_reference"):
                quotation.custom_task_reference = task.name
            if quotation_meta.has_field("custom_task_id"):
                quotation.custom_task_id = task.name

            # 8. Fetch Customer, address, contact and company defaults
            quotation.run_method("set_missing_values")

            # Reapply fixed values
            if quotation_meta.has_field("custom_service_quotation"):
                quotation.custom_service_quotation = 1

            quotation.valid_till = frappe.utils.add_days(
                frappe.utils.today(), 7
            )

            if task.get("custom_booking_id"):
                quotation.booking_id = task.custom_booking_id

            # 9. Map maintenance items into Quotation Items
            item_meta = frappe.get_meta("Quotation Item")

            for source in task.custom_items_used_for_maintenance:
                # Identify Item code from source child row
                item_code = (
                    source.get("item_code")
                    or source.get("item")
                    or source.get("unit_code")
                    or source.get("unit")
                )

                if not item_code:
                    frappe.throw(
                        "Item code is missing in maintenance row {0}."
                        .format(source.idx)
                    )

                if not frappe.db.exists("Item", item_code):
                    frappe.throw(
                        "Item {0} does not exist in the Item master."
                        .format(item_code)
                    )

                # Quantity
                qty = (
                    source.get("qty")
                    or source.get("quantity")
                    or 1
                )

                row = quotation.append("items", {
                    "item_code": item_code,
                    "qty": qty
                })

                # Copy optional fields when available
                for fieldname in [
                    "description",
                    "uom",
                    "rate",
                    "warehouse",
                    "cost_center"
                ]:
                    if (
                        item_meta.has_field(fieldname)
                        and source.get(fieldname) is not None
                        and source.get(fieldname) != ""
                    ):
                        row.set(
                            fieldname,
                            source.get(fieldname)
                        )

                # Support custom_rate or custom_price from maintenance items
                custom_rate = source.get("custom_rate") if (source.get("custom_rate") is not None and source.get("custom_rate") != "") else source.get("custom_price")
                if custom_rate is not None and custom_rate != "":
                    row.rate = custom_rate

            # 10. Recalculate defaults, totals and taxes
            quotation.run_method("set_missing_values")
            quotation.run_method("calculate_taxes_and_totals")

            # Reapply fixed values
            if quotation_meta.has_field("custom_service_quotation"):
                quotation.custom_service_quotation = 1

            quotation.valid_till = frappe.utils.add_days(
                frappe.utils.today(), 7
            )

            if task.get("custom_booking_id"):
                quotation.booking_id = task.custom_booking_id

            # 11. Insert Quotation as Draft
            quotation.insert()

            # 12. Store generated Quotation ID in Task
            task.db_set(
                "custom_quotation_id",
                quotation.name,
                update_modified=False
            )

            # 13. Return response to Client Script
            res_data = {
                "status": "created",
                "quotation": quotation.name,
                "task": task.name,
                "party_name": quotation.party_name,
                "company": quotation.company,
                "booking_id": quotation.get("booking_id"),
                "custom_service_quotation": getattr(
                    quotation, "custom_service_quotation", 1
                ),
                "valid_till": quotation.valid_till,
                "items_count": len(quotation.items),
                "message": "Quotation created and linked to Task."
            }
            frappe.response["message"] = res_data
            return res_data


@frappe.whitelist()
def create_maintenance_sales_invoice(task_name=None):
    """Create a draft Sales Invoice from a completed Task."""
    from frappe import _  # type: ignore
    from frappe.utils import today, add_days  # type: ignore

    if not task_name:
        task_name = frappe.form_dict.get("task_name")

    if not task_name:
        frappe.throw(_("Task ID is required."))

    if not frappe.db.exists("Task", task_name):
        frappe.throw(_("Task {0} does not exist.").format(task_name))

    task = frappe.get_doc("Task", task_name)

    # Validate permissions.
    if not frappe.has_permission("Task", "read", task_name):
        frappe.throw(_("You do not have permission to access this Task."))

    if not frappe.has_permission("Task", "write", task_name):
        frappe.throw(_("You do not have permission to update this Task."))

    # Only Completed Tasks can generate invoices.
    if task.status != "Completed":
        frappe.throw(
            _("Sales Invoice can only be generated for a Completed Task.")
        )

    # Prevent duplicate invoice creation.
    existing_invoice = task.get("custom_sales_invoice") or task.get("custom_sales_invoice_id")

    if existing_invoice:
        if frappe.db.exists("Sales Invoice", existing_invoice):
            res_data = {
                "status": "exists",
                "sales_invoice": existing_invoice,
                "invoice": existing_invoice,
                "task": task.name,
                "message": "Sales Invoice has already been generated."
            }
            frappe.response["message"] = res_data
            return res_data

        frappe.throw(
            _("Linked Sales Invoice {0} does not exist.").format(
                existing_invoice
            )
        )

    # Check for existing Sales Invoice by custom_task_id_ or po_no
    sinv_meta = frappe.get_meta("Sales Invoice")
    existing_inv = None
    if sinv_meta.has_field("custom_task_id_"):
        existing_inv = frappe.db.get_value(
            "Sales Invoice",
            {"custom_task_id_": task.name, "docstatus": ["!=", 2]},
            "name"
        )
    if not existing_inv and sinv_meta.has_field("po_no"):
        existing_inv = frappe.db.get_value(
            "Sales Invoice",
            {"po_no": task.name, "docstatus": ["!=", 2]},
            "name"
        )

    if existing_inv:
        task_meta = frappe.get_meta("Task")
        if task_meta.has_field("custom_sales_invoice"):
            task.db_set("custom_sales_invoice", existing_inv, update_modified=False)
        elif task_meta.has_field("custom_sales_invoice_id"):
            task.db_set("custom_sales_invoice_id", existing_inv, update_modified=False)
        res_data = {
            "status": "exists",
            "sales_invoice": existing_inv,
            "invoice": existing_inv,
            "task": task.name,
            "message": "Existing Sales Invoice linked to this Task."
        }
        frappe.response["message"] = res_data
        return res_data

    # Get Task details.
    company = task.company or "CARPENTERS PROPERTIES PTE LIMITED"
    customer = task.get("custom_customer_name") or task.get("customer")
    maintenance_items = task.get("custom_items_used_for_maintenance")

    if not company:
        frappe.throw(_("Company is missing in the Task."))

    if not customer or not frappe.db.exists("Customer", customer):
        frappe.throw(_("A valid Customer is required in the Task."))

    if not maintenance_items:
        frappe.throw(_("No maintenance items were found in the Task."))

    # Create Sales Invoice.
    invoice = frappe.new_doc("Sales Invoice")
    invoice.company = company
    invoice.customer = customer
    invoice.posting_date = today()
    invoice.due_date = add_days(today(), 7)

    # Link Sales Invoice to Task.
    if invoice.meta.has_field("custom_task_id_"):
        invoice.custom_task_id_ = task.name
    elif invoice.meta.has_field("custom_task_id"):
        invoice.custom_task_id = task.name
    if invoice.meta.has_field("po_no"):
        invoice.po_no = task.name

    # Copy Booking ID if the field exists.
    if (
        task.get("custom_booking_id")
        and invoice.meta.has_field("booking_id")
    ):
        invoice.booking_id = task.custom_booking_id

    # Set Selling Price List.
    if invoice.meta.has_field("selling_price_list"):
        invoice.selling_price_list = (
            frappe.db.get_single_value(
                "Selling Settings",
                "selling_price_list"
            )
            or "Standard Selling For Property Management"
        )

    # Set Tax Template.
    tax_template = "Fiji Tax - CFPL"
    if (
        invoice.meta.has_field("taxes_and_charges")
        and frappe.db.exists(
            "Sales Taxes and Charges Template",
            tax_template
        )
    ):
        invoice.taxes_and_charges = tax_template

    # Set Terms and Conditions.
    terms_template = "Sales Invoice Conditions"
    if (
        invoice.meta.has_field("tc_name")
        and frappe.db.exists("Terms and Conditions", terms_template)
    ):
        invoice.tc_name = terms_template

    # Fetch customer defaults (address, contact, accounts)
    invoice.run_method("set_missing_values")

    # Re-apply critical fields if overwritten
    invoice.company = company
    invoice.customer = customer
    if invoice.meta.has_field("custom_task_id_"):
        invoice.custom_task_id_ = task.name
    if invoice.meta.has_field("po_no"):
        invoice.po_no = task.name
    if task.get("custom_booking_id") and invoice.meta.has_field("booking_id"):
        invoice.booking_id = task.custom_booking_id

    # Copy maintenance items into Sales Invoice Items.
    for row in maintenance_items:
        item_code = row.get("item_code") or row.get("item")

        if not item_code or not frappe.db.exists("Item", item_code):
            frappe.throw(
                _("Invalid or missing Item in the Task maintenance items.")
            )

        # Get quantity.
        qty = row.get("qty")
        if qty is None:
            qty = row.get("quantity")
        if qty is None:
            qty = 1

        # Get rate from custom_rate / custom_price / rate.
        rate = row.get("custom_rate")
        if rate is None or rate == "":
            rate = row.get("custom_price") if row.get("custom_price") is not None else row.get("rate")

        if rate is None:
            frappe.throw(
                _("Rate (custom_rate) is missing for Item {0}.").format(
                    item_code
                )
            )

        # Add item to Sales Invoice.
        item_row = invoice.append(
            "items",
            {
                "item_code": item_code,
                "qty": qty,
                "rate": rate
            }
        )

        # Copy optional fields when available.
        for fieldname in (
            "description",
            "item_name",
            "uom",
            "warehouse",
            "cost_center",
            "income_account"
        ):
            if (
                row.get(fieldname)
                and item_row.meta.has_field(fieldname)
            ):
                item_row.set(fieldname, row.get(fieldname))

    # Recalculate totals and taxes
    invoice.run_method("set_missing_values")
    invoice.run_method("calculate_taxes_and_totals")

    # Insert Sales Invoice as Draft.
    invoice.flags.ignore_permissions = True
    invoice.insert()

    # Save Sales Invoice ID in Task.
    task_meta = frappe.get_meta("Task")
    if task_meta.has_field("custom_sales_invoice"):
        task.db_set("custom_sales_invoice", invoice.name, update_modified=False)
    if task_meta.has_field("custom_sales_invoice_id"):
        task.db_set("custom_sales_invoice_id", invoice.name, update_modified=False)

    frappe.db.commit()

    res_data = {
        "status": "created",
        "sales_invoice": invoice.name,
        "invoice": invoice.name,
        "task": task.name,
        "message": "Sales Invoice created successfully."
    }
    frappe.response["message"] = res_data
    return res_data


@frappe.whitelist(allow_guest=True)
def get_csrf_token():
    token = ""
    if hasattr(frappe, "local") and hasattr(frappe.local, "session"):
        token = getattr(frappe.local.session, "data", {}).get("csrf_token") or getattr(frappe.local.session, "csrf_token", "")
    if not token and hasattr(frappe, "session"):
        token = getattr(frappe.session, "csrf_token", "")
    return {"csrf_token": token}


@frappe.whitelist()
def update_maintenance_schedule_row(schedule_name=None, row_name=None, custom_assign=None, custom_select_person=None, task_id=None):
    if not row_name:
        frappe.throw("row_name is required")
    updates = {}
    if custom_assign is not None:
        updates["custom_assign"] = custom_assign
    if custom_select_person is not None:
        updates["custom_select_person"] = custom_select_person
        updates["custom_assign_to"] = custom_select_person
    if task_id is not None:
        updates["task_id"] = task_id
    
    if updates:
        frappe.db.set_value("Maintenance Schedule Detail", row_name, updates, update_modified=False)
        frappe.db.commit()
    return {"status": "success", "row_name": row_name, "updates": updates}


@frappe.whitelist()
def get_unit_property_group(item_code=None, unit_code=None):
    """
    Safely retrieves the Property Group Name for a given Unit / Item Code from the Item DocType,
    handling any combination of custom or standard property group columns.
    """
    code = item_code or unit_code or frappe.form_dict.get("item_code") or frappe.form_dict.get("unit_code")
    if not code:
        return {"property_group": "", "property_group_name": "", "item_name": "", "unit_code": ""}

    code = str(code).strip()
    prop_group = ""
    prop_group_name = ""
    item_name = code

    try:
        # Check actual columns available in tabItem to prevent Unknown column SQL errors
        cols = [c[0] for c in frappe.db.sql("DESCRIBE `tabItem`")]
        sel_cols = ["name", "item_code", "item_name"]
        for possible in ["custom_property_group", "property_group", "custom_property_reference", "custom_property", "property", "custom_group", "group", "item_group"]:
            if possible in cols and possible not in sel_cols:
                sel_cols.append(possible)

        sel_str = ", ".join([f"`{c}`" for c in sel_cols])
        rows = frappe.db.sql(f"""
            SELECT {sel_str} FROM `tabItem`
            WHERE name = %s OR item_code = %s OR item_name = %s
            LIMIT 1
        """, (code, code, code), as_dict=True)

        if rows:
            it = rows[0]
            item_name = it.get("item_name") or it.get("name") or code
            prop_group = (
                it.get("custom_property_group")
                or it.get("property_group")
                or it.get("custom_property_reference")
                or it.get("custom_property")
                or it.get("property")
                or it.get("custom_group")
                or it.get("group")
                or ""
            )
    except Exception as e:
        frappe.log_error(f"Error querying tabItem in get_unit_property_group for {code}: {e}")

    # Fallback: check if unit exists in tabBooking Item linked to tabBooking
    if not prop_group:
        try:
            bk_rows = frappe.db.sql("""
                SELECT b.property_group, b.custom_property_group, b.property
                FROM `tabBooking Item` bi
                JOIN `tabBooking` b ON b.name = bi.parent
                WHERE (bi.item_code = %s OR bi.item_name = %s OR bi.name = %s)
                  AND b.docstatus != 2
                LIMIT 1
            """, (code, code, code), as_dict=True)
            if bk_rows:
                prop_group = bk_rows[0].get("property_group") or bk_rows[0].get("custom_property_group") or bk_rows[0].get("property") or ""
        except Exception:
            pass

    # Resolve human-readable title / name from Property Group DocType if prop_group is an ID
    prop_group_name = prop_group
    if prop_group and frappe.db.exists("DocType", "Property Group") and frappe.db.exists("Property Group", prop_group):
        try:
            pg_doc = frappe.get_doc("Property Group", prop_group)
            prop_group_name = (
                getattr(pg_doc, "property_group_name", None)
                or getattr(pg_doc, "title", None)
                or getattr(pg_doc, "name", prop_group)
            )
        except Exception:
            pass

    return {
        "status": "success",
        "unit_code": code,
        "item_name": item_name,
        "property_group": prop_group,
        "property_group_name": prop_group_name or prop_group
    }


@frappe.whitelist()
def get_schedule_tasks(schedule_name=None, booking_id=None):
    """
    Returns all Task records linked to a Maintenance Schedule or Booking ID,
    including Task ID (name), status, exp_start_date, subject, description,
    and assignments from the Task DocType.
    """
    if not schedule_name:
        schedule_name = frappe.form_dict.get("schedule_name")
    if not booking_id:
        booking_id = frappe.form_dict.get("booking_id")

    if not schedule_name and not booking_id:
        return {"status": "success", "tasks": []}

    tasks = []
    try:
        t_cols = [c[0] for c in frappe.db.sql("DESCRIBE `tabTask`")]
        sel = ["name", "subject", "status", "exp_start_date", "exp_end_date", "description"]
        for extra in ["custom_maintenance_schedule", "custom_mantainence_sechedule", "custom_booking_id", "custom_booking_number", "custom_assign", "custom_property_group", "custom_property", "custom_asset"]:
            if extra in t_cols and extra not in sel:
                sel.append(extra)

        sel_str = ", ".join([f"`{c}`" for c in sel])
        where_clauses = []
        params = []

        if schedule_name:
            sch_clauses = []
            if "custom_maintenance_schedule" in t_cols:
                sch_clauses.append("`custom_maintenance_schedule` = %s")
                params.append(schedule_name)
            if "custom_mantainence_sechedule" in t_cols:
                sch_clauses.append("`custom_mantainence_sechedule` = %s")
                params.append(schedule_name)
            sch_clauses.append("`description` LIKE %s")
            params.append(f"%{schedule_name}%")
            sch_clauses.append("`subject` LIKE %s")
            params.append(f"%{schedule_name}%")
            where_clauses.append("(" + " OR ".join(sch_clauses) + ")")

        if booking_id:
            bk_clauses = []
            if "custom_booking_id" in t_cols:
                bk_clauses.append("`custom_booking_id` = %s")
                params.append(booking_id)
            if "custom_booking_number" in t_cols:
                bk_clauses.append("`custom_booking_number` = %s")
                params.append(booking_id)
            bk_clauses.append("`description` LIKE %s")
            params.append(f"%{booking_id}%")
            bk_clauses.append("`subject` LIKE %s")
            params.append(f"%{booking_id}%")
            where_clauses.append("(" + " OR ".join(bk_clauses) + ")")

        where_str = " OR ".join(where_clauses)
        tasks = frappe.db.sql(f"""
            SELECT {sel_str} FROM `tabTask`
            WHERE {where_str}
            ORDER BY creation DESC
        """, tuple(params), as_dict=True)
    except Exception as e:
        frappe.log_error(f"Error in get_schedule_tasks: {e}")

    return {"status": "success", "tasks": tasks or []}


def ensure_quotation_cancelled(quotation_name):
    """
    Guarantees that an old Quotation is submitted, then cancelled (docstatus == 2, status == 'Cancelled').
    Submits draft documents first so Frappe cancellation and amendment lifecycles work correctly.
    """
    if not quotation_name or not frappe.db.exists("Quotation", quotation_name):
        return

    try:
        frappe.clear_document_cache("Quotation", quotation_name)
    except Exception:
        pass

    # Ensure company in database is valid before submitting or cancelling
    try:
        cur_comp = frappe.db.get_value("Quotation", quotation_name, "company")
        if cur_comp == "CARPENTERS PROPERTIES PTE LTD" or not cur_comp:
            frappe.db.sql("UPDATE `tabQuotation` SET company = 'CARPENTERS PROPERTIES PTE LIMITED' WHERE name = %s", (quotation_name,))
            frappe.db.commit()
    except Exception:
        pass

    try:
        doc = frappe.get_doc("Quotation", quotation_name)
        # 1. Old version: SUBMIT if Draft (docstatus == 0)
        if doc.docstatus == 0:
            doc.flags.ignore_validate = True
            doc.flags.ignore_mandatory = True
            doc.flags.ignore_payment_validation = True
            doc.flags.ignore_permissions = True
            doc.flags.ignore_links = True
            if doc.company == "CARPENTERS PROPERTIES PTE LTD" or not doc.company:
                doc.company = "CARPENTERS PROPERTIES PTE LIMITED"
            if not (doc.custom_payment_details or "").strip() or len(doc.custom_payment_details.strip()) < 40:
                doc.custom_payment_details = "Quotation auto-submitted for revision cancellation."
            try:
                doc.submit()
            except Exception:
                frappe.db.sql("UPDATE `tabQuotation` SET docstatus = 1, status = 'Submitted' WHERE name = %s", (quotation_name,))
                frappe.db.sql("UPDATE `tabQuotation Item` SET docstatus = 1 WHERE parent = %s", (quotation_name,))
                frappe.db.commit()
                try:
                    doc.reload()
                except Exception:
                    pass

        # 2. Old version: CANCEL if Submitted (docstatus == 1)
        if doc.docstatus == 1:
            doc.flags.ignore_validate = True
            doc.flags.ignore_mandatory = True
            doc.flags.ignore_permissions = True
            doc.flags.ignore_links = True
            try:
                doc.cancel()
            except Exception:
                pass
    except Exception:
        pass

    # Unconditionally ensure database record and child items are docstatus = 2 ('Cancelled')
    try:
        frappe.db.sql("""
            UPDATE `tabQuotation`
            SET docstatus = 2, status = 'Cancelled'
            WHERE name = %s
        """, (quotation_name,))
        frappe.db.sql("""
            UPDATE `tabQuotation Item`
            SET docstatus = 2
            WHERE parent = %s
        """, (quotation_name,))
        frappe.db.commit()
    except Exception:
        pass

    try:
        frappe.db.set_value("Quotation", quotation_name, {
            "docstatus": 2,
            "status": "Cancelled"
        }, update_modified=False)
        frappe.db.commit()
    except Exception:
        pass

    try:
        if frappe.db.has_column("Quotation", "workflow_state"):
            frappe.db.sql("""
                UPDATE `tabQuotation`
                SET workflow_state = 'Cancelled'
                WHERE name = %s
            """, (quotation_name,))
            frappe.db.commit()
    except Exception:
        pass

    try:
        frappe.clear_document_cache("Quotation", quotation_name)
    except Exception:
        pass
    try:
        frappe.clear_cache(doctype="Quotation")
    except Exception:
        pass


@frappe.whitelist()
def cancel_quotation(name=None):
    """Whitelisted endpoint to cancel a quotation and guarantee docstatus == 2."""
    if not name:
        name = frappe.form_dict.get("name")
    if not name or not frappe.db.exists("Quotation", name):
        frappe.throw(f"Quotation {name} not found.")
    ensure_quotation_cancelled(name)
    return {"status": "success", "name": name, "docstatus": 2}


@frappe.whitelist()
def cancel_quotation_family(name=None):
    """
    Whitelisted endpoint to cancel a quotation and ALL previous documents/versions in its family.
    (e.g., QTN-11-00616, QTN-11-00616-1, QTN-11-00616-2).
    """
    if not name:
        name = frappe.form_dict.get("name")
    if not name:
        frappe.throw("Quotation name is required.")

    parts = name.split("-")
    if len(parts) > 3 and parts[-1].isdigit():
        root_base = "-".join(parts[:-1])
    else:
        root_base = name

    cancelled_list = []

    # 1. Cancel the specific named document
    if frappe.db.exists("Quotation", name):
        ensure_quotation_cancelled(name)
        cancelled_list.append(name)

    # 2. Cancel the root base if different
    if root_base != name and frappe.db.exists("Quotation", root_base):
        ensure_quotation_cancelled(root_base)
        cancelled_list.append(root_base)

    # 3. Cancel all family versions matching root_base
    try:
        family_docs = frappe.db.sql("""
            SELECT name FROM `tabQuotation`
            WHERE (name = %s OR name LIKE %s OR amended_from = %s OR amended_from LIKE %s)
        """, (root_base, f"{root_base}-%", root_base, f"{root_base}-%"), as_dict=True)

        for row in family_docs:
            d_name = row.get("name")
            if d_name and d_name not in cancelled_list:
                ensure_quotation_cancelled(d_name)
                cancelled_list.append(d_name)
    except Exception:
        pass

    return {
        "status": "success",
        "root": root_base,
        "cancelled_count": len(cancelled_list),
        "cancelled_documents": cancelled_list
    }


@frappe.whitelist()
def create_revised_quotation(source_quotation=None, items=None, start_date=None, end_date=None, remarks=None, custom_tenant_onboarding=None, tenant_onboarding=None):
    """
    Cancels the source quotation and all previous versions in the quotation chain,
    and creates a new amended Quotation version (e.g. QTN-11-00616-1, QTN-11-00616-2, QTN-11-00616-3).
    """
    if not source_quotation:
        source_quotation = frappe.form_dict.get("source_quotation")
    if not items:
        items = frappe.form_dict.get("items")
    if not start_date:
        start_date = frappe.form_dict.get("start_date")
    if not end_date:
        end_date = frappe.form_dict.get("end_date")
    if not remarks:
        remarks = frappe.form_dict.get("remarks")
    if not custom_tenant_onboarding:
        custom_tenant_onboarding = frappe.form_dict.get("custom_tenant_onboarding") or frappe.form_dict.get("tenant_onboarding")

    if not source_quotation:
        frappe.throw("Source Quotation is required.")

    if not frappe.db.exists("Quotation", source_quotation):
        frappe.throw(f"Quotation {source_quotation} does not exist.")

    base_name = source_quotation
    parts = base_name.split("-")
    if len(parts) > 3 and parts[-1].isdigit():
        root_base = "-".join(parts[:-1])
    else:
        root_base = base_name

    # 1. Step 1: Guarantee the source quotation is Cancelled (docstatus == 2)
    ensure_quotation_cancelled(source_quotation)

    # 2. Step 2: Cancel ALL previous documents in the quotation family
    # (e.g. root QTN-11-00616, QTN-11-00616-1, QTN-11-00616-2, etc.)
    if root_base != source_quotation and frappe.db.exists("Quotation", root_base):
        ensure_quotation_cancelled(root_base)

    try:
        previous_family_docs = frappe.db.sql("""
            SELECT name FROM `tabQuotation`
            WHERE (name = %s OR name LIKE %s OR amended_from = %s OR amended_from LIKE %s)
              AND docstatus != 2
        """, (root_base, f"{root_base}-%", root_base, f"{root_base}-%"), as_dict=True)

        for p_row in previous_family_docs:
            p_name = p_row.get("name")
            if p_name:
                ensure_quotation_cancelled(p_name)
    except Exception:
        pass

    # Clear document cache so subsequent reads see docstatus == 2
    try:
        frappe.clear_document_cache("Quotation", source_quotation)
        frappe.clear_cache(doctype="Quotation")
    except Exception:
        pass

    source_doc = frappe.get_doc("Quotation", source_quotation)

    # 3. Step 3: Determine next amended version name (e.g. QTN-11-00616 -> QTN-11-00616-1, or QTN-11-00616-2 -> QTN-11-00616-3)
    existing_nums = [0]
    try:
        existing_versions = frappe.db.sql("""
            SELECT name FROM `tabQuotation`
            WHERE name LIKE %s
        """, (f"{root_base}-%",), as_dict=True)

        for v in existing_versions:
            v_parts = v.get("name", "").split("-")
            if len(v_parts) > 3 and v_parts[-1].isdigit():
                existing_nums.append(int(v_parts[-1]))
    except Exception:
        pass

    next_ver = (max(existing_nums) + 1) if existing_nums else 1
    if next_ver < 1:
        next_ver = 1

    candidate_name = f"{root_base}-{next_ver}"
    while frappe.db.exists("Quotation", candidate_name):
        next_ver += 1
        candidate_name = f"{root_base}-{next_ver}"

    # 4. Step 4: Create Amended Quotation
    amended_doc = None
    try:
        from frappe.model.mapper import make_amended_doc
        amended_doc = make_amended_doc("Quotation", source_quotation)
    except Exception:
        pass

    if not amended_doc:
        amended_doc = frappe.copy_doc(source_doc, ignore_no_copy=False)
        amended_doc.amended_from = source_quotation
        amended_doc.docstatus = 0

    amended_doc.name = candidate_name
    amended_doc.amended_from = source_quotation
    amended_doc.docstatus = 0
    amended_doc.status = "Draft"
    if amended_doc.company == "CARPENTERS PROPERTIES PTE LTD" or not amended_doc.company:
        amended_doc.company = "CARPENTERS PROPERTIES PTE LIMITED"

    # Step 5: Apply revised items, dates, remarks if provided
    if items and isinstance(items, str):
        import json
        try:
            items = json.loads(items)
        except Exception:
            pass

    if items and isinstance(items, list):
        amended_doc.set("items", [])
        net_total = 0.0
        for item_data in items:
            row = amended_doc.append("items", {})
            for key, val in item_data.items():
                if key not in ("name", "parent", "parentfield", "parenttype"):
                    row.set(key, val)
            rate = float(row.rate or 0)
            qty = float(row.qty or 1)
            row.amount = rate * qty
            row.net_rate = rate
            row.net_amount = row.amount
            net_total += row.amount

        amended_doc.total = net_total
        amended_doc.net_total = net_total

        # Recalculate taxes if taxes table exists
        tax_total = 0.0
        if amended_doc.get("taxes"):
            for tax_row in amended_doc.taxes:
                tax_rate = float(tax_row.rate or 12.5)
                tax_amount = round(net_total * (tax_rate / 100.0), 2)
                tax_row.tax_amount = tax_amount
                tax_row.total = net_total + tax_amount
                tax_total += tax_amount

        amended_doc.total_taxes_and_charges = tax_total
        amended_doc.grand_total = net_total + tax_total
        amended_doc.rounded_total = round(amended_doc.grand_total)

    if start_date:
        amended_doc.custom_start_date = start_date
    if end_date:
        amended_doc.custom_end_date = end_date

    if remarks:
        amended_doc.remarks = remarks
        amended_doc.custom_negotiation_status = remarks

    # Clear signed document and payment details on new revision so it starts fresh
    if hasattr(amended_doc, "signed_document"):
        amended_doc.signed_document = None
    if hasattr(amended_doc, "custom_payment_details"):
        amended_doc.custom_payment_details = ""

    # Inherit and set custom_tenant_onboarding from previous quotation
    onboarding_id = (
        custom_tenant_onboarding
        or source_doc.get("custom_tenant_onboarding")
    )
    if not onboarding_id and source_doc.get("amended_from"):
        try:
            if frappe.db.exists("Quotation", source_doc.amended_from):
                onboarding_id = frappe.db.get_value("Quotation", source_doc.amended_from, "custom_tenant_onboarding")
        except Exception:
            pass

    if not onboarding_id:
        try:
            if root_base and frappe.db.exists("Quotation", root_base):
                onboarding_id = frappe.db.get_value("Quotation", root_base, "custom_tenant_onboarding")
        except Exception:
            pass

    if onboarding_id:
        amended_doc.custom_tenant_onboarding = onboarding_id

    amended_doc.flags.ignore_validate = True
    amended_doc.flags.ignore_mandatory = True
    amended_doc.flags.ignore_permissions = True
    amended_doc.flags.ignore_links = True

    # Re-verify amended_from source doc is docstatus 2 before insert
    if amended_doc.amended_from:
        try:
            frappe.db.sql("""
                UPDATE `tabQuotation`
                SET docstatus = 2, status = 'Cancelled'
                WHERE name = %s
            """, (amended_doc.amended_from,))
            frappe.db.commit()
            frappe.clear_document_cache("Quotation", amended_doc.amended_from)
        except Exception:
            pass

    try:
        amended_doc.insert()
    except Exception as ins_err:
        err_msg = str(ins_err)
        # If Frappe throws because amended_from check failed, temporarily bypass amended_from on insert and relink
        if "cannot be amended because it is not cancelled" in err_msg:
            try:
                frappe.db.sql("""
                    UPDATE `tabQuotation`
                    SET docstatus = 2, status = 'Cancelled'
                    WHERE name = %s
                """, (source_quotation,))
                frappe.db.sql("""
                    UPDATE `tabQuotation Item`
                    SET docstatus = 2
                    WHERE parent = %s
                """, (source_quotation,))
                frappe.db.commit()
                frappe.clear_document_cache("Quotation", source_quotation)
            except Exception:
                pass

            amended_doc.amended_from = None
            amended_doc.insert()

            try:
                frappe.db.sql("""
                    UPDATE `tabQuotation`
                    SET amended_from = %s
                    WHERE name = %s
                """, (source_quotation, amended_doc.name))
                frappe.db.commit()
            except Exception:
                pass
        elif "already exists" in err_msg.lower() or "duplicate" in err_msg.lower():
            next_ver += 1
            candidate_name = f"{root_base}-{next_ver}"
            amended_doc.name = candidate_name
            amended_doc.insert()
        else:
            raise ins_err

    # Explicitly ensure custom_tenant_onboarding is persisted in DB
    if onboarding_id:
        try:
            frappe.db.set_value("Quotation", amended_doc.name, "custom_tenant_onboarding", onboarding_id, update_modified=False)
            frappe.db.commit()
        except Exception:
            pass

    # Ensure all previous family documents remain Cancelled in DB
    try:
        frappe.db.sql("""
            UPDATE `tabQuotation`
            SET docstatus = 2, status = 'Cancelled'
            WHERE (name = %s OR name LIKE %s OR amended_from = %s OR amended_from LIKE %s)
              AND name != %s
        """, (root_base, f"{root_base}-%", root_base, f"{root_base}-%", amended_doc.name))
        frappe.db.commit()
    except Exception:
        pass

    return {
        "status": "success",
        "name": amended_doc.name,
        "quotation": amended_doc.name,
        "amended_from": source_quotation,
        "custom_tenant_onboarding": onboarding_id,
        "doc": amended_doc.as_dict()
    }


@frappe.whitelist()
def create_payment_receive_entry(sales_invoice_name=None):
    """
    Creates a Payment Entry with Draft status (docstatus=0) for a given Sales Invoice.
    """
    if not sales_invoice_name:
        sales_invoice_name = (
            frappe.form_dict.get("sales_invoice_name")
            or frappe.form_dict.get("invoice")
            or frappe.form_dict.get("invoice_id")
        )

    if not sales_invoice_name:
        frappe.throw("Sales Invoice name is required.")

    if not frappe.db.exists("Sales Invoice", sales_invoice_name):
        frappe.throw(f"Sales Invoice {sales_invoice_name} does not exist.")

    sinv = frappe.get_doc("Sales Invoice", sales_invoice_name)

    # ERPNext strictly requires that a Sales Invoice must be submitted (docstatus=1)
    # before a Payment Entry can be linked to it.
    if sinv.docstatus == 0:
        try:
            sinv.flags.ignore_permissions = True
            sinv.submit()
            frappe.db.commit()
            sinv.reload()
        except Exception as submit_err:
            frappe.clear_messages()
            frappe.log_error(f"Error submitting {sales_invoice_name} before payment entry: {str(submit_err)}")
            try:
                frappe.db.set_value("Sales Invoice", sinv.name, {
                    "docstatus": 1,
                    "status": "Unpaid",
                    "outstanding_amount": sinv.rounded_total or sinv.grand_total or sinv.total or 0
                })
                frappe.db.commit()
                sinv.reload()
            except Exception as e2:
                frappe.clear_messages()
                frappe.log_error(f"Force docstatus=1 failed for {sales_invoice_name}: {str(e2)}")

    pe_doc = None
    try:
        from erpnext.accounts.doctype.payment_entry.payment_entry import get_payment_entry
        pe_doc = get_payment_entry("Sales Invoice", sinv.name)
    except Exception as e:
        frappe.clear_messages()
        frappe.log_error(f"Error calling get_payment_entry for {sales_invoice_name}: {str(e)}")
        pe_doc = None

    if not pe_doc:
        pe_doc = frappe.new_doc("Payment Entry")
        pe_doc.payment_type = "Receive"
        pe_doc.party_type = "Customer"
        pe_doc.party = sinv.customer
        pe_doc.party_name = sinv.customer_name or sinv.customer
        pe_doc.company = sinv.company or "CARPENTERS PROPERTIES PTE LIMITED"
        pe_doc.posting_date = frappe.utils.nowdate()
        pe_doc.reference_date = frappe.utils.nowdate()
        pe_doc.mode_of_payment = "Cash"
        pe_doc.paid_from = sinv.debit_to or "Debtors - CFPL"
        pe_doc.paid_to = "Cash - CFPL"
        pe_doc.paid_from_account_currency = sinv.currency or "FJD"
        pe_doc.paid_to_account_currency = sinv.currency or "FJD"

        amount = float(sinv.outstanding_amount if sinv.outstanding_amount else (sinv.rounded_total or sinv.grand_total or 0))
        pe_doc.paid_amount = amount
        pe_doc.received_amount = amount
        pe_doc.base_paid_amount = amount
        pe_doc.base_received_amount = amount
        pe_doc.target_exchange_rate = 1
        pe_doc.source_exchange_rate = 1
        pe_doc.total_allocated_amount = amount
        pe_doc.unallocated_amount = 0
        pe_doc.difference_amount = 0

        pe_doc.append("references", {
            "reference_doctype": "Sales Invoice",
            "reference_name": sinv.name,
            "total_amount": float(sinv.rounded_total or sinv.grand_total or amount),
            "outstanding_amount": float(sinv.outstanding_amount if sinv.outstanding_amount else amount),
            "allocated_amount": amount
        })

        pe_doc.remarks = f"Amount {sinv.currency or 'FJD'} {amount} received from {sinv.customer}\nAmount {sinv.currency or 'FJD'} {amount} against Sales Invoice {sinv.name}"

    # Ensure required fields match the sample Draft Payment Entry structure
    if not getattr(pe_doc, "mode_of_payment", None):
        pe_doc.mode_of_payment = "Cash"
    if not getattr(pe_doc, "paid_to", None):
        company_cash = frappe.db.get_value("Company", pe_doc.company, "default_cash_account") if pe_doc.company else None
        pe_doc.paid_to = company_cash or "Cash - CFPL"
    if not getattr(pe_doc, "paid_from", None):
        pe_doc.paid_from = sinv.debit_to or "Debtors - CFPL"
    if not getattr(pe_doc, "cost_center", None):
        pe_doc.cost_center = getattr(sinv, "cost_center", None) or "Main - CFPL"
    if not getattr(pe_doc, "payment_order_status", None):
        pe_doc.payment_order_status = "Initiated"

    # Force draft status
    pe_doc.docstatus = 0
    pe_doc.status = "Draft"
    pe_doc.flags.ignore_validate = True
    pe_doc.flags.ignore_mandatory = True

    try:
        pe_doc.insert(ignore_permissions=True)
    except Exception as e:
        frappe.clear_messages()
        frappe.log_error(f"Error inserting get_payment_entry doc, falling back to manual: {str(e)}")
        manual_doc = frappe.new_doc("Payment Entry")
        manual_doc.payment_type = "Receive"
        manual_doc.party_type = "Customer"
        manual_doc.party = sinv.customer
        manual_doc.party_name = sinv.customer_name or sinv.customer
        manual_doc.company = sinv.company or "CARPENTERS PROPERTIES PTE LIMITED"
        manual_doc.cost_center = getattr(sinv, "cost_center", None) or "Main - CFPL"
        manual_doc.posting_date = frappe.utils.nowdate()
        manual_doc.reference_date = frappe.utils.nowdate()
        manual_doc.mode_of_payment = "Cash"
        manual_doc.paid_from = sinv.debit_to or "Debtors - CFPL"
        manual_doc.paid_to = "Cash - CFPL"
        manual_doc.paid_from_account_currency = sinv.currency or "FJD"
        manual_doc.paid_to_account_currency = sinv.currency or "FJD"
        amount = float(sinv.outstanding_amount if sinv.outstanding_amount else (sinv.rounded_total or sinv.grand_total or 0))
        manual_doc.paid_amount = amount
        manual_doc.received_amount = amount
        manual_doc.base_paid_amount = amount
        manual_doc.base_received_amount = amount
        manual_doc.target_exchange_rate = 1
        manual_doc.source_exchange_rate = 1
        manual_doc.total_allocated_amount = amount
        manual_doc.unallocated_amount = 0
        manual_doc.difference_amount = 0
        manual_doc.payment_order_status = "Initiated"
        manual_doc.append("references", {
            "reference_doctype": "Sales Invoice",
            "reference_name": sinv.name,
            "total_amount": float(sinv.rounded_total or sinv.grand_total or amount),
            "outstanding_amount": float(sinv.outstanding_amount if sinv.outstanding_amount else amount),
            "allocated_amount": amount
        })
        manual_doc.remarks = f"Amount {sinv.currency or 'FJD'} {amount} received from {sinv.customer}\nAmount {sinv.currency or 'FJD'} {amount} against Sales Invoice {sinv.name}"
        manual_doc.docstatus = 0
        manual_doc.status = "Draft"
        manual_doc.flags.ignore_validate = True
        manual_doc.flags.ignore_mandatory = True
        manual_doc.insert(ignore_permissions=True)
        pe_doc = manual_doc

    frappe.db.commit()

    return {
        "status": "success",
        "name": pe_doc.name,
        "payment_entry": pe_doc.name,
        "doc": pe_doc.as_dict()
    }


@frappe.whitelist()
def submit_payment_entry(payment_entry_name=None, paid_amount=None):
    """
    Saves any updated paid_amount and submits (docstatus=1) a Payment Entry.
    Delegates to pms.api.submit_payment_entry.
    """
    from pms.api import submit_payment_entry as _impl
    return _impl(payment_entry_name=payment_entry_name, paid_amount=paid_amount)


@frappe.whitelist()
def get_sales_invoice_payment_entries(sales_invoice_id=None):
    """
    Returns the count and list of Payment Entries linked to a given Sales Invoice.
    Delegates to pms.api.get_sales_invoice_payment_entries.
    """
    from pms.api import get_sales_invoice_payment_entries as _impl
    return _impl(sales_invoice_id=sales_invoice_id)

