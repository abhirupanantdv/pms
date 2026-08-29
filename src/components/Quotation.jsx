// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { FileText, Plus, X, Search, CheckCircle2, AlertCircle, Edit, Trash2, Calendar, User, Building, Trash, Printer, ArrowUpRight } from 'lucide-react';

// // // // // const getCsrfToken = () => {
// // // // //   if (typeof window !== 'undefined' && window.csrf_token) {
// // // // //     return window.csrf_token;
// // // // //   }
// // // // //   if (typeof window !== 'undefined' && window.frappe && window.frappe.csrf_token) {
// // // // //     return window.frappe.csrf_token;
// // // // //   }
// // // // //   const value = `; ${document.cookie}`;
// // // // //   const parts = value.split(`; csrf_token=`);
// // // // //   if (parts.length === 2) return parts.pop().split(';').shift();
// // // // //   return '';
// // // // // };

// // // // // export default function Quotation({ erpnextConfig, properties = [] }) {
// // // // //   const [quotations, setQuotations] = useState([]);
// // // // //   const [customers, setCustomers] = useState([]);
// // // // //   const [propertyGroups, setPropertyGroups] = useState([]); // Linked to Property Group doctype in ERPNext
// // // // //   const [spaceUnits, setSpaceUnits] = useState([]); // Linked to Item doctype representing individual units
// // // // //   const [templates, setTemplates] = useState([]); // Quotation templates filtered by reference_type: Quotation
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [submitting, setSubmitting] = useState(false);
// // // // //   const [errorMsg, setErrorMsg] = useState('');
// // // // //   const [successMsg, setSuccessMsg] = useState('');

// // // // //   // Modals state
// // // // //   const [showAddModal, setShowAddModal] = useState(false);
// // // // //   const [selectedQuotation, setSelectedQuotation] = useState(null);
// // // // //   const [selectedQuotationDetail, setSelectedQuotationDetail] = useState(null);

// // // // //   // Form states
// // // // //   // Form states
// // // // //   const [quoteCustomer, setQuoteCustomer] = useState('');
// // // // //   const [quoteProperty, setQuoteProperty] = useState(''); // Parent property group
// // // // //   const [quoteDate, setQuoteDate] = useState(() => new Date().toISOString().split('T')[0]);
// // // // //   const [quoteValidTill, setQuoteValidTill] = useState(() => {
// // // // //     const d = new Date();
// // // // //     d.setDate(d.getDate() + 7);
// // // // //     return d.toISOString().split('T')[0];
// // // // //   });
// // // // //   const [quoteEstBookingStart, setQuoteEstBookingStart] = useState(() => {
// // // // //     const d = new Date();
// // // // //     d.setDate(d.getDate() + 7);
// // // // //     return d.toISOString().split('T')[0];
// // // // //   }); // Estimated Booking Start Date (from Valid Till date)
// // // // //   const [quoteEstBookingEnd, setQuoteEstBookingEnd] = useState(() => {
// // // // //     const d = new Date();
// // // // //     d.setDate(d.getDate() + 37); // 30 days from Est. Booking Start Date
// // // // //     return d.toISOString().split('T')[0];
// // // // //   });     // Estimated Booking End Date (30 days from Est. Booking Start Date)
// // // // //   const [quoteTemplate, setQuoteTemplate] = useState('');             // Quotation Template
// // // // //   const [quoteStatus, setQuoteStatus] = useState('Draft');
// // // // //   const [quoteCompany, setQuoteCompany] = useState('CARPENTERS PROPERTIES PTE LIMITED');
// // // // //   const [quoteItems, setQuoteItems] = useState([{ unitId: '', qty: 1, uom: '', standardRate: '', offeredRate: '' }]);
// // // // //   const [serviceItems, setServiceItems] = useState([{ serviceId: '', qty: 1, uom: 'Activity', standardRate: '', offeredRate: '' }]);

// // // // //   // Additional mock/service items list
// // // // //   const [servicesList, setServicesList] = useState([
// // // // //     { name: 'SRV-CLEAN', item_name: 'Janitorial/Cleaning Service', standard_rate: 150, stock_uom: 'Activity' },
// // // // //     { name: 'SRV-SEC', item_name: 'Security Patrol Guard', standard_rate: 250, stock_uom: 'Activity' },
// // // // //     { name: 'SRV-MAINT', item_name: 'Electrical Inspection/Maintenance Charge', standard_rate: 180, stock_uom: 'Activity' }
// // // // //   ]);

// // // // //   // Handle Quotation Date updates to cascade valid/booking dates
// // // // //   const handleQuoteDateChange = (val) => {
// // // // //     setQuoteDate(val);
// // // // //     const base = new Date(val);
// // // // //     if (!isNaN(base.getTime())) {
// // // // //       const valid = new Date(base);
// // // // //       valid.setDate(valid.getDate() + 7);
// // // // //       const validStr = valid.toISOString().split('T')[0];
// // // // //       setQuoteValidTill(validStr);
// // // // //       setQuoteEstBookingStart(validStr);

// // // // //       const end = new Date(valid);
// // // // //       end.setDate(end.getDate() + 30);
// // // // //       setQuoteEstBookingEnd(end.toISOString().split('T')[0]);
// // // // //     }
// // // // //   };

// // // // //   const handleValidTillChange = (val) => {
// // // // //     setQuoteValidTill(val);
// // // // //     setQuoteEstBookingStart(val);
// // // // //     const base = new Date(val);
// // // // //     if (!isNaN(base.getTime())) {
// // // // //       const end = new Date(base);
// // // // //       end.setDate(end.getDate() + 30);
// // // // //       setQuoteEstBookingEnd(end.toISOString().split('T')[0]);
// // // // //     }
// // // // //   };

// // // // //   const handleBookingStartChange = (val) => {
// // // // //     setQuoteEstBookingStart(val);
// // // // //     const base = new Date(val);
// // // // //     if (!isNaN(base.getTime())) {
// // // // //       const end = new Date(base);
// // // // //       end.setDate(end.getDate() + 30);
// // // // //       setQuoteEstBookingEnd(end.toISOString().split('T')[0]);
// // // // //     }
// // // // //   };

// // // // //   // Company Details (matching Invoice format)
// // // // //   const [companyDetails, setCompanyDetails] = useState({
// // // // //     name: 'CARPENTERS PROPERTIES PTE LTD',
// // // // //     address: '123 Cecil Street, #08-01, Singapore 069537',
// // // // //     phone: '+65 6123 4567',
// // // // //     email: 'info@carpentersproperties.com',
// // // // //     website: 'www.carpentersproperties.com',
// // // // //     currency: 'SGD'
// // // // //   });

// // // // //   // Selected Customer Address and Contact for current print view
// // // // //   const [customerAddress, setCustomerAddress] = useState('');
// // // // //   const [customerContact, setCustomerContact] = useState('');

// // // // //   // Fetch company details from ERPNext
// // // // //   useEffect(() => {
// // // // //     if (!erpnextConfig || !erpnextConfig.url) return;
// // // // //     const fetchCompany = async () => {
// // // // //       try {
// // // // //         const res = await fetch(`${erpnextConfig.url}/api/resource/Company/CARPENTERS PROPERTIES PTE LIMITED`, {
// // // // //           credentials: 'include',
// // // // //           headers: {
// // // // //             'Content-Type': 'application/json'
// // // // //           }
// // // // //         });
// // // // //         if (res.ok) {
// // // // //           const json = await res.json();
// // // // //           const doc = json.data || json;
// // // // //           setCompanyDetails(prev => ({
// // // // //             ...prev,
// // // // //             name: doc.name || prev.name,
// // // // //             currency: doc.default_currency || prev.currency,
// // // // //           }));

// // // // //           // Fetch Address
// // // // //           const addrRes = await fetch(`${erpnextConfig.url}/api/resource/Address?filters=[["Dynamic Link", "link_doctype", "=", "Company"], ["Dynamic Link", "link_name", "=", "${doc.name}"]]&fields=["address_line1","address_line2","city","state","country","pincode","phone","email_id"]`, {
// // // // //             credentials: 'include',
// // // // //             headers: {
// // // // //               'Content-Type': 'application/json'
// // // // //             }
// // // // //           });
// // // // //           if (addrRes.ok) {
// // // // //             const addrJson = await addrRes.json();
// // // // //             const addrList = addrJson.data || [];
// // // // //             if (addrList.length > 0) {
// // // // //               const addr = addrList[0];
// // // // //               const addrParts = [addr.address_line1, addr.address_line2, addr.city, addr.state, addr.country, addr.pincode].filter(Boolean);
// // // // //               setCompanyDetails(prev => ({
// // // // //                 ...prev,
// // // // //                 address: addrParts.join(', ') || prev.address,
// // // // //                 phone: addr.phone || prev.phone,
// // // // //                 email: addr.email_id || prev.email
// // // // //               }));
// // // // //             }
// // // // //           }
// // // // //         }
// // // // //       } catch (err) {
// // // // //         console.warn('Failed fetching company details:', err);
// // // // //       }
// // // // //     };
// // // // //     fetchCompany();
// // // // //   }, [erpnextConfig]);

// // // // //   // Fetch customers from ERPNext Doctype Customer
// // // // //   const fetchCustomersList = async () => {
// // // // //     if (!erpnextConfig || !erpnextConfig.url) return;
// // // // //     try {
// // // // //       const res = await fetch(`${erpnextConfig.url}/api/resource/Customer?fields=["name","customer_name"]&limit_page_length=200`, {
// // // // //         credentials: 'include',
// // // // //         headers: {
// // // // //           'Content-Type': 'application/json'
// // // // //         }
// // // // //       });
// // // // //       if (res.ok) {
// // // // //         const json = await res.json();
// // // // //         setCustomers(json.data || []);
// // // // //       }
// // // // //     } catch (e) {
// // // // //       console.warn('Failed fetching Customer list:', e);
// // // // //     }
// // // // //   };

// // // // //   // Fetch Property Groups from ERPNext Doctype Property Group
// // // // //   const fetchPropertyGroups = async () => {
// // // // //     if (!erpnextConfig || !erpnextConfig.url) return;
// // // // //     try {
// // // // //       const res = await fetch(`${erpnextConfig.url}/api/resource/Property%20Group?fields=["name"]&limit_page_length=200`, {
// // // // //         credentials: 'include',
// // // // //         headers: {
// // // // //           'Content-Type': 'application/json'
// // // // //         }
// // // // //       });
// // // // //       if (res.ok) {
// // // // //         const json = await res.json();
// // // // //         setPropertyGroups(json.data || []);
// // // // //       }
// // // // //     } catch (e) {
// // // // //       console.warn('Failed fetching Property Groups:', e);
// // // // //     }
// // // // //   };

// // // // //   // Fetch templates from ERPNext Doctype Template filtered by reference_type = "Quotation"
// // // // //   const fetchTemplatesList = async () => {
// // // // //     if (!erpnextConfig || !erpnextConfig.url) return;
// // // // //     try {
// // // // //       const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation%20Template?fields=["name"]&limit_page_length=200`, {
// // // // //         credentials: 'include',
// // // // //         headers: {
// // // // //           'Content-Type': 'application/json'
// // // // //         }
// // // // //       });
// // // // //       if (res.ok) {
// // // // //         const json = await res.json();
// // // // //         setTemplates(json.data || []);
// // // // //       }
// // // // //     } catch (e) {
// // // // //       console.warn('Failed fetching Templates list:', e);
// // // // //     }
// // // // //   };

// // // // //   // Fetch individual unit space / items from ERPNext Doctype Item
// // // // //   const fetchSpaceUnits = async (propertyGroupId) => {
// // // // //     if (!erpnextConfig || !erpnextConfig.url) return;
// // // // //     try {
// // // // //       let url = `${erpnextConfig.url}/api/resource/Item?fields=["name","item_name","standard_rate","valuation_rate","custom_property_reference","stock_uom"]&limit_page_length=300`;
// // // // //       if (propertyGroupId) {
// // // // //         url += `&filters=[["Item","custom_property_reference","=","${propertyGroupId}"]]`;
// // // // //       }
// // // // //       const res = await fetch(url, {
// // // // //         credentials: 'include',
// // // // //         headers: {
// // // // //           'Content-Type': 'application/json'
// // // // //         }
// // // // //       });
// // // // //       if (res.ok) {
// // // // //         const json = await res.json();
// // // // //         setSpaceUnits(json.data || []);
// // // // //       }
// // // // //     } catch (e) {
// // // // //       console.warn('Failed fetching Space Units (Items):', e);
// // // // //     }
// // // // //   };

// // // // //   // Fetch quotations from ERPNext
// // // // //   const fetchQuotations = async () => {
// // // // //     if (!erpnextConfig || !erpnextConfig.url) {
// // // // //       setQuotations([
// // // // //         { name: 'QTN-2026-00001', customer_name: 'Sarah Jenkins', transaction_date: '2026-06-01', valid_till: '2026-06-30', grand_total: 6200, status: 'Submitted' },
// // // // //         { name: 'QTN-2026-00002', customer_name: 'John Doe', transaction_date: '2026-06-05', valid_till: '2026-07-05', grand_total: 4500, status: 'Draft' }
// // // // //       ]);
// // // // //       return;
// // // // //     }
// // // // //     setLoading(true);
// // // // //     try {
// // // // //       const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation?fields=["name","customer_name","party_name","transaction_date","valid_till","grand_total","status"]&limit_page_length=100`, {
// // // // //         credentials: 'include',
// // // // //         headers: {
// // // // //           'Content-Type': 'application/json'
// // // // //         }
// // // // //       });
// // // // //       if (res.ok) {
// // // // //         const json = await res.json();
// // // // //         setQuotations(json.data || []);
// // // // //       }
// // // // //     } catch (e) {
// // // // //       console.warn('Failed fetching quotations:', e);
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     fetchQuotations();
// // // // //     fetchCustomersList();
// // // // //     fetchPropertyGroups();
// // // // //     fetchSpaceUnits();
// // // // //     fetchTemplatesList();
// // // // //   }, [erpnextConfig]);

// // // // //   // Load space units when parent Property selection changes
// // // // //   useEffect(() => {
// // // // //     if (quoteProperty) {
// // // // //       fetchSpaceUnits(quoteProperty);
// // // // //     } else {
// // // // //       fetchSpaceUnits();
// // // // //     }
// // // // //   }, [quoteProperty]);

// // // // //   // Handle detailed Quotation view & retrieve client CRM metadata
// // // // //   const fetchQuotationDetail = async (qName, customerId) => {
// // // // //     if (!erpnextConfig || !erpnextConfig.url) return;
// // // // //     try {
// // // // //       const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${qName}`, {
// // // // //         credentials: 'include',
// // // // //         headers: {
// // // // //           'Content-Type': 'application/json'
// // // // //         }
// // // // //       });
// // // // //       if (res.ok) {
// // // // //         const json = await res.json();
// // // // //         const doc = json.data || json;
// // // // //         setSelectedQuotationDetail(doc);

// // // // //         // Fetch Customer Address & Contact
// // // // //         const actualCustomer = customerId || doc.party_name || doc.customer;
// // // // //         if (actualCustomer) {
// // // // //           // Fetch Address linked to customer
// // // // //           const addrRes = await fetch(`${erpnextConfig.url}/api/resource/Address?filters=[["Dynamic Link", "link_doctype", "=", "Customer"], ["Dynamic Link", "link_name", "=", "${actualCustomer}"]]&fields=["address_line1","address_line2","city","state","country","pincode"]`, {
// // // // //             credentials: 'include',
// // // // //             headers: {
// // // // //               'Content-Type': 'application/json'
// // // // //             }
// // // // //           });
// // // // //           if (addrRes.ok) {
// // // // //             const addrJson = await addrRes.json();
// // // // //             const addrList = addrJson.data || [];
// // // // //             if (addrList.length > 0) {
// // // // //               const addr = addrList[0];
// // // // //               setCustomerAddress([addr.address_line1, addr.address_line2, addr.city, addr.state, addr.country, addr.pincode].filter(Boolean).join(', '));
// // // // //             } else {
// // // // //               setCustomerAddress('Registered Address not specified');
// // // // //             }
// // // // //           }

// // // // //           // Fetch Contact linked to customer
// // // // //           const contactRes = await fetch(`${erpnextConfig.url}/api/resource/Contact?filters=[["Dynamic Link", "link_doctype", "=", "Customer"], ["Dynamic Link", "link_name", "=", "${actualCustomer}"]]&fields=["email_id","phone"]`, {
// // // // //             credentials: 'include',
// // // // //             headers: {
// // // // //               'Content-Type': 'application/json'
// // // // //             }
// // // // //           });
// // // // //           if (contactRes.ok) {
// // // // //             const contactJson = await contactRes.json();
// // // // //             const contactList = contactJson.data || [];
// // // // //             if (contactList.length > 0) {
// // // // //               const ct = contactList[0];
// // // // //               setCustomerContact([ct.email_id, ct.phone].filter(Boolean).join(' | '));
// // // // //             } else {
// // // // //               setCustomerContact('Contact info not specified');
// // // // //             }
// // // // //           }
// // // // //         }
// // // // //       }
// // // // //     } catch (e) {
// // // // //       console.warn('Failed fetching quotation detail:', e);
// // // // //     }
// // // // //   };

// // // // //   const handleRowClick = (quote) => {
// // // // //     setSelectedQuotation(quote);
// // // // //     fetchQuotationDetail(quote.name, quote.party_name || quote.customer);
// // // // //   };

// // // // //   // Form helpers
// // // // //   const addQuoteItem = () => {
// // // // //     setQuoteItems([...quoteItems, { unitId: '', qty: 1, uom: '', standardRate: '', offeredRate: '' }]);
// // // // //   };

// // // // //   const removeQuoteItem = (index) => {
// // // // //     const updated = [...quoteItems];
// // // // //     updated.splice(index, 1);
// // // // //     setQuoteItems(updated);
// // // // //   };

// // // // //   const handleItemChange = (index, field, value) => {
// // // // //     const updated = [...quoteItems];
// // // // //     updated[index][field] = value;

// // // // //     // Auto-populate rate & UOM if unit / item matches
// // // // //     if (field === 'unitId') {
// // // // //       const matched = spaceUnits.find(u => u.name === value);
// // // // //       if (matched) {
// // // // //         // Valuation rate is mapped as the Standard Rate
// // // // //         const valRate = matched.valuation_rate || matched.standard_rate || 0;
// // // // //         updated[index].standardRate = valRate;
// // // // //         updated[index].offeredRate = valRate;
// // // // //         updated[index].uom = matched.stock_uom || 'Unit';
// // // // //       }
// // // // //     }
// // // // //     setQuoteItems(updated);
// // // // //   };

// // // // //   // Service Form helpers
// // // // //   const addServiceItem = () => {
// // // // //     setServiceItems([...serviceItems, { serviceId: '', qty: 1, uom: 'Activity', standardRate: '', offeredRate: '' }]);
// // // // //   };

// // // // //   const removeServiceItem = (index) => {
// // // // //     const updated = [...serviceItems];
// // // // //     updated.splice(index, 1);
// // // // //     setServiceItems(updated);
// // // // //   };

// // // // //   const handleServiceChange = (index, field, value) => {
// // // // //     const updated = [...serviceItems];
// // // // //     updated[index][field] = value;
// // // // //     if (field === 'serviceId') {
// // // // //       const matched = servicesList.find(s => s.name === value);
// // // // //       if (matched) {
// // // // //         const valRate = matched.standard_rate || 0;
// // // // //         updated[index].standardRate = valRate;
// // // // //         updated[index].offeredRate = valRate;
// // // // //         updated[index].uom = matched.stock_uom || 'Activity';
// // // // //       }
// // // // //     }
// // // // //     setServiceItems(updated);
// // // // //   };

// // // // //   // Submit new Quotation
// // // // //   const handleCreateQuotation = async (e) => {
// // // // //     e.preventDefault();
// // // // //     if (!quoteCustomer || !quoteDate || !quoteValidTill) return;
// // // // //     setSubmitting(true);
// // // // //     setErrorMsg('');
// // // // //     setSuccessMsg('');

// // // // //     const matchedCust = customers.find(c => c.name === quoteCustomer);

// // // // //     const erpItems = quoteItems.filter(item => item.unitId).map(item => {
// // // // //       const matched = spaceUnits.find(u => u.name === item.unitId);
// // // // //       const standardRateNum = parseFloat(item.standardRate) || 0;
// // // // //       const offeredRateNum = parseFloat(item.offeredRate) || 0;

// // // // //       return {
// // // // //         item_code: item.unitId,
// // // // //         qty: parseFloat(item.qty) || 1,
// // // // //         rate: offeredRateNum,
// // // // //         price_list_rate: standardRateNum,
// // // // //         amount: (parseFloat(item.qty) || 1) * offeredRateNum, // Offered Rate mapped to Amount column
// // // // //         uom: item.uom || 'Unit',
// // // // //         item_name: matched ? matched.item_name : item.unitId
// // // // //       };
// // // // //     });

// // // // //     const erpServices = serviceItems.filter(item => item.serviceId).map(item => {
// // // // //       const matched = servicesList.find(s => s.name === item.serviceId);
// // // // //       const standardRateNum = parseFloat(item.standardRate) || 0;
// // // // //       const offeredRateNum = parseFloat(item.offeredRate) || 0;

// // // // //       return {
// // // // //         item_code: item.serviceId,
// // // // //         qty: parseFloat(item.qty) || 1,
// // // // //         rate: offeredRateNum,
// // // // //         price_list_rate: standardRateNum,
// // // // //         amount: (parseFloat(item.qty) || 1) * offeredRateNum,
// // // // //         uom: item.uom || 'Activity',
// // // // //         item_name: matched ? matched.item_name : item.serviceId
// // // // //       };
// // // // //     });

// // // // //     // Merge both child tables for item and post as quotation child item for erpnext
// // // // //     const mergedItems = [...erpItems, ...erpServices];

// // // // //     if (mergedItems.length === 0) {
// // // // //       setErrorMsg('You must add at least one Property Unit or Service Item.');
// // // // //       setSubmitting(false);
// // // // //       return;
// // // // //     }

// // // // //     const payload = {
// // // // //       customer: quoteCustomer,
// // // // //       party_name: quoteCustomer,
// // // // //       customer_name: matchedCust ? matchedCust.customer_name : quoteCustomer,
// // // // //       quotation_to: 'Customer',
// // // // //       transaction_date: quoteDate,
// // // // //       valid_till: quoteValidTill,
// // // // //       company: quoteCompany,
// // // // //       status: quoteStatus,
// // // // //       custom_property: quoteProperty || null, 
// // // // //       // Link fields matching exact custom field names in erpnext
// // // // //       custom_start_date: quoteEstBookingStart || null,
// // // // //       custom_end_date: quoteEstBookingEnd || null,
// // // // //       custom_template: quoteTemplate || null,
// // // // //       items: mergedItems
// // // // //     };

// // // // //     try {
// // // // //       if (erpnextConfig && erpnextConfig.url) {
// // // // //         const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation`, {
// // // // //           method: 'POST',
// // // // //           credentials: 'include',
// // // // //           headers: {
// // // // //             'Content-Type': 'application/json',
// // // // //             'X-Frappe-CSRF-Token': getCsrfToken()
// // // // //           },
// // // // //           body: JSON.stringify(payload)
// // // // //         });
// // // // //         if (!res.ok) {
// // // // //           const errData = await res.json();
// // // // //           let rawMsg = 'Failed to create quotation on server.';
// // // // //           if (errData._server_messages) {
// // // // //             try {
// // // // //               const msgs = JSON.parse(errData._server_messages);
// // // // //               const firstMsgObj = JSON.parse(msgs[0]);
// // // // //               rawMsg = firstMsgObj.message || rawMsg;
// // // // //             } catch (e) {
// // // // //               try {
// // // // //                 const msgs = JSON.parse(errData._server_messages);
// // // // //                 rawMsg = msgs[0] || rawMsg;
// // // // //               } catch (inner) {
// // // // //                 rawMsg = errData._server_messages;
// // // // //               }
// // // // //             }
// // // // //           } else if (errData.message) {
// // // // //             rawMsg = errData.message;
// // // // //           }
// // // // //           throw new Error(rawMsg);
// // // // //         }
// // // // //       }

// // // // //       setSuccessMsg('Quotation created successfully!');
// // // // //       fetchQuotations();
// // // // //       setShowAddModal(false);
// // // // //       // Reset form
// // // // //       setQuoteCustomer('');
// // // // //       setQuoteProperty('');
// // // // //       setQuoteTemplate('');
// // // // //       setQuoteItems([{ unitId: '', qty: 1, uom: '', standardRate: '', offeredRate: '' }]);
// // // // //       setServiceItems([{ serviceId: '', qty: 1, uom: 'Activity', standardRate: '', offeredRate: '' }]);
// // // // //     } catch (err) {
// // // // //       setErrorMsg(err.message);
// // // // //     } finally {
// // // // //       setSubmitting(false);
// // // // //     }
// // // // //   };

// // // // //   // Cancel Quotation Workflow (Sets status to 'Cancelled')
// // // // //   const handleCancelQuotation = async (qName) => {
// // // // //     if (!confirm(`Are you sure you want to cancel quotation ${qName}?`)) return;
// // // // //     setLoading(true);
// // // // //     try {
// // // // //       if (erpnextConfig && erpnextConfig.url) {
// // // // //         const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${qName}`, {
// // // // //           method: 'PUT',
// // // // //           credentials: 'include',
// // // // //           headers: {
// // // // //             'Content-Type': 'application/json'
// // // // //           },
// // // // //           body: JSON.stringify({ status: 'Cancelled' })
// // // // //         });
// // // // //         if (!res.ok) {
// // // // //           throw new Error('Failed to cancel quotation.');
// // // // //         }
// // // // //       }
// // // // //       setSelectedQuotation(null);
// // // // //       setSelectedQuotationDetail(null);
// // // // //       fetchQuotations();
// // // // //     } catch (e) {
// // // // //       alert(e.message);
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   // Amend Quotation Workflow (Revision logic)
// // // // //   const handleAmendQuotation = async () => {
// // // // //     if (!selectedQuotationDetail) return;
// // // // //     if (!confirm(`This action will Cancel the current quotation revision ${selectedQuotationDetail.name} and create a new editable draft. Proceed?`)) return;

// // // // //     setLoading(true);
// // // // //     setErrorMsg('');

// // // // //     try {
// // // // //       // 1. Cancel current revision
// // // // //       if (erpnextConfig && erpnextConfig.url) {
// // // // //         const cancelRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${selectedQuotationDetail.name}`, {
// // // // //           method: 'PUT',
// // // // //           credentials: 'include',
// // // // //       headers: {
// // // // //             'Content-Type': 'application/json'
// // // // //           },
// // // // //           body: JSON.stringify({ status: 'Cancelled' })
// // // // //         });
// // // // //         if (!cancelRes.ok) {
// // // // //           throw new Error('Failed to cancel the current version during amendment.');
// // // // //         }
// // // // //       }

// // // // //       // 2. Parse revision details & increment name revision tag
// // // // //       let currentRevisionCode = selectedQuotationDetail.name;
// // // // //       let nextRevisionCode = '';
// // // // //       const revParts = currentRevisionCode.split('-');
// // // // //       const lastPart = revParts[revParts.length - 1];

// // // // //       // Check if it already has an amendment number (e.g. QTN-2026-00001-1)
// // // // //       if (!isNaN(parseInt(lastPart, 10)) && revParts.length > 3) {
// // // // //         const nextRevNum = parseInt(lastPart, 10) + 1;
// // // // //         revParts[revParts.length - 1] = nextRevNum.toString();
// // // // //         nextRevisionCode = revParts.join('-');
// // // // //       } else {
// // // // //         nextRevisionCode = `${currentRevisionCode}-1`;
// // // // //       }

// // // // //       // 3. Construct new payload draft
// // // // //       const newItems = (selectedQuotationDetail.items || []).map(item => ({
// // // // //         item_code: item.item_code,
// // // // //         qty: item.qty || 1,
// // // // //         rate: item.rate || 0,
// // // // //         price_list_rate: item.price_list_rate || item.rate || 0,
// // // // //         uom: item.uom || 'Month',
// // // // //         item_name: item.item_name
// // // // //       }));

// // // // //       const payload = {
// // // // //         name: nextRevisionCode,
// // // // //         customer: selectedQuotationDetail.party_name || selectedQuotationDetail.customer,
// // // // //         party_name: selectedQuotationDetail.party_name || selectedQuotationDetail.customer,
// // // // //         customer_name: selectedQuotationDetail.customer_name,
// // // // //         quotation_to: 'Customer',
// // // // //         transaction_date: new Date().toISOString().split('T')[0],
// // // // //         valid_till: selectedQuotationDetail.valid_till,
// // // // //         company: selectedQuotationDetail.company || 'CARPENTERS PROPERTIES PTE LIMITED',
// // // // //         status: 'Draft',
// // // // //         custom_property: selectedQuotationDetail.custom_property || null,
// // // // //         custom_start_date: selectedQuotationDetail.custom_start_date || null,
// // // // //         custom_end_date: selectedQuotationDetail.custom_end_date || null,
// // // // //         custom_template: selectedQuotationDetail.custom_template || null,
// // // // //         items: newItems
// // // // //       };

// // // // //       if (erpnextConfig && erpnextConfig.url) {
// // // // //         const createRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation`, {
// // // // //           method: 'POST',
// // // // //           credentials: 'include',
// // // // //           headers: {
// // // // //             'Content-Type': 'application/json',
// // // // //             'X-Frappe-CSRF-Token': getCsrfToken()
// // // // //           },
// // // // //           body: JSON.stringify(payload)
// // // // //         });
// // // // //         if (!createRes.ok) {
// // // // //           const errData = await createRes.json();
// // // // //           let rawMsg = 'Failed to create amendment draft on server.';
// // // // //           if (errData._server_messages) {
// // // // //             try {
// // // // //               const msgs = JSON.parse(errData._server_messages);
// // // // //               const firstMsgObj = JSON.parse(msgs[0]);
// // // // //               rawMsg = firstMsgObj.message || rawMsg;
// // // // //             } catch (e) {
// // // // //               try {
// // // // //                 const msgs = JSON.parse(errData._server_messages);
// // // // //                 rawMsg = msgs[0] || rawMsg;
// // // // //               } catch (inner) {
// // // // //                 rawMsg = errData._server_messages;
// // // // //               }
// // // // //             }
// // // // //           } else if (errData.message) {
// // // // //             rawMsg = errData.message;
// // // // //           }
// // // // //           throw new Error(rawMsg);
// // // // //         }
// // // // //       }

// // // // //       alert(`Quotation ${selectedQuotationDetail.name} amended successfully. New revision draft ${nextRevisionCode} created!`);
// // // // //       setSelectedQuotation(null);
// // // // //       setSelectedQuotationDetail(null);
// // // // //       fetchQuotations();
// // // // //     } catch (e) {
// // // // //       alert(e.message);
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div>
// // // // //       <div className="view-header">
// // // // //         <div>
// // // // //           <h1 className="view-title">Quotation & Proposal Management</h1>
// // // // //           <p className="view-subtitle">Generate dynamic leasing proposals with multiple property units and track customer quotations.</p>
// // // // //         </div>
// // // // //         <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
// // // // //           <Plus size={16} /> Create Quotation
// // // // //         </button>
// // // // //       </div>

// // // // //       <div className="grid-2col" style={{ gridTemplateColumns: selectedQuotation ? '50% calc(50% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>

// // // // //         {/* Quotations List Table */}
// // // // //         <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
// // // // //           <div className="table-container">
// // // // //             <table className="custom-table">
// // // // //               <thead>
// // // // //                 <tr>
// // // // //                   <th>Quotation ID</th>
// // // // //                   <th>Customer Name</th>
// // // // //                   <th>Quote Date</th>
// // // // //                   <th>Valid Till</th>
// // // // //                   <th>Grand Total</th>
// // // // //                   <th>Status</th>
// // // // //                 </tr>
// // // // //               </thead>
// // // // //               <tbody>
// // // // //                 {quotations.map(q => (
// // // // //                   <tr 
// // // // //                     key={q.name}
// // // // //                     onClick={() => handleRowClick(q)}
// // // // //                     style={{ 
// // // // //                       cursor: 'pointer',
// // // // //                       backgroundColor: selectedQuotation?.name === q.name ? 'var(--bg-accent-alpha)' : '',
// // // // //                       borderLeft: selectedQuotation?.name === q.name ? '3px solid var(--brand-color)' : ''
// // // // //                     }}
// // // // //                   >
// // // // //                     <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{q.name}</td>
// // // // //                     <td style={{ fontWeight: 600 }}>{q.customer_name}</td>
// // // // //                     <td>{q.transaction_date}</td>
// // // // //                     <td>{q.valid_till}</td>
// // // // //                     <td style={{ fontWeight: 600 }}>${(q.grand_total || 0).toLocaleString()}</td>
// // // // //                     <td>
// // // // //                       <span className={`badge ${q.status === 'Submitted' ? 'badge-success' : q.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
// // // // //                         {q.status}
// // // // //                       </span>
// // // // //                     </td>
// // // // //                   </tr>
// // // // //                 ))}
// // // // //                 {quotations.length === 0 && (
// // // // //                   <tr>
// // // // //                     <td colSpan="6" style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
// // // // //                       No quotations found. Click "Create Quotation" to add one.
// // // // //                     </td>
// // // // //                   </tr>
// // // // //                 )}
// // // // //               </tbody>
// // // // //             </table>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Detailed Quotation TAX INVOICE styled Print View */}
// // // // //         {selectedQuotation && selectedQuotationDetail && (
// // // // //           <div className="card-panel" style={{ padding: 24, background: '#ffffff', color: '#111827', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.2s ease-out', position: 'relative' }}>

// // // // //             {/* Close details button */}
// // // // //             <button 
// // // // //               onClick={() => { setSelectedQuotation(null); setSelectedQuotationDetail(null); }}
// // // // //               style={{ position: 'absolute', top: 12, right: 12, background: '#f3f4f6', border: 'none', borderRadius: '50%', color: '#374151', cursor: 'pointer', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
// // // // //             >
// // // // //               ×
// // // // //             </button>

// // // // //             {/* TOP HEADER SECTION */}
// // // // //             <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: 14 }}>
// // // // //               {/* Logo & Company info */}
// // // // //               <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
// // // // //                 <svg viewBox="0 0 100 100" style={{ width: 42, height: 42, borderRadius: 6, display: 'inline-block' }}>
// // // // //                   <rect width="100" height="100" fill="#000000" rx="12"/>
// // // // //                   <circle cx="50" cy="50" r="36" fill="#FFDD00"/>
// // // // //                   <polygon points="50,50 86,14 100,14 100,86 86,86" fill="#000000"/>
// // // // //                   <line x1="24" y1="76" x2="50" y2="50" stroke="#000000" strokeWidth="5.5" strokeLinecap="round"/>
// // // // //                 </svg>
// // // // //                 <div style={{ fontSize: 10, color: '#4b5563', lineHeight: 1.3 }}>
// // // // //                   <h4 style={{ color: '#111827', fontWeight: 800, fontSize: 13, marginBottom: 4, letterSpacing: '0.02em' }}>{companyDetails.name}</h4>
// // // // //                   <p>{companyDetails.address}</p>
// // // // //                   <p>Tel: {companyDetails.phone}</p>
// // // // //                   <p>Email: {companyDetails.email}</p>
// // // // //                   <p>{companyDetails.website}</p>
// // // // //                 </div>
// // // // //               </div>

