// // import React, { useState, useEffect } from 'react';
// // import { Calendar, User, Building, DollarSign, Plus, X, Search, Filter, Loader, Eye, RefreshCw, CheckCircle2 } from 'lucide-react';

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

// // export default function Booking({ erpnextConfig }) {
// //   const [bookings, setBookings] = useState([]);
// //   const [selectedBookingId, setSelectedBookingId] = useState(null);
// //   const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
// //   const [loadingDetails, setLoadingDetails] = useState(false);
// //   const [loadingList, setLoadingList] = useState(false);
// //   const [errorMsg, setErrorMsg] = useState('');
// //   const [successMsg, setSuccessMsg] = useState('');

// //   // Dynamic fields state from DocType metadata
// //   const [bookingFields, setBookingFields] = useState([]);
// //   const [loadingFields, setLoadingFields] = useState(false);

// //   // Search & filter states
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [statusFilter, setStatusFilter] = useState('All');
// //   const [typeFilter, setTypeFilter] = useState('All');
// //   const [customerFilter, setCustomerFilter] = useState('');

// //   // New booking form modal state
// //   const [showAddModal, setShowAddModal] = useState(false);
// //   const [formData, setFormData] = useState({});
// //   const [submitting, setSubmitting] = useState(false);
// //   const [syncStatus, setSyncStatus] = useState('');

// //   // Pagination
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 10;

// //   // Initial mock data if connection fails or starts empty
// //   const mockBookings = [
// //     {
// //       name: 'BOOK-0001',
// //       booking_date: '2026-06-10',
// //       customer: 'CUST-0001',
// //       customer_name: 'Biswajit Maity',
// //       customer_email: 'biswajit@example.com',
// //       customer_phone_no: '+679 999 1234',
// //       property: 'Suva Retail Complex - Suite 102',
// //       booking_type: 'Rent',
// //       status: 'Confirmed',
// //       payment_status: 'Paid',
// //       booking_amount: 1500.00,
// //       paid_amount: 1500.00,
// //       pending_amount: 0.00,
// //       starting_date: '2026-07-01',
// //       ending_date: '2027-06-30',
// //       total_days: '365',
// //       advance_amount: 500.00,
// //       payment_method: 'Bank Transfer'
// //     },
// //     {
// //       name: 'BOOK-0002',
// //       booking_date: '2026-06-11',
// //       customer: 'CUST-0002',
// //       customer_name: 'Jane Doe',
// //       customer_email: 'jane.doe@example.com',
// //       customer_phone_no: '+679 888 5678',
// //       property: 'Nadi Residential Villa - Unit A',
// //       booking_type: 'Lease',
// //       status: 'Pending',
// //       payment_status: 'Partially Paid',
// //       booking_amount: 2500.00,
// //       paid_amount: 1000.00,
// //       pending_amount: 1500.00,
// //       starting_date: '2026-08-01',
// //       ending_date: '2028-07-31',
// //       total_days: '730',
// //       advance_amount: 1000.00,
// //       payment_method: 'Credit Card'
// //     }
// //   ];

// //   // Fetch DocType fields metadata to construct dynamic form
// //   const fetchDocTypeFields = async () => {
// //     if (!erpnextConfig || !erpnextConfig.url) return;
// //     setLoadingFields(true);
// //     try {
// //       const res = await fetch(`${erpnextConfig.url}/api/resource/DocType/Booking`, {
// //         credentials: 'include',
// //       headers: {
// //           'Content-Type': 'application/json'
// //         }
// //       });
// //       if (res.ok) {
// //         const json = await res.json();
// //         const rawFields = json.data?.fields || [];
// //         // Filter relevant writable fields
// //         const filtered = rawFields.filter(f => 
// //           f.fieldname && 
// //           f.label && 
// //           f.fieldtype !== 'Section Break' && 
// //           f.fieldtype !== 'Column Break' && 
// //           f.fieldtype !== 'Table' &&
// //           f.fieldtype !== 'Heading' &&
// //           !f.read_only &&
// //           f.fieldname !== 'amended_from' &&
// //           f.fieldname !== 'workflow_state'
// //         );
// //         setBookingFields(filtered);

// //         // Initialize default form data
// //         const defaults = {};
// //         filtered.forEach(f => {
// //           defaults[f.fieldname] = f.default || '';
// //         });
// //         setFormData(defaults);
// //       }
// //     } catch (err) {
// //       console.warn('Failed to fetch Booking DocType fields:', err);
// //     } finally {
// //       setLoadingFields(false);
// //     }
// //   };

// //   // Fetch bookings list using custom API, falling back to resource endpoint or mock data
// //   const fetchBookings = async (cust = '') => {
// //     setLoadingList(true);
// //     setErrorMsg('');
// //     try {
// //       let dataList = [];
// //       if (erpnextConfig && erpnextConfig.url) {
// //         // Build url based on filter
// //         const apiPath = cust 
// //           ? `/api/method/erpnext.api.booking.get_bookings?customer=${encodeURIComponent(cust)}` 
// //           : `/api/method/erpnext.api.booking.get_bookings`;

// //         setSyncStatus('Fetching from ERPNext custom API...');
// //         try {
// //           const res = await fetch(`${erpnextConfig.url}${apiPath}`, {
// //             credentials: 'include',
// //       headers: {
// //               'Content-Type': 'application/json'
// //             }
// //           });
// //           if (res.ok) {
// //             const json = await res.json();
// //             dataList = json.message || json.data || [];
// //           } else {
// //             throw new Error('Method not found or error response');
// //           }
// //         } catch (methodErr) {
// //           console.warn('Custom API method failed, trying standard resource API...', methodErr);
// //           setSyncStatus('Syncing via ERPNext REST Resource API...');

// //           // Standard resource fallback
// //           let resourceUrl = `${erpnextConfig.url}/api/resource/Booking?fields=["name","booking_date","customer","customer_name","booking_type","status","payment_status","booking_amount","paid_amount","pending_amount","starting_date","ending_date","property"]&limit_page_length=200`;
// //           if (cust) {
// //             resourceUrl += `&filters=[["Booking","customer","=","${cust}"]]`;
// //           }
// //           const res = await fetch(resourceUrl, {
// //             credentials: 'include',
// //       headers: {
// //               'Content-Type': 'application/json'
// //             }
// //           });
// //           if (res.ok) {
// //             const json = await res.json();
// //             dataList = json.data || [];
// //           } else {
// //             throw new Error('Standard resource API request failed');
// //           }
// //         }
// //       }

// //       if (Array.isArray(dataList) && dataList.length > 0) {
// //         setBookings(dataList);
// //         setSyncStatus('Synchronized');
// //       } else {
// //         setBookings(mockBookings);
// //         setSyncStatus('Offline Mode (Showing Mocks)');
// //       }
// //     } catch (err) {
// //       console.warn('Booking fetch failed, falling back to mock data:', err);
// //       setBookings(mockBookings);
// //       setSyncStatus('Offline Mode (Showing Mocks)');
// //     } finally {
// //       setLoadingList(false);
// //     }
// //   };

// //   // Fetch detailed booking record
// //   const fetchBookingDetails = async (id) => {
// //     setLoadingDetails(true);
// //     setSelectedBookingDetails(null);
// //     try {
// //       let details = null;
// //       if (erpnextConfig && erpnextConfig.url) {
// //         try {
// //           // Attempt custom method 1: get_booking_details
// //           const res = await fetch(`${erpnextConfig.url}/api/method/erpnext.api.booking.get_booking_details?booking_id=${id}`, {
// //             credentials: 'include',
// //       headers: {
// //               'Content-Type': 'application/json'
// //             }
// //           });
// //           if (res.ok) {
// //             const json = await res.json();
// //             details = json.message || json.data;
// //           } else {
// //             // Attempt custom method 2: get_booking
// //             const res2 = await fetch(`${erpnextConfig.url}/api/method/erpnext.api.booking.get_booking?booking_id=${id}`, {
// //               credentials: 'include',
// //       headers: {
// //                 'Content-Type': 'application/json'
// //               }
// //             });
// //             if (res2.ok) {
// //               const json2 = await res2.json();
// //               details = json2.message || json2.data;
// //             } else {
// //               throw new Error('Details methods failed');
// //             }
// //           }
// //         } catch (detailErr) {
// //           console.warn('Custom details APIs failed, loading via resource detail...', detailErr);
// //           // Standard resource detail fallback
// //           const res = await fetch(`${erpnextConfig.url}/api/resource/Booking/${id}`, {
// //             credentials: 'include',
// //       headers: {
// //               'Content-Type': 'application/json'
// //             }
// //           });
// //           if (res.ok) {
// //             const json = await res.json();
// //             details = json.data;
// //           }
// //         }
// //       }

// //       if (details) {
// //         setSelectedBookingDetails(details);
// //       } else {
// //         // Mock detail fallback
// //         const mockDetail = bookings.find(b => b.name === id || b.id === id);
// //         setSelectedBookingDetails(mockDetail || null);
// //       }
// //     } catch (err) {
// //       console.warn('Failed to load booking details:', err);
// //       const mockDetail = bookings.find(b => b.name === id || b.id === id);
// //       setSelectedBookingDetails(mockDetail || null);
// //     } finally {
// //       setLoadingDetails(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchBookings();
// //     fetchDocTypeFields();
// //   }, [erpnextConfig]);

// //   // Handle Form Input Changes
// //   const handleInputChange = (fieldname, value) => {
// //     setFormData(prev => ({
// //       ...prev,
// //       [fieldname]: value
// //     }));
// //   };

// //   // Submit new booking
// //   const handleCreateBooking = async (e) => {
// //     e.preventDefault();
// //     setErrorMsg('');
// //     setSuccessMsg('');
// //     setSubmitting(true);

// //     // Validate mandatory fields
// //     const missing = bookingFields.filter(f => f.reqd && !formData[f.fieldname]);
// //     if (missing.length > 0) {
// //       setErrorMsg(`Required fields missing: ${missing.map(f => f.label).join(', ')}`);
// //       setSubmitting(false);
// //       return;
// //     }

// //     try {
// //       let savedDoc = null;
// //       if (erpnextConfig && erpnextConfig.url) {
// //         // Try custom API first
// //         try {
// //           const res = await fetch(`${erpnextConfig.url}/api/method/erpnext.api.booking.create_booking`, {
// //             method: 'POST',
// //             credentials: 'include',
// //             headers: {
// //               'Content-Type': 'application/json',
// //               'X-Frappe-CSRF-Token': getCsrfToken()
// //             },
// //             body: JSON.stringify(formData)
// //           });
// //           if (res.ok) {
// //             const json = await res.json();
// //             savedDoc = json.message || json.data;
// //           } else {
// //             throw new Error('Custom creation method failed');
// //           }
// //         } catch (createErr) {
// //           console.warn('Custom create method failed, posting to resource Booking API...', createErr);
// //           // Standard resource fallback
// //           const res = await fetch(`${erpnextConfig.url}/api/resource/Booking`, {
// //             method: 'POST',
// //             credentials: 'include',
// //             headers: {
// //               'Content-Type': 'application/json',
// //               'X-Frappe-CSRF-Token': getCsrfToken()
// //             },
// //             body: JSON.stringify(formData)
// //           });
// //           if (res.ok) {
// //             const json = await res.json();
// //             savedDoc = json.data;
// //           } else {
// //             let errorDetail = 'Failed to create booking document on ERPNext';
// //             try {
// //               const errJson = await res.json();
// //               if (errJson._server_messages) {
// //                 const messages = JSON.parse(errJson._server_messages);
// //                 errorDetail = messages.map(m => {
// //                   try {
// //                     const parsed = JSON.parse(m);
// //                     return parsed.message || parsed;
// //                   } catch {
// //                     return String(m);
// //                   }
// //                 }).join(', ');
// //               }
// //             } catch {}
// //             throw new Error(errorDetail);
// //           }
// //         }
// //       }

