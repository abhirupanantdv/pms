
import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import (
    getdate,
    nowdate,
    add_days,
    add_months,
    flt,
)


class TenantOnboarding(Document):

    # =========================================================
    # VALIDATION
    # =========================================================

    def validate(self):
        """
        Draft Tenant Onboarding can still be saved normally.

        The Quotation-related mandatory validation is enforced
        only when the Tenant Onboarding is being Approved.
        """

        if self.get("workflow_state") == "Approved":
            self.validate_quotation_requirements()
            self.validate_booking_availability()

    # =========================================================
    # ON UPDATE
    # =========================================================

    def on_update(self):
        """Approval maintains customer/address; only the button creates quotations."""
        self.create_lead()
        self.create_address()
        if self.get("workflow_state") != "Approved":
            return
        customer_name = self.create_customer()
        self.create_billing_address(customer_name)

    def validate_quotation_requirements(self):
        """
        Validate everything required to create the Quotation
        before approval is allowed.

        This prevents workflow from reaching Approved and then
        failing with errors such as:

        [Quotation, ...]: custom_end_date
        """

        # -----------------------------------------------------
        # Signed Document
        # -----------------------------------------------------

        if not self.signed_document:
            frappe.throw(
                _(
                    "Signed Document is required before "
                    "approving Tenant Onboarding."
                )
            )

        # -----------------------------------------------------
        # Lease Commencement Date
        #
        # This becomes Quotation.custom_start_date
        # -----------------------------------------------------

        if not self.lease_commencement_date:
            frappe.throw(
                _(
                    "Lease Commencement Date is required "
                    "before approving Tenant Onboarding."
                )
            )

        # -----------------------------------------------------
        # Lease Period
        #
        # Required to calculate Quotation.custom_end_date
        # -----------------------------------------------------

        if not self.lease_period:
            frappe.throw(
                _(
                    "Lease Period is required before "
                    "approving Tenant Onboarding."
                )
            )

        lease_period = flt(
            self.lease_period
        )

        if lease_period < 1:
            frappe.throw(
                _(
                    "Lease Period must be at least 1 year."
                )
            )

        # Lease Period is an Int field in Tenant Onboarding.
        if lease_period != int(lease_period):
            frappe.throw(
                _(
                    "Lease Period must be a whole number "
                    "of years."
                )
            )

        # -----------------------------------------------------
        # Start Date validation
        # Same rule as your Quotation JS
        # -----------------------------------------------------

        today = getdate(
            nowdate()
        )

        lease_start = getdate(
            self.lease_commencement_date
        )

        if lease_start < today:
            frappe.throw(
                _(
                    "Lease Commencement Date cannot "
                    "be before today."
                )
            )

        # -----------------------------------------------------
        # Your Quotation UI sets valid_till to
        # transaction date + 7 days.
        #
        # And custom_start_date must be after valid_till.
        # -----------------------------------------------------

        quotation_valid_till = getdate(
            add_days(
                nowdate(),
                7
            )
        )

        if lease_start <= quotation_valid_till:
            frappe.throw(
                _(
                    "Lease Commencement Date must be after "
                    "Quotation Valid Till Date {0}."
                ).format(
                    quotation_valid_till
                )
            )

        # -----------------------------------------------------
        # Calculated End Date
        # -----------------------------------------------------

        lease_end = getdate(
            add_months(
                self.lease_commencement_date,
                int(lease_period) * 12
            )
        )

        if lease_end <= lease_start:
            frappe.throw(
                _(
                    "Calculated Lease End Date must be "
                    "after Lease Commencement Date."
                )
            )

        # -----------------------------------------------------
        # Vacant Possession
        # -----------------------------------------------------

        if self.vacant_possession_date:

            vacant_date = getdate(
                self.vacant_possession_date
            )

            if vacant_date < today:
                frappe.throw(
                    _(
                        "Vacant Possession Date cannot "
                        "be before today."
                    )
                )

            if vacant_date > lease_start:
                frappe.throw(
                    _(
                        "Vacant Possession Date cannot "
                        "be after Lease Commencement Date."
                    )
                )

        # -----------------------------------------------------
        # Onboarding Unit
        # -----------------------------------------------------

        onboarding_rows = (
            self.get("onboarding_unit")
            or []
        )

        if not onboarding_rows:
            frappe.throw(
                _(
                    "At least one Onboarding Unit is required "
                    "before approving Tenant Onboarding."
                )
            )

        # Make sure every row can become a Quotation Item.
        for row in onboarding_rows:

            item_code = row.get(
                "item_code"
            )

            if not item_code:
                frappe.throw(
                    _(
                        "Item Code is required in "
                        "Onboarding Unit row {0}."
                    ).format(
                        row.idx
                    )
                )

            if not frappe.db.exists(
                "Item",
                item_code
            ):
                frappe.throw(
                    _(
                        "Item {0} from Onboarding Unit "
                        "row {1} does not exist."
                    ).format(
                        item_code,
                        row.idx
                    )
                )

    # =========================================================
    # CALCULATE QUOTATION DATES
    # =========================================================

    def get_quotation_dates(self):
        """
        Centralized calculation so custom_start_date and
        custom_end_date can never accidentally be different.
        """

        if not self.lease_commencement_date:
            frappe.throw(
                _(
                    "Lease Commencement Date is required "
                    "to create Quotation."
                )
            )

        if not self.lease_period:
            frappe.throw(
                _(
                    "Lease Period is required "
                    "to create Quotation."
                )
            )

        lease_period = int(
            flt(
                self.lease_period
            )
        )

        if lease_period < 1:
            frappe.throw(
                _(
                    "Lease Period must be at least 1 year."
                )
            )

        start_date = getdate(
            self.lease_commencement_date
        )

        end_date = getdate(
            add_months(
                start_date,
                lease_period * 12
            )
        )

        return start_date, end_date

    # =========================================================
    # BOOKING AVAILABILITY
    # =========================================================

    def validate_booking_availability(self):
        """
        Same overlap logic used by your Quotation Python
        controller.

        Quotation itself also performs this validation during
        validate(). Doing it here gives a clearer error before
        automatic Quotation creation.
        """

        if not self.lease_commencement_date:
            return

        if not self.lease_period:
            return

        onboarding_rows = (
            self.get("onboarding_unit")
            or []
        )

        if not onboarding_rows:
            return

        new_start, new_end = (
            self.get_quotation_dates()
        )

        conflicts = []

        for row in onboarding_rows:

            item_code = row.get(
                "item_code"
            )

            if not item_code:
                continue

            item_group = frappe.db.get_value(
                "Item",
                item_code,
                "item_group"
            )

            # Same as Quotation:
            # service items do not need booking availability.
            if item_group == "Services":
                continue

            booking_rows = frappe.get_all(
                "Booking Item",
                filters={
                    "item_code": item_code
                },
                fields=[
                    "parent"
                ]
            )

            if not booking_rows:
                continue

            booking_names = list(
                {
                    d.parent
                    for d in booking_rows
                    if d.parent
                }
            )

            if not booking_names:
                continue

            bookings = frappe.get_all(
                "Booking",
                filters={
                    "name": [
                        "in",
                        booking_names
                    ],
                    "docstatus": [
                        "!=",
                        2
                    ]
                },
                fields=[
                    "name",
                    "starting_date",
                    "ending_date",
                    "status",
                    "workflow_state"
                ]
            )

            for booking in bookings:

                if (
                    not booking.starting_date
                    or not booking.ending_date
                ):
                    continue

                existing_start = getdate(
                    booking.starting_date
                )

                existing_end = getdate(
                    booking.ending_date
                )

                if (
                    new_start <= existing_end
                    and
                    new_end >= existing_start
                ):
                    conflicts.append(
                        _(
                            "{0} - Already Booked By "
                            "{1} ({2} to {3})"
                        ).format(
                            item_code,
                            booking.name,
                            existing_start,
                            existing_end
                        )
                    )

        if conflicts:
            frappe.throw(
                _(
                    "The following unit(s) are "
                    "already booked:"
                )
                + "<br><br>"
                + "<br>".join(
                    conflicts
                )
            )

    # =========================================================
    # LEAD
    # =========================================================

    def create_lead(self):

        lead_name = frappe.db.get_value(
            "Lead",
            {
                "tenant_onboarding_id":
                    self.name
            },
            "name"
        )

        if lead_name:
            lead = frappe.get_doc(
                "Lead",
                lead_name
            )

        else:
            lead = frappe.new_doc(
                "Lead"
            )

            lead.tenant_onboarding_id = (
                self.name
            )

        lead.first_name = (
            self.contact_name
        )

        lead.lead_name = (
            self.contact_name
        )

        lead.email_id = (
            self.email_id
        )

        lead.company_name = (
            self.company_name
        )

        lead.mobile_no = (
            self.contact_number
        )

        lead.status = "Quotation"

        lead.lead_owner = (
            frappe.session.user
        )

        lead.type = "Customer"

        lead.request_type = (
            "Unit Enquiry"
        )

        if lead_name:
            lead.save(
                ignore_permissions=True
            )
        else:
            lead.insert(
                ignore_permissions=True
            )

    # =========================================================
    # ADDRESS
    # =========================================================

    def create_address(self):

        if not self.address_line_1:
            return

        address_name = frappe.db.get_value(
            "Address",
            {
                "tenant_onboarding_id":
                    self.name
            },
            "name"
        )

        if address_name:
            address = frappe.get_doc(
                "Address",
                address_name
            )
        else:
            address = frappe.new_doc(
                "Address"
            )

            address.tenant_onboarding_id = (
                self.name
            )

        address.address_title = (
            self.name
        )

        address.address_type = (
            "Billing"
        )

        address.address_line1 = (
            self.address_line_1
            or ""
        )

        address.address_line2 = (
            self.address_line_2
            or ""
        )

        address.city = (
            self.city
            or ""
        )

        address.state = (
            self.state
            or ""
        )

        address.country = (
            self.country
            or ""
        )

        address.phone = (
            self.contact_number
            or ""
        )

        address.email_id = (
            self.email_id
            or ""
        )

        if address.is_new():
            address.insert(
                ignore_permissions=True
            )
        else:
            address.save(
                ignore_permissions=True
            )

    # =========================================================
    # CUSTOMER
    # =========================================================

    def create_customer(self):

        customer_name = frappe.db.get_value(
            "Customer",
            {
                "tenant_onboarding_id":
                    self.name
            },
            "name"
        )

        if customer_name:
            customer = frappe.get_doc(
                "Customer",
                customer_name
            )
        else:
            customer = frappe.new_doc(
                "Customer"
            )

            customer.tenant_onboarding_id = (
                self.name
            )

        customer.customer_name = (
            self.contact_name
            or "Tenant"
        )

        customer.customer_type = (
            "Tenant"
        )

        customer.customer_group = (
            "Commercial"
        )

        customer.territory = (
            "All Territories"
        )

        customer.company_name = (
            self.company_name
        )

        customer.email = (
            self.email_id
        )

        customer.phone_no = (
            self.contact_number
        )

        customer.custom_type = (
            self.type
        )

        customer.custom_company_vat_id = (
            self.company_vat_id
        )

        customer.date_of_birth = (
            self.date_of_birth
        )

        customer.date_of_incorporation = (
            self.date_of_incorporation
        )

        customer.is_internal_customer = (
            1
            if self.is_internal_customer
            else 0
        )

        customer.custom_usage_of_demised_premises = (
            self.usage_of_demised_premises
        )

        if (
            self.is_internal_customer
            and self.custom_represents_company
        ):

            customer.represents_company = (
                self.custom_represents_company
            )

            if not any(
                row.company
                == self.custom_represents_company
                for row in customer.companies
            ):

                customer.append(
                    "companies",
                    {
                        "company":
                            self.custom_represents_company
                    }
                )

        else:

            customer.represents_company = ""

            customer.set(
                "companies",
                []
            )

        if customer.is_new():
            customer.insert(
                ignore_permissions=True
            )
        else:
            customer.save(
                ignore_permissions=True
            )

        return customer.name

    # =========================================================
    # BILLING ADDRESS
    # =========================================================

    def create_billing_address(
        self,
        customer_name
    ):

        if not customer_name:
            return

        address_result = frappe.db.sql(
            """
            SELECT
                a.name
            FROM
                `tabAddress` a
            INNER JOIN
                `tabDynamic Link` dl
                ON dl.parent = a.name
            WHERE
                dl.link_doctype = 'Customer'
                AND dl.link_name = %s
                AND dl.parenttype = 'Address'
                AND a.address_type = 'Billing'
            ORDER BY
                a.modified DESC
            LIMIT 1
            """,
            (
                customer_name,
            ),
            as_dict=True
        )

        if address_result:

            address = frappe.get_doc(
                "Address",
                address_result[0].name
            )

        else:

            address = frappe.new_doc(
                "Address"
            )

            address.append(
                "links",
                {
                    "link_doctype":
                        "Customer",

                    "link_name":
                        customer_name
                }
            )

        address.address_title = (
            self.contact_name
            or customer_name
        )

        address.address_type = (
            "Billing"
        )

        address.address_line1 = (
            self.address_line_1
            or ""
        )

        address.address_line2 = (
            self.address_line_2
            or ""
        )

        address.city = (
            self.city
            or ""
        )

        address.state = (
            self.state
            or ""
        )

        address.country = (
            self.country
            or ""
        )

        address.phone = (
            self.contact_number
            or ""
        )

        address.email_id = (
            self.email_id
            or ""
        )

        if address.is_new():
            address.insert(
                ignore_permissions=True
            )
        else:
            address.save(
                ignore_permissions=True
            )

    # =========================================================
    # CREATE / UPDATE QUOTATION
    # =========================================================

    def create_quotation(
        self,
        customer_name
    ):
        """
        Create or update the Draft Quotation.

        IMPORTANT:
        custom_start_date and custom_end_date are explicitly
        calculated here. We do NOT depend on Quotation JS.
        """

        if not customer_name:
            frappe.throw(
                _(
                    "Customer is required "
                    "to create Quotation."
                )
            )

        # Re-check here for safety.
        self.validate_quotation_requirements()

        quotation_meta = frappe.get_meta(
            "Quotation"
        )

        # -----------------------------------------------------
        # Reference field
        # -----------------------------------------------------

        if not quotation_meta.has_field(
            "custom_tenant_onboarding"
        ):
            frappe.throw(
                _(
                    "Quotation field "
                    "'custom_tenant_onboarding' "
                    "is missing. Please create it as a "
                    "Link field with Options "
                    "'Tenant Onboarding'."
                )
            )

        # -----------------------------------------------------
        # Prevent duplicate quotations
        # -----------------------------------------------------

        quotation_name = frappe.db.get_value(
            "Quotation",
            {
                "custom_tenant_onboarding":
                    self.name,
                "docstatus":
                    0
            },
            "name"
        )

        if quotation_name:

            quotation = frappe.get_doc(
                "Quotation",
                quotation_name
            )

        else:

            quotation = frappe.new_doc(
                "Quotation"
            )

        # -----------------------------------------------------
        # Header
        # -----------------------------------------------------

        quotation.quotation_to = (
            "Customer"
        )

        quotation.party_name = (
            customer_name
        )

        quotation.custom_tenant_onboarding = (
            self.name
        )

        quotation.transaction_date = (
            nowdate()
        )

        quotation.valid_till = (
            add_days(
                quotation.transaction_date,
                7
            )
        )

        quotation.order_type = (
            "Sales"
        )

        # Draft
        quotation.docstatus = 0

        # -----------------------------------------------------
        # Company
        # -----------------------------------------------------

        default_company = (
            frappe.db.get_single_value(
                "Global Defaults",
                "default_company"
            )
        )

        if not default_company:
            frappe.throw(
                _(
                    "Default Company is not configured "
                    "in Global Defaults."
                )
            )

        quotation.company = (
            default_company
        )

        # -----------------------------------------------------
        # Customer
        # -----------------------------------------------------

        customer = frappe.get_doc(
            "Customer",
            customer_name
        )

        quotation.customer_name = (
            customer.customer_name
            or self.contact_name
            or self.company_name
        )

        if customer.customer_group:
            quotation.customer_group = (
                customer.customer_group
            )

        if customer.territory:
            quotation.territory = (
                customer.territory
            )

        # =====================================================
        # CRITICAL FIX
        #
        # This is where QTN-09-00418 failed.
        # =====================================================

        start_date, end_date = (
            self.get_quotation_dates()
        )

        if not quotation_meta.has_field(
            "custom_start_date"
        ):
            frappe.throw(
                _(
                    "Quotation field custom_start_date "
                    "does not exist."
                )
            )

        if not quotation_meta.has_field(
            "custom_end_date"
        ):
            frappe.throw(
                _(
                    "Quotation field custom_end_date "
                    "does not exist."
                )
            )

        quotation.custom_start_date = (
            start_date
        )

        quotation.custom_end_date = (
            end_date
        )

        # -----------------------------------------------------
        # Verify BEFORE insert
        # -----------------------------------------------------

        if not quotation.custom_start_date:
            frappe.throw(
                _(
                    "Unable to calculate Quotation "
                    "Start Date."
                )
            )

        if not quotation.custom_end_date:
            frappe.throw(
                _(
                    "Unable to calculate Quotation "
                    "End Date."
                )
            )

        if (
            getdate(
                quotation.custom_end_date
            )
            <= getdate(
                quotation.custom_start_date
            )
        ):
            frappe.throw(
                _(
                    "Quotation End Date must be after "
                    "Quotation Start Date."
                )
            )

        # -----------------------------------------------------
        # Signed Document
        # -----------------------------------------------------

        if quotation_meta.has_field(
            "signed_document"
        ):
            quotation.signed_document = (
                self.signed_document
            )

        # =====================================================
        # SAME-NAME FIELD MAPPING
        # =====================================================

        source_meta = frappe.get_meta(
            "Tenant Onboarding"
        )

        source_fields = {
            field.fieldname: field
            for field in source_meta.fields
            if field.fieldname
        }

        target_fields = {
            field.fieldname: field
            for field in quotation_meta.fields
            if field.fieldname
        }

        ignored_fields = {
            "name",
            "owner",
            "creation",
            "modified",
            "modified_by",
            "docstatus",
            "idx",
            "doctype",

            "naming_series",

            "quotation_to",
            "party_name",
            "customer_name",

            "transaction_date",
            "valid_till",

            "order_type",
            "company",

            "booking_id",

            "custom_tenant_onboarding",

            "items",
            "onboarding_unit",

            # CRITICAL:
            # Never overwrite our calculated dates.
            "custom_start_date",
            "custom_end_date"
        }

        ignored_types = {
            "Section Break",
            "Column Break",
            "Tab Break",
            "HTML",
            "Button",
            "Table",
            "Table MultiSelect"
        }

        common_fields = (
            set(source_fields)
            & set(target_fields)
        )

        for fieldname in common_fields:

            if fieldname in ignored_fields:
                continue

            source_field = (
                source_fields[fieldname]
            )

            target_field = (
                target_fields[fieldname]
            )

            if (
                source_field.fieldtype
                in ignored_types
            ):
                continue

            if (
                target_field.fieldtype
                in ignored_types
            ):
                continue

            if target_field.read_only:
                continue

            value = self.get(
                fieldname
            )

            if value not in (
                None,
                ""
            ):
                quotation.set(
                    fieldname,
                    value
                )

        # =====================================================
        # BILLING ADDRESS
        # =====================================================

        billing_address = frappe.db.sql(
            """
            SELECT
                a.name
            FROM
                `tabAddress` a
            INNER JOIN
                `tabDynamic Link` dl
                ON dl.parent = a.name
            WHERE
                dl.link_doctype = 'Customer'
                AND dl.link_name = %s
                AND dl.parenttype = 'Address'
                AND a.address_type = 'Billing'
            ORDER BY
                a.modified DESC
            LIMIT 1
            """,
            (
                customer_name,
            ),
            as_dict=True
        )

        if billing_address:
            quotation.customer_address = (
                billing_address[0].name
            )

        # -----------------------------------------------------
        # Contact
        # -----------------------------------------------------

        if self.contact_number:
            quotation.contact_mobile = (
                self.contact_number
            )

        if self.email_id:
            quotation.contact_email = (
                self.email_id
            )

        # =====================================================
        # ONBOARDING UNIT -> QUOTATION ITEM
        # =====================================================

        onboarding_rows = (
            self.get("onboarding_unit")
            or []
        )

        quotation.set(
            "items",
            []
        )

        source_child_meta = frappe.get_meta(
            "Onboarding Unit"
        )

        target_child_meta = frappe.get_meta(
            "Quotation Item"
        )

        source_child_fields = {
            field.fieldname: field
            for field in source_child_meta.fields
            if field.fieldname
        }

        target_child_fields = {
            field.fieldname: field
            for field in target_child_meta.fields
            if field.fieldname
        }

        common_child_fields = (
            set(source_child_fields)
            & set(target_child_fields)
        )

        ignored_child_fields = {
            "name",
            "owner",
            "creation",
            "modified",
            "modified_by",
            "docstatus",
            "idx",
            "doctype",
            "parent",
            "parentfield",
            "parenttype"
        }

        ignored_child_types = {
            "Section Break",
            "Column Break",
            "Tab Break",
            "HTML",
            "Button",
            "Table"
        }

        for source_row in onboarding_rows:

            item_code = source_row.get(
                "item_code"
            )

            if not item_code:
                frappe.throw(
                    _(
                        "Item Code is missing in "
                        "Onboarding Unit row {0}."
                    ).format(
                        source_row.idx
                    )
                )

            item = quotation.append(
                "items",
                {}
            )

            # ---------------------------------------------
            # Same-name fields
            # ---------------------------------------------

            for fieldname in common_child_fields:

                if fieldname in ignored_child_fields:
                    continue

                target_field = (
                    target_child_fields[
                        fieldname
                    ]
                )

                if target_field.read_only:
                    continue

                if (
                    target_field.fieldtype
                    in ignored_child_types
                ):
                    continue

                value = source_row.get(
                    fieldname
                )

                if value not in (
                    None,
                    ""
                ):
                    item.set(
                        fieldname,
                        value
                    )

            # Explicitly guarantee Item Code.
            item.item_code = (
                item_code
            )

            # Quantity mapping.
            if not item.get("qty"):

                if source_row.get("quantity"):
                    item.qty = source_row.get(
                        "quantity"
                    )

                elif source_row.get("qty"):
                    item.qty = source_row.get(
                        "qty"
                    )

                else:
                    item.qty = 1

        if not quotation.items:
            frappe.throw(
                _(
                    "Quotation cannot be created because "
                    "there are no Quotation Items."
                )
            )

        # =====================================================
        # DEFAULT SERVICE ITEMS
        #
        # Your Quotation JS normally adds these in browser.
        # Since this Quotation is created in Python, that JS
        # will never run.
        # =====================================================

        self.add_default_service_items(
            quotation
        )

        # =====================================================
        # ERPNext DEFAULTS
        # =====================================================

        quotation.run_method(
            "set_missing_values"
        )

        quotation.run_method(
            "calculate_taxes_and_totals"
        )

        # -----------------------------------------------------
        # Final date check immediately before insert.
        # -----------------------------------------------------

        if not quotation.get(
            "custom_start_date"
        ):
            frappe.throw(
                _(
                    "Quotation custom_start_date "
                    "is empty before save."
                )
            )

        if not quotation.get(
            "custom_end_date"
        ):
            frappe.throw(
                _(
                    "Quotation custom_end_date "
                    "is empty before save."
                )
            )

        # =====================================================
        # SAVE DRAFT
        # =====================================================

        try:

            if quotation.is_new():

                quotation.insert(
                    ignore_permissions=True
                )

                frappe.msgprint(
                    _(
                        "Draft Quotation "
                        "<b>{0}</b> created successfully."
                    ).format(
                        quotation.name
                    )
                )

            else:

                if quotation.docstatus != 0:
                    frappe.throw(
                        _(
                            "Quotation {0} is not Draft."
                        ).format(
                            quotation.name
                        )
                    )

                quotation.save(
                    ignore_permissions=True
                )

        except Exception:

            frappe.log_error(
                message=frappe.get_traceback(),
                title=(
                    "Tenant Onboarding "
                    "Quotation Creation Error"
                )
            )

            raise

        return quotation.name

    # =========================================================
    # DEFAULT SERVICE ITEMS
    # =========================================================

    def add_default_service_items(
        self,
        quotation
    ):
        """
        Python equivalent of the important part of your
        Quotation client-side sync_default_services().

        Your Quotation JS adds Default Service Items when
        Commercial items are present. Because automatic
        Quotation creation happens server-side, client JS
        does not execute.
        """

        total_carpet_area = 0
        commercial_count = 0

        existing_codes = {
            row.item_code
            for row in quotation.items
            if row.item_code
        }

        for row in quotation.items:

            if not row.item_code:
                continue

            item_details = frappe.db.get_value(
                "Item",
                row.item_code,
                [
                    "item_group",
                    "custom_7average_carpet_area_of_units"
                ],
                as_dict=True
            )

            if not item_details:
                continue

            if (
                item_details.item_group
                == "Commercial"
            ):

                commercial_count += 1

                total_carpet_area += flt(
                    item_details.get(
                        "custom_7average_carpet_area_of_units"
                    )
                    or 0
                )

        if commercial_count == 0:
            return

        service_items = frappe.get_all(
            "Item",
            filters={
                "item_group":
                    "Services",

                "custom_service_group":
                    "Default Service",

                "disabled":
                    0
            },
            fields=[
                "name",
                "charges"
            ]
        )

        if not service_items:
            frappe.throw(
                _(
                    "No active Default Service Item found."
                )
            )

        for service in service_items:

            rate = (
                total_carpet_area
                * flt(
                    service.get(
                        "charges"
                    )
                    or 0
                )
            )

            # If already copied somehow,
            # update rate instead of duplicating.
            existing_row = next(
                (
                    row
                    for row in quotation.items
                    if row.item_code
                    == service.name
                ),
                None
            )

            if existing_row:

                existing_row.rate = rate

                if not existing_row.qty:
                    existing_row.qty = 1

                continue

            quotation.append(
                "items",
                {
                    "item_code":
                        service.name,

                    "qty":
                        1,

                    "rate":
                        rate
                }
            )

