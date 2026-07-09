// // // // import React, { useState, useEffect, useRef } from 'react';
// // // // import { RotateCw, Maximize2, Layers, HelpCircle, Merge, Trash2, Plus, Sparkles, Building } from 'lucide-react';
// // // // import { ERPNEXT_CONFIG } from '../config';
// // // // import houseImg from '../../house.png';

// // // // // Modern Architectural Building Units Data (Resembling the attached image)
// // // // const INITIAL_UNITS = [
// // // //   { id: 'GF-L', floor: 0, name: 'Ground Floor Glass Retail', x: 0, y: 0, width: 3.4, height: 3.5, rent: 8500, area: 1800, status: 'occupied', tenant: 'Alpha Glass Cafe', category: 'Retail', expiry: '2028-12-31' },
// // // //   { id: 'GF-R', floor: 0, name: 'Ground Floor Wood Lounge', x: 3.8, y: 0, width: 3.2, height: 3.5, rent: 6200, area: 1400, status: 'vacant', tenant: null, category: 'Lounge', expiry: null },
// // // //   { id: 'L1-L', floor: 1, name: 'Upper Glass Balcony Suite', x: 0, y: 0, width: 3.4, height: 3.5, rent: 9500, area: 1800, status: 'occupied', tenant: 'Aura Design Group', category: 'Premium Office', expiry: '2027-06-30' },
// // // //   { id: 'L1-R', floor: 1, name: 'Upper Mezzanine Loft', x: 3.8, y: 0, width: 3.2, height: 3.5, rent: 7800, area: 1400, status: 'maintenance', tenant: null, category: 'Loft Suite', expiry: '2026-09-01' }
// // // // ];

// // // // export default function Mall3DView({ compact = false, properties = [] }) {
// // // //   const [selectedPropertyId, setSelectedPropertyId] = useState('PROP-9910');
// // // //   const [units, setUnits] = useState(INITIAL_UNITS);
// // // //   const [activeFloor, setActiveFloor] = useState(0); // 0 = Ground, 1 = First
// // // //   const [showAllFloors, setShowAllFloors] = useState(true); // Stacked 3D View vs Single Floor Focus
// // // //   const [selectedUnitIds, setSelectedUnitIds] = useState([]);
// // // //   const [hoveredUnit, setHoveredUnit] = useState(null);

// // // //   // Dynamic layout generation effect for other properties from ERPNext API
// // // //   useEffect(() => {
// // // //     async function fetchUnits() {
// // // //       if (selectedPropertyId === 'PROP-9910') {
// // // //         setUnits(INITIAL_UNITS);
// // // //         return;
// // // //       }

// // // //       try {
// // // //         const res = await fetch(`${ERPNEXT_CONFIG.url}/api/method/erpnext.api.get_units?property_group=${selectedPropertyId}`, {
// // // //           credentials: 'include',
// // // //           headers: {
// // // //             'Content-Type': 'application/json'
// // // //           }
// // // //         });
// // // //         if (res.ok) {
// // // //           const data = await res.json();
// // // //           const list = data.message || data;
// // // //           if (Array.isArray(list) && list.length > 0) {
// // // //             setUnits(list.map((u, idx) => ({
// // // //               id: u.name || u.id || `UNIT-${idx}`,
// // // //               floor: u.floor || (idx % 2),
// // // //               name: u.unit_name || u.name || `Unit ${idx}`,
// // // //               x: u.x !== undefined ? u.x : (idx % 2 === 0 ? 0 : 3.8),
// // // //               y: u.y !== undefined ? u.y : 0,
// // // //               width: u.width || 3.2,
// // // //               height: u.height || 3.5,
// // // //               rent: u.rent || 5000,
// // // //               area: u.area || 1500,
// // // //               status: u.status || (idx % 3 === 0 ? 'vacant' : idx % 3 === 1 ? 'occupied' : 'maintenance'),
// // // //               tenant: u.tenant || null,
// // // //               category: u.category || 'Retail',
// // // //               expiry: u.expiry || null
// // // //             })));
// // // //             return;
// // // //           }
// // // //         }
// // // //       } catch (err) {
// // // //         console.warn('ERPNext API get_units fetch failed, using fallback mock data:', err);
// // // //       }

// // // //       const currentProp = properties.find(p => p.id === selectedPropertyId) || {
// // // //         name: 'Carpenters Asset',
// // // //         unitsCount: 4,
// // // //         type: 'commercial',
// // // //         rent: 8000,
// // // //         area: 3200
// // // //       };

// // // //       const generated = [
// // // //         { id: 'GF-L', floor: 0, name: `${currentProp.name} GF Left`, x: 0, y: 0, width: 3.4, height: 3.5, rent: Math.round(currentProp.rent * 0.3), area: Math.round(currentProp.area * 0.3), status: 'occupied', tenant: 'Premier Tenant', category: 'Commercial', expiry: '2027-12-31' },
// // // //         { id: 'GF-R', floor: 0, name: `${currentProp.name} GF Right`, x: 3.8, y: 0, width: 3.2, height: 3.5, rent: Math.round(currentProp.rent * 0.2), area: Math.round(currentProp.area * 0.2), status: 'vacant', tenant: null, category: 'Commercial', expiry: null },
// // // //         { id: 'L1-L', floor: 1, name: `${currentProp.name} L1 Left`, x: 0, y: 0, width: 3.4, height: 3.5, rent: Math.round(currentProp.rent * 0.3), area: Math.round(currentProp.area * 0.3), status: 'occupied', tenant: 'Nexus Agency', category: 'Office', expiry: '2028-06-30' },
// // // //         { id: 'L1-R', floor: 1, name: `${currentProp.name} L1 Right`, x: 3.8, y: 0, width: 3.2, height: 3.5, rent: Math.round(currentProp.rent * 0.2), area: Math.round(currentProp.area * 0.2), status: 'maintenance', tenant: null, category: 'Office', expiry: '2026-11-30' }
// // // //       ];
// // // //       setUnits(generated);
// // // //     }

// // // //     fetchUnits();
// // // //   }, [selectedPropertyId, properties]);

// // // //   // 3D View Transformations (optimized angles matching the attached photo)
// // // //   const [rotation, setRotation] = useState(32); // angle in degrees
// // // //   const [tilt, setTilt] = useState(0.42); // tilt ratio
// // // //   const [zoom, setZoom] = useState(compact ? 46 : 58); // scale sizing

// // // //   const canvasRef = useRef(null);
// // // //   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

// // // //   // Drag interaction controls
// // // //   const isDragging = useRef(false);
// // // //   const dragStart = useRef({ x: 0, y: 0 });
// // // //   const dragStartRotation = useRef(32);
// // // //   const dragStartTilt = useRef(0.42);
// // // //   const dragMoved = useRef(false);

// // // //   // Aggregation state
// // // //   const [aggregatedSpaces, setAggregatedSpaces] = useState([]);

// // // //   // Sync aggregated statuses
// // // //   useEffect(() => {
// // // //     const updatedUnits = units.map(u => {
// // // //       const isAgg = aggregatedSpaces.some(agg => agg.units.includes(u.id));
// // // //       if (isAgg) {
// // // //         return { ...u, status: 'aggregated' };
// // // //       } else if (u.status === 'aggregated') {
// // // //         return { ...u, status: 'vacant' };
// // // //       }
// // // //       return u;
// // // //     });

// // // //     const hasChanged = JSON.stringify(updatedUnits) !== JSON.stringify(units);
// // // //     if (hasChanged) {
// // // //       setUnits(updatedUnits);
// // // //     }
// // // //   }, [aggregatedSpaces]);

// // // //   // Main Canvas Rendering Loop
// // // //   useEffect(() => {
// // // //     const canvas = canvasRef.current;
// // // //     if (!canvas) return;
// // // //     const ctx = canvas.getContext('2d');

// // // //     const dpr = window.devicePixelRatio || 1;
// // // //     const rect = canvas.getBoundingClientRect();
// // // //     canvas.width = rect.width * dpr;
// // // //     canvas.height = rect.height * dpr;
// // // //     ctx.scale(dpr, dpr);

// // // //     // Dark slate gray background for the 3D space viewport to make glass & lighting POP!
// // // //     ctx.fillStyle = '#0f172a';
// // // //     ctx.fillRect(0, 0, rect.width, rect.height);

// // // //     // Project coordinates
// // // //     const cx = rect.width / 2;
// // // //     const cy = rect.height / 2 + (showAllFloors ? (compact ? 70 : 100) : (compact ? 20 : 35));
// // // //     const angleRad = (rotation * Math.PI) / 180;

// // // //     const project = (gx, gy, floorLevel) => {
// // // //       // Offset center coordinate system
// // // //       const x = (gx - 3.5) * zoom;
// // // //       const y = (gy - 3) * zoom;

// // // //       const floorSpacingHeight = compact ? 130 : 160;
// // // //       let z = 0;

// // // //       if (showAllFloors) {
// // // //         z = floorLevel * floorSpacingHeight;
// // // //       } else {
// // // //         z = activeFloor === floorLevel ? 30 : -9999;
// // // //       }

// // // //       const screenX = cx + (x - y) * Math.cos(angleRad);
// // // //       const screenY = cy + (x + y) * Math.sin(angleRad) * tilt - z;

// // // //       return { x: screenX, y: screenY };
// // // //     };

// // // //     // Draw Concrete Back/Side Walls (Image Backdrop)
// // // //     const drawBackdropWall = () => {
// // // //       ctx.fillStyle = '#1e293b';
// // // //       ctx.strokeStyle = '#334155';
// // // //       ctx.lineWidth = 1;

// // // //       // Ground concrete back wall polygon
// // // //       const w0 = project(0, 3.5, 0);
// // // //       const w1 = project(0, 3.5, 2); // extend to top level
// // // //       const w2 = project(7, 3.5, 2);
// // // //       const w3 = project(7, 3.5, 0);

// // // //       // Draw horizontal mortar lines / texture on back concrete wall
// // // //       ctx.beginPath();
// // // //       ctx.moveTo(w0.x, w0.y);
// // // //       ctx.lineTo(w1.x, w1.y);
// // // //       ctx.lineTo(w2.x, w2.y);
// // // //       ctx.lineTo(w3.x, w3.y);
// // // //       ctx.closePath();
// // // //       ctx.fillStyle = '#1e293b';
// // // //       ctx.fill();
// // // //       ctx.stroke();

// // // //       // Concrete wall shadows & seams
// // // //       ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
// // // //       for (let i = 0.5; i < 2; i += 0.5) {
// // // //         const pS = project(0, 3.5, i);
// // // //         const pE = project(7, 3.5, i);
// // // //         ctx.beginPath();
// // // //         ctx.moveTo(pS.x, pS.y);
// // // //         ctx.lineTo(pE.x, pE.y);
// // // //         ctx.stroke();
// // // //       }
// // // //     };

// // // //     // Draw Stairs (Center Connecting Staircase)
// // // //     const drawStairs = () => {
// // // //       const stairsX = 3.6;
// // // //       const stairsY = 1.8;
// // // //       const steps = 14;

// // // //       ctx.strokeStyle = '#e2e8f0';
// // // //       ctx.lineWidth = 1;

// // // //       for (let i = 0; i < steps; i++) {
// // // //         const t = i / steps;
// // // //         const nextT = (i + 1) / steps;

// // // //         // stair position interpolating from Z=0 to Z=1
// // // //         const sx = stairsX - t * 0.8;
// // // //         const sy = stairsY;
// // // //         const sz = t;

// // // //         const nextSx = stairsX - nextT * 0.8;
// // // //         const nextSz = nextT;

// // // //         const p0 = project(sx, sy, sz);
// // // //         const p1 = project(sx, sy + 0.6, sz);
// // // //         const p2 = project(nextSx, sy + 0.6, nextSz);
// // // //         const p3 = project(nextSx, sy, nextSz);

// // // //         // Draw individual steps
// // // //         ctx.fillStyle = '#f8fafc';
// // // //         ctx.beginPath();
// // // //         ctx.moveTo(p0.x, p0.y);
// // // //         ctx.lineTo(p1.x, p1.y);
// // // //         ctx.lineTo(p2.x, p2.y);
// // // //         ctx.lineTo(p3.x, p3.y);
// // // //         ctx.closePath();
// // // //         ctx.fill();
// // // //         ctx.stroke();
// // // //       }

// // // //       // Draw Staircase handrails
// // // //       ctx.strokeStyle = '#64748b';
// // // //       ctx.lineWidth = 1.5;
// // // //       const rS = project(stairsX, stairsY + 0.6, 0.2);
// // // //       const rE = project(stairsX - 0.8, stairsY + 0.6, 1.2);
// // // //       ctx.beginPath();
// // // //       ctx.moveTo(rS.x, rS.y);
// // // //       ctx.lineTo(rE.x, rE.y);
// // // //       ctx.stroke();
// // // //     };

// // // //     // Draw architectural block (glass facade or warm wood room)
// // // //     const drawIsoBlock = (unit, isHovered, isSelected) => {
// // // //       const { x: gx, y: gy, width: gw, height: gh, floor: f, status, id } = unit;

// // // //       const c0 = project(gx, gy, f);
// // // //       const c1 = project(gx + gw, gy, f);
// // // //       const c2 = project(gx + gw, gy + gh, f);
// // // //       const c3 = project(gx, gy + gh, f);

// // // //       // Floor height
// // // //       const wallH = compact ? 50 : 64;

// // // //       const t0 = { x: c0.x, y: c0.y - wallH };
// // // //       const t1 = { x: c1.x, y: c1.y - wallH };
// // // //       const t2 = { x: c2.x, y: c2.y - wallH };
// // // //       const t3 = { x: c3.x, y: c3.y - wallH };

// // // //       // Styling based on architectural class: Left glass frame vs right warm wood box
// // // //       const isLeft = id.includes('-L');

// // // //       // Glass colors
// // // //       let glassFill = isSelected ? 'rgba(217, 119, 6, 0.4)' : (isHovered ? 'rgba(56, 189, 248, 0.35)' : 'rgba(56, 189, 248, 0.12)');
// // // //       let glassStroke = isSelected ? '#d97706' : (isHovered ? '#38bdf8' : 'rgba(56, 189, 248, 0.4)');

// // // //       // Wood colors
// // // //       let woodFloorFill = '#854d0e';
// // // //       let woodWallLeft = '#713f12';
// // // //       let woodWallRight = '#451a03';

// // // //       if (isSelected) {
// // // //         woodFloorFill = '#b45309';
// // // //         woodWallLeft = '#d97706';
// // // //         woodWallRight = '#b45309';
// // // //       } else if (isHovered) {
// // // //         woodFloorFill = '#a16207';
// // // //       }

// // // //       if (isLeft) {
// // // //         // --- GLASS BOX ARCHITECTURE ---
// // // //         // Floor plate
// // // //         ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
// // // //         ctx.beginPath();
// // // //         ctx.moveTo(c0.x, c0.y);
// // // //         ctx.lineTo(c1.x, c1.y);
// // // //         ctx.lineTo(c2.x, c2.y);
// // // //         ctx.lineTo(c3.x, c3.y);
// // // //         ctx.closePath();
// // // //         ctx.fill();

// // // //         // Left glass panel
// // // //         ctx.fillStyle = glassFill;
// // // //         ctx.beginPath();
// // // //         ctx.moveTo(c0.x, c0.y);
// // // //         ctx.lineTo(c3.x, c3.y);
// // // //         ctx.lineTo(t3.x, t3.y);
// // // //         ctx.lineTo(t0.x, t0.y);
// // // //         ctx.closePath();
// // // //         ctx.fill();
// // // //         ctx.strokeStyle = glassStroke;
// // // //         ctx.lineWidth = 1;
// // // //         ctx.stroke();