// // // // //               {/* Quotation Identity details */}
// // // // //               <div style={{ textAlign: 'right', fontSize: 11, color: '#4b5563', lineHeight: 1.4 }}>
// // // // //                 <h3 style={{ color: '#111827', fontWeight: 800, fontSize: 14, margin: '0 0 6px 0', letterSpacing: '0.03em' }}>PROPOSAL / QUOTATION</h3>
// // // // //                 <p><span style={{ color: '#6b7280' }}>Reference Code</span> &nbsp;&nbsp; {selectedQuotationDetail.name}</p>
// // // // //                 <p><span style={{ color: '#6b7280' }}>Date Issued</span> &nbsp;&nbsp; {selectedQuotationDetail.transaction_date}</p>
// // // // //                 <p><span style={{ color: '#6b7280' }}>Valid Until</span> &nbsp;&nbsp; {selectedQuotationDetail.valid_till}</p>
// // // // //                 {selectedQuotationDetail.custom_property && (
// // // // //                   <p><span style={{ color: '#6b7280' }}>Property Linked</span> &nbsp;&nbsp; {selectedQuotationDetail.custom_property}</p>
// // // // //                 )}
// // // // //                 {selectedQuotationDetail.custom_template && (
// // // // //                   <p><span style={{ color: '#6b7280' }}>Template Used</span> &nbsp;&nbsp; {selectedQuotationDetail.custom_template}</p>
// // // // //                 )}
// // // // //                 <p style={{ marginTop: 6 }}>
// // // // //                   <span style={{ 
// // // // //                     padding: '2px 8px', 
// // // // //                     borderRadius: 10, 
// // // // //                     fontSize: 9, 
// // // // //                     fontWeight: 700, 
// // // // //                     backgroundColor: selectedQuotationDetail.status === 'Submitted' ? '#d1fae5' : selectedQuotationDetail.status === 'Cancelled' ? '#fee2e2' : '#fef3c7', 
// // // // //                     color: selectedQuotationDetail.status === 'Submitted' ? '#065f46' : selectedQuotationDetail.status === 'Cancelled' ? '#991b1b' : '#92400e' 
// // // // //                   }}>
// // // // //                     {selectedQuotationDetail.status.toUpperCase()}
// // // // //                   </span>
// // // // //                 </p>
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* BILL TO / CUSTOMER INFO */}
// // // // //             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 10, paddingBottom: 6 }}>
// // // // //               <div>
// // // // //                 <span style={{ color: '#6b7280', textTransform: 'uppercase', display: 'block', fontWeight: 700, fontSize: 9, marginBottom: 4 }}>PROPOSED TO</span>
// // // // //                 <strong style={{ fontSize: 11, color: '#111827', display: 'block' }}>{selectedQuotationDetail.customer_name}</strong>
// // // // //                 <p style={{ color: '#4b5563', lineHeight: 1.3, marginTop: 2 }}>{customerAddress}</p>
// // // // //                 <p style={{ color: '#4b5563', fontSize: 9, marginTop: 4 }}>Contact: {customerContact}</p>
// // // // //               </div>
// // // // //               <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 9, display: 'flex', flexDirection: 'column', gap: 4 }}>
// // // // //                 <span style={{ color: '#6b7280', fontWeight: 700 }}>ESTIMATED BOOKING PERIOD</span>
// // // // //                 <div>Start: <strong style={{ color: '#111827' }}>{selectedQuotationDetail.custom_start_date || 'N/A'}</strong></div>
// // // // //                 <div>End: <strong style={{ color: '#111827' }}>{selectedQuotationDetail.custom_end_date || 'N/A'}</strong></div>
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* QUOTATION ITEMS TABLE */}
// // // // //             <div style={{ border: '1px solid #e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
// // // // //               <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, textAlign: 'left' }}>
// // // // //                 <thead>
// // // // //                   <tr style={{ background: '#1f2937', color: '#ffffff', borderBottom: '1px solid #374151' }}>
// // // // //                     <th style={{ padding: '8px 10px', color: '#ffffff' }}>Item Name</th>
// // // // //                     <th style={{ padding: '8px 10px', color: '#ffffff' }}>Qty</th>
// // // // //                     <th style={{ padding: '8px 10px', color: '#ffffff' }}>UOM</th>
// // // // //                     <th style={{ padding: '8px 10px', textAlign: 'right', color: '#ffffff' }}>Standard Rate ({companyDetails.currency})</th>
// // // // //                     <th style={{ padding: '8px 10px', textAlign: 'right', color: '#ffffff' }}>Offered Rate ({companyDetails.currency})</th>
// // // // //                     <th style={{ padding: '8px 10px', textAlign: 'right', color: '#ffffff' }}>Amount ({companyDetails.currency})</th>
// // // // //                   </tr>
// // // // //                 </thead>
// // // // //                 <tbody>
// // // // //                   {(selectedQuotationDetail.items || []).map((item, idx) => (
// // // // //                     <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
// // // // //                       <td style={{ padding: '8px 10px', color: '#374151', fontWeight: 600 }}>{item.item_name || item.item_code}</td>
// // // // //                       <td style={{ padding: '8px 10px', color: '#4b5563' }}>{item.qty}</td>
// // // // //                       <td style={{ padding: '8px 10px', color: '#4b5563' }}>{item.uom || 'Month'}</td>
// // // // //                       <td style={{ padding: '8px 10px', textAlign: 'right', color: '#4b5563' }}>${(item.price_list_rate || item.rate || 0).toLocaleString()}</td>
// // // // //                       <td style={{ padding: '8px 10px', textAlign: 'right', color: '#111827', fontWeight: 600 }}>${(item.rate || 0).toLocaleString()}</td>
// // // // //                       <td style={{ padding: '8px 10px', textAlign: 'right', color: '#111827', fontWeight: 600 }}>
// // // // //                         ${((item.qty || 1) * (item.rate || 0)).toLocaleString()}
// // // // //                       </td>
// // // // //                     </tr>
// // // // //                   ))}
// // // // //                 </tbody>
// // // // //               </table>
// // // // //             </div>

// // // // //             {/* TOTALS & SUMMARY */}
// // // // //             <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: 10 }}>
// // // // //               <div style={{ width: '50%', fontSize: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
// // // // //                 <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
// // // // //                   <span>Subtotal</span>
// // // // //                   <span>${(selectedQuotationDetail.grand_total || 0).toLocaleString()}</span>
// // // // //                 </div>
// // // // //                 <div style={{ display: 'flex', justifyContent: 'space-between', color: '#111827', fontWeight: 700, fontSize: 12, borderTop: '1px solid #e5e7eb', paddingTop: 6 }}>
// // // // //                   <span>Grand Total ({companyDetails.currency})</span>
// // // // //                   <span>${(selectedQuotationDetail.grand_total || 0).toLocaleString()}</span>
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* DYNAMIC ACTION BUTTONS (CANCEL AND AMEND - NO SIMPLE DELETE) */}
// // // // //             <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
// // // // //               <button 
// // // // //                 type="button" 
// // // // //                 className="btn btn-secondary" 
// // // // //                 style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444', background: 'transparent' }}
// // // // //                 disabled={selectedQuotationDetail.status === 'Cancelled'}
// // // // //                 onClick={() => handleCancelQuotation(selectedQuotationDetail.name)}
// // // // //               >
// // // // //                 Cancel Quotation
// // // // //               </button>
// // // // //               <button 
// // // // //                 type="button" 
// // // // //                 className="btn btn-primary" 
// // // // //                 style={{ flex: 1 }}
// // // // //                 onClick={handleAmendQuotation}
// // // // //               >
// // // // //                 Amend & Revise
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}
// // // // //       </div>

// // // // //       {/* Create Quotation Modal */}
// // // // //       {showAddModal && (
// // // // //         <div className="modal-overlay">
// // // // //           <div className="modal-content" style={{ maxWidth: 720 }}>
// // // // //             <div className="modal-header">
// // // // //               <h3>Create New Quotation</h3>
// // // // //               <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button>
// // // // //             </div>
// // // // //             <form onSubmit={handleCreateQuotation}>
// // // // //               <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
// // // // //                 {errorMsg && <div style={{ color: 'var(--color-danger)', background: 'rgba(239,68,68,0.1)', padding: 10, borderRadius: 6, fontSize: 12 }}>{errorMsg}</div>}

// // // // //                 {/* Horizontal row for Customer & Property Group */}
// // // // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// // // // //                   <div className="form-group">
// // // // //                     <label className="form-label">Customer Name</label>
// // // // //                     <select 
// // // // //                       value={quoteCustomer} 
// // // // //                       onChange={(e) => setQuoteCustomer(e.target.value)} 
// // // // //                       className="form-select"
// // // // //                       required
// // // // //                       disabled={submitting}
// // // // //                     >
// // // // //                       <option value="">-- Choose Customer --</option>
// // // // //                       {customers.map(c => (
// // // // //                         <option key={c.name} value={c.name}>{c.customer_name || c.name}</option>
// // // // //                       ))}
// // // // //                     </select>
// // // // //                   </div>
// // // // //                   <div className="form-group">
// // // // //                     <label className="form-label">Property Group</label>
// // // // //                     <select 
// // // // //                       value={quoteProperty} 
// // // // //                       onChange={(e) => setQuoteProperty(e.target.value)} 
// // // // //                       className="form-select"
// // // // //                       required
// // // // //                       disabled={submitting}
// // // // //                     >
// // // // //                       <option value="">-- Choose Property --</option>
// // // // //                       {propertyGroups.map(pg => (
// // // // //                         <option key={pg.name} value={pg.name}>{pg.name}</option>
// // // // //                       ))}
// // // // //                     </select>
// // // // //                   </div>
// // // // //                 </div>

// // // // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// // // // //                   <div className="form-group">
// // // // //                     <label className="form-label">Quotation Date</label>
// // // // //                     <input 
// // // // //                       type="date" 
// // // // //                       value={quoteDate} 
// // // // //                       onChange={(e) => handleQuoteDateChange(e.target.value)} 
// // // // //                       className="form-input" 
// // // // //                       required 
// // // // //                       disabled={submitting} 
// // // // //                     />
// // // // //                   </div>
// // // // //                   <div className="form-group">
// // // // //                     <label className="form-label">Valid Till</label>
// // // // //                     <input 
// // // // //                       type="date" 
// // // // //                       value={quoteValidTill} 
// // // // //                       onChange={(e) => handleValidTillChange(e.target.value)} 
// // // // //                       className="form-input" 
// // // // //                       required 
// // // // //                       disabled={submitting} 
// // // // //                     />
// // // // //                   </div>
// // // // //                 </div>

// // // // //                 {/* Date range for Booking Start & End */}
// // // // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// // // // //                   <div className="form-group">
// // // // //                     <label className="form-label">Est. Booking Start Date</label>
// // // // //                     <input 
// // // // //                       type="date" 
// // // // //                       value={quoteEstBookingStart} 
// // // // //                       onChange={(e) => handleBookingStartChange(e.target.value)} 
// // // // //                       className="form-input" 
// // // // //                       disabled={submitting} 
// // // // //                     />
// // // // //                   </div>
// // // // //                   <div className="form-group">
// // // // //                     <label className="form-label">Est. Booking End Date</label>
// // // // //                     <input 
// // // // //                       type="date" 
// // // // //                       value={quoteEstBookingEnd} 
// // // // //                       onChange={(e) => setQuoteEstBookingEnd(e.target.value)} 
// // // // //                       className="form-input" 
// // // // //                       disabled={submitting} 
// // // // //                     />
// // // // //                   </div>
// // // // //                 </div>

// // // // //                 {/* Quotation template filter dropdown */}
// // // // //                 <div className="form-group">
// // // // //                   <label className="form-label">Quotation Template</label>
// // // // //                   <select 
// // // // //                     value={quoteTemplate} 
// // // // //                     onChange={(e) => setQuoteTemplate(e.target.value)} 
// // // // //                     className="form-select"
// // // // //                     disabled={submitting}
// // // // //                   >
// // // // //                     <option value="">-- Choose Template --</option>
// // // // //                     {templates.map(t => (
// // // // //                       <option key={t.name} value={t.name}>{t.name}</option>
// // // // //                     ))}
// // // // //                   </select>
// // // // //                 </div>

// // // // //                 {/* Multiple Quotation Items list editor */}
// // // // //                 <div>
// // // // //                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
// // // // //                     <label className="form-label" style={{ margin: 0 }}>Property Units (Items)</label>
// // // // //                     <button type="button" className="btn btn-secondary btn-sm" onClick={addQuoteItem} style={{ padding: '4px 8px', fontSize: 10 }}>
// // // // //                       + Add Unit Space
// // // // //                     </button>
// // // // //                   </div>

// // // // //                   <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 180, overflowY: 'auto', paddingRight: 4, marginBottom: 14 }}>
// // // // //                     {quoteItems.map((item, idx) => (
// // // // //                       <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--bg-tertiary)', padding: 10, borderRadius: 6 }}>
// // // // //                         <div style={{ flex: 2 }} className="form-group" style={{ margin: 0 }}>
// // // // //                           <select 
// // // // //                             value={item.unitId} 
// // // // //                             onChange={(e) => handleItemChange(idx, 'unitId', e.target.value)}
// // // // //                             className="form-select"
// // // // //                             required
// // // // //                           >
// // // // //                             <option value="">-- Choose Unit Space --</option>
// // // // //                             {spaceUnits.map(unit => (
// // // // //                               <option key={unit.name} value={unit.name}>{unit.item_name || unit.name}</option>
// // // // //                             ))}
// // // // //                           </select>
// // // // //                         </div>
// // // // //                         <div style={{ flex: 0.6 }} className="form-group" style={{ margin: 0 }}>
// // // // //                           <input 
// // // // //                             type="number" 
// // // // //                             min="1"
// // // // //                             value={item.qty} 
// // // // //                             onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
// // // // //                             className="form-input" 
// // // // //                             required
// // // // //                             placeholder="Qty"
// // // // //                           />
// // // // //                         </div>
// // // // //                         <div style={{ flex: 0.8 }} className="form-group" style={{ margin: 0 }}>
// // // // //                           <input 
// // // // //                             type="text" 
// // // // //                             value={item.uom || 'Unit'} 
// // // // //                             className="form-input" 
// // // // //                             disabled
// // // // //                             placeholder="UOM"
// // // // //                           />
// // // // //                         </div>
// // // // //                         <div style={{ flex: 0.8 }} className="form-group" style={{ margin: 0 }}>
// // // // //                           <input 
// // // // //                             type="number" 
// // // // //                             placeholder="Std Rate" 
// // // // //                             value={item.standardRate} 
// // // // //                             onChange={(e) => handleItemChange(idx, 'standardRate', e.target.value)}
// // // // //                             className="form-input" 
// // // // //                             required
// // // // //                           />
// // // // //                         </div>
// // // // //                         <div style={{ flex: 0.8 }} className="form-group" style={{ margin: 0 }}>
// // // // //                           <input 
// // // // //                             type="number" 
// // // // //                             placeholder="Offered" 
// // // // //                             value={item.offeredRate} 
// // // // //                             onChange={(e) => handleItemChange(idx, 'offeredRate', e.target.value)}
// // // // //                             className="form-input" 
// // // // //                             required
// // // // //                           />
// // // // //                         </div>
// // // // //                         {quoteItems.length > 1 && (
// // // // //                           <button type="button" onClick={() => removeQuoteItem(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
// // // // //                             <Trash size={16} />
// // // // //                           </button>
// // // // //                         )}
// // // // //                       </div>
// // // // //                     ))}
// // // // //                   </div>
// // // // //                 </div>

// // // // //                 {/* Secondary Child Table: Service Items */}
// // // // //                 <div>
// // // // //                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
// // // // //                     <label className="form-label" style={{ margin: 0 }}>Service Add-ons (Items)</label>
// // // // //                     <button type="button" className="btn btn-secondary btn-sm" onClick={addServiceItem} style={{ padding: '4px 8px', fontSize: 10 }}>
// // // // //                       + Add Service
// // // // //                     </button>
// // // // //                   </div>

// // // // //                   <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 180, overflowY: 'auto', paddingRight: 4 }}>
// // // // //                     {serviceItems.map((item, idx) => (
// // // // //                       <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--bg-tertiary)', padding: 10, borderRadius: 6 }}>
// // // // //                         <div style={{ flex: 2 }} className="form-group" style={{ margin: 0 }}>
// // // // //                           <select 
// // // // //                             value={item.serviceId} 
// // // // //                             onChange={(e) => handleServiceChange(idx, 'serviceId', e.target.value)}
// // // // //                             className="form-select"
// // // // //                             required
// // // // //                           >
// // // // //                             <option value="">-- Choose Service --</option>
// // // // //                             {servicesList.map(srv => (
// // // // //                               <option key={srv.name} value={srv.name}>{srv.item_name} (${srv.standard_rate})</option>
// // // // //                             ))}
// // // // //                           </select>
// // // // //                         </div>
// // // // //                         <div style={{ flex: 0.6 }} className="form-group" style={{ margin: 0 }}>
// // // // //                           <input 
// // // // //                             type="number" 
// // // // //                             min="1"
// // // // //                             value={item.qty} 
// // // // //                             onChange={(e) => handleServiceChange(idx, 'qty', e.target.value)}
// // // // //                             className="form-input" 
// // // // //                             required
// // // // //                             placeholder="Qty"
// // // // //                           />
// // // // //                         </div>
// // // // //                         <div style={{ flex: 0.8 }} className="form-group" style={{ margin: 0 }}>
// // // // //                           <input 
// // // // //                             type="text" 
// // // // //                             value={item.uom || 'Activity'} 
// // // // //                             className="form-input" 
// // // // //                             disabled
// // // // //                             placeholder="UOM"
// // // // //                           />
// // // // //                         </div>
// // // // //                         <div style={{ flex: 0.8 }} className="form-group" style={{ margin: 0 }}>
// // // // //                           <input 
// // // // //                             type="number" 
// // // // //                             placeholder="Std Rate" 
// // // // //                             value={item.standardRate} 
// // // // //                             onChange={(e) => handleServiceChange(idx, 'standardRate', e.target.value)}
// // // // //                             className="form-input" 
// // // // //                             required
// // // // //                           />
// // // // //                         </div>
// // // // //                         <div style={{ flex: 0.8 }} className="form-group" style={{ margin: 0 }}>
// // // // //                           <input 
// // // // //                             type="number" 
// // // // //                             placeholder="Offered" 
// // // // //                             value={item.offeredRate} 
// // // // //                             onChange={(e) => handleServiceChange(idx, 'offeredRate', e.target.value)}
// // // // //                             className="form-input" 
// // // // //                             required
// // // // //                           />
// // // // //                         </div>
// // // // //                         {serviceItems.length > 1 && (
// // // // //                           <button type="button" onClick={() => removeServiceItem(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
// // // // //                             <Trash size={16} />
// // // // //                           </button>
// // // // //                         )}
// // // // //                       </div>
// // // // //                     ))}
// // // // //                   </div>
// // // // //                 </div>

// // // // //               </div>

// // // // //               <div className="modal-footer">
// // // // //                 <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)} disabled={submitting}>Cancel</button>
// // // // //                 <button type="submit" className="btn btn-primary" disabled={submitting}>
// // // // //                   {submitting ? 'Creating...' : 'Submit Quotation'}
// // // // //                 </button>
// // // // //               </div>
// // // // //             </form>
// // // // //           </div>
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // }




// // // // import React, { useState, useEffect } from 'react';
// // // // import { Plus, Trash, ArrowUpRight } from 'lucide-react';

// // // // const getCsrfToken = () => {
// // // //   if (typeof window !== 'undefined' && window.csrf_token) {
// // // //     return window.csrf_token;
// // // //   }
// // // //   if (typeof window !== 'undefined' && window.frappe && window.frappe.csrf_token) {
// // // //     return window.frappe.csrf_token;
// // // //   }
// // // //   const value = `; ${document.cookie}`;
// // // //   const parts = value.split(`; csrf_token=`);
// // // //   if (parts.length === 2) return parts.pop().split(';').shift();
// // // //   return '';
// // // // };

// // // // // NOTE: These are the Item field names assumed from the screenshot columns
// // // // // (UnitCode / Valuation Rate / Property Group / Locality / District / Total Area).
// // // // // If your actual custom fieldnames differ, update ITEM_FIELDS below — nothing
// // // // // else needs to change.
// // // // const ITEM_FIELDS = {
// // // //   propertyGroup: 'custom_property_reference', // Property Group link field on Item
// // // //   locality: 'custom_locality',
// // // //   district: 'custom_district',
// // // //   totalArea: 'custom_total_area',
// // // // };

// // // // export default function Quotation({ erpnextConfig, onGoToBooking }) {
// // // //   const [quotations, setQuotations] = useState([]);
// // // //   const [customers, setCustomers] = useState([]);
// // // //   const [spaceUnits, setSpaceUnits] = useState([]); // ALL Item records (unfiltered)
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [submitting, setSubmitting] = useState(false);
// // // //   const [errorMsg, setErrorMsg] = useState('');
// // // //   const [successMsg, setSuccessMsg] = useState('');

// // // //   // Modal / preview state
// // // //   const [showAddModal, setShowAddModal] = useState(false);
// // // //   const [selectedQuotation, setSelectedQuotation] = useState(null);
// // // //   const [selectedQuotationDetail, setSelectedQuotationDetail] = useState(null);

// // // //   // ---- Minimal form state: Customer, Start Date, End Date, Unit rows ----
// // // //   const [quoteCustomer, setQuoteCustomer] = useState('');
// // // //   const [quoteStartDate, setQuoteStartDate] = useState(() => new Date().toISOString().split('T')[0]);
// // // //   const [quoteEndDate, setQuoteEndDate] = useState(() => {
// // // //     const d = new Date();
// // // //     d.setDate(d.getDate() + 30);
// // // //     return d.toISOString().split('T')[0];
// // // //   });
// // // //   const [unitRows, setUnitRows] = useState([
// // // //     { unitId: '', qty: 1, rate: 0, propertyGroup: '', locality: '', district: '', totalArea: '' }
// // // //   ]);

// // // //   // ---------------- Fetchers ----------------

// // // //   const fetchCustomersList = async () => {
// // // //     if (!erpnextConfig?.url) return;
// // // //     try {
// // // //       const res = await fetch(`${erpnextConfig.url}/api/resource/Customer?fields=["name","customer_name"]&limit_page_length=200`, {
// // // //         credentials: 'include',
// // // //         headers: { 'Content-Type': 'application/json' }
// // // //       });
// // // //       if (res.ok) {
// // // //         const json = await res.json();
// // // //         setCustomers(json.data || []);
// // // //       }
// // // //     } catch (e) {
// // // //       console.warn('Failed fetching Customer list:', e);
// // // //     }
// // // //   };

// // // //   // Fetch ALL Item records (the "all records" link list the unit picker pulls from)
// // // //   const fetchSpaceUnits = async () => {
// // // //     if (!erpnextConfig?.url) return;
// // // //     try {
// // // //       const fields = [
// // // //         'name', 'item_name', 'valuation_rate', 'standard_rate', 'stock_uom',
// // // //         ITEM_FIELDS.propertyGroup, ITEM_FIELDS.locality, ITEM_FIELDS.district, ITEM_FIELDS.totalArea
// // // //       ];
// // // //       const url = `${erpnextConfig.url}/api/resource/Item?fields=${encodeURIComponent(JSON.stringify(fields))}&limit_page_length=500`;
// // // //       const res = await fetch(url, {
// // // //         credentials: 'include',
// // // //         headers: { 'Content-Type': 'application/json' }
// // // //       });
// // // //       if (res.ok) {
// // // //         const json = await res.json();
// // // //         setSpaceUnits(json.data || []);
// // // //       }
// // // //     } catch (e) {
// // // //       console.warn('Failed fetching Space Units (Items):', e);
// // // //     }
// // // //   };

// // // //   const fetchQuotations = async () => {
// // // //     if (!erpnextConfig?.url) {
// // // //       setQuotations([
// // // //         { name: 'QTN-2026-00001', customer_name: 'Sarah Jenkins', transaction_date: '2026-06-01', valid_till: '2026-06-30', grand_total: 6200, status: 'Submitted' },
// // // //         { name: 'QTN-2026-00002', customer_name: 'John Doe', transaction_date: '2026-06-05', valid_till: '2026-07-05', grand_total: 4500, status: 'Draft' }
// // // //       ]);
// // // //       return;
// // // //     }
// // // //     setLoading(true);
// // // //     try {
// // // //       const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation?fields=["name","customer_name","party_name","transaction_date","valid_till","grand_total","status","custom_property"]&limit_page_length=100&order_by=creation desc`, {
// // // //         credentials: 'include',
// // // //         headers: { 'Content-Type': 'application/json' }
// // // //       });
// // // //       if (res.ok) {
// // // //         const json = await res.json();
// // // //         setQuotations(json.data || []);
// // // //       }
// // // //     } catch (e) {
// // // //       console.warn('Failed fetching quotations:', e);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const fetchQuotationDetail = async (qName) => {
// // // //     if (!erpnextConfig?.url) return null;
// // // //     try {
// // // //       const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${qName}`, {
// // // //         credentials: 'include',
// // // //         headers: { 'Content-Type': 'application/json' }
// // // //       });
// // // //       if (res.ok) {
// // // //         const json = await res.json();
// // // //         const doc = json.data || json;
// // // //         setSelectedQuotationDetail(doc);
// // // //         return doc;
// // // //       }
// // // //     } catch (e) {
// // // //       console.warn('Failed fetching quotation detail:', e);
// // // //     }
// // // //     return null;
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchQuotations();
// // // //     fetchCustomersList();
// // // //     fetchSpaceUnits();
// // // //   }, [erpnextConfig]);

// // // //   // ---------------- Unit row helpers ----------------

// // // //   const addUnitRow = () => {
// // // //     setUnitRows([...unitRows, { unitId: '', qty: 1, rate: 0, propertyGroup: '', locality: '', district: '', totalArea: '' }]);
// // // //   };

// // // //   const removeUnitRow = (index) => {
// // // //     const updated = [...unitRows];
// // // //     updated.splice(index, 1);
// // // //     setUnitRows(updated);
// // // //   };

// // // //   // Selecting a unit auto-fetches all other display fields from the Item record
// // // //   const handleUnitSelect = (index, unitId) => {
// // // //     const updated = [...unitRows];
// // // //     const matched = spaceUnits.find(u => u.name === unitId);
// // // //     updated[index] = {
// // // //       ...updated[index],
// // // //       unitId,
// // // //       rate: matched ? (matched.valuation_rate || matched.standard_rate || 0) : 0,
// // // //       propertyGroup: matched ? (matched[ITEM_FIELDS.propertyGroup] || '') : '',
// // // //       locality: matched ? (matched[ITEM_FIELDS.locality] || '') : '',
// // // //       district: matched ? (matched[ITEM_FIELDS.district] || '') : '',
// // // //       totalArea: matched ? (matched[ITEM_FIELDS.totalArea] || '') : '',
// // // //     };
// // // //     setUnitRows(updated);
// // // //   };

// // // //   const handleQtyChange = (index, qty) => {
// // // //     const updated = [...unitRows];
// // // //     updated[index].qty = qty;
// // // //     setUnitRows(updated);
// // // //   };

// // // //   const resetForm = () => {
// // // //     setQuoteCustomer('');
// // // //     setQuoteStartDate(new Date().toISOString().split('T')[0]);
// // // //     const d = new Date();
// // // //     d.setDate(d.getDate() + 30);
// // // //     setQuoteEndDate(d.toISOString().split('T')[0]);
// // // //     setUnitRows([{ unitId: '', qty: 1, rate: 0, propertyGroup: '', locality: '', district: '', totalArea: '' }]);
// // // //     setErrorMsg('');
// // // //   };

// // // //   // ---------------- Create Quotation ----------------

// // // //   const handleCreateQuotation = async (e) => {
// // // //     e.preventDefault();
// // // //     if (!quoteCustomer || !quoteStartDate || !quoteEndDate) return;
// // // //     setSubmitting(true);
// // // //     setErrorMsg('');
// // // //     setSuccessMsg('');

// // // //     const matchedCust = customers.find(c => c.name === quoteCustomer);

// // // //     const erpItems = unitRows.filter(r => r.unitId).map(r => {
// // // //       const matched = spaceUnits.find(u => u.name === r.unitId);
// // // //       const qty = parseFloat(r.qty) || 1;
// // // //       const rate = parseFloat(r.rate) || 0;
// // // //       return {
// // // //         item_code: r.unitId,
// // // //         qty,
// // // //         rate,
// // // //         amount: qty * rate,
// // // //         uom: matched ? (matched.stock_uom || 'Unit') : 'Unit',
// // // //         item_name: matched ? matched.item_name : r.unitId
// // // //       };
// // // //     });

// // // //     if (erpItems.length === 0) {
// // // //       setErrorMsg('You must add at least one Unit.');
// // // //       setSubmitting(false);
// // // //       return;
// // // //     }

// // // //     const payload = {
// // // //       customer: quoteCustomer,
// // // //       party_name: quoteCustomer,
// // // //       customer_name: matchedCust ? matchedCust.customer_name : quoteCustomer,
// // // //       quotation_to: 'Customer',
// // // //       transaction_date: quoteStartDate,
// // // //       valid_till: quoteEndDate,
// // // //       custom_start_date: quoteStartDate,
// // // //       custom_end_date: quoteEndDate,
// // // //       items: erpItems
// // // //     };

// // // //     try {
// // // //       let createdName = null;
// // // //       if (erpnextConfig?.url) {
// // // //         const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation`, {
// // // //           method: 'POST',
// // // //           credentials: 'include',
// // // //           headers: {
// // // //             'Content-Type': 'application/json',
// // // //             'X-Frappe-CSRF-Token': getCsrfToken()
// // // //           },
// // // //           body: JSON.stringify(payload)
// // // //         });
// // // //         if (!res.ok) {
// // // //           const errData = await res.json();
// // // //           let rawMsg = 'Failed to create quotation on server.';
// // // //           if (errData._server_messages) {
// // // //             try {
// // // //               const msgs = JSON.parse(errData._server_messages);
// // // //               const firstMsgObj = JSON.parse(msgs[0]);
// // // //               rawMsg = firstMsgObj.message || rawMsg;
// // // //             } catch (e) {
// // // //               try {
// // // //                 const msgs = JSON.parse(errData._server_messages);
// // // //                 rawMsg = msgs[0] || rawMsg;
// // // //               } catch (inner) {
// // // //                 rawMsg = errData._server_messages;
// // // //               }
// // // //             }
// // // //           } else if (errData.message) {
// // // //             rawMsg = errData.message;
// // // //           }
// // // //           throw new Error(rawMsg);
// // // //         }
// // // //         const created = await res.json();
// // // //         createdName = (created.data || created)?.name || null;
// // // //       }

// // // //       setSuccessMsg('Quotation created successfully!');
// // // //       await fetchQuotations();
// // // //       setShowAddModal(false);
// // // //       resetForm();

// // // //       // Auto-select the newly created quotation in the preview pane
// // // //       if (createdName) {
// // // //         setSelectedQuotation({ name: createdName });
// // // //         await fetchQuotationDetail(createdName);
// // // //       }
// // // //     } catch (err) {
// // // //       setErrorMsg(err.message);
// // // //     } finally {
// // // //       setSubmitting(false);
// // // //     }
// // // //   };

// // // //   const handleRowClick = (quote) => {
// // // //     setSelectedQuotation(quote);
// // // //     fetchQuotationDetail(quote.name);
// // // //   };

// // // //   const handleAddAnother = () => {
// // // //     resetForm();
// // // //     setShowAddModal(true);
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <div className="view-header">
// // // //         <div>
// // // //           <h1 className="view-title">Quotation Management</h1>
// // // //           <p className="view-subtitle">Create quotations by selecting units directly — all other unit details are fetched automatically.</p>
// // // //         </div>
// // // //         <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>
// // // //           <Plus size={16} /> Create Quotation
// // // //         </button>
// // // //       </div>

// // // //       <div className="grid-2col" style={{ gridTemplateColumns: selectedQuotation ? '50% calc(50% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>

// // // //         {/* Quotations List — CARD design */}
// // // //         <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
// // // //           {quotations.map(q => (
// // // //             <div
// // // //               key={q.name}
// // // //               className="card-panel"
// // // //               onClick={() => handleRowClick(q)}
// // // //               style={{
// // // //                 padding: 16,
// // // //                 cursor: 'pointer',
// // // //                 border: selectedQuotation?.name === q.name ? '2px solid var(--brand-color)' : '1px solid var(--border-color)',
// // // //                 borderRadius: 'var(--radius-lg)',
// // // //                 display: 'flex',
// // // //                 flexDirection: 'column',
// // // //                 gap: 8
// // // //               }}
// // // //             >
// // // //               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
// // // //                 <div>
// // // //                   <div style={{ fontWeight: 700, color: 'var(--brand-color)', fontSize: 14 }}>{q.name}</div>
// // // //                   <div style={{ fontWeight: 600, marginTop: 2 }}>{q.customer_name}</div>
// // // //                 </div>
// // // //                 <span className={`badge ${q.status === 'Submitted' ? 'badge-success' : q.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
// // // //                   {q.status}
// // // //                 </span>
// // // //               </div>

// // // //               <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
// // // //                 <span>Date: {q.transaction_date}</span>
// // // //                 <span>Valid Till: {q.valid_till}</span>
// // // //                 <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${(q.grand_total || 0).toLocaleString()}</span>
// // // //               </div>

// // // //               <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
// // // //                 <button
// // // //                   type="button"
// // // //                   className="btn btn-secondary btn-sm"
// // // //                   style={{ display: 'flex', alignItems: 'center', gap: 4 }}
// // // //                   onClick={(e) => {
// // // //                     e.stopPropagation();
// // // //                     onGoToBooking && onGoToBooking(q);
// // // //                   }}
// // // //                 >
// // // //                   Go to Booking <ArrowUpRight size={14} />
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //           ))}

// // // //           {quotations.length === 0 && (
// // // //             <div className="card-panel" style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
// // // //               No quotations found. Click "Create Quotation" to add one.
// // // //             </div>
// // // //           )}
// // // //         </div>

// // // //         {/* Detail / Preview Pane */}
// // // //         {selectedQuotation && selectedQuotationDetail && (
// // // //           <div className="card-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
// // // //             <button
// // // //               onClick={() => { setSelectedQuotation(null); setSelectedQuotationDetail(null); }}
// // // //               style={{ position: 'absolute', top: 12, right: 12, background: '#f3f4f6', border: 'none', borderRadius: '50%', color: '#374151', cursor: 'pointer', width: 26, height: 26 }}
// // // //             >
// // // //               ×
// // // //             </button>

// // // //             <div>
// // // //               <h3 style={{ margin: 0 }}>{selectedQuotationDetail.name}</h3>
// // // //               <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0', fontSize: 12 }}>
// // // //                 {selectedQuotationDetail.customer_name} • {selectedQuotationDetail.transaction_date} → {selectedQuotationDetail.valid_till}
// // // //               </p>
// // // //             </div>

// // // //             <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
// // // //               <thead>
// // // //                 <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
// // // //                   <th style={{ padding: '6px 4px' }}>Unit</th>
// // // //                   <th style={{ padding: '6px 4px' }}>Qty</th>
// // // //                   <th style={{ padding: '6px 4px', textAlign: 'right' }}>Rate</th>
// // // //                   <th style={{ padding: '6px 4px', textAlign: 'right' }}>Amount</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody>
// // // //                 {(selectedQuotationDetail.items || []).map((item, idx) => (
// // // //                   <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
// // // //                     <td style={{ padding: '6px 4px' }}>{item.item_name || item.item_code}</td>
// // // //                     <td style={{ padding: '6px 4px' }}>{item.qty}</td>
// // // //                     <td style={{ padding: '6px 4px', textAlign: 'right' }}>${(item.rate || 0).toLocaleString()}</td>
// // // //                     <td style={{ padding: '6px 4px', textAlign: 'right' }}>${((item.qty || 1) * (item.rate || 0)).toLocaleString()}</td>
// // // //                   </tr>
// // // //                 ))}
// // // //               </tbody>
// // // //             </table>

// // // //             <div style={{ display: 'flex', justifyContent: 'flex-end', fontWeight: 700, borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
// // // //               Grand Total: ${(selectedQuotationDetail.grand_total || 0).toLocaleString()}
// // // //             </div>

// // // //             {/* Add Another button under the preview section */}
// // // //             <button type="button" className="btn btn-primary" onClick={handleAddAnother} style={{ width: '100%' }}>
// // // //               <Plus size={16} /> Add Another Quotation
// // // //             </button>
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* Create Quotation Modal — minimal fields only */}
// // // //       {showAddModal && (
// // // //         <div className="modal-overlay">
// // // //           <div className="modal-content" style={{ maxWidth: 680 }}>
// // // //             <div className="modal-header">
// // // //               <h3>Create New Quotation</h3>
// // // //               <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button>
// // // //             </div>
// // // //             <form onSubmit={handleCreateQuotation}>
// // // //               <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
// // // //                 {errorMsg && <div style={{ color: 'var(--color-danger)', background: 'rgba(239,68,68,0.1)', padding: 10, borderRadius: 6, fontSize: 12 }}>{errorMsg}</div>}

// // // //                 <div className="form-group">
// // // //                   <label className="form-label">Customer</label>
// // // //                   <select
// // // //                     value={quoteCustomer}
// // // //                     onChange={(e) => setQuoteCustomer(e.target.value)}
// // // //                     className="form-select"
// // // //                     required
// // // //                     disabled={submitting}
// // // //                   >
// // // //                     <option value="">-- Choose Customer --</option>
// // // //                     {customers.map(c => (
// // // //                       <option key={c.name} value={c.name}>{c.customer_name || c.name}</option>
// // // //                     ))}
// // // //                   </select>
// // // //                 </div>

// // // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// // // //                   <div className="form-group">
// // // //                     <label className="form-label">Start Date</label>
// // // //                     <input
// // // //                       type="date"
// // // //                       value={quoteStartDate}
// // // //                       onChange={(e) => setQuoteStartDate(e.target.value)}
// // // //                       className="form-input"
// // // //                       required
// // // //                       disabled={submitting}
// // // //                     />
// // // //                   </div>
// // // //                   <div className="form-group">
// // // //                     <label className="form-label">End Date</label>
// // // //                     <input
// // // //                       type="date"
// // // //                       value={quoteEndDate}
// // // //                       onChange={(e) => setQuoteEndDate(e.target.value)}
// // // //                       className="form-input"
// // // //                       required
// // // //                       disabled={submitting}
// // // //                     />
// // // //                   </div>
// // // //                 </div>

// // // //                 {/* Unit picker — link field over ALL Item records; rest auto-fetched */}
// // // //                 <div>
// // // //                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
// // // //                     <label className="form-label" style={{ margin: 0 }}>Units</label>
// // // //                     <button type="button" className="btn btn-secondary btn-sm" onClick={addUnitRow} style={{ padding: '4px 8px', fontSize: 10 }}>
// // // //                       + Add Row
// // // //                     </button>
// // // //                   </div>

// // // //                   <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
// // // //                     {unitRows.map((row, idx) => (
// // // //                       <div key={idx} style={{ background: 'var(--bg-tertiary)', padding: 10, borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
// // // //                         <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
// // // //                           <select
// // // //                             value={row.unitId}
// // // //                             onChange={(e) => handleUnitSelect(idx, e.target.value)}
// // // //                             className="form-select"
// // // //                             style={{ flex: 2 }}
// // // //                             required
// // // //                           >
// // // //                             <option value="">-- Choose Unit (all records) --</option>
// // // //                             {spaceUnits.map(unit => (
// // // //                               <option key={unit.name} value={unit.name}>{unit.item_name || unit.name}</option>
// // // //                             ))}
// // // //                           </select>
// // // //                           <input
// // // //                             type="number"
// // // //                             min="1"
// // // //                             value={row.qty}
// // // //                             onChange={(e) => handleQtyChange(idx, e.target.value)}
// // // //                             className="form-input"
// // // //                             style={{ flex: 0.6 }}
// // // //                             required
// // // //                             placeholder="Qty"
// // // //                           />
// // // //                           {unitRows.length > 1 && (
// // // //                             <button type="button" onClick={() => removeUnitRow(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
// // // //                               <Trash size={16} />
// // // //                             </button>
// // // //                           )}
// // // //                         </div>

// // // //                         {/* Auto-fetched, read-only details from the selected unit's Property Group */}
// // // //                         {row.unitId && (
// // // //                           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
// // // //                             <div><span style={{ fontWeight: 600 }}>Property Group:</span> {row.propertyGroup || '—'}</div>
// // // //                             <div><span style={{ fontWeight: 600 }}>Locality:</span> {row.locality || '—'}</div>
// // // //                             <div><span style={{ fontWeight: 600 }}>District:</span> {row.district || '—'}</div>
// // // //                             <div><span style={{ fontWeight: 600 }}>Area:</span> {row.totalArea || '—'}</div>
// // // //                             <div style={{ gridColumn: '1 / -1' }}>
// // // //                               <span style={{ fontWeight: 600 }}>Rate:</span> ${row.rate} &nbsp;•&nbsp;
// // // //                               <span style={{ fontWeight: 600 }}>Amount:</span> ${((parseFloat(row.qty) || 1) * (parseFloat(row.rate) || 0)).toLocaleString()}
// // // //                             </div>
// // // //                           </div>
// // // //                         )}
// // // //                       </div>
// // // //                     ))}
// // // //                   </div>
// // // //                 </div>
// // // //               </div>

// // // //               <div className="modal-footer">
// // // //                 <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)} disabled={submitting}>Cancel</button>
// // // //                 <button type="submit" className="btn btn-primary" disabled={submitting}>
// // // //                   {submitting ? 'Creating...' : 'Submit Quotation'}
// // // //                 </button>
// // // //               </div>
// // // //             </form>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }



// // // import React, { useState, useEffect } from 'react';
// // // import { Plus, Trash, ArrowUpRight } from 'lucide-react';

// // // const getCsrfToken = () => {
// // //   if (typeof window !== 'undefined' && window.csrf_token) {
// // //     return window.csrf_token;
// // //   }
// // //   if (typeof window !== 'undefined' && window.frappe && window.frappe.csrf_token) {
// // //     return window.frappe.csrf_token;
// // //   }
// // //   const value = `; ${document.cookie}`;
// // //   const parts = value.split(`; csrf_token=`);
// // //   if (parts.length === 2) return parts.pop().split(';').shift();
// // //   return '';
// // // };

// // // // Fields we KNOW exist on Item from your original working code.
// // // // (Locality / District / Total Area are not guessed here anymore — see
// // // // handleUnitSelect, which fetches the FULL Item doc and auto-detects
// // // // those columns by scanning fieldnames, so it works regardless of the
// // // // exact custom fieldnames on your site.)
// // // const SAFE_ITEM_FIELDS = ['name', 'item_name', 'valuation_rate', 'standard_rate', 'stock_uom', 'custom_property_reference'];

// // // // Keyword groups used to auto-detect the right custom field on the full
// // // // Item doc, since list fieldnames may differ between sites.
// // // const FIELD_KEYWORDS = {
// // //   propertyGroup: ['custom_property_reference', 'property_group', 'property'],
// // //   locality: ['locality'],
// // //   district: ['district'],
// // //   totalArea: ['total_area', 'area_sqft', 'area']
// // // };

// // // const findFieldValue = (doc, keywords) => {
// // //   if (!doc) return '';
// // //   // exact key match first
// // //   for (const kw of keywords) {
// // //     if (doc[kw] !== undefined && doc[kw] !== null && doc[kw] !== '') return doc[kw];
// // //   }
// // //   // fallback: scan all keys for a partial match
// // //   const keys = Object.keys(doc);
// // //   for (const kw of keywords) {
// // //     const found = keys.find(k => k.toLowerCase().includes(kw.replace(/_/g, '')) || k.toLowerCase().includes(kw));
// // //     if (found && doc[found] !== undefined && doc[found] !== null && doc[found] !== '') return doc[found];
// // //   }
// // //   return '';
// // // };

// // // export default function Quotation({ erpnextConfig, onGoToBooking }) {
// // //   const [quotations, setQuotations] = useState([]);
// // //   const [customers, setCustomers] = useState([]);
// // //   const [spaceUnits, setSpaceUnits] = useState([]); // ALL Item records (unfiltered)
// // //   const [loading, setLoading] = useState(false);
// // //   const [submitting, setSubmitting] = useState(false);
// // //   const [errorMsg, setErrorMsg] = useState('');
// // //   const [successMsg, setSuccessMsg] = useState('');
// // //   const [debugMsg, setDebugMsg] = useState(''); // visible fetch-failure diagnostics

// // //   // Modal / preview state
// // //   const [showAddModal, setShowAddModal] = useState(false);
// // //   const [selectedQuotation, setSelectedQuotation] = useState(null);
// // //   const [selectedQuotationDetail, setSelectedQuotationDetail] = useState(null);

// // //   // ---- Minimal form state: Customer, Start Date, End Date, Unit rows ----
// // //   const [quoteCustomer, setQuoteCustomer] = useState('');
// // //   const [quoteStartDate, setQuoteStartDate] = useState(() => new Date().toISOString().split('T')[0]);
// // //   const [quoteEndDate, setQuoteEndDate] = useState(() => {
// // //     const d = new Date();
// // //     d.setDate(d.getDate() + 30);
// // //     return d.toISOString().split('T')[0];
// // //   });
// // //   const [unitRows, setUnitRows] = useState([
// // //     { unitId: '', qty: 1, rate: 0, propertyGroup: '', locality: '', district: '', totalArea: '', loadingDetail: false }
// // //   ]);

// // //   // ---------------- Fetchers ----------------

// // //   const fetchCustomersList = async () => {
// // //     if (!erpnextConfig?.url) return;
// // //     try {
// // //       const res = await fetch(`${erpnextConfig.url}/api/resource/Customer?fields=["name","customer_name"]&limit_page_length=200`, {
// // //         credentials: 'include',
// // //         headers: { 'Content-Type': 'application/json' }
// // //       });
// // //       if (res.ok) {
// // //         const json = await res.json();
// // //         setCustomers(json.data || []);
// // //       } else {
// // //         const text = await res.text();
// // //         console.warn('Customer fetch failed:', res.status, text);
// // //         setDebugMsg(`Customer fetch failed (${res.status}): ${text.slice(0, 200)}`);
// // //       }
// // //     } catch (e) {
// // //       console.warn('Failed fetching Customer list:', e);
// // //       setDebugMsg(`Customer fetch error: ${e.message}`);
// // //     }
// // //   };

// // //   // Fetch ALL Item records using ONLY fields we know exist, so this never
// // //   // silently fails because of a guessed custom fieldname.
// // //   const fetchSpaceUnits = async () => {
// // //     if (!erpnextConfig?.url) return;
// // //     try {
// // //       const url = `${erpnextConfig.url}/api/resource/Item?fields=${encodeURIComponent(JSON.stringify(SAFE_ITEM_FIELDS))}&limit_page_length=500`;
// // //       const res = await fetch(url, {
// // //         credentials: 'include',
// // //         headers: { 'Content-Type': 'application/json' }
// // //       });
// // //       if (res.ok) {
// // //         const json = await res.json();
// // //         setSpaceUnits(json.data || []);
// // //         if ((json.data || []).length === 0) {
// // //           setDebugMsg('Item fetch succeeded but returned 0 records — check that Items exist and the user role can read Item.');
// // //         }
// // //       } else {
// // //         const text = await res.text();
// // //         console.warn('Item fetch failed:', res.status, text);
// // //         setDebugMsg(`Item fetch failed (${res.status}): ${text.slice(0, 300)}`);
// // //       }
// // //     } catch (e) {
// // //       console.warn('Failed fetching Space Units (Items):', e);
// // //       setDebugMsg(`Item fetch error: ${e.message}`);
// // //     }
// // //   };

// // //   const fetchQuotations = async () => {
// // //     if (!erpnextConfig?.url) {
// // //       setQuotations([
// // //         { name: 'QTN-2026-00001', customer_name: 'Sarah Jenkins', transaction_date: '2026-06-01', valid_till: '2026-06-30', grand_total: 6200, status: 'Submitted' },
// // //         { name: 'QTN-2026-00002', customer_name: 'John Doe', transaction_date: '2026-06-05', valid_till: '2026-07-05', grand_total: 4500, status: 'Draft' }
// // //       ]);
// // //       return;
// // //     }
// // //     setLoading(true);
// // //     try {
// // //       const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation?fields=["name","customer_name","party_name","transaction_date","valid_till","grand_total","status"]&limit_page_length=100&order_by=creation desc`, {
// // //         credentials: 'include',
// // //         headers: { 'Content-Type': 'application/json' }
// // //       });
// // //       if (res.ok) {
// // //         const json = await res.json();
// // //         setQuotations(json.data || []);
// // //       } else {
// // //         const text = await res.text();
// // //         console.warn('Quotation fetch failed:', res.status, text);
// // //         setDebugMsg(`Quotation fetch failed (${res.status}): ${text.slice(0, 200)}`);
// // //       }
// // //     } catch (e) {
// // //       console.warn('Failed fetching quotations:', e);
// // //       setDebugMsg(`Quotation fetch error: ${e.message}`);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchQuotationDetail = async (qName) => {
// // //     if (!erpnextConfig?.url) return null;
// // //     try {
// // //       const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${qName}`, {
// // //         credentials: 'include',
// // //         headers: { 'Content-Type': 'application/json' }
// // //       });
// // //       if (res.ok) {
// // //         const json = await res.json();
// // //         const doc = json.data || json;
// // //         setSelectedQuotationDetail(doc);
// // //         return doc;
// // //       }
// // //     } catch (e) {
// // //       console.warn('Failed fetching quotation detail:', e);
// // //     }
// // //     return null;
// // //   };

// // //   useEffect(() => {
// // //     fetchQuotations();
// // //     fetchCustomersList();
// // //     fetchSpaceUnits();
// // //   }, [erpnextConfig]);

// // //   // ---------------- Unit row helpers ----------------

// // //   const addUnitRow = () => {
// // //     setUnitRows([...unitRows, { unitId: '', qty: 1, rate: 0, propertyGroup: '', locality: '', district: '', totalArea: '', loadingDetail: false }]);
// // //   };

// // //   const removeUnitRow = (index) => {
// // //     const updated = [...unitRows];
// // //     updated.splice(index, 1);
// // //     setUnitRows(updated);
// // //   };

// // //   // Selecting a unit fetches the FULL Item doc (so it works no matter what
// // //   // the custom fields are actually called) and auto-fills the row.
// // //   const handleUnitSelect = async (index, unitId) => {
// // //     const listMatch = spaceUnits.find(u => u.name === unitId);

// // //     setUnitRows(prev => {
// // //       const updated = [...prev];
// // //       updated[index] = {
// // //         ...updated[index],
// // //         unitId,
// // //         rate: listMatch ? (listMatch.valuation_rate || listMatch.standard_rate || 0) : 0,
// // //         propertyGroup: listMatch ? (listMatch.custom_property_reference || '') : '',
// // //         loadingDetail: true
// // //       };
// // //       return updated;
// // //     });

// // //     if (!unitId || !erpnextConfig?.url) {
// // //       setUnitRows(prev => {
// // //         const updated = [...prev];
// // //         if (updated[index]) updated[index].loadingDetail = false;
// // //         return updated;
// // //       });
// // //       return;
// // //     }

// // //     try {
// // //       const res = await fetch(`${erpnextConfig.url}/api/resource/Item/${unitId}`, {
// // //         credentials: 'include',
// // //         headers: { 'Content-Type': 'application/json' }
// // //       });
// // //       if (res.ok) {
// // //         const json = await res.json();
// // //         const doc = json.data || json;
// // //         setUnitRows(prev => {
// // //           const updated = [...prev];
// // //           if (updated[index] && updated[index].unitId === unitId) {
// // //             updated[index] = {
// // //               ...updated[index],
// // //               rate: doc.valuation_rate || doc.standard_rate || updated[index].rate,
// // //               propertyGroup: findFieldValue(doc, FIELD_KEYWORDS.propertyGroup) || updated[index].propertyGroup,
// // //               locality: findFieldValue(doc, FIELD_KEYWORDS.locality),
// // //               district: findFieldValue(doc, FIELD_KEYWORDS.district),
// // //               totalArea: findFieldValue(doc, FIELD_KEYWORDS.totalArea),
// // //               loadingDetail: false
// // //             };
// // //           }
// // //           return updated;
// // //         });
// // //       } else {
// // //         const text = await res.text();
// // //         setDebugMsg(`Item detail fetch failed (${res.status}): ${text.slice(0, 200)}`);
// // //         setUnitRows(prev => {
// // //           const updated = [...prev];
// // //           if (updated[index]) updated[index].loadingDetail = false;
// // //           return updated;
// // //         });
// // //       }
// // //     } catch (e) {
// // //       setDebugMsg(`Item detail fetch error: ${e.message}`);
// // //       setUnitRows(prev => {
// // //         const updated = [...prev];
// // //         if (updated[index]) updated[index].loadingDetail = false;
// // //         return updated;
// // //       });
// // //     }
// // //   };

// // //   const handleQtyChange = (index, qty) => {
// // //     const updated = [...unitRows];
// // //     updated[index].qty = qty;
// // //     setUnitRows(updated);
// // //   };

// // //   const resetForm = () => {
// // //     setQuoteCustomer('');
// // //     setQuoteStartDate(new Date().toISOString().split('T')[0]);
// // //     const d = new Date();
// // //     d.setDate(d.getDate() + 30);
// // //     setQuoteEndDate(d.toISOString().split('T')[0]);
// // //     setUnitRows([{ unitId: '', qty: 1, rate: 0, propertyGroup: '', locality: '', district: '', totalArea: '', loadingDetail: false }]);
// // //     setErrorMsg('');
// // //   };

// // //   // ---------------- Create Quotation ----------------

// // //   const handleCreateQuotation = async (e) => {
// // //     e.preventDefault();
// // //     if (!quoteCustomer || !quoteStartDate || !quoteEndDate) return;
// // //     setSubmitting(true);
// // //     setErrorMsg('');
// // //     setSuccessMsg('');

// // //     const matchedCust = customers.find(c => c.name === quoteCustomer);

// // //     const erpItems = unitRows.filter(r => r.unitId).map(r => {
// // //       const matched = spaceUnits.find(u => u.name === r.unitId);
// // //       const qty = parseFloat(r.qty) || 1;
// // //       const rate = parseFloat(r.rate) || 0;
// // //       return {
// // //         item_code: r.unitId,
// // //         qty,
// // //         rate,
// // //         amount: qty * rate,
// // //         uom: matched ? (matched.stock_uom || 'Unit') : 'Unit',
// // //         item_name: matched ? matched.item_name : r.unitId
// // //       };
// // //     });

// // //     if (erpItems.length === 0) {
// // //       setErrorMsg('You must add at least one Unit.');
// // //       setSubmitting(false);
// // //       return;
// // //     }

// // //     const payload = {
// // //       customer: quoteCustomer,
// // //       party_name: quoteCustomer,
// // //       customer_name: matchedCust ? matchedCust.customer_name : quoteCustomer,
// // //       quotation_to: 'Customer',
// // //       transaction_date: quoteStartDate,
// // //       valid_till: quoteEndDate,
// // //       custom_start_date: quoteStartDate,
// // //       custom_end_date: quoteEndDate,
// // //       items: erpItems
// // //     };

// // //     try {
// // //       let createdName = null;
// // //       if (erpnextConfig?.url) {
// // //         const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation`, {
// // //           method: 'POST',
// // //           credentials: 'include',
// // //           headers: {
// // //             'Content-Type': 'application/json',
// // //             'X-Frappe-CSRF-Token': getCsrfToken()
// // //           },
// // //           body: JSON.stringify(payload)
// // //         });
// // //         if (!res.ok) {
// // //           const errData = await res.json();
// // //           let rawMsg = 'Failed to create quotation on server.';
// // //           if (errData._server_messages) {
// // //             try {
// // //               const msgs = JSON.parse(errData._server_messages);
// // //               const firstMsgObj = JSON.parse(msgs[0]);
// // //               rawMsg = firstMsgObj.message || rawMsg;
// // //             } catch (e) {
// // //               try {
// // //                 const msgs = JSON.parse(errData._server_messages);
// // //                 rawMsg = msgs[0] || rawMsg;
// // //               } catch (inner) {
// // //                 rawMsg = errData._server_messages;
// // //               }
// // //             }
// // //           } else if (errData.message) {
// // //             rawMsg = errData.message;
// // //           }
// // //           throw new Error(rawMsg);
// // //         }
// // //         const created = await res.json();
// // //         createdName = (created.data || created)?.name || null;
// // //       }

// // //       setSuccessMsg('Quotation created successfully!');
// // //       await fetchQuotations();
// // //       setShowAddModal(false);
// // //       resetForm();

// // //       if (createdName) {
// // //         setSelectedQuotation({ name: createdName });
// // //         await fetchQuotationDetail(createdName);
// // //       }
// // //     } catch (err) {
// // //       setErrorMsg(err.message);
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   };

// // //   const handleRowClick = (quote) => {
// // //     setSelectedQuotation(quote);
// // //     fetchQuotationDetail(quote.name);
// // //   };

// // //   const handleAddAnother = () => {
// // //     resetForm();
// // //     setShowAddModal(true);
// // //   };

// // //   return (
// // //     <div>
// // //       <div className="view-header">
// // //         <div>
// // //           <h1 className="view-title">Quotation Management</h1>
// // //           <p className="view-subtitle">Create quotations by selecting units directly — all other unit details are fetched automatically.</p>
// // //         </div>
// // //         <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>
// // //           <Plus size={16} /> Create Quotation
// // //         </button>
// // //       </div>

// // //       {debugMsg && (
// // //         <div style={{ color: '#92400e', background: '#fef3c7', padding: '8px 12px', borderRadius: 6, fontSize: 12, marginBottom: 16 }}>
// // //           ⚠ {debugMsg}
// // //         </div>
// // //       )}

// // //       <div className="grid-2col" style={{ gridTemplateColumns: selectedQuotation ? '50% calc(50% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>

// // //         {/* Quotations List — CARD design */}
// // //         <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
// // //           {quotations.map(q => (
// // //             <div
// // //               key={q.name}
// // //               className="card-panel"
// // //               onClick={() => handleRowClick(q)}
// // //               style={{
// // //                 padding: 16,
// // //                 cursor: 'pointer',
// // //                 border: selectedQuotation?.name === q.name ? '2px solid var(--brand-color)' : '1px solid var(--border-color)',
// // //                 borderRadius: 'var(--radius-lg)',
// // //                 display: 'flex',
// // //                 flexDirection: 'column',
// // //                 gap: 8
// // //               }}
// // //             >
// // //               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
// // //                 <div>
// // //                   <div style={{ fontWeight: 700, color: 'var(--brand-color)', fontSize: 14 }}>{q.name}</div>
// // //                   <div style={{ fontWeight: 600, marginTop: 2 }}>{q.customer_name}</div>
// // //                 </div>
// // //                 <span className={`badge ${q.status === 'Submitted' ? 'badge-success' : q.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
// // //                   {q.status}
// // //                 </span>
// // //               </div>

// // //               <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
// // //                 <span>Date: {q.transaction_date}</span>
// // //                 <span>Valid Till: {q.valid_till}</span>
// // //                 <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${(q.grand_total || 0).toLocaleString()}</span>
// // //               </div>

// // //               <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
// // //                 <button
// // //                   type="button"
// // //                   className="btn btn-secondary btn-sm"
// // //                   style={{ display: 'flex', alignItems: 'center', gap: 4 }}
// // //                   onClick={(e) => {
// // //                     e.stopPropagation();
// // //                     onGoToBooking && onGoToBooking(q);
// // //                   }}
// // //                 >
// // //                   Go to Booking <ArrowUpRight size={14} />
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           ))}

// // //           {quotations.length === 0 && (
// // //             <div className="card-panel" style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
// // //               No quotations found. Click "Create Quotation" to add one.
// // //             </div>
// // //           )}
// // //         </div>

// // //         {/* Detail / Preview Pane */}
// // //         {selectedQuotation && selectedQuotationDetail && (
// // //           <div className="card-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
// // //             <button
// // //               onClick={() => { setSelectedQuotation(null); setSelectedQuotationDetail(null); }}
// // //               style={{ position: 'absolute', top: 12, right: 12, background: '#f3f4f6', border: 'none', borderRadius: '50%', color: '#374151', cursor: 'pointer', width: 26, height: 26 }}
// // //             >
// // //               ×
// // //             </button>

// // //             <div>
// // //               <h3 style={{ margin: 0 }}>{selectedQuotationDetail.name}</h3>
// // //               <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0', fontSize: 12 }}>
// // //                 {selectedQuotationDetail.customer_name} • {selectedQuotationDetail.transaction_date} → {selectedQuotationDetail.valid_till}
// // //               </p>
// // //             </div>

// // //             <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
// // //               <thead>
// // //                 <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
// // //                   <th style={{ padding: '6px 4px' }}>Unit</th>
// // //                   <th style={{ padding: '6px 4px' }}>Qty</th>
// // //                   <th style={{ padding: '6px 4px', textAlign: 'right' }}>Rate</th>
// // //                   <th style={{ padding: '6px 4px', textAlign: 'right' }}>Amount</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {(selectedQuotationDetail.items || []).map((item, idx) => (
// // //                   <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
// // //                     <td style={{ padding: '6px 4px' }}>{item.item_name || item.item_code}</td>
// // //                     <td style={{ padding: '6px 4px' }}>{item.qty}</td>
// // //                     <td style={{ padding: '6px 4px', textAlign: 'right' }}>${(item.rate || 0).toLocaleString()}</td>
// // //                     <td style={{ padding: '6px 4px', textAlign: 'right' }}>${((item.qty || 1) * (item.rate || 0)).toLocaleString()}</td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>

// // //             <div style={{ display: 'flex', justifyContent: 'flex-end', fontWeight: 700, borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
// // //               Grand Total: ${(selectedQuotationDetail.grand_total || 0).toLocaleString()}
// // //             </div>

// // //             <button type="button" className="btn btn-primary" onClick={handleAddAnother} style={{ width: '100%' }}>
// // //               <Plus size={16} /> Add Another Quotation
// // //             </button>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Create Quotation Modal */}
// // //       {showAddModal && (
// // //         <div className="modal-overlay">
// // //           <div className="modal-content" style={{ maxWidth: 980 }}>
// // //             <div className="modal-header">
// // //               <h3>Create New Quotation</h3>
// // //               <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button>
// // //             </div>
// // //             <form onSubmit={handleCreateQuotation}>
// // //               <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
// // //                 {errorMsg && <div style={{ color: 'var(--color-danger)', background: 'rgba(239,68,68,0.1)', padding: 10, borderRadius: 6, fontSize: 12 }}>{errorMsg}</div>}

// // //                 <div className="form-group">
// // //                   <label className="form-label">Customer</label>
// // //                   <select
// // //                     value={quoteCustomer}
// // //                     onChange={(e) => setQuoteCustomer(e.target.value)}
// // //                     className="form-select"
// // //                     required
// // //                     disabled={submitting}
// // //                   >
// // //                     <option value="">-- Choose Customer --</option>
// // //                     {customers.map(c => (
// // //                       <option key={c.name} value={c.name}>{c.customer_name || c.name}</option>
// // //                     ))}
// // //                   </select>
// // //                 </div>

// // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// // //                   <div className="form-group">
// // //                     <label className="form-label">Start Date</label>
// // //                     <input
// // //                       type="date"
// // //                       value={quoteStartDate}
// // //                       onChange={(e) => setQuoteStartDate(e.target.value)}
// // //                       className="form-input"
// // //                       required
// // //                       disabled={submitting}
// // //                     />
// // //                   </div>
// // //                   <div className="form-group">
// // //                     <label className="form-label">End Date</label>
// // //                     <input
// // //                       type="date"
// // //                       value={quoteEndDate}
// // //                       onChange={(e) => setQuoteEndDate(e.target.value)}
// // //                       className="form-input"
// // //                       required
// // //                       disabled={submitting}
// // //                     />
// // //                   </div>
// // //                 </div>

// // //                 {/* Selected Units — full child table matching the screenshot layout */}
// // //                 <div>
// // //                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
// // //                     <label className="form-label" style={{ margin: 0 }}>Selected Units</label>
// // //                   </div>

// // //                   <div className="table-container" style={{ border: '1px solid var(--border-color)', borderRadius: 6, overflowX: 'auto' }}>
// // //                     <table className="custom-table" style={{ width: '100%', fontSize: 11 }}>
// // //                       <thead>
// // //                         <tr>
// // //                           <th>No.</th>
// // //                           <th style={{ minWidth: 160 }}>UnitCode</th>
// // //                           <th>Qty</th>
// // //                           <th>Valuation Rate</th>
// // //                           <th>Property Group</th>
// // //                           <th>Locality</th>
// // //                           <th>District</th>
// // //                           <th>Total Area</th>
// // //                           <th style={{ textAlign: 'right' }}>Amount</th>
// // //                           <th></th>
// // //                         </tr>
// // //                       </thead>
// // //                       <tbody>
// // //                         {unitRows.map((row, idx) => (
// // //                           <tr key={idx}>
// // //                             <td>{idx + 1}</td>
// // //                             <td>
// // //                               <select
// // //                                 value={row.unitId}
// // //                                 onChange={(e) => handleUnitSelect(idx, e.target.value)}
// // //                                 className="form-select"
// // //                                 style={{ minWidth: 150, fontSize: 11 }}
// // //                                 required
// // //                               >
// // //                                 <option value="">-- Choose Unit --</option>
// // //                                 {spaceUnits.map(unit => (
// // //                                   <option key={unit.name} value={unit.name}>{unit.item_name || unit.name}</option>
// // //                                 ))}
// // //                               </select>
// // //                             </td>
// // //                             <td>
// // //                               <input
// // //                                 type="number"
// // //                                 min="1"
// // //                                 value={row.qty}
// // //                                 onChange={(e) => handleQtyChange(idx, e.target.value)}
// // //                                 className="form-input"
// // //                                 style={{ width: 60, fontSize: 11 }}
// // //                                 required
// // //                               />
// // //                             </td>
// // //                             <td>{row.loadingDetail ? '…' : (row.rate ? `$${row.rate}` : '—')}</td>
// // //                             <td>{row.loadingDetail ? '…' : (row.propertyGroup || '—')}</td>
// // //                             <td>{row.loadingDetail ? '…' : (row.locality || '—')}</td>
// // //                             <td>{row.loadingDetail ? '…' : (row.district || '—')}</td>
// // //                             <td>{row.loadingDetail ? '…' : (row.totalArea || '—')}</td>
// // //                             <td style={{ textAlign: 'right', fontWeight: 600 }}>
// // //                               ${((parseFloat(row.qty) || 1) * (parseFloat(row.rate) || 0)).toLocaleString()}
// // //                             </td>
// // //                             <td>
// // //                               {unitRows.length > 1 && (
// // //                                 <button type="button" onClick={() => removeUnitRow(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
// // //                                   <Trash size={14} />
// // //                                 </button>
// // //                               )}
// // //                             </td>
// // //                           </tr>
// // //                         ))}
// // //                       </tbody>
// // //                     </table>
// // //                   </div>

// // //                   <button type="button" className="btn btn-secondary btn-sm" onClick={addUnitRow} style={{ marginTop: 8, padding: '4px 8px', fontSize: 10 }}>
// // //                     + Add Row
// // //                   </button>
// // //                 </div>
// // //               </div>

// // //               <div className="modal-footer">
// // //                 <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)} disabled={submitting}>Cancel</button>
// // //                 <button type="submit" className="btn btn-primary" disabled={submitting}>
// // //                   {submitting ? 'Creating...' : 'Submit Quotation'}
// // //                 </button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }



// // import React, { useState, useEffect } from 'react';
// // import { FileText, Plus, X, Search, CheckCircle2, AlertCircle, Edit, Trash2, Calendar, User, Building, Trash, Printer, ArrowUpRight } from 'lucide-react';

// // const getCsrfToken = () => {
// //   if (typeof window !== 'undefined' && window.csrf_token) {
// //     return window.csrf_token;
// //   }
// //   if (typeof window !== 'undefined' && window.frappe && window.frappe.csrf_token) {
// //     return window.frappe.csrf_token;
// //   }
// //   const value = `; ${document.cookie}`;
// //   const parts = value.split(`; csrf_token=`);
// //   if (parts.length === 2) return parts.pop().split(';').shift();
// //   return '';
// // };

// // export default function Quotation({ erpnextConfig, properties = [], onGoToBooking }) {
// //   const [quotations, setQuotations] = useState([]);
// //   const [customers, setCustomers] = useState([]);
// //   const [tamplates, settamplates] = useState([]);

// //   const [propertyGroups, setPropertyGroups] = useState([]); // Linked to Property Group doctype in ERPNext
// //   const [spaceUnits, setSpaceUnits] = useState([]); // Linked to Item doctype representing individual units
// //   const [templates, setTemplates] = useState([]); // Quotation templates filtered by reference_type: Quotation
// //   const [loading, setLoading] = useState(false);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [errorMsg, setErrorMsg] = useState('');
// //   const [successMsg, setSuccessMsg] = useState('');
// //   const [debugMsg, setDebugMsg] = useState('');

// //   // Modals state
// //   const [showAddModal, setShowAddModal] = useState(false);
// //   const [selectedQuotation, setSelectedQuotation] = useState(null);
// //   const [selectedQuotationDetail, setSelectedQuotationDetail] = useState(null);

// //   // Form states
// //   const [quoteCustomer, setQuoteCustomer] = useState('');
// //   const [quotetamplate, setQuotetamplate] = useState('');

// //   const [quoteEstBookingStart, setQuoteEstBookingStart] = useState(() => new Date().toISOString().split('T')[0]); // Start Date
// //   const [quoteEstBookingEnd, setQuoteEstBookingEnd] = useState(() => {
// //     const d = new Date();
// //     d.setDate(d.getDate() + 30);
// //     return d.toISOString().split('T')[0];
// //   }); // End Date
// //   const [quoteStatus, setQuoteStatus] = useState('Draft');
// //   const [quoteCompany, setQuoteCompany] = useState('CARPENTERS PROPERTIES PTE LIMITED');
// //   const [quoteItems, setQuoteItems] = useState([{ unitId: '', qty: 1, uom: '', standardRate: '', offeredRate: '', propertyGroup: '', locality: '', district: '', totalArea: '', loadingDetail: false }]);

// //   // Company Details (matching Invoice format)
// //   const [companyDetails, setCompanyDetails] = useState({
// //     name: 'CARPENTERS PROPERTIES PTE LTD',
// //     address: '123 Cecil Street, #08-01, Singapore 069537',
// //     phone: '+65 6123 4567',
// //     email: 'info@carpentersproperties.com',
// //     website: 'www.carpentersproperties.com',
// //     currency: 'SGD'
// //   });

// //   // Selected Customer Address and Contact for current print view
// //   const [customerAddress, setCustomerAddress] = useState('');
// //   const [customerContact, setCustomerContact] = useState('');

// //   // Fetch company details from ERPNext
// //   useEffect(() => {
// //     if (!erpnextConfig || !erpnextConfig.url) return;
// //     const fetchCompany = async () => {
// //       try {
// //         const res = await fetch(`${erpnextConfig.url}/api/resource/Company/CARPENTERS PROPERTIES PTE LIMITED`, {
// //           credentials: 'include',
// //           headers: {
// //             'Content-Type': 'application/json'
// //           }
// //         });
// //         if (res.ok) {
// //           const json = await res.json();
// //           const doc = json.data || json;
// //           setCompanyDetails(prev => ({
// //             ...prev,
// //             name: doc.name || prev.name,
// //             currency: doc.default_currency || prev.currency,
// //           }));

// //           // Fetch Address
// //           const addrRes = await fetch(`${erpnextConfig.url}/api/resource/Address?filters=[["Dynamic Link", "link_doctype", "=", "Company"], ["Dynamic Link", "link_name", "=", "${doc.name}"]]&fields=["address_line1","address_line2","city","state","country","pincode","phone","email_id"]`, {
// //             credentials: 'include',
// //             headers: {
// //               'Content-Type': 'application/json'
// //             }
// //           });
// //           if (addrRes.ok) {
// //             const addrJson = await addrRes.json();
// //             const addrList = addrJson.data || [];
// //             if (addrList.length > 0) {
// //               const addr = addrList[0];
// //               const addrParts = [addr.address_line1, addr.address_line2, addr.city, addr.state, addr.country, addr.pincode].filter(Boolean);
// //               setCompanyDetails(prev => ({
// //                 ...prev,
// //                 address: addrParts.join(', ') || prev.address,
// //                 phone: addr.phone || prev.phone,
// //                 email: addr.email_id || prev.email
// //               }));
// //             }
// //           }
// //         }
// //       } catch (err) {
// //         console.warn('Failed fetching company details:', err);
// //       }
// //     };
// //     fetchCompany();
// //   }, [erpnextConfig]);

// //   // Fetch customers from ERPNext Doctype Customer
// //   const fetchCustomersList = async () => {
// //     if (!erpnextConfig || !erpnextConfig.url) return;
// //     try {
// //       const res = await fetch(`${erpnextConfig.url}/api/resource/Customer?fields=["name","customer_name"]&limit_page_length=200`, {
// //         credentials: 'include',
// //         headers: {
// //           'Content-Type': 'application/json'
// //         }
// //       });
// //       if (res.ok) {
// //         const json = await res.json();
// //         setCustomers(json.data || []);
// //       } else {
// //         const text = await res.text();
// //         console.warn('Customer fetch failed:', res.status, text);
// //         setDebugMsg(`Customer fetch failed (${res.status}): ${text.slice(0, 200)}`);
// //       }
// //     } catch (e) {
// //       console.warn('Failed fetching Customer list:', e);
// //       setDebugMsg(`Customer fetch error: ${e.message}`);
// //     }
// //   };
// //   const fetchtamplateList = async () => {
// //     if (!erpnextConfig || !erpnextConfig.url) return;
// //     try {
// //       const res = await fetch(`${erpnextConfig.url}/api/resource/Contract%20Template?fields=["name"]&filters=[["custom_reference_type","=","Quotation"]]&limit_page_length=200`, {
// //         credentials: 'include',
// //         headers: {
// //           'Content-Type': 'application/json'
// //         }
// //       });
// //       if (res.ok) {
// //         const json = await res.json();
// //         settamplates(json.data || []);
// //       } else {
// //         const text = await res.text();
// //         console.warn('Tamplate fetch failed:', res.status, text);
// //         setDebugMsg(`Tamplate fetch failed (${res.status}): ${text.slice(0, 200)}`);
// //       }
// //     } catch (e) {
// //       console.warn('Failed fetching Tamplate list:', e);
// //       setDebugMsg(`Tamplate fetch error: ${e.message}`);
// //     }
// //   };

