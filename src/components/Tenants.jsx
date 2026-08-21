// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { User, Phone, Mail, Calendar, Key, Plus, X, Award, FileText } from 'lucide-react';

// // // // // export default function Tenants({ tenants, properties, onAddTenant, erpnextConfig }) {
// // // // //   const [showModal, setShowModal] = useState(false);
// // // // //   const [selectedTenant, setSelectedTenant] = useState(null);
// // // // //   const [tenantAddress, setTenantAddress] = useState('');
// // // // //   const [loadingAddress, setLoadingAddress] = useState(false);

// // // // //   useEffect(() => {
// // // // //     if (!selectedTenant) {
// // // // //       setTenantAddress('');
// // // // //       return;
// // // // //     }

// // // // //     // Set default/existing address if present
// // // // //     setTenantAddress(selectedTenant.address || 'Address not specified');

// // // // //     // Fetch address from server if config is available
// // // // //     if (erpnextConfig && erpnextConfig.url) {
// // // // //       setLoadingAddress(true);
// // // // //       fetch(`${erpnextConfig.url}/api/resource/Address?filters=[["Dynamic Link", "link_doctype", "=", "Customer"], ["Dynamic Link", "link_name", "=", "${selectedTenant.id}"]]&fields=["address_line1","address_line2","city","state","country","pincode"]`, {
// // // // //         credentials: 'include',
// // // // //       headers: {
// // // // //           'Content-Type': 'application/json'
// // // // //         }
// // // // //       })
// // // // //       .then(res => res.json())
// // // // //       .then(json => {
// // // // //         const list = json.data || [];
// // // // //         if (list.length > 0) {
// // // // //           const addr = list[0];
// // // // //           const parts = [addr.address_line1, addr.address_line2, addr.city, addr.state, addr.country, addr.pincode].filter(Boolean);
// // // // //           setTenantAddress(parts.join(', '));
// // // // //         } else {
// // // // //           setTenantAddress('No address registered in system');
// // // // //         }
// // // // //       })
// // // // //       .catch(err => {
// // // // //         console.warn('Failed fetching tenant address:', err);
// // // // //       })
// // // // //       .finally(() => {
// // // // //         setLoadingAddress(false);
// // // // //       });
// // // // //     }
// // // // //   }, [selectedTenant, erpnextConfig]);

// // // // //   // Pagination states & calculations
// // // // //   const [currentPage, setCurrentPage] = useState(1);
// // // // //   const itemsPerPage = 20;

// // // // //   const totalPages = Math.ceil(tenants.length / itemsPerPage);
// // // // //   const indexOfLastItem = currentPage * itemsPerPage;
// // // // //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// // // // //   const currentItems = tenants.slice(indexOfFirstItem, indexOfLastItem);

// // // // //   const renderPaginationControls = () => {
// // // // //     if (totalPages <= 1) return null;
// // // // //     return (
// // // // //       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderTop: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
// // // // //         <div>
// // // // //           Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, tenants.length)}</strong> of <strong>{tenants.length}</strong> entries
// // // // //         </div>
// // // // //         <div style={{ display: 'flex', gap: 6 }}>
// // // // //           <button 
// // // // //             type="button"
// // // // //             disabled={currentPage === 1}
// // // // //             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
// // // // //             className="btn btn-secondary"
// // // // //             style={{ padding: '6px 12px', fontSize: 12, opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
// // // // //           >
// // // // //             Previous
// // // // //           </button>
// // // // //           {[...Array(totalPages)].map((_, i) => (
// // // // //             <button
// // // // //               type="button"
// // // // //               key={i + 1}
// // // // //               onClick={() => setCurrentPage(i + 1)}
// // // // //               className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
// // // // //               style={{ padding: '6px 12px', fontSize: 12 }}
// // // // //             >
// // // // //               {i + 1}
// // // // //             </button>
// // // // //           ))}
// // // // //           <button 
// // // // //             type="button"
// // // // //             disabled={currentPage === totalPages}
// // // // //             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
// // // // //             className="btn btn-secondary"
// // // // //             style={{ padding: '6px 12px', fontSize: 12, opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
// // // // //           >
// // // // //             Next
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   };

// // // // //   // Form states
// // // // //   const [name, setName] = useState('');
// // // // //   const [email, setEmail] = useState('');
// // // // //   const [phone, setPhone] = useState('');
// // // // //   const [propertyId, setPropertyId] = useState('');
// // // // //   const [leaseStart, setLeaseStart] = useState('');
// // // // //   const [leaseEnd, setLeaseEnd] = useState('');
// // // // //   const [tenantType, setTenantType] = useState('External');
// // // // //   const [unitSpec, setUnitSpec] = useState('');
// // // // //   const [rentAmount, setRentAmount] = useState('');
// // // // //   const [address, setAddress] = useState('');

// // // // //   const handlePropertyChange = (val) => {
// // // // //     setPropertyId(val);
// // // // //     const matchedProp = properties.find(p => p.id === val);
// // // // //     if (matchedProp) {
// // // // //       setRentAmount(matchedProp.rent);
// // // // //     }
// // // // //   };

// // // // //   const handleSubmit = (e) => {
// // // // //     e.preventDefault();
// // // // //     if (!name || !email || !phone || !propertyId || !leaseStart || !leaseEnd) return;

// // // // //     const matchedProp = properties.find(p => p.id === propertyId);

// // // // //     onAddTenant({
// // // // //       id: `TEN-${Math.floor(100 + Math.random() * 900)}`,
// // // // //       name,
// // // // //       email,
// // // // //       phone,
// // // // //       propertyName: matchedProp ? `${matchedProp.name} (${unitSpec})` : 'Unknown Property',
// // // // //       propertyId,
// // // // //       propertyGroup: matchedProp ? matchedProp.name : 'Unknown Property',
// // // // //       unitSpec,
// // // // //       tenantType,
// // // // //       rentAmount: Number(rentAmount || matchedProp?.rent || 0),
// // // // //       lastPaidAmount: 0,
// // // // //       lastPaidDate: 'N/A',
// // // // //       leaseStart,
// // // // //       leaseEnd,
// // // // //       rentStatus: 'pending',
// // // // //       address
// // // // //     });

// // // // //     setName('');
// // // // //     setEmail('');
// // // // //     setPhone('');
// // // // //     setPropertyId('');
// // // // //     setLeaseStart('');
// // // // //     setLeaseEnd('');
// // // // //     setTenantType('External');
// // // // //     setUnitSpec('');
// // // // //     setRentAmount('');
// // // // //     setAddress('');
// // // // //     setShowModal(false);
// // // // //   };

// // // // //   return (
// // // // //     <div>
// // // // //       <div className="view-header">
// // // // //         <div>
// // // // //           <h1 className="view-title">Tenants Directory</h1>
// // // // //           <p className="view-subtitle">Monitor profiles, active lease contracts, contact information, and rent records.</p>
// // // // //         </div>
// // // // //         <button className="btn btn-primary" onClick={() => setShowModal(true)}>
// // // // //           <Plus size={16} /> Register Tenant
// // // // //         </button>
// // // // //       </div>

// // // // //       {/* Split Details Layout */}
// // // // //       <div className="grid-2col" style={{ gridTemplateColumns: selectedTenant ? '60% calc(40% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>

// // // // //         {/* Tenants List */}
// // // // //         <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
// // // // //           <div className="table-container">
// // // // //             <table className="custom-table">
// // // // //               <thead>
// // // // //                 <tr>
// // // // //                   <th>Tenant ID</th>
// // // // //                   <th>Full Name</th>
// // // // //                   <th>Tenant Type</th>
// // // // //                   <th>Assigned Lease Space</th>
// // // // //                   <th>Rent Amount</th>
// // // // //                   <th>Last Paid</th>
// // // // //                   <th>Rent Status</th>
// // // // //                 </tr>
// // // // //               </thead>
// // // // //               <tbody>
// // // // //                 {currentItems.map(tenant => (
// // // // //                   <tr 
// // // // //                     key={tenant.id}
// // // // //                     onClick={() => setSelectedTenant(tenant)}
// // // // //                     style={{ 
// // // // //                       cursor: 'pointer',
// // // // //                       backgroundColor: selectedTenant?.id === tenant.id ? 'var(--bg-accent-alpha)' : '',
// // // // //                       borderLeft: selectedTenant?.id === tenant.id ? '3px solid var(--brand-color)' : ''
// // // // //                     }}
// // // // //                   >
// // // // //                     <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{tenant.id}</td>
// // // // //                     <td>
// // // // //                       <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
// // // // //                         <div className="user-avatar" style={{ margin: 0, width: 32, height: 32, fontSize: 12 }}>
// // // // //                           {tenant.name.split(' ').map(n=>n[0]).join('')}
// // // // //                         </div>
// // // // //                         <div>
// // // // //                           <div style={{ fontWeight: 600 }}>{tenant.name}</div>
// // // // //                           <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{tenant.email}</div>
// // // // //                         </div>
// // // // //                       </div>
// // // // //                     </td>
// // // // //                     <td>
// // // // //                       <span className={`badge ${tenant.tenantType === 'Internal' ? 'badge-info' : 'badge-secondary'}`}>
// // // // //                         {tenant.tenantType || 'External'}
// // // // //                       </span>
// // // // //                     </td>
// // // // //                     <td>
// // // // //                       <div style={{ fontWeight: 500 }}>{tenant.propertyGroup || tenant.propertyName}</div>
// // // // //                       <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Unit: {tenant.unitSpec || 'N/A'}</div>
// // // // //                     </td>
// // // // //                     <td style={{ fontWeight: 600 }}>
// // // // //                       ${(tenant.rentAmount || 0).toLocaleString()}
// // // // //                     </td>
// // // // //                     <td>
// // // // //                       <div>${(tenant.lastPaidAmount || 0).toLocaleString()}</div>
// // // // //                       <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{tenant.lastPaidDate || 'N/A'}</div>
// // // // //                     </td>
// // // // //                     <td>
// // // // //                       <span className={`badge ${tenant.rentStatus === 'paid' ? 'badge-success' : tenant.rentStatus === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
// // // // //                         {tenant.rentStatus}
// // // // //                       </span>
// // // // //                     </td>
// // // // //                   </tr>
// // // // //                 ))}
// // // // //               </tbody>
// // // // //             </table>
// // // // //           </div>
// // // // //           {renderPaginationControls()}
// // // // //         </div>

// // // // //         {/* Selected Tenant Detail Panel */}
// // // // //         {selectedTenant && (
// // // // //           <div className="card-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.2s ease-out' }}>
// // // // //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 14 }}>
// // // // //               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// // // // //                 <User size={18} style={{ color: 'var(--brand-color)' }} />
// // // // //                 <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-color)' }}>{selectedTenant.id}</span>
// // // // //               </div>
// // // // //               <button 
// // // // //                 onClick={() => setSelectedTenant(null)}
// // // // //                 style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
// // // // //               >
// // // // //                 <X size={18} />
// // // // //               </button>
// // // // //             </div>

// // // // //             <div style={{ textAlign: 'center', padding: '10px 0' }}>
// // // // //               <div className="user-avatar" style={{ margin: '0 auto 12px', width: 64, height: 64, fontSize: 22, borderRadius: '50%' }}>
// // // // //                 {selectedTenant.name.split(' ').map(n=>n[0]).join('')}
// // // // //               </div>
// // // // //               <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>{selectedTenant.name}</h2>
// // // // //               <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
// // // // //                 <span className={`badge ${selectedTenant.rentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>Account {selectedTenant.rentStatus}</span>
// // // // //                 <span className={`badge ${selectedTenant.tenantType === 'Internal' ? 'badge-info' : 'badge-secondary'}`}>{selectedTenant.tenantType || 'External'}</span>
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* Contact Details Card */}
// // // // //             <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 12 }}>
// // // // //               <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Contact Verification</h3>

// // // // //               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// // // // //                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
// // // // //                   <Mail size={16} style={{ color: 'var(--text-secondary)' }} />
// // // // //                   <span style={{ color: 'var(--text-primary)' }}>{selectedTenant.email}</span>
// // // // //                 </div>
// // // // //                 <a href={`mailto:${selectedTenant.email}`} className="btn btn-secondary" style={{ padding: 6, display: 'flex', borderRadius: 6, borderColor: 'rgba(255,255,255,0.1)' }} title="Send Email">
// // // // //                   <Mail size={13} style={{ color: 'var(--brand-color)' }} />
// // // // //                 </a>
// // // // //               </div>

// // // // //               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// // // // //                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
// // // // //                   <Phone size={16} style={{ color: 'var(--text-secondary)' }} />
// // // // //                   <span style={{ color: 'var(--text-primary)' }}>{selectedTenant.phone}</span>
// // // // //                 </div>
// // // // //                 <a href={`tel:${selectedTenant.phone}`} className="btn btn-secondary" style={{ padding: 6, display: 'flex', borderRadius: 6, borderColor: 'rgba(255,255,255,0.1)' }} title="Call Tenant">
// // // // //                   <Phone size={13} style={{ color: 'var(--brand-color)' }} />
// // // // //                 </a>
// // // // //               </div>

// // // // //               <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
// // // // //                 <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registered Address</span>
// // // // //                 <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
// // // // //                   {loadingAddress ? <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Loading address...</span> : tenantAddress}
// // // // //                 </span>
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* Rent and Last Paid Details */}
// // // // //             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
// // // // //               <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
// // // // //                 <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Rent Amount</span>
// // // // //                 <span style={{ fontWeight: 700, color: 'var(--brand-color)', fontSize: '1.05rem' }}>${(selectedTenant.rentAmount || 0).toLocaleString()}/mo</span>
// // // // //               </div>
// // // // //               <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
// // // // //                 <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Last Paid</span>
// // // // //                 <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${(selectedTenant.lastPaidAmount || 0).toLocaleString()}</span>
// // // // //                 <span style={{ display: 'block', fontSize: 9, color: 'var(--text-secondary)', marginTop: 2 }}>on {selectedTenant.lastPaidDate || 'N/A'}</span>
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* Lease Metadata */}
// // // // //             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
// // // // //               <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
// // // // //                 <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Lease Start</span>
// // // // //                 <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedTenant.leaseStart}</span>
// // // // //               </div>
// // // // //               <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
// // // // //                 <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Lease Expiry</span>
// // // // //                 <span style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{selectedTenant.leaseEnd}</span>
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* Assigned Unit Space */}
// // // // //             <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 8 }}>
// // // // //               <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Lease Space</h3>
// // // // //               <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{selectedTenant.propertyGroup || selectedTenant.propertyName}</div>
// // // // //               {selectedTenant.unitSpec && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Unit Spec: <strong>{selectedTenant.unitSpec}</strong></div>}
// // // // //               <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Asset Space ID: <strong>{selectedTenant.propertyId}</strong></div>
// // // // //             </div>

