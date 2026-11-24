import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Building,
  Maximize2,
  Minimize2,
  RotateCcw,
  Layers,
  ChevronRight,
  TrendingUp,
  Search,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

// Coordinates and divisions for Fiji Districts
export const FIJI_DISTRICTS = {
  'Suva': {
    name: 'Suva',
    division: 'Central Division',
    coords: [-18.1416, 178.4415],
    description: 'Capital city & primary commercial business district'
  },
  'Nadi': {
    name: 'Nadi',
    division: 'Western Division',
    coords: [-17.8000, 177.4167],
    description: 'Tourism & international gateway district'
  },
  'Lautoka': {
    name: 'Lautoka',
    division: 'Western Division',
    coords: [-17.6167, 177.4500],
    description: 'Sugar City & commercial port district'
  },
  'Ba': {
    name: 'Ba',
    division: 'Western Division',
    coords: [-17.5333, 177.6833],
    description: 'Western commercial town & industrial estates'
  },
  'Tailevu': {
    name: 'Tailevu',
    division: 'Central Division',
    coords: [-17.8833, 178.5333],
    description: 'Eastern coastal commercial zone & dairy corridor'
  },
  'Labasa': {
    name: 'Labasa',
    division: 'Northern Division',
    coords: [-16.4333, 179.3667],
    description: 'Northern regional commercial hub & Macuata center'
  },
  'Bua': {
    name: 'Bua',
    division: 'Northern Division',
    coords: [-16.8333, 178.7500],
    description: 'Vanua Levu western province & maritime resources'
  },
  'Kadavu': {
    name: 'Kadavu',
    division: 'Eastern Division',
    coords: [-19.0167, 178.1667],
    description: 'Kadavu island group & maritime southern region'
  },
  'Levuka': {
    name: 'Levuka',
    division: 'Eastern Division',
    coords: [-17.6833, 178.8333],
    description: 'Historic port town & Ovalau maritime district'
  },
  'Pacific Harbor': {
    name: 'Pacific Harbor',
    division: 'Central Division',
    coords: [-18.2000, 178.0500],
    description: 'Pacific Harbour residential & commercial enclave'
  },
  'Rewa': {
    name: 'Rewa / Nausori',
    division: 'Central Division',
    coords: [-18.0333, 178.5333],
    description: 'Nausori corridor & agricultural commercial zone'
  },
  'Macuata': {
    name: 'Macuata / Labasa',
    division: 'Northern Division',
    coords: [-16.4333, 179.3667],
    description: 'Labasa commercial hub & northern regional hub'
  },
  'Cakaudrove': {
    name: 'Cakaudrove / Savusavu',
    division: 'Northern Division',
    coords: [-16.7800, 179.3300],
    description: 'Savusavu coastal tourist & maritime property zone'
  },
  'Nadroga-Navosa': {
    name: 'Nadroga-Navosa',
    division: 'Western Division',
    coords: [-18.1400, 177.5100],
    description: 'Sigatoka & Coral Coast resort corridor'
  },
  'Serua': {
    name: 'Serua / Pacific Harbour',
    division: 'Central Division',
    coords: [-18.2000, 178.0500],
    description: 'Pacific Harbour residential & commercial enclave'
  }
};