// //   // Fetch ALL Space Units (Items) — unfiltered, using only fields known to exist
// //   // so the request can never silently fail because of a guessed custom fieldname.
// //   const fetchSpaceUnits = async () => {
// //     if (!erpnextConfig || !erpnextConfig.url) return;
// //     try {
// //       const url = `${erpnextConfig.url}/api/resource/Item?fields=["name","item_name","standard_rate","valuation_rate","custom_property_reference","stock_uom"]&limit_page_length=500`;
// //       const res = await fetch(url, {
// //         credentials: 'include',
// //         headers: {
// //           'Content-Type': 'application/json'
// //         }
// //       });
// //       if (res.ok) {
// //         const json = await res.json();
// //         setSpaceUnits(json.data || []);
// //         if ((json.data || []).length === 0) {
// //           setDebugMsg('Item fetch succeeded but returned 0 records — check Items exist and role can read Item.');
// //         }
// //       } else {
// //         const text = await res.text();
// //         console.warn('Item fetch failed:', res.status, text);
// //         setDebugMsg(`Item fetch failed (${res.status}): ${text.slice(0, 300)}`);
// //       }
// //     } catch (e) {
// //       console.warn('Failed fetching Space Units (Items):', e);
// //       setDebugMsg(`Item fetch error: ${e.message}`);
// //     }
// //   };

// //   // Fetch quotations from ERPNext
// //   const fetchQuotations = async () => {
// //     console.log("hit the fetch")
// //     if (!erpnextConfig || !erpnextConfig.url) {
// //       setQuotations([
// //         { name: 'QTN-2026-00001', customer_name: 'Sarah Jenkins', transaction_date: '2026-06-01', valid_till: '2026-06-30', grand_total: 6200, status: 'Submitted' },
// //         { name: 'QTN-2026-00002', customer_name: 'John Doe', transaction_date: '2026-06-05', valid_till: '2026-07-05', grand_total: 4500, status: 'Draft' }
// //       ]);
// //       return;
// //     }
// //     setLoading(true);
// //     try {
// //       const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation?fields=["name","customer_name","party_name","transaction_date","valid_till","grand_total","status","workflow_state"]&limit_page_length=100&order_by=creation desc`, {
// //         credentials: 'include',
// //         headers: {
// //           'Content-Type': 'application/json'
// //         }
// //       });
// //       if (res.ok) {
// //         const json = await res.json();
// //         setQuotations(json.data || []);
// //       } else {
// //         const text = await res.text();
// //         console.warn('Quotation fetch failed:', res.status, text);
// //         setDebugMsg(`Quotation fetch failed (${res.status}): ${text.slice(0, 200)}`);
// //       }
// //     } catch (e) {
// //       console.warn('Failed fetching quotations:', e);
// //       setDebugMsg(`Quotation fetch error: ${e.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchQuotations();
// //     fetchCustomersList();
// //     fetchtamplateList();
// //     fetchSpaceUnits();
// //   }, [erpnextConfig]);

// //   // Handle detailed Quotation view & retrieve client CRM metadata
// //   const fetchQuotationDetail = async (qName, customerId) => {
// //     if (!erpnextConfig || !erpnextConfig.url) return;
// //     try {
// //       const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${qName}`, {
// //         credentials: 'include',
// //         headers: {
// //           'Content-Type': 'application/json'
// //         }
// //       });
// //       if (res.ok) {
// //         const json = await res.json();
// //         const doc = json.data || json;
// //         setSelectedQuotationDetail(doc);

// //         // Fetch Customer Address & Contact
// //         const actualCustomer = customerId || doc.party_name || doc.customer;
// //         if (actualCustomer) {
// //           // Fetch Address linked to customer
// //           const addrRes = await fetch(`${erpnextConfig.url}/api/resource/Address?filters=[["Dynamic Link", "link_doctype", "=", "Customer"], ["Dynamic Link", "link_name", "=", "${actualCustomer}"]]&fields=["address_line1","address_line2","city","state","country","pincode"]`, {
// //             credentials: 'include',
// //             headers: {
// //               'Content-Type': 'application/json'
// //             }
// //           });
// //           if (addrRes.ok) {
// //             const addrJson = await addrRes.json();
// //             const addrList = addrJson.data || [];
// //             if (addrList.length > 0) {
// //               const addr = addrList[0];
// //               setCustomerAddress([addr.address_line1, addr.address_line2, addr.city, addr.state, addr.country, addr.pincode].filter(Boolean).join(', '));
// //             } else {
// //               setCustomerAddress('Registered Address not specified');
// //             }
// //           }

// //           // Fetch Contact linked to customer
// //           const contactRes = await fetch(`${erpnextConfig.url}/api/resource/Contact?filters=[["Dynamic Link", "link_doctype", "=", "Customer"], ["Dynamic Link", "link_name", "=", "${actualCustomer}"]]&fields=["email_id","phone"]`, {
// //             credentials: 'include',
// //             headers: {
// //               'Content-Type': 'application/json'
// //             }
// //           });
// //           if (contactRes.ok) {
// //             const contactJson = await contactRes.json();
// //             const contactList = contactJson.data || [];
// //             if (contactList.length > 0) {
// //               const ct = contactList[0];
// //               setCustomerContact([ct.email_id, ct.phone].filter(Boolean).join(' | '));
// //             } else {
// //               setCustomerContact('Contact info not specified');
// //             }
// //           }
// //         }
// //       }
// //     } catch (e) {
// //       console.warn('Failed fetching quotation detail:', e);
// //     }
// //   };

// //   const handleRowClick = (quote) => {
// //     setSelectedQuotation(quote);
// //     fetchQuotationDetail(quote.name, quote.party_name || quote.customer);
// //   };

// //   // Form helpers
// //   const addQuoteItem = () => {
// //     setQuoteItems([...quoteItems, { unitId: '', qty: 1, uom: '', standardRate: '', offeredRate: '', propertyGroup: '', locality: '', district: '', totalArea: '', loadingDetail: false }]);
// //   };

// //   const removeQuoteItem = (index) => {
// //     const updated = [...quoteItems];
// //     updated.splice(index, 1);
// //     setQuoteItems(updated);
// //   };

// //   const handleQtyOrRateChange = (index, field, value) => {
// //     const updated = [...quoteItems];
// //     updated[index][field] = value;
// //     setQuoteItems(updated);
// //   };

// //   // Selecting a Unit fetches the FULL Item document (works regardless of the
// //   // exact custom fieldnames on your site) and auto-populates the row —
// //   // rate, UOM, Property Group, Locality, District, Total Area.
// //   const handleItemChange = async (index, unitId) => {
// //     const listMatch = spaceUnits.find(u => u.name === unitId);

// //     setQuoteItems(prev => {
// //       const updated = [...prev];
// //       const valRate = listMatch ? (listMatch.valuation_rate || listMatch.standard_rate || 0) : 0;
// //       updated[index] = {
// //         ...updated[index],
// //         unitId,
// //         standardRate: valRate,
// //         offeredRate: valRate,
// //         uom: listMatch ? (listMatch.stock_uom || 'Unit') : 'Unit',
// //         propertyGroup: listMatch ? (listMatch.custom_property_reference || '') : '',
// //         loadingDetail: true
// //       };
// //       return updated;
// //     });

// //     if (!unitId || !erpnextConfig || !erpnextConfig.url) {
// //       setQuoteItems(prev => {
// //         const updated = [...prev];
// //         if (updated[index]) updated[index].loadingDetail = false;
// //         return updated;
// //       });
// //       return;
// //     }

// //     try {
// //       const res = await fetch(`${erpnextConfig.url}/api/resource/Item/${unitId}`, {
// //         credentials: 'include',
// //         headers: { 'Content-Type': 'application/json' }
// //       });
// //       if (res.ok) {
// //         const json = await res.json();
// //         const doc = json.data || json;
// //         const findVal = (keywords) => {
// //           for (const kw of keywords) {
// //             if (doc[kw] !== undefined && doc[kw] !== null && doc[kw] !== '') return doc[kw];
// //           }
// //           const keys = Object.keys(doc);
// //           for (const kw of keywords) {
// //             const found = keys.find(k => k.toLowerCase().includes(kw));
// //             if (found && doc[found] !== undefined && doc[found] !== null && doc[found] !== '') return doc[found];
// //           }
// //           return '';
// //         };
// //         setQuoteItems(prev => {
// //           const updated = [...prev];
// //           if (updated[index] && updated[index].unitId === unitId) {
// //             updated[index] = {
// //               ...updated[index],
// //               propertyGroup: findVal(['custom_property_reference', 'property_group', 'property']) || updated[index].propertyGroup,
// //               locality: findVal(['locality']),
// //               district: findVal(['district']),
// //               totalArea: findVal(['total_area', 'area_sqft', 'area']),
// //               loadingDetail: false
// //             };
// //           }
// //           return updated;
// //         });
// //       } else {
// //         const text = await res.text();
// //         setDebugMsg(`Item detail fetch failed (${res.status}): ${text.slice(0, 200)}`);
// //         setQuoteItems(prev => {
// //           const updated = [...prev];
// //           if (updated[index]) updated[index].loadingDetail = false;
// //           return updated;
// //         });
// //       }
// //     } catch (e) {
// //       setDebugMsg(`Item detail fetch error: ${e.message}`);
// //       setQuoteItems(prev => {
// //         const updated = [...prev];
// //         if (updated[index]) updated[index].loadingDetail = false;
// //         return updated;
// //       });
// //     }
// //   };

// //   const resetForm = () => {
// //     setQuoteCustomer('');
// //     setQuotetamplate('')
// //     // setQuoteEstBookingStart(new Date().toISOString().split('T')[0]);
// //     setQuoteEstBookingStart('')
// //     const d = new Date();
// //     d.setDate(d.getDate() + 30);
// //     // setQuoteEstBookingEnd(d.toISOString().split('T')[0]);
// //     setQuoteEstBookingEnd('')
// //     setQuoteItems([{ unitId: '', qty: 1, uom: '', standardRate: '', offeredRate: '', propertyGroup: '', locality: '', district: '', totalArea: '', loadingDetail: false }]);
// //     setErrorMsg('');
// //   };

// //   // Submit new Quotation
// //   const handleCreateQuotation = async (e) => {
// //     e.preventDefault();
// //     if (!quoteCustomer || !quoteEstBookingStart || !quoteEstBookingEnd) return;
// //     setSubmitting(true);
// //     setErrorMsg('');
// //     setSuccessMsg('');

// //     const matchedCust = customers.find(c => c.name === quoteCustomer);

// //     const erpItems = quoteItems.filter(item => item.unitId).map(item => {
// //       const matched = spaceUnits.find(u => u.name === item.unitId);
// //       const standardRateNum = parseFloat(item.standardRate) || 0;
// //       const offeredRateNum = parseFloat(item.offeredRate) || 0;

// //       return {
// //         item_code: item.unitId,
// //         qty: parseFloat(item.qty) || 1,
// //         rate: offeredRateNum,
// //         price_list_rate: standardRateNum,
// //         amount: (parseFloat(item.qty) || 1) * offeredRateNum,
// //         uom: item.uom || 'Unit',
// //         item_name: matched ? matched.item_name : item.unitId
// //       };
// //     });

// //     if (erpItems.length === 0) {
// //       setErrorMsg('You must add at least one Property Unit.');
// //       setSubmitting(false);
// //       return;
// //     }

// //     const payload = {
// //       customer: quoteCustomer,
// //       party_name: quoteCustomer,
// //       customer_name: matchedCust ? matchedCust.customer_name : quoteCustomer,
// //       quotation_to: 'Customer',
// //       transaction_date: quoteEstBookingStart,
// //       valid_till: quoteEstBookingEnd,
// //       company: quoteCompany,
// //       status: quoteStatus,
// //       custom_start_date: quoteEstBookingStart || null,
// //       custom_end_date: quoteEstBookingEnd || null,
// //       custom_template: quotetamplate,
// //       items: erpItems
// //     };
// //     console.log(payload)

// //     try {
// //       let createdName = null;
// //       if (erpnextConfig && erpnextConfig.url) {
// //         const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation`, {
// //           method: 'POST',
// //           credentials: 'include',
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'X-Frappe-CSRF-Token': getCsrfToken()
// //           },
// //           body: JSON.stringify(payload)
// //         });
// //         if (!res.ok) {
// //           const errData = await res.json();
// //           let rawMsg = 'Failed to create quotation on server.';
// //           if (errData._server_messages) {
// //             try {
// //               const msgs = JSON.parse(errData._server_messages);
// //               const firstMsgObj = JSON.parse(msgs[0]);
// //               rawMsg = firstMsgObj.message || rawMsg;
// //             } catch (e) {
// //               try {
// //                 const msgs = JSON.parse(errData._server_messages);
// //                 rawMsg = msgs[0] || rawMsg;
// //               } catch (inner) {
// //                 rawMsg = errData._server_messages;
// //               }
// //             }
// //           } else if (errData.message) {
// //             rawMsg = errData.message;
// //           }
// //           throw new Error(rawMsg);
// //         }
// //         const created = await res.json();
// //         createdName = (created.data || created)?.name || null;
// //       }

// //       setSuccessMsg('Quotation created successfully!');
// //       await fetchQuotations();
// //       setShowAddModal(false);
// //       resetForm();

// //       // Auto-select the newly created quotation in the preview pane by default
// //       if (createdName) {
// //         setSelectedQuotation({ name: createdName });
// //         fetchQuotationDetail(createdName, quoteCustomer);
// //       }
// //     } catch (err) {
// //       setErrorMsg(err.message);
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   // Cancel Quotation Workflow (Sets status to 'Cancelled')
// //   const handleCancelQuotation = async (qName) => {
// //     if (!confirm(`Are you sure you want to cancel quotation ${qName}?`)) return;
// //     setLoading(true);
// //     try {
// //       if (erpnextConfig && erpnextConfig.url) {
// //         const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${qName}`, {
// //           method: 'PUT',
// //           credentials: 'include',
// //           headers: {
// //             'Content-Type': 'application/json'
// //           },
// //           body: JSON.stringify({ status: 'Cancelled' })
// //         });
// //         if (!res.ok) {
// //           throw new Error('Failed to cancel quotation.');
// //         }
// //       }
// //       setSelectedQuotation(null);
// //       setSelectedQuotationDetail(null);
// //       fetchQuotations();
// //     } catch (e) {
// //       alert(e.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Amend Quotation Workflow (Revision logic)
// //   const handleAmendQuotation = async () => {
// //     if (!selectedQuotationDetail) return;
// //     if (!confirm(`This action will Cancel the current quotation revision ${selectedQuotationDetail.name} and create a new editable draft. Proceed?`)) return;

// //     setLoading(true);
// //     setErrorMsg('');

// //     try {
// //       // 1. Cancel current revision
// //       if (erpnextConfig && erpnextConfig.url) {
// //         const cancelRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${selectedQuotationDetail.name}`, {
// //           method: 'PUT',
// //           credentials: 'include',
// //           headers: {
// //             'Content-Type': 'application/json'
// //           },
// //           body: JSON.stringify({ status: 'Cancelled' })
// //         });
// //         if (!cancelRes.ok) {
// //           throw new Error('Failed to cancel the current version during amendment.');
// //         }
// //       }

// //       // 2. Parse revision details & increment name revision tag
// //       let currentRevisionCode = selectedQuotationDetail.name;
// //       let nextRevisionCode = '';
// //       const revParts = currentRevisionCode.split('-');
// //       const lastPart = revParts[revParts.length - 1];

// //       // Check if it already has an amendment number (e.g. QTN-2026-00001-1)
// //       if (!isNaN(parseInt(lastPart, 10)) && revParts.length > 3) {
// //         const nextRevNum = parseInt(lastPart, 10) + 1;
// //         revParts[revParts.length - 1] = nextRevNum.toString();
// //         nextRevisionCode = revParts.join('-');
// //       } else {
// //         nextRevisionCode = `${currentRevisionCode}-1`;
// //       }

// //       // 3. Construct new payload draft
// //       const newItems = (selectedQuotationDetail.items || []).map(item => ({
// //         item_code: item.item_code,
// //         qty: item.qty || 1,
// //         rate: item.rate || 0,
// //         price_list_rate: item.price_list_rate || item.rate || 0,
// //         uom: item.uom || 'Month',
// //         item_name: item.item_name
// //       }));

// //       const payload = {
// //         name: nextRevisionCode,
// //         customer: selectedQuotationDetail.party_name || selectedQuotationDetail.customer,
// //         party_name: selectedQuotationDetail.party_name || selectedQuotationDetail.customer,
// //         customer_name: selectedQuotationDetail.customer_name,
// //         quotation_to: 'Customer',
// //         transaction_date: new Date().toISOString().split('T')[0],
// //         valid_till: selectedQuotationDetail.valid_till,
// //         company: selectedQuotationDetail.company || 'CARPENTERS PROPERTIES PTE LIMITED',
// //         status: 'Draft',
// //         custom_start_date: selectedQuotationDetail.custom_start_date || null,
// //         custom_end_date: selectedQuotationDetail.custom_end_date || null,
// //         items: newItems
// //       };

// //       if (erpnextConfig && erpnextConfig.url) {
// //         const createRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation`, {
// //           method: 'POST',
// //           credentials: 'include',
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'X-Frappe-CSRF-Token': getCsrfToken()
// //           },
// //           body: JSON.stringify(payload)
// //         });
// //         if (!createRes.ok) {
// //           const errData = await createRes.json();
// //           let rawMsg = 'Failed to create amendment draft on server.';
// //           if (errData._server_messages) {
// //             try {
// //               const msgs = JSON.parse(errData._server_messages);
// //               const firstMsgObj = JSON.parse(msgs[0]);
// //               rawMsg = firstMsgObj.message || rawMsg;
// //             } catch (e) {
// //               try {
// //                 const msgs = JSON.parse(errData._server_messages);
// //                 rawMsg = msgs[0] || rawMsg;
// //               } catch (inner) {
// //                 rawMsg = errData._server_messages;
// //               }
// //             }
// //           } else if (errData.message) {
// //             rawMsg = errData.message;
// //           }
// //           throw new Error(rawMsg);
// //         }
// //       }

// //       alert(`Quotation ${selectedQuotationDetail.name} amended successfully. New revision draft ${nextRevisionCode} created!`);
// //       setSelectedQuotation(null);
// //       setSelectedQuotationDetail(null);
// //       fetchQuotations();
// //     } catch (e) {
// //       alert(e.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handelaction = async (con, state_code) => {
// //     // /state_code 1 is for the approved and 0 is for the reject
// //     console.log(con)
// //     console.log(con.name)
// //     const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${con.name}`, {
// //       method: "PUT",
// //       credentials: 'include',
// //       body: JSON.stringify({
// //         "workflow_state": state_code ? "Approved" : "Drafted"
// //       })
// //     })
// //     console.log("after approve", res.status)

// //     if (!res.ok) {
// //       return;
// //     }
// //     fetchQuotations()
// //     // const resjson = await res.json()

// //   }
// //   return (
// //     <div>
// //       <div className="view-header">
// //         <div>
// //           <h1 className="view-title">Quotation & Proposal Management</h1>
// //           <p className="view-subtitle">Generate dynamic leasing proposals with multiple property units and track customer quotations.</p>
// //         </div>
// //         <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>
// //           <Plus size={16} /> Create Quotation
// //         </button>
// //       </div>

// //       {debugMsg && (
// //         <div style={{ color: '#92400e', background: '#fef3c7', padding: '8px 12px', borderRadius: 6, fontSize: 12, marginBottom: 16 }}>
// //           ⚠ {debugMsg}
// //         </div>
// //       )}

// //       <div className="grid-2col" style={{ gridTemplateColumns: selectedQuotation ? '50% calc(50% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>

// //         {/* Quotations List Table */}
// //         <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
// //           <div className="table-container">
// //             <table className="custom-table">
// //               <thead>
// //                 <tr>
// //                   <th>Quotation ID</th>
// //                   <th>Customer Name</th>
// //                   <th>Quote Date</th>
// //                   <th>Valid Till</th>
// //                   <th>Grand Total</th>
// //                   <th>Status</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {quotations.map(q => (
// //                   <tr
// //                     key={q.name}
// //                     onClick={() => handleRowClick(q)}
// //                     style={{
// //                       cursor: 'pointer',
// //                       backgroundColor: selectedQuotation?.name === q.name ? 'var(--bg-accent-alpha)' : '',
// //                       borderLeft: selectedQuotation?.name === q.name ? '3px solid var(--brand-color)' : ''
// //                     }}
// //                   >
// //                     <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{q.name}</td>
// //                     <td style={{ fontWeight: 600 }}>{q.customer_name}</td>
// //                     <td>{q.transaction_date}</td>
// //                     <td>{q.valid_till}</td>
// //                     <td style={{ fontWeight: 600 }}>${(q.grand_total || 0).toLocaleString()}</td>
// //                     <td>
// //                       <span className={`badge ${q.status === 'Submitted' ? 'badge-success' : q.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
// //                         {q.workflow_state}
// //                       </span>
// //                     </td>
// //                   </tr>
// //                 ))}
// //                 {quotations.length === 0 && (
// //                   <tr>
// //                     <td colSpan="6" style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
// //                       No quotations found. Click "Create Quotation" to add one.
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>

// //         {/* Detailed Quotation TAX INVOICE styled Print View */}
// //         {selectedQuotation && selectedQuotationDetail && (
// //           <div className="card-panel" style={{ padding: 24, background: '#ffffff', color: '#111827', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.2s ease-out', position: 'relative' }}>

// //             {/* Close details button */}
// //             <button
// //               onClick={() => { setSelectedQuotation(null); setSelectedQuotationDetail(null); }}
// //               style={{ position: 'absolute', top: 12, right: 12, background: '#f3f4f6', border: 'none', borderRadius: '50%', color: '#374151', cursor: 'pointer', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
// //             >
// //               ×
// //             </button>

// //             {/* TOP HEADER SECTION */}
// //             <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: 14 }}>
// //               {/* Logo & Company info */}
// //               <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
// //                 <svg viewBox="0 0 100 100" style={{ width: 42, height: 42, borderRadius: 6, display: 'inline-block' }}>
// //                   <rect width="100" height="100" fill="#000000" rx="12" />
// //                   <circle cx="50" cy="50" r="36" fill="#FFDD00" />
// //                   <polygon points="50,50 86,14 100,14 100,86 86,86" fill="#000000" />
// //                   <line x1="24" y1="76" x2="50" y2="50" stroke="#000000" strokeWidth="5.5" strokeLinecap="round" />
// //                 </svg>
// //                 <div style={{ fontSize: 10, color: '#4b5563', lineHeight: 1.3 }}>
// //                   <h4 style={{ color: '#111827', fontWeight: 800, fontSize: 13, marginBottom: 4, letterSpacing: '0.02em' }}>{companyDetails.name}</h4>
// //                   <p>{companyDetails.address}</p>
// //                   <p>Tel: {companyDetails.phone}</p>
// //                   <p>Email: {companyDetails.email}</p>
// //                   <p>{companyDetails.website}</p>
// //                 </div>
// //               </div>

// //               {/* Quotation Identity details */}
// //               <div style={{ textAlign: 'right', fontSize: 11, color: '#4b5563', lineHeight: 1.4 }}>
// //                 <h3 style={{ color: '#111827', fontWeight: 800, fontSize: 14, margin: '0 0 6px 0', letterSpacing: '0.03em' }}>PROPOSAL / QUOTATION</h3>
// //                 <p><span style={{ color: '#6b7280' }}>Reference Code</span> &nbsp;&nbsp; {selectedQuotationDetail.name}</p>
// //                 <p><span style={{ color: '#6b7280' }}>Date Issued</span> &nbsp;&nbsp; {selectedQuotationDetail.transaction_date}</p>
// //                 <p><span style={{ color: '#6b7280' }}>Valid Until</span> &nbsp;&nbsp; {selectedQuotationDetail.valid_till}</p>
// //                 <p style={{ marginTop: 6 }}>
// //                   <span style={{
// //                     padding: '2px 8px',
// //                     borderRadius: 10,
// //                     fontSize: 9,
// //                     fontWeight: 700,
// //                     backgroundColor: selectedQuotationDetail.status === 'Submitted' ? '#d1fae5' : selectedQuotationDetail.status === 'Cancelled' ? '#fee2e2' : '#fef3c7',
// //                     color: selectedQuotationDetail.status === 'Submitted' ? '#065f46' : selectedQuotationDetail.status === 'Cancelled' ? '#991b1b' : '#92400e'
// //                   }}>
// //                     {selectedQuotationDetail.status.toUpperCase()}
// //                   </span>
// //                 </p>
// //               </div>
// //             </div>

// //             {/* BILL TO / CUSTOMER INFO */}
// //             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 10, paddingBottom: 6 }}>
// //               <div>
// //                 <span style={{ color: '#6b7280', textTransform: 'uppercase', display: 'block', fontWeight: 700, fontSize: 9, marginBottom: 4 }}>PROPOSED TO</span>
// //                 <strong style={{ fontSize: 11, color: '#111827', display: 'block' }}>{selectedQuotationDetail.customer_name}</strong>
// //                 <p style={{ color: '#4b5563', lineHeight: 1.3, marginTop: 2 }}>{customerAddress}</p>
// //                 <p style={{ color: '#4b5563', fontSize: 9, marginTop: 4 }}>Contact: {customerContact}</p>
// //               </div>
// //               <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 9, display: 'flex', flexDirection: 'column', gap: 4 }}>
// //                 <span style={{ color: '#6b7280', fontWeight: 700 }}>ESTIMATED BOOKING PERIOD</span>
// //                 <div>Start: <strong style={{ color: '#111827' }}>{selectedQuotationDetail.custom_start_date || 'N/A'}</strong></div>
// //                 <div>End: <strong style={{ color: '#111827' }}>{selectedQuotationDetail.custom_end_date || 'N/A'}</strong></div>
// //               </div>
// //             </div>

// //             {/* QUOTATION ITEMS TABLE */}
// //             <div style={{ border: '1px solid #e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
// //               <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, textAlign: 'left' }}>
// //                 <thead>
// //                   <tr style={{ background: '#1f2937', color: '#ffffff', borderBottom: '1px solid #374151' }}>
// //                     <th style={{ padding: '8px 10px', color: '#ffffff' }}>Item Name</th>
// //                     <th style={{ padding: '8px 10px', color: '#ffffff' }}>Qty</th>
// //                     <th style={{ padding: '8px 10px', color: '#ffffff' }}>UOM</th>
// //                     <th style={{ padding: '8px 10px', textAlign: 'right', color: '#ffffff' }}>Standard Rate ({companyDetails.currency})</th>
// //                     <th style={{ padding: '8px 10px', textAlign: 'right', color: '#ffffff' }}>Offered Rate ({companyDetails.currency})</th>
// //                     <th style={{ padding: '8px 10px', textAlign: 'right', color: '#ffffff' }}>Amount ({companyDetails.currency})</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {(selectedQuotationDetail.items || []).map((item, idx) => (
// //                     <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
// //                       <td style={{ padding: '8px 10px', color: '#374151', fontWeight: 600 }}>{item.item_name || item.item_code}</td>
// //                       <td style={{ padding: '8px 10px', color: '#4b5563' }}>{item.qty}</td>
// //                       <td style={{ padding: '8px 10px', color: '#4b5563' }}>{item.uom || 'Month'}</td>
// //                       <td style={{ padding: '8px 10px', textAlign: 'right', color: '#4b5563' }}>${(item.price_list_rate || item.rate || 0).toLocaleString()}</td>
// //                       <td style={{ padding: '8px 10px', textAlign: 'right', color: '#111827', fontWeight: 600 }}>${(item.rate || 0).toLocaleString()}</td>
// //                       <td style={{ padding: '8px 10px', textAlign: 'right', color: '#111827', fontWeight: 600 }}>
// //                         ${((item.qty || 1) * (item.rate || 0)).toLocaleString()}
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>

// //             {/* TOTALS & SUMMARY */}
// //             <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: 10 }}>
// //               <div style={{ width: '50%', fontSize: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
// //                 <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
// //                   <span>Subtotal</span>
// //                   <span>${(selectedQuotationDetail.grand_total || 0).toLocaleString()}</span>
// //                 </div>
// //                 <div style={{ display: 'flex', justifyContent: 'space-between', color: '#111827', fontWeight: 700, fontSize: 12, borderTop: '1px solid #e5e7eb', paddingTop: 6 }}>
// //                   <span>Grand Total ({companyDetails.currency})</span>
// //                   <span>${(selectedQuotationDetail.grand_total || 0).toLocaleString()}</span>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* DYNAMIC ACTION BUTTONS */}
// //             <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
// //               <button
// //                 type="button"
// //                 className="btn btn-secondary"
// //                 style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444', background: 'transparent' }}
// //                 disabled={selectedQuotationDetail.status === 'Cancelled'}
// //                 onClick={() => handleCancelQuotation(selectedQuotationDetail.name)}
// //               >
// //                 Cancel Quotation
// //               </button>
// //               <button
// //                 type="button"
// //                 className="btn btn-primary"
// //                 style={{ flex: 1 }}
// //                 onClick={handleAmendQuotation}
// //               >
// //                 Amend & Revise
// //               </button>
// //             </div>

// //             {/* Go to Booking + Add Another */}
// //             <div style={{ display: 'flex', gap: 12 }}>
// //               <button
// //                 type="button"
// //                 className="btn btn-secondary"
// //                 style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
// //                 onClick={() => onGoToBooking && onGoToBooking(selectedQuotationDetail)}
// //               >
// //                 Go to Booking <ArrowUpRight size={14} />
// //               </button>
// //               {quotations.find(q => q.name === selectedQuotation?.name)?.workflow_state != "Request For Approval" ||
// //                 <button
// //                   type="button"
// //                   className="btn btn-primary"
// //                   style={{ flex: 1 }}
// //                   onClick={() => handelaction(selectedQuotation, 1)}
// //                 >
// //                   {/* <Plus size={14} style={{ marginRight: 4 }} /> */}
// //                   Approve Quotation
// //                 </button>}
// //               {quotations.find(q => q.name === selectedQuotation?.name)?.workflow_state != "Request For Approval" ||
// //                 <button
// //                   type="button"
// //                   className="btn btn-primary"
// //                   style={{ flex: 1 }}
// //                   onClick={() => handelaction(selectedQuotation, 0)}
// //                 >
// //                   {/* <Plus size={14} style={{ marginRight: 4 }} /> */}
// //                   reaject Quotation
// //                 </button>}
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* Create Quotation Modal */}
// //       {showAddModal && (
// //         <div className="modal-overlay">
// //           <div className="modal-content" style={{ maxWidth: 980, width: '96vw', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

// //             {/* Header */}
// //             <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
// //               <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Create New Quotation</h3>
// //               <button
// //                 onClick={() => setShowAddModal(false)}
// //                 style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 0 }}
// //               >×</button>
// //             </div>

// //             <form onSubmit={handleCreateQuotation} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
// //               <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '20px', overflowY: 'auto', flex: 1 }}>

// //                 {/* Error */}
// //                 {errorMsg && (
// //                   <div style={{ color: 'var(--color-danger)', background: 'rgba(239,68,68,0.1)', padding: '10px 12px', borderRadius: 6, fontSize: 12 }}>
// //                     {errorMsg}
// //                   </div>
// //                 )}

// //                 {/* Top fields — 2 columns, 2 rows */}
// //                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
// //                   <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
// //                     <label className="form-label" style={{ fontSize: 12, fontWeight: 500 }}>Customer Name</label>
// //                     <select
// //                       value={quoteCustomer}
// //                       onChange={(e) => setQuoteCustomer(e.target.value)}
// //                       className="form-select"
// //                       required
// //                       disabled={submitting}
// //                       style={{ fontSize: 13 }}
// //                     >
// //                       <option value="">-- Choose Customer --</option>
// //                       {customers.map(c => (
// //                         <option key={c.name} value={c.name}>{c.customer_name || c.name}</option>
// //                       ))}
// //                     </select>
// //                   </div>

// //                   <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
// //                     <label className="form-label" style={{ fontSize: 12, fontWeight: 500 }}>Template</label>
// //                     <select
// //                       value={quotetamplate}
// //                       onChange={(e) => setQuotetamplate(e.target.value)}
// //                       className="form-select"
// //                       required
// //                       disabled={submitting}
// //                       style={{ fontSize: 13 }}
// //                     >
// //                       <option value="">-- Choose Template --</option>
// //                       {tamplates.map(c => (
// //                         <option key={c.name} value={c.name}>{c.customer_name || c.name}</option>
// //                       ))}
// //                     </select>
// //                   </div>

// //                   <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
// //                     <label className="form-label" style={{ fontSize: 12, fontWeight: 500 }}>Start Date</label>
// //                     <input
// //                       type="date"
// //                       value={quoteEstBookingStart}
// //                       onChange={(e) => setQuoteEstBookingStart(e.target.value)}
// //                       className="form-input"
// //                       required
// //                       disabled={submitting}
// //                       style={{ fontSize: 13 }}
// //                     />
// //                   </div>

// //                   <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
// //                     <label className="form-label" style={{ fontSize: 12, fontWeight: 500 }}>End Date</label>
// //                     <input
// //                       type="date"
// //                       value={quoteEstBookingEnd}
// //                       onChange={(e) => setQuoteEstBookingEnd(e.target.value)}
// //                       className="form-input"
// //                       required
// //                       disabled={submitting}
// //                       style={{ fontSize: 13 }}
// //                     />
// //                   </div>
// //                 </div>

// //                 {/* Selected Units table */}
// //                 <div>
// //                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
// //                     <label className="form-label" style={{ margin: 0, fontSize: 12, fontWeight: 500 }}>Selected Units</label>
// //                     <button
// //                       type="button"
// //                       className="btn btn-secondary btn-sm"
// //                       onClick={addQuoteItem}
// //                       style={{ padding: '4px 10px', fontSize: 11 }}
// //                     >
// //                       + Add Row
// //                     </button>
// //                   </div>

// //                   <div style={{ border: '1px solid var(--border-color)', borderRadius: 6, overflow: 'hidden' }}>
// //                     <div style={{ overflowX: 'auto', maxHeight: 260, overflowY: 'auto' }}>
// //                       <table style={{ width: '100%', minWidth: 860, borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: 11 }}>
// //                         <colgroup>
// //                           <col style={{ width: 32 }} />
// //                           <col style={{ width: 150 }} />
// //                           <col style={{ width: 52 }} />
// //                           <col style={{ width: 52 }} />
// //                           <col style={{ width: 80 }} />
// //                           <col style={{ width: 88 }} />
// //                           <col style={{ width: 110 }} />
// //                           <col style={{ width: 90 }} />
// //                           <col style={{ width: 80 }} />
// //                           <col style={{ width: 72 }} />
// //                           <col style={{ width: 80 }} />
// //                           <col style={{ width: 32 }} />
// //                         </colgroup>
// //                         <thead>
// //                           <tr style={{ background: 'var(--color-bg-secondary, rgba(255,255,255,0.05))', position: 'sticky', top: 0, zIndex: 1 }}>
// //                             {['#', 'Unit Code', 'Qty', 'UOM', 'Val. Rate', 'Offered Rate', 'Property Group', 'Locality', 'District', 'Total Area', 'Amount', ''].map((h, i) => (
// //                               <th
// //                                 key={i}
// //                                 style={{
// //                                   padding: '7px 8px',
// //                                   textAlign: i === 10 ? 'right' : 'left',
// //                                   fontWeight: 500,
// //                                   fontSize: 11,
// //                                   color: 'var(--color-text-muted, #9ca3af)',
// //                                   borderBottom: '1px solid var(--border-color)',
// //                                   whiteSpace: 'nowrap',
// //                                   overflow: 'hidden',
// //                                   textOverflow: 'ellipsis',
// //                                 }}
// //                               >{h}</th>
// //                             ))}
// //                           </tr>
// //                         </thead>
// //                         <tbody>
// //                           {quoteItems.map((item, idx) => (
// //                             <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>

// //                               {/* # */}
// //                               <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)' }}>{idx + 1}</td>

