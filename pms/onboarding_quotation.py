"""Explicit, permission-checked quotation creation for approved onboardings."""
import frappe


def _existing_quotation(onboarding_name):
    name = frappe.db.get_value(
        "Quotation", {"custom_tenant_onboarding": onboarding_name}, "name"
    )
    if name:
        frappe.get_doc("Quotation", name).check_permission("read")
    return name


@frappe.whitelist()
def quotation_status(tenant_onboarding):
    doc = frappe.get_doc("Tenant Onboarding", tenant_onboarding)
    doc.check_permission("read")
    return {"quotation": _existing_quotation(doc.name)}


@frappe.whitelist(methods=["POST"])
def create_quotation(tenant_onboarding):
    # Serialize requests for this onboarding, including requests from other tabs.
    frappe.db.sql(
        "SELECT name FROM `tabTenant Onboarding` WHERE name = %s FOR UPDATE",
        (tenant_onboarding,),
    )
    doc = frappe.get_doc("Tenant Onboarding", tenant_onboarding)
    doc.check_permission("write")
    if doc.get("workflow_state") != "Approved" or doc.docstatus == 2:
        frappe.throw("Approve the onboarding before creating a quotation.")
    if not doc.get("signed_document"):
        frappe.throw("Upload the signed document before creating a quotation.")

    existing = _existing_quotation(doc.name)
    if existing:
        return {"quotation": existing, "created": False}
    if not frappe.has_permission("Quotation", "create"):
        frappe.throw("You do not have permission to create a quotation.", frappe.PermissionError)

    customer = doc.create_customer()
    doc.create_billing_address(customer)
    name = doc.create_quotation(customer)
    if not name:
        frappe.throw("Quotation creation did not return a quotation ID.")
    return {"quotation": name, "created": True}