def _existing_quotation(onboarding_name):
    name = frappe.db.get_value(
        "Quotation", {"custom_tenant_onboarding": onboarding_name}, "name"
    )
    if name:
        frappe.get_doc("Quotation", name).check_permission("read")
    return name


@frappe.whitelist()
def get_tenant_onboarding_workflow_actions(tenant_onboarding):
    """
    Return current workflow state and available actions.

    Approve / Reject actions are hidden automatically
    when the logged-in user does not have the role
    configured in the Workflow transition.
    """

    if not tenant_onboarding:
        frappe.throw("Tenant Onboarding is required.")

    doc = frappe.get_doc(
        "Tenant Onboarding",
        tenant_onboarding
    )

    workflow_name = frappe.db.get_value(
        "Workflow",
        {
            "document_type": "Tenant Onboarding",
            "is_active": 1
        },
        "name"
    )

    if not workflow_name:
        return {
            "current_state": doc.workflow_state or "",
            "next_actions": []
        }

    workflow = frappe.get_doc(
        "Workflow",
        workflow_name
    )

    current_state = (
        doc.workflow_state
        or ""
    )

    current_user = frappe.session.user
    user_roles = frappe.get_roles(current_user)

    is_administrator = (
        current_user == "Administrator"
    )

    next_actions = []

    for transition in workflow.transitions:

        if transition.state != current_state:
            continue

        required_role = (
            transition.allowed
            or ""
        )

        # Default: action is allowed.
        allowed = True

        # -----------------------------------------
        # Only restrict Approve / Reject by role
        # -----------------------------------------
        normalized_action = (
            transition.action or ""
        ).strip().lower()

        if normalized_action in {
            "approve",
            "reject"
        }:

            if (
                required_role
                and required_role != "All"
                and required_role not in user_roles
                and not is_administrator
            ):
                allowed = False

        next_actions.append({
            "action": transition.action,
            "next_state": transition.next_state,
            "required_role": required_role,
            "allowed": allowed
        })

    return {
        "workflow": workflow.name,
        "current_state": current_state,
        "next_actions": next_actions
    }