// // // //         // Right glass panel
// // // //         ctx.beginPath();
// // // //         ctx.moveTo(c3.x, c3.y);
// // // //         ctx.lineTo(c2.x, c2.y);
// // // //         ctx.lineTo(t2.x, t2.y);
// // // //         ctx.lineTo(t3.x, t3.y);
// // // //         ctx.closePath();
// // // //         ctx.fill();
// // // //         ctx.stroke();

// // // //         // Structural metal frame beams
// // // //         ctx.strokeStyle = '#020617';
// // // //         ctx.lineWidth = 2.5;

// // // //         ctx.beginPath();
// // // //         ctx.moveTo(c0.x, c0.y);
// // // //         ctx.lineTo(t0.x, t0.y);
// // // //         ctx.moveTo(c3.x, c3.y);
// // // //         ctx.lineTo(t3.x, t3.y);
// // // //         ctx.moveTo(c2.x, c2.y);
// // // //         ctx.lineTo(t2.x, t2.y);
// // // //         ctx.stroke();

// // // //         // Top metal border
// // // //         ctx.beginPath();
// // // //         ctx.moveTo(t0.x, t0.y);
// // // //         ctx.lineTo(t1.x, t1.y);
// // // //         ctx.lineTo(t2.x, t2.y);
// // // //         ctx.lineTo(t3.x, t3.y);
// // // //         ctx.closePath();
// // // //         ctx.stroke();

// // // //         // Thin horizontal mullion lines
// // // //         ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
// // // //         ctx.lineWidth = 1;
// // // //         const midYLeft_c = (c0.y + c3.y) / 2;
// // // //         const midYLeft_t = (t0.y + t3.y) / 2;
// // // //         const midXLeft = (c0.x + c3.x) / 2;

// // // //         ctx.beginPath();
// // // //         ctx.moveTo(midXLeft, midYLeft_c);
// // // //         ctx.lineTo(midXLeft, midYLeft_t);
// // // //         ctx.stroke();

// // // //       } else {
// // // //         // --- WOOD LOUNGE & MEZZANINE ARCHITECTURE ---
// // // //         // Floor plate (Warm wood floor texture)
// // // //         ctx.fillStyle = woodFloorFill;
// // // //         ctx.beginPath();
// // // //         ctx.moveTo(c0.x, c0.y);
// // // //         ctx.lineTo(c1.x, c1.y);
// // // //         ctx.lineTo(c2.x, c2.y);
// // // //         ctx.lineTo(c3.x, c3.y);
// // // //         ctx.closePath();
// // // //         ctx.fill();

// // // //         // Left solid wooden wall paneling
// // // //         ctx.fillStyle = woodWallLeft;
// // // //         ctx.beginPath();
// // // //         ctx.moveTo(c0.x, c0.y);
// // // //         ctx.lineTo(c3.x, c3.y);
// // // //         ctx.lineTo(t3.x, t3.y);
// // // //         ctx.lineTo(t0.x, t0.y);
// // // //         ctx.closePath();
// // // //         ctx.fill();
// // // //         ctx.strokeStyle = 'rgba(255,255,255,0.08)';
// // // //         ctx.stroke();

// // // //         // Back solid wooden wall paneling
// // // //         ctx.fillStyle = woodWallRight;
// // // //         ctx.beginPath();
// // // //         ctx.moveTo(c3.x, c3.y);
// // // //         ctx.lineTo(c2.x, c2.y);
// // // //         ctx.lineTo(t2.x, t2.y);
// // // //         ctx.lineTo(t3.x, t3.y);
// // // //         ctx.closePath();
// // // //         ctx.fill();
// // // //         ctx.stroke();

// // // //         // Structural accents: horizontal warm lighting lines on right wood walls (Mezzanine shelves)
// // // //         if (f === 1) {
// // // //           ctx.strokeStyle = '#f59e0b'; // glowing shelf lights
// // // //           ctx.shadowColor = '#f59e0b';
// // // //           ctx.shadowBlur = 4;
// // // //           ctx.lineWidth = 2;

// // // //           for (let s = 1; s <= 3; s++) {
// // // //             const hShift = wallH * (s / 4);
// // // //             const wS = { x: c3.x, y: c3.y - hShift };
// // // //             const wE = { x: c2.x, y: c2.y - hShift };
// // // //             ctx.beginPath();
// // // //             ctx.moveTo(wS.x, wS.y);
// // // //             ctx.lineTo(wE.x, wE.y);
// // // //             ctx.stroke();
// // // //           }
// // // //           // Reset shadow
// // // //           ctx.shadowBlur = 0;
// // // //         }

// // // //         // Draw simple wooden bench mockup on GF-R
// // // //         if (f === 0) {
// // // //           ctx.fillStyle = '#1e1b4b'; // dark wood bench seat
// // // //           const b0 = project(gx + 0.8, gy + 1, f);
// // // //           const b1 = project(gx + 2.4, gy + 1, f);
// // // //           const b2 = project(gx + 2.4, gy + 1.6, f);
// // // //           const b3 = project(gx + 0.8, gy + 1.6, f);

// // // //           ctx.beginPath();
// // // //           ctx.moveTo(b0.x, b0.y - 4);
// // // //           ctx.lineTo(b1.x, b1.y - 4);
// // // //           ctx.lineTo(b2.x, b2.y - 4);
// // // //           ctx.lineTo(b3.x, b3.y - 4);
// // // //           ctx.closePath();
// // // //           ctx.fill();

// // // //           // Bench legs
// // // //           ctx.strokeStyle = '#ffffff';
// // // //           ctx.lineWidth = 1.5;
// // // //           ctx.beginPath();
// // // //           ctx.moveTo(b0.x, b0.y); ctx.lineTo(b0.x, b0.y - 4);
// // // //           ctx.moveTo(b1.x, b1.y); ctx.lineTo(b1.x, b1.y - 4);
// // // //           ctx.moveTo(b2.x, b2.y); ctx.lineTo(b2.x, b2.y - 4);
// // // //           ctx.stroke();
// // // //         }

// // // //         // Frame borders
// // // //         ctx.strokeStyle = '#1e293b';
// // // //         ctx.lineWidth = 1.5;
// // // //         ctx.beginPath();
// // // //         ctx.moveTo(t0.x, t0.y);
// // // //         ctx.lineTo(t1.x, t1.y);
// // // //         ctx.lineTo(t2.x, t2.y);
// // // //         ctx.lineTo(t3.x, t3.y);
// // // //         ctx.closePath();
// // // //         ctx.stroke();
// // // //       }

// // // //       // Draw Glowing status indicators on the floor
// // // //       const statusColors = {
// // // //         vacant: '#10b981',      // Neon Green
// // // //         occupied: '#ef4444',    // Coral Red
// // // //         maintenance: '#f59e0b', // Amber Orange
// // // //         aggregated: '#3b82f6'   // Electric Blue
// // // //       };

// // // //       const glowColor = statusColors[status] || '#10b981';
// // // //       ctx.shadowColor = glowColor;
// // // //       ctx.shadowBlur = 6;
// // // //       ctx.fillStyle = glowColor;
// // // //       ctx.beginPath();

// // // //       // Draw a center indicator dot
// // // //       const dotX = (c0.x + c2.x) / 2;
// // // //       const dotY = (c0.y + c2.y) / 2;
// // // //       ctx.arc(dotX, dotY, 4, 0, 2 * Math.PI);
// // // //       ctx.fill();
// // // //       ctx.shadowBlur = 0; // reset

// // // //       // ID Labels
// // // //       ctx.fillStyle = '#ffffff';
// // // //       ctx.font = '900 10px var(--font-sans)';
// // // //       ctx.textAlign = 'center';
// // // //       ctx.fillText(id, dotX, dotY - 10);
// // // //     };

// // // //     // Draw base platforms
// // // //     drawBackdropWall();

// // // //     // Draw staircase connector in the middle
// // // //     if (showAllFloors) {
// // // //       drawStairs();
// // // //     }

// // // //     // Sort units back-to-front for rendering
// // // //     const sortedUnits = [...units].sort((a, b) => {
// // // //       // Z-order layering
// // // //       if (a.floor !== b.floor) {
// // // //         return a.floor - b.floor;
// // // //       }
// // // //       return (a.x + a.y) - (b.x + b.y);
// // // //     });

// // // //     sortedUnits.forEach(unit => {
// // // //       if (showAllFloors || activeFloor === unit.floor) {
// // // //         const isSelected = selectedUnitIds.includes(unit.id);
// // // //         const isHovered = hoveredUnit && hoveredUnit.id === unit.id;
// // // //         drawIsoBlock(unit, isHovered, isSelected);
// // // //       }
// // // //     });

// // // //   }, [units, activeFloor, showAllFloors, rotation, tilt, zoom, mousePos, selectedUnitIds, hoveredUnit, compact]);

// // // //   // Ray-casting collision hit-test
// // // //   function pointInPolygon(point, polygon) {
// // // //     const { x, y } = point;
// // // //     let inside = false;
// // // //     for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
// // // //       const xi = polygon[i].x, yi = polygon[i].y;
// // // //       const xj = polygon[j].x, yj = polygon[j].y;
// // // //       const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
// // // //       if (intersect) inside = !inside;
// // // //     }
// // // //     return inside;
// // // //   }

// // // //   const handleCanvasClick = () => {
// // // //     if (dragMoved.current) return;
// // // //     if (hoveredUnit) {
// // // //       if (hoveredUnit.status !== 'vacant' && !selectedUnitIds.includes(hoveredUnit.id)) {
// // // //         return;
// // // //       }
// // // //       if (selectedUnitIds.includes(hoveredUnit.id)) {
// // // //         setSelectedUnitIds(selectedUnitIds.filter(id => id !== hoveredUnit.id));
// // // //       } else {
// // // //         setSelectedUnitIds([...selectedUnitIds, hoveredUnit.id]);
// // // //       }
// // // //     } else {
// // // //       setSelectedUnitIds([]);
// // // //     }
// // // //   };

// // // //   const handleMouseDown = (e) => {
// // // //     isDragging.current = true;
// // // //     dragStart.current = { x: e.clientX, y: e.clientY };
// // // //     dragStartRotation.current = rotation;
// // // //     dragStartTilt.current = tilt;
// // // //     dragMoved.current = false;
// // // //   };

// // // //   const handleMouseUp = () => {
// // // //     isDragging.current = false;
// // // //   };

// // // //   const handleMouseLeave = () => {
// // // //     isDragging.current = false;
// // // //     setHoveredUnit(null);
// // // //   };

// // // //   const handleMouseMove = (e) => {
// // // //     const canvas = canvasRef.current;
// // // //     if (!canvas) return;
// // // //     const rect = canvas.getBoundingClientRect();
// // // //     const x = e.clientX - rect.left;
// // // //     const y = e.clientY - rect.top;
// // // //     setMousePos({ x, y });

// // // //     if (isDragging.current) {
// // // //       const dx = e.clientX - dragStart.current.x;
// // // //       const dy = e.clientY - dragStart.current.y;
// // // //       if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
// // // //         dragMoved.current = true;
// // // //       }

// // // //       // const newRotation = Math.max(0, Math.min(90, dragStartRotation.current + dx * 0.45));
// // // //       // const newTilt = Math.max(0.2, Math.min(0.7, dragStartTilt.current - dy * 0.005));

// // // //       // Full 360° horizontal orbit (wrap instead of clamp)
// // // //       let newRotation = (dragStartRotation.current + dx * 0.45) % 360;
// // // //       if (newRotation < 0) newRotation += 360;

// // // //       // Wider vertical range — lets you look from above or near-below
// // // //       const newTilt = Math.max(-0.9, Math.min(0.9, dragStartTilt.current - dy * 0.005));

// // // //       setRotation(newRotation);
// // // //       setTilt(newTilt);
// // // //       // setRotation(newRotation);
// // // //       // setTilt(newTilt);
// // // //       setHoveredUnit(null);
// // // //     } else {
// // // //       const cx = rect.width / 2;
// // // //       const cy = rect.height / 2 + (showAllFloors ? (compact ? 70 : 100) : (compact ? 20 : 35));
// // // //       const angleRad = (rotation * Math.PI) / 180;

// // // //       const localProject = (gx, gy, floorLevel) => {
// // // //         const px = (gx - 3.5) * zoom;
// // // //         const py = (gy - 3) * zoom;
// // // //         const floorSpacingHeight = compact ? 130 : 160;
// // // //         let pz = 0;
// // // //         if (showAllFloors) {
// // // //           pz = floorLevel * floorSpacingHeight;
// // // //         } else {
// // // //           pz = activeFloor === floorLevel ? 30 : -9999;
// // // //         }
// // // //         const screenX = cx + (px - py) * Math.cos(angleRad);
// // // //         const screenY = cy + (px + py) * Math.sin(angleRad) * tilt - pz;
// // // //         return { x: screenX, y: screenY };
// // // //       };

// // // //       let foundUnit = null;
// // // //       // Search top/front units first
// // // //       const sortedUnits = [...units].sort((a, b) => {
// // // //         if (a.floor !== b.floor) return b.floor - a.floor;
// // // //         return (b.x + b.y) - (a.x - a.y);
// // // //       });

// // // //       for (const unit of sortedUnits) {
// // // //         if (!showAllFloors && activeFloor !== unit.floor) continue;

// // // //         const { x: gx, y: gy, width: gw, height: gh, floor: f } = unit;
// // // //         const c0 = localProject(gx, gy, f);
// // // //         const c1 = localProject(gx + gw, gy, f);
// // // //         const c2 = localProject(gx + gw, gy + gh, f);
// // // //         const c3 = localProject(gx, gy + gh, f);

// // // //         const wallH = compact ? 50 : 64;
// // // //         const t0 = { x: c0.x, y: c0.y - wallH };
// // // //         const t1 = { x: c1.x, y: c1.y - wallH };
// // // //         const t2 = { x: c2.x, y: c2.y - wallH };
// // // //         const t3 = { x: c3.x, y: c3.y - wallH };

// // // //         // Raycast bounding box
// // // //         if (pointInPolygon({ x, y }, [t0, t1, t2, t3])) {
// // // //           foundUnit = unit;
// // // //           break;
// // // //         }
// // // //       }
// // // //       setHoveredUnit(foundUnit);
// // // //     }
// // // //   };

// // // //   const handleCreateAggregation = (e) => {
// // // //     e.preventDefault();
// // // //     if (selectedUnitIds.length < 2) return;

// // // //     const selectedUnits = units.filter(u => selectedUnitIds.includes(u.id));
// // // //     const totalArea = selectedUnits.reduce((acc, u) => acc + u.area, 0);
// // // //     const baseRent = selectedUnits.reduce((acc, u) => acc + u.rent, 0);
// // // //     const aggregatedRent = Math.round(baseRent * 0.9);

// // // //     const newAgg = {
// // // //       id: `AGG-${Math.floor(100 + Math.random() * 900)}`,
// // // //       name: `Merged Unit (${selectedUnitIds.join(' + ')})`,
// // // //       units: [...selectedUnitIds],
// // // //       area: totalArea,
// // // //       rent: aggregatedRent
// // // //     };

// // // //     setAggregatedSpaces([...aggregatedSpaces, newAgg]);
// // // //     setSelectedUnitIds([]);
// // // //   };

// // // //   const handleDeleteAggregation = (aggId) => {
// // // //     setAggregatedSpaces(aggregatedSpaces.filter(a => a.id !== aggId));
// // // //   };

