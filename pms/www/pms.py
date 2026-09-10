import frappe
import json
import os

def get_context(context):
    context.no_cache = 1

    # Redirect unauthenticated Guest visitors to login with return path to /pms
    if frappe.session.user == "Guest":
        frappe.local.flags.redirect_location = "/login?redirect-to=/pms"
        raise frappe.Redirect

    manifest_path = frappe.get_app_path("pms", "public", "dist", ".vite", "manifest.json")
    if not os.path.exists(manifest_path):
        manifest_path = frappe.get_app_path("pms", "public", "dist", "manifest.json")

    js_file = ""
    css_file = ""

    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, "r") as f:
                manifest = json.load(f)
                entry = manifest.get("index.html") or manifest.get("src/main.jsx")
                if entry:
                    js_file = entry.get("file", "")
                    css_files = entry.get("css", [])
                    if css_files:
                        css_file = css_files[0]
        except Exception:
            pass

    context.js_file = f"/assets/pms/dist/{js_file}" if js_file else ""
    context.css_file = f"/assets/pms/dist/{css_file}" if css_file else ""
    context.csrf_token = frappe.session.csrf_token
    context.session_user = frappe.session.user