// //       if (savedDoc) {
// //         setSuccessMsg(`Booking ${savedDoc.name || 'created'} synced successfully with ERPNext!`);
// //         fetchBookings();
// //         setShowAddModal(false);
// //       } else {
// //         // Mock save if not connected to ERPNext
// //         const generatedId = `BOOK-${Math.floor(1000 + Math.random() * 9000)}`;
// //         const localDoc = {
// //           name: generatedId,
// //           ...formData,
// //           booking_date: formData.booking_date || new Date().toISOString().split('T')[0],
// //           status: formData.status || 'Pending',
// //           payment_status: formData.payment_status || 'Unpaid'
// //         };
// //         setBookings([localDoc, ...bookings]);
// //         setSuccessMsg('Booking saved locally (Offline mode)');
// //         setShowAddModal(false);
// //       }
// //     } catch (err) {
// //       setErrorMsg(err.message || 'Error creating booking document.');
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   // Quick Customer Filter trigger
// //   const handleCustomerFilterSubmit = (e) => {
// //     e.preventDefault();
// //     fetchBookings(customerFilter);
// //   };

// //   // Filtering on local state
// //   const filteredBookings = bookings.filter(b => {
// //     const term = searchTerm.toLowerCase();
// //     const matchSearch = 
// //       (b.name && b.name.toLowerCase().includes(term)) ||
// //       (b.customer && b.customer.toLowerCase().includes(term)) ||
// //       (b.customer_name && b.customer_name.toLowerCase().includes(term)) ||
// //       (b.property && b.property.toLowerCase().includes(term));

// //     const matchStatus = statusFilter === 'All' || b.status === statusFilter || b.payment_status === statusFilter;
// //     const matchType = typeFilter === 'All' || b.booking_type === typeFilter;

// //     return matchSearch && matchStatus && matchType;
// //   });

// //   // Pagination slice
// //   const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

// //   return (
// //     <div style={{ padding: '4px 0' }}>
// //       {/* Header section */}
// //       <div className="view-header" style={{ marginBottom: 20 }}>
// //         <div>
// //           <h1 className="view-title">Property Bookings</h1>
// //           <p className="view-subtitle">Manage lease/rent reservations, track customer deposits, and view contract workflows.</p>
// //         </div>
// //         <div style={{ display: 'flex', gap: 10 }}>
// //           <button 
// //             className="btn btn-secondary" 
// //             onClick={() => fetchBookings()} 
// //             style={{ display: 'flex', alignItems: 'center', gap: 6 }}
// //           >
// //             <RefreshCw size={14} className={loadingList ? 'spin' : ''} />
// //             Reload
// //           </button>
// //           <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
// //             <Plus size={16} /> New Booking
// //           </button>
// //         </div>
// //       </div>

// //       {/* Sync Status Banner */}
// //       {syncStatus && syncStatus !== 'Synchronized' && (
// //         <div style={{ 
// //           background: 'var(--bg-accent-alpha)', 
// //           border: '1px solid var(--border-color)', 
// //           borderRadius: 8, 
// //           padding: '8px 16px', 
// //           marginBottom: 16, 
// //           fontSize: 12, 
// //           color: 'var(--text-secondary)',
// //           display: 'flex',
// //           justifyContent: 'space-between',
// //           alignItems: 'center'
// //         }}>
// //           <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// //             <div style={{ width: 6, height: 6, borderRadius: '50%', background: syncStatus.includes('Offline') ? 'var(--color-warning)' : 'var(--color-success)' }} />
// //             <span>Connection Status: <strong>{syncStatus}</strong></span>
// //           </div>
// //           {successMsg && <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{successMsg}</span>}
// //         </div>
// //       )}

// //       {/* Control panel filters */}
// //       <div className="card-panel" style={{ padding: 16, marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
// //         <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
// //           <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
// //           <input 
// //             type="text" 
// //             placeholder="Search by ID, customer name, unit..." 
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             className="form-control"
// //             style={{ paddingLeft: 34, fontSize: 13 }}
// //           />
// //         </div>

// //         <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
// //           <Filter size={14} style={{ color: 'var(--text-muted)' }} />

// //           <select 
// //             value={typeFilter} 
// //             onChange={(e) => setTypeFilter(e.target.value)}
// //             className="form-control" 
// //             style={{ width: 120, fontSize: 13, padding: '4px 8px' }}
// //           >
// //             <option value="All">All Types</option>
// //             <option value="Rent">Rent</option>
// //             <option value="Sale">Sale</option>
// //             <option value="Lease">Lease</option>
// //           </select>

// //           <select 
// //             value={statusFilter} 
// //             onChange={(e) => setStatusFilter(e.target.value)}
// //             className="form-control" 
// //             style={{ width: 140, fontSize: 13, padding: '4px 8px' }}
// //           >
// //             <option value="All">All Statuses</option>
// //             <option value="Confirmed">Confirmed</option>
// //             <option value="Pending">Pending</option>
// //             <option value="Cancelled">Cancelled</option>
// //             <option value="Paid">Payment: Paid</option>
// //             <option value="Partially Paid">Payment: Partial</option>
// //             <option value="Unpaid">Payment: Unpaid</option>
// //           </select>
// //         </div>

// //         {/* Customer Sync API Filter Form */}
// //         <form onSubmit={handleCustomerFilterSubmit} style={{ display: 'flex', gap: 6, alignItems: 'center', borderLeft: '1px solid var(--border-color)', paddingLeft: 14 }}>
// //           <span style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Filter Customer ID:</span>
// //           <input 
// //             type="text" 
// //             placeholder="e.g. CUST-0001" 
// //             value={customerFilter} 
// //             onChange={(e) => {
// //               setCustomerFilter(e.target.value);
// //               // Fetch from ERPNext on change/clear
// //               fetchBookings(e.target.value);
// //             }}
// //             className="form-control"
// //             style={{ width: 120, padding: '4px 8px', fontSize: 12 }}
// //           />
// //           <button type="submit" className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }}>Search</button>
// //         </form>
// //       </div>

// //       {/* Grid view containing list & inspector */}
// //       <div className="grid-2col" style={{ gridTemplateColumns: selectedBookingId ? '60% calc(40% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>

// //         {/* Booking Table Card */}
// //         <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
// //           <div className="table-container">
// //             <table className="custom-table">
// //               <thead>
// //                 <tr>
// //                   <th>Booking ID</th>
// //                   <th>Booking Date</th>
// //                   <th>Tenant info</th>
// //                   <th>Property Unit</th>
// //                   <th>Property Group</th>
// //                   <th>Status</th>
// //                   <th>Amount</th>
// //                   <th>Payment Status</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {currentItems.map(b => (
// //                   <tr 
// //                     key={b.name || b.id}
// //                     onClick={() => {
// //                       setSelectedBookingId(b.name || b.id);
// //                       fetchBookingDetails(b.name || b.id);
// //                     }}
// //                     style={{ 
// //                       cursor: 'pointer',
// //                       backgroundColor: selectedBookingId === (b.name || b.id) ? 'var(--bg-accent-alpha)' : '',
// //                       borderLeft: selectedBookingId === (b.name || b.id) ? '3px solid var(--brand-color)' : ''
// //                     }}
// //                   >
// //                     <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{b.name || b.id}</td>
// //                     <td>{b.booking_date}</td>
// //                     <td>
// //                       <div style={{ fontWeight: 600 }}>{b.customer_name || b.customer}</div>
// //                       <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{b.customer_email || 'No email'}</div>
// //                     </td>
// //                     <td style={{ fontSize: 12, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// //                       {b.property || 'Not specified'}
// //                     </td>
// //                     <td>
// //                       <span className="badge badge-secondary" style={{ textTransform: 'none' }}>
// //                         {b.property_group || b.property || 'N/A'}
// //                       </span>
// //                     </td>
// //                     <td>
// //                       <span className={`badge ${b.status === 'Confirmed' ? 'badge-success' : b.status === 'Cancelled' ? 'badge-danger' : b.status === 'Pending'}`}>
// //                         {b.status || 'Pending'}
// //                       </span>
// //                     </td>
// //                     <td style={{ fontWeight: 600 }}>
// //                       ${parseFloat(b.booking_amount || b.amount_to_pay || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
// //                     </td>
// //                     <td>
// //                       <span className={`badge ${b.payment_status === 'Paid' ? 'badge-success' : b.payment_status === 'Partially Paid' ? 'badge-warning' : 'badge-danger'}`}>
// //                         {b.payment_status || 'Unpaid'}
// //                       </span>
// //                     </td>
// //                   </tr>
// //                 ))}

// //                 {filteredBookings.length === 0 && (
// //                   <tr>
// //                     <td colSpan="8" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
// //                       {loadingList ? 'Syncing with ERPNext Booking server...' : 'No booking records found.'}
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Pagination controls */}
// //           {totalPages > 1 && (
// //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderTop: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-secondary)' }}>
// //               <div>
// //                 Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, filteredBookings.length)}</strong> of <strong>{filteredBookings.length}</strong> bookings
// //               </div>
// //               <div style={{ display: 'flex', gap: 6 }}>
// //                 <button 
// //                   disabled={currentPage === 1}
// //                   onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
// //                   className="btn btn-secondary"
// //                   style={{ padding: '4px 10px', fontSize: 12 }}
// //                 >
// //                   Prev
// //                 </button>
// //                 {[...Array(totalPages)].map((_, i) => (
// //                   <button
// //                     key={i + 1}
// //                     onClick={() => setCurrentPage(i + 1)}
// //                     className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
// //                     style={{ padding: '4px 10px', fontSize: 12 }}
// //                   >
// //                     {i + 1}
// //                   </button>
// //                 ))}
// //                 <button 
// //                   disabled={currentPage === totalPages}
// //                   onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
// //                   className="btn btn-secondary"
// //                   style={{ padding: '4px 10px', fontSize: 12 }}
// //                 >
// //                   Next
// //                 </button>
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         {/* Detailed Inspector Side Panel */}
// //         {selectedBookingId && (
// //           <div className="card-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
// //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
// //               <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-color)' }}>{selectedBookingId} Details</span>
// //               <button 
// //                 onClick={() => setSelectedBookingId(null)} 
// //                 style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
// //               >
// //                 <X size={18} />
// //               </button>
// //             </div>

// //             {loadingDetails ? (
// //               <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
// //                 <Loader size={24} className="spin" style={{ margin: '0 auto 10px auto' }} />
// //                 <span>Loading details from ERPNext...</span>
// //               </div>
// //             ) : selectedBookingDetails ? (
// //               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