// //                               {/* Unit Code */}
// //                               <td style={{ padding: '4px 6px' }}>
// //                                 <select
// //                                   value={item.unitId}
// //                                   onChange={(e) => handleItemChange(idx, e.target.value)}
// //                                   className="form-select"
// //                                   style={{ width: '100%', fontSize: 11, minHeight: 32, padding: '5px 6px', boxSizing: 'border-box', lineHeight: '1.4' }}
// //                                   required
// //                                 >
// //                                   <option value="">-- Choose Unit --</option>
// //                                   {spaceUnits.map(unit => (
// //                                     <option key={unit.name} value={unit.name}>{unit.item_name || unit.name}</option>
// //                                   ))}
// //                                 </select>
// //                               </td>

// //                               {/* Qty */}
// //                               <td style={{ padding: '4px 6px' }}>
// //                                 <input
// //                                   type="number"
// //                                   min="1"
// //                                   value={item.qty}
// //                                   onChange={(e) => handleQtyOrRateChange(idx, 'qty', e.target.value)}
// //                                   className="form-input"
// //                                   style={{ width: '100%', fontSize: 11, minHeight: 32, padding: '5px 6px', boxSizing: 'border-box', lineHeight: '1.4' }}
// //                                   required
// //                                 />
// //                               </td>

// //                               {/* UOM */}
// //                               <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)' }}>
// //                                 {item.loadingDetail ? '…' : (item.uom || '—')}
// //                               </td>

// //                               {/* Val. Rate */}
// //                               <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)' }}>
// //                                 {item.loadingDetail ? '…' : (item.standardRate ? `$${item.standardRate}` : '—')}
// //                               </td>

// //                               {/* Offered Rate */}
// //                               <td style={{ padding: '4px 6px' }}>
// //                                 <input
// //                                   type="number"
// //                                   value={item.offeredRate}
// //                                   onChange={(e) => handleQtyOrRateChange(idx, 'offeredRate', e.target.value)}
// //                                   className="form-input"
// //                                   style={{ width: '100%', fontSize: 11, minHeight: 32, padding: '5px 6px', boxSizing: 'border-box', lineHeight: '1.4' }}
// //                                   required
// //                                 />
// //                               </td>

// //                               {/* Property Group */}
// //                               <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// //                                 {item.loadingDetail ? '…' : (item.propertyGroup || '—')}
// //                               </td>

// //                               {/* Locality */}
// //                               <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// //                                 {item.loadingDetail ? '…' : (item.locality || '—')}
// //                               </td>

// //                               {/* District */}
// //                               <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// //                                 {item.loadingDetail ? '…' : (item.district || '—')}
// //                               </td>

// //                               {/* Total Area */}
// //                               <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)', textAlign: 'right' }}>
// //                                 {item.loadingDetail ? '…' : (item.totalArea || '—')}
// //                               </td>

// //                               {/* Amount */}
// //                               <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600 }}>
// //                                 ${((parseFloat(item.qty) || 1) * (parseFloat(item.offeredRate) || 0)).toLocaleString()}
// //                               </td>

// //                               {/* Delete */}
// //                               <td style={{ padding: '4px 4px', textAlign: 'center' }}>
// //                                 {quoteItems.length > 1 && (
// //                                   <button
// //                                     type="button"
// //                                     onClick={() => removeQuoteItem(idx)}
// //                                     style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center' }}
// //                                   >
// //                                     <Trash size={13} />
// //                                   </button>
// //                                 )}
// //                               </td>
// //                             </tr>
// //                           ))}
// //                         </tbody>
// //                       </table>
// //                     </div>

// //                     {/* Grand total footer */}
// //                     <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, padding: '8px 12px', borderTop: '1px solid var(--border-color)', background: 'var(--color-bg-secondary, rgba(255,255,255,0.03))' }}>
// //                       <span style={{ fontSize: 11, color: 'var(--color-text-muted, #9ca3af)' }}>Grand Total</span>
// //                       <span style={{ fontSize: 13, fontWeight: 600 }}>
// //                         ${quoteItems.reduce((sum, item) => sum + ((parseFloat(item.qty) || 1) * (parseFloat(item.offeredRate) || 0)), 0).toLocaleString()}
// //                       </span>
// //                     </div>
// //                   </div>
// //                 </div>

// //               </div>

// //               {/* Footer */}
// //               <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 20px', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
// //                 <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)} disabled={submitting}>
// //                   Cancel
// //                 </button>
// //                 <button type="submit" className="btn btn-primary" disabled={submitting}>
// //                   {submitting ? 'Creating...' : 'Submit Quotation'}
// //                 </button>
// //               </div>
// //             </form>

// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }



// import React, { useState, useEffect } from 'react';
// import { FileText, Plus, X, Search, CheckCircle2, AlertCircle, Edit, Trash2, Calendar, User, Building, Trash, Printer, ArrowUpRight } from 'lucide-react';

// const getCsrfToken = () => {
//   if (typeof window !== 'undefined' && window.csrf_token) {
//     return window.csrf_token;
//   }
//   if (typeof window !== 'undefined' && window.frappe && window.frappe.csrf_token) {
//     return window.frappe.csrf_token;
//   }
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; csrf_token=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
//   return '';
// };

// // Small self-contained toast banner. Reuse your app-wide toast system instead
// // if one already exists elsewhere in the codebase.
// function Toast({ toast, onClose }) {
//   if (!toast) return null;
//   const isSuccess = toast.type === 'success';
//   return (
//     <div
//       style={{
//         position: 'fixed',
//         top: 20,
//         right: 20,
//         zIndex: 9999,
//         minWidth: 280,
//         maxWidth: 420,
//         padding: '12px 16px',
//         borderRadius: 8,
//         display: 'flex',
//         alignItems: 'flex-start',
//         gap: 10,
//         boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
//         backgroundColor: isSuccess ? '#065f46' : '#991b1b',
//         color: '#ffffff',
//         fontSize: 13,
//         animation: 'fadeIn 0.2s ease-out'
//       }}
//     >
//       {isSuccess ? <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 1 }} /> : <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />}
//       <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
//       <button
//         onClick={onClose}
//         style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', opacity: 0.8, padding: 0, lineHeight: 1 }}
//       >
//         <X size={14} />
//       </button>
//     </div>
//   );
// }

// export default function Quotation({ erpnextConfig, properties = [], onGoToBooking }) {
//   const [quotations, setQuotations] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [tamplates, settamplates] = useState([]);

//   const [propertyGroups, setPropertyGroups] = useState([]); // Linked to Property Group doctype in ERPNext
//   const [spaceUnits, setSpaceUnits] = useState([]); // Linked to Item doctype representing individual units
//   const [templates, setTemplates] = useState([]); // Quotation templates filtered by reference_type: Quotation
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [successMsg, setSuccessMsg] = useState('');
//   const [debugMsg, setDebugMsg] = useState('');

//   // Toast notification state — used for Create / Cancel / Amend / Approve / Reject feedback
//   const [toast, setToast] = useState(null);

//   const showToast = (type, message) => {
//     setToast({ type, message });
//     window.clearTimeout(showToast._t);
//     showToast._t = window.setTimeout(() => setToast(null), 3500);
//   };

//   // Modals state
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [selectedQuotation, setSelectedQuotation] = useState(null);
//   const [selectedQuotationDetail, setSelectedQuotationDetail] = useState(null);

//   // Form states
//   const [quoteCustomer, setQuoteCustomer] = useState('');
//   const [quotetamplate, setQuotetamplate] = useState('');

//   const [quoteEstBookingStart, setQuoteEstBookingStart] = useState(() => new Date().toISOString().split('T')[0]); // Start Date
//   const [quoteEstBookingEnd, setQuoteEstBookingEnd] = useState(() => {
//     const d = new Date();
//     d.setDate(d.getDate() + 30);
//     return d.toISOString().split('T')[0];
//   }); // End Date
//   const [quoteStatus, setQuoteStatus] = useState('Draft');
//   const [quoteCompany, setQuoteCompany] = useState('CARPENTERS PROPERTIES PTE LIMITED');
//   const [quoteItems, setQuoteItems] = useState([{ unitId: '', qty: 1, uom: '', standardRate: '', offeredRate: '', propertyGroup: '', locality: '', district: '', totalArea: '', loadingDetail: false }]);

//   // Company Details (matching Invoice format)
//   const [companyDetails, setCompanyDetails] = useState({
//     name: 'CARPENTERS PROPERTIES PTE LTD',
//     address: '123 Cecil Street, #08-01, Singapore 069537',
//     phone: '+65 6123 4567',
//     email: 'info@carpentersproperties.com',
//     website: 'www.carpentersproperties.com',
//     currency: 'SGD'
//   });

//   // Selected Customer Address and Contact for current print view
//   const [customerAddress, setCustomerAddress] = useState('');
//   const [customerContact, setCustomerContact] = useState('');

//   // Fetch company details from ERPNext
//   useEffect(() => {
//     if (!erpnextConfig || !erpnextConfig.url) return;
//     const fetchCompany = async () => {
//       try {
//         const res = await fetch(`${erpnextConfig.url}/api/resource/Company/CARPENTERS PROPERTIES PTE LIMITED`, {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         });
//         if (res.ok) {
//           const json = await res.json();
//           const doc = json.data || json;
//           setCompanyDetails(prev => ({
//             ...prev,
//             name: doc.name || prev.name,
//             currency: doc.default_currency || prev.currency,
//           }));

//           // Fetch Address
//           const addrRes = await fetch(`${erpnextConfig.url}/api/resource/Address?filters=[["Dynamic Link", "link_doctype", "=", "Company"], ["Dynamic Link", "link_name", "=", "${doc.name}"]]&fields=["address_line1","address_line2","city","state","country","pincode","phone","email_id"]`, {
//             credentials: 'include',
//             headers: {
//               'Content-Type': 'application/json'
//             }
//           });
//           if (addrRes.ok) {
//             const addrJson = await addrRes.json();
//             const addrList = addrJson.data || [];
//             if (addrList.length > 0) {
//               const addr = addrList[0];
//               const addrParts = [addr.address_line1, addr.address_line2, addr.city, addr.state, addr.country, addr.pincode].filter(Boolean);
//               setCompanyDetails(prev => ({
//                 ...prev,
//                 address: addrParts.join(', ') || prev.address,
//                 phone: addr.phone || prev.phone,
//                 email: addr.email_id || prev.email
//               }));
//             }
//           }
//         }
//       } catch (err) {
//         console.warn('Failed fetching company details:', err);
//       }
//     };
//     fetchCompany();
//   }, [erpnextConfig]);

//   // Fetch customers from ERPNext Doctype Customer
//   const fetchCustomersList = async () => {
//     if (!erpnextConfig || !erpnextConfig.url) return;
//     try {
//       const res = await fetch(`${erpnextConfig.url}/api/resource/Customer?fields=["name","customer_name"]&limit_page_length=200`, {
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
//       if (res.ok) {
//         const json = await res.json();
//         setCustomers(json.data || []);
//       } else {
//         const text = await res.text();
//         console.warn('Customer fetch failed:', res.status, text);
//         setDebugMsg(`Customer fetch failed (${res.status}): ${text.slice(0, 200)}`);
//       }
//     } catch (e) {
//       console.warn('Failed fetching Customer list:', e);
//       setDebugMsg(`Customer fetch error: ${e.message}`);
//     }
//   };
//   const fetchtamplateList = async () => {
//     if (!erpnextConfig || !erpnextConfig.url) return;
//     try {
//       const res = await fetch(`${erpnextConfig.url}/api/resource/Contract%20Template?fields=["name"]&filters=[["custom_reference_type","=","Quotation"]]&limit_page_length=200`, {
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
//       if (res.ok) {
//         const json = await res.json();
//         settamplates(json.data || []);
//       } else {
//         const text = await res.text();
//         console.warn('Tamplate fetch failed:', res.status, text);
//         setDebugMsg(`Tamplate fetch failed (${res.status}): ${text.slice(0, 200)}`);
//       }
//     } catch (e) {
//       console.warn('Failed fetching Tamplate list:', e);
//       setDebugMsg(`Tamplate fetch error: ${e.message}`);
//     }
//   };

//   // Fetch ALL Space Units (Items) — unfiltered, using only fields known to exist
//   // so the request can never silently fail because of a guessed custom fieldname.
//   const fetchSpaceUnits = async () => {
//     if (!erpnextConfig || !erpnextConfig.url) return;
//     try {
//       const url = `${erpnextConfig.url}/api/resource/Item?fields=["name","item_name","standard_rate","valuation_rate","custom_property_reference","stock_uom"]&limit_page_length=500`;
//       const res = await fetch(url, {
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
//       if (res.ok) {
//         const json = await res.json();
//         setSpaceUnits(json.data || []);
//         if ((json.data || []).length === 0) {
//           setDebugMsg('Item fetch succeeded but returned 0 records — check Items exist and role can read Item.');
//         }
//       } else {
//         const text = await res.text();
//         console.warn('Item fetch failed:', res.status, text);
//         setDebugMsg(`Item fetch failed (${res.status}): ${text.slice(0, 300)}`);
//       }
//     } catch (e) {
//       console.warn('Failed fetching Space Units (Items):', e);
//       setDebugMsg(`Item fetch error: ${e.message}`);
//     }
//   };

//   // Fetch quotations from ERPNext
//   const fetchQuotations = async () => {
//     console.log("hit the fetch")
//     if (!erpnextConfig || !erpnextConfig.url) {
//       setQuotations([
//         { name: 'QTN-2026-00001', customer_name: 'Sarah Jenkins', transaction_date: '2026-06-01', valid_till: '2026-06-30', grand_total: 6200, status: 'Submitted' },
//         { name: 'QTN-2026-00002', customer_name: 'John Doe', transaction_date: '2026-06-05', valid_till: '2026-07-05', grand_total: 4500, status: 'Draft' }
//       ]);
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation?fields=["name","customer_name","party_name","transaction_date","valid_till","grand_total","status","workflow_state"]&limit_page_length=100&order_by=creation desc`, {
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
//       if (res.ok) {
//         const json = await res.json();
//         setQuotations(json.data || []);
//       } else {
//         const text = await res.text();
//         console.warn('Quotation fetch failed:', res.status, text);
//         setDebugMsg(`Quotation fetch failed (${res.status}): ${text.slice(0, 200)}`);
//       }
//     } catch (e) {
//       console.warn('Failed fetching quotations:', e);
//       setDebugMsg(`Quotation fetch error: ${e.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuotations();
//     fetchCustomersList();
//     fetchtamplateList();
//     fetchSpaceUnits();
//   }, [erpnextConfig]);

//   // Handle detailed Quotation view & retrieve client CRM metadata
//   const fetchQuotationDetail = async (qName, customerId) => {
//     if (!erpnextConfig || !erpnextConfig.url) return;
//     try {
//       const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${qName}`, {
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
//       if (res.ok) {
//         const json = await res.json();
//         const doc = json.data || json;
//         setSelectedQuotationDetail(doc);

//         // Fetch Customer Address & Contact
//         const actualCustomer = customerId || doc.party_name || doc.customer;
//         if (actualCustomer) {
//           // Fetch Address linked to customer
//           const addrRes = await fetch(`${erpnextConfig.url}/api/resource/Address?filters=[["Dynamic Link", "link_doctype", "=", "Customer"], ["Dynamic Link", "link_name", "=", "${actualCustomer}"]]&fields=["address_line1","address_line2","city","state","country","pincode"]`, {
//             credentials: 'include',
//             headers: {
//               'Content-Type': 'application/json'
//             }
//           });
//           if (addrRes.ok) {
//             const addrJson = await addrRes.json();
//             const addrList = addrJson.data || [];
//             if (addrList.length > 0) {
//               const addr = addrList[0];
//               setCustomerAddress([addr.address_line1, addr.address_line2, addr.city, addr.state, addr.country, addr.pincode].filter(Boolean).join(', '));
//             } else {
//               setCustomerAddress('Registered Address not specified');
//             }
//           }

//           // Fetch Contact linked to customer
//           const contactRes = await fetch(`${erpnextConfig.url}/api/resource/Contact?filters=[["Dynamic Link", "link_doctype", "=", "Customer"], ["Dynamic Link", "link_name", "=", "${actualCustomer}"]]&fields=["email_id","phone"]`, {
//             credentials: 'include',
//             headers: {
//               'Content-Type': 'application/json'
//             }
//           });
//           if (contactRes.ok) {
//             const contactJson = await contactRes.json();
//             const contactList = contactJson.data || [];
//             if (contactList.length > 0) {
//               const ct = contactList[0];
//               setCustomerContact([ct.email_id, ct.phone].filter(Boolean).join(' | '));
//             } else {
//               setCustomerContact('Contact info not specified');
//             }
//           }
//         }
//       }
//     } catch (e) {
//       console.warn('Failed fetching quotation detail:', e);
//     }
//   };

//   const handleRowClick = (quote) => {
//     setSelectedQuotation(quote);
//     fetchQuotationDetail(quote.name, quote.party_name || quote.customer);
//   };

//   // Form helpers
//   const addQuoteItem = () => {
//     setQuoteItems([...quoteItems, { unitId: '', qty: 1, uom: '', standardRate: '', offeredRate: '', propertyGroup: '', locality: '', district: '', totalArea: '', loadingDetail: false }]);
//   };

//   const removeQuoteItem = (index) => {
//     const updated = [...quoteItems];
//     updated.splice(index, 1);
//     setQuoteItems(updated);
//   };

//   const handleQtyOrRateChange = (index, field, value) => {
//     const updated = [...quoteItems];
//     updated[index][field] = value;
//     setQuoteItems(updated);
//   };

//   // Selecting a Unit fetches the FULL Item document (works regardless of the
//   // exact custom fieldnames on your site) and auto-populates the row —
//   // rate, UOM, Property Group, Locality, District, Total Area.
//   const handleItemChange = async (index, unitId) => {
//     const listMatch = spaceUnits.find(u => u.name === unitId);

//     setQuoteItems(prev => {
//       const updated = [...prev];
//       const valRate = listMatch ? (listMatch.valuation_rate || listMatch.standard_rate || 0) : 0;
//       updated[index] = {
//         ...updated[index],
//         unitId,
//         standardRate: valRate,
//         offeredRate: valRate,
//         uom: listMatch ? (listMatch.stock_uom || 'Unit') : 'Unit',
//         propertyGroup: listMatch ? (listMatch.custom_property_reference || '') : '',
//         loadingDetail: true
//       };
//       return updated;
//     });

//     if (!unitId || !erpnextConfig || !erpnextConfig.url) {
//       setQuoteItems(prev => {
//         const updated = [...prev];
//         if (updated[index]) updated[index].loadingDetail = false;
//         return updated;
//       });
//       return;
//     }

//     try {
//       const res = await fetch(`${erpnextConfig.url}/api/resource/Item/${unitId}`, {
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' }
//       });
//       if (res.ok) {
//         const json = await res.json();
//         const doc = json.data || json;
//         const findVal = (keywords) => {
//           for (const kw of keywords) {
//             if (doc[kw] !== undefined && doc[kw] !== null && doc[kw] !== '') return doc[kw];
//           }
//           const keys = Object.keys(doc);
//           for (const kw of keywords) {
//             const found = keys.find(k => k.toLowerCase().includes(kw));
//             if (found && doc[found] !== undefined && doc[found] !== null && doc[found] !== '') return doc[found];
//           }
//           return '';
//         };
//         setQuoteItems(prev => {
//           const updated = [...prev];
//           if (updated[index] && updated[index].unitId === unitId) {
//             updated[index] = {
//               ...updated[index],
//               propertyGroup: findVal(['custom_property_reference', 'property_group', 'property']) || updated[index].propertyGroup,
//               locality: findVal(['locality']),
//               district: findVal(['district']),
//               totalArea: findVal(['total_area', 'area_sqft', 'area']),
//               loadingDetail: false
//             };
//           }
//           return updated;
//         });
//       } else {
//         const text = await res.text();
//         setDebugMsg(`Item detail fetch failed (${res.status}): ${text.slice(0, 200)}`);
//         setQuoteItems(prev => {
//           const updated = [...prev];
//           if (updated[index]) updated[index].loadingDetail = false;
//           return updated;
//         });
//       }
//     } catch (e) {
//       setDebugMsg(`Item detail fetch error: ${e.message}`);
//       setQuoteItems(prev => {
//         const updated = [...prev];
//         if (updated[index]) updated[index].loadingDetail = false;
//         return updated;
//       });
//     }
//   };

//   const resetForm = () => {
//     setQuoteCustomer('');
//     setQuotetamplate('')
//     setQuoteEstBookingStart('')
//     const d = new Date();
//     d.setDate(d.getDate() + 30);
//     setQuoteEstBookingEnd('')
//     setQuoteItems([{ unitId: '', qty: 1, uom: '', standardRate: '', offeredRate: '', propertyGroup: '', locality: '', district: '', totalArea: '', loadingDetail: false }]);
//     setErrorMsg('');
//   };

//   // Submit new Quotation
//   const handleCreateQuotation = async (e) => {
//     e.preventDefault();
//     if (!quoteCustomer || !quoteEstBookingStart || !quoteEstBookingEnd) return;

//     const matchedCust = customers.find(c => c.name === quoteCustomer);

//     const erpItems = quoteItems.filter(item => item.unitId).map(item => {
//       const matched = spaceUnits.find(u => u.name === item.unitId);
//       const standardRateNum = parseFloat(item.standardRate) || 0;
//       const offeredRateNum = parseFloat(item.offeredRate) || 0;

//       return {
//         item_code: item.unitId,
//         qty: parseFloat(item.qty) || 1,
//         rate: offeredRateNum,
//         price_list_rate: standardRateNum,
//         amount: (parseFloat(item.qty) || 1) * offeredRateNum,
//         uom: item.uom || 'Unit',
//         item_name: matched ? matched.item_name : item.unitId
//       };
//     });

//     if (erpItems.length === 0) {
//       setErrorMsg('You must add at least one Property Unit.');
//       return;
//     }

//     // Confirmation box before submitting
//     const confirmMsg = `Create quotation for ${matchedCust ? (matchedCust.customer_name || matchedCust.name) : quoteCustomer} with ${erpItems.length} unit(s)?`;
//     if (!window.confirm(confirmMsg)) return;

//     setSubmitting(true);
//     setErrorMsg('');
//     setSuccessMsg('');

//     const payload = {
//       customer: quoteCustomer,
//       party_name: quoteCustomer,
//       customer_name: matchedCust ? matchedCust.customer_name : quoteCustomer,
//       quotation_to: 'Customer',
//       transaction_date: quoteEstBookingStart,
//       valid_till: quoteEstBookingEnd,
//       company: quoteCompany,
//       status: quoteStatus,
//       custom_start_date: quoteEstBookingStart || null,
//       custom_end_date: quoteEstBookingEnd || null,
//       custom_template: quotetamplate,
//       items: erpItems
//     };
//     console.log(payload)

//     try {
//       let createdName = null;
//       if (erpnextConfig && erpnextConfig.url) {
//         const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation`, {
//           method: 'POST',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//             'X-Frappe-CSRF-Token': getCsrfToken()
//           },
//           body: JSON.stringify(payload)
//         });
//         if (!res.ok) {
//           const errData = await res.json();
//           let rawMsg = 'Failed to create quotation on server.';
//           if (errData._server_messages) {
//             try {
//               const msgs = JSON.parse(errData._server_messages);
//               const firstMsgObj = JSON.parse(msgs[0]);
//               rawMsg = firstMsgObj.message || rawMsg;
//             } catch (e) {
//               try {
//                 const msgs = JSON.parse(errData._server_messages);
//                 rawMsg = msgs[0] || rawMsg;
//               } catch (inner) {
//                 rawMsg = errData._server_messages;
//               }
//             }
//           } else if (errData.message) {
//             rawMsg = errData.message;
//           }
//           throw new Error(rawMsg);
//         }
//         const created = await res.json();
//         createdName = (created.data || created)?.name || null;
//       }

//       setSuccessMsg('Quotation created successfully!');
//       showToast('success', `Quotation ${createdName || ''} created successfully.`);
//       await fetchQuotations();
//       setShowAddModal(false);
//       resetForm();

//       // Auto-select the newly created quotation in the preview pane by default
//       if (createdName) {
//         setSelectedQuotation({ name: createdName });
//         fetchQuotationDetail(createdName, quoteCustomer);
//       }
//     } catch (err) {
//       setErrorMsg(err.message);
//       showToast('error', err.message || 'Failed to create quotation.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Cancel Quotation Workflow (Sets status to 'Cancelled')
//   const handleCancelQuotation = async (qName) => {
//     if (!confirm(`Are you sure you want to cancel quotation ${qName}? This cannot be undone.`)) return;
//     setLoading(true);
//     try {
//       if (erpnextConfig && erpnextConfig.url) {
//         const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${qName}`, {
//           method: 'PUT',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//             'X-Frappe-CSRF-Token': getCsrfToken()
//           },
//           body: JSON.stringify({ status: 'Cancelled' })
//         });
//         if (!res.ok) {
//           let rawMsg = 'Failed to cancel quotation.';
//           try {
//             const errData = await res.json();
//             if (errData._server_messages) {
//               try {
//                 const msgs = JSON.parse(errData._server_messages);
//                 const firstMsgObj = JSON.parse(msgs[0]);
//                 rawMsg = firstMsgObj.message || rawMsg;
//               } catch (inner) {
//                 rawMsg = errData._server_messages;
//               }
//             } else if (errData.message) {
//               rawMsg = errData.message;
//             }
//           } catch (parseErr) {
//             // keep default rawMsg
//           }
//           throw new Error(rawMsg);
//         }
//       }
//       showToast('success', `Quotation ${qName} cancelled successfully.`);
//       setSelectedQuotation(null);
//       setSelectedQuotationDetail(null);
//       fetchQuotations();
//     } catch (e) {
//       showToast('error', e.message || 'Failed to cancel quotation.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Amend Quotation Workflow (Revision logic)
//   const handleAmendQuotation = async () => {
//     if (!selectedQuotationDetail) return;
//     if (!confirm(`This action will Cancel the current quotation revision ${selectedQuotationDetail.name} and create a new editable draft. Proceed?`)) return;

//     setLoading(true);
//     setErrorMsg('');

//     try {
//       // 1. Cancel current revision
//       if (erpnextConfig && erpnextConfig.url) {
//         const cancelRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${selectedQuotationDetail.name}`, {
//           method: 'PUT',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//             'X-Frappe-CSRF-Token': getCsrfToken()
//           },
//           body: JSON.stringify({ status: 'Cancelled' })
//         });
//         if (!cancelRes.ok) {
//           throw new Error('Failed to cancel the current version during amendment.');
//         }
//       }

//       // 2. Parse revision details & increment name revision tag
//       let currentRevisionCode = selectedQuotationDetail.name;
//       let nextRevisionCode = '';
//       const revParts = currentRevisionCode.split('-');
//       const lastPart = revParts[revParts.length - 1];

//       // Check if it already has an amendment number (e.g. QTN-2026-00001-1)
//       if (!isNaN(parseInt(lastPart, 10)) && revParts.length > 3) {
//         const nextRevNum = parseInt(lastPart, 10) + 1;
//         revParts[revParts.length - 1] = nextRevNum.toString();
//         nextRevisionCode = revParts.join('-');
//       } else {
//         nextRevisionCode = `${currentRevisionCode}-1`;
//       }

//       // 3. Construct new payload draft
//       const newItems = (selectedQuotationDetail.items || []).map(item => ({
//         item_code: item.item_code,
//         qty: item.qty || 1,
//         rate: item.rate || 0,
//         price_list_rate: item.price_list_rate || item.rate || 0,
//         uom: item.uom || 'Month',
//         item_name: item.item_name
//       }));

//       const payload = {
//         name: nextRevisionCode,
//         customer: selectedQuotationDetail.party_name || selectedQuotationDetail.customer,
//         party_name: selectedQuotationDetail.party_name || selectedQuotationDetail.customer,
//         customer_name: selectedQuotationDetail.customer_name,
//         quotation_to: 'Customer',
//         transaction_date: new Date().toISOString().split('T')[0],
//         valid_till: selectedQuotationDetail.valid_till,
//         company: selectedQuotationDetail.company || 'CARPENTERS PROPERTIES PTE LIMITED',
//         status: 'Draft',
//         custom_start_date: selectedQuotationDetail.custom_start_date || null,
//         custom_end_date: selectedQuotationDetail.custom_end_date || null,
//         items: newItems
//       };

//       if (erpnextConfig && erpnextConfig.url) {
//         const createRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation`, {
//           method: 'POST',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//             'X-Frappe-CSRF-Token': getCsrfToken()
//           },
//           body: JSON.stringify(payload)
//         });
//         if (!createRes.ok) {
//           const errData = await createRes.json();
//           let rawMsg = 'Failed to create amendment draft on server.';
//           if (errData._server_messages) {
//             try {
//               const msgs = JSON.parse(errData._server_messages);
//               const firstMsgObj = JSON.parse(msgs[0]);
//               rawMsg = firstMsgObj.message || rawMsg;
//             } catch (e) {
//               try {
//                 const msgs = JSON.parse(errData._server_messages);
//                 rawMsg = msgs[0] || rawMsg;
//               } catch (inner) {
//                 rawMsg = errData._server_messages;
//               }
//             }
//           } else if (errData.message) {
//             rawMsg = errData.message;
//           }
//           throw new Error(rawMsg);
//         }
//       }

//       showToast('success', `Quotation ${selectedQuotationDetail.name} amended. New draft ${nextRevisionCode} created.`);
//       setSelectedQuotation(null);
//       setSelectedQuotationDetail(null);
//       fetchQuotations();
//     } catch (e) {
//       showToast('error', e.message || 'Failed to amend quotation.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Approve / Reject Quotation Workflow
//   // state_code: 1 = Approve, 0 = Reject
//   const handelaction = async (con, state_code) => {
//     const actionLabel = state_code ? 'approve' : 'reject';

//     // Confirmation box before execution
//     if (!confirm(`Are you sure you want to ${actionLabel} quotation ${con.name}?`)) return;

//     try {
//       const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${con.name}`, {
//         method: "PUT",
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Frappe-CSRF-Token': getCsrfToken()
//         },
//         body: JSON.stringify({
//           "workflow_state": state_code ? "Approved" : "Drafted"
//         })
//       });

//       if (!res.ok) {
//         let rawMsg = `Failed to ${actionLabel} quotation ${con.name}.`;
//         try {
//           const errData = await res.json();
//           if (errData._server_messages) {
//             try {
//               const msgs = JSON.parse(errData._server_messages);
//               const firstMsgObj = JSON.parse(msgs[0]);
//               rawMsg = firstMsgObj.message || rawMsg;
//             } catch (inner) {
//               rawMsg = errData._server_messages;
//             }
//           } else if (errData.message) {
//             rawMsg = errData.message;
//           }
//         } catch (parseErr) {
//           // keep default rawMsg if body isn't JSON
//         }
//         throw new Error(rawMsg);
//       }

//       showToast('success', `Quotation ${con.name} ${state_code ? 'approved' : 'rejected'} successfully.`);
//       fetchQuotations();
//     } catch (e) {
//       showToast('error', e.message || `Failed to ${actionLabel} quotation ${con.name}.`);
//     }
//   };

//   return (
//     <div>
//       {/* Toast notification — Create / Cancel / Amend / Approve / Reject feedback */}
//       <Toast toast={toast} onClose={() => setToast(null)} />

//       <div className="view-header">
//         <div>
//           <h1 className="view-title">Quotation & Proposal Management</h1>
//           <p className="view-subtitle">Generate dynamic leasing proposals with multiple property units and track customer quotations.</p>
//         </div>
//         <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>
//           <Plus size={16} /> Create Quotation
//         </button>
//       </div>

//       {debugMsg && (
//         <div style={{ color: '#92400e', background: '#fef3c7', padding: '8px 12px', borderRadius: 6, fontSize: 12, marginBottom: 16 }}>
//           ⚠ {debugMsg}
//         </div>
//       )}

//       <div className="grid-2col" style={{ gridTemplateColumns: selectedQuotation ? '50% calc(50% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>

//         {/* Quotations List Table */}
//         <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
//           <div className="table-container">
//             <table className="custom-table">
//               <thead>
//                 <tr>
//                   <th>Quotation ID</th>
//                   <th>Customer Name</th>
//                   <th>Quote Date</th>
//                   <th>Valid Till</th>
//                   <th>Grand Total</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {quotations.map(q => (
//                   <tr
//                     key={q.name}
//                     onClick={() => handleRowClick(q)}
//                     style={{
//                       cursor: 'pointer',
//                       backgroundColor: selectedQuotation?.name === q.name ? 'var(--bg-accent-alpha)' : '',
//                       borderLeft: selectedQuotation?.name === q.name ? '3px solid var(--brand-color)' : ''
//                     }}
//                   >
//                     <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{q.name}</td>
//                     <td style={{ fontWeight: 600 }}>{q.customer_name}</td>
//                     <td>{q.transaction_date}</td>
//                     <td>{q.valid_till}</td>
//                     <td style={{ fontWeight: 600 }}>${(q.grand_total || 0).toLocaleString()}</td>
//                     <td>
//                       <span className={`badge ${q.status === 'Submitted' ? 'badge-success' : q.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
//                         {q.workflow_state}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//                 {quotations.length === 0 && (
//                   <tr>
//                     <td colSpan="6" style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
//                       No quotations found. Click "Create Quotation" to add one.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Detailed Quotation TAX INVOICE styled Print View */}
//         {selectedQuotation && selectedQuotationDetail && (
//           <div className="card-panel" style={{ padding: 24, background: '#ffffff', color: '#111827', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.2s ease-out', position: 'relative' }}>

//             {/* Close details button */}
//             <button
//               onClick={() => { setSelectedQuotation(null); setSelectedQuotationDetail(null); }}
//               style={{ position: 'absolute', top: 12, right: 12, background: '#f3f4f6', border: 'none', borderRadius: '50%', color: '#374151', cursor: 'pointer', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//             >
//               ×
//             </button>

//             {/* TOP HEADER SECTION */}
//             <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: 14 }}>
//               {/* Logo & Company info */}
//               <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
//                 <svg viewBox="0 0 100 100" style={{ width: 42, height: 42, borderRadius: 6, display: 'inline-block' }}>
//                   <rect width="100" height="100" fill="#000000" rx="12" />
//                   <circle cx="50" cy="50" r="36" fill="#FFDD00" />
//                   <polygon points="50,50 86,14 100,14 100,86 86,86" fill="#000000" />
//                   <line x1="24" y1="76" x2="50" y2="50" stroke="#000000" strokeWidth="5.5" strokeLinecap="round" />
//                 </svg>
//                 <div style={{ fontSize: 10, color: '#4b5563', lineHeight: 1.3 }}>
//                   <h4 style={{ color: '#111827', fontWeight: 800, fontSize: 13, marginBottom: 4, letterSpacing: '0.02em' }}>{companyDetails.name}</h4>
//                   <p>{companyDetails.address}</p>
//                   <p>Tel: {companyDetails.phone}</p>
//                   <p>Email: {companyDetails.email}</p>
//                   <p>{companyDetails.website}</p>
//                 </div>
//               </div>

//               {/* Quotation Identity details */}
//               <div style={{ textAlign: 'right', fontSize: 11, color: '#4b5563', lineHeight: 1.4 }}>
//                 <h3 style={{ color: '#111827', fontWeight: 800, fontSize: 14, margin: '0 0 6px 0', letterSpacing: '0.03em' }}>PROPOSAL / QUOTATION</h3>
//                 <p><span style={{ color: '#6b7280' }}>Reference Code</span> &nbsp;&nbsp; {selectedQuotationDetail.name}</p>
//                 <p><span style={{ color: '#6b7280' }}>Date Issued</span> &nbsp;&nbsp; {selectedQuotationDetail.transaction_date}</p>
//                 <p><span style={{ color: '#6b7280' }}>Valid Until</span> &nbsp;&nbsp; {selectedQuotationDetail.valid_till}</p>
//                 <p style={{ marginTop: 6 }}>
//                   <span style={{
//                     padding: '2px 8px',
//                     borderRadius: 10,
//                     fontSize: 9,
//                     fontWeight: 700,
//                     backgroundColor: selectedQuotationDetail.status === 'Submitted' ? '#d1fae5' : selectedQuotationDetail.status === 'Cancelled' ? '#fee2e2' : '#fef3c7',
//                     color: selectedQuotationDetail.status === 'Submitted' ? '#065f46' : selectedQuotationDetail.status === 'Cancelled' ? '#991b1b' : '#92400e'
//                   }}>
//                     {selectedQuotationDetail.status.toUpperCase()}
//                   </span>
//                 </p>
//               </div>
//             </div>

//             {/* BILL TO / CUSTOMER INFO */}
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 10, paddingBottom: 6 }}>
//               <div>
//                 <span style={{ color: '#6b7280', textTransform: 'uppercase', display: 'block', fontWeight: 700, fontSize: 9, marginBottom: 4 }}>PROPOSED TO</span>
//                 <strong style={{ fontSize: 11, color: '#111827', display: 'block' }}>{selectedQuotationDetail.customer_name}</strong>
//                 <p style={{ color: '#4b5563', lineHeight: 1.3, marginTop: 2 }}>{customerAddress}</p>
//                 <p style={{ color: '#4b5563', fontSize: 9, marginTop: 4 }}>Contact: {customerContact}</p>
//               </div>
//               <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 9, display: 'flex', flexDirection: 'column', gap: 4 }}>
//                 <span style={{ color: '#6b7280', fontWeight: 700 }}>ESTIMATED BOOKING PERIOD</span>
//                 <div>Start: <strong style={{ color: '#111827' }}>{selectedQuotationDetail.custom_start_date || 'N/A'}</strong></div>
//                 <div>End: <strong style={{ color: '#111827' }}>{selectedQuotationDetail.custom_end_date || 'N/A'}</strong></div>
//               </div>
//             </div>

