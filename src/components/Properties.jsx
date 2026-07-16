// // import React, { useState, useEffect } from 'react';
// // import { Home, Building2, Plus, Globe, Search, ArrowRight, ShieldCheck, X, Grid, Info } from 'lucide-react';

// // const fallbackImages = {
// //   residential: [
// //     'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
// //     'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
// //     'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
// //   ],
// //   commercial: [
// //     'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
// //     'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
// //     'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
// //   ],
// //   mall: [
// //     'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
// //     'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80',
// //     'https://images.unsplash.com/photo-1582037928769-181f2644ecb7?auto=format&fit=crop&w=800&q=80'
// //   ]
// // };

// // const unitFallbackImages = {
// //   residential: [
// //     'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
// //     'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
// //     'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
// //   ],
// //   commercial: [
// //     'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
// //     'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
// //     'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80'
// //   ],
// //   mall: [
// //     'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
// //     'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80',
// //     'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80'
// //   ]
// // };

// // function SecureImage({ src, alt, style, className, erpnextConfig }) {
// //   const [imgSrc, setImgSrc] = useState(null);

// //   useEffect(() => {
// //     if (!src) return;
// //     if (src.startsWith('data:') || !src.includes('/private/')) {
// //       setImgSrc(src);
// //       return;
// //     }

// //     const controller = new AbortController();
// //     const headers = {};


// //     async function fetchImage() {
// //       try {
// //         const res = await fetch(src, {
// //           credentials: 'include',
// //           headers,
// //           signal: controller.signal
// //         });
// //         if (res.ok) {
// //           const blob = await res.blob();
// //           const objectUrl = URL.createObjectURL(blob);
// //           setImgSrc(objectUrl);
// //         } else {
// //           setImgSrc(src);
// //         }
// //       } catch (err) {
// //         if (err.name !== 'AbortError') {
// //           setImgSrc(src);
// //         }
// //       }
// //     }

// //     fetchImage();

// //     return () => {
// //       controller.abort();
// //     };
// //   }, [src, erpnextConfig]);

// //   return <img src={imgSrc || src} alt={alt} style={style} className={className} />;
// // }

// // function ImageCarousel({ images, height = 180, erpnextConfig }) {
// //   const [activeIndex, setActiveIndex] = useState(0);

// //   if (!images || images.length === 0) return null;

// //   const handlePrev = (e) => {
// //     e.stopPropagation();
// //     setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
// //   };

// //   const handleNext = (e) => {
// //     e.stopPropagation();
// //     setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
// //   };

// //   return (
// //     <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', background: '#1e293b', height }}>
// //       <div style={{ display: 'flex', width: `${images.length * 100}%`, height: '100%', transform: `translateX(-${(activeIndex * 100) / images.length}%)`, transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
// //         {images.map((img, i) => (
// //           <div key={i} style={{ width: `${100 / images.length}%`, height: '100%', flexShrink: 0 }}>
// //             <SecureImage
// //               src={img}
// //               alt={`slide-${i}`}
// //               style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
// //               erpnextConfig={erpnextConfig}
// //             />
// //           </div>
// //         ))}
// //       </div>

// //       {images.length > 1 && (
// //         <>
// //           <button
// //             type="button"
// //             onClick={handlePrev}
// //             style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(4px)' }}
// //           >
// //             ‹
// //           </button>
// //           <button
// //             type="button"
// //             onClick={handleNext}
// //             style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(4px)' }}
// //           >
// //             ›
// //           </button>

// //           <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 10 }}>
// //             {images.map((_, i) => (
// //               <div
// //                 key={i}
// //                 onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
// //                 style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: i === activeIndex ? 'var(--brand-color)' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s' }}
// //               />
// //             ))}
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // }



// // function LinkField({ label, doctype, value, onChange, required, erpnextConfig, placeholder }) {
// //   const [options, setOptions] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     if (!erpnextConfig?.url) return;
// //     let active = true;
// //     setLoading(true);
// //     fetch(`${erpnextConfig.url}/api/resource/${encodeURIComponent(doctype)}?fields=["name"]&limit_page_length=0`, {
// //       credentials: 'include',
// //       headers: { 'Content-Type': 'application/json' }
// //     })
// //       .then(res => (res.ok ? res.json() : { data: [] }))
// //       .then(json => { if (active) setOptions(json.data || []); })
// //       .catch(() => { if (active) setOptions([]); })
// //       .finally(() => { if (active) setLoading(false); });
// //     return () => { active = false; };
// //   }, [doctype, erpnextConfig]);

// //   return (
// //     <div className="form-group">
// //       <label className="form-label">{label}</label>
// //       <select value={value} onChange={(e) => onChange(e.target.value)} className="form-select" required={required}>
// //         <option value="">{loading ? 'Loading...' : (placeholder || `-- Choose ${label} --`)}</option>
// //         {options.map(o => (
// //           <option key={o.name} value={o.name}>{o.name}</option>
// //         ))}
// //       </select>
// //     </div>
// //   );
// // }

// // function buildGeoLocation(lat, lng) {
// //   if (lat === '' || lng === '' || lat == null || lng == null) return undefined;
// //   return JSON.stringify({
// //     type: 'FeatureCollection',
// //     features: [{
// //       type: 'Feature',
// //       properties: {},
// //       geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] }
// //     }]
// //   });
// // }

// // export default function Properties({ properties, onAddProperty, onToggleListOnline, erpnextConfig, onScheduleMaintenance, tenants = [], owners = [] }) {
// //   const [showAddModal, setShowAddModal] = useState(false);
// //   const [filterType, setFilterType] = useState('all');
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [selectedProp, setSelectedProp] = useState(null);
// //   const [expandedUnit, setExpandedUnit] = useState(null);

// //   const [expandedFloors, setExpandedFloors] = useState({});

// //   // Pagination & Layout States
// //   const [viewLayout, setViewLayout] = useState('standard'); // 'standard' | 'three-column'
// //   const [selectedUnitId, setSelectedUnitId] = useState(null);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 20;

// //   // ERPNext Integration States
// //   const [detailedProp, setDetailedProp] = useState(null);
// //   const [propertyUnits, setPropertyUnits] = useState([]);
// //   const [loadedUnitDetails, setLoadedUnitDetails] = useState({});
// //   const [loadingDetails, setLoadingDetails] = useState(false);
// //   const [loadingUnits, setLoadingUnits] = useState(false);
// //   const [showUiFields, setShowUiFields] = useState([]);



// //   const [country, setCountry] = useState('Fiji');
// //   const [landAndBuildingType, setLandAndBuildingType] = useState('');
// //   const [district, setDistrict] = useState('');
// //   const [legalDescription, setLegalDescription] = useState('');
// //   const [locality, setLocality] = useState('');
// //   const [referenceNo, setReferenceNo] = useState(''); // this IS the doc's name
// //   const [landDescription, setLandDescription] = useState('');
// //   const [leaseStartDate, setLeaseStartDate] = useState('');
// //   const [leaseEndDate, setLeaseEndDate] = useState('');
// //   const [propertyOwner, setPropertyOwner] = useState('');
// //   const [externalTenant, setExternalTenant] = useState('');
// //   const [propertyArea, setPropertyArea] = useState('');
// //   const [yearsRemaining, setYearsRemaining] = useState('');
// //   const [internalTenant, setInternalTenant] = useState('');
// //   const [noOfFloors, setNoOfFloors] = useState('');
// //   const [latitude, setLatitude] = useState('');
// //   const [longitude, setLongitude] = useState('');

// //   // Local-only, not in this doctype — keep if your UI elsewhere depends on them
// //   const [type, setType] = useState('residential');
// //   const [rent, setRent] = useState('');
// //   const [unitsCount, setUnitsCount] = useState(1);

// //   // Fetch Item DocType fields to filter unit fields by 'show_on_ui_app'
// //   useEffect(() => {
// //     if (!erpnextConfig || !erpnextConfig.url) return;
// //     const fetchDocTypeFields = async () => {
// //       try {
// //         const res = await fetch(`${erpnextConfig.url}/api/resource/DocType/Item`, {
// //           credentials: 'include',
// //           headers: { 'Content-Type': 'application/json' }
// //         });
// //         if (res.ok) {
// //           const json = await res.json();
// //           const doctype = json.data || json;
// //           if (doctype && Array.isArray(doctype.fields)) {
// //             const allowed = doctype.fields
// //               .filter(f => f.show_on_ui_app === 1 || f.show_on_ui_app === true)
// //               .map(f => f.fieldname);
// //             setShowUiFields(allowed);
// //           }
// //         }
// //       } catch (err) {
// //         console.warn('Failed to fetch Item DocType fields:', err);
// //       }
// //     };
// //     fetchDocTypeFields();
// //   }, [erpnextConfig]);

// //   // Form states
// //   const [name, setName] = useState('');
// //   // const [type, setType] = useState('residential');
// //   const [address, setAddress] = useState('');
// //   // const [unitsCount, setUnitsCount] = useState(1);
// //   // const [rent, setRent] = useState('');
// //   const [area, setArea] = useState('');

// //   // Property Group field states
// //   // const [propertyOwner, setPropertyOwner] = useState('');
// //   // const [country, setCountry] = useState('Fiji');
// //   // const [landAndBuildingType, setLandAndBuildingType] = useState('Land and Structure');
// //   // const [district, setDistrict] = useState('');
// //   // const [locality, setLocality] = useState('');
// //   // const [legalDescription, setLegalDescription] = useState('');
// //   // const [referenceNo, setReferenceNo] = useState('');
// //   // const [leaseStartDate, setLeaseStartDate] = useState('');
// //   // const [leaseEndDate, setLeaseEndDate] = useState('');
// //   // const [noOfFloors, setNoOfFloors] = useState('');

// //   const [alertState, setAlertState] = useState({ show: false, success: true, message: '' });

// //   const validateForm = () => {
// //     switch (true) {
// //       // case !name?.trim():
// //       //   return 'Property name is required';

// //       // case !address?.trim():
// //       //   return 'Address is required';

// //       case !propertyOwner?.trim():
// //         return 'Property owner is required';

// //       case !district?.trim():
// //         return 'District is required';

// //       // case !rent:
// //       //   return 'Rent is required';

// //       // case Number(rent) <= 0:
// //       //   return 'Rent must be greater than 0';

// //       // case !area:
// //       //   return 'Area is required';

// //       // case Number(area) <= 0:
// //       //   return 'Area must be greater than 0';

// //       case unitsCount < 1:
// //         return 'Units count must be at least 1';

// //       default:
// //         return null;
// //     }
// //   };
// //   const groupUnitsByFloor = (units) => {
// //     const groups = {};
// //     units.forEach(unit => {
// //       const floor = unit.custom_floor || unit.floor || 'Unspecified';
// //       if (!groups[floor]) groups[floor] = [];
// //       groups[floor].push(unit);
// //     });
// //     return groups;
// //   };

// //   const toggleFloor = (floor) => {
// //     setExpandedFloors(prev => ({ ...prev, [floor]: !prev[floor] }));
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     console.log(name, address, rent, area)
// //     // if (!name || !address || !rent || !area ) {
// //     //   setAlertState({ show: true, success: false, message: 'Please fill in all required fields!' });
// //     //   return;
// //     // }
// //     const error = validateForm();

// //     if (error) {
// //       setAlertState({
// //         show: true,
// //         success: false,
// //         message: error,
// //       });
// //       return;
// //     }

// //     try {
// //       onAddProperty({
// //         id: `PROP-${Math.floor(1000 + Math.random() * 9000)}`,
// //         name,
// //         type,
// //         address,
// //         unitsCount: Number(unitsCount),
// //         rent: Number(rent),
// //         area: Number(area),
// //         listedOnline: false,
// //         occupancy: 0,
// //         propertyOwner,
// //         country,
// //         landAndBuildingType,
// //         district,
// //         locality: locality || address,
// //         legalDescription,
// //         referenceNo,
// //         leaseStartDate,
// //         leaseEndDate,
// //         noOfFloors: Number(noOfFloors) || undefined,

// //         latitude,
// //         longitude

// //       });

// //       // setName('');
// //       setType('residential');
// //       setAddress('');
// //       setUnitsCount(1);
// //       setRent('');
// //       setArea('');
// //       setPropertyOwner('');
// //       setCountry('Fiji');
// //       setLandAndBuildingType('Land and Structure');
// //       setDistrict('');
// //       setLocality('');
// //       setLegalDescription('');
// //       setReferenceNo('');
// //       setLeaseStartDate('');
// //       setLeaseEndDate('');
// //       setNoOfFloors('');
// //       setShowAddModal(false);
// //       setAlertState({ show: true, success: true, message: 'Property saved successfully!' });
// //     } catch (err) {
// //       setAlertState({ show: true, success: false, message: err.message || 'Failed to save property portfolio!' });
// //     }
// //   };

// //   // Fetch details and units from ERPNext API
// //   useEffect(() => {
// //     if (!selectedProp || !erpnextConfig) {
// //       setDetailedProp(null);
// //       setPropertyUnits([]);
// //       setLoadedUnitDetails({});
// //       return;
// //     }

// //     async function fetchDetailsAndUnits() {
// //       setLoadingDetails(true);
// //       setLoadingUnits(true);
// //       setLoadedUnitDetails({});