// //                 {/* Visual Header */}
// //                 <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 8 }}>
// //                   <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
// //                     <Calendar size={18} style={{ color: 'var(--brand-color)' }} />
// //                     <strong style={{ fontSize: 15, color: 'var(--text-primary)' }}>{selectedBookingDetails.property || 'Property Unit'}</strong>
// //                   </div>
// //                   <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
// //                     Type: <strong style={{ color: 'var(--text-secondary)' }}>{selectedBookingDetails.booking_type}</strong> | Status: <strong style={{ color: 'var(--color-success)' }}>{selectedBookingDetails.workflow_state || selectedBookingDetails.status || 'Pending'}</strong>
// //                   </div>
// //                 </div>

// //                 {/* Details list */}
// //                 <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
// //                   <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 6 }}>
// //                     <span style={{ color: 'var(--text-muted)' }}>Booking Date:</span>
// //                     <strong style={{ color: 'var(--text-secondary)' }}>{selectedBookingDetails.booking_date}</strong>
// //                   </div>

// //                   <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 6 }}>
// //                     <span style={{ color: 'var(--text-muted)' }}>Customer Name:</span>
// //                     <strong style={{ color: 'var(--text-secondary)' }}>{selectedBookingDetails.customer_name}</strong>
// //                   </div>

// //                   {selectedBookingDetails.customer_email && (
// //                     <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 6 }}>
// //                       <span style={{ color: 'var(--text-muted)' }}>Customer Email:</span>
// //                       <strong style={{ color: 'var(--text-secondary)' }}>{selectedBookingDetails.customer_email}</strong>
// //                     </div>
// //                   )}

// //                   {selectedBookingDetails.customer_phone_no && (
// //                     <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 6 }}>
// //                       <span style={{ color: 'var(--text-muted)' }}>Phone Number:</span>
// //                       <strong style={{ color: 'var(--text-secondary)' }}>{selectedBookingDetails.customer_phone_no}</strong>
// //                     </div>
// //                   )}

// //                   <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 6 }}>
// //                     <span style={{ color: 'var(--text-muted)' }}>Start Date:</span>
// //                     <strong style={{ color: 'var(--text-secondary)' }}>{selectedBookingDetails.starting_date || selectedBookingDetails.start_date || 'N/A'}</strong>
// //                   </div>

// //                   <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 6 }}>
// //                     <span style={{ color: 'var(--text-muted)' }}>End Date:</span>
// //                     <strong style={{ color: 'var(--text-secondary)' }}>{selectedBookingDetails.ending_date || selectedBookingDetails.end_date || 'N/A'}</strong>
// //                   </div>

// //                   <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 6 }}>
// //                     <span style={{ color: 'var(--text-muted)' }}>Total Days:</span>
// //                     <strong style={{ color: 'var(--text-secondary)' }}>
// //                       {(() => {
// //                         const start = selectedBookingDetails.starting_date || selectedBookingDetails.start_date;
// //                         const end = selectedBookingDetails.ending_date || selectedBookingDetails.end_date;
// //                         if (start && end) {
// //                           const startDate = new Date(start);
// //                           const endDate = new Date(end);
// //                           if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
// //                             const diffTime = endDate.getTime() - startDate.getTime();
// //                             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// //                             return diffDays >= 0 ? diffDays : 'N/A';
// //                           }
// //                         }
// //                         return selectedBookingDetails.total_days || 'N/A';
// //                       })()}
// //                     </strong>
// //                   </div>

// //                   <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 6 }}>
// //                     <span style={{ color: 'var(--text-muted)' }}>Billing Cycle Date:</span>
// //                     <strong style={{ color: 'var(--text-secondary)' }}>
// //                       {(() => {
// //                         const cycle = selectedBookingDetails.billing_cycle || selectedBookingDetails.billing_cycle_date;
// //                         if (!cycle) return 'N/A';
// //                         const date = new Date(cycle);
// //                         if (!isNaN(date.getTime()) && String(cycle).includes('-')) {
// //                           return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
// //                         }
// //                         return cycle;
// //                       })()}
// //                     </strong>
// //                   </div>

// //                   <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 6 }}>
// //                     <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
// //                     <strong style={{ color: 'var(--text-secondary)' }}>{selectedBookingDetails.payment_method || 'N/A'}</strong>
// //                   </div>
// //                 </div>

// //                 {/* Account Balances Section */}
// //                 <div style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 8, marginTop: 4 }}>
// //                   <h4 style={{ fontSize: 12, margin: '0 0 10px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: 4, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Ledger summary</h4>
// //                   <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
// //                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
// //                       <span style={{ color: 'var(--text-secondary)' }}>Total Booking Amt:</span>
// //                       <strong style={{ color: 'var(--text-primary)' }}>${parseFloat(selectedBookingDetails.booking_amount || selectedBookingDetails.amount_to_pay || 0).toFixed(2)}</strong>
// //                     </div>
// //                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
// //                       <span style={{ color: 'var(--text-secondary)' }}>Deposit Received:</span>
// //                       <strong style={{ color: 'var(--text-primary)' }}>${parseFloat(selectedBookingDetails.advance_amount || 0).toFixed(2)}</strong>
// //                     </div>
// //                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
// //                       <span style={{ color: 'var(--text-secondary)' }}>Paid Amount:</span>
// //                       <strong style={{ color: 'var(--color-success)' }}>${parseFloat(selectedBookingDetails.paid_amount || 0).toFixed(2)}</strong>
// //                     </div>
// //                     <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: 6, marginTop: 4 }}>
// //                       <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>Pending Balance:</span>
// //                       <strong style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>${parseFloat(selectedBookingDetails.pending_amount || 0).toFixed(2)}</strong>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Workflow / System notes */}
// //                 {selectedBookingDetails.workflow_state && (
// //                   <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(59, 130, 246, 0.1)', padding: 10, borderRadius: 6, fontSize: 11, color: '#60a5fa' }}>
// //                     <CheckCircle2 size={14} />
// //                     <span>Current Document State: <strong>{selectedBookingDetails.workflow_state}</strong></span>
// //                   </div>
// //                 )}

// //               </div>
// //             ) : (
// //               <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
// //                 <span>No details available for this record.</span>
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>

// //       {/* Dynamic Creation Modal Form */}
// //       {showAddModal && (
// //         <div className="modal-overlay">
// //           <div className="modal-content" style={{ maxWidth: 560 }}>

// //             {/* Modal Header */}
// //             <div className="modal-header">
// //               <div>
// //                 <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Register New Booking</h3>
// //                 <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Form layout generated dynamically from ERPNext schema metadata.</p>
// //               </div>
// //               <button 
// //                 type="button" 
// //                 onClick={() => setShowAddModal(false)} 
// //                 style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}
// //                 disabled={submitting}
// //               >
// //                 ×
// //               </button>
// //             </div>

// //             {/* Modal Body / Dynamic Fields */}
// //             <form onSubmit={handleCreateBooking}>
// //               <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

// //                 {errorMsg && (
// //                   <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', borderRadius: 6, padding: '10px 14px', color: 'var(--color-danger)', fontSize: 12 }}>
// //                     {errorMsg}
// //                   </div>
// //                 )}

// //                 {loadingFields ? (
// //                   <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
// //                     <Loader size={20} className="spin" style={{ margin: '0 auto 8px auto' }} />
// //                     <span>Querying ERPNext DocType fields schema...</span>
// //                   </div>
// //                 ) : (
// //                   bookingFields.map(field => {
// //                     const isRequired = !!field.reqd;
// //                     const val = formData[field.fieldname] || '';

// //                     return (
// //                       <div key={field.fieldname} className="form-group">
// //                         <label className="form-label">
// //                           {field.label} {isRequired && <span style={{ color: 'var(--color-danger)' }}>*</span>}
// //                         </label>

// //                         {field.fieldtype === 'Select' ? (
// //                           <select
// //                             value={val}
// //                             onChange={(e) => handleInputChange(field.fieldname, e.target.value)}
// //                             required={isRequired}
// //                             className="form-select"
// //                             disabled={submitting}
// //                           >
// //                             <option value="">-- Choose Option --</option>
// //                             {(field.options || '').split('\n').filter(Boolean).map(opt => (
// //                               <option key={opt} value={opt}>{opt}</option>
// //                             ))}
// //                           </select>
// //                         ) : field.fieldtype === 'Date' ? (
// //                           <input
// //                             type="date"
// //                             value={val}
// //                             onChange={(e) => handleInputChange(field.fieldname, e.target.value)}
// //                             required={isRequired}
// //                             className="form-input"
// //                             disabled={submitting}
// //                           />
// //                         ) : field.fieldtype === 'Datetime' ? (
// //                           <input
// //                             type="datetime-local"
// //                             value={val}
// //                             onChange={(e) => handleInputChange(field.fieldname, e.target.value)}
// //                             required={isRequired}
// //                             className="form-input"
// //                             disabled={submitting}
// //                           />
// //                         ) : field.fieldtype === 'Small Text' || field.fieldtype === 'Text' ? (
// //                           <textarea
// //                             value={val}
// //                             onChange={(e) => handleInputChange(field.fieldname, e.target.value)}
// //                             required={isRequired}
// //                             className="form-textarea"
// //                             rows={3}
// //                             disabled={submitting}
// //                             style={{ resize: 'vertical' }}
// //                           />
// //                         ) : field.fieldtype === 'Currency' || field.fieldtype === 'Float' || field.fieldtype === 'Int' ? (
// //                           <input
// //                             type="number"
// //                             step="any"
// //                             value={val}
// //                             onChange={(e) => handleInputChange(field.fieldname, e.target.value)}
// //                             required={isRequired}
// //                             className="form-input"
// //                             disabled={submitting}
// //                           />
// //                         ) : (
// //                           <input
// //                             type="text"
// //                             value={val}
// //                             onChange={(e) => handleInputChange(field.fieldname, e.target.value)}
// //                             required={isRequired}
// //                             className="form-input"
// //                             disabled={submitting}
// //                             placeholder={`Enter ${field.label.toLowerCase()}`}
// //                           />
// //                         )}
// //                       </div>
// //                     );
// //                   })
// //                 )}
// //               </div>

// //               {/* Modal Footer */}
// //               <div className="modal-footer">
// //                 <button 
// //                   type="button" 
// //                   onClick={() => setShowAddModal(false)} 
// //                   className="btn btn-secondary" 
// //                   disabled={submitting}
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button 
// //                   type="submit" 
// //                   className="btn btn-primary" 
// //                   disabled={submitting}
// //                   style={{ display: 'flex', alignItems: 'center', gap: 6 }}
// //                 >
// //                   {submitting ? (
// //                     <>
// //                       <Loader size={14} className="spin" />
// //                       Syncing...
// //                     </>
// //                   ) : (
// //                     'Submit to ERPNext'
// //                   )}
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
// import { Calendar, User, Building, DollarSign, Plus, X, Search, Filter, Loader, Eye, RefreshCw, CheckCircle2 } from 'lucide-react';

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

// export default function Booking({ erpnextConfig }) {
//   const [bookings, setBookings] = useState([]);
//   const [selectedBookingId, setSelectedBookingId] = useState(null);
//   const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
//   const [loadingDetails, setLoadingDetails] = useState(false);
//   const [loadingList, setLoadingList] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [successMsg, setSuccessMsg] = useState('');

//   // Dynamic fields state from DocType metadata
//   const [bookingFields, setBookingFields] = useState([]);
//   const [loadingFields, setLoadingFields] = useState(false);

//   // Search & filter states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [typeFilter, setTypeFilter] = useState('All');
//   const [customerFilter, setCustomerFilter] = useState('');

