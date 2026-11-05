frappe.ui.form.on("Quotation", {
    before_submit(frm) {
        if (frm.doc.flags && (frm.doc.flags.ignore_payment_validation || frm.doc.flags.ignore_validate)) {
            return;
        }

        const isServiceQuotation = frm.doc.custom_service_quotation === 1 ||
            frm.doc.custom_service_quotation === "1" ||
            frm.doc.custom_service_quotation === true;

        // Apply validation only for non-service quotations
        if (!isServiceQuotation) {
            const text = (frm.doc.custom_payment_details || "").trim();
            if (text.length < 40) {
                frappe.throw(
                    __("Payment Details must contain at least 40 characters. Currently entered: {0}", [text.length])
                );
                frappe.validated = false;
            }
        }
    },
    refresh(frm) {
        const isServiceQuotation = frm.doc.custom_service_quotation === 1 ||
            frm.doc.custom_service_quotation === "1" ||
            frm.doc.custom_service_quotation === true;

        // Display and require Payment Details only for non-service quotations
        frm.toggle_display("custom_payment_details", !isServiceQuotation);
        frm.toggle_reqd("custom_payment_details", !isServiceQuotation);

        if (frm.doc.docstatus === 1 && isServiceQuotation) {
            const taskId = frm.doc.custom_task_id || frm.doc.custom_task_reference;
            if (taskId) {
                frm.add_custom_button(__("Go to Task"), function () {
                    frappe.set_route(
                        "Form",
                        "Task",
                        taskId
                    );
                });
            } else if (frm.doc.name) {
                frappe.db.get_value("Task", { "custom_quotation_id": frm.doc.name }, "name").then((r) => {
                    if (r && r.message && r.message.name) {
                        frm.add_custom_button(__("Go to Task"), function () {
                            frappe.set_route(
                                "Form",
                                "Task",
                                r.message.name
                            );
                        });
                    }
                });
            }
        // Check role permission for Create Booking
        const user = frappe.session.user;
        const roles = typeof frappe.get_roles === "function" ? frappe.get_roles(user) : (frappe.user_roles || []);
        const isAdmin = (Array.isArray(roles) && roles.some(r => /admin|system manager/i.test(r))) || user === "Administrator";
        const isOperation = (Array.isArray(roles) && roles.some(r => /operation/i.test(r))) && !isAdmin;

        // Operation Role user don't show Create Booking Button in Quotation
        if (isOperation) {
            frm.remove_custom_button(__("Create Booking"));
            if (frm.page && frm.page.clear_inner_button) {
                frm.page.clear_inner_button(__("Create Booking"));
            }
        }
    }
});