// //       // 1. Fetch Property Group Details
// //       try {
// //         const res = await fetch(`${erpnextConfig.url}/api/method/erpnext.api.get_property_group?name=${selectedProp.id}`,
// //           // const res = await fetch(`${erpnextConfig.url}/api/resource/Property Group`,
// //           {
// //             credentials: 'include',
// //             headers: {
// //               'Content-Type': 'application/json'
// //             }
// //           });
// //         if (res.ok) {
// //           const data = await res.json();
// //           setDetailedProp(data.message || data);
// //         } else {
// //           setDetailedProp(selectedProp); // fallback
// //         }
// //       } catch (err) {
// //         console.warn('Failed to fetch detailed property group:', err);
// //         setDetailedProp(selectedProp);
// //       } finally {
// //         setLoadingDetails(false);
// //       }

// //       // 2. Fetch Units List
// //       try {
// //         const res = await fetch(`${erpnextConfig.url}/api/method/erpnext.api.get_units?property_group=${selectedProp.id}`, {
// //           credentials: 'include',
// //           headers: {
// //             'Content-Type': 'application/json'
// //           }
// //         });
// //         if (res.ok) {
// //           const data = await res.json();
// //           const list = data.message || data;
// //           if (Array.isArray(list)) {
// //             console.log("unitdata", list)
// //             setPropertyUnits(list);
// //           } else {
// //             setPropertyUnits([]);
// //           }
// //         } else {
// //           // Generate fallback unit list
// //           setPropertyUnits([...Array(selectedProp.unitsCount || 4)].map((_, i) => ({
// //             name: `${selectedProp.id}-UNIT-${100 + i + 1}`,
// //             unit_name: `Space Unit #${100 + i + 1}`,
// //             status: 'Vacant',
// //             rent: Math.round(selectedProp.rent / (selectedProp.unitsCount || 4)),
// //             area: Math.round(selectedProp.area / (selectedProp.unitsCount || 4))
// //           })));
// //         }
// //       } catch (err) {
// //         console.warn('Failed to fetch units list, falling back:', err);
// //         setPropertyUnits([...Array(selectedProp.unitsCount || 4)].map((_, i) => ({
// //           name: `${selectedProp.id}-UNIT-${100 + i + 1}`,
// //           unit_name: `Space Unit #${100 + i + 1}`,
// //           status: 'Vacant',
// //           rent: Math.round(selectedProp.rent / (selectedProp.unitsCount || 4)),
// //           area: Math.round(selectedProp.area / (selectedProp.unitsCount || 4))
// //         })));
// //       } finally {
// //         setLoadingUnits(false);
// //       }
// //     }

// //     fetchDetailsAndUnits();
// //   }, [selectedProp?.id, erpnextConfig]);

// //   // Click handler to expand unit and fetch its individual detail via get_unit API
// //   const handleUnitToggle = async (unitId) => {
// //     const isExpanded = expandedUnit === unitId;
// //     if (isExpanded) {
// //       setExpandedUnit(null);
// //       return;
// //     }

// //     setExpandedUnit(unitId);

// //     // If details are already cached, do not refetch
// //     if (loadedUnitDetails[unitId]) return;

// //     try {
// //       const res = await fetch(`${erpnextConfig.url}/api/method/erpnext.api.get_unit?item_code=${unitId}`, {
// //         credentials: 'include',
// //         headers: {
// //           'Content-Type': 'application/json'
// //         }
// //       });
// //       if (res.ok) {
// //         const data = await res.json();
// //         setLoadedUnitDetails(prev => ({
// //           ...prev,
// //           [unitId]: data.message || data
// //         }));
// //       } else {
// //         // Mock fallback details
// //         const matchedUnit = propertyUnits.find(u => u.name === unitId) || {};
// //         setLoadedUnitDetails(prev => ({
// //           ...prev,
// //           [unitId]: {
// //             rent: matchedUnit.rent || 800,
// //             area: matchedUnit.area || 1000,
// //             power_reading: '4,120 kWh',
// //             water_reading: '890 m³',
// //             status: matchedUnit.status || 'Vacant'
// //           }
// //         }));
// //       }
// //     } catch (err) {
// //       console.warn('Failed to fetch single unit details:', err);
// //       const matchedUnit = propertyUnits.find(u => u.name === unitId) || {};
// //       setLoadedUnitDetails(prev => ({
// //         ...prev,
// //         [unitId]: {
// //           rent: matchedUnit.rent || 800,
// //           area: matchedUnit.area || 1000,
// //           power_reading: '4,120 kWh (Local Fallback)',
// //           water_reading: '890 m³ (Local Fallback)',
// //           status: matchedUnit.status || 'Vacant'
// //         }
// //       }));
// //     }
// //   };

// //   const handlePropertyRowClick = (prop) => {
// //     setSelectedProp(prop);
// //     setViewLayout('three-column');
// //     setSelectedUnitId(null);
// //   };

// //   const uniqueTypes = Array.from(new Set(properties.map(p => p.land_and_building_type || p.type).filter(Boolean)));

// //   const filteredProperties = properties.filter(prop => {
// //     const propType = prop.land_and_building_type || prop.type;
// //     const matchesFilter = filterType === 'all' || propType === filterType || prop.type === filterType;
// //     const matchesSearch = prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //       prop.address.toLowerCase().includes(searchQuery.toLowerCase());
// //     return matchesFilter && matchesSearch;
// //   });

// //   const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentItems = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);

// //   const renderPaginationControls = () => {
// //     if (totalPages <= 1) return null;
// //     return (
// //       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderTop: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
// //         <div>
// //           Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, filteredProperties.length)}</strong> of <strong>{filteredProperties.length}</strong> entries
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

// //   const getCleanUnitFields = (details, matchedUnit) => {
// //     const rentVal = details.rent || details.valuation_rate || matchedUnit?.rent || 0;
// //     const areaVal = details.area || details.property_area || matchedUnit?.area || 0;
// //     const areaUnit = details.property_area_unit || 'Sqm';

// //     const fields = [
// //       { label: 'Property Rent', value: `$${rentVal.toLocaleString()}/mo` },
// //       { label: 'Property Area', value: `${areaVal} ${areaUnit}` }
// //     ];

// //     if (details.power_reading) fields.push({ label: 'Power Grid reading', value: details.power_reading });
// //     if (details.water_reading) fields.push({ label: 'Water reading', value: details.water_reading });
// //     if (details.unit_owner || details.owner) fields.push({ label: 'Unit Ownership', value: details.unit_owner || details.owner });

// //     // Filter out blacklisted fields dynamically
// //     const blacklist = [
// //       'rent', 'area', 'power_reading', 'water_reading', 'status', 'idx', 'external_tenant', 'internal_tenant',
// //       'external tenant', 'internal tenant', 'external', 'internal',
// //       'item_code', 'stock_uom', 'company', 'average_carpet_area_of_units', 'total_floors',
// //       'product_bundle_id', 'is_recommended', 'property_owner', 'property_owned_by', 'bundle_price',
// //       'valuation_rate', 'total_services_prices', 'item code', 'stock uom', 'average carpet area of units',
// //       'total floors', 'product bundle id', 'is recommended', 'property owner', 'property owned by',
// //       'bundle price', 'valuation rate', 'total services prices', 'property_area', 'property_area_unit'
// //     ];

// //     Object.keys(details).forEach(key => {
// //       const kLower = key.toLowerCase().replace(/_/g, ' ').trim();
// //       const isAllowed = showUiFields.length > 0
// //         ? showUiFields.includes(key)
// //         : (!blacklist.includes(key.toLowerCase()) && !blacklist.includes(kLower));

// //       if (isAllowed) {
// //         fields.push({
// //           label: key.replace(/^custom_/, '').replace(/_custom_/gi, '_').replace(/custom/gi, '').replace(/_/g, ' ').trim(),
// //           value: String(details[key])
// //         });
// //       }
// //     });

// //     return fields;
// //   };

// //   return (
// //     <div>
// //       <div className="view-header">
// //         <div>
// //           <h1 className="view-title">Properties Portfolio</h1>
// //           <p className="view-subtitle">Manage residential buildings, commercial spaces, and mall facilities for Carpenters Estate.</p>
// //         </div>
// //         {/* <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
// //           <Plus size={16} /> Add Property
// //         </button> */}
// //       </div>

// //       {/* Controls panel */}
// //       <div className="card-panel" style={{ padding: '16px 24px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
// //         <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 260 }}>
// //           <div style={{ position: 'relative', flex: 1 }}>
// //             <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
// //             <input
// //               type="text"
// //               placeholder="Search by name or location..."
// //               value={searchQuery}
// //               onChange={(e) => setSearchQuery(e.target.value)}
// //               className="form-input"
// //               style={{ paddingLeft: 38 }}
// //             />
// //           </div>
// //           <select
// //             value={filterType}
// //             onChange={(e) => setFilterType(e.target.value)}
// //             className="form-select"
// //             style={{ width: 160 }}
// //           >
// //             <option value="all">All Types</option>
// //             {uniqueTypes.map(t => (
// //               <option key={t} value={t}>{t}</option>
// //             ))}
// //           </select>
// //         </div>

// //         <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
// //           <span>Total: <strong>{filteredProperties.length}</strong></span>
// //           <span>Residential: <strong>{filteredProperties.filter(p => p.type === 'residential').length}</strong></span>
// //           <span>Commercial: <strong>{filteredProperties.filter(p => p.type === 'commercial').length}</strong></span>
// //           <span>Mall: <strong>{filteredProperties.filter(p => p.type === 'mall').length}</strong></span>
// //         </div>
// //       </div>

// //       {/* Dynamic layout render engine */}
// //       {viewLayout === 'three-column' && selectedProp ? (
// //         <div style={{
// //           display: 'grid',
// //           // gridTemplateColumns: '26% 34% 40%',
// //           gridTemplateColumns: 'minmax(280px,1fr) minmax(380px,1.3fr) minmax(450px,1.5fr)',
// //           gap: 20, height: 'calc(100vh - 170px)', // adjust according to your header height
// //           overflow: 'hidden'
// //         }}>
// //           {/* Column 1: Shrunk property list */}
// //           <div className="card-panel" style={{
// //             padding: 12,
// //             height: '100%',
// //             overflowY: 'auto',
// //             minHeight: 0
// //           }}>
// //             <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 8px 10px', borderBottom: '1px solid var(--border-color)', marginBottom: 8 }}>Assets</h3>
// //             <div className="table-container" style={{ border: 'none', marginTop: 0 }}>
// //               <table className="custom-table" style={{ width: '100%', fontSize: 11 }}>
// //                 <thead>
// //                   <tr>
// //                     <th>Name</th>
// //                     <th>Land Description</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {currentItems.map(prop => (
// //                     <tr
// //                       key={prop.id}
// //                       onClick={() => {
// //                         setSelectedProp(prop);
// //                         setSelectedUnitId(null);
// //                       }}
// //                       style={{
// //                         cursor: 'pointer',
// //                         backgroundColor: selectedProp?.id === prop.id ? 'var(--bg-accent-alpha)' : ''
// //                       }}
// //                     >
// //                       <td
// //                         style={{ fontWeight: 600, color: 'var(--brand-color)', textDecoration: 'underline' }}
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           setSelectedProp(prop);
// //                           setViewLayout('standard');
// //                         }}
// //                       >
// //                         {prop.name}
// //                       </td>
// //                       <td style={{ color: 'var(--text-secondary)' }}>
// //                         {prop.land_description || `Area: ${prop.area} sq ft`}
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //             {renderPaginationControls()}
// //           </div>

// //           {/* Column 2: Space Units list */}
// //           <div className="card-panel" style={{
// //             padding: 16,
// //             height: '100%',
// //             overflowY: 'auto',
// //             minHeight: 0
// //           }}>
// //             <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', paddingBottom: 10, borderBottom: '1px solid var(--border-color)', marginBottom: 14 }}>Space Units Breakdown</h3>
// //             {/* {loadingUnits ? (
// //               <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, padding: '16px 0' }}>Loading space units...</div>
// //             ) : (
// //               <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
// //                 {propertyUnits.map((unit, idx) => {
// //                   const isActive = selectedUnitId === unit.name;
// //                   return (
// //                     <div
// //                       key={unit.name || idx}
// //                       onClick={() => {
// //                         setSelectedUnitId(unit.name);
// //                         handleUnitToggle(unit.name);
// //                       }}
// //                       style={{
// //                         padding: '10px 12px',
// //                         background: isActive ? 'var(--bg-accent-alpha)' : 'var(--bg-tertiary)',
// //                         border: isActive ? '1px solid var(--brand-color)' : '1px solid var(--border-color)',
// //                         borderRadius: 6,
// //                         cursor: 'pointer',
// //                         display: 'flex',
// //                         justifyContent: 'space-between',
// //                         alignItems: 'center',
// //                         fontSize: 11
// //                       }}
// //                     >
// //                       <span style={{ fontWeight: 600 }}>{unit.unit_name || unit.name}</span>
// //                       <span className={`badge ${unit.status === 'occupied' ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: 9 }}>
// //                         {unit.status || 'Vacant'}
// //                       </span>
// //                     </div>
// //                   );
// //                 })}
// //                 {propertyUnits.length === 0 && (
// //                   <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: 11 }}>No units configured.</div>
// //                 )}
// //               </div>
// //             )} */}