//   // New booking form modal state
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [syncStatus, setSyncStatus] = useState('');

//   // Approval workflow state
//   const [showApproveModal, setShowApproveModal] = useState(false);
//   const [contractTemplates, setContractTemplates] = useState([]);
//   const [loadingTemplates, setLoadingTemplates] = useState(false);
//   const [selectedTemplateId, setSelectedTemplateId] = useState('');
//   const [templateDetails, setTemplateDetails] = useState(null);
//   const [loadingTemplateDetails, setLoadingTemplateDetails] = useState(false);
//   const [agreedToTerms, setAgreedToTerms] = useState(false);
//   const [signedByName, setSignedByName] = useState('');
//   const [approving, setApproving] = useState(false);
//   const [approveError, setApproveError] = useState('');

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Initial mock data if connection fails or starts empty
//   const mockBookings = [
//     {
//       name: 'BOOK-0001',
//       booking_date: '2026-06-10',
//       customer: 'CUST-0001',
//       customer_name: 'Biswajit Maity',
//       customer_email: 'biswajit@example.com',
//       customer_phone_no: '+679 999 1234',
//       property: 'Suva Retail Complex - Suite 102',
//       booking_type: 'Rent',
//       status: 'Confirmed',
//       payment_status: 'Paid',
//       booking_amount: 1500.00,
//       paid_amount: 1500.00,
//       pending_amount: 0.00,
//       starting_date: '2026-07-01',
//       ending_date: '2027-06-30',
//       total_days: '365',
//       advance_amount: 500.00,
//       payment_method: 'Bank Transfer'
//     },
//     {
//       name: 'BOOK-0002',
//       booking_date: '2026-06-11',
//       customer: 'CUST-0002',
//       customer_name: 'Jane Doe',
//       customer_email: 'jane.doe@example.com',
//       customer_phone_no: '+679 888 5678',
//       property: 'Nadi Residential Villa - Unit A',
//       booking_type: 'Lease',
//       status: 'Pending',
//       payment_status: 'Partially Paid',
//       booking_amount: 2500.00,
//       paid_amount: 1000.00,
//       pending_amount: 1500.00,
//       starting_date: '2026-08-01',
//       ending_date: '2028-07-31',
//       total_days: '730',
//       advance_amount: 1000.00,
//       payment_method: 'Credit Card'
//     }
//   ];

//   // Fetch DocType fields metadata to construct dynamic form
//   const fetchDocTypeFields = async () => {
//     if (!erpnextConfig || !erpnextConfig.url) return;
//     setLoadingFields(true);
//     try {
//       const res = await fetch(`${erpnextConfig.url}/api/resource/DocType/Booking`, {
//         credentials: 'include',
//       headers: {
//           'Content-Type': 'application/json'
//         }
//       });
//       if (res.ok) {
//         const json = await res.json();
//         const rawFields = json.data?.fields || [];
//         // Filter relevant writable fields
//         const filtered = rawFields.filter(f => 
//           f.fieldname && 
//           f.label && 
//           f.fieldtype !== 'Section Break' && 
//           f.fieldtype !== 'Column Break' && 
//           f.fieldtype !== 'Table' &&
//           f.fieldtype !== 'Heading' &&
//           !f.read_only &&
//           f.fieldname !== 'amended_from' &&
//           f.fieldname !== 'workflow_state'
//         );
//         setBookingFields(filtered);

//         // Initialize default form data
//         const defaults = {};
//         filtered.forEach(f => {
//           defaults[f.fieldname] = f.default || '';
//         });
//         setFormData(defaults);
//       }
//     } catch (err) {
//       console.warn('Failed to fetch Booking DocType fields:', err);
//     } finally {
//       setLoadingFields(false);
//     }
//   };

//   // Fetch bookings list using custom API, falling back to resource endpoint or mock data
//   const fetchBookings = async (cust = '') => {
//     setLoadingList(true);
//     setErrorMsg('');
//     try {
//       let dataList = [];
//       if (erpnextConfig && erpnextConfig.url) {
//         // Build url based on filter
//         const apiPath = cust 
//           ? `/api/method/erpnext.api.booking.get_bookings?customer=${encodeURIComponent(cust)}` 
//           : `/api/method/erpnext.api.booking.get_bookings`;

//         setSyncStatus('Fetching from ERPNext custom API...');
//         try {
//           const res = await fetch(`${erpnextConfig.url}${apiPath}`, {
//             credentials: 'include',
//       headers: {
//               'Content-Type': 'application/json'
//             }
//           });
//           if (res.ok) {
//             const json = await res.json();
//             dataList = json.message || json.data || [];
//           } else {
//             throw new Error('Method not found or error response');
//           }
//         } catch (methodErr) {
//           console.warn('Custom API method failed, trying standard resource API...', methodErr);
//           setSyncStatus('Syncing via ERPNext REST Resource API...');

//           // Standard resource fallback
//           let resourceUrl = `${erpnextConfig.url}/api/resource/Booking?fields=["name","booking_date","customer","customer_name","booking_type","status","payment_status","booking_amount","paid_amount","pending_amount","starting_date","ending_date","property"]&limit_page_length=200`;
//           if (cust) {
//             resourceUrl += `&filters=[["Booking","customer","=","${cust}"]]`;
//           }
//           const res = await fetch(resourceUrl, {
//             credentials: 'include',
//       headers: {
//               'Content-Type': 'application/json'
//             }
//           });
//           if (res.ok) {
//             const json = await res.json();
//             dataList = json.data || [];
//           } else {
//             throw new Error('Standard resource API request failed');
//           }
//         }
//       }

//       if (Array.isArray(dataList) && dataList.length > 0) {
//         setBookings(dataList);
//         setSyncStatus('Synchronized');
//       } else {
//         setBookings(mockBookings);
//         setSyncStatus('Offline Mode (Showing Mocks)');
//       }
//     } catch (err) {
//       console.warn('Booking fetch failed, falling back to mock data:', err);
//       setBookings(mockBookings);
//       setSyncStatus('Offline Mode (Showing Mocks)');
//     } finally {
//       setLoadingList(false);
//     }
//   };

//   // Fetch detailed booking record
//   const fetchBookingDetails = async (id) => {
//     setLoadingDetails(true);
//     setSelectedBookingDetails(null);
//     try {
//       let details = null;
//       if (erpnextConfig && erpnextConfig.url) {
//         try {
//           // Attempt custom method 1: get_booking_details
//           const res = await fetch(`${erpnextConfig.url}/api/method/erpnext.api.booking.get_booking_details?booking_id=${id}`, {
//             credentials: 'include',
//       headers: {
//               'Content-Type': 'application/json'
//             }
//           });
//           if (res.ok) {
//             const json = await res.json();
//             details = json.message || json.data;
//           } else {
//             // Attempt custom method 2: get_booking
//             const res2 = await fetch(`${erpnextConfig.url}/api/method/erpnext.api.booking.get_booking?booking_id=${id}`, {
//               credentials: 'include',
//       headers: {
//                 'Content-Type': 'application/json'
//               }
//             });
//             if (res2.ok) {
//               const json2 = await res2.json();
//               details = json2.message || json2.data;
//             } else {
//               throw new Error('Details methods failed');
//             }
//           }
//         } catch (detailErr) {
//           console.warn('Custom details APIs failed, loading via resource detail...', detailErr);
//           // Standard resource detail fallback
//           const res = await fetch(`${erpnextConfig.url}/api/resource/Booking/${id}`, {
//             credentials: 'include',
//       headers: {
//               'Content-Type': 'application/json'
//             }
//           });
//           if (res.ok) {
//             const json = await res.json();
//             details = json.data;
//           }
//         }
//       }

//       if (details) {
//         setSelectedBookingDetails(details);
//       } else {
//         // Mock detail fallback
//         const mockDetail = bookings.find(b => b.name === id || b.id === id);
//         setSelectedBookingDetails(mockDetail || null);
//       }
//     } catch (err) {
//       console.warn('Failed to load booking details:', err);
//       const mockDetail = bookings.find(b => b.name === id || b.id === id);
//       setSelectedBookingDetails(mockDetail || null);
//     } finally {
//       setLoadingDetails(false);
//     }
//   };

//   // Fetch available contract templates for the approval preview dropdown
//   const fetchContractTemplates = async () => {
//     if (!erpnextConfig || !erpnextConfig.url) return;
//     setLoadingTemplates(true);
//     try {
//       const res = await fetch(
//         `${erpnextConfig.url}/api/resource/${encodeURIComponent('Contract Template')}?fields=["name","title"]&limit_page_length=200`,
//         {
//           credentials: 'include',
//           headers: { 'Content-Type': 'application/json' }
//         }
//       );
//       if (res.ok) {
//         const json = await res.json();
//         setContractTemplates(json.data || []);
//       }
//     } catch (err) {
//       console.warn('Failed to fetch contract templates:', err);
//     } finally {
//       setLoadingTemplates(false);
//     }
//   };

//   // Fetch the full contract template (including contract_terms HTML) for preview
//   const fetchTemplateDetails = async (templateId) => {
//     if (!erpnextConfig || !erpnextConfig.url || !templateId) return;
//     setLoadingTemplateDetails(true);
//     setTemplateDetails(null);
//     try {
//       const res = await fetch(
//         `${erpnextConfig.url}/api/resource/${encodeURIComponent('Contract Template')}/${encodeURIComponent(templateId)}`,
//         {
//           credentials: 'include',
//           headers: { 'Content-Type': 'application/json' }
//         }
//       );
//       if (res.ok) {
//         const json = await res.json();
//         setTemplateDetails(json.data);
//       }
//     } catch (err) {
//       console.warn('Failed to fetch contract template details:', err);
//     } finally {
//       setLoadingTemplateDetails(false);
//     }
//   };

//   // Open the approval modal for the currently selected booking
//   const openApproveModal = () => {
//     setApproveError('');
//     setSelectedTemplateId('');
//     setTemplateDetails(null);
//     setAgreedToTerms(false);
//     setSignedByName('');
//     setShowApproveModal(true);
//     fetchContractTemplates();
//   };

//   // Approve the booking: attach the chosen contract template + signer, then confirm
//   const handleApproveBooking = async () => {
//     setApproveError('');
//     if (!selectedTemplateId) {
//       setApproveError('Please select a contract template to preview before approving.');
//       return;
//     }
//     if (!agreedToTerms) {
//       setApproveError('Please confirm the Terms & Conditions have been reviewed.');
//       return;
//     }
//     if (!signedByName.trim()) {
//       setApproveError('Please enter the name of the person signing this booking.');
//       return;
//     }

