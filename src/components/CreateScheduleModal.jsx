import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  X,
  CheckCircle,
  AlertTriangle,
  User,
  ClipboardList,
  Clock,
  Building,
  Plus,
  Check,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { getAuthHeaders } from '../config';

const getTodayStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const resolveSchedStartDate = (val) => {
  const today = getTodayStr();
  if (!val) return today;
  if (val >= today) return val;
  return today;
};

const resolveSchedEndDate = (endVal, startVal) => {
  if (!endVal) return '';
  const today = getTodayStr();
  const effectiveStart = resolveSchedStartDate(startVal);
  const minAllowed = effectiveStart > today ? effectiveStart : today;
  if (endVal < minAllowed) {
    return minAllowed;
  }
  return endVal;
};

const isFee = (str) => {
  const s = (str || '').toString().trim().toLowerCase();
  return (
    s === 'promotional fee' ||
    s === 'service charge' ||
    s === 'security deposit' ||
    s === 'booking fee' ||
    s === 'advance amount' ||
    s.includes('promotional fee') ||
    s.includes('service charge')
  );
};

export default function CreateScheduleModal({
  isOpen,
  onClose,
  initialBookingId,
  initialIssue,
  tenants = [],
  properties = [],
  bookings = [],
  erpnextConfig,
  onCreateSchedule,
  onSuccess
}) {
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [submittingSchedule, setSubmittingSchedule] = useState(false);
  const [scheduleStatusMessage, setScheduleStatusMessage] = useState(null);

  // Form states
  const [schedCustomer, setSchedCustomer] = useState('');
  const [schedCustomerName, setSchedCustomerName] = useState('');
  const [customMaintenanceSchedule, setCustomMaintenanceSchedule] = useState('Scheduled Maintenance');
  const [schedBookingId, setSchedBookingId] = useState('');
  const [schedProperty, setSchedProperty] = useState('');
  const [schedPropertyGroup, setSchedPropertyGroup] = useState('');
  const [schedTransDate, setSchedTransDate] = useState(getTodayStr());
  const [bookingUnits, setBookingUnits] = useState([]);
  const [schedItems, setSchedItems] = useState([
    {
      itemCode: '',
      itemName: '',
      propertyGroup: '',
      startDate: getTodayStr(),
      periodicity: 'Weekly',
      noOfVisits: 1,
      endDate: '',
      bookingId: ''
    }
  ]);

  const isAdhocMaintenance = customMaintenanceSchedule === 'Adhoc Maintenance';

  // Fetch Booking details when modal opens
  useEffect(() => {
    if (!isOpen) {
      setScheduleStatusMessage(null);
      return;
    }

    const bookingId = initialBookingId || initialIssue?.booking_number || initialIssue?.custom_booking_id || initialIssue?.custom_booking_number;

    const loadBookingData = async () => {
      setLoadingBooking(true);
      setScheduleStatusMessage(null);

      let bookingDoc = null;

      // 1. Try to fetch fresh Booking details by Booking ID from ERPNext
      if (bookingId && erpnextConfig?.url) {
        try {
          const res = await fetch(`${erpnextConfig.url}/api/resource/Booking/${encodeURIComponent(bookingId)}`, {
            credentials: 'include',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' })
          });
          if (res.ok) {
            const json = await res.json();
            bookingDoc = json.data || json;
          }
        } catch (err) {
          console.warn('Failed to fetch complete booking details by Booking ID:', err);
        }
      }

      // 2. Fallback to in-memory bookings if API failed or offline
      if (!bookingDoc && bookingId && bookings?.length) {
        bookingDoc = bookings.find(b => b.name === bookingId || b.id === bookingId || b.value === bookingId);
      }

      // 3. Resolve customer / tenant
      const custVal = bookingDoc?.customer || bookingDoc?.customer_name || initialIssue?.customerId || initialIssue?.tenantName || '';
      const matchedTenant = tenants.find(t => t.id === custVal || t.name === custVal || t.customer_name === custVal);
      const custDisplayName = bookingDoc?.customer_name || matchedTenant?.customer_name || matchedTenant?.name || bookingDoc?.customer || initialIssue?.tenantName || initialIssue?.customer_name1 || custVal;

      setSchedCustomer(custVal);
      setSchedCustomerName(custDisplayName);
      setSchedBookingId(bookingDoc?.name || bookingId || '');

      let bProp = bookingDoc?.property || bookingDoc?.custom_property || initialIssue?.propertyId || '';
      if (bProp === 'PROP-2041') bProp = '';
      if (bProp && properties && properties.length > 0) {
        const isValid = properties.some(p => p.id === bProp || p.name === bProp);
        if (!isValid) {
          bProp = '';
        }
      }
      const bPropGroup = bookingDoc?.property_group || bookingDoc?.custom_property_group || '';
      setSchedProperty(bProp);
      setSchedPropertyGroup(bPropGroup);
      setSchedTransDate(getTodayStr());
      setCustomMaintenanceSchedule('Scheduled Maintenance');

      // 4. Extract unit items from booking_item child table and doc fields
      const bStartDate = bookingDoc?.start_date || bookingDoc?.starting_date || getTodayStr();
      const bEndDate = bookingDoc?.end_date || bookingDoc?.ending_date || '';
      const startD = resolveSchedStartDate(bStartDate);
      const endD = resolveSchedEndDate(bEndDate, startD);

      const bItems = Array.isArray(bookingDoc?.booking_item) ? bookingDoc.booking_item : [];
      const unitItems = bItems.filter(item => {
        const code = (item.item_code || item.name || '').toString().trim();
        const name = (item.item_name || item.name || '').toString().trim();
        if (!code && !name) return false;
        if (isFee(code) || isFee(name)) return false;
        return true;
      });

      const extractedUnits = [];
      const seen = new Set();

      if (unitItems.length > 0) {
        unitItems.forEach(item => {
          const uCode = item.item_code || item.name;
          const uName = item.item_name || item.name || uCode;
          if (!seen.has(uCode)) {
            seen.add(uCode);
            extractedUnits.push({
              item_code: uCode,
              item_name: uName,
              property_group: item.property_group || bPropGroup,
              booking_id: bookingDoc?.name || bookingId || '',
              start_date: startD,
              end_date: endD
            });
          }
        });
      }

      // Check document-level unit fields
      const docUnit = bookingDoc?.property_unit || bookingDoc?.unit || bookingDoc?.unit_code || bookingDoc?.unit_name;
      if (docUnit && !isFee(docUnit) && !seen.has(docUnit)) {
        seen.add(docUnit);
        extractedUnits.push({
          item_code: docUnit,
          item_name: bookingDoc.unit_name || docUnit,
          property_group: bPropGroup,
          booking_id: bookingDoc?.name || bookingId || '',
          start_date: startD,
          end_date: endD
        });
      }

      setBookingUnits(extractedUnits);

      // Populate schedItems with the extracted units
      if (extractedUnits.length > 0) {
        setSchedItems(extractedUnits.map(unit => ({
          itemCode: unit.item_code,
          itemName: unit.item_name,
          propertyGroup: unit.property_group || bPropGroup || '',
          startDate: startD,
          periodicity: 'Weekly',
          noOfVisits: 1,
          endDate: endD,
          bookingId: unit.booking_id
        })));
      } else {
        setSchedItems([{
          itemCode: bookingDoc?.property_unit || bookingDoc?.unit || '',
          itemName: bookingDoc?.unit_name || bookingDoc?.property_unit || '',
          propertyGroup: bPropGroup || '',
          startDate: startD,
          periodicity: 'Weekly',
          noOfVisits: 1,
          endDate: endD,
          bookingId: bookingDoc?.name || bookingId || ''
        }]);
      }

      setLoadingBooking(false);
    };

    loadBookingData();
  }, [isOpen, initialBookingId, initialIssue, erpnextConfig?.url, bookings, tenants, properties]);

  // Handle Maintenance Type Change
  const handleMaintenanceTypeChange = (typeVal) => {
    setCustomMaintenanceSchedule(typeVal);
    const isAdhoc = typeVal === 'Adhoc Maintenance';
    setSchedItems(prev => prev.map(r => ({
      ...r,
      periodicity: isAdhoc ? 'Random' : (r.periodicity === 'Random' ? 'Weekly' : r.periodicity || 'Weekly'),
      noOfVisits: isAdhoc ? 1 : (r.noOfVisits || 1)
    })));
  };

  // Add unit row
  const handleAddSchedUnit = () => {
    const unadded = bookingUnits.find(bu => !schedItems.some(si => si.itemCode === (bu.item_code || bu.name)));
    const baseStart = unadded?.start_date || schedItems[0]?.startDate || getTodayStr();
    const baseEnd = unadded?.end_date || schedItems[0]?.endDate || '';
    const startD = resolveSchedStartDate(baseStart);
    const endD = resolveSchedEndDate(baseEnd, startD);

    setSchedItems(prev => [
      ...prev,
      {
        itemCode: unadded?.item_code || '',
        itemName: unadded?.item_name || unadded?.item_code || '',
        propertyGroup: unadded?.property_group || schedPropertyGroup || '',
        startDate: startD,
        periodicity: isAdhocMaintenance ? 'Random' : 'Weekly',
        noOfVisits: 1,
        endDate: endD,
        bookingId: schedBookingId
      }
    ]);
  };

  // Add all units from booking
  const handleAddAllBookingUnits = () => {
    if (!bookingUnits.length) return;
    setSchedItems(bookingUnits.map(unit => {
      const startD = resolveSchedStartDate(unit.start_date);
      const endD = resolveSchedEndDate(unit.end_date, startD);
      return {
        itemCode: unit.item_code,
        itemName: unit.item_name,
        propertyGroup: unit.property_group || schedPropertyGroup || '',
        startDate: startD,
        periodicity: isAdhocMaintenance ? 'Random' : 'Weekly',
        noOfVisits: 1,
        endDate: endD,
        bookingId: unit.booking_id || schedBookingId
      };
    }));
  };

  // Handle unit change in row
  const handleSchedItemCodeChange = (idx, value) => {
    let chosenCode = value;
    let chosenBookingId = schedBookingId;
    if (value && value.includes('::')) {
      const parts = value.split('::');
      chosenBookingId = parts[0];
      chosenCode = parts[1];
    }

    const matchedUnit = bookingUnits.find(u => (u.item_code || u.name) === chosenCode);
    setSchedItems(prev => prev.map((r, i) => {
      if (i !== idx) return r;
      return {
        ...r,
        itemCode: chosenCode,
        itemName: matchedUnit?.item_name || chosenCode,
        propertyGroup: matchedUnit?.property_group || r.propertyGroup || schedPropertyGroup || '',
        bookingId: chosenBookingId || r.bookingId,
        startDate: resolveSchedStartDate(matchedUnit?.start_date || r.startDate),
        endDate: resolveSchedEndDate(matchedUnit?.end_date || r.endDate, matchedUnit?.start_date || r.startDate)
      };
    }));
  };

  // Submit Handler
  const handleCreateScheduleSubmit = async (e) => {
    e.preventDefault();
    setSubmittingSchedule(true);
    setScheduleStatusMessage(null);

    const today = getTodayStr();
    for (const r of schedItems) {
      if (!r.itemCode) {
        setScheduleStatusMessage({ type: 'error', text: 'Please specify a Unit Code for all scheduled items.' });
        setSubmittingSchedule(false);
        return;
      }
      const sDate = resolveSchedStartDate(r.startDate);
      if (sDate < today) {
        setScheduleStatusMessage({ type: 'error', text: 'Start Date cannot be before today.' });
        setSubmittingSchedule(false);
        return;
      }
      if (r.endDate) {
        if (r.endDate < sDate || r.endDate < today) {
          setScheduleStatusMessage({ type: 'error', text: `End Date cannot be before Start Date (${sDate}) and today.` });
          setSubmittingSchedule(false);
          return;
        }
      }
    }

    const payload = {
      customer: schedCustomer,
      customer_name: schedCustomerName || schedCustomer,
      transaction_date: schedTransDate || today,
      custom_booking_id: schedBookingId,
      custom_property_group: schedPropertyGroup,
      property_group: schedPropertyGroup,
      status: 'Draft',
      custom_maintenance_schedule: customMaintenanceSchedule,
      items: schedItems.map(r => {
        const sDate = resolveSchedStartDate(r.startDate);
        const eDate = resolveSchedEndDate(r.endDate, sDate);
        return {
          item_code: r.itemCode,
          item_name: r.itemName || r.itemCode,
          property_group: r.propertyGroup || schedPropertyGroup || '',
          custom_property_group: r.propertyGroup || schedPropertyGroup || '',
          start_date: sDate,
          periodicity: isAdhocMaintenance ? 'Random' : (r.periodicity || 'Weekly'),
          no_of_visits: isAdhocMaintenance ? 1 : (Number(r.noOfVisits) || 1),
          end_date: eDate
        };
      })
    };

    if (schedProperty && schedProperty !== 'PROP-2041') {
      payload.custom_property = schedProperty;
    }

    try {
      let createdDoc = null;
      if (onCreateSchedule) {
        try {
          createdDoc = await onCreateSchedule(payload);
        } catch (firstErr) {
          // If creation failed due to LinkValidationError on Property, auto-retry without custom_property
          if (firstErr.message && (firstErr.message.includes('Could not find Property') || firstErr.message.includes('Property')) && payload.custom_property) {
            const retryPayload = { ...payload };
            delete retryPayload.custom_property;
            createdDoc = await onCreateSchedule(retryPayload);
          } else {
            throw firstErr;
          }
        }
      } else if (erpnextConfig?.url) {
        let res = await fetch(`${erpnextConfig.url}/api/resource/Maintenance%20Schedule`, {
          method: 'POST',
          credentials: 'include',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(payload)
        });
        if (!res.ok && payload.custom_property) {
          try {
            const errClone = res.clone();
            const errText = await errClone.text();
            if (errText.includes('Could not find Property') || errText.includes('Property') || errText.includes('LinkValidationError')) {
              const retryPayload = { ...payload };
              delete retryPayload.custom_property;
              res = await fetch(`${erpnextConfig.url}/api/resource/Maintenance%20Schedule`, {
                method: 'POST',
                credentials: 'include',
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(retryPayload)
              });
            }
          } catch { }
        }
        if (!res.ok) {
          const errText = await res.text();
          let parsedMsg = errText;
          try {
            const errJson = JSON.parse(errText);
            if (errJson._server_messages) {
              const smsgs = JSON.parse(errJson._server_messages);
              parsedMsg = smsgs.map(m => {
                try { return JSON.parse(m).message; } catch { return String(m); }
              }).join(', ');
            } else if (errJson.exception) {
              parsedMsg = errJson.exception;
            }
          } catch { }
          throw new Error(parsedMsg || 'Failed to create Maintenance Schedule on server');
        }
        const json = await res.json();
        createdDoc = json.data || json;
      }

      setScheduleStatusMessage({ type: 'success', text: 'Maintenance Schedule created successfully!' });
      if (onSuccess) onSuccess(createdDoc);

      setTimeout(() => {
        setScheduleStatusMessage(null);
        onClose();
      }, 1200);
    } catch (err) {
      setScheduleStatusMessage({ type: 'error', text: err.message || 'Error creating maintenance schedule' });
    } finally {
      setSubmittingSchedule(false);
    }
  };

  if (!isOpen) return null;

  const thStyle = {
    padding: '8px 10px',
    textAlign: 'left',
    fontWeight: 600,
    fontSize: 11,
    color: 'var(--text-secondary, #6b7280)',
    borderBottom: '1px solid var(--border-color)',
    whiteSpace: 'nowrap'
  };

  const inputStyle = {
    width: '100%',
    fontSize: 12,
    minHeight: 32,
    padding: '5px 8px',
    boxSizing: 'border-box'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div className="modal-content" style={{
        maxWidth: 880,
        width: '96vw',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh',
        borderRadius: 16,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        background: 'var(--bg-primary, #ffffff)'
      }}>
        {/* Modal Header */}
        <div className="modal-header" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: 'var(--bg-accent-alpha, rgba(6, 95, 70, 0.1))',
              color: 'var(--brand-color, #065f46)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CalendarIcon size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                Create Maintenance Schedule
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
                Configure preventative maintenance visits and recurring service schedules.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submittingSchedule}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--bg-tertiary, #f1f5f9)',
              border: 'none',
              color: 'var(--text-secondary, #64748b)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleCreateScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '24px', overflowY: 'auto', flex: 1 }}>
            {loadingBooking && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(2, 132, 199, 0.08)',
                border: '1px solid rgba(2, 132, 199, 0.2)',
                color: '#0284c7',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 500
              }}>
                <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Fetching booking details and unit configuration...</span>
              </div>
            )}

            {scheduleStatusMessage && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: scheduleStatusMessage.type === 'success' ? 'rgba(6,95,70,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${scheduleStatusMessage.type === 'success' ? 'rgba(6,95,70,0.2)' : 'rgba(239,68,68,0.2)'}`,
                color: scheduleStatusMessage.type === 'success' ? '#065f46' : '#ef4444',
                padding: '12px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500
              }}>
                {scheduleStatusMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                <span>{scheduleStatusMessage.text}</span>
              </div>
            )}

            {/* Single-Row Balanced Header Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px 16px' }}>
              {/* Tenant Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User size={13} style={{ color: 'var(--brand-color, #065f46)' }} />
                  Tenant Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  className="form-select"
                  required
                  value={schedCustomer}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSchedCustomer(val);
                    const match = tenants.find(t => t.id === val || t.name === val);
                    setSchedCustomerName(match?.customer_name || match?.name || val);
                  }}
                  disabled={submittingSchedule || loadingBooking}
                  style={{ height: 38, fontSize: 13, borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', padding: '0 12px' }}
                >
                  <option value="">-- Choose Tenant --</option>
                  {schedCustomer && !tenants.some(t => t.id === schedCustomer || t.name === schedCustomer) && (
                    <option value={schedCustomer}>{schedCustomerName || schedCustomer}</option>
                  )}
                  {tenants.map(customer => (
                    <option key={customer.name || customer.id} value={customer.name || customer.id}>
                      {customer.customer_name || customer.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Maintenance Type */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ClipboardList size={13} style={{ color: 'var(--brand-color, #065f46)' }} />
                  Maintenance Type <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  className="form-select"
                  required
                  value={customMaintenanceSchedule || ''}
                  onChange={(e) => handleMaintenanceTypeChange(e.target.value)}
                  disabled={submittingSchedule}
                  style={{ height: 38, fontSize: 13, borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', padding: '0 12px' }}
                >
                  <option value="Scheduled Maintenance">Scheduled Maintenance</option>
                  <option value="Adhoc Maintenance">Adhoc Maintenance</option>
                </select>
              </div>

              {/* Linked Booking */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={13} style={{ color: 'var(--brand-color, #065f46)' }} />
                  Linked Booking
                  {bookingUnits.length > 0 && (
                    <span style={{ fontSize: 10, background: 'var(--bg-accent-alpha, rgba(6, 95, 70, 0.1))', color: 'var(--brand-color, #065f46)', padding: '1px 6px', borderRadius: 10, fontWeight: 600, marginLeft: 4 }}>
                      {bookingUnits.length} {bookingUnits.length === 1 ? 'Unit' : 'Units'}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={schedBookingId || ''}
                  placeholder={loadingBooking ? 'Fetching booking...' : 'No linked booking'}
                  readOnly
                  className="form-input"
                  disabled
                  style={{
                    height: 38,
                    fontSize: 13,
                    boxSizing: 'border-box',
                    background: 'var(--bg-tertiary, #f8fafc)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 6,
                    padding: '0 12px',
                    color: schedBookingId ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: 600
                  }}
                />
              </div>
            </div>

            {/* Scheduled Items & Units Child Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Scheduled Items & Units</label>
                  <span style={{ fontSize: 11, background: 'var(--bg-accent-alpha, rgba(6, 95, 70, 0.1))', color: 'var(--brand-color, #065f46)', padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>
                    {schedItems.length} {schedItems.length === 1 ? 'item' : 'items'}
                  </span>
                  {bookingUnits && bookingUnits.length > 1 && (
                    <span style={{ fontSize: 11, background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>
                      {bookingUnits.length} units available for this booking
                    </span>
                  )}
                </div>
                {bookingUnits && bookingUnits.length > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {schedItems.length < bookingUnits.length && (
                      <button
                        type="button"
                        onClick={handleAddAllBookingUnits}
                        disabled={submittingSchedule}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'var(--brand-color, #065f46)',
                          background: 'var(--bg-accent-alpha, rgba(6, 95, 70, 0.08))',
                          border: '1px solid var(--brand-color, #065f46)',
                          borderRadius: 6,
                          padding: '5px 10px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        title="Add all units from this booking at once"
                      >
                        <Check size={13} />
                        Add All Units ({bookingUnits.length})
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleAddSchedUnit}
                      disabled={submittingSchedule}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#ffffff',
                        background: 'var(--brand-color, #065f46)',
                        border: 'none',
                        borderRadius: 6,
                        padding: '5px 12px',
                        cursor: 'pointer',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                        transition: 'all 0.15s ease'
                      }}
                      title="Add unit to schedule"
                    >
                      <Plus size={14} />
                      Add Unit
                    </button>
                  </div>
                )}
              </div>

              <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                <div style={{ overflowX: 'auto', maxHeight: 280, overflowY: 'auto' }}>
                  <table style={{ width: '100%', minWidth: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: 12 }}>
                    <colgroup>
                      {isAdhocMaintenance ? (
                        <>
                          <col style={{ width: '25%' }} />
                          <col style={{ width: '25%' }} />
                          <col style={{ width: '20%' }} />
                          <col style={{ width: '13%' }} />
                          <col style={{ width: '13%' }} />
                          <col style={{ width: '4%' }} />
                        </>
                      ) : (
                        <>
                          <col style={{ width: '18%' }} />
                          <col style={{ width: '17%' }} />
                          <col style={{ width: '17%' }} />
                          <col style={{ width: '14%' }} />
                          <col style={{ width: '13%' }} />
                          <col style={{ width: '8%' }} />
                          <col style={{ width: '10%' }} />
                          <col style={{ width: '3%' }} />
                        </>
                      )}
                    </colgroup>
                    <thead>
                      <tr style={{ background: 'var(--bg-tertiary, #f8fafc)', position: 'sticky', top: 0, zIndex: 1, borderBottom: '1px solid var(--border-color)' }}>
                        {(isAdhocMaintenance
                          ? ['Unit Code', 'Unit Name', 'Property Group', 'Start Date', 'End Date', '']
                          : ['Unit Code', 'Unit Name', 'Property Group', 'Start Date', 'Periodicity', 'No. of Visits', 'End Date', '']
                        ).map((h, i, arr) => {
                          const isLast = i === arr.length - 1;
                          const isVisits = !isAdhocMaintenance && i === 5;
                          return (
                            <th
                              key={i}
                              style={{
                                ...thStyle,
                                textTransform: 'uppercase',
                                letterSpacing: '0.03em',
                                fontSize: 11,
                                fontWeight: 600,
                                padding: isVisits ? '10px 4px' : '10px 8px',
                                textAlign: isVisits || isLast ? 'center' : 'left',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {h}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {schedItems.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: idx < schedItems.length - 1 ? '1px solid var(--border-color)' : 'none', background: idx % 2 === 0 ? 'transparent' : 'var(--bg-tertiary, rgba(0,0,0,0.015))' }}>
                          <td style={{ padding: '8px 10px' }}>
                            {bookingUnits.length === 0 ? (
                              <input
                                type="text"
                                value={row.itemCode}
                                onChange={(e) => handleSchedItemCodeChange(idx, e.target.value)}
                                placeholder="Enter unit code"
                                className="form-input"
                                style={{ ...inputStyle, height: 32, borderRadius: 6, border: '1px solid var(--border-color)' }}
                              />
                            ) : (
                              <select
                                value={
                                  row.bookingId && row.itemCode
                                    ? `${row.bookingId}::${row.itemCode}`
                                    : row.itemCode
                                }
                                onChange={(e) => handleSchedItemCodeChange(idx, e.target.value)}
                                className="form-select"
                                required
                                style={{ ...inputStyle, height: 32, borderRadius: 6, border: '1px solid var(--border-color)', fontWeight: 500 }}
                              >
                                <option value="">-- Select Unit --</option>
                                {bookingUnits.map((u, uIdx) => {
                                  const uCode = u.item_code || u.name;
                                  const optVal = u.booking_id ? `${u.booking_id}::${uCode}` : uCode;
                                  const isAddedInOtherRow = schedItems.some((r, i) => i !== idx && r.itemCode === uCode);
                                  return (
                                    <option key={`bu-${optVal}-${uIdx}`} value={optVal}>
                                      {uCode}{u.item_name && u.item_name !== uCode ? ` · ${u.item_name}` : ''}{isAddedInOtherRow ? ' (Added)' : ''}
                                    </option>
                                  );
                                })}
                              </select>
                            )}
                          </td>
                          <td style={{ padding: '8px 10px', color: 'var(--text-secondary, #6b7280)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {row.itemName || (row.itemCode ? '…' : '—')}
                          </td>
                          <td style={{ padding: '8px 10px', color: 'var(--text-secondary, #6b7280)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {row.propertyGroup || schedPropertyGroup || (row.itemCode ? '…' : '—')}
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <input
                              type="date"
                              min={getTodayStr()}
                              value={resolveSchedStartDate(row.startDate)}
                              onChange={(e) => {
                                const val = e.target.value;
                                const today = getTodayStr();
                                const finalStart = val && val < today ? today : val;
                                setSchedItems(prev => prev.map((r, i) => {
                                  if (i !== idx) return r;
                                  const newEndDate = (r.endDate && r.endDate < finalStart) ? finalStart : r.endDate;
                                  return { ...r, startDate: finalStart, endDate: newEndDate };
                                }));
                              }}
                              className="form-input"
                              required
                              style={{ ...inputStyle, height: 32, borderRadius: 6, border: '1px solid var(--border-color)' }}
                            />
                          </td>
                          {!isAdhocMaintenance && (
                            <>
                              <td style={{ padding: '8px 10px' }}>
                                <select
                                  value={row.periodicity}
                                  onChange={(e) => setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, periodicity: e.target.value } : r))}
                                  className="form-select"
                                  required
                                  style={{ ...inputStyle, height: 32, borderRadius: 6, border: '1px solid var(--border-color)' }}
                                >
                                  <option value="Weekly">Weekly</option>
                                  <option value="Monthly">Monthly</option>
                                  <option value="Quarterly">Quarterly</option>
                                  <option value="Half Yearly">Half Yearly</option>
                                  <option value="Yearly">Yearly</option>
                                  <option value="Random">Random</option>
                                </select>
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                <input
                                  type="number"
                                  min="1"
                                  value={row.noOfVisits}
                                  onChange={(e) => setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, noOfVisits: Number(e.target.value) || 1 } : r))}
                                  className="form-input"
                                  required
                                  style={{ ...inputStyle, height: 32, textAlign: 'center', borderRadius: 6, border: '1px solid var(--border-color)' }}
                                />
                              </td>
                            </>
                          )}
                          <td style={{ padding: '8px 10px' }}>
                            <input
                              type="date"
                              min={resolveSchedStartDate(row.startDate) > getTodayStr() ? resolveSchedStartDate(row.startDate) : getTodayStr()}
                              value={resolveSchedEndDate(row.endDate, row.startDate)}
                              onChange={(e) => {
                                const val = e.target.value;
                                const today = getTodayStr();
                                const currentStart = resolveSchedStartDate(row.startDate);
                                const minAllowed = currentStart > today ? currentStart : today;
                                let finalEnd = val;
                                if (val && val < minAllowed) {
                                  finalEnd = minAllowed;
                                }
                                setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, endDate: finalEnd } : r));
                              }}
                              className="form-input"
                              required
                              style={{ ...inputStyle, height: 32, borderRadius: 6, border: '1px solid var(--border-color)' }}
                            />
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => setSchedItems(prev => prev.filter((_, i) => i !== idx))}
                              disabled={schedItems.length <= 1}
                              title="Remove item"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 28,
                                height: 28,
                                borderRadius: 6,
                                border: 'none',
                                background: 'transparent',
                                color: schedItems.length <= 1 ? 'var(--text-muted)' : '#ef4444',
                                cursor: schedItems.length <= 1 ? 'not-allowed' : 'pointer',
                                opacity: schedItems.length <= 1 ? 0.35 : 1,
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {bookingUnits && bookingUnits.length > 1 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 14px',
                    background: 'var(--bg-tertiary, #f8fafc)',
                    borderTop: '1px solid var(--border-color)',
                    fontSize: 12,
                    color: 'var(--text-secondary)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>
                        Booking <strong>{schedBookingId}</strong> has <strong>{bookingUnits.length} units</strong> ({schedItems.length} selected)
                      </span>
                    </div>
                    {schedItems.length < bookingUnits.length ? (
                      <button
                        type="button"
                        onClick={handleAddSchedUnit}
                        disabled={submittingSchedule}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'var(--brand-color, #065f46)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px 6px'
                        }}
                      >
                        <Plus size={13} />
                        Add next unit
                      </button>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--brand-color, #065f46)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Check size={13} /> All {bookingUnits.length} units added
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer" style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 10,
            padding: '16px 24px',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            flexShrink: 0
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submittingSchedule}
              style={{ padding: '8px 18px', borderRadius: 6, fontSize: 13 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submittingSchedule || loadingBooking}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 20px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600
              }}
            >
              {submittingSchedule ? (
                <>
                  <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  Creating...
                </>
              ) : (
                <>
                  <Check size={14} />
                  Create Maintenance Schedule
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