// //             {loadingUnits ? (
// //               <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, padding: '16px 0' }}>Loading space units...</div>
// //             ) : (
// //               <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
// //                 {Object.entries(groupUnitsByFloor(propertyUnits)).map(([floor, units]) => {
// //                   const isOpen = expandedFloors[floor] === true; // default open
// //                   return (
// //                     <div key={floor} style={{ border: '1px solid var(--border-color)', borderRadius: 6, overflow: 'hidden' }}>
// //                       <div
// //                         onClick={() => toggleFloor(floor)}
// //                         style={{
// //                           display: 'flex',
// //                           justifyContent: 'space-between',
// //                           alignItems: 'center',
// //                           padding: '8px 12px',
// //                           background: 'var(--bg-tertiary)',
// //                           cursor: 'pointer',
// //                           fontSize: 11,
// //                           fontWeight: 700,
// //                           textTransform: 'uppercase',
// //                           color: 'var(--text-secondary)'
// //                         }}
// //                       >
// //                         <span>{floor} Floor ({units.length})</span>
// //                         <span style={{ color: 'var(--brand-color)', fontSize: 10 }}>{isOpen ? '▲ Collapse' : '▼ Expand'}</span>
// //                       </div>

// //                       {isOpen && (
// //                         <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 8 }}>
// //                           {units.map((unit, idx) => {
// //                             const isActive = selectedUnitId === unit.name;
// //                             return (
// //                               <div
// //                                 key={unit.name || idx}
// //                                 onClick={() => {
// //                                   setSelectedUnitId(unit.name);
// //                                   handleUnitToggle(unit.name);
// //                                 }}
// //                                 style={{
// //                                   padding: '10px 12px',
// //                                   background: isActive ? 'var(--bg-accent-alpha)' : 'var(--bg-tertiary)',
// //                                   border: isActive ? '1px solid var(--brand-color)' : '1px solid var(--border-color)',
// //                                   borderRadius: 6,
// //                                   cursor: 'pointer',
// //                                   display: 'flex',
// //                                   justifyContent: 'space-between',
// //                                   alignItems: 'center',
// //                                   fontSize: 11
// //                                 }}
// //                               >
// //                                 <span style={{ fontWeight: 600 }}>{unit.unit_name || unit.name}</span>
// //                                 <span className={`badge ${unit.status === 'occupied' ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: 9 }}>
// //                                   {unit.status || 'Vacant'}
// //                                 </span>
// //                               </div>
// //                             );
// //                           })}
// //                         </div>
// //                       )}
// //                     </div>
// //                   );
// //                 })}
// //                 {propertyUnits.length === 0 && (
// //                   <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: 11 }}>No units configured.</div>
// //                 )}
// //               </div>
// //             )}
// //           </div>

// //           {/* Column 3: Active Unit detailed inspection sheet */}
// //           <div className="card-panel" style={{
// //             padding: 18,
// //             height: '100%',
// //             overflowY: 'auto',
// //             minHeight: 0
// //           }}>
// //             <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', paddingBottom: 10, borderBottom: '1px solid var(--border-color)', marginBottom: 14 }}>Selected Unit Spec</h3>
// //             {/* {selectedUnitId ? (() => {
// //               const details = loadedUnitDetails[selectedUnitId];
// //               console.log(details)
// //               const matchedUnit = propertyUnits.find(u => u.name === selectedUnitId);

// //               if (!details) {
// //                 return <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, padding: '16px 0' }}>Loading specs...</div>;
// //               }

// //               return (
// //                 <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
// //                   {(() => {
// //                     const unitFallbackImages = {
// //                       residential: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
// //                       commercial: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
// //                       mall: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
// //                     };
// //                     const imgs = (details.custom_unit_images && details.custom_unit_images.length > 0)
// //                       ? details.custom_unit_images.map(item => item.image.startsWith('http') ? item.image : `${erpnextConfig?.url || ''}${item.image}`)
// //                       : (details.image ? [details.image.startsWith('http') ? details.image : `${erpnextConfig?.url || ''}${details.image}`] : [unitFallbackImages[selectedProp.type] || unitFallbackImages.commercial]);
// //                     return <ImageCarousel images={imgs} height={160} erpnextConfig={erpnextConfig} />;
// //                   })()}

// //                   <div>
// //                     <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{matchedUnit?.unit_name || selectedUnitId}</h4>
// //                     <span className={`badge ${details.status === 'occupied' ? 'badge-danger' : 'badge-success'}`} style={{ marginTop: 4 }}>
// //                       {details.status}
// //                     </span>
// //                   </div>

// //                   <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
// //                     {getCleanUnitFields(details, matchedUnit).map(f => (
// //                       <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
// //                         <span style={{ textTransform: 'capitalize' }}>{f.label}:</span>
// //                         <strong style={{ color: 'var(--text-primary)' }}>{f.value}</strong>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               );
// //             })() : (
// //               <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: 11 }}>
// //                 Select a Space Unit in the middle column to inspect details.
// //               </div>
// //             )} */}
// //             {selectedUnitId ? (() => {
// //               const details = loadedUnitDetails[selectedUnitId];
// //               const matchedUnit = propertyUnits.find(u => u.name === selectedUnitId);

// //               if (!details) {
// //                 return <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, padding: '16px 0' }}>Loading specs...</div>;
// //               }

// //               const isOccupied = details.status === 'occupied' || details.custom_property_status === 'Occupied';

// //               return (
// //                 <div style={{ display: 'flex', flexDirection: 'column', gap: 1, }}>
// //                   {/* Image Viewer */}
// //                   {(() => {
// //                     const unitFallbackImages = {
// //                       residential: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
// //                       commercial: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
// //                       mall: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
// //                     };
// //                     const imgs = (details.custom_unit_images && details.custom_unit_images.length > 0)
// //                       ? details.custom_unit_images.map(item => item.image.startsWith('http') ? item.image : `${erpnextConfig?.url || ''}${item.image}`)
// //                       : (details.image ? [details.image.startsWith('http') ? details.image : `${erpnextConfig?.url || ''}${details.image}`] : [unitFallbackImages[selectedProp.type] || unitFallbackImages.commercial]);
// //                     return <ImageCarousel images={imgs} height={160} erpnextConfig={erpnextConfig} />;
// //                   })()}

// //                   {/* Header */}
// //                   <div>
// //                     <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
// //                       <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
// //                         {matchedUnit?.unit_name || details.item_name || selectedUnitId}
// //                       </h4>
// //                       {details.custom_is_recomended_ === 'Yes' && (
// //                         <span className="badge badge-warning" style={{ fontSize: 9, whiteSpace: 'nowrap' }}>★ Recommended</span>
// //                       )}
// //                     </div>
// //                     <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
// //                       <span className={`badge ${isOccupied ? 'badge-danger' : 'badge-success'}`}>
// //                         {details.custom_property_status || details.status || 'Available'}
// //                       </span>
// //                       {details.custom_property_owner && (
// //                         <span className="badge badge-secondary">{details.custom_property_owner}</span>
// //                       )}
// //                     </div>
// //                   </div>

// //                   {/* Key facts grid */}
// //                   <div style={{
// //                     display: 'grid',
// //                     gridTemplateColumns: '1fr 1fr',
// //                     gap: 8,
// //                     background: 'var(--bg-secondary, rgba(0,0,0,0.03))',
// //                     borderRadius: 8,
// //                     padding: 10
// //                   }}>
// //                     {[
// //                       { label: 'Floor', value: details.custom_floor },
// //                       { label: 'Area', value: details.custom_property_area ? `${details.custom_property_area} ${details.custom_property_area_unit || ''}` : null },
// //                       { label: 'Rate', value: details.valuation_rate ? `$${Number(details.valuation_rate).toLocaleString()}` : null },
// //                       { label: 'Group', value: details.custom_property_group },
// //                     ].filter(f => f.value).map(f => (
// //                       <div key={f.label}>
// //                         <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{f.label}</div>
// //                         <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{f.value}</div>
// //                       </div>
// //                     ))}
// //                   </div>

// //                   {/* Location */}
// //                   {(details.custom_country || details.custom_district || details.custom_locality) && (
// //                     <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
// //                       <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
// //                         Location
// //                       </div>
// //                       <div style={{ fontSize: 11, color: 'var(--text-primary)', lineHeight: 1.5 }}>
// //                         {[details.custom_locality, details.custom_district, details.custom_country].filter(Boolean).join(', ')}
// //                       </div>
// //                       {details.custom_land_description && (
// //                         <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
// //                           Land: {details.custom_land_description}
// //                         </div>
// //                       )}
// //                     </div>
// //                   )}

// //                   {/* Owner */}
// //                   {details.custom_property_owner_name && (
// //                     <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
// //                       <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
// //                         Owned By
// //                       </div>
// //                       <div style={{ fontSize: 11, color: 'var(--text-primary)' }}>{details.custom_property_owner_name}</div>
// //                     </div>
// //                   )}

// //                   {/* Services / Features */}
// //                   {details.custom_property_reference && details.custom_property_reference.length > 0 && (
// //                     <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
// //                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
// //                         <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
// //                           Services
// //                         </span>
// //                         {details.custom_total_services_prices > 0 && (
// //                           <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
// //                             Total: ${details.custom_total_services_prices}
// //                           </span>
// //                         )}
// //                       </div>
// //                       <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
// //                         {details.custom_property_reference.map(svc => (
// //                           <div key={svc.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
// //                             <span style={{ color: 'var(--text-secondary)' }}>{svc.service_type}</span>
// //                             <strong style={{ color: 'var(--text-primary)' }}>${svc.price}</strong>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   )}

// //                   {/* Subscription plan */}
// //                   {details.custom_subscription_plan && (
// //                     <div style={{
// //                       borderTop: '1px solid var(--border-color)',
// //                       paddingTop: 10,
// //                       fontSize: 11,
// //                       color: 'var(--text-secondary)'
// //                     }}>
// //                       Plan: <strong style={{ color: 'var(--text-primary)' }}>{details.custom_subscription_plan}</strong>
// //                     </div>
// //                   )}

