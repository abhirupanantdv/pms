import frappe
from frappe.utils import validate_phone_number

def validate_tenant_onboarding_phone(doc, method):
    if doc.contact_number:
        if not validate_phone_number(doc.contact_number):
            frappe.throw(
                msg=frappe._("Phone Number {0} set in field contact_number is not valid.").format(doc.contact_number),
                title=frappe._("Invalid Phone Number")
            )