//     setApproving(true);
//     try {
//       let approved = false;
//       if (erpnextConfig && erpnextConfig.url) {
//         try {
//           const res = await fetch(`${erpnextConfig.url}/api/method/erpnext.api.booking.approve_booking`, {
//             method: 'POST',
//             credentials: 'include',
//             headers: {
//               'Content-Type': 'application/json',
//               'X-Frappe-CSRF-Token': getCsrfToken()
//             },
//             body: JSON.stringify({
//               booking_id: selectedBookingId,
//               contract_template: selectedTemplateId,
//               signed_by: signedByName.trim()
//             })
//           });
//           if (res.ok) {
//             approved = true;
//           } else {
//             throw new Error('Custom approve method failed');
//           }
//         } catch (approveErr) {
//           console.warn('Custom approve method failed, falling back to resource update...', approveErr);
//           const res = await fetch(`${erpnextConfig.url}/api/resource/Booking/${selectedBookingId}`, {
//             method: 'PUT',
//             credentials: 'include',
//             headers: {
//               'Content-Type': 'application/json',
//               'X-Frappe-CSRF-Token': getCsrfToken()
//             },
//             body: JSON.stringify({
//               status: 'Confirmed',
//               contract_template: selectedTemplateId,
//               signed_by: signedByName.trim()
//             })
//           });
//           if (res.ok) {
//             approved = true;
//           } else {
//             let errorDetail = 'Failed to approve booking on ERPNext';
//             try {
//               const errJson = await res.json();
//               if (errJson._server_messages) {
//                 const messages = JSON.parse(errJson._server_messages);
//                 errorDetail = messages.map(m => {
//                   try {
//                     const parsed = JSON.parse(m);
//                     return parsed.message || parsed;
//                   } catch {
//                     return String(m);
//                   }
//                 }).join(', ');
//               }
//             } catch {}
//             throw new Error(errorDetail);
//           }
//         }
//       }

//       if (approved) {
//         setSuccessMsg(`Booking ${selectedBookingId} approved and confirmed.`);
//         setShowApproveModal(false);
//         fetchBookings();
//         fetchBookingDetails(selectedBookingId);
//       } else {
//         // Offline fallback: reflect the approval locally
//         setBookings(prev => prev.map(b =>
//           (b.name === selectedBookingId || b.id === selectedBookingId)
//             ? { ...b, status: 'Confirmed' }
//             : b
//         ));
//         setSelectedBookingDetails(prev => prev ? { ...prev, status: 'Confirmed', workflow_state: 'Confirmed' } : prev);
//         setSuccessMsg('Booking approved locally (Offline mode)');
//         setShowApproveModal(false);
//       }
//     } catch (err) {
//       setApproveError(err.message || 'Error approving booking.');
//     } finally {
//       setApproving(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//     fetchDocTypeFields();
//   }, [erpnextConfig]);

//   // Handle Form Input Changes
//   const handleInputChange = (fieldname, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [fieldname]: value
//     }));
//   };

//   // Submit new booking
//   const handleCreateBooking = async (e) => {
//     e.preventDefault();
//     setErrorMsg('');
//     setSuccessMsg('');
//     setSubmitting(true);

//     // Validate mandatory fields
//     const missing = bookingFields.filter(f => f.reqd && !formData[f.fieldname]);
//     if (missing.length > 0) {
//       setErrorMsg(`Required fields missing: ${missing.map(f => f.label).join(', ')}`);
//       setSubmitting(false);
//       return;
//     }

//     try {
//       let savedDoc = null;
//       if (erpnextConfig && erpnextConfig.url) {
//         // Try custom API first
//         try {
//           const res = await fetch(`${erpnextConfig.url}/api/method/erpnext.api.booking.create_booking`, {
//             method: 'POST',
//             credentials: 'include',
//             headers: {
//               'Content-Type': 'application/json',
//               'X-Frappe-CSRF-Token': getCsrfToken()
//             },
//             body: JSON.stringify(formData)
//           });
//           if (res.ok) {
//             const json = await res.json();
//             savedDoc = json.message || json.data;
//           } else {
//             throw new Error('Custom creation method failed');
//           }
//         } catch (createErr) {
//           console.warn('Custom create method failed, posting to resource Booking API...', createErr);
//           // Standard resource fallback
//           const res = await fetch(`${erpnextConfig.url}/api/resource/Booking`, {
//             method: 'POST',
//             credentials: 'include',
//             headers: {
//               'Content-Type': 'application/json',
//               'X-Frappe-CSRF-Token': getCsrfToken()
//             },
//             body: JSON.stringify(formData)
//           });
//           if (res.ok) {
//             const json = await res.json();
//             savedDoc = json.data;
//           } else {
//             let errorDetail = 'Failed to create booking document on ERPNext';
//             try {
//               const errJson = await res.json();
//               if (errJson._server_messages) {
//                 const messages = JSON.parse(errJson._server_messages);
//                 errorDetail = messages.map(m => {
//                   try {
//                     const parsed = JSON.parse(m);
//                     return parsed.message || parsed;
//                   } catch {
//                     return String(m);
//                   }
//                 }).join(', ');
//               }
//             } catch {}
//             throw new Error(errorDetail);
//           }
//         }
//       }

//       if (savedDoc) {
//         setSuccessMsg(`Booking ${savedDoc.name || 'created'} synced successfully with ERPNext!`);
//         fetchBookings();
//         setShowAddModal(false);
//       } else {
//         // Mock save if not connected to ERPNext
//         const generatedId = `BOOK-${Math.floor(1000 + Math.random() * 9000)}`;
//         const localDoc = {
//           name: generatedId,
//           ...formData,
//           booking_date: formData.booking_date || new Date().toISOString().split('T')[0],
//           status: formData.status || 'Pending',
//           payment_status: formData.payment_status || 'Unpaid'
//         };
//         setBookings([localDoc, ...bookings]);
//         setSuccessMsg('Booking saved locally (Offline mode)');
//         setShowAddModal(false);
//       }
//     } catch (err) {
//       setErrorMsg(err.message || 'Error creating booking document.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Quick Customer Filter trigger
//   const handleCustomerFilterSubmit = (e) => {
//     e.preventDefault();
//     fetchBookings(customerFilter);
//   };

//   // Filtering on local state
//   const filteredBookings = bookings.filter(b => {
//     const term = searchTerm.toLowerCase();
//     const matchSearch = 
//       (b.name && b.name.toLowerCase().includes(term)) ||
//       (b.customer && b.customer.toLowerCase().includes(term)) ||
//       (b.customer_name && b.customer_name.toLowerCase().includes(term)) ||
//       (b.property && b.property.toLowerCase().includes(term));

//     const matchStatus = statusFilter === 'All' || b.status === statusFilter || b.payment_status === statusFilter;
//     const matchType = typeFilter === 'All' || b.booking_type === typeFilter;

//     return matchSearch && matchStatus && matchType;
//   });

//   // Pagination slice
//   const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

//   return (
//     <div style={{ padding: '4px 0' }}>
//       {/* Header section */}
//       <div className="view-header" style={{ marginBottom: 20 }}>
//         <div>
//           <h1 className="view-title">Property Bookings</h1>
//           <p className="view-subtitle">Manage lease/rent reservations, track customer deposits, and view contract workflows.</p>
//         </div>
//         <div style={{ display: 'flex', gap: 10 }}>
//           <button 
//             className="btn btn-secondary" 
//             onClick={() => fetchBookings()} 
//             style={{ display: 'flex', alignItems: 'center', gap: 6 }}
//           >
//             <RefreshCw size={14} className={loadingList ? 'spin' : ''} />
//             Reload
//           </button>
//           <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
//             <Plus size={16} /> New Booking
//           </button>
//         </div>
//       </div>

//       {/* Sync Status Banner */}
//       {syncStatus && syncStatus !== 'Synchronized' && (
//         <div style={{ 
//           background: 'var(--bg-accent-alpha)', 
//           border: '1px solid var(--border-color)', 
//           borderRadius: 8, 
//           padding: '8px 16px', 
//           marginBottom: 16, 
//           fontSize: 12, 
//           color: 'var(--text-secondary)',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//             <div style={{ width: 6, height: 6, borderRadius: '50%', background: syncStatus.includes('Offline') ? 'var(--color-warning)' : 'var(--color-success)' }} />
//             <span>Connection Status: <strong>{syncStatus}</strong></span>
//           </div>
//           {successMsg && <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{successMsg}</span>}
//         </div>
//       )}

//       {/* Control panel filters */}
//       <div className="card-panel" style={{ padding: 16, marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
//         <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
//           <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
//           <input 
//             type="text" 
//             placeholder="Search by ID, customer name, unit..." 
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="form-control"
//             style={{ paddingLeft: 34, fontSize: 13 }}
//           />
//         </div>

//         <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
//           <Filter size={14} style={{ color: 'var(--text-muted)' }} />

//           <select 
//             value={typeFilter} 
//             onChange={(e) => setTypeFilter(e.target.value)}
//             className="form-control" 
//             style={{ width: 120, fontSize: 13, padding: '4px 8px' }}
//           >
//             <option value="All">All Types</option>
//             <option value="Rent">Rent</option>
//             <option value="Sale">Sale</option>
//             <option value="Lease">Lease</option>
//           </select>

//           <select 
//             value={statusFilter} 
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="form-control" 
//             style={{ width: 140, fontSize: 13, padding: '4px 8px' }}
//           >
//             <option value="All">All Statuses</option>
//             <option value="Confirmed">Confirmed</option>
//             <option value="Pending">Pending</option>
//             <option value="Cancelled">Cancelled</option>
//             <option value="Paid">Payment: Paid</option>
//             <option value="Partially Paid">Payment: Partial</option>
//             <option value="Unpaid">Payment: Unpaid</option>
//           </select>
//         </div>

//         {/* Customer Sync API Filter Form */}
//         <form onSubmit={handleCustomerFilterSubmit} style={{ display: 'flex', gap: 6, alignItems: 'center', borderLeft: '1px solid var(--border-color)', paddingLeft: 14 }}>
//           <span style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Filter Customer ID:</span>
//           <input 
//             type="text" 
//             placeholder="e.g. CUST-0001" 
//             value={customerFilter} 
//             onChange={(e) => {
//               setCustomerFilter(e.target.value);
//               // Fetch from ERPNext on change/clear
//               fetchBookings(e.target.value);
//             }}
//             className="form-control"
//             style={{ width: 120, padding: '4px 8px', fontSize: 12 }}
//           />
//           <button type="submit" className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }}>Search</button>
//         </form>
//       </div>

//       {/* Grid view containing list & inspector */}
//       <div className="grid-2col" style={{ gridTemplateColumns: selectedBookingId ? '60% calc(40% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>

//         {/* Booking Table Card */}
//         <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
//           <div className="table-container">
//             <table className="custom-table">
//               <thead>
//                 <tr>
//                   <th>Booking ID</th>
//                   <th>Booking Date</th>
//                   <th>Tenant info</th>
//                   <th>Property Unit</th>
//                   <th>Property Group</th>
//                   <th>Status</th>
//                   <th>Amount</th>
//                   <th>Payment Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentItems.map(b => (
//                   <tr 
//                     key={b.name || b.id}
//                     onClick={() => {
//                       setSelectedBookingId(b.name || b.id);
//                       fetchBookingDetails(b.name || b.id);
//                     }}
//                     style={{ 
//                       cursor: 'pointer',
//                       backgroundColor: selectedBookingId === (b.name || b.id) ? 'var(--bg-accent-alpha)' : '',
//                       borderLeft: selectedBookingId === (b.name || b.id) ? '3px solid var(--brand-color)' : ''
//                     }}
//                   >
//                     <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{b.name || b.id}</td>
//                     <td>{b.booking_date}</td>
//                     <td>
//                       <div style={{ fontWeight: 600 }}>{b.customer_name || b.customer}</div>
//                       <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{b.customer_email || 'No email'}</div>
//                     </td>
//                     <td style={{ fontSize: 12, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                       {b.property || 'Not specified'}
//                     </td>
//                     <td>
//                       <span className="badge badge-secondary" style={{ textTransform: 'none' }}>
//                         {b.property_group || b.property || 'N/A'}
//                       </span>
//                     </td>
//                     <td>
//                       <span className={`badge ${b.status === 'Confirmed' ? 'badge-success' : b.status === 'Cancelled' ? 'badge-danger' : b.status === 'Pending'}`}>
//                         {b.status || 'Pending'}
//                       </span>
//                     </td>
//                     <td style={{ fontWeight: 600 }}>
//                       ${parseFloat(b.booking_amount || b.amount_to_pay || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                     </td>
//                     <td>
//                       <span className={`badge ${b.payment_status === 'Paid' ? 'badge-success' : b.payment_status === 'Partially Paid' ? 'badge-warning' : 'badge-danger'}`}>
//                         {b.payment_status || 'Unpaid'}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}

