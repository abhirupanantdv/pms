import {
  getAuthHeaders,
  getApiBaseUrl,
  fetchWithTimeout,
  safeJson,
  cleanServerErrorMessage
} from '../config';

export const SIDEBAR_DOCTYPE_MAP = {
  properties: 'Property Group',
  'property-operations': 'Property Group',
  bookings: 'Property Booking',
  listings: 'Online Listing',
  'mall-3d': 'Property Group',
  owners: 'Supplier',
  contractors: 'Supplier',
  tenants: 'Customer',
  'tenant-onboarding': 'Tenant Onboarding',
  quotation: 'Quotation',
  invoices: 'Sales Invoice',
  'billing-ledger': 'Sales Invoice',
  billing: 'Sales Invoice',
  'payment-entry': 'Payment Entry',
  maintenance: 'Maintenance Schedule',
  'maintenance-schedule': 'Maintenance Schedule',
  'maintenance schedule': 'Maintenance Schedule',
  'maintenanceschedule': 'Maintenance Schedule',
  support: 'Issue',
  reports: 'Report',
  hrms: 'Employee',
  technicians: 'Employee',
  technician: 'Employee',
  employee: 'Employee',
  employees: 'Employee',
  vendors: 'Supplier',
  vendor: 'Supplier'
};

export const getDocTypeForSidebarOption = (optionOrDocType) => {
  if (!optionOrDocType) return 'Property Group';
  const raw = String(optionOrDocType).trim();
  const key = raw.toLowerCase();
  const hyphenKey = key.replace(/[\s_]+/g, '-');
  const spaceKey = key.replace(/[-_]+/g, ' ');
  return (
    SIDEBAR_DOCTYPE_MAP[key] ||
    SIDEBAR_DOCTYPE_MAP[hyphenKey] ||
    SIDEBAR_DOCTYPE_MAP[spaceKey] ||
    raw
  );
};

const DOCTYPE_DEFAULT_FIELDS = {
  'Property Group': [
    'name', 'land_and_building_type', 'legal_description', 'land_description',
    'lease_start_date', 'lease_end_date', 'locality', 'district', 'country',
    'no_of_floors', 'property_area', 'property_owner', 'external_tenant',
    'internal_tenant', 'custom_latitude', 'custom_longitude', 'creation', 'modified'
  ],
  Supplier: ['name', 'supplier_name', 'supplier_type', 'supplier_group', 'country', 'email_id', 'mobile_no', 'tax_id', 'creation', 'modified'],
  Customer: ['name', 'customer_name', 'customer_type', 'custom_type', 'customer_group', 'territory', 'email', 'phone_no', 'mobile_no', 'email_id', 'company_name', 'custom_company_vat_id', 'disabled', 'creation', 'modified'],
  'Maintenance Schedule': ['name', 'customer', 'customer_name', 'transaction_date', 'status', 'docstatus', 'company', 'creation', 'modified'],
  Employee: ['name', 'employee_name', 'department', 'designation', 'status', 'cell_number', 'personal_email', 'company_email', 'image', 'gender', 'creation', 'modified']
};

export function normalizeSupplier(doc) {
  if (!doc) return doc;
  const name = doc.supplier_name || doc.name || '';
  const email = doc.email_id || doc.email || '';
  const phone = doc.mobile_no || doc.phone || '';
  const type = doc.supplier_type || 'Company';
  const group = doc.supplier_group || 'Services';
  return {
    ...doc,
    id: doc.name || doc.id || '',
    name,
    supplier_name: name,
    email,
    email_id: email,
    phone,
    mobile_no: phone,
    type,
    supplier_type: type,
    group,
    supplier_group: group,
    address: doc.address_line1 || doc.address || 'Fiji',
    rating: doc.rating || 4.5,
    quotesCount: doc.quotes_count || 0
  };
}

export function normalizeCustomer(doc) {
  if (!doc) return doc;
  const name = doc.customer_name || doc.name || '';
  const email = doc.email || doc.email_id || doc.custom_email || '';
  const phone = doc.phone_no || doc.mobile_no || doc.phone || doc.custom_phone_no || '';
  const type = doc.custom_type || doc.customer_type || 'Individual';
  return {
    ...doc,
    id: doc.name || doc.id || '',
    name: doc.name || doc.id || '',
    customer_name: name,
    email,
    email_id: email,
    phone_no: phone,
    mobile_no: phone,
    custom_type: type,
    customer_type: type,
    customer_group: doc.customer_group || 'Commercial',
    territory: doc.territory || 'All Territories',
    disabled: doc.disabled ? 1 : 0
  };
}

