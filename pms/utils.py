import frappe  # type: ignore
from frappe.utils import validate_phone_number  # type: ignore

def validate_tenant_onboarding_phone(doc, method):
    if doc.contact_number:
        if not validate_phone_number(doc.contact_number):
            frappe.throw(
                msg=frappe._("Phone Number {0} set in field contact_number is not valid.").format(doc.contact_number),
                title=frappe._("Invalid Phone Number")
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


@frappe.whitelist(allow_guest=True)
def get_csrf_token():
    token = ""
    if hasattr(frappe, "local") and hasattr(frappe.local, "session"):
        token = getattr(frappe.local.session, "data", {}).get("csrf_token") or getattr(frappe.local.session, "csrf_token", "")
    if not token and hasattr(frappe, "session"):
        token = getattr(frappe.session, "csrf_token", "")
    return {"csrf_token": token}
