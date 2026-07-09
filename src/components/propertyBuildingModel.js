// // // import * as THREE from 'three';

// // // /* -------------------------------------------------------------------------
// // //    STATUS CONFIG
// // //    Each status has a base color PLUS its own glow profile, so occupancy
// // //    reads instantly from brightness alone (not just hue):
// // //      - occupied     -> brightest, strong steady inner glow
// // //      - maintenance  -> medium glow, slightly warmer/punchier so it still
// // //                        pops next to occupied bays
// // //      - vacant       -> dim, low glow (reads as "dark/empty" at a glance)
// // //      - aggregated   -> soft highlight, used for merged/combined units
// // // ------------------------------------------------------------------------- */
// // // export const STATUS_COLOR = {
// // //   occupied: 0x00D4FF,      // brightest
// // //   maintenance: 0x0099CC,   // medium
// // //   vacant: 0x005F80,        // darker
// // //   aggregated: 0x7DD3FC,    // soft highlight
// // // };

// // // export const STATUS_LABEL = {
// // //   occupied: 'Occupied',
// // //   vacant: 'Vacant',
// // //   maintenance: 'Maintenance',
// // //   aggregated: 'Merged',
// // // };

// // // // Inner-glow / brightness profile per status.
// // // // glassEmissive   -> emissiveIntensity on the glass facade panel (the "inner glow")
// // // // glassOpacity    -> how solid/lit the glass bay looks
// // // // lightEmissive   -> emissiveIntensity on the status strip beneath the bay
// // // // frameEmissive   -> tiny boost/dim on the structural frame tint near that bay
// // // export const STATUS_GLOW = {
// // //   occupied: {
// // //     glassEmissive: 0.85,
// // //     glassOpacity: 0.55,
// // //     lightEmissive: 1.4,
// // //     frameEmissive: 0.3,
// // //   },
// // //   maintenance: {
// // //     glassEmissive: 0.55,
// // //     glassOpacity: 0.45,
// // //     lightEmissive: 1.0,
// // //     frameEmissive: 0.22,
// // //   },
// // //   vacant: {
// // //     glassEmissive: 0.18,
// // //     glassOpacity: 0.28,
// // //     lightEmissive: 0.45,
// // //     frameEmissive: 0.12,
// // //   },
// // //   aggregated: {
// // //     glassEmissive: 0.5,
// // //     glassOpacity: 0.4,
// // //     lightEmissive: 0.9,
// // //     frameEmissive: 0.2,
// // //   },
// // // };

// // // function getGlow(status) {
// // //   return STATUS_GLOW[status] || STATUS_GLOW.vacant;
// // // }

// // // /* -------------------------------------------------------------------------
// // //    UTILITIES
// // // ------------------------------------------------------------------------- */
// // // export function disposeGroup(group) {
// // //   group.traverse((obj) => {
// // //     if (obj.geometry) obj.geometry.dispose();
// // //     if (obj.material) {
// // //       if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
// // //       else obj.material.dispose();
// // //     }
// // //   });
// // // }

// // // export function makeBox(w, h, d, color, opts = {}) {
// // //   const geo = new THREE.BoxGeometry(w, h, d);
// // //   const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.05, ...opts });
// // //   const mesh = new THREE.Mesh(geo, mat);
// // //   mesh.castShadow = true;
// // //   mesh.receiveShadow = true;
// // //   return mesh;
// // // }

// // // /* -------------------------------------------------------------------------
// // //    NORMALIZE PROPERTY DATA -> FLOORS OF UNITS
// // //    Accepts whatever shape the app passes in (property groups from ERPNext)
// // //    and produces a consistent { floors: [{ units: [{id,status,tenant,...}] }] }
// // //    structure to render. Falls back to a deterministic synthetic layout if the
// // //    property only has summary counts (unitsCount / occupied / vacant etc).
// // // ------------------------------------------------------------------------- */
// // // export function normalizeProperty(property) {
// // //   if (!property) return { floors: [{ units: [{ id: 'U1', status: 'vacant' }] }] };

// // //   if (Array.isArray(property.floors) && property.floors.length > 0) {
// // //     return property;
// // //   }

// // //   if (Array.isArray(property.units) && property.units.length > 0) {
// // //     const floorsMap = {};
// // //     property.units.forEach((u) => {
// // //       const f = u.floor ?? 0;
// // //       if (!floorsMap[f]) floorsMap[f] = [];
// // //       floorsMap[f].push(u);
// // //     });
// // //     const floors = Object.keys(floorsMap)
// // //       .sort((a, b) => Number(a) - Number(b))
// // //       .map((f) => ({ units: floorsMap[f] }));
// // //     return { ...property, floors };
// // //   }

// // //   // Synthetic fallback from summary counts
// // //   const total = property.unitsCount || 6;
// // //   const occupiedCount = property.occupied ?? Math.round(total * 0.6);
// // //   const maintenanceCount = property.maintenance ?? Math.max(0, Math.round(total * 0.1));
// // //   const vacantCount = Math.max(0, total - occupiedCount - maintenanceCount);