// // // //   return (
// // // //     // <div className="card-panel" style={{ position: 'relative' }}>
// // // //     //   <div className="view-header" style={{ marginBottom: 20 }}>
// // // //     //     <div>
// // // //     //       <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// // // //     //         <Building size={22} className="text-yellow" style={{ color: 'var(--brand-color)' }} />
// // // //     //         Premium 3D Architecture Tracker
// // // //     //       </h2>
// // // //     //       <p className="view-subtitle">High-fidelity architectural blueprint and layout visualizer. Static layout preview reference.</p>
// // // //     //     </div>
// // // //     //     <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
// // // //     //       <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// // // //     //         <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Property Portfolio:</span>
// // // //     //         <select 
// // // //     //           value={selectedPropertyId} 
// // // //     //           onChange={(e) => setSelectedPropertyId(e.target.value)}
// // // //     //           className="form-select"
// // // //     //           style={{ minWidth: 220, padding: '6px 12px', fontSize: 12 }}
// // // //     //         >
// // // //     //           <option value="PROP-9910">Stratford 3D Architectural Mockup</option>
// // // //     //           {properties.filter(p => p.id !== 'PROP-9910').map(p => (
// // // //     //             <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
// // // //     //           ))}
// // // //     //         </select>
// // // //     //       </div>
// // // //     //     </div>
// // // //     //   </div>

// // // //     //   <div style={{ 
// // // //     //     background: 'var(--bg-secondary)', 
// // // //     //     borderRadius: 'var(--radius-lg)', 
// // // //     //     border: '1px solid var(--border-color)',
// // // //     //     padding: '30px', 
// // // //     //     display: 'flex', 
// // // //     //     flexDirection: 'column', 
// // // //     //     alignItems: 'center', 
// // // //     //     justifyContent: 'center',
// // // //     //     minHeight: '450px',
// // // //     //     gap: '20px'
// // // //     //   }}>
// // // //     //     <div style={{ 
// // // //     //       maxWidth: '720px', 
// // // //     //       width: '100%', 
// // // //     //       borderRadius: 'var(--radius-md)', 
// // // //     //       overflow: 'hidden', 
// // // //     //       boxShadow: 'var(--shadow-md)',
// // // //     //       border: '1px solid var(--border-color)',
// // // //     //       background: '#ffffff',
// // // //     //       padding: '10px'
// // // //     //     }}>
// // // //     //       <img 
// // // //     //         src={houseImg} 
// // // //     //         alt="3D Building Architecture Preview" 
// // // //     //         style={{ 
// // // //     //           width: '100%', 
// // // //     //           height: 'auto', 
// // // //     //           display: 'block', 
// // // //     //           borderRadius: 'var(--radius-sm)'
// // // //     //         }} 
// // // //     //       />
// // // //     //     </div>

// // // //     //     <div style={{ textAlign: 'center', maxWidth: '500px' }}>
// // // //     //       <span style={{ 
// // // //     //         fontSize: '11px', 
// // // //     //         fontWeight: 700, 
// // // //     //         color: 'var(--brand-color)', 
// // // //     //         textTransform: 'uppercase', 
// // // //     //         letterSpacing: '0.05em', 
// // // //     //         background: 'var(--bg-accent-alpha)', 
// // // //     //         padding: '4px 10px', 
// // // //     //         borderRadius: '12px' 
// // // //     //       }}>
// // // //     //         Static Asset Reference
// // // //     //       </span>
// // // //     //       <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: 1.5 }}>
// // // //     //         This layout references the structural plan for the selected property block. Full interactive 3D model orbit features are disabled during architecture synchronization.
// // // //     //       </p>
// // // //     //     </div>
// // // //     //   </div>
// // // //     // </div>

// // // //     <div className="card-panel" style={{ position: 'relative' }}>
// // // //       <div className="view-header" style={{ marginBottom: 20 }}>
// // // //         <div>
// // // //           <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// // // //             <Building size={22} className="text-yellow" style={{ color: 'var(--brand-color)' }} />
// // // //             Premium 3D Architecture Tracker
// // // //           </h2>
// // // //           <p className="view-subtitle">Drag to orbit. Click a vacant unit to select it, then merge selected units into one space.</p>
// // // //         </div>
// // // //         <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
// // // //           <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// // // //             <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Property Portfolio:</span>
// // // //             <select
// // // //               value={selectedPropertyId}
// // // //               onChange={(e) => setSelectedPropertyId(e.target.value)}
// // // //               className="form-select"
// // // //               style={{ minWidth: 220, padding: '6px 12px', fontSize: 12 }}
// // // //             >
// // // //               <option value="PROP-9910">Stratford 3D Architectural Mockup</option>
// // // //               {properties.filter(p => p.id !== 'PROP-9910').map(p => (
// // // //                 <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
// // // //               ))}
// // // //             </select>
// // // //           </div>

// // // //           <button
// // // //             type="button"
// // // //             className="btn btn-sm"
// // // //             onClick={() => setShowAllFloors(!showAllFloors)}
// // // //             style={{ display: 'flex', alignItems: 'center', gap: 6 }}
// // // //           >
// // // //             <Layers size={14} />
// // // //             {showAllFloors ? 'Stacked View' : 'Single Floor'}
// // // //           </button>

// // // //           {!showAllFloors && (
// // // //             <div style={{ display: 'flex', gap: 4 }}>
// // // //               {[0, 1].map(f => (
// // // //                 <button
// // // //                   key={f}
// // // //                   type="button"
// // // //                   className={`btn btn-sm ${activeFloor === f ? 'btn-primary' : ''}`}
// // // //                   onClick={() => setActiveFloor(f)}
// // // //                 >
// // // //                   {f === 0 ? 'Ground' : 'Level 1'}
// // // //                 </button>
// // // //               ))}
// // // //             </div>
// // // //           )}

// // // //           <button
// // // //             type="button"
// // // //             className="btn btn-sm"
// // // //             onClick={() => { setRotation(32); setTilt(0.42); }}
// // // //             title="Reset view"
// // // //           >
// // // //             <RotateCw size={14} />
// // // //           </button>
// // // //         </div>
// // // //       </div>

// // // //       <div
// // // //         style={{
// // // //           background: 'var(--bg-secondary)',
// // // //           borderRadius: 'var(--radius-lg)',
// // // //           border: '1px solid var(--border-color)',
// // // //           padding: 0,
// // // //           position: 'relative',
// // // //           minHeight: compact ? 360 : 500,
// // // //           overflow: 'hidden'
// // // //         }}
// // // //       >
// // // //         <canvas
// // // //           ref={canvasRef}
// // // //           style={{
// // // //             width: '100%',
// // // //             height: compact ? 360 : 500,
// // // //             display: 'block',
// // // //             cursor: isDragging.current ? 'grabbing' : (hoveredUnit ? 'pointer' : 'grab')
// // // //           }}
// // // //           onMouseDown={handleMouseDown}
// // // //           onMouseMove={handleMouseMove}
// // // //           onMouseUp={(e) => { handleMouseUp(); handleCanvasClick(); }}
// // // //           onMouseLeave={handleMouseLeave}
// // // //         />

// // // //         {/* Zoom control */}
// // // //         <div style={{
// // // //           position: 'absolute', bottom: 14, left: 14,
// // // //           display: 'flex', alignItems: 'center', gap: 8,
// // // //           background: 'rgba(15,23,42,0.7)', padding: '6px 12px', borderRadius: 10
// // // //         }}>
// // // //           <Maximize2 size={14} color="#e2e8f0" />
// // // //           <input
// // // //             type="range"
// // // //             min={30}
// // // //             max={90}
// // // //             value={zoom}
// // // //             onChange={(e) => setZoom(Number(e.target.value))}
// // // //             style={{ width: 100 }}
// // // //           />
// // // //         </div>

// // // //         {/* Legend */}
// // // //         <div style={{
// // // //           position: 'absolute', top: 14, left: 14,
// // // //           display: 'flex', gap: 12,
// // // //           background: 'rgba(15,23,42,0.7)', padding: '8px 12px', borderRadius: 10,
// // // //           fontSize: 11, color: '#e2e8f0'
// // // //         }}>
// // // //           {[
// // // //             ['#10b981', 'Vacant'],
// // // //             ['#ef4444', 'Occupied'],
// // // //             ['#f59e0b', 'Maintenance'],
// // // //             ['#3b82f6', 'Merged']
// // // //           ].map(([color, label]) => (
// // // //             <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
// // // //               <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
// // // //               {label}
// // // //             </div>
// // // //           ))}
// // // //         </div>

// // // //         {/* Hover tooltip */}
// // // //         {hoveredUnit && (
// // // //           <div style={{
// // // //             position: 'absolute',
// // // //             top: 14, right: 14,
// // // //             background: 'rgba(15,23,42,0.92)',
// // // //             border: '1px solid #334155',
// // // //             borderRadius: 10,
// // // //             padding: '12px 14px',
// // // //             color: '#f1f5f9',
// // // //             fontSize: 12,
// // // //             minWidth: 200
// // // //           }}>
// // // //             <div style={{ fontWeight: 700, marginBottom: 4 }}>{hoveredUnit.name}</div>
// // // //             <div>ID: {hoveredUnit.id}</div>
// // // //             <div>Status: {hoveredUnit.status}</div>
// // // //             <div>Area: {hoveredUnit.area} sq ft</div>
// // // //             <div>Rent: ${hoveredUnit.rent.toLocaleString()}/mo</div>
// // // //             {hoveredUnit.tenant && <div>Tenant: {hoveredUnit.tenant}</div>}
// // // //             {hoveredUnit.expiry && <div>Lease ends: {hoveredUnit.expiry}</div>}
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* Aggregation panel */}
// // // //       {selectedUnitIds.length > 0 && (
// // // //         <div style={{
// // // //           marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
// // // //           background: 'var(--bg-accent-alpha)', padding: '12px 16px', borderRadius: 10
// // // //         }}>
// // // //           <div style={{ fontSize: 13 }}>
// // // //             Selected: {selectedUnitIds.join(', ')}
// // // //           </div>
// // // //           <button
// // // //             type="button"
// // // //             className="btn btn-sm btn-primary"
// // // //             disabled={selectedUnitIds.length < 2}
// // // //             onClick={handleCreateAggregation}
// // // //             style={{ display: 'flex', alignItems: 'center', gap: 6 }}
// // // //           >
// // // //             <Merge size={14} />
// // // //             Merge {selectedUnitIds.length} Units
// // // //           </button>
// // // //         </div>
// // // //       )}

// // // //       {aggregatedSpaces.length > 0 && (
// // // //         <div style={{ marginTop: 16 }}>
// // // //           <h4 style={{ fontSize: 13, marginBottom: 8 }}>Merged Spaces</h4>
// // // //           <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
// // // //             {aggregatedSpaces.map(agg => (
// // // //               <div key={agg.id} style={{
// // // //                 display: 'flex', justifyContent: 'space-between', alignItems: 'center',
// // // //                 padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8,
// // // //                 border: '1px solid var(--border-color)', fontSize: 12
// // // //               }}>
// // // //                 <span>{agg.name} — {agg.area} sq ft — ${agg.rent.toLocaleString()}/mo</span>
// // // //                 <button type="button" className="btn btn-sm" onClick={() => handleDeleteAggregation(agg.id)}>
// // // //                   <Trash2 size={14} />
// // // //                 </button>
// // // //               </div>
// // // //             ))}
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>

// // // //   );
// // // // }



// // // import React, { useRef, useEffect, useState, useCallback } from 'react';
// // // import * as THREE from 'three';
// // // import { Home, RotateCw, ZoomIn, ZoomOut, Sun, Moon, Grid3x3, Move3d } from 'lucide-react';

// // // /* -------------------------------------------------------------------------
// // //    PROCEDURAL HOUSE BUILDERS
// // //    Each function returns a THREE.Group representing a complete house model.
// // //    Swapping the active model = disposing the old group and building a new one.
// // // ------------------------------------------------------------------------- */

// // // function disposeGroup(group) {
// // //   group.traverse((obj) => {
// // //     if (obj.geometry) obj.geometry.dispose();
// // //     if (obj.material) {
// // //       if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
// // //       else obj.material.dispose();
// // //     }
// // //   });
// // // }

// // // function makeBox(w, h, d, color, opts = {}) {
// // //   const geo = new THREE.BoxGeometry(w, h, d);
// // //   const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.05, ...opts });
// // //   const mesh = new THREE.Mesh(geo, mat);
// // //   mesh.castShadow = true;
// // //   mesh.receiveShadow = true;
// // //   return mesh;
// // // }

// // // function makeCone(radius, height, segments, color) {
// // //   const geo = new THREE.ConeGeometry(radius, height, segments);
// // //   const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.7 });
// // //   const mesh = new THREE.Mesh(geo, mat);
// // //   mesh.castShadow = true;
// // //   mesh.receiveShadow = true;
// // //   return mesh;
// // // }

// // // function addWindow(parent, x, y, z, w = 0.5, h = 0.6, rotY = 0) {
// // //   const frame = makeBox(w, h, 0.05, 0x1e293b);
// // //   const glass = makeBox(w * 0.82, h * 0.82, 0.02, 0x7dd3fc, { emissive: 0x0ea5e9, emissiveIntensity: 0.15, metalness: 0.6, roughness: 0.1 });
// // //   frame.position.set(x, y, z);
// // //   frame.rotation.y = rotY;
// // //   glass.position.set(x, y, z + (rotY === 0 ? 0.03 : 0));
// // //   glass.rotation.y = rotY;
// // //   parent.add(frame, glass);
// // // }

// // // // 1) Modern Glass Box House
// // // function buildModernHouse() {
// // //   const g = new THREE.Group();
// // //   const main = makeBox(4, 2.2, 3, 0xe2e8f0);
// // //   main.position.y = 1.1;
// // //   g.add(main);

// // //   const upper = makeBox(2.6, 1.6, 2, 0xf8fafc);
// // //   upper.position.set(-0.5, 3.0, 0.3);
// // //   g.add(upper);

// // //   // Flat roofs
// // //   const roof1 = makeBox(4.2, 0.1, 3.2, 0x334155);
// // //   roof1.position.y = 2.25;
// // //   g.add(roof1);
// // //   const roof2 = makeBox(2.8, 0.1, 2.2, 0x334155);
// // //   roof2.position.set(-0.5, 3.85, 0.3);
// // //   g.add(roof2);

// // //   // Glass facade windows
// // //   for (let i = -1; i <= 1; i++) addWindow(g, i * 1.1, 1.1, 1.51, 0.8, 1.4);
// // //   addWindow(g, -1.7, 1.1, 0, 0.05, 1.4, Math.PI / 2);
// // //   for (let i = -1; i <= 0; i++) addWindow(g, -0.5 + i * 1.1, 3.0, 1.01, 0.7, 0.8);

// // //   // Door
// // //   const door = makeBox(0.8, 1.6, 0.06, 0x0f172a);
// // //   door.position.set(1.5, 0.8, 1.53);
// // //   g.add(door);

// // //   // Steel pilotis
// // //   for (let i = -1; i <= 1; i += 2) {
// // //     const pillar = makeBox(0.15, 1.0, 0.15, 0x475569);
// // //     pillar.position.set(i * 1.8, -0.5, 1.3);
// // //     g.add(pillar);
// // //   }

// // //   return g;
// // // }

// // // // 2) Classic Cottage with pitched roof
// // // function buildCottageHouse() {
// // //   const g = new THREE.Group();
// // //   const body = makeBox(3.4, 2, 2.6, 0xf5deb3);
// // //   body.position.y = 1;
// // //   g.add(body);

// // //   const roof = makeCone(2.6, 1.6, 4, 0x7f1d1d);
// // //   roof.position.y = 2.8;
// // //   roof.rotation.y = Math.PI / 4;
// // //   g.add(roof);

// // //   const chimney = makeBox(0.35, 1.1, 0.35, 0x78716c);
// // //   chimney.position.set(1, 3.2, 0.6);
// // //   g.add(chimney);

// // //   addWindow(g, -1.0, 1.1, 1.31, 0.6, 0.7);
// // //   addWindow(g, 1.0, 1.1, 1.31, 0.6, 0.7);
// // //   addWindow(g, -1.71, 1.1, 0, 0.05, 0.7, Math.PI / 2);
// // //   addWindow(g, 1.71, 1.1, 0, 0.05, 0.7, Math.PI / 2);

