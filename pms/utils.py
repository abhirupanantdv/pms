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
    if not task_name:
        task_name = frappe.form_dict.get("task_name")

    if not task_name:
        frappe.throw("Task ID is required.")

    if not frappe.db.exists("Task", task_name):
        frappe.throw("Task {0} does not exist.".format(task_name))

    task = frappe.get_doc("Task", task_name)

    if task.get("custom_quotation_id"):
        quotation_id = task.custom_quotation_id
        if frappe.db.exists("Quotation", quotation_id):
            message = {
                "status": "exists",
                "quotation": quotation_id,
                "task": task.name,
                "message": "Quotation has already been generated."
            }
            frappe.response["message"] = message
            return message
        else:
            frappe.throw(
                "Task {0} contains Quotation ID {1}, "
                "but that Quotation does not exist. "
                "Please verify the reference before creating another."
                .format(task.name, quotation_id)
            )
    else:
        if task.status != "Completed":
            frappe.throw("Only Completed Tasks can create a Quotation.")

        if task.docstatus != 1:
            frappe.throw("Please submit the Task before creating a Quotation.")

        if not task.get("custom_customer_name"):
            frappe.throw("Customer is missing in the Task.")

        if not frappe.db.exists("Customer", task.custom_customer_name):
            frappe.throw("Customer {0} does not exist.".format(task.custom_customer_name))

        if not task.get("company"):
            frappe.throw("Company is missing in the Task.")

        if not task.get("custom_items_used_for_maintenance"):
            frappe.throw("No maintenance items found in the Task.")

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
            task.db_set("custom_quotation_id", existing, update_modified=False)
            message = {
                "status": "exists",
                "quotation": existing,
                "task": task.name,
                "message": "Existing Quotation linked to this Task."
            }
            frappe.response["message"] = message
            return message
        else:
            quotation = frappe.new_doc("Quotation")
            quotation.quotation_to = "Customer"
            quotation.party_name = task.custom_customer_name
            quotation.company = task.company

            if quotation_meta.has_field("custom_service_quotation"):
                quotation.custom_service_quotation = 1

            quotation.valid_till = frappe.utils.add_days(frappe.utils.today(), 7)

            if task.get("custom_booking_id"):
                quotation.booking_id = task.custom_booking_id

            if quotation_meta.has_field("custom_task_reference"):
                quotation.custom_task_reference = task.name

            quotation.run_method("set_missing_values")

            if quotation_meta.has_field("custom_service_quotation"):
                quotation.custom_service_quotation = 1

            quotation.valid_till = frappe.utils.add_days(frappe.utils.today(), 7)

            if task.get("custom_booking_id"):
                quotation.booking_id = task.custom_booking_id

            item_meta = frappe.get_meta("Quotation Item")

            for source in task.custom_items_used_for_maintenance:
                item_code = (
                    source.get("item_code")
                    or source.get("item")
                    or source.get("unit_code")
                    or source.get("unit")
                )

                if not item_code:
                    frappe.throw("Item code is missing in maintenance row {0}.".format(source.idx))

                if not frappe.db.exists("Item", item_code):
                    frappe.throw("Item {0} does not exist in the Item master.".format(item_code))

                qty = source.get("qty") or source.get("quantity") or 1

                row = quotation.append("items", {
                    "item_code": item_code,
                    "qty": qty
                })

                for fieldname in ["description", "uom", "rate", "warehouse", "cost_center"]:
                    if item_meta.has_field(fieldname) and source.get(fieldname) is not None and source.get(fieldname) != "":
                        row.set(fieldname, source.get(fieldname))

                if source.get("custom_price") is not None and source.get("custom_price") != "":
                    row.set("rate", source.get("custom_price"))

            quotation.run_method("set_missing_values")
            quotation.run_method("calculate_taxes_and_totals")

            if quotation_meta.has_field("custom_service_quotation"):
                quotation.custom_service_quotation = 1

            quotation.valid_till = frappe.utils.add_days(frappe.utils.today(), 7)

            if task.get("custom_booking_id"):
                quotation.booking_id = task.custom_booking_id

            quotation.insert()
            task.db_set("custom_quotation_id", quotation.name, update_modified=False)

            message = {
                "status": "created",
                "quotation": quotation.name,
                "task": task.name,
                "party_name": quotation.party_name,
                "company": quotation.company,
                "booking_id": quotation.get("booking_id"),
                "custom_service_quotation": getattr(quotation, "custom_service_quotation", 1),
                "valid_till": quotation.valid_till,
                "items_count": len(quotation.items),
                "message": "Quotation created and linked to Task."
            }
            frappe.response["message"] = message
            return message
