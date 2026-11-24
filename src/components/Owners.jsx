import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  UserCheck, ShieldCheck, Mail, Phone, Briefcase, DollarSign, X, CheckCircle,
  Clock, MapPin, Star, ChevronRight, ChevronLeft, Building, Search, RefreshCw
} from 'lucide-react';
import { fetchDocTypeList, normalizeSupplier } from '../services/api';

export default function Owners({ owners = [], erpnextConfig }) {
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [vendorDetails, setVendorDetails] = useState(null);

  // Supplier DocType API state
  const [apiSuppliers, setApiSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [hasLoadedApi, setHasLoadedApi] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Pagination states - 10 rows per page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch Supplier DocType records using common API service
  const fetchSuppliers = useCallback(async (isRefresh = false) => {
    setLoadingSuppliers(true);
    try {
      const res = await fetchDocTypeList('Supplier', {
        page: 1,
        limit: 100, // Fetch up to 100 for fast client filtering & 10 rows/page pagination
        orderBy: 'creation desc',
        baseUrl: erpnextConfig?.url
      });
      if (res && Array.isArray(res.data)) {
        setApiSuppliers(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch Supplier DocType list:', err);
    } finally {
      setLoadingSuppliers(false);
      setHasLoadedApi(true);
    }
  }, [erpnextConfig?.url]);

  // Initial load and listen for sidebar navigation click on "Contractors"
  useEffect(() => {
    fetchSuppliers();

    const handleSidebarClick = (e) => {
      const target = e.target;
      const menuItem = target.closest && target.closest('.menu-item');
      if (
        menuItem &&
        menuItem.textContent &&
        (menuItem.textContent.trim().toLowerCase().includes('contractors') ||
          menuItem.textContent.trim().toLowerCase().includes('owners'))
      ) {
        fetchSuppliers(true);
      }
    };

    const handleNavigate = () => {
      fetchSuppliers(true);
    };

    document.addEventListener('click', handleSidebarClick);
    window.addEventListener('pms:navigate-contractors', handleNavigate);
    window.addEventListener('pms:navigate-owners', handleNavigate);
    return () => {
      document.removeEventListener('click', handleSidebarClick);
      window.removeEventListener('pms:navigate-contractors', handleNavigate);
      window.removeEventListener('pms:navigate-owners', handleNavigate);
    };
  }, [fetchSuppliers]);

  // Only use API-fetched suppliers - no dummy data fallback
  const effectiveOwners = useMemo(() => {
    return apiSuppliers || [];
  }, [apiSuppliers]);

  // Distinct groups & types for filter dropdowns
  const uniqueGroups = useMemo(() => {
    return Array.from(new Set(effectiveOwners.map(o => o.supplier_group).filter(Boolean)));
  }, [effectiveOwners]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(effectiveOwners.map(o => o.supplier_type).filter(Boolean)));
  }, [effectiveOwners]);

  // Filtered suppliers
  const filteredOwners = useMemo(() => {
    return effectiveOwners.filter(owner => {
      if (filterGroup !== 'all' && owner.supplier_group !== filterGroup) {
        return false;
      }
      if (filterType !== 'all' && owner.supplier_type !== filterType) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = (owner.id || '').toLowerCase().includes(q);
        const matchName = (owner.supplier_name || owner.name || '').toLowerCase().includes(q);
        const matchEmail = (owner.email_id || owner.email || '').toLowerCase().includes(q);
        const matchGroup = (owner.supplier_group || '').toLowerCase().includes(q);
        const matchType = (owner.supplier_type || '').toLowerCase().includes(q);
        if (!matchId && !matchName && !matchEmail && !matchGroup && !matchType) {
          return false;
        }
      }
      return true;
    });
  }, [effectiveOwners, filterGroup, filterType, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterGroup, filterType, filteredOwners.length]);

  const totalPages = Math.max(1, Math.ceil(filteredOwners.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOwners.slice(indexOfFirstItem, indexOfLastItem);

  // Load detailed information on demand
  useEffect(() => {
    if (!selectedOwner) {
      setVendorDetails(null);
      return;
    }

    // Set fallback initial details from listing data
    const fallbackDetails = {
      id: selectedOwner.id,
      name: selectedOwner.supplier_name || selectedOwner.name,
      supplier_type: selectedOwner.supplier_type,
      supplier_group: selectedOwner.supplier_group,
      email: selectedOwner.email_id || selectedOwner.email,
      phone: selectedOwner.mobile_no || selectedOwner.phone,
      address: selectedOwner.address || '',
      properties: selectedOwner.properties || [],
      addresses: [],
      contacts: [],
      service_name: selectedOwner.service_name || [],
      custom_services_list: selectedOwner.custom_services_list || []
    };
    setVendorDetails(fallbackDetails);

    if (!erpnextConfig || !erpnextConfig.url || (selectedOwner.id && selectedOwner.id.startsWith('OWN-'))) {
      console.log('Contractor Details (Fallback/Offline Response):', fallbackDetails);
      return;
    }

    const fetchDetails = async () => {
      setDetailsLoading(true);
      try {
        const idEnc = encodeURIComponent(selectedOwner.id || selectedOwner.name);

        // 1. Fetch Supplier Doc
        const supPromise = fetch(`${erpnextConfig.url}/api/resource/Supplier/${idEnc}`, { credentials: 'include' })
          .then(res => res.ok ? res.json() : null)
          .catch(() => null);

        // 2. Fetch Addresses
        const addrPromise = fetch(`${erpnextConfig.url}/api/resource/Address?filters=[["Dynamic Link", "link_doctype", "=", "Supplier"], ["Dynamic Link", "link_name", "=", "${selectedOwner.id || selectedOwner.name}"]]&fields=["address_line1","address_line2","city","state","country","pincode"]`, { credentials: 'include' })
          .then(res => res.ok ? res.json() : null)
          .catch(() => null);

        // 3. Fetch Contacts
        const contactPromise = fetch(`${erpnextConfig.url}/api/resource/Contact?filters=[["Dynamic Link", "link_doctype", "=", "Supplier"], ["Dynamic Link", "link_name", "=", "${selectedOwner.id || selectedOwner.name}"]]&fields=["name","email_id","phone","first_name","last_name"]`, { credentials: 'include' })
          .then(res => res.ok ? res.json() : null)
          .catch(() => null);

        const [supJson, addrJson, contactJson] = await Promise.all([supPromise, addrPromise, contactPromise]);

        const supplierData = supJson?.data || supJson || {};
        const addressList = addrJson?.data || addrJson || [];
        let contactList = contactJson?.data || contactJson || [];

        // Compile display Address
        let addressStr = '';
        if (addressList.length > 0) {
          const addr = addressList[0];
          addressStr = [addr.address_line1, addr.address_line2, addr.city, addr.state, addr.country, addr.pincode].filter(Boolean).join(', ');
        }

        let contactPhone = selectedOwner.mobile_no || selectedOwner.phone || '';
        let contactEmail = selectedOwner.email_id || selectedOwner.email || '';
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
    if (loadingSuppliers || !hasLoadedApi) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '12px 20px',
            borderTop: '1px solid var(--border-color)',
            fontSize: 12,
            color: 'var(--text-secondary)',
            background: 'var(--bg-card, #ffffff)',
            gap: 8
          }}
        >
          <RefreshCw size={13} className="spin" style={{ color: 'var(--brand-color)' }} />
          <span>Waiting for response</span>
        </div>
      );
    }

    const startRecord = filteredOwners.length > 0 ? indexOfFirstItem + 1 : 0;
    const endRecord = Math.min(indexOfLastItem, filteredOwners.length);

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          borderTop: '1px solid var(--border-color)',
          fontSize: 11,
          color: 'var(--text-secondary)',
          background: 'var(--bg-card, #ffffff)',
          flexShrink: 0,
          flexWrap: 'wrap',
          gap: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{startRecord}</strong> to{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{endRecord}</strong> of{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{filteredOwners.length}</strong> entries (10 rows/page)
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fetchSuppliers(true)}
            disabled={loadingSuppliers}
            title="Refresh Suppliers from ERPNext"
            style={{
              padding: '2px 8px',
              fontSize: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              height: 24,
              borderRadius: 4
            }}
          >
            <RefreshCw size={11} className={loadingSuppliers ? 'spin' : ''} />
            <span>{loadingSuppliers ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            className="btn btn-secondary"
            style={{
              padding: '4px 10px',
              fontSize: 10,
              opacity: currentPage === 1 ? 0.4 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              minWidth: 64
            }}
          >
            <ChevronLeft size={12} /> Previous
          </button>

          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                style={{
                  minWidth: 26,
                  height: 26,
                  padding: '0 5px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: pageNum === currentPage ? 700 : 500,
                  border: pageNum === currentPage ? '1px solid var(--brand-color)' : '1px solid var(--border-color)',
                  background: pageNum === currentPage ? 'var(--brand-color)' : 'transparent',
                  color: pageNum === currentPage ? '#ffffff' : 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            className="btn btn-secondary"
            style={{
              padding: '4px 10px',
              fontSize: 10,
              opacity: currentPage === totalPages ? 0.4 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              minWidth: 64
            }}
          >
            Next <ChevronRight size={12} />
          </button>
        </div>
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

      {/* Filter Toolbar */}
      <div className="card-panel" style={{ padding: '16px 24px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 12, flex: 1, minWidth: 260, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search contractors across all fields (Vendor ID, name, email, type, group)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 38 }}
            />
          </div>
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="form-select"
            style={{ width: 170 }}
          >
            <option value="all">All Groups</option>
            {uniqueGroups.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="form-select"
            style={{ width: 160 }}
          >
            <option value="all">All Types</option>
            {uniqueTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Split Details Layout */}
      <div className="grid-2col" style={{ gridTemplateColumns: selectedOwner ? '60% calc(40% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>

        {/* Vendors/Suppliers List */}
        <div className="card-panel" style={{
          padding: 0,
          overflow: 'hidden'
        }}>
          <div className="table-container" style={{ border: 'none', marginTop: 0 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>VENDOR ID</th>
                  <th>VENDOR NAME</th>
                  <th>TYPE</th>
                  <th>GROUP</th>
                </tr>
              </thead>
              <tbody>
                {loadingSuppliers || !hasLoadedApi ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                      <RefreshCw size={26} className="spin" style={{ margin: '0 auto 14px', display: 'block', color: 'var(--brand-color)' }} />
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>
                        Waiting for response
                      </div>
                    </td>
                  </tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map(owner => (
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
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{owner.supplier_name || owner.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{owner.email_id || owner.email || '—'}</div>
                      </td>
                      <td style={{ color: 'var(--text-primary)' }}>
                        {owner.supplier_type || 'Company'}
                      </td>
                      <td style={{ color: 'var(--text-primary)' }}>
                        {owner.supplier_group || 'Services'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                      No contractors found matching your filter.
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
                Waiting for response
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