// Helper: Normalize and resolve property to a valid Fiji district
export const resolvePropertyDistrict = (p, fallbackIndex = 0) => {
  const corpus = `${p.district || ''} ${p.locality || ''} ${p.address || ''} ${p.name || ''} ${p.land_description || ''}`.toLowerCase();

  if (corpus.includes('suva') || corpus.includes('samabula') || corpus.includes('lami') || corpus.includes('rodwell')) return 'Suva';
  if (corpus.includes('nadi') || corpus.includes('namaka') || corpus.includes('martintar') || corpus.includes('denarau')) return 'Nadi';
  if (corpus.includes('lautoka') || corpus.includes('naviti') || corpus.includes('vitogo')) return 'Lautoka';
  if (corpus.includes('ba')) return 'Ba';
  if (corpus.includes('tailevu') || corpus.includes('korovou')) return 'Tailevu';
  if (corpus.includes('labasa') || corpus.includes('macuata') || corpus.includes('nasekula')) return 'Labasa';
  if (corpus.includes('bua')) return 'Bua';
  if (corpus.includes('kadavu')) return 'Kadavu';
  if (corpus.includes('levuka') || corpus.includes('ovalau')) return 'Levuka';
  if (corpus.includes('pacific harbor') || corpus.includes('pacific harbour') || corpus.includes('serua') || corpus.includes('deuba')) return 'Pacific Harbor';
  if (corpus.includes('rewa') || corpus.includes('nausori')) return 'Rewa';
  if (corpus.includes('savusavu') || corpus.includes('cakaudrove')) return 'Cakaudrove';
  if (corpus.includes('nadroga') || corpus.includes('sigatoka') || corpus.includes('coral coast')) return 'Nadroga-Navosa';

  if (p.district && typeof p.district === 'string' && p.district.trim()) {
    const dTrim = p.district.trim();
    if (FIJI_DISTRICTS[dTrim]) return dTrim;
    for (const key of Object.keys(FIJI_DISTRICTS)) {
      if (key.toLowerCase() === dTrim.toLowerCase()) return key;
    }
  }

  // Fallback realistic distribution across major Fiji commercial hubs
  const defaultDistricts = ['Suva', 'Nadi', 'Lautoka', 'Ba', 'Tailevu', 'Labasa'];
  return defaultDistricts[fallbackIndex % defaultDistricts.length];
};

// Map Controller Component for smooth fly-to and bounds fitting
function MapController({ targetCenter, targetZoom, onResetComplete }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  useEffect(() => {
    if (targetCenter && targetZoom) {
      map.flyTo(targetCenter, targetZoom, {
        duration: 1.2,
        easeLinearity: 0.25
      });
      if (onResetComplete) {
        onResetComplete();
      }
    }
  }, [map, targetCenter, targetZoom, onResetComplete]);

  return null;
}

// Custom DivIcon for Fiji District Marker with Glowing Property Count Badge
function createDistrictDivIcon(districtKey, displayName, count, isSelected) {
  const bgGradient = isSelected
    ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
    : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';
  const borderColor = isSelected ? '#60a5fa' : 'rgba(255, 255, 255, 0.25)';
  const badgeBg = isSelected ? '#ffffff' : '#3b82f6';
  const badgeColor = isSelected ? '#2563eb' : '#ffffff';
  const scale = isSelected ? 'scale(1.12)' : 'scale(1)';

  return L.divIcon({
    className: `fiji-district-marker-icon ${isSelected ? 'selected' : ''}`,
    html: `
      <div style="
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: ${bgGradient};
        border: 2px solid ${borderColor};
        padding: 5px 12px 5px 6px;
        border-radius: 30px;
        color: #ffffff;
        box-shadow: 0 10px 24px -4px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(59, 130, 246, 0.2);
        cursor: pointer;
        transform: translate(-50%, -50%) ${scale};
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        white-space: nowrap;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <span style="
          min-width: 24px;
          height: 24px;
          padding: 0 6px;
          border-radius: 12px;
          background: ${badgeBg};
          color: ${badgeColor};
          font-weight: 800;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        ">${count}</span>
        <div style="display: flex; flex-direction: column; text-align: left;">
          <span style="font-weight: 700; font-size: 12px; letter-spacing: -0.01em; line-height: 1.1;">${displayName}</span>
          <span style="font-size: 9.5px; opacity: 0.75; font-weight: 500;">${count === 1 ? '1 Property Group' : `${count} Property Groups`}</span>
        </div>
      </div>
    `,
    iconSize: [160, 40],
    iconAnchor: [80, 20],
    popupAnchor: [0, -22]
  });
}