//             {/* QUOTATION ITEMS TABLE */}
//             <div style={{ border: '1px solid #e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
//               <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, textAlign: 'left' }}>
//                 <thead>
//                   <tr style={{ background: '#1f2937', color: '#ffffff', borderBottom: '1px solid #374151' }}>
//                     <th style={{ padding: '8px 10px', color: '#ffffff' }}>Item Name</th>
//                     <th style={{ padding: '8px 10px', color: '#ffffff' }}>Qty</th>
//                     <th style={{ padding: '8px 10px', color: '#ffffff' }}>UOM</th>
//                     <th style={{ padding: '8px 10px', textAlign: 'right', color: '#ffffff' }}>Standard Rate ({companyDetails.currency})</th>
//                     <th style={{ padding: '8px 10px', textAlign: 'right', color: '#ffffff' }}>Offered Rate ({companyDetails.currency})</th>
//                     <th style={{ padding: '8px 10px', textAlign: 'right', color: '#ffffff' }}>Amount ({companyDetails.currency})</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(selectedQuotationDetail.items || []).map((item, idx) => (
//                     <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
//                       <td style={{ padding: '8px 10px', color: '#374151', fontWeight: 600 }}>{item.item_name || item.item_code}</td>
//                       <td style={{ padding: '8px 10px', color: '#4b5563' }}>{item.qty}</td>
//                       <td style={{ padding: '8px 10px', color: '#4b5563' }}>{item.uom || 'Month'}</td>
//                       <td style={{ padding: '8px 10px', textAlign: 'right', color: '#4b5563' }}>${(item.price_list_rate || item.rate || 0).toLocaleString()}</td>
//                       <td style={{ padding: '8px 10px', textAlign: 'right', color: '#111827', fontWeight: 600 }}>${(item.rate || 0).toLocaleString()}</td>
//                       <td style={{ padding: '8px 10px', textAlign: 'right', color: '#111827', fontWeight: 600 }}>
//                         ${((item.qty || 1) * (item.rate || 0)).toLocaleString()}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* TOTALS & SUMMARY */}
//             <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: 10 }}>
//               <div style={{ width: '50%', fontSize: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
//                   <span>Subtotal</span>
//                   <span>${(selectedQuotationDetail.grand_total || 0).toLocaleString()}</span>
//                 </div>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', color: '#111827', fontWeight: 700, fontSize: 12, borderTop: '1px solid #e5e7eb', paddingTop: 6 }}>
//                   <span>Grand Total ({companyDetails.currency})</span>
//                   <span>${(selectedQuotationDetail.grand_total || 0).toLocaleString()}</span>
//                 </div>
//               </div>
//             </div>

//             {/* DYNAMIC ACTION BUTTONS */}
//             {/* <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444', background: 'transparent' }}
//                 disabled={selectedQuotationDetail.status === 'Cancelled'}
//                 onClick={() => handleCancelQuotation(selectedQuotationDetail.name)}
//               >
//                 Cancel Quotation
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-primary"
//                 style={{ flex: 1 }}
//                 onClick={handleAmendQuotation}
//               >
//                 Amend & Revise
//               </button>
//             </div> */}

//             {/* Go to Booking + Add Another */}
//             {
//               quotations.find(q => q.name === selectedQuotation?.name)?.workflow_state != "Request For Approval" ||
//               <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>

//                 <button
//                   // type="button"
//                   // className="btn btn-primary"
//                   type="button"
//                   className="btn btn-secondary"
//                   style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444', background: 'transparent' }}
//                   // style={{ flex: 1 }}
//                   onClick={() => handelaction(selectedQuotation, 0)}
//                 >
//                   Cancel Quotation
//                 </button>

//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   style={{ flex: 1 }}
//                   onClick={() => handelaction(selectedQuotation, 1)}
//                 >
//                   Approve Quotation
//                 </button>

//               </div>
//             }
//             <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
//                 onClick={() => onGoToBooking && onGoToBooking(selectedQuotationDetail)}
//               >
//                 Go to Booking <ArrowUpRight size={14} />
//               </button>
//             </div>

//           </div>
//         )}
//       </div>

//       {/* Create Quotation Modal */}
//       {showAddModal && (
//         <div className="modal-overlay">
//           <div className="modal-content" style={{ maxWidth: 980, width: '96vw', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

//             {/* Header */}
//             <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
//               <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Create New Quotation</h3>
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 0 }}
//               >×</button>
//             </div>

//             <form onSubmit={handleCreateQuotation} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
//               <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '20px', overflowY: 'auto', flex: 1 }}>

//                 {/* Error */}
//                 {errorMsg && (
//                   <div style={{ color: 'var(--color-danger)', background: 'rgba(239,68,68,0.1)', padding: '10px 12px', borderRadius: 6, fontSize: 12 }}>
//                     {errorMsg}
//                   </div>
//                 )}

//                 {/* Top fields — 2 columns, 2 rows */}
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
//                   <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
//                     <label className="form-label" style={{ fontSize: 12, fontWeight: 500 }}>Customer Name</label>
//                     <select
//                       value={quoteCustomer}
//                       onChange={(e) => setQuoteCustomer(e.target.value)}
//                       className="form-select"
//                       required
//                       disabled={submitting}
//                       style={{ fontSize: 13 }}
//                     >
//                       <option value="">-- Choose Customer --</option>
//                       {customers.map(c => (
//                         <option key={c.name} value={c.name}>{c.customer_name || c.name}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
//                     <label className="form-label" style={{ fontSize: 12, fontWeight: 500 }}>Template</label>
//                     <select
//                       value={quotetamplate}
//                       onChange={(e) => setQuotetamplate(e.target.value)}
//                       className="form-select"
//                       required
//                       disabled={submitting}
//                       style={{ fontSize: 13 }}
//                     >
//                       <option value="">-- Choose Template --</option>
//                       {tamplates.map(c => (
//                         <option key={c.name} value={c.name}>{c.customer_name || c.name}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
//                     <label className="form-label" style={{ fontSize: 12, fontWeight: 500 }}>Start Date</label>
//                     <input
//                       type="date"
//                       value={quoteEstBookingStart}
//                       onChange={(e) => setQuoteEstBookingStart(e.target.value)}
//                       className="form-input"
//                       required
//                       disabled={submitting}
//                       style={{ fontSize: 13 }}
//                     />
//                   </div>

//                   <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
//                     <label className="form-label" style={{ fontSize: 12, fontWeight: 500 }}>End Date</label>
//                     <input
//                       type="date"
//                       value={quoteEstBookingEnd}
//                       onChange={(e) => setQuoteEstBookingEnd(e.target.value)}
//                       className="form-input"
//                       required
//                       disabled={submitting}
//                       style={{ fontSize: 13 }}
//                     />
//                   </div>
//                 </div>

//                 {/* Selected Units table */}
//                 <div>
//                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
//                     <label className="form-label" style={{ margin: 0, fontSize: 12, fontWeight: 500 }}>Selected Units</label>
//                     <button
//                       type="button"
//                       className="btn btn-secondary btn-sm"
//                       onClick={addQuoteItem}
//                       style={{ padding: '4px 10px', fontSize: 11 }}
//                     >
//                       + Add Row
//                     </button>
//                   </div>

//                   <div style={{ border: '1px solid var(--border-color)', borderRadius: 6, overflow: 'hidden' }}>
//                     <div style={{ overflowX: 'auto', maxHeight: 260, overflowY: 'auto' }}>
//                       <table style={{ width: '100%', minWidth: 860, borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: 11 }}>
//                         <colgroup>
//                           <col style={{ width: 32 }} />
//                           <col style={{ width: 150 }} />
//                           <col style={{ width: 52 }} />
//                           <col style={{ width: 52 }} />
//                           <col style={{ width: 80 }} />
//                           <col style={{ width: 88 }} />
//                           <col style={{ width: 110 }} />
//                           <col style={{ width: 90 }} />
//                           <col style={{ width: 80 }} />
//                           <col style={{ width: 72 }} />
//                           <col style={{ width: 80 }} />
//                           <col style={{ width: 32 }} />
//                         </colgroup>
//                         <thead>
//                           <tr style={{ background: 'var(--color-bg-secondary, rgba(255,255,255,0.05))', position: 'sticky', top: 0, zIndex: 1 }}>
//                             {['#', 'Unit Code', 'Qty', 'UOM', 'Val. Rate', 'Offered Rate', 'Property Group', 'Locality', 'District', 'Total Area', 'Amount', ''].map((h, i) => (
//                               <th
//                                 key={i}
//                                 style={{
//                                   padding: '7px 8px',
//                                   textAlign: i === 10 ? 'right' : 'left',
//                                   fontWeight: 500,
//                                   fontSize: 11,
//                                   color: 'var(--color-text-muted, #9ca3af)',
//                                   borderBottom: '1px solid var(--border-color)',
//                                   whiteSpace: 'nowrap',
//                                   overflow: 'hidden',
//                                   textOverflow: 'ellipsis',
//                                 }}
//                               >{h}</th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {quoteItems.map((item, idx) => (
//                             <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>

//                               {/* # */}
//                               <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)' }}>{idx + 1}</td>

//                               {/* Unit Code */}
//                               <td style={{ padding: '4px 6px' }}>
//                                 <select
//                                   value={item.unitId}
//                                   onChange={(e) => handleItemChange(idx, e.target.value)}
//                                   className="form-select"
//                                   style={{ width: '100%', fontSize: 11, minHeight: 32, padding: '5px 6px', boxSizing: 'border-box', lineHeight: '1.4' }}
//                                   required
//                                 >
//                                   <option value="">-- Choose Unit --</option>
//                                   {spaceUnits.map(unit => (
//                                     <option key={unit.name} value={unit.name}>{unit.item_name || unit.name}</option>
//                                   ))}
//                                 </select>
//                               </td>

//                               {/* Qty */}
//                               <td style={{ padding: '4px 6px' }}>
//                                 <input
//                                   type="number"
//                                   min="1"
//                                   value={item.qty}
//                                   onChange={(e) => handleQtyOrRateChange(idx, 'qty', e.target.value)}
//                                   className="form-input"
//                                   style={{ width: '100%', fontSize: 11, minHeight: 32, padding: '5px 6px', boxSizing: 'border-box', lineHeight: '1.4' }}
//                                   required
//                                 />
//                               </td>

//                               {/* UOM */}
//                               <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)' }}>
//                                 {item.loadingDetail ? '…' : (item.uom || '—')}
//                               </td>

//                               {/* Val. Rate */}
//                               <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)' }}>
//                                 {item.loadingDetail ? '…' : (item.standardRate ? `$${item.standardRate}` : '—')}
//                               </td>

//                               {/* Offered Rate */}
//                               <td style={{ padding: '4px 6px' }}>
//                                 <input
//                                   type="number"
//                                   value={item.offeredRate}
//                                   onChange={(e) => handleQtyOrRateChange(idx, 'offeredRate', e.target.value)}
//                                   className="form-input"
//                                   style={{ width: '100%', fontSize: 11, minHeight: 32, padding: '5px 6px', boxSizing: 'border-box', lineHeight: '1.4' }}
//                                   required
//                                 />
//                               </td>

//                               {/* Property Group */}
//                               <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                                 {item.loadingDetail ? '…' : (item.propertyGroup || '—')}
//                               </td>

//                               {/* Locality */}
//                               <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                                 {item.loadingDetail ? '…' : (item.locality || '—')}
//                               </td>

//                               {/* District */}
//                               <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                                 {item.loadingDetail ? '…' : (item.district || '—')}
//                               </td>

//                               {/* Total Area */}
//                               <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)', textAlign: 'right' }}>
//                                 {item.loadingDetail ? '…' : (item.totalArea || '—')}
//                               </td>

//                               {/* Amount */}
//                               <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600 }}>
//                                 ${((parseFloat(item.qty) || 1) * (parseFloat(item.offeredRate) || 0)).toLocaleString()}
//                               </td>

//                               {/* Delete */}
//                               <td style={{ padding: '4px 4px', textAlign: 'center' }}>
//                                 {quoteItems.length > 1 && (
//                                   <button
//                                     type="button"
//                                     onClick={() => removeQuoteItem(idx)}
//                                     style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center' }}
//                                   >
//                                     <Trash size={13} />
//                                   </button>
//                                 )}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* Grand total footer */}
//                     <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, padding: '8px 12px', borderTop: '1px solid var(--border-color)', background: 'var(--color-bg-secondary, rgba(255,255,255,0.03))' }}>
//                       <span style={{ fontSize: 11, color: 'var(--color-text-muted, #9ca3af)' }}>Grand Total</span>
//                       <span style={{ fontSize: 13, fontWeight: 600 }}>
//                         ${quoteItems.reduce((sum, item) => sum + ((parseFloat(item.qty) || 1) * (parseFloat(item.offeredRate) || 0)), 0).toLocaleString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//               </div>

//               {/* Footer */}
//               <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 20px', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
//                 <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)} disabled={submitting}>
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn btn-primary" disabled={submitting}>
//                   {submitting ? 'Creating...' : 'Submit Quotation'}
//                 </button>
//               </div>
//             </form>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FileText, Plus, X, Search, CheckCircle2, AlertCircle, Edit, Trash2, Calendar, User, Building, Trash, Printer, ArrowUpRight, Check, RotateCcw, Zap, Home, Send, XCircle, Layers } from 'lucide-react';
import houseImg from '../assets/new-house.png';

