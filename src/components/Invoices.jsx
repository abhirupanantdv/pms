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

export default function Invoices({ invoices, accounts = [], glEntries = [], onAddInvoice, onRecordPayment, erpnextConfig, tenants = [], properties = [], bookings = [] }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGLModal, setShowGLModal] = useState(false); // General Ledger & Trial Balance modal
  const [selectedInvoice, setSelectedInvoice] = useState(invoices[0] || null); // Default select first invoice
  const [showTerms, setShowTerms] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({
    name: 'CARPENTERS PROPERTIES PTE LTD',
    address: '123 Cecil Street, #08-01, Singapore 069537',
    phone: '+65 6123 4567',
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
    posting_date: getTodayStr(),
    due_date: getDefaultDueDate(),
    company: 'CARPENTERS PROPERTIES PTE LIMITED',
    currency: 'FJD',
    cost_center: 'Main - CFPL',
    debit_to: 'Debtors - CFPL',
    against_income_account: 'Sales - CFPL',
    selling_price_list: 'Standard Selling For Property Management',
    taxes_and_charges: 'Fiji Tax',
    additional_discount_percentage: 0,
    discount_amount: 0,
    po_no: ''
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

  const initialItems = [
    {
      item_code: 'Gb009',
      item_name: 'Gb009',
      description: 'Gb009 - Commercial Space Rent',
      qty: 1,
      rate: 10000,
      amount: 10000,
      stock_uom: 'Sq Ft',
      uom: 'Sq Ft',
      income_account: 'Sales - CFPL',
      expense_account: 'Cost of Goods Sold - CFPL',
      cost_center: 'Main - CFPL'
    }
  ];

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
        const res = await fetch(`${erpnextConfig.url}/api/resource/Sales%20Invoice/${targetInvoice.id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (res.ok && isMounted) {
          const json = await res.json();
          const doc = json.data || json;
          const itemCode = (doc.items && doc.items.length > 0) ? doc.items[0].item_code : null;

          let unitAddressStr = '10 Anson Road, #15-02, International Plaza, Singapore 079903';
          let unitNameStr = targetInvoice.propertyId || 'Unit-N/A';
          let customerAddressStr = '10 Anson Road, #15-02, International Plaza, Singapore 079903';

          // 1. Fetch Customer address
          const customerId = doc.customer || targetInvoice.tenantName;
          if (customerId) {
            try {
              const custRes = await fetch(`${erpnextConfig.url}/api/resource/Address?filters=[["Dynamic Link", "link_doctype", "=", "Customer"], ["Dynamic Link", "link_name", "=", "${customerId}"]]&fields=["address_line1","address_line2","city","state","country","pincode"]`, {
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
              unitName: unitNameStr,
              unitAddress: unitAddressStr,
              customerAddress: customerAddressStr,
              currency: doc.currency || 'SGD',
              billingItems: doc.items || []
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
  }, [selectedInvoice, activeReceipt, erpnextConfig]);

  // Pagination states & calculations
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = selectedInvoice ? 6 : 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [invoices.length]);

  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = invoices.slice(indexOfFirstItem, indexOfLastItem);

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
    if (!doctype || !erpnextConfig?.url || linkOptionsCache[doctype]) return;
    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/${encodeURIComponent(doctype)}?fields=["name"]&limit_page_length=500`, {
        credentials: 'include',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' })
      });
      if (res.ok) {
        const json = await res.json();
        const list = json.data || json || [];
        if (Array.isArray(list)) {
          setLinkOptionsCache(prev => ({
            ...prev,
            [doctype]: list.map(it => it.name).filter(Boolean)
          }));
        }
      }
    } catch (err) {
      console.warn(`Could not fetch link options for ${doctype}:`, err);
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
      fetchLinkOptions('Sales Taxes and Charges Template');
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
      customer_address: `${custObj.customerId}-Billing`,
      booking_id: bookingId
    }));

    if (bookingId) {
      handleBookingSelect(bookingId);
    } else {
      setItems([]);
    }

    setCustomerDropdownOpen(false);
    setCustomerSearchQuery('');
  };

  // Handle smart selection of Booking ID using ERPNext Booking child table logic
  const handleBookingSelect = async (bookingId) => {
    if (!bookingId) {
      setFormValues(prev => ({ ...prev, booking_id: '' }));
      setItems([]);
      return;
    }

    setFormValues(prev => ({ ...prev, booking_id: bookingId }));

    const matchedBooking = mergedBookings.find(b => b.name === bookingId || b.id === bookingId);
    if (matchedBooking) {
      const custVal = matchedBooking.customer || matchedBooking.tenantName || '';
      const custName = matchedBooking.customer_name || custVal;
      setFormValues(prev => ({
        ...prev,
        customer: custVal || prev.customer,
        customer_name: custName || prev.customer_name,
        customer_address: custVal ? `${custVal}-Billing` : prev.customer_address
      }));
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

      if (response.customer) {
        setFormValues(prev => ({
          ...prev,
          customer: response.customer,
          customer_name: response.customer_name || response.customer || prev.customer_name,
          customer_address: `${response.customer}-Billing`
        }));
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
      customer_address: custVal ? `${custVal}-Billing` : prev.customer_address
    }));
  };

  // Handle tax template selection with automatic ERPNext taxes population
  const handleTaxTemplateChange = async (templateName) => {
    setFormValues(prev => ({ ...prev, taxes_and_charges: templateName }));
    if (!templateName) return;

    if (erpnextConfig?.url) {
      try {
        const res = await fetch(`${erpnextConfig.url}/api/resource/Sales%20Taxes%20and%20Charges%20Template/${encodeURIComponent(templateName)}`, {
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

    if (templateName.toLowerCase().includes('fiji')) {
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
    if (items.length <= 1) {
      setItems([{
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
      }]);
      return;
    }
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
      alert('Please add at least one line item with an Item Code.');
      return;
    }

    setSubmittingInvoice(true);
    const { subtotal, netTotal, computedTaxes, totalTaxesAndCharges, grandTotal } = calculateTotals();

    const payload = {
      doctype: 'Sales Invoice',
      customer: formValues.customer,
      customer_name: formValues.customer_name || formValues.customer,
      customer_address: formValues.customer_address || undefined,
      company: 'CARPENTERS PROPERTIES PTE LIMITED',
      booking_id: formValues.booking_id || undefined,
      posting_date: formValues.posting_date || getTodayStr(),
      due_date: formValues.due_date || getTodayStr(),
      currency: 'FJD',
      cost_center: 'Main - CFPL',
      debit_to: 'Debtors - CFPL',
      against_income_account: 'Sales - CFPL',
      selling_price_list: 'Standard Selling For Property Management',
      taxes_and_charges: formValues.taxes_and_charges || 'Fiji Tax',
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
        item_code: it.item_code || 'Gb009',
        item_name: it.item_name || it.item_code || 'Gb009',
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
          console.warn('ERPNext Sales Invoice POST notice:', errorMsg);
          showToast(`ERPNext Note: ${errorMsg}`, 'info');
        }
      } catch (err) {
        console.warn('Network error posting Sales Invoice:', err);
      }
    }

    const finalName = createdDoc?.name || fallbackId;
    const newInv = {
      id: finalName,
      tenantName: formValues.customer_name || formValues.customer,
      customer: formValues.customer,
      propertyId: formValues.booking_id || (items[0]?.item_code) || 'Unit-N/A',
      amount: grandTotal,
      outstandingAmount: grandTotal,
      issuedDate: formValues.posting_date,
      dueDate: formValues.due_date,
      status: 'pending'
    };

    onAddInvoice(newInv);
    setSelectedInvoice(newInv);
    setShowAddModal(false);
    setFormValues(initialFormValues);
    setTaxes(initialTaxes);
    setSubmittingInvoice(false);
    showToast(`Sales Invoice ${finalName} successfully created!`, 'success');
  };

  const handlePrint = (invoice) => {
    setActiveReceipt(invoice);
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
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
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
                {currentItems.map(inv => (
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
                    <td style={{ fontWeight: 600 }}>${inv.amount.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${inv.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPaginationControls()}
        </div>

        {/* Selected Invoice PRINT FORMAT Panel (at right side) */}
        {selectedInvoice && (
          <div className="card-panel" style={{ padding: 24, background: '#ffffff', color: '#111827', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.2s ease-out', position: 'relative' }}>

            {/* Close details button */}
            <button
              onClick={() => setSelectedInvoice(null)}
              style={{ position: 'absolute', top: 12, right: 12, background: '#f3f4f6', border: 'none', borderRadius: '50%', color: '#374151', cursor: 'pointer', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
                  <h4 style={{ color: '#111827', fontWeight: 800, fontSize: 13, marginBottom: 4, letterSpacing: '0.02em' }}>{companyDetails.name}</h4>
                  <p>{companyDetails.address}</p>
                  <p>Tel: {companyDetails.phone || '+65 6123 4567'}</p>
                  <p>Email: {companyDetails.email || 'info@carpentersproperties.com'}</p>
                  <p>{companyDetails.website}</p>
                </div>
              </div>

              {/* Top Right: Invoice Details */}
              <div style={{ textAlign: 'right', fontSize: 11, color: '#4b5563', lineHeight: 1.4 }}>
                <h3 style={{ color: '#111827', fontWeight: 800, fontSize: 16, margin: '0 0 6px 0', letterSpacing: '0.03em' }}>TAX INVOICE</h3>
                <p><span style={{ color: '#6b7280' }}>Invoice Number</span> &nbsp;&nbsp; {selectedInvoice.id}</p>
                <p><span style={{ color: '#6b7280' }}>Date</span> &nbsp;&nbsp; {selectedInvoice.issuedDate}</p>
                <p style={{ marginTop: 6 }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 10,
                    fontSize: 9,
                    fontWeight: 700,
                    backgroundColor: selectedInvoice.status === 'paid' ? '#d1fae5' : '#fef3c7',
                    color: selectedInvoice.status === 'paid' ? '#065f46' : '#92400e'
                  }}>
                    {selectedInvoice.status.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>

            {/* BILL TO & PROPERTY ADDRESS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, fontSize: 10, paddingBottom: 10 }}>
              <div>
                <span style={{ color: '#6b7280', textTransform: 'uppercase', display: 'block', fontWeight: 700, fontSize: 9, marginBottom: 4 }}>BILL TO</span>
                <strong style={{ fontSize: 11, color: '#111827', display: 'block' }}>Tenant Name</strong>
                <span style={{ display: 'block', color: '#111827', fontWeight: 600, marginBottom: 4 }}>{selectedInvoice.tenantName}</span>
                <p style={{ color: '#4b5563', lineHeight: 1.3 }}>{invoiceDetailsExtra?.customerAddress || '10 Anson Road, #15-02, International Plaza, Singapore 079903'}</p>
              </div>
              <div>
                <span style={{ color: '#6b7280', textTransform: 'uppercase', display: 'block', fontWeight: 700, fontSize: 9, marginBottom: 4 }}>PROPERTY ADDRESS</span>
                <strong style={{ fontSize: 11, color: '#111827', display: 'block', marginBottom: 2 }}>{invoiceDetailsExtra?.unitName || selectedInvoice.propertyId}</strong>
                <p style={{ color: '#4b5563', lineHeight: 1.3 }}>{invoiceDetailsExtra?.unitAddress || '10 Anson Road, #15-02, International Plaza, Singapore 079903'}</p>
              </div>
            </div>

            {/* MIDDLE: LINE ITEMS TABLE */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
              {(() => {
                const getBillingPeriod = (dateStr) => {
                  if (!dateStr) return '01 Jun 2024 - 30 Jun 2024';
                  const d = new Date(dateStr);
                  if (isNaN(d.getTime())) return '01 Jun 2024 - 30 Jun 2024';
                  const year = d.getFullYear();
                  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  const month = monthNames[d.getMonth()];
                  const lastDay = new Date(year, d.getMonth() + 1, 0).getDate();
                  return `01 ${month} ${year} - ${lastDay} ${month} ${year}`;
                };
                const activeCurrency = invoiceDetailsExtra?.currency || companyDetails.currency || 'SGD';
                const baseRent = Math.round(selectedInvoice.amount * 0.8);
                const serviceCharge = Math.round(selectedInvoice.amount * 0.12);
                const propertyTax = Math.round(selectedInvoice.amount * 0.08);
                const vatVal = Math.round(selectedInvoice.amount * 0.125);
                const periodStr = getBillingPeriod(selectedInvoice.issuedDate);

                return (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#1f2937', color: '#ffffff', borderBottom: '1px solid #374151' }}>
                        <th style={{ padding: '8px 10px', color: '#ffffff' }}>Description</th>
                        <th style={{ padding: '8px 10px', color: '#ffffff' }}>Period</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right', color: '#ffffff' }}>Amount ({activeCurrency})</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '8px 10px', color: '#111827', fontWeight: 500 }}>Rent</td>
                        <td style={{ padding: '8px 10px', color: '#4b5563' }}>{periodStr}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>{baseRent.toLocaleString()}.00</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '8px 10px', color: '#111827', fontWeight: 500 }}>Service Charge</td>
                        <td style={{ padding: '8px 10px', color: '#4b5563' }}>{periodStr}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>{serviceCharge.toLocaleString()}.00</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '8px 10px', color: '#111827', fontWeight: 500 }}>Property Tax</td>
                        <td style={{ padding: '8px 10px', color: '#4b5563' }}>{periodStr}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>{propertyTax.toLocaleString()}.00</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                        <td colSpan="2" style={{ padding: '8px 10px', color: '#374151', fontWeight: 600, textAlign: 'right' }}>Subtotal</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#374151' }}>{selectedInvoice.amount.toLocaleString()}.00</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td colSpan="2" style={{ padding: '8px 10px', color: '#4b5563', fontWeight: 600, textAlign: 'right' }}>VAT (12.5%)</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>{vatVal.toLocaleString()}.00</td>
                      </tr>
                      <tr style={{ background: '#f3f4f6', borderTop: '2px solid #e5e7eb' }}>
                        <td colSpan="2" style={{ padding: '8px 10px', fontWeight: 800, color: '#111827', textAlign: 'right' }}>Total Amount Due ({activeCurrency})</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#111827', fontSize: 11 }}>{(selectedInvoice.amount + vatVal).toLocaleString()}.00</td>
                      </tr>
                    </tbody>
                  </table>
                );
              })()}
            </div>

            {/* AMOUNT IN WORDS */}
            <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: 4, fontSize: 10, color: '#374151', borderLeft: '3px solid #1f2937' }}>
              <span style={{ fontWeight: 700, textTransform: 'uppercase', display: 'block', fontSize: 8, color: '#6b7280', marginBottom: 2 }}>Amount in Words:</span>
              <strong>{numberToWords(Math.round(selectedInvoice.amount * 1.125))}</strong>
            </div>

            {/* BOTTOM SECTION: BANK & TERMS & QR */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, borderTop: '1px solid #e5e7eb', paddingTop: 14, fontSize: 9, color: '#4b5563', lineHeight: 1.4 }}>
              {/* Payment Info & Bank Details */}
              <div>
                <strong style={{ color: '#111827', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>PAYMENT INFORMATION</strong>
                <p style={{ marginBottom: 6 }}>Please make payment by {selectedInvoice.dueDate} to the following account:</p>
                <p><span style={{ color: '#6b7280' }}>Bank Name:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>DBS Bank Ltd</strong></p>
                <p><span style={{ color: '#6b7280' }}>Account Name:</span> &nbsp;&nbsp; <strong>{companyDetails.name}</strong></p>
                <p><span style={{ color: '#6b7280' }}>Account Number:</span> <strong>123-456789-0</strong></p>
                <p><span style={{ color: '#6b7280' }}>Swift Code:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>DBSSGSGXXX</strong></p>

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

            {/* Terms and Conditions Collapsible - Statically Rendered */}
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-md)', padding: 12, fontSize: 9, color: '#4b5563' }}>
              <strong style={{ color: '#111827', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Terms & Conditions</strong>
              <p>1. Settle all invoice amounts within 10 days of the date of issue.</p>
              <p>2. Overdue payments will be charged interest at a rate of 1.5% per month.</p>
              <p>3. Payments are subject to standard Singapore Carpenters commercial tenant policies.</p>
              <p>4. Billing disputes must be raised in writing within 5 business days of receipt.</p>
            </div>

            {/* Action buttons */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {selectedInvoice.status === 'pending' && (
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
              {/* Hidden: Print button preserved per request */}
              {/* <button 
                className="btn btn-secondary" 
                style={{ flex: 1, minWidth: 100, fontSize: 11, gap: 6, borderColor: '#d1d5db', color: '#374151', background: '#f9fafb' }}
                onClick={() => handlePrint(selectedInvoice)}
              >
                <Printer size={13} /> Print Official PDF
              </button> */}
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
        )}
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
        const taxTemplateOptions = Array.from(new Set([
          ...(linkOptionsCache['Sales Taxes and Charges Template'] || []),
          'Fiji Tax',
          'Fiji Tax - CFPL'
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
                          <label className="form-label">Customer Address</label>
                          <input
                            type="text"
                            value={formValues.customer_address}
                            onChange={(e) => setFormValues(prev => ({ ...prev, customer_address: e.target.value }))}
                            placeholder="e.g. Arijit-Billing"
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
                                    No items found in selected booking. Please select an approved booking above to load items.
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
                        <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '12.5px', marginBottom: '6px' }}>
                          Sales Taxes and Charges Template
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            list="tax-template-options"
                            value={formValues.taxes_and_charges}
                            onChange={(e) => handleTaxTemplateChange(e.target.value)}
                            placeholder="e.g. Fiji Tax"
                            className="form-input"
                            style={{
                              background: 'var(--bg-primary)',
                              borderRadius: '6px',
                              fontWeight: 600,
                              fontSize: '13px',
                              padding: '8px 12px'
                            }}
                          />
                          <datalist id="tax-template-options">
                            {taxTemplateOptions.map(t => (
                              <option key={t} value={t} />
                            ))}
                          </datalist>
                        </div>
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

      {/* Print Receipt Modal */}
      {activeReceipt && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ position: 'relative', maxWidth: 650, padding: 30, background: '#ffffff', color: '#111827', borderRadius: 'var(--radius-lg)' }}>

            <button
              onClick={() => setActiveReceipt(null)}
              style={{ position: 'absolute', top: 12, right: 12, background: '#f3f4f6', border: 'none', borderRadius: '50%', color: '#374151', cursor: 'pointer', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}
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
                  <h4 style={{ color: '#111827', fontWeight: 800, fontSize: 14, marginBottom: 4, letterSpacing: '0.02em' }}>{companyDetails.name}</h4>
                  <p>{companyDetails.address}</p>
                  <p>Tel: {companyDetails.phone || '+65 6123 4567'}</p>
                  <p>Email: {companyDetails.email || 'info@carpentersproperties.com'}</p>
                  <p>{companyDetails.website}</p>
                </div>
              </div>

              {/* Top Right: Invoice Details */}
              <div style={{ textAlign: 'right', fontSize: 11, color: '#4b5563', lineHeight: 1.4 }}>
                <h3 style={{ color: '#111827', fontWeight: 800, fontSize: 18, margin: '0 0 8px 0', letterSpacing: '0.03em' }}>TAX INVOICE</h3>
                <p><span style={{ color: '#6b7280' }}>Invoice Number</span> &nbsp;&nbsp; {activeReceipt.id}</p>
                <p><span style={{ color: '#6b7280' }}>Date</span> &nbsp;&nbsp; {activeReceipt.issuedDate}</p>
                <p style={{ marginTop: 6 }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 10,
                    fontSize: 8,
                    fontWeight: 700,
                    backgroundColor: activeReceipt.status === 'paid' ? '#d1fae5' : '#fef3c7',
                    color: activeReceipt.status === 'paid' ? '#065f46' : '#92400e'
                  }}>
                    {activeReceipt.status.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>

            {/* BILL TO & PROPERTY ADDRESS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, fontSize: 10, paddingBottom: 14, marginBottom: 14 }}>
              <div>
                <span style={{ color: '#6b7280', textTransform: 'uppercase', display: 'block', fontWeight: 700, fontSize: 9, marginBottom: 4 }}>BILL TO</span>
                <strong style={{ fontSize: 11, color: '#111827', display: 'block' }}>Tenant Name</strong>
                <span style={{ display: 'block', color: '#111827', fontWeight: 600, marginBottom: 4 }}>{activeReceipt.tenantName}</span>
                <p style={{ color: '#4b5563', lineHeight: 1.3 }}>{invoiceDetailsExtra?.customerAddress || '10 Anson Road, #15-02, International Plaza, Singapore 079903'}</p>
              </div>
              <div>
                <span style={{ color: '#6b7280', textTransform: 'uppercase', display: 'block', fontWeight: 700, fontSize: 9, marginBottom: 4 }}>PROPERTY ADDRESS</span>
                <strong style={{ fontSize: 11, color: '#111827', display: 'block', marginBottom: 2 }}>{invoiceDetailsExtra?.unitName || activeReceipt.propertyId}</strong>
                <p style={{ color: '#4b5563', lineHeight: 1.3 }}>{invoiceDetailsExtra?.unitAddress || '10 Anson Road, #15-02, International Plaza, Singapore 079903'}</p>
              </div>
            </div>

            {/* MIDDLE: LINE ITEMS TABLE */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
              {(() => {
                const getBillingPeriod = (dateStr) => {
                  if (!dateStr) return '01 Jun 2024 - 30 Jun 2024';
                  const d = new Date(dateStr);
                  if (isNaN(d.getTime())) return '01 Jun 2024 - 30 Jun 2024';
                  const year = d.getFullYear();
                  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  const month = monthNames[d.getMonth()];
                  const lastDay = new Date(year, d.getMonth() + 1, 0).getDate();
                  return `01 ${month} ${year} - ${lastDay} ${month} ${year}`;
                };
                const activeCurrency = invoiceDetailsExtra?.currency || companyDetails.currency || 'SGD';
                const baseRent = Math.round(activeReceipt.amount * 0.8);
                const serviceCharge = Math.round(activeReceipt.amount * 0.12);
                const propertyTax = Math.round(activeReceipt.amount * 0.08);
                const gstVal = Math.round(activeReceipt.amount * 0.09);
                const periodStr = getBillingPeriod(activeReceipt.issuedDate);

                return (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#1f2937', color: '#ffffff', borderBottom: '1px solid #374151' }}>
                        <th style={{ padding: '8px 10px', color: '#ffffff' }}>Description</th>
                        <th style={{ padding: '8px 10px', color: '#ffffff' }}>Period</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right', color: '#ffffff' }}>Amount ({activeCurrency})</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '8px 10px', color: '#111827', fontWeight: 500 }}>Rent</td>
                        <td style={{ padding: '8px 10px', color: '#4b5563' }}>{periodStr}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>{baseRent.toLocaleString()}.00</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '8px 10px', color: '#111827', fontWeight: 500 }}>Service Charge</td>
                        <td style={{ padding: '8px 10px', color: '#4b5563' }}>{periodStr}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>{serviceCharge.toLocaleString()}.00</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '8px 10px', color: '#111827', fontWeight: 500 }}>Property Tax</td>
                        <td style={{ padding: '8px 10px', color: '#4b5563' }}>{periodStr}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>{propertyTax.toLocaleString()}.00</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                        <td colSpan="2" style={{ padding: '8px 10px', color: '#374151', fontWeight: 600, textAlign: 'right' }}>Subtotal</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#374151' }}>{activeReceipt.amount.toLocaleString()}.00</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td colSpan="2" style={{ padding: '8px 10px', color: '#4b5563', fontWeight: 600, textAlign: 'right' }}>VAT (12.5%)</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>{vatVal.toLocaleString()}.00</td>
                      </tr>
                      <tr style={{ background: '#f3f4f6', borderTop: '2px solid #e5e7eb' }}>
                        <td colSpan="2" style={{ padding: '8px 10px', fontWeight: 800, color: '#111827', textAlign: 'right' }}>Total Amount Due ({activeCurrency})</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#111827', fontSize: 11 }}>{(activeReceipt.amount + vatVal).toLocaleString()}.00</td>
                      </tr>
                    </tbody>
                  </table>
                );
              })()}
            </div>

            {/* AMOUNT IN WORDS */}
            <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: 4, fontSize: 10, color: '#374151', borderLeft: '3px solid #1f2937', marginBottom: 16 }}>
              <span style={{ fontWeight: 700, textTransform: 'uppercase', display: 'block', fontSize: 8, color: '#6b7280', marginBottom: 2 }}>Amount in Words:</span>
              <strong>{numberToWords(Math.round(activeReceipt.amount * 1.125))}</strong>
            </div>

            {/* BOTTOM SECTION: BANK & TERMS & QR */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, borderTop: '1px solid #e5e7eb', paddingTop: 14, fontSize: 9, color: '#4b5563', lineHeight: 1.4, marginBottom: 20 }}>
              {/* Payment Info & Bank Details */}
              <div>
                <strong style={{ color: '#111827', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>PAYMENT INFORMATION</strong>
                <p style={{ marginBottom: 6 }}>Please make payment by {activeReceipt.dueDate} to the following account:</p>
                <p><span style={{ color: '#6b7280' }}>Bank Name:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>DBS Bank Ltd</strong></p>
                <p><span style={{ color: '#6b7280' }}>Account Name:</span> &nbsp;&nbsp; <strong>{companyDetails.name}</strong></p>
                <p><span style={{ color: '#6b7280' }}>Account Number:</span> <strong>123-456789-0</strong></p>
                <p><span style={{ color: '#6b7280' }}>Swift Code:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>DBSSGSGXXX</strong></p>

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
              {/* Hidden: Print button preserved per request */}
              {/* <button 
                className="btn btn-secondary" 
                style={{ width: '100%', borderColor: '#d1d5db', color: '#374151', background: '#f9fafb', fontSize: 11 }}
                onClick={() => window.print()}
              >
                Download PDF / Print
              </button> */}
              <button
                className="btn btn-primary"
                style={{ width: '100%', background: '#ffdd00', color: '#000000', fontSize: 11 }}
                onClick={() => setActiveReceipt(null)}
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