// // //   const door = makeBox(0.7, 1.4, 0.06, 0x422006);
// // //   door.position.set(0, 0.7, 1.33);
// // //   g.add(door);

// // //   const porchRoof = makeBox(1.4, 0.1, 0.8, 0x57534e);
// // //   porchRoof.position.set(0, 1.9, 1.7);
// // //   g.add(porchRoof);
// // //   for (let i = -1; i <= 1; i += 2) {
// // //     const post = makeBox(0.08, 1.0, 0.08, 0xfff7ed);
// // //     post.position.set(i * 0.55, 1.0, 1.95);
// // //     g.add(post);
// // //   }

// // //   return g;
// // // }

// // // // 3) Two-story Suburban House
// // // function buildSuburbanHouse() {
// // //   const g = new THREE.Group();
// // //   const ground = makeBox(3.6, 2.0, 3.0, 0xfde68a);
// // //   ground.position.y = 1;
// // //   g.add(ground);

// // //   const upper = makeBox(3.6, 1.8, 3.0, 0xfef3c7);
// // //   upper.position.y = 2.9;
// // //   g.add(upper);

// // //   const roof = makeCone(2.8, 1.4, 4, 0x44403c);
// // //   roof.position.y = 4.4;
// // //   roof.rotation.y = Math.PI / 4;
// // //   g.add(roof);

// // //   for (let i = -1; i <= 1; i++) {
// // //     addWindow(g, i * 1.1, 1.1, 1.51, 0.55, 0.65);
// // //     addWindow(g, i * 1.1, 3.0, 1.51, 0.55, 0.65);
// // //   }
// // //   addWindow(g, -1.81, 1.1, 0, 0.05, 0.65, Math.PI / 2);
// // //   addWindow(g, 1.81, 1.1, 0, 0.05, 0.65, Math.PI / 2);

// // //   const door = makeBox(0.75, 1.5, 0.06, 0x7c2d12);
// // //   door.position.set(0, 0.75, 1.53);
// // //   g.add(door);

// // //   // Garage block
// // //   const garage = makeBox(1.6, 1.6, 2.6, 0xe7e5e4);
// // //   garage.position.set(-2.6, 0.8, -0.2);
// // //   g.add(garage);
// // //   const garageDoor = makeBox(1.3, 1.2, 0.06, 0x57534e);
// // //   garageDoor.position.set(-2.6, 0.6, 1.13);
// // //   g.add(garageDoor);

// // //   return g;
// // // }

// // // // 4) Mansion with columns
// // // function buildMansionHouse() {
// // //   const g = new THREE.Group();
// // //   const body = makeBox(5, 2.4, 3.4, 0xf1f5f9);
// // //   body.position.y = 1.2;
// // //   g.add(body);

// // //   const roof = makeBox(5.4, 0.3, 3.8, 0x1f2937);
// // //   roof.position.y = 2.55;
// // //   g.add(roof);

// // //   const pediment = makeCone(2.2, 0.9, 4, 0xf1f5f9);
// // //   pediment.position.set(0, 3.1, 1.6);
// // //   pediment.rotation.x = Math.PI / 2;
// // //   pediment.rotation.y = Math.PI / 4;
// // //   pediment.scale.set(1, 1, 0.4);
// // //   g.add(pediment);

// // //   for (let i = -1.6; i <= 1.6; i += 0.8) {
// // //     const col = makeBox(0.25, 2.3, 0.25, 0xfafaf9);
// // //     col.position.set(i, 1.15, 1.75);
// // //     g.add(col);
// // //   }

// // //   for (let i = -1.8; i <= 1.8; i += 1.0) {
// // //     if (Math.abs(i) < 0.4) continue;
// // //     addWindow(g, i, 1.4, 1.91, 0.5, 0.9);
// // //   }
// // //   const door = makeBox(0.9, 1.8, 0.06, 0x431407);
// // //   door.position.set(0, 0.9, 1.78);
// // //   g.add(door);

// // //   return g;
// // // }

// // // const HOUSE_MODELS = {
// // //   modern: { label: 'Modern Glass House', build: buildModernHouse },
// // //   cottage: { label: 'Classic Cottage', build: buildCottageHouse },
// // //   suburban: { label: 'Suburban Two-Story', build: buildSuburbanHouse },
// // //   mansion: { label: 'Columned Mansion', build: buildMansionHouse },
// // // };

// // // /* -------------------------------------------------------------------------
// // //    MAIN VIEWER COMPONENT
// // // ------------------------------------------------------------------------- */

// // // export default function House3DViewer() {
// // //   const mountRef = useRef(null);
// // //   const sceneRef = useRef(null);
// // //   const cameraRef = useRef(null);
// // //   const rendererRef = useRef(null);
// // //   const houseGroupRef = useRef(null);
// // //   const groundRef = useRef(null);
// // //   const lightsRef = useRef({});
// // //   const frameId = useRef(null);

// // //   const [modelKey, setModelKey] = useState('modern');
// // //   const [dayMode, setDayMode] = useState(true);
// // //   const [showGrid, setShowGrid] = useState(true);
// // //   const [wireframe, setWireframe] = useState(false);
// // //   const [loadedFileName, setLoadedFileName] = useState(null);
// // //   const fileInputRef = useRef(null);

// // //   // Spherical camera state for fully free orbit
// // //   const cam = useRef({ theta: Math.PI / 4, phi: 1.0, radius: 9, target: new THREE.Vector3(0, 1, 0) });
// // //   const dragState = useRef({ dragging: false, panning: false, lastX: 0, lastY: 0 });

// // //   const updateCameraPosition = useCallback(() => {
// // //     const { theta, phi, radius, target } = cam.current;
// // //     const clampedPhi = Math.max(0.05, Math.min(Math.PI - 0.05, phi));
// // //     cam.current.phi = clampedPhi;
// // //     const x = target.x + radius * Math.sin(clampedPhi) * Math.sin(theta);
// // //     const y = target.y + radius * Math.cos(clampedPhi);
// // //     const z = target.z + radius * Math.sin(clampedPhi) * Math.cos(theta);
// // //     if (cameraRef.current) {
// // //       cameraRef.current.position.set(x, y, z);
// // //       cameraRef.current.lookAt(target);
// // //     }
// // //   }, []);

// // //   // ---- Scene setup (once) ----
// // //   useEffect(() => {
// // //     const mount = mountRef.current;
// // //     const width = mount.clientWidth;
// // //     const height = mount.clientHeight;

// // //     const scene = new THREE.Scene();
// // //     scene.background = new THREE.Color(0x87ceeb);
// // //     sceneRef.current = scene;

// // //     const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 200);
// // //     cameraRef.current = camera;
// // //     updateCameraPosition();

// // //     const renderer = new THREE.WebGLRenderer({ antialias: true });
// // //     renderer.setSize(width, height);
// // //     renderer.shadowMap.enabled = true;
// // //     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// // //     mount.appendChild(renderer.domElement);
// // //     rendererRef.current = renderer;

// // //     // Lights
// // //     const hemi = new THREE.HemisphereLight(0xffffff, 0x445566, 0.6);
// // //     scene.add(hemi);
// // //     const sun = new THREE.DirectionalLight(0xffffff, 1.2);
// // //     sun.position.set(6, 10, 4);
// // //     sun.castShadow = true;
// // //     sun.shadow.mapSize.set(2048, 2048);
// // //     sun.shadow.camera.left = -10;
// // //     sun.shadow.camera.right = 10;
// // //     sun.shadow.camera.top = 10;
// // //     sun.shadow.camera.bottom = -10;
// // //     scene.add(sun);
// // //     const ambient = new THREE.AmbientLight(0xffffff, 0.35);
// // //     scene.add(ambient);
// // //     lightsRef.current = { hemi, sun, ambient };

// // //     // Ground
// // //     const groundGeo = new THREE.PlaneGeometry(40, 40);
// // //     const groundMat = new THREE.MeshStandardMaterial({ color: 0x4d7c4d, roughness: 1 });
// // //     const ground = new THREE.Mesh(groundGeo, groundMat);
// // //     ground.rotation.x = -Math.PI / 2;
// // //     ground.receiveShadow = true;
// // //     scene.add(ground);
// // //     groundRef.current = ground;

// // //     const grid = new THREE.GridHelper(40, 40, 0x222222, 0x444444);
// // //     grid.position.y = 0.01;
// // //     grid.name = 'grid';
// // //     scene.add(grid);

// // //     // Resize handling
// // //     const handleResize = () => {
// // //       const w = mount.clientWidth;
// // //       const h = mount.clientHeight;
// // //       camera.aspect = w / h;
// // //       camera.updateProjectionMatrix();
// // //       renderer.setSize(w, h);
// // //     };
// // //     window.addEventListener('resize', handleResize);

// // //     // Render loop
// // //     const animate = () => {
// // //       frameId.current = requestAnimationFrame(animate);
// // //       renderer.render(scene, camera);
// // //     };
// // //     animate();

// // //     return () => {
// // //       window.removeEventListener('resize', handleResize);
// // //       cancelAnimationFrame(frameId.current);
// // //       renderer.dispose();
// // //       if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
// // //     };
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, []);

// // //   // ---- Swap house model ----
// // //   useEffect(() => {
// // //     const scene = sceneRef.current;
// // //     if (!scene) return;
// // //     if (houseGroupRef.current) {
// // //       scene.remove(houseGroupRef.current);
// // //       disposeGroup(houseGroupRef.current);
// // //     }
// // //     const builder = HOUSE_MODELS[modelKey]?.build;
// // //     if (builder) {
// // //       const group = builder();
// // //       group.traverse((obj) => {
// // //         if (obj.isMesh) obj.material.wireframe = wireframe;
// // //       });
// // //       scene.add(group);
// // //       houseGroupRef.current = group;
// // //     }
// // //   }, [modelKey, wireframe]);

// // //   // ---- Day / Night lighting ----
// // //   useEffect(() => {
// // //     const { hemi, sun, ambient } = lightsRef.current;
// // //     const scene = sceneRef.current;
// // //     if (!hemi || !scene) return;
// // //     if (dayMode) {
// // //       scene.background = new THREE.Color(0x87ceeb);
// // //       hemi.intensity = 0.6;
// // //       sun.intensity = 1.2;
// // //       sun.color.set(0xffffff);
// // //       ambient.intensity = 0.35;
// // //     } else {
// // //       scene.background = new THREE.Color(0x0b1120);
// // //       hemi.intensity = 0.2;
// // //       sun.intensity = 0.4;
// // //       sun.color.set(0x88aaff);
// // //       ambient.intensity = 0.08;
// // //     }
// // //   }, [dayMode]);

// // //   // ---- Grid toggle ----
// // //   useEffect(() => {
// // //     const scene = sceneRef.current;
// // //     if (!scene) return;
// // //     const grid = scene.getObjectByName('grid');
// // //     if (grid) grid.visible = showGrid;
// // //   }, [showGrid]);

// // //   // ---- Mouse / touch orbit + pan + zoom (fully free, no OrbitControls dependency) ----
// // //   useEffect(() => {
// // //     const dom = rendererRef.current?.domElement;
// // //     if (!dom) return;

// // //     const onDown = (e) => {
// // //       dragState.current.dragging = true;
// // //       dragState.current.panning = e.button === 2 || e.shiftKey;
// // //       dragState.current.lastX = e.clientX;
// // //       dragState.current.lastY = e.clientY;
// // //     };
// // //     const onUp = () => { dragState.current.dragging = false; };
// // //     const onMove = (e) => {
// // //       if (!dragState.current.dragging) return;
// // //       const dx = e.clientX - dragState.current.lastX;
// // //       const dy = e.clientY - dragState.current.lastY;
// // //       dragState.current.lastX = e.clientX;
// // //       dragState.current.lastY = e.clientY;

// // //       if (dragState.current.panning) {
// // //         const cameraEl = cameraRef.current;
// // //         const panSpeed = cam.current.radius * 0.0015;
// // //         const right = new THREE.Vector3();
// // //         cameraEl.getWorldDirection(right);
// // //         const upVec = new THREE.Vector3(0, 1, 0);
// // //         const rightVec = new THREE.Vector3().crossVectors(right, upVec).normalize();
// // //         const upMove = new THREE.Vector3().crossVectors(rightVec, right).normalize();
// // //         cam.current.target.addScaledVector(rightVec, -dx * panSpeed);
// // //         cam.current.target.addScaledVector(upMove, dy * panSpeed);
// // //       } else {
// // //         cam.current.theta -= dx * 0.006;
// // //         cam.current.phi -= dy * 0.006;
// // //       }
// // //       updateCameraPosition();
// // //     };
// // //     const onWheel = (e) => {
// // //       e.preventDefault();
// // //       cam.current.radius = Math.max(2.5, Math.min(40, cam.current.radius + e.deltaY * 0.01));
// // //       updateCameraPosition();
// // //     };
// // //     const onContext = (e) => e.preventDefault();

// // //     dom.addEventListener('mousedown', onDown);
// // //     window.addEventListener('mouseup', onUp);
// // //     window.addEventListener('mousemove', onMove);
// // //     dom.addEventListener('wheel', onWheel, { passive: false });
// // //     dom.addEventListener('contextmenu', onContext);

// // //     // Basic touch support (single = orbit, two-finger = zoom)
// // //     let lastTouchDist = null;
// // //     const onTouchStart = (e) => {
// // //       if (e.touches.length === 1) {
// // //         dragState.current.dragging = true;
// // //         dragState.current.panning = false;
// // //         dragState.current.lastX = e.touches[0].clientX;
// // //         dragState.current.lastY = e.touches[0].clientY;
// // //       } else if (e.touches.length === 2) {
// // //         const dx = e.touches[0].clientX - e.touches[1].clientX;
// // //         const dy = e.touches[0].clientY - e.touches[1].clientY;
// // //         lastTouchDist = Math.sqrt(dx * dx + dy * dy);
// // //       }
// // //     };
// // //     const onTouchMove = (e) => {
// // //       if (e.touches.length === 1 && dragState.current.dragging) {
// // //         const dx = e.touches[0].clientX - dragState.current.lastX;
// // //         const dy = e.touches[0].clientY - dragState.current.lastY;
// // //         dragState.current.lastX = e.touches[0].clientX;
// // //         dragState.current.lastY = e.touches[0].clientY;
// // //         cam.current.theta -= dx * 0.006;
// // //         cam.current.phi -= dy * 0.006;
// // //         updateCameraPosition();
// // //       } else if (e.touches.length === 2 && lastTouchDist != null) {
// // //         const dx = e.touches[0].clientX - e.touches[1].clientX;
// // //         const dy = e.touches[0].clientY - e.touches[1].clientY;
// // //         const dist = Math.sqrt(dx * dx + dy * dy);
// // //         const delta = lastTouchDist - dist;
// // //         cam.current.radius = Math.max(2.5, Math.min(40, cam.current.radius + delta * 0.02));
// // //         lastTouchDist = dist;
// // //         updateCameraPosition();
// // //       }
// // //     };
// // //     const onTouchEnd = () => {
// // //       dragState.current.dragging = false;
// // //       lastTouchDist = null;
// // //     };
// // //     dom.addEventListener('touchstart', onTouchStart, { passive: true });
// // //     dom.addEventListener('touchmove', onTouchMove, { passive: true });
// // //     dom.addEventListener('touchend', onTouchEnd, { passive: true });

// // //     return () => {
// // //       dom.removeEventListener('mousedown', onDown);
// // //       window.removeEventListener('mouseup', onUp);
// // //       window.removeEventListener('mousemove', onMove);
// // //       dom.removeEventListener('wheel', onWheel);
// // //       dom.removeEventListener('contextmenu', onContext);
// // //       dom.removeEventListener('touchstart', onTouchStart);
// // //       dom.removeEventListener('touchmove', onTouchMove);
// // //       dom.removeEventListener('touchend', onTouchEnd);
// // //     };
// // //   }, [updateCameraPosition]);

