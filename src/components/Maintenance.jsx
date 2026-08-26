// // import React, { useState, useEffect, useCallback } from 'react';
// // import { Hammer, User, Clock, CheckCircle, AlertTriangle, Plus, X, Calendar as CalendarIcon, List, BarChart3, ClipboardList, Building, Search, Activity, Settings, DollarSign, PenTool, Archive, Check, ArrowRight, UserCheck, ShieldCheck, Mail, Phone, MapPin, Award, Trash } from 'lucide-react';

// // // ── Toast ────────────────────────────────────────────────────────────────────
// // function Toast({ message, type, onClose }) {
// //   useEffect(() => {
// //     const t = setTimeout(onClose, 3500);
// //     return () => clearTimeout(t);
// //   }, [onClose]);

// //   const bg = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
// //   return (
// //     <div style={{
// //       position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
// //       background: bg, color: '#fff', padding: '12px 18px',
// //       borderRadius: 8, fontSize: 13, fontWeight: 500,
// //       boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
// //       display: 'flex', alignItems: 'center', gap: 10, maxWidth: 360,
// //       animation: 'slideUp 0.25s ease'
// //     }}>
// //       <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
// //       <span style={{ flex: 1 }}>{message}</span>
// //       <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, fontSize: 16, lineHeight: 1 }}>×</button>
// //     </div>
// //   );
// // }

// // export default function Maintenance({
// //   schedules = [],
// //   visits = [],
// //   tenants = [],
// //   properties = [],
// //   preSelectedProperty = null,
// //   clearPreSelectedProperty,
// //   preSelectedIssue = null,
// //   clearPreSelectedIssue,
// //   onCreateSchedule,
// //   onUpdateScheduleDate,
// //   onUpdateScheduleStatus,
// //   onUpdateVisitStatus,
// //   erpnextConfig,
// //   employees = [],
// //   vendors = [],
// //   onAssignResource,
// //   onCreateVisit
// // }) {
// //   const [activeSection, setActiveSection] = useState('schedule');
// //   const [viewMode, setViewMode] = useState('list');
// //   const [maintenanceSearch, setMaintenanceSearch] = useState('');

// //   const [selectedSchedule, setSelectedSchedule] = useState(null);
// //   const [selectedVisit, setSelectedVisit] = useState(null);
// //   const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
// //   const [selectedAsset, setSelectedAsset] = useState(null);
// //   const [selectedVendor, setSelectedVendor] = useState(null);
// //   const [selectedTechnician, setSelectedTechnician] = useState(null);

// //   const [calendarYear, setCalendarYear] = useState(2026);
// //   const [calendarMonth, setCalendarMonth] = useState(5);
// //   const [selectedDateStr, setSelectedDateStr] = useState('2026-06-17');

// //   const [reassignTech, setReassignTech] = useState('');
// //   const [reassignVendor, setReassignVendor] = useState('');

// //   const [showScheduleModal, setShowScheduleModal] = useState(false);
// //   const [showWOModal, setShowWOModal] = useState(false);          // employee-assign modal
// //   const [showConsumeModal, setShowConsumeModal] = useState(false);

// //   // ── Toast state ─────────────────────────────────────────────────────────────
// //   const [toast, setToast] = useState(null); // { message, type }
// //   const showToast = (message, type = 'success') => setToast({ message, type });

// //   // ── Employee-assign WO state ─────────────────────────────────────────────────
// //   const [woAssignedEmployees, setWoAssignedEmployees] = useState([]); // array of employee names/ids
// //   const [woSubmitting, setWoSubmitting] = useState(false);

// //   // ── Schedule header fields ───────────────────────────────────────────────────
// //   const [schedCustomer, setSchedCustomer] = useState('');
// //   const [schedTransDate, setSchedTransDate] = useState(new Date().toISOString().split('T')[0]);
// //   const [schedBookingId, setSchedBookingId] = useState('');
// //   const [schedProperty, setSchedProperty] = useState('');

// //   // ── Schedule items child table ───────────────────────────────────────────────
// //   const [schedItems, setSchedItems] = useState([
// //     { itemCode: '', itemName: '', startDate: '', periodicity: 'Weekly', noOfVisits: 1, endDate: '' }
// //   ]);
// //   const [itemNameCache, setItemNameCache] = useState({});

// //   // legacy states kept for internal use
// //   const [schedIssueNumber, setSchedIssueNumber] = useState('');
// //   const [schedPropertyId, setSchedPropertyId] = useState('');
// //   const [schedUnitSpec, setSchedUnitSpec] = useState('');
// //   const [schedStartDate, setSchedStartDate] = useState('2026-06-16');
// //   const [schedDescription, setSchedDescription] = useState('');
// //   const [schedAssetId, setSchedAssetId] = useState('');
// //   const [schedUnits, setSchedUnits] = useState([]);

// //   const [submittingSchedule, setSubmittingSchedule] = useState(false);
// //   const [scheduleStatusMessage, setScheduleStatusMessage] = useState(null);

// //   const [bookings, setBookings] = useState([]);

// //   // Work Order / Task states (kept for non-WO-modal sections)
// //   const [woEstimates, setWoEstimates] = useState({});
// //   const [showEstimateModal, setShowEstimateModal] = useState(false);
// //   const [estType, setEstType] = useState('Material');
// //   const [estItemCode, setEstItemCode] = useState('');
// //   const [estName, setEstName] = useState('');
// //   const [estQty, setEstQty] = useState(1);
// //   const [estCost, setEstCost] = useState(0);
// //   const [estComment, setEstComment] = useState('');
// //   const [consumeItemsList, setConsumeItemsList] = useState([{ itemCode: '', qty: 1, comment: '' }]);

// //   const [localSchedules, setLocalSchedules] = useState([]);
// //   const [workOrders, setWorkOrders] = useState([]);
// //   const [techProfiles, setTechProfiles] = useState([]);
// //   const [vendorDir, setVendorDir] = useState([]);
// //   const [assetsList, setAssetsList] = useState([]);
// //   const [stockItems, setStockItems] = useState([]);

// //   const getCsrfToken = () =>
// //     document.cookie.split('; ').find(row => row.startsWith('sid='))?.split('=')[1] || '';

// //   // ── Fetch helpers ────────────────────────────────────────────────────────────
// //   useEffect(() => {
// //     if (!erpnextConfig?.url) return;
// //     fetch(`${erpnextConfig.url}/api/resource/Booking?fields=%5B%22name%22%5D&limit_page_length=200`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
// //       .then(r => r.ok ? r.json() : null).then(json => { if (json) setBookings(json.data || []); }).catch(() => { });
// //   }, [erpnextConfig]);

// //   const fetchItemName = async (itemCode) => {
// //     if (!itemCode || !erpnextConfig?.url) return '';
// //     if (itemNameCache[itemCode]) return itemNameCache[itemCode];
// //     try {
// //       const res = await fetch(`${erpnextConfig.url}/api/resource/Item/${encodeURIComponent(itemCode)}?fields=%5B%22item_name%22%5D`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } });
// //       if (res.ok) {
// //         const json = await res.json();
// //         const name = json.data?.item_name || json.item_name || itemCode;
// //         setItemNameCache(prev => ({ ...prev, [itemCode]: name }));
// //         return name;
// //       }
// //     } catch (e) { }
// //     return itemCode;
// //   };

// //   const handleSchedItemCodeChange = async (idx, value) => {
// //     const itemName = value ? (await fetchItemName(value)) : '';
// //     setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, itemCode: value, itemName } : r));
// //   };

// //   useEffect(() => {
// //     if (!erpnextConfig?.url) return;
// //     fetch(`${erpnextConfig.url}/api/resource/Item?fields=%5B%22name%22%2C%22item_name%22%5D&limit_page_length=500`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
// //       .then(r => r.ok ? r.json() : null).then(json => { if (json) setSchedUnits(json.data || []); }).catch(() => { });
// //   }, [erpnextConfig]);

// //   useEffect(() => {
// //     const fetchItems = async () => {
// //       if (!erpnextConfig?.url) {
// //         setStockItems([
// //           { code: 'ITEM-001', name: 'Copper Pipe 1/2 inch', qty: 50, unitCost: 15 },
// //           { code: 'ITEM-002', name: 'LED Ceiling Lamp 12W', qty: 30, unitCost: 25 },
// //           { code: 'ITEM-003', name: 'Water Tap Ceramic Valve', qty: 20, unitCost: 40 },
// //           { code: 'ITEM-004', name: 'Plywood Board 8x4', qty: 15, unitCost: 35 },
// //           { code: 'ITEM-005', name: 'Wall paint White 5L', qty: 10, unitCost: 60 }
// //         ]);
// //         return;
// //       }
// //       try {
// //         const res = await fetch(`${erpnextConfig.url}/api/resource/Item?fields=%5B%22name%22%2C%22item_name%22%2C%22val_rate%22%5D&limit_page_length=200`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } });
// //         if (res.ok) {
// //           const json = await res.json();
// //           setStockItems((json.data || []).map(item => ({ code: item.name, name: item.item_name || item.name, qty: 100, unitCost: Number(item.val_rate) || 20 })));
// //         }
// //       } catch (e) { }
// //     };
// //     fetchItems();
// //   }, [erpnextConfig]);

// //   useEffect(() => {
// //     if (!erpnextConfig?.url) return;
// //     fetch(`${erpnextConfig.url}/api/resource/Asset?fields=%5B%22name%22%2C%22asset_name%22%2C%22item_code%22%2C%22status%22%2C%22location%22%5D&limit_page_length=200`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
// //       .then(r => r.ok ? r.json() : null).then(json => {
// //         if (json) setAssetsList((json.data || []).map(a => ({ id: a.name, name: a.asset_name || a.name, item: a.item_code || 'HVAC System', status: a.status || 'Submitted', location: a.location || 'Stratford Apartments' })));
// //       }).catch(() => { });
// //   }, [erpnextConfig]);

// //   const fetchWorkOrders = useCallback(async () => {
// //     if (!erpnextConfig?.url) return;
// //     try {
// //       const fields = [
// //         "*"
// //       ];

// //       const res = await fetch(
// //         `${erpnextConfig.url}/api/resource/Task?fields=${encodeURIComponent(
// //           JSON.stringify(fields)
// //         )}&limit_page_length=200`,
// //         {
// //           credentials: "include",
// //           headers: {
// //             "Content-Type": "application/json",
// //           },
// //         }
// //       );

// //       // const res = await fetch(`${erpnextConfig.url}/api/resource/Task?fields=%5B%22name%22%2C%22subject%22%2C%22status%22%2C%22description%22%2C%22priority%22%2C%22exp_start_date%22%2C%22exp_end_date%22%5D&limit_page_length=200`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } });
// //       // console.log(res)
// //       if (res.ok) {
// //         const json = await res.json();
// //         console.log(json)
// //         setWorkOrders((json.data || []).map(t => ({
// //           id: t.name, property: getPropertyNameById(t.custom_property) || 'Stratford Court Apartments',
// //           unit: t.custom_asset || 'Flat 1A', category: t.subject ? t.subject.split(' ')[0] : 'General',
// //           technician: t.custom_technician || 'None', vendor: t.custom_vendor || 'None',
// //           estHours: 4, estCost: Number(t.custom_estimated_cost) || 150, actualCost: 0,
// //           status: t.status || 'Open', description: t.description || t.subject || '',
// //           consumedItems: [], expStartDate: t.exp_start_date, expEndDate: t.exp_end_date,
// //           priority: t.priority, scheduleId: t.custom_maintenance_schedule
// //         })));
// //       }
// //     } catch (e) { }
// //   }, [erpnextConfig]);

// //   useEffect(() => { fetchWorkOrders(); }, [fetchWorkOrders, localSchedules]);

// //   const fetchSchedules = useCallback(async () => {
// //     if (!erpnextConfig?.url) return;
// //     try {
// //       const res = await fetch(
// //         `${erpnextConfig.url}/api/resource/Maintenance Schedule?fields=%5B%22name%22%2C%22customer%22%2C%22customer_name%22%2C%22transaction_date%22%2C%22custom_property%22%2C%22status%22%2C%22docstatus%22%5D&limit_page_length=200`,
// //         { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
// //       );
// //       if (res.ok) {
// //         const json = await res.json();
// //         setLocalSchedules(json.data || []);
// //       }
// //     } catch (e) { }
// //   }, [erpnextConfig]);

// //   useEffect(() => {
// //     if (schedules && schedules.length > 0) setLocalSchedules(schedules);
// //     else fetchSchedules();
// //   }, [schedules]);

// //   useEffect(() => {
// //     setTechProfiles(employees.length > 0 ? employees.map(emp => ({
// //       id: emp.id || emp.name, name: emp.name,
// //       skill: emp.department || 'General Maintenance', certs: emp.designation || 'Technician',
// //       availability: emp.status === 'Active' ? 'Available' : 'On Leave',
// //       activeJobs: 0, phone: emp.phone || '+679 000 0000',
// //       email: emp.email || 'tech@carpenterestate.org', img: emp.image || ''
// //     })) : []);
// //   }, [employees]);

// //   useEffect(() => {
// //     setVendorDir(vendors.length > 0 ? vendors.map(v => ({
// //       id: v.id, name: v.name, group: v.supplier_group || 'Local', type: v.supplier_type || 'Services',
// //       rating: 4.5, quotesCount: 0, phone: v.phone || '+679 000 0000',
// //       email: v.email || 'vendor@carpenterestate.org', address: v.address || 'Fiji'
// //     })) : []);
// //   }, [vendors]);

// //   useEffect(() => {
// //     if (preSelectedProperty) {
// //       setSchedPropertyId(preSelectedProperty.id); setSchedProperty(preSelectedProperty.id);
// //       const t = tenants.find(t => t.propertyId === preSelectedProperty.id);
// //       if (t) setSchedCustomer(t.id);
// //       setShowScheduleModal(true); clearPreSelectedProperty();
// //     }
// //   }, [preSelectedProperty, tenants, clearPreSelectedProperty]);

// //   useEffect(() => {
// //     if (preSelectedIssue) {
// //       setSchedIssueNumber(preSelectedIssue.id || ''); setSchedDescription(preSelectedIssue.subject || '');
// //       const mt = tenants.find(t => t.name === preSelectedIssue.tenantName || t.id === preSelectedIssue.customerId || t.name === preSelectedIssue.customerId);
// //       if (mt) {
// //         setSchedCustomer(mt.id);
// //         if (mt.propertyId) { setSchedPropertyId(mt.propertyId); setSchedProperty(mt.propertyId); }
// //         if (mt.unitSpec) setSchedUnitSpec(mt.unitSpec);
// //       }
// //       setShowScheduleModal(true);
// //       if (clearPreSelectedIssue) clearPreSelectedIssue();
// //     }
// //   }, [preSelectedIssue, tenants, clearPreSelectedIssue]);

// //   const getPropertyNameById = (propId) => {
// //     const prop = (properties || []).find(p => p.id === propId || p.name === propId);
// //     return prop ? prop.name : 'Stratford Court Apartments';
// //   };

// //   // ── Drag & drop ──────────────────────────────────────────────────────────────
// //   const handleDragStart = (e, scheduleName) => e.dataTransfer.setData('text/plain', scheduleName);
// //   const handleDragOver = (e) => e.preventDefault();
// //   const handleDrop = (e, targetStatus) => {
// //     e.preventDefault();
// //     const scheduleName = e.dataTransfer.getData('text/plain');
// //     if (scheduleName) {
// //       setLocalSchedules(prev => prev.map(s => s.name === scheduleName ? { ...s, status: targetStatus } : s));
// //       if (onUpdateScheduleStatus) onUpdateScheduleStatus(scheduleName, targetStatus);
// //     }
// //   };

// //   // ── Create Schedule ──────────────────────────────────────────────────────────
// //   const handleCreateScheduleSubmit = async (e) => {
// //     e.preventDefault();
// //     setSubmittingSchedule(true); setScheduleStatusMessage(null);
// //     const tenantObj = tenants.find(t => t.id === schedCustomer);
// //     const customerName = tenantObj ? tenantObj.name : schedCustomer;
// //     const payload = {
// //       customer: schedCustomer, customer_name: customerName, transaction_date: schedTransDate,
// //       custom_booking_id: schedBookingId, custom_property: schedProperty, status: 'Draft',
// //       items: schedItems.map(r => ({ item_code: r.itemCode, item_name: r.itemName || r.itemCode, start_date: r.startDate, periodicity: r.periodicity, no_of_visits: Number(r.noOfVisits) || 1, end_date: r.endDate }))
// //     };
// //     try {
// //       await onCreateSchedule(payload);
// //       setScheduleStatusMessage({ type: 'success', text: 'Maintenance Schedule created successfully!' });
// //       setTimeout(() => { setShowScheduleModal(false); setScheduleStatusMessage(null); fetchSchedules(); }, 1200);
// //     } catch (err) {
// //       setScheduleStatusMessage({ type: 'error', text: err.message });
// //     } finally { setSubmittingSchedule(false); }
// //   };

// //   // ── Submit Work Order (approve schedule → auto-create Task → assign employees) ──
// //   const handleSubmitWorkOrder = async () => {
// //     if (!selectedSchedule) return;
// //     if (woAssignedEmployees.length === 0) {
// //       showToast('Please select at least one employee to assign.', 'error');
// //       return;
// //     }
// //     setWoSubmitting(true);
// //     try {
// //       const csrfToken = getCsrfToken();

// //       // Step 1: Submit / approve the maintenance schedule (state_code = 1)
// //       const approveRes = await fetch(`${erpnextConfig.url}/api/method/approve_reject_doc`, {
// //         method: 'POST', credentials: 'include',
// //         headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken },
// //         body: JSON.stringify({ doctype_name: 'Maintenance Schedule', docname: selectedSchedule.name, state_code: 1 })
// //       });
// //       if (!approveRes.ok) {
// //         const errText = await approveRes.text();
// //         throw new Error(`Failed to submit schedule: ${errText}`);
// //       }

// //       // Step 2: Find the Task auto-created by the backend (linked via custom_mantainence_sechedule)
// //       // Poll briefly to give backend time to create the task
// //       await new Promise(r => setTimeout(r, 1000));

// //       const taskSearchRes = await fetch(
// //         `${erpnextConfig.url}/api/resource/Task?filters=%5B%5B%22custom_mantainence_sechedule%22%2C%22%3D%22%2C%22${encodeURIComponent(selectedSchedule.name)}%22%5D%5D&fields=%5B%22name%22%5D&limit_page_length=5`,
// //         { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
// //       );

// //       let taskName = null;
// //       if (taskSearchRes.ok) {
// //         const taskJson = await taskSearchRes.json();
// //         const tasks = taskJson.data || [];
// //         if (tasks.length > 0) taskName = tasks[0].name;
// //       }

// //       // Step 3: Fetch full employee details then PUT to Task child table
// //       if (taskName) {
// //         // Fetch each selected employee's doc to get emp_id, name, designation, phone
// //         const empRows = await Promise.all(
// //           woAssignedEmployees.map(async (empId) => {
// //             try {
// //               const empRes = await fetch(
// //                 `${erpnextConfig.url}/api/resource/Employee/${encodeURIComponent(empId)}?fields=%5B%22name%22%2C%22employee_name%22%2C%22designation%22%2C%22cell_number%22%2C%22company_email%22%5D`,
// //                 { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
// //               );
// //               if (empRes.ok) {
// //                 const empJson = await empRes.json();
// //                 const emp = empJson.data || empJson;
// //                 return {
// //                   emp_id: emp.name || empId,
// //                   emp_name: emp.employee_name || emp.name || empId,
// //                   designation: emp.designation || '',
// //                   contact_number: emp.cell_number || emp.company_email || ''
// //                 };
// //               }
// //             } catch (e) { }
// //             // fallback: use whatever we have from the employees prop
// //             const localEmp = employees.find(e => (e.id || e.name) === empId);
// //             return {
// //               emp_id: empId,
// //               emp_name: localEmp?.name || empId,
// //               designation: localEmp?.designation || '',
// //               contact_number: localEmp?.phone || ''
// //             };
// //           })
// //         );

// //         const putRes = await fetch(`${erpnextConfig.url}/api/resource/Task/${taskName}`, {
// //           method: 'PUT', credentials: 'include',
// //           headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken },
// //           body: JSON.stringify({ custom_assign_to_: empRows })
// //         });

// //         if (!putRes.ok) {
// //           const errTxt = await putRes.text();
// //           console.warn('Employee assignment failed:', errTxt);
// //           showToast('Work order submitted. Employee assignment failed — check ERPNext logs.', 'info');
// //         } else {
// //           showToast(`Task submitted & ${empRows.length} employee(s) assigned to ${taskName}!`, 'success');
// //         }
// //       } else {
// //         showToast('Schedule submitted. Task not yet visible — employees can be assigned once it appears.', 'info');
// //       }

// //       // Step 4: Update local schedule status + refresh
// //       setLocalSchedules(prev => prev.map(s => s.name === selectedSchedule.name ? { ...s, status: 'Submitted', docstatus: 1 } : s));
// //       setSelectedSchedule(prev => prev ? { ...prev, status: 'Submitted', docstatus: 1 } : prev);
// //       fetchSchedules();
// //       fetchWorkOrders();

// //       // Close modal + reset
// //       setShowWOModal(false);
// //       setWoAssignedEmployees([]);
// //     } catch (err) {
// //       showToast(err.message || 'Submission failed.', 'error');
// //     } finally {
// //       setWoSubmitting(false);
// //     }
// //   };

// //   // ── WO section handlers ──────────────────────────────────────────────────────
// //   const handleReassignSubmit = async (woId) => {
// //     setWorkOrders(prev => prev.map(wo => wo.id === woId ? { ...wo, technician: reassignTech || wo.technician, vendor: reassignVendor || wo.vendor } : wo));
// //     setSelectedWorkOrder(prev => prev && prev.id === woId ? { ...prev, technician: reassignTech || prev.technician, vendor: reassignVendor || prev.vendor } : prev);
// //     setReassignTech(''); setReassignVendor('');
// //     if (erpnextConfig?.url) {
// //       try {
// //         const assignee = reassignTech || reassignVendor;
// //         const assigneeEmail = employees.find(e => e.name === assignee)?.email || vendors.find(v => v.name === assignee)?.email || assignee;
// //         if (assigneeEmail) {
// //           await fetch(`${erpnextConfig.url}/api/method/frappe.desk.form.assign_to.add`, {
// //             method: 'POST', credentials: 'include',
// //             headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Frappe-CSRF-Token': getCsrfToken() },
// //             body: new URLSearchParams({ doctype: 'Task', name: woId, assign_to: JSON.stringify([assigneeEmail]) })
// //           });
// //         }
// //       } catch (e) { }
// //     }
// //     showToast('Assignment saved.', 'success');
// //   };

// //   const handleWOStatusChange = async (woId, newStatus) => {
// //     const erpStatus = newStatus === 'In Progress' ? 'Working' : newStatus === 'Completed' ? 'Completed' : 'Open';
// //     const update = (wo) => ({ ...wo, status: newStatus, actualCost: newStatus === 'Completed' && wo.actualCost === 0 ? wo.estCost : wo.actualCost });
// //     setWorkOrders(prev => prev.map(wo => wo.id === woId ? update(wo) : wo));
// //     setSelectedWorkOrder(prev => prev && prev.id === woId ? update(prev) : prev);
// //     if (erpnextConfig?.url) {
// //       try {
// //         await fetch(`${erpnextConfig.url}/api/resource/Task/${woId}`, {
// //           method: 'PUT', credentials: 'include',
// //           headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': getCsrfToken() },
// //           body: JSON.stringify({ status: erpStatus })
// //         });
// //       } catch (e) { }
// //     }
// //   };
// //   const Info = ({ title, value }) => (
// //     <div
// //       style={{
// //         background: "var(--bg-tertiary)",
// //         borderRadius: 6,
// //         padding: "10px 12px"
// //       }}
// //     >
// //       <div
// //         style={{
// //           fontSize: 11,
// //           color: "var(--text-secondary)",
// //           marginBottom: 4
// //         }}
// //       >
// //         {title}
// //       </div>

// //       <div
// //         style={{
// //           fontWeight: 600,
// //           fontSize: 13
// //         }}
// //       >
// //         {value || "-"}
// //       </div>
// //     </div>
// //   );

// //   const handleConsumeItemSubmit = (e) => {
// //     e.preventDefault();
// //     if (!selectedWorkOrder) return;
// //     let totalCost = 0; const newConsumedItems = [];
// //     for (const entry of consumeItemsList) {
// //       if (!entry.itemCode) continue;
// //       const item = stockItems.find(s => s.code === entry.itemCode);
// //       if (!item) continue;
// //       if (item.qty < entry.qty) { showToast(`Insufficient stock for ${item.name}`, 'error'); return; }
// //       setStockItems(prev => prev.map(s => s.code === entry.itemCode ? { ...s, qty: s.qty - entry.qty } : s));
// //       const cost = item.unitCost * entry.qty; totalCost += cost;
// //       newConsumedItems.push({ item: item.name, itemCode: entry.itemCode, qty: entry.qty, cost, comment: entry.comment || '' });
// //     }
// //     if (newConsumedItems.length === 0) return;
// //     const updateWO = (wo) => ({ ...wo, consumedItems: [...(wo.consumedItems || []), ...newConsumedItems], actualCost: wo.actualCost + totalCost });
// //     setWorkOrders(prev => prev.map(wo => wo.id === selectedWorkOrder.id ? updateWO(wo) : wo));
// //     setSelectedWorkOrder(prev => prev && prev.id === selectedWorkOrder.id ? updateWO(prev) : prev);
// //     setConsumeItemsList([{ itemCode: '', qty: 1, comment: '' }]);
// //     setShowConsumeModal(false);
// //   };

// //   const handleAddEstimateSubmit = (e) => {
// //     e.preventDefault();
// //     if (!selectedWorkOrder) return;
// //     let finalName = estName, finalCost = Number(estCost);
// //     if (estType === 'Material' && estItemCode) {
// //       const m = stockItems.find(s => s.code === estItemCode);
// //       if (m) { finalName = m.name; finalCost = m.unitCost * estQty; }
// //     }
// //     const newEst = { id: `EST-${Date.now()}`, type: estType, itemCode: estType === 'Material' ? estItemCode : '', name: finalName || (estType === 'Labour' ? 'General Labour' : 'Material Item'), qty: Number(estQty) || 1, cost: finalCost, comment: estComment || '' };
// //     setWoEstimates(prev => ({ ...prev, [selectedWorkOrder.id]: [...(prev[selectedWorkOrder.id] || []), newEst] }));
// //     setEstType('Material'); setEstItemCode(''); setEstName(''); setEstQty(1); setEstCost(0); setEstComment('');
// //     setShowEstimateModal(false);
// //   };