@frappe.whitelist()
def update_tenant_onboarding_workflow(
    tenant_onboarding,
    action
):
    """
    Apply Tenant Onboarding workflow action.

    Custom role permission check is performed ONLY for:
    - Approve
    - Reject

    The required role is fetched dynamically from the
    active ERPNext Workflow transition.

    Other actions such as:
    - Request For Approval

    are not checked by this custom role-validation block.
    """
    from frappe.model.workflow import apply_workflow

    if not tenant_onboarding:
        frappe.throw(
            "Tenant Onboarding is required."
        )

    if not action:
        frappe.throw(
            "Workflow action is required."
        )

    try:
        # =====================================================
        # LOAD TENANT ONBOARDING
        # =====================================================

        doc = frappe.get_doc(
            "Tenant Onboarding",
            tenant_onboarding
        )

        current_state = (
            doc.workflow_state
            or ""
        )

        # =====================================================
        # FIND ACTIVE WORKFLOW
        # =====================================================

        workflow_name = frappe.db.get_value(
            "Workflow",
            {
                "document_type":
                    "Tenant Onboarding",

                "is_active":
                    1
            },
            "name"
        )

        if not workflow_name:
            return {
                "success": False,
                "error": (
                    "No active Workflow found "
                    "for Tenant Onboarding."
                )
            }

        workflow = frappe.get_doc(
            "Workflow",
            workflow_name
        )

        # =====================================================
        # FIND THE CLICKED TRANSITION
        # =====================================================

        selected_transition = None

        for transition in workflow.transitions:

            if (
                transition.state == current_state
                and transition.action == action
            ):
                selected_transition = transition
                break

        if not selected_transition:
            return {
                "success": False,
                "error": (
                    f'Action "{action}" is not available '
                    f'from workflow state "{current_state}".'
                )
            }

        # =====================================================
        # CUSTOM ROLE CHECK
        #
        # ONLY for Approve / Reject
        # =====================================================

        normalized_action = (
            action or ""
        ).strip().lower()

        restricted_actions = {
            "approve",
            "reject"
        }

        if normalized_action in restricted_actions:

            # ---------------------------------------------
            # Read required role dynamically
            # from Workflow Transition
            # ---------------------------------------------

            required_role = (
                selected_transition.allowed
                or ""
            )

            current_user = (
                frappe.session.user
            )

            user_roles = frappe.get_roles(
                current_user
            )

            # Administrator bypass
            is_administrator = (
                current_user
                == "Administrator"
            )

            # ---------------------------------------------
            # Validate configured role
            # ---------------------------------------------

            if (
                required_role
                and required_role != "All"
                and required_role not in user_roles
                and not is_administrator
            ):
                return {
                    "success": False,

                    "permission_denied": True,

                    "required_role":
                        required_role,

                    "action":
                        action,

                    "error": (
                        f'You do not have permission to '
                        f'perform "{action}". '
                        f'Required Role: {required_role}'
                    )
                }

        # =====================================================
        # APPLY WORKFLOW
        #
        # Request For Approval reaches here directly.
        #
        # Approve / Reject reach here only after the
        # custom role check has passed.
        # =====================================================

        updated_doc = apply_workflow(
            doc,
            action
        )

        # =====================================================
        # SUCCESS RESPONSE
        # =====================================================

        return {
            "success": True,

            "name":
                updated_doc.name,

            "action":
                action,

            "previous_state":
                current_state,

            "workflow_state":
                updated_doc.workflow_state,

            "next_state":
                selected_transition.next_state,

            "docstatus":
                updated_doc.docstatus
        }

    except Exception as e:

        frappe.log_error(
            message=frappe.get_traceback(),
            title=(
                "Tenant Onboarding "
                "Workflow Action Error"
            )
        )

        return {
            "success": False,
            "error": str(e)
        }


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

    doc.validate_booking_availability()
    customer = doc.create_customer()
    doc.create_billing_address(customer)
    name = doc.create_quotation(customer)
    if not name:
        frappe.throw("Quotation creation did not return a quotation ID.")
    return {"quotation": name, "created": True}
