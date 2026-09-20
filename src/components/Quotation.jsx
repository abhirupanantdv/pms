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
import { FileText, Plus, X, Search, CheckCircle2, AlertCircle, Edit, Trash2, Calendar, User, Building, Trash, Printer, ArrowUpRight, Check, RotateCcw, Zap, Home, Send, XCircle, Layers, Bookmark, GitBranch, Upload, Eye, ExternalLink, Loader2 } from 'lucide-react';
import houseImg from '../assets/new-house.png';

const resolveMediaUrl = (url, baseUrl) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const base = baseUrl ? baseUrl.replace(/\/+$/, '') : '';
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
};

const isImageDoc = (url) => {
  if (!url) return false;
  if (url.startsWith('data:image/')) return true;
  const cleanUrl = url.split('?')[0].toLowerCase();
  return cleanUrl.endsWith('.png') || cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg') || cleanUrl.endsWith('.webp') || cleanUrl.endsWith('.svg') || cleanUrl.endsWith('.gif');
};

const isPdfDoc = (url) => {
  if (!url) return false;
  if (url.startsWith('data:application/pdf')) return true;
  const cleanUrl = url.split('?')[0].toLowerCase();
  return cleanUrl.endsWith('.pdf');
};

const getDocFileName = (url) => {
  if (!url) return '';
  if (url.startsWith('data:')) return 'Signed_Document';
  const name = url.split('/').pop() || 'Signed_Document';
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
};

const getCsrfToken = () => {
  if (typeof window !== 'undefined') {
    if (window.csrf_token && window.csrf_token !== 'None' && window.csrf_token !== 'null') {
      return String(window.csrf_token).trim();
    }
    if (window.frappe?.csrf_token && window.frappe.csrf_token !== 'None' && window.frappe.csrf_token !== 'null') {
      return String(window.frappe.csrf_token).trim();
    }
    const match = document.cookie.match(/(?:^|;\s*)(?:csrf_token|XSRF-TOKEN|CSRF-TOKEN)=([^;]*)/i);
    if (match && match[1]) {
      const decoded = decodeURIComponent(match[1]).trim();
      if (decoded && decoded !== 'None' && decoded !== 'null') return decoded;
    }
  }
  return '';
};