// // //   const statuses = [
// // //     ...Array(occupiedCount).fill('occupied'),
// // //     ...Array(vacantCount).fill('vacant'),
// // //     ...Array(maintenanceCount).fill('maintenance'),
// // //   ];
// // //   while (statuses.length < total) statuses.push('vacant');

// // //   const unitsPerFloor = Math.max(2, Math.min(4, Math.ceil(total / Math.max(1, Math.ceil(total / 4)))));
// // //   const floors = [];
// // //   for (let i = 0; i < statuses.length; i += unitsPerFloor) {
// // //     floors.push({
// // //       units: statuses.slice(i, i + unitsPerFloor).map((status, idx) => ({
// // //         id: `F${floors.length + 1}-${idx + 1}`,
// // //         status,
// // //         tenant: status === 'occupied' ? 'Tenant' : null,
// // //         rent: property.rent ? Math.round(property.rent / total) : null,
// // //         area: property.area ? Math.round(property.area / total) : null,
// // //       })),
// // //     });
// // //   }
// // //   return { ...property, floors };
// // // }

// // // /* -------------------------------------------------------------------------
// // //    BUILD A 3D BUILDING FROM NORMALIZED PROPERTY DATA
// // //    Each floor is a horizontal slab; each unit on a floor is a vertical glass
// // //    bay colored by occupancy status. A roof + entrance + ground plate complete
// // //    the read of "this is a real building", not an abstract block.

// // //    Brightness/inner-glow is now driven per-status via STATUS_GLOW so that,
// // //    independent of hue, occupied bays read as brightest/most-lit, maintenance
// // //    bays sit at a medium glow, and vacant bays look dim/dark.
// // // ------------------------------------------------------------------------- */
// // // export function buildPropertyModel(property, onUnitMeta) {
// // //   const data = normalizeProperty(property);
// // //   const group = new THREE.Group();
// // //   const floorHeight = 1.6;
// // //   const bayWidth = 1.1;
// // //   const depth = 2.2;

// // //   const maxUnitsPerFloor = Math.max(...data.floors.map((f) => f.units.length), 1);
// // //   const buildingWidth = maxUnitsPerFloor * bayWidth;

// // //   // Foundation slab
// // //   const base = makeBox(buildingWidth + 0.6, 0.25, depth + 0.6, 0x9ca3af);
// // //   base.position.y = 0.125;
// // //   group.add(base);

// // //   data.floors.forEach((floor, floorIdx) => {
// // //     const y = 0.25 + floorIdx * floorHeight + floorHeight / 2;
// // //     const floorWidth = floor.units.length * bayWidth;
// // //     const startX = -floorWidth / 2 + bayWidth / 2;

// // //     // Floor slab edge (subtle horizontal banding between levels)
// // //     const slab = makeBox(floorWidth + 0.2, 0.08, depth + 0.2, 0x1f2937);
// // //     slab.position.set(0, y - floorHeight / 2, 0);
// // //     group.add(slab);

// // //     floor.units.forEach((unit, unitIdx) => {
// // //       const x = startX + unitIdx * bayWidth;
// // //       const color = STATUS_COLOR[unit.status] || STATUS_COLOR.vacant;
// // //       const glow = getGlow(unit.status);

// // //       // Structural frame (concrete mullions) — subtle brightness nudge per status
// // //       const frameMat = new THREE.MeshPhysicalMaterial({
// // //         color: 0x66CCFF,
// // //         transparent: true,
// // //         opacity: 0.2,
// // //         emissive: 0x66CCFF,
// // //         emissiveIntensity: glow.frameEmissive,
// // //       });

// // //       const frame = new THREE.Mesh(
// // //         new THREE.BoxGeometry(
// // //           bayWidth - 0.2,
// // //           floorHeight - 0.1,
// // //           depth - 0.1
// // //         ),
// // //         frameMat
// // //       );
// // //       frame.position.set(x, y, 0);
// // //       group.add(frame);
// // //       const edges = new THREE.LineSegments(
// // //         new THREE.EdgesGeometry(frame.geometry),
// // //         new THREE.LineBasicMaterial({
// // //           color: 0x66CCFF
// // //         })
// // //       );

// // //       edges.position.copy(frame.position);

// // //       group.add(edges);

// // //       // Glass facade panel (front face) — colored AND brightness-graded by
// // //       // occupancy status, so it reads as an inner glow rather than a flat tint.
// // //       const glassGeo = new THREE.BoxGeometry(
// // //         bayWidth - 0.16,
// // //         floorHeight - 0.3,
// // //         0.04
// // //       );

// // //       const glassMat = new THREE.MeshPhysicalMaterial({
// // //         color,
// // //         transparent: true,
// // //         opacity: glow.glassOpacity,
// // //         transmission: 1,
// // //         roughness: 0,
// // //         metalness: 0,
// // //         emissive: color,
// // //         emissiveIntensity: glow.glassEmissive,
// // //       });

// // //       const glass = new THREE.Mesh(
// // //         glassGeo,
// // //         glassMat
// // //       );

// // //       glass.position.set(x, y, depth / 2 - 0.05 + 0.02);
// // //       glass.userData = { unit, floorIdx };
// // //       group.add(glass);
// // //       if (onUnitMeta) onUnitMeta(glass, unit);