// // //   const resetView = () => {
// // //     cam.current = { theta: Math.PI / 4, phi: 1.0, radius: 9, target: new THREE.Vector3(0, 1, 0) };
// // //     updateCameraPosition();
// // //   };

// // //   // ---- "Change by files": load a custom .obj model dropped in by the user ----
// // //   const handleFileChange = async (e) => {
// // //     const file = e.target.files?.[0];
// // //     if (!file) return;
// // //     setLoadedFileName(file.name);

// // //     try {
// // //       const text = await file.text();
// // //       const group = parseSimpleOBJ(text);
// // //       const scene = sceneRef.current;
// // //       if (houseGroupRef.current) {
// // //         scene.remove(houseGroupRef.current);
// // //         disposeGroup(houseGroupRef.current);
// // //       }
// // //       group.traverse((obj) => {
// // //         if (obj.isMesh) {
// // //           obj.castShadow = true;
// // //           obj.receiveShadow = true;
// // //           obj.material.wireframe = wireframe;
// // //         }
// // //       });
// // //       scene.add(group);
// // //       houseGroupRef.current = group;
// // //       setModelKey(null); // custom model active, not one of the presets
// // //     } catch (err) {
// // //       console.error('Failed to parse model file:', err);
// // //       alert('Could not load this file. Please upload a simple .obj mesh file.');
// // //     }
// // //   };

// // //   return (
// // //     <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: '#0b1120', fontFamily: 'system-ui, sans-serif' }}>
// // //       <div style={{
// // //         padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16,
// // //         background: '#111827', borderBottom: '1px solid #1f2937', flexWrap: 'wrap'
// // //       }}>
// // //         <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f1f5f9', fontWeight: 700, fontSize: 16 }}>
// // //           <Home size={20} color="#38bdf8" />
// // //           3D House Viewer
// // //         </div>

// // //         <select
// // //           value={modelKey ?? ''}
// // //           onChange={(e) => { setModelKey(e.target.value); setLoadedFileName(null); }}
// // //           style={{ padding: '6px 10px', borderRadius: 8, background: '#1f2937', color: '#f1f5f9', border: '1px solid #334155', fontSize: 13 }}
// // //         >
// // //           {!modelKey && <option value="">Custom uploaded model</option>}
// // //           {Object.entries(HOUSE_MODELS).map(([key, m]) => (
// // //             <option key={key} value={key}>{m.label}</option>
// // //           ))}
// // //         </select>

// // //         <button onClick={() => fileInputRef.current?.click()} style={btnStyle}>
// // //           <Move3d size={14} /> Load .obj file
// // //         </button>
// // //         <input ref={fileInputRef} type="file" accept=".obj" onChange={handleFileChange} style={{ display: 'none' }} />
// // //         {loadedFileName && <span style={{ color: '#94a3b8', fontSize: 12 }}>{loadedFileName}</span>}

// // //         <div style={{ flex: 1 }} />

// // //         <button onClick={() => setDayMode(!dayMode)} style={btnStyle}>
// // //           {dayMode ? <Sun size={14} /> : <Moon size={14} />} {dayMode ? 'Day' : 'Night'}
// // //         </button>
// // //         <button onClick={() => setShowGrid(!showGrid)} style={btnStyle}>
// // //           <Grid3x3 size={14} /> Grid
// // //         </button>
// // //         <button onClick={() => setWireframe(!wireframe)} style={btnStyle}>
// // //           Wireframe
// // //         </button>
// // //         <button onClick={resetView} style={btnStyle}>
// // //           <RotateCw size={14} /> Reset
// // //         </button>
// // //         <button onClick={() => { cam.current.radius = Math.max(2.5, cam.current.radius - 1.5); updateCameraPosition(); }} style={btnStyle}>
// // //           <ZoomIn size={14} />
// // //         </button>
// // //         <button onClick={() => { cam.current.radius = Math.min(40, cam.current.radius + 1.5); updateCameraPosition(); }} style={btnStyle}>
// // //           <ZoomOut size={14} />
// // //         </button>
// // //       </div>

// // //       <div ref={mountRef} style={{ flex: 1, position: 'relative', cursor: 'grab' }} />

// // //       <div style={{
// // //         padding: '8px 20px', background: '#111827', borderTop: '1px solid #1f2937',
// // //         color: '#64748b', fontSize: 12
// // //       }}>
// // //         Drag to orbit • Shift+drag or right-drag to pan • Scroll to zoom • Pinch to zoom on touch
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // const btnStyle = {
// // //   display: 'flex', alignItems: 'center', gap: 6,
// // //   padding: '6px 10px', borderRadius: 8,
// // //   background: '#1f2937', color: '#e2e8f0',
// // //   border: '1px solid #334155', fontSize: 12, cursor: 'pointer'
// // // };

// // // /* -------------------------------------------------------------------------
// // //    MINIMAL .OBJ PARSER
// // //    Supports vertices (v), faces (f) for triangles/quads. Good enough for
// // //    simple exported house meshes without materials/textures.
// // // ------------------------------------------------------------------------- */
// // // function parseSimpleOBJ(text) {
// // //   const vertices = [];
// // //   const faceIndices = [];

// // //   text.split('\n').forEach((line) => {
// // //     const trimmed = line.trim();
// // //     if (trimmed.startsWith('v ')) {
// // //       const parts = trimmed.split(/\s+/).slice(1).map(Number);
// // //       vertices.push(parts[0], parts[1], parts[2]);
// // //     } else if (trimmed.startsWith('f ')) {
// // //       const parts = trimmed.split(/\s+/).slice(1).map((p) => parseInt(p.split('/')[0], 10) - 1);
// // //       if (parts.length === 3) {
// // //         faceIndices.push(parts[0], parts[1], parts[2]);
// // //       } else if (parts.length === 4) {
// // //         // Triangulate quad
// // //         faceIndices.push(parts[0], parts[1], parts[2]);
// // //         faceIndices.push(parts[0], parts[2], parts[3]);
// // //       }
// // //     }
// // //   });

// // //   const geometry = new THREE.BufferGeometry();
// // //   geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
// // //   geometry.setIndex(faceIndices);
// // //   geometry.computeVertexNormals();

// // //   const material = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.8 });
// // //   const mesh = new THREE.Mesh(geometry, material);

// // //   // Center and scale to a reasonable size
// // //   geometry.computeBoundingBox();
// // //   const box = geometry.boundingBox;
// // //   const size = new THREE.Vector3();
// // //   box.getSize(size);
// // //   const maxDim = Math.max(size.x, size.y, size.z) || 1;
// // //   const scale = 4 / maxDim;
// // //   mesh.scale.setScalar(scale);

// // //   const center = new THREE.Vector3();
// // //   box.getCenter(center);
// // //   mesh.position.sub(center.multiplyScalar(scale));

// // //   const group = new THREE.Group();
// // //   group.add(mesh);
// // //   return group;
// // // }

// // import React, { useRef, useEffect, useState, useCallback } from 'react';
// // import * as THREE from 'three';
// // import { Home, RotateCw, ZoomIn, ZoomOut, Sun, Moon, Grid3x3, Building2 } from 'lucide-react';

// // /* -------------------------------------------------------------------------
// //    UTILITIES
// // ------------------------------------------------------------------------- */
// // function disposeGroup(group) {
// //   group.traverse((obj) => {
// //     if (obj.geometry) obj.geometry.dispose();
// //     if (obj.material) {
// //       if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
// //       else obj.material.dispose();
// //     }
// //   });
// // }

// // function makeBox(w, h, d, color, opts = {}) {
// //   const geo = new THREE.BoxGeometry(w, h, d);
// //   const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.05, ...opts });
// //   const mesh = new THREE.Mesh(geo, mat);
// //   mesh.castShadow = true;
// //   mesh.receiveShadow = true;
// //   return mesh;
// // }

// // // const STATUS_COLOR = {
// // //   occupied: 0xef4444,
// // //   vacant: 0x10b981,
// // //   maintenance: 0xf59e0b,
// // //   aggregated: 0x3b82f6,
// // // };
// // const STATUS_COLOR = {
// //   occupied: 0x00D4FF,      // brightest
// //   maintenance: 0x0099CC,   // medium
// //   vacant: 0x005F80,        // darker
// //   aggregated: 0x7DD3FC     // soft highlight
// // };
// // const STATUS_LABEL = {
// //   occupied: 'Occupied',
// //   vacant: 'Vacant',
// //   maintenance: 'Maintenance',
// //   aggregated: 'Merged',
// // };

// // /* -------------------------------------------------------------------------
// //    NORMALIZE PROPERTY DATA -> FLOORS OF UNITS
// //    Accepts whatever shape the app passes in (property groups from ERPNext)
// //    and produces a consistent { floors: [{ units: [{id,status,tenant,...}] }] }
// //    structure to render. Falls back to a deterministic synthetic layout if the
// //    property only has summary counts (unitsCount / occupied / vacant etc).
// // ------------------------------------------------------------------------- */
// // function normalizeProperty(property) {
// //   if (!property) return { floors: [{ units: [{ id: 'U1', status: 'vacant' }] }] };

// //   if (Array.isArray(property.floors) && property.floors.length > 0) {
// //     return property;
// //   }

// //   if (Array.isArray(property.units) && property.units.length > 0) {
// //     const floorsMap = {};
// //     property.units.forEach((u) => {
// //       const f = u.floor ?? 0;
// //       if (!floorsMap[f]) floorsMap[f] = [];
// //       floorsMap[f].push(u);
// //     });
// //     const floors = Object.keys(floorsMap)
// //       .sort((a, b) => Number(a) - Number(b))
// //       .map((f) => ({ units: floorsMap[f] }));
// //     return { ...property, floors };
// //   }

// //   // Synthetic fallback from summary counts
// //   const total = property.unitsCount || 6;
// //   const occupiedCount = property.occupied ?? Math.round(total * 0.6);
// //   const maintenanceCount = property.maintenance ?? Math.max(0, Math.round(total * 0.1));
// //   const vacantCount = Math.max(0, total - occupiedCount - maintenanceCount);

// //   const statuses = [
// //     ...Array(occupiedCount).fill('occupied'),
// //     ...Array(vacantCount).fill('vacant'),
// //     ...Array(maintenanceCount).fill('maintenance'),
// //   ];
// //   while (statuses.length < total) statuses.push('vacant');

// //   const unitsPerFloor = Math.max(2, Math.min(4, Math.ceil(total / Math.max(1, Math.ceil(total / 4)))));
// //   const floors = [];
// //   for (let i = 0; i < statuses.length; i += unitsPerFloor) {
// //     floors.push({
// //       units: statuses.slice(i, i + unitsPerFloor).map((status, idx) => ({
// //         id: `F${floors.length + 1}-${idx + 1}`,
// //         status,
// //         tenant: status === 'occupied' ? 'Tenant' : null,
// //         rent: property.rent ? Math.round(property.rent / total) : null,
// //         area: property.area ? Math.round(property.area / total) : null,
// //       })),
// //     });
// //   }
// //   return { ...property, floors };
// // }

// // /* -------------------------------------------------------------------------
// //    BUILD A 3D BUILDING FROM NORMALIZED PROPERTY DATA
// //    Each floor is a horizontal slab; each unit on a floor is a vertical glass
// //    bay colored by occupancy status. A roof + entrance + ground plate complete
// //    the read of "this is a real building", not an abstract block.
// // ------------------------------------------------------------------------- */
// // function buildPropertyModel(property, onUnitMeta) {
// //   const data = normalizeProperty(property);
// //   const group = new THREE.Group();
// //   const floorHeight = 1.6;
// //   const bayWidth = 1.1;
// //   const depth = 2.2;

// //   const maxUnitsPerFloor = Math.max(...data.floors.map((f) => f.units.length), 1);
// //   const buildingWidth = maxUnitsPerFloor * bayWidth;

// //   // Foundation slab
// //   const base = makeBox(buildingWidth + 0.6, 0.25, depth + 0.6, 0x9ca3af);
// //   base.position.y = 0.125;
// //   group.add(base);

// //   data.floors.forEach((floor, floorIdx) => {
// //     const y = 0.25 + floorIdx * floorHeight + floorHeight / 2;
// //     const floorWidth = floor.units.length * bayWidth;
// //     const startX = -floorWidth / 2 + bayWidth / 2;

// //     // Floor slab edge (subtle horizontal banding between levels)
// //     const slab = makeBox(floorWidth + 0.2, 0.08, depth + 0.2, 0x1f2937);
// //     slab.position.set(0, y - floorHeight / 2, 0);
// //     group.add(slab);

// //     floor.units.forEach((unit, unitIdx) => {
// //       const x = startX + unitIdx * bayWidth;
// //       const color = STATUS_COLOR[unit.status] || STATUS_COLOR.vacant;

// //       // Structural frame (concrete mullions)
// //       // const frame = makeBox(bayWidth - 0.06, floorHeight - 0.1, depth - 0.1, 0x0F172A);
// //       const frameMat = new THREE.MeshPhysicalMaterial({
// //         color: 0x66CCFF,
// //         transparent: true,
// //         opacity: 0.2,
// //         emissive: 0x66CCFF,
// //         emissiveIntensity: 0.2,
// //       });

// //       const frame = new THREE.Mesh(
// //         new THREE.BoxGeometry(
// //           bayWidth - 0.2,
// //           floorHeight - 0.1,
// //           depth - 0.1
// //         ),
// //         frameMat
// //       );
// //       frame.position.set(x, y, 0);
// //       group.add(frame);
// //       const edges = new THREE.LineSegments(
// //         new THREE.EdgesGeometry(frame.geometry),
// //         new THREE.LineBasicMaterial({
// //           color: 0x66CCFF
// //         })
// //       );

// //       edges.position.copy(frame.position);

// //       group.add(edges);

// //       // Glass facade panel (front face) tinted by occupancy status
// //       // const glass = makeBox(bayWidth - 0.16, floorHeight - 0.3, 0.04, color, {
// //       //   emissive: color,
// //       //   emissiveIntensity: 0.35,
// //       //   metalness: 0.3,
// //       //   roughness: 0.25,
// //       // });
// //       // const glassGeo = new THREE.BoxGeometry(
// //       //   bayWidth - 0.16,
// //       //   floorHeight - 0.3,
// //       //   0.04
// //       // );

// //       // const glassMat = new THREE.MeshPhysicalMaterial({
// //       //   color,
// //       //   transmission: 1,
// //       //   transparent: true,
// //       //   opacity: 0.85,
// //       //   roughness: 0.05,
// //       //   metalness: 0.1,
// //       //   emissive: color,
// //       //   emissiveIntensity: 0.25
// //       // });

// //       // const glass = new THREE.Mesh(
// //       //   glassGeo,
// //       //   glassMat
// //       // );
// //       const glassGeo = new THREE.BoxGeometry(
// //         bayWidth - 0.16,
// //         floorHeight - 0.3,
// //         0.04
// //       );

// //       const glassMat = new THREE.MeshPhysicalMaterial({
// //         color: 0x66CCFF,
// //         transparent: true,
// //         opacity: 0.3,
// //         transmission: 1,
// //         roughness: 0,
// //         metalness: 0,
// //         emissive: 0x66CCFF,
// //         emissiveIntensity: 0.2,
// //       });

// //       const glass = new THREE.Mesh(
// //         glassGeo,
// //         glassMat
// //       );

// //       glass.position.set(x, y, depth / 2 - 0.05 + 0.02);
// //       glass.userData = { unit, floorIdx };
// //       group.add(glass);
// //       if (onUnitMeta) onUnitMeta(glass, unit);

// //       // Status indicator light strip beneath the bay
// //       const light = makeBox(bayWidth - 0.3, 0.05, 0.05, color, { emissive: color, emissiveIntensity: 0.9 });
// //       light.position.set(x, y - floorHeight / 2 + 0.06, depth / 2 + 0.02);
// //       group.add(light);
// //     });
// //   });