// // // // //             <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
// // // // //               <button className="btn btn-secondary" style={{ width: '100%', fontSize: 12, gap: 8 }}>
// // // // //                 <FileText size={14} /> View Complete Lease Agreement
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}
// // // // //       </div>

// // // // //       {/* Add Tenant Modal */}
// // // // //       {showModal && (
// // // // //         <div className="modal-overlay">
// // // // //           <div className="modal-content">
// // // // //             <div className="modal-header">
// // // // //               <h3>Register New Tenant</h3>
// // // // //               <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button>
// // // // //             </div>
// // // // //             <form onSubmit={handleSubmit}>
// // // // //               <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
// // // // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1.2fr 0.8fr' }}>
// // // // //                   <div className="form-group">
// // // // //                     <label className="form-label">Full Name</label>
// // // // //                     <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Johnathan Doe" className="form-input" required />
// // // // //                   </div>
// // // // //                   <div className="form-group">
// // // // //                     <label className="form-label">Tenant Type</label>
// // // // //                     <select value={tenantType} onChange={(e) => setTenantType(e.target.value)} className="form-select">
// // // // //                       <option value="Internal">Internal</option>
// // // // //                       <option value="External">External</option>
// // // // //                     </select>
// // // // //                   </div>
// // // // //                 </div>

// // // // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// // // // //                   <div className="form-group">
// // // // //                     <label className="form-label">Email Address</label>
// // // // //                     <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. john@example.com" className="form-input" required />
// // // // //                   </div>
// // // // //                   <div className="form-group">
// // // // //                     <label className="form-label">Phone Number</label>
// // // // //                     <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +44 7911 123456" className="form-input" required />
// // // // //                   </div>
// // // // //                 </div>

// // // // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1.2fr 0.8fr' }}>
// // // // //                   <div className="form-group">
// // // // //                     <label className="form-label">Assign Property Group</label>
// // // // //                     <select value={propertyId} onChange={(e) => handlePropertyChange(e.target.value)} className="form-select" required>
// // // // //                       <option value="">-- Choose property group --</option>
// // // // //                       {properties.map(p => (
// // // // //                         <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
// // // // //                       ))}
// // // // //                     </select>
// // // // //                   </div>
// // // // //                   <div className="form-group">
// // // // //                     <label className="form-label">Unit Spec</label>
// // // // //                     <input type="text" value={unitSpec} onChange={(e) => setUnitSpec(e.target.value)} placeholder="e.g. Flat 4B" className="form-input" required />
// // // // //                   </div>
// // // // //                 </div>

// // // // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// // // // //                   <div className="form-group">
// // // // //                     <label className="form-label">Lease Start Date</label>
// // // // //                     <input type="date" value={leaseStart} onChange={(e) => setLeaseStart(e.target.value)} className="form-input" required />
// // // // //                   </div>
// // // // //                   <div className="form-group">
// // // // //                     <label className="form-label">Lease Expiry Date</label>
// // // // //                     <input type="date" value={leaseEnd} onChange={(e) => setLeaseEnd(e.target.value)} className="form-input" required />
// // // // //                   </div>
// // // // //                 </div>

// // // // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1.5fr' }}>
// // // // //                   <div className="form-group">
// // // // //                     <label className="form-label">Rent Amount ($)</label>
// // // // //                     <input type="number" value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} placeholder="Rent / mo" className="form-input" required />
// // // // //                   </div>
// // // // //                   <div className="form-group">
// // // // //                     <label className="form-label">Address</label>
// // // // //                     <textarea 
// // // // //                       value={address} 
// // // // //                       onChange={(e) => setAddress(e.target.value)} 
// // // // //                       placeholder="e.g. 123 Main St, Suite 400" 
// // // // //                       className="form-input" 
// // // // //                       style={{ minHeight: '38px', height: '38px', resize: 'none', padding: '6px 12px' }} 
// // // // //                       required 
// // // // //                     />
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </div>

// // // // //               <div className="modal-footer">
// // // // //                 <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
// // // // //                 <button type="submit" className="btn btn-primary">Add Tenant</button>
// // // // //               </div>
// // // // //             </form>
// // // // //           </div>
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // }




// // // // import React, { useState, useEffect } from 'react';
// // // // import { User, Phone, Mail, Calendar, Key, Plus, X, Award, FileText } from 'lucide-react';

// // // // export default function Tenants({ tenants, properties, onAddTenant, erpnextConfig }) {
// // // //   const [showModal, setShowModal] = useState(false);
// // // //   const [selectedTenant, setSelectedTenant] = useState(null);
// // // //   const [tenantAddress, setTenantAddress] = useState('');
// // // //   const [loadingAddress, setLoadingAddress] = useState(false);

// // // //   useEffect(() => {
// // // //     if (!selectedTenant) {
// // // //       setTenantAddress('');
// // // //       return;
// // // //     }

// // // //     // Set default/existing address if present
// // // //     setTenantAddress(selectedTenant.address || 'Address not specified');

// // // //     // Fetch address from server if config is available
// // // //     if (erpnextConfig && erpnextConfig.url) {
// // // //       setLoadingAddress(true);
// // // //       fetch(`${erpnextConfig.url}/api/resource/Address?filters=[["Dynamic Link", "link_doctype", "=", "Customer"], ["Dynamic Link", "link_name", "=", "${selectedTenant.id}"]]&fields=["address_line1","address_line2","city","state","country","pincode"]`, {
// // // //         credentials: 'include',
// // // //         headers: {
// // // //           'Content-Type': 'application/json'
// // // //         }
// // // //       })
// // // //         .then(res => res.json())
// // // //         .then(json => {
// // // //           const list = json.data || [];
// // // //           if (list.length > 0) {
// // // //             const addr = list[0];
// // // //             const parts = [addr.address_line1, addr.address_line2, addr.city, addr.state, addr.country, addr.pincode].filter(Boolean);
// // // //             setTenantAddress(parts.join(', '));
// // // //           } else {
// // // //             setTenantAddress('No address registered in system');
// // // //           }
// // // //         })
// // // //         .catch(err => {
// // // //           console.warn('Failed fetching tenant address:', err);
// // // //         })
// // // //         .finally(() => {
// // // //           setLoadingAddress(false);
// // // //         });
// // // //     }
// // // //   }, [selectedTenant, erpnextConfig]);

// // // //   // Pagination states & calculations
// // // //   const [currentPage, setCurrentPage] = useState(1);
// // // //   const itemsPerPage = 20;

// // // //   const totalPages = Math.ceil(tenants.length / itemsPerPage);
// // // //   const indexOfLastItem = currentPage * itemsPerPage;
// // // //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// // // //   const currentItems = tenants.slice(indexOfFirstItem, indexOfLastItem);

// // // //   const renderPaginationControls = () => {
// // // //     if (totalPages <= 1) return null;
// // // //     return (
// // // //       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderTop: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
// // // //         <div>
// // // //           Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, tenants.length)}</strong> of <strong>{tenants.length}</strong> entries
// // // //         </div>
// // // //         <div style={{ display: 'flex', gap: 6 }}>
// // // //           <button
// // // //             type="button"
// // // //             disabled={currentPage === 1}
// // // //             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
// // // //             className="btn btn-secondary"
// // // //             style={{ padding: '6px 12px', fontSize: 12, opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
// // // //           >
// // // //             Previous
// // // //           </button>
// // // //           {[...Array(totalPages)].map((_, i) => (
// // // //             <button
// // // //               type="button"
// // // //               key={i + 1}
// // // //               onClick={() => setCurrentPage(i + 1)}
// // // //               className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
// // // //               style={{ padding: '6px 12px', fontSize: 12 }}
// // // //             >
// // // //               {i + 1}
// // // //             </button>
// // // //           ))}
// // // //           <button
// // // //             type="button"
// // // //             disabled={currentPage === totalPages}
// // // //             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
// // // //             className="btn btn-secondary"
// // // //             style={{ padding: '6px 12px', fontSize: 12, opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
// // // //           >
// // // //             Next
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   };

// // // //   // ---- Form state ----
// // // //   // entityType drives the Individual / Company distinction (defaults to Individual,
// // // //   // matching the doctype's `depends_on: customer_type != 'Company'` fields).
// // // //   const [entityType, setEntityType] = useState('Individual');
// // // //   const [salutation, setSalutation] = useState('');
// // // //   const [customerName, setCustomerName] = useState('');
// // // //   const [gender, setGender] = useState('');
// // // //   const [dateOfBirth, setDateOfBirth] = useState('');
// // // //   const [email, setEmail] = useState('');
// // // //   const [phoneNo, setPhoneNo] = useState('');
// // // //   const [customerGroup, setCustomerGroup] = useState('');
// // // //   const [territory, setTerritory] = useState('');
// // // //   const [propertyId, setPropertyId] = useState('');
// // // //   const [leaseStart, setLeaseStart] = useState('');
// // // //   const [leaseEnd, setLeaseEnd] = useState('');
// // // //   const [unitSpec, setUnitSpec] = useState('');
// // // //   const [rentAmount, setRentAmount] = useState('');
// // // //   const [address, setAddress] = useState('');

// // // //   const resetForm = () => {
// // // //     setEntityType('Individual');
// // // //     setSalutation('');
// // // //     setCustomerName('');
// // // //     setGender('');
// // // //     setDateOfBirth('');
// // // //     setEmail('');
// // // //     setPhoneNo('');
// // // //     setCustomerGroup('');
// // // //     setTerritory('');
// // // //     setPropertyId('');
// // // //     setLeaseStart('');
// // // //     setLeaseEnd('');
// // // //     setUnitSpec('');
// // // //     setRentAmount('');
// // // //     setAddress('');
// // // //   };

// // // //   const handlePropertyChange = (val) => {
// // // //     setPropertyId(val);
// // // //     const matchedProp = properties.find(p => p.id === val);
// // // //     if (matchedProp) {
// // // //       setRentAmount(matchedProp.rent);
// // // //     }
// // // //   };

// // // //   const handleEntityTypeChange = (val) => {
// // // //     setEntityType(val);
// // // //     // Individual-only fields don't apply to a Company record
// // // //     if (val === 'Company') {
// // // //       setSalutation('');
// // // //       setGender('');
// // // //       setDateOfBirth('');
// // // //     }
// // // //   };

// // // //   // Builds the payload in the shape the Customer doctype (ERPNext) expects.
// // // //   // - customer_type is fixed to "Tenant" per the doctype default (field is read_only there).
// // // //   // - salutation / gender / date_of_birth are only sent for Individuals, mirroring the
// // // //   //   doctype's depends_on: eval:doc.customer_type != 'Company'.
// // // //   // - Lease / property / rent info goes into the table_ddcr child table (Customer Booking Details).
// // // //   const buildErpPayload = (matchedProp) => {
// // // //     const payload = {
// // // //       doctype: 'Customer',
// // // //       customer_name: customerName,
// // // //       customer_type: 'Tenant',
// // // //       email,
// // // //       phone_no: phoneNo,
// // // //       table_ddcr: [
// // // //         {
// // // //           property: propertyId,
// // // //           property_name: matchedProp ? matchedProp.name : undefined,
// // // //           unit_spec: unitSpec,
// // // //           lease_start: leaseStart,
// // // //           lease_end: leaseEnd,
// // // //           rent_amount: Number(rentAmount || matchedProp?.rent || 0)
// // // //         }
// // // //       ]
// // // //     };

// // // //     if (customerGroup) payload.customer_group = customerGroup;
// // // //     if (territory) payload.territory = territory;

// // // //     if (entityType === 'Individual') {
// // // //       if (salutation) payload.salutation = salutation;
// // // //       if (gender) payload.gender = gender;
// // // //       if (dateOfBirth) payload.date_of_birth = dateOfBirth;
// // // //     }

// // // //     return payload;
// // // //   };

// // // //   const handleSubmit = (e) => {
// // // //     e.preventDefault();
// // // //     const isValid = customerName && email && phoneNo && propertyId;
// // // //     console.log('Form submission validation:', { customerName, email, phoneNo, propertyId, isValid });
// // // //     if (!customerName || !email || !phoneNo ) return;

// // // //     const matchedProp = properties.find(p => p.id === propertyId);
// // // //     const erpPayload = buildErpPayload(matchedProp);

// // // //     onAddTenant({
// // // //       id: `TEN-${Math.floor(100 + Math.random() * 900)}`,
// // // //       name: customerName,
// // // //       email,
// // // //       phone: phoneNo,
// // // //       entityType,
// // // //       propertyName: matchedProp ? `${matchedProp.name} (${unitSpec})` : 'Unknown Property',
// // // //       propertyId,
// // // //       propertyGroup: matchedProp ? matchedProp.name : 'Unknown Property',
// // // //       unitSpec,
// // // //       rentAmount: Number(rentAmount || matchedProp?.rent || 0),
// // // //       lastPaidAmount: 0,
// // // //       lastPaidDate: 'N/A',
// // // //       leaseStart,
// // // //       leaseEnd,
// // // //       rentStatus: 'pending',
// // // //       address,
// // // //       // Actual payload to send to ERPNext's Customer resource endpoint
// // // //       erpPayload
// // // //     });