// // //       // Status indicator light strip beneath the bay — brightest for occupied,
// // //       // dimmest for vacant, so the glow profile is visible even from a distance.
// // //       const light = makeBox(bayWidth - 0.3, 0.05, 0.05, color, {
// // //         emissive: color,
// // //         emissiveIntensity: glow.lightEmissive,
// // //       });
// // //       light.position.set(x, y - floorHeight / 2 + 0.06, depth / 2 + 0.02);
// // //       group.add(light);
// // //     });
// // //   });

// // //   const totalHeight = 0.25 + data.floors.length * floorHeight;

// // //   // Roof cap
// // //   const roof = makeBox(buildingWidth + 0.5, 0.18, depth + 0.5, 0x374151);
// // //   roof.position.set(0, totalHeight + 0.09, 0);
// // //   group.add(roof);

// // //   // Rooftop mechanical block for visual interest on taller buildings
// // //   if (data.floors.length >= 3) {
// // //     const mech = makeBox(buildingWidth * 0.35, 0.5, depth * 0.4, 0x4b5563);
// // //     mech.position.set(0, totalHeight + 0.18 + 0.25, 0);
// // //     group.add(mech);
// // //   }

// // //   // Entrance canopy
// // //   const canopy = makeBox(1.6, 0.08, 0.9, 0x111827);
// // //   canopy.position.set(0, 0.55, depth / 2 + 0.55);
// // //   group.add(canopy);
// // //   const door = makeBox(0.9, 0.9, 0.05, 0x0f172a);
// // //   door.position.set(0, 0.45, depth / 2 + 0.07);
// // //   group.add(door);

// // //   group.userData = { buildingWidth, totalHeight, floorCount: data.floors.length };

// // //   // Blueprint wireframe overlay
// // //   group.traverse((obj) => {
// // //     if (obj.isMesh) {
// // //       const wire = new THREE.LineSegments(
// // //         new THREE.EdgesGeometry(obj.geometry),
// // //         new THREE.LineBasicMaterial({
// // //           color: 0x7DD3FC,
// // //           transparent: true,
// // //           opacity: 0.9,
// // //         })
// // //       );

// // //       wire.position.copy(obj.position);
// // //       wire.rotation.copy(obj.rotation);
// // //       wire.scale.copy(obj.scale);

// // //       group.add(wire);
// // //     }
// // //   });
// // //   return group;
// // // }

// // import * as THREE from 'three';

// // /* -------------------------------------------------------------------------
// //    STATUS CONFIG
// //    Each status has a base color PLUS its own glow profile, so occupancy
// //    reads instantly from brightness alone (not just hue):
// //      - occupied     -> brightest, strong steady inner glow
// //      - maintenance  -> medium glow, slightly warmer/punchier so it still
// //                        pops next to occupied bays
// //      - vacant       -> dim, low glow (reads as "dark/empty" at a glance)
// //      - aggregated   -> soft highlight, used for merged/combined units
// // ------------------------------------------------------------------------- */
// // export const STATUS_COLOR = {
// //   occupied: 0x00D4FF,      // brightest
// //   maintenance: 0x0099CC,   // medium
// //   vacant: 0x005F80,        // darker
// //   aggregated: 0x7DD3FC,    // soft highlight
// // };

// // export const STATUS_LABEL = {
// //   occupied: 'Occupied',
// //   vacant: 'Vacant',
// //   maintenance: 'Maintenance',
// //   aggregated: 'Merged',
// // };

// // // Inner-glow / brightness profile per status.
// // // glassEmissive   -> emissiveIntensity on the glass facade panel (the "inner glow")
// // // glassOpacity    -> how solid/lit the glass bay looks
// // // lightEmissive   -> emissiveIntensity on the status strip beneath the bay
// // // frameEmissive   -> tiny boost/dim on the structural frame tint near that bay
// // export const STATUS_GLOW = {
// //   occupied: {
// //     glassEmissive: 0.85,
// //     glassOpacity: 0.55,
// //     lightEmissive: 1.4,
// //     frameEmissive: 0.3,
// //   },
// //   maintenance: {
// //     glassEmissive: 0.55,
// //     glassOpacity: 0.45,
// //     lightEmissive: 1.0,
// //     frameEmissive: 0.22,
// //   },
// //   vacant: {
// //     glassEmissive: 0.18,
// //     glassOpacity: 0.28,
// //     lightEmissive: 0.45,
// //     frameEmissive: 0.12,
// //   },
// //   aggregated: {
// //     glassEmissive: 0.5,
// //     glassOpacity: 0.4,
// //     lightEmissive: 0.9,
// //     frameEmissive: 0.2,
// //   },
// // };

// // function getGlow(status) {
// //   return STATUS_GLOW[status] || STATUS_GLOW.vacant;
// // }

// // /* -------------------------------------------------------------------------
// //    UTILITIES
// // ------------------------------------------------------------------------- */
// // export function disposeGroup(group) {
// //   group.traverse((obj) => {
// //     if (obj.geometry) obj.geometry.dispose();
// //     if (obj.material) {
// //       if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
// //       else obj.material.dispose();
// //     }
// //   });
// // }