export default function FijiDistrictMap({ properties = [], onSelectProperty = null, propertyGroupsByDistrict = null }) {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapTarget, setMapTarget] = useState({
    center: [-17.8500, 178.0000],
    zoom: 8
  });

  // Calculate District-wise Property Group Counts
  const districtData = useMemo(() => {
    const map = {};

    // Initialize all supported Fiji districts
    Object.keys(FIJI_DISTRICTS).forEach(key => {
      map[key] = {
        key,
        name: FIJI_DISTRICTS[key].name,
        division: FIJI_DISTRICTS[key].division,
        coords: FIJI_DISTRICTS[key].coords,
        description: FIJI_DISTRICTS[key].description,
        count: 0,
        totalUnits: 0,
        properties: []
      };
    });

    if (propertyGroupsByDistrict && Array.isArray(propertyGroupsByDistrict) && propertyGroupsByDistrict.length > 0) {
      // Use API-provided district groups
      propertyGroupsByDistrict.forEach(item => {
        const dName = item.District || item.district || '';
        let matchedKey = Object.keys(FIJI_DISTRICTS).find(k => k.toLowerCase() === dName.toLowerCase());
        if (!matchedKey) {
          if (dName.toLowerCase().includes('pacific')) matchedKey = 'Pacific Harbor';
          else if (dName.toLowerCase().includes('labasa')) matchedKey = 'Labasa';
          else matchedKey = dName;
        }

        const count = item.Total !== undefined ? Number(item.Total) : (Array.isArray(item['Property Groups']) ? item['Property Groups'].length : 0);
        const groupNames = item['Property Groups'] || [];

        const districtProps = groupNames.map(gName => {
          const matched = properties.find(p =>
            (p.name || '').toLowerCase() === String(gName).toLowerCase() ||
            (p.id || '').toLowerCase() === String(gName).toLowerCase()
          );
          return matched || {
            name: gName,
            id: gName,
            district: dName,
            unitsCount: 4
          };
        });

        const districtMeta = FIJI_DISTRICTS[matchedKey] || {
          name: dName,
          division: 'Fiji Territory',
          coords: [-18.1416, 178.4415],
          description: `${dName} commercial & residential portfolio`
        };

        map[matchedKey] = {
          key: matchedKey,
          name: districtMeta.name,
          division: districtMeta.division,
          coords: districtMeta.coords,
          description: districtMeta.description,
          count: count,
          totalUnits: districtProps.reduce((sum, p) => sum + (parseInt(p.unitsCount || p.units || 0, 10) || 4), 0),
          properties: districtProps
        };
      });
    } else {
      // Populate with actual properties
      properties.forEach((p, idx) => {
        const dKey = resolvePropertyDistrict(p, idx);
        if (!map[dKey]) {
          map[dKey] = {
            key: dKey,
            name: dKey,
            division: 'Fiji Territory',
            coords: [-18.1416, 178.4415],
            description: 'Commercial & residential portfolio asset',
            count: 0,
            totalUnits: 0,
            properties: []
          };
        }
        map[dKey].count += 1;
        map[dKey].totalUnits += parseInt(p.unitsCount || p.units || 0, 10) || 4;
        map[dKey].properties.push(p);
      });
    }

    const list = Object.values(map);
    // Sort districts with available property groups first, ordered descending by count
    return list.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });
  }, [properties, propertyGroupsByDistrict]);

  const totalPropertyGroups = (propertyGroupsByDistrict && propertyGroupsByDistrict.length > 0)
    ? districtData.reduce((acc, d) => acc + d.count, 0)
    : properties.length;
  const activeDistricts = districtData.filter(d => d.count > 0);

  // Filtered districts for the side search panel
  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return districtData;
    const q = searchQuery.toLowerCase();
    return districtData.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.division.toLowerCase().includes(q) ||
      d.properties.some(p => (p.name || '').toLowerCase().includes(q))
    );
  }, [districtData, searchQuery]);

  // Focus map on a selected district
  const handleFocusDistrict = (district) => {
    setSelectedDistrict(district.key);
    setMapTarget({
      center: district.coords,
      zoom: 12
    });
  };

  // Reset to full Fiji view
  const handleResetMap = () => {
    setSelectedDistrict(null);
    setMapTarget({
      center: [-17.8500, 178.0000],
      zoom: 8
    });
  };

  return (
    <div
      className="card-panel"
      style={{
        margin: 0,
        padding: 24,
        borderRadius: 20,
        border: '1px solid var(--border-color)',
        background: 'var(--card-bg, #ffffff)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}
    >
      {/* 1. Header & Summary Metrics */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(139, 92, 246, 0.15))',
                color: 'var(--brand-color, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MapPin size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Fiji Islands Geographic Portfolio
              </h2>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-muted)' }}>
                District-wise distribution & available Property Groups across Fiji
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Badges & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 12,
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Building size={15} style={{ color: '#2563eb' }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Total Groups: <strong style={{ color: '#2563eb', fontWeight: 800 }}>{totalPropertyGroups}</strong>
            </span>
          </div>

          <div
            style={{
              padding: '6px 14px',
              borderRadius: 12,
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <CheckCircle2 size={15} style={{ color: '#10b981' }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Active Districts: <strong style={{ color: '#10b981', fontWeight: 800 }}>{activeDistricts.length}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={handleResetMap}
            title="Reset Map View"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 10,
              background: 'var(--bg-tertiary, #f1f5f9)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--border-color)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-tertiary, #f1f5f9)'}
          >
            <RotateCcw size={13} />
            <span>Reset View</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(prev => !prev)}
            title={isFullscreen ? "Exit Fullscreen" : "Expand Map"}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 10,
              background: isFullscreen ? 'var(--brand-color)' : 'var(--bg-tertiary, #f1f5f9)',
              color: isFullscreen ? '#ffffff' : 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span>{isFullscreen ? 'Collapse' : 'Expand'}</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Map & District Breakdown Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isFullscreen ? '1fr' : '4fr 8fr',
          gap: 20,
          minHeight: isFullscreen ? '75vh' : 460
        }}
      >
        {/* Left Side: District-wise Breakdown Cards & Counts */}
        {!isFullscreen && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              maxHeight: 460,
              overflowY: 'auto',
              paddingRight: 4
            }}
          >
            {/* Search Input for Districts */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-tertiary, #f8fafc)',
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                padding: '6px 10px'
              }}
            >
              <Search size={14} style={{ color: 'var(--text-muted)', marginRight: 6 }} />
              <input
                type="text"
                placeholder="Search Fiji district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 12,
                  width: '100%',
                  color: 'var(--text-primary)'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 11, color: 'var(--text-muted)' }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* District Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredDistricts.map((district) => {
                const isSelected = selectedDistrict === district.key;
                const pct = totalPropertyGroups > 0
                  ? Math.round((district.count / totalPropertyGroups) * 100)
                  : 0;

                return (
                  <div
                    key={district.key}
                    onClick={() => handleFocusDistrict(district)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 14,
                      border: isSelected ? '1.5px solid var(--brand-color)' : '1px solid var(--border-color)',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(139, 92, 246, 0.08))'
                        : 'var(--bg-secondary, #f8fafc)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'var(--brand-color)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.transform = 'none';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                            {district.name}
                          </span>
                          {district.count > 0 && (
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                          )}
                        </div>
                        <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
                          {district.division}
                        </span>
                      </div>

                      {/* Count Badge */}
                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '3px 9px',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 800,
                            background: district.count > 0 ? 'rgba(37, 99, 235, 0.12)' : 'var(--bg-tertiary)',
                            color: district.count > 0 ? '#2563eb' : 'var(--text-muted)'
                          }}
                        >
                          {district.count} {district.count === 1 ? 'Group' : 'Groups'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Sub details */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <div style={{ flex: 1, height: 4, background: 'var(--border-color)', borderRadius: 2, overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            background: district.count > 0 ? 'linear-gradient(90deg, #2563eb, #7c3aed)' : 'transparent',
                            borderRadius: 2
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-muted)' }}>
                        {pct}% of total
                      </span>
                    </div>

                    {/* Property Names Preview */}
                    {district.properties.length > 0 && (
                      <div style={{ marginTop: 8, fontSize: 10.5, color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {district.properties.slice(0, 3).map((p, idx) => (
                          <span
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSelectProperty) onSelectProperty(p);
                            }}
                            style={{
                              padding: '2px 7px',
                              borderRadius: 4,
                              background: 'var(--bg-tertiary, #e2e8f0)',
                              fontSize: 10,
                              fontWeight: 600,
                              cursor: 'pointer',
                              color: 'var(--text-primary)',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#dbeafe';
                              e.currentTarget.style.color = '#1d4ed8';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'var(--bg-tertiary, #e2e8f0)';
                              e.currentTarget.style.color = 'var(--text-primary)';
                            }}
                            title={`Open ${p.name}`}
                          >
                            {p.name}
                          </span>
                        ))}
                        {district.properties.length > 3 && (
                          <span style={{ fontSize: 10, color: 'var(--text-muted)', alignSelf: 'center' }}>
                            +{district.properties.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Side: Map View Area */}
        <div
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            position: 'relative',
            minHeight: isFullscreen ? '75vh' : 460,
            background: '#e2e8f0',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
          }}
        >
          <MapContainer
            center={mapTarget.center}
            zoom={mapTarget.zoom}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', minHeight: isFullscreen ? '75vh' : 460 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController targetCenter={mapTarget.center} targetZoom={mapTarget.zoom} />

            {/* Render District Markers on the Fiji Map */}
            {activeDistricts.map((district) => {
              const isSelected = selectedDistrict === district.key;
              const markerIcon = createDistrictDivIcon(district.key, district.name, district.count, isSelected);

              return (
                <Marker
                  key={district.key}
                  position={district.coords}
                  icon={markerIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedDistrict(district.key);
                    }
                  }}
                >
                  <Popup className="fiji-district-popup">
                    <div style={{ minWidth: 220, padding: 4, fontFamily: 'inherit' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, borderBottom: '1px solid #e2e8f0', paddingBottom: 6 }}>
                        <div>
                          <strong style={{ fontSize: 14, color: '#0f172a' }}>{district.name}</strong>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{district.division}</div>
                        </div>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: 12,
                            background: '#eff6ff',
                            color: '#2563eb',
                            fontSize: 11,
                            fontWeight: 800
                          }}
                        >
                          {district.count} {district.count === 1 ? 'Group' : 'Groups'}
                        </span>
                      </div>

                      <p style={{ fontSize: 11, color: '#475569', margin: '0 0 8px 0' }}>
                        {district.description}
                      </p>

                      <div style={{ fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        Available Property Groups:
                      </div>

                      <div style={{ maxHeight: 150, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {district.properties.map((p, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              if (onSelectProperty) onSelectProperty(p);
                            }}
                            style={{
                              padding: '8px 10px',
                              borderRadius: 8,
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              fontSize: 12,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#eff6ff';
                              e.currentTarget.style.borderColor = '#93c5fd';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#f8fafc';
                              e.currentTarget.style.borderColor = '#e2e8f0';
                            }}
                            title={`Open ${p.name || 'Property Group'}`}
                          >
                            <span style={{ fontWeight: 700, color: '#0f172a' }}>
                              {p.name}
                            </span>
                            <ExternalLink size={13} style={{ color: '#2563eb', flexShrink: 0 }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Quick Legend Overlay on Map */}
          <div
            style={{
              position: 'absolute',
              bottom: 14,
              left: 14,
              zIndex: 1000,
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(4px)',
              padding: '8px 12px',
              borderRadius: 10,
              color: '#ffffff',
              fontSize: 11,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6' }} />
              <span>Property Group Count Badge</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#7c3aed' }} />
              <span>Selected District</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
