// // // import { useState, useEffect, useRef } from "react";
// // // import { Plus, Minus, Trash2, Save, RefreshCw, FileText, CheckCircle2, ChevronDown, Search } from "lucide-react";

// // // // ---------- Fallback checklist (used only if you don't pass your own AssignChecklist) ----------
// // // function DefaultAssignChecklist({ items = [], selected = [], onToggle, emptyMsg = "No items.", renderLabel }) {
// // //   if (!items || items.length === 0) {
// // //     return <div style={emptyMsgStyle}>{emptyMsg}</div>;
// // //   }
// // //   return (
// // //     <div style={{ border: "1px solid var(--border-color)", borderRadius: 6, maxHeight: 160, overflowY: "auto" }}>
// // //       {items.map((item) => {
// // //         const id = item?.id;
// // //         const checked = selected.includes(id);
// // //         return (
// // //           <label
// // //             key={id}
// // //             style={{
// // //               display: "flex", alignItems: "center", gap: 8,
// // //               padding: "7px 10px", borderBottom: "1px solid var(--border-color)",
// // //               cursor: "pointer", fontSize: 12,
// // //             }}
// // //           >
// // //             <input type="checkbox" checked={checked} onChange={() => onToggle?.(id)} />
// // //             <div style={{ display: "flex", flexDirection: "column" }}>
// // //               {renderLabel ? renderLabel(item) : <span>{item?.name}</span>}
// // //             </div>
// // //           </label>
// // //         );
// // //       })}
// // //     </div>
// // //   );
// // // }

// // // // ---------- Searchable Item Dropdown ----------
// // // function ItemSearchDropdown({ erpnextConfig, onSelect, selectedLabel }) {
// // //   const [open, setOpen] = useState(false);
// // //   const [query, setQuery] = useState("");
// // //   const [options, setOptions] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const wrapRef = useRef(null);

// // //   useEffect(() => {
// // //     const handleClickOutside = (e) => {
// // //       if (wrapRef.current && !wrapRef.current.contains(e.target)) {
// // //         setOpen(false);
// // //       }
// // //     };
// // //     document.addEventListener("mousedown", handleClickOutside);
// // //     return () => document.removeEventListener("mousedown", handleClickOutside);
// // //   }, []);

// // //   useEffect(() => {
// // //     if (!open) return;
// // //     if (!erpnextConfig?.url) return;

// // //     const t = setTimeout(async () => {
// // //       setLoading(true);
// // //       try {
// // //         const filters = query ? [["item_code", "like", `%${query}%`]] : [];
// // //         const res = await fetch(
// // //           `${erpnextConfig.url}/api/resource/Item?filters=${encodeURIComponent(
// // //             JSON.stringify(filters)
// // //           )}&fields=${encodeURIComponent(JSON.stringify(["item_code", "item_name"]))}&limit_page_length=20`,
// // //           { credentials: "include" }
// // //         );
// // //         const json = await res.json();
// // //         setOptions(Array.isArray(json?.data) ? json.data : []);
// // //       } catch (e) {
// // //         console.error("Item search failed:", e);
// // //         setOptions([]);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     }, 250);
// // //     return () => clearTimeout(t);
// // //   }, [query, open, erpnextConfig?.url]);

// // //   return (
// // //     <div ref={wrapRef} style={{ position: "relative", flex: 1 }}>
// // //       <div
// // //         onClick={() => setOpen((o) => !o)}
// // //         style={{
// // //           display: "flex", alignItems: "center", justifyContent: "space-between",
// // //           padding: "7px 10px", fontSize: 12, borderRadius: 6,
// // //           border: "1px solid var(--border-color)", background: "var(--bg-primary)",
// // //           color: selectedLabel ? "var(--text-primary)" : "var(--text-muted)",
// // //           cursor: "pointer",
// // //         }}
// // //       >
// // //         <span>{selectedLabel || "Select item…"}</span>
// // //         <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "none", transition: "0.15s" }} />
// // //       </div>

// // //       {open && (
// // //         <div
// // //           style={{
// // //             position: "absolute", top: "100%", left: 0, right: 0, zIndex: 20,
// // //             background: "var(--bg-primary)", border: "1px solid var(--border-color)",
// // //             borderRadius: 6, marginTop: 4, boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
// // //           }}
// // //         >
// // //           <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderBottom: "1px solid var(--border-color)" }}>
// // //             <Search size={12} style={{ color: "var(--text-muted)" }} />
// // //             <input
// // //               autoFocus
// // //               type="text"
// // //               value={query}
// // //               onChange={(e) => setQuery(e.target.value)}
// // //               placeholder="Search item code…"
// // //               style={{ flex: 1, border: "none", outline: "none", fontSize: 12, background: "transparent", color: "var(--text-primary)" }}
// // //             />
// // //           </div>
// // //           <div style={{ maxHeight: 180, overflowY: "auto" }}>
// // //             {loading ? (
// // //               <div style={{ padding: "8px 10px", fontSize: 11, color: "var(--text-muted)" }}>Searching…</div>
// // //             ) : options.length === 0 ? (
// // //               <div style={{ padding: "8px 10px", fontSize: 11, color: "var(--text-muted)" }}>No items found.</div>
// // //             ) : (
// // //               options.map((opt) => (
// // //                 <div
// // //                   key={opt.item_code}
// // //                   onClick={() => {
// // //                     onSelect?.(opt);
// // //                     setOpen(false);
// // //                     setQuery("");
// // //                   }}
// // //                   style={{ padding: "7px 10px", fontSize: 11.5, cursor: "pointer", borderBottom: "1px solid var(--border-color)" }}
// // //                   onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)")}
// // //                   onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
// // //                 >
// // //                   <span style={{ fontWeight: 600, color: "var(--brand-color)" }}>{opt.item_code}</span>
// // //                   {opt.item_name && opt.item_name !== opt.item_code && (
// // //                     <span style={{ color: "var(--text-secondary)" }}> — {opt.item_name}</span>
// // //                   )}
// // //                 </div>
// // //               ))
// // //             )}
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // // ---------- Main combined component ----------
// // // function TaskAssignPanel({
// // //   taskDoc,
// // //   employeeDir = [],
// // //   vendorDir = [],
// // //   erpnextConfig,
// // //   getCsrfToken,
// // //   showToast,
// // //   onSaved,
// // //   AssignChecklistComponent, // optional: pass your real AssignChecklist here if you have one
// // // }) {
// // //   const AssignChecklist = AssignChecklistComponent || DefaultAssignChecklist;

// // //   // ===================== ASSIGN (EMPLOYEE / VENDOR) =====================
// // //   const [assignType, setAssignType] = useState("");
// // //   const [savingAssign, setSavingAssign] = useState(false);

// // //   useEffect(() => {
// // //     setAssignType((taskDoc?.custom_assign || "").toLowerCase());
// // //   }, [taskDoc?.custom_assign]);

// // //   const [selectedEmpIds, setSelectedEmpIds] = useState([]);
// // //   const [selectedVendorIds, setSelectedVendorIds] = useState([]);

// // //   useEffect(() => {
// // //     setSelectedEmpIds((taskDoc?.custom_assign_to_ || []).map((r) => r?.emp_id).filter(Boolean));
// // //     setSelectedVendorIds((taskDoc?.custom_assign_to_vendor || []).map((r) => r?.vendor_name).filter(Boolean));
// // //   }, [taskDoc]);

// // //   const toggleEmp = (id) => setSelectedEmpIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
// // //   const toggleVendor = (id) => setSelectedVendorIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

// // //   const empRows = taskDoc?.custom_assign_to_ || [];
// // //   const vendorRows = taskDoc?.custom_assign_to_vendor || [];

// // //   const handleReassign = async () => {
// // //     if (!erpnextConfig?.url || !taskDoc?.name) {
// // //       showToast?.("No ERPNext connection.", "error");
// // //       return;
// // //     }
// // //     setSavingAssign(true);
// // //     try {
// // //       let body = {};
// // //       if (assignType === "employee") {
// // //         body = {
// // //           custom_assign_to_: selectedEmpIds.map((empId) => {
// // //             const emp = employeeDir.find((e) => e?.id === empId);
// // //             return {
// // //               emp_id: empId,
// // //               emp_name: emp?.name || "",
// // //               designation: emp?.certs || emp?.designation || "",
// // //               contact_number: emp?.phone || "",
// // //             };
// // //           }),
// // //         };
// // //       } else {
// // //         body = {
// // //           custom_assign_to_vendor: selectedVendorIds.map((vendorId) => {
// // //             const vendor = vendorDir.find((v) => v?.id === vendorId);
// // //             return {
// // //               vendor_name: vendorId,
// // //               supplier_type: vendor?.type || "",
// // //             };
// // //           }),
// // //         };
// // //       }

// // //       const res = await fetch(`${erpnextConfig.url}/api/resource/Task/${taskDoc.name}`, {
// // //         method: "PUT",
// // //         credentials: "include",
// // //         headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": getCsrfToken?.() },
// // //         body: JSON.stringify(body),
// // //       });
// // //       const json = await res.json();

// // //       if (!res.ok) {
// // //         showToast?.(json?.exception || "Failed to update assignment.", "error");
// // //         return;
// // //       }

// // //       showToast?.(`${assignType === "employee" ? "Employees" : "Vendors"} updated successfully.`, "success");
// // //       onSaved?.(json.data);
// // //     } catch (err) {
// // //       console.error(err);
// // //       showToast?.("Error saving assignment.", "error");
// // //     } finally {
// // //       setSavingAssign(false);
// // //     }
// // //   };

// // //   // ===================== ITEMS USED FOR MAINTENANCE =====================
// // //   const [itemRows, setItemRows] = useState([]);
// // //   const [pendingItem, setPendingItem] = useState(null);
// // //   const [pendingQty, setPendingQty] = useState(1);
// // //   const [savingItems, setSavingItems] = useState(false);
// // //   const [submitting, setSubmitting] = useState(false);
// // //   const [showConfirm, setShowConfirm] = useState(false);

// // //   // ---- NEW: tracks whether the current itemRows have been saved to ERPNext ----
// // //   const [itemsSaved, setItemsSaved] = useState(true);

// // //   const isSubmitted = taskDoc?.docstatus === 1;

// // //   useEffect(() => {
// // //     setItemRows(
// // //       (taskDoc?.custom_items_used_for_maintenance || []).map((r) => ({
// // //         name: r?.name,
// // //         item_code: r?.item_code,
// // //         item_name: r?.item_name,
// // //         qty: r?.qty || 1,
// // //       }))
// // //     );
// // //     // When taskDoc changes (fresh load / after save), treat items as already saved
// // //     setItemsSaved(true);
// // //   }, [taskDoc]);

// // //   // Mark items as unsaved whenever the list is mutated locally
// // //   const addItemToList = () => {
// // //     if (!pendingItem) {
// // //       showToast?.("Select an item first.", "error");
// // //       return;
// // //     }
// // //     if (pendingQty <= 0) {
// // //       showToast?.("Quantity must be greater than zero.", "error");
// // //       return;
// // //     }
// // //     setItemRows((prev) => {
// // //       const idx = prev.findIndex((r) => r.item_code === pendingItem.item_code);
// // //       if (idx >= 0) {
// // //         const copy = [...prev];
// // //         copy[idx] = { ...copy[idx], qty: copy[idx].qty + pendingQty };
// // //         return copy;
// // //       }
// // //       return [...prev, { item_code: pendingItem.item_code, item_name: pendingItem.item_name, qty: pendingQty }];
// // //     });
// // //     setPendingItem(null);
// // //     setPendingQty(1);
// // //     setItemsSaved(false); // unsaved after adding
// // //   };

// // //   const removeRow = (idx) => {
// // //     setItemRows((prev) => prev.filter((_, i) => i !== idx));
// // //     setItemsSaved(false); // unsaved after removing
// // //   };

// // //   const changeRowQty = (idx, delta) => {
// // //     setItemRows((prev) => prev.map((r, i) => (i === idx ? { ...r, qty: Math.max(1, r.qty + delta) } : r)));
// // //     setItemsSaved(false); // unsaved after qty change
// // //   };

// // //   // ---- "Update Items" — PUT to ERPNext, then console.log the response ----
// // //   const handleUpdateItems = async () => {
// // //     if (!erpnextConfig?.url || !taskDoc?.name) {
// // //       showToast?.("No ERPNext connection.", "error");
// // //       return;
// // //     }
// // //     setSavingItems(true);
// // //     try {
// // //       const body = {
// // //         custom_items_used_for_maintenance: itemRows.map((r) => ({
// // //           item_code: r.item_code,
// // //           item_name: r.item_name,
// // //           qty: r.qty,
// // //         })),
// // //       };
// // //       const res = await fetch(`${erpnextConfig.url}/api/resource/Task/${taskDoc.name}`, {
// // //         method: "PUT",
// // //         credentials: "include",
// // //         headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": getCsrfToken?.() },
// // //         body: JSON.stringify(body),
// // //       });
// // //       const json = await res.json();

// // //       if (!res.ok) {
// // //         showToast?.(json?.exception || "Failed to update items.", "error");
// // //         return;
// // //       }

// // //       console.log("Updated Task doc JSON:", json.data); // ← log for you to wire up
// // //       showToast?.("Items used for maintenance updated successfully.", "success");
// // //       setItemsSaved(true); // ← unlock Submit / Reassign / Quotation buttons
// // //       onSaved?.(json.data);
// // //     } catch (e) {
// // //       console.error(e);
// // //       showToast?.("Error updating items.", "error");
// // //     } finally {
// // //       setSavingItems(false);
// // //     }
// // //   };

// // //   const handleSubmitClick = () => {
// // //     if (itemRows.length === 0) {
// // //       showToast?.("Add at least one item before submitting.", "error");
// // //       return;
// // //     }
// // //     setShowConfirm(true);
// // //   };

// // //   const handleConfirmSubmit = async () => {
// // //     setShowConfirm(false);
// // //     if (!erpnextConfig?.url || !taskDoc?.name) {
// // //       showToast?.("No ERPNext connection.", "error");
// // //       return;
// // //     }
// // //     setSubmitting(true);
// // //     try {
// // //       const stockoutRes = await fetch(
// // //         `${erpnextConfig.url}/api/method/property_management.property_management.property_management.api.submit_task_stockout_api`,
// // //         {
// // //           method: "POST",
// // //           credentials: "include",
// // //           headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": getCsrfToken?.() },
// // //           body: JSON.stringify({ task_name: taskDoc.name }),
// // //         }
// // //       );
// // //       const stockoutJson = await stockoutRes.json();
// // //       const stockoutResult = stockoutJson?.message;

// // //       if (!stockoutResult || !stockoutResult.success) {
// // //         showToast?.(stockoutResult?.error || "Stock-out validation failed.", "error");
// // //         return;
// // //       }
// // //       if (stockoutResult.stock_entry) {
// // //         showToast?.(`Stock Entry ${stockoutResult.stock_entry} created.`, "success");
// // //       }

// // //       const today = new Date().toISOString().slice(0, 10);
// // //       const updateRes = await fetch(`${erpnextConfig.url}/api/resource/Task/${taskDoc.name}`, {
// // //         method: "PUT",
// // //         credentials: "include",
// // //         headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": getCsrfToken?.() },
// // //         body: JSON.stringify({ status: "Completed", completed_on: today, docstatus: 1 }),
// // //       });
// // //       const updateJson = await updateRes.json();

// // //       if (!updateRes.ok) {
// // //         showToast?.(updateJson?.exception || "Failed to submit task.", "error");
// // //         return;
// // //       }

// // //       showToast?.("Task submitted and marked Completed.", "success");
// // //       onSaved?.(updateJson.data);
// // //     } catch (e) {
// // //       console.error(e);
// // //       showToast?.("Error submitting task.", "error");
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   };

// // //   // ---- Quotation handlers — console.log only, you wire up the real logic ----
// // //   const handleCreateQuotation = () => {
// // //     console.log("Create Quotation clicked — wire up logic here.");
// // //   };

// // //   const handleViewQuotation = () => {
// // //     console.log("View Quotation clicked — wire up logic here.");
// // //   };

// // //   // ===================== GUARD: don't render until taskDoc exists =====================
// // //   if (!taskDoc) {
// // //     return <div style={emptyMsgStyle}>Loading task…</div>;
// // //   }

// // //   // Reassign button is locked while there are unsaved item changes
// // //   const reassignDisabled = savingAssign
// // //     || !itemsSaved
// // //     || (assignType === "employee" ? selectedEmpIds.length === 0 : selectedVendorIds.length === 0);