// // export function makeBox(w, h, d, color, opts = {}) {
// //   const geo = new THREE.BoxGeometry(w, h, d);
// //   const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.05, ...opts });
// //   const mesh = new THREE.Mesh(geo, mat);
// //   mesh.castShadow = true;
// //   mesh.receiveShadow = true;
// //   return mesh;
// // }

// // /* -------------------------------------------------------------------------
// //    NORMALIZE PROPERTY DATA -> FLOORS OF UNITS
// //    Accepts whatever shape the app passes in (property groups from ERPNext)
// //    and produces a consistent { floors: [{ units: [{id,status,tenant,...}] }] }
// //    structure to render. Falls back to a deterministic synthetic layout if the
// //    property only has summary counts (unitsCount / occupied / vacant etc).
// // ------------------------------------------------------------------------- */
// // export function normalizeProperty(property) {
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

// //    Brightness/inner-glow is now driven per-status via STATUS_GLOW so that,
// //    independent of hue, occupied bays read as brightest/most-lit, maintenance
// //    bays sit at a medium glow, and vacant bays look dim/dark.
// // ------------------------------------------------------------------------- */
// // export function buildPropertyModel(property, onUnitMeta) {
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
// //       const glow = getGlow(unit.status);

// //       // Structural frame (concrete mullions) — subtle brightness nudge per status
// //       const frameMat = new THREE.MeshPhysicalMaterial({
// //         color: 0x66CCFF,
// //         transparent: true,
// //         opacity: 0.2,
// //         emissive: 0x66CCFF,
// //         emissiveIntensity: glow.frameEmissive,
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

// //       // Glass facade panel (front face) — colored AND brightness-graded by
// //       // occupancy status, so it reads as an inner glow rather than a flat tint.
// //       const glassGeo = new THREE.BoxGeometry(
// //         bayWidth - 0.16,
// //         floorHeight - 0.3,
// //         0.04
// //       );

// //       const glassMat = new THREE.MeshPhysicalMaterial({
// //         color,
// //         transparent: true,
// //         opacity: glow.glassOpacity,
// //         transmission: 1,
// //         roughness: 0,
// //         metalness: 0,
// //         emissive: color,
// //         emissiveIntensity: glow.glassEmissive,
// //       });

// //       const glass = new THREE.Mesh(
// //         glassGeo,
// //         glassMat
// //       );

// //       glass.position.set(x, y, depth / 2 - 0.05 + 0.02);
// //       glass.userData = { unit, floorIdx };
// //       group.add(glass);
// //       if (onUnitMeta) onUnitMeta(glass, unit);

// //       // Status indicator light strip beneath the bay — brightest for occupied,
// //       // dimmest for vacant, so the glow profile is visible even from a distance.
// //       const light = makeBox(bayWidth - 0.3, 0.05, 0.05, color, {
// //         emissive: color,
// //         emissiveIntensity: glow.lightEmissive,
// //       });
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


// import * as THREE from 'three';

// /* -------------------------------------------------------------------------
//    STATUS CONFIG
//    Each status has a base color PLUS its own glow profile, so occupancy
//    reads instantly from brightness alone (not just hue):
//      - occupied     -> brightest, strong steady inner glow
//      - maintenance  -> medium glow, slightly warmer/punchier so it still
//                        pops next to occupied bays
//      - vacant       -> dim, low glow (reads as "dark/empty" at a glance)
//      - aggregated   -> soft highlight, used for merged/combined units
// ------------------------------------------------------------------------- */
// export const STATUS_COLOR = {
//   occupied: 0x00D4FF,      // brightest
//   maintenance: 0x0099CC,   // medium
//   vacant: 0x005F80,        // darker
//   aggregated: 0x7DD3FC,    // soft highlight
// };

// export const STATUS_LABEL = {
//   occupied: 'Occupied',
//   vacant: 'Vacant',
//   maintenance: 'Maintenance',
//   aggregated: 'Merged',
// };

// // Inner-glow / brightness profile per status.
// // glassEmissive   -> emissiveIntensity on the glass facade panel (the "inner glow")
// // glassOpacity    -> how solid/lit the glass bay looks
// // lightEmissive   -> emissiveIntensity on the status strip beneath the bay
// // frameEmissive   -> tiny boost/dim on the structural frame tint near that bay
// export const STATUS_GLOW = {
//   occupied: {
//     glassEmissive: 0.85,
//     glassOpacity: 0.55,
//     lightEmissive: 1.4,
//     frameEmissive: 0.3,
//   },
//   maintenance: {
//     glassEmissive: 0.55,
//     glassOpacity: 0.45,
//     lightEmissive: 1.0,
//     frameEmissive: 0.22,
//   },
//   vacant: {
//     glassEmissive: 0.18,
//     glassOpacity: 0.28,
//     lightEmissive: 0.45,
//     frameEmissive: 0.12,
//   },
//   aggregated: {
//     glassEmissive: 0.5,
//     glassOpacity: 0.4,
//     lightEmissive: 0.9,
//     frameEmissive: 0.2,
//   },
// };

// function getGlow(status) {
//   return STATUS_GLOW[status] || STATUS_GLOW.vacant;
// }