// //                   {/* Fallback to any remaining generic fields */}
// //                   {typeof getCleanUnitFields === 'function' && (
// //                     <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
// //                       {getCleanUnitFields(details, matchedUnit).map(f => (
// //                         <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
// //                           <span style={{ textTransform: 'capitalize' }}>{f.label}:</span>
// //                           <strong style={{ color: 'var(--text-primary)' }}>{f.value}</strong>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   )}
// //                 </div>
// //               );
// //             })() : (
// //               <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: 11 }}>
// //                 Select a Space Unit in the middle column to inspect details.
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       ) : (
// //         /* STANDARD SPLIT VIEW */
// //         <div className="grid-2col" style={{ gridTemplateColumns: selectedProp ? '60% calc(40% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>
// //           {/* Properties Table */}
// //           <div className="card-panel" style={{
// //             padding: 0,
// //             height: '100%',
// //             overflowY: 'auto',
// //             minHeight: 0
// //           }}>
// //             <div className="table-container" style={{ border: 'none', marginTop: 0 }}>
// //               <table className="custom-table">
// //                 <thead>
// //                   <tr>
// //                     <th>ID</th>
// //                     <th>Name</th>
// //                     <th>Type</th>
// //                     <th>Land Description</th>
// //                     <th>Lease End</th>
// //                     <th style={{ textAlign: 'right' }}>Picture</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {currentItems.map(prop => (
// //                     <tr
// //                       key={prop.id}
// //                       onClick={() => handlePropertyRowClick(prop)}
// //                       style={{
// //                         cursor: 'pointer',
// //                         backgroundColor: selectedProp?.id === prop.id ? 'var(--bg-accent-alpha)' : '',
// //                         borderLeft: selectedProp?.id === prop.id ? '3px solid var(--brand-color)' : ''
// //                       }}
// //                     >
// //                       <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{prop.id}</td>
// //                       <td>
// //                         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
// //                           <SecureImage
// //                             src={prop.image || fallbackImages[prop.type]?.[0] || fallbackImages.commercial[0]}
// //                             alt=""
// //                             style={{ width: 26, height: 26, objectFit: 'cover', borderRadius: '50%', border: '1px solid var(--border-color)' }}
// //                             erpnextConfig={erpnextConfig}
// //                           />
// //                           <div>
// //                             <div style={{ fontWeight: 600 }}>{prop.name}</div>
// //                             <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{prop.address}</div>
// //                           </div>
// //                         </div>
// //                       </td>
// //                       <td>
// //                         <span className={`badge ${(prop.land_and_building_type || prop.type) === 'residential' ? 'badge-success' : (prop.land_and_building_type || prop.type) === 'commercial' ? 'badge-info' : 'badge-warning'}`}>
// //                           {prop.land_and_building_type || prop.type}
// //                         </span>
// //                       </td>
// //                       <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
// //                         {prop.land_description || `Plot size: ${prop.area.toLocaleString()} sq ft`}
// //                       </td>
// //                       <td>
// //                         <span className="badge badge-warning" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--brand-color)' }}>
// //                           {prop.lease_end_date || '2026-12-31'}
// //                         </span>
// //                       </td>
// //                       <td style={{ textAlign: 'right' }}>
// //                         <SecureImage
// //                           src={prop.image || fallbackImages[prop.type]?.[0] || fallbackImages.commercial[0]}
// //                           alt={prop.name}
// //                           style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'inline-block' }}
// //                           erpnextConfig={erpnextConfig}
// //                         />
// //                       </td>
// //                     </tr>
// //                   ))}
// //                   {filteredProperties.length === 0 && (
// //                     <tr>
// //                       <td colSpan="6" style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
// //                         No properties match your filter.
// //                       </td>
// //                     </tr>
// //                   )}
// //                 </tbody>
// //               </table>
// //             </div>
// //             {renderPaginationControls()}
// //           </div>

// //           {/* Selected Property Detail Panel */}
// //           {selectedProp && (() => {
// //             const p = detailedProp || selectedProp;
// //             return (
// //               <div className="card-panel" style={{
// //                 padding: 24, display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.2s ease-out', position: 'relative', height: '100%',
// //                 overflowY: 'auto',
// //                 minHeight: 0
// //               }}>
// //                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 14 }}>
// //                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// //                     <Info size={18} style={{ color: 'var(--brand-color)' }} />
// //                     <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-color)' }}>{p.id}</span>
// //                   </div>
// //                   <button
// //                     onClick={() => setSelectedProp(null)}
// //                     style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
// //                   >
// //                     <X size={18} />
// //                   </button>
// //                 </div>

// //                 {/* Property Group Image at top */}
// //                 {(() => {
// //                   const imgs = (p.gallery && p.gallery.length > 0)
// //                     ? p.gallery.map(item => item.image.startsWith('http') ? item.image : `${erpnextConfig?.url || ''}${item.image}`)
// //                     : (p.image ? [p.image] : (fallbackImages[p.type] || fallbackImages.commercial));
// //                   return <ImageCarousel images={imgs} height={180} erpnextConfig={erpnextConfig} />;
// //                 })()}

// //                 <div>
// //                   <h2 style={{ fontSize: '1.25rem', marginBottom: 4 }}>{p.name}</h2>
// //                   <span className="badge badge-info" style={{ textTransform: 'uppercase', fontSize: 9, padding: '2px 8px' }}>
// //                     {p.land_and_building_type || p.type}
// //                   </span>
// //                   <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>{p.address}</p>

// //                   <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 6, marginTop: 12, fontSize: 11, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 6 }}>
// //                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
// //                       <span style={{ color: 'var(--text-muted)' }}>Land ID:</span>
// //                       <span style={{ fontWeight: 600 }}>{p.id}</span>
// //                     </div>
// //                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
// //                       <span style={{ color: 'var(--text-muted)' }}>Description:</span>
// //                       <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '70%' }}>{p.land_description || 'N/A'}</span>
// //                     </div>
// //                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
// //                       <span style={{ color: 'var(--text-muted)' }}>Lease Expiry:</span>
// //                       <span style={{ fontWeight: 600 }}>{p.lease_end_date || 'N/A'}</span>
// //                     </div>
// //                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
// //                       <span style={{ color: 'var(--text-muted)' }}>Occupied Units:</span>
// //                       <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>
// //                         {propertyUnits.filter(u => (u.status || '').toLowerCase() === 'occupied').length}
// //                       </span>
// //                     </div>
// //                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
// //                       <span style={{ color: 'var(--text-muted)' }}>Vacant Units:</span>
// //                       <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>
// //                         {propertyUnits.filter(u => (u.status || '').toLowerCase() !== 'occupied').length}
// //                       </span>
// //                     </div>
// //                     {Object.keys(p).filter(key => ![
// //                       'id', 'name', 'type', 'land_and_building_type', 'address', 'land_description',
// //                       'lease_end_date', 'rent', 'area', 'unitsCount', 'listedOnline', 'occupancy',
// //                       'created_by', 'modified', 'docstatus', 'doctype', 'gallery', 'image', 'owner',
// //                       'creation', 'modified_by', 'property_owner', 'internal', 'external', 'idx',
// //                       'external_tenant', 'internal_tenant', 'external tenant', 'internal tenant'
// //                     ].includes(key.toLowerCase())).map(key => (
// //                       <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
// //                         <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}:</span>
// //                         <span style={{ fontWeight: 600 }}>{String(p[key])}</span>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 <div style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
// //                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
// //                     <span style={{ color: 'var(--text-secondary)' }}>Occupancy Progress</span>
// //                     <span style={{ fontWeight: 600 }}>{p.occupancy || 0}%</span>
// //                   </div>
// //                   <div style={{ width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
// //                     <div style={{ width: `${p.occupancy || 0}%`, height: '100%', backgroundColor: (p.occupancy || 0) > 50 ? 'var(--color-success)' : 'var(--brand-color)', borderRadius: 3 }} />
// //                   </div>
// //                 </div>

// //                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 12 }}>
// //                   <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
// //                     <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Contract Rent</span>
// //                     <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-color)' }}>${(p.rent || 0).toLocaleString()}/mo</span>
// //                   </div>
// //                   <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
// //                     <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Floor Area</span>
// //                     <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{(p.area || 0).toLocaleString()} sq ft</span>
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unit Space Breakdown</h3>
// //                   <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
// //                     {loadingUnits ? (
// //                       <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, padding: '12px 0' }}>Loading units list...</div>
// //                     ) : (
// //                       propertyUnits.map((unit, idx) => {
// //                         const isExpanded = expandedUnit === unit.name;
// //                         const details = loadedUnitDetails[unit.name];
// //                         return (
// //                           <div key={unit.name || idx} style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-tertiary)', borderRadius: 6, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
// //                             <div
// //                               onClick={() => handleUnitToggle(unit.name)}
// //                               style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, padding: '8px 12px', cursor: 'pointer', transition: 'background-color var(--transition-fast)' }}
// //                               className="menu-item-hover"
// //                             >
// //                               <span style={{ fontWeight: 600 }}>{unit.unit_name || unit.name}</span>
// //                               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// //                                 <span className={`badge ${unit.status === 'occupied' ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: 9 }}>
// //                                   {unit.status || 'Vacant'}
// //                                 </span>
// //                                 <span style={{ fontSize: 10, color: 'var(--brand-color)', fontWeight: 600 }}>{isExpanded ? 'Collapse' : 'Expand'}</span>
// //                               </div>
// //                             </div>
// //                             {isExpanded && (
// //                               <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.01)', fontSize: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
// //                                 {details ? (
// //                                   <>
// //                                     {/* Unit Space Image Carousel (Top) */}
// //                                     {(() => {
// //                                       const imgs = (details.custom_unit_images && details.custom_unit_images.length > 0)
// //                                         ? details.custom_unit_images.map(item => item.image.startsWith('http') ? item.image : `${erpnextConfig?.url || ''}${item.image}`)
// //                                         : (details.image ? [details.image.startsWith('http') ? details.image : `${erpnextConfig?.url || ''}${details.image}`] : (unitFallbackImages[p.type] || unitFallbackImages.commercial));
// //                                       return (
// //                                         <div style={{ marginBottom: 8 }}>
// //                                           <ImageCarousel images={imgs} height={120} erpnextConfig={erpnextConfig} />
// //                                         </div>
// //                                       );
// //                                     })()}
// //                                     {getCleanUnitFields(details, unit).map(f => (
// //                                       <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
// //                                         <span style={{ color: 'var(--text-secondary)' }}>{f.label}:</span>
// //                                         <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{f.value}</span>
// //                                       </div>
// //                                     ))}
// //                                   </>
// //                                 ) : (
// //                                   <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '6px 0' }}>Loading unit details...</div>
// //                                 )}
// //                               </div>
// //                             )}
// //                           </div>
// //                         );
// //                       })
// //                     )}
// //                     {!loadingUnits && propertyUnits.length === 0 && (
// //                       <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-muted)', fontSize: 11 }}>No space units configured.</div>
// //                     )}
// //                   </div>
// //                 </div>

// //                 <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: 14, display: 'flex', gap: 10 }}>
// //                   <button
// //                     className={`btn ${p.listedOnline ? 'btn-danger' : 'btn-primary'}`}
// //                     style={{ flex: 1, fontSize: 12 }}
// //                     onClick={() => {
// //                       onToggleListOnline(p.id);
// //                       setSelectedProp({ ...p, listedOnline: !p.listedOnline });
// //                     }}
// //                   >
// //                     <Globe size={13} /> {p.listedOnline ? 'Delist' : 'List Online'}
// //                   </button>
// //                   <button
// //                     className="btn btn-secondary"
// //                     style={{ flex: 1, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
// //                     onClick={() => onScheduleMaintenance(p)}
// //                   >
// //                     Schedule Maintenance
// //                   </button>
// //                 </div>
// //               </div>
// //             );
// //           })()}
// //         </div>
// //       )}

// //       {showAddModal && (
// //         <div className="modal-overlay">
// //           <div className="modal-content" style={{ position: 'relative', maxWidth: 600 }}>
// //             <button
// //               onClick={() => setShowAddModal(false)}
// //               style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}
// //             >
// //               ×
// //             </button>
// //             <div className="modal-header">
// //               <h3>Create New Portfolio Asset</h3>
// //             </div>
// //             <form onSubmit={handleSubmit}>
// //               {/* <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// //                   <div className="form-group">
// //                     <label className="form-label">Asset Name</label>
// //                     <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Carpenters Row Tower A" className="form-input" required />
// //                   </div>
// //                   <div className="form-group">
// //                     <label className="form-label">Property Owner (Required Customer)</label>
// //                     <select value={propertyOwner} onChange={(e) => setPropertyOwner(e.target.value)} className="form-select" required>
// //                       <option value="">-- Choose Owner --</option>
// //                       {tenants.map(t => (
// //                         <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
// //                       ))}
// //                       {owners.map(o => (
// //                         <option key={o.id} value={o.id}>{o.name} ({o.id})</option>
// //                       ))}
// //                     </select>
// //                   </div>
// //                 </div>

// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// //                   <div className="form-group">
// //                     <label className="form-label">Asset Class Type</label>
// //                     <select value={type} onChange={(e) => setType(e.target.value)} className="form-select">
// //                       <option value="residential">Residential Complex</option>
// //                       <option value="commercial">Commercial Office</option>
// //                       <option value="mall">Mall space unit</option>
// //                     </select>
// //                   </div>
// //                   <div className="form-group">
// //                     <label className="form-label">Property Type</label>
// //                     <select value={landAndBuildingType} onChange={(e) => setLandAndBuildingType(e.target.value)} className="form-select">
// //                       <option value="Land and Structure">Land and Structure</option>
// //                       <option value="Land Only">Land Only</option>
// //                     </select>
// //                   </div>
// //                 </div>

// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// //                   <div className="form-group">
// //                     <label className="form-label">Total Sub-Units</label>
// //                     <input type="number" min="1" value={unitsCount} onChange={(e) => setUnitsCount(e.target.value)} className="form-input" required />
// //                   </div>
// //                   <div className="form-group">
// //                     <label className="form-label">No. Of Floors</label>
// //                     <input type="number" min="1" value={noOfFloors} onChange={(e) => setNoOfFloors(e.target.value)} className="form-input" placeholder="e.g. 5" />
// //                   </div>
// //                 </div>

// //                 <div className="form-group">
// //                   <label className="form-label">Address</label>
// //                   <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Carpenters Estate, Stratford, London" className="form-input" required />
// //                 </div>

// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// //                   <div className="form-group">
// //                     <label className="form-label">Locality</label>
// //                     <input type="text" value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="e.g. Stratford" className="form-input" />
// //                   </div>
// //                   <div className="form-group">
// //                     <label className="form-label">District</label>
// //                     <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g. London" className="form-input" />
// //                   </div>
// //                 </div>

// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// //                   <div className="form-group">
// //                     <label className="form-label">Country</label>
// //                     <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="form-input" />
// //                   </div>
// //                   <div className="form-group">
// //                     <label className="form-label">Reference No</label>
// //                     <input type="text" value={referenceNo} onChange={(e) => setReferenceNo(e.target.value)} placeholder="e.g. PG-REF-001" className="form-input" />
// //                   </div>
// //                 </div>

// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// //                   <div className="form-group">
// //                     <label className="form-label">Base Monthly Rent (USD)</label>
// //                     <input type="number" min="1" value={rent} onChange={(e) => setRent(e.target.value)} placeholder="e.g. 2400" className="form-input" required />
// //                   </div>
// //                   <div className="form-group">
// //                     <label className="form-label">Total Area (Sq Ft)</label>
// //                     <input type="number" min="1" value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. 1500" className="form-input" required />
// //                   </div>
// //                 </div>

// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// //                   <div className="form-group">
// //                     <label className="form-label">Lease Start Date</label>
// //                     <input type="date" value={leaseStartDate} onChange={(e) => setLeaseStartDate(e.target.value)} className="form-input" />
// //                   </div>
// //                   <div className="form-group">
// //                     <label className="form-label">Lease End Date</label>
// //                     <input type="date" value={leaseEndDate} onChange={(e) => setLeaseEndDate(e.target.value)} className="form-input" />
// //                   </div>
// //                 </div>

// //                 <div className="form-group">
// //                   <label className="form-label">Legal Description</label>
// //                   <textarea value={legalDescription} onChange={(e) => setLegalDescription(e.target.value)} placeholder="e.g. Plot No. 42, Block C..." className="form-input" rows="2" />
// //                 </div>
// //               </div> */}
// //               <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// //                   <div className="form-group">
// //                     <label className="form-label">Reference No (Becomes Document ID)</label>
// //                     <input
// //                       type="text"
// //                       value={referenceNo}
// //                       onChange={(e) => setReferenceNo(e.target.value)}
// //                       placeholder="e.g. PG-REF-001"
// //                       className="form-input"
// //                       required
// //                     />
// //                   </div>
// //                   <div className="form-group">
// //                     <label className="form-label">Property Owner</label>
// //                     <select value={propertyOwner} onChange={(e) => setPropertyOwner(e.target.value)} className="form-select" required>
// //                       <option value="">-- Choose Owner --</option>
// //                       {tenants.map(t => <option key={t.id} value={t.id}>{t.name} ({t.id})</option>)}
// //                       {owners.map(o => <option key={o.id} value={o.id}>{o.name} ({o.id})</option>)}
// //                     </select>
// //                   </div>
// //                 </div>

// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// //                   <LinkField label="Country" doctype="Country" value={country} onChange={setCountry} erpnextConfig={erpnextConfig} required />
// //                   <LinkField label="District" doctype="District" value={district} onChange={setDistrict} erpnextConfig={erpnextConfig} required />
// //                 </div>

// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// //                   <div className="form-group">
// //                     <label className="form-label">Property Type</label>
// //                     <select value={landAndBuildingType} onChange={(e) => setLandAndBuildingType(e.target.value)} className="form-select" required>
// //                       <option value="">-- Select --</option>
// //                       <option value="Services">Services</option>
// //                       <option value="Land Only">Land Only</option>
// //                       <option value="Land and Structure">Land and Structure</option>
// //                     </select>
// //                   </div>
// //                   <div className="form-group">
// //                     <label className="form-label">No. Of Floors</label>
// //                     <input type="text" value={noOfFloors} onChange={(e) => setNoOfFloors(e.target.value)} className="form-input" placeholder="e.g. 5" required />
// //                   </div>
// //                 </div>

// //                 <div className="form-group">
// //                   <label className="form-label">Locality</label>
// //                   <input type="text" value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="e.g. Suva" className="form-input" />
// //                 </div>

// //                 <div className="form-group">
// //                   <label className="form-label">Legal Description</label>
// //                   <textarea value={legalDescription} onChange={(e) => setLegalDescription(e.target.value)} className="form-input" rows="2" />
// //                 </div>

// //                 <div className="form-group">
// //                   <label className="form-label">Land Description</label>
// //                   <textarea value={landDescription} onChange={(e) => setLandDescription(e.target.value)} className="form-input" rows="2" />
// //                 </div>

// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// //                   <div className="form-group">
// //                     <label className="form-label">Lease Start Date</label>
// //                     <input type="date" value={leaseStartDate} onChange={(e) => setLeaseStartDate(e.target.value)} className="form-input" required />
// //                   </div>
// //                   <div className="form-group">
// //                     <label className="form-label">Lease End Date</label>
// //                     <input type="date" value={leaseEndDate} onChange={(e) => setLeaseEndDate(e.target.value)} className="form-input" required />
// //                   </div>
// //                 </div>

// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// //                   <div className="form-group">
// //                     <label className="form-label">Property Area</label>
// //                     <input type="text" value={propertyArea} onChange={(e) => setPropertyArea(e.target.value)} placeholder="e.g. 24567" className="form-input" />
// //                   </div>
// //                   <div className="form-group">
// //                     <label className="form-label">Years Remaining</label>
// //                     <input type="text" value={yearsRemaining} onChange={(e) => setYearsRemaining(e.target.value)} className="form-input" required />
// //                   </div>
// //                 </div>

// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// //                   <div className="form-group">
// //                     <label className="form-label">External Tenant</label>
// //                     <textarea value={externalTenant} onChange={(e) => setExternalTenant(e.target.value)} className="form-input" rows="2" />
// //                   </div>
// //                   <div className="form-group">
// //                     <label className="form-label">Internal Tenant</label>
// //                     <textarea value={internalTenant} onChange={(e) => setInternalTenant(e.target.value)} className="form-input" rows="2" />
// //                   </div>
// //                 </div>

// //                 <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
// //                   <div className="form-group">
// //                     <label className="form-label">Latitude</label>
// //                     <input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="-18.1416" className="form-input" />
// //                   </div>
// //                   <div className="form-group">
// //                     <label className="form-label">Longitude</label>
// //                     <input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="178.4419" className="form-input" />
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="modal-footer">
// //                 <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
// //                 <button type="submit" className="btn btn-primary">Save Property</button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}

// //       {/* SUCCESS / FAILURE ALERT MODAL */}
// //       {alertState.show && (
// //         <div className="modal-overlay">
// //           <div className="modal-content" style={{ maxWidth: 400, position: 'relative' }}>
// //             <button
// //               onClick={() => setAlertState({ show: false, success: true, message: '' })}
// //               style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 18 }}
// //             >
// //               ×
// //             </button>
// //             <div className="modal-header">
// //               <h3>{alertState.success ? 'Success' : 'Notice / Error'}</h3>
// //             </div>
// //             <div className="modal-body" style={{ padding: '20px 0', textAlign: 'center' }}>
// //               <div style={{ color: alertState.success ? '#10b981' : '#ef4444', fontSize: '1.1rem', fontWeight: 600 }}>
// //                 {alertState.message}
// //               </div>
// //             </div>
// //             <div className="modal-footer" style={{ justifyContent: 'center' }}>
// //               <button
// //                 type="button"
// //                 className="btn btn-primary"
// //                 onClick={() => setAlertState({ show: false, success: true, message: '' })}
// //               >
// //                 Close
// //               </button>
// //             </div>
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
// // doctype (see Customer.json) plus two confirmed custom fields seen on a real
// // saved doc:
// //   - custom_type            -> the real Individual/Company toggle (NOT
// //                                customer_type, which is read_only on the
// //                                doctype and holds an unrelated value like
// //                                "Land Lord" - it is never sent from here)
// //   - custom_company_vat_id  -> only collected/sent when custom_type='Company'
// //
// // Fields with no confirmed home on this doctype are still not sent:
// //   - propertyId / leaseStart / leaseEnd / unitSpec / rentAmount / address
// //     (the only candidate is `table_ddcr`, a Table field pointing at
// //     "Customer Booking Details" - its child schema was never provided, so
// //     nothing is sent for it)
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

//   // ---- Form state: only fields confirmed on the Customer doctype (+ 2 confirmed custom fields) ----
//   // entityType maps to custom_type - defaults to Individual.
//   const [entityType, setEntityType] = useState('Individual');
//   const [salutation, setSalutation] = useState('');
//   const [customerName, setCustomerName] = useState('');
//   const [gender, setGender] = useState('');
//   const [dateOfBirth, setDateOfBirth] = useState('');
//   const [email, setEmail] = useState('');
//   const [phoneNo, setPhoneNo] = useState('');
//   const [customerGroup, setCustomerGroup] = useState('');
//   const [territory, setTerritory] = useState('');
//   const [companyVatId, setCompanyVatId] = useState('');

//   const resetForm = () => {
//     setEntityType('Individual');
//     setSalutation('');
//     setCustomerName('');
//     setGender('');
//     setDateOfBirth('');
//     setEmail('');
//     setPhoneNo('');
//     setCustomerGroup('');
//     setTerritory('');
//     setCompanyVatId('');
//   };

//   const handleEntityTypeChange = (val) => {
//     setEntityType(val);
//     if (val === 'Company') {
//       // Individual-only fields don't apply once switched to Company
//       setSalutation('');
//       setGender('');
//       setDateOfBirth('');
//     } else {
//       // Company-only field doesn't apply once switched to Individual
//       setCompanyVatId('');
//     }
//   };

//   // Payload contains ONLY fields confirmed present in the Customer doctype JSON,
//   // plus custom_type / custom_company_vat_id confirmed present on a real saved doc.
//   // customer_type is deliberately omitted: it's read_only on this doctype and
//   // holds an unrelated value (e.g. "Land Lord"), so sending it would be
//   // pointless/rejected and it has nothing to do with Individual vs Company.
//   const buildErpPayload = () => {
//     const payload = {
//       doctype: 'Customer',
//       customer_name: customerName,
//       email,
//       phone_no: phoneNo,
//       custom_type: entityType
//     };
//     if (customerGroup) payload.customer_group = customerGroup;
//     if (territory) payload.territory = territory;

//     if (entityType === 'Individual') {
//       if (salutation) payload.salutation = salutation;
//       if (gender) payload.gender = gender;
//       if (dateOfBirth) payload.date_of_birth = dateOfBirth;
//     } else {
//       if (companyVatId) payload.custom_company_vat_id = companyVatId;
//     }

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

//         {/* List view - columns match real Customer doctype fields */}
//         <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
//           <div className="table-container">
//             <table className="custom-table">
//               <thead>
//                 <tr>
//                   <th>Customer ID</th>
//                   <th>Name</th>
//                   <th>Type</th>
//                   <th>Customer Group</th>
//                   <th>Territory</th>
//                   <th>Contact</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentItems.length === 0 && (
//                   <tr>
//                     <td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>
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
//                       <td>
//                         <span className={`badge ${tenant.custom_type === 'Company' ? 'badge-info' : 'badge-secondary'}`}>
//                           {tenant.custom_type || 'Individual'}
//                         </span>
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

//         {/* Preview panel - only real Customer doctype fields + custom_type / custom_company_vat_id */}
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
//                 <span className={`badge ${selectedTenant.custom_type === 'Company' ? 'badge-info' : 'badge-secondary'}`}>{selectedTenant.custom_type || 'Individual'}</span>
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
//               {selectedTenant.custom_type === 'Company' ? (
//                 <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
//                   <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>VAT ID</span>
//                   <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedTenant.custom_company_vat_id || '—'}</span>
//                 </div>
//               ) : (
//                 <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 12 }}>
//                   <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Date of Birth</span>
//                   <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedTenant.date_of_birth || '—'}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Register modal - only fields that exist on the Customer doctype + confirmed custom fields */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h3>Register New Tenant</h3>
//               <button onClick={() => { setShowModal(false); resetForm(); }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button>
//             </div>
//             <form onSubmit={handleSubmit}>
//               <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

//                 {/* Type toggle -> custom_type, defaults to Individual */}
//                 <div className="form-group">
//                   <label className="form-label">Tenant Type</label>
//                   <div style={{ display: 'flex', gap: 8 }}>
//                     <button
//                       type="button"
//                       onClick={() => handleEntityTypeChange('Individual')}
//                       className={`btn ${entityType === 'Individual' ? 'btn-primary' : 'btn-secondary'}`}
//                       style={{ flex: 1, fontSize: 13 }}
//                     >
//                       Individual
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => handleEntityTypeChange('Company')}
//                       className={`btn ${entityType === 'Company' ? 'btn-primary' : 'btn-secondary'}`}
//                       style={{ flex: 1, fontSize: 13 }}
//                     >
//                       Company
//                     </button>
//                   </div>
//                 </div>

