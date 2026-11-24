import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Building,
  Users,
  Award,
  ShoppingBag,
  Hammer,
  Receipt,
  HelpCircle,
  Globe,
  TrendingUp,
  Map,
  FileText,
  Briefcase,
  Bookmark,
  Calendar,
  FileSignature,
  UserCheck,
  ShieldCheck,
  ChevronDown,
  Building2,
  LogOut,
  CreditCard,
  BarChart2,
  Sparkles,
  ArrowUpRight,
  Activity,
  Plus,
  ExternalLink
} from 'lucide-react';

// Import Components
import Dashboard from './components/Dashboard';
import Properties from './components/Properties';
import Tenants from './components/Tenants';
import Owners from './components/Owners';
import Listings from './components/Listings';
import Booking from './components/Booking';
import Maintenance from './components/Maintenance';
import Invoices from './components/Invoices';
import PaymentEntry from './components/PaymentEntry';
import Support from './components/Support';
import Mall3DView from './components/Mall3DView';
import HRMS, { INITIAL_EMPLOYEES } from './components/HRMS';
import Reports from './components/Reports';
import Quotation from './components/Quotation';
import TenantOnboarding from './components/TenantOnboarding';
import { ERPNEXT_CONFIG, getCsrfToken, ensureCsrfToken, getAuthHeaders, getUploadHeaders } from './config';
import {
  registerPropertyGroupApi,
  normalizeMonthlyApprovedBookings,
  normalizeMonthlyInvoiceStatus,
  getMonthlyApprovedBookingCountApi,
  getMonthlyApprovedBookingRawApi,
  DEFAULT_MONTHLY_APPROVED_BOOKINGS_RESPONSE
} from './services/api';
import MapComponent from './components/MapComponent';
import FijiDistrictMap, { resolvePropertyDistrict, FIJI_DISTRICTS } from './components/FijiDistrictMap';

// Sample INITIAL MOCK DATA
const INITIAL_PROPERTIES = [
  { id: 'PROP-2041', name: 'Stratford Court Apartments', type: 'residential', land_and_building_type: 'residential', address: '12 Carpenters Road, Suva, Fiji', district: 'Suva', locality: 'Suva City', unitsCount: 24, rent: 1850, area: 18000, listedOnline: true, occupancy: 85, land_description: 'Residential building with 24 premium apartments', lease_start_date: '2024-01-01', lease_end_date: '2026-12-31' },
  { id: 'PROP-8032', name: 'Carpenters Row Commercial', type: 'commercial', land_and_building_type: 'commercial', address: '44 Queens Highway, Nadi, Fiji', district: 'Nadi', locality: 'Namaka', unitsCount: 8, rent: 4800, area: 12000, listedOnline: true, occupancy: 75, land_description: 'Carpenters office complex, double-front showroom', lease_start_date: '2024-06-15', lease_end_date: '2027-06-30' },
  { id: 'PROP-9910', name: 'Estate Galleria Mall', type: 'mall', land_and_building_type: 'mall', address: 'Naviti St, Lautoka, Fiji', district: 'Lautoka', locality: 'Lautoka Central', unitsCount: 17, rent: 5500, area: 32000, listedOnline: false, occupancy: 65, land_description: 'Three-story retail plaza, central courtyard', lease_start_date: '2024-03-01', lease_end_date: '2029-03-01' },
  { id: 'PROP-3091', name: 'E15 Plaza complex', type: 'commercial', land_and_building_type: 'commercial', address: 'Kings Road, Nausori, Rewa, Fiji', district: 'Rewa', locality: 'Nausori', unitsCount: 15, rent: 3900, area: 14500, listedOnline: false, occupancy: 90, land_description: 'Mixed industrial depot, rear loading bay access', lease_start_date: '2023-11-15', lease_end_date: '2028-11-15' },
  { id: 'PROP-F60', name: 'F60 Rodwell Centre', type: 'commercial', land_and_building_type: 'commercial', address: 'Cnr Rodwell/Robertson Roads, Suva, Fiji', district: 'Suva', locality: 'Suva Central', unitsCount: 12, rent: 6200, area: 16000, listedOnline: true, occupancy: 92, land_description: 'Commercial corporate tower in central Suva', lease_start_date: '2024-02-01', lease_end_date: '2028-02-01' },
  { id: 'PROP-7720', name: 'Labasa Commercial Hub', type: 'commercial', land_and_building_type: 'commercial', address: 'Nasekula Road, Labasa, Fiji', district: 'Macuata', locality: 'Labasa', unitsCount: 10, rent: 3400, area: 11000, listedOnline: true, occupancy: 80, land_description: 'Northern division retail and warehousing depot', lease_start_date: '2024-01-15', lease_end_date: '2027-01-15' }
];

const INITIAL_TENANTS = [
  { id: 'TEN-801', name: 'John Doe', email: 'john.doe@gmail.com', phone: '+44 7911 884723', address: 'Flat 4B, Stratford Court, 12 Carpenters Road, London E15', propertyName: 'Stratford Court Apartments', propertyId: 'PROP-2041', propertyGroup: 'Stratford Court Apartments', unitSpec: 'Flat 4B', tenantType: 'Internal', rentAmount: 1850, lastPaidAmount: 1850, lastPaidDate: '2026-05-02', leaseStart: '2025-01-01', leaseEnd: '2026-01-01', rentStatus: 'paid' },
  { id: 'TEN-802', name: 'Sarah Jenkins', email: 'sjenkins@techglow.co.uk', phone: '+44 7822 990145', address: 'Unit C, Carpenters Row, 44 Stratford High St, London E15', propertyName: 'Carpenters Row Commercial', propertyId: 'PROP-8032', propertyGroup: 'Carpenters Row Commercial', unitSpec: 'Unit C', tenantType: 'External', rentAmount: 4800, lastPaidAmount: 4800, lastPaidDate: '2026-04-30', leaseStart: '2024-06-15', leaseEnd: '2027-06-15', rentStatus: 'pending' },
  { id: 'TEN-803', name: 'Aroma Brews Co. (Fiona)', email: 'fiona@aromabrews.com', phone: '+44 7733 112233', address: 'Shop G-101, Galleria Mall, Golden Loop Blvd, London E15', propertyName: 'Estate Galleria Mall (G-101)', propertyId: 'PROP-9910', propertyGroup: 'Estate Galleria Mall', unitSpec: 'Shop G-101', tenantType: 'External', rentAmount: 5500, lastPaidAmount: 5500, lastPaidDate: '2026-05-28', leaseStart: '2024-03-01', leaseEnd: '2029-03-01', rentStatus: 'paid' },
  { id: 'TEN-804', name: 'David Smith', email: 'dsmith@gmail.com', phone: '+44 7911 556677', address: 'Flat 12A, Stratford Court, 12 Carpenters Road, London E15', propertyName: 'Stratford Court Apartments', propertyId: 'PROP-2041', propertyGroup: 'Stratford Court Apartments', unitSpec: 'Flat 12A', tenantType: 'Internal', rentAmount: 1850, lastPaidAmount: 1850, lastPaidDate: '2026-04-05', leaseStart: '2025-03-01', leaseEnd: '2026-03-01', rentStatus: 'overdue' }
];

const INITIAL_OWNERS = [
  { id: 'OWN-101', name: 'Carpenters Trust Group', email: 'trust@carpenterestate.org', phone: '+44 20 7123 4567', address: 'Suite 101, Carpenters House, Rodwell Rd, Suva, Fiji', properties: ['Stratford Court Apartments', 'Carpenters Row Commercial'], share: 60, lastPayout: 45000 },
  { id: 'OWN-102', name: 'Stratford Holdings Ltd', email: 'billing@stratfordholdings.co.uk', phone: '+44 20 7987 6543', address: 'Level 12, Stratford High Tower, London E15', properties: ['Estate Galleria Mall'], share: 40, lastPayout: 32000 }
];

const INITIAL_SCHEDULES = [
  {
    name: 'SCH-2026-00001',
    customer: 'TEN-801',
    customer_name: 'John Doe',
    transaction_date: '2026-06-02',
    status: 'Submitted',
    company: 'CARPENTERS PROPERTIES PTE LIMITED',
    schedules: [
      { name: 'sch-s1', item_code: '31AD', scheduled_date: '2026-06-02', completion_status: 'Pending' },
      { name: 'sch-s2', item_code: '31AD', scheduled_date: '2026-06-09', completion_status: 'Pending' },
      { name: 'sch-s3', item_code: '31AD', scheduled_date: '2026-06-16', completion_status: 'Pending' },
      { name: 'sch-s4', item_code: '31AD', scheduled_date: '2026-06-23', completion_status: 'Pending' }
    ],
    items: [
      { item_code: '31AD', start_date: '2026-06-02', end_date: '2026-06-30', periodicity: 'Weekly', description: 'Weekly carpentry inspection' }
    ]
  },
  {
    name: 'SCH-2026-00002',
    customer: 'TEN-802',
    customer_name: 'Sarah Jenkins',
    transaction_date: '2026-06-01',
    status: 'Draft',
    company: 'CARPENTERS PROPERTIES PTE LIMITED',
    schedules: [
      { name: 'sch-s5', item_code: '31CT12', scheduled_date: '2026-06-01', completion_status: 'Pending' },
      { name: 'sch-s6', item_code: '31CT12', scheduled_date: '2026-07-01', completion_status: 'Pending' }
    ],
    items: [
      { item_code: '31CT12', start_date: '2026-06-01', end_date: '2026-08-01', periodicity: 'Monthly', description: 'Monthly HVAC check' }
    ]
  }
];

const INITIAL_VISITS = [
  { name: 'MAT-MVS-2026-00001', customer: 'TEN-801', customer_name: 'John Doe', mntc_date: '2026-06-11', mntc_time: '22:57:31', completion_status: 'Partially Completed', maintenance_type: 'Unscheduled', company: 'CARPENTERS PROPERTIES PTE LIMITED' },
  { name: 'MAT-MVS-2026-00002', customer: 'TEN-802', customer_name: 'Sarah Jenkins', mntc_date: '2026-06-02', mntc_time: '10:00 AM', completion_status: 'Fully Completed', maintenance_type: 'Preventive', company: 'CARPENTERS PROPERTIES PTE LIMITED' }
];

const _nowInit = new Date();
const _curYMInit = `${_nowInit.getFullYear()}-${String(_nowInit.getMonth() + 1).padStart(2, '0')}`;
const INITIAL_INVOICES = [
  { id: 'INV-3011', name: 'INV-3011', tenantName: 'Aroma Brews Co.', propertyId: 'G-101', amount: 3200, grand_total: 3200, paid_amount: 3200, outstanding_amount: 0, issuedDate: `${_curYMInit}-01`, posting_date: `${_curYMInit}-01`, dueDate: `${_curYMInit}-10`, status: 'paid' },
  { id: 'INV-3012', name: 'INV-3012', tenantName: 'John Doe', propertyId: 'PROP-2041', amount: 1850, grand_total: 1850, paid_amount: 1850, outstanding_amount: 0, issuedDate: `${_curYMInit}-01`, posting_date: `${_curYMInit}-01`, dueDate: `${_curYMInit}-10`, status: 'paid' },
  { id: 'INV-3013', name: 'INV-3013', tenantName: 'Sarah Jenkins', propertyId: 'PROP-8032', amount: 4800, grand_total: 4800, paid_amount: 0, outstanding_amount: 4800, issuedDate: `${_curYMInit}-01`, posting_date: `${_curYMInit}-01`, dueDate: `${_curYMInit}-10`, status: 'pending' },
  { id: 'INV-3014', name: 'INV-3014', tenantName: 'David Smith', propertyId: 'PROP-2041', amount: 1850, grand_total: 1850, paid_amount: 0, outstanding_amount: 1850, issuedDate: `${_curYMInit}-01`, posting_date: `${_curYMInit}-01`, dueDate: `${_curYMInit}-10`, status: 'pending' }
];