// //   const handleGenerateQuotation = async (woId) => {
// //     const estimates = woEstimates[woId] || [];
// //     if (estimates.length === 0) { showToast('No estimates to generate quotation!', 'error'); return; }
// //     const customerId = selectedWorkOrder.customerId || (tenants[0]?.id || 'Customer-N/A');
// //     const payload = { quotation_to: 'Customer', party_name: customerId, transaction_date: new Date().toISOString().split('T')[0], company: 'CARPENTERS PROPERTIES PTE LIMITED', valid_till: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], items: estimates.map(e => ({ item_code: e.itemCode || 'General Item', qty: Number(e.qty) || 1, rate: Number(e.cost) / (Number(e.qty) || 1), description: e.comment || e.name || 'Estimate Item' })) };
// //     if (erpnextConfig?.url) {
// //       try {
// //         const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': getCsrfToken() }, body: JSON.stringify(payload) });
// //         if (res.ok) { const json = await res.json(); showToast(`Quotation ${json.data?.name || ''} generated!`, 'success'); }
// //         else showToast('Failed to generate Quotation.', 'error');
// //       } catch (e) { showToast('Error generating quotation.', 'error'); }
// //     } else { showToast(`Simulation: Quotation for ${customerId} with ${estimates.length} items.`, 'info'); }
// //   };
// //   /* ---------- Helper components ---------- */

// //   function Section({ title, children }) {
// //     return (
// //       <div
// //         style={{
// //           border: "1px solid var(--border-color)",
// //           borderRadius: 6,
// //           padding: 10,
// //         }}
// //       >
// //         <div
// //           style={{
// //             fontSize: 10.5,
// //             fontWeight: 700,
// //             letterSpacing: 0.3,
// //             textTransform: "uppercase",
// //             color: "var(--text-secondary)",
// //             marginBottom: 8,
// //           }}
// //         >
// //           {title}
// //         </div>
// //         <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{children}</div>
// //       </div>
// //     );
// //   }

// //   function AssignSelect({ label, value, onChange, options, placeholder }) {
// //     return (
// //       <div>
// //         <label
// //           style={{
// //             fontSize: 10,
// //             display: "block",
// //             color: "var(--text-secondary)",
// //             marginBottom: 4,
// //           }}
// //         >
// //           {label}
// //         </label>
// //         <select
// //           value={value}
// //           onChange={(e) => onChange(e.target.value)}
// //           className="form-select"
// //           style={{ padding: "5px 8px", fontSize: 11.5, width: "100%" }}
// //         >
// //           <option value="">{placeholder}</option>
// //           {options.map((o) => (
// //             <option key={o.id} value={o.name}>
// //               {o.name}
// //             </option>
// //           ))}
// //         </select>
// //         {value && (
// //           <span
// //             className="badge"
// //             style={{
// //               display: "inline-block",
// //               marginTop: 5,
// //               fontSize: 9.5,
// //               padding: "1px 7px",
// //               background: "var(--bg-tertiary)",
// //               border: "1px solid var(--border-color)",
// //               borderRadius: 999,
// //             }}
// //           >
// //             → {value}
// //           </span>
// //         )}
// //       </div>
// //     );
// //   }



// //   /**
// //    * Renders existing assignment rows as removable pills, plus a select
// //    * to add a new assignee from the directory. Matches the Frappe child-table
// //    * shape: rows = [{ name, ...meta }], directory = [{ id, name }] of options
// //    * not yet assigned. The row's display label is resolved from `directory`
// //    * by id since the raw child-table rows don't carry a name field themselves.
// //    */
// //   function AssignList({ rows, directory, onAdd, onRemove, placeholder }) {
// //     const assignedIds = rows.map((r) => r.employee || r.vendor || r.name);
// //     const available = directory.filter((d) => !assignedIds.includes(d.id));

// //     return (
// //       <div>
// //         <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: rows.length ? 8 : 0 }}>
// //           {rows.map((r) => {
// //             const match = directory.find(
// //               (d) => d.id === (r.employee || r.vendor || r.name)
// //             );
// //             const label = match ? match.name : r.employee || r.vendor || r.name;
// //             return (
// //               <span
// //                 key={r.name}
// //                 className="badge"
// //                 style={{
// //                   display: "inline-flex",
// //                   alignItems: "center",
// //                   gap: 5,
// //                   fontSize: 10.5,
// //                   padding: "3px 6px 3px 9px",
// //                   background: "var(--bg-tertiary)",
// //                   border: "1px solid var(--border-color)",
// //                   borderRadius: 999,
// //                 }}
// //               >
// //                 {label}
// //                 <button
// //                   onClick={() => onRemove(r.name)}
// //                   style={{
// //                     background: "transparent",
// //                     border: "none",
// //                     cursor: "pointer",
// //                     display: "flex",
// //                     padding: 0,
// //                     lineHeight: 0,
// //                   }}
// //                 >
// //                   <X size={10} />
// //                 </button>
// //               </span>
// //             );
// //           })}
// //           {rows.length === 0 && (
// //             <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>None assigned yet.</span>
// //           )}
// //         </div>

// //         <select
// //           value=""
// //           onChange={(e) => {
// //             if (e.target.value) onAdd(e.target.value);
// //           }}
// //           className="form-select"
// //           style={{ padding: "5px 8px", fontSize: 11.5, width: "100%" }}
// //         >
// //           <option value="">{placeholder}</option>
// //           {available.map((d) => (
// //             <option key={d.id} value={d.id}>
// //               {d.name}
// //             </option>
// //           ))}
// //         </select>
// //       </div>
// //     );
// //   }


// //   const filteredSchedules = localSchedules.filter(sch => {
// //     const term = maintenanceSearch.toLowerCase();
// //     const propName = getPropertyNameById(sch.custom_property) || '';
// //     return sch.name.toLowerCase().includes(term) || (sch.customer_name || sch.customer || '').toLowerCase().includes(term) || propName.toLowerCase().includes(term) || (sch.type || '').toLowerCase().includes(term);
// //   });

// //   const thStyle = { padding: '8px 10px', textAlign: 'left', fontWeight: 600, fontSize: 11, color: 'var(--text-secondary, #6b7280)', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' };
// //   const inputStyle = { width: '100%', fontSize: 12, minHeight: 32, padding: '5px 8px', boxSizing: 'border-box' };

// //   // helper: is schedule already submitted (docstatus=1 or status Submitted)
// //   const isScheduleSubmitted = (sch) => sch && (sch.docstatus === 1 || (sch.status || '').toLowerCase() === 'submitted');

// //   return (
// //     <div>
// //       {/* Toast */}
// //       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

// //       <div className="view-header" style={{ flexWrap: 'wrap', gap: 16 }}>
// //         <div>
// //           <h1 className="view-title">Maintenance Ops & Facility management</h1>
// //           <p className="view-subtitle">Roster preventative maintenance visits, manage work orders, assign tasks, and track logs.</p>
// //         </div>
// //         <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: 4, borderRadius: 8, border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
// //           {[['schedule', 'Maintenance Schedule'], ['task', 'Task Operations'], ['technician', 'Technicians'], ['vendor', 'Vendors'], ['asset', 'Assets']].map(([key, label], i) => (
// //             <button key={key} className={`btn btn-sm ${activeSection === key ? 'btn-primary' : 'btn-secondary'}`} style={{ marginLeft: i > 0 ? 4 : 0 }} onClick={() => setActiveSection(key)}>{label}</button>
// //           ))}
// //         </div>
// //       </div>

// //       {/* ── SECTION 1: MAINTENANCE SCHEDULES ── */}
// //       {activeSection === 'schedule' && (
// //         <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
// //           <div className="card-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', flexWrap: 'wrap', gap: 10 }}>
// //             <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
// //               <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
// //                 <Search size={16} />
// //                 <input type="text" placeholder="Search schedules..." className="form-input" style={{ width: 200, padding: '4px 10px' }} value={maintenanceSearch} onChange={(e) => setMaintenanceSearch(e.target.value)} />
// //               </div>
// //               <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: 2, borderRadius: 6 }}>
// //                 {['list', 'kanban', 'calendar'].map(mode => (
// //                   <button key={mode} className={`btn btn-sm ${viewMode === mode ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 8px', fontSize: 10, textTransform: 'capitalize' }} onClick={() => setViewMode(mode)}>{mode}</button>
// //                 ))}
// //               </div>
// //             </div>
// //             <button className="btn btn-primary btn-sm" onClick={() => setShowScheduleModal(true)}><Plus size={14} /> New Schedule</button>
// //           </div>

// //           <div className="grid-2col" style={{ gridTemplateColumns: selectedSchedule ? '60% calc(40% - 24px)' : '1fr', gap: 24 }}>
// //             {viewMode === 'list' && (
// //               <div className="card-panel" style={{ padding: 0 }}>
// //                 <div className="table-container">
// //                   <table className="custom-table">
// //                     <thead><tr><th>Schedule ID</th><th>Type</th><th>Tenant / Partner</th><th>Property Group</th><th>Periodicity</th><th>Status</th></tr></thead>
// //                     <tbody>
// //                       {filteredSchedules.map(sch => {
// //                         const firstItem = sch.items?.[0];
// //                         return (
// //                           <tr key={sch.name} onClick={() => setSelectedSchedule(sch)} style={{ cursor: 'pointer', backgroundColor: selectedSchedule?.name === sch.name ? 'var(--bg-accent-alpha)' : '' }}>
// //                             <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{sch.name}</td>
// //                             <td><span className="badge badge-secondary" style={{ textTransform: 'none' }}>{sch.type || 'PM Schedule'}</span></td>
// //                             <td>{sch.customer_name || sch.customer}</td>
// //                             <td>{getPropertyNameById(sch.custom_property)}</td>
// //                             <td>{firstItem ? firstItem.periodicity : '—'}</td>
// //                             <td><span className={`badge ${sch.status === 'Completed' ? 'badge-success' : isScheduleSubmitted(sch) ? 'badge-info' : 'badge-warning'}`}>{sch.status || 'Draft'}</span></td>
// //                           </tr>
// //                         );
// //                       })}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               </div>
// //             )}

// //             {viewMode === 'kanban' && (
// //               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
// //                 {['Pending', 'In Progress', 'Completed'].map(status => {
// //                   const statusSchedules = filteredSchedules.filter(s => {
// //                     const raw = (s.status || '').toLowerCase();
// //                     let norm = 'Pending';
// //                     if (raw === 'completed' || raw === 'closed') norm = 'Completed';
// //                     else if (raw === 'in progress' || raw === 'submitted') norm = 'In Progress';
// //                     return norm === status;
// //                   });
// //                   return (
// //                     <div key={status} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, status)} style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 8, minHeight: 300 }}>
// //                       <h3 style={{ fontSize: 13, marginBottom: 10, borderBottom: '2px solid var(--border-color)', paddingBottom: 6 }}>{status} ({statusSchedules.length})</h3>
// //                       <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
// //                         {statusSchedules.map(sch => (
// //                           <div key={sch.name} draggable onDragStart={(e) => handleDragStart(e, sch.name)} onClick={() => setSelectedSchedule(sch)} style={{ background: 'var(--bg-secondary)', padding: 10, borderRadius: 6, border: '1px solid var(--border-color)', cursor: 'grab' }}>
// //                             <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-color)' }}>{sch.name}</div>
// //                             <div style={{ fontSize: 12, fontWeight: 600 }}>{sch.customer_name || sch.customer}</div>
// //                             <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Property: {getPropertyNameById(sch.custom_property)}</div>
// //                             <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>Type: {sch.type}</div>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             )}

// //             {viewMode === 'calendar' && (
// //               <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
// //                 <div className="card-panel" style={{ padding: 20 }}>
// //                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
// //                     <h3 style={{ fontSize: 14, margin: 0 }}>{new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
// //                     <div style={{ display: 'flex', gap: 8 }}>
// //                       <button className="btn btn-secondary btn-xs" onClick={() => { if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); } else setCalendarMonth(m => m - 1); }}>Prev</button>
// //                       <button className="btn btn-secondary btn-xs" onClick={() => { if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); } else setCalendarMonth(m => m + 1); }}>Next</button>
// //                     </div>
// //                   </div>
// //                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center', fontWeight: 600, fontSize: 11, marginBottom: 8, color: 'var(--text-secondary)' }}>
// //                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
// //                   </div>
// //                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
// //                     {(() => {
// //                       const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
// //                       const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
// //                       const cells = [];
// //                       for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} style={{ height: 50 }} />);
// //                       for (let day = 1; day <= totalDays; day++) {
// //                         const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
// //                         const daySchedules = filteredSchedules.filter(s => s.transaction_date === dateStr);
// //                         const isSelected = selectedDateStr === dateStr;
// //                         const isToday = calendarYear === 2026 && calendarMonth === 5 && day === 17;
// //                         cells.push(
// //                           <div key={`d-${day}`} onClick={() => setSelectedDateStr(dateStr)} style={{ height: 50, border: `1px solid ${isSelected ? 'var(--brand-color)' : 'var(--border-color)'}`, borderRadius: 4, background: isSelected ? 'var(--bg-accent-alpha)' : isToday ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', padding: 4, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.15s ease' }}>
// //                             <span style={{ fontSize: 10, fontWeight: isToday || isSelected ? 700 : 400 }}>{day}</span>
// //                             {daySchedules.length > 0 && <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>{daySchedules.map(s => <span key={s.name} style={{ width: 6, height: 6, borderRadius: '50%', background: s.status === 'Completed' ? '#10b981' : '#f59e0b', display: 'inline-block' }} />)}</div>}
// //                           </div>
// //                         );
// //                       }
// //                       return cells;
// //                     })()}
// //                   </div>
// //                 </div>
// //                 <div className="card-panel" style={{ padding: 16 }}>
// //                   <h4 style={{ fontSize: 12, marginBottom: 10, color: 'var(--text-secondary)' }}>Schedules for: <strong>{selectedDateStr}</strong></h4>
// //                   {(() => {
// //                     const daySchedules = filteredSchedules.filter(s => s.transaction_date === selectedDateStr);
// //                     if (daySchedules.length === 0) return <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>No schedules planned for this day.</div>;
// //                     return <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{daySchedules.map(sch => <div key={sch.name} onClick={() => setSelectedSchedule(sch)} style={{ padding: 10, background: 'var(--bg-tertiary)', borderLeft: '4px solid var(--brand-color)', borderRadius: 4, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><strong style={{ fontSize: 12 }}>{sch.name} ({sch.type})</strong><div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Tenant: {sch.customer_name || sch.customer} | Prop: {getPropertyNameById(sch.custom_property)}</div></div><span className={`badge ${sch.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>{sch.status || 'Pending'}</span></div>)}</div>;
// //                   })()}
// //                 </div>
// //               </div>
// //             )}

// //             {/* ── Schedule detail panel ── */}
// //             {selectedSchedule && (
// //               <div className="card-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
// //                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
// //                   <strong>{selectedSchedule.name}</strong>
// //                   <button onClick={() => setSelectedSchedule(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
// //                 </div>
// //                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
// //                   <div>Type: <strong>{selectedSchedule.type || '—'}</strong></div>
// //                   <div>Property: <strong>{getPropertyNameById(selectedSchedule.custom_property)}</strong></div>
// //                   <div>Tenant: <strong>{selectedSchedule.customer_name || selectedSchedule.customer}</strong></div>
// //                   <div>Date: <strong>{selectedSchedule.transaction_date}</strong></div>
// //                   <div>Status: <span className={`badge ${isScheduleSubmitted(selectedSchedule) ? 'badge-info' : 'badge-warning'}`}>{selectedSchedule.status || 'Draft'}</span></div>
// //                 </div>

// //                 {/* Only show "Submit Work Order" when NOT yet submitted */}
// //                 {!isScheduleSubmitted(selectedSchedule) ? (
// //                   <button
// //                     className="btn btn-primary btn-sm"
// //                     style={{ marginTop: 10, width: '100%', background: '#ffdd00', color: '#000', fontWeight: 700 }}
// //                     onClick={() => { setWoAssignedEmployees([]); setShowWOModal(true); }}
// //                   >
// //                     <Hammer size={14} style={{ marginRight: 6 }} /> Assign Task
// //                   </button>
// //                 ) : (
// //                   <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(16,185,129,0.08)', borderRadius: 6, fontSize: 12, color: '#10b981', textAlign: 'center', fontWeight: 600 }}>
// //                     ✓ Task Assigned
// //                   </div>
// //                 )}
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}

// //       {/* ── SECTION 2: WORK ORDERS ── */}
// //       {activeSection === 'task' && (
// //         <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
// //           <div className="card-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' }}>
// //             <span style={{ fontSize: 14, fontWeight: 700 }}>Maintenance Task list</span>
// //           </div>
// //           <div className="grid-2col" style={{ gridTemplateColumns: selectedWorkOrder ? '60% calc(40% - 24px)' : '1fr', gap: 24 }}>
// //             <div className="card-panel" style={{ padding: 0 }}>
// //               <div className="table-container">
// //                 <table className="custom-table">
// //                   <thead><tr><th>ID</th><th>Property</th><th>Category</th><th>Estimated Cost</th><th>Status</th></tr></thead>
// //                   <tbody>
// //                     {workOrders.map(wo => (
// //                       <tr key={wo.id} onClick={async () => {
// //                         try {
// //                           // console.log()


// //                           const res = await fetch(
// //                             `${erpnextConfig.url}/api/resource/Task/${wo.id}`,
// //                             {
// //                               credentials: "include",
// //                               headers: {
// //                                 "Content-Type": "application/json",
// //                               },
// //                             }
// //                           );

// //                           // const res = await fetch(`${erpnextConfig.url}/api/resource/Task?fields=%5B%22name%22%2C%22subject%22%2C%22status%22%2C%22description%22%2C%22priority%22%2C%22exp_start_date%22%2C%22exp_end_date%22%5D&limit_page_length=200`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } });
// //                           // console.log(res)
// //                           if (res.ok) {
// //                             const json = await res.json();
// //                             console.log("jsonoonn", json)
// //                             setSelectedWorkOrder(json.data)

// //                           }

// //                         }
// //                         catch (err) {
// //                           console.log(err)
// //                           setSelectedWorkOrder(wo)

// //                         }
// //                       }

// //                       } style={{ cursor: 'pointer', backgroundColor: selectedWorkOrder?.id === wo.id ? 'var(--bg-accent-alpha)' : '' }}>
// //                         <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{wo.id}</td>
// //                         <td>{wo.property}</td><td>{wo.category}</td>
// //                         <td>${wo.estCost.toLocaleString()}</td>
// //                         <td><span className={`badge ${wo.status === 'Completed' ? 'badge-success' : wo.status === 'Pending Approval' ? 'badge-warning' : 'badge-info'}`}>{wo.status}</span></td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //             {/* orkorderdetail · JSX */}
// //             {selectedWorkOrder && (
// //               <div
// //                 className="card-panel"
// //                 style={{
// //                   padding: 14,
// //                   display: "flex",
// //                   flexDirection: "column",
// //                   gap: 10,
// //                   maxHeight: "calc(100vh - 160px)",
// //                   overflowY: "auto",
// //                   fontSize: 12,
// //                 }}
// //               >
// //                 {/* Header */}
// //                 <div
// //                   style={{
// //                     display: "flex",
// //                     justifyContent: "space-between",
// //                     alignItems: "flex-start",
// //                     borderBottom: "1px solid var(--border-color)",
// //                     paddingBottom: 8,
// //                   }}
// //                 >
// //                   <div>
// //                     <strong style={{ fontSize: 14 }}>{selectedWorkOrder.name}</strong>
// //                     <div style={{ color: "var(--text-secondary)", marginTop: 2, fontSize: 11 }}>
// //                       {selectedWorkOrder.subject}
// //                     </div>
// //                   </div>
// //                   <button
// //                     onClick={() => setSelectedWorkOrder(null)}
// //                     style={{ background: "transparent", border: "none", cursor: "pointer", padding: 2 }}
// //                   >
// //                     <X size={15} />
// //                   </button>
// //                 </div>

// //                 {/* Status Row */}
// //                 <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
// //                   <span className="badge badge-info" style={{ fontSize: 10, padding: "2px 8px" }}>
// //                     {selectedWorkOrder.status}
// //                   </span>
// //                   <span className="badge badge-warning" style={{ fontSize: 10, padding: "2px 8px" }}>
// //                     {selectedWorkOrder.priority}
// //                   </span>
// //                   <span className="badge badge-success" style={{ fontSize: 10, padding: "2px 8px" }}>
// //                     {selectedWorkOrder.progress || 0}% Complete
// //                   </span>
// //                 </div>

// //                 {/* Reference info */}
// //                 <Section title="Reference">
// //                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
// //                     <Info title="Schedule" value={selectedWorkOrder.custom_mantainence_sechedule} />
// //                     <Info title="Booking" value={selectedWorkOrder.custom_booking_number} />
// //                     <Info title="Customer" value={selectedWorkOrder.custom_customer_name} />
// //                     <Info title="Company" value={selectedWorkOrder.company} />
// //                     <Info title="Created" value={selectedWorkOrder.creation?.split(".")[0]} />
// //                     <Info title="Owner" value={selectedWorkOrder.owner} />
// //                   </div>
// //                 </Section>

// //                 {/* Cost */}
// //                 <Section title="Cost">
// //                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
// //                     <Info
// //                       title="Costing"
// //                       value={`$${Number(selectedWorkOrder.total_costing_amount || 0).toLocaleString()}`}
// //                     />
// //                     <Info
// //                       title="Billing"
// //                       value={`$${Number(selectedWorkOrder.total_billing_amount || 0).toLocaleString()}`}
// //                     />
// //                   </div>
// //                 </Section>

// //                 {/* Reassign — multi-assignee, assignable-style */}
// //                 <Section title="Assigned Employees">
// //                   <AssignList
// //                     rows={selectedWorkOrder.custom_assign_to_ || []}
// //                     directory={employeeDir}
// //                     onAdd={(emp) => handleAddAssignee("employee", emp)}
// //                     onRemove={(rowName) => handleRemoveAssignee("employee", rowName)}
// //                     placeholder="Add employee..."
// //                   />
// //                 </Section>

// //                 <Section title="Assigned Vendors">
// //                   <AssignList
// //                     rows={selectedWorkOrder.custom_assign_to_vendor || []}
// //                     directory={vendorDir}
// //                     onAdd={(v) => handleAddAssignee("vendor", v)}
// //                     onRemove={(rowName) => handleRemoveAssignee("vendor", rowName)}
// //                     placeholder="Add vendor..."
// //                   />
// //                 </Section>

// //                 {/* Action row */}
// //                 <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
// //                   <button
// //                     className="btn btn-secondary btn-sm"
// //                     style={{ flex: 1, fontSize: 11, padding: "6px 0" }}
// //                     onClick={() => handleResetAssignments(selectedWorkOrder.name)}
// //                   >
// //                     Reset
// //                   </button>
// //                   <button
// //                     className="btn btn-primary btn-sm"
// //                     style={{ flex: 2, fontSize: 11, padding: "6px 0" }}
// //                     onClick={() => handleSaveAssignments(selectedWorkOrder.name)}
// //                   >
// //                     Save Assignment
// //                   </button>
// //                 </div>
// //               </div>
// //             )}

// //           </div>
// //         </div>
// //       )
// //       }

// //       {/* ── SECTION 3: TECHNICIANS ── */}
// //       {
// //         activeSection === 'technician' && (
// //           <div className="grid-2col" style={{ gridTemplateColumns: selectedTechnician ? '60% calc(40% - 24px)' : '1fr', gap: 24 }}>
// //             <div className="card-panel">
// //               <h3 style={{ fontSize: 15, marginBottom: 14 }}>Active Technicians Directory</h3>
// //               <div className="table-container">
// //                 <table className="custom-table">
// //                   <thead><tr><th>Tech Name</th><th>Skill Category</th><th>Certifications</th><th>Availability</th></tr></thead>
// //                   <tbody>{techProfiles.map(tech => <tr key={tech.id} onClick={() => setSelectedTechnician(tech)} style={{ cursor: 'pointer', backgroundColor: selectedTechnician?.id === tech.id ? 'var(--bg-accent-alpha)' : '' }}><td><strong>{tech.name}</strong></td><td>{tech.skill}</td><td>{tech.certs}</td><td><span className={`badge ${tech.availability === 'Available' ? 'badge-success' : 'badge-warning'}`}>{tech.availability}</span></td></tr>)}</tbody>
// //                 </table>
// //               </div>
// //             </div>
// //             {selectedTechnician && (
// //               <div className="card-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
// //                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}><strong>{selectedTechnician.name} Details</strong><button onClick={() => setSelectedTechnician(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button></div>
// //                 <div style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8 }}>
// //                   <img src={selectedTechnician.img} alt={selectedTechnician.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-color)' }} />
// //                   <div><h4 style={{ fontSize: 14, margin: 0 }}>{selectedTechnician.name}</h4><span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Skill: {selectedTechnician.skill}</span></div>
// //                 </div>
// //                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
// //                   <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Award size={14} /> Certs: {selectedTechnician.certs}</div>
// //                   <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={14} /> Phone: {selectedTechnician.phone}</div>
// //                   <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={14} /> Email: {selectedTechnician.email}</div>
// //                   <div>Status: <span className="badge badge-success">{selectedTechnician.availability}</span></div>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         )
// //       }

// //       {/* ── SECTION 4: VENDORS ── */}
// //       {
// //         activeSection === 'vendor' && (
// //           <div className="grid-2col" style={{ gridTemplateColumns: selectedVendor ? '60% calc(40% - 24px)' : '1fr', gap: 24 }}>
// //             <div className="card-panel">
// //               <h3 style={{ fontSize: 15, marginBottom: 14 }}>Vendor Directory & Quotations Log</h3>
// //               <div className="table-container">
// //                 <table className="custom-table">
// //                   <thead><tr><th>Vendor ID</th><th>Vendor Name</th><th>Service Category</th><th>Rating</th></tr></thead>
// //                   <tbody>{vendorDir.map(v => <tr key={v.id} onClick={() => setSelectedVendor(v)} style={{ cursor: 'pointer', backgroundColor: selectedVendor?.id === v.id ? 'var(--bg-accent-alpha)' : '' }}><td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{v.id}</td><td>{v.name}</td><td>{v.type}</td><td>⭐ {v.rating}</td></tr>)}</tbody>
// //                 </table>
// //               </div>
// //             </div>
// //             {selectedVendor && (
// //               <div className="card-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
// //                 <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}><strong>{selectedVendor.name} Details</strong><button onClick={() => setSelectedVendor(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button></div>
// //                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
// //                   <div>Vendor Group: <strong>{selectedVendor.group}</strong></div><div>Category Type: <strong>{selectedVendor.type}</strong></div>
// //                   <div>Phone: <strong>{selectedVendor.phone}</strong></div><div>Email: <strong>{selectedVendor.email}</strong></div>
// //                   <div>Address: <strong>{selectedVendor.address}</strong></div>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         )
// //       }

