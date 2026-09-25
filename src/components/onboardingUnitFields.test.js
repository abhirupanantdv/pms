import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getUnitFields, selectUnitRow, updateUnitRate, syncOnboardingServices, calculateBookingCharges } from './onboardingUnitFields.js';

const fields = [
  { fieldname: 'unit', fieldtype: 'Link', options: 'Unit' },
  ...['valuation_rate', 'offered_rate', 'property_group', 'district', 'total_area', 'amount', 'qty', 'uom'].map(fieldname => ({ fieldname })),
  { fieldname: 'floor', fetch_from: 'unit.custom_floor' }
];
const doc = { name: 'UNIT-1', valuation_rate: 12, standard_rate: 20, custom_property_group: 'GROUP-1', custom_7average_carpet_area_of_units: 250, custom_floor: 'First', stock_uom: 'Sq Ft' };

test('unit selection uses quotation rates and area while preserving onboarding fetch fields', () => {
  const row = selectUnitRow(fields, doc, { name: 'GROUP-1', district: 'Suva' });
  assert.equal(row.unit, 'UNIT-1');
  assert.equal(row.valuation_rate, 12);
  assert.equal(row.offered_rate, 12);
  assert.equal(row.amount, 12);
  assert.equal(row.total_area, 250);
  assert.equal(row.district, 'Suva');
  assert.equal(row.floor, 'First');
  assert.equal(row.uom, 'Sq Ft');
  assert.ok(Object.keys(row).every(key => fields.some(field => field.fieldname === key)));
});

test('offered rate updates the saved amount using quotation quantity logic', () => {
  const row = selectUnitRow(fields, doc);
  const updated = updateUnitRate(row, getUnitFields(fields), '18.5');
  assert.equal(updated.amount, 18.5);
  assert.equal(updated.offered_rate, '18.5');
  assert.equal(row.offered_rate, 12);
  assert.equal(updateUnitRate({ ...row, qty: 3 }, getUnitFields(fields), '18.5').amount, 55.5);
});

test('offered rate can be blanked out to empty string without resetting', () => {
  const row = selectUnitRow(fields, doc);
  const cleared = updateUnitRate(row, getUnitFields(fields), '');
  assert.equal(cleared.offered_rate, '');
  assert.equal(cleared.rate, '');
  assert.equal(cleared.amount, 0);
  const synced = syncOnboardingServices([cleared], fields, [], [doc]);
  assert.equal(synced[0].offered_rate, '');
  assert.equal(synced[0].rate, '');
  assert.equal(synced[0].amount, 0);
});

test('custom labels map to real child field names without inventing payload fields', () => {
  const custom = [{ fieldname: 'item_code', fieldtype: 'Link', options: 'Item' }, { fieldname: 'custom_price', label: 'Offered Rate' }, { fieldname: 'custom_total_area_sqft', label: 'Total Area (Sqft)' }];
  const row = selectUnitRow(custom, doc);
  assert.deepEqual(row, { item_code: 'UNIT-1', custom_price: 12, custom_total_area_sqft: 250 });
});

test('clearing a unit clears dependent values and cannot restore a default unit', () => {
  const row = selectUnitRow([{ fieldname: 'unit', fieldtype: 'Link', options: 'Unit', default: 'OTHER-UNIT' }, ...fields.slice(1)]);
  assert.equal(row.unit, '');
  assert.equal(row.offered_rate, '');
  assert.equal(row.amount, '');
  assert.equal(row.floor, '');
});

test('changing a unit preserves user-entered onboarding extras but refreshes fetched values', () => {
  const schema = [...fields, { fieldname: 'notes' }];
  const row = selectUnitRow(schema, { ...doc, name: 'UNIT-2', custom_floor: 'Second' }, {}, { notes: 'Keep my fitout requirements', unit: 'UNIT-1', floor: 'First', offered_rate: 90 });
  assert.equal(row.notes, 'Keep my fitout requirements');
  assert.equal(row.unit, 'UNIT-2');
  assert.equal(row.floor, 'Second');
  assert.equal(row.offered_rate, 12);
});