// //   const totalHeight = 0.25 + data.floors.length * floorHeight;

// //   // Roof cap
// //   const roof = makeBox(buildingWidth + 0.5, 0.18, depth + 0.5, 0x374151);
// //   roof.position.set(0, totalHeight + 0.09, 0);
// //   group.add(roof);

// //   // Rooftop mechanical block for visual interest on taller buildings
// //   if (data.floors.length >= 3) {
// //     const mech = makeBox(buildingWidth * 0.35, 0.5, depth * 0.4, 0x4b5563);
// //     mech.position.set(0, totalHeight + 0.18 + 0.25, 0);
// //     group.add(mech);
// //   }

// //   // Entrance canopy
// //   const canopy = makeBox(1.6, 0.08, 0.9, 0x111827);
// //   canopy.position.set(0, 0.55, depth / 2 + 0.55);
// //   group.add(canopy);
// //   const door = makeBox(0.9, 0.9, 0.05, 0x0f172a);
// //   door.position.set(0, 0.45, depth / 2 + 0.07);
// //   group.add(door);

// //   group.userData = { buildingWidth, totalHeight, floorCount: data.floors.length };
// //   // Blueprint wireframe overlay
// //   group.traverse((obj) => {
// //     if (obj.isMesh) {
// //       // const wire = new THREE.LineSegments(
// //       //   new THREE.EdgesGeometry(obj.geometry),
// //       //   new THREE.LineBasicMaterial({
// //       //     color: 0x38BDF8
// //       //   })
// //       // );
// //       const wire = new THREE.LineSegments(
// //         new THREE.EdgesGeometry(obj.geometry),
// //         new THREE.LineBasicMaterial({
// //           color: 0x7DD3FC,
// //           transparent: true,
// //           opacity: 0.9,
// //         })
// //       );

// //       wire.position.copy(obj.position);
// //       wire.rotation.copy(obj.rotation);
// //       wire.scale.copy(obj.scale);

// //       group.add(wire);
// //     }
// //   });
// //   return group;
// // }

// // /* -------------------------------------------------------------------------
// //    MAIN VIEWER COMPONENT
// //    Props:
// //      properties: array of property groups, e.g.
// //        [{ id, name, unitsCount, occupied, vacant, maintenance, rent, area }]
// //        (or already-detailed { floors: [{ units: [...] }] } shape)
// // ------------------------------------------------------------------------- */
// // export default function PropertyMall3DView({ properties = [] }) {
// //   const mountRef = useRef(null);
// //   const sceneRef = useRef(null);
// //   const cameraRef = useRef(null);
// //   const rendererRef = useRef(null);
// //   const buildingGroupRef = useRef(null);
// //   const lightsRef = useRef({});
// //   const frameId = useRef(null);
// //   const raycaster = useRef(new THREE.Raycaster());
// //   const unitMeshesRef = useRef([]);

// //   const fallbackProperties = [
// //     { id: 'PROP-9910', name: 'Stratford Tower', unitsCount: 12, occupied: 7, vacant: 3, maintenance: 2, rent: 96000, area: 18000 },
// //   ];
// //   const propertyList = properties.length > 0 ? properties : fallbackProperties;

// //   const [selectedId, setSelectedId] = useState(propertyList[0].id);
// //   const [dayMode, setDayMode] = useState(true);
// //   const [showGrid, setShowGrid] = useState(true);
// //   const [hoveredUnit, setHoveredUnit] = useState(null);
// //   const [mousePx, setMousePx] = useState({ x: 0, y: 0 });

// //   const selectedProperty = propertyList.find((p) => p.id === selectedId) || propertyList[0];

// //   const cam = useRef({ theta: Math.PI / 4, phi: 1.0, radius: 8, target: new THREE.Vector3(0, 1.5, 0) });
// //   const dragState = useRef({ dragging: false, panning: false, lastX: 0, lastY: 0 });

// //   const updateCameraPosition = useCallback(() => {
// //     const { theta, phi, radius, target } = cam.current;
// //     const clampedPhi = Math.max(0.08, Math.min(Math.PI - 0.08, phi));
// //     cam.current.phi = clampedPhi;
// //     const x = target.x + radius * Math.sin(clampedPhi) * Math.sin(theta);
// //     const y = target.y + radius * Math.cos(clampedPhi);
// //     const z = target.z + radius * Math.sin(clampedPhi) * Math.cos(theta);
// //     if (cameraRef.current) {
// //       cameraRef.current.position.set(x, y, z);
// //       cameraRef.current.lookAt(target);
// //     }
// //   }, []);

// //   // ---- Scene setup (once) ----
// //   useEffect(() => {
// //     const mount = mountRef.current;
// //     const width = mount.clientWidth;
// //     const height = mount.clientHeight;

// //     const scene = new THREE.Scene();
// //     // scene.background = new THREE.Color(0x87ceeb);
// //     scene.background = new THREE.Color(0x071426);
// //     scene.fog = new THREE.FogExp2(
// //       0x071426,
// //       0.03
// //     );
// //     sceneRef.current = scene;

// //     const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 200);
// //     cameraRef.current = camera;
// //     updateCameraPosition();

// //     const renderer = new THREE.WebGLRenderer({ antialias: true });
// //     renderer.setSize(width, height);
// //     renderer.shadowMap.enabled = true;
// //     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// //     mount.appendChild(renderer.domElement);
// //     rendererRef.current = renderer;

// //     const hemi = new THREE.HemisphereLight(0xffffff, 0x445566, 0.6);
// //     scene.add(hemi);
// //     const sun = new THREE.DirectionalLight(0xffffff, 1.2);
// //     sun.position.set(6, 10, 4);
// //     sun.castShadow = true;
// //     sun.shadow.mapSize.set(2048, 2048);
// //     sun.shadow.camera.left = -10;
// //     sun.shadow.camera.right = 10;
// //     sun.shadow.camera.top = 10;
// //     sun.shadow.camera.bottom = -10;
// //     scene.add(sun);
// //     // const ambient = new THREE.AmbientLight(0xffffff, 0.35);
// //     const ambient = new THREE.AmbientLight(
// //       0xB3E5FC,
// //       0.6
// //     );

// //     const rimLight = new THREE.DirectionalLight(
// //       0x4FC3F7,
// //       0.8
// //     );

// //     rimLight.position.set(-5, 8, -5);
// //     scene.add(rimLight);
// //     scene.add(ambient);
// //     lightsRef.current = { hemi, sun, ambient };

// //     const ground = new THREE.Mesh(
// //       new THREE.PlaneGeometry(60, 60),
// //       new THREE.MeshStandardMaterial({ color: 0x08131F, roughness: 1 })
// //     );
// //     ground.rotation.x = -Math.PI / 2;
// //     ground.receiveShadow = true;
// //     scene.add(ground);

// //     // const grid = new THREE.GridHelper(60, 60, 0x222222, 0x444444);
// //     const grid = new THREE.GridHelper(
// //       60,
// //       60,
// //       0x0EA5E9,
// //       0x0F4C81
// //     );
// //     grid.material.transparent = true;
// //     grid.material.opacity = 1;
// //     grid.position.y = 0.01;
// //     grid.name = 'grid';
// //     scene.add(grid);

// //     const ro = new ResizeObserver(() => {
// //       const w = mount.clientWidth;
// //       const h = mount.clientHeight;
// //       if (w === 0 || h === 0) return;
// //       camera.aspect = w / h;
// //       camera.updateProjectionMatrix();
// //       renderer.setSize(w, h);
// //     });
// //     ro.observe(mount);

// //     const animate = () => {
// //       frameId.current = requestAnimationFrame(animate);
// //       renderer.render(scene, camera);
// //     };
// //     animate();

// //     return () => {
// //       ro.disconnect();
// //       cancelAnimationFrame(frameId.current);
// //       renderer.dispose();
// //       if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   // ---- Rebuild building whenever selected property changes ----
// //   useEffect(() => {
// //     const scene = sceneRef.current;
// //     if (!scene) return;
// //     if (buildingGroupRef.current) {
// //       scene.remove(buildingGroupRef.current);
// //       disposeGroup(buildingGroupRef.current);
// //     }
// //     unitMeshesRef.current = [];
// //     const group = buildPropertyModel(selectedProperty, (mesh) => unitMeshesRef.current.push(mesh));
// //     scene.add(group);
// //     group.traverse((obj) => {
// //       if (obj.material?.emissive) {
// //         obj.material.emissiveIntensity = 0.4;
// //       }
// //     });
// //     buildingGroupRef.current = group;

// //     // Frame the camera around the new building height/width
// //     const { totalHeight = 2, buildingWidth = 4 } = group.userData;
// //     cam.current.target.set(0, totalHeight / 2, 0);
// //     cam.current.radius = Math.max(6, buildingWidth * 1.6, totalHeight * 1.8);
// //     updateCameraPosition();
// //   }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

// //   // ---- Day / Night ----
// //   useEffect(() => {
// //     const { hemi, sun, ambient } = lightsRef.current;
// //     const scene = sceneRef.current;
// //     if (!hemi || !scene) return;
// //     if (dayMode) {
// //       // scene.background = new THREE.Color(0x87ceeb);
// //       scene.background = new THREE.Color(0x071426);
// //       hemi.intensity = 0.6; sun.intensity = 1.2; sun.color.set(0xffffff); ambient.intensity = 0.35;
// //     } else {
// //       scene.background = new THREE.Color(0x0b1120);
// //       hemi.intensity = 0.2; sun.intensity = 0.4; sun.color.set(0x88aaff); ambient.intensity = 0.08;
// //     }
// //   }, [dayMode]);

// //   useEffect(() => {
// //     const grid = sceneRef.current?.getObjectByName('grid');
// //     if (grid) grid.visible = showGrid;
// //   }, [showGrid]);

// //   // ---- Orbit / pan / zoom + unit hover picking ----
// //   useEffect(() => {
// //     const dom = rendererRef.current?.domElement;
// //     if (!dom) return;

// //     const pickUnit = (clientX, clientY) => {
// //       const rect = dom.getBoundingClientRect();
// //       const mouse = new THREE.Vector2(
// //         ((clientX - rect.left) / rect.width) * 2 - 1,
// //         -((clientY - rect.top) / rect.height) * 2 + 1
// //       );
// //       raycaster.current.setFromCamera(mouse, cameraRef.current);
// //       const hits = raycaster.current.intersectObjects(unitMeshesRef.current, false);
// //       if (hits.length > 0) {
// //         setHoveredUnit(hits[0].object.userData.unit);
// //         setMousePx({ x: clientX - rect.left, y: clientY - rect.top });
// //       } else {
// //         setHoveredUnit(null);
// //       }
// //     };

// //     const onDown = (e) => {
// //       dragState.current.dragging = true;
// //       dragState.current.panning = e.button === 2 || e.shiftKey;
// //       dragState.current.lastX = e.clientX;
// //       dragState.current.lastY = e.clientY;
// //     };
// //     const onUp = () => { dragState.current.dragging = false; };
// //     const onMove = (e) => {
// //       if (!dragState.current.dragging) {
// //         pickUnit(e.clientX, e.clientY);
// //         return;
// //       }
// //       const dx = e.clientX - dragState.current.lastX;
// //       const dy = e.clientY - dragState.current.lastY;
// //       dragState.current.lastX = e.clientX;
// //       dragState.current.lastY = e.clientY;

// //       if (dragState.current.panning) {
// //         const cameraEl = cameraRef.current;
// //         const panSpeed = cam.current.radius * 0.0015;
// //         const dir = new THREE.Vector3();
// //         cameraEl.getWorldDirection(dir);
// //         const rightVec = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
// //         const upMove = new THREE.Vector3().crossVectors(rightVec, dir).normalize();
// //         cam.current.target.addScaledVector(rightVec, -dx * panSpeed);
// //         cam.current.target.addScaledVector(upMove, dy * panSpeed);
// //       } else {
// //         cam.current.theta -= dx * 0.006;
// //         cam.current.phi -= dy * 0.006;
// //       }
// //       updateCameraPosition();
// //       setHoveredUnit(null);
// //     };
// //     const onWheel = (e) => {
// //       e.preventDefault();
// //       cam.current.radius = Math.max(2.5, Math.min(50, cam.current.radius + e.deltaY * 0.01));
// //       updateCameraPosition();
// //     };
// //     const onContext = (e) => e.preventDefault();

// //     dom.addEventListener('mousedown', onDown);
// //     window.addEventListener('mouseup', onUp);
// //     window.addEventListener('mousemove', onMove);
// //     dom.addEventListener('wheel', onWheel, { passive: false });
// //     dom.addEventListener('contextmenu', onContext);

// //     return () => {
// //       dom.removeEventListener('mousedown', onDown);
// //       window.removeEventListener('mouseup', onUp);
// //       window.removeEventListener('mousemove', onMove);
// //       dom.removeEventListener('wheel', onWheel);
// //       dom.removeEventListener('contextmenu', onContext);
// //     };
// //   }, [updateCameraPosition]);

// //   const resetView = () => {
// //     const { totalHeight = 2, buildingWidth = 4 } = buildingGroupRef.current?.userData || {};
// //     cam.current = {
// //       theta: Math.PI / 4,
// //       phi: 1.0,
// //       radius: Math.max(6, buildingWidth * 1.6, totalHeight * 1.8),
// //       target: new THREE.Vector3(0, totalHeight / 2, 0),
// //     };
// //     updateCameraPosition();
// //   };

// //   // Occupancy summary for the side panel
// //   const data = normalizeProperty(selectedProperty);
// //   const allUnits = data.floors.flatMap((f) => f.units);
// //   const counts = allUnits.reduce((acc, u) => {
// //     acc[u.status] = (acc[u.status] || 0) + 1;
// //     return acc;
// //   }, {});
// //   const occupancyRate = allUnits.length ? Math.round(((counts.occupied || 0) / allUnits.length) * 100) : 0;

// //   return (
// //     <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, padding: 0, overflow: 'hidden' }}>
// //       {/* Toolbar */}
// //       <div style={{
// //         padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
// //         background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)',
// //         flexWrap: 'wrap', rowGap: 8,
// //       }}>
// //         <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', fontWeight: 700, fontSize: 15, marginRight: 4 }}>
// //           <Building2 size={18} style={{ color: 'var(--brand-color)' }} />
// //           3D Property Tracker
// //         </div>

// //         <select
// //           value={selectedId}
// //           onChange={(e) => setSelectedId(e.target.value)}
// //           className="form-select"
// //           style={{ padding: '6px 10px', fontSize: 13, minWidth: 200, borderRadius: 8 }}
// //         >
// //           {propertyList.map((p) => (
// //             <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
// //           ))}
// //         </select>

// //         <div style={{ flex: 1, minWidth: 8 }} />

// //         <button onClick={() => setDayMode(!dayMode)} className="btn btn-sm" style={btnStyle}>
// //           {dayMode ? <Sun size={14} /> : <Moon size={14} />} {dayMode ? 'Day' : 'Night'}
// //         </button>
// //         <button onClick={() => setShowGrid(!showGrid)} className="btn btn-sm" style={btnStyle}>
// //           <Grid3x3 size={14} /> Grid
// //         </button>
// //         <button onClick={resetView} className="btn btn-sm" style={btnStyle}>
// //           <RotateCw size={14} /> Reset
// //         </button>
// //         <button onClick={() => { cam.current.radius = Math.max(2.5, cam.current.radius - 1.2); updateCameraPosition(); }} className="btn btn-sm" style={btnStyle}>
// //           <ZoomIn size={14} />
// //         </button>
// //         <button onClick={() => { cam.current.radius = Math.min(50, cam.current.radius + 1.2); updateCameraPosition(); }} className="btn btn-sm" style={btnStyle}>
// //           <ZoomOut size={14} />
// //         </button>
// //       </div>

