import React, { useState, useEffect, useRef } from 'react';
import {
  Building,
  Building2,
  Receipt,
  Hammer,
  Calendar,
  ArrowUpRight,
  Sparkles,
  Bookmark,
  FileSignature,
  UserCheck,
  CreditCard,
  Plus,
  ExternalLink,
  TrendingUp,
  LayoutDashboard,
  BarChart2,
  Users,
  Award,
  Globe,
  Map,
  ChevronDown
} from 'lucide-react';
import FijiDistrictMap, { resolvePropertyDistrict, FIJI_DISTRICTS } from './FijiDistrictMap';
import MapComponent from './MapComponent';
import { ERPNEXT_CONFIG, getAuthHeaders, getApiBaseUrl } from '../config';
import {
  normalizeMonthlyApprovedBookings,
  normalizeMonthlyInvoiceStatus,
  getMonthlyApprovedBookingCountApi,
  getMonthlyApprovedBookingRawApi,
  getPropertyGroupsTotalApi,
  DEFAULT_PROPERTY_GROUP_TOTAL,
  DEFAULT_MONTHLY_APPROVED_BOOKINGS_RESPONSE
} from '../services/api';

const INITIAL_PROPERTY_COORDS = [
  {
    id: 'PROP-2041',
    name: 'Stratford Court Apartments',
    address: '12 Carpenters Road, London E15',
    latitude: -18.1416,
    longitude: 178.4415
  },
  {
    id: 'PROP-8032',
    name: 'Carpenters Row Commercial',
    address: '44 Queens Highway, Nadi, Fiji',
    latitude: -17.7765,
    longitude: 177.4356
  },
  {
    id: 'PROP-9910',
    name: 'Estate Galleria Mall',
    address: 'Naviti St, Lautoka, Fiji',
    latitude: -17.6242,
    longitude: 177.4528
  },
  {
    id: 'PROP-3091',
    name: 'E15 Plaza complex',
    address: 'Kings Road, Nausori, Rewa, Fiji',
    latitude: -18.0244,
    longitude: 178.5333
  },
  {
    id: 'PROP-F60',
    name: 'F60 Rodwell Centre',
    address: 'Cnr Rodwell/Robertson Roads, Suva, Fiji',
    latitude: -18.1350,
    longitude: 178.4270
  },
  {
    id: 'PROP-7720',
    name: 'Labasa Commercial Hub',
    address: 'Nasekula Road, Labasa, Fiji',
    latitude: -16.4332,
    longitude: 179.3645
  }
];