const services = [
  { name: 'PROMO', item_name: 'Promotional Fees', charges: 0.1, stock_uom: 'Nos' },
  { name: 'SERVICE', item_name: 'Service Charges', charges: 1.64, stock_uom: 'Nos' }
];
test('default services match quotation: 500 sqft produces $50 and $820 after the unit', () => {
  const unit = { ...doc, custom_7average_carpet_area_of_units: 500 };
  const rows = syncOnboardingServices([selectUnitRow(fields, unit)], fields, services, [unit]);
  assert.deepEqual(rows.map(row => row.unit), ['UNIT-1', 'PROMO', 'SERVICE']);
  assert.deepEqual(rows.slice(1).map(row => row.offered_rate), [50, 820]);
  assert.deepEqual(rows.slice(1).map(row => row.amount), [50, 820]);
  assert.equal(rows[2].total_area, 500);
  assert.equal(rows[2].uom, 'Nos');
});
test('service rows recalculate for multiple units without duplicates and disappear when units are removed', () => {
  const first = { ...doc, custom_7average_carpet_area_of_units: 500 };
  const second = { ...doc, name: 'UNIT-2', custom_7average_carpet_area_of_units: 100 };
  const initial = syncOnboardingServices([selectUnitRow(fields, first)], fields, services, [first, second]);
  const next = syncOnboardingServices([...initial, selectUnitRow(fields, second)], fields, services, [first, second]);
  assert.deepEqual(next.map(row => row.unit), ['UNIT-1', 'UNIT-2', 'PROMO', 'SERVICE']);
  assert.equal(next[3].amount, 984);
  const removed = syncOnboardingServices(next.filter(row => row.unit !== 'UNIT-2'), fields, services, [first, second]);
  assert.equal(removed[2].amount, 820);
  const empty = syncOnboardingServices(removed.filter(row => row.unit !== 'UNIT-1'), fields, services, [first, second]);
  assert.equal(empty.length, 1);
  assert.equal(empty[0].unit, '');
});
test('hidden item details needed by onboarding are populated without extra inputs', () => {
  const schema = [...fields, ...['unit_name', 'item_name', 'conversion_factor', 'stock_qty'].map(fieldname => ({ fieldname }))];
  const row = selectUnitRow(schema, { ...doc, item_name: 'Shop 14' });
  assert.equal(row.unit_name, 'Shop 14');
  assert.equal(row.item_name, 'Shop 14');
  assert.equal(row.conversion_factor, 1);
  assert.equal(row.stock_qty, 1);
});

test('booking details total only default services for service charges and retain rental and deposit totals', () => {
  const rows = [{ unit: 'SHOP', amount: 2750 }, { unit: 'PROMO', amount: 50 }, { unit: 'SERVICE', amount: 820 }];
  assert.deepEqual(calculateBookingCharges(rows, fields, services), {
    service_promotional_charges: 870,
    rental_charges: 3620,
    security_deposit_booking_fee: 5500
  });
});

test('booking charges handle multiple units, decimal amounts, blank rows and clearing', () => {
  const rows = [{ unit: 'A', amount: '100.10' }, { unit: 'B', amount: '200.20' }, { unit: 'PROMO', amount: '10.05' }, { unit: '', amount: 999 }];
  assert.deepEqual(calculateBookingCharges(rows, fields, services), {
    service_promotional_charges: 10.05, rental_charges: 310.35, security_deposit_booking_fee: 600.6
  });
  assert.deepEqual(calculateBookingCharges([], fields, services), {
    service_promotional_charges: 0, rental_charges: 0, security_deposit_booking_fee: 0
  });
});

test('booking charges fall back to quantity times offered rate when there is no amount value', () => {
  assert.equal(calculateBookingCharges([{ unit: 'A', qty: 2, offered_rate: '12.25' }], fields, []).rental_charges, 24.5);
  assert.equal(calculateBookingCharges([{ unit: 'A', amount: 0, offered_rate: 100 }], fields, []).rental_charges, 0);
});