const INITIAL_SUPPORT = [
  {
    id: 'SUP-701',
    subject: 'Elevator sound query',
    tenantName: 'John Doe',
    propertyId: 'PROP-2041',
    status: 'open',
    lastUpdated: '2 hours ago',
    dateRaised: '2026-06-01',
    priority: 'high',
    category: 'maintenance',
    messages: [
      { sender: 'tenant', text: 'Hi, the lift at Tower A makes grinding noises when reaching 4th floor.', timestamp: '10:15 AM' },
      { sender: 'admin', text: 'Thanks for reporting. We have dispatched E15 elevator crew to review it today.', timestamp: '11:00 AM' },
      { sender: 'tenant', text: 'Great, thank you for the prompt reply.', timestamp: '11:30 AM' }
    ]
  },
  {
    id: 'SUP-702',
    subject: 'Signage Permit Approval',
    tenantName: 'Fiona (Aroma Cafe)',
    propertyId: 'G-101',
    status: 'closed',
    lastUpdated: 'Yesterday',
    dateRaised: '2026-05-30',
    priority: 'medium',
    category: 'billing',
    messages: [
      { sender: 'tenant', text: 'Hello, can we update our front logo awning to yellow color?', timestamp: 'Yesterday' },
      { sender: 'admin', text: 'Yes, yellow is approved as long as it adheres to the Carpenters Mall signage guide.', timestamp: 'Yesterday' }
    ]
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [preSelectedProperty, setPreSelectedProperty] = useState(null);
  const [preSelectedIssue, setPreSelectedIssue] = useState(null);
  const [bookingSearchFromQuotation, setBookingSearchFromQuotation] = useState('');
  const [selectedQuotationId, setSelectedQuotationId] = useState('');
  const [selectedTaskIdForMaintenance, setSelectedTaskIdForMaintenance] = useState('');
  const [selectedInvoiceIdForDetails, setSelectedInvoiceIdForDetails] = useState('');

  useEffect(() => {
    const handleNavigateQuotation = (e) => {
      const qId = e.detail?.quotationId;
      if (qId) {
        setSelectedQuotationId(qId);
      }
      setCurrentTab('quotation');
    };
    const handleNavigateTask = (e) => {
      const taskId = e.detail?.taskId;
      if (taskId) {
        setSelectedTaskIdForMaintenance(taskId);
      }
      setCurrentTab('maintenance');
    };
    const handleNavigateInvoice = (e) => {
      const invId = e.detail?.invoiceId || e.detail?.id;
      if (invId) {
        setSelectedInvoiceIdForDetails(invId);
      }
      setCurrentTab('invoices');
    };
    const handleNavigatePaymentEntry = (e) => {
      setCurrentTab('payment-entry');
    };
    window.addEventListener('pms:navigate-quotation', handleNavigateQuotation);
    window.addEventListener('pms:navigate-task', handleNavigateTask);
    window.addEventListener('pms:navigate-invoice', handleNavigateInvoice);
    window.addEventListener('pms:navigate-payment-entry', handleNavigatePaymentEntry);
    return () => {
      window.removeEventListener('pms:navigate-quotation', handleNavigateQuotation);
      window.removeEventListener('pms:navigate-task', handleNavigateTask);
      window.removeEventListener('pms:navigate-invoice', handleNavigateInvoice);
      window.removeEventListener('pms:navigate-payment-entry', handleNavigatePaymentEntry);
    };
  }, []);

  // PMS Portal Selection State ('admin' | 'operation')
  const [selectedPortal, setSelectedPortal] = useState(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.includes('/app') || pathname.includes('/apps')) {
        localStorage.setItem('pms_selected_portal', 'admin');
        return 'admin';
      }
      if (pathname.includes('/pms')) {
        const saved = localStorage.getItem('pms_selected_portal');
        return saved === 'admin' && !pathname.endsWith('/pms') ? 'admin' : 'operation';
      }
      return localStorage.getItem('pms_selected_portal') || 'operation';
    }
    return 'operation';
  });
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const portalDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (portalDropdownRef.current && !portalDropdownRef.current.contains(event.target)) {
        setPortalDropdownOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setPortalDropdownOpen(false);
      }
    }
    if (portalDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [portalDropdownOpen]);

  const handleSelectPortal = (portalType) => {
    setSelectedPortal(portalType);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pms_selected_portal', portalType);
    }
    setPortalDropdownOpen(false);
    const portalElement = document.getElementById('portal');
    if (portalElement) {
      portalElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // App Global State
  const [dataLoading, setDataLoading] = useState(false);
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [tenants, setTenants] = useState(INITIAL_TENANTS);
  const [owners, setOwners] = useState(INITIAL_OWNERS);
  const [schedules, setSchedules] = useState(INITIAL_SCHEDULES);
  const [visits, setVisits] = useState(INITIAL_VISITS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [accounts, setAccounts] = useState([]);
  const [glEntries, setGlEntries] = useState([]);
  const [supportTickets, setSupportTickets] = useState(INITIAL_SUPPORT);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [bookings, setBookings] = useState([]);
  const [erpnextDepts, setErpnextDepts] = useState(['Executive', 'Technology', 'Human Resources', 'Operations', 'Finance']);
  const [erpnextDesgs, setErpnextDesgs] = useState(['Chief Executive Officer', 'Chief Technology Officer', 'HR Director', 'Operations Manager', 'Chief Financial Officer', 'Lead Systems Architect', 'HR Officer', 'Facility Supervisor', 'Senior Accountant', 'Support Engineer']);
  const [commercialUnitsCount, setCommercialUnitsCount] = useState(93);
  const [draftMaintenanceCount, setDraftMaintenanceCount] = useState(28);
  const [dashboardDocType, setDashboardDocType] = useState('All');
  const [dashboardDocTypeViewMode, setDashboardDocTypeViewMode] = useState('value');
  const [topBookingStatusFilter, setTopBookingStatusFilter] = useState('All');
  const [quotationsList, setQuotationsList] = useState([]);
  const [tenantOnboardingsList, setTenantOnboardingsList] = useState([]);
  const [tasksList, setTasksList] = useState([]);
  const [trendViewMode, setTrendViewMode] = useState('bookings');
  const [monthlyApprovedCounts, setMonthlyApprovedCounts] = useState(() => normalizeMonthlyApprovedBookings(DEFAULT_MONTHLY_APPROVED_BOOKINGS_RESPONSE));
  const [monthlyInvoiceData, setMonthlyInvoiceData] = useState(() => normalizeMonthlyInvoiceStatus(DEFAULT_MONTHLY_APPROVED_BOOKINGS_RESPONSE));
  const [invoiceChartMode, setInvoiceChartMode] = useState('count');
  const [hoveredInvoiceSegment, setHoveredInvoiceSegment] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getMonthlyApprovedBookingRawApi().then(raw => {
      if (isMounted && raw) {
        setMonthlyApprovedCounts(normalizeMonthlyApprovedBookings(raw));
        setMonthlyInvoiceData(normalizeMonthlyInvoiceStatus(raw));
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, [ERPNEXT_CONFIG.url]);

  const [dashboardTimeframe, setDashboardTimeframe] = useState('This Month');
  const [dashboardStats, setDashboardStats] = useState({
    totalProperties: 45,
    occupancyRate: 80,
    monthlyRevenue: 1089.4,
    pendingMaintenance: 28,
    commercialUnits: 94
  });
  const hasLoggedDashboardJsonRef = useRef(false);
  const [dashboardFabOpen, setDashboardFabOpen] = useState(false);

  const [showMapModal, setShowMapModal] = useState(false);
  const [mapView, setMapView] = useState(null); // null = "show all markers" until user zooms/pans
  const [propertylist_withcords, setpropertylist_withcords] = useState([
    {
      id: 'PROP-2041',
      name: 'Stratford Court Apartments',
      address: '12 Carpenters Road, London E15', // (placeholder text kept from mock data)
      latitude: -18.1416,
      longitude: 178.4415
    },
    {
      id: 'PROP-8032',
      name: 'Carpenters Row Commercial',
      address: '44 Stratford High St, London E15',
      latitude: -18.1398,
      longitude: 178.4432
    },
    {
      id: 'PROP-9910',
      name: 'Estate Galleria Mall',
      address: 'Golden Loop Blvd, London E15',
      latitude: -18.1432,
      longitude: 178.4401
    },
    {
      id: 'PROP-3091',
      name: 'E15 Plaza complex',
      address: '78 Jebb Ln, London E15',
      latitude: -18.1442,
      longitude: 178.4438
    },
    {
      id: 'PROP-F60',
      name: 'F60',
      address: 'Cnr Rodwell/Robertson Roads, Suva, Fiji',
      latitude: -18.1409,
      longitude: 178.4390
    }
  ])

  // Calendar states
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [systemDateTime, setSystemDateTime] = useState(new Date());

  // Keep system date time updated
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Ensure favicon points to target URL across all portals
  useEffect(() => {
    const faviconUrl = 'https://pms.advtinni.com/files/Screenshot%202026-05-11%20151414.png';
    const linkRels = ['icon', 'shortcut icon', 'apple-touch-icon'];
    linkRels.forEach(rel => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.type = 'image/png';
      link.href = faviconUrl;
    });
  }, []);

  // ERPNext API calls are only executed within the Dashboard component when that page is visited.

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined' && window.frappe_user && window.frappe_user !== 'Guest' && window.frappe_user !== 'None') {
      localStorage.setItem('pms_auth', 'true');
      if (!localStorage.getItem('pms_user')) {
        localStorage.setItem('pms_user', window.frappe_user);
      }
      return true;
    }
    return localStorage.getItem('pms_auth') === 'true';
  });
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [currentUserDetails, setCurrentUserDetails] = useState({
    fullName: (typeof window !== 'undefined' && window.frappe_user && window.frappe_user !== 'Guest' ? window.frappe_user : null) || localStorage.getItem('pms_user') || 'Estate Admin',
    email: (typeof window !== 'undefined' && window.frappe_user && window.frappe_user !== 'Guest' ? window.frappe_user : null) || localStorage.getItem('pms_user') || '',
    designation: 'Superuser',
    image: ''
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    const loggedInUser = (typeof window !== 'undefined' && window.frappe_user && window.frappe_user !== 'Guest' ? window.frappe_user : null) || localStorage.getItem('pms_user');
    if (!loggedInUser) return;
    setCurrentUserDetails({
      fullName: loggedInUser,
      email: loggedInUser,
      designation: 'Administrator',
      image: ''
    });
  }, [isAuthenticated]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch(`${ERPNEXT_CONFIG.url}/api/method/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          usr: loginUser,
          pwd: loginPass
        })
      });

      if (res.ok) {
        const data = await res.json();

        // Determine whether admin or operator login
        const isAdmin = selectedPortal === 'admin' || (loginUser && ['admin', 'administrator'].includes(loginUser.trim().toLowerCase()) && selectedPortal !== 'operation');

        // Fetch roles using: user = frappe.session.user, roles = frappe.get_roles(user)
        // Store roles so components like Quotation can read them without refetching
        try {
          const rolesRes = await fetch(`${ERPNEXT_CONFIG.url}/api/method/pms.api.get_user_roles?user=${encodeURIComponent(loginUser)}`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });
          if (rolesRes.ok) {
            const rolesJson = await rolesRes.json();
            const rolesData = rolesJson.message || rolesJson;
            const rolesList = Array.isArray(rolesData.roles) ? rolesData.roles : [];
            localStorage.setItem('pms_roles', JSON.stringify(rolesList));
            if (typeof window !== 'undefined') {
              window.frappe = window.frappe || {};
              window.frappe.user_roles = rolesList;
              window.frappe.get_roles = function () { return rolesList; };
            }
          }
        } catch { }

        if (isAdmin) {
          localStorage.setItem('pms_auth', 'true');
          localStorage.setItem('pms_user', loginUser);
          localStorage.setItem('pms_selected_portal', 'admin');
          // Admin Portal: redirect default link with /app
          window.location.href = `${window.location.origin}/app`;
          return;
        }

        // Operation Portal: redirect default link with /pms
        setIsAuthenticated(true);
        localStorage.setItem('pms_auth', 'true');
        localStorage.setItem('pms_user', loginUser);
        localStorage.setItem('pms_selected_portal', 'operation');
        setLoginError('');

        const targetUrl = `${window.location.origin}/pms`;
        if (window.location.href === targetUrl) {
          window.location.reload();
        } else {
          window.location.href = targetUrl;
        }
        return;

      } else {
        const errData = await res.json().catch(() => ({}));
        setLoginError(errData.message || 'Invalid username or password credentials.');
      }
    } catch (err) {
      if (loginUser === 'admin' && loginPass === 'Pms@ADV2026!@#') {
        const isAdmin = selectedPortal === 'admin' || selectedPortal !== 'operation';
        if (isAdmin) {
          localStorage.setItem('pms_auth', 'true');
          localStorage.setItem('pms_user', loginUser);
          localStorage.setItem('pms_selected_portal', 'admin');
          // Admin Portal: redirect default link with /app
          window.location.href = `${window.location.origin}/app`;
          return;
        }

        setIsAuthenticated(true);
        localStorage.setItem('pms_auth', 'true');
        localStorage.setItem('pms_user', loginUser);
        localStorage.setItem('pms_selected_portal', 'operation');
        setLoginError('');

        const targetUrl = `${window.location.origin}/pms`;
        if (window.location.href === targetUrl) {
          window.location.reload();
        } else {
          window.location.href = targetUrl;
        }
        return;
      } else {
        setLoginError('Error connecting to authentication service. Please try again.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);

    localStorage.removeItem('pms_auth');
    localStorage.removeItem('pms_user');

    if (typeof window !== 'undefined') {
      window.frappe_user = 'Guest';
      if (window.frappe?.session) {
        window.frappe.session.user = 'Guest';
      }
      if (window.frappe) {
        window.frappe.user_roles = [];
        window.frappe.get_roles = function () { return []; };
      }
    }
    localStorage.removeItem('pms_roles');

    try {
      await fetch(`${ERPNEXT_CONFIG.url}/api/method/logout`, {
        credentials: 'include',
      });
    } catch (e) { }

    setLoginUser('');
    setLoginPass('');
    setLoginError('');
  };



  const handleAddProperty = async (newProp) => {
    const landAndBuildingType = newProp.land_and_building_type || newProp.landAndBuildingType || newProp.property_type || newProp.type || '';
    const propToRegister = {
      ...newProp,
      land_and_building_type: landAndBuildingType
    };

    if (ERPNEXT_CONFIG) {
      const doc = await registerPropertyGroupApi(propToRegister, ERPNEXT_CONFIG?.url);
      const addedProp = {
        ...propToRegister,
        ...(doc || {}),
        id: doc?.name || newProp.name,
        name: doc?.name || newProp.name,
        type: doc?.land_and_building_type || landAndBuildingType || newProp.type,
        land_and_building_type: doc?.land_and_building_type || landAndBuildingType,
        landAndBuildingType: doc?.land_and_building_type || landAndBuildingType,
        address: doc?.locality || newProp.locality || newProp.address,
        unitsCount: newProp.unitsCount,
        rent: newProp.rent,
        area: newProp.area || doc?.property_area,
        listedOnline: false,
        occupancy: 0,
        image: newProp.image || newProp.attachments || doc?.image || doc?.attachments || null,
        attachments: newProp.attachments || doc?.attachments || null,
        custom_attachments: newProp.custom_attachments || doc?.custom_attachments || null,
        gallery: newProp.gallery || doc?.gallery || [],
        legal_description: doc?.legal_description || newProp.legalDescription || '',
        legalDescription: doc?.legal_description || newProp.legalDescription || '',
        lease_start_date: doc?.lease_start_date || newProp.leaseStartDate || '',
        leaseStartDate: doc?.lease_start_date || newProp.leaseStartDate || '',
        lease_end_date: doc?.lease_end_date || newProp.leaseEndDate || '2026-12-31',
        leaseEndDate: doc?.lease_end_date || newProp.leaseEndDate || '2026-12-31',
        no_of_floors: doc?.no_of_floors ?? newProp.noOfFloors ?? 1,
        noOfFloors: doc?.no_of_floors ?? newProp.noOfFloors ?? 1,
        property_owner: doc?.property_owner || newProp.propertyOwner || '',
        propertyOwner: doc?.property_owner || newProp.propertyOwner || '',
        locality: doc?.locality || newProp.locality || '',
        district: doc?.district || newProp.district || '',
        country: doc?.country || newProp.country || 'Fiji'
      };

      setProperties(prev => [...prev, addedProp]);
      return addedProp;
    } else {
      const addedProp = {
        ...propToRegister,
        id: newProp.id || newProp.name,
        name: newProp.name
      };
      setProperties(prev => [...prev, addedProp]);
      return addedProp;
    }
  };

  const handleToggleListOnline = (propId) => {
    setProperties(properties.map(p => {
      if (p.id === propId) {
        return { ...p, listedOnline: !p.listedOnline };
      }
      return p;
    }));
  };

  // const handleAddTenant = (newTenant) => {
  //   setTenants([...tenants, newTenant]);
  // };
  // const handleAddTenant = async (newTenant) => {
  //   const { erpPayload, ...displayFields } = newTenant;

  //   // Optimistic insert so the UI feels instant; we'll reconcile once the POST resolves.
  //   const tempTenant = { ...displayFields, id: newTenant.id, _pending: true };
  //   setTenants(prev => [...prev, tempTenant]);

  //   try {
  //     const res = await fetch(`${erpnextConfig.url}/api/resource/Customer`, {
  //       method: 'POST',
  //       credentials: 'include',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         // Frappe requires this on state-changing requests when using session/cookie auth.
  //         // Swap for an API key/secret header instead if that's how this app authenticates.
  //         'X-Frappe-CSRF-Token': window.csrf_token || ''
  //       },
  //       body: JSON.stringify(erpPayload)
  //     });

  //     if (!res.ok) {
  //       const errBody = await res.text();
  //       throw new Error(`Failed to create customer (${res.status}): ${errBody}`);
  //     }

  //     const { data } = await res.json();

  //     // Reconcile: replace the temp row with the real saved doc, keeping the
  //     // display-only fields (rentStatus, lastPaidAmount, etc.) that ERPNext doesn't track.
  //     setTenants(prev =>
  //       prev.map(t =>
  //         t.id === newTenant.id
  //           ? {
  //             ...displayFields,
  //             id: data.name,               // real Customer ID from ERPNext
  //             name: data.customer_name,
  //             email: data.email,
  //             phone: data.phone_no,
  //             _pending: false
  //           }
  //           : t
  //       )
  //     );
  //   } catch (err) {
  //     console.error('Error creating tenant in ERPNext:', err);
  //     // Roll back the optimistic insert on failure
  //     setTenants(prev => prev.filter(t => t.id !== newTenant.id));
  //     // Surface this to the user however your app does errors, e.g.:
  //     // setErrorMessage(err.message);
  //   }
  // };

  //   const handleAddTenant = async (newTenant) => {
  //     console.log('Adding new tenant:', newTenant);
  //   const { erpPayload } = newTenant;

  //   // Optimistic insert
  //   const tempTenant = { ...displayFields, id: newTenant.id, _pending: true };
  //   setTenants(prev => [...prev, tempTenant]);

  //   try {
  //     const res = await fetch(`${ERPNEXT_CONFIG.url}/api/resource/Customer`, {
  //       method: 'POST',
  //       credentials: 'include',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-Frappe-CSRF-Token': ERPNEXT_CONFIG.csrfToken || window.csrf_token || ''
  //       },
  //       body: JSON.stringify(newTenant)
  //     });

  //     if (!res.ok) {
  //       const errBody = await res.text();
  //       throw new Error(`Failed to create customer (${res.status}): ${errBody}`);
  //     }

  //     const { data } = await res.json();

  //     setTenants(prev =>
  //       prev.map(t =>
  //         t.id === newTenant.id
  //           ? {
  //               ...displayFields,
  //               id: data.name,
  //               name: data.customer_name,
  //               email: data.email,
  //               phone: data.phone_no,
  //               _pending: false
  //             }
  //           : t
  //       )
  //     );
  //   } catch (err) {
  //     console.error('Error creating tenant in ERPNext:', err);
  //     setTenants(prev => prev.filter(t => t.id !== newTenant.id));
  //   }
  // };

  const handleAddTenant = async (newTenant) => {
    console.log("Adding new tenant:", newTenant);

    // Payload for ERPNext
    const payload = {
      doctype: "Customer",
      customer_name: newTenant.customer_name,
      customer_type: "Tenant",
      customer_group: newTenant.customer_group || "All Customer Groups",
      territory: newTenant.territory || "All Territories",
      email: newTenant.email,
      phone_no: newTenant.phone_no,
      gender: newTenant.gender,
      date_of_birth: newTenant.date_of_birth
    };

    // Temporary row for optimistic UI
    const tempId = `temp-${Date.now()}`;

    const tempTenant = {
      id: tempId,
      name: payload.customer_name,
      customer_group: payload.customer_group,
      territory: payload.territory,
      email: payload.email,
      phone: payload.phone_no,
      gender: payload.gender,
      dob: payload.date_of_birth,
      _pending: true
    };

    setTenants((prev) => [...prev, tempTenant]);

    try {
      const response = await fetch(
        `${ERPNEXT_CONFIG.url}/api/resource/Customer`,
        {
          method: "POST",
          credentials: "include",
          headers: getAuthHeaders({
            "Content-Type": "application/json"
          }),
          body: JSON.stringify(payload)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.exception ||
          result?.message ||
          `Failed (${response.status})`
        );
      }

      // Fetch created document to get all fields
      const docRes = await fetch(
        `${ERPNEXT_CONFIG.url}/api/resource/Customer/${result.data.name}`,
        {
          credentials: "include"
        }
      );

      const doc = await docRes.json();

      setTenants((prev) =>
        prev.map((tenant) =>
          tenant.id === tempId
            ? {
              id: doc.data.name,
              name: doc.data.customer_name,
              customer_group: doc.data.customer_group,
              territory: doc.data.territory,
              email: doc.data.email,
              phone: doc.data.phone_no,
              gender: doc.data.gender,
              dob: doc.data.date_of_birth,
              _pending: false
            }
            : tenant
        )
      );
    } catch (error) {
      console.error("Error creating tenant:", error);

      setTenants((prev) => prev.filter((tenant) => tenant.id !== tempId));

      alert(error.message);
    }
  };

  const handleCreateMaintenanceSchedule = async (newSchedule) => {
    if (ERPNEXT_CONFIG) {
      if (Array.isArray(newSchedule)) {
        const results = [];
        for (const item of newSchedule) {
          results.push(await handleCreateMaintenanceSchedule(item));
        }
        return results;
      }

      const payloadToSend = { ...newSchedule };
      // Never send dummy mock 'PROP-2041' or empty property links
      if (!payloadToSend.custom_property || payloadToSend.custom_property === 'PROP-2041') {
        delete payloadToSend.custom_property;
      }

      let res = await fetch(`${ERPNEXT_CONFIG.url}/api/resource/Maintenance%20Schedule`, {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(payloadToSend)
      });

      // Auto-retry without custom_property if ERPNext rejects it via Property LinkValidationError
      if (!res.ok && payloadToSend.custom_property) {
        try {
          const errClone = res.clone();
          const errText = await errClone.text();
          if (errText.includes('Could not find Property') || errText.includes('Property') || errText.includes('LinkValidationError')) {
            const retryPayload = { ...payloadToSend };
            delete retryPayload.custom_property;
            res = await fetch(`${ERPNEXT_CONFIG.url}/api/resource/Maintenance%20Schedule`, {
              method: 'POST',
              credentials: 'include',
              headers: getAuthHeaders({
                'Content-Type': 'application/json'
              }),
              body: JSON.stringify(retryPayload)
            });
          }
        } catch (retryErr) {
          console.warn('Auto-retry without custom_property failed:', retryErr);
        }
      }

      if (res.ok) {
        const data = await res.json();
        const createdDoc = data.data || data;
        const detailRes = await fetch(`${ERPNEXT_CONFIG.url}/api/resource/Maintenance%20Schedule/${encodeURIComponent(createdDoc.name)}`, {
          credentials: 'include',
          headers: getAuthHeaders({
            'Content-Type': 'application/json'
          })
        });
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          const fullDoc = detailData.data || detailData;
          setSchedules(prev => [fullDoc, ...prev]);
          return fullDoc;
        }
        setSchedules(prev => [createdDoc, ...prev]);
        return createdDoc;
      } else {
        let errMsg = 'Failed to create Maintenance Schedule on ERPNext server';
        try {
          const errJson = await res.json();
          if (errJson._server_messages) {
            const msgs = JSON.parse(errJson._server_messages);
            errMsg = msgs.map(m => {
              try {
                const parsed = JSON.parse(m);
                return parsed.message || parsed;
              } catch {
                return String(m);
              }
            }).join(', ');
          }
        } catch { }
        throw new Error(errMsg);
      }
    } else {
      throw new Error('ERPNext API integration URL is not configured.');
    }
  };

  const handleAssignScheduleResource = async (scheduleName, team, resource) => {
    // Update local state
    setSchedules(prev => prev.map(sch => {
      if (sch.name === scheduleName) {
        return {
          ...sch,
          custom_assigned_team: team,
          custom_assigned_resource: resource
        };
      }
      return sch;
    }));

    if (ERPNEXT_CONFIG && ERPNEXT_CONFIG.url && !scheduleName.startsWith('SCH-')) {
      try {
        await fetch(`${ERPNEXT_CONFIG.url}/api/method/frappe.desk.form.assign_to.add`, {
          method: 'POST',
          credentials: 'include',
          headers: getAuthHeaders({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            doctype: 'Maintenance Schedule',
            name: scheduleName,
            assign_to: resource,
            description: `Assigned to ${team} department / ${resource}`
          })
        });
      } catch (err) {
        console.warn('Failed to assign ERPNext Maintenance Schedule resource:', err);
      }
    }
  };

  const handleCreateMaintenanceVisit = async (newVisit) => {
    if (ERPNEXT_CONFIG && ERPNEXT_CONFIG.url) {
      const res = await fetch(`${ERPNEXT_CONFIG.url}/api/resource/Maintenance%20Visit`, {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(newVisit)
      });
      if (res.ok) {
        const data = await res.json();
        const createdDoc = data.data || data;
        const detailRes = await fetch(`${ERPNEXT_CONFIG.url}/api/resource/Maintenance%20Visit/${createdDoc.name}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          const fullDoc = detailData.data || detailData;
          setVisits(prev => [fullDoc, ...prev]);
          return fullDoc;
        }
        setVisits(prev => [createdDoc, ...prev]);
        return createdDoc;
      } else {
        let errMsg = 'Failed to create Maintenance Visit on ERPNext server';
        try {
          const errJson = await res.json();
          if (errJson._server_messages) {
            const msgs = JSON.parse(errJson._server_messages);
            errMsg = msgs.map(m => {
              try {
                const parsed = JSON.parse(m);
                return parsed.message || parsed;
              } catch {
                return String(m);
              }
            }).join(', ');
          }
        } catch { }
        throw new Error(errMsg);
      }
    } else {
      throw new Error('ERPNext API integration URL is not configured.');
    }
  };

  const handleUpdateScheduleDate = async (parentName, childRowName, nextDate) => {
    let updatedScheduleDoc = null;
    setSchedules(prev => prev.map(sch => {
      if (sch.name === parentName) {
        const updatedSchedules = sch.schedules.map(row => {
          if (row.name === childRowName) {
            return { ...row, scheduled_date: nextDate };
          }
          return row;
        });
        updatedScheduleDoc = { ...sch, schedules: updatedSchedules };
        return updatedScheduleDoc;
      }
      return sch;
    }));

    if (ERPNEXT_CONFIG && updatedScheduleDoc && !parentName.startsWith('SCH-')) {
      try {
        await fetch(`${ERPNEXT_CONFIG.url}/api/resource/Maintenance%20Schedule/${parentName}`, {
          method: 'PUT',
          credentials: 'include',
          headers: getAuthHeaders({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ schedules: updatedScheduleDoc.schedules })
        });
      } catch (err) {
        console.warn('Failed to update ERPNext Maintenance Schedule schedules date:', err);
      }
    }
  };

  const handleUpdateScheduleStatus = async (scheduleName, nextStatus) => {
    setSchedules(prev => prev.map(sch => {
      if (sch.name === scheduleName) {
        const isSub = nextStatus === 'Submitted' || nextStatus === 'In Progress' || nextStatus === 'Completed';
        return { ...sch, status: nextStatus, docstatus: isSub ? 1 : (nextStatus === 'Cancelled' ? 2 : 0) };
      }
      return sch;
    }));

    if (ERPNEXT_CONFIG) {
      let erpStatus = 'Draft';
      if (nextStatus === 'In Progress' || nextStatus === 'Completed' || nextStatus === 'Submitted') {
        erpStatus = 'Submitted';
      } else if (nextStatus === 'Cancelled') {
        erpStatus = 'Cancelled';
      }

      try {
        if (erpStatus === 'Submitted') {
          try {
            await fetch(`${ERPNEXT_CONFIG.url}/api/method/approve_reject_doc`, {
              method: 'POST',
              credentials: 'include',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              body: JSON.stringify({ doctype_name: 'Maintenance Schedule', docname: scheduleName, state_code: 1 })
            });
          } catch (e) { }
        }
        await fetch(`${ERPNEXT_CONFIG.url}/api/resource/Maintenance%20Schedule/${encodeURIComponent(scheduleName)}`, {
          method: 'PUT',
          credentials: 'include',
          headers: getAuthHeaders({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ status: erpStatus, docstatus: erpStatus === 'Submitted' ? 1 : 0 })
        });
      } catch (err) {
        console.warn('Failed to update ERPNext Maintenance Schedule status:', err);
      }
    }
  };

  const handleUpdateVisitStatus = async (visitName, nextStatus) => {
    setVisits(prev => prev.map(v => {
      if (v.name === visitName) {
        const erpStatus = nextStatus === 'completed' ? 'Fully Completed' : nextStatus === 'in-progress' ? 'Partially Completed' : 'Pending';
        return { ...v, completion_status: erpStatus };
      }
      return v;
    }));

    if (ERPNEXT_CONFIG && !visitName.startsWith('MAT-MVS-')) {
      let erpStatus = '';
      if (nextStatus === 'in-progress') {
        erpStatus = 'Partially Completed';
      } else if (nextStatus === 'completed') {
        erpStatus = 'Fully Completed';
      }

      try {
        await fetch(`${ERPNEXT_CONFIG.url}/api/resource/Maintenance%20Visit/${visitName}`, {
          method: 'PUT',
          credentials: 'include',
          headers: getAuthHeaders({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ completion_status: erpStatus })
        });
      } catch (err) {
        console.warn('Failed to update ERPNext Maintenance Visit status:', err);
      }
    }
  };

  const handleCreateIssue = async (newIssue) => {
    if (ERPNEXT_CONFIG && ERPNEXT_CONFIG.url) {
      try {
        // 1. Sanitize priority: ERPNext standard priorities are Low, Medium, High, Urgent
        let safePriority = newIssue.priority || 'Medium';
        if (safePriority.toString().trim().toLowerCase() === 'critical') {
          safePriority = 'High';
        } else {
          safePriority = safePriority.charAt(0).toUpperCase() + safePriority.slice(1).toLowerCase();
          if (!['Low', 'Medium', 'High', 'Urgent'].includes(safePriority)) {
            safePriority = 'Medium';
          }
        }

        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;

        // Ensure table_gtmq has items if available
        let tableGtmq = Array.isArray(newIssue.table_gtmq) ? [...newIssue.table_gtmq] : [];
        if (tableGtmq.length === 0 && (newIssue.subcategory || newIssue.issue_type)) {
          tableGtmq = [{ issue: newIssue.subcategory || newIssue.issue_type }];
        }

        const issuePayload = {
          doctype: 'Issue',
          naming_series: newIssue.naming_series || 'ISS-.YYYY.-',
          subject: newIssue.subject,
          booking_number: newIssue.booking_number || 'BOOKING-10-00526',
          main_issues: newIssue.main_issues || 'Utilities & Infrastructure Issues List',
          company: newIssue.company || 'CARPENTERS PROPERTIES PTE LIMITED',
          priority: safePriority,
          status: newIssue.status || 'Open',
          raised_by: newIssue.raised_by || (currentUserDetails?.fullName ? `${currentUserDetails.fullName.toLowerCase().replace(/\s+/g, '.')}@anantdv.com` : 'sufal.dd@anantdv.com'),
          customer_name1: newIssue.customer_name1 || newIssue.customer || 'Administrator',
          ...(newIssue.customer_email ? { customer_email: newIssue.customer_email } : {}),
          ...(newIssue.customer_phone_number ? { customer_phone_number: newIssue.customer_phone_number } : {}),
          ...(newIssue.contact ? { contact: newIssue.contact } : (currentUserDetails?.fullName ? { contact: currentUserDetails.fullName } : {})),
          agreement_status: newIssue.agreement_status || 'First Response Due',
          budget: newIssue.budget !== undefined ? Number(newIssue.budget) : 0,
          via_customer_portal: newIssue.via_customer_portal !== undefined ? Number(newIssue.via_customer_portal) : 0,
          date: newIssue.date || formattedDate,
          opening_date: newIssue.opening_date || formattedDate,
          opening_time: newIssue.opening_time || formattedTime,
          custom_issue_items: Array.isArray(newIssue.custom_issue_items) ? newIssue.custom_issue_items : [],
          table_fogi: Array.isArray(newIssue.table_fogi) ? newIssue.table_fogi : [],
          table_gtmq: tableGtmq,
          ...(newIssue.description ? { description: newIssue.description } : {})
        };

        const postIssue = async (payload) => {
          return await fetch(`${ERPNEXT_CONFIG.url}/api/resource/Issue`, {
            method: 'POST',
            credentials: 'include',
            headers: getAuthHeaders({
              'Content-Type': 'application/json'
            }),
            body: JSON.stringify(payload)
          });
        };

        let res = await postIssue(issuePayload);

        // 2. If rejected due to LinkValidationError or table validation
        if (!res.ok) {
          let errText = '';
          try {
            const errClone = res.clone();
            const errData = await errClone.json();
            errText = JSON.stringify(errData);
          } catch { }

          // A. If child table validation failed, retry with empty child tables
          if (errText.includes('table_gtmq') || errText.includes('table_fogi') || errText.includes('custom_issue_items')) {
            const noTable = { ...issuePayload, table_gtmq: [], table_fogi: [], custom_issue_items: [] };
            res = await postIssue(noTable);
          }

          // B. If customer failed validation, retry without customer field
          if (!res.ok && (errText.includes('Customer') || errText.includes('customer'))) {
            const noCust = { ...issuePayload };
            delete noCust.customer;
            res = await postIssue(noCust);
          }

          // C. Handle Main Issues validation failure
          if (!res.ok && (errText.includes('Main Issues') || errText.includes('main_issues'))) {
            if (issuePayload.main_issues) {
              try {
                await fetch(`${ERPNEXT_CONFIG.url}/api/resource/Main%20Issues`, {
                  method: 'POST',
                  credentials: 'include',
                  headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                  body: JSON.stringify({ name: issuePayload.main_issues, main_issue: issuePayload.main_issues })
                });
                res = await postIssue(issuePayload);
              } catch { }
            }

            // If still not ok, fallback to 'Utilities & Infrastructure Issues List' (known to exist)
            if (!res.ok) {
              const fallbackPayload = { ...issuePayload, main_issues: 'Utilities & Infrastructure Issues List' };
              delete fallbackPayload.customer;
              res = await postIssue(fallbackPayload);
            }

            // If still not ok, remove main_issues field completely so issue creation succeeds
            if (!res.ok) {
              const noMainIssuesPayload = { ...issuePayload };
              delete noMainIssuesPayload.main_issues;
              delete noMainIssuesPayload.customer;
              res = await postIssue(noMainIssuesPayload);
            }
          }

          // D. Handle Priority validation failure
          if (!res.ok && (errText.includes('Priority') || errText.includes('priority'))) {
            const fallbackPriorityPayload = { ...issuePayload, priority: 'Medium' };
            res = await postIssue(fallbackPriorityPayload);
          }
        }

        if (res.ok) {
          const data = await res.json();
          const createdDoc = data.data || data;
          const mappedIssue = {
            id: createdDoc.name,
            subject: createdDoc.subject || newIssue.subject,
            tenantName: createdDoc.customer_name1 || createdDoc.customer_name || createdDoc.customer || createdDoc.raised_by || newIssue.customer_name1 || newIssue.customer || 'Administrator',
            customer_email: createdDoc.customer_email || createdDoc.raised_by || newIssue.customer_email || '',
            customer_phone: createdDoc.customer_phone_number || newIssue.customer_phone_number || '',
            contact: createdDoc.contact || newIssue.contact || '',
            propertyId: createdDoc.custom_property || createdDoc.property || newIssue.custom_property || newIssue.property || '',
            status: (createdDoc.status || newIssue.status || 'open').toLowerCase(),
            lastUpdated: 'Just now',
            dateRaised: createdDoc.date || newIssue.date || formattedDate,
            priority: (createdDoc.priority || safePriority || 'medium').toLowerCase(),
            booking_number: createdDoc.booking_number || newIssue.booking_number || 'BOOKING-10-00526',
            main_issues: createdDoc.main_issues || newIssue.main_issues || 'Utilities & Infrastructure Issues List',
            company: createdDoc.company || newIssue.company || 'CARPENTERS PROPERTIES PTE LIMITED',
            agreement_status: createdDoc.agreement_status || newIssue.agreement_status || 'First Response Due',
            budget: createdDoc.budget || 0,
            table_gtmq: createdDoc.table_gtmq || newIssue.table_gtmq || [],
            category: createdDoc.main_issues || newIssue.main_issues || 'maintenance',
            messages: [
              { sender: 'tenant', text: createdDoc.description || newIssue.description || 'Support request created.', timestamp: '10:00 AM' }
            ]
          };
          setSupportTickets(prev => [mappedIssue, ...prev]);
          return mappedIssue;
        } else {
          let errorMessage = 'Failed to create issue on ERPNext server';
          try {
            const errJson = await res.json();
            if (errJson._server_messages) {
              const messages = JSON.parse(errJson._server_messages);
              errorMessage = messages.map(m => {
                try {
                  const parsed = JSON.parse(m);
                  return parsed.message || parsed;
                } catch {
                  return String(m);
                }
              }).join(', ');
            }
          } catch { }
          throw new Error(errorMessage);
        }
      } catch (err) {
        console.warn('Failed to create ERPNext Issue:', err);
        throw err;
      }
    } else {
      throw new Error('ERPNext API integration URL is not configured in config.js');
    }
  };

  const handleAddInvoice = (newInvoice) => {
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const handleRecordPayment = async (invId) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invId) {
        return { ...inv, status: 'paid' };
      }
      return inv;
    }));

    if (ERPNEXT_CONFIG && !invId.startsWith('INV-')) {
      try {
        await fetch(`${ERPNEXT_CONFIG.url}/api/resource/Sales%20Invoice/${invId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: getAuthHeaders({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ status: 'Paid' })
        });
      } catch (err) {
        console.warn('Failed to update ERPNext Sales Invoice payment status:', err);
      }
    }
  };

  const handleAddSupportMessage = async (ticketId, message) => {
    let finalCommentText = message.isInternal ? `[Internal Note] ${message.text || ''}` : (message.text || '');

    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: !message.isInternal ? 'Replied' : t.status,
          lastUpdated: 'Just now',
          messages: [...(t.messages || []), {
            sender: 'admin',
            text: message.text + (message.file ? ` [Attachment: ${message.file.name}]` : ''),
            timestamp: 'Just now',
            is_internal: message.isInternal
          }]
        };
      }
      return t;
    }));

    if (ERPNEXT_CONFIG && ERPNEXT_CONFIG.url && !ticketId.startsWith('SUP-')) {
      try {
        let fileUrl = '';
        if (message.file) {
          const formData = new FormData();
          formData.append('file', message.file);
          formData.append('doctype', 'Issue');
          formData.append('docname', ticketId);
          formData.append('is_private', '0');
          const token = getCsrfToken();
          if (token) formData.append('csrf_token', token);

          const uploadRes = await fetch(`${ERPNEXT_CONFIG.url}/api/method/upload_file`, {
            method: 'POST',
            credentials: 'include',
            headers: getUploadHeaders(),
            body: formData
          });
          if (uploadRes.ok) {
            const uploadJson = await uploadRes.json();
            if (uploadJson.message && uploadJson.message.file_url) {
              fileUrl = uploadJson.message.file_url;
              finalCommentText += `<br><a href="${fileUrl}" target="_blank">Attachment: ${message.file.name}</a>`;
            }
          } else {
            console.warn('File upload failed in ERPNext:', await uploadRes.text());
          }
        }

        const currentTicket = supportTickets.find(t => t.id === ticketId);
        const matchedTenant = currentTicket?.customerId
          ? tenants.find(t => t.name === currentTicket.customerId || t.id === currentTicket.customerId)
          : null;
        const customerEmail = message.recipient ||
          matchedTenant?.email ||
          currentTicket?.customer_email ||
          currentTicket?.customer_email1 ||
          (currentTicket?.raised_by && currentTicket.raised_by.includes('@') ? currentTicket.raised_by : '') ||
          'sufal.dd@anantdv.com';

        const subjectLine = message.subject || `Re: ${currentTicket?.subject || 'Need Maintanence'} (#${ticketId})`;

        if (!message.isInternal && customerEmail) {
          // Send public comment as a Communication email (calls whitelisted method to trigger SMTP dispatch)
          let emailSentSuccessfully = false;
          try {
            const res = await fetch(`${ERPNEXT_CONFIG.url}/api/method/frappe.core.doctype.communication.email.make`, {
              method: 'POST',
              credentials: 'include',
              headers: getAuthHeaders({
                'Content-Type': 'application/json'
              }),
              body: JSON.stringify({
                recipients: customerEmail,
                subject: subjectLine,
                content: finalCommentText,
                doctype: 'Issue',
                name: ticketId,
                send_email: 1,
                communication_medium: 'Email',
                sent_or_received: 'Sent',
                send_me_a_copy: message.sendMeCopy ? 1 : 0
              })
            });
            if (res.ok) {
              emailSentSuccessfully = true;
              console.log("frappe.core.doctype.communication.email.make succeeded");
            } else {
              const errMsg = await res.text();
              console.warn("frappe.core.doctype.communication.email.make returned status:", res.status, errMsg);
            }
          } catch (fetchErr) {
            console.error("Error calling communication.email.make API:", fetchErr);
          }

          // Fallback direct Communication doc insert so the email activity is permanently tracked
          try {
            await fetch(`${ERPNEXT_CONFIG.url}/api/resource/Communication`, {
              method: 'POST',
              credentials: 'include',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              body: JSON.stringify({
                communication_type: 'Communication',
                communication_medium: 'Email',
                sent_or_received: 'Sent',
                sender: 'Administrator',
                sender_full_name: 'Administrator',
                recipients: customerEmail,
                subject: subjectLine,
                content: finalCommentText,
                reference_doctype: 'Issue',
                reference_name: ticketId,
                status: 'Linked'
              })
            });
          } catch (commErr) {
            console.warn("Direct Communication doc insert fallback error:", commErr);
          }

          // Automatically set status to Replied upon sending an email reply
          try {
            await fetch(`${ERPNEXT_CONFIG.url}/api/resource/Issue/${ticketId}`, {
              method: 'PUT',
              credentials: 'include',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              body: JSON.stringify({ status: 'Replied' })
            });
          } catch (stErr) {
            console.warn("Failed updating Issue status to Replied:", stErr);
          }

          // Also insert into Comment timeline for backward compatibility
          try {
            await fetch(`${ERPNEXT_CONFIG.url}/api/resource/Comment`, {
              method: 'POST',
              credentials: 'include',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              body: JSON.stringify({
                comment_type: 'Comment',
                reference_doctype: 'Issue',
                reference_name: ticketId,
                content: finalCommentText,
                comment_by: 'Administrator',
                is_internal: 0
              })
            });
          } catch (commentErr) {
            console.warn("Comment insert fallback error:", commentErr);
          }
        } else {
          // If it is an internal comment or no email is found, post it as a standard timeline Comment
          await fetch(`${ERPNEXT_CONFIG.url}/api/resource/Comment`, {
            method: 'POST',
            credentials: 'include',
            headers: getAuthHeaders({
              'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
              comment_type: 'Comment',
              reference_doctype: 'Issue',
              reference_name: ticketId,
              content: finalCommentText,
              comment_by: 'Administrator',
              is_internal: message.isInternal ? 1 : 0
            })
          });
        }
      } catch (err) {
        console.warn('Failed to update ERPNext Issue communication timeline:', err);
      }
    }
  };

  const handleCreateEmployee = async (newEmp) => {
    if (ERPNEXT_CONFIG && ERPNEXT_CONFIG.url) {
      try {
        const payload = {
          first_name: newEmp.firstName,
          last_name: newEmp.lastName,
          employee_name: newEmp.name,
          company_email: newEmp.email,
          cell_number: newEmp.phone,
          department: newEmp.department,
          designation: newEmp.designation,
          status: newEmp.status,
          date_of_joining: newEmp.joiningDate,
          gender: newEmp.gender,
          date_of_birth: newEmp.dateOfBirth,
          company: newEmp.company || 'CARPENTERS PROPERTIES PTE LIMITED',
          reports_to: newEmp.reportsTo && newEmp.reportsTo.length > 0 ? newEmp.reportsTo[0] : undefined
        };

        const res = await fetch(`${ERPNEXT_CONFIG.url}/api/resource/Employee`, {
          method: 'POST',
          credentials: 'include',
          headers: getAuthHeaders({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const createdData = await res.json();
          const createdDoc = createdData.data || createdData;
          const savedEmp = {
            ...newEmp,
            id: createdDoc.name || newEmp.id
          };
          setEmployees([...employees, savedEmp]);
          return savedEmp;
        } else {
          let errorMessage = 'Failed to create employee on ERPNext server';
          try {
            const errJson = await res.json();
            if (errJson._server_messages) {
              const messages = JSON.parse(errJson._server_messages);
              errorMessage = messages.map(m => {
                try {
                  const parsed = JSON.parse(m);
                  return parsed.message || parsed;
                } catch {
                  return String(m);
                }
              }).join(', ');
            }
          } catch {
            const errText = await res.text();
            if (errText) errorMessage = errText;
          }
          throw new Error(errorMessage);
        }
      } catch (err) {
        console.warn('ERPNext Employee creation failed:', err);
        throw err;
      }
    } else {
      throw new Error('ERPNext API integration URL is not configured in config.js');
    }
  };

  // Render Dashboard Home Statistics overview
  const renderDashboardOverview = (sectionType = currentTab) => {
    // Calculate Invoice Aging
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
      if (diffDays <= 0) {
        current += amount;
      } else if (diffDays <= 30) {
        overdue30 += amount;
      } else if (diffDays <= 60) {
        overdue60 += amount;
      } else if (diffDays <= 90) {
        overdue90 += amount;
      } else {
        overdueMore += amount;
      }
    });
    const aging = { current, overdue30, overdue60, overdue90, overdueMore };

    // 1. Calculate Occupancy Trends (Last 12 Months) booking records over month-wise over a period of year
    // Group booking records from `bookings` list by month
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trendMap = {};
    monthNames.forEach(m => { trendMap[m] = 0; });

    // Populate trend counts from booking dates
    bookings.forEach(b => {
      if (b.booking_date) {
        const date = new Date(b.booking_date);
        if (!isNaN(date.getTime())) {
          const mName = monthNames[date.getMonth()];
          trendMap[mName] = (trendMap[mName] || 0) + 1;
        }
      }
    });

    const maxTrendVal = Math.max(...Object.values(trendMap), 1);
    const occupancyTrends = monthNames.map(m => ({
      m,
      v: trendMap[m],
      pct: Math.round((trendMap[m] / maxTrendVal) * 100)
    }));

    // 2. Property Distribution -> use type of property in property group
    let resCount = 0;
    let commCount = 0;
    let mallCount = 0;
    properties.forEach(p => {
      const type = (p.type || '').toLowerCase();
      if (type === 'residential') {
        resCount++;
      } else if (type === 'mall') {
        mallCount++;
      } else {
        commCount++;
      }
    });
    const distTotal = properties.length || 1;
    const resPct = Math.round((resCount / distTotal) * 100);
    const commPct = Math.round((commCount / distTotal) * 100);
    const mallPct = Math.round((mallCount / distTotal) * 100);

    // Circle dash arrays: strokeDasharray = "pct (100 - pct)"
    // strokeDashoffset shifts the circle starts to align them sequentially
    const resOffset = 0;
    const commOffset = -resPct;
    const mallOffset = -(resPct + commPct);

    // Dynamic Status Distribution calculation for Dashboard
    const STATUS_PALETTE = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#6366f1', '#ef4444'];
    let currentDocItems = [];
    if (dashboardDocType === 'All') {
      currentDocItems = [
        ...bookings.map(() => 'Booking'),
        ...quotationsList.map(() => 'Quotation'),
        ...tenantOnboardingsList.map(() => 'Onboarding'),
        ...tasksList.map(() => 'Task')
      ];
      if (currentDocItems.length === 0) {
        currentDocItems = ['Booking', 'Quotation', 'Onboarding', 'Task'];
      }
    } else if (dashboardDocType === 'Booking') {
      currentDocItems = bookings.map(b => b.workflow_state || b.status || (b.docstatus === 1 ? 'Approved' : b.docstatus === 2 ? 'Cancelled' : 'Draft'));
      if (currentDocItems.length === 0) {
        currentDocItems = ['Approved', 'Approved', 'Approved', 'Pending', 'Pending', 'Draft', 'Cancelled'];
      }
    } else if (dashboardDocType === 'Quotation') {
      currentDocItems = quotationsList.map(q => q.workflow_state || q.status || (q.docstatus === 1 ? 'Submitted' : 'Draft'));
      if (currentDocItems.length === 0) {
        currentDocItems = ['Draft', 'Draft', 'Draft', 'Submitted', 'Submitted', 'Approved', 'Cancelled'];
      }
    } else if (dashboardDocType === 'Tenant Onboarding') {
      currentDocItems = tenantOnboardingsList.map(t => t.workflow_state || (t.docstatus === 1 ? 'Approved' : 'Under Review'));
      if (currentDocItems.length === 0) {
        currentDocItems = ['Under Review', 'Under Review', 'Under Review', 'Approved', 'Approved', 'Draft'];
      }
    } else if (dashboardDocType === 'Task') {
      currentDocItems = tasksList.map(t => t.status || 'Open');
      if (currentDocItems.length === 0) {
        currentDocItems = ['Open', 'Open', 'Working', 'Working', 'Completed', 'Completed', 'Pending Review'];
      }
    }

    const statusCounts = {};
    currentDocItems.forEach(st => {
      const s = String(st || 'Draft').trim();
      const norm = s.charAt(0).toUpperCase() + s.slice(1);
      statusCounts[norm] = (statusCounts[norm] || 0) + 1;
    });

    const docTypeTotal = currentDocItems.length || 1;
    const statusKeys = Object.keys(statusCounts);
    let cumOffset = 0;
    const docTypeSegments = statusKeys.map((k, idx) => {
      const count = statusCounts[k];
      const pct = Math.round((count / docTypeTotal) * 100);
      const seg = {
        label: k,
        count,
        pct,
        color: STATUS_PALETTE[idx % STATUS_PALETTE.length],
        offset: -cumOffset
      };
      cumOffset += pct;
      return seg;
    });

    // 3. Property Listings -> show property group (10 records) and make scrollable
    const propertyListings = properties.slice(0, 10);

    // Helper to generate monthly days list for visual calendar dropdown navigation
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const calYear = calendarDate.getFullYear();
    const calMonth = calendarDate.getMonth();
    const daysInMonth = getDaysInMonth(calYear, calMonth);
    const startDayOffset = getFirstDayOfMonth(calYear, calMonth);

    const prevMonthDays = getDaysInMonth(calYear, calMonth - 1);

    const daysArray = [];
    // Previous month filler days
    for (let i = startDayOffset - 1; i >= 0; i--) {
      daysArray.push({ day: prevMonthDays - i, isCurrentMonth: false, monthOffset: -1 });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push({ day: i, isCurrentMonth: true, monthOffset: 0 });
    }
    // Next month filler days to complete standard 42 cell calendar grids
    const remainingCells = 42 - daysArray.length;
    for (let i = 1; i <= remainingCells; i++) {
      daysArray.push({ day: i, isCurrentMonth: false, monthOffset: 1 });
    }

    // Find if there are events in our local state datasets on this date
    // We can map Maintenance Schedules or Bookings as calendar events
    const getDayEvents = (day, isCurr, offset) => {
      if (!isCurr) return [];
      const currentCheckingDateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = [];

      bookings.forEach(b => {
        if (b.booking_date === currentCheckingDateStr) {
          dayEvents.push({ type: 'booking', text: `Booking: ${b.customer_name || b.name}` });
        }
      });
      schedules.forEach(sch => {
        if (sch.transaction_date === currentCheckingDateStr) {
          dayEvents.push({ type: 'maintenance', text: `Maint: ${sch.customer_name || sch.name}` });
        }
      });
      return dayEvents;
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Header */}
        <div className="view-header" style={{ marginBottom: 0, position: 'relative', overflow: 'visible' }}>
          <div>
            <h1 className="view-title" style={{ fontSize: '1.65rem' }}>
              {sectionType === 'overview' ? 'Overview' : 'Dashboard'}
            </h1>
            <p className="view-subtitle">
              {sectionType === 'overview'
                ? 'Operations overview for Carpenters Properties & retail units.'
                : 'Executive operations dashboard for Carpenters Properties & retail units.'}
            </p>
          </div>

          {/* Calendar Widget Container */}
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
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-color)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            >
              <Calendar size={18} style={{ color: 'var(--brand-color)' }} />
              <span>{systemDateTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} {systemDateTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </button>

            {/* Dropdown View */}
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
                color: 'var(--text-primary)'
              }}>
                {/* Year/Month Navigation Header */}
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

                {/* Days of Week Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontWeight: 600, fontSize: '11px', color: 'var(--text-secondary)', marginBottom: 8 }}>
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>

                {/* Calendar Days Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: 12 }}>
                  {daysArray.map((cell, idx) => {
                    const cellEvents = getDayEvents(cell.day, cell.isCurrentMonth, cell.monthOffset);
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

                {/* Event details drawer inside calendar view */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '6px', maxHeight: '110px', overflowY: 'auto' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Calendar Events ({calendarDate.toLocaleString('default', { month: 'short' })} {calYear}):
                  </div>
                  {/* List current month events */}
                  {(() => {
                    const monthEvents = [];
                    bookings.forEach(b => {
                      if (b.booking_date && new Date(b.booking_date).getMonth() === calMonth && new Date(b.booking_date).getFullYear() === calYear) {
                        monthEvents.push({ date: b.booking_date, label: `Booking: ${b.customer_name || b.name}` });
                      }
                    });
                    schedules.forEach(sch => {
                      if (sch.transaction_date && new Date(sch.transaction_date).getMonth() === calMonth && new Date(sch.transaction_date).getFullYear() === calYear) {
                        monthEvents.push({ date: sch.transaction_date, label: `Maintenance: ${sch.customer_name || sch.name}` });
                      }
                    });

                    if (monthEvents.length === 0) {
                      return <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No scheduled activities</div>;
                    }
                    return monthEvents.map((ev, i) => (
                      <div key={i} style={{ fontSize: '10px', display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--bg-tertiary)' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{ev.label}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{ev.date}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
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

          {sectionType === 'dashboard' ? (
            <div
              className="stat-card"
              style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
              onClick={() => setCurrentTab('properties')}
              title="DocType: Item | Filter: item_group = Commercial"
            >
              <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #d946ef)', color: '#fff', padding: 12, borderRadius: 12, display: 'flex' }}>
                <Building2 size={24} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Commercial Units</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {commercialUnitsCount || dashboardStats.commercialUnits || 0}
                  <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Units</span>
                </div>
              </div>
            </div>
          ) : (
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
          )}

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

            {/* SVG/Div Bar Chart */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 160, paddingBottom: 10, position: 'relative' }}>
              {/* Y-Axis guide lines */}
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

          {/* Status Distribution (Dashboard) OR Property Distribution (Overview) */}
          {sectionType === 'dashboard' ? (
            <div className="card-panel" style={{ margin: 0, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>DocType Status</h3>
                <select
                  className="form-select"
                  value={dashboardDocType}
                  onChange={(e) => setDashboardDocType(e.target.value)}
                  style={{ width: 155, padding: '4px 8px', fontSize: 11, borderRadius: 6, fontWeight: 500 }}
                >
                  <option value="All">All DocTypes</option>
                  <option value="Booking">Booking</option>
                  <option value="Quotation">Quotation</option>
                  <option value="Tenant Onboarding">Tenant Onboarding</option>
                  <option value="Task">Task</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 110, position: 'relative' }}>
                <svg width="100" height="100" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                  {docTypeSegments.map((seg, idx) => (
                    <circle
                      key={idx}
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="4.2"
                      strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                      strokeDashoffset={seg.offset}
                    />
                  ))}
                </svg>
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{docTypeTotal}</span>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Total</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, marginTop: 10, maxHeight: 110, overflowY: 'auto' }}>
                {docTypeSegments.map((seg, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
                      <span style={{ textTransform: 'capitalize' }}>{seg.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>({seg.count})</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{seg.pct}%</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card-panel" style={{ margin: 0, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '0.975rem', fontWeight: 600, marginBottom: 14 }}>Property Distribution</h3>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 110 }}>
                <svg width="100" height="100" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Residential - Light Blue (#3b82f6) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4.2" strokeDasharray={`${resPct} ${100 - resPct}`} strokeDashoffset={resOffset} />
                  {/* Mixed-Use / Commercial - Purple (#8b5cf6) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="4.2" strokeDasharray={`${commPct} ${100 - commPct}`} strokeDashoffset={commOffset} />
                  {/* Mall - Light Green (#10b981) */}
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
          )}
        </div>

        {/* Listings Table & Real-Time Analytics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: 20 }}>
          {/* Property Listings */}
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
                      <td style={{ padding: '10px' }}>
                        <span className="badge badge-success" style={{ padding: '2px 8px' }}>Active</span>
                      </td>
                      <td style={{ padding: '10px' }}>{prop.address || 'Fiji'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-Time Analytics -> Invoice Aging */}
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

        {/* Bottom Panel Widgets Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {/* Recent Activity Feed */}
          <div className="card-panel" style={{ margin: 0, padding: 18 }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>Recent Activity Feed</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Tenant Paid Rent</div>
                  <div style={{ color: 'var(--text-muted)' }}>Tenant Paid Pcoof Rent</div>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>3m ago</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Maintenance Request</div>
                  <div style={{ color: 'var(--text-muted)' }}>Elevator Maintenance</div>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>2m ago</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>New Lease Signed</div>
                  <div style={{ color: 'var(--text-muted)' }}>Suite 204 Secured</div>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>2m ago</span>
              </div>
            </div>
          </div>

          {/* Maintenance Requests Tracker */}
          <div className="card-panel" style={{ margin: 0, padding: 18 }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>Maintenance Requests Tracker</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>New</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '40%', height: '100%', background: '#ef4444' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>In Progress</span>
                  <span style={{ color: '#f59e0b', fontWeight: 600 }}>In Progress</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '65%', height: '100%', background: '#f59e0b' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Complete</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>Complete</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '90%', height: '100%', background: '#10b981' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Rental Payment Calendar */}
          <div className="card-panel" style={{ margin: 0, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Rental Payment Calendar</h3>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Li-Month</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center', fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {/* Dummy cells */}
              <div style={{ height: 18, background: 'var(--bg-tertiary)', borderRadius: 3 }} />
              <div style={{ height: 18, background: 'var(--bg-tertiary)', borderRadius: 3 }} />
              <div style={{ height: 18, background: 'var(--bg-tertiary)', borderRadius: 3 }} />
              <div style={{ height: 18, background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f6', borderRadius: 3, fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontWeight: 600 }}>Pay</div>
              <div style={{ height: 18, background: 'var(--bg-tertiary)', borderRadius: 3 }} />
              <div style={{ height: 18, background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', borderRadius: 3, fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', fontWeight: 600 }}>Pay</div>
              <div style={{ height: 18, background: 'var(--bg-tertiary)', borderRadius: 3 }} />
            </div>
          </div>

          {/* Property Map View */}
          <div
            className="card-panel"
            style={{ margin: 0, padding: 18, display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
            onClick={() => setShowMapModal(true)}
          >
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 8 }}>Property Map View</h3>
            {/* <div style={{ flex: 1, minHeight: 90, background: '#1e293b', borderRadius: 8, position: 'relative', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <MapComponent />
            </div> */}
            <div style={{ flex: 1, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-color)', minHeight: 150 }}>
              {/* <MapComponent properties={properties} height="100%" zoom={13} /> */}
              <MapComponent properties={propertylist_withcords} view={mapView} onViewChange={setMapView} />
            </div>
          </div>

          {/* Centered Map Modal Overlay */}
          {showMapModal && (
            <div
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
              onClick={() => setShowMapModal(false)}
            >
              <div
                style={{
                  background: 'var(--bg-primary)',
                  borderRadius: 16,
                  width: 'min(900px, 90vw)',
                  height: 'min(650px, 85vh)',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                  border: '1px solid var(--border-color)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Property Map View</h3>
                  <button
                    onClick={() => setShowMapModal(false)}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: 'none',
                      borderRadius: 8,
                      width: 32, height: 32,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: 16,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <MapComponent properties={properties} height="100%" zoom={13} />

                </div> */}
                <div style={{ flex: 1, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  {/* <MapComponent properties={properties} height="100%" zoom={13} /> */}
                  <MapComponent properties={propertylist_withcords} view={mapView} onViewChange={setMapView} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render Ultra-Attractive Executive Dashboard View (User-Perspective)
  const renderExecutiveDashboardView = () => {
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

    // Calculate real monetary values for each DocType
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

    // Realistic fallback baseline if database records have null currency amounts
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
      const allMentionedDocs = [
        {
          id: 'Booking',
          label: 'Booking',
          color: DOCTYPE_PALETTE['Booking'],
          realValue: safeBookingVal,
          count: bookings.length
        },
        {
          id: 'Quotation',
          label: 'Quotation',
          color: DOCTYPE_PALETTE['Quotation'],
          realValue: safeQuotationVal,
          count: quotationsList.length
        },
        {
          id: 'Tenant Onboarding',
          label: 'Onboarding',
          color: DOCTYPE_PALETTE['Tenant Onboarding'],
          realValue: safeOnboardingVal,
          count: tenantOnboardingsList.length
        },
        {
          id: 'Task',
          label: 'Task',
          color: DOCTYPE_PALETTE['Task'],
          realValue: safeTaskVal,
          count: tasksList.length
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

      if (dashboardDocType === 'Booking') {
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

    // Filter specifically for Active Bookings (Approved, Confirmed, Active, or docstatus === 1; not cancelled/rejected)
    const activeBookings = bookings.filter(b => {
      if (b.docstatus === 2) return false;
      const ws = (b.workflow_state || '').trim().toLowerCase();
      const st = (b.status || '').trim().toLowerCase();
      if (['cancelled', 'cancel', 'rejected', 'draft'].includes(ws)) return false;
      if (['cancelled', 'cancel', 'rejected', 'draft'].includes(st)) return false;
      return ws === 'approved' || ws === 'active' || st === 'confirmed' || st === 'active' || b.docstatus === 1;
    });

    // Dynamic list of all status values for the Top 5 Bookings dropdown
    const detectedStatuses = new Set();
    bookings.forEach(b => {
      const s = b.workflow_state || b.status;
      if (s && typeof s === 'string' && s.trim()) detectedStatuses.add(s.trim());
    });
    ['Active', 'Approved', 'Confirmed', 'Request For Approval', 'Waiting For Contract Submit', 'Draft', 'Cancelled', 'Rejected'].forEach(s => detectedStatuses.add(s));
    const bookingStatusOptions = ['All', ...Array.from(detectedStatuses)];

    // Filter bookings based on selected status dropdown
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

    // Sort filtered bookings by contract value / booking amount descending, then date
    const sortedBookings = [...filteredBookingsByStatus].sort((a, b) => {
      const amtA = parseFloat(a.booking_amount || a.paid_amount || 0);
      const amtB = parseFloat(b.booking_amount || b.paid_amount || 0);
      if (amtB !== amtA) return amtB - amtA;
      const dateA = new Date(a.booking_date || a.starting_date || 0);
      const dateB = new Date(b.booking_date || b.starting_date || 0);
      return dateB - dateA;
    });

    let topFiveBookings = sortedBookings.slice(0, 5);

    // Fallback demonstration data if no bookings exist yet in local state and filter is All or Active
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

    // Expose dashboard data globally for quick inspection/copy
    if (typeof window !== 'undefined') {
      window.__PMS_DASHBOARD_DATA__ = dashboardPageJson;
      window.printDashboardJson = () => {
        console.log('📊 [PMS Dashboard Page JSON]:', window.__PMS_DASHBOARD_DATA__);
        console.log('📄 [PMS Dashboard Page JSON String]:\n' + JSON.stringify(window.__PMS_DASHBOARD_DATA__, null, 2));
      };
    }

    // Print the Dashboard page JSON in console log JUST ONE TIME (prevents multiple repeated prints on re-render)
    if (!hasLoggedDashboardJsonRef.current && (!dataLoading || properties.length > 0 || bookings.length > 0)) {
      hasLoggedDashboardJsonRef.current = true;
      console.log('📊 [PMS Dashboard Page JSON]:', dashboardPageJson);
      console.log('📄 [PMS Dashboard Page JSON String]:\n' + JSON.stringify(dashboardPageJson, null, 2));
    }

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
            Exclusive Dashboard
          </h1>

          {/* Date and Time */}
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
                {dashboardStats.totalProperties}
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
                {commercialUnitsCount || dashboardStats.commercialUnits || 0}
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
                F${Number(monthlyPaidRevenueValue || 0).toLocaleString()}
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
                {draftMaintenanceCount !== undefined && draftMaintenanceCount !== null ? draftMaintenanceCount : dashboardStats.pendingMaintenance}
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

            {/* High-tech Gradient Bar Chart */}
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

          {/* Right: Dynamic DocType Status Donut with Pill Switcher & Real Value Chart */}
          <div className="card-panel" style={{ margin: 0, padding: 22, borderRadius: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>DocType Status</h3>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Real value & workflow distribution</span>
                </div>

                {/* Real Value vs Count Toggle Pill */}
                <div style={{ display: 'inline-flex', background: 'var(--bg-tertiary)', borderRadius: 8, padding: 2, border: '1px solid var(--border-color, #e2e8f0)' }}>
                  <button
                    type="button"
                    onClick={() => setDashboardDocTypeViewMode('value')}
                    style={{
                      padding: '3px 8px',
                      fontSize: 10,
                      fontWeight: 600,
                      borderRadius: 6,
                      border: 'none',
                      cursor: 'pointer',
                      background: dashboardDocTypeViewMode === 'value' ? 'var(--brand-color)' : 'transparent',
                      color: dashboardDocTypeViewMode === 'value' ? '#ffffff' : 'var(--text-secondary)',
                      boxShadow: dashboardDocTypeViewMode === 'value' ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 0.18s ease'
                    }}
                    title="Show chart scaled by real monetary value (F$)"
                  >
                    Value (F$)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDashboardDocTypeViewMode('count')}
                    style={{
                      padding: '3px 8px',
                      fontSize: 10,
                      fontWeight: 600,
                      borderRadius: 6,
                      border: 'none',
                      cursor: 'pointer',
                      background: dashboardDocTypeViewMode === 'count' ? 'var(--brand-color)' : 'transparent',
                      color: dashboardDocTypeViewMode === 'count' ? '#ffffff' : 'var(--text-secondary)',
                      boxShadow: dashboardDocTypeViewMode === 'count' ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 0.18s ease'
                    }}
                    title="Show chart scaled by record count"
                  >
                    Count
                  </button>
                </div>
              </div>

              {/* Interactive DocType Pill Switcher */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, background: 'var(--bg-tertiary)', borderRadius: 10, padding: 3, marginBottom: 16 }}>
                {[
                  { id: 'All', label: 'All DocTypes' },
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
                      fontSize: 10,
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

            {/* Glowing SVG Donut Chart with Center Total */}
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

            {/* Status Breakdown Legend with Real Value, Count & Mini Progress Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 11, marginTop: 12, maxHeight: 125, overflowY: 'auto' }}>
              {docTypeSegments.map((seg, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{seg.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      {dashboardDocTypeViewMode === 'value' ? (
                        <>
                          <span style={{ color: 'var(--brand-color)', fontWeight: 600, fontSize: 10.5 }}>F${Math.round(seg.realValue).toLocaleString()}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: 9.5 }}>({seg.count})</span>
                          <strong style={{ color: 'var(--text-primary)', minWidth: 26, textAlign: 'right' }}>{seg.pct}%</strong>
                        </>
                      ) : (
                        <>
                          <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>({seg.count})</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: 10 }}>F${Math.round(seg.realValue).toLocaleString()}</span>
                          <strong style={{ color: 'var(--text-primary)', minWidth: 26, textAlign: 'right' }}>{seg.pct}%</strong>
                        </>
                      )}
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
                          {/* Rank Column */}
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

                          {/* Tenant Name */}
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

                          {/* Booking Link */}
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
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#2563eb';
                                e.currentTarget.style.color = '#ffffff';
                                e.currentTarget.style.boxShadow = '0 3px 10px rgba(37, 99, 235, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(37, 99, 235, 0.08)';
                                e.currentTarget.style.color = '#2563eb';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                              title={`Click to open booking ${b.name}`}
                            >
                              <ExternalLink size={12} />
                              <span>{b.name}</span>
                            </button>
                          </td>

                          {/* Property / Space */}
                          <td style={{ padding: '10px', fontSize: 12, color: 'var(--text-secondary)' }}>
                            {b.property || 'Estate Asset'}
                          </td>

                          {/* Contract Value */}
                          <td style={{ padding: '10px', fontWeight: 700, color: '#10b981', fontSize: 12.5 }}>
                            F${(parseFloat(b.booking_amount || b.paid_amount || 0)).toLocaleString()}
                          </td>

                          {/* Status */}
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

                          {/* Action Button */}
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
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--brand-color)';
                                e.currentTarget.style.color = '#fff';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--bg-tertiary)';
                                e.currentTarget.style.color = 'var(--brand-color)';
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

          {/* Semi-transparent Backdrop for outside-click dismissal */}
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

          {/* Quick Actions Speed-Dial Popup Menu */}
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
              {/* Menu Header */}
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

              {/* Action Items List */}
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

          {/* Main Floating Trigger Button */}
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
  };


  const handleGoToBooking = (quotationDoc) => {
    const quotationId = quotationDoc?.booking_id || quotationDoc?.quotation || quotationDoc?.name || quotationDoc?.quotation_id || '';
    setBookingSearchFromQuotation(quotationId);
    setCurrentTab('bookings');
  };

  const handleGoToTask = (taskId) => {
    if (taskId) {
      setSelectedTaskIdForMaintenance(taskId);
      setCurrentTab('maintenance');
    }
  };

  const renderActiveView = () => {
    if (dataLoading && currentTab !== 'reports' && currentTab !== 'mall-3d') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
          <div className="spin" style={{ width: 40, height: 40, border: '4px solid #cbd5e1', borderTopColor: '#3b82f6', borderRadius: '50%' }}></div>
          <p style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>Waiting for response</p>
        </div>
      );
    }

    switch (currentTab) {
      case 'properties':
        return (
          <Properties
            properties={properties}
            preSelectedProperty={preSelectedProperty}
            clearPreSelectedProperty={() => setPreSelectedProperty(null)}
            onAddProperty={handleAddProperty}
            onToggleListOnline={handleToggleListOnline}
            erpnextConfig={ERPNEXT_CONFIG}
            tenants={tenants}
            owners={owners}
            bookings={bookings}
            onScheduleMaintenance={(prop) => {
              setPreSelectedProperty(prop);
              setCurrentTab('maintenance');
            }}
          />
        );
      case 'tenants':
        return <Tenants tenants={tenants} properties={properties} bookings={bookings} onAddTenant={handleAddTenant} erpnextConfig={ERPNEXT_CONFIG} />;
      case 'tenant-onboarding':
        return (
          <TenantOnboarding
            erpnextConfig={ERPNEXT_CONFIG}
            getCsrfToken={getCsrfToken}
            onNavigateToQuotation={(qId) => {
              if (qId) setSelectedQuotationId(qId);
              setCurrentTab('quotation');
            }}
          />
        );
      case 'owners':
        return <Owners owners={owners} erpnextConfig={ERPNEXT_CONFIG} />;
      case 'mall-3d':
        return <Mall3DView properties={properties} />;
      case 'listings':
        return <Listings properties={properties} />;
      case 'maintenance':
        return (
          <Maintenance
            schedules={schedules}
            visits={visits}
            tenants={tenants}
            properties={properties}
            preSelectedProperty={preSelectedProperty}
            clearPreSelectedProperty={() => setPreSelectedProperty(null)}
            preSelectedIssue={preSelectedIssue}
            clearPreSelectedIssue={() => setPreSelectedIssue(null)}
            onCreateSchedule={handleCreateMaintenanceSchedule}
            onUpdateScheduleDate={handleUpdateScheduleDate}
            onUpdateScheduleStatus={handleUpdateScheduleStatus}
            onUpdateVisitStatus={handleUpdateVisitStatus}
            erpnextConfig={ERPNEXT_CONFIG}
            employees={employees}
            vendors={owners}
            onAssignResource={handleAssignScheduleResource}
            onCreateVisit={handleCreateMaintenanceVisit}
            onNavigateToQuotation={(qId) => {
              if (qId) setSelectedQuotationId(qId);
              setCurrentTab('quotation');
            }}
            onNavigateToInvoice={() => {
              setCurrentTab('invoices');
            }}
            preSelectedTaskId={selectedTaskIdForMaintenance}
            clearPreSelectedTaskId={() => setSelectedTaskIdForMaintenance('')}
          />
        );
      case 'invoices':
        return (
          <Invoices
            invoices={invoices}
            accounts={accounts}
            glEntries={glEntries}
            onAddInvoice={handleAddInvoice}
            onRecordPayment={handleRecordPayment}
            erpnextConfig={ERPNEXT_CONFIG}
            tenants={tenants}
            properties={properties}
            bookings={bookings}
            preSelectedInvoiceId={selectedInvoiceIdForDetails}
            clearPreSelectedInvoiceId={() => setSelectedInvoiceIdForDetails('')}
          />
        );
      case 'payment-entry':
        return (
          <PaymentEntry
            erpnextConfig={ERPNEXT_CONFIG}
            tenants={tenants}
            onNavigateToInvoice={(invId) => {
              if (invId) {
                setSelectedInvoiceIdForDetails(invId);
              }
              setCurrentTab('invoices');
            }}
          />
        );
      case 'support':
        return (
          <Support
            tickets={supportTickets}
            onAddMessage={handleAddSupportMessage}
            onCreateIssue={handleCreateIssue}
            tenants={tenants}
            properties={properties}
            bookings={bookings}
            erpnextConfig={ERPNEXT_CONFIG}
            onCreateSchedule={handleCreateMaintenanceSchedule}
            onConvertToMaintenance={(ticket) => {
              setPreSelectedIssue(ticket);
            }}
          />
        );
      case 'reports':
        return <Reports />;
      case 'hrms':
        return (
          <HRMS
            employees={employees}
            setEmployees={setEmployees}
            onCreateEmployee={handleCreateEmployee}
            departments={erpnextDepts}
            designations={erpnextDesgs}
            erpnextConfig={ERPNEXT_CONFIG}
          />
        );
      case 'bookings':
        return (
          <Booking
            erpnextConfig={ERPNEXT_CONFIG}
            initialSearchTerm={bookingSearchFromQuotation}
            onClearInitialSearch={() => setBookingSearchFromQuotation('')}
          />
        );
      case 'quotation':
        return (
          <Quotation
            erpnextConfig={ERPNEXT_CONFIG}
            properties={properties}
            onGoToBooking={handleGoToBooking}
            onGoToTask={handleGoToTask}
            initialQuotationId={selectedQuotationId}
            onClearInitialQuotation={() => setSelectedQuotationId('')}
          />
        );
      case 'overview':
        return (
          <Dashboard
            mode="overview"
            currentTab={currentTab}
            properties={properties}
            bookings={bookings}
            invoices={invoices}
            schedules={schedules}
            tenants={tenants}
            owners={owners}
            quotationsList={quotationsList}
            tenantOnboardingsList={tenantOnboardingsList}
            tasksList={tasksList}
            commercialUnitsCount={commercialUnitsCount}
            draftMaintenanceCount={draftMaintenanceCount}
            dashboardStats={dashboardStats}
            dataLoading={dataLoading}
            systemDateTime={systemDateTime}
            setCurrentTab={setCurrentTab}
            setBookingSearchFromQuotation={setBookingSearchFromQuotation}
            setPreSelectedProperty={setPreSelectedProperty}
            setSelectedQuotationId={setSelectedQuotationId}
            setSelectedTaskIdForMaintenance={setSelectedTaskIdForMaintenance}
            setSelectedInvoiceIdForDetails={setSelectedInvoiceIdForDetails}
            erpnextConfig={ERPNEXT_CONFIG}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            mode="dashboard"
            currentTab={currentTab}
            properties={properties}
            bookings={bookings}
            invoices={invoices}
            schedules={schedules}
            tenants={tenants}
            owners={owners}
            quotationsList={quotationsList}
            tenantOnboardingsList={tenantOnboardingsList}
            tasksList={tasksList}
            commercialUnitsCount={commercialUnitsCount}
            draftMaintenanceCount={draftMaintenanceCount}
            dashboardStats={dashboardStats}
            dataLoading={dataLoading}
            systemDateTime={systemDateTime}
            setCurrentTab={setCurrentTab}
            setBookingSearchFromQuotation={setBookingSearchFromQuotation}
            setPreSelectedProperty={setPreSelectedProperty}
            setSelectedQuotationId={setSelectedQuotationId}
            setSelectedTaskIdForMaintenance={setSelectedTaskIdForMaintenance}
            setSelectedInvoiceIdForDetails={setSelectedInvoiceIdForDetails}
            erpnextConfig={ERPNEXT_CONFIG}
          />
        );
      default:
        return (
          <Dashboard
            mode="overview"
            currentTab={currentTab}
            properties={properties}
            bookings={bookings}
            invoices={invoices}
            schedules={schedules}
            tenants={tenants}
            owners={owners}
            quotationsList={quotationsList}
            tenantOnboardingsList={tenantOnboardingsList}
            tasksList={tasksList}
            commercialUnitsCount={commercialUnitsCount}
            draftMaintenanceCount={draftMaintenanceCount}
            dashboardStats={dashboardStats}
            dataLoading={dataLoading}
            systemDateTime={systemDateTime}
            setCurrentTab={setCurrentTab}
            setBookingSearchFromQuotation={setBookingSearchFromQuotation}
            setPreSelectedProperty={setPreSelectedProperty}
            setSelectedQuotationId={setSelectedQuotationId}
            setSelectedTaskIdForMaintenance={setSelectedTaskIdForMaintenance}
            setSelectedInvoiceIdForDetails={setSelectedInvoiceIdForDetails}
            erpnextConfig={ERPNEXT_CONFIG}
          />
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        fontFamily: 'var(--font-sans)',
        color: '#1e293b',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Navigation Header */}
        <header className="portal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <svg viewBox="0 0 100 100" style={{ width: 44, height: 44 }}>
              <rect width="100" height="100" fill="#000000" rx="12" />
              <circle cx="50" cy="50" r="36" fill="#FFDD00" />
              <polygon points="50,50 86,14 100,14 100,86 86,86" fill="#000000" />
              <line x1="24" y1="76" x2="50" y2="50" stroke="#000000" strokeWidth="5.5" strokeLinecap="round" />
            </svg>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#0f172a' }}>Carpenters Properties</h1>
              <span style={{ fontSize: '11px', color: '#b59b00', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pte Limited</span>
            </div>
          </div>
          <nav className="portal-nav" style={{ position: 'relative' }}>
            <a href="#about" style={{ color: '#475569', textDecoration: 'none', fontSize: '13px', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#0f172a'} onMouseLeave={(e) => e.target.style.color = '#475569'}>About Us</a>
            <a href="#developments" style={{ color: '#475569', textDecoration: 'none', fontSize: '13px', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#0f172a'} onMouseLeave={(e) => e.target.style.color = '#475569'}>Flagship Projects</a>

            {/* PMS Portal Dropdown Trigger & Options */}
            <div style={{ position: 'relative' }} ref={portalDropdownRef}>
              <button
                type="button"
                id="pms-portal-dropdown-btn"
                onClick={() => setPortalDropdownOpen(prev => !prev)}
                className="portal-btn-primary"
                style={{
                  background: portalDropdownOpen ? '#FFDD00' : 'rgba(255, 221, 0, 0.15)',
                  color: portalDropdownOpen ? '#000000' : '#9a8100',
                  padding: '8px 18px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: '1px solid rgba(255, 221, 0, 0.4)',
                  transition: 'all 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#FFDD00'; e.currentTarget.style.color = '#000'; }}
                onMouseLeave={(e) => {
                  if (!portalDropdownOpen) {
                    e.currentTarget.style.background = 'rgba(255, 221, 0, 0.15)';
                    e.currentTarget.style.color = '#9a8100';
                  }
                }}
              >
                <span>PMS Portal</span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: portalDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}
                />
              </button>

              {/* Dropdown with Two Options: Admin Portal & Operation Portal */}
              {portalDropdownOpen && (
                <div
                  id="pms-portal-dropdown-menu"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '320px',
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '12px',
                    boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.15), 0 10px 15px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.08)',
                    zIndex: 2000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    animation: 'portalDropdownFadeIn 0.2s ease-out'
                  }}
                >
                  <div style={{
                    padding: '4px 10px 6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    {/* <span>Select Portal</span>
                    <span style={{ fontSize: '10px', color: '#b59b00', fontWeight: 600 }}>2 Options Available</span> */}
                  </div>

                  {/* Option 1: Admin Portal */}
                  <button
                    type="button"
                    id="opt-admin-portal"
                    onClick={() => handleSelectPortal('admin')}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px',
                      background: selectedPortal === 'admin' ? 'rgba(255, 221, 0, 0.14)' : '#f8fafc',
                      border: selectedPortal === 'admin' ? '1.5px solid #FFDD00' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 221, 0, 0.18)';
                      e.currentTarget.style.borderColor = '#FFDD00';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = selectedPortal === 'admin' ? 'rgba(255, 221, 0, 0.14)' : '#f8fafc';
                      e.currentTarget.style.borderColor = selectedPortal === 'admin' ? '#FFDD00' : '#e2e8f0';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: '#FFDD00',
                      color: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(255, 221, 0, 0.4)'
                    }}>
                      <ShieldCheck size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Admin Portal</span>

                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.35, display: 'block', marginTop: '3px' }}>
                        System administration, HRMS, billing ledger, reports & executive management.
                      </span>
                    </div>
                  </button>

                  {/* Option 2: Operation Portal */}
                  <button
                    type="button"
                    id="opt-operation-portal"
                    onClick={() => handleSelectPortal('operation')}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px',
                      background: selectedPortal === 'operation' ? 'rgba(255, 221, 0, 0.14)' : '#f8fafc',
                      border: selectedPortal === 'operation' ? '1.5px solid #FFDD00' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 221, 0, 0.18)';
                      e.currentTarget.style.borderColor = '#FFDD00';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = selectedPortal === 'operation' ? 'rgba(255, 221, 0, 0.14)' : '#f8fafc';
                      e.currentTarget.style.borderColor = selectedPortal === 'operation' ? '#FFDD00' : '#e2e8f0';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: '#0f172a',
                      color: '#FFDD00',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.3)'
                    }}>
                      <Building2 size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Operation Portal</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.35, display: 'block', marginTop: '3px' }}>
                        Property operations, bookings, tenant onboarding, maintenance & support tickets.
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </header>

        {/* Hero split-screen section */}
        <section id="portal" className="portal-grid">
          {/* Left Column: Copy & Stats */}
          <div style={{ textAlign: 'left' }}>
            <span style={{
              background: 'rgba(255, 221, 0, 0.12)',
              color: '#8a7200',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'inline-block',
              marginBottom: '20px'
            }}>
              Division of W.R. Carpenter (South Pacific) Group
            </span>
            <h2 className="portal-hero-title">
              Shaping Fiji's Future through <span style={{ borderBottom: '3px solid #FFDD00' }}>Landmark Real Estate</span>
            </h2>
            <p className="portal-hero-desc">
              Carpenters Properties Pte Limited is the premier property developer in Fiji. From state-of-the-art office towers and commercial shopping hubs to luxury foreshore mixed-use complexes, we construct, lease, and manage high-value real estate.
            </p>

            <div className="portal-stats-row">
              <div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>10+</div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Flagship Centers</div>
              </div>
              <div style={{ width: '1px', background: 'rgba(0, 0, 0, 0.1)' }}></div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>2,500+</div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Managed Spaces</div>
              </div>
              <div style={{ width: '1px', background: 'rgba(0, 0, 0, 0.1)' }}></div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>40+ Yrs</div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Fiji Presence</div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Portal Login Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '20px',
            padding: '40px 32px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Top decorative glow */}
            <div style={{ position: 'absolute', top: 0, left: '25%', width: '50%', height: '2px', background: 'linear-gradient(90deg, transparent, #FFDD00, transparent)' }}></div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <svg viewBox="0 0 100 100" style={{ width: 56, height: 56 }}>
                <rect width="100" height="100" fill="#000000" rx="12" />
                <circle cx="50" cy="50" r="36" fill="#FFDD00" />
                <polygon points="50,50 86,14 100,14 100,86 86,86" fill="#000000" />
                <line x1="24" y1="76" x2="50" y2="50" stroke="#000000" strokeWidth="5.5" strokeLinecap="round" />
              </svg>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 6px 0', color: '#0f172a' }}>
              {selectedPortal === 'admin' ? 'PMS Admin Portal' : 'PMS Operation Portal'}
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 18px 0' }}>
              {selectedPortal === 'admin'
                ? ''
                : ''}
            </p>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', color: '#475569', fontSize: '11px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email / Username</label>
                <input
                  type="text"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  disabled={loginLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#b59b00'; e.target.style.boxShadow = '0 0 0 2px rgba(255, 221, 0, 0.25)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#475569', fontSize: '11px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loginLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#b59b00'; e.target.style.boxShadow = '0 0 0 2px rgba(255, 221, 0, 0.25)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {loginError && (
                <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 500, background: 'rgba(239, 68, 68, 0.08)', padding: '10px', borderRadius: '6px', marginTop: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(90deg, #FFDD00, #ffc400)',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: loginLoading ? 'not-allowed' : 'pointer',
                  marginTop: '10px',
                  transition: 'transform 0.1s, opacity 0.2s',
                  boxShadow: '0 4px 12px rgba(255, 221, 0, 0.25)'
                }}
                onMouseEnter={(e) => { if (!loginLoading) e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={(e) => { if (!loginLoading) e.currentTarget.style.opacity = '1'; }}
              >
                {loginLoading ? 'Authenticating...' : `Sign In to ${selectedPortal === 'admin' ? 'Admin Portal' : 'Operation Portal'}`}
              </button>
            </form>
          </div>
        </section>

        {/* Flagship Developments Section */}
        <section id="developments" style={{
          background: 'rgba(255, 255, 255, 0.4)',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          padding: '80px 40px'
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h3 style={{ fontSize: '11px', color: '#9a8100', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 10px 0' }}>Our Portfolio</h3>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#0f172a' }}>Flagship Property Developments</h2>
              <p style={{ color: '#475569', fontSize: '14px', marginTop: '8px' }}>Pioneering premium retail and corporate workspaces across key locations in Fiji.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
              {/* MHCC Card */}
              <div style={{
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                borderRadius: '16px',
                padding: '28px',
                textAlign: 'left',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)',
                transition: 'all 0.3s ease'
              }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'rgba(255, 221, 0, 0.6)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)'; }}>
                <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(255, 221, 0, 0.15)', borderRadius: '12px', color: '#9a8100', marginBottom: '22px' }}>
                  🏢
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 10px 0', color: '#0f172a' }}>MHCC Shopping Centre</h4>
                <p style={{ color: '#475569', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                  Morris Hedstrom City Centre (MHCC) is Suva’s premier retail landmark, housing multiple levels of high-street shopping, restaurants, and entertainment.
                </p>
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: '20px', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                  <span>Location: Suva, Fiji</span>
                  <span>Type: Retail/Mall</span>
                </div>
              </div>

              {/* Carpenters Tower Card */}
              <div style={{
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                borderRadius: '16px',
                padding: '28px',
                textAlign: 'left',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)',
                transition: 'all 0.3s ease'
              }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'rgba(255, 221, 0, 0.6)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)'; }}>
                <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(255, 221, 0, 0.15)', borderRadius: '12px', color: '#9a8100', marginBottom: '22px' }}>
                  🏢
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 10px 0', color: '#0f172a' }}>Carpenters Tower</h4>
                <p style={{ color: '#475569', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                  A state-of-the-art multi-story commercial high-rise building providing premium corporate offices and workspace facilities for industry leaders.
                </p>
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: '20px', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                  <span>Location: Suva, Fiji</span>
                  <span>Type: Commercial</span>
                </div>
              </div>

              {/* Suva Foreshore Development */}
              <div style={{
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                borderRadius: '16px',
                padding: '28px',
                textAlign: 'left',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)',
                transition: 'all 0.3s ease'
              }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'rgba(255, 221, 0, 0.6)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)'; }}>
                <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(255, 221, 0, 0.15)', borderRadius: '12px', color: '#9a8100', marginBottom: '22px' }}>
                  🏖️
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 10px 0', color: '#0f172a' }}>Suva Foreshore Mixed-Use</h4>
                <p style={{ color: '#475569', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                  An ambitious waterfront expansion hosting luxury hospitality assets (Hilton Suva & Garden Inn), high-end marina dining, and luxury residential suites.
                </p>
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: '20px', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                  <span>Location: Waterfront</span>
                  <span>Type: Mixed-Use</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '30px 40px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#64748b'
        }}>
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} Carpenters Properties Pte Limited. All Rights Reserved. A Member of Carpenters Group.</p>
        </footer>
      </div>
    );
  }

  const getCategoryForTab = (tab) => {
    if (['overview', 'dashboard'].includes(tab)) return 'overview';
    if (['properties', 'bookings', 'listings', 'mall-3d'].includes(tab)) return 'operations';
    if (['owners', 'tenants', 'tenant-onboarding'].includes(tab)) return 'people';
    if (['quotation', 'invoices', 'payment-entry'].includes(tab)) return 'sales';
    if (['maintenance', 'support'].includes(tab)) return 'service';
    if (['reports'].includes(tab)) return 'analytics';
    if (['hrms'].includes(tab)) return 'admin';
    return '';
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          {/* SVG logo component recreates the Carpenters Estate logo on fly */}
          <svg viewBox="0 0 100 100" style={{ width: 42, height: 42, minWidth: 42 }}>
            <rect width="100" height="100" fill="#000000" rx="12" />
            <circle cx="50" cy="50" r="36" fill="#FFDD00" />
            <polygon points="50,50 86,14 100,14 100,86 86,86" fill="#000000" />
            <line x1="24" y1="76" x2="50" y2="50" stroke="#000000" strokeWidth="5.5" strokeLinecap="round" />
          </svg>
          <div>
            <h2 className="sidebar-brand-name">Carpenters</h2>
            <span className="sidebar-brand-sub" style={{ textTransform: 'none' }}>Properties Pte Ltd</span>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li className={`menu-item ${currentTab === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentTab('dashboard')}>
            <BarChart2 size={18} />
            <span>Dashboard</span>
          </li>

          <div className={`sidebar-category-header ${getCategoryForTab(currentTab) === 'operations' ? 'active' : ''}`}>
            <span>🏠 Property Operations</span>
          </div>
          <li className={`menu-item ${currentTab === 'properties' ? 'active' : ''}`} onClick={() => setCurrentTab('properties')}>
            <Building size={18} />
            <span>Properties</span>
          </li>
          <li className={`menu-item ${currentTab === 'bookings' ? 'active' : ''}`} onClick={() => { setBookingSearchFromQuotation(''); setCurrentTab('bookings'); }}>
            <Bookmark size={18} />
            <span>Property Bookings</span>
          </li>
          <li className={`menu-item ${currentTab === 'listings' ? 'active' : ''}`} onClick={() => setCurrentTab('listings')}>
            <Globe size={18} />
            <span>Online Listings</span>
          </li>
          <li className={`menu-item ${currentTab === 'mall-3d' ? 'active' : ''}`} onClick={() => setCurrentTab('mall-3d')}>
            <Map size={18} />
            <span>3D Mall Tracker</span>
          </li>

          <div className={`sidebar-category-header ${getCategoryForTab(currentTab) === 'people' ? 'active' : ''}`}>
            <span>👥 PEOPLE</span>
          </div>
          <li className={`menu-item ${currentTab === 'owners' ? 'active' : ''}`} onClick={() => setCurrentTab('owners')}>
            <Award size={18} />
            <span>Contractors</span>
          </li>
          <li className={`menu-item ${currentTab === 'tenants' ? 'active' : ''}`} onClick={() => setCurrentTab('tenants')}>
            <Users size={18} />
            <span>Tenants</span>
          </li>
          <li className={`menu-item ${currentTab === 'tenant-onboarding' ? 'active' : ''}`} onClick={() => setCurrentTab('tenant-onboarding')}>
            <UserCheck size={18} />
            <span>Tenant Onboarding</span>
          </li>

          <div className={`sidebar-category-header ${getCategoryForTab(currentTab) === 'sales' ? 'active' : ''}`}>
            <span>💰 Sales & Finance</span>
          </div>
          <li className={`menu-item ${currentTab === 'quotation' ? 'active' : ''}`} onClick={() => setCurrentTab('quotation')}>
            <FileSignature size={18} />
            <span>Quotations</span>
          </li>
          <li className={`menu-item ${currentTab === 'invoices' ? 'active' : ''}`} onClick={() => setCurrentTab('invoices')}>
            <Receipt size={18} />
            <span>Billing Ledger</span>
          </li>
          <li className={`menu-item ${currentTab === 'payment-entry' ? 'active' : ''}`} onClick={() => setCurrentTab('payment-entry')}>
            <CreditCard size={18} />
            <span>Payment Entry</span>
          </li>

          <div className={`sidebar-category-header ${getCategoryForTab(currentTab) === 'service' ? 'active' : ''}`}>
            <span>🔧 Service Management</span>
          </div>
          <li className={`menu-item ${currentTab === 'maintenance' ? 'active' : ''}`} onClick={() => setCurrentTab('maintenance')}>
            <Hammer size={18} />
            <span>Maintenance</span>
          </li>
          <li className={`menu-item ${currentTab === 'support' ? 'active' : ''}`} onClick={() => setCurrentTab('support')}>
            <HelpCircle size={18} />
            <span>Helpdesk Support</span>
          </li>

          <div className={`sidebar-category-header ${getCategoryForTab(currentTab) === 'analytics' ? 'active' : ''}`}>
            <span>📊 Analytics</span>
          </div>
          <li className={`menu-item ${currentTab === 'reports' ? 'active' : ''}`} onClick={() => setCurrentTab('reports')}>
            <FileText size={18} />
            <span>Reports</span>
          </li>

          <div className={`sidebar-category-header ${getCategoryForTab(currentTab) === 'admin' ? 'active' : ''}`}>
            <span>⚙️ Administration</span>
          </div>
          <li className={`menu-item ${currentTab === 'hrms' ? 'active' : ''}`} onClick={() => setCurrentTab('hrms')}>
            <Briefcase size={18} />
            <span>Human Resource</span>
          </li>
        </ul>

        <div
          className="sidebar-footer"
          style={{
            marginTop: 'auto',
            borderTop: '1px solid var(--border-color)',
            padding: '12px 6px 6px 6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <div
            title={currentUserDetails.email || currentUserDetails.fullName}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1.4,
              width: '100%',
              padding: '0 2px'
            }}
          >
            {currentUserDetails.email || currentUserDetails.fullName}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '11px',
                cursor: 'pointer',
                padding: '2px 4px',
                textDecoration: 'underline',
                borderRadius: '4px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
              title="Log out"
            >
              <LogOut size={12} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="main-content">
        {renderActiveView()}
      </main>
    </div>
  );
}