// // // //     resetForm();
// // // //     setShowModal(false);
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <div className="view-header">
// // // //         <div>
// // // //           <h1 className="view-title">Tenants Directory</h1>
// // // //           <p className="view-subtitle">Monitor profiles, active lease contracts, contact information, and rent records.</p>
// // // //         </div>
// // // //         <button className="btn btn-primary" onClick={() => setShowModal(true)}>
// // // //           <Plus size={16} /> Register Tenant
// // // //         </button>
// // // //       </div>

// // // //       {/* Split Details Layout */}
// // // //       <div className="grid-2col" style={{ gridTemplateColumns: selectedTenant ? '60% calc(40% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>

// // // //         {/* Tenants List */}
// // // //         <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
// // // //           <div className="table-container">
// // // //             <table className="custom-table">
// // // //               <thead>
// // // //                 <tr>
// // // //                   <th>Tenant ID</th>
// // // //                   <th>Full Name</th>
// // // //                   <th>Type</th>
// // // //                   <th>Assigned Lease Space</th>
// // // //                   <th>Rent Amount</th>
// // // //                   <th>Last Paid</th>
// // // //                   <th>Rent Status</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody>
// // // //                 {currentItems.length === 0 && (
// // // //                   <tr>
// // // //                     <td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>
// // // //                       No tenants registered yet.
// // // //                     </td>
// // // //                   </tr>
// // // //                 )}
// // // //                 {currentItems.map(tenant => {
// // // //                   const initials = (tenant.name || '')
// // // //                     .split(' ')
// // // //                     .filter(Boolean)
// // // //                     .map(n => n[0])
// // // //                     .join('') || '?';
// // // //                   return (
// // // //                     <tr
// // // //                       key={tenant.id}
// // // //                       onClick={() => setSelectedTenant(tenant)}
// // // //                       style={{
// // // //                         cursor: 'pointer',
// // // //                         backgroundColor: selectedTenant?.id === tenant.id ? 'var(--bg-accent-alpha)' : '',
// // // //                         borderLeft: selectedTenant?.id === tenant.id ? '3px solid var(--brand-color)' : ''
// // // //                       }}
// // // //                     >
// // // //                       <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{tenant.id}</td>
// // // //                       <td>
// // // //                         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
// // // //                           <div className="user-avatar" style={{ margin: 0, width: 32, height: 32, fontSize: 12 }}>
// // // //                             {initials}
// // // //                           </div>
// // // //                           <div>
// // // //                             <div style={{ fontWeight: 600 }}>{tenant.name}</div>
// // // //                             <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{tenant.email}</div>
// // // //                           </div>
// // // //                         </div>
// // // //                       </td>
// // // //                       <td>
// // // //                         <span className={`badge ${tenant.entityType === 'Company' ? 'badge-info' : 'badge-secondary'}`}>
// // // //                           {tenant.entityType || 'Individual'}
// // // //                         </span>
// // // //                       </td>
// // // //                       <td>
// // // //                         <div style={{ fontWeight: 500 }}>{tenant.propertyGroup || tenant.propertyName}</div>
// // // //                         <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Unit: {tenant.unitSpec || 'N/A'}</div>
// // // //                       </td>
// // // //                       <td style={{ fontWeight: 600 }}>
// // // //                         ${(tenant.rentAmount || 0).toLocaleString()}
// // // //                       </td>
// // // //                       <td>
// // // //                         <div>${(tenant.lastPaidAmount || 0).toLocaleString()}</div>
// // // //                         <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{tenant.lastPaidDate || 'N/A'}</div>
// // // //                       </td>
// // // //                       <td>
// // // //                         <span className={`badge ${tenant.rentStatus === 'paid' ? 'badge-success' : tenant.rentStatus === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
// // // //                           {tenant.rentStatus}
// // // //                         </span>
// // // //                       </td>
// // // //                     </tr>
// // // //                   );
// // // //                 })}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>
// // // //           {renderPaginationControls()}
// // // //         </div>

// // // //         {/* Selected Tenant Detail Panel */}
// // // //         {selectedTenant && (
// // // //           <div className="card-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.2s ease-out' }}>
// // // //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 14 }}>
// // // //               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// // // //                 <User size={18} style={{ color: 'var(--brand-color)' }} />
// // // //                 <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-color)' }}>{selectedTenant.id}</span>
// // // //               </div>
// // // //               <button
// // // //                 onClick={() => setSelectedTenant(null)}
// // // //                 style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
// // // //               >
// // // //                 <X size={18} />
// // // //               </button>
// // // //             </div>

// // // //             <div style={{ textAlign: 'center', padding: '10px 0' }}>
// // // //               <div className="user-avatar" style={{ margin: '0 auto 12px', width: 64, height: 64, fontSize: 22, borderRadius: '50%' }}>
// // // //                 {(selectedTenant.name || '').split(' ').filter(Boolean).map(n => n[0]).join('') || '?'}
// // // //               </div>
// // // //               <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>{selectedTenant.name}</h2>
// // // //               <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
// // // //                 <span className={`badge ${selectedTenant.rentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>Account {selectedTenant.rentStatus}</span>
// // // //                 <span className={`badge ${selectedTenant.entityType === 'Company' ? 'badge-info' : 'badge-secondary'}`}>{selectedTenant.entityType || 'Individual'}</span>
// // // //               </div>
// // // //             </div>

// // // //             {/* Contact Details Card */}
// // // //             <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 12 }}>
// // // //               <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Contact Verification</h3>

// // // //               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// // // //                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
// // // //                   <Mail size={16} style={{ color: 'var(--text-secondary)' }} />
// // // //                   <span style={{ color: 'var(--text-primary)' }}>{selectedTenant.email}</span>
// // // //                 </div>
// // // //                 <a href={`mailto:${selectedTenant.email}`} className="btn btn-secondary" style={{ padding: 6, display: 'flex', borderRadius: 6, borderColor: 'rgba(255,255,255,0.1)' }} title="Send Email">
// // // //                   <Mail size={13} style={{ color: 'var(--brand-color)' }} />
// // // //                 </a>
// // // //               </div>

// // // //               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// // // //                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
// // // //                   <Phone size={16} style={{ color: 'var(--text-secondary)' }} />
// // // //                   <span style={{ color: 'var(--text-primary)' }}>{selectedTenant.phone}</span>
// // // //                 </div>
// // // //                 <a href={`tel:${selectedTenant.phone}`} className="btn btn-secondary" style={{ padding: 6, display: 'flex', borderRadius: 6, borderColor: 'rgba(255,255,255,0.1)' }} title="Call Tenant">
// // // //                   <Phone size={13} style={{ color: 'var(--brand-color)' }} />
// // // //                 </a>
// // // //               </div>

// // // //               <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
// // // //                 <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registered Address</span>
// // // //                 <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
// // // //                   {loadingAddress ? <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Loading address...</span> : tenantAddress}
// // // //                 </span>
// // // //               </div>
// // // //             </div>

// // // //             {/* Rent and Last Paid Details */}
// // // //             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
// // // //               <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
// // // //                 <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Rent Amount</span>
// // // //                 <span style={{ fontWeight: 700, color: 'var(--brand-color)', fontSize: '1.05rem' }}>${(selectedTenant.rentAmount || 0).toLocaleString()}/mo</span>
// // // //               </div>
// // // //               <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
// // // //                 <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Last Paid</span>
// // // //                 <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${(selectedTenant.lastPaidAmount || 0).toLocaleString()}</span>
// // // //                 <span style={{ display: 'block', fontSize: 9, color: 'var(--text-secondary)', marginTop: 2 }}>on {selectedTenant.lastPaidDate || 'N/A'}</span>
// // // //               </div>
// // // //             </div>

// // // //             {/* Lease Metadata */}
// // // //             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
// // // //               <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
// // // //                 <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Lease Start</span>
// // // //                 <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedTenant.leaseStart}</span>
// // // //               </div>
// // // //               <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
// // // //                 <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Lease Expiry</span>
// // // //                 <span style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{selectedTenant.leaseEnd}</span>
// // // //               </div>
// // // //             </div>

// // // //             {/* Assigned Unit Space */}
// // // //             <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 8 }}>
// // // //               <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Lease Space</h3>
// // // //               <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{selectedTenant.propertyGroup || selectedTenant.propertyName}</div>
// // // //               {selectedTenant.unitSpec && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Unit Spec: <strong>{selectedTenant.unitSpec}</strong></div>}
// // // //               <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Asset Space ID: <strong>{selectedTenant.propertyId}</strong></div>
// // // //             </div>

// // // //             <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
// // // //               <button className="btn btn-secondary" style={{ width: '100%', fontSize: 12, gap: 8 }}>
// // // //                 <FileText size={14} /> View Complete Lease Agreement
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* Add Tenant Modal */}
// // // //       {showModal && (
// // // //         <div className="modal-overlay">
// // // //           <div className="modal-content">
// // // //             <div className="modal-header">
// // // //               <h3>Register New Tenant</h3>
// // // //               <button onClick={() => { setShowModal(false); resetForm(); }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button>
// // // //             </div>
// // // //             <form onSubmit={handleSubmit}>
// // // //               <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

// // // //                 {/* Type selection - defaults to Individual */}
// // // //                 <div className="form-group">
// // // //                   <label className="form-label">Tenant Type</label>
// // // //                   <div style={{ display: 'flex', gap: 8 }}>
// // // //                     <button
// // // //                       type="button"
// // // //                       onClick={() => handleEntityTypeChange('Individual')}
// // // //                       className={`btn ${entityType === 'Individual' ? 'btn-primary' : 'btn-secondary'}`}
// // // //                       style={{ flex: 1, fontSize: 13 }}
// // // //                     >
// // // //                       Individual
// // // //                     </button>
// // // //                     <button
// // // //                       type="button"
// // // //                       onClick={() => handleEntityTypeChange('Company')}
// // // //                       className={`btn ${entityType === 'Company' ? 'btn-primary' : 'btn-secondary'}`}
// // // //                       style={{ flex: 1, fontSize: 13 }}
// // // //                     >
// // // //                       Company
// // // //                     </button>
// // // //                   </div>
// // // //                 </div>

// // // //                 {entityType === 'Individual' && (
// // // //                   <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '0.6fr 1.4fr' }}>
// // // //                     <div className="form-group">
// // // //                       <label className="form-label">Salutation</label>
// // // //                       <select value={salutation} onChange={(e) => setSalutation(e.target.value)} className="form-select">
// // // //                         <option value="">--</option>
// // // //                         <option value="Mr">Mr</option>
// // // //                         <option value="Mrs">Mrs</option>
// // // //                         <option value="Ms">Ms</option>
// // // //                         <option value="Dr">Dr</option>
// // // //                       </select>
// // // //                     </div>
// // // //                     <div className="form-group">
// // // //                       <label className="form-label">Full Name</label>
// // // //                       <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Johnathan Doe" className="form-input" required />
// // // //                     </div>
// // // //                   </div>
// // // //                 )}

// // // //                 {entityType === 'Company' && (
// // // //                   <div className="form-group">
// // // //                     <label className="form-label">Company Name</label>
// // // //                     <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Acme Holdings Ltd" className="form-input" required />
// // // //                   </div>
// // // //                 )}

// // // //                 {entityType === 'Individual' && (
// // // //                   <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// // // //                     <div className="form-group">
// // // //                       <label className="form-label">Gender</label>
// // // //                       <select value={gender} onChange={(e) => setGender(e.target.value)} className="form-select">
// // // //                         <option value="">-- Select --</option>
// // // //                         <option value="Male">Male</option>
// // // //                         <option value="Female">Female</option>
// // // //                         <option value="Other">Other</option>
// // // //                       </select>
// // // //                     </div>
// // // //                     <div className="form-group">
// // // //                       <label className="form-label">Date of Birth</label>
// // // //                       <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="form-input" />
// // // //                     </div>
// // // //                   </div>
// // // //                 )}

// // // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// // // //                   <div className="form-group">
// // // //                     <label className="form-label">Email Address</label>
// // // //                     <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. john@example.com" className="form-input" required />
// // // //                   </div>
// // // //                   <div className="form-group">
// // // //                     <label className="form-label">Phone Number</label>
// // // //                     <input type="tel" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} placeholder="e.g. +44 7911 123456" className="form-input" required />
// // // //                   </div>
// // // //                 </div>

// // // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// // // //                   <div className="form-group">
// // // //                     <label className="form-label">Customer Group</label>
// // // //                     <input type="text" value={customerGroup} onChange={(e) => setCustomerGroup(e.target.value)} placeholder="e.g. Residential Tenants" className="form-input" />
// // // //                   </div>
// // // //                   <div className="form-group">
// // // //                     <label className="form-label">Territory</label>
// // // //                     <input type="text" value={territory} onChange={(e) => setTerritory(e.target.value)} placeholder="e.g. Local" className="form-input" />
// // // //                   </div>
// // // //                 </div>

// // // //                 {/* <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1.2fr 0.8fr' }}>
// // // //                   <div className="form-group">
// // // //                     <label className="form-label">Assign Property Group</label>
// // // //                     <select value={propertyId} onChange={(e) => handlePropertyChange(e.target.value)} className="form-select" required>
// // // //                       <option value="">-- Choose property group --</option>
// // // //                       {properties.map(p => (
// // // //                         <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
// // // //                       ))}
// // // //                     </select>
// // // //                   </div>
// // // //                   <div className="form-group">
// // // //                     <label className="form-label">Unit Spec</label>
// // // //                     <input type="text" value={unitSpec} onChange={(e) => setUnitSpec(e.target.value)} placeholder="e.g. Flat 4B" className="form-input" required />
// // // //                   </div>
// // // //                 </div>

// // // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// // // //                   <div className="form-group">
// // // //                     <label className="form-label">Lease Start Date</label>
// // // //                     <input type="date" value={leaseStart} onChange={(e) => setLeaseStart(e.target.value)} className="form-input" required />
// // // //                   </div>
// // // //                   <div className="form-group">
// // // //                     <label className="form-label">Lease Expiry Date</label>
// // // //                     <input type="date" value={leaseEnd} onChange={(e) => setLeaseEnd(e.target.value)} className="form-input" required />
// // // //                   </div>
// // // //                 </div> */}

// // // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1.5fr' }}>
// // // //                   {/* <div className="form-group">
// // // //                     <label className="form-label">Rent Amount ($)</label>
// // // //                     <input type="number" value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} placeholder="Rent / mo" className="form-input" required />
// // // //                   </div> */}
// // // //                   <div className="form-group">
// // // //                     <label className="form-label">Address</label>
// // // //                     <textarea
// // // //                       value={address}
// // // //                       onChange={(e) => setAddress(e.target.value)}
// // // //                       placeholder="e.g. 123 Main St, Suite 400"
// // // //                       className="form-input"
// // // //                       style={{ minHeight: '38px', height: '38px', resize: 'none', padding: '6px 12px' }}
// // // //                       required
// // // //                     />
// // // //                   </div>
// // // //                 </div>
// // // //               </div>

// // // //               <div className="modal-footer">
// // // //                 <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
// // // //                 <button type="submit" className="btn btn-primary">Add Tenant</button>
// // // //               </div>
// // // //             </form>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }



// // // import React, { useState, useEffect } from 'react';
// // // import { User, Phone, Mail, Calendar, Key, Plus, X, Award, FileText } from 'lucide-react';

// // // export default function Tenants({ tenants, properties, onAddTenant, erpnextConfig }) {
// // //   const [showModal, setShowModal] = useState(false);
// // //   const [selectedTenant, setSelectedTenant] = useState(null);
// // //   const [tenantAddress, setTenantAddress] = useState('');
// // //   const [loadingAddress, setLoadingAddress] = useState(false);

// // //   useEffect(() => {
// // //     if (!selectedTenant) {
// // //       setTenantAddress('');
// // //       return;
// // //     }

// // //     // Set default/existing address if present
// // //     setTenantAddress(selectedTenant.address || 'Address not specified');

// // //     // Fetch address from server if config is available
// // //     if (erpnextConfig && erpnextConfig.url) {
// // //       setLoadingAddress(true);
// // //       fetch(`${erpnextConfig.url}/api/resource/Address?filters=[["Dynamic Link", "link_doctype", "=", "Customer"], ["Dynamic Link", "link_name", "=", "${selectedTenant.id}"]]&fields=["address_line1","address_line2","city","state","country","pincode"]`, {
// // //         credentials: 'include',
// // //         headers: {
// // //           'Content-Type': 'application/json'
// // //         }
// // //       })
// // //         .then(res => res.json())
// // //         .then(json => {
// // //           const list = json.data || [];
// // //           if (list.length > 0) {
// // //             const addr = list[0];
// // //             const parts = [addr.address_line1, addr.address_line2, addr.city, addr.state, addr.country, addr.pincode].filter(Boolean);
// // //             setTenantAddress(parts.join(', '));
// // //           } else {
// // //             setTenantAddress('No address registered in system');
// // //           }
// // //         })
// // //         .catch(err => {
// // //           console.warn('Failed fetching tenant address:', err);
// // //         })
// // //         .finally(() => {
// // //           setLoadingAddress(false);
// // //         });
// // //     }
// // //   }, [selectedTenant, erpnextConfig]);

// // //   // Pagination states & calculations
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const itemsPerPage = 20;

// // //   const totalPages = Math.ceil(tenants.length / itemsPerPage);
// // //   const indexOfLastItem = currentPage * itemsPerPage;
// // //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// // //   const currentItems = tenants.slice(indexOfFirstItem, indexOfLastItem);

// // //   const renderPaginationControls = () => {
// // //     if (totalPages <= 1) return null;
// // //     return (
// // //       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderTop: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
// // //         <div>
// // //           Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, tenants.length)}</strong> of <strong>{tenants.length}</strong> entries
// // //         </div>
// // //         <div style={{ display: 'flex', gap: 6 }}>
// // //           <button
// // //             type="button"
// // //             disabled={currentPage === 1}
// // //             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
// // //             className="btn btn-secondary"
// // //             style={{ padding: '6px 12px', fontSize: 12, opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
// // //           >
// // //             Previous
// // //           </button>
// // //           {[...Array(totalPages)].map((_, i) => (
// // //             <button
// // //               type="button"
// // //               key={i + 1}
// // //               onClick={() => setCurrentPage(i + 1)}
// // //               className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
// // //               style={{ padding: '6px 12px', fontSize: 12 }}
// // //             >
// // //               {i + 1}
// // //             </button>
// // //           ))}
// // //           <button
// // //             type="button"
// // //             disabled={currentPage === totalPages}
// // //             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
// // //             className="btn btn-secondary"
// // //             style={{ padding: '6px 12px', fontSize: 12, opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
// // //           >
// // //             Next
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   // ---- Form state ----
// // //   // entityType drives the Individual / Company distinction (defaults to Individual,
// // //   // matching the doctype's `depends_on: customer_type != 'Company'` fields).
// // //   const [entityType, setEntityType] = useState('Individual');
// // //   const [salutation, setSalutation] = useState('');
// // //   const [customerName, setCustomerName] = useState('');
// // //   const [gender, setGender] = useState('');
// // //   const [dateOfBirth, setDateOfBirth] = useState('');
// // //   const [email, setEmail] = useState('');
// // //   const [phoneNo, setPhoneNo] = useState('');
// // //   const [customerGroup, setCustomerGroup] = useState('');
// // //   const [territory, setTerritory] = useState('');
// // //   const [propertyId, setPropertyId] = useState('');
// // //   const [leaseStart, setLeaseStart] = useState('');
// // //   const [leaseEnd, setLeaseEnd] = useState('');
// // //   const [unitSpec, setUnitSpec] = useState('');
// // //   const [rentAmount, setRentAmount] = useState('');
// // //   const [address, setAddress] = useState('');

// // //   const resetForm = () => {
// // //     setEntityType('Individual');
// // //     setSalutation('');
// // //     setCustomerName('');
// // //     setGender('');
// // //     setDateOfBirth('');
// // //     setEmail('');
// // //     setPhoneNo('');
// // //     setCustomerGroup('');
// // //     setTerritory('');
// // //     setPropertyId('');
// // //     setLeaseStart('');
// // //     setLeaseEnd('');
// // //     setUnitSpec('');
// // //     setRentAmount('');
// // //     setAddress('');
// // //   };

// // //   const handlePropertyChange = (val) => {
// // //     setPropertyId(val);
// // //     const matchedProp = properties.find(p => p.id === val);
// // //     if (matchedProp) {
// // //       setRentAmount(matchedProp.rent);
// // //     }
// // //   };

// // //   const handleEntityTypeChange = (val) => {
// // //     setEntityType(val);
// // //     // Individual-only fields don't apply to a Company record
// // //     if (val === 'Company') {
// // //       setSalutation('');
// // //       setGender('');
// // //       setDateOfBirth('');
// // //     }
// // //   };

// // //   // Builds the payload strictly from fields that exist on the Customer doctype
// // //   // (per field_order in the doctype JSON). Nothing here is invented:
// // //   //   customer_name  -> reqd Data field
// // //   //   email          -> Data field (NOT email_id, which is a read_only fetch field)
// // //   //   phone_no       -> Phone field (NOT mobile_no, which is a read_only fetch field)
// // //   //   customer_group -> Link field
// // //   //   territory      -> Link field
// // //   //   salutation     -> Link field, depends_on customer_type != 'Company'
// // //   //   gender         -> Link field, depends_on customer_type != 'Company'
// // //   //   date_of_birth  -> Date field, same depends_on
// // //   //   table_ddcr     -> Table field (Customer Booking Details child doctype)
// // //   //
// // //   // customer_type itself is intentionally omitted: it's read_only with
// // //   // default "Tenant" on this doctype, so the server applies it automatically.
// // //   //
// // //   // NOTE: we don't have the "Customer Booking Details" child doctype schema,
// // //   // so the keys inside table_ddcr (property, unit_spec, lease_start, lease_end,
// // //   // rent_amount) are a best guess based on the form fields. Share that doctype's
// // //   // JSON if you want these locked to the exact field names.
// // //   const buildErpPayload = (matchedProp) => {
// // //     const payload = {
// // //       doctype: 'Customer',
// // //       customer_name: customerName,
// // //       email,
// // //       phone_no: phoneNo,
// // //       table_ddcr: [
// // //         {
// // //           property: propertyId,
// // //           unit_spec: unitSpec,
// // //           lease_start: leaseStart,
// // //           lease_end: leaseEnd,
// // //           rent_amount: Number(rentAmount || matchedProp?.rent || 0)
// // //         }
// // //       ]
// // //     };

// // //     if (customerGroup) payload.customer_group = customerGroup;
// // //     if (territory) payload.territory = territory;

// // //     if (entityType === 'Individual') {
// // //       if (salutation) payload.salutation = salutation;
// // //       if (gender) payload.gender = gender;
// // //       if (dateOfBirth) payload.date_of_birth = dateOfBirth;
// // //     }

// // //     return payload;
// // //   };

// // //   const handleSubmit = (e) => {
// // //     e.preventDefault();
// // //     if (!customerName || !email || !phoneNo || !propertyId || !leaseStart || !leaseEnd) return;

// // //     const matchedProp = properties.find(p => p.id === propertyId);
// // //     const erpPayload = buildErpPayload(matchedProp);

// // //     onAddTenant({
// // //       id: `TEN-${Math.floor(100 + Math.random() * 900)}`,
// // //       name: customerName,
// // //       email,
// // //       phone: phoneNo,
// // //       entityType,
// // //       propertyName: matchedProp ? `${matchedProp.name} (${unitSpec})` : 'Unknown Property',
// // //       propertyId,
// // //       propertyGroup: matchedProp ? matchedProp.name : 'Unknown Property',
// // //       unitSpec,
// // //       rentAmount: Number(rentAmount || matchedProp?.rent || 0),
// // //       lastPaidAmount: 0,
// // //       lastPaidDate: 'N/A',
// // //       leaseStart,
// // //       leaseEnd,
// // //       rentStatus: 'pending',
// // //       address,
// // //       // Actual payload to send to ERPNext's Customer resource endpoint
// // //       erpPayload
// // //     });

// // //     resetForm();
// // //     setShowModal(false);
// // //   };

// // //   return (
// // //     <div>
// // //       <div className="view-header">
// // //         <div>
// // //           <h1 className="view-title">Tenants Directory</h1>
// // //           <p className="view-subtitle">Monitor profiles, active lease contracts, contact information, and rent records.</p>
// // //         </div>
// // //         <button className="btn btn-primary" onClick={() => setShowModal(true)}>
// // //           <Plus size={16} /> Register Tenant
// // //         </button>
// // //       </div>

// // //       {/* Split Details Layout */}
// // //       <div className="grid-2col" style={{ gridTemplateColumns: selectedTenant ? '60% calc(40% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>

// // //         {/* Tenants List */}
// // //         <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
// // //           <div className="table-container">
// // //             <table className="custom-table">
// // //               <thead>
// // //                 <tr>
// // //                   <th>Tenant ID</th>
// // //                   <th>Full Name</th>
// // //                   <th>Type</th>
// // //                   <th>Assigned Lease Space</th>
// // //                   <th>Rent Amount</th>
// // //                   <th>Last Paid</th>
// // //                   <th>Rent Status</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {currentItems.length === 0 && (
// // //                   <tr>
// // //                     <td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>
// // //                       No tenants registered yet.
// // //                     </td>
// // //                   </tr>
// // //                 )}
// // //                 {currentItems.map(tenant => {
// // //                   const initials = (tenant.name || '')
// // //                     .split(' ')
// // //                     .filter(Boolean)
// // //                     .map(n => n[0])
// // //                     .join('') || '?';
// // //                   return (
// // //                     <tr
// // //                       key={tenant.id}
// // //                       onClick={() => setSelectedTenant(tenant)}
// // //                       style={{
// // //                         cursor: 'pointer',
// // //                         backgroundColor: selectedTenant?.id === tenant.id ? 'var(--bg-accent-alpha)' : '',
// // //                         borderLeft: selectedTenant?.id === tenant.id ? '3px solid var(--brand-color)' : ''
// // //                       }}
// // //                     >
// // //                       <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{tenant.id}</td>
// // //                       <td>
// // //                         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
// // //                           <div className="user-avatar" style={{ margin: 0, width: 32, height: 32, fontSize: 12 }}>
// // //                             {initials}
// // //                           </div>
// // //                           <div>
// // //                             <div style={{ fontWeight: 600 }}>{tenant.name}</div>
// // //                             <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{tenant.email}</div>
// // //                           </div>
// // //                         </div>
// // //                       </td>
// // //                       <td>
// // //                         <span className={`badge ${tenant.entityType === 'Company' ? 'badge-info' : 'badge-secondary'}`}>
// // //                           {tenant.entityType || 'Individual'}
// // //                         </span>
// // //                       </td>
// // //                       <td>
// // //                         <div style={{ fontWeight: 500 }}>{tenant.propertyGroup || tenant.propertyName}</div>
// // //                         <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Unit: {tenant.unitSpec || 'N/A'}</div>
// // //                       </td>
// // //                       <td style={{ fontWeight: 600 }}>
// // //                         ${(tenant.rentAmount || 0).toLocaleString()}
// // //                       </td>
// // //                       <td>
// // //                         <div>${(tenant.lastPaidAmount || 0).toLocaleString()}</div>
// // //                         <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{tenant.lastPaidDate || 'N/A'}</div>
// // //                       </td>
// // //                       <td>
// // //                         <span className={`badge ${tenant.rentStatus === 'paid' ? 'badge-success' : tenant.rentStatus === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
// // //                           {tenant.rentStatus}
// // //                         </span>
// // //                       </td>
// // //                     </tr>
// // //                   );
// // //                 })}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //           {renderPaginationControls()}
// // //         </div>

