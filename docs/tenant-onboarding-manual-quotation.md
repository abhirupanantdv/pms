# Deploy manual quotation creation

Replace the server controller with `deployment/tenant_onboarding.py` from this repository:

`/home/erpnext/globe-bench/apps/property_management/property_management/property_managmenet_system/doctype/tenant_onboarding/tenant_onboarding.py`

Back up the existing server file first. The replacement preserves the attached controller's existing methods, changes only `on_update()` to stop automatic quotation creation, and adds module-level whitelisted endpoints. The explicit creation endpoint also rechecks booking availability.

The React button now calls:

`property_management.property_managmenet_system.doctype.tenant_onboarding.tenant_onboarding.create_quotation`

The earlier `pms/onboarding_quotation.py` endpoint is no longer used by the frontend and does not need deployment.

The replacement is now based on the latest controller attachment. It also defines
`get_tenant_onboarding_workflow_actions` and `update_tenant_onboarding_workflow`
in this same module. TenantOnboarding.jsx calls these fully qualified paths;
no separate bare-name API or Server Script is required. These wrappers use
Frappe's standard workflow transition and approval checks:
https://github.com/frappe/frappe/blob/version-15/frappe/model/workflow.py

All direct access to the onboarding's `workflow_state` attribute was replaced
with safe `doc.get(...)` / `self.get(...)` access. New drafts can have no workflow
state yet without raising AttributeError. Approval and rejection additionally
require a signed document on the server.

Deploy the rebuilt frontend together with the replacement controller. From `/home/erpnext/globe-bench`, restart the Frappe workers using the environment's normal deployment process. A frontend rebuild alone cannot apply Python changes.

Verify against a new onboarding: approval must create no quotation; Create Quotation must create one and show its clickable ID for three seconds. Clicking again must return the existing ID without duplicating it. The button stays labelled Create Quotation and remains visible after approval.

The local checks cover the frontend build and lint. The supplied Linux server is not accessible from this Windows workspace, and no local Python/Frappe runtime is available; backend execution must be verified on the server.