const getCsrfToken = () => {
  if (typeof window !== 'undefined' && window.csrf_token) {
    return window.csrf_token;
  }
  if (typeof window !== 'undefined' && window.frappe && window.frappe.csrf_token) {
    return window.frappe.csrf_token;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrf_token=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
};

// Small self-contained toast banner. Reuse your app-wide toast system instead
// if one already exists elsewhere in the codebase.
function Toast({ toast, onClose }) {
  if (!toast) return null;
  const isSuccess = toast.type === 'success';
  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        minWidth: 280,
        maxWidth: 420,
        padding: '12px 16px',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        backgroundColor: isSuccess ? '#065f46' : '#991b1b',
        color: '#ffffff',
        fontSize: 13,
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      {isSuccess ? <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 1 }} /> : <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />}
      <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', opacity: 0.8, padding: 0, lineHeight: 1 }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function Quotation({ erpnextConfig, properties = [], onGoToBooking }) {
  const [quotations, setQuotations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const workflowActionsCache = useRef({});

  useEffect(() => {
    setCurrentPage(1);
  }, [quotations.length]);
  const [customers, setCustomers] = useState([]);
  const [tamplates, settamplates] = useState([]);

  const [propertyGroups, setPropertyGroups] = useState([]); // Linked to Property Group doctype in ERPNext
  const [spaceUnits, setSpaceUnits] = useState([]); // Linked to Item doctype representing individual units
  const [templates, setTemplates] = useState([]); // Quotation templates filtered by reference_type: Quotation
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [debugMsg, setDebugMsg] = useState('');

  // Toast notification state — used for Create / Cancel / Amend / Approve / Reject feedback
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3500);
  };

  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', resolve: null });
  const confirm = (message) => {
    return new Promise((resolve) => {
      setConfirmModal({
        show: true,
        message,
        resolve
      });
    });
  };

  const [alertModal, setAlertModal] = useState({ show: false, title: '', message: '' });
  const showAlert = (title, message) => {
    setAlertModal({ show: true, title, message });
  };

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [selectedQuotationDetail, setSelectedQuotationDetail] = useState(null);
  const itemsPerPage = selectedQuotation ? 6 : 10;

  // Form states
  const [quoteCustomer, setQuoteCustomer] = useState('');
  const [quotetamplate, setQuotetamplate] = useState('');

  const [quoteEstBookingStart, setQuoteEstBookingStart] = useState(() => new Date().toISOString().split('T')[0]); // Start Date
  const [quoteEstBookingEnd, setQuoteEstBookingEnd] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  }); // End Date
  const [quoteStatus, setQuoteStatus] = useState('Draft');
  const [quoteCompany, setQuoteCompany] = useState('CARPENTERS PROPERTIES PTE LIMITED');
  const [quoteItems, setQuoteItems] = useState([{ unitId: '', qty: 1, uom: '', standardRate: '', offeredRate: '', propertyGroup: '', locality: '', district: '', totalArea: '', loadingDetail: false }]);
  const [discountAmount, setDiscountAmount] = useState('');
  const [messageText, setMessageText] = useState('');
  const [savingDiscount, setSavingDiscount] = useState(false);

  const [countries, setCountries] = useState([]);
  const [selCountry, setSelCountry] = useState('');
  const [selState, setSelState] = useState('');
  const [selProperty, setSelProperty] = useState('');
  const [isPropDropdownOpen, setIsPropDropdownOpen] = useState(false);
  const [propSearchText, setPropSearchText] = useState('');

  useEffect(() => {
    const handleOutsideClick = () => {
      setIsPropDropdownOpen(false);
    };
    if (isPropDropdownOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isPropDropdownOpen]);

  const [districts, setDistricts] = useState([]);

  const filteredProperties = useMemo(() => {
    return propertyGroups;
  }, [propertyGroups]);

  const filteredUnits = useMemo(() => {
    if (!selProperty) return [];
    return spaceUnits.filter(u => u.custom_property_group === selProperty);
  }, [spaceUnits, selProperty]);

  const [activeTab, setActiveTab] = useState('SUMMARY');
  const [negotiations, setNegotiations] = useState([]);
  const [comments, setComments] = useState([]);
  const [workflowActions, setWorkflowActions] = useState(null);

  // Company Details (matching Invoice format)
  const [companyDetails, setCompanyDetails] = useState({
    name: 'CARPENTERS PROPERTIES PTE LTD',
    address: '123 Cecil Street, #08-01, Singapore 069537',
    phone: '+65 6123 4567',
    email: 'info@carpentersproperties.com',
    website: 'www.carpentersproperties.com',
    currency: 'SGD'
  });

  // Selected Customer Address and Contact for current print view
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerContact, setCustomerContact] = useState('');

  // Fetch company details from ERPNext
  useEffect(() => {
    if (!erpnextConfig || !erpnextConfig.url) return;
    const fetchCompany = async () => {
      try {
        const companyName = "CARPENTERS PROPERTIES PTE LIMITED";
        const res = await fetch(`${erpnextConfig.url}/api/resource/Company/${encodeURIComponent(companyName)}`, {
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

          // Fetch Address
          const filters = encodeURIComponent(JSON.stringify([
            ["Dynamic Link", "link_doctype", "=", "Company"],
            ["Dynamic Link", "link_name", "=", doc.name]
          ]));
          const addrRes = await fetch(`${erpnextConfig.url}/api/resource/Address?filters=${filters}&fields=["address_line1","address_line2","city","state","country","pincode","phone","email_id"]`, {
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

  // Fetch customers from ERPNext Doctype Customer
  const fetchCustomersList = async () => {
    if (!erpnextConfig || !erpnextConfig.url) return;
    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Customer?fields=["name","customer_name"]&limit_page_length=200`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const json = await res.json();
        setCustomers(json.data || []);
      } else {
        const text = await res.text();
        console.warn('Customer fetch failed:', res.status, text);
        setDebugMsg(`Customer fetch failed (${res.status}): ${text.slice(0, 200)}`);
      }
    } catch (e) {
      console.warn('Failed fetching Customer list:', e);
      setDebugMsg(`Customer fetch error: ${e.message}`);
    }
  };
  const fetchtamplateList = async () => {
    if (!erpnextConfig || !erpnextConfig.url) return;
    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Contract%20Template?fields=["name"]&filters=[["custom_reference_type","=","Quotation"]]&limit_page_length=200`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const json = await res.json();
        settamplates(json.data || []);
      } else {
        const text = await res.text();
        console.warn('Tamplate fetch failed:', res.status, text);
        setDebugMsg(`Tamplate fetch failed (${res.status}): ${text.slice(0, 200)}`);
      }
    } catch (e) {
      console.warn('Failed fetching Tamplate list:', e);
      setDebugMsg(`Tamplate fetch error: ${e.message}`);
    }
  };

  // Fetch ALL Space Units (Items) — unfiltered, using only fields known to exist
  // so the request can never silently fail because of a guessed custom fieldname.
  const fetchSpaceUnits = async () => {
    if (!erpnextConfig || !erpnextConfig.url) return;
    try {
      const filters = encodeURIComponent(JSON.stringify([["item_group", "=", "Commercial"]]));
      const url = `${erpnextConfig.url}/api/resource/Item?fields=["name","item_name","standard_rate","valuation_rate","custom_property_group","custom_property_reference","stock_uom","custom_floor"]&filters=${filters}&limit_page_length=500`;
      const res = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const json = await res.json();
        setSpaceUnits(json.data || []);
        if ((json.data || []).length === 0) {
          setDebugMsg('Item fetch succeeded but returned 0 records — check Items exist and role can read Item.');
        }
      } else {
        const text = await res.text();
        console.warn('Item fetch failed:', res.status, text);
        setDebugMsg(`Item fetch failed (${res.status}): ${text.slice(0, 300)}`);
      }
    } catch (e) {
      console.warn('Failed fetching Space Units (Items):', e);
      setDebugMsg(`Item fetch error: ${e.message}`);
    }
  };

  const fetchPropertyGroups = async () => {
    if (!erpnextConfig || !erpnextConfig.url) return;
    try {
      const filters = encodeURIComponent(JSON.stringify([["land_and_building_type", "!=", "Services"]]));
      const url = `${erpnextConfig.url}/api/resource/Property%20Group?fields=["name","country","district","locality","land_and_building_type"]&filters=${filters}&limit_page_length=500`;
      const res = await fetch(url, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        console.log('Fetched Property Groups with types:', json.data);
        setPropertyGroups(json.data || []);
      }
    } catch (e) {
      console.warn('Failed fetching Property Groups:', e);
    }
  };

  const fetchCountries = async () => {
    if (!erpnextConfig || !erpnextConfig.url) return;
    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Country?fields=["name"]&limit_page_length=1000`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        setCountries((json.data || []).map(c => c.name));
      }
    } catch (err) {
      console.warn("Failed to fetch countries:", err);
    }
  };

  const fetchDistrictsByCountry = async (countryName) => {
    if (!erpnextConfig || !erpnextConfig.url || !countryName) {
      setDistricts([]);
      return;
    }
    try {
      const encodedFilters = encodeURIComponent(JSON.stringify([["country", "=", countryName]]));
      const url = `${erpnextConfig.url}/api/resource/District?fields=["name"]&filters=${encodedFilters}&limit_page_length=1000`;
      const res = await fetch(url, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        setDistricts((json.data || []).map(d => d.name));
      } else {
        const fallbackUrl = `${erpnextConfig.url}/api/resource/District?fields=["name"]&limit_page_length=1000`;
        const fbRes = await fetch(fallbackUrl, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (fbRes.ok) {
          const fbJson = await fbRes.json();
          setDistricts((fbJson.data || []).map(d => d.name));
        }
      }
    } catch (e) {
      console.warn("Failed fetching districts:", e);
    }
  };

  const fetchPropertiesByDistrict = async (districtName) => {
    if (!erpnextConfig || !erpnextConfig.url || !districtName) {
      setPropertyGroups([]);
      return;
    }
    try {
      const encodedFilters = encodeURIComponent(JSON.stringify([["district", "=", districtName]]));
      const url = `${erpnextConfig.url}/api/resource/Property%20Group?fields=["name","country","district","locality","land_and_building_type"]&filters=${encodedFilters}&limit_page_length=500`;
      const res = await fetch(url, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        setPropertyGroups(json.data || []);
      } else {
        const fallbackUrl = `${erpnextConfig.url}/api/resource/Property%20Group?fields=["name","country","district","locality","land_and_building_type"]&limit_page_length=500`;
        const fbRes = await fetch(fallbackUrl, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (fbRes.ok) {
          const fbJson = await fbRes.json();
          setPropertyGroups(fbJson.data || []);
        }
      }
    } catch (e) {
      console.warn("Failed fetching property groups by district:", e);
    }
  };

  const addUnitToQuoteItems = async (unitId) => {
    const listMatch = spaceUnits.find(u => u.name === unitId);
    const valRate = listMatch ? (listMatch.valuation_rate || listMatch.standard_rate || 0) : 0;

    const newRow = {
      unitId,
      qty: 1,
      standardRate: valRate,
      offeredRate: valRate,
      uom: listMatch ? (listMatch.stock_uom || 'Unit') : 'Unit',
      propertyGroup: listMatch
        ? (typeof listMatch.custom_property_group === 'string'
          ? listMatch.custom_property_group
          : (typeof listMatch.custom_property_reference === 'string'
            ? listMatch.custom_property_reference
            : ''))
        : '',
      locality: '',
      district: '',
      totalArea: '',
      loadingDetail: true
    };

    setQuoteItems(prev => {
      if (prev.length === 1 && prev[0].unitId === '') {
        return [newRow];
      }
      return [...prev, newRow];
    });

    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Item/${unitId}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        const doc = json.data || json;
        const findVal = (keywords) => {
          for (const kw of keywords) {
            if (doc[kw] !== undefined && doc[kw] !== null && doc[kw] !== '' && typeof doc[kw] !== 'object') return doc[kw];
          }
          const keys = Object.keys(doc);
          for (const kw of keywords) {
            const found = keys.find(k => k.toLowerCase().includes(kw));
            if (found && doc[found] !== undefined && doc[found] !== null && doc[found] !== '' && typeof doc[found] !== 'object') return doc[found];
          }
          return '';
        };

        setQuoteItems(prev => {
          return prev.map(item => {
            if (item.unitId === unitId) {
              return {
                ...item,
                propertyGroup: findVal(['custom_property_group', 'custom_property_reference', 'property_group', 'property']) || item.propertyGroup,
                locality: findVal(['locality']),
                district: findVal(['district']),
                totalArea: findVal(['total_area', 'area_sqft', 'area']),
                loadingDetail: false
              };
            }
            return item;
          });
        });
      } else {
        setQuoteItems(prev => prev.map(item => item.unitId === unitId ? { ...item, loadingDetail: false } : item));
      }
    } catch (e) {
      setQuoteItems(prev => prev.map(item => item.unitId === unitId ? { ...item, loadingDetail: false } : item));
    }
  };

  // Fetch quotations from ERPNext
  const fetchQuotations = async () => {
    console.log("hit the fetch")
    if (!erpnextConfig || !erpnextConfig.url) {
      setQuotations([
        { name: 'QTN-2026-00001', customer_name: 'Sarah Jenkins', transaction_date: '2026-06-01', valid_till: '2026-06-30', grand_total: 6200, status: 'Submitted' },
        { name: 'QTN-2026-00002', customer_name: 'John Doe', transaction_date: '2026-06-05', valid_till: '2026-07-05', grand_total: 4500, status: 'Draft' }
      ]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation?fields=["name","customer_name","party_name","transaction_date","valid_till","grand_total","status","workflow_state"]&limit_page_length=100&order_by=creation desc`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const json = await res.json();
        setQuotations(json.data || []);
      } else {
        const text = await res.text();
        console.warn('Quotation fetch failed:', res.status, text);
        setDebugMsg(`Quotation fetch failed (${res.status}): ${text.slice(0, 200)}`);
      }
    } catch (e) {
      console.warn('Failed fetching quotations:', e);
      setDebugMsg(`Quotation fetch error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
    fetchCustomersList();
    fetchtamplateList();
    fetchSpaceUnits();
    fetchPropertyGroups();
    fetchCountries();
  }, [erpnextConfig]);

  useEffect(() => {
    if (selectedQuotationDetail) {
      setDiscountAmount(selectedQuotationDetail.discount_amount !== undefined && selectedQuotationDetail.discount_amount !== null ? String(selectedQuotationDetail.discount_amount) : '');
      setMessageText('');
    } else {
      setDiscountAmount('');
      setMessageText('');
      setWorkflowActions(null);
    }
  }, [selectedQuotationDetail]);

  // Handle detailed Quotation view & retrieve client CRM metadata
  const fetchQuotationDetail = async (qName, customerId) => {
    if (!erpnextConfig || !erpnextConfig.url) return;

    const parseNegotiationFromComment = (commentText) => {
      if (!commentText) return null;

      const decoded = commentText
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
      const stripped = decoded.replace(/<[^>]*>?/gm, '');

      if (!stripped.includes('Quotation Negotiation Version')) return null;

      const getValue = (key) => {
        const keys = [
          'Quotation:',
          'Current Version:',
          'Total Versions:',
          'Negotiation Date:',
          'Negotiated By:',
          'Previous Discount:',
          'Current Discount:',
          'Discount Percentage:',
          'Discount Difference:',
          'Previous Grand Total:',
          'Current Grand Total:',
          'Negotiation Status:'
        ];

        const keyIndex = stripped.indexOf(key);
        if (keyIndex === -1) return '';

        const startPos = keyIndex + key.length;
        let endPos = stripped.length;
        for (const k of keys) {
          const kIndex = stripped.indexOf(k, startPos);
          if (kIndex !== -1 && kIndex < endPos) {
            endPos = kIndex;
          }
        }
        return stripped.substring(startPos, endPos).trim();
      };

      const verNo = parseInt(getValue('Current Version:'), 10) || 0;
      return {
        name: `${getValue('Quotation:')}-v${verNo}`,
        version_no: verNo,
        negotiation_date: getValue('Negotiation Date:'),
        negotiation_by: getValue('Negotiated By:'),
        current_discount: parseFloat(getValue('Current Discount:')) || 0,
        current_grand_total: parseFloat(getValue('Current Grand Total:')) || 0,
        previous_discount: parseFloat(getValue('Previous Discount:')) || 0,
        previous_grand_total: parseFloat(getValue('Previous Grand Total:')) || 0,
        discount_difference: parseFloat(getValue('Discount Difference:')) || 0,
        discount_percentage: getValue('Discount Percentage:'),
        negotiation_status: getValue('Negotiation Status:')
      };
    };

    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${qName}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const json = await res.json();
        const doc = json.data || json;
        setSelectedQuotationDetail(doc);

        // Fetch Customer Address & Contact
        const actualCustomer = customerId || doc.party_name || doc.customer;
        if (actualCustomer) {
          // Fetch Address linked to customer
          const addrRes = await fetch(`${erpnextConfig.url}/api/resource/Address?filters=[["Dynamic Link", "link_doctype", "=", "Customer"], ["Dynamic Link", "link_name", "=", "${actualCustomer}"]]&fields=["address_line1","address_line2","city","state","country","pincode"]`, {
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
              setCustomerAddress([addr.address_line1, addr.address_line2, addr.city, addr.state, addr.country, addr.pincode].filter(Boolean).join(', '));
            } else {
              setCustomerAddress('Registered Address not specified');
            }
          }

          // Fetch Contact linked to customer
          const contactRes = await fetch(`${erpnextConfig.url}/api/resource/Contact?filters=[["Dynamic Link", "link_doctype", "=", "Customer"], ["Dynamic Link", "link_name", "=", "${actualCustomer}"]]&fields=["email_id","phone"]`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (contactRes.ok) {
            const contactJson = await contactRes.json();
            const contactList = contactJson.data || [];
            if (contactList.length > 0) {
              const ct = contactList[0];
              setCustomerContact([ct.email_id, ct.phone].filter(Boolean).join(' | '));
            } else {
              setCustomerContact('Contact info not specified');
            }
          }
        }

        // Fetch Comments and parse negotiations
        try {
          const commentRes = await fetch(`${erpnextConfig.url}/api/resource/Comment?filters=[["reference_doctype", "=", "Quotation"], ["reference_name", "=", "${qName}"]]&fields=["name","comment_email","content","creation","comment_by"]&limit_page_length=100&order_by=creation desc`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });
          if (commentRes.ok) {
            const commentJson = await commentRes.json();
            const commentsData = commentJson.data || [];
            setComments(commentsData);

            // Parse negotiations history from comments instead of fetching Quotation Negotiation Doctype
            const parsedNegotiations = [];
            commentsData.forEach(c => {
              const neg = parseNegotiationFromComment(c.content);
              if (neg) {
                parsedNegotiations.push(neg);
              }
            });
            parsedNegotiations.sort((a, b) => b.version_no - a.version_no);
            setNegotiations(parsedNegotiations);
          }
        } catch (cErr) {
          console.warn('Failed fetching comments and parsing negotiations:', cErr);
        }

        // Fetch active workflow actions from get_quotation_workflow_actions API
        try {
          const wfRes = await fetch(`${erpnextConfig.url}/api/method/get_quotation_workflow_actions?quotation=${qName}`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });
          if (wfRes.ok) {
            const wfJson = await wfRes.json();
            console.log('Workflow API Response for', qName, ':', wfJson);
            const message = wfJson.message || {};
            setWorkflowActions(message);

            // Sync workflow state with backend if provided
            if (message && message.current_state) {
              setSelectedQuotationDetail(prev => {
                if (!prev) return prev;
                return {
                  ...prev,
                  workflow_state: message.current_state
                };
              });
            }
          } else {
            console.warn('Failed fetching workflow actions status:', wfRes.status);
            setWorkflowActions(null);
          }
        } catch (wfErr) {
          console.warn('Failed fetching workflow actions:', wfErr);
          setWorkflowActions(null);
        }
      }
    } catch (e) {
      console.warn('Failed fetching quotation detail:', e);
    }
  };

  const handleRowClick = (quote) => {
    setSelectedQuotation(quote);
    fetchQuotationDetail(quote.name, quote.party_name || quote.customer);
  };

  // Form helpers
  const addQuoteItem = () => {
    setQuoteItems([...quoteItems, { unitId: '', qty: 1, uom: '', standardRate: '', offeredRate: '', propertyGroup: '', locality: '', district: '', totalArea: '', loadingDetail: false }]);
  };

  const removeQuoteItem = (index) => {
    const updated = [...quoteItems];
    updated.splice(index, 1);
    setQuoteItems(updated);
  };

  const handleQtyOrRateChange = (index, field, value) => {
    const updated = [...quoteItems];
    updated[index][field] = value;
    setQuoteItems(updated);
  };

  // Selecting a Unit fetches the FULL Item document (works regardless of the
  // exact custom fieldnames on your site) and auto-populates the row —
  // rate, UOM, Property Group, Locality, District, Total Area.
  const handleItemChange = async (index, unitId) => {
    const listMatch = spaceUnits.find(u => u.name === unitId);

    setQuoteItems(prev => {
      const updated = [...prev];
      const valRate = listMatch ? (listMatch.valuation_rate || listMatch.standard_rate || 0) : 0;
      updated[index] = {
        ...updated[index],
        unitId,
        standardRate: valRate,
        offeredRate: valRate,
        uom: listMatch ? (listMatch.stock_uom || 'Unit') : 'Unit',
        propertyGroup: listMatch
          ? (typeof listMatch.custom_property_group === 'string'
            ? listMatch.custom_property_group
            : (typeof listMatch.custom_property_reference === 'string'
              ? listMatch.custom_property_reference
              : ''))
          : '',
        loadingDetail: true
      };
      return updated;
    });

    if (!unitId || !erpnextConfig || !erpnextConfig.url) {
      setQuoteItems(prev => {
        const updated = [...prev];
        if (updated[index]) updated[index].loadingDetail = false;
        return updated;
      });
      return;
    }

    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Item/${unitId}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        const doc = json.data || json;
        const findVal = (keywords) => {
          for (const kw of keywords) {
            if (doc[kw] !== undefined && doc[kw] !== null && doc[kw] !== '' && typeof doc[kw] !== 'object') return doc[kw];
          }
          const keys = Object.keys(doc);
          for (const kw of keywords) {
            const found = keys.find(k => k.toLowerCase().includes(kw));
            if (found && doc[found] !== undefined && doc[found] !== null && doc[found] !== '' && typeof doc[found] !== 'object') return doc[found];
          }
          return '';
        };
        setQuoteItems(prev => {
          const updated = [...prev];
          if (updated[index] && updated[index].unitId === unitId) {
            updated[index] = {
              ...updated[index],
              propertyGroup: findVal(['custom_property_group', 'custom_property_reference', 'property_group', 'property']) || updated[index].propertyGroup,
              locality: findVal(['locality']),
              district: findVal(['district']),
              totalArea: findVal(['total_area', 'area_sqft', 'area']),
              loadingDetail: false
            };
          }
          return updated;
        });
      } else {
        const text = await res.text();
        setDebugMsg(`Item detail fetch failed (${res.status}): ${text.slice(0, 200)}`);
        setQuoteItems(prev => {
          const updated = [...prev];
          if (updated[index]) updated[index].loadingDetail = false;
          return updated;
        });
      }
    } catch (e) {
      setDebugMsg(`Item detail fetch error: ${e.message}`);
      setQuoteItems(prev => {
        const updated = [...prev];
        if (updated[index]) updated[index].loadingDetail = false;
        return updated;
      });
    }
  };

  const resetForm = () => {
    setQuoteCustomer('');
    setQuotetamplate('');
    setQuoteEstBookingStart('');
    setQuoteEstBookingEnd('');
    setQuoteItems([{ unitId: '', qty: 1, uom: '', standardRate: '', offeredRate: '', propertyGroup: '', locality: '', district: '', totalArea: '', loadingDetail: false }]);
    setErrorMsg('');
    setSelCountry('');
    setSelState('');
    setSelProperty('');
    setDistricts([]);
    setAlertModal({ show: false, title: '', message: '' });
  };

  const cleanErrorMessage = (msg) => {
    if (!msg || typeof msg !== 'string') return 'An error occurred during submission.';

    let clean = msg;

    // If traceback
    if (clean.includes('Traceback (most recent call last):') || clean.includes('Traceback')) {
      const lines = clean.split('\n').map(l => l.trim()).filter(l => l);
      const errorLine = lines.reverse().find(l => l.includes('Error:') || l.includes('Exception:') || (!l.startsWith('File') && !l.startsWith('^') && !l.includes('in application') && !l.includes('handle')));
      if (errorLine) {
        clean = errorLine;
      }
    }

    // Remove exception prefixes
    clean = clean.replace(/^[a-zA-Z0-9._]+Error:\s*/, '');
    clean = clean.replace(/^[a-zA-Z0-9._]+Exception:\s*/, '');
    clean = clean.replace(/^ValidationError:\s*/i, '');

    // Handle double JSON stringifying or array nesting in Frappe response
    if (clean.startsWith('[') && clean.endsWith(']')) {
      try {
        const arr = JSON.parse(clean);
        if (arr.length > 0) clean = arr[0];
      } catch (e) { }
    }
    if (typeof clean === 'string' && clean.trim().startsWith('{') && clean.trim().endsWith('}')) {
      try {
        const parsed = JSON.parse(clean);
        clean = parsed.message || parsed.exception || clean;
      } catch (e) { }
    }

    // Specific match for booking conflicts
    const lower = clean.toLowerCase();
    if (lower.includes('already booked') || lower.includes('is booked') || lower.includes('booking conflict') || lower.includes('overlapping')) {
      // Try to extract item/unit code if present (e.g., matching codes like 31CT18 or word boundaries)
      const codeMatch = clean.match(/Item\s+([A-Za-z0-9-_]+)/i) || clean.match(/Unit\s+([A-Za-z0-9-_]+)/i) || clean.match(/\b([A-Z0-9]+-[A-Z0-9]+|[A-Z0-9]{4,10})\b/);
      if (codeMatch) {
        return `⚠️ Sorry, cannot book: Unit "${codeMatch[1]}" is already booked/occupied for the selected date range. Please select another unit or check the dates.`;
      }
      return `⚠️ Sorry, cannot book: One or more selected property units are already booked for the chosen dates. Please choose a different unit or date range.`;
    }

    return clean;
  };

  // Submit new Quotation
  const handleCreateQuotation = async (e) => {
    e.preventDefault();
    if (!quoteCustomer || !quoteEstBookingStart || !quoteEstBookingEnd) return;

    const todayStartCheck = new Date();
    todayStartCheck.setHours(0, 0, 0, 0);
    const selectedStart = new Date(quoteEstBookingStart);
    selectedStart.setHours(0, 0, 0, 0);

    if (selectedStart < todayStartCheck) {
      showAlert('Invalid Date', 'Start Date cannot be in the past.');
      return;
    }

    const startDate = new Date(quoteEstBookingStart);
    const endDate = new Date(quoteEstBookingEnd);
    const oneYearLater = new Date(startDate);
    oneYearLater.setFullYear(startDate.getFullYear() + 1);

    if (endDate < oneYearLater) {
      showAlert('Invalid Date', 'Estimated Booking End Date must be at least 1 year from the Start Date.');
      return;
    }

    const matchedCust = customers.find(c => c.name === quoteCustomer);

    const erpItems = quoteItems.filter(item => item.unitId).map(item => {
      const matched = spaceUnits.find(u => u.name === item.unitId);
      const standardRateNum = parseFloat(item.standardRate) || 0;
      const offeredRateNum = parseFloat(item.offeredRate) || 0;

      return {
        item_code: item.unitId,
        qty: parseFloat(item.qty) || 1,
        rate: offeredRateNum,
        price_list_rate: standardRateNum,
        amount: (parseFloat(item.qty) || 1) * offeredRateNum,
        uom: item.uom || 'Unit',
        item_name: matched ? matched.item_name : item.unitId
      };
    });

    if (erpItems.length === 0) {
      showAlert('Required Field', 'You must add at least one Property Unit.');
      return;
    }

    // Confirmation box before submitting
    const confirmMsg = `Create quotation for ${matchedCust ? (matchedCust.customer_name || matchedCust.name) : quoteCustomer}?`;
    if (!(await confirm(confirmMsg))) return;

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Current date
    const today = new Date();

    // Format date as YYYY-MM-DD
    const formatDate = (date) => {
      return date.toISOString().split("T")[0];
    };

    // Valid till = current date + 7 days
    const validTill = new Date(today);
    validTill.setDate(validTill.getDate() + 7);

    const payload = {
      customer: quoteCustomer,
      party_name: quoteCustomer,
      customer_name: matchedCust
        ? matchedCust.customer_name
        : quoteCustomer,
      quotation_to: "Customer",
      transaction_date: formatDate(today),
      valid_till: formatDate(validTill),
      company: quoteCompany,
      status: quoteStatus,
      custom_start_date: quoteEstBookingStart || null,
      custom_end_date: quoteEstBookingEnd || null,
      custom_template: quotetamplate,
      items: erpItems
    };
    console.log(payload)

    try {
      let createdName = null;
      if (erpnextConfig && erpnextConfig.url) {
        const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': getCsrfToken()
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          let rawMsg = 'Failed to create quotation on server.';
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            try {
              const errData = await res.json();
              if (errData._server_messages) {
                try {
                  const msgs = JSON.parse(errData._server_messages);
                  const firstMsgObj = JSON.parse(msgs[0]);
                  rawMsg = firstMsgObj.message || rawMsg;
                } catch (e) {
                  try {
                    const msgs = JSON.parse(errData._server_messages);
                    rawMsg = msgs[0] || rawMsg;
                  } catch (inner) {
                    rawMsg = errData._server_messages;
                  }
                }
              } else if (errData.message) {
                rawMsg = errData.message;
              } else if (errData.exception) {
                rawMsg = errData.exception;
              }
            } catch (jsonErr) { }
          } else {
            try {
              const htmlOrText = await res.text();
              if (htmlOrText.includes('{') && htmlOrText.includes('}')) {
                const firstBrace = htmlOrText.indexOf('{');
                const lastBrace = htmlOrText.lastIndexOf('}');
                if (firstBrace !== -1 && lastBrace !== -1) {
                  const jsonStr = htmlOrText.slice(firstBrace, lastBrace + 1);
                  try {
                    const parsed = JSON.parse(jsonStr);
                    if (parsed.message) rawMsg = parsed.message;
                    else if (parsed.exception) rawMsg = parsed.exception;
                    else if (parsed.exc) {
                      try {
                        const excLines = JSON.parse(parsed.exc);
                        if (Array.isArray(excLines) && excLines.length > 0) {
                          rawMsg = excLines[excLines.length - 1];
                        } else if (typeof excLines === 'string') {
                          rawMsg = excLines.split('\n').filter(l => l.trim()).pop() || excLines;
                        }
                      } catch (e) {
                        rawMsg = parsed.exc;
                      }
                    }
                  } catch (e) { }
                }
              } else {
                rawMsg = htmlOrText.slice(0, 200);
              }
            } catch (textErr) { }
          }
          throw new Error(rawMsg);
        }
        const created = await res.json();
        createdName = (created.data || created)?.name || null;
      }

      setSuccessMsg('Quotation created successfully!');
      showToast('success', `Quotation ${createdName || ''} created successfully.`);
      await fetchQuotations();
      setShowAddModal(false);
      resetForm();

      // Auto-select the newly created quotation in the preview pane by default
      if (createdName) {
        setSelectedQuotation({ name: createdName });
        fetchQuotationDetail(createdName, quoteCustomer);
      }
    } catch (err) {
      const cleanMsg = cleanErrorMessage(err.message);
      showAlert(cleanMsg.includes('cannot book') ? 'Booking Conflict' : 'Submission Failed', cleanMsg);
      showToast('error', cleanMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel Quotation Workflow (Sets status to 'Cancelled')
  const handleCancelQuotation = async (qName) => {
    if (!(await confirm(`Are you sure you want to cancel quotation ${qName}? This cannot be undone.`))) return;
    setLoading(true);
    try {
      if (erpnextConfig && erpnextConfig.url) {
        const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${qName}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': getCsrfToken()
          },
          body: JSON.stringify({ status: 'Cancelled' })
        });
        if (!res.ok) {
          let rawMsg = 'Failed to cancel quotation.';
          try {
            const errData = await res.json();
            if (errData._server_messages) {
              try {
                const msgs = JSON.parse(errData._server_messages);
                const firstMsgObj = JSON.parse(msgs[0]);
                rawMsg = firstMsgObj.message || rawMsg;
              } catch (inner) {
                rawMsg = errData._server_messages;
              }
            } else if (errData.message) {
              rawMsg = errData.message;
            }
          } catch (parseErr) {
            // keep default rawMsg
          }
          throw new Error(rawMsg);
        }
      }
      showToast('success', `Quotation ${qName} cancelled successfully.`);
      setSelectedQuotation(null);
      setSelectedQuotationDetail(null);
      fetchQuotations();
    } catch (e) {
      showToast('error', e.message || 'Failed to cancel quotation.');
    } finally {
      setLoading(false);
    }
  };

  // Amend Quotation Workflow (Revision logic)
  const handleAmendQuotation = async () => {
    if (!selectedQuotationDetail) return;
    if (!(await confirm(`This action will Cancel the current quotation revision ${selectedQuotationDetail.name} and create a new editable draft. Proceed?`))) return;

    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Cancel current revision
      if (erpnextConfig && erpnextConfig.url) {
        const cancelRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${selectedQuotationDetail.name}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': getCsrfToken()
          },
          body: JSON.stringify({ status: 'Cancelled' })
        });
        if (!cancelRes.ok) {
          throw new Error('Failed to cancel the current version during amendment.');
        }
      }

      // 2. Parse revision details & increment name revision tag
      let currentRevisionCode = selectedQuotationDetail.name;
      let nextRevisionCode = '';
      const revParts = currentRevisionCode.split('-');
      const lastPart = revParts[revParts.length - 1];

      // Check if it already has an amendment number (e.g. QTN-2026-00001-1)
      if (!isNaN(parseInt(lastPart, 10)) && revParts.length > 3) {
        const nextRevNum = parseInt(lastPart, 10) + 1;
        revParts[revParts.length - 1] = nextRevNum.toString();
        nextRevisionCode = revParts.join('-');
      } else {
        nextRevisionCode = `${currentRevisionCode}-1`;
      }

      // 3. Construct new payload draft
      const newItems = (selectedQuotationDetail.items || []).map(item => ({
        item_code: item.item_code,
        qty: item.qty || 1,
        rate: item.rate || 0,
        price_list_rate: item.price_list_rate || item.rate || 0,
        uom: item.uom || 'Month',
        item_name: item.item_name
      }));

      const payload = {
        name: nextRevisionCode,
        customer: selectedQuotationDetail.party_name || selectedQuotationDetail.customer,
        party_name: selectedQuotationDetail.party_name || selectedQuotationDetail.customer,
        customer_name: selectedQuotationDetail.customer_name,
        quotation_to: 'Customer',
        transaction_date: new Date().toISOString().split('T')[0],
        valid_till: selectedQuotationDetail.valid_till,
        company: selectedQuotationDetail.company || 'CARPENTERS PROPERTIES PTE LIMITED',
        status: 'Draft',
        custom_start_date: selectedQuotationDetail.custom_start_date || null,
        custom_end_date: selectedQuotationDetail.custom_end_date || null,
        items: newItems
      };

      if (erpnextConfig && erpnextConfig.url) {
        const createRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': getCsrfToken()
          },
          body: JSON.stringify(payload)
        });
        if (!createRes.ok) {
          const errData = await createRes.json();
          let rawMsg = 'Failed to create amendment draft on server.';
          if (errData._server_messages) {
            try {
              const msgs = JSON.parse(errData._server_messages);
              const firstMsgObj = JSON.parse(msgs[0]);
              rawMsg = firstMsgObj.message || rawMsg;
            } catch (e) {
              try {
                const msgs = JSON.parse(errData._server_messages);
                rawMsg = msgs[0] || rawMsg;
              } catch (inner) {
                rawMsg = errData._server_messages;
              }
            }
          } else if (errData.message) {
            rawMsg = errData.message;
          }
          throw new Error(rawMsg);
        }
      }

      showToast('success', `Quotation ${selectedQuotationDetail.name} amended. New draft ${nextRevisionCode} created.`);
      setSelectedQuotation(null);
      setSelectedQuotationDetail(null);
      fetchQuotations();
    } catch (e) {
      showToast('error', e.message || 'Failed to amend quotation.');
    } finally {
      setLoading(false);
    }
  };

  // Approve / Reject Quotation Workflow — calls the custom Server Script
  // API endpoint "approve_reject_doc" instead of writing workflow_state directly.
  // state_code: 1 = Approve, 0 = Reject
  const handelaction = async (con, state_code) => {
    const actionLabel = state_code ? 'approve' : 'reject';

    // Confirmation box before execution
    if (!(await confirm(`Are you sure you want to ${actionLabel} quotation ${con.name}?`))) return;

    try {
      const res = await fetch(`${erpnextConfig.url}/api/method/approve_reject_doc`, {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify({
          doctype_name: "Quotation",
          docname: con.name,
          state_code: state_code
        })
      });

      if (!res.ok) {
        let rawMsg = `Failed to ${actionLabel} quotation ${con.name}.`;
        try {
          const errData = await res.json();
          if (errData._server_messages) {
            try {
              const msgs = JSON.parse(errData._server_messages);
              const firstMsgObj = JSON.parse(msgs[0]);
              rawMsg = firstMsgObj.message || rawMsg;
            } catch (inner) {
              rawMsg = errData._server_messages;
            }
          } else if (errData.exception) {
            rawMsg = errData.exception;
          } else if (errData.message) {
            rawMsg = errData.message;
          }
        } catch (parseErr) {
          // keep default rawMsg if body isn't JSON
        }
        throw new Error(rawMsg);
      }

      showToast('success', `Quotation ${con.name} ${state_code ? 'approved' : 'rejected'} successfully.`);
      fetchQuotations();
    } catch (e) {
      showToast('error', e.message || `Failed to ${actionLabel} quotation ${con.name}.`);
    }
  };

  const saveDiscountAndMessageSilently = async () => {
    try {
      if (!erpnextConfig || !erpnextConfig.url) {
        return true;
      }

      // Save discount amount to Quotation resource
      const discountRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${selectedQuotationDetail.name}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify({
          discount_amount: parseFloat(discountAmount) || 0,
          apply_discount_on: "Net Total",
          additional_discount_percentage: 0
        })
      });

      if (!discountRes.ok) {
        const text = await discountRes.text();
        throw new Error(`Failed to save discount: ${text}`);
      }

      // Post comment to Comment resource if there is message text
      if (messageText.trim()) {
        const commentRes = await fetch(`${erpnextConfig.url}/api/resource/Comment`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': getCsrfToken()
          },
          body: JSON.stringify({
            comment_type: 'Comment',
            reference_doctype: 'Quotation',
            reference_name: selectedQuotationDetail.name,
            content: messageText
          })
        });

        if (!commentRes.ok) {
          const text = await commentRes.text();
          console.warn('Failed to post comment to server:', text);
        }
      }

      setMessageText('');
      return true;
    } catch (err) {
      showToast('error', `Error updating quotation details: ${err.message}`);
      return false;
    }
  };

  const handleWorkflowAction = async (actionName) => {
    if (!(await confirm(`Are you sure you want to "${actionName}"?`))) return;

    // Invalidate API actions cache for this quotation
    if (selectedQuotationDetail && selectedQuotationDetail.name) {
      delete workflowActionsCache.current[selectedQuotationDetail.name];
    }

    setSavingDiscount(true);
    try {

      const res = await fetch(`${erpnextConfig.url}/api/method/update_quotation_workflow`, {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify({
          quotation: selectedQuotationDetail.name,
          action: actionName,
          discount_amount: parseFloat(discountAmount) || 0,
          apply_discount_on: "Net Total",
          comment: messageText,
          remarks: messageText,
          message: messageText,
          message_text: messageText
        })
      });

      if (!res.ok) {
        let errMsg = `Failed to apply action "${actionName}".`;
        try {
          const errData = await res.json();
          console.error("Workflow transition error payload:", errData);
          if (errData._server_messages) {
            try {
              const msgs = JSON.parse(errData._server_messages);
              const firstMsgObj = JSON.parse(msgs[0]);
              errMsg = firstMsgObj.message || errMsg;
            } catch (_) {
              errMsg = errData._server_messages;
            }
          } else {
            errMsg = errData.exception || errData.message || errMsg;
          }
        } catch (parseErr) {
          const rawText = await res.text().catch(() => "");
          console.error("Workflow transition raw error text:", rawText);
        }
        throw new Error(errMsg);
      }

      showToast('success', `Quotation "${actionName}" transition completed successfully.`);
      await fetchQuotationDetail(selectedQuotation.name, selectedQuotation.party_name || selectedQuotation.customer);
      await fetchQuotations();
    } catch (err) {
      console.error(err);
      showToast('error', err.message || "Failed to trigger workflow action.");
    } finally {
      setSavingDiscount(false);
    }
  };

  const handleSaveDiscountAndMessage = async () => {
    if (!selectedQuotationDetail) return;

    // Invalidate API actions cache for this quotation
    if (selectedQuotationDetail && selectedQuotationDetail.name) {
      delete workflowActionsCache.current[selectedQuotationDetail.name];
    }

    setSavingDiscount(true);
    try {
      if (!erpnextConfig || !erpnextConfig.url) {
        setSelectedQuotationDetail(prev => {
          if (!prev) return prev;
          const disc = parseFloat(discountAmount) || 0;
          return {
            ...prev,
            discount_amount: disc
          };
        });
        setMessageText('');
        showToast('success', 'Quotation updated locally.');
        return;
      }

      // Save discount amount to Quotation resource
      const discountRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${selectedQuotationDetail.name}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify({
          discount_amount: parseFloat(discountAmount) || 0,
          apply_discount_on: "Net Total",
          additional_discount_percentage: 0
        })
      });

      if (!discountRes.ok) {
        const text = await discountRes.text();
        throw new Error(`Failed to save discount: ${text}`);
      }

      // Post comment to Comment resource if there is message text
      if (messageText.trim()) {
        const commentRes = await fetch(`${erpnextConfig.url}/api/resource/Comment`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': getCsrfToken()
          },
          body: JSON.stringify({
            comment_type: 'Comment',
            reference_doctype: 'Quotation',
            reference_name: selectedQuotationDetail.name,
            content: messageText
          })
        });

        if (!commentRes.ok) {
          const text = await commentRes.text();
          console.warn('Failed to post comment to server:', text);
        }
      }

      showToast('success', 'Quotation details saved successfully.');
      setMessageText('');
      await fetchQuotationDetail(selectedQuotationDetail.name, selectedQuotationDetail.party_name || selectedQuotationDetail.customer);
      await fetchQuotations();
    } catch (err) {
      showToast('error', `Error updating quotation: ${err.message}`);
    } finally {
      setSavingDiscount(false);
    }
  };

  return (
    <div>
      {/* Toast notification — Create / Cancel / Amend / Approve / Reject feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="view-header">
        <div>
          <h1 className="view-title">Quotation & Proposal Management</h1>
          <p className="view-subtitle">Generate dynamic leasing proposals with multiple property units and track customer quotations.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>
          <Plus size={16} /> Create Quotation
        </button>
      </div>

      {debugMsg && (
        <div style={{ color: '#92400e', background: '#fef3c7', padding: '8px 12px', borderRadius: 6, fontSize: 12, marginBottom: 16 }}>
          ⚠ {debugMsg}
        </div>
      )}

      <div className="grid-2col" style={{ gridTemplateColumns: '1fr', gap: 24, transition: 'all 0.3s ease' }}>

        {/* Quotations List Table */}
        <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Quotation ID</th>
                  <th>Tenant Name</th>
                  <th>Quote Date</th>
                  <th>Valid Till</th>
                  <th>Grand Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const indexOfLastItem = currentPage * itemsPerPage;
                  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                  const currentQuotations = quotations.slice(indexOfFirstItem, indexOfLastItem);
                  return currentQuotations.map(q => (
                    <tr
                      key={q.name}
                      onClick={() => handleRowClick(q)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedQuotation?.name === q.name ? 'var(--bg-accent-alpha)' : '',
                        borderLeft: selectedQuotation?.name === q.name ? '3px solid var(--brand-color)' : ''
                      }}
                    >
                      <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{q.name}</td>
                      <td style={{ fontWeight: 600 }}>{q.customer_name}</td>
                      <td>{q.transaction_date}</td>
                      <td>{q.valid_till}</td>
                      <td style={{ fontWeight: 600 }}>${(q.grand_total || 0).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${q.status === 'Submitted' ? 'badge-success' : q.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                          {q.workflow_state}
                        </span>
                      </td>
                    </tr>
                  ));
                })()}
                {quotations.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                      No quotations found. Click "Create Quotation" to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {(() => {
            const totalPages = Math.ceil(quotations.length / itemsPerPage);
            if (totalPages <= 1) return null;
            return (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', fontSize: 10.5, flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: 10, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, minWidth: 60 }}
                >
                  Previous
                </button>
                <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Page <strong style={{ color: 'var(--text-primary)' }}>{currentPage}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{totalPages}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: 10, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, minWidth: 60 }}
                >
                  Next
                </button>
              </div>
            );
          })()}
        </div>

        {/* Backdrop with Blur Effect */}
        {selectedQuotation && selectedQuotationDetail && (
          <div
            onClick={() => { setSelectedQuotation(null); setSelectedQuotationDetail(null); }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(15, 23, 42, 0.3)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              zIndex: 998,
              animation: 'fadeIn 0.2s ease-out'
            }}
          />
        )}

        {/* Details Drawer (Right Pane) */}
        <div style={{
          position: 'fixed',
          top: 0,
          right: (selectedQuotation && selectedQuotationDetail) ? 0 : '-650px',
          width: '650px',
          maxWidth: '100%',
          height: '100vh',
          background: 'var(--bg-primary)',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.15)',
          zIndex: 999,
          transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {selectedQuotation && selectedQuotationDetail && (
            <div className="card-panel" style={{ padding: 24, background: '#ffffff', color: '#111827', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', height: '100%', overflowY: 'auto', minWidth: 0, border: 'none', borderRadius: 0 }}>

              {/* Close details button */}
              <button
                onClick={() => { setSelectedQuotation(null); setSelectedQuotationDetail(null); }}
                style={{ position: 'absolute', top: 12, right: 12, background: '#f3f4f6', border: 'none', borderRadius: '50%', color: '#374151', cursor: 'pointer', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
              >
                ×
              </button>



              {/* BILL TO / CUSTOMER INFO */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 10, paddingBottom: 6, flexShrink: 0 }}>
                <div>
                  <span style={{ color: '#6b7280', textTransform: 'uppercase', display: 'block', fontWeight: 700, fontSize: 9, marginBottom: 4 }}>Customer</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <strong style={{ fontSize: 13, color: '#111827', fontWeight: 700 }}>{selectedQuotationDetail.customer_name}</strong>
                    {(() => {
                      const status = selectedQuotationDetail.workflow_state || selectedQuotationDetail.status || 'Draft';

                      // Map status to badge colors
                      let bg = 'rgba(107, 114, 128, 0.08)';
                      let color = '#4b5563';
                      let border = '1px solid rgba(107, 114, 128, 0.15)';

                      if (status === 'Approved') {
                        bg = 'rgba(16, 185, 129, 0.08)';
                        color = '#10b981';
                        border = '1px solid rgba(16, 185, 129, 0.2)';
                      } else if (status === 'Rejected') {
                        bg = 'rgba(239, 68, 68, 0.08)';
                        color = '#ef4444';
                        border = '1px solid rgba(239, 68, 68, 0.2)';
                      } else if (status === 'Draft' || status === 'Quotation Created') {
                        bg = 'rgba(59, 130, 246, 0.08)';
                        color = '#3b82f6';
                        border = '1px solid rgba(59, 130, 246, 0.2)';
                      } else if (status.toLowerCase().includes('counter') || status.toLowerCase().includes('negotiat') || status.toLowerCase().includes('revised')) {
                        bg = 'rgba(245, 158, 11, 0.08)';
                        color = '#f59e0b';
                        border = '1px solid rgba(245, 158, 11, 0.2)';
                      } else if (status.toLowerCase().includes('approval') || status.toLowerCase().includes('pending')) {
                        bg = 'rgba(139, 92, 246, 0.08)';
                        color = '#8b5cf6';
                        border = '1px solid rgba(139, 92, 246, 0.2)';
                      }

                      return (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '9px',
                          fontWeight: 700,
                          backgroundColor: bg,
                          color: color,
                          border: border,
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                        }}>
                          {status}
                        </span>
                      );
                    })()}
                  </div>
                  <p style={{ color: '#4b5563', lineHeight: 1.3, marginTop: 2 }}>{customerAddress}</p>
                  <p style={{ color: '#4b5563', fontSize: 9, marginTop: 4 }}>Contact: {selectedQuotationDetail.custom_customer_email || ''} | {selectedQuotationDetail.custom_customer_ph_no || ''}</p>
                </div>
                <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 9, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ color: '#6b7280', fontWeight: 700 }}>ESTIMATED BOOKING PERIOD</span>
                  <div>Start: <strong style={{ color: '#111827' }}>{selectedQuotationDetail.custom_start_date || 'N/A'}</strong></div>
                  <div>End: <strong style={{ color: '#111827' }}>{selectedQuotationDetail.custom_end_date || 'N/A'}</strong></div>
                </div>
              </div>

              {/* TABS NAVIGATION */}
              <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', gap: 16, flexShrink: 0 }}>
                {['SUMMARY', 'NEGOTIATION HISTORY', 'COMPARISON', 'DOCUMENTS'].map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '8px 4px',
                      border: 'none',
                      background: 'none',
                      fontWeight: 700,
                      fontSize: 10,
                      letterSpacing: 0.5,
                      cursor: 'pointer',
                      borderBottom: activeTab === tab ? '2px solid var(--brand-color)' : '2px solid transparent',
                      color: activeTab === tab ? 'var(--brand-color)' : '#4b5563',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT WRAPPER */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
                {(() => {
                  const originalPrice = (selectedQuotationDetail.items || []).reduce((acc, item) => acc + ((item.price_list_rate || item.rate || 0) * (item.qty || 1)), 0);
                  const currentPrice = selectedQuotationDetail.grand_total || 0;
                  const offeredPrice = selectedQuotationDetail.total || 0;
                  const discount = selectedQuotationDetail.discount_amount || 0;

                  const activeNegotiations = negotiations.length > 0 ? negotiations : [
                    { name: `${selectedQuotationDetail.name}-v4`, version_no: selectedQuotationDetail.custom_total_versions || 4, negotiation_date: selectedQuotationDetail.modified || '2026-07-30 15:54:28', negotiation_by: selectedQuotationDetail.custom_last_negotiated_by || 'devteam@anantdv.com', current_discount: selectedQuotationDetail.discount_amount || 98.5, current_grand_total: selectedQuotationDetail.grand_total || 3184.75, previous_discount: 75, previous_grand_total: 3208.25, discount_difference: 23.5, discount_percentage: 3, negotiation_status: selectedQuotationDetail.status || 'Draft' },
                    { name: `${selectedQuotationDetail.name}-v3`, version_no: 3, negotiation_date: '2026-07-26 16:30:00', negotiation_by: 'devteam@anantdv.com', current_discount: 75.00, current_grand_total: 3208.25, previous_discount: 50.00, previous_grand_total: 3233.25, discount_difference: 25.00, discount_percentage: 2, negotiation_status: 'Revised' },
                    { name: `${selectedQuotationDetail.name}-v2`, version_no: 2, negotiation_date: '2026-07-24 10:15:00', negotiation_by: selectedQuotationDetail.custom_customer_email || 'biswajitmaity@icloud.com', current_discount: 50.00, current_grand_total: 3233.25, previous_discount: 0.00, previous_grand_total: 3283.25, discount_difference: 50.00, discount_percentage: 1.5, negotiation_status: 'Counter Offer' },
                    { name: `${selectedQuotationDetail.name}-v1`, version_no: 1, negotiation_date: selectedQuotationDetail.creation || '2026-07-23 09:30:00', negotiation_by: 'devteam@anantdv.com', current_discount: 0.00, current_grand_total: 3283.25, previous_discount: 0.00, previous_grand_total: 3283.25, discount_difference: 0.00, discount_percentage: 0.00, negotiation_status: 'Initial Quote' }
                  ];

                  const lastVersionDiscount = activeNegotiations.length > 1 ? activeNegotiations[1].previous_discount : 0;
                  const diffPct = originalPrice > 0 ? ((lastVersionDiscount / originalPrice) * 100).toFixed(2) : '0.00';

                  const isTerminal = ["Approved", "Rejected", "Cancelled"].includes(selectedQuotationDetail.workflow_state || selectedQuotationDetail.status);
                  const isRequestForApproval = (selectedQuotationDetail.workflow_state || "").toLowerCase().includes("request");
                  const isDiscountDisabled = isTerminal;
                  const isApproved = (selectedQuotationDetail.workflow_state || selectedQuotationDetail.status) === "Approved";
                  const isDisabled = isTerminal;



                  const activeComments = comments.length > 0 ? comments : [
                    { comment_by: selectedQuotationDetail.custom_last_negotiated_by || 'devteam@anantdv.com', content: selectedQuotationDetail.custom_negotiation_status || 'Initial quotation created.', creation: selectedQuotationDetail.modified || '2026-07-30 15:54:28' }
                  ];

                  const stripHtml = (html) => {
                    if (!html) return '';
                    return html.replace(/<[^>]*>?/gm, '');
                  };

                  if (activeTab === 'SUMMARY') {
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, overflowY: 'auto', paddingRight: 4, minHeight: 0 }}>

                        {/* ROW 1: Price Comparison & Price Breakdown */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, flexShrink: 0, alignItems: 'start' }}>
                          {/* Price Comparison */}
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', marginBottom: 4 }}>Price Comparison</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: 10, padding: 12, background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb', textAlign: 'center', minHeight: 120, boxSizing: 'border-box' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: 8, color: '#6b7280', fontWeight: 600 }}>Valuation Rate</div>
                                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 2 }}>${originalPrice.toLocaleString()}</div>
                              </div>
                              <div style={{ borderLeft: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: 8, color: '#6b7280', fontWeight: 600 }}>Offered Price</div>
                                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 2, color: 'var(--brand-color)' }}>${offeredPrice.toLocaleString()}</div>
                              </div>
                              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: 8, color: '#6b7280', fontWeight: 600 }}>Negotiated Discount ({companyDetails.currency || 'FJD'})</div>
                                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 2, color: '#eab308' }}>${discount.toLocaleString()}</div>
                              </div>
                              <div style={{ borderLeft: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb', paddingTop: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: 8, color: '#6b7280', fontWeight: 600 }}>Difference</div>
                                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 2, color: '#ef4444' }}>-{diffPct}%</div>
                              </div>
                            </div>
                          </div>

                          {/* Price Breakdown */}
                          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 135, boxSizing: 'border-box' }}>
                            <div style={{ background: '#f9fafb', padding: '8px 12px', borderBottom: '1px solid #e5e7eb', fontWeight: 700, fontSize: 9, textTransform: 'uppercase', color: '#4b5563', flexShrink: 0 }}>
                              Price Breakdown (Current)
                            </div>
                            <div style={{ flex: 1, maxHeight: 180, overflowY: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, textAlign: 'left' }}>
                                <thead>
                                  <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb', fontWeight: 600, color: '#4b5563' }}>
                                    <th style={{ padding: '6px 12px' }}>Unit / Fee Name</th>
                                    <th style={{ padding: '6px 12px', textAlign: 'center' }}>Total Area (sqft)</th>
                                    <th style={{ padding: '6px 12px', textAlign: 'right' }}>Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(selectedQuotationDetail.items || []).map((item, idx) => {
                                    const matchedUnit = spaceUnits.find(u => u.name === item.item_code || u.item_code === item.item_code);

                                    // Resolve area value
                                    let areaVal = '—';
                                    const isFee = (item.item_name || item.item_code || '').toLowerCase().match(/fee|charge|service|deposit|tax/);
                                    if (!isFee) {
                                      if (item.total_areasqm) areaVal = item.total_areasqm;
                                      else if (item.custom_total_area) areaVal = item.custom_total_area;
                                      else if (item.total_area) areaVal = item.total_area;
                                      else if (item.custom_total_area_sqft) areaVal = item.custom_total_area_sqft;
                                      else if (item.area_sqft) areaVal = item.area_sqft;
                                      else if (item.area) areaVal = item.area;
                                      else if (matchedUnit) {
                                        areaVal = matchedUnit.total_areasqm || matchedUnit.custom_total_area || matchedUnit.total_area || matchedUnit.area || matchedUnit.custom_total_area_sqft || '—';
                                      }

                                      if (areaVal === '—') {
                                        // Fallback scan: find any item in the quote with qty > 1
                                        const otherWithQty = (selectedQuotationDetail.items || []).find(it => it.qty > 1);
                                        if (otherWithQty) {
                                          areaVal = otherWithQty.qty;
                                        }
                                      }
                                    }

                                    return (
                                      <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '8px 12px', color: '#374151', fontWeight: 600 }}>
                                          {item.item_name || item.item_code}
                                        </td>
                                        <td style={{ padding: '8px 12px', textAlign: 'center', color: '#4b5563', fontWeight: 500 }}>
                                          {areaVal && areaVal !== '—' ? `${areaVal} sqft` : '—'}
                                        </td>
                                        <td style={{ padding: '8px 12px', textAlign: 'right', color: '#111827', fontWeight: 700 }}>
                                          ${((item.qty || 1) * (item.rate || 0)).toLocaleString()}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                            <div style={{ padding: 10, background: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 4, fontSize: 10, flexShrink: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                                <span>Net Total</span>
                                <span>${(selectedQuotationDetail.total || 0).toLocaleString()}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', fontWeight: 600 }}>
                                <span>Negotiated Discount</span>
                                <span>-${discount.toLocaleString()}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                                {(() => {
                                  const taxes = selectedQuotationDetail.total_taxes_and_charges || 0;
                                  const total = selectedQuotationDetail.total || 0;
                                  const taxableAmount = total - discount;
                                  const taxRate = taxableAmount > 0 ? ((taxes / taxableAmount) * 100).toFixed(1) : '0.0';
                                  return (
                                    <>
                                      <span>Taxes (VAT @ {taxRate}%)</span>
                                      <span>${taxes.toLocaleString()}</span>
                                    </>
                                  );
                                })()}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 800, fontSize: 12, borderTop: '1px solid #e5e7eb', paddingTop: 6 }}>
                                <span>Grand Total ({companyDetails.currency || 'FJD'})</span>
                                <span>${currentPrice.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ROW 2: Negotiation Timeline & Negotiation Remarks */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, flexShrink: 0, alignItems: 'start' }}>
                          {/* Negotiation Timeline */}
                          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ background: '#f9fafb', padding: '8px 12px', borderBottom: '1px solid #e5e7eb', fontWeight: 700, fontSize: 9, textTransform: 'uppercase', color: '#4b5563', flexShrink: 0 }}>
                              Negotiation Timeline
                            </div>
                            <div style={{ flex: 1, maxHeight: 180, overflowY: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, textAlign: 'left' }}>
                                <thead>
                                  <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb', fontWeight: 600, color: '#4b5563' }}>
                                    <th style={{ padding: '6px 12px' }}>Version</th>
                                    <th style={{ padding: '6px 12px' }}>Date</th>
                                    <th style={{ padding: '6px 12px' }}>By</th>
                                    <th style={{ padding: '6px 12px', textAlign: 'right' }}>Discount</th>
                                    <th style={{ padding: '6px 12px', textAlign: 'right' }}>Grand Total</th>
                                    <th style={{ padding: '6px 12px' }}>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {activeNegotiations.map((n, idx) => (
                                    <tr key={n.name || idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                      <td style={{ padding: '6px 12px', fontWeight: 600, color: idx === 0 ? 'var(--brand-color)' : '#4b5563' }}>
                                        V{n.version_no} {idx === 0 ? '(Current)' : idx === activeNegotiations.length - 1 ? '(Initial)' : ''}
                                      </td>
                                      <td style={{ padding: '6px 12px', whiteSpace: 'nowrap' }}>{n.negotiation_date ? n.negotiation_date.split(' ')[0] : '—'}</td>
                                      <td style={{ padding: '6px 12px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 100 }} title={n.negotiation_by}>
                                        {n.negotiation_by ? n.negotiation_by.split('@')[0] : '—'}
                                      </td>
                                      <td style={{ padding: '6px 12px', textAlign: 'right', fontWeight: 600 }}>${(n.current_discount || 0).toLocaleString()}</td>
                                      <td style={{ padding: '6px 12px', textAlign: 'right', fontWeight: 600 }}>${(n.current_grand_total || 0).toLocaleString()}</td>
                                      <td style={{ padding: '6px 12px' }}>
                                        <span style={{
                                          padding: '2px 6px',
                                          borderRadius: 8,
                                          fontSize: 8,
                                          fontWeight: 700,
                                          backgroundColor: n.negotiation_status === 'Pending Approval' || n.negotiation_status === 'Pending' || n.negotiation_status === 'Draft' ? '#fef3c7' : n.negotiation_status === 'Initial Quote' ? '#e0f2fe' : '#e5e7eb',
                                          color: n.negotiation_status === 'Pending Approval' || n.negotiation_status === 'Pending' || n.negotiation_status === 'Draft' ? '#d97706' : n.negotiation_status === 'Initial Quote' ? '#0369a1' : '#374151'
                                        }}>
                                          {n.negotiation_status || 'Submitted'}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Negotiation Remarks */}
                          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ background: '#f9fafb', padding: '8px 12px', borderBottom: '1px solid #e5e7eb', fontWeight: 700, fontSize: 9, textTransform: 'uppercase', color: '#4b5563', flexShrink: 0 }}>
                              Negotiation Remarks
                            </div>
                            {selectedQuotationDetail && selectedQuotationDetail.remarks && (
                              <p style={{ margin: '8px 0', fontSize: 10, color: '#4b5563', lineHeight: 1.4, background: '#f9fafb', padding: '8px', borderRadius: 4 }}>
                                {selectedQuotationDetail.remarks}
                              </p>
                            )}
                            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10, flex: 1, maxHeight: 180, overflowY: 'auto' }}>
                              {activeComments.map((c, idx) => {
                                const isSales = c.comment_by?.includes('devteam') || c.comment_by?.includes('sales') || c.comment_email?.includes('devteam') || c.comment_email?.includes('sales') || c.owner?.includes('devteam');
                                return (
                                  <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: isSales ? '#e0f2fe' : '#f3e8ff', color: isSales ? '#0369a1' : '#6b21a8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 9 }}>
                                      {isSales ? 'S' : 'C'}
                                    </div>
                                    <div style={{ flex: 1, background: isSales ? '#f0f9ff' : '#faf5ff', padding: 8, borderRadius: '0 8px 8px 8px', border: `1px solid ${isSales ? '#bae6fd' : '#e9d5ff'}` }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                        <span style={{ fontSize: 9, fontWeight: 700, color: isSales ? '#0369a1' : '#6b21a8' }}>
                                          {isSales ? 'Sales Team' : 'Customer'}
                                        </span>
                                        <span style={{ fontSize: 8, color: '#9ca3af' }}>{c.creation ? c.creation.split(' ')[0] : '—'}</span>
                                      </div>
                                      <div style={{ fontSize: 9, color: '#374151', lineHeight: 1.3 }}>{stripHtml(c.content)}</div>
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

                  if (activeTab === 'NEGOTIATION HISTORY') {
                    return (
                      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflowY: 'auto', minHeight: 0 }}>
                        <span style={{ fontWeight: 700, fontSize: 10, color: '#4b5563', textTransform: 'uppercase' }}>Revision Version History</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          {activeNegotiations.map((n, idx) => (
                            <div key={n.name || idx} style={{ borderLeft: '2px solid var(--brand-color)', paddingLeft: 12, position: 'relative' }}>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-color)', position: 'absolute', left: -5, top: 4 }} />
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong style={{ fontSize: 11 }}>Version {n.version_no} ({n.negotiation_status})</strong>
                                <span style={{ fontSize: 9, color: '#6b7280' }}>{n.negotiation_date}</span>
                              </div>
                              <p style={{ margin: '4px 0 0 0', fontSize: 10, color: '#4b5563', lineHeight: 1.4 }}>
                                Negotiated by <strong>{n.negotiation_by}</strong>. Changed grand total from <strong>${(n.previous_grand_total || 0).toLocaleString()}</strong> to <strong>${(n.current_grand_total || 0).toLocaleString()}</strong> (Discount: <strong>${(n.current_discount || 0).toLocaleString()}</strong>).
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (activeTab === 'COMPARISON') {
                    return (
                      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', minHeight: 0 }}>
                        <div style={{ background: '#f9fafb', padding: '8px 12px', borderBottom: '1px solid #e5e7eb', fontWeight: 700, fontSize: 9, textTransform: 'uppercase', color: '#4b5563', flexShrink: 0 }}>
                          Version-by-Version Comparison
                        </div>
                        <div style={{ overflowX: 'auto', flex: 1 }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, textAlign: 'left', minWidth: 350 }}>
                            <thead>
                              <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '8px 12px' }}>Parameter</th>
                                {activeNegotiations.map(n => (
                                  <th key={n.name} style={{ padding: '8px 12px', textAlign: 'right' }}>V{n.version_no}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '8px 12px', fontWeight: 600 }}>Discount Amount</td>
                                {activeNegotiations.map(n => (
                                  <td key={n.name} style={{ padding: '8px 12px', textAlign: 'right', color: '#eab308', fontWeight: 600 }}>${(n.current_discount || 0).toLocaleString()}</td>
                                ))}
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '8px 12px', fontWeight: 600 }}>Grand Total</td>
                                {activeNegotiations.map(n => (
                                  <td key={n.name} style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--brand-color)', fontWeight: 600 }}>${(n.current_grand_total || 0).toLocaleString()}</td>
                                ))}
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '8px 12px', fontWeight: 600 }}>Negotiated By</td>
                                {activeNegotiations.map(n => (
                                  <td key={n.name} style={{ padding: '8px 12px', textAlign: 'right', color: '#4b5563' }}>{n.negotiation_by ? n.negotiation_by.split('@')[0] : '—'}</td>
                                ))}
                              </tr>
                              <tr>
                                <td style={{ padding: '8px 12px', fontWeight: 600 }}>Status</td>
                                {activeNegotiations.map(n => (
                                  <td key={n.name} style={{ padding: '8px 12px', textAlign: 'right' }}>
                                    <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--brand-color)' }}>{n.negotiation_status}</span>
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  }

                  if (activeTab === 'DOCUMENTS') {
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflowY: 'auto', minHeight: 0 }}>
                        {[
                          { title: 'PMS Offer Letter', desc: 'Official proposal offer letter with printable layouts.', type: 'Offer Letter' },
                          { title: 'Sales Contract Draft', desc: 'Standard leasing terms and conditions for commercial units.', type: 'Leasing Agreement' },
                          { title: 'Property Unit Booking Receipt', desc: 'Holding deposit transaction record.', type: 'Receipt' }
                        ].map((doc, idx) => (
                          <div key={idx} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb', flexShrink: 0 }}>
                            <div>
                              <h5 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#1f2937' }}>{doc.title}</h5>
                              <p style={{ margin: '2px 0 0 0', fontSize: 9, color: '#6b7280' }}>{doc.desc}</p>
                            </div>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: 10, padding: '4px 10px' }}
                              onClick={() => {
                                if (doc.type === 'Offer Letter') {
                                  const printBtn = document.getElementById('qtn-print-action-btn');
                                  if (printBtn) printBtn.click();
                                } else {
                                  showToast('info', `${doc.title} is ready to be printed once quotation is approved.`);
                                }
                              }}
                            >
                              View / Print
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  }
                })()}
              </div>

              {/* BOTTOM SUMMARY & DECISION SECTION */}
              {(() => {
                const originalPrice = (selectedQuotationDetail.items || []).reduce((acc, item) => acc + ((item.price_list_rate || item.rate || 0) * (item.qty || 1)), 0);
                const originalDiscount = selectedQuotationDetail.discount_amount !== undefined && selectedQuotationDetail.discount_amount !== null
                  ? String(selectedQuotationDetail.discount_amount)
                  : '';
                const isChanged = discountAmount !== originalDiscount || messageText.trim() !== '';
                const isTerminal = ["Approved", "Rejected", "Cancelled"].includes(selectedQuotationDetail.workflow_state || selectedQuotationDetail.status);
                const isRequestForApproval = (selectedQuotationDetail.workflow_state || "").toLowerCase().includes("request");
                const isDiscountDisabled = isTerminal;
                const isApproved = (selectedQuotationDetail.workflow_state || selectedQuotationDetail.status) === "Approved";
                const isDisabled = isTerminal;

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, borderTop: '1px solid #e5e7eb', paddingTop: 10, flexShrink: 0 }}>
                    <style dangerouslySetInnerHTML={{
                      __html: `
                    .qtn-btn-base {
                      padding: 6px 12px;
                      font-size: 10px;
                      font-weight: 700;
                      min-height: 30px;
                      white-space: nowrap;
                      border-radius: 8px;
                      cursor: pointer;
                      transition: all 0.15s ease;
                      border: 1px solid transparent;
                      text-transform: capitalize;
                      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      gap: 4px;
                    }
                    .qtn-btn-approve {
                      background-color: #10b981 !important;
                      border: 1px solid #10b981 !important;
                      color: #ffffff !important;
                    }
                    .qtn-btn-approve:hover {
                      background-color: #059669 !important;
                      border-color: #059669 !important;
                    }
                    .qtn-btn-reject {
                      background-color: #ef4444 !important;
                      border: 1px solid #ef4444 !important;
                      color: #ffffff !important;
                    }
                    .qtn-btn-reject:hover {
                      background-color: #dc2626 !important;
                      border-color: #dc2626 !important;
                    }
                    .qtn-btn-sendback {
                      background-color: #ffffff !important;
                      border: 1px solid #f59e0b !important;
                      color: #f59e0b !important;
                    }
                    .qtn-btn-sendback:hover {
                      background-color: #fffbeb !important;
                      border-color: #d97706 !important;
                      color: #d97706 !important;
                    }
                    .qtn-btn-print {
                      background-color: #ffffff !important;
                      border: 1px solid #d1d5db !important;
                      color: #374151 !important;
                    }
                    .qtn-btn-print:hover {
                      background-color: #f9fafb !important;
                      border-color: #9ca3af !important;
                      color: #111827 !important;
                    }
                  ` }} />
                    {/* Left Column: Quotation Summary */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 10 }}>
                      <span style={{ color: '#4b5563', fontWeight: 700, fontSize: 9, textTransform: 'uppercase' }}>Quotation Summary</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: 2 }}>
                          <span style={{ color: '#6b7280' }}>Versions Created</span>
                          <strong style={{ color: '#111827' }}>{selectedQuotationDetail.custom_total_versions || 1}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: 2 }}>
                          <span style={{ color: '#6b7280' }}>Total Discount</span>
                          <strong style={{ color: '#111827' }}>${(selectedQuotationDetail.discount_amount || 0).toLocaleString()}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: 2 }}>
                          <span style={{ color: '#6b7280' }}>Last Negotiation</span>
                          <strong style={{ color: '#111827' }}>
                            {(() => {
                              const dateStr = selectedQuotationDetail.custom_last_negotiation_date || selectedQuotationDetail.modified;
                              if (!dateStr) return 'N/A';
                              return dateStr.split('.')[0];
                            })()}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: 2 }}>
                          <span style={{ color: '#6b7280' }}>Negotiated By</span>
                          <strong style={{ color: '#111827' }}>{selectedQuotationDetail.custom_last_negotiated_by || selectedQuotationDetail.owner || 'N/A'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#6b7280' }}>Current Status</span>
                          <strong style={{ color: 'var(--brand-color)' }}>{selectedQuotationDetail.workflow_state || selectedQuotationDetail.status}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Final Decision */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ color: '#4b5563', fontWeight: 700, fontSize: 9, textTransform: 'uppercase' }}>Final Decision</span>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                          <label style={{ fontSize: 8, color: '#6b7280', fontWeight: 700 }}>Discount Amount ({companyDetails.currency || 'FJD'})</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="0.00"
                            value={discountAmount}
                            onChange={(e) => setDiscountAmount(e.target.value)}
                            disabled={isDiscountDisabled}
                            className="form-input"
                            style={{ fontSize: 10, padding: '4px 8px', boxSizing: 'border-box', background: isDiscountDisabled ? '#f3f4f6' : '#ffffff', minHeight: 28 }}
                          />
                        </div>
                      </div>

                      {/* BUTTONS ROW (Dynamic workflow buttons + Booking + Print) */}
                      {(() => {
                        const state = selectedQuotationDetail.workflow_state || "Quotation Created";
                        let actions = [];

                        // 1. Try to extract actions from the API response
                        let apiActions = [];
                        if (workflowActions) {
                          if (Array.isArray(workflowActions.next_actions)) {
                            apiActions = workflowActions.next_actions.filter(act => act && act.allowed !== false);
                          } else if (Array.isArray(workflowActions)) {
                            apiActions = workflowActions;
                          } else if (typeof workflowActions === 'object') {
                            const rawActions = workflowActions.actions ||
                              workflowActions.next_actions ||
                              workflowActions.transitions ||
                              workflowActions.workflow_actions ||
                              workflowActions.next_workflow_actions ||
                              [];
                            if (Array.isArray(rawActions)) {
                              apiActions = rawActions.filter(act => act && act.allowed !== false);
                            }
                          }
                        }

                        if (apiActions.length > 0) {
                          actions = apiActions.map(act => {
                            if (typeof act === 'string') {
                              let label = act;
                              let variant = "primary";
                              if (act.toLowerCase().includes("reject")) variant = "danger";
                              if (act.toLowerCase().includes("counter")) variant = "secondary";
                              return { label, action: act, variant };
                            } else if (act && typeof act === 'object') {
                              const actName = act.action || "";
                              const nextStateName = act.next_state || actName;
                              let label = nextStateName;

                              let variant = "primary";
                              if (actName.toLowerCase().includes("reject") || nextStateName.toLowerCase().includes("reject")) variant = "danger";
                              if (actName.toLowerCase().includes("counter") || nextStateName.toLowerCase().includes("counter")) variant = "secondary";
                              return { label, action: actName, variant };
                            }
                            return null;
                          }).filter(Boolean);
                        }

                        // Sort actions: reject/rejected should always go to the bottom
                        const sortedActions = [...actions].sort((a, b) => {
                          const aIsReject = (a.action || "").toLowerCase().includes("reject") || (a.label || "").toLowerCase().includes("reject");
                          const bIsReject = (b.action || "").toLowerCase().includes("reject") || (b.label || "").toLowerCase().includes("reject");
                          if (aIsReject && !bIsReject) return 1;
                          if (!aIsReject && bIsReject) return -1;
                          return 0;
                        });

                        return (
                          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
                            {isChanged && (
                              <button
                                type="button"
                                className="qtn-btn-base qtn-btn-approve"
                                style={{ background: '#3b82f6', borderColor: '#3b82f6', color: '#ffffff' }}
                                onClick={handleSaveDiscountAndMessage}
                                disabled={savingDiscount}
                              >
                                <span>{savingDiscount ? 'Saving...' : 'Apply Discount'}</span>
                              </button>
                            )}

                            {sortedActions.map((act) => {
                              const actionKey = (act.action || "").toLowerCase();
                              const nextStateKey = (act.label || "").toLowerCase();

                              let btnClass = "qtn-btn-base ";
                              let icon = null;

                              if (actionKey.includes("reject") || nextStateKey.includes("reject") || nextStateKey.includes("rejected")) {
                                btnClass += "qtn-btn-reject";
                                icon = <X size={11} />;
                              } else if (actionKey.includes("approve") || nextStateKey.includes("approve") || nextStateKey.includes("approved")) {
                                btnClass += "qtn-btn-approve";
                                icon = <Check size={11} />;
                              } else {
                                btnClass += "qtn-btn-sendback";
                                icon = <RotateCcw size={11} />;
                              }

                              return (
                                <button
                                  key={act.action}
                                  type="button"
                                  className={btnClass}
                                  onClick={() => handleWorkflowAction(act.action)}
                                  disabled={savingDiscount}
                                >
                                  {icon}
                                  <span>{savingDiscount ? '...' : act.label}</span>
                                </button>
                              );
                            })}

                            {/* Go to Booking - Only in Approved status */}
                            {isApproved && (
                              <button
                                type="button"
                                className="qtn-btn-base qtn-btn-approve"
                                onClick={() => onGoToBooking && onGoToBooking(selectedQuotationDetail)}
                              >
                                <Check size={11} />
                                <span>Go to Booking</span>
                              </button>
                            )}

                            {/* Print Button */}
                            <button
                              id="qtn-print-action-btn"
                              type="button"
                              className="qtn-btn-base qtn-btn-print"
                              onClick={() => {
                                if (selectedQuotationDetail.status === 'Cancelled') {
                                  showToast('error', 'Not allowed to print cancelled documents');
                                  return;
                                }
                                if (erpnextConfig?.url && selectedQuotationDetail?.name) {
                                  const printUrl = `${erpnextConfig.url}/printview?doctype=Quotation&name=${encodeURIComponent(selectedQuotationDetail.name)}&format=PMS%20Offer%20Letter&no_letterhead=1&letterhead=No%20Letterhead&settings=%7B%7D&_lang=en`;
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
                                              body { margin: 1.6cm 2cm; background: #fff !important; }
                                              .action-banner, .action-bar, header, footer { display: none !important; }
                                            }
                                          `;
                                            doc.head.appendChild(style);
                                          }
                                          printWindow.print();
                                        }
                                      } catch (err) {
                                        console.warn("Failed to inject CSS to print window:", err);
                                      }
                                    };

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
                                      } catch (err) {
                                        // ignore cross-origin transitions
                                      }
                                    }, 100);
                                  }
                                }
                              }}
                            >
                              <Printer size={11} />
                              <span>Print</span>
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>


      {/* </div> */}

      {/* Create Quotation Modal */}
      {
        showAddModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{
              maxWidth: 980,
              width: '96vw',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '92vh',
              background: 'var(--bg-primary, #ffffff)',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05)',
              overflow: 'hidden'
            }}>

              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 24px',
                borderBottom: '1px solid var(--border-color, #e2e8f0)',
                background: 'var(--bg-primary, #ffffff)',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#e6f4ea',
                    color: '#137333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileText size={16} style={{ color: '#137333' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Create New Quotation</h3>
                    <span style={{ fontSize: 11, color: '#64748b' }}>Fill in the details below to create a new quotation</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateQuotation} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '14px 18px', overflowY: 'auto', flex: 1 }}>

                  {/* Top fields card */}
                  <div style={{
                    background: 'var(--bg-primary, #ffffff)',
                    border: '1px solid var(--border-color, #e2e8f0)',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px 20px'
                  }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <User size={14} style={{ color: '#137333' }} />
                        <span>Tenant Name</span>
                      </label>
                      <select
                        value={quoteCustomer}
                        onChange={(e) => setQuoteCustomer(e.target.value)}
                        className="form-select"
                        required
                        disabled={submitting}
                        style={{ fontSize: 13, minHeight: 34, borderRadius: 8, border: '1px solid var(--border-color, #cbd5e1)' }}
                      >
                        <option value="">-- Choose Tenant --</option>
                        {customers.map(c => (
                          <option key={c.name} value={c.name}>{c.customer_name || c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Layers size={14} style={{ color: '#137333' }} />
                        <span>Template</span>
                      </label>
                      <select
                        value={quotetamplate}
                        onChange={(e) => setQuotetamplate(e.target.value)}
                        className="form-select"
                        required
                        disabled={submitting}
                        style={{ fontSize: 13, minHeight: 34, borderRadius: 8, border: '1px solid var(--border-color, #cbd5e1)' }}
                      >
                        <option value="">-- Choose Template --</option>
                        {tamplates.map(c => (
                          <option key={c.name} value={c.name}>{c.customer_name || c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Calendar size={14} style={{ color: '#137333' }} />
                        <span>Start Date</span>
                      </label>
                      <input
                        type="date"
                        value={quoteEstBookingStart}
                        onChange={(e) => {
                          const newStart = e.target.value;
                          setQuoteEstBookingStart(newStart);
                          if (newStart) {
                            const d = new Date(newStart);
                            d.setFullYear(d.getFullYear() + 1);
                            const minEndStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                            if (!quoteEstBookingEnd || new Date(quoteEstBookingEnd) < d) {
                              setQuoteEstBookingEnd(minEndStr);
                            }
                          }
                        }}
                        className="form-input"
                        required
                        disabled={submitting}
                        style={{ fontSize: 13, minHeight: 34, borderRadius: 8, border: '1px solid var(--border-color, #cbd5e1)' }}
                        min={(() => {
                          const d = new Date();
                          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                        })()}
                      />
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Calendar size={14} style={{ color: '#137333' }} />
                        <span>End Date</span>
                      </label>
                      <input
                        type="date"
                        value={quoteEstBookingEnd}
                        onChange={(e) => setQuoteEstBookingEnd(e.target.value)}
                        className="form-input"
                        required
                        disabled={submitting}
                        style={{ fontSize: 13, minHeight: 34, borderRadius: 8, border: '1px solid var(--border-color, #cbd5e1)' }}
                        min={(() => {
                          if (!quoteEstBookingStart) return '';
                          const d = new Date(quoteEstBookingStart);
                          d.setFullYear(d.getFullYear() + 1);
                          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                        })()}
                      />
                    </div>
                  </div>

                  {/* Property Unit Quick Finder Panel */}
                  <div style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23f0fdf4' stop-opacity='0.95'/%3E%3Cstop offset='60%25' stop-color='%23f8fafc' stop-opacity='0.7'/%3E%3Cstop offset='100%25' stop-color='%23ffffff' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3Cpath d='M-100 150 C 150 50, 250 250, 500 150 S 650 50, 900 150' stroke='rgba(16, 185, 129, 0.09)' fill='none' stroke-width='4.5'/%3E%3Cpath d='M-50 200 C 200 100, 300 300, 550 200 S 700 100, 950 200' stroke='rgba(16, 185, 129, 0.05)' fill='none' stroke-width='2.5'/%3E%3C/svg%3E")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid #e2e8f0',
                    borderLeft: '4px solid #10b981',
                    borderRadius: '12px',
                    padding: '4px 15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    position: 'relative',
                    overflow: 'visible',
                    minHeight: '110px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
                    zIndex: isPropDropdownOpen ? 50 : 2
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 1, flex: 1, maxWidth: '60%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#e6f4ea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Zap size={14} style={{ color: '#137333' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1f2937' }}>Property Unit Quick Finder</span>
                          <span style={{ fontSize: '11px', color: '#6b7280' }}>Filter available units by location details</span>
                        </div>
                      </div>

                      {/* Property Group Selection */}
                      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: '300px', position: 'relative' }}>
                        <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Building size={14} style={{ color: '#137333' }} />
                          <span>Property Group</span>
                        </label>

                        {/* Selector Trigger */}
                        <div
                          onClick={(e) => { e.stopPropagation(); setIsPropDropdownOpen(prev => !prev); }}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: 12,
                            padding: '8px 12px',
                            minHeight: 36,
                            borderRadius: 8,
                            border: '1px solid #cbd5e1',
                            background: '#fff',
                            cursor: 'pointer',
                            userSelect: 'none'
                          }}
                        >
                          {(() => {
                            const selectedPG = propertyGroups.find(p => p.name === selProperty);
                            return selectedPG ? (
                              <span style={{ color: '#1f2937' }}>
                                {selectedPG.name} {selectedPG.locality || selectedPG.district ? `(${[selectedPG.locality, selectedPG.district].filter(Boolean).join(', ')})` : ''}
                              </span>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>-- Choose Property Group --</span>
                            );
                          })()}
                          <span style={{ fontSize: 9, color: '#6b7280' }}>▼</span>
                        </div>

                        {/* Dropdown Menu Overlay */}
                        {isPropDropdownOpen && (
                          <div
                            onClick={(e) => e.stopPropagation()} // Don't close dropdown on clicking inside menu
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              right: 0,
                              marginTop: 4,
                              background: '#fff',
                              border: '1px solid #cbd5e1',
                              borderRadius: 8,
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                              zIndex: 1000,
                              maxHeight: 250,
                              overflow: 'hidden'
                            }}
                          >
                            {/* Search input */}
                            <div style={{ padding: 8, borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                              <input
                                type="text"
                                placeholder="Search by name, district, locality..."
                                value={propSearchText}
                                onChange={(e) => setPropSearchText(e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '6px 10px',
                                  fontSize: 11,
                                  borderRadius: 4,
                                  border: '1px solid #cbd5e1',
                                  outline: 'none',
                                  boxSizing: 'border-box',
                                  background: '#fff'
                                }}
                              />
                            </div>

                            {/* Options List */}
                            <div style={{ overflowY: 'auto', maxHeight: 190 }}>
                              {(() => {
                                const list = propertyGroups.filter(p => {
                                  const type = (p.land_and_building_type || '').toString().toLowerCase().trim();
                                  const nameVal = (p.name || '').toString().toLowerCase().trim();
                                  if (type === 'services' || type === 'service' || nameVal.includes('services') || nameVal.includes('service') || nameVal.includes('security') || nameVal.includes('cleaning') || nameVal.includes('maintenance')) return false;
                                  const search = propSearchText.toLowerCase();
                                  return (p.name || '').toLowerCase().includes(search) ||
                                    (p.locality || '').toLowerCase().includes(search) ||
                                    (p.district || '').toLowerCase().includes(search);
                                });

                                if (list.length === 0) {
                                  return (
                                    <div style={{ padding: '12px', fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>
                                      No matches found
                                    </div>
                                  );
                                }

                                return list.map(p => (
                                  <div
                                    key={p.name}
                                    onClick={() => {
                                      setSelProperty(p.name);
                                      setIsPropDropdownOpen(false);
                                      setPropSearchText('');
                                    }}
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      padding: '8px 12px',
                                      borderBottom: '1px solid #f1f5f9',
                                      cursor: 'pointer',
                                      background: selProperty === p.name ? '#f0f9ff' : 'transparent',
                                      transition: 'background 0.1s'
                                    }}
                                    onMouseEnter={(e) => { if (selProperty !== p.name) e.currentTarget.style.background = '#f8fafc'; }}
                                    onMouseLeave={(e) => { if (selProperty !== p.name) e.currentTarget.style.background = 'transparent'; }}
                                  >
                                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#1f2937' }}>{p.name}</span>
                                    <span style={{ fontSize: '9.5px', color: '#6b7280', marginTop: 2 }}>
                                      {p.locality ? `Locality: ${p.locality}` : ''}
                                      {p.locality && p.district ? ', ' : ''}
                                      {p.district ? `District: ${p.district}` : ''}
                                      {!p.locality && !p.district ? 'No location details' : ''}
                                    </span>
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Side Illustration */}
                    <div style={{ position: 'absolute', right: 0, bottom: 0, top: 0, zIndex: 0, width: '280px', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', overflow: 'hidden', borderBottomRightRadius: '12px', borderTopRightRadius: '12px' }}>
                      <img
                        src={houseImg}
                        alt="Property Finder Illustration"
                        style={{ height: '92%', width: 'auto', objectFit: 'contain', verticalAlign: 'bottom', opacity: 0.95 }}
                      />
                    </div>
                  </div>

                  {/* Selected Units table */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#e6f4ea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Home size={14} style={{ color: '#137333' }} />
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>Selected Units</span>
                      </div>
                      <button
                        type="button"
                        onClick={addQuoteItem}
                        style={{
                          padding: '6px 14px',
                          fontSize: 11,
                          fontWeight: 600,
                          borderRadius: '8px',
                          background: 'transparent',
                          color: '#137333',
                          border: '1px solid #137333',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(19, 115, 51, 0.04)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 700 }}>+</span>
                        <span>Add More Units</span>
                      </button>
                    </div>

                    <div style={{ border: '1px solid var(--border-color, #e2e8f0)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                      <div style={{ overflowX: 'auto', maxHeight: 260, overflowY: 'auto' }}>
                        <table style={{ width: '100%', minWidth: 760, borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: 11 }}>
                          <colgroup>
                            <col style={{ width: 32 }} />
                            <col style={{ width: 150 }} />
                            <col style={{ width: 68 }} />
                            <col style={{ width: 92 }} />
                            <col style={{ width: 110 }} />
                            <col style={{ width: 100 }} />
                            <col style={{ width: 125 }} />
                            <col style={{ width: 90 }} />
                            <col style={{ width: 32 }} />
                          </colgroup>
                          <thead>
                            <tr style={{ background: 'var(--bg-secondary, #f8fafc)', position: 'sticky', top: 0, zIndex: 1 }}>
                              {['#', 'Unit Code', 'Val. Rate', 'Offered Rate', 'Property Group', 'District', 'Total Area (Sqft)', 'Amount', ''].map((h, i) => (
                                <th
                                  key={i}
                                  style={{
                                    padding: '10px 12px',
                                    textAlign: h === 'Amount' ? 'right' : 'left',
                                    fontWeight: 700,
                                    fontSize: 11,
                                    color: 'var(--text-secondary, #475569)',
                                    borderBottom: '2px solid var(--border-color, #e2e8f0)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {quoteItems.map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color, #e2e8f0)', background: 'var(--bg-primary, #ffffff)' }}>

                                {/* # */}
                                <td style={{ padding: '8px 12px', color: 'var(--text-secondary, #94a3b8)', fontWeight: 500 }}>{idx + 1}</td>

                                {/* Unit Code */}
                                <td style={{ padding: '6px 8px' }}>
                                  <select
                                    value={item.unitId}
                                    onChange={(e) => handleItemChange(idx, e.target.value)}
                                    className="form-select"
                                    style={{ width: '100%', fontSize: 11, minHeight: 32, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border-color, #cbd5e1)', boxSizing: 'border-box' }}
                                    required
                                  >
                                    <option value="">-- Choose Unit --</option>
                                    {(selProperty ? filteredUnits : spaceUnits).map(unit => (
                                      <option key={unit.name} value={unit.name}>{unit.item_name || unit.name}</option>
                                    ))}
                                  </select>
                                </td>

                                {/* Val. Rate */}
                                <td style={{ padding: '8px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 500 }}>
                                  {item.loadingDetail ? '…' : (item.standardRate ? `$${item.standardRate}` : '—')}
                                </td>

                                {/* Offered Rate */}
                                <td style={{ padding: '6px 8px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ color: 'var(--text-secondary, #475569)', fontWeight: 500 }}>$</span>
                                    <input
                                      type="number"
                                      value={item.offeredRate}
                                      onChange={(e) => handleQtyOrRateChange(idx, 'offeredRate', e.target.value)}
                                      className="form-input"
                                      style={{ width: '100%', fontSize: 11, minHeight: 32, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border-color, #cbd5e1)', boxSizing: 'border-box' }}
                                      required
                                    />
                                  </div>
                                </td>

                                {/* Property Type */}
                                <td style={{ padding: '8px 12px', color: 'var(--text-secondary, #475569)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {item.loadingDetail ? '…' : (item.propertyGroup || '—')}
                                </td>

                                {/* District */}
                                <td style={{ padding: '8px 12px', color: 'var(--text-secondary, #475569)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {item.loadingDetail ? '…' : (item.district || '—')}
                                </td>

                                {/* Total Area */}
                                <td style={{ padding: '8px 12px', color: 'var(--text-secondary, #475569)', textAlign: 'left', fontWeight: 500 }}>
                                  {item.loadingDetail ? '…' : (item.totalArea || '—')}
                                </td>

                                {/* Amount */}
                                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
                                  ${((parseFloat(item.qty) || 1) * (parseFloat(item.offeredRate) || 0)).toLocaleString()}
                                </td>

                                {/* Delete */}
                                <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                                  {quoteItems.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeQuoteItem(idx)}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        borderRadius: '4px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.15s ease'
                                      }}
                                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; }}
                                      onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                                    >
                                      <Trash size={14} />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Grand total footer */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 18px',
                        borderTop: '1px solid var(--border-color, #e2e8f0)',
                        background: 'var(--bg-secondary, #f8fafc)'
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary, #475569)', uppercase: true, letterSpacing: '0.05em' }}>GRAND TOTAL</span>
                        <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--brand-color, #2563eb)' }}>
                          ${quoteItems.reduce((sum, item) => sum + ((parseFloat(item.qty) || 1) * (parseFloat(item.offeredRate) || 0)), 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 12,
                  padding: '16px 24px',
                  borderTop: '1px solid var(--border-color, #e2e8f0)',
                  background: 'var(--bg-primary, #ffffff)',
                  flexShrink: 0
                }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    disabled={submitting}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      border: '1px solid #cbd5e1',
                      background: '#fff',
                      color: '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                  >
                    <XCircle size={14} />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: '8px 20px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#ffffff',
                      background: 'linear-gradient(135deg, #137333 0%, #0f622b 100%)',
                      border: 'none',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 10px rgba(19, 115, 51, 0.2)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                    onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.boxShadow = '0 6px 14px rgba(19, 115, 51, 0.3)'; }}
                    onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.boxShadow = '0 4px 10px rgba(19, 115, 51, 0.2)'; }}
                  >
                    {submitting ? (
                      <span>Creating...</span>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Submit Quotation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )
      }
      {confirmModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            background: 'var(--bg-primary, #ffffff)',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            width: '100%',
            maxWidth: '400px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            border: '1px solid var(--border-color, #e2e8f0)',
            transform: 'scale(1)',
            transition: 'transform 0.2s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fef3c7',
                color: '#f59e0b'
              }}>
                <AlertCircle size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
                Confirm Action
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-secondary, #475569)', lineHeight: 1.5 }}>
              {confirmModal.message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
              <button
                onClick={() => {
                  confirmModal.resolve(false);
                  setConfirmModal(prev => ({ ...prev, show: false }));
                }}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: '1px solid var(--border-color, #e2e8f0)',
                  background: 'var(--bg-primary, #ffffff)',
                  color: 'var(--text-secondary, #475569)',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmModal.resolve(true);
                  setConfirmModal(prev => ({ ...prev, show: false }));
                }}
                style={{
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--brand-color, #2563eb)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {alertModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            background: 'var(--bg-primary, #ffffff)',
            borderRadius: '20px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)',
            width: '100%',
            maxWidth: '460px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            border: '1px solid var(--border-color, #e2e8f0)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: alertModal.title === 'Booking Conflict' ? '#fef2f2' : '#fef3c7',
                color: alertModal.title === 'Booking Conflict' ? '#ef4444' : '#f59e0b',
                flexShrink: 0
              }}>
                <AlertCircle size={24} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>
                  {alertModal.title}
                </h3>
                <p style={{ margin: 0, fontSize: '13.5px', lineHeight: '1.6', color: 'var(--text-secondary, #475569)', fontWeight: 500 }}>
                  {alertModal.message}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setAlertModal(prev => ({ ...prev, show: false }))}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 16px rgba(15, 23, 42, 0.25)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.15)'; }}
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
}