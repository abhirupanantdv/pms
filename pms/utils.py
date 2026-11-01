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
            onboarding_val = (
                frappe.db.get_value("Quotation", parent_name, "custom_tenant_onboarding")
                or frappe.db.get_value("Quotation", parent_name, "tenant_onboarding")
            )
            if onboarding_val:
                doc.custom_tenant_onboarding = onboarding_val
                if hasattr(doc, "tenant_onboarding"):
                    doc.tenant_onboarding = onboarding_val


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
def create_revised_quotation(source_quotation=None, items=None, start_date=None, end_date=None, remarks=None, custom_tenant_onboarding=None, tenant_onboarding=None):
    """
    Submits and cancels the source quotation (if not already cancelled),
    and creates an amended Quotation version (e.g. QTN-10-00531-1, QTN-10-00531-2).
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

    source_doc = frappe.get_doc("Quotation", source_quotation)

    # 1. Step 1: Submit source_doc if it is Draft (docstatus == 0)
    if source_doc.docstatus == 0:
        source_doc.flags.ignore_validate = True
        source_doc.flags.ignore_mandatory = True
        source_doc.flags.ignore_payment_validation = True

        if not (source_doc.custom_payment_details or "").strip():
            source_doc.custom_payment_details = "Quotation submitted automatically to allow revision and amendment."
        
        try:
            source_doc.submit()
        except Exception:
            frappe.db.set_value("Quotation", source_doc.name, {"docstatus": 1, "status": "Submitted"})
            source_doc.reload()

    # 2. Step 2: Cancel source_doc if it is Submitted (docstatus == 1)
    if source_doc.docstatus == 1:
        source_doc.flags.ignore_validate = True
        source_doc.flags.ignore_mandatory = True
        try:
            source_doc.cancel()
        except Exception:
            frappe.db.set_value("Quotation", source_doc.name, {"docstatus": 2, "status": "Cancelled"})
            source_doc.reload()

    # Verify source_doc is now Cancelled (docstatus == 2)
    if source_doc.docstatus != 2:
        frappe.throw(f"Could not cancel source Quotation {source_quotation}. Current docstatus: {source_doc.docstatus}")

    # 3. Step 3: Create Amended Quotation
    from frappe.model.mapper import make_amended_doc
    try:
        amended_doc = make_amended_doc("Quotation", source_doc.name)
    except Exception:
        amended_doc = frappe.copy_doc(source_doc, ignore_no_copy=False)
        amended_doc.amended_from = source_doc.name
        amended_doc.docstatus = 0

    amended_doc.amended_from = source_doc.name
    amended_doc.docstatus = 0
    amended_doc.status = "Draft"

    # Compute next amended version name (e.g. QTN-10-00531 -> QTN-10-00531-2 or QTN-10-00531-1)
    base_name = source_doc.name
    parts = base_name.split("-")
    if len(parts) > 3 and parts[-1].isdigit():
        root_base = "-".join(parts[:-1])
        next_ver = int(parts[-1]) + 1
    else:
        root_base = base_name
        next_ver = 1

    candidate_name = f"{root_base}-{next_ver}"
    while frappe.db.exists("Quotation", candidate_name):
        next_ver += 1
        candidate_name = f"{root_base}-{next_ver}"

    amended_doc.name = candidate_name

    # 4. Step 4: Apply revised items, dates, remarks if provided
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

    # Clear signed document and payment details on new revision so it must be signed/paid anew
    if hasattr(amended_doc, "signed_document"):
        amended_doc.signed_document = None
    if hasattr(amended_doc, "custom_payment_details"):
        amended_doc.custom_payment_details = ""

    # Inherit and set custom_tenant_onboarding from previous quotation
    onboarding_id = (
        custom_tenant_onboarding
        or source_doc.get("custom_tenant_onboarding")
        or source_doc.get("tenant_onboarding")
    )
    if not onboarding_id and source_doc.get("amended_from"):
        try:
            if frappe.db.exists("Quotation", source_doc.amended_from):
                onboarding_id = (
                    frappe.db.get_value("Quotation", source_doc.amended_from, "custom_tenant_onboarding")
                    or frappe.db.get_value("Quotation", source_doc.amended_from, "tenant_onboarding")
                )
        except Exception:
            pass

    if not onboarding_id:
        try:
            if root_base and frappe.db.exists("Quotation", root_base):
                onboarding_id = (
                    frappe.db.get_value("Quotation", root_base, "custom_tenant_onboarding")
                    or frappe.db.get_value("Quotation", root_base, "tenant_onboarding")
                )
        except Exception:
            pass

    if onboarding_id:
        amended_doc.custom_tenant_onboarding = onboarding_id
        if hasattr(amended_doc, "tenant_onboarding"):
            amended_doc.tenant_onboarding = onboarding_id

    amended_doc.flags.ignore_validate = True
    amended_doc.flags.ignore_mandatory = True
    amended_doc.insert()

    # Explicitly ensure custom_tenant_onboarding is persisted in DB
    if onboarding_id:
        try:
            frappe.db.set_value("Quotation", amended_doc.name, "custom_tenant_onboarding", onboarding_id, update_modified=False)
        except Exception:
            pass
        try:
            if frappe.db.has_column("Quotation", "tenant_onboarding"):
                frappe.db.set_value("Quotation", amended_doc.name, "tenant_onboarding", onboarding_id, update_modified=False)
        except Exception:
            pass
        frappe.db.commit()

    return {
        "status": "success",
        "name": amended_doc.name,
        "quotation": amended_doc.name,
        "amended_from": source_doc.name,
        "custom_tenant_onboarding": onboarding_id,
        "doc": amended_doc.as_dict()
    }