// // //         {/* Selected Tenant Detail Panel */}
// // //         {selectedTenant && (
// // //           <div className="card-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.2s ease-out' }}>
// // //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 14 }}>
// // //               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// // //                 <User size={18} style={{ color: 'var(--brand-color)' }} />
// // //                 <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-color)' }}>{selectedTenant.id}</span>
// // //               </div>
// // //               <button
// // //                 onClick={() => setSelectedTenant(null)}
// // //                 style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
// // //               >
// // //                 <X size={18} />
// // //               </button>
// // //             </div>

// // //             <div style={{ textAlign: 'center', padding: '10px 0' }}>
// // //               <div className="user-avatar" style={{ margin: '0 auto 12px', width: 64, height: 64, fontSize: 22, borderRadius: '50%' }}>
// // //                 {(selectedTenant.name || '').split(' ').filter(Boolean).map(n => n[0]).join('') || '?'}
// // //               </div>
// // //               <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>{selectedTenant.name}</h2>
// // //               <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
// // //                 <span className={`badge ${selectedTenant.rentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>Account {selectedTenant.rentStatus}</span>
// // //                 <span className={`badge ${selectedTenant.entityType === 'Company' ? 'badge-info' : 'badge-secondary'}`}>{selectedTenant.entityType || 'Individual'}</span>
// // //               </div>
// // //             </div>

// // //             {/* Contact Details Card */}
// // //             <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 12 }}>
// // //               <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Contact Verification</h3>

// // //               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// // //                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
// // //                   <Mail size={16} style={{ color: 'var(--text-secondary)' }} />
// // //                   <span style={{ color: 'var(--text-primary)' }}>{selectedTenant.email}</span>
// // //                 </div>
// // //                 <a href={`mailto:${selectedTenant.email}`} className="btn btn-secondary" style={{ padding: 6, display: 'flex', borderRadius: 6, borderColor: 'rgba(255,255,255,0.1)' }} title="Send Email">
// // //                   <Mail size={13} style={{ color: 'var(--brand-color)' }} />
// // //                 </a>
// // //               </div>

// // //               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// // //                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
// // //                   <Phone size={16} style={{ color: 'var(--text-secondary)' }} />
// // //                   <span style={{ color: 'var(--text-primary)' }}>{selectedTenant.phone}</span>
// // //                 </div>
// // //                 <a href={`tel:${selectedTenant.phone}`} className="btn btn-secondary" style={{ padding: 6, display: 'flex', borderRadius: 6, borderColor: 'rgba(255,255,255,0.1)' }} title="Call Tenant">
// // //                   <Phone size={13} style={{ color: 'var(--brand-color)' }} />
// // //                 </a>
// // //               </div>

// // //               <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
// // //                 <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registered Address</span>
// // //                 <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
// // //                   {loadingAddress ? <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Loading address...</span> : tenantAddress}
// // //                 </span>
// // //               </div>
// // //             </div>

// // //             {/* Rent and Last Paid Details */}
// // //             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
// // //               <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
// // //                 <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Rent Amount</span>
// // //                 <span style={{ fontWeight: 700, color: 'var(--brand-color)', fontSize: '1.05rem' }}>${(selectedTenant.rentAmount || 0).toLocaleString()}/mo</span>
// // //               </div>
// // //               <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
// // //                 <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Last Paid</span>
// // //                 <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${(selectedTenant.lastPaidAmount || 0).toLocaleString()}</span>
// // //                 <span style={{ display: 'block', fontSize: 9, color: 'var(--text-secondary)', marginTop: 2 }}>on {selectedTenant.lastPaidDate || 'N/A'}</span>
// // //               </div>
// // //             </div>

// // //             {/* Lease Metadata */}
// // //             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
// // //               <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
// // //                 <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Lease Start</span>
// // //                 <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedTenant.leaseStart}</span>
// // //               </div>
// // //               <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
// // //                 <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Lease Expiry</span>
// // //                 <span style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{selectedTenant.leaseEnd}</span>
// // //               </div>
// // //             </div>

// // //             {/* Assigned Unit Space */}
// // //             <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 8 }}>
// // //               <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Lease Space</h3>
// // //               <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{selectedTenant.propertyGroup || selectedTenant.propertyName}</div>
// // //               {selectedTenant.unitSpec && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Unit Spec: <strong>{selectedTenant.unitSpec}</strong></div>}
// // //               <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Asset Space ID: <strong>{selectedTenant.propertyId}</strong></div>
// // //             </div>

// // //             <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
// // //               <button className="btn btn-secondary" style={{ width: '100%', fontSize: 12, gap: 8 }}>
// // //                 <FileText size={14} /> View Complete Lease Agreement
// // //               </button>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Add Tenant Modal */}
// // //       {showModal && (
// // //         <div className="modal-overlay">
// // //           <div className="modal-content">
// // //             <div className="modal-header">
// // //               <h3>Register New Tenant</h3>
// // //               <button onClick={() => { setShowModal(false); resetForm(); }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button>
// // //             </div>
// // //             <form onSubmit={handleSubmit}>
// // //               <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

// // //                 {/* Type selection - defaults to Individual */}
// // //                 <div className="form-group">
// // //                   <label className="form-label">Tenant Type</label>
// // //                   <div style={{ display: 'flex', gap: 8 }}>
// // //                     <button
// // //                       type="button"
// // //                       onClick={() => handleEntityTypeChange('Individual')}
// // //                       className={`btn ${entityType === 'Individual' ? 'btn-primary' : 'btn-secondary'}`}
// // //                       style={{ flex: 1, fontSize: 13 }}
// // //                     >
// // //                       Individual
// // //                     </button>
// // //                     <button
// // //                       type="button"
// // //                       onClick={() => handleEntityTypeChange('Company')}
// // //                       className={`btn ${entityType === 'Company' ? 'btn-primary' : 'btn-secondary'}`}
// // //                       style={{ flex: 1, fontSize: 13 }}
// // //                     >
// // //                       Company
// // //                     </button>
// // //                   </div>
// // //                 </div>

// // //                 {entityType === 'Individual' && (
// // //                   <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '0.6fr 1.4fr' }}>
// // //                     <div className="form-group">
// // //                       <label className="form-label">Salutation</label>
// // //                       <select value={salutation} onChange={(e) => setSalutation(e.target.value)} className="form-select">
// // //                         <option value="">--</option>
// // //                         <option value="Mr">Mr</option>
// // //                         <option value="Mrs">Mrs</option>
// // //                         <option value="Ms">Ms</option>
// // //                         <option value="Dr">Dr</option>
// // //                       </select>
// // //                     </div>
// // //                     <div className="form-group">
// // //                       <label className="form-label">Full Name</label>
// // //                       <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Johnathan Doe" className="form-input" required />
// // //                     </div>
// // //                   </div>
// // //                 )}

// // //                 {entityType === 'Company' && (
// // //                   <div className="form-group">
// // //                     <label className="form-label">Company Name</label>
// // //                     <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Acme Holdings Ltd" className="form-input" required />
// // //                   </div>
// // //                 )}

// // //                 {entityType === 'Individual' && (
// // //                   <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// // //                     <div className="form-group">
// // //                       <label className="form-label">Gender</label>
// // //                       <select value={gender} onChange={(e) => setGender(e.target.value)} className="form-select">
// // //                         <option value="">-- Select --</option>
// // //                         <option value="Male">Male</option>
// // //                         <option value="Female">Female</option>
// // //                         <option value="Other">Other</option>
// // //                       </select>
// // //                     </div>
// // //                     <div className="form-group">
// // //                       <label className="form-label">Date of Birth</label>
// // //                       <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="form-input" />
// // //                     </div>
// // //                   </div>
// // //                 )}

// // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// // //                   <div className="form-group">
// // //                     <label className="form-label">Email Address</label>
// // //                     <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. john@example.com" className="form-input" required />
// // //                   </div>
// // //                   <div className="form-group">
// // //                     <label className="form-label">Phone Number</label>
// // //                     <input type="tel" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} placeholder="e.g. +44 7911 123456" className="form-input" required />
// // //                   </div>
// // //                 </div>

// // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// // //                   <div className="form-group">
// // //                     <label className="form-label">Customer Group</label>
// // //                     <input type="text" value={customerGroup} onChange={(e) => setCustomerGroup(e.target.value)} placeholder="e.g. Residential Tenants" className="form-input" />
// // //                   </div>
// // //                   <div className="form-group">
// // //                     <label className="form-label">Territory</label>
// // //                     <input type="text" value={territory} onChange={(e) => setTerritory(e.target.value)} placeholder="e.g. Local" className="form-input" />
// // //                   </div>
// // //                 </div>

// // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1.2fr 0.8fr' }}>
// // //                   <div className="form-group">
// // //                     <label className="form-label">Assign Property Group</label>
// // //                     <select value={propertyId} onChange={(e) => handlePropertyChange(e.target.value)} className="form-select" required>
// // //                       <option value="">-- Choose property group --</option>
// // //                       {properties.map(p => (
// // //                         <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
// // //                       ))}
// // //                     </select>
// // //                   </div>
// // //                   <div className="form-group">
// // //                     <label className="form-label">Unit Spec</label>
// // //                     <input type="text" value={unitSpec} onChange={(e) => setUnitSpec(e.target.value)} placeholder="e.g. Flat 4B" className="form-input" required />
// // //                   </div>
// // //                 </div>

// // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// // //                   <div className="form-group">
// // //                     <label className="form-label">Lease Start Date</label>
// // //                     <input type="date" value={leaseStart} onChange={(e) => setLeaseStart(e.target.value)} className="form-input" required />
// // //                   </div>
// // //                   <div className="form-group">
// // //                     <label className="form-label">Lease Expiry Date</label>
// // //                     <input type="date" value={leaseEnd} onChange={(e) => setLeaseEnd(e.target.value)} className="form-input" required />
// // //                   </div>
// // //                 </div>

// // //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1.5fr' }}>
// // //                   <div className="form-group">
// // //                     <label className="form-label">Rent Amount ($)</label>
// // //                     <input type="number" value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} placeholder="Rent / mo" className="form-input" required />
// // //                   </div>
// // //                   <div className="form-group">
// // //                     <label className="form-label">Address</label>
// // //                     <textarea
// // //                       value={address}
// // //                       onChange={(e) => setAddress(e.target.value)}
// // //                       placeholder="e.g. 123 Main St, Suite 400"
// // //                       className="form-input"
// // //                       style={{ minHeight: '38px', height: '38px', resize: 'none', padding: '6px 12px' }}
// // //                       required
// // //                     />
// // //                   </div>
// // //                 </div>
// // //               </div>

// // //               <div className="modal-footer">
// // //                 <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
// // //                 <button type="submit" className="btn btn-primary">Add Tenant</button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }



// // import React, { useState, useEffect } from 'react';
// // import { User, Phone, Mail, Calendar, Key, Plus, X, Award, FileText } from 'lucide-react';

// // export default function Tenants({ tenants, properties, onAddTenant, erpnextConfig }) {
// //   const [showModal, setShowModal] = useState(false);
// //   const [selectedTenant, setSelectedTenant] = useState(null);
// //   const [tenantAddress, setTenantAddress] = useState('');
// //   const [loadingAddress, setLoadingAddress] = useState(false);

// //   useEffect(() => {
// //     if (!selectedTenant) {
// //       setTenantAddress('');
// //       return;
// //     }

// //     // Set default/existing address if present
// //     setTenantAddress(selectedTenant.address || 'Address not specified');

// //     // Fetch address from server if config is available
// //     if (erpnextConfig && erpnextConfig.url) {
// //       setLoadingAddress(true);
// //       fetch(`${erpnextConfig.url}/api/resource/Address?filters=[["Dynamic Link", "link_doctype", "=", "Customer"], ["Dynamic Link", "link_name", "=", "${selectedTenant.id}"]]&fields=["address_line1","address_line2","city","state","country","pincode"]`, {
// //         credentials: 'include',
// //         headers: {
// //           'Content-Type': 'application/json'
// //         }
// //       })
// //         .then(res => res.json())
// //         .then(json => {
// //           const list = json.data || [];
// //           if (list.length > 0) {
// //             const addr = list[0];
// //             const parts = [addr.address_line1, addr.address_line2, addr.city, addr.state, addr.country, addr.pincode].filter(Boolean);
// //             setTenantAddress(parts.join(', '));
// //           } else {
// //             setTenantAddress('No address registered in system');
// //           }
// //         })
// //         .catch(err => {
// //           console.warn('Failed fetching tenant address:', err);
// //         })
// //         .finally(() => {
// //           setLoadingAddress(false);
// //         });
// //     }
// //   }, [selectedTenant, erpnextConfig]);

// //   // Pagination states & calculations
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 20;

// //   const totalPages = Math.ceil(tenants.length / itemsPerPage);
// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentItems = tenants.slice(indexOfFirstItem, indexOfLastItem);

// //   const renderPaginationControls = () => {
// //     if (totalPages <= 1) return null;
// //     return (
// //       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderTop: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
// //         <div>
// //           Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, tenants.length)}</strong> of <strong>{tenants.length}</strong> entries
// //         </div>
// //         <div style={{ display: 'flex', gap: 6 }}>
// //           <button
// //             type="button"
// //             disabled={currentPage === 1}
// //             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
// //             className="btn btn-secondary"
// //             style={{ padding: '6px 12px', fontSize: 12, opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
// //           >
// //             Previous
// //           </button>
// //           {[...Array(totalPages)].map((_, i) => (
// //             <button
// //               type="button"
// //               key={i + 1}
// //               onClick={() => setCurrentPage(i + 1)}
// //               className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
// //               style={{ padding: '6px 12px', fontSize: 12 }}
// //             >
// //               {i + 1}
// //             </button>
// //           ))}
// //           <button
// //             type="button"
// //             disabled={currentPage === totalPages}
// //             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
// //             className="btn btn-secondary"
// //             style={{ padding: '6px 12px', fontSize: 12, opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
// //           >
// //             Next
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // ---- Form state ----
// //   // entityType drives the Individual / Company distinction (defaults to Individual,
// //   // matching the doctype's `depends_on: customer_type != 'Company'` fields).
// //   const [entityType, setEntityType] = useState('Individual');
// //   const [salutation, setSalutation] = useState('');
// //   const [customerName, setCustomerName] = useState('');
// //   const [gender, setGender] = useState('');
// //   const [dateOfBirth, setDateOfBirth] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [phoneNo, setPhoneNo] = useState('');
// //   const [customerGroup, setCustomerGroup] = useState('');
// //   const [territory, setTerritory] = useState('');
// //   const [propertyId, setPropertyId] = useState('');
// //   const [leaseStart, setLeaseStart] = useState('');
// //   const [leaseEnd, setLeaseEnd] = useState('');
// //   const [unitSpec, setUnitSpec] = useState('');
// //   const [rentAmount, setRentAmount] = useState('');
// //   const [address, setAddress] = useState('');