//                 {entityType === 'Individual' && (
//                   <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '0.6fr 1.4fr' }}>
//                     <div className="form-group">
//                       <label className="form-label">Salutation</label>
//                       <select value={salutation} onChange={(e) => setSalutation(e.target.value)} className="form-select">
//                         <option value="">--</option>
//                         <option value="Mr">Mr</option>
//                         <option value="Mrs">Mrs</option>
//                         <option value="Ms">Ms</option>
//                         <option value="Dr">Dr</option>
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label className="form-label">Full Name</label>
//                       <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Johnathan Doe" className="form-input" required />
//                     </div>
//                   </div>
//                 )}

//                 {entityType === 'Company' && (
//                   <>
//                     <div className="form-group">
//                       <label className="form-label">Company Name</label>
//                       <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Acme Holdings Ltd" className="form-input" required />
//                     </div>
//                     <div className="form-group">
//                       <label className="form-label">Company VAT ID</label>
//                       <input type="text" value={companyVatId} onChange={(e) => setCompanyVatId(e.target.value)} placeholder="e.g. VAT-123456" className="form-input" />
//                     </div>
//                   </>
//                 )}

//                 {entityType === 'Individual' && (
//                   <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
//                     <div className="form-group">
//                       <label className="form-label">Gender</label>
//                       <select value={gender} onChange={(e) => setGender(e.target.value)} className="form-select">
//                         <option value="">-- Select --</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     </div>
//                     <div className="form-group">
//                       <label className="form-label">Date of Birth</label>
//                       <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="form-input" />
//                     </div>
//                   </div>
//                 )}

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
import { Home, Building2, Plus, Globe, Search, ArrowRight, ShieldCheck, X, Grid, Info } from 'lucide-react';

const fallbackImages = {
  residential: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  ],
  commercial: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
  ],
  mall: [
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582037928769-181f2644ecb7?auto=format&fit=crop&w=800&q=80'
  ]
};

const unitFallbackImages = {
  residential: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
  ],
  commercial: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80'
  ],
  mall: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80'
  ]
};

function SecureImage({ src, alt, style, className, erpnextConfig }) {
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    if (!src) return;
    if (src.startsWith('data:') || !src.includes('/private/')) {
      setImgSrc(src);
      return;
    }

    const controller = new AbortController();
    const headers = {};


    async function fetchImage() {
      try {
        const res = await fetch(src, {
          credentials: 'include',
          headers,
          signal: controller.signal
        });
        if (res.ok) {
          const blob = await res.blob();
          const objectUrl = URL.createObjectURL(blob);
          setImgSrc(objectUrl);
        } else {
          setImgSrc(src);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setImgSrc(src);
        }
      }
    }

    fetchImage();

    return () => {
      controller.abort();
    };
  }, [src, erpnextConfig]);

  return <img src={imgSrc || src} alt={alt} style={style} className={className} />;
}

