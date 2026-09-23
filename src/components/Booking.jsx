
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar, User, Building, DollarSign, Plus, X, Search, Filter, Loader, Eye, RefreshCw, CheckCircle2, FileText, PenLine, ChevronDown, AlertCircle, CheckCircle, XCircle, Printer, Mail, Phone, Tag, Settings, AlertTriangle, Info } from 'lucide-react';
import homeImg from '../assets/home.png';
import houseImg from '../assets/new-house.png';
import billingSummaryImg from '../assets/Billing-summary.png';
import { getAuthHeaders, getCsrfToken } from '../config';

// Lightweight toast system — no external deps, self-contained styles/animation.
let toastIdCounter = 0;

export default function Booking({ erpnextConfig, initialSearchTerm = '', onClearInitialSearch }) {
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [currency, setCurrency] = useState('FJD');
  const [spaceUnits, setSpaceUnits] = useState([]);
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [updatingDates, setUpdatingDates] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Dynamic fields state from DocType metadata
  const [bookingFields, setBookingFields] = useState([]);
  const [loadingFields, setLoadingFields] = useState(false);

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [customerFilter, setCustomerFilter] = useState('');

  // New booking form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  // Approval workflow state
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [contractTemplates, setContractTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [templateDetails, setTemplateDetails] = useState(null);
  const [loadingTemplateDetails, setLoadingTemplateDetails] = useState(false);
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signedByName, setSignedByName] = useState('');
  const [approving, setApproving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [workflowTransitions, setWorkflowTransitions] = useState([]);
  const [approveError, setApproveError] = useState('');
  const previewRef = useRef(null);
  const fetchedDetailsRef = useRef(new Set());
  // Alert / Confirmation Modal state
  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    message: '',
    type: 'info', // 'error' | 'success' | 'warning' | 'info'
    confirmText: 'Got It',
    cancelText: 'Cancel',
    showCancel: false,
    isDestructive: false,
    onConfirm: null,
    onCancel: null
  });

  const showAlertModal = useCallback((title, message, type = 'info', confirmText = 'Got It') => {
    setAlertModal({
      show: true,
      title,
      message,
      type,
      confirmText,
      cancelText: 'Cancel',
      showCancel: false,
      isDestructive: false,
      onConfirm: null,
      onCancel: null
    });
  }, []);

  const showConfirmModal = useCallback(({
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false,
    onConfirm,
    onCancel = null
  }) => {
    setAlertModal({
      show: true,
      title,
      message,
      type: isDestructive ? 'warning' : 'info',
      confirmText,
      cancelText,
      showCancel: true,
      isDestructive,
      onConfirm,
      onCancel
    });
  }, []);

  // Extract clean backend validation error messages from Frappe/ERPNext
  const extractBackendErrorMessage = (errData, rawText = '') => {
    let msg = '';

    // 1. Check _server_messages (standard frappe.throw output)
    if (errData && errData._server_messages) {
      try {
        const msgs = JSON.parse(errData._server_messages);
        if (Array.isArray(msgs) && msgs.length > 0) {
          try {
            const firstParsed = JSON.parse(msgs[0]);
            msg = firstParsed.message || firstParsed.error || msgs[0];
          } catch {
            msg = msgs[0];
          }
        }
      } catch {
        msg = errData._server_messages;
      }
    }

    // 2. Check exception or exc or message
    if (!msg && errData) {
      if (errData.exception) msg = errData.exception;
      else if (errData.exc) {
        try {
          const excArr = JSON.parse(errData.exc);
          msg = Array.isArray(excArr) ? excArr[0] : errData.exc;
        } catch {
          msg = errData.exc;
        }
      } else if (errData.message && typeof errData.message === 'string') {
        msg = errData.message;
      }
    }

    // 3. Fallback to rawText
    if (!msg && rawText) {
      try {
        const parsed = JSON.parse(rawText);
        return extractBackendErrorMessage(parsed, '');
      } catch {
        msg = rawText;
      }
    }

    if (!msg) return 'Failed to update booking dates on ERPNext.';

    // Clean traceback & exceptions
    let clean = String(msg);
    if (clean.includes('Traceback (most recent call last):') || clean.includes('Traceback')) {
      const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);
      const errorLine = lines.reverse().find(l =>
        l.includes('Error:') || l.includes('Exception:') || (!l.startsWith('File') && !l.startsWith('^') && !l.includes('in application'))
      );
      if (errorLine) clean = errorLine;
    }

    clean = clean.replace(/^[a-zA-Z0-9._]+Error:\s*/i, '');
    clean = clean.replace(/^[a-zA-Z0-9._]+Exception:\s*/i, '');
    clean = clean.replace(/^ValidationError:\s*/i, '');

    // Convert HTML line breaks to real breaks, remove HTML tags
    clean = clean.replace(/<br\s*[\/]?>/gi, '\n');
    clean = clean.replace(/<[^>]*>/g, '').trim();

    return clean;
  };

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message) => {
    const id = ++toastIdCounter;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);

    // Also display in modal as requested: "every alert message show in modal"
    showAlertModal(
      type === 'error' ? 'Notice / Error' : type === 'success' ? 'Success' : 'Notification',
      message,
      type === 'error' ? 'error' : type === 'success' ? 'success' : 'info',
      'OK'
    );
  }, [showAlertModal]);

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = selectedBookingId ? 6 : 10;

  // Initial mock data if connection fails or starts empty
  const mockBookings = [
    {
      name: 'BOOK-0001',
      booking_date: '2026-06-10',
      customer: 'CUST-0001',
      customer_name: 'Biswajit Maity',
      customer_email: 'biswajit@example.com',
      customer_phone_no: '+679 999 1234',
      property: 'Suva Retail Complex - Suite 102',
      booking_type: 'Rent',
      status: 'Confirmed',
      payment_status: 'Paid',
      booking_amount: 1500.00,
      paid_amount: 1500.00,
      pending_amount: 0.00,
      starting_date: '2026-07-01',
      ending_date: '2027-06-30',
      total_days: '365',
      advance_amount: 500.00,
      payment_method: 'Bank Transfer',
      booking_item: [
        { item_code: 'UNIT-102', item_name: 'Suva Retail Complex - Suite 102', uom: 'Month', qty: 1, rate: 1500.00, amount: 1500.00, discount_amount: 150.00, total_areasqm: 500 }
      ]
    },
    {
      name: 'BOOK-0002',
      booking_date: '2026-06-11',
      customer: 'CUST-0002',
      customer_name: 'Jane Doe',
      customer_email: 'jane.doe@example.com',
      customer_phone_no: '+679 888 5678',
      property: 'Nadi Residential Villa - Unit A',
      booking_type: 'Lease',
      status: 'Pending',
      payment_status: 'Partially Paid',
      booking_amount: 2500.00,
      paid_amount: 1000.00,
      pending_amount: 1500.00,
      starting_date: '2026-08-01',
      ending_date: '2028-07-31',
      total_days: '730',
      advance_amount: 1000.00,
      payment_method: 'Credit Card',
      booking_item: [
        { item_code: 'UNIT-A', item_name: 'Nadi Residential Villa - Unit A', uom: 'Month', qty: 1, rate: 2500.00, amount: 2500.00, discount_amount: 200.00, total_areasqm: 650 }
      ]
    }
  ];

  const normalizeBookingItems = (payload) => {
    const candidates = [
      payload?.booking_item,
      payload?.data?.booking_item,
      payload?.message?.booking_item,
      payload?.data?.data?.booking_item
    ];

    const items = candidates.find(Array.isArray);
    if (Array.isArray(items)) {
      return items.filter(item => item && (item.item_code || item.name));
    }

    return [];
  };

  // Fetch DocType fields metadata to construct dynamic form
  const fetchDocTypeFields = async () => {
    if (!erpnextConfig || !erpnextConfig.url) return;
    setLoadingFields(true);
    try {
      let rawFields = [];
      try {
        const res = await fetch(`${erpnextConfig.url}/api/resource/DocType/Booking`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (res.ok) {
          const json = await res.json();
          rawFields = json.data?.fields || [];
        }
      } catch (e) { }

      if (rawFields.length === 0) {
        try {
          const res2 = await fetch(`${erpnextConfig.url}/api/method/frappe.desk.form.load.getdoctype?doctype=Booking`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });
          if (res2.ok) {
            const json2 = await res2.json();
            rawFields = json2.docs?.[0]?.fields || json2.message?.docs?.[0]?.fields || [];
          }
        } catch (e2) { }
      }

      if (rawFields.length > 0) {
        // Filter relevant writable fields
        const filtered = rawFields.filter(f =>
          f.fieldname &&
          f.label &&
          f.fieldtype !== 'Section Break' &&
          f.fieldtype !== 'Column Break' &&
          f.fieldtype !== 'Table' &&
          f.fieldtype !== 'Heading' &&
          !f.read_only &&
          f.fieldname !== 'amended_from' &&
          f.fieldname !== 'workflow_state'
        );
        setBookingFields(filtered);

        // Initialize default form data
        const defaults = {};
        filtered.forEach(f => {
          defaults[f.fieldname] = f.default || '';
        });
        setFormData(defaults);
      }
    } catch (err) {
      console.warn('Failed to fetch Booking DocType fields:', err);
    } finally {
      setLoadingFields(false);
    }
  };

  // Fetch Space Units (Items) to get carpet area / specs for commercial units
  const fetchSpaceUnits = async () => {
    if (!erpnextConfig || !erpnextConfig.url) return;
    try {
      const filters = encodeURIComponent(JSON.stringify([["item_group", "=", "Commercial"]]));
      let url = `${erpnextConfig.url}/api/resource/Item?fields=["name","item_name","standard_rate","valuation_rate","custom_property_group","custom_property_reference","stock_uom","custom_floor","item_group","custom_7average_carpet_area_of_units"]&filters=${filters}&limit_page_length=500`;
      let res = await fetch(url, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        url = `${erpnextConfig.url}/api/resource/Item?fields=["name","item_name","standard_rate","valuation_rate","custom_property_group","custom_property_reference","stock_uom","custom_floor","item_group","custom_7average_carpet_area_of_units"]&limit_page_length=500`;
        res = await fetch(url, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (res.ok) {
        const json = await res.json();
        setSpaceUnits(json.data || []);
      }
    } catch (e) {
      console.warn('Failed fetching Space Units (Items):', e);
    }
  };

  // Fetch bookings list, falling back to resource endpoint or mock data
  const fetchBookings = async (cust = '') => {
    setLoadingList(true);
    setErrorMsg('');
    if (fetchedDetailsRef.current) {
      fetchedDetailsRef.current.clear();
    }
    try {
      let dataList = null;
      if (erpnextConfig && erpnextConfig.url) {
        setSyncStatus('Syncing via ERPNext REST Resource API...');

        let filtersQuery = '';
        if (cust) {
          filtersQuery = `&filters=${encodeURIComponent(JSON.stringify([["customer", "=", cust]]))}`;
        }

        // Strategy 1: Query with fields=["*"] to dynamically retrieve all columns without failing on nonexistent ones
        try {
          const url1 = `${erpnextConfig.url}/api/resource/Booking?fields=["*"]&limit_page_length=500&order_by=creation%20desc${filtersQuery}`;
          const res1 = await fetch(url1, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });
          if (res1.ok) {
            const json1 = await res1.json();
            dataList = json1.data || [];
          } else {
            console.warn('Booking fetch fields=["*"] returned status:', res1.status);
          }
        } catch (e1) {
          console.warn('Booking fetch fields=["*"] failed:', e1);
        }

        // Strategy 2: If Strategy 1 returned not OK, try exact verified columns from ERPNext Booking DocType
        if (dataList === null) {
          try {
            const safeFields = encodeURIComponent(JSON.stringify([
              "name", "customer", "customer_name", "customer_email", "customer_phone_no", "booking_date",
              "starting_date", "ending_date", "total_days", "booking_type", "country", "booking_amount",
              "amount_to_pay", "advance_amount", "paid_amount", "pending_amount", "net_total",
              "discount_amount", "per_month_billing_amount", "payment_method", "payment_status", "quotation",
              "custom_contract", "docstatus", "workflow_state"
            ]));
            const url2 = `${erpnextConfig.url}/api/resource/Booking?fields=${safeFields}&limit_page_length=500&order_by=creation%20desc${filtersQuery}`;
            const res2 = await fetch(url2, {
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }
            });
            if (res2.ok) {
              const json2 = await res2.json();
              dataList = json2.data || [];
            } else {
              console.warn('Booking fetch safe fields returned status:', res2.status);
            }
          } catch (e2) {
            console.warn('Booking fetch safe fields failed:', e2);
          }
        }

        // Strategy 3: Minimal fallback (no fields query param)
        if (dataList === null) {
          try {
            const url3 = `${erpnextConfig.url}/api/resource/Booking?limit_page_length=500&order_by=creation%20desc${filtersQuery}`;
            const res3 = await fetch(url3, {
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }
            });
            if (res3.ok) {
              const json3 = await res3.json();
              dataList = json3.data || [];
            } else {
              console.warn('Booking fetch minimal fields returned status:', res3.status);
            }
          } catch (e3) {
            console.warn('Booking fetch minimal fields failed:', e3);
          }
        }
      }

      console.log('Fetched bookings data:', dataList);
      if (Array.isArray(dataList)) {
        setBookings(dataList);
        setSyncStatus('Synchronized');
      } else {
        setBookings(mockBookings);
        setSyncStatus('Offline Mode (Showing Mocks)');
      }
    } catch (err) {
      console.warn('Booking fetch failed, falling back to mock data:', err);
      setBookings(mockBookings);
      setSyncStatus('Offline Mode (Showing Mocks)');
    } finally {
      setLoadingList(false);
    }
  };

  // Fetch workflow transitions for the CURRENT Booking state.
  // Backend also calculates whether the logged-in user has the role
  // configured in the active ERPNext Workflow transition.
  const fetchWorkflowTransitions = async (doc) => {
    if (!erpnextConfig?.url || !doc?.name) {
      setWorkflowTransitions([]);
      return;
    }

    try {
      const res = await fetch(
        `${erpnextConfig.url}/api/method/property_management.api.get_booking_workflow_actions`,
        {
          method: 'POST',
          credentials: 'include',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            booking_id: doc.name
          })
        }
      );

      if (!res.ok) {
        setWorkflowTransitions([]);
        return;
      }

      const json = await res.json();
      const actions = json?.message?.next_actions || [];

      setWorkflowTransitions(
        Array.isArray(actions) ? actions : []
      );
    } catch (err) {
      console.error('Failed to fetch Booking workflow actions:', err);
      setWorkflowTransitions([]);
    }
  };

  // Apply a normal Booking workflow action through the backend.
  // The backend validates the current state + configured role and calls apply_workflow().
  const applyBookingWorkflowAction = async (actionName, bookingId = selectedBookingId) => {
    if (!erpnextConfig?.url || !bookingId || !actionName) {
      throw new Error('Booking and workflow action are required.');
    }

    const res = await fetch(
      `${erpnextConfig.url}/api/method/property_management.api.apply_booking_workflow_action`,
      {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          booking_id: bookingId,
          action: actionName
        })
      }
    );

    let payload = {};
    let rawText = '';

    try {
      rawText = await res.text();
      payload = rawText ? JSON.parse(rawText) : {};
    } catch (_) {
      payload = {};
    }

    if (!res.ok || payload?.message?.success === false) {
      const message =
        payload?.message?.error ||
        extractBackendErrorMessage(payload, rawText) ||
        `Unable to perform workflow action "${actionName}".`;

      throw new Error(message);
    }

    return payload?.message || payload;
  };

  // Workflow action: Waiting For Contract Submit -> Contract Submitted -> Request For Approval
  const handleContractSubmitted = async () => {
    if (!selectedBookingDetails?.name) return;

    try {
      const result = await applyBookingWorkflowAction(
        'Contract Submitted',
        selectedBookingDetails.name
      );

      showToast(
        'success',
        result?.message ||
        `Booking ${selectedBookingDetails.name} moved to ${result?.workflow_state || 'Request For Approval'}.`
      );

      await fetchBookingDetails(selectedBookingDetails.name);
      await fetchBookings();
    } catch (err) {
      showAlertModal(
        'Workflow Action Failed',
        err?.message || 'Unable to submit the contract workflow action.',
        'error',
        'Close'
      );
    }
  };


  // Handle a workflow action dynamically from ERPNext Workflow configuration.
  const handleDynamicWorkflowAction = async (transition) => {
    if (!transition?.action || !selectedBookingDetails?.name) {
      return;
    }

    const action = String(transition.action).trim();
    const normalizedAction = action.toLowerCase();

    if (normalizedAction === 'approve') {
      openApproveModal();
      return;
    }

    if (normalizedAction === 'reject') {
      handleRejectBooking();
      return;
    }

    if (normalizedAction === 'cancel') {
      handleCancelBooking();
      return;
    }

    showConfirmModal({
      title: action,
      message: `Are you sure you want to perform "${action}" on ${selectedBookingDetails.name}?`,
      confirmText: action,
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          const result = await applyBookingWorkflowAction(
            action,
            selectedBookingDetails.name
          );

          showToast(
            'success',
            result?.message ||
            `Booking moved to ${result?.workflow_state || transition.next_state}.`
          );

          await fetchBookingDetails(selectedBookingDetails.name);
          await fetchBookings();
        } catch (err) {
          showAlertModal(
            'Workflow Action Failed',
            err?.message || `Unable to perform "${action}".`,
            'error',
            'Close'
          );
        }
      }
    });
  };

  // Fetch detailed booking record
  const fetchBookingDetails = async (id) => {
    if (!id) return;
    setLoadingDetails(true);
    setSelectedBookingDetails(null);
    setWorkflowTransitions([]);
    try {
      let details = null;
      if (erpnextConfig && erpnextConfig.url) {
        try {
          const res = await fetch(`${erpnextConfig.url}/api/resource/Booking/${encodeURIComponent(id)}`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (res.ok) {
            const json = await res.json();
            details = json.data;
            console.log('Fetched booking details via resource API:', details);
          } else {
            console.warn('Booking detail resource fetch returned not OK:', res.status);
          }
        } catch (resourceErr) {
          console.warn('Booking detail resource fetch failed:', resourceErr);
        }
      }

      if (details) {
        if (details.quotation && erpnextConfig && erpnextConfig.url) {
          try {
            const qRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${encodeURIComponent(details.quotation)}?fields=["name","custom_start_date","custom_end_date","valid_till","discount_amount"]`, {
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }
            });
            if (qRes.ok) {
              const qJson = await qRes.json();
              const qData = qJson.data || qJson;
              details.quotation_start_date = qData.custom_start_date;
              details.quotation_end_date = qData.custom_end_date;
              details.quotation_valid_till = qData.valid_till;
              details.quotation_discount_amount = qData.discount_amount;
            }
          } catch (_) { }
        }

        const normalizedItems = normalizeBookingItems(details);
        setSelectedBookingDetails({ ...details, booking_item: normalizedItems });
        fetchWorkflowTransitions(details);
        setBookings(prev => prev.map(b => {
          const bookingId = b.name || b.id;
          return bookingId === id ? { ...b, ...details, booking_item: normalizedItems } : b;
        }));
      } else {
        const mockDetail = bookings.find(b => b.name === id || b.id === id);
        const normalizedItems = normalizeBookingItems(mockDetail || {});
        setSelectedBookingDetails(mockDetail ? { ...mockDetail, booking_item: normalizedItems } : null);
        fetchWorkflowTransitions(mockDetail);
        setBookings(prev => prev.map(b => {
          const bookingId = b.name || b.id;
          return bookingId === id ? { ...b, booking_item: normalizedItems } : b;
        }));
      }
    } catch (err) {
      console.warn('Failed to load booking details:', err);
      const mockDetail = bookings.find(b => b.name === id || b.id === id);
      const normalizedItems = normalizeBookingItems(mockDetail || {});
      setSelectedBookingDetails(mockDetail ? { ...mockDetail, booking_item: normalizedItems } : null);
      fetchWorkflowTransitions(mockDetail);
      setBookings(prev => prev.map(b => {
        const bookingId = b.name || b.id;
        return bookingId === id ? { ...b, booking_item: normalizedItems } : b;
      }));
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUpdateBookingDates = async () => {
    if (!editStartDate || !editEndDate) {
      setAlertModal({
        show: true,
        title: 'Missing Date Information',
        message: 'Start Date and End Date are required.'
      });
      return;
    }

    setUpdatingDates(true);
    try {
      if (!erpnextConfig || !erpnextConfig.url) {
        // Offline / mock mode validation matching backend validate_booking_dates
        if (selectedBookingDetails?.quotation_start_date && editStartDate < selectedBookingDetails.quotation_start_date) {
          setAlertModal({
            show: true,
            title: 'Booking Date Validation',
            message: `Booking Start Date cannot be before Quotation Start Date ${selectedBookingDetails.quotation_start_date}`
          });
          setUpdatingDates(false);
          return;
        }
        if (selectedBookingDetails?.quotation_end_date && editStartDate > selectedBookingDetails.quotation_end_date) {
          setAlertModal({
            show: true,
            title: 'Booking Date Validation',
            message: `Booking Start Date cannot be after Quotation End Date ${selectedBookingDetails.quotation_end_date}`
          });
          setUpdatingDates(false);
          return;
        }

        const start = new Date(editStartDate);
        const end = new Date(editEndDate);
        const minEnd = new Date(start);
        minEnd.setFullYear(start.getFullYear() + 1);
        const effectiveEnd = end < minEnd ? minEnd.toISOString().split('T')[0] : editEndDate;
        const totalDays = Math.round((new Date(effectiveEnd) - start) / (1000 * 60 * 60 * 24)) + 1;

        setEditStartDate(editStartDate);
        setEditEndDate(effectiveEnd);

        setSelectedBookingDetails(prev => prev ? {
          ...prev,
          starting_date: editStartDate,
          ending_date: effectiveEnd,
          start_date: editStartDate,
          end_date: effectiveEnd,
          total_days: totalDays
        } : prev);
        setBookings(prev => prev.map(b => (b.name === selectedBookingDetails.name || b.id === selectedBookingDetails.name) ? { ...b, starting_date: editStartDate, ending_date: effectiveEnd, start_date: editStartDate, end_date: effectiveEnd, total_days: totalDays } : b));
        showToast('success', 'Booking and Contract dates updated locally.');
        setUpdatingDates(false);
        return;
      }

      // 1. Update Booking DocType starting_date & ending_date (Calls backend validate() & validate_booking_dates())
      const res = await fetch(`${erpnextConfig.url}/api/resource/Booking/${encodeURIComponent(selectedBookingDetails.name)}`, {
        method: 'PUT',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          starting_date: editStartDate,
          ending_date: editEndDate
        })
      });

      if (res.ok) {
        const json = await res.json();
        const savedBooking = json.data || json;

        // Backend validate_booking_dates enforces minimum_end_date and calculates total_days
        const actualStart = savedBooking.starting_date || editStartDate;
        const actualEnd = savedBooking.ending_date || editEndDate;
        const actualTotalDays = savedBooking.total_days;

        setEditStartDate(actualStart);
        setEditEndDate(actualEnd);

        setSelectedBookingDetails(prev => prev ? {
          ...prev,
          ...savedBooking,
          starting_date: actualStart,
          ending_date: actualEnd,
          start_date: actualStart,
          end_date: actualEnd,
          total_days: actualTotalDays !== undefined ? actualTotalDays : prev.total_days
        } : prev);

        setBookings(prev => prev.map(b => (b.name === selectedBookingDetails.name || b.id === selectedBookingDetails.name) ? {
          ...b,
          ...savedBooking,
          starting_date: actualStart,
          ending_date: actualEnd,
          start_date: actualStart,
          end_date: actualEnd,
          total_days: actualTotalDays !== undefined ? actualTotalDays : b.total_days
        } : b));

        // 2. Identify linked Contract ID
        let contractId = savedBooking?.custom_contract || savedBooking?.contract || selectedBookingDetails?.custom_contract || selectedBookingDetails?.contract;
        if (!contractId) {
          const matched = bookings.find(b => (b.name === selectedBookingDetails.name || b.id === selectedBookingDetails.name));
          if (matched) {
            contractId = matched.custom_contract || matched.contract;
          }
        }

        // Check fresh Booking record from ERPNext if not found
        if (!contractId && erpnextConfig?.url) {
          try {
            const freshRes = await fetch(`${erpnextConfig.url}/api/resource/Booking/${encodeURIComponent(selectedBookingDetails.name)}`, {
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }
            });
            if (freshRes.ok) {
              const freshJson = await freshRes.json();
              const freshData = freshJson.data || freshJson;
              contractId = freshData.custom_contract || freshData.contract;
            }
          } catch (_) { }
        }

        // If still not found, search Contract DocType where document_name equals booking name
        if (!contractId && erpnextConfig?.url) {
          try {
            const cSearchRes = await fetch(`${erpnextConfig.url}/api/resource/Contract?filters=[["document_name","=","${encodeURIComponent(selectedBookingDetails.name)}"]]&fields=["name"]&limit=1`, {
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }
            });
            if (cSearchRes.ok) {
              const cSearchJson = await cSearchRes.json();
              if (cSearchJson.data && cSearchJson.data[0]) {
                contractId = cSearchJson.data[0].name;
              }
            }
          } catch (_) { }
        }

        // 3. Update Contract DocType start_date & end_date by contract ID using actual validated dates
        let contractUpdated = false;
        if (contractId) {
          try {
            // Attempt standard REST PUT on Contract DocType
            const cRes = await fetch(`${erpnextConfig.url}/api/resource/Contract/${encodeURIComponent(contractId)}`, {
              method: 'PUT',
              credentials: 'include',
              headers: getAuthHeaders(),
              body: JSON.stringify({
                start_date: actualStart,
                end_date: actualEnd
              })
            });

            if (cRes.ok) {
              contractUpdated = true;
            } else {
              // Fallback via frappe.client.set_value (RPC handles allow-on-submit or submitted contracts)
              const rpcRes = await fetch(`${erpnextConfig.url}/api/method/frappe.client.set_value`, {
                method: 'POST',
                credentials: 'include',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                  doctype: 'Contract',
                  name: contractId,
                  fieldname: {
                    start_date: actualStart,
                    end_date: actualEnd
                  }
                })
              });
              if (rpcRes.ok) {
                contractUpdated = true;
              } else {
                // Try setting fields individually if dict fieldname is unsupported
                await fetch(`${erpnextConfig.url}/api/method/frappe.client.set_value`, {
                  method: 'POST',
                  credentials: 'include',
                  headers: getAuthHeaders(),
                  body: JSON.stringify({
                    doctype: 'Contract',
                    name: contractId,
                    fieldname: 'start_date',
                    value: actualStart
                  })
                });
                await fetch(`${erpnextConfig.url}/api/method/frappe.client.set_value`, {
                  method: 'POST',
                  credentials: 'include',
                  headers: getAuthHeaders(),
                  body: JSON.stringify({
                    doctype: 'Contract',
                    name: contractId,
                    fieldname: 'end_date',
                    value: actualEnd
                  })
                });
                contractUpdated = true;
              }
            }
          } catch (cErr) {
            console.warn('Failed to update Contract doctype dates:', cErr);
          }
        }

        const dateAdjusted = actualEnd !== editEndDate;
        const msgSuffix = dateAdjusted ? ' (End Date adjusted to meet minimum 1-year duration)' : '';

        if (contractId) {
          showToast('success', contractUpdated ? `Booking and Contract (${contractId}) dates updated successfully.${msgSuffix}` : `Booking dates updated.${msgSuffix}`);
        } else {
          showToast('success', `Booking dates updated successfully.${msgSuffix}`);
        }

        await fetchBookingDetails(selectedBookingDetails.name);
      } else {
        // Backend validation thrown error (e.g. from validate_booking_dates)
        let errJson = null;
        let rawText = '';
        try {
          rawText = await res.text();
          errJson = JSON.parse(rawText);
        } catch (_) { }

        const cleanMsg = extractBackendErrorMessage(errJson, rawText);

        // Show backend error message in Modal (not alert / raw message)
        setAlertModal({
          show: true,
          title: 'Booking Date Validation',
          message: cleanMsg
        });
      }
    } catch (err) {
      setAlertModal({
        show: true,
        title: 'Booking Date Update Error',
        message: err.message || 'An error occurred while updating booking dates.'
      });
    } finally {
      setUpdatingDates(false);
    }
  };

  // Fetch available contract templates for the approval preview dropdown
  const fetchContractTemplates = async () => {
    if (!erpnextConfig || !erpnextConfig.url) return;
    setLoadingTemplates(true);
    try {
      const res = await fetch(
        `${erpnextConfig.url}/api/resource/Contract%20Template?fields=["name","title"]&filters=[["custom_reference_type","=","Contract"]]&limit_page_length=200`,
        {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if (res.ok) {
        const json = await res.json();
        setContractTemplates(json.data || []);
        console.log(json.data);
      }
    } catch (err) {
      console.warn('Failed to fetch contract templates:', err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  // Fetch the full contract template (including contract_terms HTML) for preview
  const fetchTemplateDetails = async (templateId) => {
    if (!erpnextConfig || !erpnextConfig.url || !templateId) return;
    setLoadingTemplateDetails(true);
    setTemplateDetails(null);
    setHasReadToBottom(false);
    setAgreedToTerms(false);
    setSignedByName('');
    try {
      const res = await fetch(
        `${erpnextConfig.url}/api/resource/${encodeURIComponent('Contract Template')}/${encodeURIComponent(templateId)}`,
        {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if (res.ok) {
        const json = await res.json();
        setTemplateDetails(json.data);
      }
    } catch (err) {
      console.warn('Failed to fetch contract template details:', err);
    } finally {
      setLoadingTemplateDetails(false);
    }
  };

  // After the preview renders, check whether it even needs scrolling —
  // short contracts that already fit the viewport shouldn't block the user.
  useEffect(() => {
    if (!templateDetails || !previewRef.current) return;
    const el = previewRef.current;
    const needsScroll = el.scrollHeight > el.clientHeight + 4;
    if (!needsScroll) {
      setHasReadToBottom(true);
    }
  }, [templateDetails]);

  // Track scroll progress inside the contract preview; only unlock the
  // agreement checkbox once the user has scrolled all the way through.
  const handlePreviewScroll = (e) => {
    if (hasReadToBottom) return;
    const el = e.target;
    const threshold = 24;
    const reachedBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
    if (reachedBottom) {
      setHasReadToBottom(true);
    }
  };

  // Open the approval modal for the currently selected booking
  const openApproveModal = () => {
    setApproveError('');
    setSelectedTemplateId('');
    setTemplateDetails(null);
    setHasReadToBottom(false);
    setAgreedToTerms(false);
    setSignedByName('');
    setShowApproveModal(true);
    fetchContractTemplates();
  };

  // Approve the booking: attach the chosen contract template + signer, then confirm
  const handleApproveBooking = async () => {
    setApproveError('');
    if (!selectedTemplateId) {
      setApproveError('Please select a contract template to preview before approving.');
      return;
    }
    if (!hasReadToBottom || !agreedToTerms) {
      setApproveError('Please review the full contract and confirm the Terms & Conditions.');
      return;
    }
    if (!signedByName.trim()) {
      setApproveError('Please enter the name of the person signing this booking.');
      return;
    }

    setApproving(true);
    try {
      let approvedPayload = null;

      if (erpnextConfig && erpnextConfig.url) {
        try {
          const res = await fetch(`${erpnextConfig.url}/api/method/property_management.api.approve_booking`, {
            method: 'POST',
            credentials: 'include',
            headers: getAuthHeaders(),
            body: JSON.stringify({
              booking_id: selectedBookingId,
              contract_template: selectedTemplateId,
              signed_by: signedByName.trim()
            })
          });

          if (res.ok) {
            const json = await res.json();
            approvedPayload = json.message || json.data || { success: true };
          } else {
            let errorDetail = 'Failed to approve booking on ERPNext';
            try {
              const errJson = await res.json();
              if (errJson._server_messages) {
                const messages = JSON.parse(errJson._server_messages);
                errorDetail = messages.map(m => {
                  try {
                    const parsed = JSON.parse(m);
                    return parsed.message || parsed;
                  } catch {
                    return String(m);
                  }
                }).join(', ');
              } else if (errJson.exception) {
                errorDetail = errJson.exception;
              }
            } catch { }
            throw new Error(errorDetail);
          }
        } catch (approveErr) {
          throw approveErr;
        }
      }

      if (approvedPayload) {
        const newStatus = approvedPayload.booking_status || 'Confirmed';

        // Update the list in place so the table reflects the new status instantly
        setBookings(prev => prev.map(b =>
          (b.name === selectedBookingId || b.id === selectedBookingId)
            ? { ...b, status: newStatus, workflow_state: 'Approved', docstatus: 1 }
            : b
        ));
        setSelectedBookingDetails(prev => prev
          ? { ...prev, status: newStatus, workflow_state: 'Approved', docstatus: 1 }
          : prev
        );

        showToast('success', approvedPayload.message || `Booking ${selectedBookingId} approved successfully.`);
        setShowApproveModal(false);
        if (selectedBookingId) {
          fetchBookingDetails(selectedBookingId);
        }
      } else {
        // Offline fallback: reflect the approval locally
        setBookings(prev => prev.map(b =>
          (b.name === selectedBookingId || b.id === selectedBookingId)
            ? { ...b, status: 'Confirmed', workflow_state: 'Approved', docstatus: 1 }
            : b
        ));
        setSelectedBookingDetails(prev => prev ? { ...prev, status: 'Confirmed', workflow_state: 'Approved', docstatus: 1 } : prev);
        showToast('success', 'Booking approved locally (Offline mode)');
        setShowApproveModal(false);
      }
    } catch (err) {
      const msg = err.message || 'Error approving booking.';
      setApproveError(msg);
      showToast('error', msg);
    } finally {
      setApproving(false);
    }
  };

  // Cancel the booking and related documents (Contract & Subscription)
  // 1. Cancels linked contract first to avoid Frappe foreign key LinkExistsError
  // 2. Applies Frappe workflow 'Cancel' action (docstatus: 2) with fallbacks
  // 3. Displays all confirmations and results in the styled modal
  const promptCancelBooking = () => {
    if (!selectedBookingDetails) return;
    const bookingId = selectedBookingDetails.name || selectedBookingDetails.id || selectedBookingId;
    if (!bookingId) return;

    showConfirmModal({
      title: 'Cancel Booking',
      message: `Are you sure you want to cancel booking ${bookingId} and its associated contract and subscription?\n\nThis will transition the document state to Cancelled (State 2). This action cannot be undone.`,
      confirmText: 'Yes, Cancel Booking',
      cancelText: 'Keep Booking',
      isDestructive: true,
      onConfirm: () => executeCancelBooking(bookingId)
    });
  };

  const executeCancelBooking = async (bookingId) => {
    setCancelling(true);

    try {
      if (erpnextConfig?.url) {
        // Cancel linked submitted Contract first. This avoids LinkExistsError
        // when the Booking workflow moves the submitted Booking to Cancel.
        try {
          let contractId =
            selectedBookingDetails?.custom_contract ||
            selectedBookingDetails?.contract;

          if (!contractId) {
            const cRes = await fetch(
              `${erpnextConfig.url}/api/resource/Contract?filters=${encodeURIComponent(
                JSON.stringify([['booking', '=', bookingId]])
              )}&fields=${encodeURIComponent(
                JSON.stringify(['name', 'docstatus'])
              )}&limit=1`,
              {
                credentials: 'include',
                headers: getAuthHeaders()
              }
            );

            if (cRes.ok) {
              const cJson = await cRes.json();
              contractId = cJson?.data?.[0]?.name || null;
            }
          }

          if (contractId) {
            const contractRes = await fetch(
              `${erpnextConfig.url}/api/resource/Contract/${encodeURIComponent(contractId)}`,
              {
                credentials: 'include',
                headers: getAuthHeaders()
              }
            );

            let contractDocstatus = 0;

            if (contractRes.ok) {
              const contractJson = await contractRes.json();
              contractDocstatus = Number(contractJson?.data?.docstatus || 0);
            }

            if (contractDocstatus === 1) {
              await fetch(
                `${erpnextConfig.url}/api/method/frappe.client.cancel`,
                {
                  method: 'POST',
                  credentials: 'include',
                  headers: getAuthHeaders(),
                  body: JSON.stringify({
                    doctype: 'Contract',
                    name: contractId
                  })
                }
              );
            } else if (contractDocstatus === 0) {
              await fetch(
                `${erpnextConfig.url}/api/method/frappe.client.set_value`,
                {
                  method: 'POST',
                  credentials: 'include',
                  headers: getAuthHeaders(),
                  body: JSON.stringify({
                    doctype: 'Contract',
                    name: contractId,
                    fieldname: {
                      status: 'Cancelled'
                    }
                  })
                }
              );
            }
          }
        } catch (contractErr) {
          console.warn('Contract cancellation warning:', contractErr);
        }

        // Best-effort Subscription cancellation.
        try {
          const subRes = await fetch(
            `${erpnextConfig.url}/api/resource/Subscription?filters=${encodeURIComponent(
              JSON.stringify([['booking_id', '=', bookingId]])
            )}&fields=${encodeURIComponent(
              JSON.stringify(['name'])
            )}&limit=1`,
            {
              credentials: 'include',
              headers: getAuthHeaders()
            }
          );

          if (subRes.ok) {
            const subJson = await subRes.json();
            const subscriptionId = subJson?.data?.[0]?.name;

            if (subscriptionId) {
              await fetch(
                `${erpnextConfig.url}/api/method/frappe.client.set_value`,
                {
                  method: 'POST',
                  credentials: 'include',
                  headers: getAuthHeaders(),
                  body: JSON.stringify({
                    doctype: 'Subscription',
                    name: subscriptionId,
                    fieldname: {
                      status: 'Cancelled'
                    }
                  })
                }
              );
            }
          }
        } catch (subErr) {
          console.warn('Subscription cancellation warning:', subErr);
        }
      }

      // Booking status itself is changed ONLY through the configured Workflow.
      const result = await applyBookingWorkflowAction(
        'Cancel',
        bookingId
      );

      showAlertModal(
        'Booking Cancelled',
        result?.message ||
        `Booking ${bookingId} has been moved to ${result?.workflow_state || 'Cancel'}.`,
        'success',
        'OK'
      );

      await fetchBookingDetails(bookingId);
      await fetchBookings();

    } catch (e) {
      showAlertModal(
        'Cancellation Failed',
        e?.message || `Failed to cancel booking ${bookingId}.`,
        'error',
        'Close'
      );
    } finally {
      setCancelling(false);
    }
  };

  const handleCancelBooking = promptCancelBooking;

  // Reject the booking before approval (State 0 / docstatus 0)
  // Used when workflow_state is "Waiting For Contract Submit" or "Request For Approval"
  const promptRejectBooking = () => {
    if (!selectedBookingDetails) return;
    const bookingId = selectedBookingDetails.name || selectedBookingDetails.id || selectedBookingId;
    if (!bookingId) return;

    showConfirmModal({
      title: 'Reject Booking',
      message: `Are you sure you want to reject booking ${bookingId}?\n\nThis will transition the document state to Rejected (State 0).`,
      confirmText: 'Yes, Reject Booking',
      cancelText: 'Keep Booking',
      isDestructive: true,
      onConfirm: () => executeRejectBooking(bookingId)
    });
  };

  const executeRejectBooking = async (bookingId) => {
    setRejecting(true);

    try {
      const result = await applyBookingWorkflowAction(
        'Reject',
        bookingId
      );

      // Best-effort cleanup of the linked draft contract after the
      // Booking workflow itself has successfully moved to Rejected.
      try {
        const contractId =
          selectedBookingDetails?.custom_contract ||
          selectedBookingDetails?.contract;

        if (contractId && erpnextConfig?.url) {
          await fetch(
            `${erpnextConfig.url}/api/method/frappe.client.set_value`,
            {
              method: 'POST',
              credentials: 'include',
              headers: getAuthHeaders(),
              body: JSON.stringify({
                doctype: 'Contract',
                name: contractId,
                fieldname: {
                  status: 'Cancelled'
                }
              })
            }
          );
        }
      } catch (_) {
        // Booking workflow already succeeded; contract cleanup is best-effort.
      }

      showAlertModal(
        'Booking Rejected',
        result?.message ||
        `Booking ${bookingId} has been moved to ${result?.workflow_state || 'Rejected'}.`,
        'success',
        'OK'
      );

      await fetchBookingDetails(bookingId);
      await fetchBookings();

    } catch (e) {
      showAlertModal(
        'Rejection Failed',
        e?.message || `Failed to reject booking ${bookingId}.`,
        'error',
        'Close'
      );
    } finally {
      setRejecting(false);
    }
  };

  const handleRejectBooking = promptRejectBooking;

  useEffect(() => {
    fetchBookings();
    fetchDocTypeFields();
    fetchSpaceUnits();
  }, [erpnextConfig]);

  useEffect(() => {
    if (!erpnextConfig || !erpnextConfig.url) return;
    const fetchCompanyCurrency = async () => {
      try {
        const res = await fetch(`${erpnextConfig.url}/api/resource/Company/CARPENTERS PROPERTIES PTE LIMITED`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const json = await res.json();
          const doc = json.data || json;
          if (doc.default_currency) {
            setCurrency(doc.default_currency);
          }
        }
      } catch (err) {
        console.warn('Failed fetching company details for currency:', err);
      }
    };
    fetchCompanyCurrency();
  }, [erpnextConfig]);

  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
      setCurrentPage(1);
      // Consume one-time search term so it does not persist across future visits
      if (typeof onClearInitialSearch === 'function') {
        onClearInitialSearch();
      }
    }
  }, [initialSearchTerm, onClearInitialSearch]);

  useEffect(() => {
    if (selectedBookingDetails) {
      setEditStartDate(selectedBookingDetails.starting_date || selectedBookingDetails.start_date || '');
      setEditEndDate(selectedBookingDetails.ending_date || selectedBookingDetails.end_date || '');
    } else {
      setEditStartDate('');
      setEditEndDate('');
    }
  }, [selectedBookingDetails]);

  // Handle Form Input Changes
  const handleInputChange = (fieldname, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldname]: value
    }));
  };

  // Submit new booking
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    // Validate mandatory fields
    const missing = bookingFields.filter(f => f.reqd && !formData[f.fieldname]);
    if (missing.length > 0) {
      setErrorMsg(`Required fields missing: ${missing.map(f => f.label).join(', ')}`);
      setSubmitting(false);
      return;
    }

    try {
      let savedDoc = null;
      if (erpnextConfig && erpnextConfig.url) {
        // Try custom API first
        try {
          const res = await fetch(`${erpnextConfig.url}/api/method/erpnext.api.booking.create_booking`, {
            method: 'POST',
            credentials: 'include',
            headers: getAuthHeaders(),
            body: JSON.stringify(formData)
          });
          if (res.ok) {
            const json = await res.json();
            savedDoc = json.message || json.data;
          } else {
            throw new Error('Custom creation method failed');
          }
        } catch (createErr) {
          console.warn('Custom create method failed, posting to resource Booking API...', createErr);
          // Standard resource fallback
          const res = await fetch(`${erpnextConfig.url}/api/resource/Booking?order_by=creation%20desc`, {
            method: 'POST',
            credentials: 'include',
            headers: getAuthHeaders(),
            body: JSON.stringify(formData)
          });
          if (res.ok) {
            const json = await res.json();
            savedDoc = json.data;
          } else {
            let errJson = null;
            let rawText = '';
            try {
              rawText = await res.text();
              errJson = JSON.parse(rawText);
            } catch { }
            const errorDetail = extractBackendErrorMessage(errJson, rawText);
            throw new Error(errorDetail);
          }
        }
      }

      if (savedDoc) {
        setSuccessMsg(`Booking ${savedDoc.name || 'created'} synced successfully with ERPNext!`);
        showToast('success', `Booking ${savedDoc.name || ''} created successfully.`);
        fetchBookings();
        setShowAddModal(false);
      } else {
        // Mock save if not connected to ERPNext
        const generatedId = `BOOK-${Math.floor(1000 + Math.random() * 9000)}`;
        const localDoc = {
          name: generatedId,
          ...formData,
          booking_date: formData.booking_date || new Date().toISOString().split('T')[0],
          status: formData.status || 'Pending',
          payment_status: formData.payment_status || 'Unpaid'
        };
        setBookings([localDoc, ...bookings]);
        setSuccessMsg('Booking saved locally (Offline mode)');
        showToast('success', 'Booking saved locally (Offline mode)');
        setShowAddModal(false);
      }
    } catch (err) {
      const msg = err.message || 'Error creating booking document.';
      setErrorMsg(msg);
      setAlertModal({
        show: true,
        title: 'Booking Validation Error',
        message: msg
      });
      showToast('error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Customer Filter trigger
  const handleCustomerFilterSubmit = (e) => {
    e.preventDefault();
    fetchBookings(customerFilter);
  };

  // Filtering on local state
  const filteredBookings = bookings.filter(b => {
    const term = searchTerm.toLowerCase();
    const hasMatchingItem = Array.isArray(b.booking_item) && b.booking_item.some(item =>
      (item.item_code && item.item_code.toLowerCase().includes(term)) ||
      (item.item_name && item.item_name.toLowerCase().includes(term))
    );
    const matchSearch =
      (b.name && b.name.toLowerCase().includes(term)) ||
      (b.customer && b.customer.toLowerCase().includes(term)) ||
      (b.customer_name && b.customer_name.toLowerCase().includes(term)) ||
      (b.customer_email && b.customer_email.toLowerCase().includes(term)) ||
      (b.customer_phone_no && b.customer_phone_no.toLowerCase().includes(term)) ||
      (b.property && b.property.toLowerCase().includes(term)) ||
      (b.country && b.country.toLowerCase().includes(term)) ||
      (b.quotation && String(b.quotation).toLowerCase().includes(term)) ||
      (b.custom_quotation && String(b.custom_quotation).toLowerCase().includes(term)) ||
      (b.custom_contract && String(b.custom_contract).toLowerCase().includes(term)) ||
      (b.quotation_id && String(b.quotation_id).toLowerCase().includes(term)) ||
      (b.workflow_state && b.workflow_state.toLowerCase().includes(term)) ||
      hasMatchingItem;

    const bStatus = b.workflow_state || b.status || (b.docstatus === 1 ? 'Approved' : 'Draft');
    const matchStatus =
      statusFilter === 'All' ||
      bStatus === statusFilter ||
      b.workflow_state === statusFilter ||
      b.status === statusFilter ||
      b.payment_status === statusFilter ||
      (statusFilter === 'Confirmed' && (bStatus === 'Approved' || bStatus === 'Confirmed' || b.docstatus === 1)) ||
      (statusFilter === 'Pending' && (bStatus === 'Request For Approval' || bStatus === 'Draft' || b.docstatus === 0));

    const matchType = typeFilter === 'All' || b.booking_type === typeFilter;

    return matchSearch && matchStatus && matchType;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredBookings.length]);

  // Pagination slice
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  const fetchBookingDetailsSilently = async (id) => {
    if (!erpnextConfig || !erpnextConfig.url || !id || fetchedDetailsRef.current.has(id)) return;
    fetchedDetailsRef.current.add(id);
    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Booking/${encodeURIComponent(id)}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        const details = json.data;
        if (details) {
          const normalizedItems = normalizeBookingItems(details);
          setBookings(prev => prev.map(b => {
            const bookingId = b.name || b.id;
            return bookingId === id ? { ...b, ...details, booking_item: normalizedItems } : b;
          }));
        }
      }
    } catch (err) {
      console.warn('Silent fetch failed:', err);
    }
  };

  useEffect(() => {
    if (!currentItems || currentItems.length === 0) return;
    currentItems.forEach(b => {
      const id = b.name || b.id;
      if (id && !b.booking_item && !fetchedDetailsRef.current.has(id)) {
        fetchBookingDetailsSilently(id);
      }
    });
  }, [currentItems]);

  const stateStr = (selectedBookingDetails?.workflow_state || '').trim().toLowerCase();
  const statusStr = (selectedBookingDetails?.status || '').trim().toLowerCase();
  const docstatusNum = Number(selectedBookingDetails?.docstatus ?? 0);

  // ------------------------------------------------------------
  // Workflow-driven action visibility
  // ------------------------------------------------------------
  // workflowTransitions contains ONLY transitions for the Booking's
  // current workflow state. Each transition also contains `allowed`,
  // calculated from the role configured in ERPNext Workflow.
  const getWorkflowAction = (actionName) => {
    const normalized = String(actionName || '').trim().toLowerCase();

    return workflowTransitions.find(
      transition =>
        String(transition?.action || '').trim().toLowerCase() === normalized
    );
  };

  const canWorkflowAction = (actionName) => {
    const transition = getWorkflowAction(actionName);
    return Boolean(transition && transition.allowed === true);
  };


  const isBookingCancelled = Boolean(selectedBookingDetails && (
    stateStr === 'cancelled' ||
    stateStr === 'cancel' ||
    statusStr === 'cancelled' ||
    statusStr === 'cancel' ||
    docstatusNum === 2
  ));

  const isBookingRejected = Boolean(selectedBookingDetails && (
    stateStr === 'rejected' ||
    stateStr === 'reject' ||
    statusStr === 'rejected' ||
    statusStr === 'reject'
  ));

  const isBookingApproved = Boolean(selectedBookingDetails && (
    stateStr === 'approved' ||
    statusStr === 'approved' ||
    statusStr === 'confirmed' ||
    docstatusNum === 1
  ) && !isBookingCancelled && !isBookingRejected);

  const canApproveNow =
    !approving &&
    !!selectedTemplateId &&
    hasReadToBottom &&
    agreedToTerms &&
    !!signedByName.trim();

  return (
    <div style={{ padding: '4px 0' }}>
      {/* Scoped styles: toast animation + the approve "cutout" button */}
      <style>{`
        @keyframes bookingToastIn {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bookingToastOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(24px); }
        }
        .booking-toast {
          animation: bookingToastIn 0.25s ease-out;
        }
        .approve-cutout-btn {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px 8px 12px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.2px;
          color: #fff;
          border: none;
          cursor: pointer;
          clip-path: polygon(0 28%, 12% 0, 100% 0, 100% 100%, 12% 100%, 0 72%);
          background: linear-gradient(135deg, var(--brand-color), #16a34a);
          box-shadow: 0 4px 10px rgba(0,0,0,0.22);
          transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
        }
        .approve-cutout-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(0,0,0,0.32);
          filter: brightness(1.05);
        }
        .approve-cutout-btn:disabled {
          cursor: not-allowed;
          color: var(--text-muted);
          background: var(--bg-tertiary);
          box-shadow: none;
          clip-path: polygon(0 32%, 14% 0, 100% 0, 100% 100%, 14% 100%, 0 68%);
        }
        .contract-preview-scope h1 { font-size: 15px; margin: 0 0 12px 0; color: var(--text-primary); }
        .contract-preview-scope h2 { font-size: 13px; margin: 18px 0 8px 0; color: var(--brand-color); border-top: 1px solid var(--border-color); padding-top: 12px; }
        .contract-preview-scope h3 { font-size: 12px; margin: 10px 0 6px 0; color: var(--text-primary); }
        .contract-preview-scope p { margin: 0 0 8px 0; line-height: 1.7; color: var(--text-secondary); }
        .contract-preview-scope ol, .contract-preview-scope ul { margin: 0 0 10px 0; padding-left: 20px; }
        .contract-preview-scope li { margin-bottom: 4px; line-height: 1.6; color: var(--text-secondary); }
        .contract-preview-scope strong { color: var(--text-primary); }
      `}</style>

      {/* Toast Notifications */}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, width: 320 }}>
        {toasts.map(t => (
          <div
            key={t.id}
            className="booking-toast"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '12px 14px',
              borderRadius: 10,
              background: 'var(--bg-secondary, #1f2937)',
              border: `1px solid ${t.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)'}`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
            }}
          >
            {t.type === 'success' ? (
              <CheckCircle size={18} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: 1 }} />
            ) : (
              <XCircle size={18} style={{ color: 'var(--color-danger)', flexShrink: 0, marginTop: 1 }} />
            )}
            <span style={{ fontSize: 12.5, color: 'var(--text-primary)', lineHeight: 1.5, flex: 1 }}>{t.message}</span>
            <button
              onClick={() => dismissToast(t.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Header section */}
      <div className="view-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="view-title">Property Bookings</h1>
          <p className="view-subtitle">Manage lease/rent reservations, track customer deposits, and view contract workflows.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearchTerm('');
              if (typeof onClearInitialSearch === 'function') onClearInitialSearch();
              fetchBookings();
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <RefreshCw size={14} className={loadingList ? 'spin' : ''} />
            Reload
          </button>
          {/* <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> New Booking
          </button> */}
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncStatus && syncStatus !== 'Synchronized' && (
        <div style={{
          background: 'var(--bg-accent-alpha)',
          border: '1px solid var(--border-color)',
          borderRadius: 8,
          padding: '8px 16px',
          marginBottom: 16,
          fontSize: 12,
          color: 'var(--text-secondary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: syncStatus.includes('Offline') ? 'var(--color-warning)' : 'var(--color-success)' }} />
            <span>Connection Status: <strong>{syncStatus}</strong></span>
          </div>
          {successMsg && <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{successMsg}</span>}
        </div>
      )}

      {/* Control panel filters */}
      <div className="card-panel" style={{ padding: 16, marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by ID, tenant name, unit or quotation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ paddingLeft: 34, paddingRight: searchTerm ? 32 : 12, fontSize: 13 }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                if (typeof onClearInitialSearch === 'function') onClearInitialSearch();
              }}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                borderRadius: '50%'
              }}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-control"
            style={{ width: 120, fontSize: 13, padding: '4px 8px' }}
          >
            <option value="All">All Types</option>
            <option value="Rent">Rent</option>
            <option value="Sale">Sale</option>
            <option value="Lease">Lease</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ minWidth: 140, fontSize: 12 }}
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Approved / Confirmed</option>
            <option value="Request For Approval">Request For Approval</option>
            <option value="Waiting For Contract Submit">Waiting For Contract</option>
            <option value="Pending">Draft / Pending</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Paid">Payment: Paid</option>
            <option value="Partially Paid">Payment: Partial</option>
            <option value="Unpaid">Payment: Unpaid</option>
          </select>
        </div>

        {/* Customer Sync API Filter Form */}
        <form onSubmit={handleCustomerFilterSubmit} style={{ display: 'flex', gap: 6, alignItems: 'center', borderLeft: '1px solid var(--border-color)', paddingLeft: 14 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Filter Tenant ID:</span>
          <input
            type="text"
            placeholder="e.g. TEN-0001"
            value={customerFilter}
            onChange={(e) => {
              setCustomerFilter(e.target.value);
              // Fetch from ERPNext on change/clear
              fetchBookings(e.target.value);
            }}
            className="form-control"
            style={{ width: 120, padding: '4px 8px', fontSize: 12 }}
          />
          <button type="submit" className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }}>Search</button>
        </form>
      </div>

      {/* Grid view containing list & inspector */}
      <div className="grid-2col" style={{ gridTemplateColumns: selectedBookingId ? '50% calc(50% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>

        {/* Booking Table Card */}
        <div className="card-panel" style={{
          padding: 0,
          overflow: 'hidden',
          filter: selectedBookingId ? 'blur(4px)' : 'none',
          transition: 'filter 0.3s ease'
        }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Booking Date</th>
                  <th>Tenant info</th>
                  <th>Property Unit</th>
                  <th>Contract Id</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(b => (
                  <tr
                    key={b.name || b.id}
                    onClick={() => {
                      setSelectedBookingId(b.name || b.id);
                      fetchBookingDetails(b.name || b.id);
                    }}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: selectedBookingId === (b.name || b.id) ? 'var(--bg-accent-alpha)' : '',
                      borderLeft: selectedBookingId === (b.name || b.id) ? '3px solid var(--brand-color)' : ''
                    }}
                  >
                    <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{b.name || b.id}</td>
                    <td>{b.booking_date}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.customer_name || b.customer}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{b.customer_email || 'No email'}</div>
                    </td>
                    <td>
                      {Array.isArray(b.booking_item) && b.booking_item.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                          <span
                            className="badge badge-secondary"
                            style={{
                              whiteSpace: "normal",
                              textTransform: "none",
                              lineHeight: 1.3
                            }}
                          >
                            {b.booking_item[0].item_name || b.booking_item[0].item_code}
                          </span>
                          {b.booking_item.length > 1 && (
                            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
                              +{b.booking_item.length - 1} more
                            </span>
                          )}
                        </div>
                      ) : b.property ? (
                        <span className="badge badge-secondary" style={{ textTransform: 'none' }}>
                          {b.property}
                        </span>
                      ) : b.quotation ? (
                        <span className="badge badge-secondary" style={{ textTransform: 'none', opacity: 0.8 }}>
                          {b.quotation}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>{loadingList ? 'Syncing...' : 'Not specified'}</span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-secondary" style={{ textTransform: 'none' }}>
                        {b.custom_contract || b.contract || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${(b.workflow_state === 'Approved' || b.status === 'Confirmed' || (b.docstatus === 1 && !b.workflow_state)) ? 'badge-success' :
                        (b.workflow_state === 'Cancelled' || b.status === 'Cancelled' || b.docstatus === 2 || b.workflow_state === 'Rejected' || b.status === 'Rejected') ? 'badge-danger' :
                          (b.workflow_state === 'Request For Approval' || b.workflow_state === 'Waiting For Contract Submit') ? 'badge-warning' :
                            'badge-info'
                        }`}>
                        {b.workflow_state || b.status || (b.docstatus === 1 ? 'Approved' : 'Draft')}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      ${parseFloat(b.booking_amount || b.amount_to_pay || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td>
                      <span className={`badge ${b.payment_status === 'Paid' ? 'badge-success' : b.payment_status === 'Partially Paid' ? 'badge-warning' : 'badge-danger'}`}>
                        {b.payment_status || 'Unpaid'}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                      {loadingList ? 'Waiting for response' : 'No booking records found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderTop: '1px solid var(--border-color)', fontSize: 11, color: 'var(--text-secondary)', background: 'var(--bg-card)', flexShrink: 0 }}>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                className="btn btn-secondary"
                style={{ padding: '4px 8px', fontSize: 10, opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', minWidth: 60 }}
              >
                Previous
              </button>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                Page <strong style={{ color: 'var(--text-primary)' }}>{currentPage}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{totalPages}</strong>
              </div>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                className="btn btn-secondary"
                style={{ padding: '4px 8px', fontSize: 10, opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', minWidth: 60 }}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Detailed Inspector Side Panel */}
        {selectedBookingId && (
          <div className="card-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#e6f4ea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={14} style={{ color: '#137333' }} />
                </div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#137333' }}>{selectedBookingId}</span>
              </div>
              <button
                onClick={() => setSelectedBookingId(null)}
                style={{
                  background: 'rgba(15, 23, 42, 0.05)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  color: '#0f172a',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.05)'}
              >
                <X size={16} />
              </button>
            </div>

            {loadingDetails ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <Loader size={24} className="spin" style={{ margin: '0 auto 10px auto' }} />
                <span>Loading details from ERPNext...</span>
              </div>
            ) : selectedBookingDetails ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Visual Header */}
                <div style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23f0fdf4' stop-opacity='0.95'/%3E%3Cstop offset='60%25' stop-color='%23f8fafc' stop-opacity='0.7'/%3E%3Cstop offset='100%25' stop-color='%23ffffff' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3Cpath d='M-100 150 C 150 50, 250 250, 500 150 S 650 50, 900 150' stroke='rgba(16, 185, 129, 0.09)' fill='none' stroke-width='4.5'/%3E%3Cpath d='M-50 200 C 200 100, 300 300, 550 200 S 700 100, 950 200' stroke='rgba(16, 185, 129, 0.05)' fill='none' stroke-width='2.5'/%3E%3C/svg%3E")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1px solid #e2e8f0',
                  borderLeft: '4px solid #10b981',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '96px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1 }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: '1px solid #e2e8f0'
                    }}>
                      <img src={homeImg} alt="Property" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <strong style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                        {selectedBookingDetails.property || (selectedBookingDetails.booking_item && selectedBookingDetails.booking_item[0] && (selectedBookingDetails.booking_item[0].item_name || selectedBookingDetails.booking_item[0].item_code)) || selectedBookingDetails.name || 'Booking Details'}
                      </strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: '#e6f4ea',
                          color: '#137333',
                          border: '1px solid rgba(19, 115, 51, 0.15)',
                          textTransform: 'capitalize'
                        }}>
                          Type: {selectedBookingDetails.booking_type || 'Lease'}
                        </span>
                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: (selectedBookingDetails.workflow_state === 'Approved' || selectedBookingDetails.status === 'Confirmed' || selectedBookingDetails.docstatus === 1)
                            ? '#e6f4ea'
                            : (selectedBookingDetails.workflow_state === 'Cancelled' || selectedBookingDetails.status === 'Cancelled' || selectedBookingDetails.docstatus === 2 || selectedBookingDetails.workflow_state === 'Rejected' || selectedBookingDetails.status === 'Rejected')
                              ? '#fee2e2'
                              : '#fffbeb',
                          color: (selectedBookingDetails.workflow_state === 'Approved' || selectedBookingDetails.status === 'Confirmed' || selectedBookingDetails.docstatus === 1)
                            ? '#137333'
                            : (selectedBookingDetails.workflow_state === 'Cancelled' || selectedBookingDetails.status === 'Cancelled' || selectedBookingDetails.docstatus === 2 || selectedBookingDetails.workflow_state === 'Rejected' || selectedBookingDetails.status === 'Rejected')
                              ? '#dc2626'
                              : '#b45309',
                          border: (selectedBookingDetails.workflow_state === 'Approved' || selectedBookingDetails.status === 'Confirmed' || selectedBookingDetails.docstatus === 1)
                            ? '1px solid rgba(19, 115, 51, 0.15)'
                            : (selectedBookingDetails.workflow_state === 'Cancelled' || selectedBookingDetails.status === 'Cancelled' || selectedBookingDetails.docstatus === 2 || selectedBookingDetails.workflow_state === 'Rejected' || selectedBookingDetails.status === 'Rejected')
                              ? '1px solid rgba(220, 38, 38, 0.15)'
                              : '1px solid rgba(180, 83, 9, 0.15)'
                        }}>
                          Status: {selectedBookingDetails.workflow_state || selectedBookingDetails.status || (selectedBookingDetails.docstatus === 1 ? 'Approved' : 'Draft')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side Illustration */}
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    top: 0,
                    zIndex: 0,
                    width: '150px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={houseImg}
                      alt="Illustration"
                      style={{ height: '90%', width: 'auto', objectFit: 'contain', opacity: 0.25 }}
                    />
                  </div>
                </div>

                {/* Details card wrapper */}
                {(() => {
                  const isWaitingForContractSubmit = selectedBookingDetails.workflow_state === 'Waiting For Contract Submit' || selectedBookingDetails.status === 'Waiting For Contract Submit';
                  return (
                    <div style={{
                      border: '1px solid var(--border-color, #e2e8f0)',
                      borderRadius: '12px',
                      padding: '16px',
                      background: '#ffffff',
                      display: 'grid',
                      gridTemplateColumns: '1.15fr 0.85fr',
                      gap: '20px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
                    }}>
                      {/* Left Column: General info */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={14} style={{ color: '#10b981' }} />
                            <span style={{ fontSize: '11px', color: 'var(--text-muted, #6b7280)', fontWeight: 500 }}>Booking Date</span>
                          </div>
                          <strong style={{ fontSize: '12px', color: 'var(--text-primary, #0f172a)' }}>{selectedBookingDetails.booking_date}</strong>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={14} style={{ color: '#10b981' }} />
                            <span style={{ fontSize: '11px', color: 'var(--text-muted, #6b7280)', fontWeight: 500 }}>Tenant Name</span>
                          </div>
                          <strong style={{ fontSize: '12px', color: 'var(--text-primary, #0f172a)' }}>{selectedBookingDetails.customer_name}</strong>
                        </div>

                        {selectedBookingDetails.customer_email && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Mail size={14} style={{ color: '#10b981' }} />
                              <span style={{ fontSize: '11px', color: 'var(--text-muted, #6b7280)', fontWeight: 500 }}>Tenant Email</span>
                            </div>
                            <strong style={{ fontSize: '12px', color: 'var(--text-primary, #0f172a)', wordBreak: 'break-all', marginLeft: '10px' }}>{selectedBookingDetails.customer_email}</strong>
                          </div>
                        )}

                        {selectedBookingDetails.customer_phone_no && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Phone size={14} style={{ color: '#10b981' }} />
                              <span style={{ fontSize: '11px', color: 'var(--text-muted, #6b7280)', fontWeight: 500 }}>Phone Number</span>
                            </div>
                            <strong style={{ fontSize: '12px', color: 'var(--text-primary, #0f172a)' }}>{selectedBookingDetails.customer_phone_no}</strong>
                          </div>
                        )}

                        {selectedBookingDetails.quotation && (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={14} style={{ color: '#10b981' }} />
                                <span style={{ fontSize: '11px', color: 'var(--text-muted, #6b7280)', fontWeight: 500 }}>Quotation Id</span>
                              </div>
                              <strong style={{ fontSize: '12px', color: 'var(--text-primary, #0f172a)' }}>{selectedBookingDetails.quotation}</strong>
                            </div>

                            {(selectedBookingDetails.quotation_start_date || selectedBookingDetails.quotation_end_date) && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid #f1f5f9',
                                paddingBottom: '6px',
                                background: '#f8fafc',
                                padding: '6px 8px',
                                borderRadius: '6px'
                              }}>
                                <span style={{ fontSize: '10.5px', color: 'var(--text-muted, #6b7280)', fontWeight: 600 }}>Quotation Period</span>
                                <span style={{ fontSize: '11px', color: '#0f172a', fontWeight: 600 }}>
                                  {selectedBookingDetails.quotation_start_date || '—'} to {selectedBookingDetails.quotation_end_date || '—'}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Right Column: Editable / Read-only Dates */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                        {isWaitingForContractSubmit && (selectedBookingDetails.quotation_start_date || selectedBookingDetails.quotation_end_date) && (
                          <div style={{
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: '8px',
                            padding: '6px 10px',
                            fontSize: '10.5px',
                            color: '#166534',
                            lineHeight: 1.4
                          }}>
                            <div style={{ fontWeight: 700 }}>
                              Quotation Date Rules:
                            </div>
                            <div>Start date must be within <strong>{selectedBookingDetails.quotation_start_date || 'start'}</strong> &amp; <strong>{selectedBookingDetails.quotation_end_date || 'end'}</strong></div>
                            <div style={{ fontSize: '9.5px', color: '#15803d', marginTop: 2 }}>Min booking length: 1 Year (End Date auto-adjusts)</div>
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted, #6b7280)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={13} style={{ color: '#10b981' }} />
                            <span>Start Date</span>
                          </label>
                          {isWaitingForContractSubmit ? (
                            <input
                              type="date"
                              value={editStartDate}
                              onChange={(e) => {
                                const newStart = e.target.value;
                                setEditStartDate(newStart);
                                if (newStart) {
                                  const d = new Date(newStart);
                                  d.setFullYear(d.getFullYear() + 1);
                                  const minEndStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                  if (!editEndDate || new Date(editEndDate) < d) {
                                    setEditEndDate(minEndStr);
                                  }
                                }
                              }}
                              min={(() => {
                                const d = new Date();
                                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                              })()}
                              style={{
                                width: '100%',
                                fontSize: '12px',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                outline: 'none',
                                color: '#1f2937',
                                fontWeight: 500
                              }}
                            />
                          ) : (
                            <div style={{ fontSize: '12px', color: 'var(--text-primary, #0f172a)', fontWeight: 700, padding: '6px 10px', border: '1px solid #e2e8f0', background: '#f8fafc', borderRadius: '8px' }}>
                              {selectedBookingDetails.starting_date || selectedBookingDetails.start_date || 'N/A'}
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted, #6b7280)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={13} style={{ color: '#10b981' }} />
                            <span>End Date</span>
                          </label>
                          {isWaitingForContractSubmit ? (
                            <input
                              type="date"
                              value={editEndDate}
                              onChange={(e) => setEditEndDate(e.target.value)}
                              min={(() => {
                                if (!editStartDate) return '';
                                const d = new Date(editStartDate);
                                d.setFullYear(d.getFullYear() + 1);
                                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                              })()}
                              style={{
                                width: '100%',
                                fontSize: '12px',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                outline: 'none',
                                color: '#1f2937',
                                fontWeight: 500
                              }}
                            />
                          ) : (
                            <div style={{ fontSize: '12px', color: 'var(--text-primary, #0f172a)', fontWeight: 700, padding: '6px 10px', border: '1px solid #e2e8f0', background: '#f8fafc', borderRadius: '8px' }}>
                              {selectedBookingDetails.ending_date || selectedBookingDetails.end_date || 'N/A'}
                            </div>
                          )}
                        </div>

                        {isWaitingForContractSubmit && (
                          <button
                            onClick={handleUpdateBookingDates}
                            disabled={updatingDates}
                            style={{
                              width: '100%',
                              backgroundColor: '#10b981',
                              border: '1px solid #10b981',
                              color: '#ffffff',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              marginTop: '4px',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                          >
                            <Calendar size={14} />
                            <span>{updatingDates ? 'Updating...' : 'Update Dates'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Metric metrics grid row */}
                {(() => {
                  const totalDaysVal = (() => {
                    const start = editStartDate;
                    const end = editEndDate;
                    if (start && end) {
                      const startDate = new Date(start);
                      const endDate = new Date(end);
                      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                        const diffTime = endDate.getTime() - startDate.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays >= 0 ? diffDays : 'N/A';
                      }
                    }
                    return selectedBookingDetails.total_days || 'N/A';
                  })();

                  const billingCycleVal = (() => {
                    const cycle = selectedBookingDetails.billing_cycle || selectedBookingDetails.billing_cycle_date;
                    if (!cycle) return 'N/A';
                    const date = new Date(cycle);
                    if (!isNaN(date.getTime()) && String(cycle).includes('-')) {
                      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
                    }
                    return cycle;
                  })();

                  const paymentMethodVal = selectedBookingDetails.payment_method || 'Cash';

                  return (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
                    }}>
                      {/* Card 1: Total Days */}
                      <div style={{
                        border: '1px solid var(--border-color, #e2e8f0)',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: '#e6f4ea',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Calendar size={18} style={{ color: '#137333' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600 }}>Total Days</span>
                          <strong style={{ fontSize: '18px', fontWeight: 800, color: '#137333', marginTop: '2px' }}>{totalDaysVal}</strong>
                        </div>
                      </div>

                      {/* Card 2: Billing Cycle Date */}
                      <div style={{
                        border: '1px solid var(--border-color, #e2e8f0)',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: '#eef2ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <RefreshCw size={16} style={{ color: '#4f46e5' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600 }}>Billing Cycle Date</span>
                          <strong style={{ fontSize: '18px', fontWeight: 800, color: '#4f46e5', marginTop: '2px' }}>{billingCycleVal}</strong>
                        </div>
                      </div>

                      {/* Card 3: Payment Method */}
                      <div style={{
                        border: '1px solid var(--border-color, #e2e8f0)',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: '#fffbeb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <DollarSign size={16} style={{ color: '#d97706' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600 }}>Payment Method</span>
                          <strong style={{ fontSize: '18px', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>{paymentMethodVal}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* BOOKING ITEMS TABLE (PRICE BREAKDOWN) */}
                {(() => {
                  const bookingItems = (selectedBookingDetails.booking_item && selectedBookingDetails.booking_item.length > 0)
                    ? selectedBookingDetails.booking_item
                    : [
                        {
                          item_code: selectedBookingDetails.property || selectedBookingDetails.name || 'Unit',
                          item_name: selectedBookingDetails.property || selectedBookingDetails.name || 'Unit',
                          amount: selectedBookingDetails.booking_amount || selectedBookingDetails.grand_totalmonthly || 0,
                          qty: 1,
                          rate: selectedBookingDetails.booking_amount || selectedBookingDetails.grand_totalmonthly || 0,
                          discount_amount: selectedBookingDetails.discount_amount || 0,
                          total_areasqm: selectedBookingDetails.total_area || selectedBookingDetails.custom_total_area || selectedBookingDetails.area
                        }
                      ];

                  // Calculate Discount Amount by summing discount_amount across all items in booking_item
                  const itemsDiscount = bookingItems.reduce((sum, item) => {
                    const val = parseFloat(
                      item?.discount_amount !== undefined && item?.discount_amount !== null && item?.discount_amount !== ''
                        ? item.discount_amount
                        : (item?.deposit_amount ?? item?.diposite_amount ?? item?.discount ?? 0)
                    );
                    return sum + (isNaN(val) ? 0 : val);
                  }, 0);

                  const calculatedDiscount = itemsDiscount > 0
                    ? itemsDiscount
                    : (parseFloat(selectedBookingDetails.discount_amount || selectedBookingDetails.quotation_discount_amount || 0) || 0);

                  const itemsTotal = bookingItems.reduce((sum, item) => {
                    const amt = item.amount !== undefined && item.amount !== null
                      ? parseFloat(item.amount)
                      : ((parseFloat(item.qty) || 1) * (parseFloat(item.rate) || 0));
                    return sum + (isNaN(amt) ? 0 : amt);
                  }, 0);

                  const rawNetTotal = parseFloat(selectedBookingDetails.net_total || 0);
                  const displayNetTotal = itemsTotal > 0
                    ? itemsTotal
                    : (rawNetTotal > 0 ? (rawNetTotal + calculatedDiscount) : (parseFloat(selectedBookingDetails.booking_amount || 0) + calculatedDiscount));

                  const monthlyGrandTotal = parseFloat(selectedBookingDetails.grand_totalmonthly || selectedBookingDetails.per_month_billing_amount || selectedBookingDetails.booking_amount || 0);

                  // Compute taxes
                  let displayTaxes = Math.max(0, parseFloat(selectedBookingDetails.taxes_and_charges || selectedBookingDetails.total_taxes_and_charges || 0));
                  if (displayTaxes === 0 && monthlyGrandTotal > 0) {
                    const diff = (monthlyGrandTotal + calculatedDiscount) - displayNetTotal;
                    if (diff > 0) displayTaxes = diff;
                  }
                  if (displayTaxes === 0 && displayNetTotal > 0) {
                    displayTaxes = (displayNetTotal - calculatedDiscount) * 0.125;
                  }

                  let taxPctDisplay = '12.5';
                  if (displayNetTotal > 0 && displayTaxes > 0) {
                    const netAfterDisc = Math.max(1, displayNetTotal - calculatedDiscount);
                    const pct = (displayTaxes / netAfterDisc) * 100;
                    if (pct > 0 && pct <= 100) {
                      taxPctDisplay = Number(pct.toFixed(1)).toString();
                    }
                  }

                  const displayGrandTotal = monthlyGrandTotal > 0
                    ? monthlyGrandTotal
                    : Math.max(0, (displayNetTotal - calculatedDiscount + displayTaxes));

                  return (
                    <div style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: 8,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: 135,
                      boxSizing: 'border-box',
                      marginTop: 4,
                      background: '#ffffff',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
                    }}>
                      {/* Header */}
                      <div style={{
                        background: '#f9fafb',
                        padding: '10px 14px',
                        borderBottom: '1px solid #e5e7eb',
                        fontWeight: 700,
                        fontSize: 11,
                        textTransform: 'uppercase',
                        color: '#4b5563',
                        flexShrink: 0
                      }}>
                        Price Breakdown (Current)
                      </div>

                      {/* Items Table */}
                      <div style={{ flex: 1, maxHeight: 180, overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, textAlign: 'left' }}>
                          <thead>
                            <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb', fontWeight: 600, color: '#4b5563' }}>
                              <th style={{ padding: '8px 12px' }}>Unit / Fee Name</th>
                              <th style={{ padding: '8px 12px', textAlign: 'center' }}>Total Area (sqft)</th>
                              <th style={{ padding: '8px 12px', textAlign: 'right' }}>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookingItems.map((item, idx) => {
                              const amtVal = item.amount !== undefined && item.amount !== null
                                ? parseFloat(item.amount)
                                : ((parseFloat(item.qty) || 1) * (parseFloat(item.rate) || 0));

                              const matchedUnit = spaceUnits.find(u =>
                                (u.name && (u.name === item.item_code || u.name === item.item_name)) ||
                                (u.item_code && (u.item_code === item.item_code || u.item_code === item.item_name))
                              );

                              let areaVal = '—';
                              const isFee = (item.item_name || item.item_code || '').toLowerCase().match(/fee|charge|service|deposit|tax/);
                              if (!isFee) {
                                if (item.total_areasqm) areaVal = item.total_areasqm;
                                else if (item.custom_total_area) areaVal = item.custom_total_area;
                                else if (item.total_area) areaVal = item.total_area;
                                else if (item.custom_total_area_sqft) areaVal = item.custom_total_area_sqft;
                                else if (item.area_sqft) areaVal = item.area_sqft;
                                else if (item.area) areaVal = item.area;
                                else if (item.custom_area) areaVal = item.custom_area;
                                else if (matchedUnit) {
                                  areaVal = matchedUnit.custom_7average_carpet_area_of_units || matchedUnit.total_areasqm || matchedUnit.custom_total_area || matchedUnit.total_area || matchedUnit.area || matchedUnit.custom_total_area_sqft || '—';
                                }

                                if (areaVal === '—') {
                                  const otherWithQty = bookingItems.find(it => {
                                    const itFee = (it.item_name || it.item_code || '').toLowerCase().match(/fee|charge|service|deposit|tax/);
                                    return !itFee && ((parseFloat(it.qty) || 0) > 1 || (parseFloat(it.quantity) || 0) > 1);
                                  });
                                  if (otherWithQty) {
                                    areaVal = otherWithQty.qty || otherWithQty.quantity;
                                  } else if (item.qty && parseFloat(item.qty) > 1) {
                                    areaVal = item.qty;
                                  } else if (selectedBookingDetails.total_area) {
                                    areaVal = selectedBookingDetails.total_area;
                                  } else if (selectedBookingDetails.custom_total_area) {
                                    areaVal = selectedBookingDetails.custom_total_area;
                                  } else if (selectedBookingDetails.area) {
                                    areaVal = selectedBookingDetails.area;
                                  } else if (selectedBookingDetails.quotation_total_area) {
                                    areaVal = selectedBookingDetails.quotation_total_area;
                                  }
                                }
                              }

                              return (
                                <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                  <td style={{ padding: '8px 12px', color: '#374151', fontWeight: 600 }}>
                                    <span>{item.item_name || item.item_code}</span>
                                    {parseFloat(item.discount_amount || 0) > 0 && (
                                      <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 600, marginLeft: 6 }}>
                                        (Disc: -${parseFloat(item.discount_amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })})
                                      </span>
                                    )}
                                  </td>
                                  <td style={{ padding: '8px 12px', textAlign: 'center', color: '#4b5563', fontWeight: 500 }}>
                                    {areaVal && areaVal !== '—' ? `${areaVal} sqft` : '—'}
                                  </td>
                                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#111827', fontWeight: 700 }}>
                                    ${amtVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Footer Totals */}
                      <div style={{
                        padding: '10px 14px',
                        background: '#f9fafb',
                        borderTop: '1px solid #e5e7eb',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 5,
                        fontSize: 11,
                        flexShrink: 0
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                          <span>Net Total</span>
                          <span style={{ fontWeight: 600, color: '#111827' }}>
                            ${displayNetTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', fontWeight: 600 }}>
                          <span>Negotiated Discount</span>
                          <span>
                            -${calculatedDiscount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                          <span>Taxes (VAT @ {taxPctDisplay}%)</span>
                          <span>
                            ${displayTaxes.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          color: '#059669',
                          fontWeight: 800,
                          fontSize: 13,
                          borderTop: '1px solid #e5e7eb',
                          paddingTop: 6
                        }}>
                          <span>Grand Total ({currency || 'FJD'})</span>
                          <span>
                            ${displayGrandTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Account Balances Section */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1.15fr 0.85fr',
                  gap: '16px',
                  border: '1px solid var(--border-color, #e2e8f0)',
                  borderRadius: '12px',
                  padding: '16px',
                  background: '#ffffff',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
                }}>
                  {/* Ledger lines info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '4px' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#e6f4ea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText size={12} style={{ color: '#137333' }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#137333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment &amp; Deposit Summary</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                      <span style={{ color: 'var(--text-muted, #6b7280)', fontWeight: 500 }}>Deposit Amount:</span>
                      <strong style={{ color: 'var(--text-primary, #0f172a)', fontSize: '13px', fontWeight: 700 }}>
                        ${parseFloat(selectedBookingDetails.advance_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                      <span style={{ color: 'var(--text-muted, #6b7280)', fontWeight: 500 }}>Paid Amount:</span>
                      <strong style={{ color: '#10b981', fontSize: '13px', fontWeight: 700 }}>
                        ${parseFloat(selectedBookingDetails.paid_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: '2px' }}>
                      {(() => {
                        const monthlyGrandTotal = parseFloat(selectedBookingDetails.grand_totalmonthly || selectedBookingDetails.per_month_billing_amount || selectedBookingDetails.booking_amount || 0);
                        const paidAmount = parseFloat(selectedBookingDetails.paid_amount || 0);
                        const pendingBalance = monthlyGrandTotal - paidAmount;
                        return (
                          <>
                            <span style={{ color: 'var(--text-primary, #0f172a)', fontWeight: 700 }}>Pending Balance:</span>
                            <strong style={{ color: '#ef4444', fontSize: '13px', fontWeight: 800 }}>
                              ${pendingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </strong>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Image Illustration Container */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px dashed #e2e8f0',
                    padding: '12px',
                    minHeight: '140px'
                  }}>
                    <img
                      src={billingSummaryImg}
                      alt="Billing Summary"
                      style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '135px' }}
                    />
                  </div>
                </div>

                {/* Workflow state notes */}
                {selectedBookingDetails.workflow_state && (
                  <div style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    background: (selectedBookingDetails.workflow_state === 'Approved')
                      ? '#f0fdf4'
                      : (selectedBookingDetails.workflow_state === 'Cancelled' || selectedBookingDetails.workflow_state === 'Rejected')
                        ? '#fef2f2'
                        : '#f0f9ff',
                    border: (selectedBookingDetails.workflow_state === 'Approved')
                      ? '1px solid #bbf7d0'
                      : (selectedBookingDetails.workflow_state === 'Cancelled' || selectedBookingDetails.workflow_state === 'Rejected')
                        ? '1px solid #fecaca'
                        : '1px solid #b3e0ff',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: (selectedBookingDetails.workflow_state === 'Approved')
                      ? '#166534'
                      : (selectedBookingDetails.workflow_state === 'Cancelled' || selectedBookingDetails.workflow_state === 'Rejected')
                        ? '#dc2626'
                        : '#0369a1',
                    marginTop: 4,
                    fontWeight: 500
                  }}>
                    <AlertCircle size={15} style={{
                      color: (selectedBookingDetails.workflow_state === 'Approved')
                        ? '#166534'
                        : (selectedBookingDetails.workflow_state === 'Cancelled' || selectedBookingDetails.workflow_state === 'Rejected')
                          ? '#dc2626'
                          : '#0369a1'
                    }} />
                    <span>Current Document State: <strong>{selectedBookingDetails.workflow_state}</strong></span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
                  {/* Print Lease Agreement Action */}
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (selectedBookingDetails?.status === 'Cancelled' || selectedBookingDetails?.workflow_state === 'Cancelled') {
                        showAlertModal('Cannot Print Document', 'Printing is not allowed for cancelled documents.', 'warning');
                        return;
                      }
                      if (selectedBookingDetails?.status === 'Rejected' || selectedBookingDetails?.workflow_state === 'Rejected') {
                        showAlertModal('Cannot Print Document', 'Printing is not allowed for rejected documents.', 'warning');
                        return;
                      }
                      let contractId = selectedBookingDetails?.custom_contract || selectedBookingDetails?.contract;
                      if (!contractId) {
                        const matched = bookings.find(b => (b.name === selectedBookingDetails?.name || b.id === selectedBookingDetails?.name));
                        if (matched) {
                          contractId = matched.custom_contract || matched.contract;
                        }
                      }
                      if (!contractId) {
                        showAlertModal('No Contract Found', 'No linked contract found for this booking to print.', 'warning');
                        return;
                      }
                      if (erpnextConfig?.url) {
                        const printUrl = `${erpnextConfig.url}/printview?doctype=Contract&name=${encodeURIComponent(contractId)}&format=Lease%20Agreement%20Contract&no_letterhead=1&letterhead=No%20Letterhead&settings=%7B%7D&_lang=en`;
                        const printWindow = window.open(printUrl, '_blank');
                        if (printWindow) {
                          const injectAndPrint = () => {
                            try {
                              const doc = printWindow.document;
                              if (doc) {
                                doc.title = "";
                                if (doc.head) {
                                  if (doc.getElementById('pms-custom-print-style')) return;
                                  const style = doc.createElement('style');
                                  style.id = 'pms-custom-print-style';
                                  style.innerHTML = `
                                    .action-banner { display: none !important; }
                                    @page { size: auto; margin: 0mm; }
                                    @media print {
                                      @page { size: auto; margin: 0mm; }
                                      body { margin: 15mm !important; padding: 0px !important; }
                                      .action-banner, header, footer { display: none !important; }
                                    }
                                  `;
                                  doc.head.appendChild(style);
                                  setTimeout(() => { printWindow.print(); }, 500);
                                }
                              }
                            } catch (e) {
                              console.warn("Unable to customize print style:", e);
                            }
                          };
                          printWindow.onload = injectAndPrint;
                          let attempts = 0;
                          const checkInterval = setInterval(() => {
                            attempts++;
                            if (printWindow.closed || attempts > 80) {
                              clearInterval(checkInterval);
                              return;
                            }
                            try {
                              if (printWindow.document && printWindow.document.readyState === 'complete') {
                                clearInterval(checkInterval);
                                injectAndPrint();
                              }
                            } catch (err) { }
                          }, 100);
                        }
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      flex: 1,
                      backgroundColor: '#0a6c66',
                      borderColor: '#0a6c66',
                      color: '#ffffff',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      minWidth: '160px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#085450'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0a6c66'}
                  >
                    <Printer size={14} />
                    <span>Print Lease Agreement</span>
                  </button>

                  {/* Dynamic Workflow Actions
                      The backend returns only transitions for the current workflow state.
                      Buttons are rendered only when transition.allowed === true.
                      Approve/Reject/Cancel keep their existing specialized flows.
                      Every other action is applied directly through the workflow API. */}
                  {workflowTransitions
                    .filter(transition => transition?.allowed === true)
                    .map((transition, index) => {
                      const action = String(transition?.action || '').trim();
                      const normalizedAction = action.toLowerCase();

                      const isApprove = normalizedAction === 'approve';
                      const isReject = normalizedAction === 'reject';
                      const isCancel = normalizedAction === 'cancel';
                      const isDestructive = isReject || isCancel;

                      const isBusy = isApprove
                        ? approving
                        : isReject
                          ? rejecting
                          : isCancel
                            ? cancelling
                            : false;

                      const backgroundColor = isApprove
                        ? '#10b981'
                        : isDestructive
                          ? '#ef4444'
                          : '#2563eb';

                      const hoverColor = isApprove
                        ? '#059669'
                        : isDestructive
                          ? '#dc2626'
                          : '#1d4ed8';

                      return (
                        <button
                          key={`${action}-${index}`}
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleDynamicWorkflowAction(transition)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            flex: 1,
                            backgroundColor,
                            border: `1px solid ${backgroundColor}`,
                            color: '#ffffff',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: isBusy ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            minWidth: '150px',
                            opacity: isBusy ? 0.7 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (!isBusy) {
                              e.currentTarget.style.backgroundColor = hoverColor;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isBusy) {
                              e.currentTarget.style.backgroundColor = backgroundColor;
                            }
                          }}
                        >
                          {isApprove ? (
                            <CheckCircle2 size={14} />
                          ) : isDestructive ? (
                            <XCircle size={14} />
                          ) : (
                            <FileText size={14} />
                          )}

                          <span>{isBusy ? `${action}...` : action}</span>
                        </button>
                      );
                    })}

                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <span>No details available for this record.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dynamic Creation Modal Form */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 560 }}>

            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Register New Booking</h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Form layout generated dynamically from ERPNext schema metadata.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}
                disabled={submitting}
              >
                ×
              </button>
            </div>

            {/* Modal Body / Dynamic Fields */}
            <form onSubmit={handleCreateBooking}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {errorMsg && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', borderRadius: 6, padding: '10px 14px', color: 'var(--color-danger)', fontSize: 12 }}>
                    {errorMsg}
                  </div>
                )}

                {loadingFields ? (
                  <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                    <Loader size={20} className="spin" style={{ margin: '0 auto 8px auto' }} />
                    <span>Querying ERPNext DocType fields schema...</span>
                  </div>
                ) : (
                  bookingFields.map(field => {
                    const isRequired = !!field.reqd;
                    const val = formData[field.fieldname] || '';

                    return (
                      <div key={field.fieldname} className="form-group">
                        <label className="form-label">
                          {field.label} {isRequired && <span style={{ color: 'var(--color-danger)' }}>*</span>}
                        </label>

                        {field.fieldtype === 'Select' ? (
                          <select
                            value={val}
                            onChange={(e) => handleInputChange(field.fieldname, e.target.value)}
                            required={isRequired}
                            className="form-select"
                            disabled={submitting}
                          >
                            <option value="">-- Choose Option --</option>
                            {(field.options || '').split('\n').filter(Boolean).map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : field.fieldtype === 'Date' ? (
                          <input
                            type="date"
                            value={val}
                            onChange={(e) => handleInputChange(field.fieldname, e.target.value)}
                            required={isRequired}
                            className="form-input"
                            disabled={submitting}
                          />
                        ) : field.fieldtype === 'Datetime' ? (
                          <input
                            type="datetime-local"
                            value={val}
                            onChange={(e) => handleInputChange(field.fieldname, e.target.value)}
                            required={isRequired}
                            className="form-input"
                            disabled={submitting}
                          />
                        ) : field.fieldtype === 'Small Text' || field.fieldtype === 'Text' ? (
                          <textarea
                            value={val}
                            onChange={(e) => handleInputChange(field.fieldname, e.target.value)}
                            required={isRequired}
                            className="form-textarea"
                            rows={3}
                            disabled={submitting}
                            style={{ resize: 'vertical' }}
                          />
                        ) : field.fieldtype === 'Currency' || field.fieldtype === 'Float' || field.fieldtype === 'Int' ? (
                          <input
                            type="number"
                            step="any"
                            value={val}
                            onChange={(e) => handleInputChange(field.fieldname, e.target.value)}
                            required={isRequired}
                            className="form-input"
                            disabled={submitting}
                          />
                        ) : (
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleInputChange(field.fieldname, e.target.value)}
                            required={isRequired}
                            className="form-input"
                            disabled={submitting}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                          />
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  {submitting ? (
                    <>
                      <Loader size={14} className="spin" />
                      Syncing...
                    </>
                  ) : (
                    'Submit to ERPNext'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Approval Modal: template selection, contract preview, terms + signer */}
      {showApproveModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 700 }}>

            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={17} />
                  Approve Booking — {selectedBookingId}
                </h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Select a template, read the contract in full, then confirm the signature.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowApproveModal(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}
                disabled={approving}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {approveError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', borderRadius: 6, padding: '10px 14px', color: 'var(--color-danger)', fontSize: 12 }}>
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  {approveError}
                </div>
              )}

              {/* Contract Template Dropdown */}
              <div className="form-group">
                <label className="form-label">Contract Template</label>
                <div style={{ position: 'relative' }}>
                  <select
                    className="form-select"
                    value={selectedTemplateId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedTemplateId(val);
                      if (val) {
                        fetchTemplateDetails(val);
                      } else {
                        setTemplateDetails(null);
                        setHasReadToBottom(false);
                        setAgreedToTerms(false);
                        setSignedByName('');
                      }
                    }}
                    disabled={loadingTemplates || approving}
                    style={{ appearance: 'none', paddingRight: 32 }}
                  >
                    <option value="">-- Select a contract template --</option>
                    {contractTemplates.map(t => (
                      <option key={t.name} value={t.name}>{t.title || t.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                </div>
                {loadingTemplates && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>
                    Loading available templates...
                  </span>
                )}
              </div>

              {/* Contract Preview with Approve action docked at the top of the section */}
              {selectedTemplateId && (
                <div className="form-group" style={{ marginBottom: 4 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 10
                  }}>
                    <div>
                      <label className="form-label" style={{ margin: 0 }}>Contract Preview</label>
                      {!hasReadToBottom && templateDetails && (
                        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 2 }}>
                          Scroll to the end to continue
                        </div>
                      )}
                    </div>

                    {/* Approve button — sits in normal flow at the top of the preview section */}
                    <button
                      type="button"
                      className="approve-cutout-btn"
                      onClick={handleApproveBooking}
                      disabled={!canApproveNow}
                      title={canApproveNow ? 'Approve this booking' : 'Read the contract and confirm terms to enable'}
                    >
                      {approving ? (
                        <>
                          <Loader size={13} className="spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={13} />
                          Approve
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    {loadingTemplateDetails ? (
                      <div style={{
                        textAlign: 'center',
                        padding: '40px 0',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 10,
                        background: 'var(--bg-tertiary)'
                      }}>
                        <Loader size={20} className="spin" style={{ margin: '0 auto 8px auto' }} />
                        <span>Loading contract terms...</span>
                      </div>
                    ) : templateDetails ? (
                      <>
                        <div
                          ref={previewRef}
                          onScroll={handlePreviewScroll}
                          className="contract-preview-scope"
                          style={{
                            border: '1px solid var(--border-color)',
                            borderRadius: 10,
                            padding: '20px 18px',
                            maxHeight: 340,
                            overflowY: 'auto',
                            background: 'var(--bg-tertiary)',
                            fontSize: 12,
                          }}
                          dangerouslySetInnerHTML={{ __html: templateDetails.contract_terms || '<p>No contract terms found for this template.</p>' }}
                        />
                        {/* Progress hint bar under the preview */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginTop: 8,
                          fontSize: 10.5,
                          color: hasReadToBottom ? 'var(--color-success)' : 'var(--text-muted)'
                        }}>
                          {hasReadToBottom ? <CheckCircle2 size={12} /> : <Eye size={12} />}
                          <span>{hasReadToBottom ? 'Full contract reviewed' : 'Reading in progress — reach the bottom to unlock the agreement below'}</span>
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '20px 0' }}>Unable to load the contract preview.</div>
                    )}
                  </div>
                </div>
              )}

              {/* Terms & Conditions Acknowledgement — locked until fully read */}
              {selectedTemplateId && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: 14,
                    opacity: hasReadToBottom ? 1 : 0.5
                  }}
                >
                  <input
                    type="checkbox"
                    id="approve-terms-checkbox"
                    checked={agreedToTerms}
                    disabled={!hasReadToBottom || approving}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setAgreedToTerms(checked);
                      if (!checked) setSignedByName('');
                    }}
                    style={{ width: 16, height: 16, cursor: hasReadToBottom ? 'pointer' : 'not-allowed' }}
                  />
                  <label
                    htmlFor="approve-terms-checkbox"
                    style={{ fontSize: 12, color: 'var(--text-secondary)', cursor: hasReadToBottom ? 'pointer' : 'not-allowed' }}
                  >
                    I have reviewed and agree to the Terms &amp; Conditions of this contract
                    {!hasReadToBottom && (
                      <span style={{ display: 'block', fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2 }}>
                        Available after the contract has been fully read
                      </span>
                    )}
                  </label>
                </div>
              )}

              {/* Signer Name Input — enabled only once terms are accepted */}
              {selectedTemplateId && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PenLine size={13} />
                    Signed By <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={agreedToTerms ? 'Enter the full name of the signing party' : 'Agree to the terms above to enable signing'}
                    value={signedByName}
                    onChange={(e) => setSignedByName(e.target.value)}
                    disabled={!agreedToTerms || approving}
                    style={{ opacity: agreedToTerms ? 1 : 0.55, cursor: agreedToTerms ? 'text' : 'not-allowed' }}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer — Cancel only; Approve lives on the preview cutout button */}
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setShowApproveModal(false)}
                className="btn btn-secondary"
                disabled={approving}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backend Validation / Notice / Confirmation Modal */}
      {alertModal.show && (() => {
        const type = alertModal.type || 'info';
        const isError = type === 'error';
        const isSuccess = type === 'success';
        const isWarning = type === 'warning';

        const theme = isError
          ? {
            headerBg: '#fff1f2',
            headerBorder: '#fecdd3',
            titleColor: '#9f1239',
            subtitleColor: '#be123c',
            subtitle: 'Validation Notice / Action Error',
            iconContainerBg: '#ffe4e6',
            icon: <AlertCircle size={22} style={{ color: '#e11d48' }} />,
            boxBg: '#fff5f5',
            boxBorder: '#fed7d7',
            boxLeftBorder: '#e11d48',
            btnBg: '#e11d48',
            btnHover: '#be123c'
          }
          : isSuccess
            ? {
              headerBg: '#ecfdf5',
              headerBorder: '#a7f3d0',
              titleColor: '#065f46',
              subtitleColor: '#047857',
              subtitle: 'Success Notification',
              iconContainerBg: '#d1fae5',
              icon: <CheckCircle2 size={22} style={{ color: '#059669' }} />,
              boxBg: '#f0fdf4',
              boxBorder: '#bbf7d0',
              boxLeftBorder: '#059669',
              btnBg: '#059669',
              btnHover: '#047857'
            }
            : isWarning
              ? {
                headerBg: '#fffbeb',
                headerBorder: '#fde68a',
                titleColor: '#92400e',
                subtitleColor: '#b45309',
                subtitle: 'Confirmation Required / Caution',
                iconContainerBg: '#fef3c7',
                icon: <AlertTriangle size={22} style={{ color: '#d97706' }} />,
                boxBg: '#fffdf5',
                boxBorder: '#fde68a',
                boxLeftBorder: '#d97706',
                btnBg: alertModal.isDestructive ? '#dc2626' : '#d97706',
                btnHover: alertModal.isDestructive ? '#b91c1c' : '#b45309'
              }
              : {
                headerBg: '#f0fdfa',
                headerBorder: '#99f6e4',
                titleColor: '#115e59',
                subtitleColor: '#0f766e',
                subtitle: 'Information Notice',
                iconContainerBg: '#ccfbf1',
                icon: <Info size={22} style={{ color: '#0d9488' }} />,
                boxBg: '#f0fdfa',
                boxBorder: '#99f6e4',
                boxLeftBorder: '#0d9488',
                btnBg: '#0a6c66',
                btnHover: '#085450'
              };

        const handleClose = () => {
          const cancelCb = alertModal.onCancel;
          setAlertModal(prev => ({ ...prev, show: false }));
          if (cancelCb) {
            try { cancelCb(); } catch (err) { console.error(err); }
          }
        };

        const handleConfirm = () => {
          const confirmCb = alertModal.onConfirm;
          setAlertModal(prev => ({ ...prev, show: false }));
          if (confirmCb) {
            try { confirmCb(); } catch (err) { console.error(err); }
          }
        };

        return (
          <div
            className="modal-overlay"
            style={{
              zIndex: 10001,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.55)',
              backdropFilter: 'blur(3px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={handleClose}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: 520,
                width: '100%',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: `1px solid ${theme.headerBorder}`,
                background: '#ffffff',
                animation: 'bookingToastIn 0.2s ease-out'
              }}
            >
              {/* Modal Header */}
              <div
                className="modal-header"
                style={{
                  background: theme.headerBg,
                  borderBottom: `1px solid ${theme.headerBorder}`,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: theme.iconContainerBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {theme.icon}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: theme.titleColor }}>
                      {alertModal.title || 'Notice'}
                    </h3>
                    <span style={{ fontSize: '11px', color: theme.subtitleColor, fontWeight: 500 }}>
                      {theme.subtitle}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: theme.titleColor,
                    cursor: 'pointer',
                    fontSize: 24,
                    lineHeight: 1,
                    padding: 4
                  }}
                >
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <div className="modal-body" style={{ padding: '20px', background: '#ffffff' }}>
                <div
                  style={{
                    background: theme.boxBg,
                    border: `1px solid ${theme.boxBorder}`,
                    borderLeft: `4px solid ${theme.boxLeftBorder}`,
                    borderRadius: '8px',
                    padding: '14px 16px',
                    color: '#1f2937',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontWeight: 500
                  }}
                >
                  {alertModal.message}
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className="modal-footer"
                style={{
                  padding: '14px 20px',
                  background: '#f8fafc',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 10
                }}
              >
                {alertModal.showCancel && (
                  <button
                    type="button"
                    onClick={handleClose}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#475569',
                      padding: '8px 18px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                  >
                    {alertModal.cancelText || 'Cancel'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={alertModal.showCancel ? handleConfirm : handleClose}
                  style={{
                    background: theme.btnBg,
                    border: `1px solid ${theme.btnBg}`,
                    color: '#ffffff',
                    padding: '8px 22px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.btnHover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.btnBg}
                >
                  {alertModal.confirmText || (alertModal.showCancel ? 'Confirm' : 'Got It')}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}




