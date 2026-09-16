import frappe  # type: ignore

def get_context(context):
    context.no_cache = 1
    frappe.local.flags.redirect_location = "/pms"
    raise frappe.Redirect