// // //   return (
// // //     <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
// // //       {assignType === "employee" ? (
// // //         <div>
// // //           <div style={sectionLabelStyle}>Current Employees</div>
// // //           {empRows.length === 0 ? (
// // //             <div style={emptyMsgStyle}>No employees assigned yet.</div>
// // //           ) : (
// // //             <div style={tableWrapStyle}>
// // //               <table style={tableStyle}>
// // //                 <thead>
// // //                   <tr style={{ background: "var(--bg-tertiary)" }}>
// // //                     <th style={thStyle}>Emp ID</th>
// // //                     <th style={thStyle}>Name</th>
// // //                     <th style={thStyle}>Designation</th>
// // //                     <th style={thStyle}>Contact</th>
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {empRows.map((r, i) => {
// // //                     const match = employeeDir.find((e) => e?.id === r?.emp_id);
// // //                     return (
// // //                       <tr key={r?.name || i} style={trStyle(i, empRows.length)}>
// // //                         <td style={tdStyle}><span style={{ color: "var(--brand-color)", fontWeight: 600 }}>{r?.emp_id || r?.name}</span></td>
// // //                         <td style={tdStyle}>{r?.emp_name || match?.name || "—"}</td>
// // //                         <td style={{ ...tdStyle, color: "var(--text-secondary)" }}>{r?.designation || match?.certs || "—"}</td>
// // //                         <td style={{ ...tdStyle, color: "var(--text-secondary)" }}>{r?.contact_number || match?.phone || "—"}</td>
// // //                       </tr>
// // //                     );
// // //                   })}
// // //                 </tbody>
// // //               </table>
// // //             </div>
// // //           )}

// // //           {!isSubmitted && (
// // //           <div style={{ marginTop: 10 }}>
// // //             <div style={sectionLabelStyle}>Reassign Employees</div>
// // //             <AssignChecklist
// // //               items={employeeDir}
// // //               selected={selectedEmpIds}
// // //               onToggle={toggleEmp}
// // //               emptyMsg="No employees available in the system."
// // //               renderLabel={(emp) => (
// // //                 <>
// // //                   <span style={{ fontSize: 12, fontWeight: 500 }}>{emp?.name}</span>
// // //                   {(emp?.certs || emp?.skill) && (
// // //                     <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{emp?.certs || ""}{emp?.skill ? ` · ${emp.skill}` : ""}</span>
// // //                   )}
// // //                 </>
// // //               )}
// // //             />
// // //             {selectedEmpIds.length > 0 && (
// // //               <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 5 }}>
// // //                 {selectedEmpIds.length} employee{selectedEmpIds.length > 1 ? "s" : ""} selected
// // //               </div>
// // //             )}
// // //           </div>
// // //           )}
// // //         </div>
// // //       ) : (
// // //         <div>
// // //           <div style={sectionLabelStyle}>Current Vendors</div>
// // //           {vendorRows.length === 0 ? (
// // //             <div style={emptyMsgStyle}>No vendors assigned yet.</div>
// // //           ) : (
// // //             <div style={tableWrapStyle}>
// // //               <table style={tableStyle}>
// // //                 <thead>
// // //                   <tr style={{ background: "var(--bg-tertiary)" }}>
// // //                     <th style={thStyle}>Vendor ID</th>
// // //                     <th style={thStyle}>Vendor Name</th>
// // //                     <th style={thStyle}>Supplier Type</th>
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {vendorRows.map((r, i) => {
// // //                     const match = vendorDir.find((v) => v?.id === r?.vendor_name);
// // //                     return (
// // //                       <tr key={r?.name || i} style={trStyle(i, vendorRows.length)}>
// // //                         <td style={tdStyle}><span style={{ color: "var(--brand-color)", fontWeight: 600 }}>{r?.vendor || r?.name}</span></td>
// // //                         <td style={tdStyle}>{match?.name || r?.vendor || "—"}</td>
// // //                         <td style={{ ...tdStyle, color: "var(--text-secondary)" }}>{match?.type || r?.supplier_type || "—"}</td>
// // //                       </tr>
// // //                     );
// // //                   })}
// // //                 </tbody>
// // //               </table>
// // //             </div>
// // //           )}

// // //           {!isSubmitted && (
// // //           <div style={{ marginTop: 10 }}>
// // //             <div style={sectionLabelStyle}>Reassign Vendors</div>
// // //             <AssignChecklist
// // //               items={vendorDir}
// // //               selected={selectedVendorIds}
// // //               onToggle={toggleVendor}
// // //               emptyMsg="No vendors available in the system."
// // //               renderLabel={(v) => (
// // //                 <>
// // //                   <span style={{ fontSize: 12, fontWeight: 500 }}>{v?.name}</span>
// // //                   {v?.type && <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{v.type}</span>}
// // //                 </>
// // //               )}
// // //             />
// // //             {selectedVendorIds.length > 0 && (
// // //               <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 5 }}>
// // //                 {selectedVendorIds.length} vendor{selectedVendorIds.length > 1 ? "s" : ""} selected
// // //               </div>
// // //             )}
// // //           </div>
// // //           )}
// // //         </div>
// // //       )}

// // //       {/* Reassign button — hidden when submitted, disabled until items are saved */}
// // //       {!isSubmitted && <button
// // //         type="button"
// // //         onClick={handleReassign}
// // //         disabled={reassignDisabled}
// // //         title={!itemsSaved ? "Save item changes first (Update Items)" : undefined}
// // //         style={{
// // //           display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
// // //           padding: "9px 0", borderRadius: 7, border: "none",
// // //           cursor: reassignDisabled ? "not-allowed" : "pointer",
// // //           fontSize: 12, fontWeight: 700,
// // //           background: savingAssign ? "var(--bg-tertiary)" : "var(--brand-color, #2563eb)",
// // //           color: savingAssign ? "var(--text-secondary)" : "#fff",
// // //           opacity: reassignDisabled ? 0.45 : 1,
// // //         }}
// // //       >
// // //         {savingAssign ? (
// // //           <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Saving…</>
// // //         ) : (
// // //           <><Save size={13} /> Reassign {assignType === "employee" ? "Employees" : "Vendors"}</>
// // //         )}
// // //       </button>}

// // //       <div>
// // //         <div style={sectionLabelStyle}>Items Used for Maintenance</div>

// // //         {itemRows.length === 0 ? (
// // //           <div style={emptyMsgStyle}>No items added yet.</div>
// // //         ) : (
// // //           <div style={tableWrapStyle}>
// // //             <table style={tableStyle}>
// // //               <thead>
// // //                 <tr style={{ background: "var(--bg-tertiary)" }}>
// // //                   <th style={thStyle}>Item Code</th>
// // //                   <th style={thStyle}>Item Name</th>
// // //                   <th style={thStyle}>Qty</th>
// // //                   {!isSubmitted && <th style={thStyle}></th>}
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {itemRows.map((r, i) => (
// // //                   <tr key={r?.name || r?.item_code || i} style={trStyle(i, itemRows.length)}>
// // //                     <td style={{ ...tdStyle, color: "var(--brand-color)", fontWeight: 600 }}>{r?.item_code}</td>
// // //                     <td style={tdStyle}>{r?.item_name || "—"}</td>
// // //                     <td style={tdStyle}>
// // //                       {isSubmitted ? (
// // //                         r?.qty
// // //                       ) : (
// // //                         <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
// // //                           <button type="button" onClick={() => changeRowQty(i, -1)} style={stepperBtnStyle}><Minus size={11} /></button>
// // //                           <span style={{ minWidth: 18, textAlign: "center" }}>{r?.qty}</span>
// // //                           <button type="button" onClick={() => changeRowQty(i, 1)} style={stepperBtnStyle}><Plus size={11} /></button>
// // //                         </div>
// // //                       )}
// // //                     </td>
// // //                     {!isSubmitted && (
// // //                       <td style={tdStyle}>
// // //                         <button type="button" onClick={() => removeRow(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
// // //                           <Trash2 size={13} />
// // //                         </button>
// // //                       </td>
// // //                     )}
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         )}

// // //         {!isSubmitted && (
// // //           <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
// // //             <div style={sectionLabelStyle}>Add Item</div>
// // //             <div style={{ display: "flex", gap: 6 }}>
// // //               <ItemSearchDropdown
// // //                 erpnextConfig={erpnextConfig}
// // //                 selectedLabel={pendingItem ? `${pendingItem.item_code} — ${pendingItem.item_name}` : null}
// // //                 onSelect={(item) => setPendingItem(item)}
// // //               />
// // //               <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
// // //                 <button type="button" onClick={() => setPendingQty((q) => Math.max(1, q - 1))} style={stepperBtnStyle}><Minus size={12} /></button>
// // //                 <span style={{ minWidth: 22, textAlign: "center", fontSize: 12 }}>{pendingQty}</span>
// // //                 <button type="button" onClick={() => setPendingQty((q) => q + 1)} style={stepperBtnStyle}><Plus size={12} /></button>
// // //               </div>
// // //               <button
// // //                 type="button"
// // //                 onClick={addItemToList}
// // //                 disabled={!pendingItem}
// // //                 style={{
// // //                   padding: "0 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600,
// // //                   cursor: pendingItem ? "pointer" : "not-allowed",
// // //                   background: pendingItem ? "var(--brand-color, #2563eb)" : "var(--bg-tertiary)",
// // //                   color: pendingItem ? "#fff" : "var(--text-muted)",
// // //                 }}
// // //               >
// // //                 Add
// // //               </button>
// // //             </div>

// // //             {/* Update Items button — PUT to ERPNext; unlocks Submit/Quotation/Reassign on success */}
// // //             <button
// // //               type="button"
// // //               onClick={handleUpdateItems}
// // //               disabled={savingItems}
// // //               style={{
// // //                 display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
// // //                 padding: "9px 0", borderRadius: 7, border: "none",
// // //                 cursor: savingItems ? "not-allowed" : "pointer", width: "100%",
// // //                 fontSize: 12, fontWeight: 700,
// // //                 background: savingItems ? "var(--bg-tertiary)" : "var(--bg-secondary, #374151)",
// // //                 color: savingItems ? "var(--text-secondary)" : "#fff",
// // //               }}
// // //             >
// // //               {savingItems
// // //                 ? <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Updating…</>
// // //                 : <><Save size={13} /> Update Items Used for Maintenance</>}
// // //             </button>
// // //           </div>
// // //         )}

// // //         <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
// // //           {!isSubmitted ? (
// // //             /* Submit Task — disabled until items are saved */
// // //             <button
// // //               type="button"
// // //               onClick={handleSubmitClick}
// // //               disabled={submitting || !itemsSaved}
// // //               title={!itemsSaved ? "Save item changes first (Update Items)" : undefined}
// // //               style={{
// // //                 flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
// // //                 padding: "9px 0", borderRadius: 7, border: "none",
// // //                 cursor: (submitting || !itemsSaved) ? "not-allowed" : "pointer",
// // //                 fontSize: 12, fontWeight: 700,
// // //                 background: (submitting || !itemsSaved) ? "var(--bg-tertiary)" : "var(--brand-color, #16a34a)",
// // //                 color: (submitting || !itemsSaved) ? "var(--text-secondary)" : "#fff",
// // //                 opacity: !itemsSaved ? 0.45 : 1,
// // //               }}
// // //             >
// // //               {submitting
// // //                 ? <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Submitting…</>
// // //                 : <><CheckCircle2 size={13} /> Submit Task</>}
// // //             </button>
// // //           ) : (
// // //             /* After submission: Create Quotation + View Quotation side by side, both unclickable */
// // //             <>
// // //               <button
// // //                 type="button"
// // //                 onClick={handleCreateQuotation}
// // //                 disabled
// // //                 style={{ ...primaryActionBtnStyle, opacity: 0.45, cursor: "not-allowed" }}
// // //               >
// // //                 <FileText size={13} /> Create Quotation
// // //               </button>
// // //               <button
// // //                 type="button"
// // //                 onClick={handleViewQuotation}
// // //                 disabled
// // //                 style={{ ...secondaryActionBtnStyle, opacity: 0.45, cursor: "not-allowed" }}
// // //               >
// // //                 <FileText size={13} /> View Quotation
// // //               </button>
// // //             </>
// // //           )}
// // //         </div>
// // //       </div>

// // //       <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

// // //       {showConfirm && (
// // //         <div style={modalOverlayStyle} onClick={() => setShowConfirm(false)}>
// // //           <div onClick={(e) => e.stopPropagation()} style={modalBoxStyle}>
// // //             <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>Confirm Submission</div>
// // //             <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginBottom: 18 }}>This task is completed?</div>
// // //             <div style={{ display: "flex", gap: 8 }}>
// // //               <button type="button" onClick={() => setShowConfirm(false)} style={modalCancelBtnStyle}>Cancel</button>
// // //               <button type="button" onClick={handleConfirmSubmit} style={modalConfirmBtnStyle}>Yes, Submit</button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // // ---------- shared styles ----------
// // // const sectionLabelStyle = { fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 6 };
// // // const emptyMsgStyle = { fontSize: 11, color: "var(--text-muted)", padding: "8px 10px", background: "var(--bg-tertiary)", borderRadius: 6 };
// // // const tableWrapStyle = { border: "1px solid var(--border-color)", borderRadius: 6, overflow: "hidden" };
// // // const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: 11 };
// // // const thStyle = { padding: "6px 10px", textAlign: "left", fontWeight: 600, color: "var(--text-secondary)", borderBottom: "1px solid var(--border-color)" };
// // // const tdStyle = { padding: "7px 10px" };
// // // const trStyle = (i, len) => ({ borderBottom: i < len - 1 ? "1px solid var(--border-color)" : "none", background: i % 2 === 0 ? "transparent" : "var(--bg-tertiary)" });
// // // const stepperBtnStyle = { width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", cursor: "pointer", color: "var(--text-primary)" };
// // // const primaryActionBtnStyle = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 0", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: "var(--brand-color, #2563eb)", color: "#fff" };
// // // const secondaryActionBtnStyle = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 0", borderRadius: 7, border: "1px solid var(--border-color)", cursor: "pointer", fontSize: 12, fontWeight: 700, background: "var(--bg-tertiary)", color: "var(--text-primary)" };
// // // const modalOverlayStyle = { position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" };
// // // const modalBoxStyle = { background: "var(--bg-primary)", borderRadius: 10, padding: 20, width: 320, boxShadow: "0 10px 40px rgba(0,0,0,0.25)" };
// // // const modalCancelBtnStyle = { flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)", fontSize: 12, fontWeight: 600, cursor: "pointer" };
// // // const modalConfirmBtnStyle = { flex: 1, padding: "8px 0", borderRadius: 6, border: "none", background: "var(--brand-color, #16a34a)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" };

// // // export default TaskAssignPanel;




// // import { useState, useEffect, useRef } from "react";
// // import { Plus, Minus, Trash2, Save, RefreshCw, FileText, CheckCircle2, ChevronDown, Search, X } from "lucide-react";

// // // ---------- Searchable multi-select dropdown (local data, no API call) ----------
// // function AssignSearchDropdown({ items = [], selected = [], onToggle, placeholder = "Search…", renderOption }) {
// //   const [open, setOpen] = useState(false);
// //   const [query, setQuery] = useState("");
// //   const wrapRef = useRef(null);

// //   useEffect(() => {
// //     const handleClickOutside = (e) => {
// //       if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
// //     };
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);

// //   const filtered = query
// //     ? items.filter((item) => {
// //         const label = (item?.name || "") + " " + (item?.id || "") + " " + (item?.certs || "") + " " + (item?.type || "");
// //         return label.toLowerCase().includes(query.toLowerCase());
// //       })
// //     : items;

// //   const selectedItems = items.filter((item) => selected.includes(item?.id));

// //   return (
// //     <div ref={wrapRef} style={{ position: "relative" }}>
// //       {/* Selected tags */}
// //       {selectedItems.length > 0 && (
// //         <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
// //           {selectedItems.map((item) => (
// //             <span
// //               key={item.id}
// //               style={{
// //                 display: "inline-flex", alignItems: "center", gap: 4,
// //                 padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600,
// //                 background: "var(--brand-color, #2563eb)", color: "#fff",
// //               }}
// //             >
// //               {item.name}
// //               <X
// //                 size={10}
// //                 style={{ cursor: "pointer", opacity: 0.8 }}
// //                 onClick={() => onToggle?.(item.id)}
// //               />
// //             </span>
// //           ))}
// //         </div>
// //       )}

// //       {/* Trigger */}
// //       <div
// //         onClick={() => setOpen((o) => !o)}
// //         style={{
// //           display: "flex", alignItems: "center", justifyContent: "space-between",
// //           padding: "7px 10px", fontSize: 12, borderRadius: 6,
// //           border: "1px solid var(--border-color)", background: "var(--bg-primary)",
// //           color: "var(--text-muted)", cursor: "pointer",
// //         }}
// //       >
// //         <span>{placeholder}</span>
// //         <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "none", transition: "0.15s" }} />
// //       </div>

// //       {/* Dropdown */}
// //       {open && (
// //         <div
// //           style={{
// //             position: "absolute", top: "100%", left: 0, right: 0, zIndex: 30,
// //             background: "var(--bg-primary)", border: "1px solid var(--border-color)",
// //             borderRadius: 6, marginTop: 4, boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
// //           }}
// //         >
// //           {/* Search input */}
// //           <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderBottom: "1px solid var(--border-color)" }}>
// //             <Search size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
// //             <input
// //               autoFocus
// //               type="text"
// //               value={query}
// //               onChange={(e) => setQuery(e.target.value)}
// //               placeholder="Search…"
// //               style={{ flex: 1, border: "none", outline: "none", fontSize: 12, background: "transparent", color: "var(--text-primary)" }}
// //             />
// //             {query && (
// //               <X size={11} style={{ cursor: "pointer", color: "var(--text-muted)" }} onClick={() => setQuery("")} />
// //             )}
// //           </div>

// //           {/* Options */}
// //           <div style={{ maxHeight: 180, overflowY: "auto" }}>
// //             {filtered.length === 0 ? (
// //               <div style={{ padding: "8px 10px", fontSize: 11, color: "var(--text-muted)" }}>No results.</div>
// //             ) : (
// //               filtered.map((item) => {
// //                 const checked = selected.includes(item?.id);
// //                 return (
// //                   <div
// //                     key={item.id}
// //                     onClick={() => onToggle?.(item.id)}
// //                     style={{
// //                       display: "flex", alignItems: "center", gap: 8,
// //                       padding: "7px 10px", fontSize: 11.5, cursor: "pointer",
// //                       borderBottom: "1px solid var(--border-color)",
// //                       background: checked ? "color-mix(in srgb, var(--brand-color, #2563eb) 10%, transparent)" : "transparent",
// //                     }}
// //                     onMouseEnter={(e) => { if (!checked) e.currentTarget.style.background = "var(--bg-tertiary)"; }}
// //                     onMouseLeave={(e) => { e.currentTarget.style.background = checked ? "color-mix(in srgb, var(--brand-color, #2563eb) 10%, transparent)" : "transparent"; }}
// //                   >
// //                     <input type="checkbox" checked={checked} onChange={() => {}} style={{ accentColor: "var(--brand-color, #2563eb)" }} />
// //                     {renderOption ? renderOption(item) : (
// //                       <div style={{ display: "flex", flexDirection: "column" }}>
// //                         <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{item.name}</span>
// //                         {item.id && <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{item.id}</span>}
// //                       </div>
// //                     )}
// //                   </div>
// //                 );
// //               })
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // ---------- Searchable Item Dropdown (ERPNext API) ----------
// // function ItemSearchDropdown({ erpnextConfig, onSelect, selectedLabel }) {
// //   const [open, setOpen] = useState(false);
// //   const [query, setQuery] = useState("");
// //   const [options, setOptions] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const wrapRef = useRef(null);

// //   useEffect(() => {
// //     const handleClickOutside = (e) => {
// //       if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
// //     };
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);

// //   useEffect(() => {
// //     if (!open) return;
// //     if (!erpnextConfig?.url) return;
// //     const t = setTimeout(async () => {
// //       setLoading(true);
// //       try {
// //         const filters = query ? [["item_code", "like", `%${query}%`]] : [];
// //         const res = await fetch(
// //           `${erpnextConfig.url}/api/resource/Item?filters=${encodeURIComponent(
// //             JSON.stringify(filters)
// //           )}&fields=${encodeURIComponent(JSON.stringify(["item_code", "item_name"]))}&limit_page_length=20`,
// //           { credentials: "include" }
// //         );
// //         const json = await res.json();
// //         setOptions(Array.isArray(json?.data) ? json.data : []);
// //       } catch (e) {
// //         console.error("Item search failed:", e);
// //         setOptions([]);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }, 250);
// //     return () => clearTimeout(t);
// //   }, [query, open, erpnextConfig?.url]);

// //   return (
// //     <div ref={wrapRef} style={{ position: "relative", flex: 1 }}>
// //       <div
// //         onClick={() => setOpen((o) => !o)}
// //         style={{
// //           display: "flex", alignItems: "center", justifyContent: "space-between",
// //           padding: "7px 10px", fontSize: 12, borderRadius: 6,
// //           border: "1px solid var(--border-color)", background: "var(--bg-primary)",
// //           color: selectedLabel ? "var(--text-primary)" : "var(--text-muted)",
// //           cursor: "pointer",
// //         }}
// //       >
// //         <span>{selectedLabel || "Select item…"}</span>
// //         <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "none", transition: "0.15s" }} />
// //       </div>

// //       {open && (
// //         <div
// //           style={{
// //             position: "absolute", top: "100%", left: 0, right: 0, zIndex: 20,
// //             background: "var(--bg-primary)", border: "1px solid var(--border-color)",
// //             borderRadius: 6, marginTop: 4, boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
// //           }}
// //         >
// //           <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderBottom: "1px solid var(--border-color)" }}>
// //             <Search size={12} style={{ color: "var(--text-muted)" }} />
// //             <input
// //               autoFocus
// //               type="text"
// //               value={query}
// //               onChange={(e) => setQuery(e.target.value)}
// //               placeholder="Search item code…"
// //               style={{ flex: 1, border: "none", outline: "none", fontSize: 12, background: "transparent", color: "var(--text-primary)" }}
// //             />
// //           </div>
// //           <div style={{ maxHeight: 180, overflowY: "auto" }}>
// //             {loading ? (
// //               <div style={{ padding: "8px 10px", fontSize: 11, color: "var(--text-muted)" }}>Searching…</div>
// //             ) : options.length === 0 ? (
// //               <div style={{ padding: "8px 10px", fontSize: 11, color: "var(--text-muted)" }}>No items found.</div>
// //             ) : (
// //               options.map((opt) => (
// //                 <div
// //                   key={opt.item_code}
// //                   onClick={() => { onSelect?.(opt); setOpen(false); setQuery(""); }}
// //                   style={{ padding: "7px 10px", fontSize: 11.5, cursor: "pointer", borderBottom: "1px solid var(--border-color)" }}
// //                   onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)")}
// //                   onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
// //                 >
// //                   <span style={{ fontWeight: 600, color: "var(--brand-color)" }}>{opt.item_code}</span>
// //                   {opt.item_name && opt.item_name !== opt.item_code && (
// //                     <span style={{ color: "var(--text-secondary)" }}> — {opt.item_name}</span>
// //                   )}
// //                 </div>
// //               ))
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // ---------- Main combined component ----------
// // function TaskAssignPanel({
// //   taskDoc,
// //   employeeDir = [],
// //   vendorDir = [],
// //   erpnextConfig,
// //   getCsrfToken,
// //   showToast,
// //   onSaved,
// // }) {
// //   // ===================== ASSIGN (EMPLOYEE / VENDOR) =====================
// //   const [assignType, setAssignType] = useState("");
// //   const [savingAssign, setSavingAssign] = useState(false);

// //   useEffect(() => {
// //     setAssignType((taskDoc?.custom_assign || "").toLowerCase());
// //   }, [taskDoc?.custom_assign]);

// //   const [selectedEmpIds, setSelectedEmpIds] = useState([]);
// //   const [selectedVendorIds, setSelectedVendorIds] = useState([]);

// //   useEffect(() => {
// //     setSelectedEmpIds((taskDoc?.custom_assign_to_ || []).map((r) => r?.emp_id).filter(Boolean));
// //     setSelectedVendorIds((taskDoc?.custom_assign_to_vendor || []).map((r) => r?.vendor_name).filter(Boolean));
// //   }, [taskDoc]);

// //   const toggleEmp = (id) => setSelectedEmpIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
// //   const toggleVendor = (id) => setSelectedVendorIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

// //   const empRows = taskDoc?.custom_assign_to_ || [];
// //   const vendorRows = taskDoc?.custom_assign_to_vendor || [];

// //   const handleReassign = async () => {
// //     if (!erpnextConfig?.url || !taskDoc?.name) { showToast?.("No ERPNext connection.", "error"); return; }
// //     setSavingAssign(true);
// //     try {
// //       let body = {};
// //       if (assignType === "employee") {
// //         body = {
// //           custom_assign_to_: selectedEmpIds.map((empId) => {
// //             const emp = employeeDir.find((e) => e?.id === empId);
// //             return { emp_id: empId, emp_name: emp?.name || "", designation: emp?.certs || emp?.designation || "", contact_number: emp?.phone || "" };
// //           }),
// //         };
// //       } else {
// //         body = {
// //           custom_assign_to_vendor: selectedVendorIds.map((vendorId) => {
// //             const vendor = vendorDir.find((v) => v?.id === vendorId);
// //             return { vendor_name: vendorId, supplier_type: vendor?.type || "" };
// //           }),
// //         };
// //       }
// //       const res = await fetch(`${erpnextConfig.url}/api/resource/Task/${taskDoc.name}`, {
// //         method: "PUT", credentials: "include",
// //         headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": getCsrfToken?.() },
// //         body: JSON.stringify(body),
// //       });
// //       const json = await res.json();
// //       if (!res.ok) { showToast?.(json?.exception || "Failed to update assignment.", "error"); return; }
// //       showToast?.(`${assignType === "employee" ? "Employees" : "Vendors"} updated successfully.`, "success");
// //       onSaved?.(json.data);
// //     } catch (err) {
// //       console.error(err);
// //       showToast?.("Error saving assignment.", "error");
// //     } finally {
// //       setSavingAssign(false);
// //     }
// //   };

// //   // ===================== ITEMS USED FOR MAINTENANCE =====================
// //   const [itemRows, setItemRows] = useState([]);
// //   const [pendingItem, setPendingItem] = useState(null);
// //   const [pendingQty, setPendingQty] = useState(1);
// //   const [savingItems, setSavingItems] = useState(false);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [showConfirm, setShowConfirm] = useState(false);
// //   const [itemsSaved, setItemsSaved] = useState(true);

// //   const isSubmitted = taskDoc?.docstatus === 1;

// //   useEffect(() => {
// //     setItemRows(
// //       (taskDoc?.custom_items_used_for_maintenance || []).map((r) => ({
// //         name: r?.name, item_code: r?.item_code, item_name: r?.item_name, qty: r?.qty || 1,
// //       }))
// //     );
// //     setItemsSaved(true);
// //   }, [taskDoc]);

// //   const addItemToList = () => {
// //     if (!pendingItem) { showToast?.("Select an item first.", "error"); return; }
// //     if (pendingQty <= 0) { showToast?.("Quantity must be greater than zero.", "error"); return; }
// //     setItemRows((prev) => {
// //       const idx = prev.findIndex((r) => r.item_code === pendingItem.item_code);
// //       if (idx >= 0) {
// //         const copy = [...prev];
// //         copy[idx] = { ...copy[idx], qty: copy[idx].qty + pendingQty };
// //         return copy;
// //       }
// //       return [...prev, { item_code: pendingItem.item_code, item_name: pendingItem.item_name, qty: pendingQty }];
// //     });
// //     setPendingItem(null);
// //     setPendingQty(1);
// //     setItemsSaved(false);
// //   };

// //   const removeRow = (idx) => { setItemRows((prev) => prev.filter((_, i) => i !== idx)); setItemsSaved(false); };
// //   const changeRowQty = (idx, delta) => { setItemRows((prev) => prev.map((r, i) => (i === idx ? { ...r, qty: Math.max(1, r.qty + delta) } : r))); setItemsSaved(false); };

// //   const handleUpdateItems = async () => {
// //     if (!erpnextConfig?.url || !taskDoc?.name) { showToast?.("No ERPNext connection.", "error"); return; }
// //     setSavingItems(true);
// //     try {
// //       const body = {
// //         custom_items_used_for_maintenance: itemRows.map((r) => ({ item_code: r.item_code, item_name: r.item_name, qty: r.qty })),
// //       };
// //       const res = await fetch(`${erpnextConfig.url}/api/resource/Task/${taskDoc.name}`, {
// //         method: "PUT", credentials: "include",
// //         headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": getCsrfToken?.() },
// //         body: JSON.stringify(body),
// //       });
// //       const json = await res.json();
// //       if (!res.ok) { showToast?.(json?.exception || "Failed to update items.", "error"); return; }
// //       console.log("Updated Task doc JSON:", json.data);
// //       showToast?.("Items used for maintenance updated successfully.", "success");
// //       setItemsSaved(true);
// //       onSaved?.(json.data);
// //     } catch (e) {
// //       console.error(e);
// //       showToast?.("Error updating items.", "error");
// //     } finally {
// //       setSavingItems(false);
// //     }
// //   };

// //   const handleSubmitClick = () => {
// //     if (itemRows.length === 0) { showToast?.("Add at least one item before submitting.", "error"); return; }
// //     setShowConfirm(true);
// //   };

// //   const handleConfirmSubmit = async () => {
// //     setShowConfirm(false);
// //     if (!erpnextConfig?.url || !taskDoc?.name) { showToast?.("No ERPNext connection.", "error"); return; }
// //     setSubmitting(true);
// //     try {
// //       const stockoutRes = await fetch(
// //         `${erpnextConfig.url}/api/method/property_management.property_management.property_management.api.submit_task_stockout_api`,
// //         {
// //           method: "POST", credentials: "include",
// //           headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": getCsrfToken?.() },
// //           body: JSON.stringify({ task_name: taskDoc.name }),
// //         }
// //       );
// //       const stockoutJson = await stockoutRes.json();
// //       const stockoutResult = stockoutJson?.message;
// //       if (!stockoutResult || !stockoutResult.success) { showToast?.(stockoutResult?.error || "Stock-out validation failed.", "error"); return; }
// //       if (stockoutResult.stock_entry) showToast?.(`Stock Entry ${stockoutResult.stock_entry} created.`, "success");

// //       const today = new Date().toISOString().slice(0, 10);
// //       const updateRes = await fetch(`${erpnextConfig.url}/api/resource/Task/${taskDoc.name}`, {
// //         method: "PUT", credentials: "include",
// //         headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": getCsrfToken?.() },
// //         body: JSON.stringify({ status: "Completed", completed_on: today, docstatus: 1 }),
// //       });
// //       const updateJson = await updateRes.json();
// //       if (!updateRes.ok) { showToast?.(updateJson?.exception || "Failed to submit task.", "error"); return; }
// //       showToast?.("Task submitted and marked Completed.", "success");
// //       onSaved?.(updateJson.data);
// //     } catch (e) {
// //       console.error(e);
// //       showToast?.("Error submitting task.", "error");
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   const handleCreateQuotation = () => { console.log("Create Quotation clicked — wire up logic here."); };
// //   const handleViewQuotation = () => { console.log("View Quotation clicked — wire up logic here."); };

// //   if (!taskDoc) return <div style={emptyMsgStyle}>Loading task…</div>;

// //   const reassignDisabled = savingAssign || !itemsSaved
// //     || (assignType === "employee" ? selectedEmpIds.length === 0 : selectedVendorIds.length === 0);

// //   return (
// //     <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

// //       {/* ── ASSIGN SECTION ── */}
// //       {assignType === "employee" ? (
// //         <div>
// //           {/* Current employees table */}
// //           <div style={sectionLabelStyle}>Current Employees</div>
// //           {empRows.length === 0 ? (
// //             <div style={emptyMsgStyle}>No employees assigned yet.</div>
// //           ) : (
// //             <div style={tableWrapStyle}>
// //               <table style={tableStyle}>
// //                 <thead>
// //                   <tr style={{ background: "var(--bg-tertiary)" }}>
// //                     <th style={thStyle}>Emp ID</th>
// //                     <th style={thStyle}>Name</th>
// //                     <th style={thStyle}>Designation</th>
// //                     <th style={thStyle}>Contact</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {empRows.map((r, i) => {
// //                     const match = employeeDir.find((e) => e?.id === r?.emp_id);
// //                     return (
// //                       <tr key={r?.name || i} style={trStyle(i, empRows.length)}>
// //                         <td style={tdStyle}><span style={{ color: "var(--brand-color)", fontWeight: 600 }}>{r?.emp_id || r?.name}</span></td>
// //                         <td style={tdStyle}>{r?.emp_name || match?.name || "—"}</td>
// //                         <td style={{ ...tdStyle, color: "var(--text-secondary)" }}>{r?.designation || match?.certs || "—"}</td>
// //                         <td style={{ ...tdStyle, color: "var(--text-secondary)" }}>{r?.contact_number || match?.phone || "—"}</td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}

// //           {/* Reassign employees — hidden when submitted */}
// //           {!isSubmitted && (
// //             <div style={{ marginTop: 10 }}>
// //               <div style={sectionLabelStyle}>Reassign Employees</div>
// //               <AssignSearchDropdown
// //                 items={employeeDir}
// //                 selected={selectedEmpIds}
// //                 onToggle={toggleEmp}
// //                 placeholder="Search & select employees…"
// //                 renderOption={(emp) => (
// //                   <div style={{ display: "flex", flexDirection: "column" }}>
// //                     <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{emp.name}</span>
// //                     <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
// //                       {emp.id}{emp.certs ? ` · ${emp.certs}` : ""}{emp.skill ? ` · ${emp.skill}` : ""}
// //                     </span>
// //                   </div>
// //                 )}
// //               />
// //               {selectedEmpIds.length > 0 && (
// //                 <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 5 }}>
// //                   {selectedEmpIds.length} employee{selectedEmpIds.length > 1 ? "s" : ""} selected
// //                 </div>
// //               )}
// //             </div>
// //           )}
// //         </div>
// //       ) : (
// //         <div>
// //           {/* Current vendors table */}
// //           <div style={sectionLabelStyle}>Current Vendors</div>
// //           {vendorRows.length === 0 ? (
// //             <div style={emptyMsgStyle}>No vendors assigned yet.</div>
// //           ) : (
// //             <div style={tableWrapStyle}>
// //               <table style={tableStyle}>
// //                 <thead>
// //                   <tr style={{ background: "var(--bg-tertiary)" }}>
// //                     <th style={thStyle}>Vendor ID</th>
// //                     <th style={thStyle}>Vendor Name</th>
// //                     <th style={thStyle}>Supplier Type</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {vendorRows.map((r, i) => {
// //                     const match = vendorDir.find((v) => v?.id === r?.vendor_name);
// //                     return (
// //                       <tr key={r?.name || i} style={trStyle(i, vendorRows.length)}>
// //                         <td style={tdStyle}><span style={{ color: "var(--brand-color)", fontWeight: 600 }}>{r?.vendor || r?.name}</span></td>
// //                         <td style={tdStyle}>{match?.name || r?.vendor || "—"}</td>
// //                         <td style={{ ...tdStyle, color: "var(--text-secondary)" }}>{match?.type || r?.supplier_type || "—"}</td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}

// //           {/* Reassign vendors — hidden when submitted */}
// //           {!isSubmitted && (
// //             <div style={{ marginTop: 10 }}>
// //               <div style={sectionLabelStyle}>Reassign Vendors</div>
// //               <AssignSearchDropdown
// //                 items={vendorDir}
// //                 selected={selectedVendorIds}
// //                 onToggle={toggleVendor}
// //                 placeholder="Search & select vendors…"
// //                 renderOption={(v) => (
// //                   <div style={{ display: "flex", flexDirection: "column" }}>
// //                     <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{v.name}</span>
// //                     {v.type && <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{v.type}</span>}
// //                   </div>
// //                 )}
// //               />
// //               {selectedVendorIds.length > 0 && (
// //                 <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 5 }}>
// //                   {selectedVendorIds.length} vendor{selectedVendorIds.length > 1 ? "s" : ""} selected
// //                 </div>
// //               )}
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       {/* Reassign button — hidden when submitted */}
// //       {!isSubmitted && (
// //         <button
// //           type="button"
// //           onClick={handleReassign}
// //           disabled={reassignDisabled}
// //           title={!itemsSaved ? "Save item changes first (Update Items)" : undefined}
// //           style={{
// //             display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
// //             padding: "9px 0", borderRadius: 7, border: "none",
// //             cursor: reassignDisabled ? "not-allowed" : "pointer",
// //             fontSize: 12, fontWeight: 700,
// //             background: savingAssign ? "var(--bg-tertiary)" : "var(--brand-color, #2563eb)",
// //             color: savingAssign ? "var(--text-secondary)" : "#fff",
// //             opacity: reassignDisabled ? 0.45 : 1,
// //           }}
// //         >
// //           {savingAssign
// //             ? <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Saving…</>
// //             : <><Save size={13} /> Reassign {assignType === "employee" ? "Employees" : "Vendors"}</>}
// //         </button>
// //       )}

// //       {/* ── ITEMS SECTION ── */}
// //       <div>
// //         <div style={sectionLabelStyle}>Items Used for Maintenance</div>

// //         {itemRows.length === 0 ? (
// //           <div style={emptyMsgStyle}>No items added yet.</div>
// //         ) : (
// //           <div style={tableWrapStyle}>
// //             <table style={tableStyle}>
// //               <thead>
// //                 <tr style={{ background: "var(--bg-tertiary)" }}>
// //                   <th style={thStyle}>Item Code</th>
// //                   <th style={thStyle}>Item Name</th>
// //                   <th style={thStyle}>Qty</th>
// //                   {!isSubmitted && <th style={thStyle}></th>}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {itemRows.map((r, i) => (
// //                   <tr key={r?.name || r?.item_code || i} style={trStyle(i, itemRows.length)}>
// //                     <td style={{ ...tdStyle, color: "var(--brand-color)", fontWeight: 600 }}>{r?.item_code}</td>
// //                     <td style={tdStyle}>{r?.item_name || "—"}</td>
// //                     <td style={tdStyle}>
// //                       {isSubmitted ? r?.qty : (
// //                         <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
// //                           <button type="button" onClick={() => changeRowQty(i, -1)} style={stepperBtnStyle}><Minus size={11} /></button>
// //                           <span style={{ minWidth: 18, textAlign: "center" }}>{r?.qty}</span>
// //                           <button type="button" onClick={() => changeRowQty(i, 1)} style={stepperBtnStyle}><Plus size={11} /></button>
// //                         </div>
// //                       )}
// //                     </td>
// //                     {!isSubmitted && (
// //                       <td style={tdStyle}>
// //                         <button type="button" onClick={() => removeRow(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
// //                           <Trash2 size={13} />
// //                         </button>
// //                       </td>
// //                     )}
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}

// //         {/* Add Item + Update Items — hidden when submitted */}
// //         {!isSubmitted && (
// //           <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
// //             <div style={sectionLabelStyle}>Add Item</div>
// //             <div style={{ display: "flex", gap: 6 }}>
// //               <ItemSearchDropdown
// //                 erpnextConfig={erpnextConfig}
// //                 selectedLabel={pendingItem ? `${pendingItem.item_code} — ${pendingItem.item_name}` : null}
// //                 onSelect={(item) => setPendingItem(item)}
// //               />
// //               <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
// //                 <button type="button" onClick={() => setPendingQty((q) => Math.max(1, q - 1))} style={stepperBtnStyle}><Minus size={12} /></button>
// //                 <span style={{ minWidth: 22, textAlign: "center", fontSize: 12 }}>{pendingQty}</span>
// //                 <button type="button" onClick={() => setPendingQty((q) => q + 1)} style={stepperBtnStyle}><Plus size={12} /></button>
// //               </div>
// //               <button
// //                 type="button"
// //                 onClick={addItemToList}
// //                 disabled={!pendingItem}
// //                 style={{
// //                   padding: "0 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600,
// //                   cursor: pendingItem ? "pointer" : "not-allowed",
// //                   background: pendingItem ? "var(--brand-color, #2563eb)" : "var(--bg-tertiary)",
// //                   color: pendingItem ? "#fff" : "var(--text-muted)",
// //                 }}
// //               >
// //                 Add
// //               </button>
// //             </div>

// //             <button
// //               type="button"
// //               onClick={handleUpdateItems}
// //               disabled={savingItems}
// //               style={{
// //                 display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
// //                 padding: "9px 0", borderRadius: 7, border: "none",
// //                 cursor: savingItems ? "not-allowed" : "pointer", width: "100%",
// //                 fontSize: 12, fontWeight: 700,
// //                 background: savingItems ? "var(--bg-tertiary)" : "var(--bg-secondary, #374151)",
// //                 color: savingItems ? "var(--text-secondary)" : "#fff",
// //               }}
// //             >
// //               {savingItems
// //                 ? <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Updating…</>
// //                 : <><Save size={13} /> Update Items Used for Maintenance</>}
// //             </button>
// //           </div>
// //         )}

// //         {/* Submit / Quotation buttons */}
// //         <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
// //           {!isSubmitted ? (
// //             <button
// //               type="button"
// //               onClick={handleSubmitClick}
// //               disabled={submitting || !itemsSaved}
// //               title={!itemsSaved ? "Save item changes first (Update Items)" : undefined}
// //               style={{
// //                 flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
// //                 padding: "9px 0", borderRadius: 7, border: "none",
// //                 cursor: (submitting || !itemsSaved) ? "not-allowed" : "pointer",
// //                 fontSize: 12, fontWeight: 700,
// //                 background: (submitting || !itemsSaved) ? "var(--bg-tertiary)" : "var(--brand-color, #16a34a)",
// //                 color: (submitting || !itemsSaved) ? "var(--text-secondary)" : "#fff",
// //                 opacity: !itemsSaved ? 0.45 : 1,
// //               }}
// //             >
// //               {submitting
// //                 ? <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Submitting…</>
// //                 : <><CheckCircle2 size={13} /> Submit Task</>}
// //             </button>
// //           ) : (
// //             <>
// //               <button type="button" onClick={handleCreateQuotation} disabled style={{ ...primaryActionBtnStyle, opacity: 0.45, cursor: "not-allowed" }}>
// //                 <FileText size={13} /> Create Quotation
// //               </button>
// //               <button type="button" onClick={handleViewQuotation} disabled style={{ ...secondaryActionBtnStyle, opacity: 0.45, cursor: "not-allowed" }}>
// //                 <FileText size={13} /> View Quotation
// //               </button>
// //             </>
// //           )}
// //         </div>
// //       </div>

// //       <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

// //       {showConfirm && (
// //         <div style={modalOverlayStyle} onClick={() => setShowConfirm(false)}>
// //           <div onClick={(e) => e.stopPropagation()} style={modalBoxStyle}>
// //             <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>Confirm Submission</div>
// //             <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginBottom: 18 }}>This task is completed?</div>
// //             <div style={{ display: "flex", gap: 8 }}>
// //               <button type="button" onClick={() => setShowConfirm(false)} style={modalCancelBtnStyle}>Cancel</button>
// //               <button type="button" onClick={handleConfirmSubmit} style={modalConfirmBtnStyle}>Yes, Submit</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // ---------- shared styles ----------
// // const sectionLabelStyle = { fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 6 };
// // const emptyMsgStyle = { fontSize: 11, color: "var(--text-muted)", padding: "8px 10px", background: "var(--bg-tertiary)", borderRadius: 6 };
// // const tableWrapStyle = { border: "1px solid var(--border-color)", borderRadius: 6, overflow: "hidden" };
// // const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: 11 };
// // const thStyle = { padding: "6px 10px", textAlign: "left", fontWeight: 600, color: "var(--text-secondary)", borderBottom: "1px solid var(--border-color)" };
// // const tdStyle = { padding: "7px 10px" };
// // const trStyle = (i, len) => ({ borderBottom: i < len - 1 ? "1px solid var(--border-color)" : "none", background: i % 2 === 0 ? "transparent" : "var(--bg-tertiary)" });
// // const stepperBtnStyle = { width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", cursor: "pointer", color: "var(--text-primary)" };
// // const primaryActionBtnStyle = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 0", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: "var(--brand-color, #2563eb)", color: "#fff" };
// // const secondaryActionBtnStyle = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 0", borderRadius: 7, border: "1px solid var(--border-color)", cursor: "pointer", fontSize: 12, fontWeight: 700, background: "var(--bg-tertiary)", color: "var(--text-primary)" };
// // const modalOverlayStyle = { position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" };
// // const modalBoxStyle = { background: "var(--bg-primary)", borderRadius: 10, padding: 20, width: 320, boxShadow: "0 10px 40px rgba(0,0,0,0.25)" };
// // const modalCancelBtnStyle = { flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)", fontSize: 12, fontWeight: 600, cursor: "pointer" };
// // const modalConfirmBtnStyle = { flex: 1, padding: "8px 0", borderRadius: 6, border: "none", background: "var(--brand-color, #16a34a)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" };

// // export default TaskAssignPanel;



// import { useState, useEffect, useRef } from "react";
// import { Plus, Minus, Trash2, Save, RefreshCw, FileText, CheckCircle2, ChevronDown, Search, X } from "lucide-react";

// // ---------- Searchable multi-select dropdown (local data — employees / vendors) ----------
// function AssignSearchDropdown({ items = [], selected = [], onToggle, placeholder = "Search…", renderOption }) {
//   const [open, setOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const wrapRef = useRef(null);

//   useEffect(() => {
//     const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const filtered = query
//     ? items.filter((item) => {
//         const label = `${item?.name || ""} ${item?.id || ""} ${item?.certs || ""} ${item?.type || ""}`;
//         return label.toLowerCase().includes(query.toLowerCase());
//       })
//     : items;

//   const selectedItems = items.filter((item) => selected.includes(item?.id));

//   return (
//     <div ref={wrapRef} style={{ position: "relative" }}>
//       {selectedItems.length > 0 && (
//         <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
//           {selectedItems.map((item) => (
//             <span key={item.id} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "var(--brand-color, #2563eb)", color: "#fff" }}>
//               {item.name}
//               <X size={10} style={{ cursor: "pointer", opacity: 0.8 }} onClick={() => onToggle?.(item.id)} />
//             </span>
//           ))}
//         </div>
//       )}

//       <div onClick={() => setOpen((o) => !o)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", fontSize: 12, borderRadius: 6, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-muted)", cursor: "pointer" }}>
//         <span>{placeholder}</span>
//         <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "none", transition: "0.15s" }} />
//       </div>

//       {open && (
//         <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 30, background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: 6, marginTop: 4, boxShadow: "0 6px 20px rgba(0,0,0,0.15)" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderBottom: "1px solid var(--border-color)" }}>
//             <Search size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
//             <input autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" style={{ flex: 1, border: "none", outline: "none", fontSize: 12, background: "transparent", color: "var(--text-primary)" }} />
//             {query && <X size={11} style={{ cursor: "pointer", color: "var(--text-muted)" }} onClick={() => setQuery("")} />}
//           </div>
//           <div style={{ maxHeight: 180, overflowY: "auto" }}>
//             {filtered.length === 0 ? (
//               <div style={{ padding: "8px 10px", fontSize: 11, color: "var(--text-muted)" }}>No results.</div>
//             ) : filtered.map((item) => {
//               const checked = selected.includes(item?.id);
//               return (
//                 <div key={item.id} onClick={() => onToggle?.(item.id)}
//                   style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", fontSize: 11.5, cursor: "pointer", borderBottom: "1px solid var(--border-color)", background: checked ? "color-mix(in srgb, var(--brand-color, #2563eb) 10%, transparent)" : "transparent" }}
//                   onMouseEnter={(e) => { if (!checked) e.currentTarget.style.background = "var(--bg-tertiary)"; }}
//                   onMouseLeave={(e) => { e.currentTarget.style.background = checked ? "color-mix(in srgb, var(--brand-color, #2563eb) 10%, transparent)" : "transparent"; }}
//                 >
//                   <input type="checkbox" checked={checked} onChange={() => {}} style={{ accentColor: "var(--brand-color, #2563eb)" }} />
//                   {renderOption ? renderOption(item) : (
//                     <div style={{ display: "flex", flexDirection: "column" }}>
//                       <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{item.name}</span>
//                       {item.id && <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{item.id}</span>}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ---------- Searchable single-select dropdown (ERPNext API — items) ----------
// function ItemSearchDropdown({ erpnextConfig, onSelect, selectedLabel }) {
//   const [open, setOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const [options, setOptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const wrapRef = useRef(null);

//   useEffect(() => {
//     const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   useEffect(() => {
//     if (!open || !erpnextConfig?.url) return;
//     const t = setTimeout(async () => {
//       setLoading(true);
//       try {
//         const filters = query ? [["item_code", "like", `%${query}%`]] : [];
//         const res = await fetch(
//           `${erpnextConfig.url}/api/resource/Item?filters=${encodeURIComponent(JSON.stringify(filters))}&fields=${encodeURIComponent(JSON.stringify(["item_code", "item_name"]))}&limit_page_length=20`,
//           { credentials: "include" }
//         );
//         const json = await res.json();
//         setOptions(Array.isArray(json?.data) ? json.data : []);
//       } catch (e) { console.error("Item search failed:", e); setOptions([]); }
//       finally { setLoading(false); }
//     }, 250);
//     return () => clearTimeout(t);
//   }, [query, open, erpnextConfig?.url]);

//   return (
//     <div ref={wrapRef} style={{ position: "relative", flex: 1 }}>
//       {/* Trigger — same visual style as AssignSearchDropdown */}
//       <div onClick={() => setOpen((o) => !o)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", fontSize: 12, borderRadius: 6, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: selectedLabel ? "var(--text-primary)" : "var(--text-muted)", cursor: "pointer" }}>
//         <span>{selectedLabel || "Select item…"}</span>
//         <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "none", transition: "0.15s" }} />
//       </div>

//       {open && (
//         <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 20, background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: 6, marginTop: 4, boxShadow: "0 6px 20px rgba(0,0,0,0.15)" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderBottom: "1px solid var(--border-color)" }}>
//             <Search size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
//             <input autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search item code…" style={{ flex: 1, border: "none", outline: "none", fontSize: 12, background: "transparent", color: "var(--text-primary)" }} />
//             {query && <X size={11} style={{ cursor: "pointer", color: "var(--text-muted)" }} onClick={() => setQuery("")} />}
//           </div>
//           <div style={{ maxHeight: 180, overflowY: "auto" }}>
//             {loading ? (
//               <div style={{ padding: "8px 10px", fontSize: 11, color: "var(--text-muted)" }}>Searching…</div>
//             ) : options.length === 0 ? (
//               <div style={{ padding: "8px 10px", fontSize: 11, color: "var(--text-muted)" }}>No items found.</div>
//             ) : options.map((opt) => (
//               <div key={opt.item_code} onClick={() => { onSelect?.(opt); setOpen(false); setQuery(""); }}
//                 style={{ padding: "7px 10px", fontSize: 11.5, cursor: "pointer", borderBottom: "1px solid var(--border-color)" }}
//                 onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)")}
//                 onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//               >
//                 <div style={{ display: "flex", flexDirection: "column" }}>
//                   <span style={{ fontWeight: 600, color: "var(--brand-color)" }}>{opt.item_code}</span>
//                   {opt.item_name && opt.item_name !== opt.item_code && <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>{opt.item_name}</span>}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ---------- Main component ----------
// function TaskAssignPanel({ taskDoc, employeeDir = [], vendorDir = [], erpnextConfig, getCsrfToken, showToast, onSaved }) {

//   // ── ASSIGN ──
//   const [assignType, setAssignType] = useState("");
//   const [savingAssign, setSavingAssign] = useState(false);
//   const [selectedEmpIds, setSelectedEmpIds] = useState([]);
//   const [selectedVendorIds, setSelectedVendorIds] = useState([]);

//   useEffect(() => { setAssignType((taskDoc?.custom_assign || "").toLowerCase()); }, [taskDoc?.custom_assign]);
//   useEffect(() => {
//     setSelectedEmpIds((taskDoc?.custom_assign_to_ || []).map((r) => r?.emp_id).filter(Boolean));
//     setSelectedVendorIds((taskDoc?.custom_assign_to_vendor || []).map((r) => r?.vendor_name).filter(Boolean));
//   }, [taskDoc]);

//   const toggleEmp = (id) => setSelectedEmpIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
//   const toggleVendor = (id) => setSelectedVendorIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
//   const empRows = taskDoc?.custom_assign_to_ || [];
//   const vendorRows = taskDoc?.custom_assign_to_vendor || [];

//   const handleReassign = async () => {
//     if (!erpnextConfig?.url || !taskDoc?.name) { showToast?.("No ERPNext connection.", "error"); return; }
//     setSavingAssign(true);
//     try {
//       const body = assignType === "employee"
//         ? { custom_assign_to_: selectedEmpIds.map((id) => { const e = employeeDir.find((x) => x?.id === id); return { emp_id: id, emp_name: e?.name || "", designation: e?.certs || e?.designation || "", contact_number: e?.phone || "" }; }) }
//         : { custom_assign_to_vendor: selectedVendorIds.map((id) => { const v = vendorDir.find((x) => x?.id === id); return { vendor_name: id, supplier_type: v?.type || "" }; }) };
//       const res = await fetch(`${erpnextConfig.url}/api/resource/Task/${taskDoc.name}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": getCsrfToken?.() }, body: JSON.stringify(body) });
//       const json = await res.json();
//       if (!res.ok) { showToast?.(json?.exception || "Failed to update assignment.", "error"); return; }
//       showToast?.(`${assignType === "employee" ? "Employees" : "Vendors"} updated successfully.`, "success");
//       onSaved?.(json.data);
//     } catch (err) { console.error(err); showToast?.("Error saving assignment.", "error"); }
//     finally { setSavingAssign(false); }
//   };

//   // ── ITEMS ──
//   const [itemRows, setItemRows] = useState([]);
//   const [pendingItem, setPendingItem] = useState(null);
//   const [pendingQty, setPendingQty] = useState(1);
//   const [savingItems, setSavingItems] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const isSubmitted = taskDoc?.docstatus === 1;

//   useEffect(() => {
//     setItemRows((taskDoc?.custom_items_used_for_maintenance || []).map((r) => ({ name: r?.name, item_code: r?.item_code, item_name: r?.item_name, qty: r?.qty || 1 })));
//   }, [taskDoc]);

//   const addItemToList = () => {
//     if (!pendingItem) { showToast?.("Select an item first.", "error"); return; }
//     if (pendingQty <= 0) { showToast?.("Quantity must be greater than zero.", "error"); return; }
//     setItemRows((prev) => {
//       const idx = prev.findIndex((r) => r.item_code === pendingItem.item_code);
//       if (idx >= 0) { const copy = [...prev]; copy[idx] = { ...copy[idx], qty: copy[idx].qty + pendingQty }; return copy; }
//       return [...prev, { item_code: pendingItem.item_code, item_name: pendingItem.item_name, qty: pendingQty }];
//     });
//     setPendingItem(null); setPendingQty(1);
//   };

//   const removeRow = (idx) => setItemRows((p) => p.filter((_, i) => i !== idx));
//   const changeRowQty = (idx, delta) => setItemRows((p) => p.map((r, i) => i === idx ? { ...r, qty: Math.max(1, r.qty + delta) } : r));

//   const handleUpdateItems = async () => {
//     if (!erpnextConfig?.url || !taskDoc?.name) { showToast?.("No ERPNext connection.", "error"); return; }
//     setSavingItems(true);
//     try {
//       const body = { custom_items_used_for_maintenance: itemRows.map((r) => ({ item_code: r.item_code, item_name: r.item_name, qty: r.qty })) };
//       const res = await fetch(`${erpnextConfig.url}/api/resource/Task/${taskDoc.name}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": getCsrfToken?.() }, body: JSON.stringify(body) });
//       const json = await res.json();
//       if (!res.ok) { showToast?.(json?.exception || "Failed to update items.", "error"); return; }
//       console.log("Updated Task doc JSON:", json.data);
//       showToast?.("Items updated successfully.", "success");
//       onSaved?.(json.data);
//     } catch (e) { console.error(e); showToast?.("Error updating items.", "error"); }
//     finally { setSavingItems(false); }
//   };

//   const handleSubmitClick = () => {
//     if (itemRows.length === 0) { showToast?.("Add at least one item before submitting.", "error"); return; }
//     setShowConfirm(true);
//   };

//   const handleConfirmSubmit = async () => {
//     setShowConfirm(false);
//     if (!erpnextConfig?.url || !taskDoc?.name) { showToast?.("No ERPNext connection.", "error"); return; }
//     setSubmitting(true);
//     try {
//       const stockoutRes = await fetch(`${erpnextConfig.url}/api/method/property_management.property_management.property_management.api.submit_task_stockout_api`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": getCsrfToken?.() }, body: JSON.stringify({ task_name: taskDoc.name }) });
//       const stockoutJson = await stockoutRes.json();
//       const stockoutResult = stockoutJson?.message;
//       if (!stockoutResult || !stockoutResult.success) { showToast?.(stockoutResult?.error || "Stock-out validation failed.", "error"); return; }
//       if (stockoutResult.stock_entry) showToast?.(`Stock Entry ${stockoutResult.stock_entry} created.`, "success");
//       const today = new Date().toISOString().slice(0, 10);
//       const updateRes = await fetch(`${erpnextConfig.url}/api/resource/Task/${taskDoc.name}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": getCsrfToken?.() }, body: JSON.stringify({ status: "Completed", completed_on: today, docstatus: 1 }) });
//       const updateJson = await updateRes.json();
//       if (!updateRes.ok) { showToast?.(updateJson?.exception || "Failed to submit task.", "error"); return; }
//       showToast?.("Task submitted and marked Completed.", "success");
//       onSaved?.(updateJson.data);
//     } catch (e) { console.error(e); showToast?.("Error submitting task.", "error"); }
//     finally { setSubmitting(false); }
//   };

//   const handleCreateQuotation = () => { console.log("Create Quotation — wire up logic here."); };
//   const handleViewQuotation = () => { console.log("View Quotation — wire up logic here."); };

//   if (!taskDoc) return <div style={emptyMsgStyle}>Loading task…</div>;

//   const reassignDisabled = savingAssign || (assignType === "employee" ? selectedEmpIds.length === 0 : selectedVendorIds.length === 0);

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

//       {/* ── ASSIGN SECTION ── */}
//       {assignType === "employee" ? (
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           <div style={sectionLabelStyle}>Current Employees</div>
//           {empRows.length === 0 ? <div style={emptyMsgStyle}>No employees assigned yet.</div> : (
//             <div style={tableWrapStyle}>
//               <table style={tableStyle}>
//                 <thead><tr style={{ background: "var(--bg-tertiary)" }}>
//                   <th style={thStyle}>Emp ID</th><th style={thStyle}>Name</th><th style={thStyle}>Designation</th><th style={thStyle}>Contact</th>
//                 </tr></thead>
//                 <tbody>{empRows.map((r, i) => {
//                   const m = employeeDir.find((e) => e?.id === r?.emp_id);
//                   return (
//                     <tr key={r?.name || i} style={trStyle(i, empRows.length)}>
//                       <td style={tdStyle}><span style={{ color: "var(--brand-color)", fontWeight: 600 }}>{r?.emp_id || r?.name}</span></td>
//                       <td style={tdStyle}>{r?.emp_name || m?.name || "—"}</td>
//                       <td style={{ ...tdStyle, color: "var(--text-secondary)" }}>{r?.designation || m?.certs || "—"}</td>
//                       <td style={{ ...tdStyle, color: "var(--text-secondary)" }}>{r?.contact_number || m?.phone || "—"}</td>
//                     </tr>
//                   );
//                 })}</tbody>
//               </table>
//             </div>
//           )}

//           {!isSubmitted && (<>
//             <div style={sectionLabelStyle}>Reassign Employees</div>
//             <AssignSearchDropdown
//               items={employeeDir} selected={selectedEmpIds} onToggle={toggleEmp}
//               placeholder="Search & select employees…"
//               renderOption={(emp) => (
//                 <div style={{ display: "flex", flexDirection: "column" }}>
//                   <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{emp.name}</span>
//                   <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{emp.id}{emp.certs ? ` · ${emp.certs}` : ""}{emp.skill ? ` · ${emp.skill}` : ""}</span>
//                 </div>
//               )}
//             />
//             {selectedEmpIds.length > 0 && <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{selectedEmpIds.length} employee{selectedEmpIds.length > 1 ? "s" : ""} selected</div>}
//           </>)}
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           <div style={sectionLabelStyle}>Current Vendors</div>
//           {vendorRows.length === 0 ? <div style={emptyMsgStyle}>No vendors assigned yet.</div> : (
//             <div style={tableWrapStyle}>
//               <table style={tableStyle}>
//                 <thead><tr style={{ background: "var(--bg-tertiary)" }}>
//                   <th style={thStyle}>Vendor ID</th><th style={thStyle}>Vendor Name</th><th style={thStyle}>Supplier Type</th>
//                 </tr></thead>
//                 <tbody>{vendorRows.map((r, i) => {
//                   const m = vendorDir.find((v) => v?.id === r?.vendor_name);
//                   return (
//                     <tr key={r?.name || i} style={trStyle(i, vendorRows.length)}>
//                       <td style={tdStyle}><span style={{ color: "var(--brand-color)", fontWeight: 600 }}>{r?.vendor || r?.name}</span></td>
//                       <td style={tdStyle}>{m?.name || r?.vendor || "—"}</td>
//                       <td style={{ ...tdStyle, color: "var(--text-secondary)" }}>{m?.type || r?.supplier_type || "—"}</td>
//                     </tr>
//                   );
//                 })}</tbody>
//               </table>
//             </div>
//           )}

//           {!isSubmitted && (<>
//             <div style={sectionLabelStyle}>Reassign Vendors</div>
//             <AssignSearchDropdown
//               items={vendorDir} selected={selectedVendorIds} onToggle={toggleVendor}
//               placeholder="Search & select vendors…"
//               renderOption={(v) => (
//                 <div style={{ display: "flex", flexDirection: "column" }}>
//                   <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{v.name}</span>
//                   {v.type && <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{v.type}</span>}
//                 </div>
//               )}
//             />
//             {selectedVendorIds.length > 0 && <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{selectedVendorIds.length} vendor{selectedVendorIds.length > 1 ? "s" : ""} selected</div>}
//           </>)}
//         </div>
//       )}

//       {/* Reassign btn — hidden when submitted */}
//       {!isSubmitted && (
//         <button type="button" onClick={handleReassign} disabled={reassignDisabled}
//           style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 0", borderRadius: 7, border: "none", cursor: reassignDisabled ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 700, background: savingAssign ? "var(--bg-tertiary)" : "var(--brand-color, #2563eb)", color: savingAssign ? "var(--text-secondary)" : "#fff", opacity: reassignDisabled ? 0.45 : 1 }}
//         >
//           {savingAssign ? <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : <><Save size={13} /> Reassign {assignType === "employee" ? "Employees" : "Vendors"}</>}
//         </button>
//       )}

//       {/* ── ITEMS SECTION ── */}
//       <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//         <div style={sectionLabelStyle}>Items Used for Maintenance</div>

//         {/* Items table */}
//         {itemRows.length === 0 ? (
//           <div style={emptyMsgStyle}>No items added yet.</div>
//         ) : (
//           <div style={tableWrapStyle}>
//             <table style={tableStyle}>
//               <thead><tr style={{ background: "var(--bg-tertiary)" }}>
//                 <th style={thStyle}>Item Code</th>
//                 <th style={thStyle}>Item Name</th>
//                 <th style={thStyle}>Qty</th>
//                 {!isSubmitted && <th style={thStyle}></th>}
//               </tr></thead>
//               <tbody>
//                 {itemRows.map((r, i) => (
//                   <tr key={r?.name || r?.item_code || i} style={trStyle(i, itemRows.length)}>
//                     <td style={{ ...tdStyle, color: "var(--brand-color)", fontWeight: 600 }}>{r?.item_code}</td>
//                     <td style={tdStyle}>{r?.item_name || "—"}</td>
//                     <td style={tdStyle}>
//                       {isSubmitted ? r?.qty : (
//                         <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                           <button type="button" onClick={() => changeRowQty(i, -1)} style={stepperBtnStyle}><Minus size={11} /></button>
//                           <span style={{ minWidth: 18, textAlign: "center" }}>{r?.qty}</span>
//                           <button type="button" onClick={() => changeRowQty(i, 1)} style={stepperBtnStyle}><Plus size={11} /></button>
//                         </div>
//                       )}
//                     </td>
//                     {!isSubmitted && (
//                       <td style={tdStyle}>
//                         <button type="button" onClick={() => removeRow(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
//                           <Trash2 size={13} />
//                         </button>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Update Items btn — right under the table, hidden when submitted */}
//         {!isSubmitted && (
//           <button type="button" onClick={handleUpdateItems} disabled={savingItems}
//             style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 0", borderRadius: 7, border: "none", cursor: savingItems ? "not-allowed" : "pointer", width: "100%", fontSize: 12, fontWeight: 700, background: savingItems ? "var(--bg-tertiary)" : "var(--bg-secondary, #374151)", color: savingItems ? "var(--text-secondary)" : "#fff" }}
//           >
//             {savingItems ? <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Updating…</> : <><Save size={13} /> Update Items</>}
//           </button>
//         )}

//         {/* Add Item row — hidden when submitted */}
//         {!isSubmitted && (
//           <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//             <div style={sectionLabelStyle}>Add Item</div>
//             <div style={{ display: "flex", gap: 6 }}>
//               <ItemSearchDropdown
//                 erpnextConfig={erpnextConfig}
//                 selectedLabel={pendingItem ? `${pendingItem.item_code}${pendingItem.item_name && pendingItem.item_name !== pendingItem.item_code ? ` — ${pendingItem.item_name}` : ""}` : null}
//                 onSelect={(item) => setPendingItem(item)}
//               />
//               <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//                 <button type="button" onClick={() => setPendingQty((q) => Math.max(1, q - 1))} style={stepperBtnStyle}><Minus size={12} /></button>
//                 <span style={{ minWidth: 22, textAlign: "center", fontSize: 12 }}>{pendingQty}</span>
//                 <button type="button" onClick={() => setPendingQty((q) => q + 1)} style={stepperBtnStyle}><Plus size={12} /></button>
//               </div>
//               <button type="button" onClick={addItemToList} disabled={!pendingItem}
//                 style={{ padding: "0 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: pendingItem ? "pointer" : "not-allowed", background: pendingItem ? "var(--brand-color, #2563eb)" : "var(--bg-tertiary)", color: pendingItem ? "#fff" : "var(--text-muted)" }}
//               >Add</button>
//             </div>
//           </div>
//         )}

//         {/* Submit / Quotation */}
//         <div style={{ display: "flex", gap: 8 }}>
//           {!isSubmitted ? (
//             <button type="button" onClick={handleSubmitClick} disabled={submitting}
//               style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 0", borderRadius: 7, border: "none", cursor: submitting ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 700, background: submitting ? "var(--bg-tertiary)" : "#16a34a", color: submitting ? "var(--text-secondary)" : "#fff" }}
//             >
//               {submitting ? <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Submitting…</> : <><CheckCircle2 size={13} /> Submit Task</>}
//             </button>
//           ) : (
//             <>
//               <button type="button" onClick={handleCreateQuotation} disabled style={{ ...primaryActionBtnStyle, opacity: 0.45, cursor: "not-allowed" }}><FileText size={13} /> Create Quotation</button>
//               <button type="button" onClick={handleViewQuotation} disabled style={{ ...secondaryActionBtnStyle, opacity: 0.45, cursor: "not-allowed" }}><FileText size={13} /> View Quotation</button>
//             </>
//           )}
//         </div>
//       </div>

//       <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

//       {showConfirm && (
//         <div style={modalOverlayStyle} onClick={() => setShowConfirm(false)}>
//           <div onClick={(e) => e.stopPropagation()} style={modalBoxStyle}>
//             <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>Confirm Submission</div>
//             <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginBottom: 18 }}>This task is completed?</div>
//             <div style={{ display: "flex", gap: 8 }}>
//               <button type="button" onClick={() => setShowConfirm(false)} style={modalCancelBtnStyle}>Cancel</button>
//               <button type="button" onClick={handleConfirmSubmit} style={modalConfirmBtnStyle}>Yes, Submit</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ---------- shared styles ----------
// const sectionLabelStyle = { fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 2 };
// const emptyMsgStyle = { fontSize: 11, color: "var(--text-muted)", padding: "8px 10px", background: "var(--bg-tertiary)", borderRadius: 6 };
// const tableWrapStyle = { border: "1px solid var(--border-color)", borderRadius: 6, overflow: "hidden" };
// const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: 11 };
// const thStyle = { padding: "6px 10px", textAlign: "left", fontWeight: 600, color: "var(--text-secondary)", borderBottom: "1px solid var(--border-color)" };
// const tdStyle = { padding: "7px 10px" };
// const trStyle = (i, len) => ({ borderBottom: i < len - 1 ? "1px solid var(--border-color)" : "none", background: i % 2 === 0 ? "transparent" : "var(--bg-tertiary)" });
// const stepperBtnStyle = { width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", cursor: "pointer", color: "var(--text-primary)" };
// const primaryActionBtnStyle = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 0", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: "var(--brand-color, #2563eb)", color: "#fff" };
// const secondaryActionBtnStyle = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 0", borderRadius: 7, border: "1px solid var(--border-color)", cursor: "pointer", fontSize: 12, fontWeight: 700, background: "var(--bg-tertiary)", color: "var(--text-primary)" };
// const modalOverlayStyle = { position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" };
// const modalBoxStyle = { background: "var(--bg-primary)", borderRadius: 10, padding: 20, width: 320, boxShadow: "0 10px 40px rgba(0,0,0,0.25)" };
// const modalCancelBtnStyle = { flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)", fontSize: 12, fontWeight: 600, cursor: "pointer" };
// const modalConfirmBtnStyle = { flex: 1, padding: "8px 0", borderRadius: 6, border: "none", background: "#16a34a", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" };

// export default TaskAssignPanel;

import { useState, useEffect, useRef, useMemo } from "react";
import { Plus, Minus, Trash2, Save, RefreshCw, FileText, CheckCircle2, ChevronDown, Search, X, Briefcase, Clock, ArrowRight, ExternalLink } from "lucide-react";
import { getAuthHeaders, getCsrfToken as getGlobalCsrfToken } from '../config';

// ---------- Searchable multi-select dropdown (local data — employees / vendors) ----------
function AssignSearchDropdown({ items = [], selected = [], onToggle, placeholder = "Search…", renderOption, disabled = false }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const wrapRef = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtered = query
        ? items.filter((item) => {
            const servicesStr = (item?.services_list || []).map(s => `${s.service_group || ''} ${s.services || ''}`).join(' ');
            const label = `${item?.name || ""} ${item?.id || ""} ${item?.certs || ""} ${item?.type || ""} ${item?.group || ""} ${servicesStr}`;
            return label.toLowerCase().includes(query.toLowerCase());
        })
        : items;

    const selectedItems = items.filter((item) => selected.includes(item?.id) || selected.includes(item?.name));

    return (
        <div ref={wrapRef} style={{ position: "relative" }}>
            {selectedItems.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                    {selectedItems.map((item) => (
                        <span key={item.id || item.name} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "var(--brand-color, #2563eb)", color: "#fff" }}>
                            {item.name}
                            {!disabled && <X size={10} style={{ cursor: "pointer", opacity: 0.8 }} onClick={() => onToggle?.(item.id || item.name)} />}
                        </span>
                    ))}
                </div>
            )}

            <div onClick={() => !disabled && setOpen((o) => !o)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", fontSize: 12, borderRadius: 6, border: "1px solid var(--border-color)", background: disabled ? "var(--bg-tertiary)" : "var(--bg-primary)", color: "var(--text-muted)", cursor: disabled ? "not-allowed" : "pointer" }}>
                <span>{placeholder}</span>
                <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "none", transition: "0.15s" }} />
            </div>

            {open && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 30, background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: 6, marginTop: 4, boxShadow: "0 6px 20px rgba(0,0,0,0.15)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderBottom: "1px solid var(--border-color)" }}>
                        <Search size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                        <input autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" style={{ flex: 1, border: "none", outline: "none", fontSize: 12, background: "transparent", color: "var(--text-primary)" }} />
                        {query && <X size={11} style={{ cursor: "pointer", color: "var(--text-muted)" }} onClick={() => setQuery("")} />}
                    </div>
                    <div style={{ maxHeight: 180, overflowY: "auto" }}>
                        {filtered.length === 0 ? (
                            <div style={{ padding: "8px 10px", fontSize: 11, color: "var(--text-muted)" }}>No results.</div>
                        ) : filtered.map((item) => {
                            const checked = selected.includes(item?.id) || selected.includes(item?.name);
                            return (
                                <div key={item.id || item.name} onClick={() => onToggle?.(item.id || item.name)}
                                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", fontSize: 11.5, cursor: "pointer", borderBottom: "1px solid var(--border-color)", background: checked ? "color-mix(in srgb, var(--brand-color, #2563eb) 10%, transparent)" : "transparent" }}
                                    onMouseEnter={(e) => { if (!checked) e.currentTarget.style.background = "var(--bg-tertiary)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = checked ? "color-mix(in srgb, var(--brand-color, #2563eb) 10%, transparent)" : "transparent"; }}
                                >
                                    <input type="checkbox" checked={checked} onChange={() => { }} style={{ accentColor: "var(--brand-color, #2563eb)" }} />
                                    {renderOption ? renderOption(item) : (
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{item.name}</span>
                                            {item.id && <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{item.id}</span>}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// ---------- Searchable single-select dropdown (ERPNext API — items) ----------
function ItemSearchDropdown({ erpnextConfig, onSelect, selectedLabel }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const wrapRef = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (!open || !erpnextConfig?.url) return;
        const t = setTimeout(async () => {
            setLoading(true);
            try {
                // Safe DocType Item fields ONLY (custom_price / rate do NOT exist on Item doctype)
                const safeFields = ["name", "item_code", "item_name", "item_group", "custom_service_group", "standard_rate"];
                const fallbackFields = ["name", "item_code", "item_name", "item_group"];

                const tryFetch = async (filters, fields) => {
                    try {
                        const filterParam = filters && filters.length > 0 ? `&filters=${encodeURIComponent(JSON.stringify(filters))}` : "";
                        const fieldParam = `fields=${encodeURIComponent(JSON.stringify(fields))}`;
                        const url = `${erpnextConfig.url}/api/resource/Item?${fieldParam}${filterParam}&limit_page_length=500`;
                        const res = await fetch(url, { credentials: "include" });
                        if (res.ok) {
                            const json = await res.json();
                            if (Array.isArray(json?.data) && json.data.length > 0) {
                                return json.data;
                            }
                        }
                    } catch (err) {
                        console.warn("Item fetch attempt error:", err);
                    }
                    return null;
                };

                // 1. Try querying Services (descendants of inclusive)
                let items = await tryFetch([["item_group", "descendants of (inclusive)", "Services"], ["disabled", "=", 0]], safeFields);

                // 2. Try querying item_group = "Services" with disabled=0
                if (!items) {
                    items = await tryFetch([["item_group", "=", "Services"], ["disabled", "=", 0]], safeFields);
                }

                // 3. Try querying item_group = "Services" without disabled filter
                if (!items) {
                    items = await tryFetch([["item_group", "=", "Services"]], safeFields);
                }

                // 4. Try querying without item_group filter in case items have different group
                if (!items) {
                    items = await tryFetch([["disabled", "=", 0]], safeFields);
                }

                // 5. Fallback without custom fields in case custom_service_group is rejected
                if (!items) {
                    items = await tryFetch([["item_group", "=", "Services"]], fallbackFields);
                }
                if (!items) {
                    items = await tryFetch([], fallbackFields);
                }

                const rawItems = Array.isArray(items) ? items : [];

                // Filter out any "Default Service" (custom_service_group !== "Default Service")
                const nonDefaultServices = rawItems
                    .map((it) => {
                        const code = (it.item_code || it.name || "").trim();
                        const name = (it.item_name || code).trim();
                        const sGroup = (it.custom_service_group || "").trim();
                        const iGroup = (it.item_group || "").trim();
                        const rate = Number(it.standard_rate || it.charges || 0) || 0;
                        return {
                            name: it.name || code,
                            item_code: code,
                            item_name: name,
                            item_group: iGroup,
                            custom_service_group: sGroup,
                            standard_rate: rate,
                            custom_price: rate
                        };
                    })
                    .filter((opt) => {
                        if (!opt.item_code) return false;

                        const sGroup = opt.custom_service_group.toLowerCase();
                        const iName = opt.item_name.toLowerCase();
                        const iCode = opt.item_code.toLowerCase();
                        const iGroup = opt.item_group.toLowerCase();

                        // Exclude if custom_service_group is "Default Service"
                        if (sGroup === "default service" || sGroup.includes("default service")) {
                            return false;
                        }

                        // Exclude if item name or code is "Default Service"
                        if (iName === "default service" || iCode === "default service") {
                            return false;
                        }

                        // Exclude standard onboarding default fee services
                        if (
                            iName === "promotional fee" || iName === "promotional fees" || iCode.includes("promotional") ||
                            iName === "service charge" || iName === "service charges" || iCode.includes("service charge") ||
                            iName === "water connection" || iName === "water connection fee" || iCode.includes("water connection")
                        ) {
                            return false;
                        }

                        // Exclude property units / commercial / residential rental items
                        if (iGroup === "commercial" || iGroup === "residential" || iGroup === "units" || iGroup === "unit" || iGroup === "property" || iGroup === "properties") {
                            return false;
                        }

                        return true;
                    });

                console.log("Services loaded in Add Services (without Default Service):", nonDefaultServices);
                setOptions(nonDefaultServices);
            } catch (e) {
                console.error("Item search failed:", e);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        }, 200);
        return () => clearTimeout(t);
    }, [open, erpnextConfig?.url]);

    const filteredOptions = useMemo(() => {
        if (!query) return options;
        const q = query.trim().toLowerCase();
        return options.filter((opt) => {
            const code = (opt.item_code || "").toLowerCase();
            const name = (opt.item_name || "").toLowerCase();
            return code.includes(q) || name.includes(q);
        });
    }, [options, query]);

    return (
        <div ref={wrapRef} style={{ position: "relative", flex: 1 }}>
            {/* Trigger — same visual style as AssignSearchDropdown */}
            <div onClick={() => setOpen((o) => !o)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", fontSize: 12, borderRadius: 6, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: selectedLabel ? "var(--text-primary)" : "var(--text-muted)", cursor: "pointer" }}>
                <span>{selectedLabel || "Select services..."}</span>
                <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "none", transition: "0.15s" }} />
            </div>

            {open && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 20, background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: 6, marginTop: 4, boxShadow: "0 6px 20px rgba(0,0,0,0.15)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderBottom: "1px solid var(--border-color)" }}>
                        <Search size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                        <input autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search item code or name…" style={{ flex: 1, border: "none", outline: "none", fontSize: 12, background: "transparent", color: "var(--text-primary)" }} />
                        {query && <X size={11} style={{ cursor: "pointer", color: "var(--text-muted)" }} onClick={() => setQuery("")} />}
                    </div>
                    <div style={{ maxHeight: 180, overflowY: "auto" }}>
                        {loading ? (
                            <div style={{ padding: "8px 10px", fontSize: 11, color: "var(--text-muted)" }}>Searching…</div>
                        ) : filteredOptions.length === 0 ? (
                            <div style={{ padding: "8px 10px", fontSize: 11, color: "var(--text-muted)" }}>No services found.</div>
                        ) : filteredOptions.map((opt) => (
                            <div key={opt.item_code} onClick={() => { onSelect?.(opt); setOpen(false); setQuery(""); }}
                                style={{ padding: "7px 10px", fontSize: 11.5, cursor: "pointer", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ fontWeight: 600, color: "var(--brand-color)" }}>{opt.item_code}</span>
                                    {opt.item_name && opt.item_name !== opt.item_code && <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>{opt.item_name}</span>}
                                </div>
                                {opt.custom_price > 0 && (
                                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>${opt.custom_price}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ---------- Main component ----------
function TaskAssignPanel({ taskDoc, employeeDir = [], vendorDir = [], erpnextConfig, getCsrfToken, showToast, onSaved, aftersucess }) {

    // A task is "locked" (read-only) once its status is "Completed" (or "Cancelled")
    // or when the user has just successfully submitted the task locally.
    const [isLockedLocal, setIsLockedLocal] = useState(false);
    const isLocked = Boolean(taskDoc?.status === "Completed" || taskDoc?.status === "Cancelled" || isLockedLocal);

    const [currentQuotationId, setCurrentQuotationId] = useState(taskDoc?.custom_quotation_id || null);
    const [creatingQuotation, setCreatingQuotation] = useState(false);
    const [showQuotationConfirm, setShowQuotationConfirm] = useState(false);

    useEffect(() => {
        setIsLockedLocal(taskDoc?.status === "Completed");
    }, [taskDoc?.status, taskDoc?.name]);

    useEffect(() => {
        const qId = taskDoc?.custom_quotation_id || taskDoc?.quotation_id || null;
        if (qId) {
            setCurrentQuotationId(qId);
        } else if (isLocked && taskDoc?.name && erpnextConfig?.url) {
            fetch(`${erpnextConfig.url}/api/resource/Quotation?filters=${encodeURIComponent(JSON.stringify([["custom_task_reference", "=", taskDoc.name], ["docstatus", "!=", 2]]))}&fields=["name"]&limit=1`, {
                credentials: "include",
                headers: safeHeaders()
            })
            .then(r => r.ok ? r.json() : null)
            .then(json => {
                if (json?.data?.[0]?.name) {
                    setCurrentQuotationId(json.data[0].name);
                }
            })
            .catch(() => {});
        }
    }, [taskDoc?.custom_quotation_id, taskDoc?.quotation_id, taskDoc?.name, isLocked, erpnextConfig?.url]);

    const resolveToken = () => {
        try {
            const t = typeof getCsrfToken === 'function' ? getCsrfToken() : null;
            if (t && typeof t === 'string' && t.trim() !== '') return t.trim();
        } catch {}
        const globalToken = getGlobalCsrfToken?.();
        if (globalToken) return globalToken;
        if (typeof window !== 'undefined' && window.csrf_token && window.csrf_token !== 'None') return window.csrf_token;
        return '';
    };

    const safeHeaders = (extra = {}) => {
        return getAuthHeaders(extra);
    };

    // ── ASSIGN ──
    const [assignType, setAssignType] = useState("");
    const [savingAssign, setSavingAssign] = useState(false);
    const [selectedEmpIds, setSelectedEmpIds] = useState([]);
    const [selectedVendorIds, setSelectedVendorIds] = useState([]);
    const [empRows, setEmpRows] = useState(() => taskDoc?.custom_assign_to_ || []);
    const [vendorRows, setVendorRows] = useState(() => taskDoc?.custom_assign_to_vendor || []);

    const effectiveAssignType = useMemo(() => {
        const raw = (taskDoc?.custom_assign || assignType || "").toLowerCase().trim();
        if (raw === "employee" || raw.includes("employee")) return "employee";
        if (raw === "vendor" || raw.includes("vendor")) return "vendor";
        if (empRows.length > 0) return "employee";
        if (vendorRows.length > 0) return "vendor";
        return assignType || "employee";
    }, [taskDoc?.custom_assign, assignType, empRows, vendorRows]);

    useEffect(() => {
        let isMounted = true;
        const currentVendors = taskDoc?.custom_assign_to_vendor;
        const currentEmps = taskDoc?.custom_assign_to_;

        if (Array.isArray(currentVendors)) {
            setVendorRows(currentVendors);
            setSelectedVendorIds(currentVendors.map((r) => r?.vendor_name || r?.vendor || r?.supplier || r?.name).filter(Boolean));
        }
        if (Array.isArray(currentEmps)) {
            setEmpRows(currentEmps);
            setSelectedEmpIds(currentEmps.map((r) => r?.emp_id || r?.employee || r?.id || r?.name).filter(Boolean));
        }

        const raw = (taskDoc?.custom_assign || "").toLowerCase().trim();
        if (raw) setAssignType(raw);
        else if (Array.isArray(currentEmps) && currentEmps.length > 0) setAssignType("employee");
        else if (Array.isArray(currentVendors) && currentVendors.length > 0) setAssignType("vendor");

        // Fetch full Task doc to guarantee child tables (custom_assign_to_vendor, custom_assign_to_) are loaded
        if (taskDoc?.name && erpnextConfig?.url) {
            fetch(`${erpnextConfig.url}/api/resource/Task/${encodeURIComponent(taskDoc.name)}`, {
                credentials: "include",
                headers: safeHeaders()
            })
                .then(res => res.ok ? res.json() : null)
                .then(json => {
                    if (!isMounted) return;
                    const doc = json?.data || json || {};
                    const fetchedVendors = Array.isArray(doc?.custom_assign_to_vendor) ? doc.custom_assign_to_vendor : [];
                    const fetchedEmps = Array.isArray(doc?.custom_assign_to_) ? doc.custom_assign_to_ : [];

                    setVendorRows(fetchedVendors);
                    setSelectedVendorIds(fetchedVendors.map((r) => r?.vendor_name || r?.vendor || r?.supplier || r?.name).filter(Boolean));

                    setEmpRows(fetchedEmps);
                    setSelectedEmpIds(fetchedEmps.map((r) => r?.emp_id || r?.employee || r?.id || r?.name).filter(Boolean));

                    if (doc?.custom_assign) {
                        setAssignType(doc.custom_assign.toLowerCase().trim());
                    }
                })
                .catch(err => {
                    console.warn("Could not fetch Task child tables in TaskItemsPanel:", err);
                });
        }

        return () => { isMounted = false; };
    }, [taskDoc?.name, taskDoc?.custom_assign_to_vendor, taskDoc?.custom_assign_to_, erpnextConfig?.url]);

    const toggleEmp = (id) => setSelectedEmpIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
    const toggleVendor = (id) => setSelectedVendorIds((p) => {
        const match = allVendorsList.find(v => v.id === id || v.name === id);
        const targetId = match?.id || id;
        const targetName = match?.name || id;
        const exists = p.some(x => x === targetId || x === targetName);
        if (exists) {
            return p.filter(x => x !== targetId && x !== targetName);
        } else {
            return [...p, targetId];
        }
    });

    const [assignedVendorDetails, setAssignedVendorDetails] = useState({});

    const vendorNamesStr = (vendorRows || []).map(r => r?.vendor_name || r?.vendor || r?.supplier || r?.name).filter(Boolean).join(',');

    useEffect(() => {
        if (!erpnextConfig?.url || !vendorRows || vendorRows.length === 0) return;

        const fetchDetails = async () => {
            const details = {};
            for (const r of vendorRows) {
                const vName = r?.vendor_name || r?.vendor || r?.supplier || r?.name;
                if (!vName || details[vName]) continue;
                try {
                    const res = await fetch(`${erpnextConfig.url}/api/resource/Supplier/${encodeURIComponent(vName)}`, {
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    if (res.ok) {
                        const json = await res.json();
                        const doc = json.data || json || {};
                        console.log("Supplier detailed response in TaskItemsPanel:", doc);
                        const matchedVendor = vendorDir?.find(v => v.id === vName || v.name === vName);
                        let contactPerson = doc.custom_contact_person || (doc.supplier_primary_contact ? doc.supplier_primary_contact.split('-')[0].trim() : '') || '';
                        let email = doc.email_id || doc.owner || '';
                        let phoneVal = '';

                        // Fetch Contacts linked to this Supplier
                        let contacts = [];
                        try {
                            const contactRes = await fetch(`${erpnextConfig.url}/api/resource/Contact?filters=[["Dynamic Link", "link_doctype", "=", "Supplier"], ["Dynamic Link", "link_name", "=", "${vName}"]]&fields=["name","email_id","phone","first_name","last_name"]`, {
                                credentials: 'include',
                                headers: { 'Content-Type': 'application/json' }
                            });
                            if (contactRes.ok) {
                                const contactJson = await contactRes.json();
                                contacts = contactJson.data || [];
                                // Fetch detailed contact information for any contact whose first_name is "Jitendra" (child table)
                                contacts = await Promise.all(contacts.map(async (c) => {
                                    if (c.first_name === 'Jitendra' && c.name) {
                                        try {
                                            const detailRes = await fetch(`${erpnextConfig.url}/api/resource/Contact/${encodeURIComponent(c.name)}`, { credentials: 'include' });
                                            if (detailRes.ok) {
                                                const detailJson = await detailRes.json();
                                                const contactDetails = detailJson?.data || detailJson || {};
                                                const fetchedPhone = contactDetails.phone || (contactDetails.phone_nos && contactDetails.phone_nos[0]?.phone) || '';
                                                const fetchedEmail = contactDetails.email_id || (contactDetails.email_ids && contactDetails.email_ids[0]?.email_id) || '';
                                                return {
                                                    ...c,
                                                    phone: fetchedPhone || c.phone,
                                                    email_id: fetchedEmail || c.email_id
                                                };
                                            }
                                        } catch (err) {
                                            console.warn('Failed fetching detailed contact info for Jitendra:', err);
                                        }
                                    }
                                    return c;
                                }));
                            }
                        } catch (cErr) {
                            console.warn("Failed fetching contacts linked to supplier:", cErr);
                        }

                        if ((!email || !phoneVal) && doc.supplier_primary_contact) {
                            try {
                                const contactFilter = JSON.stringify([["name", "=", doc.supplier_primary_contact]]);
                                const contactFields = JSON.stringify(["name", "email_id", "phone", "mobile_no"]);
                                const contactRes = await fetch(`${erpnextConfig.url}/api/resource/Contact?filters=${encodeURIComponent(contactFilter)}&fields=${encodeURIComponent(contactFields)}`, {
                                    credentials: 'include',
                                    headers: { 'Content-Type': 'application/json' }
                                });
                                if (contactRes.ok) {
                                    const contactJson = await contactRes.json();
                                    const contactList = contactJson.data || [];
                                    if (contactList.length > 0) {
                                        const contactDoc = contactList[0];
                                        if (contactDoc.email_id) email = contactDoc.email_id;
                                        if (contactDoc.phone) phoneVal = contactDoc.phone;
                                        else if (contactDoc.mobile_no) phoneVal = contactDoc.mobile_no;
                                    }
                                }
                            } catch (cErr) {
                                console.warn("Failed fetching primary contact:", cErr);
                            }
                        }

                        if (!contactPerson) contactPerson = matchedVendor?.custom_contact_person || '';
                        if (!email) email = matchedVendor?.email_id || matchedVendor?.email || '';
                        if (!phoneVal) phoneVal = matchedVendor?.phone_no || matchedVendor?.phone || '';

                        details[vName] = {
                            name: doc.supplier_name || doc.name || vName,
                            contactPerson,
                            email_id: email,
                            email,
                            phone: phoneVal,
                            contacts,
                            service_name: doc.service_name || [],
                            custom_services_list: doc.custom_services_list || []
                        };
                    }
                } catch (err) {
                    console.warn(`Failed fetching details for vendor ${vName}:`, err);
                }
            }
            setAssignedVendorDetails(prev => ({ ...prev, ...details }));
        };

        fetchDetails();
    }, [vendorNamesStr, erpnextConfig]);

    const handleReassign = async () => {
        if (isLocked) return;
        setSavingAssign(true);
        try {
            await handleSaveDocument();
        } finally {
            setSavingAssign(false);
        }
    };

    // ── ITEMS ──
    const [itemRows, setItemRows] = useState([]);
    const [pendingItem, setPendingItem] = useState(null);
    const [pendingQty, setPendingQty] = useState(1);
    const [pendingPrice, setPendingPrice] = useState("");
    const [savingItems, setSavingItems] = useState(false);
    const [savingDocument, setSavingDocument] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const mapMaintenanceItems = (rawList) => {
            if (!Array.isArray(rawList)) return [];
            return rawList.map((r) => ({
                name: r?.name,
                item_code: r?.item_code || r?.item || r?.service || r?.service_name || r?.name || "",
                item_name: r?.item_name || r?.item_description || r?.description || r?.service_name || r?.item_code || "—",
                qty: Number(r?.qty || r?.quantity || 1),
                custom_price: r?.custom_price !== undefined && r?.custom_price !== null 
                    ? Number(r.custom_price) 
                    : (r?.price !== undefined && r?.price !== null ? Number(r.price) : (r?.rate !== undefined && r?.rate !== null ? Number(r.rate) : 0))
            }));
        };

        const currentItems = taskDoc?.custom_items_used_for_maintenance;

        if (Array.isArray(currentItems)) {
            // Strictly use custom_items_used_for_maintenance from the Task doctype
            setItemRows(mapMaintenanceItems(currentItems));
        } else if (taskDoc?.name && erpnextConfig?.url) {
            // Fetch Task doc from ERPNext to read custom_items_used_for_maintenance table
            fetch(`${erpnextConfig.url}/api/resource/Task/${encodeURIComponent(taskDoc.name)}`, {
                credentials: "include",
                headers: safeHeaders()
            })
                .then(res => res.ok ? res.json() : null)
                .then(json => {
                    if (!isMounted) return;
                    const doc = json?.data || json || {};
                    const items = doc?.custom_items_used_for_maintenance || [];
                    setItemRows(mapMaintenanceItems(items));
                })
                .catch(err => {
                    console.warn("Could not fetch Task custom_items_used_for_maintenance:", err);
                    if (isMounted) setItemRows([]);
                });
        } else {
            setItemRows([]);
        }

        return () => { isMounted = false; };
    }, [taskDoc?.custom_items_used_for_maintenance, taskDoc?.name, erpnextConfig?.url]);

    const [supplierServices, setSupplierServices] = useState([]);

    useEffect(() => {
        if (!erpnextConfig?.url) return;
        fetch(`${erpnextConfig.url}/api/resource/multi-services?fields=%5B%22parent%22%2C%22service_group%22%2C%22services%22%5D&limit_page_length=1000`, { credentials: "include" })
            .then(res => res.ok ? res.json() : null)
            .then(json => {
                if (json && json.data) {
                    setSupplierServices(json.data);
                }
            })
            .catch(err => console.error("Failed to fetch multi-services:", err));
    }, [erpnextConfig]);

    const [erpSuppliers, setErpSuppliers] = useState([]);

    useEffect(() => {
        if (!erpnextConfig?.url) return;
        fetch(`${erpnextConfig.url}/api/resource/Supplier?fields=["name","supplier_name","supplier_type","supplier_group","custom_contact_person","email_id","phone_no"]&limit_page_length=1000`, {
            credentials: "include",
            headers: safeHeaders()
        })
            .then(res => res.ok ? res.json() : null)
            .then(json => {
                if (json && Array.isArray(json.data)) {
                    setErpSuppliers(json.data.map(s => ({
                        id: s.name,
                        name: s.supplier_name || s.name,
                        type: s.supplier_type || s.supplier_group || 'Services',
                        group: s.supplier_group || 'Local',
                        email: s.email_id || '',
                        phone: s.phone_no || '',
                        custom_contact_person: s.custom_contact_person || ''
                    })));
                }
            })
            .catch(err => console.warn("Failed fetching all suppliers in TaskItemsPanel:", err));
    }, [erpnextConfig?.url]);

    const allVendorsList = useMemo(() => {
        const map = new Map();
        (vendorDir || []).forEach(v => {
            const key = v.id || v.name;
            if (key) map.set(key, v);
        });
        erpSuppliers.forEach(s => {
            const key = s.id || s.name;
            if (key && !map.has(key)) {
                map.set(key, s);
            }
        });
        return Array.from(map.values());
    }, [vendorDir, erpSuppliers]);

    const vendorsWithServices = useMemo(() => {
        return allVendorsList.map(vendor => {
            const services = supplierServices.filter(s => s.parent === vendor.id || s.parent === vendor.name);
            return {
                ...vendor,
                services_list: services
            };
        });
    }, [allVendorsList, supplierServices]);

    const vendorPlaceholder = vendorsWithServices.length > 0
        ? `Search & select vendors (${vendorsWithServices.length} suppliers)…`
        : "Search & select vendors…";

    const addItemToList = () => {
        if (isLocked) return;
        if (!pendingItem) { showToast?.("Select an item first.", "error"); return; }
        if (pendingQty <= 0) { showToast?.("Quantity must be greater than zero.", "error"); return; }
        const itemPrice = pendingPrice !== "" ? (Number(pendingPrice) || 0) : (Number(pendingItem.custom_price || pendingItem.standard_rate || pendingItem.rate) || 0);
        setItemRows((prev) => {
            const idx = prev.findIndex((r) => r.item_code === pendingItem.item_code);
            if (idx >= 0) {
                const copy = [...prev];
                copy[idx] = {
                    ...copy[idx],
                    qty: copy[idx].qty + pendingQty,
                    custom_price: itemPrice || copy[idx].custom_price || 0
                };
                return copy;
            }
            return [...prev, {
                item_code: pendingItem.item_code,
                item_name: pendingItem.item_name,
                qty: pendingQty,
                custom_price: itemPrice
            }];
        });
        setPendingItem(null);
        setPendingQty(1);
        setPendingPrice("");
    };

    const removeRow = (idx) => { if (isLocked) return; setItemRows((p) => p.filter((_, i) => i !== idx)); };
    const changeRowQty = (idx, delta) => { if (isLocked) return; setItemRows((p) => p.map((r, i) => i === idx ? { ...r, qty: Math.max(1, r.qty + delta) } : r)); };
    const changeRowPrice = (idx, val) => {
        if (isLocked) return;
        setItemRows((p) => p.map((r, i) => i === idx ? { ...r, custom_price: val === "" ? "" : Number(val) } : r));
    };

    /**
     * Unified, robust document saver for the Task DocType in ERPNext.
     * Persists:
     * - status (optionally overridden, e.g. "Working")
     * - custom_items_used_for_maintenance (all services currently in table)
     * - custom_assign ("Employee" or "Vendor")
     * - custom_assign_to_ (employee child table)
     * - custom_assign_to_vendor (vendor child table)
     * Uses atomic PUT, frappe.client.set_value fallback, re-fetches fresh doc,
     * calls onSaved and aftersucess.
     */
    async function handleSaveDocument(overrideStatus = null) {
        if (isLocked) return null;
        if (!erpnextConfig?.url || !taskDoc?.name) {
            showToast?.("No ERPNext connection.", "error");
            return null;
        }
        setSavingDocument(true);
        try {
            const nextStatus = overrideStatus || taskDoc.status || "Open";
            const assignStr = effectiveAssignType === "employee" ? "Employee" : "Vendor";

            const formattedItems = itemRows.map((r) => ({
                ...(r.name && !String(r.name).startsWith("temp_") ? { name: r.name } : {}),
                item_code: r.item_code,
                item_name: r.item_name,
                qty: Number(r.qty) || 1,
                custom_price: Number(r.custom_price) || 0
            }));

            const formattedEmp = selectedEmpIds.map((id) => {
                const e = employeeDir.find((x) => x?.id === id || x?.name === id);
                return {
                    emp_id: id,
                    emp_name: e?.name || e?.employee_name || id,
                    designation: e?.certs || e?.designation || "",
                    contact_number: e?.phone || e?.cell_number || ""
                };
            });

            const formattedVendors = selectedVendorIds.map((id) => {
                const v = allVendorsList.find((x) => x?.id === id || x?.name === id);
                return {
                    vendor_name: id,
                    supplier_type: v?.type || v?.supplier_type || ""
                };
            });

            const savePayload = {
                status: nextStatus,
                custom_items_used_for_maintenance: formattedItems,
                custom_assign: assignStr,
                ...(effectiveAssignType === "employee"
                    ? { custom_assign_to_: formattedEmp, custom_assign_to_vendor: [] }
                    : { custom_assign_to_vendor: formattedVendors, custom_assign_to_: [] })
            };

            let savedSuccessfully = false;

            // 1. Primary: Single atomic REST PUT with full payload
            try {
                const res = await fetch(`${erpnextConfig.url}/api/resource/Task/${encodeURIComponent(taskDoc.name)}`, {
                    method: "PUT",
                    credentials: "include",
                    headers: safeHeaders(),
                    body: JSON.stringify(savePayload)
                });
                if (res.ok) {
                    savedSuccessfully = true;
                } else {
                    const errTxt = await res.text();
                    console.warn("PUT Task full payload warning:", errTxt);
                }
            } catch (putErr) {
                console.warn("PUT Task full payload failed:", putErr);
            }

            // 2. Fallback: if atomic PUT was rejected, commit status via frappe.client.set_value & save child tables
            if (!savedSuccessfully) {
                if (nextStatus) {
                    try {
                        const setValRes = await fetch(`${erpnextConfig.url}/api/method/frappe.client.set_value`, {
                            method: "POST",
                            credentials: "include",
                            headers: safeHeaders(),
                            body: JSON.stringify({
                                doctype: "Task",
                                name: taskDoc.name,
                                fieldname: "status",
                                value: nextStatus
                            })
                        });
                        if (setValRes.ok) {
                            savedSuccessfully = true;
                        }
                    } catch (rpcErr) {
                        console.warn("frappe.client.set_value status failed:", rpcErr);
                    }
                }

                // Child tables fallback
                try {
                    await fetch(`${erpnextConfig.url}/api/resource/Task/${encodeURIComponent(taskDoc.name)}`, {
                        method: "PUT",
                        credentials: "include",
                        headers: safeHeaders(),
                        body: JSON.stringify({ custom_items_used_for_maintenance: formattedItems })
                    });
                } catch (itemErr) {
                    console.warn("Fallback items PUT failed:", itemErr);
                }

                try {
                    await fetch(`${erpnextConfig.url}/api/resource/Task/${encodeURIComponent(taskDoc.name)}`, {
                        method: "PUT",
                        credentials: "include",
                        headers: safeHeaders(),
                        body: JSON.stringify({
                            custom_assign: assignStr,
                            ...(effectiveAssignType === "employee"
                                ? { custom_assign_to_: formattedEmp, custom_assign_to_vendor: [] }
                                : { custom_assign_to_vendor: formattedVendors, custom_assign_to_: [] })
                        })
                    });
                } catch (assignErr) {
                    console.warn("Fallback assignment PUT failed:", assignErr);
                }
            }

            // 3. Re-fetch fresh Task doc from ERPNext server for exact sync
            let freshDoc = null;
            try {
                const freshRes = await fetch(`${erpnextConfig.url}/api/resource/Task/${encodeURIComponent(taskDoc.name)}`, {
                    credentials: "include",
                    headers: safeHeaders()
                });
                if (freshRes.ok) {
                    const freshJson = await freshRes.json();
                    freshDoc = freshJson?.data || freshJson;
                }
            } catch (fetchErr) {
                console.warn("Could not re-fetch Task doc:", fetchErr);
            }

            const finalDoc = {
                ...taskDoc,
                ...savePayload,
                status: nextStatus,
                ...(freshDoc || {})
            };

            if (freshDoc?.custom_assign_to_vendor) {
                setVendorRows(freshDoc.custom_assign_to_vendor);
            } else if (savePayload.custom_assign_to_vendor) {
                setVendorRows(savePayload.custom_assign_to_vendor);
            }
            if (freshDoc?.custom_assign_to_) {
                setEmpRows(freshDoc.custom_assign_to_);
            } else if (savePayload.custom_assign_to_) {
                setEmpRows(savePayload.custom_assign_to_);
            }

            onSaved?.(finalDoc);
            aftersucess?.();

            showToast?.(
                overrideStatus === "Working"
                    ? "Task status updated to Working & document saved."
                    : "Task document saved successfully.",
                "success"
            );
            return finalDoc;
        } catch (err) {
            console.error("handleSaveDocument error:", err);
            showToast?.(err?.message || "Failed to save Task document.", "error");
            return null;
        } finally {
            setSavingDocument(false);
        }
    }

    // Update Items: persists current items using unified document saver
    const handleUpdateItems = async () => {
        if (isLocked) return;
        setSavingItems(true);
        try {
            await handleSaveDocument();
        } finally {
            setSavingItems(false);
        }
    };

    const handleSubmitClick = async () => {
        if (isLocked) return;
        // If items are empty, check if booking is available before blocking
        if (itemRows.length === 0) {
            const hasBooking = await checkBookingAvailable();
            if (!hasBooking) {
                showToast?.("Add at least one item before submitting.", "error");
                return;
            }
        }
        setShowConfirm(true);
    };

    // const handleConfirmSubmit = async () => {
    //     setShowConfirm(false);
    //     if (isLocked) return;
    //     if (!erpnextConfig?.url || !taskDoc?.name) { showToast?.("No ERPNext connection.", "error"); return; }
    //     setSubmitting(true);
    //     try {
    //         const stockoutRes = await fetch(`${erpnextConfig.url}/api/method/property_management.api.submit_task_stockout_api`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": getCsrfToken?.() }, body: JSON.stringify({ task_name: taskDoc.name }) });
    //         const stockoutJson = await stockoutRes.json();
    //         const stockoutResult = stockoutJson?.message;
    //         if (!stockoutResult || !stockoutResult.success) { showToast?.(stockoutResult?.error || "Stock-out validation failed.", "error"); return; }
    //         if (stockoutResult.stock_entry) showToast?.(`Stock Entry ${stockoutResult.stock_entry} created.`, "success");
    //         // const today = new Date().toISOString().slice(0, 10);
    //         // const updateRes = await fetch(`${erpnextConfig.url}/api/resource/Task/${taskDoc.name}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": getCsrfToken?.() }, body: JSON.stringify({ status: "Completed", completed_on: today, docstatus: 1 }) });
    //         // const updateJson = await updateRes.json();
    //         // if (!updateRes.ok) { showToast?.(updateJson?.exception || "Failed to submit task.", "error"); return; }
    //         showToast?.("Task submitted and marked Completed.", "success");
    //         onSaved?.(updateJson.data);
    //     } catch (e) { console.error(e); showToast?.("Error submitting task.", "error"); }
    //     finally { setSubmitting(false); }
    // };

    // Helper to extract a valid, non-empty booking identifier from a document
    const getBookingIdentifier = (doc) => {
        if (!doc) return null;
        const candidates = [
            doc.custom_booking_number,
            doc.custom_booking_id,
            doc.custom_booking,
            doc.booking,
            doc.booking_id,
            doc.booking_number,
            doc.custom_booking_no,
            doc.booking_no,
            doc.customer_booking,
            doc.booking_name,
            doc.lease_booking,
            doc.custom_booking_ref,
            doc.booking_ref,
            doc.custom_contract_booking,
            doc.custom_booking_code
        ];
        for (const val of candidates) {
            if (val !== undefined && val !== null) {
                const str = String(val).trim();
                if (
                    str !== "" &&
                    str !== "-" &&
                    str.toLowerCase() !== "none" &&
                    str.toLowerCase() !== "null" &&
                    str.toLowerCase() !== "undefined"
                ) {
                    return str;
                }
            }
        }
        return null;
    };

    // Helper to check if a booking is available for the current task
    const checkBookingAvailable = async () => {
        // 1. Direct fields on taskDoc
        const directBooking = getBookingIdentifier(taskDoc);
        if (directBooking) return directBooking;

        if (!erpnextConfig?.url) return null;

        let fullTask = taskDoc || {};

        // 2. Refetch full Task document from ERPNext if fields were omitted in list view
        if (taskDoc?.name) {
            try {
                const tRes = await fetch(`${erpnextConfig.url}/api/resource/Task/${encodeURIComponent(taskDoc.name)}`, {
                    credentials: "include",
                    headers: safeHeaders()
                });
                if (tRes.ok) {
                    const tJson = await tRes.json();
                    const tDoc = tJson?.data || tJson || {};
                    fullTask = { ...fullTask, ...tDoc };
                    const tBooking = getBookingIdentifier(tDoc);
                    if (tBooking) return tBooking;
                }
            } catch (tErr) {
                console.warn("Could not refetch Task doc for booking:", tErr);
            }
        }

        // 3. Linked Maintenance Schedule
        const schedName =
            fullTask?.custom_mantainence_sechedule ||
            fullTask?.custom_maintenance_schedule ||
            fullTask?.maintenance_schedule ||
            fullTask?.custom_schedule ||
            fullTask?.scheduleId ||
            fullTask?.schedule;

        let sDoc = {};
        if (schedName) {
            try {
                const sRes = await fetch(
                    `${erpnextConfig.url}/api/resource/Maintenance%20Schedule/${encodeURIComponent(schedName)}`,
                    {
                        credentials: "include",
                        headers: safeHeaders()
                    }
                );
                if (sRes.ok) {
                    const sJson = await sRes.json();
                    sDoc = sJson?.data || sJson || {};
                    const schedBooking = getBookingIdentifier(sDoc);
                    if (schedBooking) return schedBooking;
                }
            } catch (schedErr) {
                console.warn("Could not check linked maintenance schedule for booking:", schedErr);
            }
        }

        // 4. Check Booking by Customer
        const customer =
            fullTask?.customer ||
            fullTask?.custom_customer ||
            fullTask?.custom_customer_name ||
            sDoc?.customer ||
            sDoc?.customer_name;

        if (customer) {
            try {
                const bRes = await fetch(
                    `${erpnextConfig.url}/api/resource/Booking?filters=${encodeURIComponent(
                        JSON.stringify([["customer", "=", customer], ["docstatus", "<", 2]])
                    )}&fields=["name"]&limit=1`,
                    { credentials: "include", headers: safeHeaders() }
                );
                if (bRes.ok) {
                    const bJson = await bRes.json();
                    if (bJson?.data && bJson.data.length > 0 && bJson.data[0].name) {
                        return bJson.data[0].name;
                    }
                }
            } catch (e) {
                console.warn("Could not check booking by customer:", e);
            }
        }

        // 5. Check Booking by Property
        const property =
            fullTask?.custom_property ||
            fullTask?.property ||
            sDoc?.custom_property ||
            sDoc?.property;

        if (property) {
            try {
                const bRes = await fetch(
                    `${erpnextConfig.url}/api/resource/Booking?filters=${encodeURIComponent(
                        JSON.stringify([["property", "=", property], ["docstatus", "<", 2]])
                    )}&fields=["name"]&limit=1`,
                    { credentials: "include", headers: safeHeaders() }
                );
                if (bRes.ok) {
                    const bJson = await bRes.json();
                    if (bJson?.data && bJson.data.length > 0 && bJson.data[0].name) {
                        return bJson.data[0].name;
                    }
                }
            } catch (e) {
                console.warn("Could not check booking by property:", e);
            }
        }

        // 6. Check Booking by Unit / Asset
        const unit =
            fullTask?.custom_asset ||
            fullTask?.asset ||
            fullTask?.unit ||
            sDoc?.custom_asset ||
            sDoc?.unit;

        if (unit) {
            try {
                const bRes = await fetch(
                    `${erpnextConfig.url}/api/resource/Booking?filters=${encodeURIComponent(
                        JSON.stringify([["unit", "=", unit], ["docstatus", "<", 2]])
                    )}&fields=["name"]&limit=1`,
                    { credentials: "include", headers: safeHeaders() }
                );
                if (bRes.ok) {
                    const bJson = await bRes.json();
                    if (bJson?.data && bJson.data.length > 0 && bJson.data[0].name) {
                        return bJson.data[0].name;
                    }
                }
            } catch (e) {
                console.warn("Could not check booking by unit:", e);
            }
        }

        // 7. General Check: Is ANY active booking available in ERPNext?
        try {
            const anyBookingRes = await fetch(
                `${erpnextConfig.url}/api/resource/Booking?filters=${encodeURIComponent(
                    JSON.stringify([["docstatus", "<", 2]])
                )}&fields=["name"]&limit=1`,
                { credentials: "include", headers: safeHeaders() }
            );
            if (anyBookingRes.ok) {
                const anyJson = await anyBookingRes.json();
                if (anyJson?.data && anyJson.data.length > 0 && anyJson.data[0].name) {
                    return anyJson.data[0].name;
                }
            }
        } catch (e) {
            console.warn("Could not check any available booking in ERPNext:", e);
        }

        return null;
    };

    // Helper to detect if an error message is caused by a non-stock item
    const isNotStockItemError = (err) => {
        if (!err) return false;
        const str = typeof err === "object" ? JSON.stringify(err) : String(err);
        return (
            /not\s+a\s+stock\s+item/i.test(str) ||
            /is\s+not\s+a\s+stock\s+item/i.test(str) ||
            /not\s+maintained\s+in\s+stock/i.test(str) ||
            /cannot\s+be\s+stocked/i.test(str) ||
            /is_stock_item/i.test(str) ||
            /has\s+no\s+stock/i.test(str)
        );
    };

    const handleConfirmSubmit = async () => {
        setShowConfirm(false);

        if (isLocked) return;

        if (!erpnextConfig?.url || !taskDoc?.name) {
            showToast?.("No ERPNext connection.", "error");
            return;
        }

        setSubmitting(true);

        try {
            // Check upfront if a booking is available for this task
            const bookingId = await checkBookingAvailable();
            console.log("Submit Task - Booking detected:", bookingId);

            // 1. Ensure any item changes in the UI are saved to the Task doc in ERPNext first
            if (itemRows.length > 0) {
                try {
                    const saveItemsBody = {
                        custom_items_used_for_maintenance: itemRows.map((r) => ({
                            item_code: r.item_code,
                            item_name: r.item_name,
                            qty: Number(r.qty) || 1,
                            custom_price: Number(r.custom_price) || 0
                        }))
                    };
                    await fetch(`${erpnextConfig.url}/api/resource/Task/${taskDoc.name}`, {
                        method: "PUT",
                        credentials: "include",
                        headers: safeHeaders(),
                        body: JSON.stringify(saveItemsBody)
                    });
                } catch (saveItemsErr) {
                    console.warn("Could not pre-save items before stockout:", saveItemsErr);
                }
            }

            // 2. Call stock-out API
            let stockOutBypassed = false;
            let stockEntryCreated = null;

            try {
                const response = await fetch(
                    `${erpnextConfig.url}/api/method/property_management.api.submit_task_stockout_api`,
                    {
                        method: "POST",
                        credentials: "include",
                        headers: safeHeaders(),
                        body: JSON.stringify({
                            task_name: taskDoc.name,
                        }),
                    }
                );

                const result = await response.json().catch(() => ({}));

                // HTTP error
                if (!response.ok) {
                    const rawErr =
                        result?.exception ||
                        result?.message ||
                        result?._server_messages ||
                        "Request failed.";

                    const hasBooking = bookingId || (await checkBookingAvailable());
                    if (isNotStockItemError(rawErr) && hasBooking) {
                        console.warn(`Bypassing HTTP stock-out error because booking (${hasBooking}) is available:`, rawErr);
                        stockOutBypassed = true;
                    } else {
                        showToast?.(
                            typeof rawErr === "string" ? rawErr : JSON.stringify(rawErr),
                            "error"
                        );
                        return;
                    }
                } else {
                    const data = result?.message;

                    // Invalid response
                    if (!data) {
                        const hasBooking = bookingId || (await checkBookingAvailable());
                        if (hasBooking) {
                            console.warn("Invalid response from stock-out API, bypassing because booking is available.");
                            stockOutBypassed = true;
                        } else {
                            showToast?.("Invalid server response.", "error");
                            return;
                        }
                    } else if (!data.success) {
                        // Business validation failed
                        const error =
                            data.error ||
                            data.msg ||
                            "Stock-out validation failed.";

                        const hasBooking = bookingId || (await checkBookingAvailable());
                        if (isNotStockItemError(error) && hasBooking) {
                            console.warn(`Bypassing stock-out error because booking (${hasBooking}) is available:`, error);
                            stockOutBypassed = true;
                        } else {
                            showToast?.(error, "error");
                            console.error("Stock-out Error:", data);
                            return;
                        }
                    } else if (data.stock_entry) {
                        stockEntryCreated = data.stock_entry;
                        showToast?.(
                            `Stock Entry ${data.stock_entry} created.`,
                            "success"
                        );
                    }
                }
            } catch (stockFetchErr) {
                console.warn("Stock-out API threw error:", stockFetchErr);
                const hasBooking = bookingId || (await checkBookingAvailable());
                if (isNotStockItemError(stockFetchErr?.message) && hasBooking) {
                    console.warn(`Bypassing stock-out network exception because booking (${hasBooking}) is available:`, stockFetchErr);
                    stockOutBypassed = true;
                } else {
                    throw stockFetchErr;
                }
            }

            // 3. Mark Task as Completed in ERPNext (forcefully submit if stock-out was bypassed)
            const today = new Date().toISOString().slice(0, 10);
            let updatedTaskDoc = null;
            try {
                const updateRes = await fetch(`${erpnextConfig.url}/api/resource/Task/${taskDoc.name}`, {
                    method: "PUT",
                    credentials: "include",
                    headers: safeHeaders(),
                    body: JSON.stringify({
                        status: "Completed",
                        completed_on: today,
                        progress: 100,
                        docstatus: 1,
                        custom_items_used_for_maintenance: itemRows.map((r) => ({
                            item_code: r.item_code,
                            item_name: r.item_name,
                            qty: r.qty
                        }))
                    }),
                });
                if (updateRes.ok) {
                    const updateJson = await updateRes.json();
                    updatedTaskDoc = updateJson?.data;
                } else {
                    // Fallback minimal update if custom fields caused PUT rejection
                    const fallbackRes = await fetch(`${erpnextConfig.url}/api/resource/Task/${taskDoc.name}`, {
                        method: "PUT",
                        credentials: "include",
                        headers: safeHeaders(),
                        body: JSON.stringify({
                            status: "Completed",
                            completed_on: today,
                            progress: 100,
                        }),
                    });
                    if (fallbackRes.ok) {
                        const fallbackJson = await fallbackRes.json();
                        updatedTaskDoc = fallbackJson?.data;
                    }
                }
            } catch (updateErr) {
                console.warn("Could not update Task status via REST:", updateErr);
            }

            // Fallback RPC via frappe.client.set_value if REST PUT did not complete
            if (!updatedTaskDoc || updatedTaskDoc.status !== "Completed") {
                try {
                    const rpcRes = await fetch(`${erpnextConfig.url}/api/method/frappe.client.set_value`, {
                        method: "POST",
                        credentials: "include",
                        headers: safeHeaders(),
                        body: JSON.stringify({
                            doctype: "Task",
                            name: taskDoc.name,
                            fieldname: {
                                status: "Completed",
                                completed_on: today,
                                progress: 100
                            }
                        })
                    });
                    if (rpcRes.ok) {
                        const rpcJson = await rpcRes.json();
                        if (rpcJson?.message) {
                            updatedTaskDoc = { ...(updatedTaskDoc || taskDoc), ...rpcJson.message, status: "Completed" };
                        }
                    }
                } catch (rpcErr) {
                    console.warn("RPC set_value fallback failed:", rpcErr);
                }
            }

            setIsLockedLocal(true); // Mark the task as locked after successful submission
            const resolvedBooking = bookingId || (await checkBookingAvailable());
            if (stockOutBypassed) {
                showToast?.(
                    `Task forcefully submitted & marked Completed (non-stock item bypassed; booking: ${resolvedBooking || 'Active'}).`,
                    "success"
                );
            } else {
                showToast?.("Task submitted successfully.", "success");
            }

            const finalDoc = updatedTaskDoc || {
                ...taskDoc,
                status: "Completed",
                progress: 100,
                completed_on: today,
                custom_items_used_for_maintenance: itemRows,
            };

            onSaved?.(finalDoc);
            aftersucess?.();
        } catch (err) {
            console.error(err);
            showToast?.(
                err?.message || "Something went wrong.",
                "error"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const [updatingStatus, setUpdatingStatus] = useState(false);
    const isWorking = (taskDoc?.status || "").toLowerCase() === "working" || (taskDoc?.status || "").toLowerCase() === "in progress";

    const handleProceedToNext = async () => {
        if (isLocked) return;

        // 1. If not Working yet: Change status to Working in ERPNext and locally, and SAVE the document
        if (!isWorking) {
            setUpdatingStatus(true);
            try {
                const updated = await handleSaveDocument("Working");
                if (!updated) {
                    return;
                }
            } finally {
                setUpdatingStatus(false);
            }
        } else {
            // 2. Status is already Working: save any pending changes, then trigger Submit confirmation modal
            try {
                await handleSaveDocument("Working");
            } catch (err) {
                console.warn("Pre-submit save warning:", err);
            }
            handleSubmitClick();
        }
    };

    const handleGoToQuotation = (targetQuotationId) => {
        const qId = targetQuotationId || currentQuotationId || taskDoc?.custom_quotation_id;
        if (!qId) return;

        if (typeof frappe !== 'undefined' && typeof frappe.set_route === 'function') {
            frappe.set_route("Form", "Quotation", qId);
            return;
        }

        const baseUrl = (erpnextConfig?.url || '').replace(/\/$/, '');
        const targetUrl = baseUrl ? `${baseUrl}/app/quotation/${encodeURIComponent(qId)}` : `/app/quotation/${encodeURIComponent(qId)}`;
        window.open(targetUrl, '_blank');
    };

    const executeCreateQuotation = async () => {
        setShowQuotationConfirm(false);
        if (!taskDoc?.name || !erpnextConfig?.url) {
            showToast?.("No ERPNext connection or Task ID missing.", "error");
            return;
        }

        setCreatingQuotation(true);
        try {
            let quotationName = null;

            // 1. If frappe object exists in the environment, use frappe.call
            if (typeof frappe !== 'undefined' && typeof frappe.call === 'function') {
                await new Promise((resolve) => {
                    frappe.call({
                        method: "create_maintenance_quotation",
                        args: { task_name: taskDoc.name },
                        freeze: true,
                        freeze_message: "Creating Quotation...",
                        callback: function (r) {
                            if (r?.message) {
                                const result = r.message;
                                if (result.status === "created" || result.status === "exists") {
                                    quotationName = result.quotation;
                                }
                            }
                            resolve();
                        }
                    });
                });
            }

            // 2. Try REST API endpoint /api/method/create_maintenance_quotation
            if (!quotationName) {
                try {
                    const apiRes = await fetch(`${erpnextConfig.url}/api/method/create_maintenance_quotation`, {
                        method: "POST",
                        credentials: "include",
                        headers: safeHeaders({ "Content-Type": "application/json" }),
                        body: JSON.stringify({ task_name: taskDoc.name })
                    });

                    if (apiRes.ok) {
                        const apiJson = await apiRes.json();
                        const msg = apiJson?.message || apiJson;
                        if (msg && (msg.status === "created" || msg.status === "exists")) {
                            quotationName = msg.quotation;
                        }
                    } else if (apiRes.status !== 404) {
                        const errJson = await apiRes.json().catch(() => ({}));
                        const rawMsg = errJson?.exception || errJson?.message || errJson?._server_messages;
                        if (rawMsg) {
                            let cleanMsg = typeof rawMsg === 'string' ? rawMsg : JSON.stringify(rawMsg);
                            try {
                                const parsed = JSON.parse(cleanMsg);
                                if (Array.isArray(parsed) && parsed[0]) {
                                    const inner = JSON.parse(parsed[0]);
                                    if (inner?.message) cleanMsg = inner.message;
                                }
                            } catch {}
                            showToast?.(cleanMsg.replace(/<[^>]*>/g, ''), "error");
                            return;
                        }
                    }
                } catch (err) {
                    console.warn("create_maintenance_quotation API call failed:", err);
                }
            }

            // 3. Try /api/method/pms.utils.create_maintenance_quotation
            if (!quotationName) {
                try {
                    const pmsRes = await fetch(`${erpnextConfig.url}/api/method/pms.utils.create_maintenance_quotation`, {
                        method: "POST",
                        credentials: "include",
                        headers: safeHeaders({ "Content-Type": "application/json" }),
                        body: JSON.stringify({ task_name: taskDoc.name })
                    });
                    if (pmsRes.ok) {
                        const pmsJson = await pmsRes.json();
                        const msg = pmsJson?.message || pmsJson;
                        if (msg && (msg.status === "created" || msg.status === "exists")) {
                            quotationName = msg.quotation;
                        }
                    }
                } catch (err) {
                    console.warn("pms.utils.create_maintenance_quotation API call failed:", err);
                }
            }

            // 4. Fallback: REST creation matching exact Python specification
            if (!quotationName) {
                let existingQ = null;
                try {
                    const checkFilters = JSON.stringify([["custom_task_reference", "=", taskDoc.name], ["docstatus", "!=", 2]]);
                    const checkRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation?filters=${encodeURIComponent(checkFilters)}&fields=["name"]&limit=1`, {
                        credentials: "include",
                        headers: safeHeaders()
                    });
                    if (checkRes.ok) {
                        const checkJson = await checkRes.json();
                        if (checkJson?.data?.[0]?.name) {
                            existingQ = checkJson.data[0].name;
                        }
                    }
                } catch (e) {}

                if (existingQ) {
                    quotationName = existingQ;
                } else {
                    const validTill = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
                    const qItems = (itemRows.length > 0 ? itemRows : (taskDoc?.custom_items_used_for_maintenance || [])).map(r => ({
                        item_code: r.item_code || r.item || r.name,
                        qty: Number(r.qty) || 1,
                        rate: Number(r.custom_price || r.rate || r.price) || 0
                    }));

                    const qPayload = {
                        doctype: "Quotation",
                        quotation_to: "Customer",
                        party_name: taskDoc?.customer || taskDoc?.custom_customer || taskDoc?.custom_customer_name || taskDoc?.customer_name || "",
                        company: taskDoc?.company || "CARPENTERS PROPERTIES PTE LIMITED",
                        custom_service_quotation: 1,
                        valid_till: validTill,
                        custom_task_reference: taskDoc.name,
                        ...(taskDoc?.custom_booking_id ? { booking_id: taskDoc.custom_booking_id } : {}),
                        items: qItems
                    };

                    const createQRes = await fetch(`${erpnextConfig.url}/api/resource/Quotation`, {
                        method: "POST",
                        credentials: "include",
                        headers: safeHeaders({ "Content-Type": "application/json" }),
                        body: JSON.stringify(qPayload)
                    });

                    if (createQRes.ok) {
                        const createQJson = await createQRes.json();
                        quotationName = createQJson?.data?.name || createQJson?.name;
                    } else {
                        const errTxt = await createQRes.text();
                        console.warn("Quotation REST creation warning:", errTxt);
                        showToast?.("Failed to create Quotation. Please check items and customer.", "error");
                        return;
                    }
                }

                if (quotationName) {
                    try {
                        await fetch(`${erpnextConfig.url}/api/resource/Task/${encodeURIComponent(taskDoc.name)}`, {
                            method: "PUT",
                            credentials: "include",
                            headers: safeHeaders({ "Content-Type": "application/json" }),
                            body: JSON.stringify({ custom_quotation_id: quotationName })
                        });
                    } catch (putErr) {
                        console.warn("Could not save custom_quotation_id to Task:", putErr);
                    }
                }
            }

            if (quotationName) {
                setCurrentQuotationId(quotationName);
                const updatedTask = {
                    ...taskDoc,
                    custom_quotation_id: quotationName
                };
                onSaved?.(updatedTask);

                showToast?.(`Quotation ${quotationName} is ready.`, "success");

                if (typeof frappe !== 'undefined' && typeof frappe.show_alert === 'function') {
                    frappe.show_alert({
                        message: `Quotation ${quotationName} is ready.`,
                        indicator: "green"
                    });
                }

                handleGoToQuotation(quotationName);
            }
        } catch (err) {
            console.error("Create Quotation error:", err);
            showToast?.(err?.message || "Failed to create Quotation.", "error");
        } finally {
            setCreatingQuotation(false);
        }
    };

    if (!taskDoc) return <div style={emptyMsgStyle}>Loading task…</div>;

    const reassignDisabled = isLocked || savingAssign || (effectiveAssignType === "employee" ? selectedEmpIds.length === 0 : selectedVendorIds.length === 0);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* ── SERVICES USED FOR MAINTENANCE SECTION ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={sectionLabelStyle}>Services Used for Maintenance</div>

                {/* Items table */}
                {itemRows.length === 0 ? (
                    <div style={emptyMsgStyle}>No services added yet.</div>
                ) : (
                    <div style={tableWrapStyle}>
                        <table style={tableStyle}>
                            <thead><tr style={{ background: "var(--bg-tertiary)" }}>
                                <th style={thStyle}>Item Code</th>
                                <th style={thStyle}>Item Name</th>
                                <th style={thStyle}>Qty</th>
                                <th style={thStyle}>Price</th>
                                {!isLocked && <th style={thStyle}></th>}
                            </tr></thead>
                            <tbody>
                                {itemRows.map((r, i) => (
                                    <tr key={r?.name || r?.item_code || i} style={trStyle(i, itemRows.length)}>
                                        <td style={{ ...tdStyle, color: "var(--brand-color)", fontWeight: 600 }}>{r?.item_code}</td>
                                        <td style={tdStyle}>{r?.item_name || "—"}</td>
                                        <td style={tdStyle}>
                                            {isLocked ? r?.qty : (
                                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                    <button type="button" onClick={() => changeRowQty(i, -1)} style={stepperBtnStyle}><Minus size={11} /></button>
                                                    <span style={{ minWidth: 18, textAlign: "center" }}>{r?.qty}</span>
                                                    <button type="button" onClick={() => changeRowQty(i, 1)} style={stepperBtnStyle}><Plus size={11} /></button>
                                                </div>
                                            )}
                                        </td>
                                        <td style={tdStyle}>
                                            {isLocked ? (
                                                <span>{r?.custom_price !== undefined && r?.custom_price !== null && r?.custom_price !== "" ? `$${Number(r.custom_price).toLocaleString()}` : "—"}</span>
                                            ) : (
                                                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                                    <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>$</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="any"
                                                        value={r?.custom_price !== undefined && r?.custom_price !== null ? r.custom_price : ""}
                                                        onChange={(e) => changeRowPrice(i, e.target.value)}
                                                        placeholder="0.00"
                                                        style={{
                                                            width: 72,
                                                            padding: "3px 6px",
                                                            fontSize: 12,
                                                            borderRadius: 4,
                                                            border: "1px solid var(--border-color)",
                                                            background: "var(--bg-primary)",
                                                            color: "var(--text-primary)"
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </td>
                                        {!isLocked && (
                                            <td style={tdStyle}>
                                                <button type="button" onClick={() => removeRow(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                                                    <Trash2 size={13} />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Add Item row — hidden when locked */}
                {!isLocked && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={sectionLabelStyle}>Add Services</div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <ItemSearchDropdown
                                erpnextConfig={erpnextConfig}
                                selectedLabel={pendingItem ? `${pendingItem.item_code}${pendingItem.item_name && pendingItem.item_name !== pendingItem.item_code ? ` — ${pendingItem.item_name}` : ""}` : null}
                                onSelect={(item) => {
                                    setPendingItem(item);
                                    const priceVal = item?.custom_price !== undefined && item?.custom_price !== null
                                        ? item.custom_price
                                        : (item?.standard_rate !== undefined && item?.standard_rate !== null
                                            ? item.standard_rate
                                            : (item?.rate !== undefined && item?.rate !== null ? item.rate : ""));
                                    if (priceVal !== "") setPendingPrice(priceVal);
                                }}
                            />
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <button type="button" onClick={() => setPendingQty((q) => Math.max(1, q - 1))} style={stepperBtnStyle}><Minus size={12} /></button>
                                <span style={{ minWidth: 22, textAlign: "center", fontSize: 12 }}>{pendingQty}</span>
                                <button type="button" onClick={() => setPendingQty((q) => q + 1)} style={stepperBtnStyle}><Plus size={12} /></button>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>$</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    placeholder="Price"
                                    value={pendingPrice}
                                    onChange={(e) => setPendingPrice(e.target.value)}
                                    style={{
                                        width: 65,
                                        padding: "6px 8px",
                                        fontSize: 12,
                                        borderRadius: 6,
                                        border: "1px solid var(--border-color)",
                                        background: "var(--bg-primary)",
                                        color: "var(--text-primary)"
                                    }}
                                />
                            </div>
                            <button type="button" onClick={addItemToList} disabled={!pendingItem}
                                style={{ padding: "0 14px", height: 32, borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: pendingItem ? "pointer" : "not-allowed", background: pendingItem ? "var(--brand-color, #2563eb)" : "var(--bg-tertiary)", color: pendingItem ? "#fff" : "var(--text-muted)", whiteSpace: "nowrap" }}
                            >Add</button>
                        </div>
                    </div>
                )}

                {/* Update Items btn — right under the table, hidden when locked. */}
                {!isLocked && (
                    <button type="button" onClick={handleUpdateItems} disabled={savingItems}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 0", borderRadius: 7, border: "none", cursor: savingItems ? "not-allowed" : "pointer", width: "100%", fontSize: 12, fontWeight: 700, background: savingItems ? "var(--bg-tertiary)" : "var(--brand-color, #2563eb)", color: savingItems ? "var(--text-secondary)" : "#fff" }}
                    >
                        {savingItems ? <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Updating…</> : <><Save size={13} /> Update Services</>}
                    </button>
                )}
            </div>

            {/* ── ASSIGN SECTION ── */}
            {effectiveAssignType === "employee" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={sectionLabelStyle}>Current Employees</div>
                    {empRows.length === 0 ? <div style={emptyMsgStyle}>No employees assigned yet.</div> : (
                        <div style={tableWrapStyle}>
                            <table style={tableStyle}>
                                <thead><tr style={{ background: "var(--bg-tertiary)" }}>
                                    <th style={thStyle}>Emp ID</th><th style={thStyle}>Name</th><th style={thStyle}>Designation</th><th style={thStyle}>Contact</th>
                                </tr></thead>
                                <tbody>{empRows.map((r, i) => {
                                    const empId = r?.emp_id || r?.employee || r?.id || r?.name;
                                    const m = employeeDir.find((e) => e?.id === empId || e?.name === (r?.emp_name || r?.employee_name) || (r?.owner && e?.email === r?.owner));
                                    const empName = r?.emp_name || r?.employee_name || m?.name || r?.owner || "—";
                                    const designation = r?.designation || r?.department || m?.certs || m?.designation || "—";
                                    const contact = r?.contact_number || r?.cell_number || r?.phone || m?.phone || "—";
                                    return (
                                        <tr key={r?.name || empId || i} style={trStyle(i, empRows.length)}>
                                            <td style={tdStyle}><span style={{ color: "var(--brand-color)", fontWeight: 600 }}>{empId || "—"}</span></td>
                                            <td style={tdStyle}>{empName}</td>
                                            <td style={{ ...tdStyle, color: "var(--text-secondary)" }}>{designation}</td>
                                            <td style={{ ...tdStyle, color: "var(--text-secondary)" }}>{contact}</td>
                                        </tr>
                                    );
                                })}</tbody>
                            </table>
                        </div>
                    )}

                    {!isLocked && (<>
                        <div style={sectionLabelStyle}>Reassign Employees</div>
                        <AssignSearchDropdown
                            items={employeeDir} selected={selectedEmpIds} onToggle={toggleEmp}
                            placeholder="Search & select employees…"
                            renderOption={(emp) => (
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{emp.name}</span>
                                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{emp.id}{emp.certs ? ` · ${emp.certs}` : ""}{emp.skill ? ` · ${emp.skill}` : ""}</span>
                                </div>
                            )}
                        />
                        {selectedEmpIds.length > 0 && <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{selectedEmpIds.length} employee{selectedEmpIds.length > 1 ? "s" : ""} selected</div>}
                    </>)}
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={sectionLabelStyle}>Current Vendors</div>
                    {vendorRows.length === 0 ? <div style={emptyMsgStyle}>No vendors assigned yet.</div> : (
                        <>
                            <div style={tableWrapStyle}>
                                <table style={tableStyle}>
                                    <thead><tr style={{ background: "var(--bg-tertiary)" }}>
                                        <th style={thStyle}>Supplier Name</th>
                                        <th style={thStyle}>Contact Person</th>
                                        <th style={thStyle}>Email</th>
                                        <th style={thStyle}>Phone</th>
                                    </tr></thead>
                                    <tbody>{vendorRows.map((r, i) => {
                                        const vKey = r?.vendor_name || r?.vendor || r?.supplier || r?.name;
                                        const m = allVendorsList.find((v) => v?.id === vKey || v?.name === vKey);
                                        const details = assignedVendorDetails[vKey] || {};
                                        const primaryContact = details.contacts?.[0] || {};
                                        
                                        const contactPersonName = [primaryContact.first_name, primaryContact.last_name].filter(Boolean).join(' ') 
                                            || details.contactPerson 
                                            || m?.custom_contact_person 
                                            || "—";
                                        const contactEmail = primaryContact.email_id 
                                            || details.email_id 
                                            || details.email 
                                            || m?.email_id 
                                            || "—";
                                        const contactPhone = primaryContact.phone 
                                            || details.phone 
                                            || m?.phone_no 
                                            || "—";

                                        return (
                                            <tr key={r?.name || i} style={trStyle(i, vendorRows.length)}>
                                                <td style={tdStyle}><span style={{ color: "var(--brand-color)", fontWeight: 600 }}>{details.name || m?.name || vKey || "—"}</span></td>
                                                <td style={tdStyle}>{contactPersonName}</td>
                                                <td style={tdStyle}>{contactEmail}</td>
                                                <td style={tdStyle}>{contactPhone}</td>
                                            </tr>
                                        );
                                    })}</tbody>
                                </table>
                            </div>

                            {/* Services Provided & Linked Contacts Details for each Vendor */}
                            {vendorRows.map((r, i) => {
                                const vKey = r?.vendor_name || r?.vendor || r?.supplier || r?.name;
                                const m = allVendorsList.find((v) => v?.id === vKey || v?.name === vKey);
                                const details = assignedVendorDetails[vKey] || {};

                                const rawServices = details.custom_services_list || details.service_name || m?.custom_services_list || m?.service_name || [];
                                const linkedContacts = details.contacts || [];

                                return (
                                    <div key={vKey || i} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14, borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-color)' }}>
                                            {details.name || m?.name || vKey} Details
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                            {/* Services Provided */}
                                            <div style={{ background: 'var(--bg-primary)', padding: 14, borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border-color)', paddingBottom: 8, marginBottom: 4 }}>
                                                    <Briefcase size={14} style={{ color: '#10b981' }} />
                                                    <span style={{ fontSize: 9, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Services Provided</span>
                                                </div>
                                                {rawServices.length === 0 ? (
                                                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>No services declared.</span>
                                                ) : (
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
                                                )}
                                            </div>

                                            {/* Linked Contacts */}
                                            <div style={{ background: 'var(--bg-primary)', padding: 14, borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border-color)', paddingBottom: 8, marginBottom: 4 }}>
                                                    <Clock size={14} style={{ color: '#10b981' }} />
                                                    <span style={{ fontSize: 9, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Linked Contacts</span>
                                                </div>
                                                {linkedContacts.length === 0 ? (
                                                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>No linked contacts.</span>
                                                ) : (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                        {linkedContacts.map((c, idx) => (
                                                            <div key={idx} style={{ background: 'var(--bg-tertiary)', padding: 10, borderRadius: 6, border: '1px solid var(--border-color)', fontSize: 11, color: 'var(--text-primary)' }}>
                                                                <div style={{ fontWeight: 600, marginBottom: 2 }}>{[c.first_name, c.last_name].filter(Boolean).join(' ') || 'Contact'}</div>
                                                                {c.email_id && <div style={{ color: 'var(--text-secondary)' }}>Email: {c.email_id}</div>}
                                                                {c.phone && <div style={{ color: 'var(--text-secondary)' }}>Phone: {c.phone}</div>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}

                    {!isLocked && (<>
                        <div style={sectionLabelStyle}>Reassign Vendors</div>
                        <AssignSearchDropdown
                            items={vendorsWithServices}
                            selected={selectedVendorIds}
                            onToggle={toggleVendor}
                            placeholder={vendorPlaceholder}
                            renderOption={(v) => (
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{v.name}</span>
                                    {v.type && <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{v.type}{v.group && v.group !== v.type ? ` · ${v.group}` : ''}</span>}
                                    {v.services_list && v.services_list.length > 0 && (
                                        <span style={{ fontSize: 9, color: "#d97706", fontWeight: 600, marginTop: 2 }}>
                                            Services: {v.services_list.map(sl => `${sl.service_group} (${sl.services})`).join(', ')}
                                        </span>
                                    )}
                                </div>
                            )}
                        />
                        {selectedVendorIds.length > 0 && <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{selectedVendorIds.length} vendor{selectedVendorIds.length > 1 ? "s" : ""} selected</div>}
                    </>)}
                </div>
            )}

            {/* Reassign btn — hidden when locked (docstatus 1 OR status Completed) */}
            {!isLocked && (
                <button type="button" onClick={handleReassign} disabled={reassignDisabled}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 0", borderRadius: 7, border: "none", cursor: reassignDisabled ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 700, background: savingAssign ? "var(--bg-tertiary)" : "var(--brand-color, #2563eb)", color: savingAssign ? "var(--text-secondary)" : "#fff", opacity: reassignDisabled ? 0.45 : 1 }}
                >
                    {savingAssign ? <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : <><Save size={13} /> Reassign {effectiveAssignType === "employee" ? "Employees" : "Vendors"}</>}
                </button>
            )}

            {/* Bottom Actions: Save Document & Proced to Next */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                {isLocked ? (
                    <>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 14px", background: "rgba(16,185,129,0.08)", borderRadius: 7, border: "1px solid rgba(16,185,129,0.25)", color: "#10b981", fontSize: 12, fontWeight: 600 }}>
                            <CheckCircle2 size={15} />
                            <span>Task Submitted & Locked</span>
                        </div>

                        {currentQuotationId ? (
                            <button
                                type="button"
                                onClick={() => handleGoToQuotation()}
                                style={{
                                    ...primaryActionBtnStyle,
                                    width: "100%",
                                    padding: "10px 0",
                                    gap: 8,
                                    background: "#0a6c66"
                                }}
                            >
                                <FileText size={14} />
                                <span>Go To Quotation</span>
                                <ExternalLink size={14} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowQuotationConfirm(true)}
                                disabled={creatingQuotation}
                                style={{
                                    ...primaryActionBtnStyle,
                                    width: "100%",
                                    padding: "10px 0",
                                    gap: 8,
                                    background: "#0a6c66"
                                }}
                            >
                                {creatingQuotation ? (
                                    <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Creating Quotation…</>
                                ) : (
                                    <>
                                        <Plus size={14} />
                                        <span>Create Quotation</span>
                                    </>
                                )}
                            </button>
                        )}
                    </>
                ) : (
                    <div style={{ display: "flex", gap: 8, width: "100%" }}>
                        {currentQuotationId ? (
                            <button
                                type="button"
                                onClick={() => handleGoToQuotation()}
                                style={{
                                    ...primaryActionBtnStyle,
                                    flex: 1,
                                    padding: "10px 0",
                                    gap: 6,
                                    background: "#0a6c66",
                                    whiteSpace: "nowrap"
                                }}
                                title={`Quotation: ${currentQuotationId} (Click to open)`}
                            >
                                <FileText size={14} />
                                <span>Go To Quotation</span>
                                <ExternalLink size={13} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowQuotationConfirm(true)}
                                disabled={creatingQuotation || savingDocument || updatingStatus || submitting}
                                style={{
                                    ...primaryActionBtnStyle,
                                    flex: 1,
                                    padding: "10px 0",
                                    gap: 6,
                                    background: "#0a6c66",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {creatingQuotation ? (
                                    <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Creating…</>
                                ) : (
                                    <>
                                        <Plus size={14} />
                                        <span>Create Quotation</span>
                                    </>
                                )}
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleProceedToNext}
                            disabled={savingDocument || updatingStatus || submitting || creatingQuotation}
                            style={{
                                ...primaryActionBtnStyle,
                                flex: 1,
                                padding: "10px 0",
                                gap: 6,
                                background: isWorking ? "#10b981" : "var(--brand-color, #2563eb)",
                                whiteSpace: "nowrap"
                            }}
                        >
                            {updatingStatus ? (
                                <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Updating…</>
                            ) : submitting ? (
                                <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Submitting…</>
                            ) : (
                                <>
                                    <span>Proced to Next</span>
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

            {
                showConfirm && (
                    <div style={modalOverlayStyle} onClick={() => setShowConfirm(false)}>
                        <div onClick={(e) => e.stopPropagation()} style={modalBoxStyle}>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>Confirm Submission</div>
                            <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginBottom: 18 }}>This task is completed?</div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button type="button" onClick={() => setShowConfirm(false)} style={modalCancelBtnStyle}>Cancel</button>
                                <button type="button" onClick={handleConfirmSubmit} style={modalConfirmBtnStyle}>Yes, Submit</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                showQuotationConfirm && (
                    <div style={modalOverlayStyle} onClick={() => setShowQuotationConfirm(false)}>
                        <div onClick={(e) => e.stopPropagation()} style={modalBoxStyle}>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>Create Quotation</div>
                            <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginBottom: 18 }}>
                                Create a service Quotation for Task {taskDoc?.name}?
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button type="button" onClick={() => setShowQuotationConfirm(false)} style={modalCancelBtnStyle}>Cancel</button>
                                <button type="button" onClick={executeCreateQuotation} style={{ ...modalConfirmBtnStyle, background: "#0a6c66" }}>Yes, Create</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

// ---------- shared styles ----------
const sectionLabelStyle = { fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 2 };
const emptyMsgStyle = { fontSize: 11, color: "var(--text-muted)", padding: "8px 10px", background: "var(--bg-tertiary)", borderRadius: 6 };
const tableWrapStyle = { border: "1px solid var(--border-color)", borderRadius: 6, overflow: "hidden" };
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: 11 };
const thStyle = { padding: "6px 10px", textAlign: "left", fontWeight: 600, color: "var(--text-secondary)", borderBottom: "1px solid var(--border-color)" };
const tdStyle = { padding: "7px 10px" };
const trStyle = (i, len) => ({ borderBottom: i < len - 1 ? "1px solid var(--border-color)" : "none", background: i % 2 === 0 ? "transparent" : "var(--bg-tertiary)" });
const stepperBtnStyle = { width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", cursor: "pointer", color: "var(--text-primary)" };
const primaryActionBtnStyle = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 0", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: "var(--brand-color, #2563eb)", color: "#fff" };
const secondaryActionBtnStyle = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 0", borderRadius: 7, border: "1px solid var(--border-color)", cursor: "pointer", fontSize: 12, fontWeight: 700, background: "var(--bg-tertiary)", color: "var(--text-primary)" };
const modalOverlayStyle = { position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" };
const modalBoxStyle = { background: "var(--bg-primary)", borderRadius: 10, padding: 20, width: 320, boxShadow: "0 10px 40px rgba(0,0,0,0.25)" };
const modalCancelBtnStyle = { flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)", fontSize: 12, fontWeight: 600, cursor: "pointer" };
const modalConfirmBtnStyle = { flex: 1, padding: "8px 0", borderRadius: 6, border: "none", background: "var(--brand-color, #2563eb)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", };

export default TaskAssignPanel;