// /* -------------------------------------------------------------------------
//    UTILITIES
// ------------------------------------------------------------------------- */
// export function disposeGroup(group) {
//   group.traverse((obj) => {
//     if (obj.geometry) obj.geometry.dispose();
//     if (obj.material) {
//       if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
//       else obj.material.dispose();
//     }
//   });
// }

// export function makeBox(w, h, d, color, opts = {}) {
//   const geo = new THREE.BoxGeometry(w, h, d);
//   const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.05, ...opts });
//   const mesh = new THREE.Mesh(geo, mat);
//   mesh.castShadow = true;
//   mesh.receiveShadow = true;
//   return mesh;
// }

// /* -------------------------------------------------------------------------
//    NORMALIZE PROPERTY DATA -> FLOORS OF UNITS
//    Accepts whatever shape the app passes in (property groups from ERPNext)
//    and produces a consistent { floors: [{ units: [{id,status,tenant,...}] }] }
//    structure to render. Falls back to a deterministic synthetic layout if the
//    property only has summary counts (unitsCount / occupied / vacant etc).
// ------------------------------------------------------------------------- */
// export function normalizeProperty(property) {
//   if (!property) return { floors: [{ units: [{ id: 'U1', status: 'vacant' }] }] };

//   if (Array.isArray(property.floors) && property.floors.length > 0) {
//     return property;
//   }

//   if (Array.isArray(property.units) && property.units.length > 0) {
//     const floorsMap = {};
//     property.units.forEach((u) => {
//       const f = u.floor ?? 0;
//       if (!floorsMap[f]) floorsMap[f] = [];
//       floorsMap[f].push(u);
//     });
//     const floors = Object.keys(floorsMap)
//       .sort((a, b) => Number(a) - Number(b))
//       .map((f) => ({ units: floorsMap[f] }));
//     return { ...property, floors };
//   }

//   // Synthetic fallback from summary counts
//   const total = property.unitsCount || 6;
//   const occupiedCount = property.occupied ?? Math.round(total * 0.6);
//   const maintenanceCount = property.maintenance ?? Math.max(0, Math.round(total * 0.1));
//   const vacantCount = Math.max(0, total - occupiedCount - maintenanceCount);

//   const statuses = [
//     ...Array(occupiedCount).fill('occupied'),
//     ...Array(vacantCount).fill('vacant'),
//     ...Array(maintenanceCount).fill('maintenance'),
//   ];
//   while (statuses.length < total) statuses.push('vacant');

//   const unitsPerFloor = Math.max(2, Math.min(4, Math.ceil(total / Math.max(1, Math.ceil(total / 4)))));
//   const floors = [];
//   for (let i = 0; i < statuses.length; i += unitsPerFloor) {
//     floors.push({
//       units: statuses.slice(i, i + unitsPerFloor).map((status, idx) => ({
//         id: `F${floors.length + 1}-${idx + 1}`,
//         status,
//         tenant: status === 'occupied' ? 'Tenant' : null,
//         rent: property.rent ? Math.round(property.rent / total) : null,
//         area: property.area ? Math.round(property.area / total) : null,
//       })),
//     });
//   }
//   return { ...property, floors };
// }

// /* -------------------------------------------------------------------------
//    BUILD A 3D BUILDING FROM NORMALIZED PROPERTY DATA
//    Each floor is a horizontal slab; each unit on a floor is a vertical glass
//    bay colored by occupancy status. A roof + entrance + ground plate complete
//    the read of "this is a real building", not an abstract block.

//    Brightness/inner-glow is now driven per-status via STATUS_GLOW so that,
//    independent of hue, occupied bays read as brightest/most-lit, maintenance
//    bays sit at a medium glow, and vacant bays look dim/dark.
// ------------------------------------------------------------------------- */
// export function buildPropertyModel(property, onUnitMeta) {
//   const data = normalizeProperty(property);
//   const group = new THREE.Group();
//   const floorHeight = 1.6;
//   const bayWidth = 1.1;
//   const depth = 2.2;

//   const maxUnitsPerFloor = Math.max(...data.floors.map((f) => f.units.length), 1);
//   const buildingWidth = maxUnitsPerFloor * bayWidth;

//   // Foundation slab
//   const base = makeBox(buildingWidth + 0.6, 0.25, depth + 0.6, 0x9ca3af);
//   base.position.y = 0.125;
//   group.add(base);

//   data.floors.forEach((floor, floorIdx) => {
//     const y = 0.25 + floorIdx * floorHeight + floorHeight / 2;
//     const floorWidth = floor.units.length * bayWidth;
//     const startX = -floorWidth / 2 + bayWidth / 2;

//     // Floor slab edge (subtle horizontal banding between levels)
//     const slab = makeBox(floorWidth + 0.2, 0.08, depth + 0.2, 0x1f2937);
//     slab.position.set(0, y - floorHeight / 2, 0);
//     group.add(slab);

//     floor.units.forEach((unit, unitIdx) => {
//       const x = startX + unitIdx * bayWidth;
//       const color = STATUS_COLOR[unit.status] || STATUS_COLOR.vacant;
//       const glow = getGlow(unit.status);