export function normalizeMaintenanceSchedule(doc) {
  if (!doc) return doc;
  const id = doc.name || doc.id || '';
  const customer = doc.customer_name || doc.customer || '—';
  const firstItem = Array.isArray(doc.items) && doc.items.length > 0
    ? doc.items[0]
    : (Array.isArray(doc.schedules) && doc.schedules.length > 0 ? doc.schedules[0] : null);
  const unitName = firstItem?.item_name || firstItem?.item_code || doc.custom_unit || doc.unit_name || doc.item_name || doc.item_code || '—';
  const periodicity = firstItem?.periodicity || doc.periodicity || (doc.custom_maintenance_schedule === 'Adhoc Maintenance' ? 'Random' : 'Weekly');
  const type = doc.custom_maintenance_schedule || doc.maintenance_type || doc.type || (periodicity === 'Random' ? 'Adhoc Maintenance' : 'Scheduled Maintenance');
  const rawStatus = String(doc.status || '').toLowerCase();
  const status = doc.docstatus === 1 || rawStatus === 'submitted' ? 'Submitted' : (doc.docstatus === 2 || rawStatus === 'cancelled' ? 'Cancelled' : (rawStatus === 'completed' ? 'Completed' : (doc.status || 'Draft')));
  return {
    ...doc,
    id,
    name: id,
    customer,
    customer_name: customer,
    type,
    custom_maintenance_schedule: type,
    unit_name: unitName,
    unitName,
    periodicity,
    status
  };
}

export function normalizeEmployee(doc) {
  if (!doc) return doc;
  const id = doc.name || doc.id || '';
  const name = doc.employee_name || doc.name || id;
  const skill = doc.department || 'General Maintenance';
  const certs = doc.designation || 'Technician';
  const rawStatus = String(doc.status || '').toLowerCase();
  const availability = (rawStatus === 'active' || rawStatus === 'available') ? 'Available' : (doc.status || 'On Leave');
  return {
    ...doc,
    id,
    name,
    employee_name: name,
    skill,
    department: skill,
    certs,
    designation: certs,
    availability,
    status: doc.status || availability,
    phone: doc.cell_number || doc.mobile_no || doc.phone || '+679 000 0000',
    email: doc.company_email || doc.personal_email || doc.email || 'tech@carpenterestate.org',
    image: doc.image || ''
  };
}

export function normalizePropertyGroup(doc) {
  if (!doc) return doc;
  const id = doc.name || doc.reference_no || doc.id || '';
  const locality = doc.locality || '';
  const district = doc.district || '';
  const country = doc.country || 'Fiji';
  const derivedAddress = [locality, district, country].filter(Boolean).join(', ') || doc.address || '';
  const rawType = String(doc.land_and_building_type || doc.type || 'Commercial').toLowerCase();
  const normalizedType = rawType.includes('res') ? 'residential' : (rawType.includes('mall') ? 'mall' : 'commercial');
  return {
    ...doc,
    id,
    name: doc.property_name || doc.property_group_name || doc.name || id,
    address: doc.address || derivedAddress,
    type: normalizedType,
    land_and_building_type: doc.land_and_building_type || normalizedType,
    legal_description: doc.legal_description || '',
    land_description: doc.land_description || '',
    lease_start_date: doc.lease_start_date || '',
    lease_end_date: doc.lease_end_date || '2026-12-31',
    locality,
    district,
    country,
    no_of_floors: (doc.no_of_floors !== undefined && doc.no_of_floors !== null && doc.no_of_floors !== '')
      ? doc.no_of_floors
      : (doc.custom_no_of_floors !== undefined && doc.custom_no_of_floors !== null ? doc.custom_no_of_floors : ''),
    property_area: (doc.property_area !== undefined && doc.property_area !== null && doc.property_area !== '')
      ? doc.property_area
      : ((doc.custom_property_area !== undefined && doc.custom_property_area !== null && doc.custom_property_area !== '')
        ? doc.custom_property_area
        : ((doc.area !== undefined && doc.area !== null && doc.area !== '')
          ? doc.area
          : '')),
    area: (doc.area !== undefined && doc.area !== null && doc.area !== '')
      ? doc.area
      : ((doc.property_area !== undefined && doc.property_area !== null && doc.property_area !== '')
        ? doc.property_area
        : ((doc.custom_property_area !== undefined && doc.custom_property_area !== null && doc.custom_property_area !== '')
          ? doc.custom_property_area
          : '')),
    unitsCount: doc.units_count || doc.unitsCount || 0
  };
}