// //       {/* ── SECTION 5: ASSETS ── */}
// //       {
// //         activeSection === 'asset' && (
// //           <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
// //             <div className="card-panel">
// //               <h3 style={{ fontSize: 15, marginBottom: 14 }}>Assets Warranty & AMC Management</h3>
// //               <div className="table-container">
// //                 <table className="custom-table">
// //                   <thead><tr><th>Asset ID</th><th>Asset Name</th><th>Property Name</th><th>Warranty Expiry</th><th>AMC status</th><th>Breakdowns YTD</th></tr></thead>
// //                   <tbody>{assetsList.map(a => <tr key={a.id}><td style={{ fontWeight: 600 }}>{a.id}</td><td>{a.name}</td><td><strong>{getPropertyNameById(a.propertyId)}</strong></td><td>{a.warranty}</td><td>Active Contract ({a.amc})</td><td><span className="badge badge-success">{a.breakdownCount} breakdowns</span></td></tr>)}</tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           </div>
// //         )
// //       }

// //       {/* ── CREATE MAINTENANCE SCHEDULE MODAL ── */}
// //       {
// //         showScheduleModal && (
// //           <div className="modal-overlay">
// //             <div className="modal-content" style={{ maxWidth: 740, width: '96vw', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
// //               <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
// //                 <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Create Maintenance Schedule</h3>
// //                 <button onClick={() => setShowScheduleModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 0 }}>×</button>
// //               </div>
// //               <form onSubmit={handleCreateScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
// //                 <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '20px', overflowY: 'auto', flex: 1 }}>
// //                   {scheduleStatusMessage && (
// //                     <div style={{ background: scheduleStatusMessage.type === 'success' ? 'rgba(6,95,70,0.1)' : 'rgba(239,68,68,0.1)', color: scheduleStatusMessage.type === 'success' ? '#10b981' : '#ef4444', padding: '10px 12px', borderRadius: 6, fontSize: 12 }}>
// //                       {scheduleStatusMessage.text}
// //                     </div>
// //                   )}
// //                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
// //                     <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
// //                       <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Customer <span style={{ color: '#ef4444' }}>*</span></label>
// //                       <select value={schedCustomer} onChange={(e) => setSchedCustomer(e.target.value)} className="form-select" required disabled={submittingSchedule} style={{ fontSize: 13, height: 36, boxSizing: 'border-box' }}>
// //                         <option value="">-- Choose Customer --</option>
// //                         {(tenants || []).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
// //                       </select>
// //                     </div>
// //                     <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
// //                       <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Transaction Date <span style={{ color: '#ef4444' }}>*</span></label>
// //                       <input type="date" value={schedTransDate} onChange={(e) => setSchedTransDate(e.target.value)} className="form-input" required disabled={submittingSchedule} style={{ fontSize: 13, height: 36, boxSizing: 'border-box' }} />
// //                     </div>
// //                   </div>
// //                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
// //                     <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
// //                       <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Booking ID</label>
// //                       <select value={schedBookingId} onChange={(e) => setSchedBookingId(e.target.value)} className="form-select" disabled={submittingSchedule} style={{ fontSize: 13, height: 36, boxSizing: 'border-box' }}>
// //                         <option value="">-- Choose Booking --</option>
// //                         {bookings.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
// //                       </select>
// //                     </div>
// //                     <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
// //                       <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Property</label>
// //                       <select value={schedProperty} onChange={(e) => setSchedProperty(e.target.value)} className="form-select" disabled={submittingSchedule} style={{ fontSize: 13, height: 36, boxSizing: 'border-box' }}>
// //                         <option value="">-- Choose Property --</option>
// //                         {(properties || []).map(p => <option key={p.id || p.name} value={p.id || p.name}>{p.name}</option>)}
// //                       </select>
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
// //                       <label style={{ margin: 0, fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Items <span style={{ color: '#ef4444' }}>*</span></label>
// //                       <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSchedItems(prev => [...prev, { itemCode: '', itemName: '', startDate: schedTransDate || '', periodicity: 'Weekly', noOfVisits: 1, endDate: '' }])} style={{ padding: '4px 12px', fontSize: 11 }}>+ Add Row</button>
// //                     </div>
// //                     <div style={{ border: '1px solid var(--border-color)', borderRadius: 6, overflow: 'hidden' }}>
// //                       <div style={{ overflowX: 'auto', maxHeight: 280, overflowY: 'auto' }}>
// //                         <table style={{ width: '100%', minWidth: 680, borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: 12 }}>
// //                           <colgroup><col style={{ width: 34 }} /><col style={{ width: 150 }} /><col style={{ width: 120 }} /><col style={{ width: 106 }} /><col style={{ width: 110 }} /><col style={{ width: 70 }} /><col style={{ width: 106 }} /><col style={{ width: 34 }} /></colgroup>
// //                           <thead>
// //                             <tr style={{ background: 'var(--bg-secondary, rgba(0,0,0,0.03))', position: 'sticky', top: 0, zIndex: 1 }}>
// //                               {['#', 'Item Code', 'Item Name', 'Start Date', 'Periodicity', 'No. of Visits', 'End Date', ''].map((h, i) => <th key={i} style={thStyle}>{h}</th>)}
// //                             </tr>
// //                           </thead>
// //                           <tbody>
// //                             {schedItems.map((row, idx) => (
// //                               <tr key={idx} style={{ borderBottom: idx < schedItems.length - 1 ? '1px solid var(--border-color)' : 'none', background: idx % 2 === 0 ? 'transparent' : 'var(--bg-secondary, rgba(0,0,0,0.015))' }}>
// //                                 <td style={{ padding: '7px 10px', color: 'var(--text-muted, #9ca3af)', fontSize: 11 }}>{idx + 1}</td>
// //                                 <td style={{ padding: '5px 6px' }}>
// //                                   <select value={row.itemCode} onChange={(e) => handleSchedItemCodeChange(idx, e.target.value)} className="form-select" required style={inputStyle}>
// //                                     <option value="">-- Item --</option>
// //                                     {schedUnits.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
// //                                   </select>
// //                                 </td>
// //                                 <td style={{ padding: '7px 8px', color: 'var(--text-secondary, #6b7280)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.itemName || (row.itemCode ? '…' : '—')}</td>
// //                                 <td style={{ padding: '5px 6px' }}><input type="date" value={row.startDate} onChange={(e) => setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, startDate: e.target.value } : r))} className="form-input" required style={inputStyle} /></td>
// //                                 <td style={{ padding: '5px 6px' }}>
// //                                   <select value={row.periodicity} onChange={(e) => setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, periodicity: e.target.value } : r))} className="form-select" required style={inputStyle}>
// //                                     <option value="">Select</option>
// //                                     <option value="Weekly">Weekly</option>
// //                                     <option value="Monthly">Monthly</option>
// //                                     <option value="Quarterly">Quarterly</option>
// //                                     <option value="Half Yearly">Half Yearly</option>
// //                                     <option value="Yearly">Yearly</option>
// //                                     <option value="Random">Random</option>
// //                                   </select>
// //                                 </td>
// //                                 <td style={{ padding: '5px 6px' }}><input type="number" min="1" value={row.noOfVisits} onChange={(e) => setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, noOfVisits: e.target.value } : r))} className="form-input" required style={{ ...inputStyle, textAlign: 'center' }} /></td>
// //                                 <td style={{ padding: '5px 6px' }}><input type="date" value={row.endDate} onChange={(e) => setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, endDate: e.target.value } : r))} className="form-input" required style={inputStyle} /></td>
// //                                 <td style={{ padding: '5px 4px', textAlign: 'center' }}>
// //                                   {schedItems.length > 1 && <button type="button" onClick={() => setSchedItems(prev => prev.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: 'var(--color-danger, #ef4444)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px 4px' }}><Trash size={13} /></button>}
// //                                 </td>
// //                               </tr>
// //                             ))}
// //                           </tbody>
// //                         </table>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 20px', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
// //                   <button type="button" className="btn btn-secondary" onClick={() => setShowScheduleModal(false)} disabled={submittingSchedule}>Cancel</button>
// //                   <button type="submit" className="btn btn-primary" disabled={submittingSchedule}>{submittingSchedule ? 'Creating...' : 'Create Maintenance Schedule'}</button>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>
// //         )
// //       }

// //       {/* ── SUBMIT WORK ORDER MODAL (employee assignment) ── */}
// //       {
// //         showWOModal && selectedSchedule && (
// //           <div className="modal-overlay">
// //             <div className="modal-content" style={{ maxWidth: 440, width: '92vw' }}>
// //               <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-color)' }}>
// //                 <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Submit Task</h3>
// //                 <button onClick={() => setShowWOModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
// //               </div>
// //               <div className="modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
// //                 {/* Schedule summary */}
// //                 <div style={{ background: 'var(--bg-tertiary)', borderRadius: 6, padding: '10px 12px', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
// //                   <div><span style={{ color: 'var(--text-secondary)' }}>Schedule: </span><strong>{selectedSchedule.name}</strong></div>
// //                   <div><span style={{ color: 'var(--text-secondary)' }}>Customer: </span><strong>{selectedSchedule.customer_name || selectedSchedule.customer}</strong></div>
// //                   <div><span style={{ color: 'var(--text-secondary)' }}>Property: </span><strong>{getPropertyNameById(selectedSchedule.custom_property)}</strong></div>
// //                 </div>

// //                 {/* Employee multi-select */}
// //                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
// //                   <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
// //                     Assign Employees <span style={{ color: '#ef4444' }}>*</span>
// //                     <span style={{ fontWeight: 400, marginLeft: 6, color: 'var(--text-muted)', fontSize: 11 }}>(select one or more)</span>
// //                   </label>

// //                   {employees.length > 0 ? (
// //                     <div style={{ border: '1px solid var(--border-color)', borderRadius: 6, maxHeight: 200, overflowY: 'auto', background: 'var(--bg-secondary)' }}>
// //                       {employees.map((emp) => {
// //                         const empId = emp.id || emp.name;
// //                         const isChecked = woAssignedEmployees.includes(empId);
// //                         return (
// //                           <label
// //                             key={empId}
// //                             style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', background: isChecked ? 'var(--bg-accent-alpha)' : 'transparent', transition: 'background 0.1s' }}
// //                           >
// //                             <input
// //                               type="checkbox"
// //                               checked={isChecked}
// //                               onChange={() => {
// //                                 setWoAssignedEmployees(prev =>
// //                                   isChecked ? prev.filter(id => id !== empId) : [...prev, empId]
// //                                 );
// //                               }}
// //                               style={{ width: 15, height: 15, accentColor: 'var(--brand-color)', cursor: 'pointer', flexShrink: 0 }}
// //                             />
// //                             <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
// //                               <span style={{ fontSize: 13, fontWeight: 500 }}>{emp.name}</span>
// //                               {(emp.department || emp.designation) && (
// //                                 <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{emp.designation || ''}{emp.department ? ` · ${emp.department}` : ''}</span>
// //                               )}
// //                             </div>
// //                           </label>
// //                         );
// //                       })}
// //                     </div>
// //                   ) : (
// //                     <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
// //                       No employees available. Add employees to the system first.
// //                     </div>
// //                   )}

// //                   {woAssignedEmployees.length > 0 && (
// //                     <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
// //                       {woAssignedEmployees.length} employee{woAssignedEmployees.length > 1 ? 's' : ''} selected
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //               <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 20px', borderTop: '1px solid var(--border-color)' }}>
// //                 <button type="button" className="btn btn-secondary" onClick={() => setShowWOModal(false)} disabled={woSubmitting}>Cancel</button>
// //                 <button
// //                   type="button"
// //                   className="btn btn-primary"
// //                   onClick={handleSubmitWorkOrder}
// //                   disabled={woSubmitting || woAssignedEmployees.length === 0}
// //                 >
// //                   {woSubmitting ? 'Submitting…' : 'Confirm & Submit'}
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )
// //       }

// //       {/* ── ITEM CONSUMPTION MODAL ── */}
// //       {
// //         showConsumeModal && (
// //           <div className="modal-overlay">
// //             <div className="modal-content" style={{ maxWidth: 500, width: '90%' }}>
// //               <div className="modal-header"><h3>Deduct Stock & Consume Part</h3><button onClick={() => setShowConsumeModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button></div>
// //               <form onSubmit={handleConsumeItemSubmit}>
// //                 <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
// //                   {consumeItemsList.map((entry, idx) => (
// //                     <div key={idx} style={{ border: '1px solid var(--border-color)', padding: 10, borderRadius: 6, position: 'relative', background: 'var(--bg-tertiary)' }}>
// //                       {consumeItemsList.length > 1 && <button type="button" onClick={() => setConsumeItemsList(prev => prev.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: 6, right: 6, background: 'none', border: 'none', color: 'var(--text-danger)', fontSize: 14, cursor: 'pointer' }}>Remove</button>}
// //                       <div className="form-group" style={{ marginBottom: 8 }}><label className="form-label" style={{ fontSize: 11 }}>Select Stock Item</label><select value={entry.itemCode} onChange={(e) => setConsumeItemsList(prev => prev.map((item, i) => i === idx ? { ...item, itemCode: e.target.value } : item))} className="form-select" required><option value="">-- Select Item --</option>{stockItems.map(s => <option key={s.code} value={s.code}>{s.name} (Qty: {s.qty} - ${s.unitCost}/ea)</option>)}</select></div>
// //                       <div className="grid-2col" style={{ gap: 8, gridTemplateColumns: '1fr 2fr' }}>
// //                         <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label" style={{ fontSize: 11 }}>Qty</label><input type="number" value={entry.qty} onChange={(e) => setConsumeItemsList(prev => prev.map((item, i) => i === idx ? { ...item, qty: Number(e.target.value) } : item))} className="form-input" min="1" required /></div>
// //                         <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label" style={{ fontSize: 11 }}>Comment</label><input type="text" value={entry.comment} onChange={(e) => setConsumeItemsList(prev => prev.map((item, i) => i === idx ? { ...item, comment: e.target.value } : item))} className="form-input" placeholder="Note on usage" /></div>
// //                       </div>
// //                     </div>
// //                   ))}
// //                   <button type="button" className="btn btn-secondary btn-sm" onClick={() => setConsumeItemsList(prev => [...prev, { itemCode: '', qty: 1, comment: '' }])} style={{ alignSelf: 'flex-start' }}>+ Add Another Item</button>
// //                 </div>
// //                 <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowConsumeModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Deduct & Record</button></div>
// //               </form>
// //             </div>
// //           </div>
// //         )
// //       }

// //       {/* ── ESTIMATE CREATION MODAL ── */}
// //       {
// //         showEstimateModal && (
// //           <div className="modal-overlay">
// //             <div className="modal-content" style={{ maxWidth: 450 }}>
// //               <div className="modal-header"><h3>Create Estimate Item</h3><button onClick={() => setShowEstimateModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button></div>
// //               <form onSubmit={handleAddEstimateSubmit}>
// //                 <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
// //                   <div className="form-group"><label className="form-label">Estimate Type</label><select value={estType} onChange={(e) => setEstType(e.target.value)} className="form-select"><option value="Material">Material</option><option value="Labour">Labour</option></select></div>
// //                   {estType === 'Material' ? (
// //                     <div className="form-group"><label className="form-label">Select Item</label><select value={estItemCode} onChange={(e) => setEstItemCode(e.target.value)} className="form-select" required><option value="">-- Choose Item --</option>{stockItems.map(s => <option key={s.code} value={s.code}>{s.name} (${s.unitCost}/ea)</option>)}</select></div>
// //                   ) : (
// //                     <div className="form-group"><label className="form-label">Labour Description</label><input type="text" value={estName} onChange={(e) => setEstName(e.target.value)} className="form-input" placeholder="e.g. Technician Labour" required /></div>
// //                   )}
// //                   <div className="grid-2col" style={{ gap: 12, gridTemplateColumns: '1fr 1fr' }}>
// //                     <div className="form-group"><label className="form-label">{estType === 'Material' ? 'Quantity' : 'Hours'}</label><input type="number" value={estQty} onChange={(e) => setEstQty(Number(e.target.value))} className="form-input" min="1" required /></div>
// //                     <div className="form-group"><label className="form-label">{estType === 'Material' ? 'Unit Cost' : 'Hourly Rate'}</label><input type="number" value={estCost} onChange={(e) => setEstCost(Number(e.target.value))} className="form-input" disabled={estType === 'Material'} placeholder={estType === 'Material' ? 'Auto-calculated' : 'e.g. 50'} required /></div>
// //                   </div>
// //                   <div className="form-group"><label className="form-label">Comments</label><input type="text" value={estComment} onChange={(e) => setEstComment(e.target.value)} className="form-input" placeholder="Notes on this estimate item" /></div>
// //                 </div>
// //                 <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowEstimateModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Add Item</button></div>
// //               </form>
// //             </div>
// //           </div>
// //         )
// //       }
// //     </div >
// //   );
// // }





// import React, { useState, useEffect, useCallback } from 'react';
// import { Hammer, User, Clock, CheckCircle, AlertTriangle, Plus, X, Calendar as CalendarIcon, List, BarChart3, ClipboardList, Building, Search, Activity, Settings, DollarSign, PenTool, Archive, Check, ArrowRight, UserCheck, ShieldCheck, Mail, Phone, MapPin, Award, Trash } from 'lucide-react';

// // ── Toast ────────────────────────────────────────────────────────────────────
// function Toast({ message, type, onClose }) {
//   useEffect(() => {
//     const t = setTimeout(onClose, 3500);
//     return () => clearTimeout(t);
//   }, [onClose]);

//   const bg = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
//   return (
//     <div style={{
//       position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
//       background: bg, color: '#fff', padding: '12px 18px',
//       borderRadius: 8, fontSize: 13, fontWeight: 500,
//       boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
//       display: 'flex', alignItems: 'center', gap: 10, maxWidth: 360,
//       animation: 'slideUp 0.25s ease'
//     }}>
//       <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
//       <span style={{ flex: 1 }}>{message}</span>
//       <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, fontSize: 16, lineHeight: 1 }}>×</button>
//     </div>
//   );
// }

// // ── Shared detail-panel helper components (module scope — defined once) ──────
// function Section({ title, children }) {
//   return (
//     <div
//       style={{
//         border: "1px solid var(--border-color)",
//         borderRadius: 6,
//         padding: 10,
//       }}
//     >
//       <div
//         style={{
//           fontSize: 10.5,
//           fontWeight: 700,
//           letterSpacing: 0.3,
//           textTransform: "uppercase",
//           color: "var(--text-secondary)",
//           marginBottom: 8,
//         }}
//       >
//         {title}
//       </div>
//       <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{children}</div>
//     </div>
//   );
// }

// function Info({ title, value }) {
//   return (
//     <div
//       style={{
//         background: "var(--bg-tertiary)",
//         borderRadius: 6,
//         padding: "10px 12px"
//       }}
//     >
//       <div
//         style={{
//           fontSize: 11,
//           color: "var(--text-secondary)",
//           marginBottom: 4
//         }}
//       >
//         {title}
//       </div>

//       <div
//         style={{
//           fontWeight: 600,
//           fontSize: 13
//         }}
//       >
//         {value || "-"}
//       </div>
//     </div>
//   );
// }

// function AssignSelect({ label, value, onChange, options, placeholder }) {
//   return (
//     <div>
//       <label
//         style={{
//           fontSize: 10,
//           display: "block",
//           color: "var(--text-secondary)",
//           marginBottom: 4,
//         }}
//       >
//         {label}
//       </label>
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="form-select"
//         style={{ padding: "5px 8px", fontSize: 11.5, width: "100%" }}
//       >
//         <option value="">{placeholder}</option>
//         {options.map((o) => (
//           <option key={o.id} value={o.name}>
//             {o.name}
//           </option>
//         ))}
//       </select>
//       {value && (
//         <span
//           className="badge"
//           style={{
//             display: "inline-block",
//             marginTop: 5,
//             fontSize: 9.5,
//             padding: "1px 7px",
//             background: "var(--bg-tertiary)",
//             border: "1px solid var(--border-color)",
//             borderRadius: 999,
//           }}
//         >
//           → {value}
//         </span>
//       )}
//     </div>
//   );
// }

// /**
//  * Renders existing assignment rows as removable pills, plus a select
//  * to add a new assignee from the directory. Matches the Frappe child-table
//  * shape: rows = [{ name, employee|vendor, ...meta }], directory = [{ id, name }]
//  * of options not yet assigned. The row's display label is resolved from
//  * `directory` by id since freshly-saved child-table rows carry the link id
//  * (employee/vendor) rather than a display name directly.
//  */
// function AssignList({ rows, directory, onAdd, onRemove, placeholder }) {
//   const assignedIds = rows.map((r) => r.employee || r.vendor || r.name);
//   const available = directory.filter((d) => !assignedIds.includes(d.id));

//   return (
//     <div>
//       <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: rows.length ? 8 : 0 }}>
//         {rows.map((r) => {
//           const id = r.employee || r.vendor || r.name;
//           const match = directory.find((d) => d.id === id);
//           const label = match ? match.name : id;
//           return (
//             <span
//               key={r.name}
//               className="badge"
//               style={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: 5,
//                 fontSize: 10.5,
//                 padding: "3px 6px 3px 9px",
//                 background: "var(--bg-tertiary)",
//                 border: "1px solid var(--border-color)",
//                 borderRadius: 999,
//               }}
//             >
//               {label}
//               <button
//                 onClick={() => onRemove(r.name)}
//                 style={{
//                   background: "transparent",
//                   border: "none",
//                   cursor: "pointer",
//                   display: "flex",
//                   padding: 0,
//                   lineHeight: 0,
//                 }}
//               >
//                 <X size={10} />
//               </button>
//             </span>
//           );
//         })}
//         {rows.length === 0 && (
//           <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>None assigned yet.</span>
//         )}
//       </div>

//       <select
//         value=""
//         onChange={(e) => {
//           if (e.target.value) onAdd(e.target.value);
//         }}
//         className="form-select"
//         style={{ padding: "5px 8px", fontSize: 11.5, width: "100%" }}
//       >
//         <option value="">{placeholder}</option>
//         {available.map((d) => (
//           <option key={d.id} value={d.id}>
//             {d.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// export default function Maintenance({
//   schedules = [],
//   visits = [],
//   tenants = [],
//   properties = [],
//   preSelectedProperty = null,
//   clearPreSelectedProperty,
//   preSelectedIssue = null,
//   clearPreSelectedIssue,
//   onCreateSchedule,
//   onUpdateScheduleDate,
//   onUpdateScheduleStatus,
//   onUpdateVisitStatus,
//   erpnextConfig,
//   employees = [],
//   vendors = [],
//   onAssignResource,
//   onCreateVisit
// }) {
//   const [activeSection, setActiveSection] = useState('schedule');
//   const [viewMode, setViewMode] = useState('list');
//   const [maintenanceSearch, setMaintenanceSearch] = useState('');

//   const [selectedSchedule, setSelectedSchedule] = useState(null);
//   const [selectedVisit, setSelectedVisit] = useState(null);
//   const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
//   const [selectedAsset, setSelectedAsset] = useState(null);
//   const [selectedVendor, setSelectedVendor] = useState(null);
//   const [selectedTechnician, setSelectedTechnician] = useState(null);

//   const [calendarYear, setCalendarYear] = useState(2026);
//   const [calendarMonth, setCalendarMonth] = useState(5);
//   const [selectedDateStr, setSelectedDateStr] = useState('2026-06-17');

//   const [showScheduleModal, setShowScheduleModal] = useState(false);
//   const [showWOModal, setShowWOModal] = useState(false);          // employee-assign modal
//   const [showConsumeModal, setShowConsumeModal] = useState(false);

//   // ── Toast state ─────────────────────────────────────────────────────────────
//   const [toast, setToast] = useState(null); // { message, type }
//   const showToast = (message, type = 'success') => setToast({ message, type });

//   // ── Employee-assign WO state ─────────────────────────────────────────────────
//   const [woAssignedEmployees, setWoAssignedEmployees] = useState([]); // array of employee names/ids
//   const [woSubmitting, setWoSubmitting] = useState(false);

//   // ── Schedule header fields ───────────────────────────────────────────────────
//   const [schedCustomer, setSchedCustomer] = useState('');
//   const [schedTransDate, setSchedTransDate] = useState(new Date().toISOString().split('T')[0]);
//   const [schedBookingId, setSchedBookingId] = useState('');
//   const [schedProperty, setSchedProperty] = useState('');

//   // ── Schedule items child table ───────────────────────────────────────────────
//   const [schedItems, setSchedItems] = useState([
//     { itemCode: '', itemName: '', startDate: '', periodicity: 'Weekly', noOfVisits: 1, endDate: '' }
//   ]);
//   const [itemNameCache, setItemNameCache] = useState({});

//   // legacy states kept for internal use
//   const [schedIssueNumber, setSchedIssueNumber] = useState('');
//   const [schedPropertyId, setSchedPropertyId] = useState('');
//   const [schedUnitSpec, setSchedUnitSpec] = useState('');
//   const [schedStartDate, setSchedStartDate] = useState('2026-06-16');
//   const [schedDescription, setSchedDescription] = useState('');
//   const [schedAssetId, setSchedAssetId] = useState('');
//   const [schedUnits, setSchedUnits] = useState([]);

//   const [submittingSchedule, setSubmittingSchedule] = useState(false);
//   const [scheduleStatusMessage, setScheduleStatusMessage] = useState(null);

//   const [bookings, setBookings] = useState([]);

//   // Work Order / Task states (kept for non-WO-modal sections)
//   const [woEstimates, setWoEstimates] = useState({});
//   const [showEstimateModal, setShowEstimateModal] = useState(false);
//   const [estType, setEstType] = useState('Material');
//   const [estItemCode, setEstItemCode] = useState('');
//   const [estName, setEstName] = useState('');
//   const [estQty, setEstQty] = useState(1);
//   const [estCost, setEstCost] = useState(0);
//   const [estComment, setEstComment] = useState('');
//   const [consumeItemsList, setConsumeItemsList] = useState([{ itemCode: '', qty: 1, comment: '' }]);

//   const [localSchedules, setLocalSchedules] = useState([]);
//   const [workOrders, setWorkOrders] = useState([]);
//   const [techProfiles, setTechProfiles] = useState([]);
//   const [vendorDir, setVendorDir] = useState([]);
//   const [assetsList, setAssetsList] = useState([]);
//   const [stockItems, setStockItems] = useState([]);

//   const getCsrfToken = () =>
//     document.cookie.split('; ').find(row => row.startsWith('sid='))?.split('=')[1] || '';

//   // ── Fetch helpers ────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!erpnextConfig?.url) return;
//     fetch(`${erpnextConfig.url}/api/resource/Booking?fields=%5B%22name%22%5D&limit_page_length=200`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
//       .then(r => r.ok ? r.json() : null).then(json => { if (json) setBookings(json.data || []); }).catch(() => { });
//   }, [erpnextConfig]);