//       // Structural frame (concrete mullions) — subtle brightness nudge per status
//       const frameMat = new THREE.MeshPhysicalMaterial({
//         color: 0x66CCFF,
//         transparent: true,
//         opacity: 0.2,
//         emissive: 0x66CCFF,
//         emissiveIntensity: glow.frameEmissive,
//       });

//       const frame = new THREE.Mesh(
//         new THREE.BoxGeometry(
//           bayWidth - 0.2,
//           floorHeight - 0.1,
//           depth - 0.1
//         ),
//         frameMat
//       );
//       frame.position.set(x, y, 0);
//       group.add(frame);
//       const edges = new THREE.LineSegments(
//         new THREE.EdgesGeometry(frame.geometry),
//         new THREE.LineBasicMaterial({
//           color: 0x66CCFF
//         })
//       );

//       edges.position.copy(frame.position);

//       group.add(edges);

//       // Glass facade panel (front face) — colored AND brightness-graded by
//       // occupancy status, so it reads as an inner glow rather than a flat tint.
//       const glassGeo = new THREE.BoxGeometry(
//         bayWidth - 0.16,
//         floorHeight - 0.3,
//         0.04
//       );

//       const glassMat = new THREE.MeshPhysicalMaterial({
//         color,
//         transparent: true,
//         opacity: glow.glassOpacity,
//         transmission: 1,
//         roughness: 0,
//         metalness: 0,
//         emissive: color,
//         emissiveIntensity: glow.glassEmissive,
//       });

//       const glass = new THREE.Mesh(
//         glassGeo,
//         glassMat
//       );

//       glass.position.set(x, y, depth / 2 - 0.05 + 0.02);
//       glass.userData = { unit, floorIdx };
//       group.add(glass);
//       if (onUnitMeta) onUnitMeta(glass, unit);

//       // Status indicator light strip beneath the bay — brightest for occupied,
//       // dimmest for vacant, so the glow profile is visible even from a distance.
//       const light = makeBox(bayWidth - 0.3, 0.05, 0.05, color, {
//         emissive: color,
//         emissiveIntensity: glow.lightEmissive,
//       });
//       light.position.set(x, y - floorHeight / 2 + 0.06, depth / 2 + 0.02);
//       group.add(light);
//     });
//   });

//   const totalHeight = 0.25 + data.floors.length * floorHeight;

//   // Roof cap
//   const roof = makeBox(buildingWidth + 0.5, 0.18, depth + 0.5, 0x374151);
//   roof.position.set(0, totalHeight + 0.09, 0);
//   group.add(roof);

//   // Rooftop mechanical block for visual interest on taller buildings
//   if (data.floors.length >= 3) {
//     const mech = makeBox(buildingWidth * 0.35, 0.5, depth * 0.4, 0x4b5563);
//     mech.position.set(0, totalHeight + 0.18 + 0.25, 0);
//     group.add(mech);
//   }

//   // Entrance canopy
//   const canopy = makeBox(1.6, 0.08, 0.9, 0x111827);
//   canopy.position.set(0, 0.55, depth / 2 + 0.55);
//   group.add(canopy);
//   const door = makeBox(0.9, 0.9, 0.05, 0x0f172a);
//   door.position.set(0, 0.45, depth / 2 + 0.07);
//   group.add(door);

//   group.userData = { buildingWidth, totalHeight, floorCount: data.floors.length };

//   // Blueprint wireframe overlay.
//   // IMPORTANT: collect target meshes first, then add wires in a second pass.
//   // Calling group.add() inside group.traverse() mutates the children array
//   // while it's being iterated, which can cause runaway/duplicated traversal
//   // (and a hard crash/freeze) as building size grows. Two passes avoids that.
//   const meshesToOutline = [];
//   group.traverse((obj) => {
//     if (obj.isMesh) meshesToOutline.push(obj);
//   });
//   meshesToOutline.forEach((obj) => {
//     const wire = new THREE.LineSegments(
//       new THREE.EdgesGeometry(obj.geometry),
//       new THREE.LineBasicMaterial({
//         color: 0x7DD3FC,
//         transparent: true,
//         opacity: 0.9,
//       })
//     );

//     wire.position.copy(obj.position);
//     wire.rotation.copy(obj.rotation);
//     wire.scale.copy(obj.scale);

//     group.add(wire);
//   });
//   return group;
// }


import * as THREE from 'three';

/* -------------------------------------------------------------------------
   STATUS CONFIG
   Each status has a base color PLUS its own glow profile, so occupancy
   reads instantly from brightness alone (not just hue):
     - occupied     -> brightest, strong steady inner glow
     - maintenance  -> medium glow, slightly warmer/punchier so it still
                       pops next to occupied bays
     - vacant       -> dim, low glow (reads as "dark/empty" at a glance)
     - aggregated   -> soft highlight, used for merged/combined units
------------------------------------------------------------------------- */
export const STATUS_COLOR = {
  occupied: 0x00D4FF,      // brightest
  maintenance: 0x0099CC,   // medium
  vacant: 0x005F80,        // darker
  aggregated: 0x7DD3FC,    // soft highlight
};

export const STATUS_LABEL = {
  occupied: 'Occupied',
  vacant: 'Vacant',
  maintenance: 'Maintenance',
  aggregated: 'Merged',
};

