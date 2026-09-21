import React, { useEffect, useRef, useState } from 'react';
import { Building, Home, Zap, Trash2, ChevronDown } from 'lucide-react';
import houseImg from '../assets/new-house.png';
import { getAuthHeaders } from '../config';
import { getUnitFields, selectUnitRow, unitDetails, updateUnitRate, syncOnboardingServices, calculateBookingCharges } from './onboardingUnitFields';

const control = { width: '100%', padding: '6px 10px', fontSize: 11, minHeight: 32, borderRadius: 6, border: '1px solid #cbd5e1', background: '#f8fafc', color: '#334155', boxSizing: 'border-box' };
const cell = { padding: '8px 12px', color: '#475569' };
const money = value => `$${(Number(value) || 0).toLocaleString()}`;
const isProperty = p => !['service', 'services'].includes((p.land_and_building_type || '').toLowerCase().trim()) && !/service|security|cleaning|maintenance/i.test(p.name);

async function listRecords(url, doctype, filters, signal) {
  const all = [];
  for (let start = 0; ; start += 500) {
    const query = new URLSearchParams({ fields: '["*"]', filters: JSON.stringify(filters), order_by: 'name asc', limit_start: String(start), limit_page_length: '500' });
    const res = await fetch(`${url}/api/resource/${encodeURIComponent(doctype)}?${query}`, { credentials: 'include', headers: getAuthHeaders({ 'Content-Type': 'application/json' }), signal });
    if (!res.ok) throw new Error(`Could not load ${doctype} (${res.status}).`);
    const json = await res.json();
    if (!Array.isArray(json.data)) throw new Error(`Invalid ${doctype} response.`);
    all.push(...json.data);
    if (json.data.length < 500) return all;
  }
}