export default function Dashboard({
  mode = 'dashboard', // 'dashboard' or 'overview'
  currentTab = 'dashboard',
  properties = [],
  bookings: initialBookings = [],
  invoices: initialInvoices = [],
  schedules = [],
  tenants = [],
  owners = [],
  quotationsList: initialQuotations = [],
  tenantOnboardingsList: initialOnboardings = [],
  tasksList: initialTasks = [],
  commercialUnitsCount: initialCommercialUnitsCount = 0,
  draftMaintenanceCount: initialDraftMaintenanceCount = 0,
  dashboardStats: propDashboardStats = {},
  dataLoading = false,
  systemDateTime: propSystemDateTime,
  setCurrentTab = () => { },
  setBookingSearchFromQuotation = () => { },
  setPreSelectedProperty = () => { },
  setSelectedQuotationId = () => { },
  setSelectedTaskIdForMaintenance = () => { },
  setSelectedInvoiceIdForDetails = () => { },
  erpnextConfig = ERPNEXT_CONFIG
}) {
  const activeMode = mode || (currentTab === 'overview' ? 'overview' : 'dashboard');

  // Internal Date Time Clock
  const [internalDateTime, setInternalDateTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setInternalDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const systemDateTime = propSystemDateTime || internalDateTime;

  // Local Dashboard UI States
  const [dashboardDocType, setDashboardDocType] = useState('Booking');
  const [dashboardDocTypeViewMode, setDashboardDocTypeViewMode] = useState('count');
  const [topBookingStatusFilter, setTopBookingStatusFilter] = useState('All');
  const [trendViewMode, setTrendViewMode] = useState('bookings');
  const [dashboardFabOpen, setDashboardFabOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapView, setMapView] = useState(null);
  const [propertylist_withcords] = useState(INITIAL_PROPERTY_COORDS);
  const hasLoggedDashboardJsonRef = useRef(false);

  // Self-fetching fallbacks for doc lists if not passed from parent
  const [localQuotations, setLocalQuotations] = useState(initialQuotations);
  const [localOnboardings, setLocalOnboardings] = useState(initialOnboardings);
  const [localTasks, setLocalTasks] = useState(initialTasks);
  const [localCommercialUnitsCount, setLocalCommercialUnitsCount] = useState(initialCommercialUnitsCount);
  const [localDraftMaintenanceCount, setLocalDraftMaintenanceCount] = useState(initialDraftMaintenanceCount);
  const [localBookings, setLocalBookings] = useState(initialBookings);
  const [localInvoices, setLocalInvoices] = useState(initialInvoices);
  const [dashboardSummary, setDashboardSummary] = useState(() => DEFAULT_PROPERTY_GROUP_TOTAL);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [monthlyApprovedCounts, setMonthlyApprovedCounts] = useState(() => normalizeMonthlyApprovedBookings(DEFAULT_MONTHLY_APPROVED_BOOKINGS_RESPONSE));
  const [monthlyInvoiceData, setMonthlyInvoiceData] = useState(() => normalizeMonthlyInvoiceStatus(DEFAULT_MONTHLY_APPROVED_BOOKINGS_RESPONSE));
  const [invoiceChartMode, setInvoiceChartMode] = useState('count'); // 'count' or 'percent'
  const [hoveredInvoiceSegment, setHoveredInvoiceSegment] = useState(null);
  const [isMonthlyApprovedLoading, setIsMonthlyApprovedLoading] = useState(false);

  // Fetch Monthly Approved Booking & Invoice Status from /api/method/get_monthly_approved_booking_count
  useEffect(() => {
    let isMounted = true;
    const fetchMonthlyApproved = async () => {
      try {
        setIsMonthlyApprovedLoading(true);
        const raw = await getMonthlyApprovedBookingRawApi();
        if (isMounted && raw) {
          setMonthlyApprovedCounts(normalizeMonthlyApprovedBookings(raw));
          setMonthlyInvoiceData(normalizeMonthlyInvoiceStatus(raw));
        }
      } catch (err) {
        console.warn('Failed to fetch get_monthly_approved_booking_count:', err);
      } finally {
        if (isMounted) setIsMonthlyApprovedLoading(false);
      }
    };

    fetchMonthlyApproved();
    return () => { isMounted = false; };
  }, [erpnextConfig?.url]);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardSummary = async () => {
      try {
        setIsSummaryLoading(true);
        const data = await getPropertyGroupsTotalApi();
        if (isMounted && data) {
          setDashboardSummary(data);
        }
      } catch (err) {
        console.warn('Failed to fetch get_property_group_total summary:', err);
      } finally {
        if (isMounted) setIsSummaryLoading(false);
      }
    };

    fetchDashboardSummary();
    return () => { isMounted = false; };
  }, [erpnextConfig?.url]);

  useEffect(() => {
    if (initialQuotations && initialQuotations.length > 0) setLocalQuotations(initialQuotations);
  }, [initialQuotations]);

  useEffect(() => {
    if (initialOnboardings && initialOnboardings.length > 0) setLocalOnboardings(initialOnboardings);
  }, [initialOnboardings]);

  useEffect(() => {
    if (initialTasks && initialTasks.length > 0) setLocalTasks(initialTasks);
  }, [initialTasks]);

  useEffect(() => {
    if (initialCommercialUnitsCount) setLocalCommercialUnitsCount(initialCommercialUnitsCount);
  }, [initialCommercialUnitsCount]);

  useEffect(() => {
    if (initialDraftMaintenanceCount) setLocalDraftMaintenanceCount(initialDraftMaintenanceCount);
  }, [initialDraftMaintenanceCount]);

  useEffect(() => {
    if (initialBookings && initialBookings.length > 0) setLocalBookings(initialBookings);
  }, [initialBookings]);

  useEffect(() => {
    if (initialInvoices && initialInvoices.length > 0) setLocalInvoices(initialInvoices);
  }, [initialInvoices]);

  // If lists are empty and ERPNext URL is present, fetch them
  useEffect(() => {
    if (!erpnextConfig?.url) return;
    let isMounted = true;

    // Fetch Quotations if empty
    if (localQuotations.length === 0) {
      const qFields = JSON.stringify(["name", "status", "workflow_state", "docstatus", "grand_total", "net_total", "total"]);
      fetch(`${erpnextConfig.url}/api/resource/Quotation?fields=${encodeURIComponent(qFields)}&limit_page_length=500`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(r => r.json())
        .then(d => { if (isMounted && d.data) setLocalQuotations(d.data); })
        .catch(() => { });
    }

    // Fetch Tenant Onboardings if empty
    if (localOnboardings.length === 0) {
      const tFields = JSON.stringify(["name", "workflow_state", "docstatus", "rental_charges", "security_deposit_booking_fee", "budget"]);
      fetch(`${erpnextConfig.url}/api/resource/Tenant%20Onboarding?fields=${encodeURIComponent(tFields)}&limit_page_length=500`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(r => r.json())
        .then(d => { if (isMounted && d.data) setLocalOnboardings(d.data); })
        .catch(() => { });
    }

    // Fetch Tasks if empty
    if (localTasks.length === 0) {
      const taskFields = JSON.stringify(["name", "status", "expected_time", "actual_time", "total_cost"]);
      fetch(`${erpnextConfig.url}/api/resource/Task?fields=${encodeURIComponent(taskFields)}&limit_page_length=500`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(r => r.json())
        .then(d => { if (isMounted && d.data) setLocalTasks(d.data); })
        .catch(() => { });
    }

    // Fetch Commercial Units count if not provided
    if (!localCommercialUnitsCount) {
      const itemFilter = encodeURIComponent(JSON.stringify([["item_group", "=", "Commercial"]]));
      fetch(`${erpnextConfig.url}/api/resource/Item?filters=${itemFilter}&fields=%5B%22name%22%5D&limit_page_length=500`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(r => r.json())
        .then(d => { if (isMounted && d.data) setLocalCommercialUnitsCount(d.data.length); })
        .catch(() => { });
    }

    // Fetch Bookings if empty
    if (localBookings.length === 0) {
      const bFields = JSON.stringify(["name", "property", "booking_date", "booking_amount", "workflow_state", "starting_date", "ending_date", "customer", "customer_name", "booking_type", "payment_status", "paid_amount", "pending_amount", "advance_amount", "total_days", "quotation"]);
      fetch(`${erpnextConfig.url}/api/resource/Booking?fields=${encodeURIComponent(bFields)}&limit_page_length=500`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(r => r.json())
        .then(d => { if (isMounted && d.data) setLocalBookings(d.data); })
        .catch(() => { });
    }

    // Fetch Invoices if empty
    if (localInvoices.length === 0) {
      const invFields = JSON.stringify(["name", "customer", "customer_name", "posting_date", "due_date", "grand_total", "rounded_total", "outstanding_amount", "paid_amount", "status", "creation", "booking_id", "currency", "terms_and_conditions", "terms", "docstatus"]);
      fetch(`${erpnextConfig.url}/api/resource/Sales%20Invoice?fields=${encodeURIComponent(invFields)}&order_by=creation%20desc&limit_page_length=500`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(r => r.json())
        .then(d => { if (isMounted && d.data) setLocalInvoices(d.data); })
        .catch(() => { });
    }

    return () => { isMounted = false; };
  }, [erpnextConfig?.url]);

  const quotationsList = localQuotations;
  const tenantOnboardingsList = localOnboardings;
  const tasksList = localTasks;
  const commercialUnitsCount = localCommercialUnitsCount;
  const draftMaintenanceCount = localDraftMaintenanceCount;
  const bookings = localBookings.length > 0 ? localBookings : initialBookings;
  const invoices = localInvoices.length > 0 ? localInvoices : initialInvoices;

  const dashboardStats = {
    totalProperties: properties.length || propDashboardStats.totalProperties || 0,
    occupancyRate: propDashboardStats.occupancyRate || (properties.length > 0 ? Math.round(properties.reduce((acc, p) => acc + (p.occupancy || 80), 0) / properties.length) : 82),
    monthlyRevenue: propDashboardStats.monthlyRevenue || 0,
    pendingMaintenance: draftMaintenanceCount || propDashboardStats.pendingMaintenance || 0,
    commercialUnits: commercialUnitsCount || propDashboardStats.commercialUnits || 0,
    ...propDashboardStats
  };

  // 1. Calculate Invoice Aging
  let current = 0;
  let overdue30 = 0;
  let overdue60 = 0;
  let overdue90 = 0;
  let overdueMore = 0;
  const today = new Date();
  invoices.forEach(inv => {
    if ((inv.status || '').toLowerCase() === 'paid') return;
    const amount = inv.outstanding_amount || inv.amount || inv.grand_total || 0;
    if (amount <= 0) return;
    const dueDateStr = inv.due_date || inv.dueDate;
    if (!dueDateStr) {
      current += amount;
      return;
    }
    const dueDate = new Date(dueDateStr);
    const diffTime = today - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) current += amount;
    else if (diffDays <= 30) overdue30 += amount;
    else if (diffDays <= 60) overdue60 += amount;
    else if (diffDays <= 90) overdue90 += amount;
    else overdueMore += amount;
  });
  const aging = { current, overdue30, overdue60, overdue90, overdueMore };

  // Calculate Total Paid Amount in Sales Invoice for the Current Month
  const nowRev = new Date();
  const curYearMonth = `${nowRev.getFullYear()}-${String(nowRev.getMonth() + 1).padStart(2, '0')}`;
  let currentMonthPaidRevenue = 0;
  (invoices || []).forEach(inv => {
    const pDate = (inv.posting_date || inv.issuedDate || inv.creation || '').slice(0, 7);
    if (pDate === curYearMonth) {
      const grandTotal = parseFloat(inv.grand_total || inv.rounded_total || inv.amount || 0);
      const outstanding = parseFloat(inv.outstanding_amount !== undefined ? inv.outstanding_amount : (inv.outstandingAmount !== undefined ? inv.outstandingAmount : 0));
      let paid = 0;
      if (inv.paid_amount !== undefined && inv.paid_amount !== null && !isNaN(parseFloat(inv.paid_amount)) && parseFloat(inv.paid_amount) > 0) {
        paid = parseFloat(inv.paid_amount);
      } else if ((inv.status || '').toLowerCase() === 'paid') {
        paid = grandTotal;
      } else if (grandTotal > outstanding) {
        paid = grandTotal - outstanding;
      }
      currentMonthPaidRevenue += Math.max(0, paid);
    }
  });

  const monthlyPaidRevenueValue = currentMonthPaidRevenue > 0
    ? currentMonthPaidRevenue
    : (parseFloat(dashboardStats.monthlyRevenue) || 0);

  // 2. Occupancy / Booking Inflow Trends (Last 12 Months)
  // Powered by https://pms.advtinni.com/api/method/get_monthly_approved_booking_count
  // Any month not available in that response defaults to 0
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const trendMap = {};
  monthNames.forEach(m => {
    trendMap[m] = (monthlyApprovedCounts && monthlyApprovedCounts[m] !== undefined)
      ? Number(monthlyApprovedCounts[m]) || 0
      : 0;
  });
  const maxTrendVal = Math.max(...Object.values(trendMap), 1);
  const occupancyTrends = monthNames.map(m => ({
    m,
    v: trendMap[m] || 0,
    pct: Math.round(((trendMap[m] || 0) / maxTrendVal) * 100)
  }));
  const totalApprovedTransactions = Object.values(trendMap).reduce((acc, v) => acc + (v || 0), 0);

  // 3. Dynamic DocType Real Value & Status Distribution
  const STATUS_PALETTE = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#6366f1', '#ef4444'];
  const DOCTYPE_PALETTE = {
    'Booking': '#3b82f6',
    'Quotation': '#8b5cf6',
    'Tenant Onboarding': '#10b981',
    'Onboarding': '#10b981',
    'Task': '#f59e0b'
  };

  const bookingTotalRealVal = bookings.reduce((sum, b) => {
    const amt = parseFloat(b.booking_amount || 0);
    if (amt > 0) return sum + amt;
    const paid = parseFloat(b.paid_amount || 0);
    const pending = parseFloat(b.pending_amount || 0);
    return sum + (paid + pending > 0 ? (paid + pending) : paid);
  }, 0);

  const quotationTotalRealVal = quotationsList.reduce((sum, q) => {
    return sum + (parseFloat(q.grand_total || q.net_total || q.total || 0));
  }, 0);

  const onboardingTotalRealVal = tenantOnboardingsList.reduce((sum, t) => {
    const rent = parseFloat(t.rental_charges || 0);
    const deposit = parseFloat(t.security_deposit_booking_fee || 0);
    const budget = parseFloat(t.budget || 0);
    return sum + (rent + deposit > 0 ? (rent + deposit) : budget);
  }, 0);

  const taskTotalRealVal = tasksList.reduce((sum, t) => {
    const cost = parseFloat(t.total_cost || t.cost || 0);
    if (cost > 0) return sum + cost;
    const hours = parseFloat(t.actual_time || t.expected_time || 0);
    return sum + (hours > 0 ? hours * 60 : 0);
  }, 0);

  const safeBookingVal = bookingTotalRealVal > 0 ? bookingTotalRealVal : (bookings.length > 0 ? bookings.length * 1500 : 0);
  const safeQuotationVal = quotationTotalRealVal > 0 ? quotationTotalRealVal : (quotationsList.length > 0 ? quotationsList.length * 1800 : 0);
  const safeOnboardingVal = onboardingTotalRealVal > 0 ? onboardingTotalRealVal : (tenantOnboardingsList.length > 0 ? tenantOnboardingsList.length * 2500 : 0);
  const safeTaskVal = taskTotalRealVal > 0 ? taskTotalRealVal : (tasksList.length > 0 ? tasksList.length * 350 : 0);

  let docTypeSegments = [];
  let docTypeCenterTitle = '';
  let docTypeCenterSubtitle = '';
  let docTypeTotalRecords = 0;
  let docTypeTotalRealValue = 0;

  if (dashboardDocType === 'All') {
    const bookingApiCounts = dashboardSummary?.['Booking Status Counts'];
    const quotationApiCounts = dashboardSummary?.['Quotation Status Counts'];
    const onboardingApiCounts = dashboardSummary?.['Tenant Onboarding Status Counts'];
    const taskApiCounts = dashboardSummary?.['Task Status Counts'];

    const bookingTotalCount = bookingApiCounts
      ? Object.values(bookingApiCounts).reduce((a, b) => a + Number(b), 0)
      : bookings.length;
    const quotationTotalCount = quotationApiCounts
      ? Object.values(quotationApiCounts).reduce((a, b) => a + Number(b), 0)
      : quotationsList.length;
    const onboardingTotalCount = onboardingApiCounts
      ? Object.values(onboardingApiCounts).reduce((a, b) => a + Number(b), 0)
      : tenantOnboardingsList.length;
    const taskTotalCount = taskApiCounts
      ? Object.values(taskApiCounts).reduce((a, b) => a + Number(b), 0)
      : tasksList.length;

    const allMentionedDocs = [
      {
        id: 'Booking',
        label: 'Booking',
        color: DOCTYPE_PALETTE['Booking'],
        realValue: safeBookingVal,
        count: bookingTotalCount
      },
      {
        id: 'Quotation',
        label: 'Quotation',
        color: DOCTYPE_PALETTE['Quotation'],
        realValue: safeQuotationVal,
        count: quotationTotalCount
      },
      {
        id: 'Tenant Onboarding',
        label: 'Onboarding',
        color: DOCTYPE_PALETTE['Tenant Onboarding'],
        realValue: safeOnboardingVal,
        count: onboardingTotalCount
      },
      {
        id: 'Task',
        label: 'Task',
        color: DOCTYPE_PALETTE['Task'],
        realValue: safeTaskVal,
        count: taskTotalCount
      }
    ];

    docTypeTotalRealValue = allMentionedDocs.reduce((acc, d) => acc + d.realValue, 0);
    docTypeTotalRecords = allMentionedDocs.reduce((acc, d) => acc + d.count, 0);

    const isValueMode = dashboardDocTypeViewMode === 'value';
    const denominator = isValueMode ? (docTypeTotalRealValue || 1) : (docTypeTotalRecords || 1);

    let cumOffset = 0;
    docTypeSegments = allMentionedDocs.map((doc) => {
      const primaryMetric = isValueMode ? doc.realValue : doc.count;
      const pct = Math.max(1, Math.round((primaryMetric / denominator) * 100));
      const seg = {
        label: doc.label,
        count: doc.count,
        realValue: doc.realValue,
        pct,
        color: doc.color,
        offset: -cumOffset
      };
      cumOffset += pct;
      return seg;
    });

    if (isValueMode) {
      if (docTypeTotalRealValue >= 1000000) {
        docTypeCenterTitle = `F$${(docTypeTotalRealValue / 1000000).toFixed(1)}M`;
      } else if (docTypeTotalRealValue >= 1000) {
        docTypeCenterTitle = `F$${(docTypeTotalRealValue / 1000).toFixed(1)}K`;
      } else {
        docTypeCenterTitle = `F$${Math.round(docTypeTotalRealValue).toLocaleString()}`;
      }
      docTypeCenterSubtitle = 'REAL VALUE';
    } else {
      docTypeCenterTitle = `${docTypeTotalRecords}`;
      docTypeCenterSubtitle = 'TOTAL RECORDS';
    }
  } else {
    let itemsList = [];
    let itemValGetter = () => 0;
    let apiStatusCounts = null;
    let safeDocVal = 0;

    if (dashboardDocType === 'Booking') {
      apiStatusCounts = dashboardSummary?.['Booking Status Counts'];
      safeDocVal = safeBookingVal;
      itemsList = bookings.length > 0 ? bookings : [
        { workflow_state: 'Approved', booking_amount: 1500 },
        { workflow_state: 'Approved', booking_amount: 2200 },
        { workflow_state: 'Draft', booking_amount: 800 },
        { workflow_state: 'Pending', booking_amount: 1200 },
        { workflow_state: 'Cancelled', booking_amount: 600 }
      ];
      itemValGetter = (b) => {
        const amt = parseFloat(b.booking_amount || 0);
        if (amt > 0) return amt;
        const paid = parseFloat(b.paid_amount || 0);
        const pending = parseFloat(b.pending_amount || 0);
        return paid + pending > 0 ? (paid + pending) : (paid || (safeBookingVal / (itemsList.length || 1)));
      };
    } else if (dashboardDocType === 'Quotation') {
      apiStatusCounts = dashboardSummary?.['Quotation Status Counts'];
      safeDocVal = safeQuotationVal;
      itemsList = quotationsList.length > 0 ? quotationsList : [
        { workflow_state: 'Submitted', grand_total: 2400 },
        { workflow_state: 'Submitted', grand_total: 3100 },
        { workflow_state: 'Draft', grand_total: 1200 },
        { workflow_state: 'Approved', grand_total: 4500 },
        { workflow_state: 'Cancelled', grand_total: 900 }
      ];
      itemValGetter = (q) => {
        const t = parseFloat(q.grand_total || q.net_total || q.total || 0);
        return t > 0 ? t : (safeQuotationVal / (itemsList.length || 1));
      };
    } else if (dashboardDocType === 'Tenant Onboarding') {
      apiStatusCounts = dashboardSummary?.['Tenant Onboarding Status Counts'];
      safeDocVal = safeOnboardingVal;
      itemsList = tenantOnboardingsList.length > 0 ? tenantOnboardingsList : [
        { workflow_state: 'Approved', rental_charges: 3000, security_deposit_booking_fee: 1500 },
        { workflow_state: 'Under Review', rental_charges: 2500, security_deposit_booking_fee: 1000 },
        { workflow_state: 'Draft', budget: 2000 }
      ];
      itemValGetter = (t) => {
        const rent = parseFloat(t.rental_charges || 0);
        const deposit = parseFloat(t.security_deposit_booking_fee || 0);
        const budget = parseFloat(t.budget || 0);
        const val = rent + deposit > 0 ? (rent + deposit) : budget;
        return val > 0 ? val : (safeOnboardingVal / (itemsList.length || 1));
      };
    } else if (dashboardDocType === 'Task') {
      apiStatusCounts = dashboardSummary?.['Task Status Counts'];
      safeDocVal = safeTaskVal;
      itemsList = tasksList.length > 0 ? tasksList : [
        { status: 'Open', total_cost: 350 },
        { status: 'Working', total_cost: 500 },
        { status: 'Completed', total_cost: 650 },
        { status: 'Pending Review', total_cost: 400 }
      ];
      itemValGetter = (t) => {
        const cost = parseFloat(t.total_cost || t.cost || 0);
        if (cost > 0) return cost;
        const hours = parseFloat(t.actual_time || t.expected_time || 0);
        return hours > 0 ? hours * 60 : (safeTaskVal / (itemsList.length || 1));
      };
    }

    const statusMap = {};

    if (apiStatusCounts && typeof apiStatusCounts === 'object') {
      const totalApiCount = Object.values(apiStatusCounts).reduce((acc, c) => acc + (Number(c) || 0), 0);
      const avgValPerRecord = totalApiCount > 0 ? (safeDocVal / totalApiCount) : 0;

      Object.entries(apiStatusCounts).forEach(([statusKey, countVal]) => {
        const count = Number(countVal) || 0;
        const matchingLocalItems = itemsList.filter(item => {
          const rawStatus = item.workflow_state || item.status || (item.docstatus === 1 ? 'Approved' : item.docstatus === 2 ? 'Cancelled' : 'Draft');
          return String(rawStatus || '').toLowerCase() === String(statusKey || '').toLowerCase();
        });

        let realValue = matchingLocalItems.reduce((acc, it) => acc + itemValGetter(it), 0);
        if (realValue <= 0 && count > 0) {
          realValue = count * avgValPerRecord;
        }

        statusMap[statusKey] = {
          count,
          realValue
        };
      });

      docTypeTotalRecords = totalApiCount;
    } else {
      itemsList.forEach(item => {
        const rawStatus = item.workflow_state || item.status || (item.docstatus === 1 ? 'Approved' : item.docstatus === 2 ? 'Cancelled' : 'Draft');
        const s = String(rawStatus || 'Draft').trim();
        const norm = s.charAt(0).toUpperCase() + s.slice(1);
        const val = itemValGetter(item);
        if (!statusMap[norm]) {
          statusMap[norm] = { count: 0, realValue: 0 };
        }
        statusMap[norm].count += 1;
        statusMap[norm].realValue += val;
      });

      docTypeTotalRecords = itemsList.length;
    }

    docTypeTotalRealValue = Object.values(statusMap).reduce((acc, st) => acc + st.realValue, 0);

    const isValueMode = dashboardDocTypeViewMode === 'value';
    const denominator = isValueMode ? (docTypeTotalRealValue || 1) : (docTypeTotalRecords || 1);

    const statusKeys = Object.keys(statusMap);
    let cumOffset = 0;
    docTypeSegments = statusKeys.map((k, idx) => {
      const st = statusMap[k];
      const primaryMetric = isValueMode ? st.realValue : st.count;
      const pct = Math.max(1, Math.round((primaryMetric / denominator) * 100));
      const seg = {
        label: k,
        count: st.count,
        realValue: st.realValue,
        pct,
        color: STATUS_PALETTE[idx % STATUS_PALETTE.length],
        offset: -cumOffset
      };
      cumOffset += pct;
      return seg;
    });

    if (isValueMode) {
      if (docTypeTotalRealValue >= 1000000) {
        docTypeCenterTitle = `F$${(docTypeTotalRealValue / 1000000).toFixed(1)}M`;
      } else if (docTypeTotalRealValue >= 1000) {
        docTypeCenterTitle = `F$${(docTypeTotalRealValue / 1000).toFixed(1)}K`;
      } else {
        docTypeCenterTitle = `F$${Math.round(docTypeTotalRealValue).toLocaleString()}`;
      }
      docTypeCenterSubtitle = 'TOTAL VALUE';
    } else {
      docTypeCenterTitle = `${docTypeTotalRecords}`;
      docTypeCenterSubtitle = 'RECORDS';
    }
  }

  const docTypeTotal = docTypeTotalRecords;

  // Filter specifically for Active Bookings
  const activeBookings = bookings.filter(b => {
    if (b.docstatus === 2) return false;
    const ws = (b.workflow_state || '').trim().toLowerCase();
    const st = (b.status || '').trim().toLowerCase();
    if (['cancelled', 'cancel', 'rejected', 'draft'].includes(ws)) return false;
    if (['cancelled', 'cancel', 'rejected', 'draft'].includes(st)) return false;
    return ws === 'approved' || ws === 'active' || st === 'confirmed' || st === 'active' || b.docstatus === 1;
  });

  const detectedStatuses = new Set();
  bookings.forEach(b => {
    const s = b.workflow_state || b.status;
    if (s && typeof s === 'string' && s.trim()) detectedStatuses.add(s.trim());
  });
  ['Active', 'Approved', 'Confirmed', 'Request For Approval', 'Waiting For Contract Submit', 'Draft', 'Cancelled', 'Rejected'].forEach(s => detectedStatuses.add(s));
  const bookingStatusOptions = ['All', ...Array.from(detectedStatuses)];

  const filteredBookingsByStatus = bookings.filter(b => {
    if (topBookingStatusFilter === 'All') return true;
    const ws = (b.workflow_state || '').trim().toLowerCase();
    const st = (b.status || '').trim().toLowerCase();
    const filterLower = topBookingStatusFilter.toLowerCase();

    if (filterLower === 'active' || filterLower === 'confirmed') {
      return ws === 'approved' || ws === 'active' || st === 'confirmed' || st === 'active' || (b.docstatus === 1 && ws !== 'cancelled');
    }
    if (filterLower === 'approved') {
      return ws === 'approved' || st === 'approved' || (b.docstatus === 1 && !ws);
    }
    if (filterLower === 'draft' || filterLower === 'pending') {
      return ws === 'draft' || st === 'draft' || b.docstatus === 0;
    }
    if (filterLower === 'cancelled' || filterLower === 'cancel') {
      return ws === 'cancelled' || st === 'cancelled' || b.docstatus === 2;
    }
    return ws === filterLower || st === filterLower;
  });

  const sortedBookings = [...filteredBookingsByStatus].sort((a, b) => {
    const amtA = parseFloat(a.booking_amount || a.paid_amount || 0);
    const amtB = parseFloat(b.booking_amount || b.paid_amount || 0);
    if (amtB !== amtA) return amtB - amtA;
    const dateA = new Date(a.booking_date || a.starting_date || 0);
    const dateB = new Date(b.booking_date || b.starting_date || 0);
    return dateB - dateA;
  });

  let topFiveBookings = sortedBookings.slice(0, 5);
  if (topFiveBookings.length === 0 && bookings.length === 0) {
    topFiveBookings = [
      { name: 'BKG-2024-0012', customer_name: 'Vodafone Fiji Ltd', customer: 'CUST-0012', property: 'Carpenters Tower - Floor 4', booking_amount: 18500, workflow_state: 'Active', status: 'Active', booking_date: '2024-11-01' },
      { name: 'BKG-2024-0008', customer_name: 'ANZ Banking Group', customer: 'CUST-0008', property: 'Harbour Front Retail #102', booking_amount: 14200, workflow_state: 'Active', status: 'Active', booking_date: '2024-10-18' },
      { name: 'BKG-2024-0019', customer_name: 'TotalEnergies Marketing', customer: 'CUST-0019', property: 'Commercial Bay Depot', booking_amount: 9800, workflow_state: 'Active', status: 'Active', booking_date: '2024-10-05' },
      { name: 'BKG-2024-0003', customer_name: 'Prouds Fiji Duty Free', customer: 'CUST-0003', property: 'Estate Galleria Mall #G-08', booking_amount: 7600, workflow_state: 'Active', status: 'Active', booking_date: '2024-09-22' },
      { name: 'BKG-2024-0021', customer_name: 'KPMG Advisory Services', customer: 'CUST-0021', property: 'MHCC Office Suites #5A', booking_amount: 6400, workflow_state: 'Active', status: 'Active', booking_date: '2024-09-10' }
    ];
  }

  // Calculate District-wise Property Group Counts for Fiji
  const districtSummaryMap = {};
  properties.forEach((p, idx) => {
    const d = resolvePropertyDistrict(p, idx);
    const div = FIJI_DISTRICTS[d]?.division || 'Fiji Division';
    if (!districtSummaryMap[d]) {
      districtSummaryMap[d] = {
        district: d,
        division: div,
        propertyGroupsCount: 0,
        propertyGroups: []
      };
    }
    districtSummaryMap[d].propertyGroupsCount += 1;
    districtSummaryMap[d].propertyGroups.push({
      id: p.id,
      name: p.name,
      type: p.type,
      unitsCount: p.unitsCount || 0
    });
  });
  const districtWiseList = Object.values(districtSummaryMap).sort((a, b) => b.propertyGroupsCount - a.propertyGroupsCount);

  // Complete Dashboard Page Data JSON
  const dashboardPageJson = {
    timestamp: new Date().toISOString(),
    page: 'Executive Dashboard',
    districtWisePropertyGroups: districtWiseList,
    kpiCards: {
      totalProperties: {
        title: 'Total Properties',
        value: dashboardStats.totalProperties,
        badge: '+5% Active'
      },
      commercialUnits: {
        title: 'Commercial Units',
        value: commercialUnitsCount || dashboardStats.commercialUnits || 0,
        doctype: 'Item',
        item_group: 'Commercial'
      },
      monthlyRevenue: {
        title: 'Monthly Revenue',
        value: monthlyPaidRevenueValue,
        formatted: `F$${Number(monthlyPaidRevenueValue || 0).toLocaleString()}`,
        period: curYearMonth,
        description: 'Total Paid Amount in Sales Invoice this month'
      },
      pendingMaintenance: {
        title: 'Pending Maintenance',
        value: dashboardStats.pendingMaintenance,
        badge: 'Active Tasks'
      }
    },
    topFiveBookingsAndTenants: {
      selectedStatusFilter: topBookingStatusFilter,
      totalMatchingBookings: filteredBookingsByStatus.length,
      activeBookingsCount: activeBookings.length,
      bookings: topFiveBookings.map((b, idx) => ({
        rank: idx + 1,
        tenantName: b.customer_name || b.customer || b.name || 'Tenant',
        customerCode: b.customer || '',
        bookingId: b.name,
        property: b.property || 'Estate Asset',
        contractValue: parseFloat(b.booking_amount || b.paid_amount || 0),
        status: b.workflow_state || b.status || (b.docstatus === 1 ? 'Approved' : 'Active'),
        bookingDate: b.booking_date || b.starting_date || ''
      }))
    },
    docTypeStatusDistribution: {
      selectedDocType: dashboardDocType,
      totalRecords: docTypeTotal,
      segments: docTypeSegments.map(s => ({
        status: s.label,
        count: s.count,
        percentage: `${s.pct}%`
      }))
    },
    occupancyTrends: {
      mode: trendViewMode,
      data: occupancyTrends
    },
    invoiceAging: aging,
    sourceCounts: {
      totalPropertiesCount: properties.length,
      totalBookingsCount: bookings.length,
      totalInvoicesCount: invoices.length,
      totalQuotationsCount: quotationsList.length,
      totalTenantOnboardingsCount: tenantOnboardingsList.length,
      totalTasksCount: tasksList.length
    }
  };

  if (typeof window !== 'undefined') {
    window.__PMS_DASHBOARD_DATA__ = dashboardPageJson;
    window.printDashboardJson = () => {
      console.log('📊 [PMS Dashboard Page JSON]:', window.__PMS_DASHBOARD_DATA__);
      console.log('📄 [PMS Dashboard Page JSON String]:\n' + JSON.stringify(window.__PMS_DASHBOARD_DATA__, null, 2));
    };
  }

  if (!hasLoggedDashboardJsonRef.current && (!dataLoading || properties.length > 0 || bookings.length > 0)) {
    hasLoggedDashboardJsonRef.current = true;
    console.log('📊 [PMS Dashboard Page JSON]:', dashboardPageJson);
    console.log('📄 [PMS Dashboard Page JSON String]:\n' + JSON.stringify(dashboardPageJson, null, 2));
  }

  // Calendar Helper Logic
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const startDayOffset = getFirstDayOfMonth(calYear, calMonth);
  const prevMonthDays = getDaysInMonth(calYear, calMonth - 1);
  const daysArray = [];
  for (let i = startDayOffset - 1; i >= 0; i--) {
    daysArray.push({ day: prevMonthDays - i, isCurrentMonth: false, monthOffset: -1 });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push({ day: i, isCurrentMonth: true, monthOffset: 0 });
  }
  const remainingCells = 42 - daysArray.length;
  for (let i = 1; i <= remainingCells; i++) {
    daysArray.push({ day: i, isCurrentMonth: false, monthOffset: 1 });
  }

  const getDayEvents = (day, isCurr) => {
    if (!isCurr) return [];
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const evts = [];
    bookings.forEach(b => {
      if (b.booking_date === dateStr) evts.push({ type: 'booking', text: `Booking: ${b.customer_name || b.name}` });
    });
    schedules.forEach(sch => {
      if (sch.transaction_date === dateStr) evts.push({ type: 'maintenance', text: `Maint: ${sch.customer_name || sch.name}` });
    });
    return evts;
  };

  // ==========================================
  // RENDER: OPERATIONS OVERVIEW MODE
  // ==========================================
  if (activeMode === 'overview') {
    let resCount = 0;
    let commCount = 0;
    let mallCount = 0;
    properties.forEach(p => {
      const type = (p.type || '').toLowerCase();
      if (type === 'residential') resCount++;
      else if (type === 'mall') mallCount++;
      else commCount++;
    });
    const totalProp = properties.length || 1;
    const resPct = Math.round((resCount / totalProp) * 100);
    const commPct = Math.round((commCount / totalProp) * 100);
    const mallPct = Math.round((mallCount / totalProp) * 100);
    const resOffset = 0;
    const commOffset = -resPct;
    const mallOffset = -(resPct + commPct);
    const propertyListings = properties.slice(0, 10);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Header */}
        <div className="view-header" style={{ marginBottom: 0, position: 'relative', overflow: 'visible' }}>
          <div>
            <h1 className="view-title" style={{ fontSize: '1.65rem' }}>Overview</h1>
            <p className="view-subtitle">Operations overview for Carpenters Properties & retail units.</p>
          </div>
          <div style={{ position: 'relative', zIndex: 100 }}>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 500,
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <Calendar size={16} />
              <span>{systemDateTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} {systemDateTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }} onClick={() => setCurrentTab('properties')}>
            <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', color: '#fff', padding: 12, borderRadius: 12, display: 'flex' }}>
              <Building size={24} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Total Properties</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                {dashboardStats.totalProperties} <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>+5%</span>
              </div>
            </div>
          </div>

          <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }} onClick={() => { setBookingSearchFromQuotation(''); setCurrentTab('bookings'); }}>
            <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #d946ef)', color: '#fff', padding: 12, borderRadius: 12, display: 'flex' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Occupancy Rate</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                {dashboardStats.occupancyRate}% <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>+0.8%</span>
              </div>
            </div>
          </div>

          <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }} onClick={() => setCurrentTab('invoices')}>
            <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', padding: 12, borderRadius: 12, display: 'flex' }}>
              <Receipt size={24} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Monthly Revenue</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                F${Number(dashboardStats.monthlyRevenue || 0).toLocaleString()} <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Paid</span>
              </div>
            </div>
          </div>

          <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }} onClick={() => setCurrentTab('maintenance')}>
            <div style={{ background: 'linear-gradient(135deg, #34d399, #059669)', color: '#fff', padding: 12, borderRadius: 12, display: 'flex' }}>
              <Hammer size={24} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Pending Maintenance</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                {dashboardStats.pendingMaintenance} <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>+10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Middle Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: 20 }}>
          {/* Occupancy Trends Bar Chart */}
          <div className="card-panel" style={{ margin: 0, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '0.975rem', fontWeight: 600 }}>Occupancy Trends (Last 12 Months)</h3>
              <select className="form-select" style={{ width: 130, padding: '4px 8px', fontSize: 11, borderRadius: 6 }}>
                <option>Active Bookings</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 160, paddingBottom: 10, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, borderBottom: '1px dashed var(--border-color)', height: 0 }} />
              <div style={{ position: 'absolute', top: 40, left: 0, right: 0, borderBottom: '1px dashed var(--border-color)', height: 0 }} />
              <div style={{ position: 'absolute', top: 80, left: 0, right: 0, borderBottom: '1px dashed var(--border-color)', height: 0 }} />
              <div style={{ position: 'absolute', top: 120, left: 0, right: 0, borderBottom: '1px dashed var(--border-color)', height: 0 }} />

              {occupancyTrends.map((item, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{item.v}</span>
                  <div style={{
                    height: `${Math.max(item.pct * 1.2, 4)}px`,
                    width: 24,
                    background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.3s ease'
                  }} />
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 6 }}>{item.m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Property Distribution */}
          <div className="card-panel" style={{ margin: 0, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '0.975rem', fontWeight: 600, marginBottom: 14 }}>Property Distribution</h3>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 110 }}>
              <svg width="100" height="100" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4.2" strokeDasharray={`${resPct} ${100 - resPct}`} strokeDashoffset={resOffset} />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="4.2" strokeDasharray={`${commPct} ${100 - commPct}`} strokeDashoffset={commOffset} />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.2" strokeDasharray={`${mallPct} ${100 - mallPct}`} strokeDashoffset={mallOffset} />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, marginTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />
                  <span>Residential</span>
                </div>
                <strong style={{ color: 'var(--text-primary)' }}>{resPct}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6' }} />
                  <span>Commercial</span>
                </div>
                <strong style={{ color: 'var(--text-primary)' }}>{commPct}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                  <span>Mall</span>
                </div>
                <strong style={{ color: 'var(--text-primary)' }}>{mallPct}%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Table & Aging Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: 20 }}>
          <div className="card-panel" style={{ margin: 0, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: '0.975rem', fontWeight: 600 }}>Property Listings</h3>
              <select className="form-select" style={{ width: 130, padding: '4px 8px', fontSize: 11, borderRadius: 6 }}>
                <option>All Properties</option>
              </select>
            </div>
            <div className="table-container" style={{ border: 'none', marginTop: 0, maxHeight: '280px', overflowY: 'auto' }}>
              <table className="custom-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: 40, padding: '10px' }}><input type="checkbox" readOnly checked /></th>
                    <th style={{ padding: '10px' }}>Property Name</th>
                    <th style={{ padding: '10px' }}>Type</th>
                    <th style={{ padding: '10px' }}>Units (Total/Occ)</th>
                    <th style={{ padding: '10px' }}>Status</th>
                    <th style={{ padding: '10px' }}>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {propertyListings.map((prop, idx) => (
                    <tr key={prop.id || idx}>
                      <td style={{ padding: '10px' }}><input type="checkbox" readOnly checked /></td>
                      <td style={{ padding: '10px', fontWeight: 600, color: 'var(--text-primary)' }}>{prop.name}</td>
                      <td style={{ padding: '10px', textTransform: 'capitalize' }}>{prop.type || 'Structure'}</td>
                      <td style={{ padding: '10px' }}>{prop.unitsCount || 8} / {Math.round((prop.unitsCount || 8) * (prop.occupancy || 80) / 100)}</td>
                      <td style={{ padding: '10px' }}><span className="badge badge-success" style={{ padding: '2px 8px' }}>Active</span></td>
                      <td style={{ padding: '10px' }}>{prop.address || 'Fiji'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-panel" style={{ margin: 0, padding: 20, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '0.975rem', fontWeight: 600, marginBottom: 12 }}>Invoice Aging (Outstanding)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
              {[
                { label: 'Current', amount: aging.current, color: '#10b981' },
                { label: '1 - 30 Days', amount: aging.overdue30, color: '#f59e0b' },
                { label: '31 - 60 Days', amount: aging.overdue60, color: '#ef4444' },
                { label: '61 - 90 Days', amount: aging.overdue90, color: '#9333ea' },
                { label: '90+ Days', amount: aging.overdueMore, color: '#475569' }
              ].map((item, idx) => {
                const totalOutstanding = aging.current + aging.overdue30 + aging.overdue60 + aging.overdue90 + aging.overdueMore || 1;
                const percentage = Math.round((item.amount / totalOutstanding) * 100);
                return (
                  <div key={idx} style={{ fontSize: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>F${item.amount.toLocaleString()} ({percentage}%)</span>
                    </div>
                    <div style={{ width: '100%', height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: item.color, borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: EXECUTIVE DASHBOARD MODE (Default)
  // ==========================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 20 }}>
      {/* 1. Header: Title "Exclusive Dashboard" and Date/Time */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.06) 0%, rgba(139, 92, 246, 0.06) 50%, rgba(16, 185, 129, 0.06) 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: 16,
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Executive Dashboard
        </h1>

        {/* Date and Time */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowCalendar(!showCalendar)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              padding: '8px 14px',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s ease'
            }}
            title="Click to toggle calendar"
          >
            <Calendar size={15} style={{ color: 'var(--brand-color)' }} />
            <span>{systemDateTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} {systemDateTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {showCalendar && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '16px',
              width: '320px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              color: 'var(--text-primary)',
              zIndex: 1000
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <button
                  onClick={() => setCalendarDate(new Date(calYear, calMonth - 1, 1))}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', padding: '4px 8px' }}
                >
                  &lt;
                </button>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>
                  {calendarDate.toLocaleString('default', { month: 'long' })} {calYear}
                </span>
                <button
                  onClick={() => setCalendarDate(new Date(calYear, calMonth + 1, 1))}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', padding: '4px 8px' }}
                >
                  &gt;
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontWeight: 600, fontSize: '11px', color: 'var(--text-secondary)', marginBottom: 8 }}>
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: 12 }}>
                {daysArray.map((cell, idx) => {
                  const cellEvents = getDayEvents(cell.day, cell.isCurrentMonth);
                  const isToday = cell.isCurrentMonth &&
                    new Date().getDate() === cell.day &&
                    new Date().getMonth() === calMonth &&
                    new Date().getFullYear() === calYear;
                  return (
                    <div
                      key={idx}
                      style={{
                        height: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '11px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        background: isToday ? 'var(--brand-color)' : 'transparent',
                        color: isToday ? '#fff' : (cell.isCurrentMonth ? 'var(--text-primary)' : 'var(--text-muted)'),
                        position: 'relative',
                        border: cellEvents.length > 0 ? '1px solid var(--border-color)' : 'none'
                      }}
                      title={cellEvents.map(e => e.text).join('\n')}
                    >
                      <span>{cell.day}</span>
                      {cellEvents.length > 0 && (
                        <span style={{
                          position: 'absolute',
                          bottom: '2px',
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: cellEvents[0].type === 'booking' ? '#10b981' : '#f59e0b'
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Elevated Executive KPI Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(235px, 1fr))', gap: 20 }}>
        {/* Card 1: Total Properties */}
        <div
          className="stat-card"
          style={{
            padding: 20,
            borderRadius: 16,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onClick={() => setCurrentTab('properties')}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
          <div>
            <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', color: '#fff', padding: 12, borderRadius: 12, display: 'inline-flex', boxShadow: '0 6px 14px rgba(37,99,235,0.25)' }}>
              <Building size={22} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Properties</div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
              {dashboardSummary?.['Property Groups Total'] ?? 45}
            </div>
          </div>
        </div>

        {/* Card 2: Commercial Units */}
        <div
          className="stat-card"
          style={{
            padding: 20,
            borderRadius: 16,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onClick={() => setCurrentTab('properties')}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
          <div>
            <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)', color: '#fff', padding: 12, borderRadius: 12, display: 'inline-flex', boxShadow: '0 6px 14px rgba(192,38,211,0.25)' }}>
              <Building2 size={22} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Commercial Units</div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
              {dashboardSummary?.['Unit Total'] ?? 94}
            </div>
          </div>
        </div>

        {/* Card 3: Monthly Revenue */}
        <div
          className="stat-card"
          style={{
            padding: 20,
            borderRadius: 16,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onClick={() => setCurrentTab('invoices')}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
          <div>
            <div style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: '#fff', padding: 12, borderRadius: 12, display: 'inline-flex', boxShadow: '0 6px 14px rgba(16,185,129,0.25)' }}>
              <Receipt size={22} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Monthly Revenue</div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
              {(() => {
                const apiRev = dashboardSummary?.['Current Month Paid Sales Invoice Grand Total'];
                const val = (apiRev !== undefined && apiRev !== null) ? Number(apiRev) : 1089.4;
                return `F$${val.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}`;
              })()}
            </div>
          </div>
        </div>

        {/* Card 4: Pending Maintenance */}
        <div
          className="stat-card"
          style={{
            padding: 20,
            borderRadius: 16,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onClick={() => setCurrentTab('maintenance')}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
          <div>
            <div style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)', color: '#fff', padding: 12, borderRadius: 12, display: 'inline-flex', boxShadow: '0 6px 14px rgba(234,88,12,0.25)' }}>
              <Hammer size={22} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pending Maintenance</div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
              {dashboardSummary?.['Maintenance Schedule Draft Total'] ?? 28}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Operational Analytics Grid (7fr : 5fr) */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 20 }}>
        {/* Left: Occupancy Trends (Last 12 Months) */}
        <div className="card-panel" style={{ margin: 0, padding: 22, borderRadius: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Occupancy & Booking Inflow</h3>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>12-month rolling transaction frequency</span>
            </div>
            <div style={{ display: 'inline-flex', background: 'var(--bg-tertiary)', borderRadius: 8, padding: 2 }}>
              <div
                style={{
                  padding: '4px 12px',
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: 6,
                  background: 'var(--brand-color, #10b981)',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)'
                }}
              >
                Active Bookings
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 175, paddingBottom: 10, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, borderBottom: '1px dashed var(--border-color)', height: 0 }} />
            <div style={{ position: 'absolute', top: 40, left: 0, right: 0, borderBottom: '1px dashed var(--border-color)', height: 0 }} />
            <div style={{ position: 'absolute', top: 80, left: 0, right: 0, borderBottom: '1px dashed var(--border-color)', height: 0 }} />
            <div style={{ position: 'absolute', top: 120, left: 0, right: 0, borderBottom: '1px dashed var(--border-color)', height: 0 }} />

            {occupancyTrends.map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 2 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {item.v}
                </span>
                <div
                  style={{
                    height: `${Math.max(item.pct * 1.25, 6)}px`,
                    width: 24,
                    background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                    borderRadius: '5px 5px 0 0',
                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.25)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer'
                  }}
                  title={`${item.m}: ${item.v} Active Bookings`}
                  onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.15)'; e.currentTarget.style.width = '26px'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.width = '24px'; }}
                />
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', marginTop: 8 }}>{item.m}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border-color)', fontSize: 11, color: 'var(--text-muted)' }}>
            <span>Total recorded transactions: <strong>{totalApprovedTransactions}</strong></span>
            <span>Avg Inflow: <strong>{Math.round(totalApprovedTransactions / 12)} / mo</strong></span>
          </div>
        </div>

        {/* Right: Dynamic DocType Status Donut */}
        <div className="card-panel" style={{ margin: 0, padding: 22, borderRadius: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>DocType Status</h3>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Real value & workflow distribution</span>
              </div>

              {/* Only show Count Pill */}
              <div style={{ display: 'inline-flex', background: 'var(--bg-tertiary)', borderRadius: 8, padding: 2, border: '1px solid var(--border-color, #e2e8f0)' }}>
                <div
                  style={{
                    padding: '3px 10px',
                    fontSize: 10,
                    fontWeight: 700,
                    borderRadius: 6,
                    background: 'var(--brand-color, #10b981)',
                    color: '#ffffff',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  Count
                </div>
              </div>
            </div>

            {/* Interactive DocType Pill Switcher - 4 DocTypes, No All */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, background: 'var(--bg-tertiary)', borderRadius: 10, padding: 3, marginBottom: 16 }}>
              {[
                { id: 'Booking', label: 'Booking' },
                { id: 'Quotation', label: 'Quotation' },
                { id: 'Tenant Onboarding', label: 'Onboarding' },
                { id: 'Task', label: 'Task' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDashboardDocType(tab.id)}
                  style={{
                    padding: '6px 4px',
                    fontSize: 10.5,
                    fontWeight: 600,
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'center',
                    background: dashboardDocType === tab.id ? 'var(--brand-color)' : 'transparent',
                    color: dashboardDocType === tab.id ? '#ffffff' : 'var(--text-secondary)',
                    boxShadow: dashboardDocType === tab.id ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={tab.label}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Donut Chart with Center Total */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 125, position: 'relative' }}>
            <svg width="115" height="115" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
              {docTypeSegments.map((seg, idx) => (
                <circle
                  key={idx}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="4.4"
                  strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                  strokeDashoffset={seg.offset}
                  style={{ transition: 'all 0.4s ease' }}
                />
              ))}
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', textAlign: 'center', padding: '0 6px' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>{docTypeCenterTitle}</span>
              <span style={{ fontSize: 8.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>{docTypeCenterSubtitle}</span>
            </div>
          </div>

          {/* Status Breakdown Legend - Only show Count & Percentage */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 11, marginTop: 12, maxHeight: 125, overflowY: 'auto' }}>
            {docTypeSegments.map((seg, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{seg.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>{seg.count}</span>
                    <strong style={{ color: 'var(--text-primary)', minWidth: 28, textAlign: 'right', fontSize: 11 }}>{seg.pct}%</strong>
                  </div>
                </div>
                <div style={{ height: 3, width: '100%', background: 'var(--bg-tertiary)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${seg.pct}%`, background: seg.color, borderRadius: 2, transition: 'width 0.3s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Fiji Geographic Distribution & Available Property Groups by District */}
      <FijiDistrictMap
        properties={properties}
        propertyGroupsByDistrict={dashboardSummary?.['Property Groups By District']}
        onSelectProperty={(p) => {
          setPreSelectedProperty(p);
          setCurrentTab('properties');
        }}
      />

      {/* 5. Operational Intelligence Section (7fr : 5fr) */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 20 }}>
        {/* Left: Top 5 Tenants & Booking Links */}
        <div className="card-panel" style={{ margin: 0, padding: 22, borderRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Top 5 Bookings & Tenants</h3>
                <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 9px', borderRadius: 10, background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', border: '1px solid rgba(37, 99, 235, 0.25)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb' }} />
                  {topBookingStatusFilter === 'All' ? 'All Statuses' : topBookingStatusFilter} ({filteredBookingsByStatus.length})
                </span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Top 5 highest amount value bookings filtered by status with direct booking navigation</span>
            </div>

            {/* Status Filter Dropdown & All Bookings Quick Action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-tertiary)', padding: '3px 8px', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                <label htmlFor="dashboard-booking-status-filter" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Status:
                </label>
                <select
                  id="dashboard-booking-status-filter"
                  value={topBookingStatusFilter}
                  onChange={(e) => setTopBookingStatusFilter(e.target.value)}
                  style={{
                    padding: '4px 8px',
                    fontSize: 11.5,
                    fontWeight: 600,
                    borderRadius: 6,
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="All">All Statuses</option>
                  {bookingStatusOptions.filter(s => s !== 'All').map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-sm"
                onClick={() => { setBookingSearchFromQuotation(''); setCurrentTab('bookings'); }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--brand-color)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span>All Bookings</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>

          <div className="table-container" style={{ border: 'none', marginTop: 0, overflowX: 'auto' }}>
            <table className="custom-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ padding: '8px 10px', width: 44, textAlign: 'center' }}>#</th>
                  <th style={{ padding: '8px 10px' }}>Tenant Name</th>
                  <th style={{ padding: '8px 10px' }}>Booking Link</th>
                  <th style={{ padding: '8px 10px' }}>Property / Space</th>
                  <th style={{ padding: '8px 10px' }}>Contract Value</th>
                  <th style={{ padding: '8px 10px' }}>Status</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {topFiveBookings.length > 0 ? (
                  topFiveBookings.map((b, idx) => {
                    const name = b.customer_name || b.customer || b.name || 'Tenant';
                    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                    const rawStatus = b.workflow_state || b.status || (b.docstatus === 1 ? 'Approved' : b.docstatus === 2 ? 'Cancelled' : 'Draft');
                    const stLower = rawStatus.toLowerCase();
                    let statusColor = '#10b981';
                    let statusBg = 'rgba(16, 185, 129, 0.12)';
                    let statusBorder = 'rgba(16, 185, 129, 0.3)';

                    if (['request for approval', 'waiting for contract submit', 'pending'].includes(stLower)) {
                      statusColor = '#f59e0b';
                      statusBg = 'rgba(245, 158, 11, 0.12)';
                      statusBorder = 'rgba(245, 158, 11, 0.3)';
                    } else if (['draft'].includes(stLower)) {
                      statusColor = '#3b82f6';
                      statusBg = 'rgba(59, 130, 246, 0.12)';
                      statusBorder = 'rgba(59, 130, 246, 0.3)';
                    } else if (['cancelled', 'rejected'].includes(stLower) || b.docstatus === 2) {
                      statusColor = '#ef4444';
                      statusBg = 'rgba(239, 68, 68, 0.12)';
                      statusBorder = 'rgba(239, 68, 68, 0.3)';
                    }

                    const rankColors = [
                      { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', shadow: '0 2px 6px rgba(245, 158, 11, 0.4)', color: '#ffffff' }, // #1: Amber / Gold
                      { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', shadow: '0 2px 6px rgba(37, 99, 235, 0.4)', color: '#ffffff' },   // #2: Royal Blue
                      { bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', shadow: '0 2px 6px rgba(124, 58, 237, 0.4)', color: '#ffffff' },  // #3: Purple / Violet
                      { bg: 'linear-gradient(135deg, #10b981, #059669)', shadow: '0 2px 6px rgba(16, 185, 129, 0.4)', color: '#ffffff' },  // #4: Emerald / Teal
                      { bg: 'linear-gradient(135deg, #f43f5e, #e11d48)', shadow: '0 2px 6px rgba(244, 63, 94, 0.4)', color: '#ffffff' }   // #5: Rose / Coral
                    ];
                    const rankStyle = rankColors[idx] || { bg: 'linear-gradient(135deg, #06b6d4, #0891b2)', shadow: '0 2px 6px rgba(6, 182, 212, 0.4)', color: '#ffffff' };

                    return (
                      <tr
                        key={b.name || idx}
                        style={{ cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                        onClick={() => { setBookingSearchFromQuotation(b.name || ''); setCurrentTab('bookings'); }}
                      >
                        <td style={{ padding: '10px 6px', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              background: rankStyle.bg,
                              color: rankStyle.color,
                              fontSize: 11.5,
                              fontWeight: 800,
                              boxShadow: rankStyle.shadow,
                              border: 'none'
                            }}
                          >
                            {idx + 1}
                          </span>
                        </td>

                        <td style={{ padding: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: '50%',
                                background: idx === 0
                                  ? 'linear-gradient(135deg, #2563eb, #7c3aed)'
                                  : idx === 1
                                    ? 'linear-gradient(135deg, #059669, #10b981)'
                                    : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                color: '#fff',
                                fontSize: 11,
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              {initials}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 12.5 }}>{name}</div>
                              <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{b.customer || 'Corporate Tenant'}</div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '10px' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setBookingSearchFromQuotation(b.name || '');
                              setCurrentTab('bookings');
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '4px 10px',
                              borderRadius: 8,
                              background: 'rgba(37, 99, 235, 0.08)',
                              border: '1px solid rgba(37, 99, 235, 0.25)',
                              color: '#2563eb',
                              fontWeight: 700,
                              fontSize: 11,
                              fontFamily: 'monospace',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              textDecoration: 'none'
                            }}
                            title={`Click to open booking ${b.name}`}
                          >
                            <ExternalLink size={12} />
                            <span>{b.name}</span>
                          </button>
                        </td>

                        <td style={{ padding: '10px', fontSize: 12, color: 'var(--text-secondary)' }}>
                          {b.property || 'Estate Asset'}
                        </td>

                        <td style={{ padding: '10px', fontWeight: 700, color: '#10b981', fontSize: 12.5 }}>
                          F${(parseFloat(b.booking_amount || b.paid_amount || 0)).toLocaleString()}
                        </td>

                        <td style={{ padding: '10px' }}>
                          <span
                            style={{
                              fontSize: 10,
                              padding: '3px 9px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              background: statusBg,
                              color: statusColor,
                              border: `1px solid ${statusBorder}`,
                              fontWeight: 700,
                              borderRadius: 12
                            }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, boxShadow: `0 0 6px ${statusColor}` }} />
                            {rawStatus}
                          </span>
                        </td>

                        <td style={{ padding: '10px', textAlign: 'center' }}>
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setBookingSearchFromQuotation(b.name || '');
                              setCurrentTab('bookings');
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 3,
                              padding: '4px 8px',
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 600,
                              background: 'var(--bg-tertiary)',
                              color: 'var(--brand-color)',
                              border: '1px solid var(--border-color)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <span>Open</span>
                            <ArrowUpRight size={11} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)', fontSize: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <span>No booking records found with status "<strong>{topBookingStatusFilter}</strong>"</span>
                        {topBookingStatusFilter !== 'All' && (
                          <button
                            type="button"
                            onClick={() => setTopBookingStatusFilter('All')}
                            style={{
                              marginTop: 4,
                              padding: '4px 10px',
                              fontSize: 11,
                              borderRadius: 6,
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-tertiary)',
                              color: 'var(--brand-color)',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                          >
                            Reset Filter to All Statuses
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Stacked Bar Chart for Monthly Invoice Status (Replaces 1st image part) */}
        <div className="card-panel" style={{ margin: 0, padding: 22, borderRadius: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Header: Title, Subtitle, Mode Switcher, and Ledger Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Monthly Invoice Status</h3>
                  <span style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: '1px 7px',
                    borderRadius: 10,
                    background: 'rgba(37, 99, 235, 0.1)',
                    color: 'var(--brand-color)',
                    border: '1px solid rgba(37, 99, 235, 0.25)'
                  }}>
                    {monthlyInvoiceData?.totalSalesInvoices || 0} Invoices
                  </span>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Lifecycle distribution across billing periods</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Count vs 100% Stack Toggle */}
                <div style={{ display: 'inline-flex', background: 'var(--bg-tertiary)', borderRadius: 8, padding: 2, border: '1px solid var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={() => setInvoiceChartMode('count')}
                    style={{
                      padding: '3px 8px',
                      fontSize: 10,
                      fontWeight: 600,
                      borderRadius: 6,
                      border: 'none',
                      cursor: 'pointer',
                      background: invoiceChartMode === 'count' ? 'var(--brand-color)' : 'transparent',
                      color: invoiceChartMode === 'count' ? '#ffffff' : 'var(--text-secondary)',
                      boxShadow: invoiceChartMode === 'count' ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 0.18s ease'
                    }}
                    title="Scale bar width by total invoice count (like Image 2)"
                  >
                    Count
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvoiceChartMode('percent')}
                    style={{
                      padding: '3px 8px',
                      fontSize: 10,
                      fontWeight: 600,
                      borderRadius: 6,
                      border: 'none',
                      cursor: 'pointer',
                      background: invoiceChartMode === 'percent' ? 'var(--brand-color)' : 'transparent',
                      color: invoiceChartMode === 'percent' ? '#ffffff' : 'var(--text-secondary)',
                      boxShadow: invoiceChartMode === 'percent' ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 0.18s ease'
                    }}
                    title="Scale all bars to 100% width"
                  >
                    100%
                  </button>
                </div>

                <button
                  className="btn btn-sm"
                  onClick={() => setCurrentTab('invoices')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--brand-color)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span>Ledger</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </div>

            {/* Status Legend Pills */}
            {(() => {
              const statusOrder = ['Unpaid', 'Overdue', 'Draft', 'Partly Paid', 'Cancelled', 'Paid'];
              const statusColors = {
                'Unpaid': '#2563eb',      // Blue
                'Overdue': '#5c4e73',     // Muted Purple
                'Draft': '#94a3b8',       // Grey
                'Partly Paid': '#eab308', // Amber/Yellow
                'Cancelled': '#0ea5e9',   // Sky
                'Paid': '#50787a',        // Muted Teal
              };
              const fallbackPalette = ['#2563eb', '#5c4e73', '#94a3b8', '#eab308', '#0ea5e9', '#50787a'];
              const getColor = (s, idx) => statusColors[s] || fallbackPalette[idx % fallbackPalette.length];

              const allStatuses = Array.from(new Set([
                ...statusOrder.filter(s => {
                  if (monthlyInvoiceData?.totalStatus && monthlyInvoiceData.totalStatus[s] !== undefined) return true;
                  return (monthlyInvoiceData?.months || []).some(m => m.statuses && m.statuses[s] !== undefined);
                }),
                ...((monthlyInvoiceData?.months || []).flatMap(m => Object.keys(m.statuses || {})))
              ]));

              const months = monthlyInvoiceData?.months && monthlyInvoiceData.months.length > 0
                ? monthlyInvoiceData.months
                : [];
              const maxMonthTotal = monthlyInvoiceData?.maxMonthTotal || 1;

              return (
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                    {allStatuses.map((st, i) => {
                      const count = monthlyInvoiceData?.totalStatus?.[st] !== undefined
                        ? monthlyInvoiceData.totalStatus[st]
                        : months.reduce((sum, m) => sum + (m.statuses[st] || 0), 0);
                      const color = getColor(st, i);
                      return (
                        <span
                          key={st}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: 10.5,
                            fontWeight: 600,
                            padding: '2px 7px',
                            borderRadius: 10,
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
                          <span>{st}</span>
                          <strong style={{ color: 'var(--text-primary)', marginLeft: 1 }}>{count}</strong>
                        </span>
                      );
                    })}
                  </div>

                  {/* Horizontal Stacked Bar Chart Area (Matching Image 2) */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    padding: '4px 0',
                    position: 'relative'
                  }}>
                    {months.map((m, mIdx) => {
                      const barFillPercent = m.totalCount === 0
                        ? 0
                        : (invoiceChartMode === 'percent'
                            ? 100
                            : Math.max(8, Math.round((m.totalCount / maxMonthTotal) * 100)));

                      // Short display name: "September 2026" -> "Sep 2026", "May 2026" -> "May 2026"
                      const shortMonth = m.shortMonth || m.month.replace(/(\w{3})\w*\s(\d{4})/, '$1 $2');

                      return (
                        <div key={m.monthKey || mIdx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {/* Y-Axis Label */}
                          <div style={{
                            width: 68,
                            fontSize: 11,
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            textAlign: 'right',
                            flexShrink: 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }} title={m.month}>
                            {shortMonth}
                          </div>

                          {/* Bar Track & Vertical Grid lines */}
                          <div style={{
                            flex: 1,
                            position: 'relative',
                            height: 22,
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            {/* Background Vertical Grid Lines (matching Image 2) */}
                            <div style={{
                              position: 'absolute',
                              inset: 0,
                              pointerEvents: 'none',
                              display: 'flex',
                              justifyContent: 'space-between',
                              zIndex: 0
                            }}>
                              {[0, 25, 50, 75, 100].map(tick => (
                                <div
                                  key={tick}
                                  style={{
                                    width: 1,
                                    height: '100%',
                                    background: 'var(--border-color, #e2e8f0)',
                                    opacity: 0.65
                                  }}
                                />
                              ))}
                            </div>

                            {/* Stacked Horizontal Bar */}
                            <div style={{
                              width: `${barFillPercent}%`,
                              height: 18,
                              display: 'flex',
                              borderRadius: 4,
                              overflow: 'hidden',
                              position: 'relative',
                              zIndex: 1,
                              boxShadow: m.totalCount > 0 ? '0 1px 4px rgba(0, 0, 0, 0.08)' : 'none',
                              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                              background: m.totalCount > 0 ? 'var(--bg-tertiary)' : 'transparent'
                            }}>
                              {allStatuses.map((st, sIdx) => {
                                const count = m.statuses[st] || 0;
                                if (count <= 0) return null;
                                const segPct = Math.round((count / (m.totalCount || 1)) * 100);
                                const color = getColor(st, sIdx);
                                const isHovered = hoveredInvoiceSegment?.month === m.month && hoveredInvoiceSegment?.status === st;

                                return (
                                  <div
                                    key={st}
                                    style={{
                                      width: `${(count / (m.totalCount || 1)) * 100}%`,
                                      height: '100%',
                                      background: color,
                                      borderRight: '1px solid rgba(255, 255, 255, 0.4)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease',
                                      filter: isHovered ? 'brightness(1.2)' : 'none',
                                      transform: isHovered ? 'scaleY(1.08)' : 'none',
                                      zIndex: isHovered ? 2 : 1
                                    }}
                                    title={`${m.month} — ${st}: ${count} invoices (${segPct}%)`}
                                    onMouseEnter={() => setHoveredInvoiceSegment({ month: m.month, status: st, count, percent: segPct, color })}
                                    onMouseLeave={() => setHoveredInvoiceSegment(null)}
                                  >
                                    {segPct >= 16 && (
                                      <span style={{
                                        fontSize: 10,
                                        fontWeight: 800,
                                        color: '#ffffff',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.45)',
                                        userSelect: 'none'
                                      }}>
                                        {count}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Total Count Badge on the right */}
                            <span
                              style={{
                                marginLeft: 8,
                                fontSize: 11,
                                fontWeight: 700,
                                color: 'var(--text-muted)',
                                opacity: m.totalCount > 0 ? 1 : 0.65,
                                flexShrink: 0,
                                zIndex: 1
                              }}
                              title={`Total ${m.totalCount} invoices`}
                            >
                              {m.totalCount}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* X-Axis Grid Scale Ticks */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
                      <div style={{ width: 68, flexShrink: 0 }} />
                      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', paddingRight: 24 }}>
                        {[0, 25, 50, 75, 100].map(pct => {
                          const tickVal = invoiceChartMode === 'percent'
                            ? `${pct}%`
                            : Math.round((maxMonthTotal * pct) / 100);
                          return (
                            <span key={pct} style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 500 }}>
                              {tickVal}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Hover Segment Detail Ribbon */}
                  {hoveredInvoiceSegment && (
                    <div style={{
                      marginTop: 6,
                      padding: '5px 10px',
                      borderRadius: 8,
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      fontSize: 11,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      animation: 'pmsFabMenuOpen 0.15s ease'
                    }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: hoveredInvoiceSegment.color }} />
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{hoveredInvoiceSegment.month}:</span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {hoveredInvoiceSegment.status} — <strong>{hoveredInvoiceSegment.count}</strong> invoices ({hoveredInvoiceSegment.percent}%)
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* 5. Executive Floating Add Button (FAB) & Speed-Dial Quick Create Menu */}
      <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999 }}>
        <style>{`
          @keyframes pmsFabMenuOpen {
            0% { opacity: 0; transform: translateY(16px) scale(0.92); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes pmsFabPulse {
            0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.45); }
            70% { box-shadow: 0 0 0 14px rgba(37, 99, 235, 0); }
            100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
          }
        `}</style>

        {dashboardFabOpen && (
          <div
            onClick={() => setDashboardFabOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.28)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              zIndex: 9998
            }}
          />
        )}

        {dashboardFabOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: 72,
              right: 0,
              width: 290,
              background: 'var(--card-bg, #ffffff)',
              border: '1px solid var(--border-color, #e2e8f0)',
              borderRadius: 20,
              padding: '12px 10px',
              boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              zIndex: 9999,
              animation: 'pmsFabMenuOpen 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            <div
              style={{
                padding: '6px 12px 10px 12px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} style={{ color: 'var(--brand-color)' }} />
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                  Quick Create
                </span>
              </div>
              <span
                style={{
                  fontSize: 10,
                  padding: '2px 8px',
                  borderRadius: 10,
                  background: 'rgba(37,99,235,0.1)',
                  color: 'var(--brand-color)',
                  fontWeight: 700
                }}
              >
                Direct Add
              </span>
            </div>

            {[
              {
                title: 'New Booking',
                subtitle: 'Reserve property unit & start lease',
                icon: <Bookmark size={17} />,
                bg: 'rgba(37, 99, 235, 0.12)',
                color: '#2563eb',
                onClick: () => {
                  setBookingSearchFromQuotation('');
                  setCurrentTab('bookings');
                }
              },
              {
                title: 'New Quotation',
                subtitle: 'Draft rate proposal for prospect',
                icon: <FileSignature size={17} />,
                bg: 'rgba(139, 92, 246, 0.12)',
                color: '#8b5cf6',
                onClick: () => setCurrentTab('quotation')
              },
              {
                title: 'Add Property',
                subtitle: 'Register estate building or unit',
                icon: <Building size={17} />,
                bg: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                onClick: () => setCurrentTab('properties')
              },
              {
                title: 'Tenant Onboarding',
                subtitle: 'Initiate tenant verification workflow',
                icon: <UserCheck size={17} />,
                bg: 'rgba(245, 158, 11, 0.12)',
                color: '#f59e0b',
                onClick: () => setCurrentTab('tenant-onboarding')
              },
              {
                title: 'Maintenance Task',
                subtitle: 'Log inspection or repair request',
                icon: <Hammer size={17} />,
                bg: 'rgba(239, 68, 68, 0.12)',
                color: '#ef4444',
                onClick: () => setCurrentTab('maintenance')
              },
              {
                title: 'Payment Entry',
                subtitle: 'Record tenant payment receipt',
                icon: <CreditCard size={17} />,
                bg: 'rgba(6, 182, 212, 0.12)',
                color: '#06b6d4',
                onClick: () => setCurrentTab('payment-entry')
              }
            ].map((act, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDashboardFabOpen(false);
                  act.onClick();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 10px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.18s ease',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-tertiary, #f1f5f9)';
                  e.currentTarget.style.transform = 'translateX(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: act.bg,
                    color: act.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {act.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {act.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {act.subtitle}
                  </div>
                </div>
                <ArrowUpRight size={14} style={{ color: 'var(--text-muted)', opacity: 0.6 }} />
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          id="dashboard-floating-add-btn"
          onClick={() => setDashboardFabOpen(prev => !prev)}
          title={dashboardFabOpen ? "Close Quick Actions" : "Create New... (Quick Add)"}
          style={{
            position: 'relative',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 56,
            minWidth: 56,
            padding: dashboardFabOpen ? '0 18px' : '0 20px 0 16px',
            borderRadius: 28,
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            color: '#ffffff',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: dashboardFabOpen
              ? '0 10px 25px -3px rgba(37, 99, 235, 0.6), 0 0 0 6px rgba(37, 99, 235, 0.2)'
              : '0 12px 28px -4px rgba(37, 99, 235, 0.5), 0 4px 12px rgba(0, 0, 0, 0.15)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            animation: dashboardFabOpen ? 'none' : 'pmsFabPulse 2.8s infinite'
          }}
          onMouseEnter={(e) => {
            if (!dashboardFabOpen) {
              e.currentTarget.style.transform = 'scale(1.06) translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 18px 32px -4px rgba(37, 99, 235, 0.6), 0 6px 14px rgba(0, 0, 0, 0.2)';
            }
          }}
          onMouseLeave={(e) => {
            if (!dashboardFabOpen) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(37, 99, 235, 0.5), 0 4px 12px rgba(0, 0, 0, 0.15)';
            }
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transform: dashboardFabOpen ? 'rotate(135deg)' : 'rotate(0deg)'
            }}
          >
            <Plus size={24} strokeWidth={2.6} />
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
              userSelect: 'none'
            }}
          >
            {dashboardFabOpen ? 'Close' : 'Quick Add'}
          </span>
        </button>
      </div>
    </div>
  );
}