// Inner-glow / brightness profile per status.
// glassEmissive   -> emissiveIntensity on the glass facade panel (the "inner glow")
// glassOpacity    -> how solid/lit the glass bay looks
// lightEmissive   -> emissiveIntensity on the status strip beneath the bay
// frameEmissive   -> tiny boost/dim on the structural frame tint near that bay
export const STATUS_GLOW = {
  occupied: {
    glassEmissive: 0.85,
    glassOpacity: 0.55,
    lightEmissive: 1.4,
    frameEmissive: 0.3,
  },
  maintenance: {
    glassEmissive: 0.55,
    glassOpacity: 0.45,
    lightEmissive: 1.0,
    frameEmissive: 0.22,
  },
  vacant: {
    glassEmissive: 0.18,
    glassOpacity: 0.28,
    lightEmissive: 0.45,
    frameEmissive: 0.12,
  },
  aggregated: {
    glassEmissive: 0.5,
    glassOpacity: 0.4,
    lightEmissive: 0.9,
    frameEmissive: 0.2,
  },
};

function getGlow(status) {
  return STATUS_GLOW[status] || STATUS_GLOW.vacant;
}

/* -------------------------------------------------------------------------
   UTILITIES
------------------------------------------------------------------------- */
export function disposeGroup(group) {
  group.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
      else obj.material.dispose();
    }
  });
}

export function makeBox(w, h, d, color, opts = {}) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.05, ...opts });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/* -------------------------------------------------------------------------
   NORMALIZE PROPERTY DATA -> FLOORS OF UNITS
   Accepts whatever shape the app passes in (property groups from ERPNext)
   and produces a consistent { floors: [{ units: [{id,status,tenant,...}] }] }
   structure to render. Falls back to a deterministic synthetic layout if the
   property only has summary counts (unitsCount / occupied / vacant etc).
------------------------------------------------------------------------- */
export function normalizeProperty(property) {
  if (!property) return { floors: [{ units: [{ id: 'U1', status: 'vacant' }] }] };

  if (Array.isArray(property.floors) && property.floors.length > 0) {
    return property;
  }

  if (Array.isArray(property.units) && property.units.length > 0) {
    const floorsMap = {};
    property.units.forEach((u) => {
      const f = u.floor ?? 0;
      if (!floorsMap[f]) floorsMap[f] = [];
      floorsMap[f].push(u);
    });
    const floors = Object.keys(floorsMap)
      .sort((a, b) => Number(a) - Number(b))
      .map((f) => ({ units: floorsMap[f] }));
    return { ...property, floors };
  }

  // Synthetic fallback from summary counts.
  // Real property data (e.g. ERPNext numeric fields arriving as strings,
  // empty values, or out-of-range numbers) can't be trusted to be clean
  // non-negative integers, so every count is coerced and clamped here.
  // Array(length) throws a RangeError for negative, NaN, Infinity, or
  // non-integer lengths — toSafeCount() guarantees none of those reach it.
  const toSafeCount = (value, fallback = 0) => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) return fallback;
    return Math.floor(n);
  };

  const total = toSafeCount(property.unitsCount, 6) || 6;
  const occupiedCount = property.occupied != null
    ? toSafeCount(property.occupied, 0)
    : toSafeCount(Math.round(total * 0.6), 0);
  const maintenanceCount = property.maintenance != null
    ? toSafeCount(property.maintenance, 0)
    : toSafeCount(Math.round(total * 0.1), 0);
  const vacantCount = property.vacant != null
    ? toSafeCount(property.vacant, 0)
    : Math.max(0, total - occupiedCount - maintenanceCount);

  const statuses = [
    ...Array(occupiedCount).fill('occupied'),
    ...Array(vacantCount).fill('vacant'),
    ...Array(maintenanceCount).fill('maintenance'),
  ];
  while (statuses.length < total) statuses.push('vacant');

  const unitsPerFloor = Math.max(2, Math.min(4, Math.ceil(total / Math.max(1, Math.ceil(total / 4)))));
  const floors = [];
  for (let i = 0; i < statuses.length; i += unitsPerFloor) {
    floors.push({
      units: statuses.slice(i, i + unitsPerFloor).map((status, idx) => ({
        id: `F${floors.length + 1}-${idx + 1}`,
        status,
        tenant: status === 'occupied' ? 'Tenant' : null,
        rent: property.rent ? Math.round(property.rent / total) : null,
        area: property.area ? Math.round(property.area / total) : null,
      })),
    });
  }
  return { ...property, floors };
}