export async function fetchDocTypeList(doctypeOrOption, options = {}) {
  const doctype = getDocTypeForSidebarOption(doctypeOrOption);
  const page = Math.max(1, parseInt(options.page || 1, 10));
  const pageSize = Math.max(1, parseInt(options.pageSize || options.limit || 10, 10));
  const limitStart = (page - 1) * pageSize;
  const baseUrl = options.baseUrl || getApiBaseUrl();

  const fieldsToQuery = options.fields || DOCTYPE_DEFAULT_FIELDS[doctype] || ['*'];

  const queryParams = new URLSearchParams({
    fields: JSON.stringify(fieldsToQuery),
    limit_start: String(limitStart),
    limit_page_length: String(pageSize),
    order_by: options.orderBy || 'creation desc'
  });
  if (options.filters) {
    queryParams.append('filters', JSON.stringify(options.filters));
  }

  let data = [];
  let error = null;

  try {
    let res = await fetchWithTimeout(
      `${baseUrl}/api/resource/${encodeURIComponent(doctype)}?${queryParams.toString()}`,
      { credentials: 'include', headers: getAuthHeaders(options.headers || {}), signal: options.signal },
      15000
    );

    // If query failed (e.g. unknown column error in fields list), retry with safe fallback ['*']
    if (!res?.ok && Array.isArray(fieldsToQuery) && (fieldsToQuery[0] !== '*' || fieldsToQuery.length > 1)) {
      try {
        const fallbackParams = new URLSearchParams({
          fields: JSON.stringify(['*']),
          limit_start: String(limitStart),
          limit_page_length: String(pageSize),
          order_by: options.orderBy || 'creation desc'
        });
        if (options.filters) {
          fallbackParams.append('filters', JSON.stringify(options.filters));
        }
        const retryRes = await fetchWithTimeout(
          `${baseUrl}/api/resource/${encodeURIComponent(doctype)}?${fallbackParams.toString()}`,
          { credentials: 'include', headers: getAuthHeaders(options.headers || {}), signal: options.signal },
          15000
        );
        if (retryRes?.ok) {
          res = retryRes;
        }
      } catch (retryErr) { }
    }

    if (res?.ok) {
      const json = await safeJson(res);
      data = json?.data || json?.message || [];
    } else if (res) {
      const errJson = await safeJson(res, {});
      if (doctype === 'Quotation') {
        error = errJson?.message || errJson?.exception || (errJson?._server_messages ? errJson._server_messages : '') || (typeof errJson === 'string' ? errJson : JSON.stringify(errJson));
      } else {
        error = cleanServerErrorMessage(errJson);
      }
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      if (doctype === 'Quotation') {
        error = err?.message || String(err);
      } else {
        error = cleanServerErrorMessage(err);
      }
    }
  }

  const normalizers = {
    'Property Group': normalizePropertyGroup,
    Supplier: normalizeSupplier,
    Customer: normalizeCustomer,
    'Maintenance Schedule': normalizeMaintenanceSchedule,
    Employee: normalizeEmployee
  };
  if (normalizers[doctype]) {
    data = data.map(normalizers[doctype]);
  }

  const total = data.length < pageSize && page === 1 ? data.length : limitStart + data.length + (data.length === pageSize ? 1 : 0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return { data, total, page, pageSize, totalPages, doctype, hasMore: page < totalPages, error };
}

export const fetchDocTypeData = fetchDocTypeList;
export const commonDocTypeApi = fetchDocTypeList;
export const fetchSidebarDocTypeData = fetchDocTypeList;

export async function registerPropertyGroupApi(propertyData, baseUrl) {
  const url = baseUrl || getApiBaseUrl();

  const landAndBuildingTypeVal = propertyData.land_and_building_type ||
    propertyData.landAndBuildingType ||
    propertyData.property_type ||
    propertyData.type ||
    '';

  const preparedData = {
    ...propertyData,
    land_and_building_type: landAndBuildingTypeVal,
    property_owner: propertyData.property_owner || propertyData.propertyOwner || '',
    reference_no: propertyData.reference_no || propertyData.referenceNo || propertyData.name || '',
    legal_description: propertyData.legal_description || propertyData.legalDescription || '',
    lease_start_date: propertyData.lease_start_date || propertyData.leaseStartDate || '',
    lease_end_date: propertyData.lease_end_date || propertyData.leaseEndDate || '',
    no_of_floors: propertyData.no_of_floors ?? propertyData.noOfFloors,
    property_area: propertyData.property_area ?? propertyData.area
  };

  // 1. Try custom backend API in pms.api
  let useFallback = false;
  let customApiErr = null;

  try {
    const res = await fetchWithTimeout(`${url}/api/method/pms.api.register_property_group`, {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(preparedData)
    }, 20000);

    const json = await safeJson(res, null);

    if (res.ok) {
      const result = json?.message || json?.data || json;
      if (result?.status === 'error') {
        throw new Error(result.message || 'Failed to register property.');
      }
      return result?.data || result;
    }

    const errStr = JSON.stringify(json || {});
    if (
      res.status === 404 ||
      res.status === 501 ||
      errStr.includes('has no attribute') ||
      errStr.includes('Failed to get method') ||
      errStr.includes('Not Found')
    ) {
      useFallback = true;
    } else {
      let errMsg = '';
      if (json?._server_messages) {
        try {
          const msgs = JSON.parse(json._server_messages);
          if (Array.isArray(msgs) && msgs.length > 0) {
            const first = typeof msgs[0] === 'string' ? JSON.parse(msgs[0]) : msgs[0];
            errMsg = first.message || first.title || '';
          }
        } catch { }
      }
      if (!errMsg) {
        errMsg = json?.message?.message || json?.message || json?.exception || json?.exc || '';
      }
      customApiErr = errMsg;
    }
  } catch (err) {
    if (
      err.message?.includes('has no attribute') ||
      err.message?.includes('Failed to get method') ||
      err.message?.includes('404')
    ) {
      useFallback = true;
    } else {
      customApiErr = err.message;
    }
  }

  // 2. Seamless fallback to standard Frappe REST API
  if (useFallback) {
    const cleanPayload = {};
    const allowedFields = [
      'name', 'property_group_name', 'reference_no', 'property_owner', 'country',
      'land_and_building_type', 'locality', 'district', 'legal_description',
      'land_description', 'lease_start_date', 'lease_end_date', 'no_of_floors',
      'property_area', 'years_remaining', 'external_tenant', 'internal_tenant',
      'custom_latitude', 'custom_longitude', 'attachments', 'custom_attachments', 'image'
    ];
    for (const f of allowedFields) {
      if (preparedData[f] !== undefined && preparedData[f] !== null) {
        cleanPayload[f] = preparedData[f];
      }
    }
    if (landAndBuildingTypeVal) {
      cleanPayload.land_and_building_type = landAndBuildingTypeVal;
    }
    const propName = preparedData.property_group_name || preparedData.name || preparedData.reference_no;
    if (propName) {
      cleanPayload.name = propName;
      cleanPayload.property_group_name = propName;
    }

    const postRes = await fetchWithTimeout(`${url}/api/resource/Property%20Group`, {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(cleanPayload)
    }, 20000);

    const postJson = await safeJson(postRes, null);
    if (postRes.ok) {
      return postJson?.data || cleanPayload;
    }

    let postErr = '';
    if (postJson?._server_messages) {
      try {
        const msgs = JSON.parse(postJson._server_messages);
        const first = typeof msgs[0] === 'string' ? JSON.parse(msgs[0]) : msgs[0];
        postErr = first.message || first.title || '';
      } catch { }
    }
    if (!postErr) postErr = postJson?.message || postJson?.exception || '';
    throw new Error(cleanServerErrorMessage(postErr) || 'Failed to register property group.');
  }

  throw new Error(cleanServerErrorMessage(customApiErr) || 'Failed to register property group.');
}

export async function updatePropertyGroupApi(propertyId, propertyData, baseUrl) {
  const url = baseUrl || getApiBaseUrl();
  const landAndBuildingTypeVal = propertyData?.land_and_building_type ||
    propertyData?.landAndBuildingType ||
    propertyData?.property_type ||
    propertyData?.type ||
    '';
  const payload = {
    ...propertyData,
    land_and_building_type: landAndBuildingTypeVal,
    name: propertyId,
    property_id: propertyId,
    id: propertyId,
    reference_no: propertyData?.reference_no || propertyData?.referenceNo || propertyId
  };

  // 1. Try custom backend API in pms.api
  let useFallback = false;
  let customApiErr = null;

  try {
    const res = await fetchWithTimeout(`${url}/api/method/pms.api.update_property_group`, {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload)
    }, 20000);

    const json = await safeJson(res, null);

    if (res.ok) {
      const result = json?.message || json?.data || json;
      if (result?.status === 'error') {
        throw new Error(result.message || 'Failed to update property.');
      }
      return result?.data || result;
    }

    const errStr = JSON.stringify(json || {});
    if (
      res.status === 404 ||
      res.status === 501 ||
      errStr.includes('has no attribute') ||
      errStr.includes('Failed to get method') ||
      errStr.includes('Not Found')
    ) {
      useFallback = true;
    } else {
      let errMsg = '';
      if (json?._server_messages) {
        try {
          const msgs = JSON.parse(json._server_messages);
          if (Array.isArray(msgs) && msgs.length > 0) {
            const first = typeof msgs[0] === 'string' ? JSON.parse(msgs[0]) : msgs[0];
            errMsg = first.message || first.title || '';
          }
        } catch { }
      }
      if (!errMsg) {
        errMsg = json?.message?.message || json?.message || json?.exception || json?.exc || '';
      }
      customApiErr = errMsg;
    }
  } catch (err) {
    if (
      err.message?.includes('has no attribute') ||
      err.message?.includes('Failed to get method') ||
      err.message?.includes('404')
    ) {
      useFallback = true;
    } else {
      customApiErr = err.message;
    }
  }

  // 2. Seamless fallback to standard Frappe REST API (PUT /api/resource/Property Group/:name)
  if (useFallback) {
    const cleanPayload = {};
    const allowedFields = [
      'property_owner', 'country', 'land_and_building_type', 'locality', 'district',
      'legal_description', 'land_description', 'lease_start_date', 'lease_end_date',
      'no_of_floors', 'property_area', 'years_remaining', 'external_tenant',
      'internal_tenant', 'reference_no', 'property_group_name', 'attachments',
      'custom_attachments', 'image'
    ];
    for (const f of allowedFields) {
      if (payload[f] !== undefined && payload[f] !== null) {
        cleanPayload[f] = payload[f];
      }
    }

    const putRes = await fetchWithTimeout(
      `${url}/api/resource/Property%20Group/${encodeURIComponent(propertyId)}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(cleanPayload)
      },
      20000
    );

    const putJson = await safeJson(putRes, null);
    if (putRes.ok) {
      return putJson?.data || cleanPayload;
    }

    let putErr = '';
    if (putJson?._server_messages) {
      try {
        const msgs = JSON.parse(putJson._server_messages);
        const first = typeof msgs[0] === 'string' ? JSON.parse(msgs[0]) : msgs[0];
        putErr = first.message || first.title || '';
      } catch { }
    }
    if (!putErr) putErr = putJson?.message || putJson?.exception || '';
    throw new Error(cleanServerErrorMessage(putErr) || 'Failed to update property group.');
  }

  throw new Error(cleanServerErrorMessage(customApiErr) || 'Failed to update property group.');
}

export const registerPropertyApi = registerPropertyGroupApi;
export const updatePropertyApi = updatePropertyGroupApi;

/**
 * Default fallback payload matching https://pms.advtinni.com/api/method/get_monthly_approved_booking_count
 */
export const DEFAULT_MONTHLY_APPROVED_BOOKINGS_RESPONSE = {
  "success": true,
  "Total Approved Bookings": 34,
  "Monthly Approved Bookings": [
    {
      "Month": "September 2026",
      "Month Key": "2026-09",
      "Approved Booking Count": 18
    },
    {
      "Month": "October 2026",
      "Month Key": "2026-10",
      "Approved Booking Count": 8
    },
    {
      "Month": "November 2026",
      "Month Key": "2026-11",
      "Approved Booking Count": 8
    }
  ],
  "Total Sales Invoices": 22,
  "Total Invoice Status": {
    "Paid": 8,
    "Unpaid": 0,
    "Overdue": 14,
    "Partly Paid": 0
  },
  "Monthly Invoice Status": [
    {
      "Month": "September 2026",
      "Month Key": "2026-09",
      "Status": "Overdue",
      "Invoice Count": 4
    },
    {
      "Month": "September 2026",
      "Month Key": "2026-09",
      "Status": "Paid",
      "Invoice Count": 2
    },
    {
      "Month": "October 2026",
      "Month Key": "2026-10",
      "Status": "Overdue",
      "Invoice Count": 6
    },
    {
      "Month": "November 2026",
      "Month Key": "2026-11",
      "Status": "Overdue",
      "Invoice Count": 4
    },
    {
      "Month": "November 2026",
      "Month Key": "2026-11",
      "Status": "Paid",
      "Invoice Count": 6
    }
  ]
};

/**
 * Normalizes Monthly Invoice Status response for stacked bar chart presentation.
 * Returns grouped months, totals, and breakdown per status.
 */
export function normalizeMonthlyInvoiceStatus(response) {
  let raw = response;
  if (raw && typeof raw === 'object') {
    if (raw.message !== undefined) raw = raw.message;
    if (raw && typeof raw === 'object' && raw.data !== undefined) raw = raw.data;
  }
  if (!raw || typeof raw !== 'object') {
    raw = DEFAULT_MONTHLY_APPROVED_BOOKINGS_RESPONSE;
  }

  const monthlyList = raw['Monthly Invoice Status'] || raw.monthly_invoice_status || [];
  const totalStatus = raw['Total Invoice Status'] || raw.total_invoice_status || {};
  const totalSalesInvoices = Number(raw['Total Sales Invoices'] ?? raw.total_sales_invoices ?? 0);

  const CALENDAR_MONTHS = [
    { name: 'January', short: 'Jan', num: '01', index: 0 },
    { name: 'February', short: 'Feb', num: '02', index: 1 },
    { name: 'March', short: 'Mar', num: '03', index: 2 },
    { name: 'April', short: 'Apr', num: '04', index: 3 },
    { name: 'May', short: 'May', num: '05', index: 4 },
    { name: 'June', short: 'Jun', num: '06', index: 5 },
    { name: 'July', short: 'Jul', num: '07', index: 6 },
    { name: 'August', short: 'Aug', num: '08', index: 7 },
    { name: 'September', short: 'Sep', num: '09', index: 8 },
    { name: 'October', short: 'Oct', num: '10', index: 9 },
    { name: 'November', short: 'Nov', num: '11', index: 10 },
    { name: 'December', short: 'Dec', num: '12', index: 11 }
  ];

  // Detect target year from API data or default to current year
  let targetYear = null;
  if (Array.isArray(monthlyList)) {
    for (const item of monthlyList) {
      if (!item) continue;
      const str = `${item['Month Key'] || ''} ${item['Month'] || ''} ${item['month_key'] || ''} ${item['month'] || ''}`;
      const match = str.match(/\b(20\d\d)\b/);
      if (match) {
        targetYear = match[1];
        break;
      }
    }
  }
  if (!targetYear) {
    targetYear = String(new Date().getFullYear());
  }

  // Prepopulate all 12 calendar months with 0 count
  const monthsMap = new Map();
  CALENDAR_MONTHS.forEach(m => {
    const monthKey = `${targetYear}-${m.num}`;
    monthsMap.set(monthKey, {
      month: `${m.name} ${targetYear}`,
      shortMonth: `${m.short} ${targetYear}`,
      monthKey,
      monthIndex: m.index,
      statuses: {},
      totalCount: 0
    });
  });

  // Helper to map incoming item to the appropriate monthKey
  const resolveMonthKey = (item) => {
    const rawKey = String(item['Month Key'] || item['month_key'] || '').trim();
    const rawMonth = String(item['Month'] || item['month'] || '').trim();

    // 1. Direct key match (e.g. "2026-09")
    if (monthsMap.has(rawKey)) return rawKey;

    // 2. YYYY-MM match
    const keyMatch = rawKey.match(/(\d{4})-(\d{2})/);
    if (keyMatch) {
      const candidate = `${targetYear}-${keyMatch[2]}`;
      if (monthsMap.has(candidate)) return candidate;
    }

    // 3. Month name / abbreviation match
    const combined = `${rawMonth} ${rawKey}`.toLowerCase();
    for (const m of CALENDAR_MONTHS) {
      if (combined.includes(m.name.toLowerCase()) || combined.includes(m.short.toLowerCase())) {
        return `${targetYear}-${m.num}`;
      }
    }

    return rawKey || rawMonth;
  };

  if (Array.isArray(monthlyList)) {
    monthlyList.forEach(item => {
      if (!item) return;
      const key = resolveMonthKey(item);
      const status = String(item['Status'] || item['status'] || 'Unknown').trim();
      const count = Number(item['Invoice Count'] ?? item['invoice_count'] ?? item['count'] ?? 0);

      if (!monthsMap.has(key)) {
        const rawMonth = item['Month'] || item['month'] || key;
        monthsMap.set(key, {
          month: rawMonth,
          shortMonth: rawMonth,
          monthKey: key,
          statuses: {},
          totalCount: 0
        });
      }

      const mData = monthsMap.get(key);
      mData.statuses[status] = (mData.statuses[status] || 0) + count;
      mData.totalCount += count;
    });
  }

  const months = Array.from(monthsMap.values());
  const maxMonthTotal = months.reduce((max, m) => Math.max(max, m.totalCount), 0) || 1;

  return {
    months,
    maxMonthTotal,
    totalStatus,
    totalSalesInvoices: totalSalesInvoices || months.reduce((sum, m) => sum + m.totalCount, 0),
    raw
  };
}

/**
 * Normalizes monthly approved booking count response from ERPNext API.
 * Guarantees all 12 months ('Jan' through 'Dec') exist in the returned dictionary,
 * defaulting any missing months to 0.
 */
export function normalizeMonthlyApprovedBookings(response) {
  const result = {
    Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
    Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
  };

  if (!response) return result;

  let raw = response;
  // Unwrap nested Frappe message / data envelopes
  if (raw && typeof raw === 'object') {
    if (raw.message !== undefined) raw = raw.message;
    if (raw && typeof raw === 'object' && raw.data !== undefined) raw = raw.data;
  }
  if (!raw) return result;

  const monthAliases = {
    'jan': 'Jan', 'january': 'Jan', '1': 'Jan', '01': 'Jan',
    'feb': 'Feb', 'february': 'Feb', '2': 'Feb', '02': 'Feb',
    'mar': 'Mar', 'march': 'Mar', '3': 'Mar', '03': 'Mar',
    'apr': 'Apr', 'april': 'Apr', '4': 'Apr', '04': 'Apr',
    'may': 'May', '5': 'May', '05': 'May',
    'jun': 'Jun', 'june': 'Jun', '6': 'Jun', '06': 'Jun',
    'jul': 'Jul', 'july': 'Jul', '7': 'Jul', '07': 'Jul',
    'aug': 'Aug', 'august': 'Aug', '8': 'Aug', '08': 'Aug',
    'sep': 'Sep', 'sept': 'Sep', 'september': 'Sep', '9': 'Sep', '09': 'Sep',
    'oct': 'Oct', 'october': 'Oct', '10': 'Oct',
    'nov': 'Nov', 'november': 'Nov', '11': 'Nov',
    'dec': 'Dec', 'december': 'Dec', '12': 'Dec'
  };

  const resolveMonth = (v) => {
    if (v === null || v === undefined) return null;
    const s = String(v).trim().toLowerCase();
    if (monthAliases[s]) return monthAliases[s];
    const isoMatch = s.match(/^\d{4}-(\d{1,2})/);
    if (isoMatch && isoMatch[1]) {
      const num = String(parseInt(isoMatch[1], 10));
      if (monthAliases[num]) return monthAliases[num];
    }
    const prefix = s.slice(0, 3);
    if (monthAliases[prefix]) return monthAliases[prefix];
    return null;
  };

  const resolveCount = (v) => {
    if (v === null || v === undefined) return 0;
    if (typeof v === 'number') return isNaN(v) ? 0 : v;
    if (typeof v === 'string') {
      const num = parseFloat(v);
      return isNaN(num) ? 0 : num;
    }
    if (typeof v === 'object') {
      const candidate =
        v['Approved Booking Count'] ??
        v['approved booking count'] ??
        v['Approved_Booking_Count'] ??
        v['approved_booking_count'] ??
        v['Booking Count'] ??
        v['booking count'] ??
        v['Count'] ??
        v['count'] ??
        v.count ??
        v.approved_count ??
        v.booking_count ??
        v.approved_bookings ??
        v.approved ??
        v.active_bookings ??
        v.bookings ??
        v.total ??
        v.value;
      if (candidate !== undefined && candidate !== null) {
        const num = parseFloat(candidate);
        return isNaN(num) ? 0 : num;
      }
    }
    return 0;
  };

  // 1. If response contains 'Monthly Approved Bookings' list
  let targetList = null;
  if (raw && typeof raw === 'object') {
    if (Array.isArray(raw['Monthly Approved Bookings'])) {
      targetList = raw['Monthly Approved Bookings'];
    } else if (Array.isArray(raw['monthly_approved_bookings'])) {
      targetList = raw['monthly_approved_bookings'];
    } else if (Array.isArray(raw)) {
      targetList = raw;
    }
  }

  if (targetList) {
    targetList.forEach(item => {
      if (!item) return;
      if (Array.isArray(item)) {
        const m = resolveMonth(item[0]);
        if (m) result[m] += resolveCount(item[1]);
      } else if (typeof item === 'object') {
        const rawMonth =
          item['Month Key'] ??
          item['month key'] ??
          item['Month'] ??
          item['month'] ??
          item.month ??
          item.month_name ??
          item.month_key ??
          item.period ??
          item.date ??
          item.name ??
          item.label ??
          item.m;
        const m = resolveMonth(rawMonth);
        if (m) result[m] += resolveCount(item);
      }
    });
  } else if (typeof raw === 'object') {
    Object.entries(raw).forEach(([k, v]) => {
      const m = resolveMonth(k);
      if (m) result[m] += resolveCount(v);
    });
  }

  return result;
}

/**
 * Fetches raw monthly approved booking and invoice analytics payload from ERPNext backend.
 * Primary endpoint: https://pms.advtinni.com/api/method/get_monthly_approved_booking_count
 */
export async function getMonthlyApprovedBookingRawApi(year = null) {
  const baseUrl = getApiBaseUrl();
  const query = year ? `?year=${encodeURIComponent(year)}` : '';
  const endpoints = [
    `${baseUrl}/api/method/get_monthly_approved_booking_count${query}`,
    `https://pms.advtinni.com/api/method/get_monthly_approved_booking_count${query}`,
    `${baseUrl}/api/method/pms.api.get_monthly_approved_booking_count${query}`
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetchWithTimeout(ep, {
        method: 'GET',
        credentials: 'include',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' })
      }, 15000);

      if (res.ok) {
        const json = await safeJson(res, null);
        if (json) {
          let payload = json;
          if (payload && typeof payload === 'object') {
            if (payload.message !== undefined) payload = payload.message;
            if (payload && typeof payload === 'object' && payload.data !== undefined) payload = payload.data;
          }
          return payload || DEFAULT_MONTHLY_APPROVED_BOOKINGS_RESPONSE;
        }
      }
    } catch {
      // try next endpoint fallback
    }
  }

  return DEFAULT_MONTHLY_APPROVED_BOOKINGS_RESPONSE;
}

