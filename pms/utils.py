import frappe  # type: ignore
from frappe.utils import validate_phone_number  # type: ignore

def validate_tenant_onboarding_phone(doc, method):
    if doc.contact_number:
        if not validate_phone_number(doc.contact_number):
            frappe.throw(
                msg=frappe._("Phone Number {0} set in field contact_number is not valid.").format(doc.contact_number),
                title=frappe._("Invalid Phone Number")
            )


def validate_quotation_payment_details(doc, method=None):
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

