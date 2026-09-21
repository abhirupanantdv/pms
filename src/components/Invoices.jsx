import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  DollarSign,
  Printer,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  X,
  FileText,
  CheckCircle2,
  Calculator,
  Landmark,
  Mail,
  Trash2,
  Calendar,
  User,
  Building,
  Layers,
  Check,
  AlertCircle,
  Loader2,
  Search,
  ChevronDown,
  Percent
} from 'lucide-react';
import { getAuthHeaders } from '../config';

const numberToWords = (num, currency = 'FJD') => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return `${currency} Zero Only`;

  const convertLessThanThousand = (n) => {
    if (n < 20) return ones[n];
    const tempTen = Math.floor(n / 10);
    const tempOne = n % 10;
    return tens[tempTen] + (tempOne ? ' ' + ones[tempOne] : '');
  };

  const convert = (n) => {
    if (n >= 1000000) {
      return convert(Math.floor(n / 1000000)) + ' Million' + (n % 1000000 ? ' ' + convert(n % 1000000) : '');
    }
    if (n >= 1000) {
      return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    }
    if (n >= 100) {
      return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convertLessThanThousand(n % 100) : '');
    }
    return convertLessThanThousand(n);
  };

  const integerPart = Math.floor(Math.abs(num));
  const decimalPart = Math.round((Math.abs(num) - integerPart) * 100);
  let words = convert(integerPart);
  if (decimalPart > 0) {
    words += ` and ${convertLessThanThousand(decimalPart)} Cents`;
  }
  return `${currency} ${words} only.`;
};

const renderAddressDisplay = (addrHtml, fallbackStr) => {
  if (addrHtml && typeof addrHtml === 'string') {
    const lines = addrHtml
      .replace(/<br\s*\/?>/gi, '\n')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    if (lines.length > 0) {
      return lines.map((line, idx) => (
        <span key={idx} style={{ display: 'block' }}>{line}</span>
      ));
    }
  }
  return <span style={{ display: 'block' }}>{fallbackStr || 'Suva, Fiji'}</span>;
};

const formatInvoiceDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function Invoices({ invoices, accounts = [], glEntries = [], onAddInvoice, onRecordPayment, erpnextConfig, tenants = [], properties = [], bookings = [] }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGLModal, setShowGLModal] = useState(false); // General Ledger & Trial Balance modal
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showTerms, setShowTerms] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({
    name: 'CARPENTERS PROPERTIES PTE LIMITED',
    address: '40 Robertson Road, Suva, Fiji',
    phone: '+679-2341897',
    email: 'info@carpentersproperties.com',
    website: 'www.carpentersproperties.com',
    currency: 'FJD'
  });
  const [invoiceDetailsExtra, setInvoiceDetailsExtra] = useState(null);
  const [loadingExtra, setLoadingExtra] = useState(false);

  // Dynamic Sales Invoice Form States
  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getDefaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  };

  const [fetchedBookings, setFetchedBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingBookingItems, setLoadingBookingItems] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const customerDropdownRef = useRef(null);

  // Close customer dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target)) {
        setCustomerDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch bookings when modal opens to ensure we have fresh workflow_state data
  useEffect(() => {
    if (!showAddModal || !erpnextConfig?.url) return;
    let isMounted = true;
    const fetchBookingsList = async () => {
      setLoadingBookings(true);
      try {
        const res = await fetch(
          `${erpnextConfig.url}/api/resource/Booking?fields=["name","property","booking_date","booking_amount","workflow_state","starting_date","ending_date","customer","customer_name"]&limit_page_length=500`,
          {
            credentials: 'include',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' })
          }
        );
        if (res.ok && isMounted) {
          const json = await res.json();
          const list = json.data || json || [];
          if (Array.isArray(list)) {
            setFetchedBookings(list);
          }
        }
      } catch (err) {
        console.warn('Could not fetch bookings in Invoices modal:', err);
      } finally {
        if (isMounted) setLoadingBookings(false);
      }
    };
    fetchBookingsList();
    return () => {
      isMounted = false;
    };
  }, [showAddModal, erpnextConfig]);

  const [linkOptionsCache, setLinkOptionsCache] = useState({});
  const [submittingInvoice, setSubmittingInvoice] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [customerAddresses, setCustomerAddresses] = useState([]);
  const [loadingCustomerAddresses, setLoadingCustomerAddresses] = useState(false);
  const [showCreateAddressModal, setShowCreateAddressModal] = useState(false);
  const [creatingAddress, setCreatingAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    address_line1: '',
    address_line2: '',
    city: 'Suva',
    country: 'Fiji',
    pincode: '',
    address_type: 'Billing'
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  const initialFormValues = {
    customer: '',
    customer_name: '',
    customer_address: '',
    booking_id: '',
    start_date: getTodayStr(),
    end_date: getDefaultDueDate(),
    posting_date: getTodayStr(),
    due_date: getDefaultDueDate(),
    company: 'CARPENTERS PROPERTIES PTE LIMITED',
    currency: 'FJD',
    cost_center: 'Main - CFPL',
    debit_to: 'Debtors - CFPL',
    against_income_account: 'Sales - CFPL',
    selling_price_list: 'Standard Selling For Property Management',
    taxes_and_charges: 'Fiji Tax - CFPL',
    additional_discount_percentage: 0,
    discount_amount: 0,
    po_no: '',
    create_manual_invoice: 1
  };

  const [formValues, setFormValues] = useState(initialFormValues);

  const initialTaxes = [
    {
      charge_type: 'On Net Total',
      account_head: 'VAT - CFPL',
      rate: 12.5,
      tax_amount: 0,
      total: 0,
      description: 'VAT - CFPL @ 12.5%'
    }
  ];

  const [taxes, setTaxes] = useState(initialTaxes);

  const initialItems = [];

  const [items, setItems] = useState(initialItems);
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Fetch Company details from ERPNext
  useEffect(() => {
    if (!erpnextConfig || !erpnextConfig.url) return;
    const fetchCompany = async () => {
      try {
        const res = await fetch(`${erpnextConfig.url}/api/resource/Company/CARPENTERS PROPERTIES PTE LIMITED`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (res.ok) {
          const json = await res.json();
          const doc = json.data || json;
          setCompanyDetails(prev => ({
            ...prev,
            name: doc.name || prev.name,
            currency: doc.default_currency || prev.currency,
          }));

          // Try fetching linked Address
          const addrRes = await fetch(`${erpnextConfig.url}/api/resource/Address?filters=[["Dynamic Link", "link_doctype", "=", "Company"], ["Dynamic Link", "link_name", "=", "${doc.name}"]]&fields=["address_line1","address_line2","city","state","country","pincode","phone","email_id"]`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (addrRes.ok) {
            const addrJson = await addrRes.json();
            const addrList = addrJson.data || [];
            if (addrList.length > 0) {
              const addr = addrList[0];
              const addrParts = [addr.address_line1, addr.address_line2, addr.city, addr.state, addr.country, addr.pincode].filter(Boolean);
              setCompanyDetails(prev => ({
                ...prev,
                address: addrParts.join(', ') || prev.address,
                phone: addr.phone || prev.phone,
                email: addr.email_id || prev.email
              }));
            }
          }
        }
      } catch (err) {
        console.warn('Failed fetching company details:', err);
      }
    };
    fetchCompany();
  }, [erpnextConfig]);

  // Fetch Sales Invoice detail & Unit details & Customer details dynamically
  useEffect(() => {
    const targetInvoice = activeReceipt || selectedInvoice;
    if (!targetInvoice || !erpnextConfig || !erpnextConfig.url) {
      setInvoiceDetailsExtra(null);
      return;
    }

    let isMounted = true;
    const fetchExtra = async () => {
      setLoadingExtra(true);
      try {
        const res = await fetch(`${erpnextConfig.url}/api/resource/Sales%20Invoice/${encodeURIComponent(targetInvoice.id)}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (res.ok && isMounted) {
          const json = await res.json();
          const doc = json.data || json;
          const itemCode = (doc.items && doc.items.length > 0) ? doc.items[0].item_code : null;

          let unitAddressStr = '40 Robertson Road, Suva, Fiji';
          let unitNameStr = targetInvoice.propertyId || 'Unit-N/A';
          let customerAddressStr = '';

          // 1. Process Customer address from doc.address_display or fallback
          if (doc.address_display) {
            customerAddressStr = doc.address_display
              .replace(/<br\s*\/?>/gi, '\n')
              .split('\n')
              .map(s => s.trim())
              .filter(Boolean)
              .join(', ');
          }

          const customerId = doc.customer || targetInvoice.tenantName;
          if (!customerAddressStr && customerId) {
            try {
              const custRes = await fetch(`${erpnextConfig.url}/api/resource/Address?filters=[["Dynamic Link", "link_doctype", "=", "Customer"], ["Dynamic Link", "link_name", "=", "${encodeURIComponent(customerId)}"]]&fields=["address_line1","address_line2","city","state","country","pincode"]`, {
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              if (custRes.ok) {
                const custData = await custRes.json();
                const custAddrs = custData.data || [];
                if (custAddrs.length > 0) {
                  const addr = custAddrs[0];
                  customerAddressStr = [addr.address_line1, addr.address_line2, addr.city, addr.state, addr.country, addr.pincode].filter(Boolean).join(', ');
                }
              }
            } catch (err) {
              console.warn('Failed fetching customer address:', err);
            }
          }

          // 2. Fetch Unit details from unit doctype
          if (itemCode) {
            try {
              const uRes = await fetch(`${erpnextConfig.url}/api/method/erpnext.api.get_unit?item_code=${encodeURIComponent(itemCode)}`, {
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              if (uRes.ok) {
                const uData = await uRes.json();
                const uDoc = uData.message || uData;
                unitNameStr = uDoc.item_name || itemCode;
                const addrParts = [uDoc.custom_locality, uDoc.custom_district, uDoc.custom_country].filter(Boolean);
                unitAddressStr = addrParts.join(', ') || unitAddressStr;
              }
            } catch (err) {
              console.warn('Failed fetching unit spec address:', err);
            }
          }

          if (isMounted) {
            setInvoiceDetailsExtra({
              rawDoc: doc,
              unitName: unitNameStr,
              unitAddress: unitAddressStr,
              customerAddress: customerAddressStr || 'Suva, Fiji',
              currency: doc.currency || 'FJD',
              billingItems: doc.items || [],
              taxes: doc.taxes || []
            });
          }
        }
      } catch (err) {
        console.warn('Failed fetching invoice extra details:', err);
      } finally {
        if (isMounted) setLoadingExtra(false);
      }
    };
    fetchExtra();
    return () => {
      isMounted = false;
    };
  }, [selectedInvoice?.id, activeReceipt?.id, erpnextConfig]);

  // Sort invoices so that latest created invoice is ALWAYS on top (descending by creation / id)
  const sortedInvoices = useMemo(() => {
    if (!invoices || !Array.isArray(invoices)) return [];
    return [...invoices].sort((a, b) => {
      // 1. Sort by creation timestamp descending if present
      const parseTime = (inv) => {
        if (inv.creation) {
          const t = new Date(String(inv.creation).replace(' ', 'T')).getTime();
          if (!isNaN(t) && t > 0) return t;
        }
        if (inv.issuedDate) {
          const t = new Date(String(inv.issuedDate).replace(' ', 'T')).getTime();
          if (!isNaN(t) && t > 0) return t;
        }
        return 0;
      };
      const timeA = parseTime(a);
      const timeB = parseTime(b);
      if (timeB !== timeA) return timeB - timeA;

      // 2. Fall back to natural numeric sort on ID / name descending (e.g. ACC-SINV-2026-00105 > ACC-SINV-2026-00104)
      const idA = String(a.id || a.name || '');
      const idB = String(b.id || b.name || '');
      return idB.localeCompare(idA, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [invoices]);

  // Keep first/latest invoice selected when list loads or changes
  useEffect(() => {
    if (sortedInvoices.length > 0) {
      if (!selectedInvoice || !sortedInvoices.some(inv => inv.id === selectedInvoice.id)) {
        setSelectedInvoice(sortedInvoices[0]);
      }
    }
  }, [sortedInvoices]);

  // Pagination states & calculations
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = selectedInvoice ? 6 : 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [sortedInvoices.length]);

  const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedInvoices.slice(indexOfFirstItem, indexOfLastItem);

  const renderPaginationControls = () => {
    if (totalPages <= 1) return null;
    return (
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
    );
  };

  // Dynamic Link Options fetching from ERPNext
  const fetchLinkOptions = async (doctype) => {
    if (!doctype || !erpnextConfig?.url) return [];
    if (linkOptionsCache[doctype]) return linkOptionsCache[doctype];
    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/${encodeURIComponent(doctype)}?fields=["name"]&limit_page_length=500`, {
        credentials: 'include',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' })
      });
      if (res.ok) {
        const json = await res.json();
        const list = json.data || json || [];
        if (Array.isArray(list)) {
          const names = list.map(it => it.name).filter(Boolean);
          setLinkOptionsCache(prev => ({
            ...prev,
            [doctype]: names
          }));
          return names;
        }
      }
    } catch (err) {
      console.warn(`Could not fetch link options for ${doctype}:`, err);
    }
    return [];
  };

  // Fetch ERPNext Address documents linked to this customer via Dynamic Link
  const fetchCustomerAddresses = async (customerId) => {
    if (!customerId || !erpnextConfig?.url) {
      setCustomerAddresses([]);
      setFormValues(prev => ({ ...prev, customer_address: '' }));
      return [];
    }

    setLoadingCustomerAddresses(true);
    try {
      const filters = JSON.stringify([
        ['Dynamic Link', 'link_doctype', '=', 'Customer'],
        ['Dynamic Link', 'link_name', '=', customerId]
      ]);
      const fields = JSON.stringify([
        'name', 'address_title', 'address_type', 'address_line1', 'address_line2',
        'city', 'state', 'country', 'pincode', 'is_primary_address', 'is_shipping_address'
      ]);
      const res = await fetch(`${erpnextConfig.url}/api/resource/Address?filters=${encodeURIComponent(filters)}&fields=${encodeURIComponent(fields)}&limit_page_length=50`, {
        credentials: 'include',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' })
      });
      if (res.ok) {
        const json = await res.json();
        const addrs = json.data || [];
        setCustomerAddresses(addrs);
        if (addrs.length > 0) {
          const preferred = addrs.find(a => a.is_primary_address && a.address_type === 'Billing')
            || addrs.find(a => a.is_primary_address)
            || addrs.find(a => a.address_type === 'Billing')
            || addrs[0];
          setFormValues(prev => ({ ...prev, customer_address: preferred.name }));
        } else {
          setFormValues(prev => ({ ...prev, customer_address: '' }));
        }
        return addrs;
      } else {
        setCustomerAddresses([]);
        setFormValues(prev => ({ ...prev, customer_address: '' }));
      }
    } catch (err) {
      console.warn('Failed fetching customer addresses:', err);
      setCustomerAddresses([]);
      setFormValues(prev => ({ ...prev, customer_address: '' }));
    } finally {
      setLoadingCustomerAddresses(false);
    }
    return [];
  };

  // Quick-create an Address in ERPNext linked to the selected Customer
  const handleCreateCustomerAddress = async (e) => {
    if (e) e.preventDefault();
    if (!formValues.customer) {
      alert('Please select a customer first.');
      return;
    }
    if (!newAddressForm.address_line1.trim()) {
      alert('Please enter Address Line 1.');
      return;
    }

    setCreatingAddress(true);
    try {
      const payload = {
        doctype: 'Address',
        address_title: formValues.customer_name || formValues.customer,
        address_type: newAddressForm.address_type || 'Billing',
        address_line1: newAddressForm.address_line1.trim(),
        address_line2: newAddressForm.address_line2.trim() || undefined,
        city: newAddressForm.city.trim() || 'Suva',
        country: newAddressForm.country.trim() || 'Fiji',
        pincode: newAddressForm.pincode.trim() || undefined,
        is_primary_address: 1,
        links: [
          {
            doctype: 'Dynamic Link',
            link_doctype: 'Customer',
            link_name: formValues.customer
          }
        ]
      };

      const res = await fetch(`${erpnextConfig.url}/api/resource/Address`, {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const json = await res.json();
        const createdAddr = json.data || json;
        const newAddrName = createdAddr.name;
        showToast(`Address ${newAddrName} created and linked successfully!`, 'success');
        setShowCreateAddressModal(false);
        setNewAddressForm({
          address_line1: '',
          address_line2: '',
          city: 'Suva',
          country: 'Fiji',
          pincode: '',
          address_type: 'Billing'
        });
        await fetchCustomerAddresses(formValues.customer);
        setFormValues(prev => ({ ...prev, customer_address: newAddrName }));
      } else {
        let errMsg = `Failed to create address (HTTP ${res.status})`;
        try {
          const errJson = await res.json();
          if (errJson._server_messages) {
            const msgs = JSON.parse(errJson._server_messages);
            errMsg = msgs.map(m => {
              try { return JSON.parse(m).message; } catch { return m; }
            }).join('; ');
          } else if (errJson.exception || errJson.message) {
            errMsg = errJson.exception || errJson.message;
          }
        } catch { }
        showToast(`Could not create address: ${errMsg}`, 'error');
      }
    } catch (err) {
      console.error('Error creating address:', err);
      showToast(`Error creating address: ${err.message}`, 'error');
    } finally {
      setCreatingAddress(false);
    }
  };

  useEffect(() => {
    if (showAddModal) {
      fetchLinkOptions('Customer');
      fetchLinkOptions('Booking');
      fetchLinkOptions('Item');
      fetchLinkOptions('Company');
      fetchLinkOptions('Cost Center');
      fetchLinkOptions('Account');
      fetchLinkOptions('Price List');
      fetchLinkOptions('Sales Taxes and Charges Template').then((templates) => {
        if (Array.isArray(templates) && templates.length > 0) {
          setFormValues(prev => {
            if (!prev.taxes_and_charges || prev.taxes_and_charges === 'Fiji Tax' || !templates.includes(prev.taxes_and_charges)) {
              const preferred = templates.find(t => t.includes('CFPL') && t.toLowerCase().includes('fiji'))
                || templates.find(t => t.toLowerCase().includes('fiji'))
                || templates.find(t => t.includes('CFPL'))
                || templates[0];
              if (preferred) {
                handleTaxTemplateChange(preferred);
                return { ...prev, taxes_and_charges: preferred };
              }
            }
            return prev;
          });
        }
      });
      if (formValues.customer) {
        fetchCustomerAddresses(formValues.customer);
      }
    }
  }, [showAddModal]);

  // Merge bookings from props & fetched from ERPNext
  const mergedBookings = useMemo(() => {
    const map = new Map();
    [...(bookings || []), ...(fetchedBookings || [])].forEach(b => {
      const id = b.name || b.id;
      if (id && !map.has(id)) {
        map.set(id, b);
      }
    });
    return Array.from(map.values());
  }, [bookings, fetchedBookings]);

  // Strictly filter to bookings whose workflow_state is "Approved"
  const approvedBookings = useMemo(() => {
    return mergedBookings.filter(b => {
      const state = String(b.workflow_state || '').trim().toLowerCase();
      return state === 'approved';
    });
  }, [mergedBookings]);

  // Aggregate by customer: ONLY customers who have at least one Approved booking
  const approvedCustomers = useMemo(() => {
    const custMap = new Map();
    approvedBookings.forEach(b => {
      const custId = b.customer || b.customer_name || b.tenantName;
      if (!custId) return;
      if (!custMap.has(custId)) {
        custMap.set(custId, {
          customerId: custId,
          customerName: b.customer_name || custId,
          bookings: [b]
        });
      } else {
        custMap.get(custId).bookings.push(b);
      }
    });
    return Array.from(custMap.values());
  }, [approvedBookings]);

  // Filter approved customers by live search query
  const filteredApprovedCustomers = useMemo(() => {
    if (!customerSearchQuery.trim()) return approvedCustomers;
    const q = customerSearchQuery.toLowerCase().trim();
    return approvedCustomers.filter(c => {
      const nameMatch = (c.customerName || '').toLowerCase().includes(q);
      const idMatch = (c.customerId || '').toLowerCase().includes(q);
      const bookingMatch = c.bookings.some(b =>
        (b.name || '').toLowerCase().includes(q) ||
        (b.property || '').toLowerCase().includes(q)
      );
      return nameMatch || idMatch || bookingMatch;
    });
  }, [approvedCustomers, customerSearchQuery]);

  // Handle selecting an approved customer from the searchable dropdown
  const handleSelectApprovedCustomer = (custObj, specificBooking = null) => {
    const selectedBooking = specificBooking || custObj.bookings[0] || {};
    const bookingId = selectedBooking.name || selectedBooking.id || '';

    setFormValues(prev => ({
      ...prev,
      customer: custObj.customerId,
      customer_name: custObj.customerName || custObj.customerId,
      customer_address: '',
      booking_id: bookingId
    }));

    fetchCustomerAddresses(custObj.customerId);

    if (bookingId) {
      handleBookingSelect(bookingId, custObj.customerId);
    } else {
      setItems([]);
    }

    setCustomerDropdownOpen(false);
    setCustomerSearchQuery('');
  };

  // Handle smart selection of Booking ID using ERPNext Booking child table logic
  const handleBookingSelect = async (bookingId, passedCustomerId = null) => {
    if (!bookingId) {
      setFormValues(prev => ({ ...prev, booking_id: '' }));
      setItems([]);
      return;
    }

    setFormValues(prev => ({ ...prev, booking_id: bookingId }));

    const matchedBooking = mergedBookings.find(b => b.name === bookingId || b.id === bookingId);
    let resolvedCust = passedCustomerId || '';
    if (matchedBooking) {
      const custVal = matchedBooking.customer || matchedBooking.tenantName || '';
      resolvedCust = resolvedCust || custVal;
      const custName = matchedBooking.customer_name || custVal;
      const bStart = matchedBooking.starting_date || matchedBooking.start_date || '';
      const bEnd = matchedBooking.ending_date || matchedBooking.end_date || '';
      setFormValues(prev => ({
        ...prev,
        customer: custVal || prev.customer,
        customer_name: custName || prev.customer_name,
        customer_address: '',
        ...(bStart ? { start_date: bStart } : {}),
        ...(bEnd ? { end_date: bEnd } : {})
      }));
      if (custVal && !passedCustomerId) {
        fetchCustomerAddresses(custVal);
      }
    }

    setLoadingBookingItems(true);
    try {
      let response = null;
      if (erpnextConfig?.url) {
        const res = await fetch(`${erpnextConfig.url}/api/resource/Booking/${encodeURIComponent(bookingId)}`, {
          credentials: 'include',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' })
        });
        if (res.ok) {
          const json = await res.json();
          response = json.data || json;
        }
      }

      if (!response && matchedBooking) {
        response = matchedBooking;
      }

      if (!response) {
        showToast('Booking not found.', 'error');
        return;
      }

      console.log('Booking Data:', response);

      const bStartRes = response.starting_date || response.start_date || '';
      const bEndRes = response.ending_date || response.end_date || '';
      if (response.customer || bStartRes || bEndRes) {
        setFormValues(prev => ({
          ...prev,
          ...(response.customer ? {
            customer: response.customer,
            customer_name: response.customer_name || response.customer || prev.customer_name
          } : {}),
          ...(bStartRes ? { start_date: bStartRes } : {}),
          ...(bEndRes ? { end_date: bEndRes } : {})
        }));
        if (response.customer && response.customer !== resolvedCust) {
          fetchCustomerAddresses(response.customer);
        }
      }

      const bookingItems = response.booking_item || response.items || [];

      if (!bookingItems.length) {
        showToast(`No Booking Items found in Booking ${bookingId}`, 'info');
        setItems([]);
        return;
      }

      // Clear existing Sales Invoice Items and add child rows
      const newItems = bookingItems.map(item => {
        // Booking uses quantity, Sales Invoice Item uses qty
        const qty = Number(item.quantity || item.qty) || 1;
        const rate = Number(item.rate) || 0;
        const priceListRate = Number(item.price_list_rate || item.rate) || 0;
        const discountPercentage = Number(item.discount_percentage) || 0;
        const discountAmount = Number(item.discount_amount) || 0;
        const customArea = Number(item.area || item.custom_area) || 0;
        const customPropertyGroup = item.property_group || item.custom_property_group || '';
        const amount = qty * rate;

        return {
          item_code: item.item_code || '',
          item_name: item.item_name || item.item_code || '',
          description: item.description || item.item_name || item.item_code || (item.item_code ? `Rent for ${item.item_code}` : ''),
          qty: qty,
          uom: item.uom || 'Sq Ft',
          stock_uom: item.uom || 'Sq Ft',
          rate: rate,
          price_list_rate: priceListRate,
          discount_percentage: discountPercentage,
          discount_amount: discountAmount,
          custom_area: customArea,
          custom_property_group: customPropertyGroup,
          amount: amount,
          income_account: formValues.against_income_account || 'Sales - CFPL',
          cost_center: formValues.cost_center || 'Main - CFPL',
          expense_account: 'Cost of Goods Sold - CFPL'
        };
      });

      setItems(newItems);
      console.log('Booking Items added to Sales Invoice:', bookingItems);
    } catch (error) {
      console.error('Error fetching Booking Items:', error);
      showToast(`Unable to fetch Booking Items from Booking ${bookingId}`, 'error');
    } finally {
      setLoadingBookingItems(false);
    }
  };

  // Handle Customer Selection fallback
  const handleCustomerSelect = (custVal) => {
    const matchedTenant = tenants.find(t => t.name === custVal || t.tenantName === custVal || t.id === custVal);
    const custName = matchedTenant?.tenantName || matchedTenant?.name || custVal;
    setFormValues(prev => ({
      ...prev,
      customer: custVal,
      customer_name: custName,
      customer_address: ''
    }));
    if (custVal) {
      fetchCustomerAddresses(custVal);
    }
  };

  // Handle tax template selection with automatic ERPNext taxes population
  const handleTaxTemplateChange = async (templateName) => {
    let resolvedName = templateName;
    if (resolvedName === 'Fiji Tax') {
      resolvedName = 'Fiji Tax - CFPL';
    }
    setFormValues(prev => ({ ...prev, taxes_and_charges: resolvedName }));
    if (!resolvedName) return;

    if (erpnextConfig?.url) {
      try {
        const res = await fetch(`${erpnextConfig.url}/api/resource/Sales%20Taxes%20and%20Charges%20Template/${encodeURIComponent(resolvedName)}`, {
          credentials: 'include',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' })
        });
        if (res.ok) {
          const json = await res.json();
          const doc = json.data || json;
          if (doc.taxes && Array.isArray(doc.taxes) && doc.taxes.length > 0) {
            setTaxes(doc.taxes.map(t => ({
              charge_type: t.charge_type || 'On Net Total',
              account_head: t.account_head || 'VAT - CFPL',
              rate: Number(t.rate) || 0,
              tax_amount: Number(t.tax_amount) || 0,
              total: 0,
              description: t.description || t.account_head || ''
            })));
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch tax template details:', err);
      }
    }

    if (resolvedName.toLowerCase().includes('fiji')) {
      setTaxes([
        {
          charge_type: 'On Net Total',
          account_head: 'VAT - CFPL',
          rate: 12.5,
          tax_amount: 0,
          total: 0,
          description: 'VAT - CFPL @ 12.5%'
        }
      ]);
    }
  };

  const handleAddTaxRow = () => {
    setTaxes(prev => [
      ...prev,
      {
        charge_type: 'On Net Total',
        account_head: 'VAT - CFPL',
        rate: 12.5,
        tax_amount: 0,
        total: 0,
        description: 'VAT - CFPL'
      }
    ]);
  };

  const handleRemoveTaxRow = (index) => {
    setTaxes(prev => prev.filter((_, i) => i !== index));
  };

  const handleTaxChange = (index, field, value) => {
    setTaxes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Calculate live financial totals according to ERPNext tax rules
  const calculateTotals = () => {
    const subtotal = items.reduce((acc, row) => acc + (Number(row.amount) || 0), 0);
    const discPercent = Math.min(100, Math.max(0, Number(formValues.additional_discount_percentage) || 0));
    const discAmountInput = Math.max(0, Number(formValues.discount_amount) || 0);
    const discountFromPercent = (subtotal * discPercent) / 100;
    const totalDiscount = discountFromPercent + discAmountInput;
    const netTotal = Math.max(0, subtotal - totalDiscount);

    let runningTotal = netTotal;
    let totalTaxesAndCharges = 0;

    const computedTaxes = taxes.map((tax, idx) => {
      const chargeType = tax.charge_type || 'On Net Total';
      const rate = Number(tax.rate) || 0;
      let taxAmount = 0;

      if (chargeType === 'On Net Total') {
        taxAmount = (netTotal * rate) / 100;
      } else if (chargeType === 'Actual') {
        taxAmount = Number(tax.tax_amount) || 0;
      } else if (chargeType === 'On Previous Row Amount') {
        const prevAmount = idx > 0 ? (Number(taxes[idx - 1]?.tax_amount) || 0) : 0;
        taxAmount = (prevAmount * rate) / 100;
      } else if (chargeType === 'On Previous Row Total') {
        taxAmount = (runningTotal * rate) / 100;
      } else {
        taxAmount = (netTotal * rate) / 100;
      }

      runningTotal += taxAmount;
      totalTaxesAndCharges += taxAmount;

      return {
        ...tax,
        rate,
        tax_amount: taxAmount,
        total: runningTotal
      };
    });

    const grandTotal = netTotal + totalTaxesAndCharges;

    return {
      subtotal,
      totalDiscount,
      netTotal,
      computedTaxes,
      totalTaxesAndCharges,
      grandTotal
    };
  };

  // Item row handlers
  const handleItemChange = (index, field, value) => {
    setItems(prev => {
      const updated = [...prev];
      const row = { ...updated[index], [field]: value };
      if (field === 'qty' || field === 'rate') {
        const q = field === 'qty' ? (value === '' ? '' : Number(value)) : (row.qty === '' ? 1 : Number(row.qty));
        const r = field === 'rate' ? (value === '' ? '' : Number(value)) : (row.rate === '' ? 0 : Number(row.rate));
        row.amount = (Number(q) || 0) * (Number(r) || 0);
      }
      if (field === 'item_code') {
        row.item_name = value;
        if (!row.description || row.description === 'Gb009') {
          row.description = `${value} - Rent Space`;
        }
      }
      updated[index] = row;
      return updated;
    });
  };

  const handleAddItemRow = () => {
    setItems(prev => [
      ...prev,
      {
        item_code: '',
        item_name: '',
        description: '',
        qty: 1,
        rate: 0,
        amount: 0,
        stock_uom: 'Sq Ft',
        uom: 'Sq Ft',
        income_account: formValues.against_income_account || 'Sales - CFPL',
        expense_account: 'Cost of Goods Sold - CFPL',
        cost_center: formValues.cost_center || 'Main - CFPL'
      }
    ]);
  };

  const handleRemoveItemRow = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Submit Dynamic Sales Invoice to ERPNext
  const handleSubmitInvoice = async (e) => {
    e.preventDefault();
    if (!formValues.customer) {
      alert('Please enter or select a Customer / Tenant.');
      return;
    }
    if (items.length === 0 || !items.some(it => it.item_code)) {
      alert('Please select an Approved Booking ID to load unit items.');
      return;
    }

    setSubmittingInvoice(true);
    const { subtotal, netTotal, computedTaxes, totalTaxesAndCharges, grandTotal } = calculateTotals();

    // Resolve valid taxes_and_charges link
    let resolvedTaxTemplate = formValues.taxes_and_charges ? formValues.taxes_and_charges.trim() : undefined;
    if (resolvedTaxTemplate === 'Fiji Tax') {
      resolvedTaxTemplate = 'Fiji Tax - CFPL';
    }

    // Resolve valid customer_address link (must be undefined if empty string to avoid link validation failure)
    const resolvedCustomerAddress = formValues.customer_address && formValues.customer_address.trim()
      ? formValues.customer_address.trim()
      : undefined;

    const payload = {
      doctype: 'Sales Invoice',
      customer: formValues.customer,
      customer_name: formValues.customer_name || formValues.customer,
      customer_address: resolvedCustomerAddress,
      company: 'CARPENTERS PROPERTIES PTE LIMITED',
      booking_id: formValues.booking_id || undefined,
      start_date: formValues.start_date || undefined,
      end_date: formValues.end_date || undefined,
      create_manual_invoice: 1,
      posting_date: formValues.posting_date || getTodayStr(),
      due_date: formValues.due_date || getTodayStr(),
      currency: 'FJD',
      cost_center: 'Main - CFPL',
      debit_to: 'Debtors - CFPL',
      against_income_account: 'Sales - CFPL',
      selling_price_list: 'Standard Selling For Property Management',
      taxes_and_charges: resolvedTaxTemplate,
      taxes: computedTaxes.map((tax, idx) => ({
        doctype: 'Sales Taxes and Charges',
        idx: idx + 1,
        charge_type: tax.charge_type || 'On Net Total',
        account_head: tax.account_head || 'VAT - CFPL',
        description: tax.description || `${tax.account_head || 'VAT'} @ ${tax.rate}%`,
        rate: Number(tax.rate) || 0,
        tax_amount: Number(tax.tax_amount) || 0,
        tax_amount_after_discount_amount: Number(tax.tax_amount) || 0,
        total: Number(tax.total) || 0,
        cost_center: 'Main - CFPL'
      })),
      total_taxes_and_charges: totalTaxesAndCharges,
      additional_discount_percentage: Number(formValues.additional_discount_percentage) || 0,
      discount_amount: Number(formValues.discount_amount) || 0,
      po_no: formValues.po_no || undefined,
      items: items.map((it, idx) => ({
        doctype: 'Sales Invoice Item',
        idx: idx + 1,
        item_code: it.item_code || '',
        item_name: it.item_name || it.item_code || '',
        description: it.description || it.item_name || it.item_code || 'Rent Item',
        qty: Number(it.qty) || 1,
        rate: Number(it.rate) || 0,
        amount: (Number(it.qty) || 1) * (Number(it.rate) || 0),
        price_list_rate: Number(it.price_list_rate || it.rate) || 0,
        discount_percentage: Number(it.discount_percentage) || 0,
        discount_amount: Number(it.discount_amount) || 0,
        custom_area: it.custom_area ? Number(it.custom_area) : undefined,
        custom_property_group: it.custom_property_group || undefined,
        stock_uom: it.stock_uom || it.uom || 'Sq Ft',
        uom: it.uom || 'Sq Ft',
        income_account: it.income_account || 'Sales - CFPL',
        cost_center: it.cost_center || 'Main - CFPL',
        expense_account: 'Cost of Goods Sold - CFPL'
      })),
      net_total: netTotal,
      total: subtotal,
      grand_total: grandTotal,
      rounded_total: Math.round(grandTotal),
      outstanding_amount: grandTotal,
      status: 'Draft',
      docstatus: 0
    };

    let createdDoc = null;
    let fallbackId = `ACC-SINV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    if (erpnextConfig?.url) {
      try {
        const res = await fetch(`${erpnextConfig.url}/api/resource/Sales%20Invoice`, {
          method: 'POST',
          credentials: 'include',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const json = await res.json();
          createdDoc = json.data || json;
        } else {
          let errorMsg = `HTTP ${res.status}`;
          try {
            const errJson = await res.json();
            if (errJson._server_messages) {
              const msgs = JSON.parse(errJson._server_messages);
              errorMsg = msgs.map(m => {
                try { return JSON.parse(m).message; } catch { return m; }
              }).join('; ');
            } else if (errJson.exception || errJson.message) {
              errorMsg = errJson.exception || errJson.message;
            }
          } catch { }
          console.error('ERPNext Sales Invoice POST error:', errorMsg);
          showToast(`ERPNext Error: ${errorMsg}`, 'error');
          setSubmittingInvoice(false);
          return;
        }
      } catch (err) {
        console.warn('Network error posting Sales Invoice:', err);
        showToast(`Network Error: ${err.message}`, 'error');
        setSubmittingInvoice(false);
        return;
      }
    }

    const finalName = createdDoc?.name || fallbackId;
    const newInv = {
      id: finalName,
      name: finalName,
      tenantName: formValues.customer_name || formValues.customer,
      customer: formValues.customer,
      propertyId: formValues.booking_id || (items[0]?.item_code) || 'Unit-N/A',
      booking_id: formValues.booking_id,
      amount: grandTotal,
      outstandingAmount: grandTotal,
      issuedDate: formValues.posting_date,
      dueDate: formValues.due_date,
      startDate: formValues.start_date,
      endDate: formValues.end_date,
      create_manual_invoice: 1,
      status: 'pending',
      creation: createdDoc?.creation || new Date().toISOString(),
      rawDoc: createdDoc
    };

    onAddInvoice(newInv);
    setSelectedInvoice(newInv);
    setCurrentPage(1);
    setShowAddModal(false);
    setFormValues(initialFormValues);
    setTaxes(initialTaxes);
    setItems([]);
    setSubmittingInvoice(false);
    showToast(`Sales Invoice ${finalName} successfully created!`, 'success');
  };

  const handlePrint = (invoice) => {
    const target = invoice || selectedInvoice;
    const invId = target?.id || target?.name;

    if (!invId) {
      showToast('No invoice selected to print', 'error');
      return;
    }

    if (erpnextConfig?.url) {
      // Open ERPNext Sales Invoice DocType print format
      const printUrl = `${erpnextConfig.url}/printview?doctype=Sales%20Invoice&name=${encodeURIComponent(invId)}&format=Sales%20Invoice&no_letterhead=1&letterhead=No%20Letterhead&settings=%7B%7D&_lang=en`;
      const printWindow = window.open(printUrl, '_blank');

      if (printWindow) {
        const injectAndPrint = () => {
          try {
            const doc = printWindow.document;
            if (doc) {
              doc.title = `Sales_Invoice_${invId}`;
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
                    .action-banner, .action-bar, header, footer { display: none !important; }
                  }
                `;
                doc.head.appendChild(style);
                setTimeout(() => {
                  try {
                    printWindow.print();
                  } catch (e) { }
                }, 500);
              }
            }
          } catch (e) {
            // Handled cross-origin
          }
        };

        if (printWindow.addEventListener) {
          printWindow.addEventListener('load', injectAndPrint, true);
        }
        setTimeout(injectAndPrint, 1200);
      }
    } else {
      setActiveReceipt(target);
    }
  };

  // GL and Trial Balance Calculation from existing invoices
  const totalInvoicesValue = invoices.reduce((acc, i) => acc + i.amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);
  const totalPending = invoices.reduce((acc, i) => acc + (i.outstandingAmount !== undefined ? i.outstandingAmount : (i.status === 'pending' ? i.amount : 0)), 0);

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">Billing Ledger & Invoicing</h1>
          <p className="view-subtitle">Generate rent invoices and record payments.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => setShowGLModal(true)}>
            <Calculator size={16} /> GL & TB Ledger View
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setFormValues(initialFormValues);
              setItems([]);
              setCustomerDropdownOpen(false);
              setCustomerSearchQuery('');
              setShowAddModal(true);
            }}
          >
            <Plus size={16} /> Generate Invoice
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span>Outstanding Receivables</span>
            <ArrowDownRight size={18} className="indicator-down" />
          </div>
          <div className="stat-value">${totalPending.toLocaleString()}</div>
          <div className="stat-indicator indicator-down">{invoices.filter(i => i.status === 'pending').length} Unpaid Invoices</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span>Total Collected (MDT)</span>
            <ArrowUpRight size={18} className="indicator-up" />
          </div>
          <div className="stat-value">${totalPaid.toLocaleString()}</div>
          <div className="stat-indicator indicator-up">+12% vs last month</div>
        </div>
      </div>

      {/* Split Details Layout */}
      <div className="grid-2col" style={{ gridTemplateColumns: selectedInvoice ? '55% calc(45% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>

        {/* Invoices List */}
        <div className="card-panel" style={{
          padding: 0,
          overflow: 'hidden',
          filter: 'none',
          transition: 'filter 0.3s ease'
        }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Tenant</th>
                  <th>Unit Name</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(inv => {
                  const s = String(inv.status || '').toLowerCase();
                  const badgeColor = s === 'paid' ? { bg: '#d1fae5', color: '#065f46', text: 'PAID' }
                    : s === 'draft' ? { bg: '#e0f2fe', color: '#0369a1', text: 'DRAFT' }
                      : (s === 'overdue' || s === 'cancelled') ? { bg: '#fee2e2', color: '#991b1b', text: s.toUpperCase() }
                        : { bg: '#fef3c7', color: '#92400e', text: 'PENDING' };

                  return (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvoice(inv)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedInvoice?.id === inv.id ? 'var(--bg-accent-alpha)' : '',
                        borderLeft: selectedInvoice?.id === inv.id ? '3px solid var(--brand-color)' : ''
                      }}
                    >
                      <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{inv.id}</td>
                      <td style={{ fontWeight: 600 }}>{inv.tenantName}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {selectedInvoice?.id === inv.id && invoiceDetailsExtra?.unitName
                          ? invoiceDetailsExtra.unitName
                          : (inv.propertyId || 'Unit-N/A')}
                      </td>
                      <td style={{ fontWeight: 600 }}>${Number(inv.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 10,
                          fontSize: 9,
                          fontWeight: 700,
                          backgroundColor: badgeColor.bg,
                          color: badgeColor.color
                        }}>
                          {badgeColor.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {renderPaginationControls()}
        </div>

        {/* Selected Invoice PRINT FORMAT Panel (at right side) */}
        {selectedInvoice && (() => {
          const doc = (invoiceDetailsExtra?.rawDoc?.name === selectedInvoice.id)
            ? invoiceDetailsExtra.rawDoc
            : (selectedInvoice?.rawDoc || null);

          const activeCurrency = doc?.currency || invoiceDetailsExtra?.currency || companyDetails.currency || 'FJD';

          const itemsList = (doc?.items && doc.items.length > 0)
            ? doc.items
            : (invoiceDetailsExtra?.billingItems && invoiceDetailsExtra.billingItems.length > 0)
              ? invoiceDetailsExtra.billingItems
              : [
                {
                  item_code: selectedInvoice.propertyId || 'Rent',
                  item_name: 'Property Rent / Lease Space',
                  qty: 1,
                  rate: selectedInvoice.amount,
                  amount: selectedInvoice.amount
                }
              ];

          const taxesList = (doc?.taxes && doc.taxes.length > 0)
            ? doc.taxes
            : (invoiceDetailsExtra?.taxes && invoiceDetailsExtra.taxes.length > 0)
              ? invoiceDetailsExtra.taxes
              : [];

          const netTotal = doc?.net_total ?? doc?.total ?? selectedInvoice.amount;
          const totalTaxes = doc?.total_taxes_and_charges ?? (taxesList.reduce((sum, t) => sum + (Number(t.tax_amount) || 0), 0));
          const roundingAdjustment = doc?.rounding_adjustment != null ? Number(doc.rounding_adjustment) : 0;
          const grandTotal = doc?.rounded_total ?? doc?.grand_total ?? (Number(netTotal) + Number(totalTaxes) + roundingAdjustment);
          const outstandingAmount = doc?.outstanding_amount !== undefined ? Number(doc.outstanding_amount) : (selectedInvoice.status === 'paid' ? 0 : grandTotal);

          const words = doc?.in_words || selectedInvoice?.in_words || numberToWords(Math.round(grandTotal), activeCurrency);

          const displayStatus = (doc?.status || selectedInvoice.status || 'Draft').toUpperCase();

          const getBillingPeriod = () => {
            if (doc?.start_date && doc?.end_date) {
              return `${formatInvoiceDate(doc.start_date)} - ${formatInvoiceDate(doc.end_date)}`;
            }
            if (selectedInvoice.startDate && selectedInvoice.endDate) {
              return `${formatInvoiceDate(selectedInvoice.startDate)} - ${formatInvoiceDate(selectedInvoice.endDate)}`;
            }
            if (selectedInvoice.issuedDate) {
              const d = new Date(selectedInvoice.issuedDate);
              if (!isNaN(d.getTime())) {
                const year = d.getFullYear();
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const month = monthNames[d.getMonth()];
                const lastDay = new Date(year, d.getMonth() + 1, 0).getDate();
                return `01 ${month} ${year} - ${lastDay} ${month} ${year}`;
              }
            }
            return 'N/A';
          };

          return (
            <div className="card-panel" style={{ padding: 24, background: '#ffffff', color: '#111827', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.2s ease-out', position: 'relative' }}>

              {/* Close details button */}
              <button
                onClick={() => setSelectedInvoice(null)}
                style={{ position: 'absolute', top: 12, right: 12, background: '#f3f4f6', border: 'none', borderRadius: '50%', color: '#374151', cursor: 'pointer', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Close details"
              >
                ×
              </button>

              {/* TOP HEADER SECTION */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: 14 }}>
                {/* Top Left: Logo & Owner Details */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <svg viewBox="0 0 100 100" style={{ width: 42, height: 42, minWidth: 42, borderRadius: 6, display: 'inline-block' }}>
                    <rect width="100" height="100" fill="#000000" rx="12" />
                    <circle cx="50" cy="50" r="36" fill="#FFDD00" />
                    <polygon points="50,50 86,14 100,14 100,86 86,86" fill="#000000" />
                    <line x1="24" y1="76" x2="50" y2="50" stroke="#000000" strokeWidth="5.5" strokeLinecap="round" />
                  </svg>
                  <div style={{ fontSize: 10, color: '#4b5563', lineHeight: 1.3 }}>
                    <h4 style={{ color: '#111827', fontWeight: 800, fontSize: 13, marginBottom: 4, letterSpacing: '0.02em' }}>
                      {doc?.company || companyDetails.name || 'CARPENTERS PROPERTIES PTE LIMITED'}
                    </h4>
                    {renderAddressDisplay(doc?.company_address_display, companyDetails.address || '40 Robertson Road, Suva, Fiji')}
                    <p style={{ marginTop: 2 }}>Tel: {companyDetails.phone || '+679-2341897'}</p>
                    <p>Email: {companyDetails.email || 'info@carpentersproperties.com'}</p>
                    <p>{companyDetails.website || 'www.carpentersproperties.com'}</p>
                  </div>
                </div>

                {/* Top Right: Invoice Details */}
                <div style={{ textAlign: 'right', fontSize: 11, color: '#4b5563', lineHeight: 1.4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginBottom: 4 }}>
                    <h3 style={{ color: '#111827', fontWeight: 800, fontSize: 16, margin: 0, letterSpacing: '0.03em' }}>TAX INVOICE</h3>
                    {loadingExtra && <Loader2 size={13} className="animate-spin" style={{ color: 'var(--brand-color)' }} />}
                  </div>
                  <p><span style={{ color: '#6b7280' }}>Invoice No:</span> &nbsp;<strong>{doc?.name || selectedInvoice.id}</strong></p>
                  <p><span style={{ color: '#6b7280' }}>Posting Date:</span> &nbsp;{formatInvoiceDate(doc?.posting_date || selectedInvoice.issuedDate)}</p>
                  <p><span style={{ color: '#6b7280' }}>Due Date:</span> &nbsp;{formatInvoiceDate(doc?.due_date || selectedInvoice.dueDate)}</p>
                  <p style={{ marginTop: 6 }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 10,
                      fontSize: 9,
                      fontWeight: 700,
                      backgroundColor: displayStatus === 'PAID' ? '#d1fae5' : displayStatus === 'DRAFT' ? '#e0f2fe' : '#fef3c7',
                      color: displayStatus === 'PAID' ? '#065f46' : displayStatus === 'DRAFT' ? '#0369a1' : '#92400e'
                    }}>
                      {displayStatus}
                    </span>
                  </p>
                </div>
              </div>

              {/* BILL TO & PROPERTY ADDRESS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, fontSize: 10, paddingBottom: 10 }}>
                <div>
                  <span style={{ color: '#6b7280', textTransform: 'uppercase', display: 'block', fontWeight: 700, fontSize: 9, marginBottom: 4 }}>BILL TO</span>
                  <span style={{ display: 'block', color: '#111827', fontWeight: 700, fontSize: 12, marginBottom: 2 }}>
                    {doc?.customer_name || selectedInvoice.tenantName || 'Tenant'}
                  </span>
                  {(doc?.customer || selectedInvoice.customer) && (
                    <div style={{ fontSize: 9, color: '#6b7280', marginBottom: 4 }}>
                      Customer Code: <strong>{doc?.customer || selectedInvoice.customer}</strong>
                    </div>
                  )}
                  <div style={{ color: '#4b5563', lineHeight: 1.35 }}>
                    {renderAddressDisplay(doc?.address_display, invoiceDetailsExtra?.customerAddress || 'Suva, Fiji')}
                  </div>
                </div>

                <div>
                  <span style={{ color: '#6b7280', textTransform: 'uppercase', display: 'block', fontWeight: 700, fontSize: 9, marginBottom: 4 }}>PROPERTY & LEASE DETAILS</span>
                  <strong style={{ fontSize: 11, color: '#111827', display: 'block', marginBottom: 2 }}>
                    {invoiceDetailsExtra?.unitName || (doc?.items && doc.items[0]?.item_code) || selectedInvoice.propertyId}
                  </strong>
                  <p style={{ color: '#4b5563', lineHeight: 1.3, marginBottom: 4 }}>
                    {invoiceDetailsExtra?.unitAddress || 'Carpenters Properties, Suva, Fiji'}
                  </p>
                  {(doc?.booking_id || selectedInvoice.booking_id) && (
                    <div style={{ fontSize: 9, color: '#374151', marginBottom: 2 }}>
                      <span style={{ color: '#6b7280' }}>Booking Ref:</span> &nbsp;
                      <strong style={{ color: 'var(--brand-color, #111827)' }}>{doc?.booking_id || selectedInvoice.booking_id}</strong>
                    </div>
                  )}
                  <div style={{ fontSize: 9, color: '#374151' }}>
                    <span style={{ color: '#6b7280' }}>Billing Period:</span> &nbsp;
                    <strong>{getBillingPeriod()}</strong>
                  </div>
                </div>
              </div>

              {/* MIDDLE: LINE ITEMS TABLE */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#1f2937', color: '#ffffff', borderBottom: '1px solid #374151' }}>
                      <th style={{ padding: '8px 10px', color: '#ffffff' }}>Item & Description</th>
                      <th style={{ padding: '8px 10px', color: '#ffffff', textAlign: 'center', width: 50 }}>Qty</th>
                      <th style={{ padding: '8px 10px', color: '#ffffff', textAlign: 'right', width: 90 }}>Rate</th>
                      <th style={{ padding: '8px 10px', color: '#ffffff', textAlign: 'right', width: 100 }}>Amount ({activeCurrency})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsList.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '8px 10px', color: '#111827' }}>
                          <div style={{ fontWeight: 600 }}>{item.item_name || item.item_code}</div>
                          {item.description && item.description !== item.item_name && item.description !== item.item_code && (
                            <div style={{ fontSize: 9, color: '#6b7280', marginTop: 1 }}>{item.description}</div>
                          )}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', color: '#4b5563' }}>
                          {item.qty || 1}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', color: '#4b5563' }}>
                          $ {(Number(item.rate || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>
                          $ {(Number(item.amount != null ? item.amount : ((item.qty || 1) * (item.rate || 0)))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}

                    {/* Subtotal (Net Total) */}
                    <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                      <td colSpan="3" style={{ padding: '8px 10px', color: '#374151', fontWeight: 600, textAlign: 'right' }}>
                        Net Total / Subtotal
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#374151' }}>
                        $ {Number(netTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>

                    {/* Taxes Breakdown */}
                    {taxesList.length > 0 ? (
                      taxesList.map((tax, tIdx) => (
                        <tr key={tIdx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td colSpan="3" style={{ padding: '6px 10px', color: '#4b5563', fontWeight: 500, textAlign: 'right' }}>
                            {tax.description || tax.account_head || 'VAT / Tax'} {tax.rate ? `(${tax.rate}%)` : ''}
                          </td>
                          <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 600, color: '#4b5563' }}>
                            $ {(Number(tax.tax_amount || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    ) : totalTaxes > 0 ? (
                      <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td colSpan="3" style={{ padding: '6px 10px', color: '#4b5563', fontWeight: 500, textAlign: 'right' }}>
                          Taxes & Charges (12.5%)
                        </td>
                        <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 600, color: '#4b5563' }}>
                          $ {Number(totalTaxes).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ) : null}

                    {/* Rounding Adjustment if any */}
                    {roundingAdjustment !== 0 && (
                      <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td colSpan="3" style={{ padding: '4px 10px', color: '#6b7280', fontSize: 9, textAlign: 'right' }}>
                          Rounding Adjustment
                        </td>
                        <td style={{ padding: '4px 10px', textAlign: 'right', fontSize: 9, color: '#6b7280' }}>
                          $ {roundingAdjustment.toFixed(2)}
                        </td>
                      </tr>
                    )}

                    {/* Total Amount Due */}
                    <tr style={{ background: '#f3f4f6', borderTop: '2px solid #e5e7eb' }}>
                      <td colSpan="3" style={{ padding: '8px 10px', fontWeight: 800, color: '#111827', textAlign: 'right' }}>
                        Total Amount Due ({activeCurrency})
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#111827', fontSize: 11 }}>
                        $ {Number(grandTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>

                    {/* Outstanding Balance if different or paid */}
                    {displayStatus === 'PAID' || outstandingAmount === 0 ? (
                      <tr style={{ background: '#ecfdf5', borderTop: '1px solid #d1fae5' }}>
                        <td colSpan="3" style={{ padding: '6px 10px', fontWeight: 700, color: '#065f46', textAlign: 'right' }}>
                          Balance Outstanding (Paid)
                        </td>
                        <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 700, color: '#065f46', fontSize: 10 }}>
                          $ 0.00
                        </td>
                      </tr>
                    ) : outstandingAmount > 0 && outstandingAmount !== grandTotal ? (
                      <tr style={{ background: '#fffbeb', borderTop: '1px solid #fef3c7' }}>
                        <td colSpan="3" style={{ padding: '6px 10px', fontWeight: 700, color: '#92400e', textAlign: 'right' }}>
                          Outstanding Balance Due
                        </td>
                        <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 700, color: '#92400e', fontSize: 10 }}>
                          $ {Number(outstandingAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              {/* AMOUNT IN WORDS */}
              <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: 4, fontSize: 10, color: '#374151', borderLeft: '3px solid #1f2937' }}>
                <span style={{ fontWeight: 700, textTransform: 'uppercase', display: 'block', fontSize: 8, color: '#6b7280', marginBottom: 2 }}>Amount in Words:</span>
                <strong>{words}</strong>
              </div>

              {/* BOTTOM SECTION: BANK & TERMS & QR */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, borderTop: '1px solid #e5e7eb', paddingTop: 14, fontSize: 9, color: '#4b5563', lineHeight: 1.4 }}>
                {/* Payment Info & Bank Details */}
                <div>
                  <strong style={{ color: '#111827', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>PAYMENT INFORMATION</strong>
                  <p style={{ marginBottom: 6 }}>Please make payment by {formatInvoiceDate(doc?.due_date || selectedInvoice.dueDate)} to the following account:</p>
                  <p><span style={{ color: '#6b7280' }}>Bank Name:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Bank of South Pacific (BSP) / ANZ Fiji</strong></p>
                  <p><span style={{ color: '#6b7280' }}>Account Name:</span> &nbsp;&nbsp; <strong>{doc?.company || companyDetails.name || 'Carpenters Properties Pte Limited'}</strong></p>
                  <p><span style={{ color: '#6b7280' }}>Account Number:</span> <strong>9801234567</strong></p>
                  <p><span style={{ color: '#6b7280' }}>Swift Code:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>BOSPFJ22</strong></p>

                  <p style={{ marginTop: 12, fontStyle: 'italic', fontSize: 8, color: '#6b7280' }}>
                    Thank you for your business.<br />
                    This is a computer-generated invoice. No signature is required.
                  </p>
                </div>

                {/* Scan to Pay QR */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid #e5e7eb', paddingLeft: 20 }}>
                  <span style={{ fontSize: 9, color: '#111827', marginBottom: 6, textTransform: 'uppercase', fontWeight: 700 }}>SCAN TO PAY</span>
                  <svg viewBox="0 0 100 100" style={{ width: 64, height: 64 }}>
                    <rect width="100" height="100" fill="#ffffff" />
                    <rect x="5" y="5" width="25" height="25" fill="#000000" />
                    <rect x="8" y="8" width="19" height="19" fill="#ffffff" />
                    <rect x="11" y="11" width="13" height="13" fill="#000000" />
                    <rect x="70" y="5" width="25" height="25" fill="#000000" />
                    <rect x="73" y="8" width="19" height="19" fill="#ffffff" />
                    <rect x="76" y="11" width="13" height="13" fill="#000000" />
                    <rect x="5" y="70" width="25" height="25" fill="#000000" />
                    <rect x="8" y="73" width="19" height="19" fill="#ffffff" />
                    <rect x="11" y="76" width="13" height="13" fill="#000000" />
                    <rect x="35" y="10" width="5" height="5" fill="#000000" />
                    <rect x="45" y="15" width="10" height="5" fill="#000000" />
                    <rect x="35" y="25" width="15" height="5" fill="#000000" />
                    <rect x="55" y="25" width="5" height="10" fill="#000000" />
                    <rect x="25" y="35" width="10" height="10" fill="#000000" />
                    <rect x="50" y="35" width="10" height="5" fill="#000000" />
                    <rect x="15" y="45" width="5" height="15" fill="#000000" />
                    <rect x="35" y="50" width="15" height="5" fill="#000000" />
                    <rect x="65" y="40" width="15" height="10" fill="#000000" />
                    <rect x="45" y="65" width="10" height="5" fill="#000000" />
                    <rect x="60" y="60" width="20" height="5" fill="#000000" />
                    <rect x="80" y="70" width="10" height="15" fill="#000000" />
                  </svg>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-md)', padding: 12, fontSize: 9, color: '#4b5563' }}>
                <strong style={{ color: '#111827', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Terms & Conditions</strong>
                <p>1. Settle all invoice amounts on or before the specified due date.</p>
                <p>2. Overdue payments will incur interest as per commercial tenancy agreement.</p>
                <p>3. Payments are subject to Carpenters Properties commercial leasing terms.</p>
                <p>4. Billing disputes must be raised in writing within 5 business days of receipt.</p>
              </div>

              {/* Action buttons */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {(selectedInvoice.status === 'pending' || displayStatus === 'DRAFT' || displayStatus === 'UNPAID') && (
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, minWidth: 140, fontSize: 11, gap: 6, background: '#ffdd00', color: '#000' }}
                    onClick={() => {
                      onRecordPayment(selectedInvoice.id);
                      setSelectedInvoice({ ...selectedInvoice, status: 'paid' });
                    }}
                  >
                    <CheckCircle2 size={13} /> Record Payment Received
                  </button>
                )}
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1, minWidth: 100, fontSize: 11, gap: 6, borderColor: '#d1d5db', color: '#374151', background: '#f9fafb' }}
                  onClick={() => handlePrint(selectedInvoice)}
                >
                  <Printer size={13} /> Print Invoice
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1, minWidth: 120, fontSize: 11, gap: 6, borderColor: '#d1d5db', color: '#374151', background: '#f9fafb' }}
                  onClick={() => {
                    alert(`Emailing Tax Invoice ${selectedInvoice.id} to tenant address: ${invoiceDetailsExtra?.customerAddress || 'Customer registered address'}`);
                  }}
                >
                  <Mail size={13} /> Send Email
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* GENERAL LEDGER & TRIAL BALANCE MODAL */}
      {showGLModal && (() => {
        // Group GL Entry debits and credits by account name
        const accountBalances = {};
        glEntries.forEach(entry => {
          const accName = entry.account;
          if (!accountBalances[accName]) {
            accountBalances[accName] = { debit: 0, credit: 0 };
          }
          accountBalances[accName].debit += Number(entry.debit || 0);
          accountBalances[accName].credit += Number(entry.credit || 0);
        });

        // Map accounts to display format including accumulated balances
        const displayAccounts = accounts.map(acc => {
          const balances = accountBalances[acc.name] || { debit: 0, credit: 0 };
          return {
            name: acc.name,
            account_name: acc.account_name || acc.name,
            root_type: acc.root_type || 'Asset',
            parent_account: acc.parent_account || 'N/A',
            debit: balances.debit,
            credit: balances.credit
          };
        });

        // Compute total Debit and Credit sums for the Trial Balance check
        const totalDebitSum = displayAccounts.reduce((sum, acc) => sum + acc.debit, 0);
        const totalCreditSum = displayAccounts.reduce((sum, acc) => sum + acc.credit, 0);
        const isBalanced = Math.abs(totalDebitSum - totalCreditSum) < 0.05;

        return (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: 850 }}>
              <div className="modal-header">
                <h3>General Ledger & Trial Balance Chart</h3>
                <button onClick={() => setShowGLModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* 1. General Ledger Entries */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--brand-color)', marginBottom: 8 }}>ERPNext Chart of Accounts & Balances</h4>
                  <div className="table-container" style={{ maxHeight: 250, overflowY: 'auto' }}>
                    <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ background: 'var(--bg-tertiary)' }}>
                          <th>Account ID / Code</th>
                          <th>Account Name</th>
                          <th>Parent Account</th>
                          <th>Type</th>
                          <th style={{ textAlign: 'right' }}>Debit ($)</th>
                          <th style={{ textAlign: 'right' }}>Credit ($)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayAccounts.map((acc, index) => (
                          <tr key={index}>
                            <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{acc.name}</td>
                            <td>{acc.account_name}</td>
                            <td>{acc.parent_account}</td>
                            <td><span className="badge" style={{ fontSize: 9, padding: '2px 6px', textTransform: 'capitalize' }}>{acc.root_type}</span></td>
                            <td style={{ textAlign: 'right', color: acc.debit > 0 ? 'var(--color-success)' : 'var(--text-muted)', fontWeight: acc.debit > 0 ? 600 : 400 }}>
                              {acc.debit > 0 ? `$${acc.debit.toLocaleString()}` : '-'}
                            </td>
                            <td style={{ textAlign: 'right', color: acc.credit > 0 ? 'var(--color-warning)' : 'var(--text-muted)', fontWeight: acc.credit > 0 ? 600 : 400 }}>
                              {acc.credit > 0 ? `$${acc.credit.toLocaleString()}` : '-'}
                            </td>
                          </tr>
                        ))}
                        {displayAccounts.length === 0 && (
                          <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No accounts found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Trial Balance Check */}
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 18 }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--brand-color)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Landmark size={16} /> Trial Balance Equation Check
                  </h4>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 14 }}>
                    Calculated dynamically from live ERPNext Chart of Accounts & GL Entries. Proves that total Debit matches total Credit.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, textAlign: 'center', fontSize: 12 }}>
                    <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 6 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase' }}>Sum of Debits</span>
                      <strong style={{ display: 'block', fontSize: '1.2rem', color: 'var(--color-success)', marginTop: 4 }}>
                        ${totalDebitSum.toLocaleString()}.00
                      </strong>
                    </div>
                    <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 6 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase' }}>Sum of Credits</span>
                      <strong style={{ display: 'block', fontSize: '1.2rem', color: 'var(--color-success)', marginTop: 4 }}>
                        ${totalCreditSum.toLocaleString()}.00
                      </strong>
                    </div>
                    <div style={{ background: 'var(--bg-accent-alpha)', border: isBalanced ? '1px solid var(--brand-color)' : '1px solid var(--color-danger)', padding: 12, borderRadius: 6 }}>
                      <span style={{ color: isBalanced ? 'var(--brand-color)' : 'var(--color-danger)', fontSize: 10, textTransform: 'uppercase' }}>Balance Check status</span>
                      <strong style={{ display: 'block', fontSize: '1.2rem', color: isBalanced ? 'var(--brand-color)' : 'var(--color-danger)', marginTop: 4 }}>
                        {isBalanced ? 'BALANCED ✓' : 'UNBALANCED ✗'}
                      </strong>
                    </div>
                  </div>
                </div>

              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowGLModal(false)}>Close Ledger</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 9999,
          background: toast.type === 'error' ? '#ef4444' : (toast.type === 'info' ? '#0284c7' : '#0a6c66'),
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease'
        }}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Dynamic Sales Invoice Modal - Single Unified View */}
      {showAddModal && (() => {
        const { subtotal, totalDiscount, netTotal, computedTaxes, totalTaxesAndCharges, grandTotal } = calculateTotals();
        const itemOptions = Array.from(new Set([
          ...(linkOptionsCache['Item'] || []),
          ...properties.map(p => p.id || p.name).filter(Boolean),
          'Gb009', 'Pb4', 'Office Space', 'Retail Shop'
        ]));
        const rawTaxTemplates = linkOptionsCache['Sales Taxes and Charges Template'] || [];
        const taxTemplateOptions = Array.from(new Set([
          ...rawTaxTemplates.filter(t => t !== 'Fiji Tax'),
          ...(rawTaxTemplates.length === 0 ? ['Fiji Tax - CFPL'] : [])
        ]));
        const accountHeadOptions = Array.from(new Set([
          ...(linkOptionsCache['Account'] || []),
          'VAT - CFPL',
          'VAT 12.5% - CFPL',
          'Taxes - CFPL',
          'Sales - CFPL',
          'Debtors - CFPL'
        ]));

        return (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '920px', width: '96%', maxHeight: '92vh', display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden' }}>

              {/* Modal Header */}
              <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>Issue New Sales Invoice</h3>
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Sales Invoice DocType • Dynamic Billing Form</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setItems([]);
                    setCustomerDropdownOpen(false);
                    setCustomerSearchQuery('');
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body - Unified Single View */}
              <form onSubmit={handleSubmitInvoice} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                <div className="modal-body" style={{ padding: '20px 24px', flex: 1, overflowY: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

                    {/* SECTION 1: Customer & Leased Booking */}
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(10, 108, 102, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a6c66' }}>
                            <User size={15} />
                          </div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>Customer & Leased Booking Details</h4>
                          </div>
                        </div>
                      </div>

                      <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                        {/* Searchable Customer Dropdown */}
                        <div className="form-group" style={{ position: 'relative' }} ref={customerDropdownRef}>
                          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Customer / Tenant <span style={{ color: '#ef4444' }}>*</span></span>
                          </label>

                          {/* Trigger Display */}
                          <div
                            onClick={() => setCustomerDropdownOpen(prev => !prev)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 12px',
                              border: customerDropdownOpen ? '1.5px solid var(--brand-color, #0a6c66)' : '1px solid var(--border-color)',
                              borderRadius: '6px',
                              background: 'var(--bg-primary)',
                              cursor: 'pointer',
                              minHeight: '38px',
                              boxShadow: customerDropdownOpen ? '0 0 0 3px rgba(10, 108, 102, 0.12)' : 'none',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', flex: 1 }}>
                              <User size={15} style={{ color: formValues.customer ? 'var(--brand-color, #0a6c66)' : 'var(--text-muted)', flexShrink: 0 }} />
                              {formValues.customer ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', flexWrap: 'wrap' }}>
                                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '13px' }}>
                                    {formValues.customer_name || formValues.customer}
                                  </span>
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '1px 6px', borderRadius: '4px' }}>
                                    {formValues.customer}
                                  </span>
                                </div>
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: '12.5px' }}>
                                  Search and select approved customer...
                                </span>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: 6 }}>
                              {formValues.customer && (
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFormValues(prev => ({ ...prev, customer: '', customer_name: '', customer_address: '', booking_id: '' }));
                                  }}
                                  style={{ padding: '2px', color: 'var(--text-muted)', cursor: 'pointer' }}
                                  title="Clear customer"
                                >
                                  <X size={14} />
                                </span>
                              )}
                              <ChevronDown size={15} style={{ color: 'var(--text-muted)', transform: customerDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </div>
                          </div>

                          {/* Hidden input for HTML5 required form validation */}
                          <input
                            type="text"
                            value={formValues.customer}
                            required
                            tabIndex={-1}
                            style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
                            onChange={() => { }}
                          />

                          {/* Searchable Dropdown Popover */}
                          {customerDropdownOpen && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 4px)',
                                left: 0,
                                right: 0,
                                background: 'var(--bg-primary, #ffffff)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2), 0 4px 10px rgba(0, 0, 0, 0.08)',
                                zIndex: 1100,
                                maxHeight: '300px',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden'
                              }}
                            >
                              {/* Search Box */}
                              <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                <input
                                  type="text"
                                  autoFocus
                                  value={customerSearchQuery}
                                  onChange={(e) => setCustomerSearchQuery(e.target.value)}
                                  placeholder="Type name or customer ID..."
                                  style={{
                                    border: 'none',
                                    background: 'transparent',
                                    outline: 'none',
                                    fontSize: '12px',
                                    width: '100%',
                                    color: 'var(--text-primary)'
                                  }}
                                />
                                {customerSearchQuery && (
                                  <X
                                    size={14}
                                    style={{ color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }}
                                    onClick={() => setCustomerSearchQuery('')}
                                  />
                                )}
                              </div>

                              {/* Customer Items List */}
                              <div style={{ overflowY: 'auto', flex: 1, padding: '4px 0' }}>
                                {loadingBookings && (
                                  <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    <Loader2 size={14} className="spin" />
                                    <span>Verifying approved bookings...</span>
                                  </div>
                                )}

                                {!loadingBookings && filteredApprovedCustomers.length === 0 && (
                                  <div style={{ padding: '20px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                                    {customerSearchQuery ? (
                                      <span>No approved customers match "<strong>{customerSearchQuery}</strong>"</span>
                                    ) : (
                                      <div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>No Approved Customers Available</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Only clients with bookings in <strong>Approved</strong> workflow state are shown here.</div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {!loadingBookings && filteredApprovedCustomers.map(c => {
                                  const isSelected = formValues.customer === c.customerId;
                                  const primaryB = c.bookings[0] || {};
                                  return (
                                    <div
                                      key={c.customerId}
                                      onClick={() => handleSelectApprovedCustomer(c)}
                                      style={{
                                        padding: '9px 12px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid var(--border-color)',
                                        background: isSelected ? 'rgba(10, 108, 102, 0.08)' : 'transparent',
                                        transition: 'background 0.15s ease'
                                      }}
                                      onMouseEnter={(e) => {
                                        if (!isSelected) e.currentTarget.style.background = 'var(--bg-secondary)';
                                      }}
                                      onMouseLeave={(e) => {
                                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontWeight: 700, fontSize: '12.5px', color: 'var(--text-primary)' }}>
                                          {c.customerName || c.customerId}
                                        </span>
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                          ({c.customerId})
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label">Customer Display Name</label>
                          <input
                            type="text"
                            value={formValues.customer_name}
                            onChange={(e) => setFormValues(prev => ({ ...prev, customer_name: e.target.value }))}
                            placeholder="e.g. Arijit"
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                        <div className="form-group">
                          <label className="form-label">Booking ID</label>
                          <select
                            value={formValues.booking_id}
                            onChange={(e) => handleBookingSelect(e.target.value)}
                            className="form-input"
                          >
                            <option value="">-- Select Approved Booking --</option>
                            {approvedBookings
                              .filter(b => !formValues.customer || b.customer === formValues.customer || b.customer_name === formValues.customer || b.tenantName === formValues.customer)
                              .map(b => (
                                <option key={b.name} value={b.name}>
                                  {b.name}
                                </option>
                              ))}
                            {/* {formValues.booking_id && !approvedBookings.some(b => b.name === formValues.booking_id) && (
                              <option value={formValues.booking_id}>{formValues.booking_id}</option>
                            )} */}
                          </select>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                            Auto-fills leased property unit and monthly rental rate into line items.
                          </span>
                        </div>

                        <div className="form-group">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <label className="form-label" style={{ margin: 0 }}>
                              Customer Address
                            </label>
                            {formValues.customer && (
                              <button
                                type="button"
                                onClick={() => setShowCreateAddressModal(true)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--brand-color, #0a6c66)',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  padding: 0,
                                  textDecoration: 'underline'
                                }}
                              >
                                + New Address
                              </button>
                            )}
                          </div>

                          {loadingCustomerAddresses ? (
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '8px 10px', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                              Loading addresses from ERPNext...
                            </div>
                          ) : customerAddresses.length > 0 ? (
                            <select
                              value={formValues.customer_address}
                              onChange={(e) => setFormValues(prev => ({ ...prev, customer_address: e.target.value }))}
                              className="form-select"
                              style={{ width: '100%', fontSize: '12.5px' }}
                            >
                              <option value="">-- No Address / Leave Blank --</option>
                              {customerAddresses.map(addr => (
                                <option key={addr.name} value={addr.name}>
                                  {addr.name} {addr.address_type ? `(${addr.address_type})` : ''} {addr.address_line1 ? `- ${addr.address_line1}` : ''} {addr.city ? `, ${addr.city}` : ''}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div>
                              <input
                                type="text"
                                value={formValues.customer_address}
                                onChange={(e) => setFormValues(prev => ({ ...prev, customer_address: e.target.value }))}
                                placeholder={formValues.customer ? "No linked address in ERPNext (left blank to prevent link error)" : "Select a customer first"}
                                className="form-input"
                                style={{
                                  fontSize: '12.5px',
                                  background: !formValues.customer_address ? 'var(--bg-secondary)' : 'var(--bg-primary)'
                                }}
                              />
                              {formValues.customer && !formValues.customer_address && (
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', display: 'block' }}>
                                  ℹ️ No address linked in ERPNext for {formValues.customer}. Field is optional and left blank.
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                        <div className="form-group">
                          <label className="form-label">Start Date</label>
                          <input
                            type="date"
                            value={formValues.start_date}
                            onChange={(e) => setFormValues(prev => ({ ...prev, start_date: e.target.value }))}
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">End Date</label>
                          <input
                            type="date"
                            value={formValues.end_date}
                            onChange={(e) => setFormValues(prev => ({ ...prev, end_date: e.target.value }))}
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr 1fr' }}>
                        <div className="form-group">
                          <label className="form-label">Posting Date <span style={{ color: '#ef4444' }}>*</span></label>
                          <input
                            type="date"
                            value={formValues.posting_date}
                            onChange={(e) => setFormValues(prev => ({ ...prev, posting_date: e.target.value }))}
                            className="form-input"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Due Date <span style={{ color: '#ef4444' }}>*</span></label>
                          <input
                            type="date"
                            value={formValues.due_date}
                            onChange={(e) => setFormValues(prev => ({ ...prev, due_date: e.target.value }))}
                            className="form-input"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">PO No. / Client Ref</label>
                          <input
                            type="text"
                            value={formValues.po_no}
                            onChange={(e) => setFormValues(prev => ({ ...prev, po_no: e.target.value }))}
                            placeholder="Optional PO number"
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: Invoice Line Items Child Table */}
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(10, 108, 102, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a6c66' }}>
                            <Layers size={15} />
                          </div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>Line Units</span>
                              {loadingBookingItems && (
                                <span style={{ fontSize: '11px', color: '#0a6c66', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <Loader2 size={12} className="spin" /> Fetching booking items...
                                </span>
                              )}
                            </h4>
                          </div>
                        </div>
                      </div>

                      <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <thead>
                              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '8px 10px', width: '30px' }}>#</th>
                                <th style={{ padding: '8px 10px', minWidth: '140px' }}>Unit Code/Services <span style={{ color: '#ef4444' }}>*</span></th>
                                <th style={{ padding: '8px 10px', minWidth: '160px' }}>Description</th>
                                <th style={{ padding: '8px 10px', width: '75px' }}>Period(Monthly)</th>
                                <th style={{ padding: '8px 10px', width: '110px' }}>Rate ({formValues.currency})</th>
                                <th style={{ padding: '8px 10px', width: '100px' }}>Amount</th>
                                <th style={{ padding: '8px 10px', width: '85px' }}>UOM</th>
                                <th style={{ padding: '8px 10px', width: '40px' }}></th>
                              </tr>
                            </thead>
                            <tbody>
                              {loadingBookingItems ? (
                                <tr>
                                  <td colSpan={8} style={{ padding: '28px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12.5px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                      <Loader2 size={16} className="spin" style={{ color: '#0a6c66' }} />
                                      <span>Loading Booking Items from Booking {formValues.booking_id}...</span>
                                    </div>
                                  </td>
                                </tr>
                              ) : items.length === 0 ? (
                                <tr>
                                  <td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12.5px' }}>
                                    No unit items selected. Please select a Customer and Booking ID above to load units.
                                  </td>
                                </tr>
                              ) : (
                                items.map((row, idx) => (
                                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)' }}>
                                    <td style={{ padding: '8px 10px', color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                                    <td style={{ padding: '6px 10px' }}>
                                      <input
                                        type="text"
                                        list={`item-list-${idx}`}
                                        value={row.item_code}
                                        onChange={(e) => handleItemChange(idx, 'item_code', e.target.value)}
                                        placeholder="e.g. Gb009"
                                        className="form-input"
                                        style={{ height: '32px', fontSize: '12px', padding: '4px 8px' }}
                                        required
                                      />
                                      <datalist id={`item-list-${idx}`}>
                                        {itemOptions.map(opt => <option key={opt} value={opt} />)}
                                      </datalist>
                                    </td>
                                    <td style={{ padding: '6px 10px' }}>
                                      <input
                                        type="text"
                                        value={row.description}
                                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                                        placeholder="Description"
                                        className="form-input"
                                        style={{ height: '32px', fontSize: '12px', padding: '4px 8px' }}
                                      />
                                    </td>
                                    <td style={{ padding: '6px 10px' }}>
                                      <input
                                        type="number"
                                        min="1"
                                        step="any"
                                        value={row.qty}
                                        onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                                        className="form-input"
                                        style={{ height: '32px', fontSize: '12px', padding: '4px 6px', textAlign: 'center' }}
                                        required
                                      />
                                    </td>
                                    <td style={{ padding: '6px 10px' }}>
                                      <input
                                        type="number"
                                        min="0"
                                        step="any"
                                        value={row.rate}
                                        onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                                        className="form-input"
                                        style={{ height: '32px', fontSize: '12px', padding: '4px 8px' }}
                                        required
                                      />
                                    </td>
                                    <td style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                                      ${(Number(row.amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td style={{ padding: '6px 10px' }}>
                                      <select
                                        value={row.uom || 'Sq Ft'}
                                        onChange={(e) => handleItemChange(idx, 'uom', e.target.value)}
                                        className="form-input"
                                        style={{ height: '32px', fontSize: '11.5px', padding: '2px 6px' }}
                                      >
                                        <option value="Sq Ft">Sq Ft</option>
                                        <option value="Month">Month</option>
                                        <option value="Nos">Nos</option>
                                        <option value="Unit">Unit</option>
                                      </select>
                                    </td>
                                    <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveItemRow(idx)}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}
                                        title="Remove item"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '12.5px' }}>
                        <span>Gross Total: <strong style={{ color: 'var(--brand-color, #0a6c66)' }}>{formValues.currency} ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                      </div>

                      {/* =========================================================================
                          SALES TAXES AND CHARGES (COMMENTED OUT / HIDDEN FROM UI - CODE PRESERVED)
                      ========================================================================= */}
                      {/*
                      // Divider
                      <div style={{ borderTop: '1px solid var(--border-color)', margin: '4px 0 2px' }} />

                      // Sales Taxes and Charges
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(10, 108, 102, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a6c66' }}>
                            <Percent size={15} />
                          </div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>Sales Taxes and Charges</h4>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sales Taxes & Charges template, tax rates, and automatic VAT computation</span>
                          </div>
                        </div>
                      </div>

                      // Sales Taxes and Charges Template Field
                      <div className="form-group" style={{ maxWidth: '420px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '12.5px', margin: 0 }}>
                            Sales Taxes and Charges Template
                          </label>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Link to Template</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                          <select
                            value={formValues.taxes_and_charges}
                            onChange={(e) => handleTaxTemplateChange(e.target.value)}
                            className="form-select"
                            style={{
                              width: '100%',
                              background: 'var(--bg-primary)',
                              borderRadius: '6px',
                              fontWeight: 600,
                              fontSize: '13px',
                              padding: '8px 12px'
                            }}
                          >
                            <option value="">-- None / Custom Taxes --</option>
                            {taxTemplateOptions.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                          Selecting a valid template automatically configures tax rules from ERPNext.
                        </span>
                      </div>

                      // Sales Taxes and Charges Child Table
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            Sales Taxes and Charges
                          </span>
                        </div>

                        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-primary)' }}>
                          <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                              <thead>
                                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                                  <th style={{ padding: '8px 10px', width: '32px', textAlign: 'center' }}>
                                    <input type="checkbox" disabled style={{ cursor: 'default' }} />
                                  </th>
                                  <th style={{ padding: '8px 10px', width: '36px', textAlign: 'center' }}>No.</th>
                                  <th style={{ padding: '8px 10px', minWidth: '150px' }}>Type <span style={{ color: '#ef4444' }}>*</span></th>
                                  <th style={{ padding: '8px 10px', minWidth: '170px' }}>Account Head <span style={{ color: '#ef4444' }}>*</span></th>
                                  <th style={{ padding: '8px 10px', width: '110px' }}>Tax Rate (%)</th>
                                  <th style={{ padding: '8px 10px', width: '130px', textAlign: 'right' }}>Amount ({formValues.currency})</th>
                                  <th style={{ padding: '8px 10px', width: '140px', textAlign: 'right' }}>Total ({formValues.currency})</th>
                                  <th style={{ padding: '8px 10px', width: '40px', textAlign: 'center' }}></th>
                                </tr>
                              </thead>
                              <tbody>
                                {computedTaxes.length === 0 ? (
                                  <tr>
                                    <td colSpan={8} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                      No tax rows applied. Click <strong>Add Row</strong> to add a tax charge.
                                    </td>
                                  </tr>
                                ) : (
                                  computedTaxes.map((taxRow, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)' }}>
                                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                                        <input type="checkbox" defaultChecked />
                                      </td>
                                      <td style={{ padding: '8px 10px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
                                        {idx + 1}
                                      </td>
                                      <td style={{ padding: '6px 10px' }}>
                                        <select
                                          value={taxRow.charge_type || 'On Net Total'}
                                          onChange={(e) => handleTaxChange(idx, 'charge_type', e.target.value)}
                                          className="form-input"
                                          style={{ height: '32px', fontSize: '12px', fontWeight: 600, padding: '2px 8px' }}
                                        >
                                          <option value="On Net Total">On Net Total</option>
                                          <option value="Actual">Actual</option>
                                          <option value="On Previous Row Amount">On Previous Row Amount</option>
                                          <option value="On Previous Row Total">On Previous Row Total</option>
                                        </select>
                                      </td>
                                      <td style={{ padding: '6px 10px' }}>
                                        <input
                                          type="text"
                                          list={`tax-account-options-${idx}`}
                                          value={taxRow.account_head}
                                          onChange={(e) => handleTaxChange(idx, 'account_head', e.target.value)}
                                          placeholder="e.g. VAT - CFPL"
                                          className="form-input"
                                          style={{ height: '32px', fontSize: '12px', fontWeight: 600, padding: '4px 8px' }}
                                          required
                                        />
                                        <datalist id={`tax-account-options-${idx}`}>
                                          {accountHeadOptions.map(opt => <option key={opt} value={opt} />)}
                                        </datalist>
                                      </td>
                                      <td style={{ padding: '6px 10px' }}>
                                        <input
                                          type="number"
                                          step="any"
                                          min="0"
                                          value={taxRow.rate}
                                          onChange={(e) => handleTaxChange(idx, 'rate', e.target.value)}
                                          placeholder="12.500"
                                          disabled={taxRow.charge_type === 'Actual'}
                                          className="form-input"
                                          style={{ height: '32px', fontSize: '12px', padding: '4px 8px' }}
                                        />
                                      </td>
                                      <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>
                                        {taxRow.charge_type === 'Actual' ? (
                                          <input
                                            type="number"
                                            step="any"
                                            min="0"
                                            value={taxRow.tax_amount}
                                            onChange={(e) => handleTaxChange(idx, 'tax_amount', e.target.value)}
                                            className="form-input"
                                            style={{ height: '32px', fontSize: '12px', padding: '4px 8px', textAlign: 'right' }}
                                          />
                                        ) : (
                                          `$ ${Number(taxRow.tax_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        )}
                                      </td>
                                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: 'var(--brand-color, #0a6c66)' }}>
                                        $ {Number(taxRow.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      </td>
                                      <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveTaxRow(idx)}
                                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}
                                          title="Remove tax row"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <button
                            type="button"
                            onClick={handleAddTaxRow}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '11.5px', padding: '5px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                          >
                            <Plus size={13} /> Add Row
                          </button>

                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            Total Taxes and Charges ({formValues.currency}): <strong style={{ color: 'var(--brand-color, #0a6c66)', fontSize: '13px' }}>
                              ${totalTaxesAndCharges.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </strong>
                          </div>
                        </div>
                      </div>

                      // Grand Total Callout directly after taxes table
                      <div style={{
                        marginTop: '4px',
                        background: 'var(--bg-primary)',
                        border: '1.5px solid var(--brand-color, #0a6c66)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 2px 8px rgba(10, 108, 102, 0.08)'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700 }}>
                            Grand Total (Net Total + Taxes)
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            Net: <strong>${netTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> + Taxes: <strong>${totalTaxesAndCharges.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-color, #0a6c66)' }}>
                            {formValues.currency} ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>grand_total</span>
                        </div>
                      </div>
                      */}
                    </div>

                    {/* Discounts & Grand Total Summary */}
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(10, 108, 102, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a6c66' }}>
                          <Calculator size={15} />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>Grand Total Summary</h4>

                        </div>
                      </div>

                      {/* <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                        <div className="form-group">
                          <label className="form-label">Additional Discount Percentage (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="any"
                            value={formValues.additional_discount_percentage}
                            onChange={(e) => setFormValues(prev => ({ ...prev, additional_discount_percentage: e.target.value }))}
                            placeholder="0"
                            className="form-input"
                          />
                        </div> */}

                      {/* <div className="form-group">
                          <label className="form-label">Direct Discount Amount ({formValues.currency})</label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={formValues.discount_amount}
                            onChange={(e) => setFormValues(prev => ({ ...prev, discount_amount: e.target.value }))}
                            placeholder="0"
                            className="form-input"
                          />
                        </div>
                      </div> */}

                      {/* Financial Card Summary */}
                      <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', fontSize: '12.5px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Net Items Subtotal:</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>

                        {totalDiscount > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', fontSize: '12.5px', color: '#16a34a' }}>
                            <span>Total Discount Applied:</span>
                            <span style={{ fontWeight: 600 }}>-${totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', fontSize: '12.5px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Total Taxes & Charges (VAT):</span>
                          <span style={{ fontWeight: 600, color: 'var(--brand-color, #0a6c66)' }}>+${totalTaxesAndCharges.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', fontSize: '15px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Grand Total:</span>
                          <span style={{ fontWeight: 800, color: 'var(--brand-color, #0a6c66)', fontSize: '18px' }}>
                            {formValues.currency} ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                          <strong>In Words:</strong> {numberToWords(grandTotal, formValues.currency)}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Modal Footer (Sticky) */}
                <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Items: <strong style={{ color: 'var(--text-primary)' }}>{items.length}</strong></span>
                    <span style={{ color: 'var(--text-muted)' }}>Taxes: <strong style={{ color: 'var(--brand-color, #0a6c66)' }}>+${totalTaxesAndCharges.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                    <span style={{ color: 'var(--text-muted)' }}>Grand Total: <strong style={{ color: 'var(--brand-color, #0a6c66)', fontSize: '14px' }}>{formValues.currency} ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowAddModal(false);
                        setItems([]);
                        setCustomerDropdownOpen(false);
                        setCustomerSearchQuery('');
                      }}
                      disabled={submittingInvoice}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submittingInvoice}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0a6c66', borderColor: '#0a6c66' }}
                    >
                      {submittingInvoice ? (
                        <>
                          <Loader2 size={15} className="spin" />
                          <span>Generating Invoice...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={15} />
                          <span>Generate Invoice</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* Create Customer Address in ERPNext Modal */}
      {showCreateAddressModal && (
        <div className="modal-overlay" style={{ zIndex: 1200 }}>
          <div className="modal-content" style={{ maxWidth: '480px', width: '92%', borderRadius: '12px', overflow: 'hidden', padding: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Create Customer Address</h4>
                <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  Linking to Customer: <strong style={{ color: 'var(--brand-color, #0a6c66)' }}>{formValues.customer_name || formValues.customer}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateAddressModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomerAddress} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Address Type <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={newAddressForm.address_type}
                  onChange={(e) => setNewAddressForm(prev => ({ ...prev, address_type: e.target.value }))}
                  className="form-select"
                  style={{ width: '100%', fontSize: '12.5px' }}
                >
                  <option value="Billing">Billing</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Office">Office</option>
                  <option value="Personal">Personal</option>
                  <option value="Postal">Postal</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Address Line 1 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123 Victoria Parade"
                  value={newAddressForm.address_line1}
                  onChange={(e) => setNewAddressForm(prev => ({ ...prev, address_line1: e.target.value }))}
                  className="form-input"
                  style={{ fontSize: '12.5px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Floor 2, Suite 204"
                  value={newAddressForm.address_line2}
                  onChange={(e) => setNewAddressForm(prev => ({ ...prev, address_line2: e.target.value }))}
                  className="form-input"
                  style={{ fontSize: '12.5px' }}
                />
              </div>

              <div className="grid-2col" style={{ gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                    City <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddressForm.city}
                    onChange={(e) => setNewAddressForm(prev => ({ ...prev, city: e.target.value }))}
                    className="form-input"
                    style={{ fontSize: '12.5px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                    Country <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddressForm.country}
                    onChange={(e) => setNewAddressForm(prev => ({ ...prev, country: e.target.value }))}
                    className="form-input"
                    style={{ fontSize: '12.5px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Postal Code / Pincode
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0000"
                  value={newAddressForm.pincode}
                  onChange={(e) => setNewAddressForm(prev => ({ ...prev, pincode: e.target.value }))}
                  className="form-input"
                  style={{ fontSize: '12.5px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateAddressModal(false)}
                  disabled={creatingAddress}
                  style={{ fontSize: '12px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creatingAddress}
                  style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0a6c66', borderColor: '#0a6c66' }}
                >
                  {creatingAddress ? (
                    <>
                      <Loader2 size={13} className="spin" />
                      <span>Saving to ERPNext...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={13} />
                      <span>Create & Link Address</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Receipt Modal */}
      {activeReceipt && (() => {
        const doc = (invoiceDetailsExtra?.rawDoc?.name === activeReceipt.id)
          ? invoiceDetailsExtra.rawDoc
          : (activeReceipt?.rawDoc || null);

        const activeCurrency = doc?.currency || invoiceDetailsExtra?.currency || companyDetails.currency || 'FJD';

        const itemsList = (doc?.items && doc.items.length > 0)
          ? doc.items
          : (invoiceDetailsExtra?.billingItems && invoiceDetailsExtra.billingItems.length > 0)
            ? invoiceDetailsExtra.billingItems
            : [
              {
                item_code: activeReceipt.propertyId || 'Rent',
                item_name: 'Property Rent / Lease Space',
                qty: 1,
                rate: activeReceipt.amount,
                amount: activeReceipt.amount
              }
            ];

        const taxesList = (doc?.taxes && doc.taxes.length > 0)
          ? doc.taxes
          : (invoiceDetailsExtra?.taxes && invoiceDetailsExtra.taxes.length > 0)
            ? invoiceDetailsExtra.taxes
            : [];

        const netTotal = doc?.net_total ?? doc?.total ?? activeReceipt.amount;
        const totalTaxes = doc?.total_taxes_and_charges ?? (taxesList.reduce((sum, t) => sum + (Number(t.tax_amount) || 0), 0));
        const roundingAdjustment = doc?.rounding_adjustment != null ? Number(doc.rounding_adjustment) : 0;
        const grandTotal = doc?.rounded_total ?? doc?.grand_total ?? (Number(netTotal) + Number(totalTaxes) + roundingAdjustment);
        const outstandingAmount = doc?.outstanding_amount !== undefined ? Number(doc.outstanding_amount) : (activeReceipt.status === 'paid' ? 0 : grandTotal);

        const words = doc?.in_words || activeReceipt?.in_words || numberToWords(Math.round(grandTotal), activeCurrency);
        const displayStatus = (doc?.status || activeReceipt.status || 'Draft').toUpperCase();

        const getBillingPeriod = () => {
          if (doc?.start_date && doc?.end_date) {
            return `${formatInvoiceDate(doc.start_date)} - ${formatInvoiceDate(doc.end_date)}`;
          }
          if (activeReceipt.startDate && activeReceipt.endDate) {
            return `${formatInvoiceDate(activeReceipt.startDate)} - ${formatInvoiceDate(activeReceipt.endDate)}`;
          }
          if (activeReceipt.issuedDate) {
            const d = new Date(activeReceipt.issuedDate);
            if (!isNaN(d.getTime())) {
              const year = d.getFullYear();
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              const month = monthNames[d.getMonth()];
              const lastDay = new Date(year, d.getMonth() + 1, 0).getDate();
              return `01 ${month} ${year} - ${lastDay} ${month} ${year}`;
            }
          }
          return 'N/A';
        };

        return (
          <div className="modal-overlay">
            <div className="modal-content" style={{ position: 'relative', maxWidth: 650, padding: 30, background: '#ffffff', color: '#111827', borderRadius: 'var(--radius-lg)' }}>

              <button
                onClick={() => setActiveReceipt(null)}
                style={{ position: 'absolute', top: 12, right: 12, background: '#f3f4f6', border: 'none', borderRadius: '50%', color: '#374151', cursor: 'pointer', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}
                title="Close"
              >
                ×
              </button>

              {/* TOP HEADER SECTION */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: 14, marginBottom: 16 }}>
                {/* Top Left: Logo & Owner Details */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <svg viewBox="0 0 100 100" style={{ width: 42, height: 42, minWidth: 42, borderRadius: 6, display: 'inline-block' }}>
                    <rect width="100" height="100" fill="#000000" rx="12" />
                    <circle cx="50" cy="50" r="36" fill="#FFDD00" />
                    <polygon points="50,50 86,14 100,14 100,86 86,86" fill="#000000" />
                    <line x1="24" y1="76" x2="50" y2="50" stroke="#000000" strokeWidth="5.5" strokeLinecap="round" />
                  </svg>
                  <div style={{ fontSize: 10, color: '#4b5563', lineHeight: 1.3 }}>
                    <h4 style={{ color: '#111827', fontWeight: 800, fontSize: 14, marginBottom: 4, letterSpacing: '0.02em' }}>
                      {doc?.company || companyDetails.name || 'CARPENTERS PROPERTIES PTE LIMITED'}
                    </h4>
                    {renderAddressDisplay(doc?.company_address_display, companyDetails.address || '40 Robertson Road, Suva, Fiji')}
                    <p style={{ marginTop: 2 }}>Tel: {companyDetails.phone || '+679-2341897'}</p>
                    <p>Email: {companyDetails.email || 'info@carpentersproperties.com'}</p>
                    <p>{companyDetails.website || 'www.carpentersproperties.com'}</p>
                  </div>
                </div>

                {/* Top Right: Invoice Details */}
                <div style={{ textAlign: 'right', fontSize: 11, color: '#4b5563', lineHeight: 1.4 }}>
                  <h3 style={{ color: '#111827', fontWeight: 800, fontSize: 18, margin: '0 0 8px 0', letterSpacing: '0.03em' }}>TAX INVOICE</h3>
                  <p><span style={{ color: '#6b7280' }}>Invoice No:</span> &nbsp;<strong>{doc?.name || activeReceipt.id}</strong></p>
                  <p><span style={{ color: '#6b7280' }}>Date:</span> &nbsp;{formatInvoiceDate(doc?.posting_date || activeReceipt.issuedDate)}</p>
                  <p><span style={{ color: '#6b7280' }}>Due Date:</span> &nbsp;{formatInvoiceDate(doc?.due_date || activeReceipt.dueDate)}</p>
                  <p style={{ marginTop: 6 }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 10,
                      fontSize: 8,
                      fontWeight: 700,
                      backgroundColor: displayStatus === 'PAID' ? '#d1fae5' : displayStatus === 'DRAFT' ? '#e0f2fe' : '#fef3c7',
                      color: displayStatus === 'PAID' ? '#065f46' : displayStatus === 'DRAFT' ? '#0369a1' : '#92400e'
                    }}>
                      {displayStatus}
                    </span>
                  </p>
                </div>
              </div>

              {/* BILL TO & PROPERTY ADDRESS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, fontSize: 10, paddingBottom: 14, marginBottom: 14 }}>
                <div>
                  <span style={{ color: '#6b7280', textTransform: 'uppercase', display: 'block', fontWeight: 700, fontSize: 9, marginBottom: 4 }}>BILL TO</span>
                  <span style={{ display: 'block', color: '#111827', fontWeight: 700, fontSize: 12, marginBottom: 2 }}>
                    {doc?.customer_name || activeReceipt.tenantName || 'Tenant'}
                  </span>
                  {(doc?.customer || activeReceipt.customer) && (
                    <div style={{ fontSize: 9, color: '#6b7280', marginBottom: 4 }}>
                      Customer Code: <strong>{doc?.customer || activeReceipt.customer}</strong>
                    </div>
                  )}
                  <div style={{ color: '#4b5563', lineHeight: 1.35 }}>
                    {renderAddressDisplay(doc?.address_display, invoiceDetailsExtra?.customerAddress || 'Suva, Fiji')}
                  </div>
                </div>

                <div>
                  <span style={{ color: '#6b7280', textTransform: 'uppercase', display: 'block', fontWeight: 700, fontSize: 9, marginBottom: 4 }}>PROPERTY & LEASE DETAILS</span>
                  <strong style={{ fontSize: 11, color: '#111827', display: 'block', marginBottom: 2 }}>
                    {invoiceDetailsExtra?.unitName || (doc?.items && doc.items[0]?.item_code) || activeReceipt.propertyId}
                  </strong>
                  <p style={{ color: '#4b5563', lineHeight: 1.3, marginBottom: 4 }}>
                    {invoiceDetailsExtra?.unitAddress || 'Carpenters Properties, Suva, Fiji'}
                  </p>
                  {(doc?.booking_id || activeReceipt.booking_id) && (
                    <div style={{ fontSize: 9, color: '#374151', marginBottom: 2 }}>
                      <span style={{ color: '#6b7280' }}>Booking Ref:</span> &nbsp;
                      <strong style={{ color: 'var(--brand-color, #111827)' }}>{doc?.booking_id || activeReceipt.booking_id}</strong>
                    </div>
                  )}
                  <div style={{ fontSize: 9, color: '#374151' }}>
                    <span style={{ color: '#6b7280' }}>Billing Period:</span> &nbsp;
                    <strong>{getBillingPeriod()}</strong>
                  </div>
                </div>
              </div>

              {/* MIDDLE: LINE ITEMS TABLE */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#1f2937', color: '#ffffff', borderBottom: '1px solid #374151' }}>
                      <th style={{ padding: '8px 10px', color: '#ffffff' }}>Item & Description</th>
                      <th style={{ padding: '8px 10px', color: '#ffffff', textAlign: 'center', width: 50 }}>Qty</th>
                      <th style={{ padding: '8px 10px', color: '#ffffff', textAlign: 'right', width: 90 }}>Rate</th>
                      <th style={{ padding: '8px 10px', color: '#ffffff', textAlign: 'right', width: 100 }}>Amount ({activeCurrency})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsList.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '8px 10px', color: '#111827' }}>
                          <div style={{ fontWeight: 600 }}>{item.item_name || item.item_code}</div>
                          {item.description && item.description !== item.item_name && item.description !== item.item_code && (
                            <div style={{ fontSize: 9, color: '#6b7280', marginTop: 1 }}>{item.description}</div>
                          )}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', color: '#4b5563' }}>
                          {item.qty || 1}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', color: '#4b5563' }}>
                          $ {(Number(item.rate || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>
                          $ {(Number(item.amount != null ? item.amount : ((item.qty || 1) * (item.rate || 0)))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}

                    {/* Subtotal */}
                    <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                      <td colSpan="3" style={{ padding: '8px 10px', color: '#374151', fontWeight: 600, textAlign: 'right' }}>
                        Net Total / Subtotal
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#374151' }}>
                        $ {Number(netTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>

                    {/* Taxes Breakdown */}
                    {taxesList.length > 0 ? (
                      taxesList.map((tax, tIdx) => (
                        <tr key={tIdx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td colSpan="3" style={{ padding: '6px 10px', color: '#4b5563', fontWeight: 500, textAlign: 'right' }}>
                            {tax.description || tax.account_head || 'VAT / Tax'} {tax.rate ? `(${tax.rate}%)` : ''}
                          </td>
                          <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 600, color: '#4b5563' }}>
                            $ {(Number(tax.tax_amount || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    ) : totalTaxes > 0 ? (
                      <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td colSpan="3" style={{ padding: '6px 10px', color: '#4b5563', fontWeight: 500, textAlign: 'right' }}>
                          Taxes & Charges (12.5%)
                        </td>
                        <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 600, color: '#4b5563' }}>
                          $ {Number(totalTaxes).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ) : null}

                    {/* Rounding Adjustment */}
                    {roundingAdjustment !== 0 && (
                      <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td colSpan="3" style={{ padding: '4px 10px', color: '#6b7280', fontSize: 9, textAlign: 'right' }}>
                          Rounding Adjustment
                        </td>
                        <td style={{ padding: '4px 10px', textAlign: 'right', fontSize: 9, color: '#6b7280' }}>
                          $ {roundingAdjustment.toFixed(2)}
                        </td>
                      </tr>
                    )}

                    {/* Total Amount Due */}
                    <tr style={{ background: '#f3f4f6', borderTop: '2px solid #e5e7eb' }}>
                      <td colSpan="3" style={{ padding: '8px 10px', fontWeight: 800, color: '#111827', textAlign: 'right' }}>
                        Total Amount Due ({activeCurrency})
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#111827', fontSize: 11 }}>
                        $ {Number(grandTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>

                    {/* Outstanding Balance */}
                    {displayStatus === 'PAID' || outstandingAmount === 0 ? (
                      <tr style={{ background: '#ecfdf5', borderTop: '1px solid #d1fae5' }}>
                        <td colSpan="3" style={{ padding: '6px 10px', fontWeight: 700, color: '#065f46', textAlign: 'right' }}>
                          Balance Outstanding (Paid)
                        </td>
                        <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 700, color: '#065f46', fontSize: 10 }}>
                          $ 0.00
                        </td>
                      </tr>
                    ) : outstandingAmount > 0 && outstandingAmount !== grandTotal ? (
                      <tr style={{ background: '#fffbeb', borderTop: '1px solid #fef3c7' }}>
                        <td colSpan="3" style={{ padding: '6px 10px', fontWeight: 700, color: '#92400e', textAlign: 'right' }}>
                          Outstanding Balance Due
                        </td>
                        <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 700, color: '#92400e', fontSize: 10 }}>
                          $ {Number(outstandingAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              {/* AMOUNT IN WORDS */}
              <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: 4, fontSize: 10, color: '#374151', borderLeft: '3px solid #1f2937', marginBottom: 16 }}>
                <span style={{ fontWeight: 700, textTransform: 'uppercase', display: 'block', fontSize: 8, color: '#6b7280', marginBottom: 2 }}>Amount in Words:</span>
                <strong>{words}</strong>
              </div>

              {/* BOTTOM SECTION: BANK & TERMS & QR */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, borderTop: '1px solid #e5e7eb', paddingTop: 14, fontSize: 9, color: '#4b5563', lineHeight: 1.4, marginBottom: 20 }}>
                {/* Payment Info & Bank Details */}
                <div>
                  <strong style={{ color: '#111827', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>PAYMENT INFORMATION</strong>
                  <p style={{ marginBottom: 6 }}>Please make payment by {formatInvoiceDate(doc?.due_date || activeReceipt.dueDate)} to the following account:</p>
                  <p><span style={{ color: '#6b7280' }}>Bank Name:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Bank of South Pacific (BSP) / ANZ Fiji</strong></p>
                  <p><span style={{ color: '#6b7280' }}>Account Name:</span> &nbsp;&nbsp; <strong>{doc?.company || companyDetails.name || 'Carpenters Properties Pte Limited'}</strong></p>
                  <p><span style={{ color: '#6b7280' }}>Account Number:</span> <strong>9801234567</strong></p>
                  <p><span style={{ color: '#6b7280' }}>Swift Code:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>BOSPFJ22</strong></p>

                  <p style={{ marginTop: 12, fontStyle: 'italic', fontSize: 8, color: '#6b7280' }}>
                    Thank you for your business.<br />
                    This is a computer-generated invoice. No signature is required.
                  </p>
                </div>

                {/* Scan to Pay QR */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid #e5e7eb', paddingLeft: 20 }}>
                  <span style={{ fontSize: 9, color: '#111827', marginBottom: 6, textTransform: 'uppercase', fontWeight: 700 }}>SCAN TO PAY</span>
                  <svg viewBox="0 0 100 100" style={{ width: 64, height: 64 }}>
                    <rect width="100" height="100" fill="#ffffff" />
                    <rect x="5" y="5" width="25" height="25" fill="#000000" />
                    <rect x="8" y="8" width="19" height="19" fill="#ffffff" />
                    <rect x="11" y="11" width="13" height="13" fill="#000000" />
                    <rect x="70" y="5" width="25" height="25" fill="#000000" />
                    <rect x="73" y="8" width="19" height="19" fill="#ffffff" />
                    <rect x="76" y="11" width="13" height="13" fill="#000000" />
                    <rect x="5" y="70" width="25" height="25" fill="#000000" />
                    <rect x="8" y="73" width="19" height="19" fill="#ffffff" />
                    <rect x="11" y="76" width="13" height="13" fill="#000000" />
                    <rect x="35" y="10" width="5" height="5" fill="#000000" />
                    <rect x="45" y="15" width="10" height="5" fill="#000000" />
                    <rect x="35" y="25" width="15" height="5" fill="#000000" />
                    <rect x="55" y="25" width="5" height="10" fill="#000000" />
                    <rect x="25" y="35" width="10" height="10" fill="#000000" />
                    <rect x="50" y="35" width="10" height="5" fill="#000000" />
                    <rect x="15" y="45" width="5" height="15" fill="#000000" />
                    <rect x="35" y="50" width="15" height="5" fill="#000000" />
                    <rect x="65" y="40" width="15" height="10" fill="#000000" />
                    <rect x="45" y="65" width="10" height="5" fill="#000000" />
                    <rect x="60" y="60" width="20" height="5" fill="#000000" />
                    <rect x="80" y="70" width="10" height="15" fill="#000000" />
                  </svg>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1, borderColor: '#d1d5db', color: '#374151', background: '#f9fafb', fontSize: 11 }}
                  onClick={() => handlePrint(activeReceipt)}
                >
                  Download PDF / Print
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, background: '#ffdd00', color: '#000000', fontSize: 11 }}
                  onClick={() => setActiveReceipt(null)}
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
