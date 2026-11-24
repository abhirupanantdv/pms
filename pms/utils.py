import frappe  # type: ignore
import json
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
def update_maintenance_schedule_row(schedule_name=None, row_name=None, custom_assign=None, custom_select_person=None, task_id=None, custom_task_id=None):
    if not row_name:
        frappe.throw("row_name is required")
    updates = {}
    if custom_assign is not None:
        updates["custom_assign"] = custom_assign
    if custom_select_person is not None:
        updates["custom_select_person"] = custom_select_person
        updates["custom_assign_to"] = custom_select_person

    t_id = custom_task_id if custom_task_id is not None else task_id
    if t_id is not None:
        updates["custom_task_id"] = t_id
        updates["task_id"] = t_id

    # 1. Direct DB update using SQL to bypass submitted docstatus lock on Maintenance Schedule
    try:
        cols = [c[0] for c in frappe.db.sql("DESCRIBE `tabMaintenance Schedule Detail`")]
        for k, v in updates.items():
            if k in cols:
                frappe.db.sql(f"UPDATE `tabMaintenance Schedule Detail` SET `{k}` = %s WHERE name = %s", (v, row_name))
        frappe.db.commit()
    except Exception as sql_e:
        frappe.log_error(f"SQL update in update_maintenance_schedule_row: {sql_e}")

    # 2. Also try frappe.db.set_value
    try:
        frappe.db.set_value("Maintenance Schedule Detail", row_name, updates, update_modified=False)
        frappe.db.commit()
    except Exception:
        pass

    if schedule_name:
        if t_id:
            try:
                parent_cols = [c[0] for c in frappe.db.sql("DESCRIBE `tabMaintenance Schedule`")]
                if "custom_task_id" in parent_cols:
                    frappe.db.sql("UPDATE `tabMaintenance Schedule` SET `custom_task_id` = %s WHERE name = %s", (t_id, schedule_name))
                if "task_id" in parent_cols:
                    frappe.db.sql("UPDATE `tabMaintenance Schedule` SET `task_id` = %s WHERE name = %s", (t_id, schedule_name))
                frappe.db.commit()
            except Exception as p_e:
                frappe.log_error(f"SQL update parent in update_maintenance_schedule_row: {p_e}")

            try:
                frappe.db.set_value("Maintenance Schedule", schedule_name, {"custom_task_id": t_id}, update_modified=False)
                frappe.db.commit()
            except Exception:
                pass

        try:
            frappe.clear_document_cache("Maintenance Schedule", schedule_name)
        except Exception:
            pass

    return {"status": "success", "row_name": row_name, "updates": updates}


@frappe.whitelist()
def update_maintenance_schedule(schedule_name=None, custom_task_id=None, task_id=None):
    if not schedule_name:
        schedule_name = frappe.form_dict.get("schedule_name")
    t_id = custom_task_id or task_id or frappe.form_dict.get("custom_task_id") or frappe.form_dict.get("task_id")
    if not schedule_name:
        frappe.throw("schedule_name is required")

    if t_id:
        try:
            parent_cols = [c[0] for c in frappe.db.sql("DESCRIBE `tabMaintenance Schedule`")]
            if "custom_task_id" in parent_cols:
                frappe.db.sql("UPDATE `tabMaintenance Schedule` SET `custom_task_id` = %s WHERE name = %s", (t_id, schedule_name))
            if "task_id" in parent_cols:
                frappe.db.sql("UPDATE `tabMaintenance Schedule` SET `task_id` = %s WHERE name = %s", (t_id, schedule_name))
            frappe.db.commit()
        except Exception as sql_e:
            frappe.log_error(f"SQL update in update_maintenance_schedule: {sql_e}")

        try:
            frappe.db.set_value("Maintenance Schedule", schedule_name, {"custom_task_id": t_id}, update_modified=False)
            frappe.db.commit()
        except Exception:
            pass

        try:
            frappe.clear_document_cache("Maintenance Schedule", schedule_name)
        except Exception:
            pass

    return {"status": "success", "schedule_name": schedule_name, "custom_task_id": t_id}


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