// //   const resetForm = () => {
// //     setEntityType('Individual');
// //     setSalutation('');
// //     setCustomerName('');
// //     setGender('');
// //     setDateOfBirth('');
// //     setEmail('');
// //     setPhoneNo('');
// //     setCustomerGroup('');
// //     setTerritory('');
// //     setPropertyId('');
// //     setLeaseStart('');
// //     setLeaseEnd('');
// //     setUnitSpec('');
// //     setRentAmount('');
// //     setAddress('');
// //   };

// //   const handlePropertyChange = (val) => {
// //     setPropertyId(val);
// //     const matchedProp = properties.find(p => p.id === val);
// //     if (matchedProp) {
// //       setRentAmount(matchedProp.rent);
// //     }
// //   };

// //   const handleEntityTypeChange = (val) => {
// //     setEntityType(val);
// //     // Individual-only fields don't apply to a Company record
// //     if (val === 'Company') {
// //       setSalutation('');
// //       setGender('');
// //       setDateOfBirth('');
// //     }
// //   };

// //   // Payload contains ONLY fields confirmed present in the Customer doctype JSON:
// //   //   customer_name  -> reqd Data field
// //   //   email          -> Data field (NOT email_id, which is a read_only fetch field)
// //   //   phone_no       -> Phone field (NOT mobile_no, which is a read_only fetch field)
// //   //   customer_group -> Link field
// //   //   territory      -> Link field
// //   //   salutation     -> Link field, depends_on customer_type != 'Company'
// //   //   gender         -> Link field, depends_on customer_type != 'Company'
// //   //   date_of_birth  -> Date field, same depends_on
// //   //
// //   // customer_type is omitted: read_only with default "Tenant" on this doctype,
// //   // so the server sets it automatically — sending it would be pointless/rejected.
// //   //
// //   // table_ddcr is a real field (Table -> "Customer Booking Details"), but its
// //   // CHILD doctype schema was never provided, so lease/property/unit/rent data
// //   // is deliberately left OUT of this payload rather than guessed. Send me the
// //   // "Customer Booking Details" doctype JSON and I'll add table_ddcr with the
// //   // exact confirmed field names.
// //   const buildErpPayload = () => {
// //     const payload = {
// //       doctype: 'Customer',
// //       customer_name: customerName,
// //       email,
// //       phone_no: phoneNo
// //     };

// //     if (customerGroup) payload.customer_group = customerGroup;
// //     if (territory) payload.territory = territory;

// //     if (entityType === 'Individual') {
// //       if (salutation) payload.salutation = salutation;
// //       if (gender) payload.gender = gender;
// //       if (dateOfBirth) payload.date_of_birth = dateOfBirth;
// //     }

// //     return payload;
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     if (!customerName || !email || !phoneNo || !propertyId || !leaseStart || !leaseEnd) return;

// //     const matchedProp = properties.find(p => p.id === propertyId);
// //     const erpPayload = buildErpPayload();

// //     onAddTenant({
// //       id: `TEN-${Math.floor(100 + Math.random() * 900)}`,
// //       name: customerName,
// //       email,
// //       phone: phoneNo,
// //       entityType,
// //       propertyName: matchedProp ? `${matchedProp.name} (${unitSpec})` : 'Unknown Property',
// //       propertyId,
// //       propertyGroup: matchedProp ? matchedProp.name : 'Unknown Property',
// //       unitSpec,
// //       rentAmount: Number(rentAmount || matchedProp?.rent || 0),
// //       lastPaidAmount: 0,
// //       lastPaidDate: 'N/A',
// //       leaseStart,
// //       leaseEnd,
// //       rentStatus: 'pending',
// //       address,
// //       // Actual payload to send to ERPNext's Customer resource endpoint
// //       erpPayload
// //     });

// //     resetForm();
// //     setShowModal(false);
// //   };

// //   return (
// //     <div>
// //       <div className="view-header">
// //         <div>
// //           <h1 className="view-title">Tenants Directory</h1>
// //           <p className="view-subtitle">Monitor profiles, active lease contracts, contact information, and rent records.</p>
// //         </div>
// //         <button className="btn btn-primary" onClick={() => setShowModal(true)}>
// //           <Plus size={16} /> Register Tenant
// //         </button>
// //       </div>

// //       {/* Split Details Layout */}
// //       <div className="grid-2col" style={{ gridTemplateColumns: selectedTenant ? '60% calc(40% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>

// //         {/* Tenants List */}
// //         <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
// //           <div className="table-container">
// //             <table className="custom-table">
// //               <thead>
// //                 <tr>
// //                   <th>Tenant ID</th>
// //                   <th>Full Name</th>
// //                   <th>Type</th>
// //                   <th>Assigned Lease Space</th>
// //                   <th>Rent Amount</th>
// //                   <th>Last Paid</th>
// //                   <th>Rent Status</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {currentItems.length === 0 && (
// //                   <tr>
// //                     <td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>
// //                       No tenants registered yet.
// //                     </td>
// //                   </tr>
// //                 )}
// //                 {currentItems.map(tenant => {
// //                   const initials = (tenant.name || '')
// //                     .split(' ')
// //                     .filter(Boolean)
// //                     .map(n => n[0])
// //                     .join('') || '?';
// //                   return (
// //                     <tr
// //                       key={tenant.id}
// //                       onClick={() => setSelectedTenant(tenant)}
// //                       style={{
// //                         cursor: 'pointer',
// //                         backgroundColor: selectedTenant?.id === tenant.id ? 'var(--bg-accent-alpha)' : '',
// //                         borderLeft: selectedTenant?.id === tenant.id ? '3px solid var(--brand-color)' : ''
// //                       }}
// //                     >
// //                       <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{tenant.id}</td>
// //                       <td>
// //                         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
// //                           <div className="user-avatar" style={{ margin: 0, width: 32, height: 32, fontSize: 12 }}>
// //                             {initials}
// //                           </div>
// //                           <div>
// //                             <div style={{ fontWeight: 600 }}>{tenant.name}</div>
// //                             <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{tenant.email}</div>
// //                           </div>
// //                         </div>
// //                       </td>
// //                       <td>
// //                         <span className={`badge ${tenant.entityType === 'Company' ? 'badge-info' : 'badge-secondary'}`}>
// //                           {tenant.entityType || 'Individual'}
// //                         </span>
// //                       </td>
// //                       <td>
// //                         <div style={{ fontWeight: 500 }}>{tenant.propertyGroup || tenant.propertyName}</div>
// //                         <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Unit: {tenant.unitSpec || 'N/A'}</div>
// //                       </td>
// //                       <td style={{ fontWeight: 600 }}>
// //                         ${(tenant.rentAmount || 0).toLocaleString()}
// //                       </td>
// //                       <td>
// //                         <div>${(tenant.lastPaidAmount || 0).toLocaleString()}</div>
// //                         <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{tenant.lastPaidDate || 'N/A'}</div>
// //                       </td>
// //                       <td>
// //                         <span className={`badge ${tenant.rentStatus === 'paid' ? 'badge-success' : tenant.rentStatus === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
// //                           {tenant.rentStatus}
// //                         </span>
// //                       </td>
// //                     </tr>
// //                   );
// //                 })}
// //               </tbody>
// //             </table>
// //           </div>
// //           {renderPaginationControls()}
// //         </div>

// //         {/* Selected Tenant Detail Panel */}
// //         {selectedTenant && (
// //           <div className="card-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.2s ease-out' }}>
// //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 14 }}>
// //               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// //                 <User size={18} style={{ color: 'var(--brand-color)' }} />
// //                 <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-color)' }}>{selectedTenant.id}</span>
// //               </div>
// //               <button
// //                 onClick={() => setSelectedTenant(null)}
// //                 style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
// //               >
// //                 <X size={18} />
// //               </button>
// //             </div>

// //             <div style={{ textAlign: 'center', padding: '10px 0' }}>
// //               <div className="user-avatar" style={{ margin: '0 auto 12px', width: 64, height: 64, fontSize: 22, borderRadius: '50%' }}>
// //                 {(selectedTenant.name || '').split(' ').filter(Boolean).map(n => n[0]).join('') || '?'}
// //               </div>
// //               <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>{selectedTenant.name}</h2>
// //               <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
// //                 <span className={`badge ${selectedTenant.rentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>Account {selectedTenant.rentStatus}</span>
// //                 <span className={`badge ${selectedTenant.entityType === 'Company' ? 'badge-info' : 'badge-secondary'}`}>{selectedTenant.entityType || 'Individual'}</span>
// //               </div>
// //             </div>

// //             {/* Contact Details Card */}
// //             <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 12 }}>
// //               <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Contact Verification</h3>

// //               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// //                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
// //                   <Mail size={16} style={{ color: 'var(--text-secondary)' }} />
// //                   <span style={{ color: 'var(--text-primary)' }}>{selectedTenant.email}</span>
// //                 </div>
// //                 <a href={`mailto:${selectedTenant.email}`} className="btn btn-secondary" style={{ padding: 6, display: 'flex', borderRadius: 6, borderColor: 'rgba(255,255,255,0.1)' }} title="Send Email">
// //                   <Mail size={13} style={{ color: 'var(--brand-color)' }} />
// //                 </a>
// //               </div>

// //               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// //                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
// //                   <Phone size={16} style={{ color: 'var(--text-secondary)' }} />
// //                   <span style={{ color: 'var(--text-primary)' }}>{selectedTenant.phone}</span>
// //                 </div>
// //                 <a href={`tel:${selectedTenant.phone}`} className="btn btn-secondary" style={{ padding: 6, display: 'flex', borderRadius: 6, borderColor: 'rgba(255,255,255,0.1)' }} title="Call Tenant">
// //                   <Phone size={13} style={{ color: 'var(--brand-color)' }} />
// //                 </a>
// //               </div>

// //               <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
// //                 <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registered Address</span>
// //                 <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
// //                   {loadingAddress ? <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Loading address...</span> : tenantAddress}
// //                 </span>
// //               </div>
// //             </div>

// //             {/* Rent and Last Paid Details */}
// //             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
// //               <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
// //                 <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Rent Amount</span>
// //                 <span style={{ fontWeight: 700, color: 'var(--brand-color)', fontSize: '1.05rem' }}>${(selectedTenant.rentAmount || 0).toLocaleString()}/mo</span>
// //               </div>
// //               <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
// //                 <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Last Paid</span>
// //                 <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${(selectedTenant.lastPaidAmount || 0).toLocaleString()}</span>
// //                 <span style={{ display: 'block', fontSize: 9, color: 'var(--text-secondary)', marginTop: 2 }}>on {selectedTenant.lastPaidDate || 'N/A'}</span>
// //               </div>
// //             </div>

// //             {/* Lease Metadata */}
// //             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
// //               <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
// //                 <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Lease Start</span>
// //                 <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedTenant.leaseStart}</span>
// //               </div>
// //               <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
// //                 <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Lease Expiry</span>
// //                 <span style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{selectedTenant.leaseEnd}</span>
// //               </div>
// //             </div>

// //             {/* Assigned Unit Space */}
// //             <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 8 }}>
// //               <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Lease Space</h3>
// //               <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{selectedTenant.propertyGroup || selectedTenant.propertyName}</div>
// //               {selectedTenant.unitSpec && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Unit Spec: <strong>{selectedTenant.unitSpec}</strong></div>}
// //               <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Asset Space ID: <strong>{selectedTenant.propertyId}</strong></div>
// //             </div>

// //             <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
// //               <button className="btn btn-secondary" style={{ width: '100%', fontSize: 12, gap: 8 }}>
// //                 <FileText size={14} /> View Complete Lease Agreement
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* Add Tenant Modal */}
// //       {showModal && (
// //         <div className="modal-overlay">
// //           <div className="modal-content">
// //             <div className="modal-header">
// //               <h3>Register New Tenant</h3>
// //               <button onClick={() => { setShowModal(false); resetForm(); }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button>
// //             </div>
// //             <form onSubmit={handleSubmit}>
// //               <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

// //                 {/* Type selection - defaults to Individual */}
// //                 <div className="form-group">
// //                   <label className="form-label">Tenant Type</label>
// //                   <div style={{ display: 'flex', gap: 8 }}>
// //                     <button
// //                       type="button"
// //                       onClick={() => handleEntityTypeChange('Individual')}
// //                       className={`btn ${entityType === 'Individual' ? 'btn-primary' : 'btn-secondary'}`}
// //                       style={{ flex: 1, fontSize: 13 }}
// //                     >
// //                       Individual
// //                     </button>
// //                     <button
// //                       type="button"
// //                       onClick={() => handleEntityTypeChange('Company')}
// //                       className={`btn ${entityType === 'Company' ? 'btn-primary' : 'btn-secondary'}`}
// //                       style={{ flex: 1, fontSize: 13 }}
// //                     >
// //                       Company
// //                     </button>
// //                   </div>
// //                 </div>

