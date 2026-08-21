import React, { useState, useEffect } from 'react';
import { UserCheck, ShieldCheck, Mail, Phone, Briefcase, DollarSign, X, CheckCircle, Clock, MapPin, Star, ChevronRight, Building } from 'lucide-react';

export default function Owners({ owners, erpnextConfig }) {
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [vendorDetails, setVendorDetails] = useState(null);

  // Pagination states & calculations
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = selectedOwner ? 6 : 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [owners.length]);

  const totalPages = Math.ceil(owners.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = owners.slice(indexOfFirstItem, indexOfLastItem);

  // Load detailed information on demand
  useEffect(() => {
    if (!selectedOwner) {
      setVendorDetails(null);
      return;
    }

    // Set fallback initial details from listing data
    const fallbackDetails = {
      id: selectedOwner.id,
      name: selectedOwner.name,
      supplier_type: selectedOwner.supplier_type,
      supplier_group: selectedOwner.supplier_group,
      email: selectedOwner.email,
      phone: selectedOwner.phone,
      address: selectedOwner.address || '',
      properties: selectedOwner.properties || [],
      addresses: [],
      contacts: [],
      service_name: selectedOwner.service_name || [],
      custom_services_list: selectedOwner.custom_services_list || []
    };
    setVendorDetails(fallbackDetails);

    if (!erpnextConfig || !erpnextConfig.url || selectedOwner.id.startsWith('OWN-')) {
      console.log('Contractor Details (Fallback/Offline Response):', fallbackDetails);
      return;
    }

    const fetchDetails = async () => {
      setDetailsLoading(true);
      try {
        const idEnc = encodeURIComponent(selectedOwner.id);

        // 1. Fetch Supplier Doc
        const supPromise = fetch(`${erpnextConfig.url}/api/resource/Supplier/${idEnc}`, { credentials: 'include' })
          .then(res => res.ok ? res.json() : null)
          .catch(() => null);

        // 2. Fetch Addresses
        const addrPromise = fetch(`${erpnextConfig.url}/api/resource/Address?filters=[["Dynamic Link", "link_doctype", "=", "Supplier"], ["Dynamic Link", "link_name", "=", "${selectedOwner.id}"]]&fields=["address_line1","address_line2","city","state","country","pincode"]`, { credentials: 'include' })
          .then(res => res.ok ? res.json() : null)
          .catch(() => null);

        // 3. Fetch Contacts
        const contactPromise = fetch(`${erpnextConfig.url}/api/resource/Contact?filters=[["Dynamic Link", "link_doctype", "=", "Supplier"], ["Dynamic Link", "link_name", "=", "${selectedOwner.id}"]]&fields=["name","email_id","phone","first_name","last_name"]`, { credentials: 'include' })
          .then(res => res.ok ? res.json() : null)
          .catch(() => null);

        const [supJson, addrJson, contactJson] = await Promise.all([supPromise, addrPromise, contactPromise]);

        console.log('Contractor API Responses:', {
          supplierResponse: supJson,
          addressResponse: addrJson,
          contactResponse: contactJson
        });

        const supplierData = supJson?.data || supJson || {};
        const addressList = addrJson?.data || addrJson || [];
        let contactList = contactJson?.data || contactJson || [];

        // Compile display Address
        let addressStr = '';
        if (addressList.length > 0) {
          const addr = addressList[0];
          addressStr = [addr.address_line1, addr.address_line2, addr.city, addr.state, addr.country, addr.pincode].filter(Boolean).join(', ');
        }

        // Fetch detailed contact information for any contact whose first_name is "Jitendra"
        contactList = await Promise.all(contactList.map(async (c) => {
          if (c.first_name === 'Jitendra' && c.name) {
            try {
              const detailRes = await fetch(`${erpnextConfig.url}/api/resource/Contact/${encodeURIComponent(c.name)}`, { credentials: 'include' });
              if (detailRes.ok) {
                const detailJson = await detailRes.json();
                const contactDetails = detailJson?.data || detailJson || {};
                console.log('Fetched Detailed Contact (Jitendra):', contactDetails);
                const fetchedPhone = contactDetails.phone || (contactDetails.phone_nos && contactDetails.phone_nos[0]?.phone) || '';
                const fetchedEmail = contactDetails.email_id || (contactDetails.email_ids && contactDetails.email_ids[0]?.email_id) || '';
                return {
                  ...c,
                  phone: fetchedPhone || c.phone,
                  email_id: fetchedEmail || c.email_id
                };
              }
            } catch (err) {
              console.warn('Failed fetching detailed contact info:', err);
            }
          }
          return c;
        }));

        let contactPhone = selectedOwner.phone || '';
        let contactEmail = selectedOwner.email || '';
        if (contactList.length > 0) {
          contactEmail = contactList[0].email_id || contactEmail;
          contactPhone = contactList[0].phone || contactPhone;
        }

        const compiledDetails = {
          ...fallbackDetails,
          supplier_type: supplierData.supplier_type || fallbackDetails.supplier_type,
          supplier_group: supplierData.supplier_group || fallbackDetails.supplier_group,
          address: addressStr || fallbackDetails.address,
          email: contactEmail || fallbackDetails.email,
          phone: contactPhone || fallbackDetails.phone,
          addresses: addressList,
          contacts: contactList,
          service_name: supplierData.service_name || fallbackDetails.service_name,
          custom_services_list: supplierData.custom_services_list || fallbackDetails.custom_services_list
        };

        console.log('Compiled Contractor Details:', compiledDetails);

        setVendorDetails(compiledDetails);
      } catch (err) {
        console.warn('Failed fetching supplier details:', err);
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchDetails();
  }, [selectedOwner, erpnextConfig]);

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

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">Contractors Details</h1>
          <p className="view-subtitle">Manage properties owners, estate syndicates, suppliers, and service providers.</p>
        </div>
      </div>

      {/* Split Details Layout */}
      <div className="grid-2col" style={{ gridTemplateColumns: selectedOwner ? '60% calc(40% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>

        {/* Vendors/Suppliers List */}
        <div className="card-panel" style={{
          padding: 0,
          overflow: 'hidden',
          filter: selectedOwner ? 'blur(4px)' : 'none',
          transition: 'filter 0.3s ease'
        }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Vendor ID</th>
                  <th>Vendor Name</th>
                  <th>Type</th>
                  <th>Group</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(owner => (
                  <tr
                    key={owner.id}
                    onClick={() => setSelectedOwner(owner)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: selectedOwner?.id === owner.id ? 'var(--bg-accent-alpha)' : '',
                      borderLeft: selectedOwner?.id === owner.id ? '3px solid var(--brand-color)' : ''
                    }}
                  >
                    <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{owner.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{owner.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{owner.email}</div>
                    </td>
                    <td>
                      <span className="badge badge-secondary" style={{ textTransform: 'none' }}>
                        {owner.supplier_type || 'Services'}
                      </span>
                    </td>
                    <td>{owner.supplier_group || 'Local'}</td>
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                      No vendors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {renderPaginationControls()}
        </div>

        {/* Selected Vendor Detail Panel */}
        {selectedOwner && (
          <div className="card-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.2s ease-out', height: 'calc(100vh - 70px)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={18} style={{ color: '#10b981' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>{selectedOwner.name} Details</span>
              </div>
              <button
                onClick={() => setSelectedOwner(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
              >
                <X size={18} />
              </button>
            </div>

            {detailsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                Loading details from ERPNext Supplier...
              </div>
            ) : (
              <>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)' }}>{vendorDetails?.name || selectedOwner.name}</h2>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8, alignItems: 'center' }}>
                    <span className="badge badge-success" style={{ gap: 4, fontSize: 9, padding: '3px 8px', borderRadius: '12px' }}>
                      <CheckCircle size={10} /> Verified Vendor
                    </span>
                    <span className="badge badge-info" style={{ fontSize: 9, padding: '3px 8px', borderRadius: '12px' }}>
                      {vendorDetails?.supplier_type || selectedOwner.supplier_type || 'Services'}
                    </span>
                    {(() => {
                      const rawServices = vendorDetails?.custom_services_list || vendorDetails?.service_name || selectedOwner?.custom_services_list || selectedOwner?.service_name || [];
                      const depts = Array.from(new Set(rawServices.map(s => s.service_group).filter(Boolean)));
                      return depts.map((d, i) => (
                        <span key={i} className="badge badge-warning" style={{ fontSize: 9, padding: '3px 8px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                          {d}
                        </span>
                      ));
                    })()}
                  </div>

                  {/* Rating Block */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1, 2, 3, 4].map(n => <Star key={n} size={14} fill="#fbbf24" stroke="#fbbf24" />)}
                      <Star size={14} fill="#e5e7eb" stroke="#d1d5db" />
                    </div>
                    <strong style={{ fontSize: 12, color: 'var(--text-primary)', marginLeft: 4 }}>4.0</strong>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}></span>
                  </div>
                </div>

                {/* Grid 1: Vendor & Contact Information */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Card 1: Vendor Information */}
                  <div style={{ background: 'var(--bg-primary)', padding: 16, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border-color)', paddingBottom: 8, marginBottom: 4 }}>
                      <UserCheck size={14} style={{ color: '#10b981' }} />
                      <span style={{ fontSize: 9, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vendor Information</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Vendor ID</span>
                      <strong style={{ fontSize: 12, color: 'var(--text-primary)' }}>{vendorDetails?.id || selectedOwner.id}</strong>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Vendor Type</span>
                      <strong style={{ fontSize: 12, color: 'var(--text-primary)' }}>{vendorDetails?.supplier_type || selectedOwner.supplier_type || 'Services'}</strong>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Vendor Group</span>
                      <strong style={{ fontSize: 12, color: 'var(--text-primary)' }}>{vendorDetails?.supplier_group || selectedOwner.supplier_group || 'Local'}</strong>
                    </div>

                    {(() => {
                      const rawServices = vendorDetails?.custom_services_list || vendorDetails?.service_name || selectedOwner?.custom_services_list || selectedOwner?.service_name || [];
                      const depts = Array.from(new Set(rawServices.map(s => s.service_group).filter(Boolean)));
                      if (depts.length === 0) return null;
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Department</span>
                          <strong style={{ fontSize: 12, color: '#d97706', backgroundColor: 'rgba(245, 158, 11, 0.12)', padding: '2px 6px', borderRadius: 4, width: 'fit-content', fontWeight: 700 }}>
                            {depts.join(', ')}
                          </strong>
                        </div>
                      );
                    })()}

                    {(() => {
                      const rawServices = vendorDetails?.custom_services_list || vendorDetails?.service_name || selectedOwner?.custom_services_list || selectedOwner?.service_name || [];
                      const services = Array.from(new Set(rawServices.map(s => s.services).filter(Boolean)));
                      if (services.length === 0) return null;
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Service Name</span>
                          <strong style={{ fontSize: 12, color: 'var(--text-primary)' }}>{services.join(', ')}</strong>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Card 2: Contact Information */}
                  <div style={{ background: 'var(--bg-primary)', padding: 16, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border-color)', paddingBottom: 8, marginBottom: 4 }}>
                      <Mail size={14} style={{ color: '#10b981' }} />
                      <span style={{ fontSize: 9, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Information</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Email</span>
                      <strong style={{ fontSize: 11, color: 'var(--text-primary)', wordBreak: 'break-all' }}>{vendorDetails?.email || selectedOwner.email}</strong>
                    </div>

                    {(vendorDetails?.phone || selectedOwner.phone) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Phone</span>
                        <strong style={{ fontSize: 12, color: 'var(--text-primary)' }}>{vendorDetails?.phone || selectedOwner.phone}</strong>
                      </div>
                    )}

                    {(vendorDetails?.address || selectedOwner.address) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Primary Address</span>
                        <span style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.3 }}>{vendorDetails?.address || selectedOwner.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Grid 2: Services Provided & Linked Contacts */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Card 1: Services Provided */}
                  <div style={{ background: 'var(--bg-primary)', padding: 16, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border-color)', paddingBottom: 8, marginBottom: 4 }}>
                      <Briefcase size={14} style={{ color: '#10b981' }} />
                      <span style={{ fontSize: 9, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Services Provided</span>
                    </div>

                    {(() => {
                      const rawServices = vendorDetails?.custom_services_list || vendorDetails?.service_name || selectedOwner?.custom_services_list || selectedOwner?.service_name || [];
                      if (!rawServices || rawServices.length === 0) {
                        return <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>No services declared.</span>;
                      }

                      return (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {rawServices.map((sObj, idx) => {
                            const displayVal = sObj.services || sObj.service_group || 'Service';
                            return (
                              <div key={idx} style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '4px 10px', borderRadius: '14px', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#16a34a' }} />
                                <span>{displayVal}</span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Card 2: Linked Contacts */}
                  <div style={{ background: 'var(--bg-primary)', padding: 16, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border-color)', paddingBottom: 8, marginBottom: 4 }}>
                      <Clock size={14} style={{ color: '#10b981' }} />
                      <span style={{ fontSize: 9, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Linked Contacts</span>
                    </div>

                    {vendorDetails?.contacts && vendorDetails.contacts.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {vendorDetails.contacts.map((c, idx) => (
                          <div key={idx} style={{ background: 'var(--bg-tertiary)', padding: 10, borderRadius: 6, border: '1px solid var(--border-color)', fontSize: 11, color: 'var(--text-primary)' }}>
                            <div style={{ fontWeight: 600, marginBottom: 2 }}>{[c.first_name, c.last_name].filter(Boolean).join(' ') || 'Contact'}</div>
                            {c.email_id && <div style={{ color: 'var(--text-secondary)' }}>Email: {c.email_id}</div>}
                            {c.phone && <div style={{ color: 'var(--text-secondary)' }}>Phone: {c.phone}</div>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>No linked contacts.</span>
                    )}
                  </div>
                </div>

                {/* Card 3: Assigned Holdings/Contracts */}
                <div style={{ background: 'var(--bg-primary)', padding: 16, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border-color)', paddingBottom: 8, marginBottom: 4 }}>
                    <Building size={14} style={{ color: '#10b981' }} />
                    <span style={{ fontSize: 9, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned Holdings/Contracts</span>
                  </div>

                  {selectedOwner.properties && selectedOwner.properties.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selectedOwner.properties.map((pName, index) => (
                        <div key={index} style={{ background: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s', cursor: 'pointer' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Building size={14} style={{ color: '#10b981' }} />
                            <span style={{ fontWeight: 600 }}>{pName}</span>
                          </div>
                          <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>No holdings assigned.</span>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