export function BookingPropertyFinder({ location, value, onChange, erpnextConfig, disabled }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [result, setResult] = useState({ key: '', groups: [], loading: false, error: '' });
  const root = useRef(null);
  const key = `${erpnextConfig?.url}:${location}`;
  useEffect(() => {
    const close = event => { if (!root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);
  useEffect(() => {
    if (!location || !erpnextConfig?.url) return;
    const controller = new AbortController();
    listRecords(erpnextConfig.url, 'Property Group', [['district', '=', location]], controller.signal)
      .then(groups => { if (!controller.signal.aborted) setResult({ key, groups: groups.filter(isProperty), loading: false, error: '' }); })
      .catch(error => { if (!controller.signal.aborted) setResult({ key, groups: [], loading: false, error: error.message }); });
    return () => controller.abort();
  }, [key, location, erpnextConfig?.url]);
  const current = result.key === key ? result : { groups: [], loading: !!location, error: '' };
  const selected = current.groups.find(p => p.name === value);
  const matches = current.groups.filter(p => [p.name, p.locality, p.district].some(text => (text || '').toLowerCase().includes(search.toLowerCase())));
  return (
    <div ref={root} onKeyDown={event => { if (event.key === 'Escape') setOpen(false); }} style={{ gridColumn: 'span 2', background: 'linear-gradient(120deg, #f0fdf4, #f8fafc 60%, #fff)', border: '1px solid #e2e8f0', borderLeft: '4px solid #10b981', borderRadius: 12, padding: '8px 15px 16px', position: 'relative', minHeight: 110, boxShadow: '0 4px 6px -1px rgba(0,0,0,.02)', zIndex: open ? 50 : 2 }}>
      <svg aria-hidden="true" viewBox="0 0 800 160" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}><path d="M-100 50 C150 -50 250 200 500 90 S650 -20 900 40" stroke="rgba(16,185,129,.09)" strokeWidth="5" fill="none" /><path d="M-50 100 C200 0 300 250 550 140 S700 0 950 90" stroke="rgba(16,185,129,.05)" strokeWidth="3" fill="none" /></svg>
      <img src={houseImg} alt="" style={{ position: 'absolute', right: 0, bottom: 0, height: '92%', maxWidth: '35%', objectFit: 'contain', opacity: .95, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', maxWidth: '65%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><span style={{ background: '#e6f4ea', borderRadius: '50%', padding: 7, display: 'flex' }}><Zap size={14} color="#137333" /></span><div><div style={{ fontSize: 13, fontWeight: 700, color: '#1f2937' }}>Property Unit Quick Finder</div><div style={{ fontSize: 11, color: '#6b7280' }}>Filter available units by location details</div></div></div>
        <div style={{ maxWidth: 300, position: 'relative' }}>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11, fontWeight: 600, color: '#4b5563', marginBottom: 8 }}><Building size={14} color="#137333" />Property Group</label>
          <button type="button" aria-label="Property Group" aria-expanded={open} disabled={disabled || !location || current.loading || !!current.error} onClick={() => setOpen(!open)} style={{ ...control, background: '#fff', minHeight: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}>
            <span>{selected ? `${selected.name}${selected.locality || selected.district ? ` (${[selected.locality, selected.district].filter(Boolean).join(', ')})` : ''}` : value || (!location ? 'Select a location first' : current.loading ? 'Loading...' : '-- Choose Property Group --')}</span><ChevronDown size={12} />
          </button>
          {open && <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#fff', border: '1px solid #cbd5e1', borderRadius: 8, boxShadow: '0 10px 15px -3px rgba(0,0,0,.1)', zIndex: 1000, overflow: 'hidden' }}>
            <div style={{ padding: 8, background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}><input autoFocus type="search" aria-label="Search property groups" placeholder="Search by name, district, locality..." value={search} onChange={event => setSearch(event.target.value)} style={{ ...control, background: '#fff' }} /></div>
            <div style={{ maxHeight: 190, overflowY: 'auto' }}>
              <button type="button" onClick={() => { onChange(''); setOpen(false); setSearch(''); }} style={{ ...control, border: 0, background: '#fff', textAlign: 'left' }}>-- Choose Property Group --</button>
              {matches.map(p => <button type="button" key={p.name} onClick={() => { onChange(p.name); setOpen(false); setSearch(''); }} style={{ display: 'block', width: '100%', padding: '8px 12px', border: 0, borderBottom: '1px solid #f1f5f9', textAlign: 'left', cursor: 'pointer', background: p.name === value ? '#f0f9ff' : '#fff' }}><span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1f2937' }}>{p.name}</span><span style={{ fontSize: 10, color: '#6b7280' }}>{[p.locality && `Locality: ${p.locality}`, p.district && `District: ${p.district}`].filter(Boolean).join(', ') || 'No location details'}</span></button>)}
              {!matches.length && <div style={{ padding: 12, fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>No matches found</div>}
            </div>
          </div>}
        </div>
        {current.error && <div role="alert" style={{ color: '#dc2626', fontSize: 12 }}>{current.error}</div>}
      </div>
    </div>
  );
}

export function BookingSelectedUnits({ field, fields, value, onChange, propertyGroup, location, erpnextConfig, getDocTypeFields }) {
  const map = getUnitFields(fields);
  const link = fields.find(f => f.fieldname === map.unit);
  const [result, setResult] = useState({ key: '', units: [], services: [], loading: false, error: '' });
  const key = `${erpnextConfig?.url}:${link?.options}:${propertyGroup}`;
  const rows = Array.isArray(value) && value.length ? value : [{}];
  useEffect(() => {
    if (!propertyGroup || !link || !erpnextConfig?.url) return;
    const controller = new AbortController();
    const load = async () => {
      try {
        const schema = await getDocTypeFields(link.options);
        const groupField = schema.find(f => f.fieldname === 'custom_property_group') || schema.find(f => f.fieldtype === 'Link' && f.options === 'Property Group');
        if (!groupField) throw new Error('The unit Property Group link could not be found.');
        const filters = [[groupField.fieldname, '=', propertyGroup]];
        if (link.options === 'Item') filters.push(['item_group', '=', 'Commercial']);
        const [units, services] = await Promise.all([
          listRecords(erpnextConfig.url, link.options, filters, controller.signal),
          listRecords(erpnextConfig.url, link.options, [['item_group', '=', 'Services'], ['custom_service_group', '=', 'Default Service'], ['disabled', '=', 0]], controller.signal)
        ]);
        if (!controller.signal.aborted) setResult({ key, units, services, loading: false, error: '' });
      } catch (error) {
        if (!controller.signal.aborted) setResult({ key, units: [], services: [], loading: false, error: error.message });
      }
    };
    load();
    return () => controller.abort();
    // The metadata loader is recreated by the parent; selections identify requests.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const current = result.key === key ? result : { units: [], services: [], loading: !!propertyGroup && !!link, error: '' };
  const commitRows = next => {
    const synced = syncOnboardingServices(next, fields, current.services, current.units);
    onChange(synced, calculateBookingCharges(synced, fields, current.services));
  };
  const update = (index, row) => commitRows(rows.map((old, i) => i === index ? row : old));
  const disabled = !!field.read_only;
  return (
    <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ background: '#e6f4ea', borderRadius: '50%', padding: 7, display: 'flex' }}><Home size={14} color="#137333" /></span><span style={{ fontSize: 14, fontWeight: 700 }}>Selected Units</span></div><button type="button" disabled={disabled || !map.unit || !propertyGroup || current.loading || !!current.error} onClick={() => commitRows([...rows, selectUnitRow(fields)])} style={{ padding: '6px 14px', fontSize: 11, fontWeight: 600, borderRadius: 8, background: 'transparent', color: '#137333', border: '1px solid #137333', cursor: 'pointer' }}>+ Add More Units</button></div>
      {(!map.unit || current.error) && <div role="alert" style={{ color: '#dc2626', fontSize: 12 }}>{current.error || 'Unable to find the Unit link in the onboarding table.'}</div>}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}><div style={{ overflow: 'auto', maxHeight: 260 }}><table style={{ width: '100%', minWidth: 850, borderCollapse: 'collapse', fontSize: 11, background: '#f8fafc' }}>
        <thead><tr>{['#', 'Unit Code', 'Val. Rate', 'Offered Rate', 'Property Group', 'District', 'Total Area (Sqft)', 'Amount', ''].map((title, i) => <th key={i} style={{ padding: '12px 10px', textAlign: 'left', color: '#475569', background: '#fff', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{title}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => {
          const id = row[map.unit] || '';
          const service = current.services.find(item => item.name === id);
          const detail = unitDetails(current.units.find(unit => unit.name === id));
          const rate = map.rate ? row[map.rate] ?? '' : detail.valuation;
          const amount = (Number(row[map.qty]) || 1) * (Number(rate) || 0);
          return <React.Fragment key={index}><tr style={{ borderBottom: '1px solid #e2e8f0', background: service ? '#faf5ff' : undefined }}>
            <td style={cell}>{index + 1}</td>
            <td style={{ padding: '6px 8px', minWidth: 170 }}>{service ? <div><div style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 700 }}>{service.item_name || service.name}<span style={{ fontSize: 9, color: '#7c3aed', background: '#ede9fe', padding: '3px 5px', borderRadius: 4 }}>Default Service</span></div><div style={{ fontSize: 9, color: '#64748b', marginTop: 4 }}>Rate: {money(service.charges)}/sqft × {row[map.area] || 0} sqft</div></div> : <select aria-label={`Unit ${index + 1}`} value={id} disabled={disabled || !map.unit || !propertyGroup || current.loading || !!current.error} onChange={event => { const doc = current.units.find(unit => unit.name === event.target.value); if (doc && rows.some((other, i) => i !== index && other[map.unit] === doc.name)) return; update(index, selectUnitRow(fields, doc, { name: propertyGroup, district: location }, row)); }} style={control}><option value="">{!propertyGroup ? 'Choose property group first' : current.loading ? 'Loading...' : '-- Choose Unit --'}</option>{id && !current.units.some(unit => unit.name === id) && <option value={id}>{id}</option>}{current.units.map(unit => { const added = rows.some((other, i) => i !== index && other[map.unit] === unit.name); return <option key={unit.name} value={unit.name} disabled={added}>{unit.item_name || unit.unit_name || unit.name}{added ? ' (Already Added)' : ''}</option>; })}</select>}</td>
            <td style={cell}>{id ? money(row[map.valuation] ?? detail.valuation) : '—'}</td>
            <td style={{ padding: '6px 8px', minWidth: 95 }}><div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>$<input aria-label={`Offered rate ${index + 1}`} type="number" min="0" step="any" value={id ? rate : ''} disabled={disabled || current.loading || !!current.error || !!service || !id || !map.rate || fields.find(f => f.fieldname === map.rate)?.read_only} onChange={event => update(index, updateUnitRate(row, map, event.target.value))} style={control} /></div></td>
            <td style={cell}>{id ? service ? 'Default Service' : row[map.group] || detail.group || propertyGroup : '—'}</td><td style={cell}>{id ? service ? '—' : row[map.district] || detail.district || location : '—'}</td><td style={cell}>{id ? `${row[map.area] || detail.area || 0} sqft` : '—'}</td><td style={{ ...cell, fontWeight: 700, textAlign: 'right', color: '#0f172a' }}>{money(amount)}</td>
            <td style={{ padding: 4 }}>{!service && rows.length > 1 && <button type="button" aria-label={`Remove unit ${index + 1}`} disabled={disabled || current.loading || !!current.error} onClick={() => commitRows(rows.filter((_, i) => i !== index))} style={{ border: 0, background: 'transparent', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>}</td>
          </tr></React.Fragment>;
        })}</tbody>
      </table></div></div>
      {propertyGroup && !current.loading && !current.error && current.units.length === 0 && <span style={{ fontSize: 12, color: '#64748b' }}>No units found for this property group.</span>}
      {!current.loading && !current.error && rows.some(row => row[map.unit]) && current.services.length === 0 && <span role="status" style={{ fontSize: 12, color: '#64748b' }}>No active Default Service Item found.</span>}
      {map.unit && !map.rate && <span style={{ fontSize: 12, color: '#64748b' }}>Offered rate is read-only because this onboarding table has no rate field.</span>}
    </div>
  );
}