function ImageCarousel({ images, height = 180, erpnextConfig }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', background: '#1e293b', height }}>
      <div style={{ display: 'flex', width: `${images.length * 100}%`, height: '100%', transform: `translateX(-${(activeIndex * 100) / images.length}%)`, transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        {images.map((img, i) => (
          <div key={i} style={{ width: `${100 / images.length}%`, height: '100%', flexShrink: 0 }}>
            <SecureImage
              src={img}
              alt={`slide-${i}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              erpnextConfig={erpnextConfig}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(4px)' }}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={handleNext}
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(4px)' }}
          >
            ›
          </button>

          <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 10 }}>
            {images.map((_, i) => (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: i === activeIndex ? 'var(--brand-color)' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s' }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}



function LinkField({ label, doctype, value, onChange, required, erpnextConfig, placeholder }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!erpnextConfig?.url) return;
    let active = true;
    setLoading(true);
    fetch(`${erpnextConfig.url}/api/resource/${encodeURIComponent(doctype)}?fields=["name"]&limit_page_length=0`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => (res.ok ? res.json() : { data: [] }))
      .then(json => { if (active) setOptions(json.data || []); })
      .catch(() => { if (active) setOptions([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [doctype, erpnextConfig]);

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="form-select" required={required}>
        <option value="">{loading ? 'Loading...' : (placeholder || `-- Choose ${label} --`)}</option>
        {options.map(o => (
          <option key={o.name} value={o.name}>{o.name}</option>
        ))}
      </select>
    </div>
  );
}

function buildGeoLocation(lat, lng) {
  if (lat === '' || lng === '' || lat == null || lng == null) return undefined;
  return JSON.stringify({
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] }
    }]
  });
}

export default function Properties({ properties, onAddProperty, onToggleListOnline, erpnextConfig, onScheduleMaintenance, tenants = [], owners = [] }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProp, setSelectedProp] = useState(null);
  const [expandedUnit, setExpandedUnit] = useState(null);

  const [expandedFloors, setExpandedFloors] = useState({});

  // Pagination & Layout States
  const [viewLayout, setViewLayout] = useState('standard'); // 'standard' | 'three-column'
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // ERPNext Integration States
  const [detailedProp, setDetailedProp] = useState(null);
  const [propertyUnits, setPropertyUnits] = useState([]);
  const [loadedUnitDetails, setLoadedUnitDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [showUiFields, setShowUiFields] = useState([]);



  const [country, setCountry] = useState('Fiji');
  const [landAndBuildingType, setLandAndBuildingType] = useState('');
  const [district, setDistrict] = useState('');
  const [legalDescription, setLegalDescription] = useState('');
  const [locality, setLocality] = useState('');
  const [referenceNo, setReferenceNo] = useState(''); // this IS the doc's name
  const [landDescription, setLandDescription] = useState('');
  const [leaseStartDate, setLeaseStartDate] = useState('');
  const [leaseEndDate, setLeaseEndDate] = useState('');
  const [propertyOwner, setPropertyOwner] = useState('');
  const [externalTenant, setExternalTenant] = useState('');
  const [propertyArea, setPropertyArea] = useState('');
  const [yearsRemaining, setYearsRemaining] = useState('');
  const [internalTenant, setInternalTenant] = useState('');
  const [noOfFloors, setNoOfFloors] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // Local-only, not in this doctype — keep if your UI elsewhere depends on them
  const [type, setType] = useState('residential');
  const [rent, setRent] = useState('');
  const [unitsCount, setUnitsCount] = useState(1);

  // Fetch Item DocType fields to filter unit fields by 'show_on_ui_app'
  useEffect(() => {
    if (!erpnextConfig || !erpnextConfig.url) return;
    const fetchDocTypeFields = async () => {
      try {
        const res = await fetch(`${erpnextConfig.url}/api/resource/DocType/Item`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const json = await res.json();
          const doctype = json.data || json;
          if (doctype && Array.isArray(doctype.fields)) {
            const allowed = doctype.fields
              .filter(f => f.show_on_ui_app === 1 || f.show_on_ui_app === true)
              .map(f => f.fieldname);
            setShowUiFields(allowed);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch Item DocType fields:', err);
      }
    };
    fetchDocTypeFields();
  }, [erpnextConfig]);

  // Form states
  const [name, setName] = useState('');
  // const [type, setType] = useState('residential');
  const [address, setAddress] = useState('');
  // const [unitsCount, setUnitsCount] = useState(1);
  // const [rent, setRent] = useState('');
  const [area, setArea] = useState('');

  // Property Group field states
  // const [propertyOwner, setPropertyOwner] = useState('');
  // const [country, setCountry] = useState('Fiji');
  // const [landAndBuildingType, setLandAndBuildingType] = useState('Land and Structure');
  // const [district, setDistrict] = useState('');
  // const [locality, setLocality] = useState('');
  // const [legalDescription, setLegalDescription] = useState('');
  // const [referenceNo, setReferenceNo] = useState('');
  // const [leaseStartDate, setLeaseStartDate] = useState('');
  // const [leaseEndDate, setLeaseEndDate] = useState('');
  // const [noOfFloors, setNoOfFloors] = useState('');

  const [alertState, setAlertState] = useState({ show: false, success: true, message: '' });

  const validateForm = () => {
    switch (true) {
      // case !name?.trim():
      //   return 'Property name is required';

      // case !address?.trim():
      //   return 'Address is required';

      case !propertyOwner?.trim():
        return 'Property owner is required';

      case !district?.trim():
        return 'District is required';

      // case !rent:
      //   return 'Rent is required';

      // case Number(rent) <= 0:
      //   return 'Rent must be greater than 0';

      // case !area:
      //   return 'Area is required';

      // case Number(area) <= 0:
      //   return 'Area must be greater than 0';

      case unitsCount < 1:
        return 'Units count must be at least 1';

      default:
        return null;
    }
  };
  const groupUnitsByFloor = (units) => {
    const groups = {};
    units.forEach(unit => {
      const floor = unit.custom_floor || unit.floor || 'Unspecified';
      if (!groups[floor]) groups[floor] = [];
      groups[floor].push(unit);
    });
    return groups;
  };

  const toggleFloor = (floor) => {
    setExpandedFloors(prev => ({ ...prev, [floor]: !prev[floor] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, address, rent, area)
    // if (!name || !address || !rent || !area ) {
    //   setAlertState({ show: true, success: false, message: 'Please fill in all required fields!' });
    //   return;
    // }
    const error = validateForm();

    if (error) {
      setAlertState({
        show: true,
        success: false,
        message: error,
      });
      return;
    }

    try {
      onAddProperty({
        id: `PROP-${Math.floor(1000 + Math.random() * 9000)}`,
        name,
        type,
        address,
        unitsCount: Number(unitsCount),
        rent: Number(rent),
        area: Number(area),
        listedOnline: false,
        occupancy: 0,
        propertyOwner,
        country,
        landAndBuildingType,
        district,
        locality: locality || address,
        legalDescription,
        referenceNo,
        leaseStartDate,
        leaseEndDate,
        noOfFloors: Number(noOfFloors) || undefined,

        latitude,
        longitude

      });

      // setName('');
      setType('residential');
      setAddress('');
      setUnitsCount(1);
      setRent('');
      setArea('');
      setPropertyOwner('');
      setCountry('Fiji');
      setLandAndBuildingType('Land and Structure');
      setDistrict('');
      setLocality('');
      setLegalDescription('');
      setReferenceNo('');
      setLeaseStartDate('');
      setLeaseEndDate('');
      setNoOfFloors('');
      setShowAddModal(false);
      setAlertState({ show: true, success: true, message: 'Property saved successfully!' });
    } catch (err) {
      setAlertState({ show: true, success: false, message: err.message || 'Failed to save property portfolio!' });
    }
  };

  // Fetch details and units from ERPNext API
  useEffect(() => {
    if (!selectedProp || !erpnextConfig) {
      setDetailedProp(null);
      setPropertyUnits([]);
      setLoadedUnitDetails({});
      return;
    }

    async function fetchDetailsAndUnits() {
      setLoadingDetails(true);
      setLoadingUnits(true);
      setLoadedUnitDetails({});

      // 1. Fetch Property Group Details
      try {
        const res = await fetch(`${erpnextConfig.url}/api/method/erpnext.api.get_property_group?name=${selectedProp.id}`,
          // const res = await fetch(`${erpnextConfig.url}/api/resource/Property Group`,
          {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          });
        if (res.ok) {
          const data = await res.json();
          setDetailedProp(data.message || data);
        } else {
          setDetailedProp(selectedProp); // fallback
        }
      } catch (err) {
        console.warn('Failed to fetch detailed property group:', err);
        setDetailedProp(selectedProp);
      } finally {
        setLoadingDetails(false);
      }

      // 2. Fetch Units List
      try {
        const res = await fetch(`${erpnextConfig.url}/api/method/erpnext.api.get_units?property_group=${selectedProp.id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (res.ok) {
          const data = await res.json();
          const list = data.message || data;
          if (Array.isArray(list)) {
            console.log("unitdata", list)
            setPropertyUnits(list);
          } else {
            setPropertyUnits([]);
          }
        } else {
          // Generate fallback unit list
          setPropertyUnits([...Array(selectedProp.unitsCount || 4)].map((_, i) => ({
            name: `${selectedProp.id}-UNIT-${100 + i + 1}`,
            unit_name: `Space Unit #${100 + i + 1}`,
            status: 'Vacant',
            rent: Math.round(selectedProp.rent / (selectedProp.unitsCount || 4)),
            area: Math.round(selectedProp.area / (selectedProp.unitsCount || 4))
          })));
        }
      } catch (err) {
        console.warn('Failed to fetch units list, falling back:', err);
        setPropertyUnits([...Array(selectedProp.unitsCount || 4)].map((_, i) => ({
          name: `${selectedProp.id}-UNIT-${100 + i + 1}`,
          unit_name: `Space Unit #${100 + i + 1}`,
          status: 'Vacant',
          rent: Math.round(selectedProp.rent / (selectedProp.unitsCount || 4)),
          area: Math.round(selectedProp.area / (selectedProp.unitsCount || 4))
        })));
      } finally {
        setLoadingUnits(false);
      }
    }

    fetchDetailsAndUnits();
  }, [selectedProp?.id, erpnextConfig]);

  // Click handler to expand unit and fetch its individual detail via get_unit API
  const handleUnitToggle = async (unitId) => {
    const isExpanded = expandedUnit === unitId;
    if (isExpanded) {
      setExpandedUnit(null);
      return;
    }

    setExpandedUnit(unitId);

    // If details are already cached, do not refetch
    if (loadedUnitDetails[unitId]) return;

    try {
      const res = await fetch(`${erpnextConfig.url}/api/method/erpnext.api.get_unit?item_code=${unitId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setLoadedUnitDetails(prev => ({
          ...prev,
          [unitId]: data.message || data
        }));
      } else {
        // Mock fallback details
        const matchedUnit = propertyUnits.find(u => u.name === unitId) || {};
        setLoadedUnitDetails(prev => ({
          ...prev,
          [unitId]: {
            rent: matchedUnit.rent || 800,
            area: matchedUnit.area || 1000,
            power_reading: '4,120 kWh',
            water_reading: '890 m³',
            status: matchedUnit.status || 'Vacant'
          }
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch single unit details:', err);
      const matchedUnit = propertyUnits.find(u => u.name === unitId) || {};
      setLoadedUnitDetails(prev => ({
        ...prev,
        [unitId]: {
          rent: matchedUnit.rent || 800,
          area: matchedUnit.area || 1000,
          power_reading: '4,120 kWh (Local Fallback)',
          water_reading: '890 m³ (Local Fallback)',
          status: matchedUnit.status || 'Vacant'
        }
      }));
    }
  };

  const handlePropertyRowClick = (prop) => {
    setSelectedProp(prop);
    setViewLayout('three-column');
    setSelectedUnitId(null);
  };

  const uniqueTypes = Array.from(new Set(properties.map(p => p.land_and_building_type || p.type).filter(Boolean)));

  const filteredProperties = properties.filter(prop => {
    const propType = prop.land_and_building_type || prop.type;
    const matchesFilter = filterType === 'all' || propType === filterType || prop.type === filterType;
    const matchesSearch = prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);

  const renderPaginationControls = () => {
    if (totalPages <= 1) return null;
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderTop: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
        <div>
          Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, filteredProperties.length)}</strong> of <strong>{filteredProperties.length}</strong> entries
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: 12, opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              type="button"
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 12px', fontSize: 12 }}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: 12, opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const getCleanUnitFields = (details, matchedUnit) => {
    const rentVal = details.rent || details.valuation_rate || matchedUnit?.rent || 0;
    const areaVal = details.area || details.property_area || matchedUnit?.area || 0;
    const areaUnit = details.property_area_unit || 'Sqm';

    const fields = [
      { label: 'Property Rent', value: `$${rentVal.toLocaleString()}/mo` },
      { label: 'Property Area', value: `${areaVal} ${areaUnit}` }
    ];

    if (details.power_reading) fields.push({ label: 'Power Grid reading', value: details.power_reading });
    if (details.water_reading) fields.push({ label: 'Water reading', value: details.water_reading });
    if (details.unit_owner || details.owner) fields.push({ label: 'Unit Ownership', value: details.unit_owner || details.owner });

    // Filter out blacklisted fields dynamically
    const blacklist = [
      'rent', 'area', 'power_reading', 'water_reading', 'status', 'idx', 'external_tenant', 'internal_tenant',
      'external tenant', 'internal tenant', 'external', 'internal',
      'item_code', 'stock_uom', 'company', 'average_carpet_area_of_units', 'total_floors',
      'product_bundle_id', 'is_recommended', 'property_owner', 'property_owned_by', 'bundle_price',
      'valuation_rate', 'total_services_prices', 'item code', 'stock uom', 'average carpet area of units',
      'total floors', 'product bundle id', 'is recommended', 'property owner', 'property owned by',
      'bundle price', 'valuation rate', 'total services prices', 'property_area', 'property_area_unit'
    ];

    Object.keys(details).forEach(key => {
      const kLower = key.toLowerCase().replace(/_/g, ' ').trim();
      const isAllowed = showUiFields.length > 0
        ? showUiFields.includes(key)
        : (!blacklist.includes(key.toLowerCase()) && !blacklist.includes(kLower));

      if (isAllowed) {
        fields.push({
          label: key.replace(/^custom_/, '').replace(/_custom_/gi, '_').replace(/custom/gi, '').replace(/_/g, ' ').trim(),
          value: String(details[key])
        });
      }
    });

    return fields;
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">Properties Portfolio</h1>
          <p className="view-subtitle">Manage residential buildings, commercial spaces, and mall facilities for Carpenters Estate.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add Property
        </button>
      </div>

      {/* Controls panel */}
      <div className="card-panel" style={{ padding: '16px 24px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 260 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 38 }}
            />
          </div>
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

        <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
          <span>Total: <strong>{filteredProperties.length}</strong></span>
          <span>Residential: <strong>{filteredProperties.filter(p => p.type === 'residential').length}</strong></span>
          <span>Commercial: <strong>{filteredProperties.filter(p => p.type === 'commercial').length}</strong></span>
          <span>Mall: <strong>{filteredProperties.filter(p => p.type === 'mall').length}</strong></span>
        </div>
      </div>

      {/* Dynamic layout render engine */}
      {viewLayout === 'three-column' && selectedProp ? (
        <div style={{
          display: 'grid',
          // gridTemplateColumns: '26% 34% 40%',
          gridTemplateColumns: 'minmax(280px,1fr) minmax(380px,1.3fr) minmax(450px,1.5fr)',
          gap: 20, height: 'calc(100vh - 170px)', // adjust according to your header height
          overflow: 'hidden'
        }}>
          {/* Column 1: Shrunk property list */}
          <div className="card-panel" style={{
            padding: 12,
            height: '100%',
            overflowY: 'auto',
            minHeight: 0
          }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 8px 10px', borderBottom: '1px solid var(--border-color)', marginBottom: 8 }}>Assets</h3>
            <div className="table-container" style={{ border: 'none', marginTop: 0 }}>
              <table className="custom-table" style={{ width: '100%', fontSize: 11 }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Land Description</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(prop => (
                    <tr
                      key={prop.id}
                      onClick={() => {
                        setSelectedProp(prop);
                        setSelectedUnitId(null);
                      }}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedProp?.id === prop.id ? 'var(--bg-accent-alpha)' : ''
                      }}
                    >
                      <td
                        style={{ fontWeight: 600, color: 'var(--brand-color)', textDecoration: 'underline' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProp(prop);
                          setViewLayout('standard');
                        }}
                      >
                        {prop.name}
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {prop.land_description || `Area: ${prop.area} sq ft`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPaginationControls()}
          </div>

          {/* Column 2: Space Units list */}
          <div className="card-panel" style={{
            padding: 16,
            height: '100%',
            overflowY: 'auto',
            minHeight: 0
          }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', paddingBottom: 10, borderBottom: '1px solid var(--border-color)', marginBottom: 14 }}>Space Units Breakdown</h3>
            {/* {loadingUnits ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, padding: '16px 0' }}>Loading space units...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {propertyUnits.map((unit, idx) => {
                  const isActive = selectedUnitId === unit.name;
                  return (
                    <div
                      key={unit.name || idx}
                      onClick={() => {
                        setSelectedUnitId(unit.name);
                        handleUnitToggle(unit.name);
                      }}
                      style={{
                        padding: '10px 12px',
                        background: isActive ? 'var(--bg-accent-alpha)' : 'var(--bg-tertiary)',
                        border: isActive ? '1px solid var(--brand-color)' : '1px solid var(--border-color)',
                        borderRadius: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: 11
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{unit.unit_name || unit.name}</span>
                      <span className={`badge ${unit.status === 'occupied' ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: 9 }}>
                        {unit.status || 'Vacant'}
                      </span>
                    </div>
                  );
                })}
                {propertyUnits.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: 11 }}>No units configured.</div>
                )}
              </div>
            )} */}

            {loadingUnits ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, padding: '16px 0' }}>Loading space units...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(groupUnitsByFloor(propertyUnits)).map(([floor, units]) => {
                  const isOpen = expandedFloors[floor] === true; // default open
                  return (
                    <div key={floor} style={{ border: '1px solid var(--border-color)', borderRadius: 6, overflow: 'hidden' }}>
                      <div
                        onClick={() => toggleFloor(floor)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          background: 'var(--bg-tertiary)',
                          cursor: 'pointer',
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <span>{floor} Floor ({units.length})</span>
                        <span style={{ color: 'var(--brand-color)', fontSize: 10 }}>{isOpen ? '▲ Collapse' : '▼ Expand'}</span>
                      </div>

                      {isOpen && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 8 }}>
                          {units.map((unit, idx) => {
                            const isActive = selectedUnitId === unit.name;
                            return (
                              <div
                                key={unit.name || idx}
                                onClick={() => {
                                  setSelectedUnitId(unit.name);
                                  handleUnitToggle(unit.name);
                                }}
                                style={{
                                  padding: '10px 12px',
                                  background: isActive ? 'var(--bg-accent-alpha)' : 'var(--bg-tertiary)',
                                  border: isActive ? '1px solid var(--brand-color)' : '1px solid var(--border-color)',
                                  borderRadius: 6,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  fontSize: 11
                                }}
                              >
                                <span style={{ fontWeight: 600 }}>{unit.unit_name || unit.name}</span>
                                <span className={`badge ${unit.status === 'occupied' ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: 9 }}>
                                  {unit.status || 'Vacant'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                {propertyUnits.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: 11 }}>No units configured.</div>
                )}
              </div>
            )}
          </div>

          {/* Column 3: Active Unit detailed inspection sheet */}
          <div
  className="card-panel"
  style={{
    width: "85%",
    boxSizing: "border-box",
    padding: "18px",
    height: "100%",
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
  }}
>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', paddingBottom: 10, borderBottom: '1px solid var(--border-color)', marginBottom: 14 }}>Selected Unit Spec</h3>
            {/* {selectedUnitId ? (() => {
              const details = loadedUnitDetails[selectedUnitId];
              console.log(details)
              const matchedUnit = propertyUnits.find(u => u.name === selectedUnitId);

              if (!details) {
                return <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, padding: '16px 0' }}>Loading specs...</div>;
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {(() => {
                    const unitFallbackImages = {
                      residential: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
                      commercial: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
                      mall: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
                    };
                    const imgs = (details.custom_unit_images && details.custom_unit_images.length > 0)
                      ? details.custom_unit_images.map(item => item.image.startsWith('http') ? item.image : `${erpnextConfig?.url || ''}${item.image}`)
                      : (details.image ? [details.image.startsWith('http') ? details.image : `${erpnextConfig?.url || ''}${details.image}`] : [unitFallbackImages[selectedProp.type] || unitFallbackImages.commercial]);
                    return <ImageCarousel images={imgs} height={160} erpnextConfig={erpnextConfig} />;
                  })()}

                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{matchedUnit?.unit_name || selectedUnitId}</h4>
                    <span className={`badge ${details.status === 'occupied' ? 'badge-danger' : 'badge-success'}`} style={{ marginTop: 4 }}>
                      {details.status}
                    </span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
                    {getCleanUnitFields(details, matchedUnit).map(f => (
                      <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ textTransform: 'capitalize' }}>{f.label}:</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{f.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })() : (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: 11 }}>
                Select a Space Unit in the middle column to inspect details.
              </div>
            )} */}
            {selectedUnitId ? (() => {
              const details = loadedUnitDetails[selectedUnitId];
              const matchedUnit = propertyUnits.find(u => u.name === selectedUnitId);

              if (!details) {
                return <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, padding: '16px 0' }}>Loading specs...</div>;
              }

              const isOccupied = details.status === 'occupied' || details.custom_property_status === 'Occupied';

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1, }}>
                  {/* Image Viewer */}
                  {(() => {
                    const unitFallbackImages = {
                      residential: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
                      commercial: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
                      mall: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
                    };
                    const imgs = (details.custom_unit_images && details.custom_unit_images.length > 0)
                      ? details.custom_unit_images.map(item => item.image.startsWith('http') ? item.image : `${erpnextConfig?.url || ''}${item.image}`)
                      : (details.image ? [details.image.startsWith('http') ? details.image : `${erpnextConfig?.url || ''}${details.image}`] : [unitFallbackImages[selectedProp.type] || unitFallbackImages.commercial]);
                    return <ImageCarousel images={imgs} height={160} erpnextConfig={erpnextConfig} />;
                  })()}

                  {/* Header */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                        {matchedUnit?.unit_name || details.item_name || selectedUnitId}
                      </h4>
                      {details.custom_is_recomended_ === 'Yes' && (
                        <span className="badge badge-warning" style={{ fontSize: 9, whiteSpace: 'nowrap' }}>★ Recommended</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                      <span className={`badge ${isOccupied ? 'badge-danger' : 'badge-success'}`}>
                        {details.custom_property_status || details.status || 'Available'}
                      </span>
                      {details.custom_property_owner && (
                        <span className="badge badge-secondary">{details.custom_property_owner}</span>
                      )}
                    </div>
                  </div>

                  {/* Key facts grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8,
                    background: 'var(--bg-secondary, rgba(0,0,0,0.03))',
                    borderRadius: 8,
                    padding: 10
                  }}>
                    {[
                      { label: 'Floor', value: details.custom_floor },
                      { label: 'Area', value: details.custom_property_area ? `${details.custom_property_area} ${details.custom_property_area_unit || ''}` : null },
                      { label: 'Rate', value: details.valuation_rate ? `$${Number(details.valuation_rate).toLocaleString()}` : null },
                      { label: 'Group', value: details.custom_property_group },
                    ].filter(f => f.value).map(f => (
                      <div key={f.label}>
                        <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{f.label}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{f.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Location */}
                  {(details.custom_country || details.custom_district || details.custom_locality) && (
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Location
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                        {[details.custom_locality, details.custom_district, details.custom_country].filter(Boolean).join(', ')}
                      </div>
                      {details.custom_land_description && (
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                          Land: {details.custom_land_description}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Owner */}
                  {details.custom_property_owner_name && (
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Owned By
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-primary)' }}>{details.custom_property_owner_name}</div>
                    </div>
                  )}

                  {/* Services / Features */}
                  {details.custom_property_reference && details.custom_property_reference.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Services
                        </span>
                        {details.custom_total_services_prices > 0 && (
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                            Total: ${details.custom_total_services_prices}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {details.custom_property_reference.map(svc => (
                          <div key={svc.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{svc.service_type}</span>
                            <strong style={{ color: 'var(--text-primary)' }}>${svc.price}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subscription plan */}
                  {details.custom_subscription_plan && (
                    <div style={{
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: 10,
                      fontSize: 11,
                      color: 'var(--text-secondary)'
                    }}>
                      Plan: <strong style={{ color: 'var(--text-primary)' }}>{details.custom_subscription_plan}</strong>
                    </div>
                  )}

                  {/* Fallback to any remaining generic fields */}
                  {typeof getCleanUnitFields === 'function' && (
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
                      {getCleanUnitFields(details, matchedUnit).map(f => (
                        <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ textTransform: 'capitalize' }}>{f.label}:</span>
                          <strong style={{ color: 'var(--text-primary)' }}>{f.value}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })() : (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: 11 }}>
                Select a Space Unit in the middle column to inspect details.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* STANDARD SPLIT VIEW */
        <div className="grid-2col" style={{ gridTemplateColumns: selectedProp ? '60% calc(40% - 24px)' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>
          {/* Properties Table */}
          <div className="card-panel" style={{
            padding: 0,
            height: '100%',
            overflowY: 'auto',
            minHeight: 0
          }}>
            <div className="table-container" style={{ border: 'none', marginTop: 0 }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Land Description</th>
                    <th>Lease End</th>
                    <th style={{ textAlign: 'right' }}>Picture</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(prop => (
                    <tr
                      key={prop.id}
                      onClick={() => handlePropertyRowClick(prop)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedProp?.id === prop.id ? 'var(--bg-accent-alpha)' : '',
                        borderLeft: selectedProp?.id === prop.id ? '3px solid var(--brand-color)' : ''
                      }}
                    >
                      <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{prop.id}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <SecureImage
                            src={prop.image || fallbackImages[prop.type]?.[0] || fallbackImages.commercial[0]}
                            alt=""
                            style={{ width: 26, height: 26, objectFit: 'cover', borderRadius: '50%', border: '1px solid var(--border-color)' }}
                            erpnextConfig={erpnextConfig}
                          />
                          <div>
                            <div style={{ fontWeight: 600 }}>{prop.name}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{prop.address}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${(prop.land_and_building_type || prop.type) === 'residential' ? 'badge-success' : (prop.land_and_building_type || prop.type) === 'commercial' ? 'badge-info' : 'badge-warning'}`}>
                          {prop.land_and_building_type || prop.type}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {prop.land_description || `Plot size: ${prop.area.toLocaleString()} sq ft`}
                      </td>
                      <td>
                        <span className="badge badge-warning" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--brand-color)' }}>
                          {prop.lease_end_date || '2026-12-31'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <SecureImage
                          src={prop.image || fallbackImages[prop.type]?.[0] || fallbackImages.commercial[0]}
                          alt={prop.name}
                          style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'inline-block' }}
                          erpnextConfig={erpnextConfig}
                        />
                      </td>
                    </tr>
                  ))}
                  {filteredProperties.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                        No properties match your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {renderPaginationControls()}
          </div>

          {/* Selected Property Detail Panel */}
          {selectedProp && (() => {
            const p = detailedProp || selectedProp;
            return (
              <div className="card-panel" style={{
                padding: 24, display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.2s ease-out', position: 'relative', height: '100%',
                overflowY: 'auto',
                minHeight: 0
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Info size={18} style={{ color: 'var(--brand-color)' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-color)' }}>{p.id}</span>
                  </div>
                  <button
                    onClick={() => setSelectedProp(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Property Group Image at top */}
                {(() => {
                  const imgs = (p.gallery && p.gallery.length > 0)
                    ? p.gallery.map(item => item.image.startsWith('http') ? item.image : `${erpnextConfig?.url || ''}${item.image}`)
                    : (p.image ? [p.image] : (fallbackImages[p.type] || fallbackImages.commercial));
                  return <ImageCarousel images={imgs} height={180} erpnextConfig={erpnextConfig} />;
                })()}

                <div>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: 4 }}>{p.name}</h2>
                  <span className="badge badge-info" style={{ textTransform: 'uppercase', fontSize: 9, padding: '2px 8px' }}>
                    {p.land_and_building_type || p.type}
                  </span>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>{p.address}</p>

                  <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 6, marginTop: 12, fontSize: 11, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Land ID:</span>
                      <span style={{ fontWeight: 600 }}>{p.id}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Description:</span>
                      <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '70%' }}>{p.land_description || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Lease Expiry:</span>
                      <span style={{ fontWeight: 600 }}>{p.lease_end_date || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Occupied Units:</span>
                      <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>
                        {propertyUnits.filter(u => (u.status || '').toLowerCase() === 'occupied').length}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Vacant Units:</span>
                      <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>
                        {propertyUnits.filter(u => (u.status || '').toLowerCase() !== 'occupied').length}
                      </span>
                    </div>
                    {Object.keys(p).filter(key => ![
                      'id', 'name', 'type', 'land_and_building_type', 'address', 'land_description',
                      'lease_end_date', 'rent', 'area', 'unitsCount', 'listedOnline', 'occupancy',
                      'created_by', 'modified', 'docstatus', 'doctype', 'gallery', 'image', 'owner',
                      'creation', 'modified_by', 'property_owner', 'internal', 'external', 'idx',
                      'external_tenant', 'internal_tenant', 'external tenant', 'internal tenant'
                    ].includes(key.toLowerCase())).map(key => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}:</span>
                        <span style={{ fontWeight: 600 }}>{String(p[key])}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Occupancy Progress</span>
                    <span style={{ fontWeight: 600 }}>{p.occupancy || 0}%</span>
                  </div>
                  <div style={{ width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${p.occupancy || 0}%`, height: '100%', backgroundColor: (p.occupancy || 0) > 50 ? 'var(--color-success)' : 'var(--brand-color)', borderRadius: 3 }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 12 }}>
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Contract Rent</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-color)' }}>${(p.rent || 0).toLocaleString()}/mo</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Floor Area</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{(p.area || 0).toLocaleString()} sq ft</span>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unit Space Breakdown</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {loadingUnits ? (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, padding: '12px 0' }}>Loading units list...</div>
                    ) : (
                      propertyUnits.map((unit, idx) => {
                        const isExpanded = expandedUnit === unit.name;
                        const details = loadedUnitDetails[unit.name];
                        return (
                          <div key={unit.name || idx} style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-tertiary)', borderRadius: 6, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                            <div
                              onClick={() => handleUnitToggle(unit.name)}
                              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, padding: '8px 12px', cursor: 'pointer', transition: 'background-color var(--transition-fast)' }}
                              className="menu-item-hover"
                            >
                              <span style={{ fontWeight: 600 }}>{unit.unit_name || unit.name}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span className={`badge ${unit.status === 'occupied' ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: 9 }}>
                                  {unit.status || 'Vacant'}
                                </span>
                                <span style={{ fontSize: 10, color: 'var(--brand-color)', fontWeight: 600 }}>{isExpanded ? 'Collapse' : 'Expand'}</span>
                              </div>
                            </div>
                            {isExpanded && (
                              <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.01)', fontSize: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {details ? (
                                  <>
                                    {/* Unit Space Image Carousel (Top) */}
                                    {(() => {
                                      const imgs = (details.custom_unit_images && details.custom_unit_images.length > 0)
                                        ? details.custom_unit_images.map(item => item.image.startsWith('http') ? item.image : `${erpnextConfig?.url || ''}${item.image}`)
                                        : (details.image ? [details.image.startsWith('http') ? details.image : `${erpnextConfig?.url || ''}${details.image}`] : (unitFallbackImages[p.type] || unitFallbackImages.commercial));
                                      return (
                                        <div style={{ marginBottom: 8 }}>
                                          <ImageCarousel images={imgs} height={120} erpnextConfig={erpnextConfig} />
                                        </div>
                                      );
                                    })()}
                                    {getCleanUnitFields(details, unit).map(f => (
                                      <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>{f.label}:</span>
                                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{f.value}</span>
                                      </div>
                                    ))}
                                  </>
                                ) : (
                                  <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '6px 0' }}>Loading unit details...</div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                    {!loadingUnits && propertyUnits.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-muted)', fontSize: 11 }}>No space units configured.</div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: 14, display: 'flex', gap: 10 }}>
                  <button
                    className={`btn ${p.listedOnline ? 'btn-danger' : 'btn-primary'}`}
                    style={{ flex: 1, fontSize: 12 }}
                    onClick={() => {
                      onToggleListOnline(p.id);
                      setSelectedProp({ ...p, listedOnline: !p.listedOnline });
                    }}
                  >
                    <Globe size={13} /> {p.listedOnline ? 'Delist' : 'List Online'}
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    onClick={() => onScheduleMaintenance(p)}
                  >
                    Schedule Maintenance
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ position: 'relative', maxWidth: 600 }}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}
            >
              ×
            </button>
            <div className="modal-header">
              <h3>Create New Portfolio Asset</h3>
            </div>
            <form onSubmit={handleSubmit}>
              {/* <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Asset Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Carpenters Row Tower A" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Property Owner (Required Customer)</label>
                    <select value={propertyOwner} onChange={(e) => setPropertyOwner(e.target.value)} className="form-select" required>
                      <option value="">-- Choose Owner --</option>
                      {tenants.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
                      ))}
                      {owners.map(o => (
                        <option key={o.id} value={o.id}>{o.name} ({o.id})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Asset Class Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="form-select">
                      <option value="residential">Residential Complex</option>
                      <option value="commercial">Commercial Office</option>
                      <option value="mall">Mall space unit</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Property Type</label>
                    <select value={landAndBuildingType} onChange={(e) => setLandAndBuildingType(e.target.value)} className="form-select">
                      <option value="Land and Structure">Land and Structure</option>
                      <option value="Land Only">Land Only</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Total Sub-Units</label>
                    <input type="number" min="1" value={unitsCount} onChange={(e) => setUnitsCount(e.target.value)} className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">No. Of Floors</label>
                    <input type="number" min="1" value={noOfFloors} onChange={(e) => setNoOfFloors(e.target.value)} className="form-input" placeholder="e.g. 5" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Carpenters Estate, Stratford, London" className="form-input" required />
                </div>

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Locality</label>
                    <input type="text" value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="e.g. Stratford" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">District</label>
                    <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g. London" className="form-input" />
                  </div>
                </div>

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Reference No</label>
                    <input type="text" value={referenceNo} onChange={(e) => setReferenceNo(e.target.value)} placeholder="e.g. PG-REF-001" className="form-input" />
                  </div>
                </div>

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Base Monthly Rent (USD)</label>
                    <input type="number" min="1" value={rent} onChange={(e) => setRent(e.target.value)} placeholder="e.g. 2400" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Area (Sq Ft)</label>
                    <input type="number" min="1" value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. 1500" className="form-input" required />
                  </div>
                </div>

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Lease Start Date</label>
                    <input type="date" value={leaseStartDate} onChange={(e) => setLeaseStartDate(e.target.value)} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lease End Date</label>
                    <input type="date" value={leaseEndDate} onChange={(e) => setLeaseEndDate(e.target.value)} className="form-input" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Legal Description</label>
                  <textarea value={legalDescription} onChange={(e) => setLegalDescription(e.target.value)} placeholder="e.g. Plot No. 42, Block C..." className="form-input" rows="2" />
                </div>
              </div> */}
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Reference No (becomes Document ID)</label>
                    <input
                      type="text"
                      value={referenceNo}
                      onChange={(e) => setReferenceNo(e.target.value)}
                      placeholder="e.g. PG-REF-001"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Property Owner</label>
                    <select value={propertyOwner} onChange={(e) => setPropertyOwner(e.target.value)} className="form-select" required>
                      <option value="">-- Choose Owner --</option>
                      {tenants.map(t => <option key={t.id} value={t.id}>{t.name} ({t.id})</option>)}
                      {owners.map(o => <option key={o.id} value={o.id}>{o.name} ({o.id})</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <LinkField label="Country" doctype="Country" value={country} onChange={setCountry} erpnextConfig={erpnextConfig} required />
                  <LinkField label="District" doctype="District" value={district} onChange={setDistrict} erpnextConfig={erpnextConfig} required />
                </div>

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Property Type</label>
                    <select value={landAndBuildingType} onChange={(e) => setLandAndBuildingType(e.target.value)} className="form-select" required>
                      <option value="">-- Select --</option>
                      <option value="Services">Services</option>
                      <option value="Land Only">Land Only</option>
                      <option value="Land and Structure">Land and Structure</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">No. Of Floors</label>
                    <input type="text" value={noOfFloors} onChange={(e) => setNoOfFloors(e.target.value)} className="form-input" placeholder="e.g. 5" required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Locality</label>
                  <input type="text" value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="e.g. Suva" className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Legal Description</label>
                  <textarea value={legalDescription} onChange={(e) => setLegalDescription(e.target.value)} className="form-input" rows="2" />
                </div>

                <div className="form-group">
                  <label className="form-label">Land Description</label>
                  <textarea value={landDescription} onChange={(e) => setLandDescription(e.target.value)} className="form-input" rows="2" />
                </div>

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Lease Start Date</label>
                    <input type="date" value={leaseStartDate} onChange={(e) => setLeaseStartDate(e.target.value)} className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lease End Date</label>
                    <input type="date" value={leaseEndDate} onChange={(e) => setLeaseEndDate(e.target.value)} className="form-input" required />
                  </div>
                </div>

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Property Area</label>
                    <input type="text" value={propertyArea} onChange={(e) => setPropertyArea(e.target.value)} placeholder="e.g. 24567" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Years Remaining</label>
                    <input type="text" value={yearsRemaining} onChange={(e) => setYearsRemaining(e.target.value)} className="form-input" required />
                  </div>
                </div>

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">External Tenant</label>
                    <textarea value={externalTenant} onChange={(e) => setExternalTenant(e.target.value)} className="form-input" rows="2" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Internal Tenant</label>
                    <textarea value={internalTenant} onChange={(e) => setInternalTenant(e.target.value)} className="form-input" rows="2" />
                  </div>
                </div>

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Latitude</label>
                    <input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="-18.1416" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Longitude</label>
                    <input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="178.4419" className="form-input" />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Property</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS / FAILURE ALERT MODAL */}
      {alertState.show && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 400, position: 'relative' }}>
            <button
              onClick={() => setAlertState({ show: false, success: true, message: '' })}
              style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 18 }}
            >
              ×
            </button>
            <div className="modal-header">
              <h3>{alertState.success ? 'Success' : 'Notice / Error'}</h3>
            </div>
            <div className="modal-body" style={{ padding: '20px 0', textAlign: 'center' }}>
              <div style={{ color: alertState.success ? '#10b981' : '#ef4444', fontSize: '1.1rem', fontWeight: 600 }}>
                {alertState.message}
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setAlertState({ show: false, success: true, message: '' })}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