// //                 {entityType === 'Individual' && (
// //                   <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '0.6fr 1.4fr' }}>
// //                     <div className="form-group">
// //                       <label className="form-label">Salutation</label>
// //                       <select value={salutation} onChange={(e) => setSalutation(e.target.value)} className="form-select">
// //                         <option value="">--</option>
// //                         <option value="Mr">Mr</option>
// //                         <option value="Mrs">Mrs</option>
// //                         <option value="Ms">Ms</option>
// //                         <option value="Dr">Dr</option>
// //                       </select>
// //                     </div>
// //                     <div className="form-group">
// //                       <label className="form-label">Full Name</label>
// //                       <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Johnathan Doe" className="form-input" required />
// //                     </div>
// //                   </div>
// //                 )}

// //                 {entityType === 'Company' && (
// //                   <div className="form-group">
// //                     <label className="form-label">Company Name</label>
// //                     <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Acme Holdings Ltd" className="form-input" required />
// //                   </div>
// //                 )}

// //                 {entityType === 'Individual' && (
// //                   <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// //                     <div className="form-group">
// //                       <label className="form-label">Gender</label>
// //                       <select value={gender} onChange={(e) => setGender(e.target.value)} className="form-select">
// //                         <option value="">-- Select --</option>
// //                         <option value="Male">Male</option>
// //                         <option value="Female">Female</option>
// //                         <option value="Other">Other</option>
// //                       </select>
// //                     </div>
// //                     <div className="form-group">
// //                       <label className="form-label">Date of Birth</label>
// //                       <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="form-input" />
// //                     </div>
// //                   </div>
// //                 )}

// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// //                   <div className="form-group">
// //                     <label className="form-label">Email Address</label>
// //                     <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. john@example.com" className="form-input" required />
// //                   </div>
// //                   <div className="form-group">
// //                     <label className="form-label">Phone Number</label>
// //                     <input type="tel" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} placeholder="e.g. +44 7911 123456" className="form-input" required />
// //                   </div>
// //                 </div>

// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// //                   <div className="form-group">
// //                     <label className="form-label">Customer Group</label>
// //                     <input type="text" value={customerGroup} onChange={(e) => setCustomerGroup(e.target.value)} placeholder="e.g. Residential Tenants" className="form-input" />
// //                   </div>
// //                   <div className="form-group">
// //                     <label className="form-label">Territory</label>
// //                     <input type="text" value={territory} onChange={(e) => setTerritory(e.target.value)} placeholder="e.g. Local" className="form-input" />
// //                   </div>
// //                 </div>

// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1.2fr 0.8fr' }}>
// //                   <div className="form-group">
// //                     <label className="form-label">Assign Property Group</label>
// //                     <select value={propertyId} onChange={(e) => handlePropertyChange(e.target.value)} className="form-select" required>
// //                       <option value="">-- Choose property group --</option>
// //                       {properties.map(p => (
// //                         <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
// //                       ))}
// //                     </select>
// //                   </div>
// //                   <div className="form-group">
// //                     <label className="form-label">Unit Spec</label>
// //                     <input type="text" value={unitSpec} onChange={(e) => setUnitSpec(e.target.value)} placeholder="e.g. Flat 4B" className="form-input" required />
// //                   </div>
// //                 </div>

// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// //                   <div className="form-group">
// //                     <label className="form-label">Lease Start Date</label>
// //                     <input type="date" value={leaseStart} onChange={(e) => setLeaseStart(e.target.value)} className="form-input" required />
// //                   </div>
// //                   <div className="form-group">
// //                     <label className="form-label">Lease Expiry Date</label>
// //                     <input type="date" value={leaseEnd} onChange={(e) => setLeaseEnd(e.target.value)} className="form-input" required />
// //                   </div>
// //                 </div>

// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1.5fr' }}>
// //                   <div className="form-group">
// //                     <label className="form-label">Rent Amount ($)</label>
// //                     <input type="number" value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} placeholder="Rent / mo" className="form-input" required />
// //                   </div>
// //                   <div className="form-group">
// //                     <label className="form-label">Address</label>
// //                     <textarea
// //                       value={address}
// //                       onChange={(e) => setAddress(e.target.value)}
// //                       placeholder="e.g. 123 Main St, Suite 400"
// //                       className="form-input"
// //                       style={{ minHeight: '38px', height: '38px', resize: 'none', padding: '6px 12px' }}
// //                       required
// //                     />
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="modal-footer">
// //                 <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
// //                 <button type="submit" className="btn btn-primary">Add Tenant</button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }



// import React, { useState, useEffect } from 'react';
// import { User, Phone, Mail, Plus, X } from 'lucide-react';

// // FIELD SCOPE NOTE:
// // This form only collects fields confirmed to exist on the ERPNext "Customer"
// // doctype (see Customer.json). Fields previously collected here with no
// // confirmed home on this doctype have been removed rather than guessed:
// //   - propertyId / leaseStart / leaseEnd / unitSpec / rentAmount / address
// //     (the only candidate field is `table_ddcr`, a Table field pointing at
// //     "Customer Booking Details" - its child schema was never provided, so
// //     nothing is sent for it)
// //   - the Individual/Company toggle has also been removed: `customer_type`
// //     is `read_only: 1` with `default: "Tenant"` on this doctype, so it can
// //     never actually be set to "Company" from this form, and
// //     salutation/gender/date_of_birth (depends_on customer_type != 'Company')
// //     will therefore always apply.
// export default function Tenants({ tenants, erpnextConfig, onAddTenant }) {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedTenant, setSelectedTenant] = useState(null);
//   const [tenantAddress, setTenantAddress] = useState('');
//   const [loadingAddress, setLoadingAddress] = useState(false);

//   useEffect(() => {
//     if (!selectedTenant) {
//       setTenantAddress('');
//       return;
//     }

//     setTenantAddress('No address registered in system');

//     if (erpnextConfig && erpnextConfig.url) {
//       setLoadingAddress(true);
//       const filters = JSON.stringify([
//         ['Dynamic Link', 'link_doctype', '=', 'Customer'],
//         ['Dynamic Link', 'link_name', '=', selectedTenant.name]
//       ]);
//       const fields = JSON.stringify(['address_line1', 'address_line2', 'city', 'state', 'country', 'pincode']);
//       const url = `${erpnextConfig.url}/api/resource/Address?filters=${encodeURIComponent(filters)}&fields=${encodeURIComponent(fields)}`;

//       fetch(url, {
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' }
//       })
//         .then(res => res.json())
//         .then(json => {
//           const list = json.data || [];
//           if (list.length > 0) {
//             const addr = list[0];
//             const parts = [addr.address_line1, addr.address_line2, addr.city, addr.state, addr.country, addr.pincode].filter(Boolean);
//             setTenantAddress(parts.join(', '));
//           } else {
//             setTenantAddress('No address registered in system');
//           }
//         })
//         .catch(err => {
//           console.warn('Failed fetching tenant address:', err);
//           setTenantAddress('Unable to load address');
//         })
//         .finally(() => setLoadingAddress(false));
//     }
//   }, [selectedTenant, erpnextConfig]);

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 20;
//   const totalPages = Math.ceil(tenants.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = tenants.slice(indexOfFirstItem, indexOfLastItem);

//   const renderPaginationControls = () => {
//     if (totalPages <= 1) return null;
//     return (
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderTop: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
//         <div>
//           Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, tenants.length)}</strong> of <strong>{tenants.length}</strong> entries
//         </div>
//         <div style={{ display: 'flex', gap: 6 }}>
//           <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12, opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>Previous</button>
//           {[...Array(totalPages)].map((_, i) => (
//             <button type="button" key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '6px 12px', fontSize: 12 }}>{i + 1}</button>
//           ))}
//           <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12, opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
//         </div>
//       </div>
//     );
//   };

//   // ---- Form state: only fields confirmed on the Customer doctype ----
//   const [salutation, setSalutation] = useState('');
//   const [customerName, setCustomerName] = useState('');
//   const [gender, setGender] = useState('');
//   const [dateOfBirth, setDateOfBirth] = useState('');
//   const [email, setEmail] = useState('');
//   const [phoneNo, setPhoneNo] = useState('');
//   const [customerGroup, setCustomerGroup] = useState('');
//   const [territory, setTerritory] = useState('');

//   const resetForm = () => {
//     setSalutation('');
//     setCustomerName('');
//     setGender('');
//     setDateOfBirth('');
//     setEmail('');
//     setPhoneNo('');
//     setCustomerGroup('');
//     setTerritory('');
//   };

//   // Payload contains ONLY fields confirmed present in the Customer doctype JSON.
//   const buildErpPayload = () => {
//     const payload = {
//       doctype: 'Customer',
//       customer_name: customerName,
//       email,
//       phone_no: phoneNo
//     };
//     if (customerGroup) payload.customer_group = customerGroup;
//     if (territory) payload.territory = territory;
//     if (salutation) payload.salutation = salutation;
//     if (gender) payload.gender = gender;
//     if (dateOfBirth) payload.date_of_birth = dateOfBirth;
//     return payload;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!customerName || !email || !phoneNo) return;
//     onAddTenant(buildErpPayload());
//     resetForm();
//     setShowModal(false);
//   };

//   return (
//     <div>
//       <div className="view-header">
//         <div>
//           <h1 className="view-title">Tenants Directory</h1>
//           <p className="view-subtitle">Customer records synced with ERPNext.</p>
//         </div>
//         <button className="btn btn-primary" onClick={() => setShowModal(true)}>
//           <Plus size={16} /> Register Tenant
//         </button>
//       </div>

//       <div className="grid-2col" style={{ gridTemplateColumns: selectedTenant ? '60% calc(40% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>

//         {/* List view - columns now match real Customer doctype fields */}
//         <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
//           <div className="table-container">
//             <table className="custom-table">
//               <thead>
//                 <tr>
//                   <th>Customer ID</th>
//                   <th>Name</th>
//                   <th>Customer Group</th>
//                   <th>Territory</th>
//                   <th>Contact</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentItems.length === 0 && (
//                   <tr>
//                     <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>
//                       No tenants registered yet.
//                     </td>
//                   </tr>
//                 )}
//                 {currentItems.map(tenant => {
//                   const initials = (tenant.customer_name || '').split(' ').filter(Boolean).map(n => n[0]).join('') || '?';
//                   return (
//                     <tr
//                       key={tenant.name}
//                       onClick={() => setSelectedTenant(tenant)}
//                       style={{
//                         cursor: 'pointer',
//                         backgroundColor: selectedTenant?.name === tenant.name ? 'var(--bg-accent-alpha)' : '',
//                         borderLeft: selectedTenant?.name === tenant.name ? '3px solid var(--brand-color)' : ''
//                       }}
//                     >
//                       <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{tenant.name}</td>
//                       <td>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                           <div className="user-avatar" style={{ margin: 0, width: 32, height: 32, fontSize: 12 }}>{initials}</div>
//                           <div>
//                             <div style={{ fontWeight: 600 }}>{tenant.customer_name}</div>
//                             <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{tenant.email}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td>{tenant.customer_group || '—'}</td>
//                       <td>{tenant.territory || '—'}</td>
//                       <td>
//                         <div>{tenant.phone_no || '—'}</div>
//                         <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{tenant.email || '—'}</div>
//                       </td>
//                       <td>
//                         <span className={`badge ${tenant.disabled ? 'badge-danger' : 'badge-success'}`}>
//                           {tenant.disabled ? 'Disabled' : 'Active'}
//                         </span>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//           {renderPaginationControls()}
//         </div>

//         {/* Preview panel - only real Customer doctype fields */}
//         {selectedTenant && (
//           <div className="card-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.2s ease-out' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 14 }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                 <User size={18} style={{ color: 'var(--brand-color)' }} />
//                 <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-color)' }}>{selectedTenant.name}</span>
//               </div>
//               <button onClick={() => setSelectedTenant(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}>
//                 <X size={18} />
//               </button>
//             </div>

//             <div style={{ textAlign: 'center', padding: '10px 0' }}>
//               <div className="user-avatar" style={{ margin: '0 auto 12px', width: 64, height: 64, fontSize: 22, borderRadius: '50%' }}>
//                 {(selectedTenant.customer_name || '').split(' ').filter(Boolean).map(n => n[0]).join('') || '?'}
//               </div>
//               <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>{selectedTenant.customer_name}</h2>
//               <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
//                 <span className={`badge ${selectedTenant.disabled ? 'badge-danger' : 'badge-success'}`}>{selectedTenant.disabled ? 'Disabled' : 'Active'}</span>
//                 {selectedTenant.customer_group && <span className="badge badge-secondary">{selectedTenant.customer_group}</span>}
//               </div>
//             </div>

//             <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 12 }}>
//               <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Contact</h3>

//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
//                   <Mail size={16} style={{ color: 'var(--text-secondary)' }} />
//                   <span style={{ color: 'var(--text-primary)' }}>{selectedTenant.email || '—'}</span>
//                 </div>
//                 {selectedTenant.email && (
//                   <a href={`mailto:${selectedTenant.email}`} className="btn btn-secondary" style={{ padding: 6, display: 'flex', borderRadius: 6, borderColor: 'rgba(255,255,255,0.1)' }} title="Send Email">
//                     <Mail size={13} style={{ color: 'var(--brand-color)' }} />
//                   </a>
//                 )}
//               </div>

//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
//                   <Phone size={16} style={{ color: 'var(--text-secondary)' }} />
//                   <span style={{ color: 'var(--text-primary)' }}>{selectedTenant.phone_no || '—'}</span>
//                 </div>
//                 {selectedTenant.phone_no && (
//                   <a href={`tel:${selectedTenant.phone_no}`} className="btn btn-secondary" style={{ padding: 6, display: 'flex', borderRadius: 6, borderColor: 'rgba(255,255,255,0.1)' }} title="Call Tenant">
//                     <Phone size={13} style={{ color: 'var(--brand-color)' }} />
//                   </a>
//                 )}
//               </div>

//               <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
//                 <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registered Address</span>
//                 <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
//                   {loadingAddress ? <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Loading address...</span> : tenantAddress}
//                 </span>
//               </div>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
//               <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
//                 <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Territory</span>
//                 <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedTenant.territory || '—'}</span>
//               </div>
//               <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
//                 <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Date of Birth</span>
//                 <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedTenant.date_of_birth || '—'}</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Register modal - only fields that exist on the Customer doctype */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h3>Register New Tenant</h3>
//               <button onClick={() => { setShowModal(false); resetForm(); }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button>
//             </div>
//             <form onSubmit={handleSubmit}>
//               <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