/* -------------------------------------------------------------------------
   BUILD A 3D BUILDING FROM NORMALIZED PROPERTY DATA
   Each floor is a horizontal slab; each unit on a floor is a vertical glass
   bay colored by occupancy status. A roof + entrance + ground plate complete
   the read of "this is a real building", not an abstract block.

   Brightness/inner-glow is now driven per-status via STATUS_GLOW so that,
   independent of hue, occupied bays read as brightest/most-lit, maintenance
   bays sit at a medium glow, and vacant bays look dim/dark.
------------------------------------------------------------------------- */
export function buildPropertyModel(property, onUnitMeta) {
  const data = normalizeProperty(property);
  const group = new THREE.Group();
  const floorHeight = 1.6;
  const bayWidth = 1.1;
  const depth = 2.2;

  const maxUnitsPerFloor = Math.max(...data.floors.map((f) => f.units.length), 1);
  const buildingWidth = maxUnitsPerFloor * bayWidth;

  // Foundation slab
  const base = makeBox(buildingWidth + 0.6, 0.25, depth + 0.6, 0x9ca3af);
  base.position.y = 0.125;
  group.add(base);

  data.floors.forEach((floor, floorIdx) => {
    const y = 0.25 + floorIdx * floorHeight + floorHeight / 2;
    const floorWidth = floor.units.length * bayWidth;
    const startX = -floorWidth / 2 + bayWidth / 2;

    // Floor slab edge (subtle horizontal banding between levels)
    const slab = makeBox(floorWidth + 0.2, 0.08, depth + 0.2, 0x1f2937);
    slab.position.set(0, y - floorHeight / 2, 0);
    group.add(slab);

    floor.units.forEach((unit, unitIdx) => {
      const x = startX + unitIdx * bayWidth;
      const color = STATUS_COLOR[unit.status] || STATUS_COLOR.vacant;
      const glow = getGlow(unit.status);

      // Structural frame (concrete mullions) — subtle brightness nudge per status
      const frameMat = new THREE.MeshPhysicalMaterial({
        color: 0x66CCFF,
        transparent: true,
        opacity: 0.2,
        emissive: 0x66CCFF,
        emissiveIntensity: glow.frameEmissive,
      });

      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(
          bayWidth - 0.2,
          floorHeight - 0.1,
          depth - 0.1
        ),
        frameMat
      );
      frame.position.set(x, y, 0);
      group.add(frame);
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(frame.geometry),
        new THREE.LineBasicMaterial({
          color: 0x66CCFF
        })
      );

      edges.position.copy(frame.position);

      group.add(edges);

      // Glass facade panel (front face) — colored AND brightness-graded by
      // occupancy status, so it reads as an inner glow rather than a flat tint.
      const glassGeo = new THREE.BoxGeometry(
        bayWidth - 0.16,
        floorHeight - 0.3,
        0.04
      );

      const glassMat = new THREE.MeshPhysicalMaterial({
        color,
        transparent: true,
        opacity: glow.glassOpacity,
        transmission: 1,
        roughness: 0,
        metalness: 0,
        emissive: color,
        emissiveIntensity: glow.glassEmissive,
      });

      const glass = new THREE.Mesh(
        glassGeo,
        glassMat
      );

      glass.position.set(x, y, depth / 2 - 0.05 + 0.02);
      glass.userData = { unit, floorIdx };
      group.add(glass);
      if (onUnitMeta) onUnitMeta(glass, unit);

      // Status indicator light strip beneath the bay — brightest for occupied,
      // dimmest for vacant, so the glow profile is visible even from a distance.
      const light = makeBox(bayWidth - 0.3, 0.05, 0.05, color, {
        emissive: color,
        emissiveIntensity: glow.lightEmissive,
      });
      light.position.set(x, y - floorHeight / 2 + 0.06, depth / 2 + 0.02);
      group.add(light);
    });
  });

  const totalHeight = 0.25 + data.floors.length * floorHeight;

  // Roof cap
  const roof = makeBox(buildingWidth + 0.5, 0.18, depth + 0.5, 0x374151);
  roof.position.set(0, totalHeight + 0.09, 0);
  group.add(roof);

  // Rooftop mechanical block for visual interest on taller buildings
  if (data.floors.length >= 3) {
    const mech = makeBox(buildingWidth * 0.35, 0.5, depth * 0.4, 0x4b5563);
    mech.position.set(0, totalHeight + 0.18 + 0.25, 0);
    group.add(mech);
  }

  // Entrance canopy
  const canopy = makeBox(1.6, 0.08, 0.9, 0x111827);
  canopy.position.set(0, 0.55, depth / 2 + 0.55);
  group.add(canopy);
  const door = makeBox(0.9, 0.9, 0.05, 0x0f172a);
  door.position.set(0, 0.45, depth / 2 + 0.07);
  group.add(door);

  group.userData = { buildingWidth, totalHeight, floorCount: data.floors.length };

  // Blueprint wireframe overlay.
  // IMPORTANT: collect target meshes first, then add wires in a second pass.
  // Calling group.add() inside group.traverse() mutates the children array
  // while it's being iterated, which can cause runaway/duplicated traversal
  // (and a hard crash/freeze) as building size grows. Two passes avoids that.
  const meshesToOutline = [];
  group.traverse((obj) => {
    if (obj.isMesh) meshesToOutline.push(obj);
  });
  meshesToOutline.forEach((obj) => {
    const wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(obj.geometry),
      new THREE.LineBasicMaterial({
        color: 0x7DD3FC,
        transparent: true,
        opacity: 0.9,
      })
    );

    wire.position.copy(obj.position);
    wire.rotation.copy(obj.rotation);
    wire.scale.copy(obj.scale);

    group.add(wire);
  });
  return group;
}