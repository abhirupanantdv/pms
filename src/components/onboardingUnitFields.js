// Adapt quotation values to the actual onboarding child DocType fields.
export function getUnitFields(fields) {
  const normalize = name => (name || '').toLowerCase().replace(/^custom_/, '').replace(/[^a-z0-9]/g, '');
  const find = (...names) => {
    const normalized = names.map(normalize);
    return fields.find(f => names.includes(f.fieldname))?.fieldname ||
      fields.find(f => normalized.includes(normalize(f.fieldname)) || normalized.includes(normalize(f.label)))?.fieldname;
  };
  return {
    unit: fields.find(f => f.fieldtype === 'Link' && ['Unit', 'Item'].includes(f.options))?.fieldname,
    valuation: find('valuation_rate', 'standard_rate', 'val_rate', 'valuation_rate_monthly'),
    rate: find('offered_rate', 'rate', 'rental_rate'),
    group: fields.find(f => f.fieldtype === 'Link' && f.options === 'Property Group')?.fieldname || find('property_group', 'custom_property_group'),
    district: find('district', 'custom_district'),
    area: find('total_area', 'total_area_sqft', 'total_areasqm', 'carpet_area', 'area', 'total_area_sq_ft'),
    amount: find('amount', 'total_amount'),
    qty: find('qty', 'quantity'),
    uom: find('uom', 'stock_uom')
  };
}

export function unitDetails(doc = {}) {
  return {
    valuation: Number(doc.valuation_rate || doc.standard_rate || 0),
    group: doc.custom_property_group || doc.custom_property_reference || doc.property_group || '',
    district: doc.district || doc.custom_district || '',
    area: Number(doc.custom_7average_carpet_area_of_units || doc.total_area || doc.area_sqft || doc.area || 0),
    uom: doc.stock_uom || doc.uom || 'Sq Ft'
  };
}

export function selectUnitRow(fields, doc, group = {}, previousRow = {}) {
  const map = getUnitFields(fields);
  const detail = unitDetails(doc);
  const row = Object.fromEntries(fields.filter(f => f.fieldname && !['Section Break', 'Column Break', 'Tab Break', 'HTML', 'Button'].includes(f.fieldtype)).map(f => [f.fieldname, f.default ?? '']));
  Object.assign(row, previousRow);
  for (const field of fields) {
    if (field.fetch_from?.startsWith(`${map.unit}.`)) row[field.fieldname] = doc?.[field.fetch_from.slice(map.unit.length + 1)] ?? '';
    if (doc && ['item_name', 'unit_name', 'description', 'stock_uom', 'conversion_factor', 'stock_qty'].includes(field.fieldname)) {
      row[field.fieldname] = field.fieldname === 'unit_name' ? (doc.unit_name || doc.item_name || doc.name)
        : field.fieldname === 'conversion_factor' || field.fieldname === 'stock_qty' ? 1
          : doc[field.fieldname] || (field.fieldname === 'item_name' ? doc.name : '');
    }
  }
  const values = { unit: doc?.name || '', valuation: detail.valuation, rate: detail.valuation, group: detail.group || group.name || '', district: detail.district || group.district || '', area: detail.area, amount: detail.valuation, qty: 1, uom: detail.uom };
  for (const [key, fieldname] of Object.entries(map)) if (fieldname) row[fieldname] = doc ? values[key] : '';
  return row;
}

export function syncOnboardingServices(rows, fields, services, units) {
  const map = getUnitFields(fields);
  const serviceNames = new Set(services.map(service => service.name));
  const commercial = rows.filter(row => !serviceNames.has(row[map.unit]));
  let area = 0;
  let last = -1;
  commercial.forEach((row, index) => {
    if (!row[map.unit]) return;
    const doc = units.find(unit => unit.name === row[map.unit]);
    if (doc?.item_group && doc.item_group !== 'Commercial') return;
    area += Number(row[map.area]) || unitDetails(doc).area || 0;
    last = index;
  });
  if (last < 0) return commercial.length ? commercial : [selectUnitRow(fields)];
  const serviceRows = services.map(service => {
    const rate = Math.round(area * (Number(service.charges) || 0) * 100) / 100;
    const row = selectUnitRow(fields, { ...service, valuation_rate: rate, standard_rate: rate, stock_uom: service.stock_uom || 'Nos' });
    if (map.area) row[map.area] = area;
    // Display the service category in the table without writing a fabricated Link value.
    if (map.group && fields.find(field => field.fieldname === map.group)?.fieldtype !== 'Link') row[map.group] = 'Default Service';
    if (map.district) row[map.district] = '';
    return row;
  });
  return [...commercial.slice(0, last + 1), ...serviceRows, ...commercial.slice(last + 1)];
}

export function updateUnitRate(row, map, rate) {
  return { ...row, ...(map.rate ? { [map.rate]: rate } : {}), ...(map.amount ? { [map.amount]: (Number(row[map.qty]) || 1) * (Number(rate) || 0) } : {}) };
}

export function calculateBookingCharges(rows, fields, services) {
  const map = getUnitFields(fields);
  const serviceNames = new Set(services.map(service => service.name));
  let totalCents = 0;
  let unitCents = 0;
  for (const row of rows) {
    if (!row[map.unit]) continue;
    const savedAmount = row[map.amount];
    const amount = savedAmount !== undefined && savedAmount !== null && savedAmount !== ''
      ? Number(savedAmount) : (Number(row[map.qty]) || 1) * (Number(row[map.rate]) || 0);
    const cents = Number.isFinite(amount) ? Math.round((amount + Number.EPSILON) * 100) : 0;
    totalCents += cents;
    if (!serviceNames.has(row[map.unit])) unitCents += cents;
  }
  return {
    service_promotional_charges: (totalCents - unitCents) / 100,
    rental_charges: totalCents / 100,
    security_deposit_booking_fee: unitCents * 2 / 100
  };
}
