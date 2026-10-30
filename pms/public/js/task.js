frappe.ui.form.on("Task", {
    refresh(frm) {
        if (frm.is_new()) {
            return;
        }

        const invoice_id = frm.doc.custom_sales_invoice || frm.doc.custom_sales_invoice_id;

        // If an invoice exists, always show Go To Invoice.
        if (invoice_id) {
            frm.add_custom_button(
                __("Go To Invoice"),
                function () {
                    frappe.set_route(
                        "Form",
                        "Sales Invoice",
                        invoice_id
                    );
                }
            ).addClass("btn-primary");

            return;
        }

        // Generate Invoice only when Task status is Completed.
        if (frm.doc.status === "Completed") {
            frm.add_custom_button(
                __("Genarate Sales Invoice"),
                function () {
                    frappe.confirm(
                        __("Generate a Sales Invoice for Task {0}?", [
                            frm.doc.name
                        ]),
                        function () {
                            const invokeCall = function (methodName, fallback) {
                                frappe.call({
                                    method: methodName,
                                    args: {
                                        task_name: frm.doc.name
                                    },
                                    freeze: true,
                                    freeze_message: __(
                                        "Generating Sales Invoice..."
                                    ),
                                    callback: function (r) {
                                        if (!r.message && fallback) {
                                            fallback();
                                            return;
                                        }

                                        const result = r.message;

                                        if (
                                            result &&
                                            (result.status === "created" ||
                                                result.status === "exists")
                                        ) {
                                            const new_invoice_id =
                                                result.sales_invoice || result.invoice;

                                            frappe.show_alert({
                                                message: __(
                                                    "Sales Invoice {0} is ready.",
                                                    [new_invoice_id]
                                                ),
                                                indicator: "green"
                                            });

                                            // The Python method saves the invoice
                                            // reference in Task.custom_sales_invoice.
                                            frm.reload_doc().then(() => {
                                                frappe.set_route(
                                                    "Form",
                                                    "Sales Invoice",
                                                    new_invoice_id
                                                );
                                            });
                                        }
                                    },
                                    error: function () {
                                        if (fallback) fallback();
                                    }
                                });
                            };

                            invokeCall("erpnext.projects.doctype.task.task.create_maintenance_sales_invoice", function () {
                                invokeCall("pms.utils.create_maintenance_sales_invoice");
                            });
                        }
                    );
                }
            ).addClass("btn-primary");
        }
    }
});