//   const fetchItemName = async (itemCode) => {
//     if (!itemCode || !erpnextConfig?.url) return '';
//     if (itemNameCache[itemCode]) return itemNameCache[itemCode];
//     try {
//       const res = await fetch(`${erpnextConfig.url}/api/resource/Item/${encodeURIComponent(itemCode)}?fields=%5B%22item_name%22%5D`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } });
//       if (res.ok) {
//         const json = await res.json();
//         const name = json.data?.item_name || json.item_name || itemCode;
//         setItemNameCache(prev => ({ ...prev, [itemCode]: name }));
//         return name;
//       }
//     } catch (e) { }
//     return itemCode;
//   };

//   const handleSchedItemCodeChange = async (idx, value) => {
//     const itemName = value ? (await fetchItemName(value)) : '';
//     setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, itemCode: value, itemName } : r));
//   };

//   useEffect(() => {
//     if (!erpnextConfig?.url) return;
//     fetch(`${erpnextConfig.url}/api/resource/Item?fields=%5B%22name%22%2C%22item_name%22%5D&limit_page_length=500`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
//       .then(r => r.ok ? r.json() : null).then(json => { if (json) setSchedUnits(json.data || []); }).catch(() => { });
//   }, [erpnextConfig]);

//   useEffect(() => {
//     const fetchItems = async () => {
//       if (!erpnextConfig?.url) {
//         setStockItems([
//           { code: 'ITEM-001', name: 'Copper Pipe 1/2 inch', qty: 50, unitCost: 15 },
//           { code: 'ITEM-002', name: 'LED Ceiling Lamp 12W', qty: 30, unitCost: 25 },
//           { code: 'ITEM-003', name: 'Water Tap Ceramic Valve', qty: 20, unitCost: 40 },
//           { code: 'ITEM-004', name: 'Plywood Board 8x4', qty: 15, unitCost: 35 },
//           { code: 'ITEM-005', name: 'Wall paint White 5L', qty: 10, unitCost: 60 }
//         ]);
//         return;
//       }
//       try {
//         const res = await fetch(`${erpnextConfig.url}/api/resource/Item?fields=%5B%22name%22%2C%22item_name%22%2C%22val_rate%22%5D&limit_page_length=200`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } });
//         if (res.ok) {
//           const json = await res.json();
//           setStockItems((json.data || []).map(item => ({ code: item.name, name: item.item_name || item.name, qty: 100, unitCost: Number(item.val_rate) || 20 })));
//         }
//       } catch (e) { }
//     };
//     fetchItems();
//   }, [erpnextConfig]);

//   useEffect(() => {
//     if (!erpnextConfig?.url) return;
//     fetch(`${erpnextConfig.url}/api/resource/Asset?fields=%5B%22name%22%2C%22asset_name%22%2C%22item_code%22%2C%22status%22%2C%22location%22%5D&limit_page_length=200`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
//       .then(r => r.ok ? r.json() : null).then(json => {
//         if (json) setAssetsList((json.data || []).map(a => ({ id: a.name, name: a.asset_name || a.name, item: a.item_code || 'HVAC System', status: a.status || 'Submitted', location: a.location || 'Stratford Apartments' })));
//       }).catch(() => { });
//   }, [erpnextConfig]);

//   const fetchWorkOrders = useCallback(async () => {
//     if (!erpnextConfig?.url) return;
//     try {
//       const fields = [
//         "*"
//       ];

//       const res = await fetch(
//         `${erpnextConfig.url}/api/resource/Task?fields=${encodeURIComponent(
//           JSON.stringify(fields)
//         )}&limit_page_length=200`,
//         {
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (res.ok) {
//         const json = await res.json();
//         setWorkOrders((json.data || []).map(t => ({
//           id: t.name, property: getPropertyNameById(t.custom_property) || 'Stratford Court Apartments',
//           unit: t.custom_asset || 'Flat 1A', category: t.subject ? t.subject.split(' ')[0] : 'General',
//           technician: t.custom_technician || 'None', vendor: t.custom_vendor || 'None',
//           estHours: 4, estCost: Number(t.custom_estimated_cost) || 150, actualCost: 0,
//           status: t.status || 'Open', description: t.description || t.subject || '',
//           consumedItems: [], expStartDate: t.exp_start_date, expEndDate: t.exp_end_date,
//           priority: t.priority, scheduleId: t.custom_maintenance_schedule
//         })));
//       }
//     } catch (e) { }
//   }, [erpnextConfig]);

//   useEffect(() => { fetchWorkOrders(); }, [fetchWorkOrders, localSchedules]);

//   const fetchSchedules = useCallback(async () => {
//     if (!erpnextConfig?.url) return;
//     try {
//       const res = await fetch(
//         `${erpnextConfig.url}/api/resource/Maintenance Schedule?fields=%5B%22name%22%2C%22customer%22%2C%22customer_name%22%2C%22transaction_date%22%2C%22custom_property%22%2C%22status%22%2C%22docstatus%22%5D&limit_page_length=200`,
//         { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
//       );
//       if (res.ok) {
//         const json = await res.json();
//         setLocalSchedules(json.data || []);
//       }
//     } catch (e) { }
//   }, [erpnextConfig]);

//   useEffect(() => {
//     if (schedules && schedules.length > 0) setLocalSchedules(schedules);
//     else fetchSchedules();
//   }, [schedules]);

//   useEffect(() => {
//     setTechProfiles(employees.length > 0 ? employees.map(emp => ({
//       id: emp.id || emp.name, name: emp.name,
//       skill: emp.department || 'General Maintenance', certs: emp.designation || 'Technician',
//       availability: emp.status === 'Active' ? 'Available' : 'On Leave',
//       activeJobs: 0, phone: emp.phone || '+679 000 0000',
//       email: emp.email || 'tech@carpenterestate.org', img: emp.image || ''
//     })) : []);
//   }, [employees]);

//   useEffect(() => {
//     setVendorDir(vendors.length > 0 ? vendors.map(v => ({
//       id: v.id, name: v.name, group: v.supplier_group || 'Local', type: v.supplier_type || 'Services',
//       rating: 4.5, quotesCount: 0, phone: v.phone || '+679 000 0000',
//       email: v.email || 'vendor@carpenterestate.org', address: v.address || 'Fiji'
//     })) : []);
//   }, [vendors]);

//   useEffect(() => {
//     if (preSelectedProperty) {
//       setSchedPropertyId(preSelectedProperty.id); setSchedProperty(preSelectedProperty.id);
//       const t = tenants.find(t => t.propertyId === preSelectedProperty.id);
//       if (t) setSchedCustomer(t.id);
//       setShowScheduleModal(true); clearPreSelectedProperty();
//     }
//   }, [preSelectedProperty, tenants, clearPreSelectedProperty]);

//   useEffect(() => {
//     if (preSelectedIssue) {
//       setSchedIssueNumber(preSelectedIssue.id || ''); setSchedDescription(preSelectedIssue.subject || '');
//       const mt = tenants.find(t => t.name === preSelectedIssue.tenantName || t.id === preSelectedIssue.customerId || t.name === preSelectedIssue.customerId);
//       if (mt) {
//         setSchedCustomer(mt.id);
//         if (mt.propertyId) { setSchedPropertyId(mt.propertyId); setSchedProperty(mt.propertyId); }
//         if (mt.unitSpec) setSchedUnitSpec(mt.unitSpec);
//       }
//       setShowScheduleModal(true);
//       if (clearPreSelectedIssue) clearPreSelectedIssue();
//     }
//   }, [preSelectedIssue, tenants, clearPreSelectedIssue]);

//   const getPropertyNameById = (propId) => {
//     const prop = (properties || []).find(p => p.id === propId || p.name === propId);
//     return prop ? prop.name : 'Stratford Court Apartments';
//   };

//   // ── Drag & drop ──────────────────────────────────────────────────────────────
//   const handleDragStart = (e, scheduleName) => e.dataTransfer.setData('text/plain', scheduleName);
//   const handleDragOver = (e) => e.preventDefault();
//   const handleDrop = (e, targetStatus) => {
//     e.preventDefault();
//     const scheduleName = e.dataTransfer.getData('text/plain');
//     if (scheduleName) {
//       setLocalSchedules(prev => prev.map(s => s.name === scheduleName ? { ...s, status: targetStatus } : s));
//       if (onUpdateScheduleStatus) onUpdateScheduleStatus(scheduleName, targetStatus);
//     }
//   };

//   // ── Create Schedule ──────────────────────────────────────────────────────────
//   const handleCreateScheduleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmittingSchedule(true); setScheduleStatusMessage(null);
//     const tenantObj = tenants.find(t => t.id === schedCustomer);
//     const customerName = tenantObj ? tenantObj.name : schedCustomer;
//     const payload = {
//       customer: schedCustomer, customer_name: customerName, transaction_date: schedTransDate,
//       custom_booking_id: schedBookingId, custom_property: schedProperty, status: 'Draft',
//       items: schedItems.map(r => ({ item_code: r.itemCode, item_name: r.itemName || r.itemCode, start_date: r.startDate, periodicity: r.periodicity, no_of_visits: Number(r.noOfVisits) || 1, end_date: r.endDate }))
//     };
//     try {
//       await onCreateSchedule(payload);
//       setScheduleStatusMessage({ type: 'success', text: 'Maintenance Schedule created successfully!' });
//       setTimeout(() => { setShowScheduleModal(false); setScheduleStatusMessage(null); fetchSchedules(); }, 1200);
//     } catch (err) {
//       setScheduleStatusMessage({ type: 'error', text: err.message });
//     } finally { setSubmittingSchedule(false); }
//   };

//   // ── Submit Work Order (approve schedule → auto-create Task → assign employees) ──
//   const handleSubmitWorkOrder = async () => {
//     if (!selectedSchedule) return;
//     if (woAssignedEmployees.length === 0) {
//       showToast('Please select at least one employee to assign.', 'error');
//       return;
//     }
//     setWoSubmitting(true);
//     try {
//       const csrfToken = getCsrfToken();

//       // Step 1: Submit / approve the maintenance schedule (state_code = 1)
//       const approveRes = await fetch(`${erpnextConfig.url}/api/method/approve_reject_doc`, {
//         method: 'POST', credentials: 'include',
//         headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken },
//         body: JSON.stringify({ doctype_name: 'Maintenance Schedule', docname: selectedSchedule.name, state_code: 1 })
//       });
//       if (!approveRes.ok) {
//         const errText = await approveRes.text();
//         throw new Error(`Failed to submit schedule: ${errText}`);
//       }

//       // Step 2: Find the Task auto-created by the backend (linked via custom_mantainence_sechedule)
//       // Poll briefly to give backend time to create the task
//       await new Promise(r => setTimeout(r, 1000));

//       const taskSearchRes = await fetch(
//         `${erpnextConfig.url}/api/resource/Task?filters=%5B%5B%22custom_mantainence_sechedule%22%2C%22%3D%22%2C%22${encodeURIComponent(selectedSchedule.name)}%22%5D%5D&fields=%5B%22name%22%5D&limit_page_length=5`,
//         { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
//       );

//       let taskName = null;
//       if (taskSearchRes.ok) {
//         const taskJson = await taskSearchRes.json();
//         const tasks = taskJson.data || [];
//         if (tasks.length > 0) taskName = tasks[0].name;
//       }

//       // Step 3: Fetch full employee details then PUT to Task child table
//       if (taskName) {
//         // Fetch each selected employee's doc to get emp_id, name, designation, phone
//         const empRows = await Promise.all(
//           woAssignedEmployees.map(async (empId) => {
//             try {
//               const empRes = await fetch(
//                 `${erpnextConfig.url}/api/resource/Employee/${encodeURIComponent(empId)}?fields=%5B%22name%22%2C%22employee_name%22%2C%22designation%22%2C%22cell_number%22%2C%22company_email%22%5D`,
//                 { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
//               );
//               if (empRes.ok) {
//                 const empJson = await empRes.json();
//                 const emp = empJson.data || empJson;
//                 return {
//                   emp_id: emp.name || empId,
//                   emp_name: emp.employee_name || emp.name || empId,
//                   designation: emp.designation || '',
//                   contact_number: emp.cell_number || emp.company_email || ''
//                 };
//               }
//             } catch (e) { }
//             // fallback: use whatever we have from the employees prop
//             const localEmp = employees.find(e => (e.id || e.name) === empId);
//             return {
//               emp_id: empId,
//               emp_name: localEmp?.name || empId,
//               designation: localEmp?.designation || '',
//               contact_number: localEmp?.phone || ''
//             };
//           })
//         );

//         const putRes = await fetch(`${erpnextConfig.url}/api/resource/Task/${taskName}`, {
//           method: 'PUT', credentials: 'include',
//           headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken },
//           body: JSON.stringify({ custom_assign_to_: empRows })
//         });

//         if (!putRes.ok) {
//           const errTxt = await putRes.text();
//           console.warn('Employee assignment failed:', errTxt);
//           showToast('Work order submitted. Employee assignment failed — check ERPNext logs.', 'info');
//         } else {
//           showToast(`Task submitted & ${empRows.length} employee(s) assigned to ${taskName}!`, 'success');
//         }
//       } else {
//         showToast('Schedule submitted. Task not yet visible — employees can be assigned once it appears.', 'info');
//       }

//       // Step 4: Update local schedule status + refresh
//       setLocalSchedules(prev => prev.map(s => s.name === selectedSchedule.name ? { ...s, status: 'Submitted', docstatus: 1 } : s));
//       setSelectedSchedule(prev => prev ? { ...prev, status: 'Submitted', docstatus: 1 } : prev);
//       fetchSchedules();
//       fetchWorkOrders();

//       // Close modal + reset
//       setShowWOModal(false);
//       setWoAssignedEmployees([]);
//     } catch (err) {
//       showToast(err.message || 'Submission failed.', 'error');
//     } finally {
//       setWoSubmitting(false);
//     }
//   };

//   // ── Multi-assignee reassign (Task.custom_assign_to_ / custom_assign_to_vendor) ──
//   // employeeDir is the {id, name} option list AssignList uses for the employee picker.
//   // techProfiles is already shaped { id, name, ... } from the `employees` prop above.
//   const employeeDir = techProfiles;

//   // Add an employee/vendor to LOCAL state only — nothing hits ERPNext until Save.
//   const handleAddAssignee = (kind, optionId) => {
//     if (!selectedWorkOrder || !optionId) return;
//     const dir = kind === 'employee' ? employeeDir : vendorDir;
//     const match = dir.find(d => d.id === optionId);
//     if (!match) return;

//     const fieldKey = kind === 'employee' ? 'custom_assign_to_' : 'custom_assign_to_vendor';
//     const rowKey = kind === 'employee' ? 'employee' : 'vendor';

//     const newRow = {
//       name: `local-${kind}-${optionId}-${Date.now()}`, // temp client-side row id until saved
//       [rowKey]: match.id,
//     };

//     setSelectedWorkOrder(prev => {
//       if (!prev) return prev;
//       const existing = prev[fieldKey] || [];
//       // avoid assigning the same person/vendor twice
//       if (existing.some(r => (r[rowKey] || r.name) === match.id)) return prev;
//       return { ...prev, [fieldKey]: [...existing, newRow] };
//     });
//   };

//   // Remove a row (matched by its child-table `name`) from local state only.
//   const handleRemoveAssignee = (kind, rowName) => {
//     if (!selectedWorkOrder) return;
//     const fieldKey = kind === 'employee' ? 'custom_assign_to_' : 'custom_assign_to_vendor';
//     setSelectedWorkOrder(prev => prev
//       ? { ...prev, [fieldKey]: (prev[fieldKey] || []).filter(r => r.name !== rowName) }
//       : prev
//     );
//   };

//   // Discard local edits by re-fetching the Task fresh from ERPNext.
//   const handleResetAssignments = async (taskName) => {
//     if (!erpnextConfig?.url) {
//       showToast('No ERPNext connection configured — cannot reset.', 'error');
//       return;
//     }
//     try {
//       const res = await fetch(`${erpnextConfig.url}/api/resource/Task/${taskName}`, {
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' }
//       });
//       if (res.ok) {
//         const json = await res.json();
//         setSelectedWorkOrder(json.data);
//         showToast('Assignments reset to last saved state.', 'info');
//       } else {
//         showToast('Failed to reload task.', 'error');
//       }
//     } catch (e) {
//       showToast('Error reloading task.', 'error');
//     }
//   };

//   // Persist custom_assign_to_ + custom_assign_to_vendor child tables to ERPNext.
//   const handleSaveAssignments = async (taskName) => {
//     if (!selectedWorkOrder) return;
//     if (!erpnextConfig?.url) {
//       showToast('No ERPNext connection configured.', 'error');
//       return;
//     }

//     const employeeRows = (selectedWorkOrder.custom_assign_to_ || []).map(r => ({
//       employee: r.employee || r.name
//     }));
//     const vendorRows = (selectedWorkOrder.custom_assign_to_vendor || []).map(r => ({
//       vendor: r.vendor || r.name
//     }));

//     try {
//       const res = await fetch(`${erpnextConfig.url}/api/resource/Task/${taskName}`, {
//         method: 'PUT',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': getCsrfToken() },
//         body: JSON.stringify({
//           custom_assign_to_: employeeRows,
//           custom_assign_to_vendor: vendorRows
//         })
//       });

//       if (res.ok) {
//         const json = await res.json();
//         setSelectedWorkOrder(json.data);
//         // keep the list view's technician/vendor preview columns roughly in sync
//         setWorkOrders(prev => prev.map(wo => wo.id === taskName
//           ? { ...wo, technician: employeeRows[0]?.employee || wo.technician, vendor: vendorRows[0]?.vendor || wo.vendor }
//           : wo
//         ));
//         showToast('Assignment saved.', 'success');
//       } else {
//         const errText = await res.text();
//         console.warn('Save assignment failed:', errText);
//         showToast('Failed to save assignment.', 'error');
//       }
//     } catch (e) {
//       showToast('Error saving assignment.', 'error');
//     }
//   };

//   const handleWOStatusChange = async (woId, newStatus) => {
//     const erpStatus = newStatus === 'In Progress' ? 'Working' : newStatus === 'Completed' ? 'Completed' : 'Open';
//     const update = (wo) => ({ ...wo, status: newStatus, actualCost: newStatus === 'Completed' && wo.actualCost === 0 ? wo.estCost : wo.actualCost });
//     setWorkOrders(prev => prev.map(wo => wo.id === woId ? update(wo) : wo));
//     setSelectedWorkOrder(prev => prev && prev.id === woId ? update(prev) : prev);
//     if (erpnextConfig?.url) {
//       try {
//         await fetch(`${erpnextConfig.url}/api/resource/Task/${woId}`, {
//           method: 'PUT', credentials: 'include',
//           headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': getCsrfToken() },
//           body: JSON.stringify({ status: erpStatus })
//         });
//       } catch (e) { }
//     }
//   };

//   const handleConsumeItemSubmit = (e) => {
//     e.preventDefault();
//     if (!selectedWorkOrder) return;
//     let totalCost = 0; const newConsumedItems = [];
//     for (const entry of consumeItemsList) {
//       if (!entry.itemCode) continue;
//       const item = stockItems.find(s => s.code === entry.itemCode);
//       if (!item) continue;
//       if (item.qty < entry.qty) { showToast(`Insufficient stock for ${item.name}`, 'error'); return; }
//       setStockItems(prev => prev.map(s => s.code === entry.itemCode ? { ...s, qty: s.qty - entry.qty } : s));
//       const cost = item.unitCost * entry.qty; totalCost += cost;
//       newConsumedItems.push({ item: item.name, itemCode: entry.itemCode, qty: entry.qty, cost, comment: entry.comment || '' });
//     }
//     if (newConsumedItems.length === 0) return;
//     const updateWO = (wo) => ({ ...wo, consumedItems: [...(wo.consumedItems || []), ...newConsumedItems], actualCost: wo.actualCost + totalCost });
//     setWorkOrders(prev => prev.map(wo => wo.id === selectedWorkOrder.id ? updateWO(wo) : wo));
//     setSelectedWorkOrder(prev => prev && prev.id === selectedWorkOrder.id ? updateWO(prev) : prev);
//     setConsumeItemsList([{ itemCode: '', qty: 1, comment: '' }]);
//     setShowConsumeModal(false);
//   };

//   const handleAddEstimateSubmit = (e) => {
//     e.preventDefault();
//     if (!selectedWorkOrder) return;
//     let finalName = estName, finalCost = Number(estCost);
//     if (estType === 'Material' && estItemCode) {
//       const m = stockItems.find(s => s.code === estItemCode);
//       if (m) { finalName = m.name; finalCost = m.unitCost * estQty; }
//     }
//     const newEst = { id: `EST-${Date.now()}`, type: estType, itemCode: estType === 'Material' ? estItemCode : '', name: finalName || (estType === 'Labour' ? 'General Labour' : 'Material Item'), qty: Number(estQty) || 1, cost: finalCost, comment: estComment || '' };
//     setWoEstimates(prev => ({ ...prev, [selectedWorkOrder.id]: [...(prev[selectedWorkOrder.id] || []), newEst] }));
//     setEstType('Material'); setEstItemCode(''); setEstName(''); setEstQty(1); setEstCost(0); setEstComment('');
//     setShowEstimateModal(false);
//   };

//   const handleGenerateQuotation = async (woId) => {
//     const estimates = woEstimates[woId] || [];
//     if (estimates.length === 0) { showToast('No estimates to generate quotation!', 'error'); return; }
//     const customerId = selectedWorkOrder.customerId || (tenants[0]?.id || 'Customer-N/A');
//     const payload = { quotation_to: 'Customer', party_name: customerId, transaction_date: new Date().toISOString().split('T')[0], company: 'CARPENTERS PROPERTIES PTE LIMITED', valid_till: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], items: estimates.map(e => ({ item_code: e.itemCode || 'General Item', qty: Number(e.qty) || 1, rate: Number(e.cost) / (Number(e.qty) || 1), description: e.comment || e.name || 'Estimate Item' })) };
//     if (erpnextConfig?.url) {
//       try {
//         const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': getCsrfToken() }, body: JSON.stringify(payload) });
//         if (res.ok) { const json = await res.json(); showToast(`Quotation ${json.data?.name || ''} generated!`, 'success'); }
//         else showToast('Failed to generate Quotation.', 'error');
//       } catch (e) { showToast('Error generating quotation.', 'error'); }
//     } else { showToast(`Simulation: Quotation for ${customerId} with ${estimates.length} items.`, 'info'); }
//   };

//   const filteredSchedules = localSchedules.filter(sch => {
//     const term = maintenanceSearch.toLowerCase();
//     const propName = getPropertyNameById(sch.custom_property) || '';
//     return sch.name.toLowerCase().includes(term) || (sch.customer_name || sch.customer || '').toLowerCase().includes(term) || propName.toLowerCase().includes(term) || (sch.type || '').toLowerCase().includes(term);
//   });

//   const thStyle = { padding: '8px 10px', textAlign: 'left', fontWeight: 600, fontSize: 11, color: 'var(--text-secondary, #6b7280)', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' };
//   const inputStyle = { width: '100%', fontSize: 12, minHeight: 32, padding: '5px 8px', boxSizing: 'border-box' };

//   // helper: is schedule already submitted (docstatus=1 or status Submitted)
//   const isScheduleSubmitted = (sch) => sch && (sch.docstatus === 1 || (sch.status || '').toLowerCase() === 'submitted');

//   return (
//     <div>
//       {/* Toast */}
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div className="view-header" style={{ flexWrap: 'wrap', gap: 16 }}>
//         <div>
//           <h1 className="view-title">Maintenance Ops & Facility management</h1>
//           <p className="view-subtitle">Roster preventative maintenance visits, manage work orders, assign tasks, and track logs.</p>
//         </div>
//         <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: 4, borderRadius: 8, border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
//           {[['schedule', 'Maintenance Schedule'], ['task', 'Task Operations'], ['technician', 'Technicians'], ['vendor', 'Vendors'], ['asset', 'Assets']].map(([key, label], i) => (
//             <button key={key} className={`btn btn-sm ${activeSection === key ? 'btn-primary' : 'btn-secondary'}`} style={{ marginLeft: i > 0 ? 4 : 0 }} onClick={() => setActiveSection(key)}>{label}</button>
//           ))}
//         </div>
//       </div>

//       {/* ── SECTION 1: MAINTENANCE SCHEDULES ── */}
//       {activeSection === 'schedule' && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
//           <div className="card-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', flexWrap: 'wrap', gap: 10 }}>
//             <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
//               <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
//                 <Search size={16} />
//                 <input type="text" placeholder="Search schedules..." className="form-input" style={{ width: 200, padding: '4px 10px' }} value={maintenanceSearch} onChange={(e) => setMaintenanceSearch(e.target.value)} />
//               </div>
//               <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: 2, borderRadius: 6 }}>
//                 {['list', 'kanban', 'calendar'].map(mode => (
//                   <button key={mode} className={`btn btn-sm ${viewMode === mode ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 8px', fontSize: 10, textTransform: 'capitalize' }} onClick={() => setViewMode(mode)}>{mode}</button>
//                 ))}
//               </div>
//             </div>
//             <button className="btn btn-primary btn-sm" onClick={() => setShowScheduleModal(true)}><Plus size={14} /> New Schedule</button>
//           </div>

//           <div className="grid-2col" style={{ gridTemplateColumns: selectedSchedule ? '60% calc(40% - 24px)' : '1fr', gap: 24 }}>
//             {viewMode === 'list' && (
//               <div className="card-panel" style={{ padding: 0 }}>
//                 <div className="table-container">
//                   <table className="custom-table">
//                     <thead><tr><th>Schedule ID</th><th>Type</th><th>Tenant / Partner</th><th>Property Group</th><th>Periodicity</th><th>Status</th></tr></thead>
//                     <tbody>
//                       {filteredSchedules.map(sch => {
//                         const firstItem = sch.items?.[0];
//                         return (
//                           <tr key={sch.name} onClick={() => setSelectedSchedule(sch)} style={{ cursor: 'pointer', backgroundColor: selectedSchedule?.name === sch.name ? 'var(--bg-accent-alpha)' : '' }}>
//                             <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{sch.name}</td>
//                             <td><span className="badge badge-secondary" style={{ textTransform: 'none' }}>{sch.type || 'PM Schedule'}</span></td>
//                             <td>{sch.customer_name || sch.customer}</td>
//                             <td>{getPropertyNameById(sch.custom_property)}</td>
//                             <td>{firstItem ? firstItem.periodicity : '—'}</td>
//                             <td><span className={`badge ${sch.status === 'Completed' ? 'badge-success' : isScheduleSubmitted(sch) ? 'badge-info' : 'badge-warning'}`}>{sch.status || 'Draft'}</span></td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {viewMode === 'kanban' && (
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
//                 {['Pending', 'In Progress', 'Completed'].map(status => {
//                   const statusSchedules = filteredSchedules.filter(s => {
//                     const raw = (s.status || '').toLowerCase();
//                     let norm = 'Pending';
//                     if (raw === 'completed' || raw === 'closed') norm = 'Completed';
//                     else if (raw === 'in progress' || raw === 'submitted') norm = 'In Progress';
//                     return norm === status;
//                   });
//                   return (
//                     <div key={status} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, status)} style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 8, minHeight: 300 }}>
//                       <h3 style={{ fontSize: 13, marginBottom: 10, borderBottom: '2px solid var(--border-color)', paddingBottom: 6 }}>{status} ({statusSchedules.length})</h3>
//                       <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//                         {statusSchedules.map(sch => (
//                           <div key={sch.name} draggable onDragStart={(e) => handleDragStart(e, sch.name)} onClick={() => setSelectedSchedule(sch)} style={{ background: 'var(--bg-secondary)', padding: 10, borderRadius: 6, border: '1px solid var(--border-color)', cursor: 'grab' }}>
//                             <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-color)' }}>{sch.name}</div>
//                             <div style={{ fontSize: 12, fontWeight: 600 }}>{sch.customer_name || sch.customer}</div>
//                             <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Property: {getPropertyNameById(sch.custom_property)}</div>
//                             <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>Type: {sch.type}</div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//             {viewMode === 'calendar' && (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
//                 <div className="card-panel" style={{ padding: 20 }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
//                     <h3 style={{ fontSize: 14, margin: 0 }}>{new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
//                     <div style={{ display: 'flex', gap: 8 }}>
//                       <button className="btn btn-secondary btn-xs" onClick={() => { if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); } else setCalendarMonth(m => m - 1); }}>Prev</button>
//                       <button className="btn btn-secondary btn-xs" onClick={() => { if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); } else setCalendarMonth(m => m + 1); }}>Next</button>
//                     </div>
//                   </div>
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center', fontWeight: 600, fontSize: 11, marginBottom: 8, color: 'var(--text-secondary)' }}>
//                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
//                   </div>
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
//                     {(() => {
//                       const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
//                       const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
//                       const cells = [];
//                       for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} style={{ height: 50 }} />);
//                       for (let day = 1; day <= totalDays; day++) {
//                         const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//                         const daySchedules = filteredSchedules.filter(s => s.transaction_date === dateStr);
//                         const isSelected = selectedDateStr === dateStr;
//                         const isToday = calendarYear === 2026 && calendarMonth === 5 && day === 17;
//                         cells.push(
//                           <div key={`d-${day}`} onClick={() => setSelectedDateStr(dateStr)} style={{ height: 50, border: `1px solid ${isSelected ? 'var(--brand-color)' : 'var(--border-color)'}`, borderRadius: 4, background: isSelected ? 'var(--bg-accent-alpha)' : isToday ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', padding: 4, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.15s ease' }}>
//                             <span style={{ fontSize: 10, fontWeight: isToday || isSelected ? 700 : 400 }}>{day}</span>
//                             {daySchedules.length > 0 && <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>{daySchedules.map(s => <span key={s.name} style={{ width: 6, height: 6, borderRadius: '50%', background: s.status === 'Completed' ? '#10b981' : '#f59e0b', display: 'inline-block' }} />)}</div>}
//                           </div>
//                         );
//                       }
//                       return cells;
//                     })()}
//                   </div>
//                 </div>
//                 <div className="card-panel" style={{ padding: 16 }}>
//                   <h4 style={{ fontSize: 12, marginBottom: 10, color: 'var(--text-secondary)' }}>Schedules for: <strong>{selectedDateStr}</strong></h4>
//                   {(() => {
//                     const daySchedules = filteredSchedules.filter(s => s.transaction_date === selectedDateStr);
//                     if (daySchedules.length === 0) return <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>No schedules planned for this day.</div>;
//                     return <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{daySchedules.map(sch => <div key={sch.name} onClick={() => setSelectedSchedule(sch)} style={{ padding: 10, background: 'var(--bg-tertiary)', borderLeft: '4px solid var(--brand-color)', borderRadius: 4, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><strong style={{ fontSize: 12 }}>{sch.name} ({sch.type})</strong><div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Tenant: {sch.customer_name || sch.customer} | Prop: {getPropertyNameById(sch.custom_property)}</div></div><span className={`badge ${sch.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>{sch.status || 'Pending'}</span></div>)}</div>;
//                   })()}
//                 </div>
//               </div>
//             )}

//             {/* ── Schedule detail panel ── */}
//             {selectedSchedule && (
//               <div className="card-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
//                   <strong>{selectedSchedule.name}</strong>
//                   <button onClick={() => setSelectedSchedule(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
//                 </div>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
//                   <div>Type: <strong>{selectedSchedule.type || '—'}</strong></div>
//                   <div>Property: <strong>{getPropertyNameById(selectedSchedule.custom_property)}</strong></div>
//                   <div>Tenant: <strong>{selectedSchedule.customer_name || selectedSchedule.customer}</strong></div>
//                   <div>Date: <strong>{selectedSchedule.transaction_date}</strong></div>
//                   <div>Status: <span className={`badge ${isScheduleSubmitted(selectedSchedule) ? 'badge-info' : 'badge-warning'}`}>{selectedSchedule.status || 'Draft'}</span></div>
//                 </div>

//                 {/* Only show "Submit Work Order" when NOT yet submitted */}
//                 {!isScheduleSubmitted(selectedSchedule) ? (
//                   <button
//                     className="btn btn-primary btn-sm"
//                     style={{ marginTop: 10, width: '100%', background: '#ffdd00', color: '#000', fontWeight: 700 }}
//                     onClick={() => { setWoAssignedEmployees([]); setShowWOModal(true); }}
//                   >
//                     <Hammer size={14} style={{ marginRight: 6 }} /> Assign Task
//                   </button>
//                 ) : (
//                   <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(16,185,129,0.08)', borderRadius: 6, fontSize: 12, color: '#10b981', textAlign: 'center', fontWeight: 600 }}>
//                     ✓ Task Assigned
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── SECTION 2: WORK ORDERS ── */}
//       {activeSection === 'task' && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
//           <div className="card-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' }}>
//             <span style={{ fontSize: 14, fontWeight: 700 }}>Maintenance Task list</span>
//           </div>
//           <div className="grid-2col" style={{ gridTemplateColumns: selectedWorkOrder ? '60% calc(40% - 24px)' : '1fr', gap: 24 }}>
//             <div className="card-panel" style={{ padding: 0 }}>
//               <div className="table-container">
//                 <table className="custom-table">
//                   <thead><tr><th>ID</th><th>Property</th><th>Category</th><th>Estimated Cost</th><th>Status</th></tr></thead>
//                   <tbody>
//                     {workOrders.map(wo => (
//                       <tr key={wo.id} onClick={async () => {
//                         try {
//                           const res = await fetch(
//                             `${erpnextConfig.url}/api/resource/Task/${wo.id}`,
//                             {
//                               credentials: "include",
//                               headers: {
//                                 "Content-Type": "application/json",
//                               },
//                             }
//                           );