// //       {/* Body: viewport + occupancy side panel, both confined to remaining height */}
// //       <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
// //         <div ref={mountRef} style={{ flex: 1, minWidth: 0, position: 'relative', cursor: dragState.current.dragging ? 'grabbing' : 'grab' }}>
// //           {/* Legend */}
// //           <div style={{
// //             position: 'absolute', top: 12, left: 12, display: 'flex', gap: 10,
// //             background: 'rgba(15,23,42,0.72)', padding: '6px 10px', borderRadius: 8,
// //             fontSize: 11, color: '#e2e8f0', zIndex: 2,
// //           }}>
// //             {Object.entries(STATUS_LABEL).map(([key, label]) => (
// //               <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
// //                 <span style={{
// //                   width: 8, height: 8, borderRadius: '50%',
// //                   background: `#${STATUS_COLOR[key].toString(16).padStart(6, '0')}`,
// //                   boxShadow: `0 0 6px #${STATUS_COLOR[key].toString(16).padStart(6, '0')}`,
// //                 }} />
// //                 {label}
// //               </div>
// //             ))}
// //           </div>

// //           {/* Hover tooltip, positioned at cursor */}
// //           {hoveredUnit && (
// //             <div style={{
// //               position: 'absolute', left: Math.min(mousePx.x + 14, 9999), top: Math.max(mousePx.y - 10, 0),
// //               background: 'rgba(15,23,42,0.94)', border: '1px solid #334155', borderRadius: 8,
// //               padding: '10px 12px', color: '#f1f5f9', fontSize: 12, minWidth: 160, zIndex: 3, pointerEvents: 'none',
// //             }}>
// //               <div style={{ fontWeight: 700, marginBottom: 3 }}>{hoveredUnit.id}</div>
// //               <div>Status: {STATUS_LABEL[hoveredUnit.status] || hoveredUnit.status}</div>
// //               {hoveredUnit.tenant && <div>Tenant: {hoveredUnit.tenant}</div>}
// //               {hoveredUnit.area && <div>Area: {hoveredUnit.area} sq ft</div>}
// //               {hoveredUnit.rent && <div>Rent: ${hoveredUnit.rent.toLocaleString()}/mo</div>}
// //             </div>
// //           )}

// //           <div style={{
// //             position: 'absolute', bottom: 10, left: 12, color: '#94a3b8', fontSize: 11,
// //             background: 'rgba(15,23,42,0.55)', padding: '4px 8px', borderRadius: 6, zIndex: 2,
// //           }}>
// //             Drag to orbit • Shift/right-drag to pan • Scroll to zoom • Hover a bay for unit info
// //           </div>
// //         </div>

// //         {/* Occupancy summary side panel */}
// //         <div style={{
// //           width: 220, flexShrink: 0, borderLeft: '1px solid var(--border-color)',
// //           background: 'var(--bg-secondary)', padding: 16, overflowY: 'auto',
// //         }}>
// //           <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>
// //             {selectedProperty.name}
// //           </div>
// //           <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 14 }}>{selectedProperty.id}</div>

// //           <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--brand-color)', lineHeight: 1 }}>{occupancyRate}%</div>
// //           <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 16 }}>Occupancy rate</div>

// //           {Object.entries(STATUS_LABEL).map(([key, label]) => (
// //             counts[key] ? (
// //               <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
// //                 <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
// //                   <span style={{ width: 8, height: 8, borderRadius: '50%', background: `#${STATUS_COLOR[key].toString(16).padStart(6, '0')}` }} />
// //                   {label}
// //                 </span>
// //                 <span style={{ fontWeight: 600 }}>{counts[key]}</span>
// //               </div>
// //             ) : null
// //           ))}

// //           <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
// //             Floors: <strong style={{ color: 'var(--text-primary)' }}>{data.floors.length}</strong><br />
// //             Total units: <strong style={{ color: 'var(--text-primary)' }}>{allUnits.length}</strong>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // const btnStyle = { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 };




// import React, { useRef, useEffect, useState, useCallback } from 'react';
// import * as THREE from 'three';
// import { Home, RotateCw, ZoomIn, ZoomOut, Sun, Moon, Grid3x3, Building2 } from 'lucide-react';
// import {
//   STATUS_COLOR,
//   STATUS_LABEL,
//   disposeGroup,
//   normalizeProperty,
//   buildPropertyModel,
// } from './propertyBuildingModel';

// export default function PropertyMall3DView({ properties = [] }) {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const cameraRef = useRef(null);
//   const rendererRef = useRef(null);
//   const buildingGroupRef = useRef(null);
//   const lightsRef = useRef({});
//   const frameId = useRef(null);
//   const raycaster = useRef(new THREE.Raycaster());
//   const unitMeshesRef = useRef([]);

//   const fallbackProperties = [
//     { id: 'PROP-9910', name: 'Stratford Tower', unitsCount: 12, occupied: 7, vacant: 3, maintenance: 2, rent: 96000, area: 18000 },
//   ];
//   const propertyList = properties.length > 0 ? properties : fallbackProperties;

//   const [selectedId, setSelectedId] = useState(propertyList[0].id);
//   const [dayMode, setDayMode] = useState(true);
//   const [showGrid, setShowGrid] = useState(true);
//   const [hoveredUnit, setHoveredUnit] = useState(null);
//   const [mousePx, setMousePx] = useState({ x: 0, y: 0 });

//   const selectedProperty = propertyList.find((p) => p.id === selectedId) || propertyList[0];

//   const cam = useRef({ theta: Math.PI / 4, phi: 1.0, radius: 8, target: new THREE.Vector3(0, 1.5, 0) });
//   const dragState = useRef({ dragging: false, panning: false, lastX: 0, lastY: 0 });

//   const updateCameraPosition = useCallback(() => {
//     const { theta, phi, radius, target } = cam.current;
//     const clampedPhi = Math.max(0.08, Math.min(Math.PI - 0.08, phi));
//     cam.current.phi = clampedPhi;
//     const x = target.x + radius * Math.sin(clampedPhi) * Math.sin(theta);
//     const y = target.y + radius * Math.cos(clampedPhi);
//     const z = target.z + radius * Math.sin(clampedPhi) * Math.cos(theta);
//     if (cameraRef.current) {
//       cameraRef.current.position.set(x, y, z);
//       cameraRef.current.lookAt(target);
//     }
//   }, []);

//   // ---- Scene setup (once) ----
//   useEffect(() => {
//     const mount = mountRef.current;
//     const width = mount.clientWidth;
//     const height = mount.clientHeight;

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x071426);
//     scene.fog = new THREE.FogExp2(0x071426, 0.03);
//     sceneRef.current = scene;

//     const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 200);
//     cameraRef.current = camera;
//     updateCameraPosition();

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(width, height);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     mount.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     const hemi = new THREE.HemisphereLight(0xffffff, 0x445566, 0.6);
//     scene.add(hemi);
//     const sun = new THREE.DirectionalLight(0xffffff, 1.2);
//     sun.position.set(6, 10, 4);
//     sun.castShadow = true;
//     sun.shadow.mapSize.set(2048, 2048);
//     sun.shadow.camera.left = -10;
//     sun.shadow.camera.right = 10;
//     sun.shadow.camera.top = 10;
//     sun.shadow.camera.bottom = -10;
//     scene.add(sun);

//     const ambient = new THREE.AmbientLight(0xB3E5FC, 0.6);
//     const rimLight = new THREE.DirectionalLight(0x4FC3F7, 0.8);
//     rimLight.position.set(-5, 8, -5);
//     scene.add(rimLight);
//     scene.add(ambient);
//     lightsRef.current = { hemi, sun, ambient };

//     const ground = new THREE.Mesh(
//       new THREE.PlaneGeometry(60, 60),
//       new THREE.MeshStandardMaterial({ color: 0x08131F, roughness: 1 })
//     );
//     ground.rotation.x = -Math.PI / 2;
//     ground.receiveShadow = true;
//     scene.add(ground);

//     const grid = new THREE.GridHelper(60, 60, 0x0EA5E9, 0x0F4C81);
//     grid.material.transparent = true;
//     grid.material.opacity = 1;
//     grid.position.y = 0.01;
//     grid.name = 'grid';
//     scene.add(grid);

//     const ro = new ResizeObserver(() => {
//       const w = mount.clientWidth;
//       const h = mount.clientHeight;
//       if (w === 0 || h === 0) return;
//       camera.aspect = w / h;
//       camera.updateProjectionMatrix();
//       renderer.setSize(w, h);
//     });
//     ro.observe(mount);

//     const animate = () => {
//       frameId.current = requestAnimationFrame(animate);
//       renderer.render(scene, camera);
//     };
//     animate();

//     return () => {
//       ro.disconnect();
//       cancelAnimationFrame(frameId.current);
//       renderer.dispose();
//       if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ---- Rebuild building whenever selected property changes ----
//   useEffect(() => {
//     const scene = sceneRef.current;
//     if (!scene) return;
//     if (buildingGroupRef.current) {
//       scene.remove(buildingGroupRef.current);
//       disposeGroup(buildingGroupRef.current);
//     }
//     unitMeshesRef.current = [];
//     const group = buildPropertyModel(selectedProperty, (mesh) => unitMeshesRef.current.push(mesh));
//     scene.add(group);
//     buildingGroupRef.current = group;

//     const { totalHeight = 2, buildingWidth = 4 } = group.userData;
//     cam.current.target.set(0, totalHeight / 2, 0);
//     cam.current.radius = Math.max(6, buildingWidth * 1.6, totalHeight * 1.8);
//     updateCameraPosition();
//   }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

//   // ---- Day / Night ----
//   useEffect(() => {
//     const { hemi, sun, ambient } = lightsRef.current;
//     const scene = sceneRef.current;
//     if (!hemi || !scene) return;
//     if (dayMode) {
//       scene.background = new THREE.Color(0x071426);
//       hemi.intensity = 0.6; sun.intensity = 1.2; sun.color.set(0xffffff); ambient.intensity = 0.35;
//     } else {
//       scene.background = new THREE.Color(0x0b1120);
//       hemi.intensity = 0.2; sun.intensity = 0.4; sun.color.set(0x88aaff); ambient.intensity = 0.08;
//     }
//   }, [dayMode]);

//   useEffect(() => {
//     const grid = sceneRef.current?.getObjectByName('grid');
//     if (grid) grid.visible = showGrid;
//   }, [showGrid]);

//   // ---- Orbit / pan / zoom + unit hover picking ----
//   useEffect(() => {
//     const dom = rendererRef.current?.domElement;
//     if (!dom) return;

//     const pickUnit = (clientX, clientY) => {
//       const rect = dom.getBoundingClientRect();
//       const mouse = new THREE.Vector2(
//         ((clientX - rect.left) / rect.width) * 2 - 1,
//         -((clientY - rect.top) / rect.height) * 2 + 1
//       );
//       raycaster.current.setFromCamera(mouse, cameraRef.current);
//       const hits = raycaster.current.intersectObjects(unitMeshesRef.current, false);
//       if (hits.length > 0) {
//         setHoveredUnit(hits[0].object.userData.unit);
//         setMousePx({ x: clientX - rect.left, y: clientY - rect.top });
//       } else {
//         setHoveredUnit(null);
//       }
//     };

//     const onDown = (e) => {
//       dragState.current.dragging = true;
//       dragState.current.panning = e.button === 2 || e.shiftKey;
//       dragState.current.lastX = e.clientX;
//       dragState.current.lastY = e.clientY;
//     };
//     const onUp = () => { dragState.current.dragging = false; };
//     const onMove = (e) => {
//       if (!dragState.current.dragging) {
//         pickUnit(e.clientX, e.clientY);
//         return;
//       }
//       const dx = e.clientX - dragState.current.lastX;
//       const dy = e.clientY - dragState.current.lastY;
//       dragState.current.lastX = e.clientX;
//       dragState.current.lastY = e.clientY;

//       if (dragState.current.panning) {
//         const cameraEl = cameraRef.current;
//         const panSpeed = cam.current.radius * 0.0015;
//         const dir = new THREE.Vector3();
//         cameraEl.getWorldDirection(dir);
//         const rightVec = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
//         const upMove = new THREE.Vector3().crossVectors(rightVec, dir).normalize();
//         cam.current.target.addScaledVector(rightVec, -dx * panSpeed);
//         cam.current.target.addScaledVector(upMove, dy * panSpeed);
//       } else {
//         cam.current.theta -= dx * 0.006;
//         cam.current.phi -= dy * 0.006;
//       }
//       updateCameraPosition();
//       setHoveredUnit(null);
//     };
//     const onWheel = (e) => {
//       e.preventDefault();
//       cam.current.radius = Math.max(2.5, Math.min(50, cam.current.radius + e.deltaY * 0.01));
//       updateCameraPosition();
//     };
//     const onContext = (e) => e.preventDefault();

//     dom.addEventListener('mousedown', onDown);
//     window.addEventListener('mouseup', onUp);
//     window.addEventListener('mousemove', onMove);
//     dom.addEventListener('wheel', onWheel, { passive: false });
//     dom.addEventListener('contextmenu', onContext);

//     return () => {
//       dom.removeEventListener('mousedown', onDown);
//       window.removeEventListener('mouseup', onUp);
//       window.removeEventListener('mousemove', onMove);
//       dom.removeEventListener('wheel', onWheel);
//       dom.removeEventListener('contextmenu', onContext);
//     };
//   }, [updateCameraPosition]);

//   const resetView = () => {
//     const { totalHeight = 2, buildingWidth = 4 } = buildingGroupRef.current?.userData || {};
//     cam.current = {
//       theta: Math.PI / 4,
//       phi: 1.0,
//       radius: Math.max(6, buildingWidth * 1.6, totalHeight * 1.8),
//       target: new THREE.Vector3(0, totalHeight / 2, 0),
//     };
//     updateCameraPosition();
//   };

//   const data = normalizeProperty(selectedProperty);
//   const allUnits = data.floors.flatMap((f) => f.units);
//   const counts = allUnits.reduce((acc, u) => {
//     acc[u.status] = (acc[u.status] || 0) + 1;
//     return acc;
//   }, {});
//   const occupancyRate = allUnits.length ? Math.round(((counts.occupied || 0) / allUnits.length) * 100) : 0;

//   return (
//     <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, padding: 0, overflow: 'hidden' }}>
//       <div style={{
//         padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
//         background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)',
//         flexWrap: 'wrap', rowGap: 8,
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', fontWeight: 700, fontSize: 15, marginRight: 4 }}>
//           <Building2 size={18} style={{ color: 'var(--brand-color)' }} />
//           3D Property Tracker
//         </div>

//         <select
//           value={selectedId}
//           onChange={(e) => setSelectedId(e.target.value)}
//           className="form-select"
//           style={{ padding: '6px 10px', fontSize: 13, minWidth: 200, borderRadius: 8 }}
//         >
//           {propertyList.map((p) => (
//             <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
//           ))}
//         </select>

//         <div style={{ flex: 1, minWidth: 8 }} />

//         <button onClick={() => setDayMode(!dayMode)} className="btn btn-sm" style={btnStyle}>
//           {dayMode ? <Sun size={14} /> : <Moon size={14} />} {dayMode ? 'Day' : 'Night'}
//         </button>
//         <button onClick={() => setShowGrid(!showGrid)} className="btn btn-sm" style={btnStyle}>
//           <Grid3x3 size={14} /> Grid
//         </button>
//         <button onClick={resetView} className="btn btn-sm" style={btnStyle}>
//           <RotateCw size={14} /> Reset
//         </button>
//         <button onClick={() => { cam.current.radius = Math.max(2.5, cam.current.radius - 1.2); updateCameraPosition(); }} className="btn btn-sm" style={btnStyle}>
//           <ZoomIn size={14} />
//         </button>
//         <button onClick={() => { cam.current.radius = Math.min(50, cam.current.radius + 1.2); updateCameraPosition(); }} className="btn btn-sm" style={btnStyle}>
//           <ZoomOut size={14} />
//         </button>
//       </div>