/**
 * Fetches monthly approved booking count from ERPNext backend.
 * Primary endpoint: https://pms.advtinni.com/api/method/get_monthly_approved_booking_count
 */
export async function getMonthlyApprovedBookingCountApi(year = null) {
  const raw = await getMonthlyApprovedBookingRawApi(year);
  return normalizeMonthlyApprovedBookings(raw);
}


/**
 * Default fallback payload matching https://pms.advtinni.com/api/method/get_property_group_total
 */
export const DEFAULT_PROPERTY_GROUP_TOTAL = {
  "success": true,
  "Property Groups Total": 45,
  "Unit Total": 94,
  "Current Month Paid Sales Invoice Grand Total": 1089.4,
  "Maintenance Schedule Draft Total": 28,
  "Property Groups By District": [
    { "District": "Ba", "Property Groups": ["F86", "F93", "AZ35"], "Total": 3 },
    { "District": "Bua", "Property Groups": ["AGS97"], "Total": 1 },
    { "District": "Kadavu", "Property Groups": ["A905", "QN35"], "Total": 2 },
    { "District": "Labasa", "Property Groups": ["L335"], "Total": 1 },
    { "District": "Lautoka", "Property Groups": ["F96", "L334", "ABC121"], "Total": 3 },
    { "District": "Levuka", "Property Groups": ["F95", "F157"], "Total": 2 },
    { "District": "Lomaiviti", "Property Groups": ["AZ99", "ADP00", "APX99"], "Total": 3 },
    { "District": "Nadi", "Property Groups": ["AS70", "L222", "L297", "L332", "L342", "ASD11", "GLOBAL SITE"], "Total": 7 },
    { "District": "Pacific Harbor", "Property Groups": ["F94", "F155"], "Total": 2 },
    { "District": "Suva", "Property Groups": ["F31", "F60", "2145", "F106", "F148", "F153", "F154", "F156", "L322", "L340", "L341", "L345", "L348", "L357", "SC95", "Globe Mall"], "Total": 16 },
    { "District": "Tailevu", "Property Groups": ["F7", "F92", "L250", "L289", "L290"], "Total": 5 }
  ],
  "Booking Status Counts": {
    "Request For Approval": 7,
    "Approved": 34,
    "Waiting For Contract Submit": 11,
    "Rejected": 3,
    "Cancel": 3,
    "Drafted": 1
  },
  "Quotation Status Counts": {
    "Draft": 58,
    "Cancelled": 76,
    "Open": 10,
    "Expired": 70
  },
  "Tenant Onboarding Status Counts": {
    "Approved": 53,
    "Drafted": 10,
    "Pending for Approval": 2
  },
  "Task Status Counts": {
    "Completed": 30,
    "Open": 20,
    "Working": 4,
    "Overdue": 13
  }
};

/**
 * Fetches dashboard summary from https://pms.advtinni.com/api/method/get_property_group_total
 */
export async function getPropertyGroupsTotalApi() {
  const baseUrl = getApiBaseUrl();
  const endpoints = [
    `${baseUrl}/api/method/get_property_group_total`,
    `https://pms.advtinni.com/api/method/get_property_group_total`,
    `${baseUrl}/api/method/pms.api.get_property_group_total`
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetchWithTimeout(ep, {
        method: 'GET',
        credentials: 'include',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' })
      }, 15000);

      if (res.ok) {
        const json = await safeJson(res, null);
        if (json?.message) return json.message;
        if (json?.data) return json.data;
        if (json?.['Property Groups Total'] !== undefined) return json;
      }
    } catch {
      // try next endpoint fallback
    }
  }

  return DEFAULT_PROPERTY_GROUP_TOTAL;
}