//                           if (res.ok) {
//                             const json = await res.json();
//                             setSelectedWorkOrder(json.data)
//                           }
//                         }
//                         catch (err) {
//                           setSelectedWorkOrder(wo)
//                         }
//                       }

//                       } style={{ cursor: 'pointer', backgroundColor: selectedWorkOrder?.id === wo.id ? 'var(--bg-accent-alpha)' : '' }}>
//                         <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{wo.id}</td>
//                         <td>{wo.property}</td><td>{wo.category}</td>
//                         <td>${wo.estCost.toLocaleString()}</td>
//                         <td><span className={`badge ${wo.status === 'Completed' ? 'badge-success' : wo.status === 'Pending Approval' ? 'badge-warning' : 'badge-info'}`}>{wo.status}</span></td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* ── Work Order / Task detail panel ── */}
//             {selectedWorkOrder && (
//               <div
//                 className="card-panel"
//                 style={{
//                   padding: 14,
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 10,
//                   maxHeight: "calc(100vh - 160px)",
//                   overflowY: "auto",
//                   fontSize: 12,
//                 }}
//               >
//                 {/* Header */}
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "flex-start",
//                     borderBottom: "1px solid var(--border-color)",
//                     paddingBottom: 8,
//                   }}
//                 >
//                   <div>
//                     <strong style={{ fontSize: 14 }}>{selectedWorkOrder.name}</strong>
//                     <div style={{ color: "var(--text-secondary)", marginTop: 2, fontSize: 11 }}>
//                       {selectedWorkOrder.subject}
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setSelectedWorkOrder(null)}
//                     style={{ background: "transparent", border: "none", cursor: "pointer", padding: 2 }}
//                   >
//                     <X size={15} />
//                   </button>
//                 </div>

//                 {/* Status Row */}
//                 <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//                   <span className="badge badge-info" style={{ fontSize: 10, padding: "2px 8px" }}>
//                     {selectedWorkOrder.status}
//                   </span>
//                   <span className="badge badge-warning" style={{ fontSize: 10, padding: "2px 8px" }}>
//                     {selectedWorkOrder.priority}
//                   </span>
//                   <span className="badge badge-success" style={{ fontSize: 10, padding: "2px 8px" }}>
//                     {selectedWorkOrder.progress || 0}% Complete
//                   </span>
//                 </div>

//                 {/* Reference info */}
//                 <Section title="Reference">
//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
//                     <Info title="Schedule" value={selectedWorkOrder.custom_mantainence_sechedule} />
//                     <Info title="Booking" value={selectedWorkOrder.custom_booking_number} />
//                     <Info title="Customer" value={selectedWorkOrder.custom_customer_name} />
//                     <Info title="Company" value={selectedWorkOrder.company} />
//                     <Info title="Created" value={selectedWorkOrder.creation?.split(".")[0]} />
//                     <Info title="Owner" value={selectedWorkOrder.owner} />
//                   </div>
//                 </Section>

//                 {/* Cost */}
//                 <Section title="Cost">
//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
//                     <Info
//                       title="Costing"
//                       value={`$${Number(selectedWorkOrder.total_costing_amount || 0).toLocaleString()}`}
//                     />
//                     <Info
//                       title="Billing"
//                       value={`$${Number(selectedWorkOrder.total_billing_amount || 0).toLocaleString()}`}
//                     />
//                   </div>
//                 </Section>

//                 {/* Reassign — multi-assignee, assignable-style */}
//                 <Section title="Assigned Employees">
//                   <AssignList
//                     rows={selectedWorkOrder.custom_assign_to_ || []}
//                     directory={employeeDir}
//                     onAdd={(emp) => handleAddAssignee("employee", emp)}
//                     onRemove={(rowName) => handleRemoveAssignee("employee", rowName)}
//                     placeholder="Add employee..."
//                   />
//                 </Section>

//                 <Section title="Assigned Vendors">
//                   <AssignList
//                     rows={selectedWorkOrder.custom_assign_to_vendor || []}
//                     directory={vendorDir}
//                     onAdd={(v) => handleAddAssignee("vendor", v)}
//                     onRemove={(rowName) => handleRemoveAssignee("vendor", rowName)}
//                     placeholder="Add vendor..."
//                   />
//                 </Section>

//                 {/* Action row */}
//                 <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
//                   <button
//                     className="btn btn-secondary btn-sm"
//                     style={{ flex: 1, fontSize: 11, padding: "6px 0" }}
//                     onClick={() => handleResetAssignments(selectedWorkOrder.name)}
//                   >
//                     Reset
//                   </button>
//                   <button
//                     className="btn btn-primary btn-sm"
//                     style={{ flex: 2, fontSize: 11, padding: "6px 0" }}
//                     onClick={() => handleSaveAssignments(selectedWorkOrder.name)}
//                   >
//                     Save Assignment
//                   </button>
//                 </div>
//               </div>
//             )}

//           </div>
//         </div>
//       )
//       }

//       {/* ── SECTION 3: TECHNICIANS ── */}
//       {
//         activeSection === 'technician' && (
//           <div className="grid-2col" style={{ gridTemplateColumns: selectedTechnician ? '60% calc(40% - 24px)' : '1fr', gap: 24 }}>
//             <div className="card-panel">
//               <h3 style={{ fontSize: 15, marginBottom: 14 }}>Active Technicians Directory</h3>
//               <div className="table-container">
//                 <table className="custom-table">
//                   <thead><tr><th>Tech Name</th><th>Skill Category</th><th>Certifications</th><th>Availability</th></tr></thead>
//                   <tbody>{techProfiles.map(tech => <tr key={tech.id} onClick={() => setSelectedTechnician(tech)} style={{ cursor: 'pointer', backgroundColor: selectedTechnician?.id === tech.id ? 'var(--bg-accent-alpha)' : '' }}><td><strong>{tech.name}</strong></td><td>{tech.skill}</td><td>{tech.certs}</td><td><span className={`badge ${tech.availability === 'Available' ? 'badge-success' : 'badge-warning'}`}>{tech.availability}</span></td></tr>)}</tbody>
//                 </table>
//               </div>
//             </div>
//             {selectedTechnician && (
//               <div className="card-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}><strong>{selectedTechnician.name} Details</strong><button onClick={() => setSelectedTechnician(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button></div>
//                 <div style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8 }}>
//                   <img src={selectedTechnician.img} alt={selectedTechnician.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-color)' }} />
//                   <div><h4 style={{ fontSize: 14, margin: 0 }}>{selectedTechnician.name}</h4><span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Skill: {selectedTechnician.skill}</span></div>
//                 </div>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Award size={14} /> Certs: {selectedTechnician.certs}</div>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={14} /> Phone: {selectedTechnician.phone}</div>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={14} /> Email: {selectedTechnician.email}</div>
//                   <div>Status: <span className="badge badge-success">{selectedTechnician.availability}</span></div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )
//       }

//       {/* ── SECTION 4: VENDORS ── */}
//       {
//         activeSection === 'vendor' && (
//           <div className="grid-2col" style={{ gridTemplateColumns: selectedVendor ? '60% calc(40% - 24px)' : '1fr', gap: 24 }}>
//             <div className="card-panel">
//               <h3 style={{ fontSize: 15, marginBottom: 14 }}>Vendor Directory & Quotations Log</h3>
//               <div className="table-container">
//                 <table className="custom-table">
//                   <thead><tr><th>Vendor ID</th><th>Vendor Name</th><th>Service Category</th><th>Rating</th></tr></thead>
//                   <tbody>{vendorDir.map(v => <tr key={v.id} onClick={() => setSelectedVendor(v)} style={{ cursor: 'pointer', backgroundColor: selectedVendor?.id === v.id ? 'var(--bg-accent-alpha)' : '' }}><td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{v.id}</td><td>{v.name}</td><td>{v.type}</td><td>⭐ {v.rating}</td></tr>)}</tbody>
//                 </table>
//               </div>
//             </div>
//             {selectedVendor && (
//               <div className="card-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}><strong>{selectedVendor.name} Details</strong><button onClick={() => setSelectedVendor(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button></div>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
//                   <div>Vendor Group: <strong>{selectedVendor.group}</strong></div><div>Category Type: <strong>{selectedVendor.type}</strong></div>
//                   <div>Phone: <strong>{selectedVendor.phone}</strong></div><div>Email: <strong>{selectedVendor.email}</strong></div>
//                   <div>Address: <strong>{selectedVendor.address}</strong></div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )
//       }

//       {/* ── SECTION 5: ASSETS ── */}
//       {
//         activeSection === 'asset' && (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
//             <div className="card-panel">
//               <h3 style={{ fontSize: 15, marginBottom: 14 }}>Assets Warranty & AMC Management</h3>
//               <div className="table-container">
//                 <table className="custom-table">
//                   <thead><tr><th>Asset ID</th><th>Asset Name</th><th>Property Name</th><th>Warranty Expiry</th><th>AMC status</th><th>Breakdowns YTD</th></tr></thead>
//                   <tbody>{assetsList.map(a => <tr key={a.id}><td style={{ fontWeight: 600 }}>{a.id}</td><td>{a.name}</td><td><strong>{getPropertyNameById(a.propertyId)}</strong></td><td>{a.warranty}</td><td>Active Contract ({a.amc})</td><td><span className="badge badge-success">{a.breakdownCount} breakdowns</span></td></tr>)}</tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )
//       }

//       {/* ── CREATE MAINTENANCE SCHEDULE MODAL ── */}
//       {
//         showScheduleModal && (
//           <div className="modal-overlay">
//             <div className="modal-content" style={{ maxWidth: 740, width: '96vw', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
//               <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
//                 <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Create Maintenance Schedule</h3>
//                 <button onClick={() => setShowScheduleModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 0 }}>×</button>
//               </div>
//               <form onSubmit={handleCreateScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
//                 <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '20px', overflowY: 'auto', flex: 1 }}>
//                   {scheduleStatusMessage && (
//                     <div style={{ background: scheduleStatusMessage.type === 'success' ? 'rgba(6,95,70,0.1)' : 'rgba(239,68,68,0.1)', color: scheduleStatusMessage.type === 'success' ? '#10b981' : '#ef4444', padding: '10px 12px', borderRadius: 6, fontSize: 12 }}>
//                       {scheduleStatusMessage.text}
//                     </div>
//                   )}
//                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
//                       <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Customer <span style={{ color: '#ef4444' }}>*</span></label>
//                       <select value={schedCustomer} onChange={(e) => setSchedCustomer(e.target.value)} className="form-select" required disabled={submittingSchedule} style={{ fontSize: 13, height: 36, boxSizing: 'border-box' }}>
//                         <option value="">-- Choose Customer --</option>
//                         {(tenants || []).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
//                       </select>
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
//                       <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Transaction Date <span style={{ color: '#ef4444' }}>*</span></label>
//                       <input type="date" value={schedTransDate} onChange={(e) => setSchedTransDate(e.target.value)} className="form-input" required disabled={submittingSchedule} style={{ fontSize: 13, height: 36, boxSizing: 'border-box' }} />
//                     </div>
//                   </div>
//                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
//                       <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Booking ID</label>
//                       <select value={schedBookingId} onChange={(e) => setSchedBookingId(e.target.value)} className="form-select" disabled={submittingSchedule} style={{ fontSize: 13, height: 36, boxSizing: 'border-box' }}>
//                         <option value="">-- Choose Booking --</option>
//                         {bookings.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
//                       </select>
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
//                       <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Property</label>
//                       <select value={schedProperty} onChange={(e) => setSchedProperty(e.target.value)} className="form-select" disabled={submittingSchedule} style={{ fontSize: 13, height: 36, boxSizing: 'border-box' }}>
//                         <option value="">-- Choose Property --</option>
//                         {(properties || []).map(p => <option key={p.id || p.name} value={p.id || p.name}>{p.name}</option>)}
//                       </select>
//                     </div>
//                   </div>
//                   <div>
//                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
//                       <label style={{ margin: 0, fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Items <span style={{ color: '#ef4444' }}>*</span></label>
//                       <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSchedItems(prev => [...prev, { itemCode: '', itemName: '', startDate: schedTransDate || '', periodicity: 'Weekly', noOfVisits: 1, endDate: '' }])} style={{ padding: '4px 12px', fontSize: 11 }}>+ Add Row</button>
//                     </div>
//                     <div style={{ border: '1px solid var(--border-color)', borderRadius: 6, overflow: 'hidden' }}>
//                       <div style={{ overflowX: 'auto', maxHeight: 280, overflowY: 'auto' }}>
//                         <table style={{ width: '100%', minWidth: 680, borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: 12 }}>
//                           <colgroup><col style={{ width: 34 }} /><col style={{ width: 150 }} /><col style={{ width: 120 }} /><col style={{ width: 106 }} /><col style={{ width: 110 }} /><col style={{ width: 70 }} /><col style={{ width: 106 }} /><col style={{ width: 34 }} /></colgroup>
//                           <thead>
//                             <tr style={{ background: 'var(--bg-secondary, rgba(0,0,0,0.03))', position: 'sticky', top: 0, zIndex: 1 }}>
//                               {['#', 'Item Code', 'Item Name', 'Start Date', 'Periodicity', 'No. of Visits', 'End Date', ''].map((h, i) => <th key={i} style={thStyle}>{h}</th>)}
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {schedItems.map((row, idx) => (
//                               <tr key={idx} style={{ borderBottom: idx < schedItems.length - 1 ? '1px solid var(--border-color)' : 'none', background: idx % 2 === 0 ? 'transparent' : 'var(--bg-secondary, rgba(0,0,0,0.015))' }}>
//                                 <td style={{ padding: '7px 10px', color: 'var(--text-muted, #9ca3af)', fontSize: 11 }}>{idx + 1}</td>
//                                 <td style={{ padding: '5px 6px' }}>
//                                   <select value={row.itemCode} onChange={(e) => handleSchedItemCodeChange(idx, e.target.value)} className="form-select" required style={inputStyle}>
//                                     <option value="">-- Item --</option>
//                                     {schedUnits.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
//                                   </select>
//                                 </td>
//                                 <td style={{ padding: '7px 8px', color: 'var(--text-secondary, #6b7280)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.itemName || (row.itemCode ? '…' : '—')}</td>
//                                 <td style={{ padding: '5px 6px' }}><input type="date" value={row.startDate} onChange={(e) => setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, startDate: e.target.value } : r))} className="form-input" required style={inputStyle} /></td>
//                                 <td style={{ padding: '5px 6px' }}>
//                                   <select value={row.periodicity} onChange={(e) => setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, periodicity: e.target.value } : r))} className="form-select" required style={inputStyle}>
//                                     <option value="">Select</option>
//                                     <option value="Weekly">Weekly</option>
//                                     <option value="Monthly">Monthly</option>
//                                     <option value="Quarterly">Quarterly</option>
//                                     <option value="Half Yearly">Half Yearly</option>
//                                     <option value="Yearly">Yearly</option>
//                                     <option value="Random">Random</option>
//                                   </select>
//                                 </td>
//                                 <td style={{ padding: '5px 6px' }}><input type="number" min="1" value={row.noOfVisits} onChange={(e) => setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, noOfVisits: e.target.value } : r))} className="form-input" required style={{ ...inputStyle, textAlign: 'center' }} /></td>
//                                 <td style={{ padding: '5px 6px' }}><input type="date" value={row.endDate} onChange={(e) => setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, endDate: e.target.value } : r))} className="form-input" required style={inputStyle} /></td>
//                                 <td style={{ padding: '5px 4px', textAlign: 'center' }}>
//                                   {schedItems.length > 1 && <button type="button" onClick={() => setSchedItems(prev => prev.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: 'var(--color-danger, #ef4444)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px 4px' }}><Trash size={13} /></button>}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 20px', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
//                   <button type="button" className="btn btn-secondary" onClick={() => setShowScheduleModal(false)} disabled={submittingSchedule}>Cancel</button>
//                   <button type="submit" className="btn btn-primary" disabled={submittingSchedule}>{submittingSchedule ? 'Creating...' : 'Create Maintenance Schedule'}</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )
//       }

//       {/* ── SUBMIT WORK ORDER MODAL (employee assignment) ── */}
//       {
//         showWOModal && selectedSchedule && (
//           <div className="modal-overlay">
//             <div className="modal-content" style={{ maxWidth: 440, width: '92vw' }}>
//               <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-color)' }}>
//                 <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Submit Task</h3>
//                 <button onClick={() => setShowWOModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
//               </div>
//               <div className="modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
//                 {/* Schedule summary */}
//                 <div style={{ background: 'var(--bg-tertiary)', borderRadius: 6, padding: '10px 12px', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
//                   <div><span style={{ color: 'var(--text-secondary)' }}>Schedule: </span><strong>{selectedSchedule.name}</strong></div>
//                   <div><span style={{ color: 'var(--text-secondary)' }}>Customer: </span><strong>{selectedSchedule.customer_name || selectedSchedule.customer}</strong></div>
//                   <div><span style={{ color: 'var(--text-secondary)' }}>Property: </span><strong>{getPropertyNameById(selectedSchedule.custom_property)}</strong></div>
//                 </div>

//                 {/* Employee multi-select */}
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//                   <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
//                     Assign Employees <span style={{ color: '#ef4444' }}>*</span>
//                     <span style={{ fontWeight: 400, marginLeft: 6, color: 'var(--text-muted)', fontSize: 11 }}>(select one or more)</span>
//                   </label>

//                   {employees.length > 0 ? (
//                     <div style={{ border: '1px solid var(--border-color)', borderRadius: 6, maxHeight: 200, overflowY: 'auto', background: 'var(--bg-secondary)' }}>
//                       {employees.map((emp) => {
//                         const empId = emp.id || emp.name;
//                         const isChecked = woAssignedEmployees.includes(empId);
//                         return (
//                           <label
//                             key={empId}
//                             style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', background: isChecked ? 'var(--bg-accent-alpha)' : 'transparent', transition: 'background 0.1s' }}
//                           >
//                             <input
//                               type="checkbox"
//                               checked={isChecked}
//                               onChange={() => {
//                                 setWoAssignedEmployees(prev =>
//                                   isChecked ? prev.filter(id => id !== empId) : [...prev, empId]
//                                 );
//                               }}
//                               style={{ width: 15, height: 15, accentColor: 'var(--brand-color)', cursor: 'pointer', flexShrink: 0 }}
//                             />
//                             <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//                               <span style={{ fontSize: 13, fontWeight: 500 }}>{emp.name}</span>
//                               {(emp.department || emp.designation) && (
//                                 <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{emp.designation || ''}{emp.department ? ` · ${emp.department}` : ''}</span>
//                               )}
//                             </div>
//                           </label>
//                         );
//                       })}
//                     </div>
//                   ) : (
//                     <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
//                       No employees available. Add employees to the system first.
//                     </div>
//                   )}

//                   {woAssignedEmployees.length > 0 && (
//                     <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
//                       {woAssignedEmployees.length} employee{woAssignedEmployees.length > 1 ? 's' : ''} selected
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 20px', borderTop: '1px solid var(--border-color)' }}>
//                 <button type="button" className="btn btn-secondary" onClick={() => setShowWOModal(false)} disabled={woSubmitting}>Cancel</button>
//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   onClick={handleSubmitWorkOrder}
//                   disabled={woSubmitting || woAssignedEmployees.length === 0}
//                 >
//                   {woSubmitting ? 'Submitting…' : 'Confirm & Submit'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )
//       }

//       {/* ── ITEM CONSUMPTION MODAL ── */}
//       {
//         showConsumeModal && (
//           <div className="modal-overlay">
//             <div className="modal-content" style={{ maxWidth: 500, width: '90%' }}>
//               <div className="modal-header"><h3>Deduct Stock & Consume Part</h3><button onClick={() => setShowConsumeModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button></div>
//               <form onSubmit={handleConsumeItemSubmit}>
//                 <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
//                   {consumeItemsList.map((entry, idx) => (
//                     <div key={idx} style={{ border: '1px solid var(--border-color)', padding: 10, borderRadius: 6, position: 'relative', background: 'var(--bg-tertiary)' }}>
//                       {consumeItemsList.length > 1 && <button type="button" onClick={() => setConsumeItemsList(prev => prev.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: 6, right: 6, background: 'none', border: 'none', color: 'var(--text-danger)', fontSize: 14, cursor: 'pointer' }}>Remove</button>}
//                       <div className="form-group" style={{ marginBottom: 8 }}><label className="form-label" style={{ fontSize: 11 }}>Select Stock Item</label><select value={entry.itemCode} onChange={(e) => setConsumeItemsList(prev => prev.map((item, i) => i === idx ? { ...item, itemCode: e.target.value } : item))} className="form-select" required><option value="">-- Select Item --</option>{stockItems.map(s => <option key={s.code} value={s.code}>{s.name} (Qty: {s.qty} - ${s.unitCost}/ea)</option>)}</select></div>
//                       <div className="grid-2col" style={{ gap: 8, gridTemplateColumns: '1fr 2fr' }}>
//                         <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label" style={{ fontSize: 11 }}>Qty</label><input type="number" value={entry.qty} onChange={(e) => setConsumeItemsList(prev => prev.map((item, i) => i === idx ? { ...item, qty: Number(e.target.value) } : item))} className="form-input" min="1" required /></div>
//                         <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label" style={{ fontSize: 11 }}>Comment</label><input type="text" value={entry.comment} onChange={(e) => setConsumeItemsList(prev => prev.map((item, i) => i === idx ? { ...item, comment: e.target.value } : item))} className="form-input" placeholder="Note on usage" /></div>
//                       </div>
//                     </div>
//                   ))}
//                   <button type="button" className="btn btn-secondary btn-sm" onClick={() => setConsumeItemsList(prev => [...prev, { itemCode: '', qty: 1, comment: '' }])} style={{ alignSelf: 'flex-start' }}>+ Add Another Item</button>
//                 </div>
//                 <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowConsumeModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Deduct & Record</button></div>
//               </form>
//             </div>
//           </div>
//         )
//       }

//       {/* ── ESTIMATE CREATION MODAL ── */}
//       {
//         showEstimateModal && (
//           <div className="modal-overlay">
//             <div className="modal-content" style={{ maxWidth: 450 }}>
//               <div className="modal-header"><h3>Create Estimate Item</h3><button onClick={() => setShowEstimateModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button></div>
//               <form onSubmit={handleAddEstimateSubmit}>
//                 <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//                   <div className="form-group"><label className="form-label">Estimate Type</label><select value={estType} onChange={(e) => setEstType(e.target.value)} className="form-select"><option value="Material">Material</option><option value="Labour">Labour</option></select></div>
//                   {estType === 'Material' ? (
//                     <div className="form-group"><label className="form-label">Select Item</label><select value={estItemCode} onChange={(e) => setEstItemCode(e.target.value)} className="form-select" required><option value="">-- Choose Item --</option>{stockItems.map(s => <option key={s.code} value={s.code}>{s.name} (${s.unitCost}/ea)</option>)}</select></div>
//                   ) : (
//                     <div className="form-group"><label className="form-label">Labour Description</label><input type="text" value={estName} onChange={(e) => setEstName(e.target.value)} className="form-input" placeholder="e.g. Technician Labour" required /></div>
//                   )}
//                   <div className="grid-2col" style={{ gap: 12, gridTemplateColumns: '1fr 1fr' }}>
//                     <div className="form-group"><label className="form-label">{estType === 'Material' ? 'Quantity' : 'Hours'}</label><input type="number" value={estQty} onChange={(e) => setEstQty(Number(e.target.value))} className="form-input" min="1" required /></div>
//                     <div className="form-group"><label className="form-label">{estType === 'Material' ? 'Unit Cost' : 'Hourly Rate'}</label><input type="number" value={estCost} onChange={(e) => setEstCost(Number(e.target.value))} className="form-input" disabled={estType === 'Material'} placeholder={estType === 'Material' ? 'Auto-calculated' : 'e.g. 50'} required /></div>
//                   </div>
//                   <div className="form-group"><label className="form-label">Comments</label><input type="text" value={estComment} onChange={(e) => setEstComment(e.target.value)} className="form-input" placeholder="Notes on this estimate item" /></div>
//                 </div>
//                 <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowEstimateModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Add Item</button></div>
//               </form>
//             </div>
//           </div>
//         )
//       }
//     </div >
//   );
// }


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Hammer, User, Clock, CheckCircle, AlertTriangle, Plus, X, Calendar as CalendarIcon, List, BarChart3, ClipboardList, Building, Search, Activity, Settings, DollarSign, PenTool, Archive, Check, ArrowRight, UserCheck, ShieldCheck, Mail, Phone, MapPin, Award, Trash, Save, RefreshCw, Users, Briefcase } from 'lucide-react';
import TaskItemsPanel from './TaskItemsPanel';

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: bg, color: '#fff', padding: '12px 18px',
      borderRadius: 8, fontSize: 13, fontWeight: 500,
      boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
      display: 'flex', alignItems: 'center', gap: 10, maxWidth: 360,
      animation: 'slideUp 0.25s ease'
    }}>
      <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, fontSize: 16, lineHeight: 1 }}>×</button>
    </div>
  );
}