//       <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
//         <div ref={mountRef} style={{ flex: 1, minWidth: 0, position: 'relative', cursor: dragState.current.dragging ? 'grabbing' : 'grab' }}>
//           <div style={{
//             position: 'absolute', top: 12, left: 12, display: 'flex', gap: 10,
//             background: 'rgba(15,23,42,0.72)', padding: '6px 10px', borderRadius: 8,
//             fontSize: 11, color: '#e2e8f0', zIndex: 2,
//           }}>
//             {Object.entries(STATUS_LABEL).map(([key, label]) => (
//               <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//                 <span style={{
//                   width: 8, height: 8, borderRadius: '50%',
//                   background: `#${STATUS_COLOR[key].toString(16).padStart(6, '0')}`,
//                   boxShadow: `0 0 6px #${STATUS_COLOR[key].toString(16).padStart(6, '0')}`,
//                 }} />
//                 {label}
//               </div>
//             ))}
//           </div>

//           {hoveredUnit && (
//             <div style={{
//               position: 'absolute', left: Math.min(mousePx.x + 14, 9999), top: Math.max(mousePx.y - 10, 0),
//               background: 'rgba(15,23,42,0.94)', border: '1px solid #334155', borderRadius: 8,
//               padding: '10px 12px', color: '#f1f5f9', fontSize: 12, minWidth: 160, zIndex: 3, pointerEvents: 'none',
//             }}>
//               <div style={{ fontWeight: 700, marginBottom: 3 }}>{hoveredUnit.id}</div>
//               <div>Status: {STATUS_LABEL[hoveredUnit.status] || hoveredUnit.status}</div>
//               {hoveredUnit.tenant && <div>Tenant: {hoveredUnit.tenant}</div>}
//               {hoveredUnit.area && <div>Area: {hoveredUnit.area} sq ft</div>}
//               {hoveredUnit.rent && <div>Rent: ${hoveredUnit.rent.toLocaleString()}/mo</div>}
//             </div>
//           )}

//           <div style={{
//             position: 'absolute', bottom: 10, left: 12, color: '#94a3b8', fontSize: 11,
//             background: 'rgba(15,23,42,0.55)', padding: '4px 8px', borderRadius: 6, zIndex: 2,
//           }}>
//             Drag to orbit • Shift/right-drag to pan • Scroll to zoom • Hover a bay for unit info
//           </div>
//         </div>

//         <div style={{
//           width: 220, flexShrink: 0, borderLeft: '1px solid var(--border-color)',
//           background: 'var(--bg-secondary)', padding: 16, overflowY: 'auto',
//         }}>
//           <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>
//             {selectedProperty.name}
//           </div>
//           <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 14 }}>{selectedProperty.id}</div>

//           <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--brand-color)', lineHeight: 1 }}>{occupancyRate}%</div>
//           <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 16 }}>Occupancy rate</div>

//           {Object.entries(STATUS_LABEL).map(([key, label]) => (
//             counts[key] ? (
//               <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
//                 <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//                   <span style={{ width: 8, height: 8, borderRadius: '50%', background: `#${STATUS_COLOR[key].toString(16).padStart(6, '0')}` }} />
//                   {label}
//                 </span>
//                 <span style={{ fontWeight: 600 }}>{counts[key]}</span>
//               </div>
//             ) : null
//           ))}

//           <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
//             Floors: <strong style={{ color: 'var(--text-primary)' }}>{data.floors.length}</strong><br />
//             Total units: <strong style={{ color: 'var(--text-primary)' }}>{allUnits.length}</strong>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const btnStyle = { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 };


import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Home, RotateCw, ZoomIn, ZoomOut, Sun, Moon, Grid3x3, Building2 } from 'lucide-react';
import {
  STATUS_COLOR,
  STATUS_LABEL,
  disposeGroup,
  normalizeProperty,
  buildPropertyModel,
} from './propertyBuildingModel';

export default function PropertyMall3DView({ properties = [] }) {
  // console.log(properties)
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const buildingGroupRef = useRef(null);
  const lightsRef = useRef({});
  const frameId = useRef(null);
  const raycaster = useRef(new THREE.Raycaster());
  const unitMeshesRef = useRef([]);

  const fallbackProperties = [
    { id: 'PROP-9910', name: 'Stratford Tower', unitsCount: 12, occupied: 7, vacant: 3, maintenance: 2, rent: 96000, area: 18000 },
  ];
  const propertyList = properties.length > 0 ? properties : fallbackProperties;

  const [selectedId, setSelectedId] = useState(propertyList[0].id);
  const [dayMode, setDayMode] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [hoveredUnit, setHoveredUnit] = useState(null);
  const [mousePx, setMousePx] = useState({ x: 0, y: 0 });

  const selectedProperty = propertyList.find((p) => p.id === selectedId) || propertyList[0];

  const cam = useRef({ theta: Math.PI / 4, phi: 1.0, radius: 8, target: new THREE.Vector3(0, 1.5, 0) });
  const dragState = useRef({ dragging: false, panning: false, lastX: 0, lastY: 0 });

  const updateCameraPosition = useCallback(() => {
    const { theta, phi, radius, target } = cam.current;
    const clampedPhi = Math.max(0.08, Math.min(Math.PI - 0.08, phi));
    cam.current.phi = clampedPhi;
    const x = target.x + radius * Math.sin(clampedPhi) * Math.sin(theta);
    const y = target.y + radius * Math.cos(clampedPhi);
    const z = target.z + radius * Math.sin(clampedPhi) * Math.cos(theta);
    if (cameraRef.current) {
      cameraRef.current.position.set(x, y, z);
      cameraRef.current.lookAt(target);
    }
  }, []);

  // ---- Scene setup (once) ----
  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x071426);
    scene.fog = new THREE.FogExp2(0x071426, 0.03);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 200);
    cameraRef.current = camera;
    updateCameraPosition();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const hemi = new THREE.HemisphereLight(0xffffff, 0x445566, 0.6);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(6, 10, 4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -10;
    sun.shadow.camera.right = 10;
    sun.shadow.camera.top = 10;
    sun.shadow.camera.bottom = -10;
    scene.add(sun);

    const ambient = new THREE.AmbientLight(0xB3E5FC, 0.6);
    const rimLight = new THREE.DirectionalLight(0x4FC3F7, 0.8);
    rimLight.position.set(-5, 8, -5);
    scene.add(rimLight);
    scene.add(ambient);
    lightsRef.current = { hemi, sun, ambient };

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({ color: 0x08131F, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(60, 60, 0x0EA5E9, 0x0F4C81);
    grid.material.transparent = true;
    grid.material.opacity = 1;
    grid.position.y = 0.01;
    grid.name = 'grid';
    scene.add(grid);

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    const animate = () => {
      frameId.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(frameId.current);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Rebuild building whenever selected property changes ----
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (buildingGroupRef.current) {
      scene.remove(buildingGroupRef.current);
      disposeGroup(buildingGroupRef.current);
    }
    unitMeshesRef.current = [];
    const group = buildPropertyModel(selectedProperty, (mesh) => unitMeshesRef.current.push(mesh));
    scene.add(group);
    buildingGroupRef.current = group;

    const { totalHeight = 2, buildingWidth = 4 } = group.userData;
    cam.current.target.set(0, totalHeight / 2, 0);
    cam.current.radius = Math.max(6, buildingWidth * 1.6, totalHeight * 1.8);
    updateCameraPosition();
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Day / Night ----
  useEffect(() => {
    const { hemi, sun, ambient } = lightsRef.current;
    const scene = sceneRef.current;
    if (!hemi || !scene) return;
    if (dayMode) {
      scene.background = new THREE.Color(0x071426);
      hemi.intensity = 0.6; sun.intensity = 1.2; sun.color.set(0xffffff); ambient.intensity = 0.35;
    } else {
      scene.background = new THREE.Color(0x0b1120);
      hemi.intensity = 0.2; sun.intensity = 0.4; sun.color.set(0x88aaff); ambient.intensity = 0.08;
    }
  }, [dayMode]);

  useEffect(() => {
    const grid = sceneRef.current?.getObjectByName('grid');
    if (grid) grid.visible = showGrid;
  }, [showGrid]);

  // ---- Orbit / pan / zoom + unit hover picking ----
  useEffect(() => {
    const dom = rendererRef.current?.domElement;
    if (!dom) return;

    const pickUnit = (clientX, clientY) => {
      const rect = dom.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.current.setFromCamera(mouse, cameraRef.current);
      const hits = raycaster.current.intersectObjects(unitMeshesRef.current, false);
      if (hits.length > 0) {
        setHoveredUnit(hits[0].object.userData.unit);
        setMousePx({ x: clientX - rect.left, y: clientY - rect.top });
      } else {
        setHoveredUnit(null);
      }
    };

    const onDown = (e) => {
      dragState.current.dragging = true;
      dragState.current.panning = e.button === 2 || e.shiftKey;
      dragState.current.lastX = e.clientX;
      dragState.current.lastY = e.clientY;
    };
    const onUp = () => { dragState.current.dragging = false; };
    const onMove = (e) => {
      if (!dragState.current.dragging) {
        pickUnit(e.clientX, e.clientY);
        return;
      }
      const dx = e.clientX - dragState.current.lastX;
      const dy = e.clientY - dragState.current.lastY;
      dragState.current.lastX = e.clientX;
      dragState.current.lastY = e.clientY;

      if (dragState.current.panning) {
        const cameraEl = cameraRef.current;
        const panSpeed = cam.current.radius * 0.0015;
        const dir = new THREE.Vector3();
        cameraEl.getWorldDirection(dir);
        const rightVec = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
        const upMove = new THREE.Vector3().crossVectors(rightVec, dir).normalize();
        cam.current.target.addScaledVector(rightVec, -dx * panSpeed);
        cam.current.target.addScaledVector(upMove, dy * panSpeed);
      } else {
        cam.current.theta -= dx * 0.006;
        cam.current.phi -= dy * 0.006;
      }
      updateCameraPosition();
      setHoveredUnit(null);
    };
    const onWheel = (e) => {
      e.preventDefault();
      cam.current.radius = Math.max(2.5, Math.min(50, cam.current.radius + e.deltaY * 0.01));
      updateCameraPosition();
    };
    const onContext = (e) => e.preventDefault();

    dom.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('contextmenu', onContext);

    return () => {
      dom.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('contextmenu', onContext);
    };
  }, [updateCameraPosition]);

  const resetView = () => {
    const { totalHeight = 2, buildingWidth = 4 } = buildingGroupRef.current?.userData || {};
    cam.current = {
      theta: Math.PI / 4,
      phi: 1.0,
      radius: Math.max(6, buildingWidth * 1.6, totalHeight * 1.8),
      target: new THREE.Vector3(0, totalHeight / 2, 0),
    };
    updateCameraPosition();
  };

  const data = normalizeProperty(selectedProperty);
  const allUnits = data.floors.flatMap((f) => f.units);
  const counts = allUnits.reduce((acc, u) => {
    acc[u.status] = (acc[u.status] || 0) + 1;
    return acc;
  }, {});
  const occupancyRate = allUnits.length ? Math.round(((counts.occupied || 0) / allUnits.length) * 100) : 0;

  return (
    <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, padding: 0, overflow: 'hidden' }}>
      <div style={{
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)',
        flexWrap: 'wrap', rowGap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', fontWeight: 700, fontSize: 15, marginRight: 4 }}>
          <Building2 size={18} style={{ color: 'var(--brand-color)' }} />
          3D Property Tracker
        </div>

        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="form-select"
          style={{ padding: '6px 10px', fontSize: 13, minWidth: 200, borderRadius: 8 }}
        >
          {propertyList.map((p) => (
            <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
          ))}
        </select>

        <div style={{ flex: 1, minWidth: 8 }} />

        <button onClick={() => setDayMode(!dayMode)} className="btn btn-sm" style={btnStyle}>
          {dayMode ? <Sun size={14} /> : <Moon size={14} />} {dayMode ? 'Day' : 'Night'}
        </button>
        <button onClick={() => setShowGrid(!showGrid)} className="btn btn-sm" style={btnStyle}>
          <Grid3x3 size={14} /> Grid
        </button>
        <button onClick={resetView} className="btn btn-sm" style={btnStyle}>
          <RotateCw size={14} /> Reset
        </button>
        <button onClick={() => { cam.current.radius = Math.max(2.5, cam.current.radius - 1.2); updateCameraPosition(); }} className="btn btn-sm" style={btnStyle}>
          <ZoomIn size={14} />
        </button>
        <button onClick={() => { cam.current.radius = Math.min(50, cam.current.radius + 1.2); updateCameraPosition(); }} className="btn btn-sm" style={btnStyle}>
          <ZoomOut size={14} />
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div ref={mountRef} style={{ flex: 1, minWidth: 0, position: 'relative', cursor: dragState.current.dragging ? 'grabbing' : 'grab' }}>
          <div style={{
            position: 'absolute', top: 12, left: 12, display: 'flex', gap: 10,
            background: 'rgba(15,23,42,0.72)', padding: '6px 10px', borderRadius: 8,
            fontSize: 11, color: '#e2e8f0', zIndex: 2,
          }}>
            {Object.entries(STATUS_LABEL).map(([key, label]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: `#${STATUS_COLOR[key].toString(16).padStart(6, '0')}`,
                  boxShadow: `0 0 6px #${STATUS_COLOR[key].toString(16).padStart(6, '0')}`,
                }} />
                {label}
              </div>
            ))}
          </div>

          {hoveredUnit && (
            <div style={{
              position: 'absolute', left: Math.min(mousePx.x + 14, 9999), top: Math.max(mousePx.y - 10, 0),
              background: 'rgba(15,23,42,0.94)', border: '1px solid #334155', borderRadius: 8,
              padding: '10px 12px', color: '#f1f5f9', fontSize: 12, minWidth: 160, zIndex: 3, pointerEvents: 'none',
            }}>
              <div style={{ fontWeight: 700, marginBottom: 3 }}>{hoveredUnit.id}</div>
              <div>Status: {STATUS_LABEL[hoveredUnit.status] || hoveredUnit.status}</div>
              {hoveredUnit.tenant && <div>Tenant: {hoveredUnit.tenant}</div>}
              {hoveredUnit.area && <div>Area: {hoveredUnit.area} sq ft</div>}
              {hoveredUnit.rent && <div>Rent: ${hoveredUnit.rent.toLocaleString()}/mo</div>}
            </div>
          )}

          <div style={{
            position: 'absolute', bottom: 10, left: 12, color: '#94a3b8', fontSize: 11,
            background: 'rgba(15,23,42,0.55)', padding: '4px 8px', borderRadius: 6, zIndex: 2,
          }}>
            Drag to orbit • Shift/right-drag to pan • Scroll to zoom • Hover a bay for unit info
          </div>
        </div>

        <div style={{
          width: 220, flexShrink: 0, borderLeft: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)', padding: 16, overflowY: 'auto',
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>
            {selectedProperty.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 14 }}>{selectedProperty.id}</div>

          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--brand-color)', lineHeight: 1 }}>{occupancyRate}%</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 16 }}>Occupancy rate</div>

          {Object.entries(STATUS_LABEL).map(([key, label]) => (
            counts[key] ? (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: `#${STATUS_COLOR[key].toString(16).padStart(6, '0')}` }} />
                  {label}
                </span>
                <span style={{ fontWeight: 600 }}>{counts[key]}</span>
              </div>
            ) : null
          ))}

          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
            Floors: <strong style={{ color: 'var(--text-primary)' }}>{data.floors.length}</strong><br />
            Total units: <strong style={{ color: 'var(--text-primary)' }}>{allUnits.length}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

const btnStyle = { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 };