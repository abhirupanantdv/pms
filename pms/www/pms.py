import frappe  # type: ignore
import json
import os

def get_context(context):
    context.no_cache = 1

    # Redirect root URL ("/") to "/pms"
    req_path = getattr(getattr(frappe, "request", None), "path", "")
    if req_path in ("/", ""):
        frappe.local.flags.redirect_location = "/pms"
        raise frappe.Redirect

    manifest_path = frappe.get_app_path("pms", "public", "dist", ".vite", "manifest.json")
    if not os.path.exists(manifest_path):
        manifest_path = frappe.get_app_path("pms", "public", "dist", "manifest.json")
    if not os.path.exists(manifest_path):
        manifest_path = frappe.get_app_path("pms", "public", ".vite", "manifest.json")
    if not os.path.exists(manifest_path):
        manifest_path = frappe.get_app_path("pms", "public", "manifest.json")

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

    # Check if files reside inside dist or public root
    if js_file and os.path.exists(frappe.get_app_path("pms", "public", "dist", js_file)):
        base_prefix = "/assets/pms/dist"
    else:
        base_prefix = "/assets/pms"

    context.js_file = f"{base_prefix}/{js_file}" if js_file else ""
    context.css_file = f"{base_prefix}/{css_file}" if css_file else ""
    context.csrf_token = frappe.session.csrf_token
    context.session_user = frappe.session.user
