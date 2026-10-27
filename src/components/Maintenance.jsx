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
import { Hammer, User, Clock, CheckCircle, CheckCircle2, AlertTriangle, Plus, X, Calendar as CalendarIcon, List, BarChart3, ClipboardList, Building, Search, Activity, Settings, DollarSign, PenTool, Archive, Check, ArrowRight, UserCheck, ShieldCheck, Mail, Phone, MapPin, Award, Trash, Save, RefreshCw, Users, Briefcase } from 'lucide-react';
import TaskItemsPanel from './TaskItemsPanel';
import { getAuthHeaders, getCsrfToken } from '../config';

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
          headers: getAuthHeaders(),
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
  const [scheduleRows, setScheduleRows] = useState([]);
  const [busyTasks, setBusyTasks] = useState(false);
  const [busyRowId, setBusyRowId] = useState(null);

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
  const [customerBookings, setCustomerBookings] = useState([]);
  const [customerUnits, setCustomerUnits] = useState([]);

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

  // getCsrfToken is safely imported from ../config

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
        const item_group = data.item_group || '';
        const result = { itemName, propertyGroup, item_group };
        setItemDetailCache(prev => ({ ...prev, [itemCode]: result }));
        setItemNameCache(prev => ({ ...prev, [itemCode]: itemName }));
        return result;
      }
    } catch (e) {
      // ignore
    }
    return { itemName: itemCode, propertyGroup: '', item_group: '' };
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
    // 1. If customerUnits from all bookings of the selected customer is populated, use it!
    if (customerUnits && customerUnits.length > 0) {
      return customerUnits;
    }

    // 2. Otherwise fallback to single bookingDetails
    if (!bookingDetails || !schedUnits.length) return [];

    // Extract item codes from booking_item array that belong to item_group = "Commercial"
    let bookingItemCodes = [];
    if (bookingDetails.booking_item && Array.isArray(bookingDetails.booking_item)) {
      bookingItemCodes = bookingDetails.booking_item
        .filter(item => {
          const code = (item.item_code || '').toString().trim().toLowerCase();
          if (code === 'promotional fee' || code === 'service charge') return false;
          const grp = (item.item_group || item.unit_group || '').toString().trim().toLowerCase();
          const schedMatch = schedUnits.find(u => (u.name || '').toLowerCase() === code);
          const schedGrp = (schedMatch?.item_group || '').toString().trim().toLowerCase();
          const isCommercial = grp === 'commercial' || schedGrp === 'commercial' || (!grp && !schedGrp);
          return isCommercial;
        })
        .map(item => (item.item_code || '').toString().trim().toLowerCase())
        .filter(Boolean);
    }

    if (bookingItemCodes.length === 0) {
      const fallbackUnit = (bookingDetails.property_unit || bookingDetails.unit || bookingDetails.unit_name || bookingDetails.unit_code || '').toString().trim().toLowerCase();
      if (fallbackUnit) bookingItemCodes = [fallbackUnit];
    }

    // Filter schedUnits: MUST have item_group === 'Commercial' AND match booking items if any
    const filtered = schedUnits.filter(u => {
      const unitName = (u.name || '').toString().trim().toLowerCase();
      const unitItemName = (u.item_name || '').toString().trim().toLowerCase();
      const itemGroup = (u.item_group || '').toString().trim().toLowerCase();

      // Only Commercial items
      const isCommercial = itemGroup === 'commercial' || (!itemGroup && schedUnits.length > 0);

      const isMatch = bookingItemCodes.length === 0 ? isCommercial : bookingItemCodes.includes(unitName);

      const isExcluded =
        unitName === 'promotional fee' ||
        unitName === 'service charge' ||
        unitItemName === 'promotional fee' ||
        unitItemName === 'service charge';

      return isMatch && isCommercial && !isExcluded;
    });

    return filtered.length > 0 ? filtered : [];
  }, [schedUnits, bookingDetails, customerUnits]);

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

    if (!schedCustomer) {
      const customerKey = bookingDetails.customer || bookingDetails.customer_name || '';
      const resolvedTenantId = resolveTenantId(customerKey);
      setSchedCustomer(resolvedTenantId || customerKey);
    }

    const bookingPropertyGroup = bookingDetails.property_group || '';
    if (bookingPropertyGroup) {
      setSchedPropertyGroup(bookingPropertyGroup);
    }

    const unitCode = bookingDetails.property_unit || bookingDetails.unit || bookingDetails.unit_name || bookingDetails.unit_code || '';
    if (unitCode) {
      setSchedUnitSpec(unitCode);
    }

    // If customerUnits is already populated, let multi-booking customer units manage schedItems
    if (customerUnits.length > 0) {
      return;
    }

    // Extract booking items from booking_item array where item_group is Commercial
    if (bookingDetails.booking_item && Array.isArray(bookingDetails.booking_item) && bookingDetails.booking_item.length > 0) {
      const filteredBookingItems = bookingDetails.booking_item.filter(item => {
        const code = (item.item_code || '').toString().trim().toLowerCase();
        if (code === 'promotional fee' || code === 'service charge') return false;
        const grp = (item.item_group || item.unit_group || '').toString().trim().toLowerCase();
        const schedMatch = schedUnits.find(u => (u.name || '').toLowerCase() === code);
        const schedGrp = (schedMatch?.item_group || '').toString().trim().toLowerCase();
        const isCommercial = grp === 'commercial' || schedGrp === 'commercial' || (!grp && !schedGrp);
        return isCommercial;
      });

      const bookingItems = filteredBookingItems.map((item, idx) => ({
        itemCode: item.item_code || '',
        itemName: item.item_name || '',
        startDate: bookingDetails.start_date || new Date().toISOString().split('T')[0],
        periodicity: 'Weekly',
        noOfVisits: 1,
        endDate: bookingDetails.end_date || '',
        bookingId: bookingDetails.name || ''
      }));

      setSchedItems(bookingItems.length > 0 ? bookingItems : [{
        itemCode: '',
        itemName: '',
        startDate: bookingDetails.start_date || new Date().toISOString().split('T')[0],
        periodicity: 'Weekly',
        noOfVisits: 1,
        endDate: bookingDetails.end_date || '',
        bookingId: bookingDetails.name || ''
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
      // Fallback: check if unitCode is commercial
      const schedMatch = schedUnits.find(u => (u.name || '').toLowerCase() === unitCode.toLowerCase());
      const schedGrp = (schedMatch?.item_group || '').toString().trim().toLowerCase();
      const isCommercial = schedGrp === 'commercial' || !schedGrp;

      if (isCommercial) {
        setSchedItems(prev => prev.map((row, idx) => idx === 0 ? { ...row, itemCode: unitCode, itemName: '', bookingId: bookingDetails.name || '' } : row));
        fetchItemDetails(unitCode).then(details => {
          setSchedItems(prev => prev.map((row, idx) => idx === 0 ? { ...row, itemCode: unitCode, itemName: details.itemName } : row));
          if (!bookingPropertyGroup && details.propertyGroup) {
            setSchedPropertyGroup(details.propertyGroup);
          }
        });
      }
    }
  }, [bookingDetails, schedUnits, customerUnits]);

  // ── Fetch Bookings & Filter Approved Tenants ──────────────────────────────
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    if (!erpnextConfig?.url) return;
    setLoadingBookings(true);
    const bookingFields = encodeURIComponent(JSON.stringify(["name", "customer", "customer_name", "workflow_state", "docstatus", "property"]));
    fetch(`${erpnextConfig.url}/api/resource/Booking?fields=${bookingFields}&limit_page_length=500&order_by=creation%20desc`, {
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
      })
      .finally(() => {
        setLoadingBookings(false);
      });
  }, [showScheduleModal, erpnextConfig?.url]);

  // Only show tenants whose Booking workflow_state is "Approved"
  const filteredTenants = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];

    const approvedCustomerMap = new Map();

    bookings.forEach(b => {
      const ws = (b.workflow_state || '').toString().trim().toLowerCase();
      // Only match Booking workflow_state === "Approved"
      if (ws === 'approved') {
        const custId = b.customer || b.customer_name;
        const custName = b.customer_name || b.customer;
        if (custId) {
          approvedCustomerMap.set(custId.toString().trim().toLowerCase(), {
            id: custId,
            name: custId,
            customer_name: custName || custId
          });
        }
        if (custName) {
          approvedCustomerMap.set(custName.toString().trim().toLowerCase(), {
            id: custId || custName,
            name: custId || custName,
            customer_name: custName
          });
        }
      }
    });

    if (approvedCustomerMap.size === 0) return [];

    const seen = new Set();
    const result = [];

    // Prioritize matching tenant objects from props
    (tenants || []).forEach(t => {
      const idKey = (t.id || t.name || '').toString().trim().toLowerCase();
      const nameKey = (t.customer_name || '').toString().trim().toLowerCase();
      if ((idKey && approvedCustomerMap.has(idKey)) || (nameKey && approvedCustomerMap.has(nameKey))) {
        const uniqueKey = (t.name || t.id || nameKey);
        if (!seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          result.push(t);
        }
      }
    });

    // Also include any approved customers directly from bookings if not found in tenants prop
    approvedCustomerMap.forEach(val => {
      const uniqueKey = val.name || val.id || val.customer_name;
      const lowerCustName = (val.customer_name || '').toString().trim().toLowerCase();
      if (!seen.has(uniqueKey) && !seen.has(lowerCustName)) {
        seen.add(uniqueKey);
        result.push(val);
      }
    });

    return result;
  }, [tenants, bookings]);

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

  const handleSchedItemCodeChange = async (idx, rawValue) => {
    // rawValue might be "BOOKING_ID::UNIT_CODE" or just "UNIT_CODE"
    const [bIdPart, unitCodePart] = rawValue && rawValue.includes('::')
      ? rawValue.split('::')
      : [null, rawValue];
    const value = unitCodePart !== undefined ? unitCodePart : rawValue;

    // Find in customerUnits or availableSchedUnits
    const matchedUnit = (customerUnits || []).find(u => {
      if (bIdPart) {
        return u.booking_id === bIdPart && (u.name === value || u.item_code === value);
      }
      return u.name === value || u.item_code === value;
    }) || (availableSchedUnits || []).find(u => {
      if (bIdPart) {
        return u.booking_id === bIdPart && (u.name === value || u.item_code === value);
      }
      return u.name === value || u.item_code === value;
    });

    const details = value ? await fetchItemDetails(value) : { itemName: '', propertyGroup: '' };
    const itemName = matchedUnit?.item_name || details.itemName || value;

    // Target booking ID for this unit
    const targetBookingId = matchedUnit?.booking_id || bIdPart;

    setSchedItems(prev => prev.map((r, i) => i === idx ? {
      ...r,
      itemCode: value,
      itemName: itemName,
      startDate: matchedUnit?.start_date || r.startDate || new Date().toISOString().split('T')[0],
      endDate: matchedUnit?.end_date || r.endDate || '',
      bookingId: targetBookingId || r.bookingId || ''
    } : r));

    // Automatically update Linked Booking ID to this unit's booking!
    if (targetBookingId) {
      setSchedBookingId(targetBookingId);
    }
    if (matchedUnit?.property) {
      setSchedProperty(matchedUnit.property);
    }
    if (matchedUnit?.property_group || details.propertyGroup) {
      setSchedPropertyGroup(matchedUnit.property_group || details.propertyGroup);
    }
    if (matchedUnit?.bookingDoc) {
      setBookingDetails(matchedUnit.bookingDoc);
    } else if (targetBookingId && customerBookings.length > 0) {
      const foundB = customerBookings.find(b => b.name === targetBookingId);
      if (foundB) {
        setBookingDetails(foundB);
        const prop = getPropertyIdFromBooking(foundB) || foundB.property || '';
        if (prop) setSchedProperty(prop);
      }
    }
  };

  const handleLinkedBookingChange = (newBookingId) => {
    setSchedBookingId(newBookingId);
    if (!newBookingId) return;

    const bDoc = (customerBookings || []).find(b => b.name === newBookingId);
    if (bDoc) {
      setBookingDetails(bDoc);
      const propId = getPropertyIdFromBooking(bDoc) || bDoc.property || '';
      if (propId) setSchedProperty(propId);
      if (bDoc.property_group) setSchedPropertyGroup(bDoc.property_group);

      // Find first unit belonging to this booking
      const firstUnit = (customerUnits || []).find(u => u.booking_id === newBookingId);
      if (firstUnit) {
        setSchedItems(prev => prev.map((r, i) => i === 0 ? {
          ...r,
          itemCode: firstUnit.item_code,
          itemName: firstUnit.item_name,
          startDate: firstUnit.start_date || r.startDate,
          endDate: firstUnit.end_date || r.endDate,
          bookingId: newBookingId
        } : r));
      }
    }
  };

  useEffect(() => {
    if (!erpnextConfig?.url) return;
    const fields = encodeURIComponent(JSON.stringify(["name", "item_name", "item_group"]));
    const filters = encodeURIComponent(JSON.stringify([["item_group", "=", "Commercial"]]));
    fetch(`${erpnextConfig.url}/api/resource/Item?fields=${fields}&filters=${filters}&limit_page_length=1000`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (json && Array.isArray(json.data) && json.data.length > 0) {
          setSchedUnits(json.data);
        } else {
          // Fallback: fetch without filter and filter client-side
          fetch(`${erpnextConfig.url}/api/resource/Item?fields=${fields}&limit_page_length=1000`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
            .then(r2 => r2.ok ? r2.json() : null)
            .then(json2 => {
              if (json2 && Array.isArray(json2.data)) {
                const comm = json2.data.filter(it => (it.item_group || '').toString().trim().toLowerCase() === 'commercial');
                setSchedUnits(comm.length > 0 ? comm : json2.data);
              }
            })
            .catch(() => { });
        }
      })
      .catch(() => { });
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
          ...t,
          id: t.name, property: getPropertyNameById(t.custom_property) || 'Stratford Court Apartments',
          unit: t.custom_asset || 'Flat 1A', category: t.subject ? t.subject.split(' ')[0] : 'General',
          technician: t.custom_technician || 'None', vendor: t.custom_vendor || 'None',
          estHours: 4, estCost: Number(t.custom_estimated_cost) || 150, actualCost: 0,
          status: t.status || 'Open', description: t.description || t.subject || '',
          consumedItems: [], expStartDate: t.exp_start_date, expEndDate: t.exp_end_date,
          priority: t.priority, scheduleId: t.custom_maintenance_schedule || t.custom_mantainence_sechedule
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

  const handleOpenScheduleModal = () => {
    setSchedCustomer('');
    setSchedBookingId('');
    setBookingDetails(null);
    setCustomerBookings([]);
    setCustomerUnits([]);
    setCustomMaintenanceSchedule('');
    setSchedItems([{
      itemCode: '',
      itemName: '',
      startDate: new Date().toISOString().split('T')[0],
      periodicity: 'Weekly',
      noOfVisits: 1,
      endDate: '',
      bookingId: ''
    }]);
    setScheduleStatusMessage(null);
    setShowScheduleModal(true);
  };

  // ── Create Schedule ─────────────────────────────────────────────────────────
  const handleCreateScheduleSubmit = async (e) => {
    e.preventDefault();
    setSubmittingSchedule(true); setScheduleStatusMessage(null);
    const tenantObj = (tenants || []).find(t => t.id === schedCustomer || t.name === schedCustomer);
    const customerName = tenantObj ? (tenantObj.customer_name || tenantObj.name) : schedCustomer;
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

  // ── Create & Assign Task ────────────────────────────────────────────────────
  const handleCreateTask = async () => {
    if (!selectedSchedule) return;

    const hasEmployee = woAssignType === 'employee' && woAssignedEmployees.length > 0;
    const hasVendor = woAssignType === 'vendor' && woAssignedVendors.length > 0;
    if (!hasEmployee && !hasVendor) {
      showToast(`Please select at least one ${woAssignType} to assign.`, 'error');
      return;
    }

    setWoSubmitting(true);
    try {
      // 1. Build assignment rows
      let empRows = [];
      let vendorRows = [];

      if (woAssignType === 'employee') {
        empRows = await Promise.all(
          woAssignedEmployees.map(async (empId) => {
            try {
              const empRes = await fetch(
                `${erpnextConfig.url}/api/resource/Employee/${encodeURIComponent(empId)}?fields=%5B%22name%22%2C%22employee_name%22%2C%22designation%22%2C%22cell_number%22%2C%22company_email%22%5D`,
                { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
              );
              if (empRes.ok) {
                const empJson = await empRes.json();
                const emp = empJson.data || empJson;
                return {
                  emp_id: emp.name || empId,
                  employee: emp.name || empId,
                  emp_name: emp.employee_name || emp.name || empId,
                  designation: emp.designation || '',
                  contact_number: emp.cell_number || emp.company_email || ''
                };
              }
            } catch (e) { }
            const localEmp = (techProfiles.length > 0 ? techProfiles : employees).find(e => (e.id || e.name) === empId);
            return {
              emp_id: empId,
              employee: empId,
              emp_name: localEmp?.name || empId,
              designation: localEmp?.designation || localEmp?.certs || '',
              contact_number: localEmp?.phone || ''
            };
          })
        );
      } else {
        vendorRows = woAssignedVendors.map(vendorId => {
          const match = vendorDir.find(v => v.id === vendorId || v.name === vendorId);
          return {
            vendor: vendorId,
            vendor_name: vendorId,
            supplier_type: match?.type || match?.supplier_type || ''
          };
        });
      }

      // 2. Check if a Task already exists for this schedule
      let taskName = null;
      try {
        const taskSearchRes = await fetch(
          `${erpnextConfig.url}/api/resource/Task?filters=%5B%5B%22custom_mantainence_sechedule%22%2C%22%3D%22%2C%22${encodeURIComponent(selectedSchedule.name)}%22%5D%5D&fields=%5B%22name%22%5D&limit_page_length=5`,
          { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
        );
        if (taskSearchRes.ok) {
          const taskJson = await taskSearchRes.json();
          const tasks = taskJson.data || [];
          if (tasks.length > 0) taskName = tasks[0].name;
        }
      } catch (searchErr) {
        console.warn('Error checking existing task:', searchErr);
      }

      const isEmp = woAssignType === 'employee';
      const putBody = {
        custom_assign: isEmp ? 'Employee' : 'Vendor',
        custom_assign_to_: isEmp ? empRows : [],
        custom_assign_to_vendor: isEmp ? [] : vendorRows
      };

      if (taskName) {
        // Update existing task with assigned employee(s)/vendor(s)
        const putRes = await fetch(`${erpnextConfig.url}/api/resource/Task/${taskName}`, {
          method: 'PUT',
          credentials: 'include',
          headers: getAuthHeaders(),
          body: JSON.stringify(putBody)
        });
        if (!putRes.ok) {
          const errTxt = await putRes.text();
          console.warn('Assignment failed:', errTxt);
        }
      } else {
        // Directly create the Task in Open status (without submitting)
        const taskPayload = {
          doctype: 'Task',
          subject: `${selectedSchedule.items?.[0]?.item_name || 'Maintenance Task'} - ${selectedSchedule.name}`,
          custom_mantainence_sechedule: selectedSchedule.name,
          custom_maintenance_schedule: selectedSchedule.name,
          custom_property: selectedSchedule.custom_property || '',
          custom_customer_name: selectedSchedule.customer_name || selectedSchedule.customer || '',
          custom_booking_id: selectedSchedule.custom_booking_id || selectedSchedule.custom_booking_number || '',
          status: 'Open',
          priority: 'Medium',
          exp_start_date: selectedSchedule.items?.[0]?.start_date || selectedSchedule.transaction_date || '',
          exp_end_date: selectedSchedule.items?.[0]?.end_date || '',
          custom_assign: isEmp ? 'Employee' : 'Vendor',
          custom_assign_to_: isEmp ? empRows : [],
          custom_assign_to_vendor: isEmp ? [] : vendorRows
        };

        const createRes = await fetch(`${erpnextConfig.url}/api/resource/Task`, {
          method: 'POST',
          credentials: 'include',
          headers: getAuthHeaders(),
          body: JSON.stringify(taskPayload)
        });

        if (createRes.ok) {
          const createJson = await createRes.json();
          taskName = createJson.data?.name || createJson.name;
        } else {
          // If direct Task creation is blocked by backend workflow, fallback to approving schedule which creates the task
          try {
            const approveRes = await fetch(`${erpnextConfig.url}/api/method/approve_reject_doc`, {
              method: 'POST',
              credentials: 'include',
              headers: getAuthHeaders(),
              body: JSON.stringify({ doctype_name: 'Maintenance Schedule', docname: selectedSchedule.name, state_code: 1 })
            });
            if (approveRes.ok) {
              await new Promise(r => setTimeout(r, 2000));
              const taskRetryRes = await fetch(
                `${erpnextConfig.url}/api/resource/Task?filters=%5B%5B%22custom_mantainence_sechedule%22%2C%22%3D%22%2C%22${encodeURIComponent(selectedSchedule.name)}%22%5D%5D&fields=%5B%22name%22%5D&limit_page_length=5`,
                { credentials: 'include', headers: { 'Content-Type': 'application/json' } }
              );
              if (taskRetryRes.ok) {
                const retryJson = await taskRetryRes.json();
                const tasks = retryJson.data || [];
                if (tasks.length > 0) {
                  taskName = tasks[0].name;
                  await fetch(`${erpnextConfig.url}/api/resource/Task/${taskName}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(putBody)
                  });
                }
              }
            }
          } catch (apprErr) {
            console.warn('Approve schedule fallback error:', apprErr);
          }
        }
      }

      // 3. Submit the Maintenance Schedule in ERPNext so its status becomes "Submitted" (docstatus: 1)
      try {
        if (erpnextConfig?.url && selectedSchedule?.name) {
          // Attempt Frappe approval workflow API
          try {
            await fetch(`${erpnextConfig.url}/api/method/approve_reject_doc`, {
              method: 'POST',
              credentials: 'include',
              headers: getAuthHeaders(),
              body: JSON.stringify({ doctype_name: 'Maintenance Schedule', docname: selectedSchedule.name, state_code: 1 })
            });
          } catch (apprErr) {
            console.warn('approve_reject_doc for Maintenance Schedule failed:', apprErr);
          }

          // Direct PUT to ensure status = 'Submitted' and docstatus = 1
          try {
            await fetch(`${erpnextConfig.url}/api/resource/Maintenance%20Schedule/${encodeURIComponent(selectedSchedule.name)}`, {
              method: 'PUT',
              credentials: 'include',
              headers: getAuthHeaders(),
              body: JSON.stringify({ status: 'Submitted', docstatus: 1 })
            });
          } catch (putErr) {
            console.warn('PUT docstatus for Maintenance Schedule failed:', putErr);
          }
        }

        if (typeof onUpdateScheduleStatus === 'function') {
          onUpdateScheduleStatus(selectedSchedule.name, 'Submitted');
        }
      } catch (submitErr) {
        console.warn('Failed to submit Maintenance Schedule:', submitErr);
      }

      // 4. Fetch the full created/updated task document so child tables and all fields are accurate
      let fullTaskDoc = null;
      if (taskName) {
        try {
          const taskGetRes = await fetch(`${erpnextConfig.url}/api/resource/Task/${encodeURIComponent(taskName)}`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });
          if (taskGetRes.ok) {
            const taskGetJson = await taskGetRes.json();
            fullTaskDoc = taskGetJson.data || taskGetJson;
          }
        } catch (fetchErr) {
          console.warn('Failed fetching created task doc:', fetchErr);
        }
      }

      const finalSelectedTask = {
        ...(fullTaskDoc || {}),
        name: taskName,
        id: taskName,
        subject: fullTaskDoc?.subject || `${selectedSchedule.items?.[0]?.item_name || 'Maintenance Task'} - ${selectedSchedule.name}`,
        custom_mantainence_sechedule: selectedSchedule.name,
        custom_maintenance_schedule: selectedSchedule.name,
        custom_property: fullTaskDoc?.custom_property || selectedSchedule.custom_property || '',
        custom_customer_name: fullTaskDoc?.custom_customer_name || selectedSchedule.customer_name || selectedSchedule.customer || '',
        custom_booking_id: fullTaskDoc?.custom_booking_id || selectedSchedule.custom_booking_id || selectedSchedule.custom_booking_number || '',
        status: fullTaskDoc?.status || 'Open',
        priority: fullTaskDoc?.priority || 'Medium',
        custom_assign: isEmp ? 'Employee' : 'Vendor',
        custom_assign_to_: isEmp ? (fullTaskDoc?.custom_assign_to_?.length ? fullTaskDoc.custom_assign_to_ : empRows) : [],
        custom_assign_to_vendor: isEmp ? [] : (fullTaskDoc?.custom_assign_to_vendor?.length ? fullTaskDoc.custom_assign_to_vendor : vendorRows)
      };

      const mappedTask = {
        ...finalSelectedTask,
        id: taskName,
        property: getPropertyNameById(finalSelectedTask.custom_property) || selectedSchedule.custom_property || 'Stratford Court Apartments',
        unit: finalSelectedTask.custom_asset || 'Flat 1A',
        category: finalSelectedTask.subject ? finalSelectedTask.subject.split(' ')[0] : 'General',
        technician: (finalSelectedTask.custom_assign_to_ || [])[0]?.emp_id || (finalSelectedTask.custom_assign_to_ || [])[0]?.emp_name || 'None',
        vendor: (finalSelectedTask.custom_assign_to_vendor || [])[0]?.vendor_name || 'None',
        estHours: 4,
        estCost: Number(finalSelectedTask.custom_estimated_cost) || 150,
        actualCost: 0,
        status: finalSelectedTask.status || 'Open',
        description: finalSelectedTask.description || finalSelectedTask.subject || '',
        consumedItems: finalSelectedTask.custom_items_used_for_maintenance || [],
        expStartDate: finalSelectedTask.exp_start_date,
        expEndDate: finalSelectedTask.exp_end_date,
        priority: finalSelectedTask.priority || 'Medium',
        scheduleId: finalSelectedTask.custom_maintenance_schedule || finalSelectedTask.custom_mantainence_sechedule || selectedSchedule.name
      };

      const assignCount = isEmp ? woAssignedEmployees.length : woAssignedVendors.length;
      showToast(`Task created & Maintenance Schedule submitted! (${assignCount} ${woAssignType} assigned)${taskName ? ` [${taskName}]` : ''}`, 'success');

      setLocalSchedules(prev => prev.map(s => s.name === selectedSchedule.name ? { ...s, status: 'Submitted', docstatus: 1 } : s));
      setShowWOModal(false);
      setWoAssignedEmployees([]);
      setWoAssignedVendors([]);
      setSelectedSchedule(null); // Close the schedule drawer

      // REDIRECT to Task Operations view and open newly created task drawer
      setActiveSection('task');
      setSelectedWorkOrder(finalSelectedTask);
      setWorkOrders(prev => [mappedTask, ...prev.filter(w => (w.id !== taskName && w.name !== taskName))]);

      fetchWorkOrders();

      setTimeout(() => {
        fetchSchedules();
      }, 1000);
    } catch (err) {
      showToast(err.message || 'Task creation failed.', 'error');
    } finally {
      setWoSubmitting(false);
    }
  };

  const handleSubmitWorkOrder = handleCreateTask;

  // ── Sync Schedule Rows with child tables and workOrders ───────────────────
  useEffect(() => {
    if (!selectedSchedule) {
      setScheduleRows([]);
      return;
    }

    setScheduleRows(prevRows => {
      const sameSchedule = prevRows.length > 0 && prevRows[0].schedule_name === selectedSchedule.name;

      let rawRows = Array.isArray(selectedSchedule.schedules) && selectedSchedule.schedules.length > 0
        ? selectedSchedule.schedules
        : [];

      // If no child schedules returned from ERPNext, generate from items
      if (rawRows.length === 0 && Array.isArray(selectedSchedule.items) && selectedSchedule.items.length > 0) {
        const genRows = [];
        selectedSchedule.items.forEach((item, itemIdx) => {
          const count = Number(item.no_of_visits) || 1;
          const start = item.start_date || selectedSchedule.transaction_date || new Date().toISOString().split('T')[0];
          const period = (item.periodicity || 'Weekly').toLowerCase();

          for (let i = 0; i < count; i++) {
            const d = new Date(start);
            if (period.includes('weekly')) {
              d.setDate(d.getDate() + (i * 7));
            } else if (period.includes('monthly')) {
              d.setMonth(d.getMonth() + i);
            } else if (period.includes('quarterly')) {
              d.setMonth(d.getMonth() + (i * 3));
            } else if (period.includes('yearly')) {
              d.setFullYear(d.getFullYear() + i);
            } else {
              d.setDate(d.getDate() + i);
            }
            const scheduledDateStr = d.toISOString().split('T')[0];
            genRows.push({
              name: `sched-${itemIdx}-${i}`,
              item_code: item.item_code || '001',
              item_name: item.item_name || '',
              scheduled_date: scheduledDateStr,
              maintenance_visit: '',
              completion_status: '',
              task_id: '',
              task_status: ''
            });
          }
        });
        rawRows = genRows;
      }

      if (rawRows.length === 0) {
        rawRows = [{
          name: 'sched-default',
          item_code: selectedSchedule.items?.[0]?.item_code || '001',
          item_name: selectedSchedule.items?.[0]?.item_name || '',
          scheduled_date: selectedSchedule.transaction_date || new Date().toISOString().split('T')[0],
          maintenance_visit: '',
          completion_status: '',
          task_id: '',
          task_status: ''
        }];
      }

      return rawRows.map((r, idx) => {
        const rowId = r.name || `row-${idx}`;
        const prev = sameSchedule ? prevRows.find(p => p.id === rowId || p.scheduled_date === (r.scheduled_date || selectedSchedule.transaction_date)) : null;

        const rowDate = r.scheduled_date || selectedSchedule.transaction_date;
        const matchedTask = (workOrders || []).find(w =>
          (w.custom_mantainence_sechedule === selectedSchedule.name ||
           w.custom_maintenance_schedule === selectedSchedule.name ||
           w.scheduleId === selectedSchedule.name) &&
          (w.exp_start_date === rowDate || (w.subject && w.subject.includes(rowDate)))
        );

        const taskId = r.task_id || r.custom_task_id || prev?.task_id || matchedTask?.name || matchedTask?.id || '';
        const taskStatus = r.task_status || r.custom_task_status || prev?.task_status || matchedTask?.status || (taskId ? 'Open' : '');

        let initialPersons = prev?.persons;
        if (!initialPersons || initialPersons.length === 0) {
          if (r.persons && Array.isArray(r.persons)) {
            initialPersons = r.persons;
          } else if (r.custom_assign_to) {
            initialPersons = typeof r.custom_assign_to === 'string'
              ? r.custom_assign_to.split(',').map(s => s.trim()).filter(Boolean)
              : [r.custom_assign_to];
          } else if (matchedTask?.custom_assign_to_ && Array.isArray(matchedTask.custom_assign_to_)) {
            initialPersons = matchedTask.custom_assign_to_.map(e => e.emp_id || e.employee || e.name).filter(Boolean);
          } else if (matchedTask?.custom_assign_to_vendor && Array.isArray(matchedTask.custom_assign_to_vendor)) {
            initialPersons = matchedTask.custom_assign_to_vendor.map(v => v.vendor_name || v.vendor || v.name).filter(Boolean);
          } else {
            initialPersons = [];
          }
        }

        return {
          id: rowId,
          schedule_name: selectedSchedule.name,
          schedule_id: r.name || `row-${idx}`,
          item_code: r.item_code || selectedSchedule.items?.[0]?.item_code || '001',
          scheduled_date: rowDate,
          maintenance_visit: r.maintenance_visit || '',
          visit_status: r.completion_status || r.visit_status || '',
          task_id: taskId,
          task_status: taskStatus,
          assign_type: prev?.assign_type || r.assign_type || r.custom_assign || (matchedTask?.custom_assign || 'Employee'),
          persons: initialPersons,
          selected: prev ? prev.selected : false,
          subject: `${selectedSchedule.name} - ${r.item_code || selectedSchedule.items?.[0]?.item_code || '001'} - ${rowDate}`
        };
      });
    });
  }, [selectedSchedule?.name, selectedSchedule?.schedules, workOrders]);

  const get_persons = (row) => {
    if (!row) return [];
    if (Array.isArray(row.persons)) return row.persons.filter(Boolean);
    if (typeof row.persons === 'string' && row.persons.trim()) {
      return row.persons.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  const submit_tasks = async (targetRows = null) => {
    if (busyTasks) return;

    let selected = targetRows
      ? (Array.isArray(targetRows) ? targetRows : [targetRows]).map(t => scheduleRows.find(r => r.id === t.id) || t)
      : scheduleRows.filter(d => d.selected && !d.task_id);

    if (!selected.length) {
      showToast("Please select a Schedule.", "error");
      return;
    }

    // Validate Assignment
    for (let row of selected) {
      row.persons = get_persons(row);

      if (!row.assign_type || !row.persons.length) {
        showToast(
          "Please select Assign and Persons for " +
          (row.scheduled_date || "this row"),
          "error"
        );
        return;
      }
    }

    if (targetRows && selected.length === 1) {
      setBusyRowId(selected[0].id);
    }
    setBusyTasks(true);

    try {
      let users = {};

      // Get Linked Employee User Accounts (for optional Frappe desk assignment)
      for (let row of selected) {
        if (row.assign_type !== "Employee") continue;

        for (let emp of row.persons) {
          if (users[emp]) continue;

          let user = null;
          const localEmp = (employees || []).find(e => (e.id === emp || e.name === emp));
          if (localEmp?.user_id) {
            user = localEmp.user_id;
          } else if (erpnextConfig?.url) {
            try {
              const res = await fetch(
                `${erpnextConfig.url}/api/resource/Employee/${encodeURIComponent(emp)}?fields=%5B%22user_id%22%2C%22company_email%22%2C%22prefered_email%22%5D`,
                { credentials: 'include', headers: getAuthHeaders({ 'Content-Type': 'application/json' }) }
              );
              if (res.ok) {
                const data = await res.json();
                user = data.data?.user_id || data.user_id;
              }
            } catch (fetchErr) {
              console.warn("Failed fetching user_id for employee", emp, fetchErr);
            }
          }

          if (!user) {
            user = localEmp?.company_email || localEmp?.email || null;
          }

          users[emp] = user;
        }
      }

      let created = 0;
      const updatedRowsMap = {};

      // Create Tasks
      for (let row of selected) {
        // Check Existing Task
        let existingTaskName = null;
        let existingTaskStatus = null;
        const taskSubject = row.subject || `${selectedSchedule.name} - ${row.item_code || '001'} - ${row.scheduled_date}`;

        if (erpnextConfig?.url) {
          try {
            const filterParam = encodeURIComponent(JSON.stringify([["subject", "=", taskSubject]]));
            const existingRes = await fetch(
              `${erpnextConfig.url}/api/resource/Task?filters=${filterParam}&fields=%5B%22name%22%2C%22status%22%5D&limit_page_length=1`,
              { credentials: 'include', headers: getAuthHeaders({ 'Content-Type': 'application/json' }) }
            );
            if (existingRes.ok) {
              const existingJson = await existingRes.json();
              if (existingJson.data && existingJson.data.length > 0) {
                existingTaskName = existingJson.data[0].name;
                existingTaskStatus = existingJson.data[0].status;
              }
            }
          } catch (checkErr) {
            console.warn("Check existing task error:", checkErr);
          }
        }

        if (existingTaskName) {
          row.task_id = existingTaskName;
          row.task_status = existingTaskStatus || "Open";
          updatedRowsMap[row.id] = { task_id: existingTaskName, task_status: existingTaskStatus || "Open" };
          continue;
        }

        // Prepare assignment child tables
        const isEmp = row.assign_type === "Employee";
        const empRows = isEmp ? row.persons.map(empId => {
          const emp = (employees || []).find(e => (e.id || e.name) === empId);
          return {
            emp_id: empId,
            employee: empId,
            emp_name: emp?.employee_name || emp?.name || empId,
            designation: emp?.designation || emp?.certs || '',
            contact_number: emp?.cell_number || emp?.phone || ''
          };
        }) : [];

        const vendorRows = !isEmp ? row.persons.map(vendorId => {
          const v = (vendorDir || vendors || []).find(x => (x.id || x.name) === vendorId);
          return {
            vendor: vendorId,
            vendor_name: v?.name || vendorId,
            supplier_type: v?.type || v?.supplier_type || ''
          };
        }) : [];

        const description =
          "Maintenance Schedule: " + (selectedSchedule.name || "") +
          "\nBooking: " + (selectedSchedule.custom_booking_id || "") +
          "\nCustomer: " + (selectedSchedule.customer || selectedSchedule.customer_name || "") +
          "\nItem: " + (row.item_code || "") +
          "\nScheduled Date: " + (row.scheduled_date || "") +
          "\nSchedule Row: " + (row.schedule_id || "") +
          "\nAssign: " + (row.assign_type || "") +
          "\nPersons: " + (row.persons.join(", "));

        let taskName = `TASK-${Date.now()}-${created + 1}`;
        let taskStatus = "Open";

        if (erpnextConfig?.url) {
          // Create New Task
          const taskPayload = {
            doctype: "Task",
            subject: taskSubject,
            status: "Open",
            exp_start_date: row.scheduled_date,
            exp_end_date: row.scheduled_date,
            description: description,
            custom_mantainence_sechedule: selectedSchedule.name,
            custom_maintenance_schedule: selectedSchedule.name,
            custom_booking_id: selectedSchedule.custom_booking_id || '',
            custom_customer_name: selectedSchedule.customer_name || selectedSchedule.customer || '',
            custom_property: selectedSchedule.custom_property || '',
            custom_assign: row.assign_type,
            custom_assign_to_: isEmp ? empRows : [],
            custom_assign_to_vendor: isEmp ? [] : vendorRows
          };

          const insertRes = await fetch(`${erpnextConfig.url}/api/resource/Task`, {
            method: 'POST',
            credentials: 'include',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(taskPayload)
          });

          if (!insertRes.ok) {
            const errJson = await insertRes.json().catch(() => ({}));
            throw new Error(errJson.exception || errJson._server_messages || "Task creation failed.");
          }

          const insertJson = await insertRes.json();
          const taskDoc = insertJson.data || insertJson;
          taskName = taskDoc.name;

          // Fetch Actual Task Status
          try {
            const statusRes = await fetch(
              `${erpnextConfig.url}/api/resource/Task/${encodeURIComponent(taskName)}?fields=%5B%22status%22%5D`,
              { credentials: 'include', headers: getAuthHeaders({ 'Content-Type': 'application/json' }) }
            );
            if (statusRes.ok) {
              const statusJson = await statusRes.json();
              taskStatus = statusJson.data?.status || statusJson.status || "Open";
            }
          } catch (statusErr) {
            console.warn("Failed fetching actual task status:", statusErr);
          }

          // Assign Multiple Employees via Frappe desk API (if linked user exists)
          if (row.assign_type === "Employee") {
            const assignableUsers = (row.persons || []).map(emp => users[emp]).filter(Boolean);
            if (assignableUsers.length > 0) {
              try {
                await fetch(`${erpnextConfig.url}/api/method/frappe.desk.form.assign_to.add`, {
                  method: 'POST',
                  credentials: 'include',
                  headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                  body: JSON.stringify({
                    args: JSON.stringify({
                      assign_to: assignableUsers,
                      doctype: "Task",
                      name: taskName,
                      description: "Maintenance Assignment",
                      date: row.scheduled_date
                    })
                  })
                });
              } catch (assignErr) {
                console.warn("Assign to API call error:", assignErr);
              }
            }
          }
        }

        row.task_id = taskName;
        row.task_status = taskStatus;
        updatedRowsMap[row.id] = { task_id: taskName, task_status: taskStatus };
        created++;
      }

      // Update scheduleRows in React state
      setScheduleRows(prev => prev.map(r => {
        if (updatedRowsMap[r.id]) {
          return {
            ...r,
            task_id: updatedRowsMap[r.id].task_id,
            task_status: updatedRowsMap[r.id].task_status,
            selected: false
          };
        }
        return r;
      }));

      // Sync schedule child table & docstatus in ERPNext
      if (erpnextConfig?.url && selectedSchedule?.name) {
        try {
          const updatedSchedules = scheduleRows.map(r => {
            const up = updatedRowsMap[r.id];
            return {
              name: r.schedule_id.startsWith('sched-') ? undefined : r.schedule_id,
              item_code: r.item_code,
              scheduled_date: r.scheduled_date,
              maintenance_visit: r.maintenance_visit || undefined,
              completion_status: r.visit_status || undefined,
              task_id: up ? up.task_id : (r.task_id || undefined),
              task_status: up ? up.task_status : (r.task_status || undefined),
              custom_assign: r.assign_type,
              custom_assign_to: Array.isArray(r.persons) ? r.persons.join(', ') : (r.persons || undefined)
            };
          });

          await fetch(`${erpnextConfig.url}/api/resource/Maintenance%20Schedule/${encodeURIComponent(selectedSchedule.name)}`, {
            method: 'PUT',
            credentials: 'include',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ schedules: updatedSchedules, status: 'Submitted', docstatus: 1 })
          });
        } catch (schedSyncErr) {
          console.warn("Failed syncing Maintenance Schedule:", schedSyncErr);
        }
      }

      if (typeof onUpdateScheduleStatus === 'function') {
        onUpdateScheduleStatus(selectedSchedule.name, 'Submitted');
      }

      setLocalSchedules(prev => prev.map(s => s.name === selectedSchedule.name ? { ...s, status: 'Submitted', docstatus: 1 } : s));
      setSelectedSchedule(prev => prev ? { ...prev, status: 'Submitted', docstatus: 1 } : prev);

      if (typeof fetchWorkOrders === 'function') {
        fetchWorkOrders();
      }

      showToast(created > 1 ? `${created} Tasks created successfully.` : "Task created successfully.", "success");

    } catch (error) {
      showToast(
        (error.message || "Task creation failed.") +
        " Check the Task list before retrying.",
        "error"
      );
    } finally {
      setBusyTasks(false);
      setBusyRowId(null);
    }
  };

  const employeeDir = techProfiles;

  const handleWOStatusChange = async (woId, newStatus) => {
    const erpStatus = newStatus === 'In Progress' || newStatus === 'Working' ? 'Working' : newStatus === 'Completed' ? 'Completed' : 'Open';
    const update = (wo) => ({ ...wo, status: newStatus, actualCost: newStatus === 'Completed' && wo.actualCost === 0 ? wo.estCost : wo.actualCost });
    setWorkOrders(prev => prev.map(wo => wo.id === woId ? update(wo) : wo));
    setSelectedWorkOrder(prev => prev && prev.id === woId ? update(prev) : prev);
    if (erpnextConfig?.url) {
      try {
        const res = await fetch(`${erpnextConfig.url}/api/resource/Task/${encodeURIComponent(woId)}`, {
          method: 'PUT', credentials: 'include',
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: erpStatus })
        });
        if (!res.ok) {
          await fetch(`${erpnextConfig.url}/api/method/frappe.client.set_value`, {
            method: 'POST', credentials: 'include',
            headers: getAuthHeaders(),
            body: JSON.stringify({ doctype: 'Task', name: woId, fieldname: 'status', value: erpStatus })
          });
        }
        fetchWorkOrders();
      } catch (e) {
        console.warn('Could not update Task status:', e);
      }
    }
  };

  const handleSchedCustomerChange = async (customerName) => {
    setSchedCustomer(customerName);

    if (!customerName) {
      setCustomerBookings([]);
      setCustomerUnits([]);
      setSchedBookingId('');
      setBookingDetails(null);
      setSchedItems([{
        itemCode: '',
        itemName: '',
        startDate: new Date().toISOString().split('T')[0],
        periodicity: 'Weekly',
        noOfVisits: 1,
        endDate: '',
        bookingId: ''
      }]);
      return;
    }

    if (!erpnextConfig?.url) {
      return;
    }

    try {
      // 1. Gather all possible identifiers/aliases for this customer (IDs, display names, party names)
      const custKeys = new Set();
      const addKey = (val) => {
        if (val && typeof val === 'string') {
          const s = val.trim().toLowerCase();
          if (s) custKeys.add(s);
        }
      };

      addKey(customerName);

      const tenantObj = (tenants || []).find(t =>
        (t.id && t.id.toString().toLowerCase() === customerName.toLowerCase()) ||
        (t.name && t.name.toString().toLowerCase() === customerName.toLowerCase()) ||
        (t.customer_name && t.customer_name.toString().toLowerCase() === customerName.toLowerCase())
      );
      if (tenantObj) {
        addKey(tenantObj.id);
        addKey(tenantObj.name);
        addKey(tenantObj.customer_name);
      }

      // Two-pass search in existing in-memory bookings to find cross-referenced customer IDs/names
      for (let pass = 0; pass < 2; pass++) {
        (bookings || []).forEach(b => {
          const bc = (b.customer || '').toString().trim().toLowerCase();
          const bcn = (b.customer_name || '').toString().trim().toLowerCase();
          if ((bc && custKeys.has(bc)) || (bcn && custKeys.has(bcn))) {
            addKey(b.customer);
            addKey(b.customer_name);
          }
        });
      }

      const isCustomerMatch = (b) => {
        const bc = (b.customer || '').toString().trim().toLowerCase();
        const bcn = (b.customer_name || '').toString().trim().toLowerCase();
        return (bc && custKeys.has(bc)) || (bcn && custKeys.has(bcn));
      };

      const isApproved = (b) => {
        const ws = (b.workflow_state || '').toString().trim();
        return ws.toLowerCase() === 'approved';
      };

      // 2. Find all matching approved bookings (workflow_state === "Approved") from memory first
      let matchedBookings = (bookings || []).filter(b => isCustomerMatch(b) && isApproved(b));

      // 3. Query ERPNext API for any approved bookings for this customer
      try {
        const custFilterVals = Array.from(new Set(Array.from(custKeys).map(k => k.trim()))).filter(Boolean);
        if (custFilterVals.length > 0) {
          const queries = [
            JSON.stringify([["customer", "in", custFilterVals], ["workflow_state", "=", "Approved"]]),
            JSON.stringify([["customer_name", "in", custFilterVals], ["workflow_state", "=", "Approved"]])
          ];

          for (const fStr of queries) {
            try {
              const url = `${erpnextConfig.url}/api/resource/Booking?filters=${encodeURIComponent(fStr)}&limit_page_length=200&order_by=creation desc`;
              const res = await fetch(url, {
                credentials: "include",
                headers: { "Content-Type": "application/json" }
              });
              if (res.ok) {
                const json = await res.json();
                const fetchedList = json.data || [];
                const existingIds = new Set(matchedBookings.map(b => b.name));
                fetchedList.forEach(b => {
                  if (!existingIds.has(b.name) && isApproved(b)) {
                    matchedBookings.push(b);
                    existingIds.add(b.name);
                  }
                });
              }
            } catch (qErr) {
              console.warn("API booking fetch query failed:", qErr);
            }
          }
        }
      } catch (fetchErr) {
        console.warn("API booking fetch for customer failed:", fetchErr);
      }

      if (matchedBookings.length === 0) {
        setCustomerBookings([]);
        setCustomerUnits([]);
        setSchedBookingId('');
        setBookingDetails(null);
        if (typeof frappe !== 'undefined' && frappe.msgprint) {
          frappe.msgprint(`No approved booking (workflow_state: Approved) found for ${tenantObj?.customer_name || customerName}`);
        } else {
          showToast(`No approved booking (workflow_state: Approved) found for ${tenantObj?.customer_name || customerName}`, 'info');
        }
        return;
      }

      // 4. Fetch full details for ALL matched bookings in parallel
      const fullBookings = await Promise.all(
        matchedBookings.map(async (b) => {
          try {
            const detailRes = await fetch(
              `${erpnextConfig.url}/api/resource/Booking/${encodeURIComponent(b.name)}`,
              {
                credentials: "include",
                headers: {
                  "Content-Type": "application/json"
                }
              }
            );
            if (detailRes.ok) {
              const detailJson = await detailRes.json();
              return detailJson.data || b;
            }
          } catch (e) {
            console.warn(`Failed to fetch complete booking details for ${b.name}:`, e);
          }
          return b;
        })
      );

      // Helper to identify non-unit charges/fees
      const isFee = (str) => {
        const s = (str || '').toString().trim().toLowerCase();
        return (
          s === 'promotional fee' ||
          s === 'service charge' ||
          s === 'security deposit' ||
          s === 'booking fee' ||
          s === 'advance amount' ||
          s.includes('promotional fee') ||
          s.includes('service charge')
        );
      };

      // 5. Extract all units across all bookings
      const allUnits = [];
      const seenUnitKeys = new Set();

      fullBookings.forEach(booking => {
        const bStartDate = booking.start_date || booking.starting_date || new Date().toISOString().split('T')[0];
        const bEndDate = booking.end_date || booking.ending_date || '';
        const bProp = getPropertyIdFromBooking(booking) || booking.property || '';
        const bPropGroup = booking.property_group || '';

        const bItems = Array.isArray(booking.booking_item) ? booking.booking_item : [];
        const unitItems = bItems.filter(item => {
          const code = (item.item_code || '').toString().trim();
          const name = (item.item_name || '').toString().trim();
          if (!code && !name) return false;
          if (isFee(code) || isFee(name)) return false;
          return true;
        });

        if (unitItems.length > 0) {
          unitItems.forEach(item => {
            const unitCode = item.item_code || item.name;
            const unitName = item.item_name || item.name || unitCode;
            const key = `${booking.name}::${unitCode}`;
            if (!seenUnitKeys.has(key)) {
              seenUnitKeys.add(key);
              allUnits.push({
                name: unitCode,
                item_code: unitCode,
                item_name: unitName,
                booking_id: booking.name,
                property: bProp,
                property_group: bPropGroup,
                start_date: bStartDate,
                end_date: bEndDate,
                bookingDoc: booking
              });
            }
          });
        }

        // Also check document-level unit fields
        const docUnit = booking.property_unit || booking.unit || booking.unit_name || booking.unit_code || '';
        if (docUnit && !isFee(docUnit)) {
          const key = `${booking.name}::${docUnit}`;
          if (!seenUnitKeys.has(key)) {
            seenUnitKeys.add(key);
            allUnits.push({
              name: docUnit,
              item_code: docUnit,
              item_name: booking.unit_name || docUnit,
              booking_id: booking.name,
              property: bProp,
              property_group: bPropGroup,
              start_date: bStartDate,
              end_date: bEndDate,
              bookingDoc: booking
            });
          }
        }
      });

      setCustomerBookings(fullBookings);
      setCustomerUnits(allUnits);

      if (allUnits.length > 0) {
        const firstUnit = allUnits[0];
        setSchedBookingId(firstUnit.booking_id);
        setBookingDetails(firstUnit.bookingDoc);
        if (firstUnit.property) setSchedProperty(firstUnit.property);
        if (firstUnit.property_group) setSchedPropertyGroup(firstUnit.property_group);

        setSchedItems([{
          itemCode: firstUnit.item_code,
          itemName: firstUnit.item_name,
          startDate: firstUnit.start_date,
          periodicity: "Weekly",
          noOfVisits: 1,
          endDate: firstUnit.end_date,
          bookingId: firstUnit.booking_id
        }]);
      } else if (fullBookings.length > 0) {
        const firstB = fullBookings[0];
        setSchedBookingId(firstB.name);
        setBookingDetails(firstB);
        const propId = getPropertyIdFromBooking(firstB) || firstB.property || '';
        if (propId) setSchedProperty(propId);
        if (firstB.property_group) setSchedPropertyGroup(firstB.property_group);

        setSchedItems([{
          itemCode: "",
          itemName: "",
          startDate: firstB.start_date || firstB.starting_date || new Date().toISOString().split('T')[0],
          periodicity: "Weekly",
          noOfVisits: 1,
          endDate: firstB.end_date || firstB.ending_date || "",
          bookingId: firstB.name
        }]);
      }
    } catch (error) {
      console.error("Customer Booking Error:", error);
      if (typeof frappe !== 'undefined' && frappe.msgprint) {
        frappe.msgprint({
          title: "Error",
          indicator: "red",
          message: error.message
        });
      } else {
        showToast(error.message, 'error');
      }
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
        const res = await fetch(`${erpnextConfig.url}/api/resource/Quotation`, { method: 'POST', credentials: 'include', headers: getAuthHeaders(), body: JSON.stringify(payload) });
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

  const isScheduleSubmitted = (sch) => {
    if (!sch) return false;
    if (sch.docstatus === 1 || (sch.status || '').toLowerCase() === 'submitted') return true;
    if (workOrders && workOrders.some(w => (
      (w.custom_mantainence_sechedule && w.custom_mantainence_sechedule === sch.name) ||
      (w.custom_maintenance_schedule && w.custom_maintenance_schedule === sch.name) ||
      (w.scheduleId && w.scheduleId === sch.name) ||
      (w.custom_schedule && w.custom_schedule === sch.name)
    ))) {
      return true;
    }
    return false;
  };

  const getScheduleDisplayStatus = (sch) => {
    if (!sch) return 'Draft';
    if (sch.status === 'Completed' || sch.status === 'Closed') return sch.status;
    if (isScheduleSubmitted(sch)) return 'Submitted';
    return sch.status || 'Draft';
  };

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
            <button className="btn btn-primary btn-sm" onClick={handleOpenScheduleModal}><Plus size={14} /> New Schedule</button>
          </div>

          <div className="grid-2col" style={{ gridTemplateColumns: selectedSchedule ? 'minmax(320px, 36%) minmax(600px, 64%)' : '1fr', gap: 24 }}>
            {viewMode === 'list' && (
              <div className="card-panel" style={{
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden'
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
                              <td><span className={`badge ${sch.status === 'Completed' ? 'badge-success' : isScheduleSubmitted(sch) ? 'badge-info' : 'badge-warning'}`}>{getScheduleDisplayStatus(sch)}</span></td>
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
                    return <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{daySchedules.map(sch => <div key={sch.name} onClick={() => handleSelectSchedule(sch)} style={{ padding: 10, background: 'var(--bg-tertiary)', borderLeft: '4px solid var(--brand-color)', borderRadius: 4, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><strong style={{ fontSize: 12 }}>{sch.name} ({sch.type})</strong><div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Tenant: {sch.customer_name || sch.customer} | Unit Name: {sch.items?.[0]?.item_name || '—'}</div></div><span className={`badge ${sch.status === 'Completed' ? 'badge-success' : isScheduleSubmitted(sch) ? 'badge-info' : 'badge-warning'}`}>{getScheduleDisplayStatus(sch)}</span></div>)}</div>;
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
                  <div>Status: <span className={`badge ${selectedSchedule.status === 'Completed' ? 'badge-success' : isScheduleSubmitted(selectedSchedule) ? 'badge-info' : 'badge-warning'}`}>{getScheduleDisplayStatus(selectedSchedule)}</span></div>
                </div>

                {/* ── Customer & Booking ID (Matching 2nd Image) ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary, #64748b)', marginBottom: 4, display: 'block' }}>customer</label>
                    <input
                      type="text"
                      readOnly
                      value={selectedSchedule.customer || selectedSchedule.customer_name || ''}
                      style={{
                        width: '100%',
                        background: 'var(--bg-tertiary, #f8fafc)',
                        border: '1px solid var(--border-color, #e2e8f0)',
                        borderRadius: 6,
                        padding: '8px 12px',
                        fontSize: 12.5,
                        color: 'var(--text-primary, #0f172a)',
                        outline: 'none',
                        cursor: 'default',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary, #64748b)', marginBottom: 4, display: 'block' }}>Booking ID</label>
                    <input
                      type="text"
                      readOnly
                      value={selectedSchedule.custom_booking_id || ''}
                      placeholder="—"
                      style={{
                        width: '100%',
                        background: 'var(--bg-tertiary, #f8fafc)',
                        border: '1px solid var(--border-color, #e2e8f0)',
                        borderRadius: 6,
                        padding: '8px 12px',
                        fontSize: 12.5,
                        color: 'var(--text-primary, #0f172a)',
                        outline: 'none',
                        cursor: 'default',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* ── Schedule Rows Table (Matching 2nd Image) ── */}
                <div style={{
                  border: '1px solid var(--border-color, #e2e8f0)',
                  borderRadius: 6,
                  overflowX: 'auto',
                  marginTop: 4,
                  background: 'var(--bg-secondary, #fff)'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, minWidth: 960 }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-tertiary, #f8fafc)', borderBottom: '1px solid var(--border-color, #e2e8f0)', textAlign: 'left' }}>
                        <th style={{ width: 34, padding: '8px 10px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={scheduleRows.length > 0 && scheduleRows.filter(r => !r.task_id).length > 0 && scheduleRows.filter(r => !r.task_id).every(r => r.selected)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setScheduleRows(prev => prev.map(r => r.task_id ? r : { ...r, selected: checked }));
                            }}
                            style={{ cursor: 'pointer' }}
                          />
                        </th>
                        <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-primary)' }}>Item Code</th>
                        <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-primary)' }}>Scheduled Date</th>
                        <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-primary)' }}>Maintenance Visit</th>
                        <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-primary)' }}>Visit Status</th>
                        <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-primary)' }}>Task ID</th>
                        <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-primary)' }}>Task Status</th>
                        <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-primary)', width: 100 }}>Assign</th>
                        <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-primary)', minWidth: 180 }}>Select Persons</th>
                        <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', minWidth: 120 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleRows.length === 0 ? (
                        <tr>
                          <td colSpan="10" style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No schedule visits available.
                          </td>
                        </tr>
                      ) : (
                        scheduleRows.map((row) => {
                          const hasTask = Boolean(row.task_id);
                          return (
                            <tr
                              key={row.id}
                              style={{
                                borderBottom: '1px solid var(--border-color, #e2e8f0)',
                                background: row.selected ? 'rgba(255, 221, 0, 0.08)' : 'transparent',
                                transition: 'background 0.15s ease'
                              }}
                            >
                              <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                                <input
                                  type="checkbox"
                                  disabled={hasTask}
                                  checked={row.selected}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setScheduleRows(prev => prev.map(r => r.id === row.id ? { ...r, selected: checked } : r));
                                  }}
                                  style={{ cursor: hasTask ? 'not-allowed' : 'pointer' }}
                                />
                              </td>
                              <td style={{ padding: '8px 10px', fontWeight: 500 }}>{row.item_code}</td>
                              <td style={{ padding: '8px 10px', color: 'var(--text-secondary)' }}>{row.scheduled_date}</td>
                              <td style={{ padding: '8px 10px', color: 'var(--text-muted)' }}>{row.maintenance_visit || '—'}</td>
                              <td style={{ padding: '8px 10px', color: 'var(--text-muted)' }}>{row.visit_status || '—'}</td>
                              <td style={{ padding: '8px 10px' }}>
                                {row.task_id ? (
                                  <span
                                    onClick={async () => {
                                      setActiveSection('task');
                                      const taskName = row.task_id;
                                      const matched = (workOrders || []).find(w => w.name === taskName || w.id === taskName);
                                      setSelectedWorkOrder(matched || { name: taskName, id: taskName });
                                      if (erpnextConfig?.url && taskName) {
                                        try {
                                          const res = await fetch(`${erpnextConfig.url}/api/resource/Task/${encodeURIComponent(taskName)}`, {
                                            credentials: 'include',
                                            headers: getAuthHeaders({ 'Content-Type': 'application/json' })
                                          });
                                          if (res.ok) {
                                            const json = await res.json();
                                            const fullDoc = json.data || json;
                                            setSelectedWorkOrder(fullDoc);
                                          }
                                        } catch (err) {
                                          console.warn('Failed fetching full task doc on task_id click:', err);
                                        }
                                      }
                                    }}
                                    style={{ color: 'var(--brand-color, #2563eb)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                                    title="Click to view Task details"
                                  >
                                    {row.task_id}
                                  </span>
                                ) : '—'}
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                {row.task_status ? (
                                  <span className={`badge ${row.task_status === 'Completed' ? 'badge-success' : row.task_status === 'Working' ? 'badge-primary' : 'badge-warning'}`}>
                                    {row.task_status}
                                  </span>
                                ) : '—'}
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                {hasTask ? (
                                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                                    {row.assign_type || '—'}
                                  </span>
                                ) : (
                                  <select
                                    className="form-select"
                                    value={row.assign_type || 'Employee'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setScheduleRows(prev => prev.map(r => r.id === row.id ? { ...r, assign_type: val, persons: [] } : r));
                                    }}
                                    style={{ fontSize: 11, padding: '3px 6px', height: 28, borderRadius: 4, width: '100%', minWidth: 85 }}
                                  >
                                    <option value="Employee">Employee</option>
                                    <option value="Vendor">Vendor</option>
                                  </select>
                                )}
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                {hasTask ? (
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                    {Array.isArray(row.persons) && row.persons.length > 0 ? (
                                      row.persons.map(p => (
                                        <span key={p} style={{ background: 'var(--bg-tertiary, #f1f5f9)', border: '1px solid var(--border-color, #e2e8f0)', padding: '2px 6px', borderRadius: 4, fontSize: 10.5, fontWeight: 500 }}>
                                          {p}
                                        </span>
                                      ))
                                    ) : (
                                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                                    )}
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                                    {Array.isArray(row.persons) && row.persons.map(pId => (
                                      <span
                                        key={pId}
                                        style={{
                                          background: 'var(--bg-tertiary, #f1f5f9)',
                                          border: '1px solid var(--border-color, #e2e8f0)',
                                          borderRadius: 4,
                                          padding: '2px 6px',
                                          fontSize: 10.5,
                                          fontWeight: 500,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: 4
                                        }}
                                      >
                                        {pId}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setScheduleRows(prev => prev.map(r => r.id === row.id ? { ...r, persons: (r.persons || []).filter(x => x !== pId) } : r));
                                          }}
                                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#ef4444', fontWeight: 700, fontSize: 12, lineHeight: 1 }}
                                        >
                                          ×
                                        </button>
                                      </span>
                                    ))}
                                    <select
                                      className="form-select"
                                      value=""
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (!val) return;
                                        setScheduleRows(prev => prev.map(r => {
                                          if (r.id !== row.id) return r;
                                          const current = Array.isArray(r.persons) ? r.persons : [];
                                          if (!current.includes(val)) {
                                            return { ...r, persons: [...current, val] };
                                          }
                                          return r;
                                        }));
                                      }}
                                      style={{ fontSize: 11, padding: '2px 6px', height: 26, minWidth: (row.persons?.length || 0) > 0 ? 95 : 130 }}
                                    >
                                      <option value="">{(row.persons?.length || 0) > 0 ? '+ Add' : (row.assign_type === 'Employee' ? 'Select Employee' : 'Select Vendor')}</option>
                                      {(row.assign_type === 'Employee' ? employees : vendorDir).map(item => {
                                        const id = item.id || item.name;
                                        const name = item.employee_name || item.name;
                                        if (row.persons?.includes(id)) return null;
                                        return (
                                          <option key={id} value={id}>
                                            {id}{name && name !== id ? ` (${name})` : ''}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                {hasTask ? (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4,
                                      fontSize: 11,
                                      fontWeight: 600,
                                      color: '#10b981',
                                      background: 'rgba(16, 185, 129, 0.1)',
                                      padding: '3px 8px',
                                      borderRadius: 4
                                    }}
                                  >
                                    <CheckCircle2 size={12} />
                                    Task Created
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn btn-sm"
                                    disabled={busyTasks}
                                    onClick={() => submit_tasks([row])}
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 600,
                                      padding: '4px 10px',
                                      borderRadius: 4,
                                      background: '#ffdd00',
                                      color: '#000',
                                      border: 'none',
                                      cursor: busyTasks ? 'not-allowed' : 'pointer',
                                      opacity: busyTasks && busyRowId === row.id ? 0.7 : 1,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 5,
                                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                      transition: 'all 0.15s ease'
                                    }}
                                    title="Create task for this scheduled visit"
                                  >
                                    <Hammer size={12} />
                                    {busyTasks && busyRowId === row.id ? 'Creating…' : 'Create task'}
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* ── Submit / Create Task Action Button (Matching 1st Image) ── */}
                {(!scheduleRows.length || !scheduleRows.every(r => Boolean(r.task_id))) ? (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{
                      marginTop: 10,
                      width: '100%',
                      background: '#ffdd00',
                      color: '#000',
                      fontWeight: 700,
                      fontSize: 13,
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      borderRadius: 6,
                      border: 'none',
                      cursor: busyTasks ? 'not-allowed' : 'pointer',
                      opacity: busyTasks ? 0.7 : 1,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }}
                    disabled={busyTasks}
                    onClick={() => submit_tasks()}
                  >
                    <Hammer size={15} />
                    {busyTasks && !busyRowId ? 'Creating Task(s)…' : `Create Task${scheduleRows.filter(r => r.selected && !r.task_id).length > 0 ? ` (${scheduleRows.filter(r => r.selected && !r.task_id).length} selected)` : ''}`}
                  </button>
                ) : (
                  <div style={{
                    marginTop: 10,
                    padding: '10px 14px',
                    background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    borderRadius: 6,
                    fontSize: 12,
                    color: '#10b981',
                    textAlign: 'center',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}>
                    <CheckCircle2 size={16} /> All Scheduled Tasks Created
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
              padding: 0
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
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {selectedWorkOrder.status === 'Completed' ? (
                    <span className="badge" style={{ fontSize: 10, padding: "2px 8px", backgroundColor: "#10b981", color: "#fff", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Check size={11} /> Submitted (Locked)
                    </span>
                  ) : selectedWorkOrder.status === 'Cancelled' || selectedWorkOrder.docstatus === 2 ? (
                    <span className="badge badge-danger" style={{ fontSize: 10, padding: "2px 8px" }}>Cancelled</span>
                  ) : (
                    <span className="badge badge-secondary" style={{ fontSize: 10, padding: "2px 8px" }}>Draft</span>
                  )}
                  <span className="badge badge-info" style={{ fontSize: 10, padding: "2px 8px" }}>{selectedWorkOrder.status || 'Open'}</span>
                  <span className="badge badge-warning" style={{ fontSize: 10, padding: "2px 8px" }}>{selectedWorkOrder.priority || 'Low'}</span>
                  <span className="badge badge-success" style={{ fontSize: 10, padding: "2px 8px" }}>{selectedWorkOrder.progress || 0}% Complete</span>
                </div>

                {/* Submitted status banner */}
                {selectedWorkOrder.status === 'Completed' && (
                  <div style={{ padding: "8px 12px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 6, color: "#10b981", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircle2 size={13} style={{ flexShrink: 0 }} />
                    <span><strong>Submitted State:</strong> Task is finalized and locked for modifications.</span>
                  </div>
                )}

                {/* Reference info */}
                <Section title="Reference">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <Info title="Schedule" value={selectedWorkOrder.custom_mantainence_sechedule || selectedWorkOrder.custom_maintenance_schedule || selectedWorkOrder.scheduleId} />
                    <Info title="Booking" value={selectedWorkOrder.custom_booking_number || selectedWorkOrder.custom_booking_id} />
                    <Info title="Tenant" value={selectedWorkOrder.custom_customer_name} />
                    <Info title="Contact" value={selectedWorkOrder.custom_customer_contact} />
                    <Info title="Company" value={selectedWorkOrder.company} />
                    <Info title="Assigned Type" value={selectedWorkOrder.custom_assign || (selectedWorkOrder.custom_assign_to_?.length ? "Employee" : selectedWorkOrder.custom_assign_to_vendor?.length ? "Vendor" : "—")} />
                    <Info title="Created" value={selectedWorkOrder.creation?.split(".")[0]} />
                    <Info title="Owner" value={selectedWorkOrder.owner} />
                  </div>
                </Section>

                {/* Cost - Hidden as requested, code retained */}
                {/* <Section title="Cost">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <Info title="Costing" value={`$${Number(selectedWorkOrder.total_costing_amount || 0).toLocaleString()}`} />
                    <Info title="Billing" value={`$${Number(selectedWorkOrder.total_billing_amount || 0).toLocaleString()}`} />
                  </div>
                </Section> */}

                {/* ── Assignment Panel ── */}
                <Section title="Assignments">
                  <TaskItemsPanel
                    taskDoc={selectedWorkOrder}
                    employeeDir={techProfiles.length > 0 ? techProfiles : employees}
                    vendorDir={vendorDir}
                    erpnextConfig={erpnextConfig}
                    getCsrfToken={getCsrfToken}
                    showToast={showToast}
                    // onSaved={(updatedData) => {
                    //   setSelectedWorkOrder(updatedData);
                    //   setWorkOrders(prev => prev.map(wo => wo.id === updatedData.name ? { ...wo, technician: (updatedData.custom_assign_to_ || [])[0]?.employee || wo.technician, vendor: (updatedData.custom_assign_to_vendor || [])[0]?.vendor || wo.vendor } : wo));
                    // }}
                    onSaved={(updatedData) => {
                      if (!updatedData) return;
                      setSelectedWorkOrder(prev => ({ ...prev, ...updatedData, status: updatedData.status || prev?.status }));
                      setWorkOrders(prev => prev.map(wo =>
                        (wo.id === updatedData.name || wo.name === updatedData.name || (selectedWorkOrder && (wo.id === selectedWorkOrder.name || wo.id === selectedWorkOrder.id)))
                          ? {
                            ...wo,
                            ...updatedData,
                            technician: (updatedData.custom_assign_to_ || [])[0]?.emp_id || wo.technician,
                            vendor: (updatedData.custom_assign_to_vendor || [])[0]?.vendor_name || wo.vendor,
                            status: updatedData.status || wo.status,
                            docstatus: updatedData.docstatus ?? wo.docstatus,
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
          <div className="card-panel">
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
          <div className="card-panel">
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
          <div className="modal-content" style={{ maxWidth: 880, width: '96vw', display: 'flex', flexDirection: 'column', maxHeight: '90vh', borderRadius: 12, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', overflow: 'hidden' }}>
            <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--bg-accent-alpha, rgba(6, 95, 70, 0.1))', color: 'var(--brand-color, #065f46)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CalendarIcon size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Create Maintenance Schedule</h3>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>Configure preventative maintenance visits and recurring service schedules.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-tertiary, #f1f5f9)', border: 'none', color: 'var(--text-secondary, #64748b)', cursor: 'pointer', transition: 'all 0.15s ease' }}
                title="Close modal"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '24px', overflowY: 'auto', flex: 1 }}>
                {scheduleStatusMessage && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: scheduleStatusMessage.type === 'success' ? 'rgba(6,95,70,0.08)' : 'rgba(239,68,68,0.08)',
                    border: `1px solid ${scheduleStatusMessage.type === 'success' ? 'rgba(6,95,70,0.2)' : 'rgba(239,68,68,0.2)'}`,
                    color: scheduleStatusMessage.type === 'success' ? '#065f46' : '#ef4444',
                    padding: '12px 16px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 500
                  }}>
                    {scheduleStatusMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                    <span>{scheduleStatusMessage.text}</span>
                  </div>
                )}

                {/* Single-Row Balanced Header Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: '16px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <User size={13} style={{ color: 'var(--brand-color, #065f46)' }} />
                      Tenant Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      className="form-select"
                      required
                      value={schedCustomer}
                      onChange={(e) => handleSchedCustomerChange(e.target.value)}
                      disabled={submittingSchedule || loadingBookings}
                      style={{ height: 38, fontSize: 13, borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', padding: '0 12px' }}
                    >
                      <option value="">-- Choose Tenant --</option>
                      {loadingBookings && <option value="" disabled>Loading approved tenants...</option>}
                      {!loadingBookings && filteredTenants.length === 0 && (
                        <option value="" disabled>No tenants with approved bookings found</option>
                      )}
                      {filteredTenants.map(customer => (
                        <option key={customer.name || customer.id} value={customer.name || customer.id}>
                          {customer.customer_name || customer.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ClipboardList size={13} style={{ color: 'var(--brand-color, #065f46)' }} />
                      Maintenance Type <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      className="form-select"
                      required
                      value={custom_maintenance_schedule || ''}
                      onChange={(e) => handlemaintenanceChange(e.target.value)}
                      disabled={submittingSchedule}
                      style={{ height: 38, fontSize: 13, borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', padding: '0 12px' }}
                    >
                      <option value="">-- Select Type --</option>
                      <option value="Scheduled Maintenance">Scheduled Maintenance</option>
                      <option value="Adhoc Maintenance">Adhoc Maintenance</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={13} style={{ color: 'var(--brand-color, #065f46)' }} />
                      Linked Booking
                      {customerBookings && customerBookings.length > 1 && (
                        <span style={{ fontSize: 10, background: 'var(--bg-accent-alpha, rgba(6, 95, 70, 0.1))', color: 'var(--brand-color, #065f46)', padding: '1px 6px', borderRadius: 10, fontWeight: 600, marginLeft: 4 }}>
                          {customerBookings.length} Bookings
                        </span>
                      )}
                    </label>
                    {customerBookings && customerBookings.length > 1 ? (
                      <select
                        value={schedBookingId || ''}
                        onChange={(e) => handleLinkedBookingChange(e.target.value)}
                        className="form-select"
                        disabled={submittingSchedule}
                        style={{ height: 38, fontSize: 13, borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', padding: '0 12px', color: 'var(--text-primary)', fontWeight: 500 }}
                      >
                        <option value="">-- Select Linked Booking --</option>
                        {customerBookings.map(b => (
                          <option key={b.name} value={b.name}>
                            {b.name} {b.property ? `· ${b.property}` : ''}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={schedBookingId || ''}
                        placeholder={schedCustomer ? 'No submitted booking' : 'Auto-linked upon selection'}
                        readOnly
                        className="form-input"
                        disabled
                        style={{ height: 38, fontSize: 13, boxSizing: 'border-box', background: 'var(--bg-tertiary, #f8fafc)', border: '1px solid var(--border-color)', borderRadius: 6, padding: '0 12px', color: schedBookingId ? 'var(--text-primary)' : 'var(--text-muted)' }}
                      />
                    )}
                  </div>
                </div>

                {/* Items Child Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <label style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Scheduled Items & Units</label>
                      <span style={{ fontSize: 11, background: 'var(--bg-accent-alpha, rgba(6, 95, 70, 0.1))', color: 'var(--brand-color, #065f46)', padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>
                        {schedItems.length} {schedItems.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                    {/* <button
                      type="button"
                      onClick={() => setSchedItems(prev => [
                        ...prev,
                        {
                          itemCode: '',
                          itemName: '',
                          startDate: schedTransDate || new Date().toISOString().split('T')[0],
                          periodicity: 'Weekly',
                          noOfVisits: 1,
                          endDate: '',
                          bookingId: schedBookingId || ''
                        }
                      ])}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '4px 10px',
                        fontSize: 12,
                        fontWeight: 600,
                        borderRadius: 6,
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--brand-color, #065f46)',
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={13} />
                      Add Unit
                    </button> */}
                  </div>

                  <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                    <div style={{ overflowX: 'auto', maxHeight: 280, overflowY: 'auto' }}>
                      <table style={{ width: '100%', minWidth: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: 12 }}>
                        <colgroup>
                          <col style={{ width: '21%' }} />
                          <col style={{ width: '20%' }} />
                          <col style={{ width: '16%' }} />
                          <col style={{ width: '15%' }} />
                          <col style={{ width: '11%' }} />
                          <col style={{ width: '14%' }} />
                          <col style={{ width: '3%' }} />
                        </colgroup>
                        <thead>
                          <tr style={{ background: 'var(--bg-tertiary, #f8fafc)', position: 'sticky', top: 0, zIndex: 1, borderBottom: '1px solid var(--border-color)' }}>
                            {['Unit Code', 'Unit Name', 'Start Date', 'Periodicity', 'No. of Visits', 'End Date', ''].map((h, i) => (
                              <th key={i} style={{ ...thStyle, textTransform: 'uppercase', letterSpacing: '0.03em', fontSize: 11, fontWeight: 600, padding: i === 4 ? '10px 4px' : '10px 8px', textAlign: i === 4 || i === 6 ? 'center' : 'left', whiteSpace: 'nowrap' }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {schedItems.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: idx < schedItems.length - 1 ? '1px solid var(--border-color)' : 'none', background: idx % 2 === 0 ? 'transparent' : 'var(--bg-tertiary, rgba(0,0,0,0.015))' }}>
                              <td style={{ padding: '8px 10px' }}>
                                {availableSchedUnits.length === 0 ? (
                                  <input
                                    type="text"
                                    value={row.itemCode}
                                    onChange={(e) => handleSchedItemCodeChange(idx, e.target.value)}
                                    placeholder="Enter or select unit"
                                    className="form-input"
                                    style={{ ...inputStyle, height: 32, borderRadius: 6, border: '1px solid var(--border-color)' }}
                                  />
                                ) : (
                                  <select
                                    value={
                                      row.bookingId && row.itemCode
                                        ? `${row.bookingId}::${row.itemCode}`
                                        : (availableSchedUnits.find(u => (u.item_code || u.name) === row.itemCode && (!row.bookingId || u.booking_id === row.bookingId))
                                          ? (availableSchedUnits.find(u => (u.item_code || u.name) === row.itemCode && (!row.bookingId || u.booking_id === row.bookingId)).booking_id
                                            ? `${availableSchedUnits.find(u => (u.item_code || u.name) === row.itemCode && (!row.bookingId || u.booking_id === row.bookingId)).booking_id}::${row.itemCode}`
                                            : row.itemCode)
                                          : row.itemCode)
                                    }
                                    onChange={(e) => handleSchedItemCodeChange(idx, e.target.value)}
                                    className="form-select"
                                    required
                                    style={{ ...inputStyle, height: 32, borderRadius: 6, border: '1px solid var(--border-color)', fontWeight: 500 }}
                                  >
                                    <option value="">-- Select Unit --</option>
                                    {availableSchedUnits.map((u, uIdx) => {
                                      const optVal = u.booking_id ? `${u.booking_id}::${u.item_code || u.name}` : (u.item_code || u.name);
                                      const hasMultipleBookings = customerBookings && customerBookings.length > 1;
                                      const optLabel = u.booking_id && hasMultipleBookings
                                        ? `${u.name || u.item_code} · ${u.booking_id}`
                                        : (u.name || u.item_code);
                                      return (
                                        <option key={`${optVal}-${uIdx}`} value={optVal}>
                                          {optLabel}
                                        </option>
                                      );
                                    })}
                                  </select>
                                )}
                              </td>
                              <td style={{ padding: '8px 10px', color: 'var(--text-secondary, #6b7280)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {row.itemName || (row.itemCode ? '…' : '—')}
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                <input type="date" value={row.startDate} onChange={(e) => setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, startDate: e.target.value } : r))} className="form-input" required style={{ ...inputStyle, height: 32, borderRadius: 6, border: '1px solid var(--border-color)' }} />
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                <select value={row.periodicity} onChange={(e) => setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, periodicity: e.target.value } : r))} className="form-select" required style={{ ...inputStyle, height: 32, borderRadius: 6, border: '1px solid var(--border-color)' }}>
                                  <option value="Weekly">Weekly</option>
                                  <option value="Monthly">Monthly</option>
                                  <option value="Quarterly">Quarterly</option>
                                  <option value="Half Yearly">Half Yearly</option>
                                  <option value="Yearly">Yearly</option>
                                  <option value="Random">Random</option>
                                </select>
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                <input type="number" min="1" value={row.noOfVisits} onChange={(e) => setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, noOfVisits: Number(e.target.value) || 1 } : r))} className="form-input" required style={{ ...inputStyle, height: 32, textAlign: 'center', borderRadius: 6, border: '1px solid var(--border-color)' }} />
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                <input type="date" value={row.endDate} onChange={(e) => setSchedItems(prev => prev.map((r, i) => i === idx ? { ...r, endDate: e.target.value } : r))} className="form-input" required style={{ ...inputStyle, height: 32, borderRadius: 6, border: '1px solid var(--border-color)' }} />
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => setSchedItems(prev => prev.filter((_, i) => i !== idx))}
                                  disabled={schedItems.length <= 1}
                                  title="Remove item"
                                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 6, border: 'none', background: 'transparent', color: schedItems.length <= 1 ? 'var(--text-muted)' : '#ef4444', cursor: schedItems.length <= 1 ? 'not-allowed' : 'pointer', opacity: schedItems.length <= 1 ? 0.35 : 1, transition: 'all 0.15s ease' }}
                                >
                                  <Trash size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, padding: '16px 24px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowScheduleModal(false)} disabled={submittingSchedule} style={{ padding: '8px 18px', borderRadius: 6, fontSize: 13 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submittingSchedule} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
                  {submittingSchedule ? (
                    <>
                      <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      Create Maintenance Schedule
                    </>
                  )}
                </button>
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
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Create Task</h3>
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
                onClick={handleCreateTask}
                disabled={woSubmitting || (woAssignType === 'employee' ? woAssignedEmployees.length === 0 : woAssignedVendors.length === 0)}
              >
                {woSubmitting ? 'Creating…' : 'Create Task'}
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