//                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '0.6fr 1.4fr' }}>
//                   <div className="form-group">
//                     <label className="form-label">Salutation</label>
//                     <select value={salutation} onChange={(e) => setSalutation(e.target.value)} className="form-select">
//                       <option value="">--</option>
//                       <option value="Mr">Mr</option>
//                       <option value="Mrs">Mrs</option>
//                       <option value="Ms">Ms</option>
//                       <option value="Dr">Dr</option>
//                     </select>
//                   </div>
//                   <div className="form-group">
//                     <label className="form-label">Full Name</label>
//                     <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Johnathan Doe" className="form-input" required />
//                   </div>
//                 </div>

//                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
//                   <div className="form-group">
//                     <label className="form-label">Gender</label>
//                     <select value={gender} onChange={(e) => setGender(e.target.value)} className="form-select">
//                       <option value="">-- Select --</option>
//                       <option value="Male">Male</option>
//                       <option value="Female">Female</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>
//                   <div className="form-group">
//                     <label className="form-label">Date of Birth</label>
//                     <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="form-input" />
//                   </div>
//                 </div>

//                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
//                   <div className="form-group">
//                     <label className="form-label">Email Address</label>
//                     <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. john@example.com" className="form-input" required />
//                   </div>
//                   <div className="form-group">
//                     <label className="form-label">Phone Number</label>
//                     <input type="tel" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} placeholder="e.g. +44 7911 123456" className="form-input" required />
//                   </div>
//                 </div>

//                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
//                   <div className="form-group">
//                     <label className="form-label">Customer Group</label>
//                     <input type="text" value={customerGroup} onChange={(e) => setCustomerGroup(e.target.value)} placeholder="e.g. Residential Tenants" className="form-input" />
//                   </div>
//                   <div className="form-group">
//                     <label className="form-label">Territory</label>
//                     <input type="text" value={territory} onChange={(e) => setTerritory(e.target.value)} placeholder="e.g. Local" className="form-input" />
//                   </div>
//                 </div>

//               </div>

//               <div className="modal-footer">
//                 <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
//                 <button type="submit" className="btn btn-primary">Add Tenant</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Plus, X } from 'lucide-react';

// FIELD SCOPE NOTE:
// This form only collects fields confirmed to exist on the ERPNext "Customer"
// doctype (see Customer.json). Fields previously collected here with no
// confirmed home on this doctype are not sent:
//   - propertyId / leaseStart / leaseEnd / unitSpec / rentAmount / address
//     (the only candidate field is `table_ddcr`, a Table field pointing at
//     "Customer Booking Details" - its child schema was never provided, so
//     nothing is sent for it)
//
// The Individual/Company toggle below is UI-only: `customer_type` is
// `read_only: 1` with `default: "Tenant"` on this doctype, so it is NEVER
// included in the outgoing payload and can't actually be set to "Company"
// via this form. The toggle instead drives which fields are shown/collected
// client-side (salutation, gender, date_of_birth only apply to Individual),
// mirroring the doctype's own depends_on behavior for those fields.
export default function Tenants({ tenants, erpnextConfig, onAddTenant }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [tenantAddress, setTenantAddress] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);

  useEffect(() => {
    if (!selectedTenant) {
      setTenantAddress('');
      return;
    }

    setTenantAddress('No address registered in system');

    if (erpnextConfig && erpnextConfig.url) {
      setLoadingAddress(true);
      const filters = JSON.stringify([
        ['Dynamic Link', 'link_doctype', '=', 'Customer'],
        ['Dynamic Link', 'link_name', '=', selectedTenant.name]
      ]);
      const fields = JSON.stringify(['address_line1', 'address_line2', 'city', 'state', 'country', 'pincode']);
      const url = `${erpnextConfig.url}/api/resource/Address?filters=${encodeURIComponent(filters)}&fields=${encodeURIComponent(fields)}`;

      fetch(url, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .then(json => {
          const list = json.data || [];
          if (list.length > 0) {
            const addr = list[0];
            const parts = [addr.address_line1, addr.address_line2, addr.city, addr.state, addr.country, addr.pincode].filter(Boolean);
            setTenantAddress(parts.join(', '));
          } else {
            setTenantAddress('No address registered in system');
          }
        })
        .catch(err => {
          console.warn('Failed fetching tenant address:', err);
          setTenantAddress('Unable to load address');
        })
        .finally(() => setLoadingAddress(false));
    }
  }, [selectedTenant, erpnextConfig]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = selectedTenant ? 6 : 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [tenants.length]);

  const sortedTenants = [...tenants].sort((a, b) => {
    if (a._pending && !b._pending) return -1;
    if (!a._pending && b._pending) return 1;
    const dateA = new Date(a.modified || a.creation || 0);
    const dateB = new Date(b.modified || b.creation || 0);
    return dateB - dateA;
  });

  const totalPages = Math.ceil(sortedTenants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTenants.slice(indexOfFirstItem, indexOfLastItem);

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

  // ---- Form state: only fields confirmed on the Customer doctype ----
  // entityType is UI-only (see note above) — defaults to Individual.
  const [entityType, setEntityType] = useState('Individual');
  const [salutation, setSalutation] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [customerGroup, setCustomerGroup] = useState('');
  const [territory, setTerritory] = useState('');

  const resetForm = () => {
    setEntityType('Individual');
    setSalutation('');
    setCustomerName('');
    setGender('');
    setDateOfBirth('');
    setEmail('');
    setPhoneNo('');
    setCustomerGroup('');
    setTerritory('');
  };

  const handleEntityTypeChange = (val) => {
    setEntityType(val);
    // Individual-only fields don't apply once switched to Company
    if (val === 'Company') {
      setSalutation('');
      setGender('');
      setDateOfBirth('');
    }
  };

  // Payload contains ONLY fields confirmed present in the Customer doctype JSON.
  // customer_type is deliberately omitted: it's read_only on this doctype with
  // a server-side default of "Tenant", so sending it would be pointless/rejected.
  const buildErpPayload = () => {
    const payload = {
      custom_type: entityType,
      doctype: 'Customer',
      customer_name: customerName,
      email,
      phone_no: phoneNo
    };
    if (customerGroup) payload.customer_group = customerGroup;
    if (territory) payload.territory = territory;

    if (entityType === 'Individual') {
      if (salutation) payload.salutation = salutation;
      if (gender) payload.gender = gender;
      if (dateOfBirth) payload.date_of_birth = dateOfBirth;
    }
    console.log('ERP Payload:', payload);

    return payload;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !email || !phoneNo) return;
    onAddTenant(buildErpPayload());
    resetForm();
    setShowModal(false);
  };

  return (
    <div>
      {/* <div className="view-header">
        <div>
          <h1 className="view-title">Tenants Directory</h1>
          <p className="view-subtitle">Customer records synced with ERPNext.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Register Tenant
        </button>
      </div> */}

      <div className="grid-2col" style={{ gridTemplateColumns: selectedTenant ? '60% calc(40% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>

        <div className="card-panel" style={{
          padding: 0,
          overflow: 'hidden',
          filter: selectedTenant ? 'blur(4px)' : 'none',
          transition: 'filter 0.3s ease'
        }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Customer Group</th>
                  <th>Territory</th>
                  <th>Contact</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>
                      No tenants registered yet.
                    </td>
                  </tr>
                )}
                {currentItems.map(tenant => {
                  const initials = (tenant.customer_name || '').split(' ').filter(Boolean).map(n => n[0]).join('') || '?';
                  return (
                    <tr
                      key={tenant.name}
                      onClick={() => setSelectedTenant(tenant)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedTenant?.name === tenant.name ? 'var(--bg-accent-alpha)' : '',
                        borderLeft: selectedTenant?.name === tenant.name ? '3px solid var(--brand-color)' : ''
                      }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="user-avatar" style={{ margin: 0, width: 32, height: 32, fontSize: 12 }}>{initials}</div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{tenant.customer_name}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{tenant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{tenant.custom_type}</td>

                      <td>{tenant.customer_group || '—'}</td>
                      <td>{tenant.territory || '—'}</td>
                      <td>
                        <div>{tenant.phone_no || '—'}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{tenant.email || '—'}</div>
                      </td>
                      <td>
                        <span className={`badge ${tenant.disabled ? 'badge-danger' : 'badge-success'}`}>
                          {tenant.disabled ? 'Inactive' : 'Active'}
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

        {/* Preview panel - only real Customer doctype fields */}
        {selectedTenant && (
          <div className="card-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.2s ease-out', overflowY: 'auto', maxHeight: '85vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={18} style={{ color: 'var(--brand-color)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-color)' }}>{selectedTenant.name}</span>
              </div>
              <button onClick={() => setSelectedTenant(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div className="user-avatar" style={{ margin: '0 auto 12px', width: 64, height: 64, fontSize: 22, borderRadius: '50%' }}>
                {(selectedTenant.customer_name || '').split(' ').filter(Boolean).map(n => n[0]).join('') || '?'}
              </div>
              <h2 style={{ fontSize: '1.3rem', marginBottom: 6, fontWeight: 700, color: 'var(--text-primary)' }}>{selectedTenant.customer_name}</h2>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className={`badge ${selectedTenant.disabled ? 'badge-danger' : 'badge-success'}`}>
                  {selectedTenant.disabled ? 'Inactive' : 'Active'}
                </span>
                {selectedTenant.custom_type && (
                  <span className="badge badge-secondary">{selectedTenant.custom_type}</span>
                )}
              </div>
            </div>

            {/* Profile Info Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px 0', fontWeight: 700 }}>Profile Details</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>Is Internal?</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {selectedTenant.is_internal_customer ? 'Yes' : 'No'}
                  </span>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>Currency</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {selectedTenant.default_currency || 'FJD'}
                  </span>
                </div>
              </div>

              {selectedTenant.company_name && (
                <div style={{ background: 'var(--bg-tertiary)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>Company Name</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {selectedTenant.company_name}
                  </span>
                </div>
              )}
            </div>

            {/* Contact Details Section */}
            <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px 0', fontWeight: 700 }}>Contact & Address</h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                  <Mail size={16} style={{ color: 'var(--text-secondary)' }} />
                  <span style={{ color: 'var(--text-primary)' }}>{selectedTenant.email || '—'}</span>
                </div>
                {selectedTenant.email && (
                  <a href={`mailto:${selectedTenant.email}`} className="btn btn-secondary" style={{ padding: 6, display: 'flex', borderRadius: 6, borderColor: 'rgba(255,255,255,0.1)' }} title="Send Email">
                    <Mail size={13} style={{ color: 'var(--brand-color)' }} />
                  </a>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                  <Phone size={16} style={{ color: 'var(--text-secondary)' }} />
                  <span style={{ color: 'var(--text-primary)' }}>{selectedTenant.phone_no || '—'}</span>
                </div>
                {selectedTenant.phone_no && (
                  <a href={`tel:${selectedTenant.phone_no}`} className="btn btn-secondary" style={{ padding: 6, display: 'flex', borderRadius: 6, borderColor: 'rgba(255,255,255,0.1)' }} title="Call Tenant">
                    <Phone size={13} style={{ color: 'var(--brand-color)' }} />
                  </a>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registered Address</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  {loadingAddress ? <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Loading address...</span> : tenantAddress}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Territory</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedTenant.territory || '—'}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Date of Birth</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedTenant.date_of_birth || '—'}</span>
              </div>
            </div>

            {/* System Info Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
              <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px 0', fontWeight: 700 }}>System Information</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '9px', marginBottom: '2px' }}>Created On</span>
                  <span>{selectedTenant.creation ? selectedTenant.creation.split('.')[0] : '—'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '9px', marginBottom: '2px' }}>Owner</span>
                  <span style={{ wordBreak: 'break-all' }}>{selectedTenant.owner || '—'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '9px', marginBottom: '2px' }}>Last Modified</span>
                  <span>{selectedTenant.modified ? selectedTenant.modified.split('.')[0] : '—'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '9px', marginBottom: '2px' }}>Modified By</span>
                  <span style={{ wordBreak: 'break-all' }}>{selectedTenant.modified_by || '—'}</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Register modal - only fields that exist on the Customer doctype */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Register New Tenant</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

                {/* Type toggle - UI-only, defaults to Individual (see FIELD SCOPE NOTE) */}
                <div className="form-group">
                  <label className="form-label">Tenant Type</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => handleEntityTypeChange('Individual')}
                      className={`btn ${entityType === 'Individual' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, fontSize: 13 }}
                    >
                      Individual
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEntityTypeChange('Company')}
                      className={`btn ${entityType === 'Company' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, fontSize: 13 }}
                    >
                      Company
                    </button>
                  </div>
                </div>

                {entityType === 'Individual' && (
                  <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '0.6fr 1.4fr' }}>
                    <div className="form-group">
                      <label className="form-label">Salutation</label>
                      <select value={salutation} onChange={(e) => setSalutation(e.target.value)} className="form-select">
                        <option value="">--</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Dr">Dr</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Johnathan Doe" className="form-input" required />
                    </div>
                  </div>
                )}

                {entityType === 'Company' && (
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Acme Holdings Ltd" className="form-input" required />
                  </div>
                )}

                {entityType === 'Individual' && (
                  <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select value={gender} onChange={(e) => setGender(e.target.value)} className="form-select">
                        <option value="">-- Select --</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="form-input" />
                    </div>
                  </div>
                )}

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. john@example.com" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} placeholder="e.g. +44 7911 123456" className="form-input" required />
                  </div>
                </div>

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Customer Group</label>
                    <input type="text" value={customerGroup} onChange={(e) => setCustomerGroup(e.target.value)} placeholder="e.g. Residential Tenants" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Territory</label>
                    <input type="text" value={territory} onChange={(e) => setTerritory(e.target.value)} placeholder="e.g. Local" className="form-input" />
                  </div>
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Tenant</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}