// ── Shared detail-panel helper components ────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={{ border: "1px solid var(--border-color)", borderRadius: 6, padding: 10 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{children}</div>
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div style={{ background: "var(--bg-tertiary)", borderRadius: 6, padding: "10px 12px" }}>
      <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>{title}</div>
      <div style={{ fontWeight: 600, fontSize: 13 }}>{value || "-"}</div>
    </div>
  );
}

// ── Assign Type Toggle ────────────────────────────────────────────────────────
function AssignTypeToggle({ value, onChange }) {
  return (
    <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: 3, borderRadius: 8, border: '1px solid var(--border-color)', gap: 2 }}>
      {[['employee', Users, 'Employee'], ['vendor', Briefcase, 'Vendor']].map(([key, Icon, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          style={{
            flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '7px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: value === key ? 700 : 500,
            background: value === key ? 'var(--brand-color, #2563eb)' : 'transparent',
            color: value === key ? '#fff' : 'var(--text-secondary)',
            transition: 'all 0.15s ease',
          }}
        >
          <Icon size={13} />
          {label}
        </button>
      ))}
    </div>
  );
}

// ── Multi-select checklist (used in both WO modal and task panel) ─────────────
function AssignChecklist({ items, selected, onToggle, emptyMsg, renderLabel }) {
  if (!items || items.length === 0) {
    return (
      <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
        {emptyMsg}
      </div>
    );
  }
  return (
    <div style={{ border: '1px solid var(--border-color)', borderRadius: 6, maxHeight: 220, overflowY: 'auto', background: 'var(--bg-secondary)' }}>
      {items.map((item) => {
        const id = item.id || item.name;
        const isChecked = selected.includes(id);
        return (
          <label
            key={id}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 14px', cursor: 'pointer',
              borderBottom: '1px solid var(--border-color)',
              background: isChecked ? 'var(--bg-accent-alpha)' : 'transparent',
              transition: 'background 0.1s',
            }}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle(id)}
              style={{ width: 15, height: 15, accentColor: 'var(--brand-color)', cursor: 'pointer', flexShrink: 0 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {renderLabel(item)}
            </div>
          </label>
        );
      })}
    </div>
  );
}