//                 {filteredBookings.length === 0 && (
//                   <tr>
//                     <td colSpan="8" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
//                       {loadingList ? 'Syncing with ERPNext Booking server...' : 'No booking records found.'}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination controls */}
//           {totalPages > 1 && (
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderTop: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-secondary)' }}>
//               <div>
//                 Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, filteredBookings.length)}</strong> of <strong>{filteredBookings.length}</strong> bookings
//               </div>
//               <div style={{ display: 'flex', gap: 6 }}>
//                 <button 
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
//                   className="btn btn-secondary"
//                   style={{ padding: '4px 10px', fontSize: 12 }}
//                 >
//                   Prev
//                 </button>
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button
//                     key={i + 1}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
//                     style={{ padding: '4px 10px', fontSize: 12 }}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//                 <button 
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
//                   className="btn btn-secondary"
//                   style={{ padding: '4px 10px', fontSize: 12 }}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Detailed Inspector Side Panel */}
//         {selectedBookingId && (
//           <div className="card-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
//               <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-color)' }}>{selectedBookingId} Details</span>
//               <button 
//                 onClick={() => setSelectedBookingId(null)} 
//                 style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             {loadingDetails ? (
//               <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
//                 <Loader size={24} className="spin" style={{ margin: '0 auto 10px auto' }} />
//                 <span>Loading details from ERPNext...</span>
//               </div>
//             ) : selectedBookingDetails ? (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

//                 {/* Visual Header */}
//                 <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 8 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
//                     <Calendar size={18} style={{ color: 'var(--brand-color)' }} />
//                     <strong style={{ fontSize: 15, color: 'var(--text-primary)' }}>{selectedBookingDetails.property || 'Property Unit'}</strong>
//                   </div>
//                   <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
//                     Type: <strong style={{ color: 'var(--text-secondary)' }}>{selectedBookingDetails.booking_type}</strong> | Status: <strong style={{ color: 'var(--color-success)' }}>{selectedBookingDetails.workflow_state || selectedBookingDetails.status || 'Pending'}</strong>
//                   </div>
//                 </div>

//                 {/* Details list */}
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 6 }}>
//                     <span style={{ color: 'var(--text-muted)' }}>Booking Date:</span>
//                     <strong style={{ color: 'var(--text-secondary)' }}>{selectedBookingDetails.booking_date}</strong>
//                   </div>

//                   <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 6 }}>
//                     <span style={{ color: 'var(--text-muted)' }}>Customer Name:</span>
//                     <strong style={{ color: 'var(--text-secondary)' }}>{selectedBookingDetails.customer_name}</strong>
//                   </div>

//                   {selectedBookingDetails.customer_email && (
//                     <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 6 }}>
//                       <span style={{ color: 'var(--text-muted)' }}>Customer Email:</span>
//                       <strong style={{ color: 'var(--text-secondary)' }}>{selectedBookingDetails.customer_email}</strong>
//                     </div>
//                   )}

//                   {selectedBookingDetails.customer_phone_no && (
//                     <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 6 }}>
//                       <span style={{ color: 'var(--text-muted)' }}>Phone Number:</span>
//                       <strong style={{ color: 'var(--text-secondary)' }}>{selectedBookingDetails.customer_phone_no}</strong>
//                     </div>
//                   )}

//                   <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 6 }}>
//                     <span style={{ color: 'var(--text-muted)' }}>Start Date:</span>
//                     <strong style={{ color: 'var(--text-secondary)' }}>{selectedBookingDetails.starting_date || selectedBookingDetails.start_date || 'N/A'}</strong>
//                   </div>

//                   <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 6 }}>
//                     <span style={{ color: 'var(--text-muted)' }}>End Date:</span>
//                     <strong style={{ color: 'var(--text-secondary)' }}>{selectedBookingDetails.ending_date || selectedBookingDetails.end_date || 'N/A'}</strong>
//                   </div>

//                   <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 6 }}>
//                     <span style={{ color: 'var(--text-muted)' }}>Total Days:</span>
//                     <strong style={{ color: 'var(--text-secondary)' }}>
//                       {(() => {
//                         const start = selectedBookingDetails.starting_date || selectedBookingDetails.start_date;
//                         const end = selectedBookingDetails.ending_date || selectedBookingDetails.end_date;
//                         if (start && end) {
//                           const startDate = new Date(start);
//                           const endDate = new Date(end);
//                           if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
//                             const diffTime = endDate.getTime() - startDate.getTime();
//                             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//                             return diffDays >= 0 ? diffDays : 'N/A';
//                           }
//                         }
//                         return selectedBookingDetails.total_days || 'N/A';
//                       })()}
//                     </strong>
//                   </div>

//                   <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 6 }}>
//                     <span style={{ color: 'var(--text-muted)' }}>Billing Cycle Date:</span>
//                     <strong style={{ color: 'var(--text-secondary)' }}>
//                       {(() => {
//                         const cycle = selectedBookingDetails.billing_cycle || selectedBookingDetails.billing_cycle_date;
//                         if (!cycle) return 'N/A';
//                         const date = new Date(cycle);
//                         if (!isNaN(date.getTime()) && String(cycle).includes('-')) {
//                           return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
//                         }
//                         return cycle;
//                       })()}
//                     </strong>
//                   </div>

//                   <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 6 }}>
//                     <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
//                     <strong style={{ color: 'var(--text-secondary)' }}>{selectedBookingDetails.payment_method || 'N/A'}</strong>
//                   </div>
//                 </div>

//                 {/* Account Balances Section */}
//                 <div style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 8, marginTop: 4 }}>
//                   <h4 style={{ fontSize: 12, margin: '0 0 10px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: 4, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Ledger summary</h4>
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <span style={{ color: 'var(--text-secondary)' }}>Total Booking Amt:</span>
//                       <strong style={{ color: 'var(--text-primary)' }}>${parseFloat(selectedBookingDetails.booking_amount || selectedBookingDetails.amount_to_pay || 0).toFixed(2)}</strong>
//                     </div>
//                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <span style={{ color: 'var(--text-secondary)' }}>Deposit Received:</span>
//                       <strong style={{ color: 'var(--text-primary)' }}>${parseFloat(selectedBookingDetails.advance_amount || 0).toFixed(2)}</strong>
//                     </div>
//                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <span style={{ color: 'var(--text-secondary)' }}>Paid Amount:</span>
//                       <strong style={{ color: 'var(--color-success)' }}>${parseFloat(selectedBookingDetails.paid_amount || 0).toFixed(2)}</strong>
//                     </div>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: 6, marginTop: 4 }}>
//                       <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>Pending Balance:</span>
//                       <strong style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>${parseFloat(selectedBookingDetails.pending_amount || 0).toFixed(2)}</strong>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Workflow / System notes */}
//                 {selectedBookingDetails.workflow_state && (
//                   <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(59, 130, 246, 0.1)', padding: 10, borderRadius: 6, fontSize: 11, color: '#60a5fa' }}>
//                     <CheckCircle2 size={14} />
//                     <span>Current Document State: <strong>{selectedBookingDetails.workflow_state}</strong></span>
//                   </div>
//                 )}

//                 {/* Approve Booking Action */}
//                 {(selectedBookingDetails.status !== 'Confirmed' && selectedBookingDetails.workflow_state !== 'Confirmed') && (
//                   <button
//                     className="btn btn-primary"
//                     onClick={openApproveModal}
//                     style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4 }}
//                   >
//                     <CheckCircle2 size={14} />
//                     Approve Booking
//                   </button>
//                 )}

//               </div>
//             ) : (
//               <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
//                 <span>No details available for this record.</span>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Dynamic Creation Modal Form */}
//       {showAddModal && (
//         <div className="modal-overlay">
//           <div className="modal-content" style={{ maxWidth: 560 }}>

//             {/* Modal Header */}
//             <div className="modal-header">
//               <div>
//                 <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Register New Booking</h3>
//                 <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Form layout generated dynamically from ERPNext schema metadata.</p>
//               </div>
//               <button 
//                 type="button" 
//                 onClick={() => setShowAddModal(false)} 
//                 style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}
//                 disabled={submitting}
//               >
//                 ×
//               </button>
//             </div>

//             {/* Modal Body / Dynamic Fields */}
//             <form onSubmit={handleCreateBooking}>
//               <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

//                 {errorMsg && (
//                   <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', borderRadius: 6, padding: '10px 14px', color: 'var(--color-danger)', fontSize: 12 }}>
//                     {errorMsg}
//                   </div>
//                 )}

//                 {loadingFields ? (
//                   <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
//                     <Loader size={20} className="spin" style={{ margin: '0 auto 8px auto' }} />
//                     <span>Querying ERPNext DocType fields schema...</span>
//                   </div>
//                 ) : (
//                   bookingFields.map(field => {
//                     const isRequired = !!field.reqd;
//                     const val = formData[field.fieldname] || '';

//                     return (
//                       <div key={field.fieldname} className="form-group">
//                         <label className="form-label">
//                           {field.label} {isRequired && <span style={{ color: 'var(--color-danger)' }}>*</span>}
//                         </label>

//                         {field.fieldtype === 'Select' ? (
//                           <select
//                             value={val}
//                             onChange={(e) => handleInputChange(field.fieldname, e.target.value)}
//                             required={isRequired}
//                             className="form-select"
//                             disabled={submitting}
//                           >
//                             <option value="">-- Choose Option --</option>
//                             {(field.options || '').split('\n').filter(Boolean).map(opt => (
//                               <option key={opt} value={opt}>{opt}</option>
//                             ))}
//                           </select>
//                         ) : field.fieldtype === 'Date' ? (
//                           <input
//                             type="date"
//                             value={val}
//                             onChange={(e) => handleInputChange(field.fieldname, e.target.value)}
//                             required={isRequired}
//                             className="form-input"
//                             disabled={submitting}
//                           />
//                         ) : field.fieldtype === 'Datetime' ? (
//                           <input
//                             type="datetime-local"
//                             value={val}
//                             onChange={(e) => handleInputChange(field.fieldname, e.target.value)}
//                             required={isRequired}
//                             className="form-input"
//                             disabled={submitting}
//                           />
//                         ) : field.fieldtype === 'Small Text' || field.fieldtype === 'Text' ? (
//                           <textarea
//                             value={val}
//                             onChange={(e) => handleInputChange(field.fieldname, e.target.value)}
//                             required={isRequired}
//                             className="form-textarea"
//                             rows={3}
//                             disabled={submitting}
//                             style={{ resize: 'vertical' }}
//                           />
//                         ) : field.fieldtype === 'Currency' || field.fieldtype === 'Float' || field.fieldtype === 'Int' ? (
//                           <input
//                             type="number"
//                             step="any"
//                             value={val}
//                             onChange={(e) => handleInputChange(field.fieldname, e.target.value)}
//                             required={isRequired}
//                             className="form-input"
//                             disabled={submitting}
//                           />
//                         ) : (
//                           <input
//                             type="text"
//                             value={val}
//                             onChange={(e) => handleInputChange(field.fieldname, e.target.value)}
//                             required={isRequired}
//                             className="form-input"
//                             disabled={submitting}
//                             placeholder={`Enter ${field.label.toLowerCase()}`}
//                           />
//                         )}
//                       </div>
//                     );
//                   })
//                 )}
//               </div>

