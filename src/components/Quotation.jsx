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



import React, { useState, useEffect } from 'react';
import { FileText, Plus, X, Search, CheckCircle2, AlertCircle, Edit, Trash2, Calendar, User, Building, Trash, Printer, ArrowUpRight } from 'lucide-react';

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

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [selectedQuotationDetail, setSelectedQuotationDetail] = useState(null);

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

          // Fetch Address
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
      const url = `${erpnextConfig.url}/api/resource/Item?fields=["name","item_name","standard_rate","valuation_rate","custom_property_reference","stock_uom"]&limit_page_length=500`;
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
  }, [erpnextConfig]);

  // Handle detailed Quotation view & retrieve client CRM metadata
  const fetchQuotationDetail = async (qName, customerId) => {
    if (!erpnextConfig || !erpnextConfig.url) return;
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
        propertyGroup: listMatch ? (listMatch.custom_property_reference || '') : '',
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
            if (doc[kw] !== undefined && doc[kw] !== null && doc[kw] !== '') return doc[kw];
          }
          const keys = Object.keys(doc);
          for (const kw of keywords) {
            const found = keys.find(k => k.toLowerCase().includes(kw));
            if (found && doc[found] !== undefined && doc[found] !== null && doc[found] !== '') return doc[found];
          }
          return '';
        };
        setQuoteItems(prev => {
          const updated = [...prev];
          if (updated[index] && updated[index].unitId === unitId) {
            updated[index] = {
              ...updated[index],
              propertyGroup: findVal(['custom_property_reference', 'property_group', 'property']) || updated[index].propertyGroup,
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
    setQuotetamplate('')
    setQuoteEstBookingStart('')
    const d = new Date();
    d.setDate(d.getDate() + 30);
    setQuoteEstBookingEnd('')
    setQuoteItems([{ unitId: '', qty: 1, uom: '', standardRate: '', offeredRate: '', propertyGroup: '', locality: '', district: '', totalArea: '', loadingDetail: false }]);
    setErrorMsg('');
  };

  // Submit new Quotation
  const handleCreateQuotation = async (e) => {
    e.preventDefault();
    if (!quoteCustomer || !quoteEstBookingStart || !quoteEstBookingEnd) return;

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
      setErrorMsg('You must add at least one Property Unit.');
      return;
    }

    // Confirmation box before submitting
    const confirmMsg = `Create quotation for ${matchedCust ? (matchedCust.customer_name || matchedCust.name) : quoteCustomer} with ${erpItems.length} unit(s)?`;
    if (!window.confirm(confirmMsg)) return;

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      customer: quoteCustomer,
      party_name: quoteCustomer,
      customer_name: matchedCust ? matchedCust.customer_name : quoteCustomer,
      quotation_to: 'Customer',
      transaction_date: quoteEstBookingStart,
      valid_till: quoteEstBookingEnd,
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
          const errData = await res.json();
          let rawMsg = 'Failed to create quotation on server.';
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
      setErrorMsg(err.message);
      showToast('error', err.message || 'Failed to create quotation.');
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel Quotation Workflow (Sets status to 'Cancelled')
  const handleCancelQuotation = async (qName) => {
    if (!confirm(`Are you sure you want to cancel quotation ${qName}? This cannot be undone.`)) return;
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
    if (!confirm(`This action will Cancel the current quotation revision ${selectedQuotationDetail.name} and create a new editable draft. Proceed?`)) return;

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
    if (!confirm(`Are you sure you want to ${actionLabel} quotation ${con.name}?`)) return;

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

      <div className="grid-2col" style={{ gridTemplateColumns: selectedQuotation ? '50% calc(50% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>

        {/* Quotations List Table */}
        <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Quotation ID</th>
                  <th>Customer Name</th>
                  <th>Quote Date</th>
                  <th>Valid Till</th>
                  <th>Grand Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map(q => (
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
                ))}
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
        </div>

        {/* Detailed Quotation TAX INVOICE styled Print View */}
        {selectedQuotation && selectedQuotationDetail && (
          <div className="card-panel" style={{ padding: 24, background: '#ffffff', color: '#111827', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.2s ease-out', position: 'relative' }}>

            {/* Close details button */}
            <button
              onClick={() => { setSelectedQuotation(null); setSelectedQuotationDetail(null); }}
              style={{ position: 'absolute', top: 12, right: 12, background: '#f3f4f6', border: 'none', borderRadius: '50%', color: '#374151', cursor: 'pointer', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ×
            </button>

            {/* TOP HEADER SECTION */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: 14 }}>
              {/* Logo & Company info */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <svg viewBox="0 0 100 100" style={{ width: 42, height: 42, borderRadius: 6, display: 'inline-block' }}>
                  <rect width="100" height="100" fill="#000000" rx="12" />
                  <circle cx="50" cy="50" r="36" fill="#FFDD00" />
                  <polygon points="50,50 86,14 100,14 100,86 86,86" fill="#000000" />
                  <line x1="24" y1="76" x2="50" y2="50" stroke="#000000" strokeWidth="5.5" strokeLinecap="round" />
                </svg>
                <div style={{ fontSize: 10, color: '#4b5563', lineHeight: 1.3 }}>
                  <h4 style={{ color: '#111827', fontWeight: 800, fontSize: 13, marginBottom: 4, letterSpacing: '0.02em' }}>{companyDetails.name}</h4>
                  <p>{companyDetails.address}</p>
                  <p>Tel: {companyDetails.phone}</p>
                  <p>Email: {companyDetails.email}</p>
                  <p>{companyDetails.website}</p>
                </div>
              </div>

              {/* Quotation Identity details */}
              <div style={{ textAlign: 'right', fontSize: 11, color: '#4b5563', lineHeight: 1.4 }}>
                <h3 style={{ color: '#111827', fontWeight: 800, fontSize: 14, margin: '0 0 6px 0', letterSpacing: '0.03em' }}>PROPOSAL / QUOTATION</h3>
                <p><span style={{ color: '#6b7280' }}>Reference Code</span> &nbsp;&nbsp; {selectedQuotationDetail.name}</p>
                <p><span style={{ color: '#6b7280' }}>Date Issued</span> &nbsp;&nbsp; {selectedQuotationDetail.transaction_date}</p>
                <p><span style={{ color: '#6b7280' }}>Valid Until</span> &nbsp;&nbsp; {selectedQuotationDetail.valid_till}</p>
                <p style={{ marginTop: 6 }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 10,
                    fontSize: 9,
                    fontWeight: 700,
                    backgroundColor: selectedQuotationDetail.status === 'Submitted' ? '#d1fae5' : selectedQuotationDetail.status === 'Cancelled' ? '#fee2e2' : '#fef3c7',
                    color: selectedQuotationDetail.status === 'Submitted' ? '#065f46' : selectedQuotationDetail.status === 'Cancelled' ? '#991b1b' : '#92400e'
                  }}>
                    {selectedQuotationDetail.status.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>

            {/* BILL TO / CUSTOMER INFO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 10, paddingBottom: 6 }}>
              <div>
                <span style={{ color: '#6b7280', textTransform: 'uppercase', display: 'block', fontWeight: 700, fontSize: 9, marginBottom: 4 }}>PROPOSED TO</span>
                <strong style={{ fontSize: 11, color: '#111827', display: 'block' }}>{selectedQuotationDetail.customer_name}</strong>
                <p style={{ color: '#4b5563', lineHeight: 1.3, marginTop: 2 }}>{customerAddress}</p>
                <p style={{ color: '#4b5563', fontSize: 9, marginTop: 4 }}>Contact: {customerContact}</p>
              </div>
              <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 9, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ color: '#6b7280', fontWeight: 700 }}>ESTIMATED BOOKING PERIOD</span>
                <div>Start: <strong style={{ color: '#111827' }}>{selectedQuotationDetail.custom_start_date || 'N/A'}</strong></div>
                <div>End: <strong style={{ color: '#111827' }}>{selectedQuotationDetail.custom_end_date || 'N/A'}</strong></div>
              </div>
            </div>

            {/* QUOTATION ITEMS TABLE */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#1f2937', color: '#ffffff', borderBottom: '1px solid #374151' }}>
                    <th style={{ padding: '8px 10px', color: '#ffffff' }}>Item Name</th>
                    <th style={{ padding: '8px 10px', color: '#ffffff' }}>Qty</th>
                    <th style={{ padding: '8px 10px', color: '#ffffff' }}>UOM</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: '#ffffff' }}>Standard Rate ({companyDetails.currency})</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: '#ffffff' }}>Offered Rate ({companyDetails.currency})</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: '#ffffff' }}>Amount ({companyDetails.currency})</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedQuotationDetail.items || []).map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '8px 10px', color: '#374151', fontWeight: 600 }}>{item.item_name || item.item_code}</td>
                      <td style={{ padding: '8px 10px', color: '#4b5563' }}>{item.qty}</td>
                      <td style={{ padding: '8px 10px', color: '#4b5563' }}>{item.uom || 'Month'}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: '#4b5563' }}>${(item.price_list_rate || item.rate || 0).toLocaleString()}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: '#111827', fontWeight: 600 }}>${(item.rate || 0).toLocaleString()}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: '#111827', fontWeight: 600 }}>
                        ${((item.qty || 1) * (item.rate || 0)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TOTALS & SUMMARY */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: 10 }}>
              <div style={{ width: '50%', fontSize: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                  <span>Subtotal</span>
                  <span>${(selectedQuotationDetail.grand_total || 0).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#111827', fontWeight: 700, fontSize: 12, borderTop: '1px solid #e5e7eb', paddingTop: 6 }}>
                  <span>Grand Total ({companyDetails.currency})</span>
                  <span>${(selectedQuotationDetail.grand_total || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* DYNAMIC ACTION BUTTONS */}
            {
              quotations.find(q => q.name === selectedQuotation?.name)?.workflow_state != "Request For Approval" ||
              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>

                <button
                  // type="button"
                  // className="btn btn-primary"
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444', background: 'transparent' }}
                  // style={{ flex: 1 }}
                  onClick={() => handelaction(selectedQuotation, 0)}
                >
                  Cancel Quotation
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => handelaction(selectedQuotation, 1)}
                >
                  Approve Quotation
                </button>

              </div>
            }
            <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
              {/* <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                onClick={() => onGoToBooking && onGoToBooking(selectedQuotationDetail)}
              >
                Go to Booking <ArrowUpRight size={14} />
              </button> */}
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                onClick={() => onGoToBooking && onGoToBooking(selectedQuotationDetail)}
              >
                Go to Booking <ArrowUpRight size={14} />
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                onClick={() => {
                  if (selectedQuotationDetail?.status === 'Cancelled') {
                    showToast('error', 'Not allowed to print cancelled documents');
                    return;
                  }
                  if (erpnextConfig?.url && selectedQuotationDetail?.name) {
                    // Open the print page without trigger_print=1 so we control print behavior and styles
                    const printUrl = `${erpnextConfig.url}/printview?doctype=Quotation&name=${encodeURIComponent(selectedQuotationDetail.name)}&format=PMS%20Offer%20Letter&no_letterhead=1&letterhead=No%20Letterhead&settings=%7B%7D&_lang=en`;
                    const printWindow = window.open(printUrl, '_blank');

                    if (printWindow) {
                      const injectAndPrint = () => {
                        try {
                          const doc = printWindow.document;
                          if (doc) {
                            // Set title to empty to prevent browser from printing document title ("TrueValue" etc.)
                            doc.title = "";

                            if (doc.head) {
                              if (doc.getElementById('pms-custom-print-style')) return;

                              const style = doc.createElement('style');
                              style.id = 'pms-custom-print-style';
                              style.innerHTML = `
                                /* Hide Frappe print view action banner containing Print / Get PDF */
                                .action-banner {
                                  display: none !important;
                                }
                                
                                /* Remove default browser print headers and footers globally */
                                @page {
                                  size: auto;
                                  margin: 0mm;
                                }
                                
                                /* Remove default browser print headers and footers within print media */
                                @media print {
                                  @page {
                                    size: auto;
                                    margin: 0mm;
                                  }
                                  body {
                                    margin: 15mm !important;
                                    padding: 0px !important;
                                  }
                                  .action-banner, header, footer {
                                    display: none !important;
                                  }
                                }
                              `;
                              doc.head.appendChild(style);

                              // Delay slightly to ensure CSS and title updates are applied before printing
                              setTimeout(() => {
                                printWindow.print();
                              }, 500);
                            }
                          }
                        } catch (e) {
                          console.warn("Unable to customize print style:", e);
                        }
                      };

                      // Run onload if possible
                      printWindow.onload = injectAndPrint;

                      // Fallback polling for loaded document
                      let attempts = 0;
                      const checkInterval = setInterval(() => {
                        attempts++;
                        if (printWindow.closed || attempts > 80) { // 8 seconds timeout
                          clearInterval(checkInterval);
                          return;
                        }
                        try {
                          if (printWindow.document && printWindow.document.readyState === 'complete') {
                            clearInterval(checkInterval);
                            injectAndPrint();
                          }
                        } catch (err) {
                          // Ignore cross-origin errors during transitions
                        }
                      }, 100);
                    }
                  }
                }}
              >
                Print <Printer size={14} />
              </button>
            </div>

          </div>
        )}
      </div>


      {/* </div> */}

      {/* Create Quotation Modal */}
      {
        showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: 980, width: '96vw', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

              {/* Header */}
              <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Create New Quotation</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 0 }}
                >×</button>
              </div>

              <form onSubmit={handleCreateQuotation} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '20px', overflowY: 'auto', flex: 1 }}>

                  {/* Error */}
                  {errorMsg && (
                    <div style={{ color: 'var(--color-danger)', background: 'rgba(239,68,68,0.1)', padding: '10px 12px', borderRadius: 6, fontSize: 12 }}>
                      {errorMsg}
                    </div>
                  )}

                  {/* Top fields — 2 columns, 2 rows */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <label className="form-label" style={{ fontSize: 12, fontWeight: 500 }}>Customer Name</label>
                      <select
                        value={quoteCustomer}
                        onChange={(e) => setQuoteCustomer(e.target.value)}
                        className="form-select"
                        required
                        disabled={submitting}
                        style={{ fontSize: 13 }}
                      >
                        <option value="">-- Choose Customer --</option>
                        {customers.map(c => (
                          <option key={c.name} value={c.name}>{c.customer_name || c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <label className="form-label" style={{ fontSize: 12, fontWeight: 500 }}>Template</label>
                      <select
                        value={quotetamplate}
                        onChange={(e) => setQuotetamplate(e.target.value)}
                        className="form-select"
                        required
                        disabled={submitting}
                        style={{ fontSize: 13 }}
                      >
                        <option value="">-- Choose Template --</option>
                        {tamplates.map(c => (
                          <option key={c.name} value={c.name}>{c.customer_name || c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <label className="form-label" style={{ fontSize: 12, fontWeight: 500 }}>Start Date</label>
                      <input
                        type="date"
                        value={quoteEstBookingStart}
                        onChange={(e) => setQuoteEstBookingStart(e.target.value)}
                        className="form-input"
                        required
                        disabled={submitting}
                        style={{ fontSize: 13 }}
                      />
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <label className="form-label" style={{ fontSize: 12, fontWeight: 500 }}>End Date</label>
                      <input
                        type="date"
                        value={quoteEstBookingEnd}
                        onChange={(e) => setQuoteEstBookingEnd(e.target.value)}
                        className="form-input"
                        required
                        disabled={submitting}
                        style={{ fontSize: 13 }}
                      />
                    </div>
                  </div>

                  {/* Selected Units table */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <label className="form-label" style={{ margin: 0, fontSize: 12, fontWeight: 500 }}>Selected Units</label>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={addQuoteItem}
                        style={{ padding: '4px 10px', fontSize: 11 }}
                      >
                        + Add Row
                      </button>
                    </div>

                    <div style={{ border: '1px solid var(--border-color)', borderRadius: 6, overflow: 'hidden' }}>
                      <div style={{ overflowX: 'auto', maxHeight: 260, overflowY: 'auto' }}>
                        <table style={{ width: '100%', minWidth: 860, borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: 11 }}>
                          <colgroup>
                            <col style={{ width: 32 }} />
                            <col style={{ width: 150 }} />
                            <col style={{ width: 52 }} />
                            <col style={{ width: 52 }} />
                            <col style={{ width: 80 }} />
                            <col style={{ width: 88 }} />
                            <col style={{ width: 110 }} />
                            <col style={{ width: 90 }} />
                            <col style={{ width: 80 }} />
                            <col style={{ width: 72 }} />
                            <col style={{ width: 80 }} />
                            <col style={{ width: 32 }} />
                          </colgroup>
                          <thead>
                            <tr style={{ background: 'var(--color-bg-secondary, rgba(255,255,255,0.05))', position: 'sticky', top: 0, zIndex: 1 }}>
                              {['#', 'Unit Code', 'Qty', 'UOM', 'Val. Rate', 'Offered Rate', 'Property Group', 'Locality', 'District', 'Total Area', 'Amount', ''].map((h, i) => (
                                <th
                                  key={i}
                                  style={{
                                    padding: '7px 8px',
                                    textAlign: i === 10 ? 'right' : 'left',
                                    fontWeight: 500,
                                    fontSize: 11,
                                    color: 'var(--color-text-muted, #9ca3af)',
                                    borderBottom: '1px solid var(--border-color)',
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
                              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>

                                {/* # */}
                                <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)' }}>{idx + 1}</td>

                                {/* Unit Code */}
                                <td style={{ padding: '4px 6px' }}>
                                  <select
                                    value={item.unitId}
                                    onChange={(e) => handleItemChange(idx, e.target.value)}
                                    className="form-select"
                                    style={{ width: '100%', fontSize: 11, minHeight: 32, padding: '5px 6px', boxSizing: 'border-box', lineHeight: '1.4' }}
                                    required
                                  >
                                    <option value="">-- Choose Unit --</option>
                                    {spaceUnits.map(unit => (
                                      <option key={unit.name} value={unit.name}>{unit.item_name || unit.name}</option>
                                    ))}
                                  </select>
                                </td>

                                {/* Qty */}
                                <td style={{ padding: '4px 6px' }}>
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.qty}
                                    onChange={(e) => handleQtyOrRateChange(idx, 'qty', e.target.value)}
                                    className="form-input"
                                    style={{ width: '100%', fontSize: 11, minHeight: 32, padding: '5px 6px', boxSizing: 'border-box', lineHeight: '1.4' }}
                                    required
                                  />
                                </td>

                                {/* UOM */}
                                <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)' }}>
                                  {item.loadingDetail ? '…' : (item.uom || '—')}
                                </td>

                                {/* Val. Rate */}
                                <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)' }}>
                                  {item.loadingDetail ? '…' : (item.standardRate ? `$${item.standardRate}` : '—')}
                                </td>

                                {/* Offered Rate */}
                                <td style={{ padding: '4px 6px' }}>
                                  <input
                                    type="number"
                                    value={item.offeredRate}
                                    onChange={(e) => handleQtyOrRateChange(idx, 'offeredRate', e.target.value)}
                                    className="form-input"
                                    style={{ width: '100%', fontSize: 11, minHeight: 32, padding: '5px 6px', boxSizing: 'border-box', lineHeight: '1.4' }}
                                    required
                                  />
                                </td>

                                {/* Property Group */}
                                <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {item.loadingDetail ? '…' : (item.propertyGroup || '—')}
                                </td>

                                {/* Locality */}
                                <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {item.loadingDetail ? '…' : (item.locality || '—')}
                                </td>

                                {/* District */}
                                <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {item.loadingDetail ? '…' : (item.district || '—')}
                                </td>

                                {/* Total Area */}
                                <td style={{ padding: '6px 8px', color: 'var(--color-text-muted, #9ca3af)', textAlign: 'right' }}>
                                  {item.loadingDetail ? '…' : (item.totalArea || '—')}
                                </td>

                                {/* Amount */}
                                <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600 }}>
                                  ${((parseFloat(item.qty) || 1) * (parseFloat(item.offeredRate) || 0)).toLocaleString()}
                                </td>

                                {/* Delete */}
                                <td style={{ padding: '4px 4px', textAlign: 'center' }}>
                                  {quoteItems.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeQuoteItem(idx)}
                                      style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center' }}
                                    >
                                      <Trash size={13} />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Grand total footer */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, padding: '8px 12px', borderTop: '1px solid var(--border-color)', background: 'var(--color-bg-secondary, rgba(255,255,255,0.03))' }}>
                        <span style={{ fontSize: 11, color: 'var(--color-text-muted, #9ca3af)' }}>Grand Total</span>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>
                          ${quoteItems.reduce((sum, item) => sum + ((parseFloat(item.qty) || 1) * (parseFloat(item.offeredRate) || 0)), 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer */}
                <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 20px', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)} disabled={submitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Submit Quotation'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )
      }
    </div >
  );
}