// ── Task Assignment Panel ─────────────────────────────────────────────────────
// Shows a toggled view: Employee table OR Vendor table with Reassign action
function TaskAssignPanel({ taskDoc, employeeDir, vendorDir, erpnextConfig, getCsrfToken, showToast, onSaved }) {

  const [assignType, setAssignType] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAssignType(taskDoc?.custom_assign.toLowerCase())
  }, [taskDoc?.custom_assign])
  const [selectedEmpIds, setSelectedEmpIds] = useState(() =>
    (taskDoc?.custom_assign_to_ || [])
      .map(r => r.emp_id)
      .filter(Boolean)
  );

  const [selectedVendorIds, setSelectedVendorIds] = useState(() =>
    (taskDoc?.custom_assign_to_vendor || [])
      .map(r => r.vendor_name)
      .filter(Boolean)
  );
  useEffect(() => {
    setSelectedEmpIds(
      (taskDoc?.custom_assign_to_ || [])
        .map(r => r.emp_id)
        .filter(Boolean)
    );

    setSelectedVendorIds(
      (taskDoc?.custom_assign_to_vendor || [])
        .map(r => r.vendor_name)
        .filter(Boolean)
    );
  }, [taskDoc]);

  const toggleEmp = (id) => setSelectedEmpIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleVendor = (id) => setSelectedVendorIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const handleReassign = async () => {
    if (!erpnextConfig?.url || !taskDoc?.name) {
      showToast("No ERPNext connection.", "error");
      return;
    }

    setSaving(true);

    try {
      let body = {};

      if (assignType === "employee") {
        // Map directly over selectedEmpIds — not over empRows
        body = {
          custom_assign_to_: selectedEmpIds.map(empId => {
            const emp = employeeDir.find(e => e.id === empId);
            return {
              emp_id: empId,
              emp_name: emp?.name || "",
              designation: emp?.certs || emp?.designation || "",
              contact_number: emp?.phone || ""
            };
          })
        };
      } else {
        body = {
          custom_assign_to_vendor: selectedVendorIds.map(vendorId => {
            const vendor = vendorDir.find(v => v.id === vendorId);
            return {
              vendor_name: vendorId,
              supplier_type: vendor?.type || ""
            };
          })
        };
      }

      console.log("Sending Body:", JSON.stringify(body, null, 2));

      const res = await fetch(
        `${erpnextConfig.url}/api/resource/Task/${taskDoc.name}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-Frappe-CSRF-Token": getCsrfToken(),
          },
          body: JSON.stringify(body),
        }
      );

      const json = await res.json();
      console.log("Response:", json);

      if (!res.ok) {
        showToast(json?.exception || "Failed to update assignment.", "error");
        return;
      }

      showToast(
        `${assignType === "employee" ? "Employees" : "Vendors"} updated successfully.`,
        "success"
      );

      if (onSaved) onSaved(json.data);
    } catch (err) {
      console.error(err);
      showToast("Error saving assignment.", "error");
    } finally {
      setSaving(false);
    }
  };
  const empRows = (taskDoc?.custom_assign_to_ || []);
  const vendorRows = (taskDoc?.custom_assign_to_vendor || []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Toggle */}
      {/* <AssignTypeToggle value={assignType} onChange={setAssignType} /> */}

      {/* Current assignments table */}
      {assignType === 'employee' ? (
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>
            Current Employees
          </div>
          {empRows.length === 0 ? (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '8px 10px', background: 'var(--bg-tertiary)', borderRadius: 6 }}>No employees assigned yet.</div>
          ) : (
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 6, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)' }}>
                    <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>Emp ID</th>
                    <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>Name</th>
                    <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>Designation</th>
                    <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {empRows.map((r, i) => {
                    // const match = employeeDir.find(e => e.id === (r.employee || r.name));
                    const match = employeeDir.find(e => e.id === r.emp_id);
                    return (
                      <tr key={r.name || i} style={{ borderBottom: i < empRows.length - 1 ? '1px solid var(--border-color)' : 'none', background: i % 2 === 0 ? 'transparent' : 'var(--bg-tertiary)' }}>
                        <td style={{ padding: '7px 10px', color: 'var(--brand-color)', fontWeight: 600 }}>{r.emp_id || r.employee || r.name}</td>
                        <td style={{ padding: '7px 10px' }}>{r.emp_name || match?.name || '—'}</td>
                        <td style={{ padding: '7px 10px', color: 'var(--text-secondary)' }}>{r.designation || match?.certs || '—'}</td>
                        <td style={{ padding: '7px 10px', color: 'var(--text-secondary)' }}>{r.contact_number || match?.phone || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Reassign checklist */}
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Reassign Employees
            </div>
            <AssignChecklist
              items={employeeDir}
              selected={selectedEmpIds}
              onToggle={toggleEmp}
              emptyMsg="No employees available in the system."
              renderLabel={(emp) => (
                <>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{emp.name}</span>
                  {(emp.certs || emp.skill) && (
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{emp.certs || ''}{emp.skill ? ` · ${emp.skill}` : ''}</span>
                  )}
                </>
              )}
            />
            {selectedEmpIds.length > 0 && (
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 5 }}>
                {selectedEmpIds.length} employee{selectedEmpIds.length > 1 ? 's' : ''} selected
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>
            Current Vendors
          </div>
          {vendorRows.length === 0 ? (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '8px 10px', background: 'var(--bg-tertiary)', borderRadius: 6 }}>No vendors assigned yet.</div>
          ) : (
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 6, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)' }}>
                    <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>Vendor ID</th>
                    <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>Vendor Name</th>
                    <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>Supplier Type</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorRows.map((r, i) => {
                    // const match = vendorDir.find(v => v.id === (r.vendor || r.name));
                    const match = vendorDir.find(v => v.id === r.vendor_name);
                    return (
                      <tr key={r.name || i} style={{ borderBottom: i < vendorRows.length - 1 ? '1px solid var(--border-color)' : 'none', background: i % 2 === 0 ? 'transparent' : 'var(--bg-tertiary)' }}>
                        <td style={{ padding: '7px 10px', color: 'var(--brand-color)', fontWeight: 600 }}>{r.vendor || r.name}</td>
                        <td style={{ padding: '7px 10px' }}>{match?.name || r.vendor || '—'}</td>
                        <td style={{ padding: '7px 10px', color: 'var(--text-secondary)' }}>{match?.type || r.supplier_type || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Reassign checklist */}
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Reassign Vendors
            </div>
            <AssignChecklist
              items={vendorDir}
              selected={selectedVendorIds}
              onToggle={toggleVendor}
              emptyMsg="No vendors available in the system."
              renderLabel={(v) => (
                <>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{v.name}</span>
                  {v.type && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{v.type}</span>}
                </>
              )}
            />
            {selectedVendorIds.length > 0 && (
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 5 }}>
                {selectedVendorIds.length} vendor{selectedVendorIds.length > 1 ? 's' : ''} selected
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reassign button */}
      <button
        type="button"
        onClick={handleReassign}
        disabled={saving || (assignType === 'employee' ? selectedEmpIds.length === 0 : selectedVendorIds.length === 0)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          padding: '9px 0', borderRadius: 7, border: 'none', cursor: 'pointer',
          fontSize: 12, fontWeight: 700,
          background: saving ? 'var(--bg-tertiary)' : 'var(--brand-color, #2563eb)',
          color: saving ? 'var(--text-secondary)' : '#fff',
          opacity: (assignType === 'employee' ? selectedEmpIds.length === 0 : selectedVendorIds.length === 0) ? 0.5 : 1,
          transition: 'all 0.15s ease',
          marginTop: 2,
        }}
      >
        {saving ? <><RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Save size={13} /> Reassign {assignType === 'employee' ? 'Employees' : 'Vendors'}</>}
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </button>
    </div>
  );
}

export default function Maintenance({
  schedules = [],
  visits = [],
  tenants = [],
  properties = [],
  preSelectedProperty = null,
  clearPreSelectedProperty,
  preSelectedIssue = null,
  clearPreSelectedIssue,
  onCreateSchedule,
  onUpdateScheduleDate,
  onUpdateScheduleStatus,
  onUpdateVisitStatus,
  erpnextConfig,
  employees = [],
  vendors = [],
  onAssignResource,
  onCreateVisit
}) {
  const [activeSection, setActiveSection] = useState('schedule');
  const [viewMode, setViewMode] = useState('list');
  const [maintenanceSearch, setMaintenanceSearch] = useState('');

  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleSelectSchedule = async (sch) => {
    setSelectedSchedule(sch);
    if (!erpnextConfig?.url || !sch?.name) return;
    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Maintenance%20Schedule/${encodeURIComponent(sch.name)}`, { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        const fullDoc = json.data || json;
        setSelectedSchedule(fullDoc);
      }
    } catch (e) {
      console.warn("Failed fetching detailed schedule on select:", e);
    }
  };

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = selectedSchedule ? 6 : 10;
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedTechnician, setSelectedTechnician] = useState(null);

  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(5);
  const [selectedDateStr, setSelectedDateStr] = useState('2026-06-17');

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showWOModal, setShowWOModal] = useState(false);
  const [custom_maintenance_schedule, setCustomMaintenanceSchedule] = useState(null);
  const [showConsumeModal, setShowConsumeModal] = useState(false);

  // ── Toast ───────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => setToast({ message, type });

  // ── WO Modal assign-type state ──────────────────────────────────────────────
  const [woAssignType, setWoAssignType] = useState('employee');        // 'employee' | 'vendor'
  const [woAssignedEmployees, setWoAssignedEmployees] = useState([]);
  const [woAssignedVendors, setWoAssignedVendors] = useState([]);
  const [woSubmitting, setWoSubmitting] = useState(false);

  // ── Schedule header fields ──────────────────────────────────────────────────
  const [schedCustomer, setSchedCustomer] = useState('');
  const [schedTransDate, setSchedTransDate] = useState(new Date().toISOString().split('T')[0]);
  const [schedBookingId, setSchedBookingId] = useState('');
  const [schedProperty, setSchedProperty] = useState('');
  const [schedPropertyGroup, setSchedPropertyGroup] = useState('');

  // ── Schedule items child table ──────────────────────────────────────────────
  const [schedItems, setSchedItems] = useState([
    { itemCode: '', itemName: '', startDate: '', periodicity: 'Weekly', noOfVisits: 1, endDate: '' }
  ]);
  const [itemNameCache, setItemNameCache] = useState({});
  const [itemDetailCache, setItemDetailCache] = useState({});

  const [schedIssueNumber, setSchedIssueNumber] = useState('');
  const [schedPropertyId, setSchedPropertyId] = useState('');
  const [schedUnitSpec, setSchedUnitSpec] = useState('');
  const [schedStartDate, setSchedStartDate] = useState('2026-06-16');
  const [schedDescription, setSchedDescription] = useState('');
  const [schedAssetId, setSchedAssetId] = useState('');
  const [schedUnits, setSchedUnits] = useState([]);

  const [bookingDetails, setBookingDetails] = useState(null);

  const [submittingSchedule, setSubmittingSchedule] = useState(false);
  const [scheduleStatusMessage, setScheduleStatusMessage] = useState(null);

  const [bookings, setBookings] = useState([]);

  const [woEstimates, setWoEstimates] = useState({});
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [estType, setEstType] = useState('Material');
  const [estItemCode, setEstItemCode] = useState('');
  const [estName, setEstName] = useState('');
  const [estQty, setEstQty] = useState(1);
  const [estCost, setEstCost] = useState(0);
  const [estComment, setEstComment] = useState('');
  const [consumeItemsList, setConsumeItemsList] = useState([{ itemCode: '', qty: 1, comment: '' }]);

  const [localSchedules, setLocalSchedules] = useState([]);

  useEffect(() => {
    setCurrentPage(1);
  }, [maintenanceSearch, localSchedules.length]);
  const [workOrders, setWorkOrders] = useState([]);
  const [techProfiles, setTechProfiles] = useState([]);
  const [vendorDir, setVendorDir] = useState([]);
  const [assetsList, setAssetsList] = useState([]);
  const [stockItems, setStockItems] = useState([]);

  const getCsrfToken = () =>
    document.cookie.split('; ').find(row => row.startsWith('sid='))?.split('=')[1] || '';

  const getPropertyIdFromBooking = (booking) => {
    if (!booking || !properties || properties.length === 0) return '';
    const bookingValue = booking.property || booking.property_group || booking.property_unit || booking.unit || booking.unit_name || booking.unit_code;
    if (!bookingValue) return '';
    const normalized = bookingValue.toString().trim().toLowerCase();
    const match = properties.find(p => {
      const candidate = ((p.id || p.name || '') + '').toString().trim().toLowerCase();
      return candidate === normalized || (p.name || '').toString().trim().toLowerCase() === normalized || (p.id || '').toString().trim().toLowerCase() === normalized;
    });
    return match ? (match.id || match.name) : booking.property || booking.property_group || '';
  };

  const fetchBookingDetailsById = async (bookingId) => {
    if (!bookingId || !erpnextConfig?.url) return null;
    try {
      const fields = encodeURIComponent(JSON.stringify(["name", "property", "property_group", "property_unit", "unit", "unit_name", "unit_code", "customer", "customer_name", "booking_item"]));
      const res = await fetch(`${erpnextConfig.url}/api/resource/Booking/${encodeURIComponent(bookingId)}?fields=${fields}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || null;
      }
    } catch (e) {
      // ignore fetch failures and fallback to local booking data
    }
    return null;
  };

  const resolveTenantId = (customerKey) => {
    if (!customerKey || !tenants?.length) return '';
    const normalized = customerKey.toString().trim().toLowerCase();
    const match = tenants.find(t => (`${t.id}`.toLowerCase() === normalized) || (`${t.name}`.toLowerCase() === normalized));
    return match ? match.id : '';
  };

  const fetchItemDetails = async (itemCode) => {
    if (!itemCode || !erpnextConfig?.url) return { itemName: itemCode, propertyGroup: '' };
    if (itemDetailCache[itemCode]) return itemDetailCache[itemCode];
    try {
      const fields = encodeURIComponent(JSON.stringify(["item_name", "property_group", "item_group", "custom_property_group"]));
      const res = await fetch(`${erpnextConfig.url}/api/resource/Item/${encodeURIComponent(itemCode)}?fields=${fields}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        const data = json.data || {};
        const itemName = data.item_name || itemCode;
        const propertyGroup = data.property_group || data.item_group || data.custom_property_group || '';
        const result = { itemName, propertyGroup };
        setItemDetailCache(prev => ({ ...prev, [itemCode]: result }));
        setItemNameCache(prev => ({ ...prev, [itemCode]: itemName }));
        return result;
      }
    } catch (e) {
      // ignore
    }
    return { itemName: itemCode, propertyGroup: '' };
  };

  const handleSchedBookingChange = (value) => {
    setSchedBookingId(value);
    setSchedCustomer('');
    setSchedProperty('');
    setSchedPropertyGroup('');
    setSchedUnitSpec('');
    setBookingDetails(null);
    setSchedItems(prev => prev.map(row => ({ ...row, itemCode: '', itemName: '', startDate: new Date().toISOString().split('T')[0] })));
  };
  const handlemaintenanceChange = (value) => {
    setCustomMaintenanceSchedule(value);
  };
  const availableSchedUnits = useMemo(() => {
    if (!bookingDetails || !schedUnits.length) return [];

    // Extract item codes from booking_item array
    let bookingItemCodes = [];
    if (bookingDetails.booking_item && Array.isArray(bookingDetails.booking_item)) {
      bookingItemCodes = bookingDetails.booking_item.map(item => (item.item_code || '').toString().trim().toLowerCase()).filter(Boolean);
    }

    // If no booking items, return empty
    if (bookingItemCodes.length === 0) return [];

    // Filter schedUnits to show only matching booking item codes, excluding Promotional Fee and Service Charge
    const filtered = schedUnits.filter(u => {
      const unitName = (u.name || '').toString().trim().toLowerCase();
      const unitItemName = (u.item_name || '').toString().trim().toLowerCase();
      const isMatch = bookingItemCodes.includes(unitName);

      const isExcluded =
        unitName === 'promotional fee' ||
        unitName === 'service charge' ||
        unitItemName === 'promotional fee' ||
        unitItemName === 'service charge';

      return isMatch && !isExcluded;
    });

    return filtered.length > 0 ? filtered : [];
  }, [schedUnits, bookingDetails]);

  useEffect(() => {
    if (!schedBookingId) {
      setBookingDetails(null);
      return;
    }
    let cancelled = false;
    const loadBookingDetails = async () => {
      const details = await fetchBookingDetailsById(schedBookingId);
      if (cancelled) return;
      if (details) {
        setBookingDetails(details);
      } else {
        const found = bookings.find(b => b.name === schedBookingId || b.id === schedBookingId);
        setBookingDetails(found || null);
      }
    };
    loadBookingDetails();
    return () => { cancelled = true; };
  }, [schedBookingId, erpnextConfig?.url, bookings]);

  useEffect(() => {
    if (!bookingDetails) return;

    const propertyValue = getPropertyIdFromBooking(bookingDetails);
    if (propertyValue) {
      setSchedProperty(propertyValue);
    }

    const customerKey = bookingDetails.customer || bookingDetails.customer_name || '';
    const resolvedTenantId = resolveTenantId(customerKey);
    setSchedCustomer(resolvedTenantId || customerKey);

    const bookingPropertyGroup = bookingDetails.property_group || '';
    setSchedPropertyGroup(bookingPropertyGroup);

    const unitCode = bookingDetails.property_unit || bookingDetails.unit || bookingDetails.unit_name || bookingDetails.unit_code || '';
    setSchedUnitSpec(unitCode);

    // Extract booking items from booking_item array
    if (bookingDetails.booking_item && Array.isArray(bookingDetails.booking_item) && bookingDetails.booking_item.length > 0) {
      const filteredBookingItems = bookingDetails.booking_item.filter(item => {
        const code = (item.item_code || '').toString().trim().toLowerCase();
        return code !== 'promotional fee' && code !== 'service charge';
      });

      const bookingItems = filteredBookingItems.map((item, idx) => ({
        itemCode: item.item_code || '',
        itemName: '',
        startDate: new Date().toISOString().split('T')[0],
        periodicity: 'Weekly',
        noOfVisits: 1,
        endDate: ''
      }));
      setSchedItems(bookingItems.length > 0 ? bookingItems : [{
        itemCode: '',
        itemName: '',
        startDate: new Date().toISOString().split('T')[0],
        periodicity: 'Weekly',
        noOfVisits: 1,
        endDate: ''
      }]);

      // Fetch item details for each item code
      bookingItems.forEach((item, idx) => {
        if (item.itemCode) {
          fetchItemDetails(item.itemCode).then(details => {
            setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, itemName: details.itemName } : r));
            if (!bookingPropertyGroup && details.propertyGroup) {
              setSchedPropertyGroup(details.propertyGroup);
            }
          });
        }
      });
    } else if (unitCode) {
      // Fallback: use unit code as item if no booking_item exists
      setSchedItems(prev => prev.map((row, idx) => idx === 0 ? { ...row, itemCode: unitCode, itemName: '' } : row));
      fetchItemDetails(unitCode).then(details => {
        setSchedItems(prev => prev.map((row, idx) => idx === 0 ? { ...row, itemCode: unitCode, itemName: details.itemName } : row));
        if (!bookingPropertyGroup && details.propertyGroup) {
          setSchedPropertyGroup(details.propertyGroup);
        }
      });
    }
  }, [bookingDetails]);

  // ── Fetch helpers ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!showScheduleModal || !erpnextConfig?.url) return;
    fetch(`${erpnextConfig.url}/api/resource/Booking?fields=["name"]&limit_page_length=500`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        setBookings(Array.isArray(json?.data) ? json.data : []);
      })
      .catch((err) => {
        console.error('Failed to fetch bookings:', err);
        setBookings([]);
      });
  }, [showScheduleModal, erpnextConfig?.url]);

  const fetchItemName = async (itemCode) => {
    if (!itemCode || !erpnextConfig?.url) return '';
    if (itemNameCache[itemCode]) return itemNameCache[itemCode];
    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Item/${encodeURIComponent(itemCode)}?fields=%5B%22item_name%22%5D`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } });
      if (res.ok) {
        const json = await res.json();
        const name = json.data?.item_name || json.item_name || itemCode;
        setItemNameCache(prev => ({ ...prev, [itemCode]: name }));
        return name;
      }
    } catch (e) { }
    return itemCode;
  };

  const handleSchedItemCodeChange = async (idx, value) => {
    const details = value ? await fetchItemDetails(value) : { itemName: '', propertyGroup: '' };
    setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, itemCode: value, itemName: details.itemName } : r));
    if (details.propertyGroup) {
      setSchedPropertyGroup(details.propertyGroup);
    }
  };

  useEffect(() => {
    if (!erpnextConfig?.url) return;
    fetch(`${erpnextConfig.url}/api/resource/Item?fields=%5B%22name%22%2C%22item_name%22%5D&limit_page_length=500`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      .then(r => r.ok ? r.json() : null).then(json => { if (json) setSchedUnits(json.data || []); }).catch(() => { });
  }, [erpnextConfig]);

  useEffect(() => {
    const fetchItems = async () => {
      if (!erpnextConfig?.url) {
        setStockItems([
          { code: 'ITEM-001', name: 'Copper Pipe 1/2 inch', qty: 50, unitCost: 15 },
          { code: 'ITEM-002', name: 'LED Ceiling Lamp 12W', qty: 30, unitCost: 25 },
          { code: 'ITEM-003', name: 'Water Tap Ceramic Valve', qty: 20, unitCost: 40 },
          { code: 'ITEM-004', name: 'Plywood Board 8x4', qty: 15, unitCost: 35 },
          { code: 'ITEM-005', name: 'Wall paint White 5L', qty: 10, unitCost: 60 }
        ]);
        return;
      }
      try {
        const res = await fetch(`${erpnextConfig.url}/api/resource/Item?fields=%5B%22name%22%2C%22item_name%22%2C%22val_rate%22%5D&limit_page_length=200`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } });
        if (res.ok) {
          const json = await res.json();
          setStockItems((json.data || []).map(item => ({ code: item.name, name: item.item_name || item.name, qty: 100, unitCost: Number(item.val_rate) || 20 })));
        }
      } catch (e) { }
    };
    fetchItems();
  }, [erpnextConfig]);

  useEffect(() => {
    if (!erpnextConfig?.url) return;
    fetch(`${erpnextConfig.url}/api/resource/Asset?fields=%5B%22name%22%2C%22asset_name%22%2C%22item_code%22%2C%22status%22%2C%22location%22%5D&limit_page_length=200`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      .then(r => r.ok ? r.json() : null).then(json => {
        if (json) setAssetsList((json.data || []).map(a => ({ id: a.name, name: a.asset_name || a.name, item: a.item_code || 'HVAC System', status: a.status || 'Submitted', location: a.location || 'Stratford Apartments' })));
      }).catch(() => { });
  }, [erpnextConfig]);

  const fetchWorkOrders = useCallback(async () => {
    if (!erpnextConfig?.url) return;
    try {
      const res = await fetch(
        `${erpnextConfig.url}/api/resource/Task?fields=${encodeURIComponent(JSON.stringify(["*"]))}&limit_page_length=200&order_by=creation%20desc`,
        { credentials: "include", headers: { "Content-Type": "application/json" } }
      );
      if (res.ok) {
        const json = await res.json();
        setWorkOrders((json.data || []).map(t => ({
          id: t.name, property: getPropertyNameById(t.custom_property) || 'Stratford Court Apartments',
          unit: t.custom_asset || 'Flat 1A', category: t.subject ? t.subject.split(' ')[0] : 'General',
          technician: t.custom_technician || 'None', vendor: t.custom_vendor || 'None',
          estHours: 4, estCost: Number(t.custom_estimated_cost) || 150, actualCost: 0,
          status: t.status || 'Open', description: t.description || t.subject || '',
          consumedItems: [], expStartDate: t.exp_start_date, expEndDate: t.exp_end_date,
          priority: t.priority, scheduleId: t.custom_maintenance_schedule
        })));
      }
    } catch (e) { }
  }, [erpnextConfig]);

  useEffect(() => { fetchWorkOrders(); }, [fetchWorkOrders, localSchedules]);

  const fetchSchedules = useCallback(async () => {
    if (!erpnextConfig?.url) return;
    try {
      const res = await fetch(
        `${erpnextConfig.url}/api/resource/Maintenance Schedule?fields=%5B%22name%22%2C%22customer%22%2C%22customer_name%22%2C%22transaction_date%22%2C%22custom_property%22%2C%22status%22%2C%22docstatus%22%5D&limit_page_length=200&order_by=creation%20desc`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      );
      if (res.ok) {
        const json = await res.json();
        const list = json.data || [];
        // Fetch detailed schedules so that we have the items child table containing item_name
        const detailed = await Promise.all(list.map(async (sch) => {
          try {
            const detailRes = await fetch(`${erpnextConfig.url}/api/resource/Maintenance%20Schedule/${encodeURIComponent(sch.name)}`, {
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }
            });
            if (detailRes.ok) {
              const detailJson = await detailRes.json();
              return detailJson?.data || detailJson || sch;
            }
          } catch (e) {
            console.warn(`Failed to fetch detailed schedule ${sch.name}:`, e);
          }
          return sch;
        }));
        setLocalSchedules(detailed);
      }
    } catch (e) { }
  }, [erpnextConfig]);

  useEffect(() => {
    if (schedules && schedules.length > 0) {
      setLocalSchedules(schedules);
    } else {
      fetchSchedules();
    }
  }, [schedules, fetchSchedules]);

  useEffect(() => {
    setTechProfiles(employees.length > 0 ? employees.map(emp => ({
      id: emp.id || emp.name, name: emp.name,
      skill: emp.department || 'General Maintenance', certs: emp.designation || 'Technician',
      availability: emp.status === 'Active' ? 'Available' : 'On Leave',
      activeJobs: 0, phone: emp.phone || '+679 000 0000',
      email: emp.email || 'tech@carpenterestate.org', img: emp.image || ''
    })) : []);
  }, [employees]);

  useEffect(() => {
    setVendorDir(vendors.length > 0 ? vendors.map(v => ({
      id: v.id, name: v.name, group: v.supplier_group || 'Local', type: v.supplier_type || 'Services',
      rating: 4.5, quotesCount: 0, phone: v.phone || '+679 000 0000',
      email: v.email || 'vendor@carpenterestate.org', address: v.address || 'Fiji'
    })) : []);
  }, [vendors]);

  useEffect(() => {
    if (preSelectedProperty) {
      setSchedPropertyId(preSelectedProperty.id); setSchedProperty(preSelectedProperty.id);
      const t = tenants.find(t => t.propertyId === preSelectedProperty.id);
      if (t) setSchedCustomer(t.id);
      setShowScheduleModal(true); clearPreSelectedProperty();
    }
  }, [preSelectedProperty, tenants, clearPreSelectedProperty]);

  useEffect(() => {
    if (preSelectedIssue) {
      setSchedIssueNumber(preSelectedIssue.id || ''); setSchedDescription(preSelectedIssue.subject || '');
      const mt = tenants.find(t => t.name === preSelectedIssue.tenantName || t.id === preSelectedIssue.customerId || t.name === preSelectedIssue.customerId);
      if (mt) {
        setSchedCustomer(mt.id);
        if (mt.propertyId) { setSchedPropertyId(mt.propertyId); setSchedProperty(mt.propertyId); }
        if (mt.unitSpec) setSchedUnitSpec(mt.unitSpec);
      }
      setShowScheduleModal(true);
      if (clearPreSelectedIssue) clearPreSelectedIssue();
    }
  }, [preSelectedIssue, tenants, clearPreSelectedIssue]);

  const getPropertyNameById = (propId) => {
    const prop = (properties || []).find(p => p.id === propId || p.name === propId);
    return prop ? prop.name : 'Stratford Court Apartments';
  };

  // ── Drag & drop ─────────────────────────────────────────────────────────────
  const handleDragStart = (e, scheduleName) => e.dataTransfer.setData('text/plain', scheduleName);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const scheduleName = e.dataTransfer.getData('text/plain');
    if (scheduleName) {
      setLocalSchedules(prev => prev.map(s => s.name === scheduleName ? { ...s, status: targetStatus } : s));
      if (onUpdateScheduleStatus) onUpdateScheduleStatus(scheduleName, targetStatus);
    }
  };

  // ── Create Schedule ─────────────────────────────────────────────────────────
  const handleCreateScheduleSubmit = async (e) => {
    e.preventDefault();
    setSubmittingSchedule(true); setScheduleStatusMessage(null);
    const tenantObj = tenants.find(t => t.id === schedCustomer);
    const customerName = tenantObj ? tenantObj.name : schedCustomer;
    const payload = {
      customer: schedCustomer, customer_name: customerName, transaction_date: schedTransDate,
      custom_booking_id: schedBookingId, custom_property: schedProperty, status: 'Draft', custom_maintenance_schedule: custom_maintenance_schedule,
      items: schedItems.map(r => ({ item_code: r.itemCode, item_name: r.itemName || r.itemCode, start_date: r.startDate, periodicity: r.periodicity, no_of_visits: Number(r.noOfVisits) || 1, end_date: r.endDate }))
    };
    try {
      await onCreateSchedule(payload);
      setScheduleStatusMessage({ type: 'success', text: 'Maintenance Schedule created successfully!' });
      setTimeout(() => { setShowScheduleModal(false); setScheduleStatusMessage(null); fetchSchedules(); }, 1200);
    } catch (err) {
      setScheduleStatusMessage({ type: 'error', text: err.message });
    } finally { setSubmittingSchedule(false); }
  };

  // ── Submit Work Order ───────────────────────────────────────────────────────
  const handleSubmitWorkOrder = async () => {
    if (!selectedSchedule) return;

    const hasEmployee = woAssignType === 'employee' && woAssignedEmployees.length > 0;
    const hasVendor = woAssignType === 'vendor' && woAssignedVendors.length > 0;
    if (!hasEmployee && !hasVendor) {
      showToast(`Please select at least one ${woAssignType} to assign.`, 'error');
      return;
    }

    setWoSubmitting(true);
    try {
      const csrfToken = getCsrfToken();

      // Step 1: Submit/approve schedule
      const approveRes = await fetch(`${erpnextConfig.url}/api/method/approve_reject_doc`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken },
        body: JSON.stringify({ doctype_name: 'Maintenance Schedule', docname: selectedSchedule.name, state_code: 1 })
      });
      if (!approveRes.ok) {
        const errText = await approveRes.text();
        throw new Error(`Failed to submit schedule: ${errText}`);
      }

      // Step 2: Poll for auto-created Task
      await new Promise(r => setTimeout(r, 3000));
      const taskSearchRes = await fetch(
        `${erpnextConfig.url}/api/resource/Task?filters=%5B%5B%22custom_mantainence_sechedule%22%2C%22%3D%22%2C%22${encodeURIComponent(selectedSchedule.name)}%22%5D%5D&fields=%5B%22name%22%5D&limit_page_length=5`,
        { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      );

      let taskName = null;
      if (taskSearchRes.ok) {
        const taskJson = await taskSearchRes.json();
        const tasks = taskJson.data || [];
        if (tasks.length > 0) taskName = tasks[0].name;
      }

      // Step 3: Assign employees or vendors to task
      if (taskName) {
        let putBody = {};

        if (woAssignType === 'employee') {
          const empRows = await Promise.all(
            woAssignedEmployees.map(async (empId) => {
              try {
                const empRes = await fetch(
                  `${erpnextConfig.url}/api/resource/Employee/${encodeURIComponent(empId)}?fields=%5B%22name%22%2C%22employee_name%22%2C%22designation%22%2C%22cell_number%22%2C%22company_email%22%5D`,
                  { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
                );
                if (empRes.ok) {
                  const empJson = await empRes.json();
                  const emp = empJson.data || empJson;
                  return { emp_id: emp.name || empId, emp_name: emp.employee_name || emp.name || empId, designation: emp.designation || '', contact_number: emp.cell_number || emp.company_email || '' };
                }
              } catch (e) { }
              const localEmp = employees.find(e => (e.id || e.name) === empId);
              return { emp_id: empId, emp_name: localEmp?.name || empId, designation: localEmp?.designation || '', contact_number: localEmp?.phone || '' };
            })
          );
          putBody = { custom_assign: "Employee", custom_assign_to_: empRows };
        } else {
          // vendor
          const vendorRows = woAssignedVendors.map(vendorId => {
            const match = vendorDir.find(v => v.id === vendorId);
            return { vendor: vendorId, vendor_name: match?.name || vendorId, supplier_type: match?.type || '' };
          });
          putBody = { custom_assign: "Vendor", custom_assign_to_vendor: vendorRows };
        }

        const putRes = await fetch(`${erpnextConfig.url}/api/resource/Task/${taskName}`, {
          method: 'PUT', credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': csrfToken },
          body: JSON.stringify(putBody)
        });

        if (!putRes.ok) {
          const errTxt = await putRes.text();
          console.warn('Assignment failed:', errTxt);
          showToast('Work order submitted. Assignment failed — check ERPNext logs.', 'info');
        } else {
          const assignCount = woAssignType === 'employee' ? woAssignedEmployees.length : woAssignedVendors.length;
          showToast(`Task submitted & ${assignCount} ${woAssignType}(s) assigned to ${taskName}!`, 'success');
        }
      } else {
        showToast('Schedule submitted. Task not yet visible — assign once it appears.', 'info');
      }

      setLocalSchedules(prev => prev.map(s => s.name === selectedSchedule.name ? { ...s, status: 'Submitted', docstatus: 1 } : s));
      setSelectedSchedule(prev => prev ? { ...prev, status: 'Submitted', docstatus: 1 } : prev);
      fetchSchedules();
      fetchWorkOrders();
      setShowWOModal(false);
      setWoAssignedEmployees([]);
      setWoAssignedVendors([]);
    } catch (err) {
      showToast(err.message || 'Submission failed.', 'error');
    } finally {
      setWoSubmitting(false);
    }
  };

  const employeeDir = techProfiles;

  const handleWOStatusChange = async (woId, newStatus) => {
    const erpStatus = newStatus === 'In Progress' ? 'Working' : newStatus === 'Completed' ? 'Completed' : 'Open';
    const update = (wo) => ({ ...wo, status: newStatus, actualCost: newStatus === 'Completed' && wo.actualCost === 0 ? wo.estCost : wo.actualCost });
    setWorkOrders(prev => prev.map(wo => wo.id === woId ? update(wo) : wo));
    setSelectedWorkOrder(prev => prev && prev.id === woId ? update(prev) : prev);
    if (erpnextConfig?.url) {
      try {
        await fetch(`${erpnextConfig.url}/api/resource/Task/${woId}`, {
          method: 'PUT', credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': getCsrfToken() },
          body: JSON.stringify({ status: erpStatus })
        });
      } catch (e) { }
    }
  };

  const handleSchedCustomerChange = async (customerName) => {

    setSchedCustomer(customerName);

    if (!customerName || !erpnextConfig?.url) {
      return;
    }

    try {

      const filters = encodeURIComponent(
        JSON.stringify([
          ["customer", "=", customerName],
          ["docstatus", "=", 1]
        ])
      );

      const url =
        `${erpnextConfig.url}/api/resource/Booking` +
        `?filters=${filters}` +
        `&limit_page_length=200` +
        `&order_by=creation desc`;

      console.log("Customer:", customerName);
      console.log("URL:", url);

      const res = await fetch(url, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const json = await res.json();

      console.log("Response:", json);

      if (!res.ok) {
        throw new Error(
          json.exception ||
          json.exc_type ||
          "Booking API failed"
        );
      }

      const bookings = json.data || [];

      if (!bookings.length) {
        frappe.msgprint(
          `No submitted booking found for ${customerName}`
        );
        return;
      }

      // Latest booking
      const booking = bookings[0];

      setSchedBookingId(booking.name);
      setBookingDetails(booking);

      // Fetch complete booking document
      const detailRes = await fetch(
        `${erpnextConfig.url}/api/resource/Booking/${encodeURIComponent(booking.name)}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const detailJson = await detailRes.json();

      if (!detailRes.ok) {
        throw new Error(
          detailJson.exception ||
          "Unable to fetch complete booking details"
        );
      }

      const fullBooking = detailJson.data;

      setBookingDetails(fullBooking);

      // Commercial units only, excluding Promotional Fee and Service Charge
      const commercialItems = (fullBooking.booking_item || [])
        .filter(item => {
          const code = (item.item_code || '').toString().trim().toLowerCase();
          return item.unit_group === "Commercial" && code !== 'promotional fee' && code !== 'service charge';
        });

      const scheduleItems = commercialItems.map(item => ({
        itemCode: item.item_code,
        itemName: item.item_code,
        startDate: fullBooking.start_date || "",
        periodicity: "",
        noOfVisits: 1,
        endDate: fullBooking.end_date || ""
      }));

      setSchedItems(
        scheduleItems.length
          ? scheduleItems
          : [{
            itemCode: "",
            itemName: "",
            startDate: fullBooking.start_date || "",
            periodicity: "",
            noOfVisits: 1,
            endDate: fullBooking.end_date || ""
          }]
      );

    } catch (error) {

      console.error("Customer Booking Error:", error);

      frappe.msgprint({
        title: __("Error"),
        indicator: "red",
        message: error.message
      });
    }
  };

  const handleConsumeItemSubmit = (e) => {
    e.preventDefault();
    if (!selectedWorkOrder) return;
    let totalCost = 0; const newConsumedItems = [];
    for (const entry of consumeItemsList) {
      if (!entry.itemCode) continue;
      const item = stockItems.find(s => s.code === entry.itemCode);
      if (!item) continue;
      if (item.qty < entry.qty) { showToast(`Insufficient stock for ${item.name}`, 'error'); return; }
      setStockItems(prev => prev.map(s => s.code === entry.itemCode ? { ...s, qty: s.qty - entry.qty } : s));
      const cost = item.unitCost * entry.qty; totalCost += cost;
      newConsumedItems.push({ item: item.name, itemCode: entry.itemCode, qty: entry.qty, cost, comment: entry.comment || '' });
    }
    if (newConsumedItems.length === 0) return;
    const updateWO = (wo) => ({ ...wo, consumedItems: [...(wo.consumedItems || []), ...newConsumedItems], actualCost: wo.actualCost + totalCost });
    setWorkOrders(prev => prev.map(wo => wo.id === selectedWorkOrder.id ? updateWO(wo) : wo));
    setSelectedWorkOrder(prev => prev && prev.id === selectedWorkOrder.id ? updateWO(prev) : prev);
    setConsumeItemsList([{ itemCode: '', qty: 1, comment: '' }]);
    setShowConsumeModal(false);
  };

  const handleAddEstimateSubmit = (e) => {
    e.preventDefault();
    if (!selectedWorkOrder) return;
    let finalName = estName, finalCost = Number(estCost);
    if (estType === 'Material' && estItemCode) {
      const m = stockItems.find(s => s.code === estItemCode);
      if (m) { finalName = m.name; finalCost = m.unitCost * estQty; }
    }
    const newEst = { id: `EST-${Date.now()}`, type: estType, itemCode: estType === 'Material' ? estItemCode : '', name: finalName || (estType === 'Labour' ? 'General Labour' : 'Material Item'), qty: Number(estQty) || 1, cost: finalCost, comment: estComment || '' };
    setWoEstimates(prev => ({ ...prev, [selectedWorkOrder.id]: [...(prev[selectedWorkOrder.id] || []), newEst] }));
    setEstType('Material'); setEstItemCode(''); setEstName(''); setEstQty(1); setEstCost(0); setEstComment('');
    setShowEstimateModal(false);
  };

  const handleGenerateQuotation = async (woId) => {
    const estimates = woEstimates[woId] || [];
    if (estimates.length === 0) { showToast('No estimates to generate quotation!', 'error'); return; }
    const customerId = selectedWorkOrder.customerId || (tenants[0]?.id || 'Customer-N/A');
    const payload = { quotation_to: 'Customer', party_name: customerId, transaction_date: new Date().toISOString().split('T')[0], company: 'CARPENTERS PROPERTIES PTE LIMITED', valid_till: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], items: estimates.map(e => ({ item_code: e.itemCode || 'General Item', qty: Number(e.qty) || 1, rate: Number(e.cost) / (Number(e.qty) || 1), description: e.comment || e.name || 'Estimate Item' })) };
    if (erpnextConfig?.url) {
      try {
        const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': getCsrfToken() }, body: JSON.stringify(payload) });
        if (res.ok) { const json = await res.json(); showToast(`Quotation ${json.data?.name || ''} generated!`, 'success'); }
        else showToast('Failed to generate Quotation.', 'error');
      } catch (e) { showToast('Error generating quotation.', 'error'); }
    } else { showToast(`Simulation: Quotation for ${customerId} with ${estimates.length} items.`, 'info'); }
  };

  const filteredSchedules = localSchedules.filter(sch => {
    const term = maintenanceSearch.toLowerCase();
    const propName = getPropertyNameById(sch.custom_property) || '';
    const itemName = sch.items?.[0]?.item_name || '';
    return sch.name.toLowerCase().includes(term) || 
      (sch.customer_name || sch.customer || '').toLowerCase().includes(term) || 
      propName.toLowerCase().includes(term) || 
      itemName.toLowerCase().includes(term) ||
      (sch.type || '').toLowerCase().includes(term);
  });

  const sortedSchedules = useMemo(() => {
    return [...filteredSchedules].sort((a, b) => {
      const keyA = a.creation || a.name || '';
      const keyB = b.creation || b.name || '';
      return keyB.localeCompare(keyA);
    });
  }, [filteredSchedules]);

  const totalPages = Math.ceil(sortedSchedules.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSchedules = sortedSchedules.slice(indexOfFirstItem, indexOfLastItem);

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

  const thStyle = { padding: '8px 10px', textAlign: 'left', fontWeight: 600, fontSize: 11, color: 'var(--text-secondary, #6b7280)', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' };
  const inputStyle = { width: '100%', fontSize: 12, minHeight: 32, padding: '5px 8px', boxSizing: 'border-box' };

  const isScheduleSubmitted = (sch) => sch && (sch.docstatus === 1 || (sch.status || '').toLowerCase() === 'submitted');

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="view-header" style={{ flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="view-title">Maintenance Ops & Facility management</h1>
          <p className="view-subtitle">Roster preventative maintenance visits, manage work orders, assign tasks, and track logs.</p>
        </div>
        <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: 4, borderRadius: 8, border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          {[['schedule', 'Maintenance Schedule'], ['task', 'Task Operations'], ['technician', 'Technicians'], ['vendor', 'Vendors'], ['asset', 'Assets']].map(([key, label], i) => (
            <button key={key} className={`btn btn-sm ${activeSection === key ? 'btn-primary' : 'btn-secondary'}`} style={{ marginLeft: i > 0 ? 4 : 0 }} onClick={() => setActiveSection(key)}>{label}</button>
          ))}
        </div>
      </div>

      {/* ── SECTION 1: MAINTENANCE SCHEDULES ── */}
      {activeSection === 'schedule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Search size={16} />
                <input type="text" placeholder="Search schedules..." className="form-input" style={{ width: 200, padding: '4px 10px' }} value={maintenanceSearch} onChange={(e) => setMaintenanceSearch(e.target.value)} />
              </div>
              <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: 2, borderRadius: 6 }}>
                {['list', 'kanban', 'calendar'].map(mode => (
                  <button key={mode} className={`btn btn-sm ${viewMode === mode ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 8px', fontSize: 10, textTransform: 'capitalize' }} onClick={() => setViewMode(mode)}>{mode}</button>
                ))}
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowScheduleModal(true)}><Plus size={14} /> New Schedule</button>
          </div>

          <div className="grid-2col" style={{ gridTemplateColumns: selectedSchedule ? '60% calc(40% - 24px)' : '1fr', gap: 24 }}>
            {viewMode === 'list' && (
              <div className="card-panel" style={{
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
                filter: selectedSchedule ? 'blur(4px)' : 'none',
                transition: 'filter 0.3s ease'
              }}>
                <div className="table-container" style={{ flex: 1, overflowY: 'auto' }}>
                  <table className="custom-table">
                    <thead><tr><th>Schedule ID</th><th>Type</th><th>Tenant / Partner</th><th>Unit Name</th><th>Periodicity</th><th>Status</th></tr></thead>
                    <tbody>
                      {currentSchedules.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                            No schedules found.
                          </td>
                        </tr>
                      ) : (
                        currentSchedules.map(sch => {
                          const firstItem = sch.items?.[0];
                          return (
                            <tr key={sch.name} onClick={() => handleSelectSchedule(sch)} style={{ cursor: 'pointer', backgroundColor: selectedSchedule?.name === sch.name ? 'var(--bg-accent-alpha)' : '' }}>
                              <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{sch.name}</td>
                              <td><span className="badge badge-secondary" style={{ textTransform: 'none' }}>{sch.custom_maintenance_schedule || 'PM Schedule'}</span></td>
                              <td>{sch.customer_name || sch.customer}</td>
                              <td>{firstItem ? firstItem.item_name : '—'}</td>
                              <td>{firstItem ? firstItem.periodicity : '—'}</td>
                              <td><span className={`badge ${sch.status === 'Completed' ? 'badge-success' : isScheduleSubmitted(sch) ? 'badge-info' : 'badge-warning'}`}>{sch.status || 'Draft'}</span></td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                {renderPaginationControls()}
              </div>
            )}

            {viewMode === 'kanban' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                {['Pending', 'In Progress', 'Completed'].map(status => {
                  const statusSchedules = sortedSchedules.filter(s => {
                    const raw = (s.status || '').toLowerCase();
                    let norm = 'Pending';
                    if (raw === 'completed' || raw === 'closed') norm = 'Completed';
                    else if (raw === 'in progress' || raw === 'submitted') norm = 'In Progress';
                    return norm === status;
                  });
                  return (
                    <div key={status} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, status)} style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 8, minHeight: 300 }}>
                      <h3 style={{ fontSize: 13, marginBottom: 10, borderBottom: '2px solid var(--border-color)', paddingBottom: 6 }}>{status} ({statusSchedules.length})</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {statusSchedules.map(sch => {
                          const firstItem = sch.items?.[0];
                          return (
                            <div key={sch.name} draggable onDragStart={(e) => handleDragStart(e, sch.name)} onClick={() => handleSelectSchedule(sch)} style={{ background: 'var(--bg-secondary)', padding: 10, borderRadius: 6, border: '1px solid var(--border-color)', cursor: 'grab' }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-color)' }}>{sch.name}</div>
                              <div style={{ fontSize: 12, fontWeight: 600 }}>{sch.customer_name || sch.customer}</div>
                              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Unit Name: {firstItem ? firstItem.item_name : '—'}</div>
                              <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>Type: {sch.type}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === 'calendar' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
                <div className="card-panel" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: 14, margin: 0 }}>{new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-xs" onClick={() => { if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); } else setCalendarMonth(m => m - 1); }}>Prev</button>
                      <button className="btn btn-secondary btn-xs" onClick={() => { if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); } else setCalendarMonth(m => m + 1); }}>Next</button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center', fontWeight: 600, fontSize: 11, marginBottom: 8, color: 'var(--text-secondary)' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                    {(() => {
                      const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
                      const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
                      const cells = [];
                      for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} style={{ height: 50 }} />);
                      for (let day = 1; day <= totalDays; day++) {
                        const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const daySchedules = sortedSchedules.filter(s => s.transaction_date === dateStr);
                        const isSelected = selectedDateStr === dateStr;
                        const isToday = calendarYear === 2026 && calendarMonth === 5 && day === 17;
                        cells.push(
                          <div key={`d-${day}`} onClick={() => setSelectedDateStr(dateStr)} style={{ height: 50, border: `1px solid ${isSelected ? 'var(--brand-color)' : 'var(--border-color)'}`, borderRadius: 4, background: isSelected ? 'var(--bg-accent-alpha)' : isToday ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', padding: 4, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.15s ease' }}>
                            <span style={{ fontSize: 10, fontWeight: isToday || isSelected ? 700 : 400 }}>{day}</span>
                            {daySchedules.length > 0 && <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>{daySchedules.map(s => <span key={s.name} style={{ width: 6, height: 6, borderRadius: '50%', background: s.status === 'Completed' ? '#10b981' : '#f59e0b', display: 'inline-block' }} />)}</div>}
                          </div>
                        );
                      }
                      return cells;
                    })()}
                  </div>
                </div>
                <div className="card-panel" style={{ padding: 16 }}>
                  <h4 style={{ fontSize: 12, marginBottom: 10, color: 'var(--text-secondary)' }}>Schedules for: <strong>{selectedDateStr}</strong></h4>
                  {(() => {
                    const daySchedules = sortedSchedules.filter(s => s.transaction_date === selectedDateStr);
                    if (daySchedules.length === 0) return <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>No schedules planned for this day.</div>;
                    return <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{daySchedules.map(sch => <div key={sch.name} onClick={() => handleSelectSchedule(sch)} style={{ padding: 10, background: 'var(--bg-tertiary)', borderLeft: '4px solid var(--brand-color)', borderRadius: 4, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><strong style={{ fontSize: 12 }}>{sch.name} ({sch.type})</strong><div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Tenant: {sch.customer_name || sch.customer} | Unit Name: {sch.items?.[0]?.item_name || '—'}</div></div><span className={`badge ${sch.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>{sch.status || 'Pending'}</span></div>)}</div>;
                  })()}
                </div>
              </div>
            )}

            {/* ── Schedule detail panel ── */}
            {selectedSchedule && (
              <div className="card-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
                  <strong>{selectedSchedule.name}</strong>
                  <button onClick={() => setSelectedSchedule(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                  <div>Type: <strong>{selectedSchedule.custom_maintenance_schedule || 'PM Schedule'}</strong></div>
                  <div>Unit Name: <strong>{selectedSchedule.items?.[0]?.item_name || '—'}</strong></div>
                  <div>Tenant: <strong>{selectedSchedule.customer_name || selectedSchedule.customer}</strong></div>
                  <div>Date: <strong>{selectedSchedule.transaction_date}</strong></div>
                  {/* <div>Task Id: <strong>{selectedSchedule.type || '—'}</strong></div> */}
                  <div>Status: <span className={`badge ${isScheduleSubmitted(selectedSchedule) ? 'badge-info' : 'badge-warning'}`}>{selectedSchedule.status || 'Draft'}</span></div>
                </div>

                {!isScheduleSubmitted(selectedSchedule) ? (
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: 10, width: '100%', background: '#ffdd00', color: '#000', fontWeight: 700 }}
                    onClick={() => { setWoAssignedEmployees([]); setWoAssignedVendors([]); setWoAssignType('employee'); setShowWOModal(true); }}
                  >
                    <Hammer size={14} style={{ marginRight: 6 }} /> Assign Task
                  </button>
                ) : (
                  <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(16,185,129,0.08)', borderRadius: 6, fontSize: 12, color: '#10b981', textAlign: 'center', fontWeight: 600 }}>
                    ✓ Task Assigned
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SECTION 2: WORK ORDERS / TASKS ── */}
      {activeSection === 'task' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Maintenance Task list</span>
          </div>
          <div className="grid-2col" style={{ gridTemplateColumns: selectedWorkOrder ? '60% calc(40% - 24px)' : '1fr', gap: 24 }}>
            <div className="card-panel" style={{
              padding: 0,
              filter: selectedWorkOrder ? 'blur(4px)' : 'none',
              transition: 'filter 0.3s ease'
            }}>
              <div className="table-container">
                <table className="custom-table">
                  <thead><tr><th>ID</th><th>Property</th><th>Category</th><th>Estimated Cost</th><th>Status</th></tr></thead>
                  <tbody>
                    {workOrders.map(wo => (
                      <tr key={wo.id} onClick={async () => {
                        try {
                          const res = await fetch(`${erpnextConfig.url}/api/resource/Task/${wo.id}`, { credentials: "include", headers: { "Content-Type": "application/json" } });
                          if (res.ok) { const json = await res.json(); setSelectedWorkOrder(json.data); }
                          else setSelectedWorkOrder(wo);
                        } catch (err) { setSelectedWorkOrder(wo); }
                      }} style={{ cursor: 'pointer', backgroundColor: selectedWorkOrder?.name === wo.id || selectedWorkOrder?.id === wo.id ? 'var(--bg-accent-alpha)' : '' }}>
                        <td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{wo.id}</td>
                        <td>{wo.property}</td><td>{wo.category}</td>
                        <td>${wo.estCost.toLocaleString()}</td>
                        <td><span className={`badge ${wo.status === 'Completed' ? 'badge-success' : wo.status === 'Pending Approval' ? 'badge-warning' : 'badge-info'}`}>{wo.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Task detail panel ── */}
            {selectedWorkOrder && (
              <div className="card-panel" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10, maxHeight: "calc(100vh - 160px)", overflowY: "auto", fontSize: 12 }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border-color)", paddingBottom: 8 }}>
                  <div>
                    <strong style={{ fontSize: 14 }}>{selectedWorkOrder.name}</strong>
                    <div style={{ color: "var(--text-secondary)", marginTop: 2, fontSize: 11 }}>{selectedWorkOrder.subject}</div>
                  </div>
                  <button onClick={() => setSelectedWorkOrder(null)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 2 }}><X size={15} /></button>
                </div>

                {/* Status badges */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span className="badge badge-info" style={{ fontSize: 10, padding: "2px 8px" }}>{selectedWorkOrder.status}</span>
                  <span className="badge badge-warning" style={{ fontSize: 10, padding: "2px 8px" }}>{selectedWorkOrder.priority}</span>
                  <span className="badge badge-success" style={{ fontSize: 10, padding: "2px 8px" }}>{selectedWorkOrder.progress || 0}% Complete</span>
                </div>

                {/* Reference info */}
                <Section title="Reference">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <Info title="Schedule" value={selectedWorkOrder.custom_mantainence_sechedule} />
                    <Info title="Booking" value={selectedWorkOrder.custom_booking_number} />
                    <Info title="Tenant" value={selectedWorkOrder.custom_customer_name} />
                    <Info title="Company" value={selectedWorkOrder.company} />
                    <Info title="Created" value={selectedWorkOrder.creation?.split(".")[0]} />
                    <Info title="Owner" value={selectedWorkOrder.owner} />
                  </div>
                </Section>

                {/* Cost */}
                <Section title="Cost">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <Info title="Costing" value={`$${Number(selectedWorkOrder.total_costing_amount || 0).toLocaleString()}`} />
                    <Info title="Billing" value={`$${Number(selectedWorkOrder.total_billing_amount || 0).toLocaleString()}`} />
                  </div>
                </Section>

                {/* ── Assignment Panel ── */}
                <Section title="Assignments">
                  <TaskItemsPanel
                    taskDoc={selectedWorkOrder}
                    employeeDir={employeeDir}
                    vendorDir={vendorDir}
                    erpnextConfig={erpnextConfig}
                    getCsrfToken={getCsrfToken}
                    showToast={showToast}
                    // onSaved={(updatedData) => {
                    //   setSelectedWorkOrder(updatedData);
                    //   setWorkOrders(prev => prev.map(wo => wo.id === updatedData.name ? { ...wo, technician: (updatedData.custom_assign_to_ || [])[0]?.employee || wo.technician, vendor: (updatedData.custom_assign_to_vendor || [])[0]?.vendor || wo.vendor } : wo));
                    // }}
                    onSaved={(updatedData) => {
                      setSelectedWorkOrder(updatedData);
                      setWorkOrders(prev => prev.map(wo =>
                        wo.id === updatedData.name
                          ? {
                            ...wo,
                            technician: (updatedData.custom_assign_to_ || [])[0]?.emp_id || wo.technician,
                            vendor: (updatedData.custom_assign_to_vendor || [])[0]?.vendor_name || wo.vendor,
                            status: updatedData.status || wo.status,
                            docstatus: updatedData.docstatus,
                            itemsUsed: updatedData.custom_items_used_for_maintenance || wo.itemsUsed,
                          }
                          : wo
                      ));
                    }}
                    aftersucess={() => {
                      fetchWorkOrders();
                      // setSelectedWorkOrder(null);
                    }}
                  />
                </Section>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SECTION 3: TECHNICIANS ── */}
      {activeSection === 'technician' && (
        <div className="grid-2col" style={{ gridTemplateColumns: selectedTechnician ? '60% calc(40% - 24px)' : '1fr', gap: 24 }}>
          <div className="card-panel" style={{
            filter: selectedTechnician ? 'blur(4px)' : 'none',
            transition: 'filter 0.3s ease'
          }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Active Technicians Directory</h3>
            <div className="table-container">
              <table className="custom-table">
                <thead><tr><th>Tech Name</th><th>Skill Category</th><th>Certifications</th><th>Availability</th></tr></thead>
                <tbody>{techProfiles.map(tech => <tr key={tech.id} onClick={() => setSelectedTechnician(tech)} style={{ cursor: 'pointer', backgroundColor: selectedTechnician?.id === tech.id ? 'var(--bg-accent-alpha)' : '' }}><td><strong>{tech.name}</strong></td><td>{tech.skill}</td><td>{tech.certs}</td><td><span className={`badge ${tech.availability === 'Available' ? 'badge-success' : 'badge-warning'}`}>{tech.availability}</span></td></tr>)}</tbody>
              </table>
            </div>
          </div>
          {selectedTechnician && (
            <div className="card-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}><strong>{selectedTechnician.name} Details</strong><button onClick={() => setSelectedTechnician(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button></div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8 }}>
                <img src={selectedTechnician.img} alt={selectedTechnician.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-color)' }} />
                <div><h4 style={{ fontSize: 14, margin: 0 }}>{selectedTechnician.name}</h4><span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Skill: {selectedTechnician.skill}</span></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Award size={14} /> Certs: {selectedTechnician.certs}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={14} /> Phone: {selectedTechnician.phone}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={14} /> Email: {selectedTechnician.email}</div>
                <div>Status: <span className="badge badge-success">{selectedTechnician.availability}</span></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SECTION 4: VENDORS ── */}
      {activeSection === 'vendor' && (
        <div className="grid-2col" style={{ gridTemplateColumns: selectedVendor ? '60% calc(40% - 24px)' : '1fr', gap: 24 }}>
          <div className="card-panel" style={{
            filter: selectedVendor ? 'blur(4px)' : 'none',
            transition: 'filter 0.3s ease'
          }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Vendor Directory & Quotations Log</h3>
            <div className="table-container">
              <table className="custom-table">
                <thead><tr><th>Vendor ID</th><th>Vendor Name</th><th>Service Category</th><th>Rating</th></tr></thead>
                <tbody>{vendorDir.map(v => <tr key={v.id} onClick={() => setSelectedVendor(v)} style={{ cursor: 'pointer', backgroundColor: selectedVendor?.id === v.id ? 'var(--bg-accent-alpha)' : '' }}><td style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{v.id}</td><td>{v.name}</td><td>{v.type}</td><td>⭐ {v.rating}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
          {selectedVendor && (
            <div className="card-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}><strong>{selectedVendor.name} Details</strong><button onClick={() => setSelectedVendor(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                <div>Vendor Group: <strong>{selectedVendor.group}</strong></div><div>Category Type: <strong>{selectedVendor.type}</strong></div>
                <div>Phone: <strong>{selectedVendor.phone}</strong></div><div>Email: <strong>{selectedVendor.email}</strong></div>
                <div>Address: <strong>{selectedVendor.address}</strong></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SECTION 5: ASSETS ── */}
      {activeSection === 'asset' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card-panel">
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Assets Warranty & AMC Management</h3>
            <div className="table-container">
              <table className="custom-table">
                <thead><tr><th>Asset ID</th><th>Asset Name</th><th>Property Name</th><th>Warranty Expiry</th><th>AMC status</th><th>Breakdowns YTD</th></tr></thead>
                <tbody>{assetsList.map(a => <tr key={a.id}><td style={{ fontWeight: 600 }}>{a.id}</td><td>{a.name}</td><td><strong>{getPropertyNameById(a.propertyId)}</strong></td><td>{a.warranty}</td><td>Active Contract ({a.amc})</td><td><span className="badge badge-success">{a.breakdownCount} breakdowns</span></td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE MAINTENANCE SCHEDULE MODAL ── */}
      {showScheduleModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 740, width: '96vw', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Create Maintenance Schedule</h3>
              <button onClick={() => setShowScheduleModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 0 }}>×</button>
            </div>
            <form onSubmit={handleCreateScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '20px', overflowY: 'auto', flex: 1 }}>
                {scheduleStatusMessage && (
                  <div style={{ background: scheduleStatusMessage.type === 'success' ? 'rgba(6,95,70,0.1)' : 'rgba(239,68,68,0.1)', color: scheduleStatusMessage.type === 'success' ? '#10b981' : '#ef4444', padding: '10px 12px', borderRadius: 6, fontSize: 12 }}>
                    {scheduleStatusMessage.text}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Tenant Name</label>
                    {/* <select value={schedBookingId} onChange={(e) => handleSchedBookingChange(e.target.value)} className="form-select" required disabled={submittingSchedule} style={{ fontSize: 13, boxSizing: 'border-box' }}>
                      <option value="">-- Choose Booking --</option>
                      {bookings.length === 0 ? (
                        <option value="" disabled>{erpnextConfig?.url ? 'Loading bookings...' : 'ERPNext URL not configured'}</option>
                      ) : bookings.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                    </select> */}
                    <select className="form-select" required
                      value={schedCustomer}
                      onChange={(e) => handleSchedCustomerChange(e.target.value)}
                    >
                      <option value="">-- Choose Tenant --</option>

                      {tenants.map(customer => (
                        <option
                          key={customer.name}
                          value={customer.name}
                        >
                          {customer.customer_name || customer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Tenant Name</label>
                    {/* <input type="text" value={bookingDetails?.customer_name || bookingDetails?.customer || tenants.find(t => t.id === schedCustomer)?.name || ''} readOnly className="form-input" disabled style={{ fontSize: 13, boxSizing: 'border-box', background: 'var(--bg-secondary)' }} /> */}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Maintainance Type</label>
                    <select className="form-select" required
                      value={custom_maintenance_schedule}
                      onChange={(e) => handlemaintenanceChange(e.target.value)}
                    >
                      <option value="">-- Select Type --</option>

                      <option value="Scheduled Maintenance">Scheduled Maintenance</option>
                      <option value="Adhoc Maintenance">Adhoc Maintenance</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Property Group</label>
                    <input type="text" value={schedPropertyGroup} readOnly className="form-input" disabled style={{ fontSize: 13, boxSizing: 'border-box', background: 'var(--bg-secondary)' }} />
                  </div>
                </div>
                <div>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ margin: 0, fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Items</label>
                  </div>
                  <div style={{ border: '1px solid var(--border-color)', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto', maxHeight: 280, overflowY: 'auto' }}>
                      <table style={{ width: '100%', minWidth: 820, borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: 12 }}>
                        <colgroup>
                          <col style={{ width: 180 }} />
                          <col style={{ width: 200 }} />
                          <col style={{ width: 120 }} />
                          <col style={{ width: 120 }} />
                          <col style={{ width: 90 }} />
                          <col style={{ width: 110 }} />
                          <col style={{ width: 40 }} />
                        </colgroup>
                        <thead>
                          <tr style={{ background: 'var(--bg-secondary, rgba(0,0,0,0.03))', position: 'sticky', top: 0, zIndex: 1 }}>
                            {['Item Code', 'Item Name', 'Start Date', 'Periodicity', 'No. of Visits', 'End Date', ''].map((h, i) => <th key={i} style={thStyle}>{h}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {schedItems.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: idx < schedItems.length - 1 ? '1px solid var(--border-color)' : 'none', background: idx % 2 === 0 ? 'transparent' : 'var(--bg-secondary, rgba(0,0,0,0.015))' }}>
                              <td style={{ padding: '7px 10px' }}>
                                {availableSchedUnits.length === 0 ? (
                                  <input type="text" value="" placeholder="No units for booking" readOnly className="form-input" disabled style={{ ...inputStyle, color: 'var(--text-secondary)' }} />
                                ) : (
                                  <select value={row.itemCode} onChange={(e) => handleSchedItemCodeChange(idx, e.target.value)} className="form-select" required style={inputStyle}>
                                    <option value="">-- Select Unit --</option>
                                    {availableSchedUnits.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
                                  </select>
                                )}
                              </td>
                              <td style={{ padding: '7px 10px', color: 'var(--text-secondary, #6b7280)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.itemName || (row.itemCode ? '…' : '—')}</td>
                              <td style={{ padding: '7px 10px' }}><input type="date" value={row.startDate} onChange={(e) => setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, startDate: e.target.value } : r))} className="form-input" required style={inputStyle} /></td>
                              <td style={{ padding: '7px 10px' }}>
                                <select value={row.periodicity} onChange={(e) => setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, periodicity: e.target.value } : r))} className="form-select" required style={inputStyle}>
                                  <option value="Weekly">Weekly</option>
                                  <option value="Monthly">Monthly</option>
                                  <option value="Quarterly">Quarterly</option>
                                  <option value="Half Yearly">Half Yearly</option>
                                  <option value="Yearly">Yearly</option>
                                  <option value="Random">Random</option>
                                </select>
                              </td>
                              <td style={{ padding: '7px 10px' }}><input type="number" min="1" value={row.noOfVisits} onChange={(e) => setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, noOfVisits: Number(e.target.value) || 1 } : r))} className="form-input" required style={{ ...inputStyle, textAlign: 'center' }} /></td>
                              <td style={{ padding: '7px 10px' }}><input type="date" value={row.endDate} onChange={(e) => setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, endDate: e.target.value } : r))} className="form-input" required style={inputStyle} /></td>
                              <td style={{ padding: '7px 10px', textAlign: 'center' }}>
                                <button type="button" onClick={() => setSchedItems(prev => prev.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: 'var(--text-danger, #ef4444)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>&times;</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 20px', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowScheduleModal(false)} disabled={submittingSchedule}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submittingSchedule}>{submittingSchedule ? 'Creating...' : 'Create Maintenance Schedule'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── SUBMIT WORK ORDER MODAL (assign-type aware) ── */}
      {showWOModal && selectedSchedule && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 460, width: '92vw' }}>
            <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Submit Task</h3>
              <button onClick={() => setShowWOModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <div className="modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Schedule summary */}
              <div style={{ background: 'var(--bg-tertiary)', borderRadius: 6, padding: '10px 12px', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div><span style={{ color: 'var(--text-secondary)' }}>Schedule: </span><strong>{selectedSchedule.name}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Tenant: </span><strong>{selectedSchedule.customer_name || selectedSchedule.customer}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Property: </span><strong>{getPropertyNameById(selectedSchedule.custom_property)}</strong></div>
              </div>

              {/* Assign type toggle */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Assign To</label>
                <AssignTypeToggle value={woAssignType} onChange={(type) => { setWoAssignType(type); }} />
              </div>

              {/* Conditional checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {woAssignType === 'employee' ? 'Select Employees' : 'Select Vendors'}
                  <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>
                  <span style={{ fontWeight: 400, marginLeft: 6, color: 'var(--text-muted)', fontSize: 11 }}>(select one or more)</span>
                </label>

                {woAssignType === 'employee' ? (
                  <>
                    <AssignChecklist
                      items={employees.map(e => ({ id: e.id || e.name, ...e }))}
                      selected={woAssignedEmployees}
                      onToggle={(id) => setWoAssignedEmployees(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                      emptyMsg="No employees available. Add employees to the system first."
                      renderLabel={(emp) => (
                        <>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{emp.name}</span>
                          {(emp.department || emp.designation) && (
                            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{emp.designation || ''}{emp.department ? ` · ${emp.department}` : ''}</span>
                          )}
                        </>
                      )}
                    />
                    {woAssignedEmployees.length > 0 && (
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                        {woAssignedEmployees.length} employee{woAssignedEmployees.length > 1 ? 's' : ''} selected
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <AssignChecklist
                      items={vendorDir}
                      selected={woAssignedVendors}
                      onToggle={(id) => setWoAssignedVendors(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                      emptyMsg="No vendors available in the system."
                      renderLabel={(v) => (
                        <>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{v.name}</span>
                          {v.type && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{v.type}</span>}
                        </>
                      )}
                    />
                    {woAssignedVendors.length > 0 && (
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                        {woAssignedVendors.length} vendor{woAssignedVendors.length > 1 ? 's' : ''} selected
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 20px', borderTop: '1px solid var(--border-color)' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowWOModal(false)} disabled={woSubmitting}>Cancel</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmitWorkOrder}
                disabled={woSubmitting || (woAssignType === 'employee' ? woAssignedEmployees.length === 0 : woAssignedVendors.length === 0)}
              >
                {woSubmitting ? 'Submitting…' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ITEM CONSUMPTION MODAL ── */}
      {showConsumeModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 500, width: '90%' }}>
            <div className="modal-header"><h3>Deduct Stock & Consume Part</h3><button onClick={() => setShowConsumeModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button></div>
            <form onSubmit={handleConsumeItemSubmit}>
              <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {consumeItemsList.map((entry, idx) => (
                  <div key={idx} style={{ border: '1px solid var(--border-color)', padding: 10, borderRadius: 6, position: 'relative', background: 'var(--bg-tertiary)' }}>
                    {consumeItemsList.length > 1 && <button type="button" onClick={() => setConsumeItemsList(prev => prev.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: 6, right: 6, background: 'none', border: 'none', color: 'var(--text-danger)', fontSize: 14, cursor: 'pointer' }}>Remove</button>}
                    <div className="form-group" style={{ marginBottom: 8 }}><label className="form-label" style={{ fontSize: 11 }}>Select Stock Item</label><select value={entry.itemCode} onChange={(e) => setConsumeItemsList(prev => prev.map((item, i) => i === idx ? { ...item, itemCode: e.target.value } : item))} className="form-select" required><option value="">-- Select Item --</option>{stockItems.map(s => <option key={s.code} value={s.code}>{s.name} (Qty: {s.qty} - ${s.unitCost}/ea)</option>)}</select></div>
                    <div className="grid-2col" style={{ gap: 8, gridTemplateColumns: '1fr 2fr' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label" style={{ fontSize: 11 }}>Qty</label><input type="number" value={entry.qty} onChange={(e) => setConsumeItemsList(prev => prev.map((item, i) => i === idx ? { ...item, qty: Number(e.target.value) } : item))} className="form-input" min="1" required /></div>
                      <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label" style={{ fontSize: 11 }}>Comment</label><input type="text" value={entry.comment} onChange={(e) => setConsumeItemsList(prev => prev.map((item, i) => i === idx ? { ...item, comment: e.target.value } : item))} className="form-input" placeholder="Note on usage" /></div>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setConsumeItemsList(prev => [...prev, { itemCode: '', qty: 1, comment: '' }])} style={{ alignSelf: 'flex-start' }}>+ Add Another Item</button>
              </div>
              <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowConsumeModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Deduct & Record</button></div>
            </form>
          </div>
        </div>
      )}

      {/* ── ESTIMATE CREATION MODAL ── */}
      {showEstimateModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 450 }}>
            <div className="modal-header"><h3>Create Estimate Item</h3><button onClick={() => setShowEstimateModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button></div>
            <form onSubmit={handleAddEstimateSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="form-group"><label className="form-label">Estimate Type</label><select value={estType} onChange={(e) => setEstType(e.target.value)} className="form-select"><option value="Material">Material</option><option value="Labour">Labour</option></select></div>
                {estType === 'Material' ? (
                  <div className="form-group"><label className="form-label">Select Item</label><select value={estItemCode} onChange={(e) => setEstItemCode(e.target.value)} className="form-select" required><option value="">-- Choose Item --</option>{stockItems.map(s => <option key={s.code} value={s.code}>{s.name} (${s.unitCost}/ea)</option>)}</select></div>
                ) : (
                  <div className="form-group"><label className="form-label">Labour Description</label><input type="text" value={estName} onChange={(e) => setEstName(e.target.value)} className="form-input" placeholder="e.g. Technician Labour" required /></div>
                )}
                <div className="grid-2col" style={{ gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group"><label className="form-label">{estType === 'Material' ? 'Quantity' : 'Hours'}</label><input type="number" value={estQty} onChange={(e) => setEstQty(Number(e.target.value))} className="form-input" min="1" required /></div>
                  <div className="form-group"><label className="form-label">{estType === 'Material' ? 'Unit Cost' : 'Hourly Rate'}</label><input type="number" value={estCost} onChange={(e) => setEstCost(Number(e.target.value))} className="form-input" disabled={estType === 'Material'} placeholder={estType === 'Material' ? 'Auto-calculated' : 'e.g. 50'} required /></div>
                </div>
                <div className="form-group"><label className="form-label">Comments</label><input type="text" value={estComment} onChange={(e) => setEstComment(e.target.value)} className="form-input" placeholder="Notes on this estimate item" /></div>
              </div>
              <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowEstimateModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Add Item</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}