//               {/* Modal Footer */}
//               <div className="modal-footer">
//                 <button 
//                   type="button" 
//                   onClick={() => setShowAddModal(false)} 
//                   className="btn btn-secondary" 
//                   disabled={submitting}
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit" 
//                   className="btn btn-primary" 
//                   disabled={submitting}
//                   style={{ display: 'flex', alignItems: 'center', gap: 6 }}
//                 >
//                   {submitting ? (
//                     <>
//                       <Loader size={14} className="spin" />
//                       Syncing...
//                     </>
//                   ) : (
//                     'Submit to ERPNext'
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Booking Approval Modal: template selection, contract preview, terms + signer */}
//       {showApproveModal && (
//         <div className="modal-overlay">
//           <div className="modal-content" style={{ maxWidth: 680 }}>

//             {/* Modal Header */}
//             <div className="modal-header">
//               <div>
//                 <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Approve Booking — {selectedBookingId}</h3>
//                 <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Select a contract template, review the terms, and confirm approval.</p>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setShowApproveModal(false)}
//                 style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}
//                 disabled={approving}
//               >
//                 ×
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

//               {approveError && (
//                 <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', borderRadius: 6, padding: '10px 14px', color: 'var(--color-danger)', fontSize: 12 }}>
//                   {approveError}
//                 </div>
//               )}

//               {/* Contract Template Dropdown */}
//               <div className="form-group">
//                 <label className="form-label">Contract Template</label>
//                 <select
//                   className="form-select"
//                   value={selectedTemplateId}
//                   onChange={(e) => {
//                     const val = e.target.value;
//                     setSelectedTemplateId(val);
//                     if (val) {
//                       fetchTemplateDetails(val);
//                     } else {
//                       setTemplateDetails(null);
//                     }
//                   }}
//                   disabled={loadingTemplates || approving}
//                 >
//                   <option value="">-- Select a contract template --</option>
//                   {contractTemplates.map(t => (
//                     <option key={t.name} value={t.name}>{t.title || t.name}</option>
//                   ))}
//                 </select>
//                 {loadingTemplates && (
//                   <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>
//                     Loading available templates...
//                   </span>
//                 )}
//               </div>

//               {/* Contract HTML Preview */}
//               {selectedTemplateId && (
//                 <div className="form-group">
//                   <label className="form-label">Contract Preview</label>
//                   {loadingTemplateDetails ? (
//                     <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
//                       <Loader size={20} className="spin" style={{ margin: '0 auto 8px auto' }} />
//                       <span>Loading contract terms...</span>
//                     </div>
//                   ) : templateDetails ? (
//                     <div
//                       style={{
//                         border: '1px solid var(--border-color)',
//                         borderRadius: 8,
//                         padding: 16,
//                         maxHeight: 320,
//                         overflowY: 'auto',
//                         background: 'var(--bg-tertiary)',
//                         fontSize: 12,
//                         lineHeight: 1.6,
//                         color: 'var(--text-secondary)'
//                       }}
//                       dangerouslySetInnerHTML={{ __html: templateDetails.contract_terms || '<p>No contract terms found for this template.</p>' }}
//                     />
//                   ) : (
//                     <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Unable to load the contract preview.</div>
//                   )}
//                 </div>
//               )}

//               {/* Terms & Conditions Acknowledgement */}
//               <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
//                 <input
//                   type="checkbox"
//                   id="approve-terms-checkbox"
//                   checked={agreedToTerms}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     setAgreedToTerms(checked);
//                     if (!checked) setSignedByName('');
//                   }}
//                   disabled={approving}
//                   style={{ width: 16, height: 16, cursor: 'pointer' }}
//                 />
//                 <label htmlFor="approve-terms-checkbox" style={{ fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
//                   I have reviewed and agree to the Terms &amp; Conditions of this contract
//                 </label>
//               </div>

//               {/* Signer Name Input — only shown once terms are accepted */}
//               {agreedToTerms && (
//                 <div className="form-group">
//                   <label className="form-label">
//                     Signed By <span style={{ color: 'var(--color-danger)' }}>*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="form-input"
//                     placeholder="Enter the full name of the signing party"
//                     value={signedByName}
//                     onChange={(e) => setSignedByName(e.target.value)}
//                     disabled={approving}
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="modal-footer">
//               <button
//                 type="button"
//                 onClick={() => setShowApproveModal(false)}
//                 className="btn btn-secondary"
//                 disabled={approving}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleApproveBooking}
//                 className="btn btn-primary"
//                 disabled={approving || !selectedTemplateId || !agreedToTerms || !signedByName.trim()}
//                 style={{ display: 'flex', alignItems: 'center', gap: 6 }}
//               >
//                 {approving ? (
//                   <>
//                     <Loader size={14} className="spin" />
//                     Approving...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle2 size={14} />
//                     Approve Booking
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar, User, Building, DollarSign, Plus, X, Search, Filter, Loader, Eye, RefreshCw, CheckCircle2, FileText, PenLine, ChevronDown, AlertCircle, CheckCircle, XCircle, Printer, Mail, Phone, Tag, Settings } from 'lucide-react';
import homeImg from '../assets/home.png';
import houseImg from '../assets/new-house.png';
import billingSummaryImg from '../assets/Billing-summary.png';

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

// Lightweight toast system — no external deps, self-contained styles/animation.
let toastIdCounter = 0;