const getQuotationHeaders = (extra = {}) => {
  const h = { 'Content-Type': 'application/json', ...extra };
  const token = getCsrfToken();
  if (token) {
    h['X-Frappe-CSRF-Token'] = token;
  }
  return h;
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

  // Date Helpers for Quotations
  const formatDateToYMD = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const calcNextDay = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return '';
    const [y, m, d] = parts.map(Number);
    const dt = new Date(y, m - 1, d);
    if (isNaN(dt.getTime())) return '';
    dt.setDate(dt.getDate() + 1);
    return formatDateToYMD(dt);
  };

  const calcOneYearLater = (startDateStr) => {
    if (!startDateStr) return '';
    const parts = startDateStr.split('-');
    if (parts.length !== 3) return '';
    const [y, m, d] = parts.map(Number);
    const dt = new Date(y, m - 1, d);
    if (isNaN(dt.getTime())) return '';
    dt.setFullYear(dt.getFullYear() + 1);
    return formatDateToYMD(dt);
  };

  // Form states
  const [quoteCustomer, setQuoteCustomer] = useState('');
  const [quotetamplate, setQuotetamplate] = useState('');
  const [quoteCompany, setQuoteCompany] = useState('CARPENTERS PROPERTIES PTE LIMITED');
  const [defaultValidityDays, setDefaultValidityDays] = useState(7);

  const [quoteValidTill, setQuoteValidTill] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return formatDateToYMD(d);
  });

  const [quoteEstBookingStart, setQuoteEstBookingStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7 + 1); // Start Date always starts from next date of valid till (only for new quotation)
    return formatDateToYMD(d);
  });
  const [quoteEstBookingEnd, setQuoteEstBookingEnd] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7 + 1);
    d.setFullYear(d.getFullYear() + 1);
    return formatDateToYMD(d);
  });

  const handleValidTillChange = (val) => {
    setQuoteValidTill(val);
    if (val) {
      const nextDay = calcNextDay(val);
      setQuoteEstBookingStart(nextDay);
      const nextEnd = calcOneYearLater(nextDay);
      setQuoteEstBookingEnd(nextEnd);
    }
  };

  const handleStartDateChange = (newStart) => {
    setQuoteEstBookingStart(newStart);
    if (newStart) {
      const oneYear = calcOneYearLater(newStart);
      if (!quoteEstBookingEnd || new Date(quoteEstBookingEnd) < new Date(oneYear)) {
        setQuoteEstBookingEnd(oneYear);
      }
    }
  };
  const [quoteStatus, setQuoteStatus] = useState('Draft');
  const [quoteItems, setQuoteItems] = useState([{ unitId: '', qty: 1, uom: 'Sq Ft', stock_uom: 'Sq Ft', standardRate: '', offeredRate: '', propertyGroup: '', locality: '', district: '', totalArea: '', carpetArea: 0, item_group: 'Commercial', loadingDetail: false }]);
  const [defaultServiceItems, setDefaultServiceItems] = useState([]);
  const [creatingBooking, setCreatingBooking] = useState(false);
  const [creatingBookingId, setCreatingBookingId] = useState(null);
  const [uploadingSignedDoc, setUploadingSignedDoc] = useState(false);
  const [previewModalDoc, setPreviewModalDoc] = useState(null);
  const signedDocInputRef = useRef(null);
  const [discountAmount, setDiscountAmount] = useState('');
  const [messageText, setMessageText] = useState('');
  const [savingDiscount, setSavingDiscount] = useState(false);

  // New Version Modal States
  const [showNewVersionModal, setShowNewVersionModal] = useState(false);
  const [versionTargetQuotation, setVersionTargetQuotation] = useState(null);
  const [versionItems, setVersionItems] = useState([]);
  const [versionNote, setVersionNote] = useState('');
  const [versionSubmitting, setVersionSubmitting] = useState(false);
  const [versionStartDate, setVersionStartDate] = useState('');
  const [versionEndDate, setVersionEndDate] = useState('');

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
          if (doc.name) {
            setQuoteCompany(doc.name);
          }

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

  // Fetch ALL Space Units (Items) — Commercial units with their area specs
  const fetchSpaceUnits = async () => {
    if (!erpnextConfig || !erpnextConfig.url) return;
    try {
      const filters = encodeURIComponent(JSON.stringify([["item_group", "=", "Commercial"]]));
      const url = `${erpnextConfig.url}/api/resource/Item?fields=["name","item_name","standard_rate","valuation_rate","custom_property_group","custom_property_reference","stock_uom","custom_floor","item_group","custom_7average_carpet_area_of_units"]&filters=${filters}&limit_page_length=500`;
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

  // Fetch Default Service Items from ERPNext (item_group: "Services", custom_service_group: "Default Service", disabled: 0)
  const fetchDefaultServices = async () => {
    if (!erpnextConfig || !erpnextConfig.url) return [];
    try {
      const filters = encodeURIComponent(JSON.stringify([
        ["item_group", "=", "Services"],
        ["custom_service_group", "=", "Default Service"],
        ["disabled", "=", 0]
      ]));
      const fields = encodeURIComponent(JSON.stringify(["name", "item_name", "charges", "standard_rate", "item_group", "stock_uom"]));
      const url = `${erpnextConfig.url}/api/resource/Item?filters=${filters}&fields=${fields}&limit_page_length=0`;
      const res = await fetch(url, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        const items = json.data || [];
        setDefaultServiceItems(items);
        return items;
      }
    } catch (e) {
      console.warn('Failed fetching default service items:', e);
    }
    return [];
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
    if (!unitId) return;
    const isAlreadyAdded = quoteItems.some(it => it.unitId === unitId);
    if (isAlreadyAdded) {
      showToast('error', `Unit "${unitId}" has already been added to this quotation.`);
      showAlert('Duplicate Unit', `Unit "${unitId}" has already been added. The same unit cannot be added twice.`);
      return;
    }
    const listMatch = spaceUnits.find(u => u.name === unitId);
    const valRate = listMatch ? (listMatch.valuation_rate || listMatch.standard_rate || 0) : 0;
    const initialCarpetArea = listMatch ? parseFloat(listMatch.custom_7average_carpet_area_of_units || 0) : 0;

    const newRow = {
      unitId,
      qty: 1,
      standardRate: valRate,
      offeredRate: valRate,
      uom: listMatch ? (listMatch.stock_uom || 'Sq Ft') : 'Sq Ft',
      stock_uom: listMatch ? (listMatch.stock_uom || 'Sq Ft') : 'Sq Ft',
      propertyGroup: listMatch
        ? (typeof listMatch.custom_property_group === 'string'
          ? listMatch.custom_property_group
          : (typeof listMatch.custom_property_reference === 'string'
            ? listMatch.custom_property_reference
            : ''))
        : '',
      locality: '',
      district: '',
      totalArea: initialCarpetArea > 0 ? `${initialCarpetArea} sqft` : '',
      carpetArea: initialCarpetArea,
      item_group: listMatch?.item_group || 'Commercial',
      loadingDetail: true
    };

    let updatedRows = [];
    if (quoteItems.length === 1 && quoteItems[0].unitId === '') {
      updatedRows = [newRow];
    } else {
      updatedRows = [...quoteItems, newRow];
    }
    setQuoteItems(updatedRows);

    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Item/${encodeURIComponent(unitId)}`, {
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

        const carpetAreaVal = parseFloat(
          doc.custom_7average_carpet_area_of_units !== undefined && doc.custom_7average_carpet_area_of_units !== null && doc.custom_7average_carpet_area_of_units !== ''
            ? doc.custom_7average_carpet_area_of_units
            : (initialCarpetArea || 0)
        );
        const itemGroupVal = doc.item_group || listMatch?.item_group || 'Commercial';

        setQuoteItems(prev => {
          const currentList = prev.map(item => {
            if (item.unitId === unitId) {
              return {
                ...item,
                propertyGroup: findVal(['custom_property_group', 'custom_property_reference', 'property_group', 'property']) || item.propertyGroup,
                locality: findVal(['locality']),
                district: findVal(['district']),
                totalArea: carpetAreaVal > 0 ? `${carpetAreaVal} sqft` : (findVal(['total_area', 'area_sqft', 'area']) || '—'),
                carpetArea: carpetAreaVal,
                item_group: itemGroupVal,
                loadingDetail: false
              };
            }
            return item;
          });
          syncDefaultServices(currentList).then(synced => setQuoteItems(synced));
          return currentList;
        });
      } else {
        setQuoteItems(prev => {
          const currentList = prev.map(item => item.unitId === unitId ? { ...item, loadingDetail: false } : item);
          syncDefaultServices(currentList).then(synced => setQuoteItems(synced));
          return currentList;
        });
      }
    } catch (e) {
      setQuoteItems(prev => {
        const currentList = prev.map(item => item.unitId === unitId ? { ...item, loadingDetail: false } : item);
        syncDefaultServices(currentList).then(synced => setQuoteItems(synced));
        return currentList;
      });
    }
  };

  // Helper to identify Commercial Unit rows in Quotation items child table
  const isCommercialItem = (item) => {
    if (!item) return false;
    if (item.isDefaultService) return false;
    if (item.item_group && item.item_group.toLowerCase() === 'commercial') return true;
    if (item.item_group && item.item_group.toLowerCase() !== 'commercial') return false;
    if (spaceUnits.some(u => u.name === item.item_code || u.item_code === item.item_code)) return true;
    const nameLower = (item.item_name || item.item_code || '').toLowerCase();
    const isOther = nameLower.match(/fee|charge|service|deposit|tax|promo|discount/);
    return !isOther;
  };

  // Helper to extract root quotation name (e.g. 'QTN-09-00295' from 'QTN-09-00295-1')
  const getRootQuotationName = (qName, doc) => {
    if (doc && doc.amended_from) {
      let current = doc.amended_from;
      const parts = current.split('-');
      if (parts.length > 3 && !isNaN(parseInt(parts[parts.length - 1], 10)) && parts[parts.length - 1].length <= 3) {
        return parts.slice(0, -1).join('-');
      }
      return current;
    }
    if (!qName) return '';
    const parts = qName.split('-');
    if (parts.length > 3 && !isNaN(parseInt(parts[parts.length - 1], 10)) && parts[parts.length - 1].length <= 3) {
      return parts.slice(0, -1).join('-');
    }
    return qName;
  };

  // Helper to get version number and amendment status
  const getQuotationVersionInfo = (qName, rootName) => {
    if (!qName) return { version_no: 1, isAmendment: false };
    const rName = rootName || getRootQuotationName(qName);
    if (qName === rName) return { version_no: 1, isAmendment: false };
    const parts = qName.split('-');
    if (parts.length > 3) {
      const lastNum = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(lastNum)) {
        return { version_no: lastNum + 1, isAmendment: true };
      }
    }
    return { version_no: 1, isAmendment: false };
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
      const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation?fields=["name","customer_name","party_name","transaction_date","valid_till","grand_total","status","workflow_state","booking_id","docstatus","signed_document"]&limit_page_length=100&order_by=creation desc`, {
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

  // Fetch default validity days from ERPNext Selling Settings or Quotation doctype
  const fetchDefaultValidity = async () => {
    if (!erpnextConfig || !erpnextConfig.url) return;
    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Selling%20Settings/Selling%20Settings`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const json = await res.json();
        const days = json?.data?.default_valid_till;
        if (days && Number(days) > 0) {
          const numDays = Number(days);
          setDefaultValidityDays(numDays);
          const today = new Date();
          const validDate = new Date(today);
          validDate.setDate(validDate.getDate() + numDays);
          const validStr = formatDateToYMD(validDate);
          const startStr = calcNextDay(validStr);
          const endStr = calcOneYearLater(startStr);
          setQuoteValidTill(validStr);
          setQuoteEstBookingStart(startStr);
          setQuoteEstBookingEnd(endStr);
        }
      }
    } catch (e) {
      console.warn('Could not fetch Selling Settings default_valid_till (fallback to 7 days):', e);
    }
  };

  useEffect(() => {
    fetchQuotations();
    fetchCustomersList();
    fetchtamplateList();
    fetchSpaceUnits();
    fetchDefaultServices();
    fetchPropertyGroups();
    fetchCountries();
    fetchDefaultValidity();
  }, [erpnextConfig]);

  useEffect(() => {
    if (selectedQuotationDetail) {
      const commercialItem = (selectedQuotationDetail.items || []).find(isCommercialItem);
      const existingDiscount = (commercialItem && commercialItem.discount_amount !== undefined && commercialItem.discount_amount !== null && commercialItem.discount_amount !== '')
        ? commercialItem.discount_amount
        : (selectedQuotationDetail.discount_amount || 0);

      setDiscountAmount(existingDiscount !== undefined && existingDiscount !== null && existingDiscount !== '' ? String(existingDiscount) : '0');
      setMessageText('');
    } else {
      setDiscountAmount('');
      setMessageText('');
      setWorkflowActions(null);
    }
  }, [selectedQuotationDetail]);

  // Handle detailed Quotation view & retrieve client CRM metadata
  const fetchQuotationDetail = async (qName, customerId, preferLatest = false) => {
    if (!erpnextConfig || !erpnextConfig.url) return;
    setNegotiations([]);
    setComments([]);
    setWorkflowActions(null);

    const parseNegotiationFromComment = (commentText) => {
      if (!commentText) return null;

      const decoded = commentText
        .replace(/<br\s*[\/]?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<\/div>/gi, '\n')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
      const stripped = decoded.replace(/<[^>]*>?/gm, ' ').trim();

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
          if (k === key) continue;
          const kIndex = stripped.indexOf(k, startPos);
          if (kIndex !== -1 && kIndex < endPos) {
            endPos = kIndex;
          }
        }
        return stripped.substring(startPos, endPos).trim();
      };

      const totalVerRaw = getValue('Total Versions:');
      const currVerRaw = getValue('Current Version:');
      const verNo = parseInt(totalVerRaw, 10) || parseInt(currVerRaw, 10) || 1;
      const qtnName = getValue('Quotation:') || qName;
      return {
        name: `${qtnName}-v${verNo}`,
        version_no: verNo,
        total_versions: parseInt(totalVerRaw, 10) || verNo,
        negotiation_date: getValue('Negotiation Date:'),
        negotiation_by: getValue('Negotiated By:'),
        current_discount: parseFloat(getValue('Current Discount:')) || 0,
        current_grand_total: parseFloat(getValue('Current Grand Total:')) || 0,
        previous_discount: parseFloat(getValue('Previous Discount:')) || 0,
        previous_grand_total: parseFloat(getValue('Previous Grand Total:')) || 0,
        discount_difference: parseFloat(getValue('Discount Difference:')) || 0,
        discount_percentage: getValue('Discount Percentage:') || 0,
        negotiation_status: getValue('Negotiation Status:') || 'Quotation Created'
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
        if (!preferLatest) {
          setSelectedQuotationDetail(doc);
        }

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

        // 1. Resolve root quotation name (e.g. 'QTN-09-00295' from 'QTN-09-00295-1')
        const rootName = getRootQuotationName(qName, doc);

        // 2. Fetch all quotation versions in this family from ERPNext
        let detailedVersions = [doc];
        try {
          let versionList = [];
          if (erpnextConfig && erpnextConfig.url) {
            const verRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation?filters=[["name", "like", "${rootName}%"]]&fields=["name","customer_name","party_name","transaction_date","creation","modified","owner","modified_by","status","workflow_state","discount_amount","total","net_total","grand_total","docstatus","amended_from","custom_last_negotiated_by","custom_last_negotiation_date"]&order_by=creation asc&limit_page_length=50`, {
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }
            });
            if (verRes.ok) {
              const verJson = await verRes.json();
              const rawList = verJson.data || [];
              versionList = rawList.filter(v => v.name === rootName || v.name.startsWith(`${rootName}-`) || v.amended_from === rootName);
            }
          }

          // Fallback / supplement from local quotations list
          if (quotations && quotations.length > 0) {
            const localMatches = quotations.filter(q => q.name === rootName || q.name.startsWith(`${rootName}-`) || q.amended_from === rootName);
            localMatches.forEach(l => {
              if (!versionList.some(v => v.name === l.name)) {
                versionList.push(l);
              }
            });
          }

          if (!versionList.some(v => v.name === qName)) {
            versionList.push(doc);
          }

          // Sort in ascending order of version number
          versionList.sort((a, b) => {
            const vA = getQuotationVersionInfo(a.name, rootName).version_no;
            const vB = getQuotationVersionInfo(b.name, rootName).version_no;
            return vA - vB;
          });

          // Fetch items child table for other versions so comparison has complete data
          if (erpnextConfig && erpnextConfig.url && versionList.length > 1) {
            detailedVersions = await Promise.all(versionList.map(async (v) => {
              if (v.name === qName) return doc;
              try {
                const vRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${v.name}`, {
                  credentials: 'include',
                  headers: { 'Content-Type': 'application/json' }
                });
                if (vRes.ok) {
                  const vJson = await vRes.json();
                  return vJson.data || vJson;
                }
              } catch (_) {}
              return v;
            }));
          } else {
            detailedVersions = versionList.length > 0 ? versionList : [doc];
          }
        } catch (vErr) {
          console.warn('Failed fetching quotation versions:', vErr);
          detailedVersions = [doc];
        }

        // Sort detailedVersions ascending by version_no
        detailedVersions.sort((a, b) => {
          const vA = getQuotationVersionInfo(a.name, rootName).version_no;
          const vB = getQuotationVersionInfo(b.name, rootName).version_no;
          return vA - vB;
        });

        // 3. Resolve active document (if preferLatest enabled and multiple versions exist, select the last version)
        let activeDoc = doc;
        let activeName = qName;
        if (preferLatest && detailedVersions.length > 1) {
          const lastDoc = detailedVersions[detailedVersions.length - 1];
          if (lastDoc) {
            activeDoc = lastDoc;
            activeName = lastDoc.name;
            if (activeName !== qName) {
              setSelectedQuotation(prev => (prev ? { ...prev, ...lastDoc } : lastDoc));
              const latestVInfo = getQuotationVersionInfo(activeName, rootName);
              showToast('info', `Showing latest version V${latestVInfo.version_no} (${activeName})`);
            }
          }
        }
        setSelectedQuotationDetail(activeDoc);

        // 4. Build version history / negotiations array from actual quotation documents
        const parsedNegotiations = detailedVersions.map((vDoc, index) => {
          const vInfo = getQuotationVersionInfo(vDoc.name, rootName);
          const commItem = (vDoc.items || []).find(isCommercialItem);
          const itemDisc = commItem && commItem.discount_amount !== undefined ? parseFloat(commItem.discount_amount) : 0;
          const docDisc = parseFloat(vDoc.discount_amount) || 0;
          const discAmount = itemDisc > 0 ? itemDisc : docDisc;

          // Previous version for diff calculation
          const prevDoc = index > 0 ? detailedVersions[index - 1] : null;
          const prevGrandTotal = prevDoc ? parseFloat(prevDoc.grand_total || 0) : parseFloat(vDoc.grand_total || 0);
          const prevCommItem = prevDoc ? (prevDoc.items || []).find(isCommercialItem) : null;
          const prevItemDisc = prevCommItem && prevCommItem.discount_amount !== undefined ? parseFloat(prevCommItem.discount_amount) : 0;
          const prevDocDisc = prevDoc ? (parseFloat(prevDoc.discount_amount) || 0) : 0;
          const prevDisc = prevItemDisc > 0 ? prevItemDisc : prevDocDisc;

          // Calculate total price list rate for commercial items
          const commItems = (vDoc.items || []).filter(isCommercialItem);
          const targetCommItems = commItems.length > 0 ? commItems : (vDoc.items || []);
          const vPriceListRate = targetCommItems.reduce((acc, it) => {
            const itQty = parseFloat(it.qty) || 1;
            const itDisc = parseFloat(it.discount_amount) || 0;
            const itRate = parseFloat(it.price_list_rate) || ((parseFloat(it.rate) || 0) + (itDisc / itQty));
            return acc + (itRate * itQty);
          }, 0) || parseFloat(vDoc.total || vDoc.grand_total || 0);

          return {
            name: vDoc.name,
            version_no: vInfo.version_no,
            total_versions: detailedVersions.length,
            is_current: vDoc.name === activeName,
            negotiation_date: vDoc.custom_last_negotiation_date || vDoc.transaction_date || (vDoc.creation ? vDoc.creation.split(' ')[0] : '—'),
            negotiation_by: vDoc.custom_last_negotiated_by || vDoc.owner || vDoc.modified_by || 'Sales Team',
            price_list_rate: vPriceListRate,
            current_discount: discAmount,
            current_grand_total: parseFloat(vDoc.grand_total || 0),
            current_net_total: parseFloat(vDoc.net_total || vDoc.total || 0),
            previous_discount: prevDisc,
            previous_grand_total: prevGrandTotal,
            discount_difference: discAmount - prevDisc,
            negotiation_status: vDoc.workflow_state || vDoc.status || (vDoc.docstatus === 1 ? 'Submitted' : vDoc.docstatus === 2 ? 'Cancelled' : 'Draft'),
            items: vDoc.items || [],
            doc: vDoc
          };
        });

        // Set negotiations in descending order (latest version first)
        setNegotiations(parsedNegotiations.slice().reverse());

        // 5. Fetch Comments across all versions in this quotation family
        try {
          const versionNames = detailedVersions.map(v => v.name);
          const commentPromises = versionNames.map(vName =>
            fetch(`${erpnextConfig.url}/api/resource/Comment?filters=[["reference_doctype", "=", "Quotation"], ["reference_name", "=", "${vName}"]]&fields=["name","comment_email","content","creation","comment_by","reference_name"]&limit_page_length=50&order_by=creation desc`, {
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }
            }).then(r => r.ok ? r.json() : { data: [] }).catch(() => ({ data: [] }))
          );
          const commentsResults = await Promise.all(commentPromises);
          const allComments = commentsResults.flatMap(r => r.data || []);
          const uniqueComments = [];
          const seenIds = new Set();
          for (const c of allComments) {
            if (c.name && !seenIds.has(c.name)) {
              seenIds.add(c.name);
              uniqueComments.push(c);
            }
          }
          uniqueComments.sort((a, b) => new Date(b.creation || 0) - new Date(a.creation || 0));
          setComments(uniqueComments);
        } catch (cErr) {
          console.warn('Failed fetching comments across versions:', cErr);
          setComments([]);
        }

        // Fetch active workflow actions from get_quotation_workflow_actions API for activeName
        try {
          const wfRes = await fetch(`${erpnextConfig.url}/api/method/get_quotation_workflow_actions?quotation=${activeName}`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });
          if (wfRes.ok) {
            const wfJson = await wfRes.json();
            console.log('Workflow API Response for', activeName, ':', wfJson);
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
    // If multiple versions of this quotation are available in local list, resolve to latest version
    const rootName = getRootQuotationName(quote.name, quote);
    let targetQuote = quote;
    if (quotations && quotations.length > 0) {
      const familyQuotes = quotations.filter(q => getRootQuotationName(q.name, q) === rootName);
      if (familyQuotes.length > 1) {
        familyQuotes.sort((a, b) => {
          const vA = getQuotationVersionInfo(a.name, rootName).version_no;
          const vB = getQuotationVersionInfo(b.name, rootName).version_no;
          return vB - vA; // Latest version first
        });
        targetQuote = familyQuotes[0];
      }
    }

    setSelectedQuotation(targetQuote);
    setSelectedQuotationDetail(null);
    setNegotiations([]);
    setComments([]);
    setWorkflowActions(null);
    fetchQuotationDetail(targetQuote.name, targetQuote.party_name || targetQuote.customer, true);
  };

  // SYNC DEFAULT SERVICES
  // Matches ERPNext client script:
  // 1. Calculate all commercial items: commercial_count and total_carpet_area
  // 2. If commercial_count === 0: remove default services
  // 3. If commercial_count > 0:
  //    rate = total_carpet_area * flt(service.charges || 0)
  //    add or update default service rows
  //    keep default services positioned immediately after commercial items
  const syncDefaultServices = async (rows) => {
    let serviceItems = defaultServiceItems;
    if (!serviceItems || serviceItems.length === 0) {
      serviceItems = await fetchDefaultServices();
    }

    const serviceNames = new Set((serviceItems || []).map(d => d.name));

    // Separate default service rows from other rows
    const serviceRows = [];
    const otherRows = [];

    for (const row of rows) {
      if (row.isDefaultService || serviceNames.has(row.unitId)) {
        serviceRows.push(row);
      } else {
        otherRows.push(row);
      }
    }

    // Calculate all commercial items
    let totalCarpetArea = 0;
    let commercialCount = 0;
    let lastCommercialIdx = -1;

    for (let i = 0; i < otherRows.length; i++) {
      const row = otherRows[i];
      if (!row.unitId) continue;

      let itemGroup = row.item_group;
      let carpetArea = parseFloat(row.carpetArea !== undefined && row.carpetArea !== null ? row.carpetArea : 0);

      // Check spaceUnits lookup if not directly present on row
      if (!itemGroup) {
        const foundUnit = spaceUnits.find(u => u.name === row.unitId);
        if (foundUnit) {
          itemGroup = foundUnit.item_group || 'Commercial';
          if (!carpetArea && foundUnit.custom_7average_carpet_area_of_units) {
            carpetArea = parseFloat(foundUnit.custom_7average_carpet_area_of_units) || 0;
          }
        }
      }

      if (itemGroup === 'Commercial') {
        commercialCount++;
        totalCarpetArea += carpetArea;
        lastCommercialIdx = i;
      }
    }

    // If commercial items exist but no active default service items in system
    if ((!serviceItems || serviceItems.length === 0) && commercialCount > 0) {
      showAlert('Notice', 'No active Default Service Item found.');
      showToast('error', 'No active Default Service Item found.');
    }

    // NO COMMERCIAL ITEM -> REMOVE DEFAULT SERVICES
    if (commercialCount === 0) {
      if (otherRows.length === 0) {
        return [{ unitId: '', qty: 1, uom: 'Sq Ft', stock_uom: 'Sq Ft', standardRate: '', offeredRate: '', propertyGroup: '', locality: '', district: '', totalArea: '', carpetArea: 0, item_group: 'Commercial', loadingDetail: false }];
      }
      return otherRows;
    }

    // ADD / UPDATE DEFAULT SERVICES
    const updatedServiceRows = [...serviceRows];

    for (const service of (serviceItems || [])) {
      const charges = parseFloat(service.charges || 0);
      const calculatedRate = Math.round((totalCarpetArea * charges) * 100) / 100;

      const existingIdx = updatedServiceRows.findIndex(r => r.unitId === service.name);
      if (existingIdx >= 0) {
        updatedServiceRows[existingIdx] = {
          ...updatedServiceRows[existingIdx],
          itemName: service.item_name || service.name,
          standardRate: calculatedRate,
          offeredRate: calculatedRate,
          charges: charges,
          totalArea: `${totalCarpetArea} sqft`,
          carpetArea: 0,
          qty: updatedServiceRows[existingIdx].qty || 1,
          uom: service.stock_uom || 'Nos',
          stock_uom: service.stock_uom || 'Nos',
        };
      } else {
        updatedServiceRows.push({
          unitId: service.name,
          itemName: service.item_name || service.name,
          qty: 1,
          standardRate: calculatedRate,
          offeredRate: calculatedRate,
          uom: service.stock_uom || 'Nos',
          stock_uom: service.stock_uom || 'Nos',
          propertyGroup: 'Default Service',
          locality: '—',
          district: '—',
          totalArea: `${totalCarpetArea} sqft`,
          carpetArea: 0,
          item_group: 'Services',
          isDefaultService: true,
          charges: charges,
          loadingDetail: false
        });
      }
    }

    // KEEP SERVICES AFTER COMMERCIAL ITEMS
    let resultItems = [];
    if (lastCommercialIdx >= 0) {
      resultItems = [
        ...otherRows.slice(0, lastCommercialIdx + 1),
        ...updatedServiceRows,
        ...otherRows.slice(lastCommercialIdx + 1)
      ];
    } else {
      resultItems = [...otherRows, ...updatedServiceRows];
    }

    return resultItems;
  };

  // Form helpers
  const addQuoteItem = () => {
    setQuoteItems(prev => [
      ...prev,
      {
        unitId: '',
        qty: 1,
        uom: 'Sq Ft',
        stock_uom: 'Sq Ft',
        standardRate: '',
        offeredRate: '',
        propertyGroup: '',
        locality: '',
        district: '',
        totalArea: '',
        carpetArea: 0,
        item_group: 'Commercial',
        loadingDetail: false
      }
    ]);
  };

  const removeQuoteItem = async (index) => {
    if (quoteItems[index]?.isDefaultService) return;
    const updated = [...quoteItems];
    updated.splice(index, 1);
    const synced = await syncDefaultServices(updated);
    setQuoteItems(synced);
  };

  const handleQtyOrRateChange = (index, field, value) => {
    setQuoteItems(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  // Selecting a Unit fetches the FULL Item document (works regardless of the
  // exact custom fieldnames on your site) and auto-populates the row —
  // rate, UOM, Property Group, Locality, District, Total Area.
  const handleItemChange = async (index, unitId) => {
    if (unitId) {
      const isAlreadyAdded = quoteItems.some((it, i) => i !== index && it.unitId === unitId);
      if (isAlreadyAdded) {
        showToast('error', `Unit "${unitId}" is already added to this quotation.`);
        showAlert('Duplicate Unit', `Unit "${unitId}" has already been added. The same unit cannot be added twice.`);
        return;
      }
    }
    const listMatch = spaceUnits.find(u => u.name === unitId);
    const initialCarpetArea = listMatch ? parseFloat(listMatch.custom_7average_carpet_area_of_units || 0) : 0;
    const initialValRate = listMatch ? (listMatch.valuation_rate || listMatch.standard_rate || 0) : 0;

    const initialUpdatedRow = {
      ...(quoteItems[index] || {}),
      unitId,
      standardRate: initialValRate,
      offeredRate: initialValRate,
      uom: listMatch ? (listMatch.stock_uom || 'Sq Ft') : 'Sq Ft',
      stock_uom: listMatch ? (listMatch.stock_uom || 'Sq Ft') : 'Sq Ft',
      propertyGroup: listMatch
        ? (typeof listMatch.custom_property_group === 'string'
          ? listMatch.custom_property_group
          : (typeof listMatch.custom_property_reference === 'string'
            ? listMatch.custom_property_reference
            : ''))
        : '',
      carpetArea: initialCarpetArea,
      totalArea: initialCarpetArea > 0 ? `${initialCarpetArea} sqft` : '',
      item_group: listMatch?.item_group || 'Commercial',
      loadingDetail: !!unitId
    };

    if (!unitId || !erpnextConfig || !erpnextConfig.url) {
      initialUpdatedRow.loadingDetail = false;
      const currentList = [...quoteItems];
      currentList[index] = initialUpdatedRow;
      const synced = await syncDefaultServices(currentList);
      setQuoteItems(synced);
      return;
    }

    setQuoteItems(prev => {
      const currentList = [...prev];
      currentList[index] = initialUpdatedRow;
      return currentList;
    });

    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Item/${encodeURIComponent(unitId)}`, {
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

        const carpetAreaVal = parseFloat(
          doc.custom_7average_carpet_area_of_units !== undefined && doc.custom_7average_carpet_area_of_units !== null && doc.custom_7average_carpet_area_of_units !== ''
            ? doc.custom_7average_carpet_area_of_units
            : (initialCarpetArea || 0)
        );
        const itemGroupVal = doc.item_group || listMatch?.item_group || 'Commercial';

        setQuoteItems(prev => {
          const currentList = [...prev];
          const targetIdx = currentList.findIndex((item, i) => (i === index && item.unitId === unitId) || (item.unitId === unitId && !item.isDefaultService));
          const idxToUpdate = targetIdx >= 0 ? targetIdx : index;
          if (currentList[idxToUpdate]) {
            currentList[idxToUpdate] = {
              ...currentList[idxToUpdate],
              propertyGroup: findVal(['custom_property_group', 'custom_property_reference', 'property_group', 'property']) || currentList[idxToUpdate].propertyGroup,
              locality: findVal(['locality']),
              district: findVal(['district']),
              totalArea: carpetAreaVal > 0 ? `${carpetAreaVal} sqft` : (findVal(['total_area', 'area_sqft', 'area']) || '—'),
              carpetArea: carpetAreaVal,
              item_group: itemGroupVal,
              loadingDetail: false
            };
          }
          syncDefaultServices(currentList).then(synced => {
            setQuoteItems(synced);
          });
          return currentList;
        });
      } else {
        const text = await res.text();
        setDebugMsg(`Item detail fetch failed (${res.status}): ${text.slice(0, 200)}`);
        setQuoteItems(prev => {
          const currentList = prev.map((item, i) => i === index ? { ...item, loadingDetail: false } : item);
          syncDefaultServices(currentList).then(synced => setQuoteItems(synced));
          return currentList;
        });
      }
    } catch (e) {
      setDebugMsg(`Item detail fetch error: ${e.message}`);
      setQuoteItems(prev => {
        const currentList = prev.map((item, i) => i === index ? { ...item, loadingDetail: false } : item);
        syncDefaultServices(currentList).then(synced => setQuoteItems(synced));
        return currentList;
      });
    }
  };

  const resetForm = () => {
    const today = new Date();
    const validDate = new Date(today);
    validDate.setDate(validDate.getDate() + (defaultValidityDays || 7));
    const validStr = formatDateToYMD(validDate);
    const startStr = calcNextDay(validStr);
    const endStr = calcOneYearLater(startStr);

    setQuoteCustomer('');
    setQuotetamplate('');
    setQuoteCompany(companyDetails?.name || 'CARPENTERS PROPERTIES PTE LIMITED');
    setQuoteValidTill(validStr);
    setQuoteEstBookingStart(startStr);
    setQuoteEstBookingEnd(endStr);
    setQuoteItems([{ unitId: '', qty: 1, uom: 'Sq Ft', stock_uom: 'Sq Ft', standardRate: '', offeredRate: '', propertyGroup: '', locality: '', district: '', totalArea: '', carpetArea: 0, item_group: 'Commercial', loadingDetail: false }]);
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
      const formatted = clean.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '').trim();
      return `⚠️ Booking Conflict:\n${formatted}`;
    }

    clean = clean.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '').trim();

    return clean;
  };

  // Submit new Quotation
  const handleCreateQuotation = async (e) => {
    e.preventDefault();
    if (!quoteCustomer || !quoteValidTill || !quoteEstBookingStart || !quoteEstBookingEnd) {
      showAlert('Missing Fields', 'Please select Tenant Name and specify Valid Till, Start Date, and End Date.');
      return;
    }

    const todayStartCheck = new Date();
    todayStartCheck.setHours(0, 0, 0, 0);
    const selectedStart = new Date(quoteEstBookingStart);
    selectedStart.setHours(0, 0, 0, 0);

    if (selectedStart < todayStartCheck) {
      showAlert('Invalid Date', 'Start Date cannot be in the past.');
      return;
    }

    if (quoteValidTill) {
      const selectedValidTill = new Date(quoteValidTill);
      selectedValidTill.setHours(0, 0, 0, 0);
      if (selectedStart <= selectedValidTill) {
        showAlert('Invalid Date', 'Start Date must always start from the next date of Valid Till.');
        return;
      }
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
      const qtyNum = parseFloat(item.qty) || 1;

      // Determine proper UOM based on item type
      let itemUom = 'Sq Ft';
      if (item.isDefaultService) {
        itemUom = item.stock_uom || item.uom || 'Nos';
        if (itemUom === 'Activity' || itemUom === 'Unit') itemUom = 'Nos';
      } else {
        itemUom = matched?.stock_uom || item.stock_uom || item.uom || 'Sq Ft';
        if (itemUom === 'Activity' || itemUom === 'Unit') itemUom = 'Sq Ft';
      }

      const itemArea = parseFloat(item.carpetArea) || parseFloat(item.totalArea) || parseFloat(matched?.custom_7average_carpet_area_of_units) || 0;

      return {
        item_code: item.unitId,
        item_name: matched ? matched.item_name : (item.itemName || item.unitId),
        description: item.itemName || matched?.item_name || item.unitId,
        item_group: item.item_group || (item.isDefaultService ? 'Services' : (matched?.item_group || 'Commercial')),
        qty: qtyNum,
        stock_qty: qtyNum,
        uom: itemUom,
        stock_uom: itemUom,
        conversion_factor: 1,
        rate: offeredRateNum,
        base_rate: offeredRateNum,
        price_list_rate: standardRateNum,
        base_price_list_rate: standardRateNum,
        amount: qtyNum * offeredRateNum,
        base_amount: qtyNum * offeredRateNum,
        net_rate: offeredRateNum,
        net_amount: qtyNum * offeredRateNum,
        base_net_rate: offeredRateNum,
        base_net_amount: qtyNum * offeredRateNum,
        total_areasqm: item.isDefaultService ? 0 : itemArea,
        custom_area: 'Sqm',
        custom_internal_valuation_ratemonthly: item.isDefaultService ? 0 : (parseFloat(matched?.valuation_rate || item.valuation_rate || standardRateNum) || 0),
        property_group: item.propertyGroup || matched?.custom_property_group || matched?.custom_property_reference || null,
        district: item.district || matched?.district || null
      };
    });

    const commercialUnits = quoteItems.filter(item => item.unitId && !item.isDefaultService);
    if (commercialUnits.length === 0) {
      showAlert('Required Field', 'You must add at least one Commercial Property Unit.');
      return;
    }

    const unitCodes = commercialUnits.map(u => u.unitId);
    const hasDuplicates = unitCodes.some((code, idx) => unitCodes.indexOf(code) !== idx);
    if (hasDuplicates) {
      showAlert('Duplicate Unit', 'The same property unit cannot be added more than once. Please remove duplicate units.');
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

    const payload = {
      order_type: "Sales",
      quotation_to: "Customer",
      party_name: quoteCustomer,
      customer: quoteCustomer,
      customer_name: matchedCust
        ? (matchedCust.customer_name || matchedCust.name)
        : quoteCustomer,
      transaction_date: formatDateToYMD(today),
      valid_till: quoteValidTill || formatDateToYMD(new Date(today.getTime() + (defaultValidityDays || 7) * 86400000)),
      company: quoteCompany || companyDetails?.name || 'CARPENTERS PROPERTIES PTE LIMITED',
      selling_price_list: "Standard Selling For Property Management",
      currency: companyDetails?.currency || "FJD",
      price_list_currency: companyDetails?.currency || "FJD",
      conversion_rate: 1,
      plc_conversion_rate: 1,
      status: quoteStatus || "Draft",
      custom_start_date: quoteEstBookingStart || null,
      custom_end_date: quoteEstBookingEnd || null,
      custom_template: quotetamplate || "Quotation Template 1",
      taxes_and_charges: "Fiji Tax - CFPL",
      items: erpItems
    };
    console.log(payload)

    try {
      let createdName = null;
      if (erpnextConfig && erpnextConfig.url) {
        const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation`, {
          method: 'POST',
          credentials: 'include',
          headers: getQuotationHeaders(),
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
        setSelectedQuotationDetail(null);
        setNegotiations([]);
        setComments([]);
        setWorkflowActions(null);
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

  // Open New Version Modal
  const handleOpenNewVersion = async (quotation) => {
    const qDoc = quotation || selectedQuotationDetail;
    if (!qDoc) return;

    let fullDoc = qDoc;
    // If items child table not loaded on shallow object, fetch full doc from ERPNext
    if (!fullDoc.items || fullDoc.items.length === 0) {
      try {
        if (erpnextConfig && erpnextConfig.url) {
          const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${encodeURIComponent(qDoc.name)}`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });
          if (res.ok) {
            const json = await res.json();
            fullDoc = json.data || json;
          }
        }
      } catch (err) {
        console.warn('Could not fetch complete quotation for new version:', err);
      }
    }

    setVersionTargetQuotation(fullDoc);

    const rawItems = fullDoc.items || [];
    const populatedRows = rawItems.map(item => {
      const isService = item.item_group === 'Services' || (item.item_code || '').toLowerCase().includes('service') || (item.item_code || '').toLowerCase().includes('promo');
      const matched = spaceUnits.find(u => u.name === item.item_code);
      const carpetAreaVal = parseFloat(item.total_areasqm || item.carpetArea || item.custom_total_area || matched?.custom_7average_carpet_area_of_units || 0);
      const valRate = parseFloat(item.price_list_rate || item.base_price_list_rate || item.custom_internal_valuation_ratemonthly || matched?.valuation_rate || matched?.standard_rate || item.rate || 0);
      const offerRate = parseFloat(item.rate || 0);

      return {
        unitId: item.item_code,
        itemName: item.item_name || matched?.item_name || item.item_code,
        qty: parseFloat(item.qty) || 1,
        standardRate: valRate,
        offeredRate: offerRate,
        uom: item.uom || item.stock_uom || (isService ? 'Nos' : 'Sq Ft'),
        stock_uom: item.stock_uom || (isService ? 'Nos' : 'Sq Ft'),
        propertyGroup: item.property_group || matched?.custom_property_group || matched?.custom_property_reference || (isService ? 'Default Service' : ''),
        locality: item.locality || matched?.locality || '',
        district: item.district || matched?.district || (isService ? '—' : ''),
        totalArea: carpetAreaVal > 0 ? `${carpetAreaVal} sqft` : (item.total_area || '—'),
        carpetArea: carpetAreaVal,
        item_group: item.item_group || (isService ? 'Services' : 'Commercial'),
        isDefaultService: isService,
        charges: parseFloat(item.charges || 0),
        loadingDetail: false
      };
    });

    const syncedRows = await syncDefaultServices(populatedRows);
    setVersionItems(syncedRows);
    setVersionNote('');

    const todayStr = new Date().toISOString().split('T')[0];
    const initialStart = (fullDoc.custom_start_date && fullDoc.custom_start_date >= todayStr)
      ? fullDoc.custom_start_date
      : todayStr;

    const calcOneYearLater = (startDateStr) => {
      if (!startDateStr) return '';
      const d = new Date(startDateStr);
      d.setFullYear(d.getFullYear() + 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const minEnd = calcOneYearLater(initialStart);
    const initialEnd = (fullDoc.custom_end_date && fullDoc.custom_end_date >= minEnd)
      ? fullDoc.custom_end_date
      : minEnd;

    setVersionStartDate(initialStart);
    setVersionEndDate(initialEnd);
    setShowNewVersionModal(true);
  };

  const handleVersionStartDateChange = (newStart) => {
    setVersionStartDate(newStart);
    if (newStart) {
      const d = new Date(newStart);
      d.setFullYear(d.getFullYear() + 1);
      const minEndStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!versionEndDate || new Date(versionEndDate) < d) {
        setVersionEndDate(minEndStr);
      }
    }
  };

  const handleVersionRateChange = (index, value) => {
    setVersionItems(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], offeredRate: value };
      }
      return updated;
    });
  };

  const handleRemoveVersionItem = async (index) => {
    if (versionItems[index]?.isDefaultService) return;
    const updated = [...versionItems];
    updated.splice(index, 1);
    const synced = await syncDefaultServices(updated);
    setVersionItems(synced);
  };

  const handleAddUnitToVersion = () => {
    setVersionItems(prev => [
      ...prev,
      {
        unitId: '',
        qty: 1,
        uom: 'Sq Ft',
        stock_uom: 'Sq Ft',
        standardRate: '',
        offeredRate: '',
        propertyGroup: '',
        locality: '',
        district: '',
        totalArea: '',
        carpetArea: 0,
        item_group: 'Commercial',
        loadingDetail: false
      }
    ]);
  };

  const handleVersionUnitChange = async (index, unitId) => {
    if (unitId) {
      const isAlreadyAdded = versionItems.some((it, i) => i !== index && it.unitId === unitId);
      if (isAlreadyAdded) {
        showToast('error', `Unit "${unitId}" is already added.`);
        return;
      }
    }
    const listMatch = spaceUnits.find(u => u.name === unitId);
    const initialCarpetArea = listMatch ? parseFloat(listMatch.custom_7average_carpet_area_of_units || 0) : 0;
    const initialValRate = listMatch ? (listMatch.valuation_rate || listMatch.standard_rate || 0) : 0;

    const updatedRow = {
      ...(versionItems[index] || {}),
      unitId,
      itemName: listMatch?.item_name || unitId,
      standardRate: initialValRate,
      offeredRate: initialValRate,
      uom: listMatch ? (listMatch.stock_uom || 'Sq Ft') : 'Sq Ft',
      stock_uom: listMatch ? (listMatch.stock_uom || 'Sq Ft') : 'Sq Ft',
      propertyGroup: listMatch ? (listMatch.custom_property_group || listMatch.custom_property_reference || '') : '',
      district: listMatch?.district || '',
      carpetArea: initialCarpetArea,
      totalArea: initialCarpetArea > 0 ? `${initialCarpetArea} sqft` : '',
      item_group: listMatch?.item_group || 'Commercial',
      loadingDetail: false
    };

    const updatedList = [...versionItems];
    updatedList[index] = updatedRow;
    const synced = await syncDefaultServices(updatedList);
    setVersionItems(synced);
  };

  // Submit New Version to ERPNext
  const handleCreateNewVersion = async (e) => {
    if (e) e.preventDefault();
    if (!versionTargetQuotation) return;

    if (!versionStartDate || !versionEndDate) {
      showAlert('Required Fields', 'Start Date and End Date are required.');
      return;
    }

    const todayStartCheck = new Date();
    todayStartCheck.setHours(0, 0, 0, 0);
    const selectedStart = new Date(versionStartDate);
    selectedStart.setHours(0, 0, 0, 0);

    if (selectedStart < todayStartCheck) {
      showAlert('Invalid Date', 'Start Date cannot be in the past.');
      return;
    }

    const startDate = new Date(versionStartDate);
    const endDate = new Date(versionEndDate);
    const oneYearLater = new Date(startDate);
    oneYearLater.setFullYear(startDate.getFullYear() + 1);

    if (endDate < oneYearLater) {
      showAlert('Invalid Date', 'Estimated Booking End Date must be at least 1 year from the Start Date.');
      return;
    }

    const commercialUnits = versionItems.filter(item => item.unitId && !item.isDefaultService);
    if (commercialUnits.length === 0) {
      showAlert('Required Field', 'You must have at least one Commercial Property Unit.');
      return;
    }

    const unitCodes = commercialUnits.map(u => u.unitId);
    const hasDuplicates = unitCodes.some((code, idx) => unitCodes.indexOf(code) !== idx);
    if (hasDuplicates) {
      showAlert('Duplicate Unit', 'Duplicate property units detected. Please remove duplicates.');
      return;
    }

    const rootName = getRootQuotationName(versionTargetQuotation.name, versionTargetQuotation);
    const vInfo = getQuotationVersionInfo(versionTargetQuotation.name, rootName);
    const nextVersionNo = vInfo.version_no + 1;

    if (!(await confirm(`Create Version ${nextVersionNo} for quotation ${rootName}?`))) return;

    setVersionSubmitting(true);
    try {
      if (!erpnextConfig || !erpnextConfig.url) {
        throw new Error('ERPNext server is not configured.');
      }

      const today = new Date();
      const formatDate = (date) => date.toISOString().split("T")[0];
      const validTill = new Date(today);
      validTill.setDate(validTill.getDate() + 7);

      const erpItems = versionItems.filter(item => item.unitId).map(item => {
        const matched = spaceUnits.find(u => u.name === item.unitId);
        const standardRateNum = parseFloat(item.standardRate) || 0;
        const offeredRateNum = parseFloat(item.offeredRate) || 0;
        const qtyNum = parseFloat(item.qty) || 1;

        let itemUom = 'Sq Ft';
        if (item.isDefaultService) {
          itemUom = item.stock_uom || item.uom || 'Nos';
          if (itemUom === 'Activity' || itemUom === 'Unit') itemUom = 'Nos';
        } else {
          itemUom = matched?.stock_uom || item.stock_uom || item.uom || 'Sq Ft';
          if (itemUom === 'Activity' || itemUom === 'Unit') itemUom = 'Sq Ft';
        }

        const itemArea = parseFloat(item.carpetArea) || parseFloat(item.totalArea) || parseFloat(matched?.custom_7average_carpet_area_of_units) || 0;

        return {
          item_code: item.unitId,
          item_name: matched ? matched.item_name : (item.itemName || item.unitId),
          description: item.itemName || matched?.item_name || item.unitId,
          item_group: item.item_group || (item.isDefaultService ? 'Services' : (matched?.item_group || 'Commercial')),
          qty: qtyNum,
          stock_qty: qtyNum,
          uom: itemUom,
          stock_uom: itemUom,
          conversion_factor: 1,
          rate: offeredRateNum,
          base_rate: offeredRateNum,
          price_list_rate: standardRateNum,
          base_price_list_rate: standardRateNum,
          amount: qtyNum * offeredRateNum,
          base_amount: qtyNum * offeredRateNum,
          net_rate: offeredRateNum,
          net_amount: qtyNum * offeredRateNum,
          base_net_rate: offeredRateNum,
          base_net_amount: qtyNum * offeredRateNum,
          total_areasqm: item.isDefaultService ? 0 : itemArea,
          custom_area: 'Sqm',
          custom_internal_valuation_ratemonthly: item.isDefaultService ? 0 : (parseFloat(matched?.valuation_rate || item.valuation_rate || standardRateNum) || 0),
          property_group: item.propertyGroup || matched?.custom_property_group || matched?.custom_property_reference || null,
          district: item.district || matched?.district || null
        };
      });

      // 1. Fetch fresh source quotation from ERPNext
      let latestSource = versionTargetQuotation;
      try {
        const getRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${encodeURIComponent(versionTargetQuotation.name)}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (getRes.ok) {
          const getJson = await getRes.json();
          latestSource = getJson.data || getJson;
        }
      } catch (fErr) {
        console.warn('Could not fetch fresh source quotation:', fErr);
      }

      // 2. Step 1: If previous quotation is Draft (docstatus === 0), SUBMIT IT FIRST
      if (latestSource.docstatus === 0) {
        let submitSuccess = false;
        try {
          const submitRes = await fetch(`${erpnextConfig.url}/api/method/frappe.client.submit`, {
            method: 'POST',
            credentials: 'include',
            headers: getQuotationHeaders(),
            body: JSON.stringify({
              doc: { ...latestSource, docstatus: 1 }
            })
          });
          const submitJson = await submitRes.json();
          if (submitRes.ok && !submitJson.exc) {
            submitSuccess = true;
          }
        } catch (e) {
          console.warn('Submit RPC error:', e);
        }

        if (!submitSuccess) {
          try {
            const putRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${encodeURIComponent(latestSource.name)}`, {
              method: 'PUT',
              credentials: 'include',
              headers: getQuotationHeaders(),
              body: JSON.stringify({ docstatus: 1, status: 'Submitted' })
            });
            if (putRes.ok) submitSuccess = true;
          } catch (e) {
            console.warn('Submit PUT error:', e);
          }
        }

        if (!submitSuccess) {
          try {
            await fetch(`${erpnextConfig.url}/api/method/update_quotation_workflow`, {
              method: 'POST',
              credentials: 'include',
              headers: getQuotationHeaders(),
              body: JSON.stringify({
                quotation: latestSource.name,
                action: 'Submit'
              })
            });
          } catch (_) {}
        }
      }

      // 3. Step 2: CANCEL the previous quotation (docstatus: 2, status: 'Cancelled')
      if (latestSource.docstatus !== 2) {
        let cancelSuccess = false;
        try {
          const cancelRes = await fetch(`${erpnextConfig.url}/api/method/frappe.client.cancel`, {
            method: 'POST',
            credentials: 'include',
            headers: getQuotationHeaders(),
            body: JSON.stringify({ doctype: 'Quotation', name: latestSource.name })
          });
          const cancelJson = await cancelRes.json();
          if (cancelRes.ok && !cancelJson.exc) {
            cancelSuccess = true;
          }
        } catch (cErr) {
          console.warn('Cancel RPC error:', cErr);
        }

        if (!cancelSuccess) {
          try {
            await fetch(`${erpnextConfig.url}/api/resource/Quotation/${encodeURIComponent(latestSource.name)}`, {
              method: 'PUT',
              credentials: 'include',
              headers: getQuotationHeaders(),
              body: JSON.stringify({ docstatus: 2, status: 'Cancelled' })
            });
          } catch (e) {
            console.warn('Cancel PUT error:', e);
          }
        }
      }

      // 4. Step 3: Create Duplicate / Amended Quotation with new offered rates
      const payload = {
        order_type: "Sales",
        quotation_to: "Customer",
        party_name: latestSource.party_name || latestSource.customer,
        customer: latestSource.party_name || latestSource.customer,
        customer_name: latestSource.customer_name,
        contact_person: latestSource.contact_person || null,
        contact_display: latestSource.contact_display || null,
        contact_mobile: latestSource.contact_mobile || null,
        contact_email: latestSource.contact_email || null,
        customer_address: latestSource.customer_address || null,
        address_display: latestSource.address_display || null,
        transaction_date: formatDate(today),
        valid_till: formatDate(validTill),
        company: latestSource.company || quoteCompany || 'CARPENTERS PROPERTIES PTE LIMITED',
        company_address: latestSource.company_address || null,
        company_address_display: latestSource.company_address_display || null,
        selling_price_list: latestSource.selling_price_list || "Standard Selling For Property Management",
        currency: latestSource.currency || companyDetails?.currency || "FJD",
        price_list_currency: latestSource.price_list_currency || companyDetails?.currency || "FJD",
        conversion_rate: 1,
        plc_conversion_rate: 1,
        status: "Draft",
        docstatus: 0,
        custom_start_date: versionStartDate || null,
        custom_end_date: versionEndDate || null,
        custom_template: latestSource.custom_template || quotetamplate || "Quotation Template 1",
        taxes_and_charges: latestSource.taxes_and_charges || "Fiji Tax - CFPL",
        amended_from: latestSource.name,
        items: erpItems
      };

      if (latestSource.taxes && Array.isArray(latestSource.taxes) && latestSource.taxes.length > 0) {
        payload.taxes = latestSource.taxes.map(t => ({
          charge_type: t.charge_type,
          account_head: t.account_head,
          description: t.description,
          rate: t.rate
        }));
      }

      if (versionNote && versionNote.trim()) {
        payload.remarks = `Version ${nextVersionNo}: ${versionNote.trim()}`;
        payload.custom_negotiation_status = versionNote.trim();
      }

      let res = await fetch(`${erpnextConfig.url}/api/resource/Quotation`, {
        method: 'POST',
        credentials: 'include',
        headers: getQuotationHeaders(),
        body: JSON.stringify(payload)
      });

      // If amended_from error, retry fallback
      if (!res.ok) {
        const errText = await res.text();
        if (errText.includes('amend') || errText.includes('cancelled')) {
          const fallbackPayload = { ...payload };
          delete fallbackPayload.amended_from;
          res = await fetch(`${erpnextConfig.url}/api/resource/Quotation`, {
            method: 'POST',
            credentials: 'include',
            headers: getQuotationHeaders(),
            body: JSON.stringify(fallbackPayload)
          });
        } else {
          throw new Error(errText);
        }
      }

      if (!res.ok) {
        let rawMsg = 'Failed to create new quotation version.';
        try {
          const errData = await res.json();
          if (errData._server_messages) {
            try {
              const msgs = JSON.parse(errData._server_messages);
              rawMsg = JSON.parse(msgs[0]).message || rawMsg;
            } catch (_) {
              rawMsg = errData._server_messages;
            }
          } else if (errData.message) {
            rawMsg = errData.message;
          } else if (errData.exception) {
            rawMsg = errData.exception;
          }
        } catch (_) {}
        throw new Error(rawMsg);
      }

      const created = await res.json();
      const createdName = (created.data || created)?.name || null;

      // Post comment if note provided
      if (createdName && versionNote && versionNote.trim()) {
        try {
          await fetch(`${erpnextConfig.url}/api/resource/Comment`, {
            method: 'POST',
            credentials: 'include',
            headers: getQuotationHeaders(),
            body: JSON.stringify({
              comment_type: 'Comment',
              reference_doctype: 'Quotation',
              reference_name: createdName,
              content: `New version created: ${versionNote.trim()}`
            })
          });
        } catch (_) {}
      }

      showToast('success', `Revised quotation ${createdName || ''} created successfully.`);
      showAlert('Success', `Revised quotation ${createdName || ''} has been created successfully.`);
      setShowNewVersionModal(false);
      await fetchQuotations();

      if (createdName) {
        setSelectedQuotation({ name: createdName });
        setSelectedQuotationDetail(null);
        setNegotiations([]);
        setComments([]);
        setWorkflowActions(null);
        fetchQuotationDetail(createdName, payload.party_name);
      }
    } catch (err) {
      const cleanMsg = cleanErrorMessage(err.message);
      showAlert('Creation Failed', cleanMsg);
      showToast('error', cleanMsg);
    } finally {
      setVersionSubmitting(false);
    }
  };

  // Handle uploading signed document to ERPNext and attaching to Quotation
  const handleUploadSignedDocument = async (file) => {
    if (!file || !selectedQuotationDetail?.name) return;
    setUploadingSignedDoc(true);
    try {
      let fileUrl = '';
      const token = getCsrfToken();

      // 1. Try ERPNext /api/method/upload_file
      if (erpnextConfig?.url) {
        try {
          const formData = new FormData();
          formData.append('file', file, file.name);
          formData.append('filename', file.name);
          formData.append('file_name', file.name);
          formData.append('is_private', '0');
          formData.append('folder', 'Home');
          formData.append('doctype', 'Quotation');
          formData.append('docname', selectedQuotationDetail.name);
          formData.append('fieldname', 'signed_document');
          if (token) {
            formData.append('csrf_token', token);
          }

          const uploadHeaders = {};
          if (token) {
            uploadHeaders['X-Frappe-CSRF-Token'] = token;
          }

          const res = await fetch(`${erpnextConfig.url}/api/method/upload_file`, {
            method: 'POST',
            credentials: 'include',
            headers: uploadHeaders,
            body: formData
          });

          if (res.ok) {
            const json = await res.json();
            fileUrl = json.message?.file_url || json.file_url || '';
          } else {
            console.warn('ERPNext upload_file returned status', res.status);
          }
        } catch (uploadErr) {
          console.warn('Error during ERPNext upload_file:', uploadErr);
        }
      }

      // 2. Fallback to Data URL if server upload was offline or failed
      if (!fileUrl) {
        fileUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      // 3. Persist signed_document field on Quotation DocType in ERPNext
      if (erpnextConfig?.url && selectedQuotationDetail.name && fileUrl) {
        let persisted = false;
        try {
          const rpcRes = await fetch(`${erpnextConfig.url}/api/method/frappe.client.set_value`, {
            method: 'POST',
            credentials: 'include',
            headers: getQuotationHeaders(),
            body: JSON.stringify({
              doctype: 'Quotation',
              name: selectedQuotationDetail.name,
              fieldname: 'signed_document',
              value: fileUrl
            })
          });
          if (rpcRes.ok) {
            persisted = true;
          }
        } catch (rpcErr) {
          console.warn('frappe.client.set_value failed:', rpcErr);
        }

        if (!persisted) {
          try {
            await fetch(`${erpnextConfig.url}/api/resource/Quotation/${encodeURIComponent(selectedQuotationDetail.name)}`, {
              method: 'PUT',
              credentials: 'include',
              headers: getQuotationHeaders(),
              body: JSON.stringify({ signed_document: fileUrl })
            });
          } catch (putErr) {
            console.warn('PUT Quotation signed_document failed:', putErr);
          }
        }
      }

      // 4. Update state locally
      setSelectedQuotationDetail(prev => prev ? { ...prev, signed_document: fileUrl } : null);
      setQuotations(prev => prev.map(q => q.name === selectedQuotationDetail.name ? { ...q, signed_document: fileUrl } : q));
      showToast('success', 'Signed document attached successfully! Create Booking is now enabled.');
    } catch (err) {
      console.error('Failed to attach signed document:', err);
      showToast('error', `Failed to upload document: ${err.message || 'Unknown error'}`);
    } finally {
      setUploadingSignedDoc(false);
    }
  };

  // Remove signed document from Quotation
  const handleRemoveSignedDocument = async () => {
    if (!selectedQuotationDetail?.name) return;
    if (!(await confirm('Are you sure you want to remove this signed document? This will hide the Create Booking action until a document is re-uploaded.'))) return;

    try {
      if (erpnextConfig?.url && selectedQuotationDetail.name) {
        try {
          await fetch(`${erpnextConfig.url}/api/method/frappe.client.set_value`, {
            method: 'POST',
            credentials: 'include',
            headers: getQuotationHeaders(),
            body: JSON.stringify({
              doctype: 'Quotation',
              name: selectedQuotationDetail.name,
              fieldname: 'signed_document',
              value: ''
            })
          });
        } catch (e) {
          console.warn('Failed clearing signed_document via RPC:', e);
        }
      }

      setSelectedQuotationDetail(prev => prev ? { ...prev, signed_document: '' } : null);
      setQuotations(prev => prev.map(q => q.name === selectedQuotationDetail.name ? { ...q, signed_document: '' } : q));
      showToast('info', 'Signed document removed.');
    } catch (err) {
      console.error('Failed removing signed document:', err);
      showToast('error', 'Could not remove signed document.');
    }
  };

  // Create Booking from Quotation
  const handleCreateBooking = async (quotationToBook = null) => {
    const qDoc = quotationToBook || selectedQuotationDetail;
    if (!qDoc) return;
    if (!qDoc.signed_document) {
      showToast('error', 'Please upload a signed document before creating a booking.');
      showAlert('Signed Document Required', 'A signed document must be uploaded to the quotation before creating a booking.');
      return;
    }
    const qName = qDoc.name;
    if (!(await confirm(`Create Booking from Quotation ${qName}?`))) return;

    setCreatingBooking(true);
    setCreatingBookingId(qName);
    try {
      if (!erpnextConfig || !erpnextConfig.url) {
        throw new Error('ERPNext server is not configured.');
      }

      // Step 1: Ensure Quotation is submitted (docstatus === 1) first
      if (qDoc.docstatus !== 1) {
        let latestDoc = qDoc;
        try {
          const checkRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${encodeURIComponent(qName)}`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });
          if (checkRes.ok) {
            const checkJson = await checkRes.json();
            latestDoc = checkJson.data || latestDoc;
          }
        } catch (e) {
          console.warn('Could not fetch latest quotation before submit:', e);
        }

        if (latestDoc.docstatus !== 1) {
          let submitSuccess = false;
          let submitErrorMsg = null;

          // Attempt A: Standard Frappe submit RPC
          try {
            const submitRes = await fetch(`${erpnextConfig.url}/api/method/frappe.client.submit`, {
              method: 'POST',
              credentials: 'include',
              headers: getQuotationHeaders(),
              body: JSON.stringify({
                doc: { ...latestDoc, docstatus: 1 }
              })
            });

            const submitJson = await submitRes.json();
            if (submitRes.ok && !submitJson.exc) {
              submitSuccess = true;
            } else {
              if (submitJson._server_messages) {
                try {
                  const msgs = JSON.parse(submitJson._server_messages);
                  submitErrorMsg = JSON.parse(msgs[0]).message || submitErrorMsg;
                } catch (_) {
                  submitErrorMsg = submitJson._server_messages;
                }
              } else {
                submitErrorMsg = submitJson.exception || submitJson.message;
              }
            }
          } catch (e) {
            submitErrorMsg = e.message;
          }

          // Attempt B: Fallback via Resource PUT with docstatus = 1
          if (!submitSuccess) {
            try {
              const putRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${encodeURIComponent(qName)}`, {
                method: 'PUT',
                credentials: 'include',
                headers: getQuotationHeaders(),
                body: JSON.stringify({ docstatus: 1, status: 'Submitted' })
              });
              const putJson = await putRes.json();
              if (putRes.ok && !putJson.exc) {
                submitSuccess = true;
              }
            } catch (e) {
              // Ignore fallback error
            }
          }

          // Attempt C: Fallback via custom workflow transition if site has workflow enabled
          if (!submitSuccess) {
            try {
              const wfRes = await fetch(`${erpnextConfig.url}/api/method/update_quotation_workflow`, {
                method: 'POST',
                credentials: 'include',
                headers: getQuotationHeaders(),
                body: JSON.stringify({
                  quotation: qName,
                  action: 'Submit'
                })
              });
              const wfJson = await wfRes.json();
              if (wfRes.ok && !wfJson.exc) {
                submitSuccess = true;
              }
            } catch (e) {
              // Ignore workflow fallback error
            }
          }

          if (!submitSuccess && submitErrorMsg) {
            throw new Error(`Failed to submit quotation first: ${cleanErrorMessage(submitErrorMsg)}`);
          }
        }
      }

      // Step 2: Now that docstatus is submitted (1), call create_booking_from_quotation
      const res = await fetch(`${erpnextConfig.url}/api/method/property_management.property_managmenet_system.doctype.booking.booking.create_booking_from_quotation`, {
        method: 'POST',
        credentials: 'include',
        headers: getQuotationHeaders(),
        body: JSON.stringify({ quotation_name: qName })
      });

      const json = await res.json();
      if (!res.ok || json.exc) {
        let rawMsg = 'Failed to create booking from quotation.';
        if (json._server_messages) {
          try {
            const msgs = JSON.parse(json._server_messages);
            const firstMsgObj = JSON.parse(msgs[0]);
            rawMsg = firstMsgObj.message || rawMsg;
          } catch (inner) {
            rawMsg = json._server_messages;
          }
        } else if (json.message && typeof json.message === 'string') {
          rawMsg = json.message;
        } else if (json.exception) {
          rawMsg = json.exception;
        }
        throw new Error(rawMsg);
      }

      const bookingName = json.message;
      showToast('success', `Booking ${bookingName} created successfully.`);
      showAlert('Success', `Booking ${bookingName} created successfully.`);

      // Refresh quotation detail and list
      if (selectedQuotationDetail && selectedQuotationDetail.name === qName) {
        await fetchQuotationDetail(qName, selectedQuotationDetail.party_name || selectedQuotationDetail.customer);
      }
      await fetchQuotations();

      // Route to booking view
      if (onGoToBooking) {
        onGoToBooking({ ...(qDoc || {}), booking_id: bookingName, name: bookingName });
      }
    } catch (err) {
      const cleanMsg = cleanErrorMessage(err.message);
      showAlert('Booking Failed', cleanMsg);
      showToast('error', cleanMsg);
    } finally {
      setCreatingBooking(false);
      setCreatingBookingId(null);
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
          headers: getQuotationHeaders(),
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
          headers: getQuotationHeaders(),
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
          headers: getQuotationHeaders(),
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
        headers: getQuotationHeaders(),
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
      if (!erpnextConfig || !erpnextConfig.url || !selectedQuotationDetail) {
        return true;
      }

      const disc = parseFloat(discountAmount) || 0;

      // Apply discount ONLY on Commercial Unit in items child table
      const updatedItems = (selectedQuotationDetail.items || []).map(item => {
        if (isCommercialItem(item)) {
          const qty = parseFloat(item.qty) || 1;
          const currentItemDisc = parseFloat(item.discount_amount) || 0;
          const baseRate = parseFloat(item.price_list_rate) || ((parseFloat(item.rate) || 0) + (currentItemDisc / qty));
          const baseAmount = baseRate * qty;
          const itemDisc = Math.min(disc, baseAmount);
          const newRate = Math.max(0, (baseAmount - itemDisc) / qty);
          const newAmount = Math.max(0, baseAmount - itemDisc);

          return {
            ...item,
            discount_amount: itemDisc,
            discount_percentage: baseAmount > 0 ? (itemDisc / baseAmount) * 100 : 0,
            rate: newRate,
            price_list_rate: baseRate,
            amount: newAmount,
            net_rate: newRate,
            net_amount: newAmount
          };
        } else {
          return {
            ...item,
            discount_amount: 0,
            discount_percentage: 0
          };
        }
      });

      // Save updated items to Quotation resource
      const discountRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${selectedQuotationDetail.name}`, {
        method: 'PUT',
        credentials: 'include',
        headers: getQuotationHeaders(),
        body: JSON.stringify({
          items: updatedItems,
          discount_amount: 0,
          apply_discount_on: "",
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
          headers: getQuotationHeaders(),
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
      // Save item-level Commercial Unit discount first
      await saveDiscountAndMessageSilently();

      const res = await fetch(`${erpnextConfig.url}/api/method/update_quotation_workflow`, {
        method: "POST",
        credentials: 'include',
        headers: getQuotationHeaders(),
        body: JSON.stringify({
          quotation: selectedQuotationDetail.name,
          action: actionName,
          discount_amount: 0,
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
      const disc = parseFloat(discountAmount) || 0;

      // Construct updated items where discount is applied ONLY on Commercial Unit
      const updatedItems = (selectedQuotationDetail.items || []).map(item => {
        if (isCommercialItem(item)) {
          const qty = parseFloat(item.qty) || 1;
          const currentItemDisc = parseFloat(item.discount_amount) || 0;
          const baseRate = parseFloat(item.price_list_rate) || ((parseFloat(item.rate) || 0) + (currentItemDisc / qty));
          const baseAmount = baseRate * qty;
          const itemDisc = Math.min(disc, baseAmount);
          const newRate = Math.max(0, (baseAmount - itemDisc) / qty);
          const newAmount = Math.max(0, baseAmount - itemDisc);

          return {
            ...item,
            discount_amount: itemDisc,
            discount_percentage: baseAmount > 0 ? (itemDisc / baseAmount) * 100 : 0,
            rate: newRate,
            price_list_rate: baseRate,
            amount: newAmount,
            net_rate: newRate,
            net_amount: newAmount
          };
        } else {
          // Non-commercial items (services, promo, etc.) have 0 discount
          const qty = parseFloat(item.qty) || 1;
          const rate = parseFloat(item.rate) || 0;
          return {
            ...item,
            discount_amount: 0,
            discount_percentage: 0,
            amount: item.amount !== undefined && item.amount !== null ? item.amount : (qty * rate)
          };
        }
      });

      if (!erpnextConfig || !erpnextConfig.url) {
        setSelectedQuotationDetail(prev => {
          if (!prev) return prev;
          const newTotal = updatedItems.reduce((acc, it) => acc + (parseFloat(it.amount) || 0), 0);
          const taxRate = prev.total > 0 ? (prev.total_taxes_and_charges || 0) / prev.total : 0.15;
          const newTaxes = newTotal * taxRate;
          return {
            ...prev,
            items: updatedItems,
            discount_amount: 0,
            total: newTotal,
            net_total: newTotal,
            total_taxes_and_charges: newTaxes,
            grand_total: newTotal + newTaxes
          };
        });
        setMessageText('');
        showToast('success', 'Quotation Commercial Unit discount updated locally.');
        return;
      }

      // Save updated items to Quotation resource on ERPNext
      const discountRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation/${selectedQuotationDetail.name}`, {
        method: 'PUT',
        credentials: 'include',
        headers: getQuotationHeaders(),
        body: JSON.stringify({
          items: updatedItems,
          discount_amount: 0,
          apply_discount_on: "",
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
          headers: getQuotationHeaders(),
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

      showToast('success', 'Quotation Commercial Unit discount saved successfully.');
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
                  <th style={{ textAlign: 'right', paddingRight: 20 }}>Actions</th>
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
                      title="Click to view quotation (opens latest version)"
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedQuotation?.name === q.name ? 'var(--bg-accent-alpha)' : '',
                        borderLeft: selectedQuotation?.name === q.name ? '3px solid var(--brand-color)' : ''
                      }}
                    >
                      <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <span>{q.name}</span>
                          {(() => {
                            const vInfo = getQuotationVersionInfo(q.name, getRootQuotationName(q.name, q));
                            if (vInfo && vInfo.version_no > 1) {
                              return (
                                <span style={{
                                  fontSize: 8.5,
                                  fontWeight: 700,
                                  padding: '1px 5px',
                                  borderRadius: 4,
                                  background: '#e0f2fe',
                                  color: '#0369a1',
                                  border: '1px solid #bae6fd'
                                }}>
                                  v{vInfo.version_no}
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{q.customer_name}</td>
                      <td>{q.transaction_date}</td>
                      <td>{q.valid_till}</td>
                      <td style={{ fontWeight: 600 }}>${(q.grand_total || 0).toLocaleString()}</td>
                      <td>
                        {(() => {
                          const displayStatus = q.workflow_state || q.status || (q.docstatus === 1 ? 'Submitted' : q.docstatus === 2 ? 'Cancelled' : 'Draft');
                          const lower = (displayStatus || '').toLowerCase();
                          let badgeClass = 'badge-warning';
                          if (lower === 'submitted' || lower === 'approved' || lower === 'ordered') {
                            badgeClass = 'badge-success';
                          } else if (lower === 'cancelled' || lower === 'rejected' || lower === 'lost') {
                            badgeClass = 'badge-danger';
                          } else if (lower === 'draft' || lower === 'open' || lower.includes('created')) {
                            badgeClass = 'badge-info';
                          }
                          return (
                            <span className={`badge ${badgeClass}`}>
                              {displayStatus}
                            </span>
                          );
                        })()}
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: 16 }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                          {!q.booking_id && (
                            <button
                              type="button"
                              className="btn btn-sm"
                              style={{
                                fontSize: 10.5,
                                fontWeight: 600,
                                padding: '4px 10px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                borderRadius: 6,
                                border: '1px solid #93c5fd',
                                color: '#1d4ed8',
                                backgroundColor: '#eff6ff',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#dbeafe'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenNewVersion(q);
                              }}
                              title={`Create Revised Quotation from ${q.name}`}
                            >
                              <GitBranch size={11} />
                              <span>Revised Quotation</span>
                            </button>
                          )}

                          {q.booking_id ? (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{
                                fontSize: 10.5,
                                fontWeight: 600,
                                padding: '4px 10px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 5,
                                color: '#059669',
                                borderColor: '#a7f3d0',
                                backgroundColor: '#ecfdf5',
                                cursor: 'pointer'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onGoToBooking) onGoToBooking(q);
                              }}
                              title={`Go to Booking ${q.booking_id}`}
                            >
                              <Check size={11} />
                              <span>Go to Booking</span>
                            </button>
                          ) : q.signed_document && (q.status !== 'Cancelled' && q.docstatus !== 2) ? (
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              style={{
                                fontSize: 10.5,
                                fontWeight: 600,
                                padding: '4px 11px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 5,
                                backgroundColor: '#2563eb',
                                borderColor: '#2563eb',
                                color: '#ffffff',
                                boxShadow: '0 1px 2px rgba(37,99,235,0.2)',
                                cursor: creatingBookingId === q.name ? 'not-allowed' : 'pointer'
                              }}
                              disabled={creatingBookingId === q.name}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCreateBooking(q);
                              }}
                              title={`Create Booking from ${q.name}`}
                            >
                              <Bookmark size={11} />
                              <span>{creatingBookingId === q.name ? 'Creating...' : 'Create Booking'}</span>
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ));
                })()}
                {quotations.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
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
            onClick={() => { setSelectedQuotation(null); setSelectedQuotationDetail(null); setNegotiations([]); setComments([]); setWorkflowActions(null); }}
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

        {/* Details Drawer (Full Width covering all blur up to sidebar) */}
        <div
          className={`quotation-details-drawer ${(selectedQuotation && selectedQuotationDetail) ? 'open' : ''}`}
          style={{
            position: 'fixed',
            top: 0,
            right: (selectedQuotation && selectedQuotationDetail) ? 0 : '-120vw',
            width: 'calc(100vw - 240px)',
            maxWidth: '100vw',
            height: '100vh',
            background: 'var(--bg-primary)',
            boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.15)',
            zIndex: 999,
            transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {selectedQuotation && selectedQuotationDetail && (
            <div className="card-panel" style={{ padding: '24px 32px', background: '#ffffff', color: '#111827', display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', height: '100%', overflowY: 'auto', minWidth: 0, border: 'none', borderRadius: 0 }}>

              {/* Close details button */}
              <div style={{ position: 'absolute', top: 14, right: 16, display: 'flex', alignItems: 'center', gap: 8, zIndex: 10 }}>
                <button
                  onClick={() => { setSelectedQuotation(null); setSelectedQuotationDetail(null); setNegotiations([]); setComments([]); setWorkflowActions(null); }}
                  style={{
                    background: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    borderRadius: '50%',
                    color: '#374151',
                    cursor: 'pointer',
                    width: 30,
                    height: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 700,
                    transition: 'all 0.15s'
                  }}
                  title="Close"
                >
                  ×
                </button>
              </div>



              {/* BILL TO / CUSTOMER INFO */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16, fontSize: 11.5, paddingBottom: 6, flexShrink: 0 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, fontSize: 10.5 }}>Customer</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-color)' }}>{selectedQuotationDetail.name}</span>
                      {(() => {
                        const root = getRootQuotationName(selectedQuotationDetail.name, selectedQuotationDetail);
                        const vInfo = getQuotationVersionInfo(selectedQuotationDetail.name, root);
                        return (
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#e0f2fe', color: '#0369a1', fontWeight: 700 }}>
                            V{vInfo.version_no}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <strong style={{ fontSize: 16, color: '#111827', fontWeight: 700 }}>{selectedQuotationDetail.customer_name}</strong>
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
                          padding: '3px 9px',
                          borderRadius: '12px',
                          fontSize: '10px',
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
                  <p style={{ color: '#4b5563', lineHeight: 1.4, marginTop: 2, fontSize: 11.5 }}>{customerAddress}</p>
                  <p style={{ color: '#4b5563', fontSize: 11, marginTop: 4 }}>Contact: {selectedQuotationDetail.custom_customer_email || ''} | {selectedQuotationDetail.custom_customer_ph_no || ''}</p>

                  {/* Version switcher pills if multiple versions exist in this quotation family */}
                  {negotiations.length > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap', background: '#f8fafc', padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: 10.5, color: '#64748b', fontWeight: 700 }}>Versions:</span>
                      {negotiations.slice().reverse().map(v => {
                        const isCurrent = v.name === selectedQuotationDetail.name;
                        return (
                          <button
                            key={v.name}
                            type="button"
                            onClick={() => {
                              if (!isCurrent) {
                                fetchQuotationDetail(v.name, selectedQuotationDetail.party_name || selectedQuotationDetail.customer);
                              }
                            }}
                            title={`Switch to version ${v.version_no} (${v.name})`}
                            style={{
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: 10,
                              fontWeight: 700,
                              cursor: isCurrent ? 'default' : 'pointer',
                              border: isCurrent ? '1px solid var(--brand-color)' : '1px solid #cbd5e1',
                              background: isCurrent ? 'var(--brand-color)' : '#ffffff',
                              color: isCurrent ? '#ffffff' : '#334155',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            V{v.version_no} {isCurrent ? '• Active' : `(${v.negotiation_status})`}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div style={{ background: '#f9fafb', padding: '12px 16px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 11, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ color: '#6b7280', fontWeight: 700, fontSize: 10 }}>VALIDITY &amp; BOOKING PERIOD</span>
                  <div>Valid Till: <strong style={{ color: '#111827' }}>{selectedQuotationDetail.valid_till || 'N/A'}</strong></div>
                  <div>Start: <strong style={{ color: '#111827' }}>{selectedQuotationDetail.custom_start_date || 'N/A'}</strong></div>
                  <div>End: <strong style={{ color: '#111827' }}>{selectedQuotationDetail.custom_end_date || 'N/A'}</strong></div>
                </div>
              </div>

              {/* TABS NAVIGATION */}
              <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', gap: 20, flexShrink: 0 }}>
                {['SUMMARY', 'NEGOTIATION HISTORY', 'COMPARISON', 'DOCUMENTS'].map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '10px 6px',
                      border: 'none',
                      background: 'none',
                      fontWeight: 700,
                      fontSize: 11.5,
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
                  const commercialItem = (selectedQuotationDetail.items || []).find(isCommercialItem);
                  const commercialDiscount = commercialItem && commercialItem.discount_amount !== undefined && commercialItem.discount_amount !== null
                    ? (parseFloat(commercialItem.discount_amount) || 0)
                    : (parseFloat(selectedQuotationDetail.discount_amount) || 0);

                  const activeDiscount = (discountAmount !== '' && !isNaN(parseFloat(discountAmount)))
                    ? (parseFloat(discountAmount) || 0)
                    : commercialDiscount;
                  const discount = activeDiscount;

                  const allItems = selectedQuotationDetail.items || [];
                  const commercialItems = allItems.filter(isCommercialItem);
                  const targetComparisonItems = commercialItems.length > 0 ? commercialItems : allItems;

                  // Price List Rate for Commercial items ONLY (Item_Group = "Commercial")
                  const totalPriceListRate = targetComparisonItems.reduce((acc, item) => {
                    const qty = parseFloat(item.qty) || 1;
                    const currentItemDisc = parseFloat(item.discount_amount) || 0;
                    const itemPriceListRate = parseFloat(item.price_list_rate) || ((parseFloat(item.rate) || 0) + (currentItemDisc / qty));
                    return acc + (itemPriceListRate * qty);
                  }, 0);

                  // Commercial Offer Rate: discount_amount deduction from price_list_rate
                  const offerRate = Math.max(0, totalPriceListRate - discount);

                  // Map each item with its display amount (discount applied ONLY to Commercial Unit)
                  const itemsWithAmounts = allItems.map(item => {
                    const isComm = isCommercialItem(item);
                    const qty = parseFloat(item.qty) || 1;
                    let finalAmt = 0;
                    if (isComm) {
                      const currentItemDisc = parseFloat(item.discount_amount) || 0;
                      const baseRate = parseFloat(item.price_list_rate) || ((parseFloat(item.rate) || 0) + (currentItemDisc / qty));
                      const baseTotal = baseRate * qty;
                      finalAmt = Math.max(0, baseTotal - discount);
                    } else {
                      finalAmt = item.amount !== undefined && item.amount !== null
                        ? parseFloat(item.amount)
                        : (qty * (parseFloat(item.rate) || 0));
                    }
                    return { ...item, finalAmt, isCommercial: isComm };
                  });

                  const calculatedNetTotal = itemsWithAmounts.reduce((acc, it) => acc + it.finalAmt, 0);
                  const allItemsTotal = allItems.reduce((acc, it) => acc + ((parseFloat(it.price_list_rate) || parseFloat(it.rate) || 0) * (parseFloat(it.qty) || 1)), 0);
                  const baseTotal = selectedQuotationDetail.total || allItemsTotal || totalPriceListRate;
                  const taxRatePct = baseTotal > 0 && selectedQuotationDetail.total_taxes_and_charges
                    ? (selectedQuotationDetail.total_taxes_and_charges / baseTotal)
                    : 0.15;
                  const calculatedTaxes = calculatedNetTotal * taxRatePct;
                  const calculatedGrandTotal = calculatedNetTotal + calculatedTaxes;

                  const offeredPrice = offerRate;
                  const currentPrice = calculatedGrandTotal;

                  const activeNegotiations = negotiations || [];

                  const diffPct = totalPriceListRate > 0 ? ((discount / totalPriceListRate) * 100).toFixed(2) : '0.00';

                  const isTerminal = ["Approved", "Rejected", "Cancelled"].includes(selectedQuotationDetail.workflow_state || selectedQuotationDetail.status);
                  const isRequestForApproval = (selectedQuotationDetail.workflow_state || "").toLowerCase().includes("request");
                  const isDiscountDisabled = isTerminal;
                  const isApproved = (selectedQuotationDetail.workflow_state || selectedQuotationDetail.status) === "Approved";
                  const isDisabled = isTerminal;

                  const activeComments = comments.length > 0 ? comments : [
                    {
                      comment_by: selectedQuotationDetail.custom_last_negotiated_by || selectedQuotationDetail.owner || 'Sales Team',
                      content: selectedQuotationDetail.custom_negotiation_status || 'Initial quotation created.',
                      creation: selectedQuotationDetail.creation ? selectedQuotationDetail.creation.split('.')[0] : (selectedQuotationDetail.modified ? selectedQuotationDetail.modified.split('.')[0] : new Date().toISOString().split('T')[0])
                    }
                  ];

                  const stripHtml = (html) => {
                    if (!html) return '';
                    return html.replace(/<[^>]*>?/gm, '');
                  };

                  if (activeTab === 'SUMMARY') {
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, overflowY: 'auto', paddingRight: 4, minHeight: 0 }}>

                        {/* ROW 1: Price Comparison & Price Breakdown */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flexShrink: 0, alignItems: 'start' }}>
                          {/* Price Comparison */}
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', marginBottom: 6 }}>Price Comparison</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: 12, padding: 14, background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb', textAlign: 'center', minHeight: 135, boxSizing: 'border-box' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: 10.5, color: '#6b7280', fontWeight: 600 }}>Price List Rate</div>
                                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 3 }}>${totalPriceListRate.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
                              </div>
                              <div style={{ borderLeft: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: 10.5, color: '#6b7280', fontWeight: 600 }}>Offer Rate</div>
                                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 3, color: 'var(--brand-color)' }}>${offerRate.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
                              </div>
                              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: 10.5, color: '#6b7280', fontWeight: 600 }}>Negotiated Discount ({companyDetails.currency || 'FJD'})</div>
                                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 3, color: '#eab308' }}>${discount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
                              </div>
                              <div style={{ borderLeft: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb', paddingTop: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: 10.5, color: '#6b7280', fontWeight: 600 }}>Difference</div>
                                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 3, color: '#ef4444' }}>
                                  {parseFloat(diffPct) > 0 ? `-${diffPct}%` : '0.00%'}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Price Breakdown */}
                          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 135, boxSizing: 'border-box' }}>
                            <div style={{ background: '#f9fafb', padding: '10px 14px', borderBottom: '1px solid #e5e7eb', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', color: '#4b5563', flexShrink: 0 }}>
                              Price Breakdown (Current)
                            </div>
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
                                  {itemsWithAmounts.map((item, idx) => {
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
                                          {item.isCommercial && discount > 0 && (
                                            <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 600, marginLeft: 6 }}>
                                              (Disc: -${discount.toLocaleString()})
                                            </span>
                                          )}
                                        </td>
                                        <td style={{ padding: '8px 12px', textAlign: 'center', color: '#4b5563', fontWeight: 500 }}>
                                          {areaVal && areaVal !== '—' ? `${areaVal} sqft` : '—'}
                                        </td>
                                        <td style={{ padding: '8px 12px', textAlign: 'right', color: '#111827', fontWeight: 700 }}>
                                          ${item.finalAmt.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                            <div style={{ padding: '10px 14px', background: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 5, fontSize: 11, flexShrink: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                                <span>Net Total</span>
                                <span style={{ fontWeight: 600, color: '#111827' }}>${(calculatedNetTotal + discount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', fontWeight: 600 }}>
                                <span>Negotiated Discount</span>
                                <span>-${discount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                                <span>Taxes (VAT @ {(taxRatePct * 100).toFixed(1)}%)</span>
                                <span>${calculatedTaxes.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 800, fontSize: 13, borderTop: '1px solid #e5e7eb', paddingTop: 6 }}>
                                <span>Grand Total ({companyDetails.currency || 'FJD'})</span>
                                <span>${calculatedGrandTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ROW 2: Negotiation Timeline & Negotiation Remarks */}
                        <div style={{ display: 'grid', gridTemplateColumns: activeNegotiations.length > 0 ? '1fr 1fr' : '1fr', gap: 16, flexShrink: 0, alignItems: 'start' }}>
                          {/* Negotiation Timeline - Only rendered when negotiation comments exist */}
                          {activeNegotiations.length > 0 && (
                            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                              <div style={{ background: '#f9fafb', padding: '10px 14px', borderBottom: '1px solid #e5e7eb', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', color: '#4b5563', flexShrink: 0 }}>
                                Negotiation Timeline
                              </div>
                              <div style={{ flex: 1, maxHeight: 180, overflowY: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, textAlign: 'left' }}>
                                  <thead>
                                    <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb', fontWeight: 600, color: '#4b5563' }}>
                                      <th style={{ padding: '8px 10px' }}>Version</th>
                                      <th style={{ padding: '8px 10px' }}>Date</th>
                                      <th style={{ padding: '8px 10px' }}>By</th>
                                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Discount</th>
                                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Grand Total</th>
                                      <th style={{ padding: '8px 10px' }}>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {activeNegotiations.map((n, idx) => {
                                      const isCurrent = n.name === selectedQuotationDetail.name;
                                      return (
                                        <tr
                                          key={`${n.name || 'neg'}-${idx}`}
                                          style={{
                                            borderBottom: '1px solid #e5e7eb',
                                            backgroundColor: isCurrent ? 'rgba(16, 185, 129, 0.05)' : 'transparent'
                                          }}
                                        >
                                          <td style={{ padding: '8px 10px', fontWeight: 600 }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <span style={{
                                                  fontSize: 10,
                                                  fontWeight: 700,
                                                  padding: '2px 6px',
                                                  borderRadius: 4,
                                                  background: isCurrent ? '#dcfce7' : '#f1f5f9',
                                                  color: isCurrent ? '#166534' : '#475569'
                                                }}>
                                                  V{n.version_no}
                                                </span>
                                                {isCurrent && (
                                                  <span style={{ fontSize: 9.5, color: '#16a34a', fontWeight: 700 }}>
                                                    (Active)
                                                  </span>
                                                )}
                                              </div>
                                              <span style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
                                                {n.name}
                                              </span>
                                            </div>
                                          </td>
                                          <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{n.negotiation_date ? n.negotiation_date.split(' ')[0] : '—'}</td>
                                          <td style={{ padding: '8px 10px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 100 }} title={n.negotiation_by}>
                                            {n.negotiation_by ? n.negotiation_by.split('@')[0] : '—'}
                                          </td>
                                          <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: '#eab308' }}>${(n.current_discount || 0).toLocaleString()}</td>
                                          <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>${(n.current_grand_total || 0).toLocaleString()}</td>
                                          <td style={{ padding: '8px 10px' }}>
                                            <span style={{
                                              padding: '3px 8px',
                                              borderRadius: 8,
                                              fontSize: 9.5,
                                              fontWeight: 700,
                                              backgroundColor: n.negotiation_status === 'Approved' ? '#dcfce7' : n.negotiation_status === 'Cancelled' ? '#fee2e2' : n.negotiation_status === 'Pending Approval' || n.negotiation_status === 'Pending' || n.negotiation_status === 'Draft' ? '#fef3c7' : '#e0f2fe',
                                              color: n.negotiation_status === 'Approved' ? '#166534' : n.negotiation_status === 'Cancelled' ? '#991b1b' : n.negotiation_status === 'Pending Approval' || n.negotiation_status === 'Pending' || n.negotiation_status === 'Draft' ? '#d97706' : '#0369a1'
                                            }}>
                                              {n.negotiation_status || 'Submitted'}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Negotiation Remarks */}
                          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ background: '#f9fafb', padding: '10px 14px', borderBottom: '1px solid #e5e7eb', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', color: '#4b5563', flexShrink: 0 }}>
                              Negotiation Remarks
                            </div>
                            {selectedQuotationDetail && selectedQuotationDetail.remarks && (
                              <p style={{ margin: '8px 12px', fontSize: 11, color: '#4b5563', lineHeight: 1.4, background: '#f9fafb', padding: '8px 12px', borderRadius: 4 }}>
                                {selectedQuotationDetail.remarks}
                              </p>
                            )}
                            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10, flex: 1, maxHeight: 180, overflowY: 'auto' }}>
                              {activeComments.map((c, idx) => {
                                const isSales = c.comment_by?.includes('devteam') || c.comment_by?.includes('sales') || c.comment_email?.includes('devteam') || c.comment_email?.includes('sales') || c.owner?.includes('devteam');
                                return (
                                  <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: isSales ? '#e0f2fe' : '#f3e8ff', color: isSales ? '#0369a1' : '#6b21a8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 10.5 }}>
                                      {isSales ? 'S' : 'C'}
                                    </div>
                                    <div style={{ flex: 1, background: isSales ? '#f0f9ff' : '#faf5ff', padding: '8px 12px', borderRadius: '0 8px 8px 8px', border: `1px solid ${isSales ? '#bae6fd' : '#e9d5ff'}` }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                        <span style={{ fontSize: 10.5, fontWeight: 700, color: isSales ? '#0369a1' : '#6b21a8' }}>
                                          {isSales ? 'Sales Team' : 'Customer'}
                                        </span>
                                        <span style={{ fontSize: 9.5, color: '#9ca3af' }}>{c.creation ? c.creation.split(' ')[0] : '—'}</span>
                                      </div>
                                      <div style={{ fontSize: 11, color: '#374151', lineHeight: 1.4 }}>{stripHtml(c.content)}</div>
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
                      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, flex: 1, overflowY: 'auto', minHeight: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: 11.5, color: '#4b5563', textTransform: 'uppercase' }}>Revision Version History</span>
                          <span style={{ fontSize: 10.5, color: '#6b7280' }}>Family: <strong style={{ color: 'var(--brand-color)' }}>{getRootQuotationName(selectedQuotationDetail.name, selectedQuotationDetail)}</strong> ({activeNegotiations.length} Version{activeNegotiations.length > 1 ? 's' : ''})</span>
                        </div>
                        {activeNegotiations.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280', fontSize: 12 }}>
                            No negotiation version history found for this quotation.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {activeNegotiations.map((n, idx) => {
                              const isCurrent = n.name === selectedQuotationDetail.name;
                              return (
                                <div key={`${n.name || 'neg'}-${idx}`} style={{ borderLeft: `3px solid ${isCurrent ? 'var(--brand-color)' : '#9ca3af'}`, background: isCurrent ? '#f0fdf4' : '#fafafa', padding: '12px 14px', borderRadius: '0 8px 8px 0', border: `1px solid ${isCurrent ? '#bbf7d0' : '#e5e7eb'}`, borderLeftWidth: 3 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <strong style={{ fontSize: 12.5, color: '#111827' }}>Version {n.version_no}: {n.name}</strong>
                                      {isCurrent && (
                                        <span style={{ fontSize: 9.5, padding: '2px 7px', borderRadius: 4, background: '#16a34a', color: '#ffffff', fontWeight: 700 }}>
                                          Current Active
                                        </span>
                                      )}
                                      <span style={{
                                        fontSize: 9.5,
                                        padding: '2px 7px',
                                        borderRadius: 8,
                                        fontWeight: 700,
                                        backgroundColor: n.negotiation_status === 'Approved' ? '#dcfce7' : n.negotiation_status === 'Cancelled' ? '#fee2e2' : '#fef3c7',
                                        color: n.negotiation_status === 'Approved' ? '#166534' : n.negotiation_status === 'Cancelled' ? '#991b1b' : '#92400e'
                                      }}>
                                        {n.negotiation_status}
                                      </span>
                                    </div>
                                    <span style={{ fontSize: 10.5, color: '#6b7280' }}>{n.negotiation_date}</span>
                                  </div>
                                  <p style={{ margin: '8px 0 6px 0', fontSize: 11.5, color: '#4b5563', lineHeight: 1.5 }}>
                                    Managed by <strong>{n.negotiation_by}</strong>. Grand Total: <strong>${(n.current_grand_total || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</strong> | Negotiated Discount: <strong>${(n.current_discount || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</strong>.
                                  </p>
                                  {!isCurrent && (
                                    <button
                                      type="button"
                                      onClick={() => fetchQuotationDetail(n.name, selectedQuotationDetail.party_name || selectedQuotationDetail.customer)}
                                      style={{ marginTop: 4, padding: '4px 12px', fontSize: 10.5, fontWeight: 700, borderRadius: 4, border: '1px solid #cbd5e1', background: '#ffffff', color: 'var(--brand-color)', cursor: 'pointer' }}
                                    >
                                      Switch to View Version {n.version_no} ({n.name})
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (activeTab === 'COMPARISON') {
                    const sortedComp = activeNegotiations.slice().sort((a, b) => a.version_no - b.version_no);
                    return (
                      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', minHeight: 0 }}>
                        <div style={{ background: '#f9fafb', padding: '10px 14px', borderBottom: '1px solid #e5e7eb', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', color: '#4b5563', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                          <span>Version-by-Version Comparison</span>
                          <span style={{ textTransform: 'none', fontWeight: 600, color: '#6b7280', fontSize: 10.5 }}>Family: {getRootQuotationName(selectedQuotationDetail.name, selectedQuotationDetail)}</span>
                        </div>
                        {sortedComp.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280', fontSize: 12 }}>
                            No negotiation versions available to compare.
                          </div>
                        ) : (
                          <div style={{ overflowX: 'auto', flex: 1 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, textAlign: 'left', minWidth: 460 }}>
                              <thead>
                                <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                                  <th style={{ padding: '10px 14px' }}>Parameter</th>
                                  {sortedComp.map((n) => (
                                    <th key={n.name} style={{ padding: '10px 14px', textAlign: 'right', color: n.name === selectedQuotationDetail.name ? 'var(--brand-color)' : '#374151' }}>
                                      V{n.version_no} {n.name === selectedQuotationDetail.name ? '(Active)' : ''}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Quotation Code</td>
                                  {sortedComp.map((n) => (
                                    <td key={n.name} style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: n.name === selectedQuotationDetail.name ? 'var(--brand-color)' : '#111827' }}>
                                      {n.name}
                                    </td>
                                  ))}
                                </tr>
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Status</td>
                                  {sortedComp.map((n) => (
                                    <td key={n.name} style={{ padding: '10px 14px', textAlign: 'right' }}>
                                      <span style={{
                                        padding: '3px 8px',
                                        borderRadius: 8,
                                        fontSize: 9.5,
                                        fontWeight: 700,
                                        backgroundColor: n.negotiation_status === 'Approved' ? '#dcfce7' : n.negotiation_status === 'Cancelled' ? '#fee2e2' : '#fef3c7',
                                        color: n.negotiation_status === 'Approved' ? '#166534' : n.negotiation_status === 'Cancelled' ? '#991b1b' : '#92400e'
                                      }}>
                                        {n.negotiation_status}
                                      </span>
                                    </td>
                                  ))}
                                </tr>
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Date</td>
                                  {sortedComp.map((n) => (
                                    <td key={n.name} style={{ padding: '10px 14px', textAlign: 'right', color: '#6b7280' }}>{n.negotiation_date}</td>
                                  ))}
                                </tr>
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Price List Rate</td>
                                  {sortedComp.map((n) => (
                                    <td key={n.name} style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600 }}>${(n.price_list_rate || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                                  ))}
                                </tr>
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Discount Amount</td>
                                  {sortedComp.map((n) => (
                                    <td key={n.name} style={{ padding: '10px 14px', textAlign: 'right', color: '#eab308', fontWeight: 600 }}>${(n.current_discount || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                                  ))}
                                </tr>
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Net Total</td>
                                  {sortedComp.map((n) => (
                                    <td key={n.name} style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600 }}>${((parseFloat(n.current_net_total || 0) + parseFloat(n.current_discount || 0))).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                                  ))}
                                </tr>
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Grand Total</td>
                                  {sortedComp.map((n) => (
                                    <td key={n.name} style={{ padding: '10px 14px', textAlign: 'right', color: 'var(--brand-color)', fontWeight: 700 }}>${(n.current_grand_total || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                                  ))}
                                </tr>
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Negotiated By</td>
                                  {sortedComp.map((n) => (
                                    <td key={n.name} style={{ padding: '10px 14px', textAlign: 'right', color: '#4b5563' }}>{n.negotiation_by ? n.negotiation_by.split('@')[0] : '—'}</td>
                                  ))}
                                </tr>
                                <tr>
                                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Action</td>
                                  {sortedComp.map((n) => (
                                    <td key={n.name} style={{ padding: '10px 14px', textAlign: 'right' }}>
                                      {n.name === selectedQuotationDetail.name ? (
                                        <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 700 }}>Active</span>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => fetchQuotationDetail(n.name, selectedQuotationDetail.party_name || selectedQuotationDetail.customer)}
                                          style={{ padding: '3px 8px', fontSize: 10, fontWeight: 700, borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', color: 'var(--brand-color)', cursor: 'pointer' }}
                                        >
                                          View
                                        </button>
                                      )}
                                    </td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (activeTab === 'DOCUMENTS') {
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, overflowY: 'auto', minHeight: 0 }}>
                        {selectedQuotationDetail.signed_document && (
                          <div style={{ border: '1px solid #bbf7d0', borderRadius: 8, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4', flexShrink: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ width: 40, height: 40, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d' }}>
                                <CheckCircle2 size={20} />
                              </div>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <h5 style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: '#14532d' }}>Customer Signed Document</h5>
                                  <span style={{ fontSize: 9.5, fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '1px 6px', borderRadius: 4 }}>Uploaded</span>
                                </div>
                                <p style={{ margin: '3px 0 0 0', fontSize: 11, color: '#166534' }}>{getDocFileName(selectedQuotationDetail.signed_document)}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-outline-success btn-sm"
                              style={{ fontSize: 11, padding: '5px 12px', display: 'inline-flex', alignItems: 'center', gap: 5 }}
                              onClick={() => setPreviewModalDoc({ url: selectedQuotationDetail.signed_document, name: getDocFileName(selectedQuotationDetail.signed_document) })}
                            >
                              <Eye size={12} />
                              <span>Preview</span>
                            </button>
                          </div>
                        )}
                        {[
                          { title: 'PMS Offer Letter', desc: 'Official proposal offer letter with printable layouts.', type: 'Offer Letter' },
                          { title: 'Sales Contract Draft', desc: 'Standard leasing terms and conditions for commercial units.', type: 'Leasing Agreement' },
                          { title: 'Property Unit Booking Receipt', desc: 'Holding deposit transaction record.', type: 'Receipt' }
                        ].map((doc, idx) => (
                          <div key={idx} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb', flexShrink: 0 }}>
                            <div>
                              <h5 style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: '#1f2937' }}>{doc.title}</h5>
                              <p style={{ margin: '3px 0 0 0', fontSize: 11, color: '#6b7280' }}>{doc.desc}</p>
                            </div>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: 11, padding: '5px 12px' }}
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
                const commercialItem = (selectedQuotationDetail.items || []).find(isCommercialItem);
                const originalDiscount = commercialItem && commercialItem.discount_amount !== undefined && commercialItem.discount_amount !== null
                  ? String(commercialItem.discount_amount)
                  : (selectedQuotationDetail.discount_amount !== undefined && selectedQuotationDetail.discount_amount !== null ? String(selectedQuotationDetail.discount_amount) : '0');
                const isChanged = (discountAmount !== '' && parseFloat(discountAmount || 0) !== parseFloat(originalDiscount || 0)) || messageText.trim() !== '';
                const isTerminal = ["Approved", "Rejected", "Cancelled"].includes(selectedQuotationDetail.workflow_state || selectedQuotationDetail.status);
                const isRequestForApproval = (selectedQuotationDetail.workflow_state || "").toLowerCase().includes("request");
                const isDiscountDisabled = isTerminal;
                const isApproved = (selectedQuotationDetail.workflow_state || selectedQuotationDetail.status) === "Approved";
                const isDisabled = isTerminal;
                const activeNegotiations = negotiations || [];

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, borderTop: '1px solid #e5e7eb', paddingTop: 10, flexShrink: 0 }}>
                    <style dangerouslySetInnerHTML={{
                      __html: `
                    .qtn-btn-base {
                      padding: 7px 14px;
                      font-size: 11px;
                      font-weight: 700;
                      min-height: 34px;
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
                      gap: 6px;
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
                      background-color: #0a6c66 !important;
                      border: 1px solid #0a6c66 !important;
                      color: #ffffff !important;
                    }
                    .qtn-btn-print:hover {
                      background-color: #085450 !important;
                      border-color: #085450 !important;
                      color: #ffffff !important;
                    }
                  ` }} />
                    {/* Left Column: Quotation Summary */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11.5 }}>
                      <span style={{ color: '#4b5563', fontWeight: 700, fontSize: 10.5, textTransform: 'uppercase' }}>Quotation Summary</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: 2 }}>
                          <span style={{ color: '#6b7280' }}>Versions Created</span>
                          <strong style={{ color: activeNegotiations.length > 1 ? 'var(--brand-color)' : '#111827' }}>
                            {activeNegotiations.length > 1
                              ? `${activeNegotiations.length} Versions (Active: V${(activeNegotiations.find(v => v.name === selectedQuotationDetail.name)?.version_no) || getQuotationVersionInfo(selectedQuotationDetail.name).version_no || 1})`
                              : (activeNegotiations.length === 1 ? `1 Version (V${activeNegotiations[0].version_no})` : 'Quotation Created')}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: 2 }}>
                          <span style={{ color: '#6b7280' }}>Total Discount</span>
                          <strong style={{ color: '#111827' }}>${(parseFloat(discountAmount !== '' ? discountAmount : (originalDiscount || 0)) || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</strong>
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
                      <span style={{ color: '#4b5563', fontWeight: 700, fontSize: 10.5, textTransform: 'uppercase' }}>Final Decision</span>

                      {/* SECTION: Upload Signed Document */}
                      <div
                        style={{
                          padding: '10px 12px',
                          borderRadius: 8,
                          border: selectedQuotationDetail.signed_document ? '1px solid #bbf7d0' : '1px dashed #cbd5e1',
                          backgroundColor: selectedQuotationDetail.signed_document ? '#f0fdf4' : '#f8fafc',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                          transition: 'all 0.2s ease',
                          marginTop: 2,
                          marginBottom: 4
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: selectedQuotationDetail.signed_document ? '#166534' : '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {selectedQuotationDetail.signed_document ? (
                              <CheckCircle2 size={13} color="#16a34a" />
                            ) : (
                              <FileText size={13} color="#64748b" />
                            )}
                            Upload Signed Document
                          </span>
                          <span
                            style={{
                              fontSize: 9.5,
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: 4,
                              letterSpacing: '0.02em',
                              backgroundColor: selectedQuotationDetail.signed_document ? '#dcfce7' : '#fef3c7',
                              color: selectedQuotationDetail.signed_document ? '#15803d' : '#b45309',
                              border: `1px solid ${selectedQuotationDetail.signed_document ? '#86efac' : '#fde68a'}`
                            }}
                          >
                            {selectedQuotationDetail.signed_document ? 'Ready for Booking' : 'Required for Booking'}
                          </span>
                        </div>

                        {selectedQuotationDetail.signed_document ? (
                          /* Document Preview & Management Box */
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 10,
                            background: '#ffffff',
                            padding: '6px 10px',
                            borderRadius: 6,
                            border: '1px solid #dcfce7'
                          }}>
                            <div
                              style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, cursor: 'pointer' }}
                              onClick={() => setPreviewModalDoc({ url: selectedQuotationDetail.signed_document, name: getDocFileName(selectedQuotationDetail.signed_document) })}
                              title="Click to preview document"
                            >
                              {isImageDoc(selectedQuotationDetail.signed_document) ? (
                                <img
                                  src={resolveMediaUrl(selectedQuotationDetail.signed_document, erpnextConfig?.url)}
                                  alt="Signed Doc"
                                  style={{ width: 34, height: 34, objectFit: 'cover', borderRadius: 4, border: '1px solid #e2e8f0' }}
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              ) : (
                                <div style={{ width: 34, height: 34, borderRadius: 4, background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                                  PDF
                                </div>
                              )}
                              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                <span style={{ fontSize: 11, fontWeight: 600, color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
                                  {getDocFileName(selectedQuotationDetail.signed_document)}
                                </span>
                                <span style={{ fontSize: 9.5, color: '#16a34a', fontWeight: 500 }}>
                                  Click to view full preview
                                </span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                              <button
                                type="button"
                                className="btn btn-light btn-sm"
                                style={{
                                  fontSize: 10.5,
                                  padding: '4px 10px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 5,
                                  color: '#1e293b',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: 6,
                                  backgroundColor: '#ffffff',
                                  cursor: 'pointer',
                                  fontWeight: 600
                                }}
                                onClick={() => setPreviewModalDoc({ url: selectedQuotationDetail.signed_document, name: getDocFileName(selectedQuotationDetail.signed_document) })}
                                title="Preview Document"
                              >
                                <Eye size={12} />
                                <span>Preview</span>
                              </button>
                              <button
                                type="button"
                                className="btn btn-light btn-sm"
                                style={{
                                  fontSize: 10.5,
                                  padding: '4px 10px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 5,
                                  color: '#dc2626',
                                  border: '1px solid #fecaca',
                                  borderRadius: 6,
                                  backgroundColor: '#fef2f2',
                                  cursor: 'pointer',
                                  fontWeight: 600
                                }}
                                onClick={handleRemoveSignedDocument}
                                title="Remove Signed Document"
                              >
                                <Trash2 size={12} />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Upload Attach Box */
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <p style={{ margin: 0, fontSize: 10.5, color: '#64748b', lineHeight: 1.35 }}>
                              Please attach the customer-signed offer letter. <strong>Create Booking</strong> will be enabled once uploaded.
                            </p>
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                padding: '6px 12px',
                                fontSize: 11,
                                fontWeight: 600,
                                borderRadius: 6,
                                backgroundColor: '#eff6ff',
                                border: '1px dashed #3b82f6',
                                color: '#1d4ed8',
                                cursor: uploadingSignedDoc ? 'wait' : 'pointer'
                              }}
                              onClick={() => signedDocInputRef.current?.click()}
                              disabled={uploadingSignedDoc}
                            >
                              {uploadingSignedDoc ? (
                                <>
                                  <Loader2 size={13} className="animate-spin" />
                                  <span>Uploading signed document...</span>
                                </>
                              ) : (
                                <>
                                  <Upload size={13} />
                                  <span>Attach Signed Document</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        <input
                          ref={signedDocInputRef}
                          type="file"
                          accept="image/*,application/pdf,.pdf"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleUploadSignedDocument(file);
                            }
                            e.target.value = '';
                          }}
                        />
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
                          <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
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

                            {/* Booking Action: For submitted/approved or any active quotation */}
                            {selectedQuotationDetail.booking_id ? (
                              <button
                                type="button"
                                className="qtn-btn-base qtn-btn-approve"
                                onClick={() => onGoToBooking && onGoToBooking({ ...selectedQuotationDetail, booking_id: selectedQuotationDetail.booking_id })}
                              >
                                <Check size={11} />
                                <span>Go to Booking</span>
                              </button>
                            ) : (
                              // Only enable and show Create Booking after signed document is uploaded/present
                              selectedQuotationDetail.signed_document && (selectedQuotationDetail.status !== 'Cancelled' && selectedQuotationDetail.docstatus !== 2) ? (
                                <button
                                  type="button"
                                  className="qtn-btn-base"
                                  style={{ background: '#2563eb', borderColor: '#2563eb', color: '#ffffff' }}
                                  onClick={() => handleCreateBooking(selectedQuotationDetail)}
                                  disabled={creatingBooking}
                                >
                                  <Bookmark size={11} />
                                  <span>{creatingBooking ? 'Creating Booking...' : 'Create Booking'}</span>
                                </button>
                              ) : null
                            )}

                            {/* New Version Button - Only show when Go to Booking is NOT shown */}
                            {!selectedQuotationDetail.booking_id && (
                              <button
                                id="qtn-new-version-action-btn"
                                type="button"
                                className="qtn-btn-base"
                                style={{
                                  background: '#eff6ff',
                                  borderColor: '#93c5fd',
                                  color: '#1d4ed8',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 6
                                }}
                                onClick={() => handleOpenNewVersion(selectedQuotationDetail)}
                                title={`Create Revised Quotation from ${selectedQuotationDetail.name}`}
                              >
                                <GitBranch size={11} color="#1d4ed8" />
                                <span>Revised Quotation</span>
                              </button>
                            )}

                            {/* Print Offer Letter Action */}
                            <button
                              id="qtn-print-action-btn"
                              type="button"
                              className="qtn-btn-base qtn-btn-print"
                              onClick={() => {
                                if (selectedQuotationDetail?.status === 'Cancelled' || selectedQuotationDetail?.workflow_state === 'Cancelled') {
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
                                                @page { size: auto; margin: 0mm; }
                                                body { margin: 15mm !important; padding: 0px !important; }
                                                .action-banner, .action-bar, header, footer { display: none !important; }
                                              }
                                            `;
                                            doc.head.appendChild(style);
                                            setTimeout(() => { printWindow.print(); }, 500);
                                          }
                                        }
                                      } catch (err) {
                                        console.warn("Failed to inject CSS to print window:", err);
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
                                      } catch (err) {
                                        // ignore cross-origin transitions
                                      }
                                    }, 100);
                                  }
                                }
                              }}
                            >
                              <Printer size={13} />
                              <span>Print Offer Letter</span>
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
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {/* Row 1: Tenant & Template */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
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
                    </div>

                    {/* Row 2: Valid Till, Start Date, End Date */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 20px' }}>
                      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Calendar size={14} style={{ color: '#137333' }} />
                          <span>Valid Till</span>
                        </label>
                        <input
                          type="date"
                          value={quoteValidTill}
                          onChange={(e) => handleValidTillChange(e.target.value)}
                          className="form-input"
                          required
                          disabled={submitting}
                          style={{ fontSize: 13, minHeight: 34, borderRadius: 8, border: '1px solid var(--border-color, #cbd5e1)' }}
                          min={formatDateToYMD(new Date())}
                        />
                      </div>

                      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Calendar size={14} style={{ color: '#137333' }} />
                          <span>Start Date</span>
                        </label>
                        <input
                          type="date"
                          value={quoteEstBookingStart}
                          onChange={(e) => handleStartDateChange(e.target.value)}
                          className="form-input"
                          required
                          disabled={submitting}
                          style={{ fontSize: 13, minHeight: 34, borderRadius: 8, border: '1px solid var(--border-color, #cbd5e1)' }}
                          min={calcNextDay(quoteValidTill)}
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
                          min={quoteEstBookingStart ? calcNextDay(quoteEstBookingStart) : ''}
                        />
                      </div>
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
                              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color, #e2e8f0)', background: item.isDefaultService ? '#faf5ff' : 'var(--bg-primary, #ffffff)' }}>

                                {/* # */}
                                <td style={{ padding: '8px 12px', color: 'var(--text-secondary, #94a3b8)', fontWeight: 500 }}>{idx + 1}</td>

                                {/* Unit Code */}
                                <td style={{ padding: '6px 8px' }}>
                                  {item.isDefaultService ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 11 }}>{item.itemName || item.unitId}</span>
                                        <span style={{ fontSize: 9, background: '#ede9fe', color: '#6d28d9', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>Default Service</span>
                                      </div>
                                      <span style={{ fontSize: 9.5, color: '#64748b' }}>
                                        Rate: ${(parseFloat(item.charges) || 0).toLocaleString()}/sqft × {(parseFloat(item.totalArea) || 0).toLocaleString()} sqft
                                      </span>
                                    </div>
                                  ) : (
                                    <select
                                      value={item.unitId}
                                      onChange={(e) => handleItemChange(idx, e.target.value)}
                                      className="form-select"
                                      style={{ width: '100%', fontSize: 11, minHeight: 32, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border-color, #cbd5e1)', boxSizing: 'border-box' }}
                                      required
                                    >
                                      <option value="">-- Choose Unit --</option>
                                      {(selProperty ? filteredUnits : spaceUnits).map(unit => {
                                        const isAlreadySelected = quoteItems.some((otherItem, oIdx) => oIdx !== idx && otherItem.unitId === unit.name);
                                        return (
                                          <option key={unit.name} value={unit.name} disabled={isAlreadySelected}>
                                            {unit.item_name || unit.name} {isAlreadySelected ? '(Already Added)' : ''}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  )}
                                </td>

                                {/* Val. Rate */}
                                <td style={{ padding: '8px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 500 }}>
                                  {item.loadingDetail ? '…' : (item.standardRate ? `$${(parseFloat(item.standardRate) || 0).toLocaleString()}` : '—')}
                                </td>

                                {/* Offered Rate */}
                                <td style={{ padding: '6px 8px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ color: 'var(--text-secondary, #475569)', fontWeight: 500 }}>$</span>
                                    {item.isDefaultService ? (
                                      <input
                                        type="text"
                                        value={typeof item.offeredRate === 'number' ? item.offeredRate.toLocaleString() : (item.offeredRate || '')}
                                        readOnly
                                        className="form-input"
                                        style={{
                                          width: '100%',
                                          fontSize: 11,
                                          minHeight: 32,
                                          padding: '4px 8px',
                                          borderRadius: 6,
                                          border: '1px solid var(--border-color, #cbd5e1)',
                                          background: '#f8fafc',
                                          color: '#334155',
                                          cursor: 'not-allowed',
                                          fontWeight: 600,
                                          boxSizing: 'border-box'
                                        }}
                                        title="Default service rates are calculated automatically based on total commercial carpet area and cannot be changed manually."
                                      />
                                    ) : (
                                      <input
                                        type="number"
                                        value={item.offeredRate}
                                        onChange={(e) => handleQtyOrRateChange(idx, 'offeredRate', e.target.value)}
                                        className="form-input"
                                        style={{ width: '100%', fontSize: 11, minHeight: 32, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border-color, #cbd5e1)', boxSizing: 'border-box' }}
                                        required
                                      />
                                    )}
                                  </div>
                                </td>

                                {/* Property Type */}
                                <td style={{ padding: '8px 12px', color: 'var(--text-secondary, #475569)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {item.loadingDetail ? '…' : (item.propertyGroup || (item.isDefaultService ? 'Default Service' : '—'))}
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
                                  {quoteItems.length > 1 && !item.isDefaultService && (
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

      {/* NEW VERSION MODAL */}
      {showNewVersionModal && versionTargetQuotation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: 'var(--bg-primary, #ffffff)',
            borderRadius: 16,
            width: '100%',
            maxWidth: 1100,
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-color, #e2e8f0)',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* MODAL HEADER */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-color, #e2e8f0)',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb'
                }}>
                  <GitBranch size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>
                      Create Revised Quotation
                    </h2>
                    {(() => {
                      const root = getRootQuotationName(versionTargetQuotation.name, versionTargetQuotation);
                      const vInfo = getQuotationVersionInfo(versionTargetQuotation.name, root);
                      return (
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 9999,
                          background: '#dbeafe',
                          color: '#1e40af',
                          border: '1px solid #bfdbfe'
                        }}>
                          Version {vInfo.version_no} → Version {vInfo.version_no + 1}
                        </span>
                      );
                    })()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3, fontSize: 11.5, color: '#64748b' }}>
                    <span>Source: <strong style={{ color: '#0f172a' }}>{versionTargetQuotation.name}</strong></span>
                    <span>•</span>
                    <span>Customer: <strong style={{ color: '#0f172a' }}>{versionTargetQuotation.customer_name || versionTargetQuotation.party_name}</strong></span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowNewVersionModal(false)}
                disabled={versionSubmitting}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                  fontSize: 18,
                  fontWeight: 600,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                title="Close"
              >
                ×
              </button>
            </div>

            {/* MODAL BODY */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* INFO CALLOUT BANNER */}
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 10,
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#166534' }}>
                  <span style={{ fontWeight: 700 }}>Notice:</span>
                  <span>Adjust the offered rate for each unit below to create a revised version. Service charges recalculate automatically.</span>
                </div>
                <div style={{ fontSize: 11, color: '#15803d', fontWeight: 600 }}>
                  Current Total: ${(versionTargetQuotation.grand_total || versionTargetQuotation.base_grand_total || 0).toLocaleString()}
                </div>
              </div>

              {/* DATES: START DATE & END DATE (MATCHING CREATE QUOTATION LOGIC) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                background: 'var(--bg-secondary, #f8fafc)',
                padding: '12px 16px',
                borderRadius: 10,
                border: '1px solid var(--border-color, #e2e8f0)'
              }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} style={{ color: '#137333' }} />
                    <span>Start Date</span>
                    <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={versionStartDate}
                    onChange={(e) => handleVersionStartDateChange(e.target.value)}
                    className="form-input"
                    required
                    disabled={versionSubmitting}
                    style={{ fontSize: 13, minHeight: 34, borderRadius: 8, border: '1px solid var(--border-color, #cbd5e1)', background: 'var(--bg-primary, #ffffff)', padding: '4px 10px' }}
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
                    <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={versionEndDate}
                    onChange={(e) => setVersionEndDate(e.target.value)}
                    className="form-input"
                    required
                    disabled={versionSubmitting}
                    style={{ fontSize: 13, minHeight: 34, borderRadius: 8, border: '1px solid var(--border-color, #cbd5e1)', background: 'var(--bg-primary, #ffffff)', padding: '4px 10px' }}
                    min={(() => {
                      if (!versionStartDate) return '';
                      const d = new Date(versionStartDate);
                      d.setFullYear(d.getFullYear() + 1);
                      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                    })()}
                  />
                </div>
              </div>

              {/* ITEMS TABLE SECTION (MATCHING SCREENSHOT) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary, #0f172a)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Quotation Items & Offered Rates
                  </span>
                  <button
                    type="button"
                    onClick={handleAddUnitToVersion}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      padding: '4px 10px',
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#2563eb',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <Plus size={12} />
                    <span>Add Unit</span>
                  </button>
                </div>

                <div style={{
                  border: '1px solid var(--border-color, #e2e8f0)',
                  borderRadius: 10,
                  overflow: 'hidden',
                  background: 'var(--bg-primary, #ffffff)'
                }}>
                  <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, textAlign: 'left', tableLayout: 'fixed' }}>
                      <colgroup>
                        <col style={{ width: 36 }} />
                        <col style={{ width: 230 }} />
                        <col style={{ width: 95 }} />
                        <col style={{ width: 125 }} />
                        <col style={{ width: 135 }} />
                        <col style={{ width: 95 }} />
                        <col style={{ width: 120 }} />
                        <col style={{ width: 95 }} />
                        <col style={{ width: 36 }} />
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
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {versionItems.map((item, idx) => (
                          <tr
                            key={idx}
                            style={{
                              borderBottom: '1px solid var(--border-color, #e2e8f0)',
                              background: item.isDefaultService ? '#faf5ff' : 'var(--bg-primary, #ffffff)'
                            }}
                          >
                            {/* # */}
                            <td style={{ padding: '8px 12px', color: 'var(--text-secondary, #94a3b8)', fontWeight: 500 }}>
                              {idx + 1}
                            </td>

                            {/* Unit Code */}
                            <td style={{ padding: '6px 8px' }}>
                              {item.isDefaultService ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 11 }}>
                                      {item.itemName || item.unitId}
                                    </span>
                                    <span style={{ fontSize: 9, background: '#ede9fe', color: '#6d28d9', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                                      Default Service
                                    </span>
                                  </div>
                                  <span style={{ fontSize: 9.5, color: '#64748b' }}>
                                    Rate: ${(parseFloat(item.charges) || 0).toLocaleString()}/sqft × {(parseFloat(item.totalArea) || 0).toLocaleString()} sqft
                                  </span>
                                </div>
                              ) : (
                                <select
                                  value={item.unitId}
                                  onChange={(e) => handleVersionUnitChange(idx, e.target.value)}
                                  className="form-select"
                                  style={{
                                    width: '100%',
                                    fontSize: 11,
                                    minHeight: 32,
                                    padding: '4px 8px',
                                    borderRadius: 6,
                                    border: '1px solid var(--border-color, #cbd5e1)',
                                    boxSizing: 'border-box'
                                  }}
                                  required
                                >
                                  <option value="">-- Choose Unit --</option>
                                  {spaceUnits.map(unit => {
                                    const isAlreadySelected = versionItems.some((otherItem, oIdx) => oIdx !== idx && otherItem.unitId === unit.name);
                                    return (
                                      <option key={unit.name} value={unit.name} disabled={isAlreadySelected}>
                                        {unit.item_name || unit.name} {isAlreadySelected ? '(Already Added)' : ''}
                                      </option>
                                    );
                                  })}
                                </select>
                              )}
                            </td>

                            {/* Val. Rate */}
                            <td style={{ padding: '8px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 500 }}>
                              {item.loadingDetail ? '…' : (item.standardRate ? `$${(parseFloat(item.standardRate) || 0).toLocaleString()}` : '—')}
                            </td>

                            {/* Offered Rate (Editable input) */}
                            <td style={{ padding: '6px 8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ color: 'var(--text-secondary, #475569)', fontWeight: 500 }}>$</span>
                                {item.isDefaultService ? (
                                  <input
                                    type="text"
                                    value={typeof item.offeredRate === 'number' ? item.offeredRate.toLocaleString() : (item.offeredRate || '')}
                                    readOnly
                                    className="form-input"
                                    style={{
                                      width: '100%',
                                      fontSize: 11,
                                      minHeight: 32,
                                      padding: '4px 8px',
                                      borderRadius: 6,
                                      border: '1px solid var(--border-color, #cbd5e1)',
                                      background: '#f8fafc',
                                      color: '#334155',
                                      cursor: 'not-allowed',
                                      fontWeight: 600,
                                      boxSizing: 'border-box'
                                    }}
                                    title="Default service rates are calculated automatically based on total commercial carpet area."
                                  />
                                ) : (
                                  <input
                                    type="number"
                                    step="any"
                                    value={item.offeredRate}
                                    onChange={(e) => handleVersionRateChange(idx, e.target.value)}
                                    className="form-input"
                                    style={{
                                      width: '100%',
                                      fontSize: 11,
                                      minHeight: 32,
                                      padding: '4px 8px',
                                      borderRadius: 6,
                                      border: '1px solid var(--border-color, #cbd5e1)',
                                      boxSizing: 'border-box'
                                    }}
                                    placeholder="0"
                                    required
                                  />
                                )}
                              </div>
                            </td>

                            {/* Property Group */}
                            <td style={{ padding: '8px 12px', color: 'var(--text-secondary, #475569)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.loadingDetail ? '…' : (item.propertyGroup || (item.isDefaultService ? 'Default Service' : '—'))}
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

                            {/* Delete Button */}
                            <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                              {versionItems.filter(it => !it.isDefaultService).length > 1 && !item.isDefaultService && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVersionItem(idx)}
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
                                  title="Remove unit"
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

                  {/* GRAND TOTAL ROW (MATCHES SCREENSHOT) */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 18px',
                    borderTop: '1px solid var(--border-color, #e2e8f0)',
                    background: 'var(--bg-secondary, #f8fafc)'
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary, #475569)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      GRAND TOTAL
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#059669' }}>
                      ${versionItems.reduce((sum, item) => sum + ((parseFloat(item.qty) || 1) * (parseFloat(item.offeredRate) || 0)), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* REVISION NOTES / REASON */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary, #475569)', marginBottom: 6 }}>
                  Revision / Negotiation Notes (Optional)
                </label>
                <textarea
                  value={versionNote}
                  onChange={(e) => setVersionNote(e.target.value)}
                  placeholder="Enter reason for this new version (e.g., revised rental rate agreed after client negotiation)..."
                  rows={2}
                  style={{
                    width: '100%',
                    fontSize: 12,
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-color, #cbd5e1)',
                    background: 'var(--bg-primary, #ffffff)',
                    color: 'var(--text-primary, #0f172a)',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

            </div>

            {/* MODAL FOOTER */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 12,
              padding: '14px 24px',
              borderTop: '1px solid var(--border-color, #e2e8f0)',
              background: 'var(--bg-secondary, #f8fafc)'
            }}>
              <button
                type="button"
                onClick={() => setShowNewVersionModal(false)}
                disabled={versionSubmitting}
                style={{
                  padding: '8px 18px',
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 8,
                  border: '1px solid var(--border-color, #cbd5e1)',
                  background: 'var(--bg-primary, #ffffff)',
                  color: 'var(--text-secondary, #475569)',
                  cursor: versionSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateNewVersion}
                disabled={versionSubmitting}
                style={{
                  padding: '8px 22px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  border: 'none',
                  cursor: versionSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {versionSubmitting ? (
                  <span>Creating Revised Quotation...</span>
                ) : (
                  <>
                    <GitBranch size={14} />
                    <span>Create Revised Quotation</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

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
                Confirm
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
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIGNED DOCUMENT PREVIEW MODAL */}
      {previewModalDoc && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10002,
          padding: '20px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '850px',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            overflow: 'hidden',
            border: '1px solid #e2e8f0'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: '#dbeafe',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileText size={16} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                    Signed Document Preview
                  </h4>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {previewModalDoc.name || 'Signed Document Attachment'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <a
                  href={resolveMediaUrl(previewModalDoc.url, erpnextConfig?.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <ExternalLink size={13} />
                  <span>Open in Tab</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewModalDoc(null)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f1f5f9',
              minHeight: '360px',
              flex: 1
            }}>
              {isImageDoc(previewModalDoc.url) ? (
                <img
                  src={resolveMediaUrl(previewModalDoc.url, erpnextConfig?.url)}
                  alt="Signed Document"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                  }}
                />
              ) : (
                <iframe
                  src={resolveMediaUrl(previewModalDoc.url, erpnextConfig?.url)}
                  title="Signed Document Preview"
                  style={{
                    width: '100%',
                    height: '70vh',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff'
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div >
  );
}