export default function Booking({ erpnextConfig, initialSearchTerm = '', onClearInitialSearch }) {
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [currency, setCurrency] = useState('FJD');
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
  const [approveError, setApproveError] = useState('');
  const previewRef = useRef(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message) => {
    const id = ++toastIdCounter;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

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
      payment_method: 'Bank Transfer'
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
      payment_method: 'Credit Card'
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
      const res = await fetch(`${erpnextConfig.url}/api/resource/DocType/Booking`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const json = await res.json();
        const rawFields = json.data?.fields || [];
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

  // Fetch bookings list using custom API, falling back to resource endpoint or mock data
  const fetchBookings = async (cust = '') => {
    setLoadingList(true);
    setErrorMsg('');
    try {
      let dataList = [];
      if (erpnextConfig && erpnextConfig.url) {
        try {
          // Attempt standard resource API first
          setSyncStatus('Syncing via ERPNext REST Resource API...');
          let resourceUrl = `${erpnextConfig.url}/api/resource/Booking?fields=["name","custom_contract","booking_date","customer","customer_name","customer_email","booking_type","status","workflow_state","payment_status","booking_amount","paid_amount","pending_amount","starting_date","ending_date","country","property","quotation","booking_item"]&limit_page_length=200&order_by=creation%20desc`;
          if (cust) {
            resourceUrl += `&filters=[["Booking","customer","=","${cust}"]]`;
          }
          const res = await fetch(resourceUrl, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (res.ok) {
            const json = await res.json();
            dataList = json.data || [];
          } else {
            throw new Error('Standard resource API request failed');
          }
        } catch (resourceErr) {
          // Fallback to custom method
          setSyncStatus('Fetching from ERPNext custom API...');
          try {
            const apiPath = cust
              ? `/api/method/erpnext.api.booking.get_bookings?customer=${encodeURIComponent(cust)}`
              : `/api/method/erpnext.api.booking.get_bookings`;

            const res = await fetch(`${erpnextConfig.url}${apiPath}`, {
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            if (res.ok) {
              const json = await res.json();
              dataList = json.message || json.data || [];
            } else {
              throw new Error('Custom API method failed');
            }
          } catch (customErr) {
            console.warn('Both standard resource API and custom API failed:', resourceErr, customErr);
          }
        }
      }

      console.log('Fetched bookings first item keys and data:', dataList[0] ? Object.keys(dataList[0]) : [], dataList[0]);
      console.log('Fetched bookings:', dataList);
      if (Array.isArray(dataList) && dataList.length > 0) {
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

  // Fetch detailed booking record
  const fetchBookingDetails = async (id) => {
    setLoadingDetails(true);
    setSelectedBookingDetails(null);
    try {
      let details = null;
      if (erpnextConfig && erpnextConfig.url) {
        try {
          // Attempt standard resource detail first
          const res = await fetch(`${erpnextConfig.url}/api/resource/Booking/${id}`, {
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
            throw new Error('Standard resource API returned not OK');
          }
        } catch (resourceErr) {
          // Fallback to custom methods
          try {
            // Attempt custom method 1: get_booking_details
            const res = await fetch(`${erpnextConfig.url}/api/method/erpnext.api.booking.get_booking_details?booking_id=${id}`, {
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            if (res.ok) {
              const json = await res.json();
              details = json.message || json.data;
            } else {
              // Attempt custom method 2: get_booking
              const res2 = await fetch(`${erpnextConfig.url}/api/method/erpnext.api.booking.get_booking?booking_id=${id}`, {
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              if (res2.ok) {
                const json2 = await res2.json();
                details = json2.message || json2.data;
              } else {
                throw new Error('All detail retrieval methods failed');
              }
            }
          } catch (customErr) {
            console.warn('Both standard resource detail and custom APIs failed:', resourceErr, customErr);
          }
        }
      }

      if (details) {
        const normalizedItems = normalizeBookingItems(details);
        setSelectedBookingDetails({ ...details, booking_item: normalizedItems });
        setBookings(prev => prev.map(b => {
          const bookingId = b.name || b.id;
          return bookingId === id ? { ...b, booking_item: normalizedItems } : b;
        }));
      } else {
        // Mock detail fallback
        const mockDetail = bookings.find(b => b.name === id || b.id === id);
        const normalizedItems = normalizeBookingItems(mockDetail || {});
        setSelectedBookingDetails(mockDetail ? { ...mockDetail, booking_item: normalizedItems } : null);
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
      showToast('error', 'Start Date and End Date are required.');
      return;
    }

    const start = new Date(editStartDate);
    const end = new Date(editEndDate);
    const oneYearLater = new Date(start);
    oneYearLater.setFullYear(start.getFullYear() + 1);

    if (end < oneYearLater) {
      showToast('error', 'Booking period must be at least 1 year.');
      return;
    }

    setUpdatingDates(true);
    try {
      if (!erpnextConfig || !erpnextConfig.url) {
        setSelectedBookingDetails(prev => prev ? {
          ...prev,
          starting_date: editStartDate,
          ending_date: editEndDate
        } : prev);
        setBookings(prev => prev.map(b => (b.name === selectedBookingDetails.name || b.id === selectedBookingDetails.name) ? { ...b, starting_date: editStartDate, ending_date: editEndDate } : b));
        showToast('success', 'Booking dates updated locally.');
        return;
      }

      const res = await fetch(`${erpnextConfig.url}/api/resource/Booking/${selectedBookingDetails.name}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify({
          starting_date: editStartDate,
          ending_date: editEndDate
        })
      });

      if (res.ok) {
        showToast('success', 'Booking dates updated successfully.');
        await fetchBookingDetails(selectedBookingDetails.name);
      } else {
        const text = await res.text();
        showToast('error', `Failed to update dates: ${text}`);
      }
    } catch (err) {
      showToast('error', `Error updating dates: ${err.message}`);
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
            headers: {
              'Content-Type': 'application/json',
              'X-Frappe-CSRF-Token': getCsrfToken()
            },
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
            ? { ...b, status: newStatus, workflow_state: 'Approved' }
            : b
        ));
        setSelectedBookingDetails(prev => prev
          ? { ...prev, status: newStatus, workflow_state: 'Approved' }
          : prev
        );

        showToast('success', approvedPayload.message || `Booking ${selectedBookingId} approved successfully.`);
        setShowApproveModal(false);
      } else {
        // Offline fallback: reflect the approval locally
        setBookings(prev => prev.map(b =>
          (b.name === selectedBookingId || b.id === selectedBookingId)
            ? { ...b, status: 'Confirmed', workflow_state: 'Approved' }
            : b
        ));
        setSelectedBookingDetails(prev => prev ? { ...prev, status: 'Confirmed', workflow_state: 'Approved' } : prev);
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

  useEffect(() => {
    fetchBookings();
    fetchDocTypeFields();
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
            headers: {
              'Content-Type': 'application/json',
              'X-Frappe-CSRF-Token': getCsrfToken()
            },
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
            headers: {
              'Content-Type': 'application/json',
              'X-Frappe-CSRF-Token': getCsrfToken()
            },
            body: JSON.stringify(formData)
          });
          if (res.ok) {
            const json = await res.json();
            savedDoc = json.data;
          } else {
            let errorDetail = 'Failed to create booking document on ERPNext';
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
              }
            } catch { }
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
      setErrorMsg(err.message || 'Error creating booking document.');
      showToast('error', err.message || 'Error creating booking document.');
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
    const matchSearch =
      (b.name && b.name.toLowerCase().includes(term)) ||
      (b.customer && b.customer.toLowerCase().includes(term)) ||
      (b.customer_name && b.customer_name.toLowerCase().includes(term)) ||
      (b.customer_email && b.customer_email.toLowerCase().includes(term)) ||
      (b.property && b.property.toLowerCase().includes(term)) ||
      (b.country && b.country.toLowerCase().includes(term)) ||
      (b.quotation && String(b.quotation).toLowerCase().includes(term)) ||
      (b.custom_quotation && String(b.custom_quotation).toLowerCase().includes(term)) ||
      (b.quotation_id && String(b.quotation_id).toLowerCase().includes(term));

    const matchStatus = statusFilter === 'All' || b.status === statusFilter || b.payment_status === statusFilter;
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
    if (!erpnextConfig || !erpnextConfig.url) return;
    try {
      let details = null;
      try {
        const res = await fetch(`${erpnextConfig.url}/api/resource/Booking/${id}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const json = await res.json();
          details = json.data;
        }
      } catch (resourceErr) {
        try {
          const res = await fetch(`${erpnextConfig.url}/api/method/erpnext.api.booking.get_booking_details?booking_id=${id}`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });
          if (res.ok) {
            const json = await res.json();
            details = json.message || json.data;
          }
        } catch (customErr) { }
      }

      if (details) {
        const normalizedItems = normalizeBookingItems(details);
        setBookings(prev => prev.map(b => {
          const bookingId = b.name || b.id;
          return bookingId === id ? { ...b, booking_item: normalizedItems } : b;
        }));
      }
    } catch (err) {
      console.warn('Silent fetch failed:', err);
    }
  };

  useEffect(() => {
    if (!currentItems || currentItems.length === 0) return;
    currentItems.forEach(b => {
      const id = b.name || b.id;
      if (id && !b.booking_item) {
        fetchBookingDetailsSilently(id);
      }
    });
  }, [currentPage, bookings]);

  const isBookingApproved = selectedBookingDetails && (
    selectedBookingDetails.status === 'Confirmed' || selectedBookingDetails.workflow_state === 'Approved'
  );

  const canApproveNow = !approving && !!selectedTemplateId && hasReadToBottom && agreedToTerms && !!signedByName.trim();

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
            style={{ minWidth: 120, fontSize: 12 }}
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
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
                        <span
                          className="badge badge-secondary"
                          style={{
                            whiteSpace: "normal",
                            textTransform: "none",
                            lineHeight: 1.3
                          }}
                        >
                          {b.booking_item[0].item_code}
                        </span>
                      ) : b.property ? (
                        <span className="badge badge-secondary" style={{ textTransform: 'none' }}>
                          {b.property}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>Not specified</span>
                      )}
                    </td>           <td>
                      <span className="badge badge-secondary" style={{ textTransform: 'none' }}>
                        {b.custom_contract || b.contract || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${b.status === 'Confirmed' ? 'badge-success' : b.status === 'Cancelled' ? 'badge-danger' : b.status === 'Pending'}`}>
                        {b.status || 'Pending'}
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
                      {loadingList ? 'Syncing with ERPNext Booking server...' : 'No booking records found.'}
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
                      <strong style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>{selectedBookingDetails.property || 'Booking Details'}</strong>
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
                          background: '#e0f2fe',
                          color: '#0369a1',
                          border: '1px solid rgba(3, 105, 161, 0.15)'
                        }}>
                          Status: {selectedBookingDetails.workflow_state || selectedBookingDetails.status || 'Pending'}
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
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <FileText size={14} style={{ color: '#10b981' }} />
                              <span style={{ fontSize: '11px', color: 'var(--text-muted, #6b7280)', fontWeight: 500 }}>Quotation Id</span>
                            </div>
                            <strong style={{ fontSize: '12px', color: 'var(--text-primary, #0f172a)' }}>{selectedBookingDetails.quotation}</strong>
                          </div>
                        )}
                      </div>

                      {/* Right Column: Editable / Read-only Dates */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
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

                {/* BOOKING ITEMS TABLE */}
                {selectedBookingDetails.booking_item && selectedBookingDetails.booking_item.length > 0 && (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginTop: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#0a6c66', color: '#ffffff' }}>
                          <th style={{ padding: '12px 14px', color: '#ffffff', fontWeight: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Building size={13} style={{ color: '#ffffff' }} />
                              <span>Unit Name</span>
                            </div>
                          </th>
                          <th style={{ padding: '12px 14px', color: '#ffffff', fontWeight: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <RefreshCw size={13} style={{ color: '#ffffff' }} />
                              <span>Billing Cycle</span>
                            </div>
                          </th>
                          <th style={{ padding: '12px 14px', textAlign: 'right', color: '#ffffff', fontWeight: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                              <DollarSign size={13} style={{ color: '#ffffff' }} />
                              <span>Amount ({currency})</span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBookingDetails.booking_item.map((item, idx) => {
                          const amtVal = item.amount !== undefined && item.amount !== null
                            ? parseFloat(item.amount)
                            : ((parseFloat(item.qty) || 1) * (parseFloat(item.rate) || 0));

                          const nameLower = (item.item_name || item.item_code || '').toLowerCase();
                          let cellIcon = <Building size={14} style={{ color: '#0a6c66' }} />;
                          let iconBg = '#e6f4ea';
                          if (nameLower.includes('promo') || nameLower.includes('discount')) {
                            cellIcon = <Tag size={14} style={{ color: '#d97706' }} />;
                            iconBg = '#fffbeb';
                          } else if (nameLower.includes('service') || nameLower.includes('maintenance')) {
                            cellIcon = <Settings size={14} style={{ color: '#2563eb' }} />;
                            iconBg = '#eff6ff';
                          }

                          return (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: '#ffffff' }}>
                              <td style={{ padding: '12px 14px', color: '#374151', fontWeight: 700 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {cellIcon}
                                  </div>
                                  <span>{item.item_name || item.item_code}</span>
                                </div>
                              </td>
                              <td style={{ padding: '12px 14px', color: '#6b7280', fontWeight: 500 }}>{item.uom || 'Month'}</td>
                              <td style={{ padding: '12px 14px', textAlign: 'right', color: '#0a6c66', fontWeight: 700, fontSize: '12px' }}>
                                ${amtVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

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
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#137333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Billing Summary</span>
                    </div>

                    {/* Monthly Breakdown separator */}
                    <div style={{ fontSize: '10px', color: '#137333', fontWeight: 700, textTransform: 'uppercase', marginTop: '6px', borderBottom: '1px dashed #f1f5f9', paddingBottom: '3px' }}>
                      Monthly Installment Amount
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                      <span style={{ color: 'var(--text-muted, #6b7280)', fontWeight: 500 }}>Net Total:</span>
                      <strong style={{ color: 'var(--text-primary, #0f172a)', fontSize: '12px', fontWeight: 600 }}>
                        ${parseFloat(selectedBookingDetails.net_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </strong>
                    </div>
                    {selectedBookingDetails.discount_amount !== undefined && selectedBookingDetails.discount_amount !== null && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                        <span style={{ color: '#d97706', fontWeight: 500 }}>Discount Amount:</span>
                        <strong style={{ color: '#d97706', fontSize: '12px', fontWeight: 600 }}>
                          - ${parseFloat(selectedBookingDetails.discount_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                      <span style={{ color: 'var(--text-muted, #6b7280)', fontWeight: 500 }}>Taxes & Charges:</span>
                      <strong style={{ color: 'var(--text-primary, #0f172a)', fontSize: '12px', fontWeight: 600 }}>
                        + ${parseFloat(selectedBookingDetails.taxes_and_charges || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-primary, #0f172a)', fontWeight: 700 }}>Monthly Grand Total:</span>
                      <strong style={{ color: '#0a6c66', fontSize: '12.5px', fontWeight: 800 }}>
                        ${parseFloat(selectedBookingDetails.grand_totalmonthly || selectedBookingDetails.per_month_billing_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                      <span style={{ color: 'var(--text-muted, #6b7280)', fontWeight: 500 }}>Deposit Received:</span>
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
                        const monthlyGrandTotal = parseFloat(selectedBookingDetails.grand_totalmonthly || selectedBookingDetails.per_month_billing_amount || 0);
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
                    background: '#f0f9ff',
                    border: '1px solid #b3e0ff',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#0369a1',
                    marginTop: 4,
                    fontWeight: 500
                  }}>
                    <AlertCircle size={15} style={{ color: '#0369a1' }} />
                    <span>Current Document State: <strong>{selectedBookingDetails.workflow_state}</strong></span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (selectedBookingDetails?.status === 'Cancelled' || selectedBookingDetails?.workflow_state === 'Cancelled') {
                        showToast('error', 'Not allowed to print cancelled documents');
                        return;
                      }
                      const contractId = selectedBookingDetails?.custom_contract || selectedBookingDetails?.contract;
                      if (!contractId) {
                        showToast('error', 'No linked contract found for this booking');
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
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#085450'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0a6c66'}
                  >
                    <Printer size={14} />
                    <span>Print Lease Agreement</span>
                  </button>

                  {/* Approve Booking Action */}
                  {!isBookingApproved && (
                    <button
                      onClick={openApproveModal}
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
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#085450'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0a6c66'}
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve Booking</span>
                    </button>
                  )}
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
    </div>
  );
}
