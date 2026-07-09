import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import homepng from '../assets/home.png'

// Runs ONCE on mount: fits the map to show all markers, if no explicit view is set yet
function FitToMarkers({ properties, hasView, onViewChange }) {
    const map = useMap();
    const hasFitRef = useRef(false);

    useEffect(() => {
        if (hasFitRef.current || hasView) return; // only auto-fit once, and only if no view exists yet

        const validProps = properties.filter(
            (p) => typeof p.latitude === 'number' && typeof p.longitude === 'number'
        );

        if (validProps.length === 0) return;

        hasFitRef.current = true;

        if (validProps.length === 1) {
            const { latitude, longitude } = validProps[0];
            map.setView([latitude, longitude], 14, { animate: false });
            onViewChange({ center: [latitude, longitude], zoom: 14 });
            return;
        }

        const bounds = L.latLngBounds(validProps.map((p) => [p.latitude, p.longitude]));
        map.fitBounds(bounds, { padding: [40, 40], animate: false });

        // Capture the resulting center/zoom so it becomes the shared "view" going forward
        const c = map.getCenter();
        onViewChange({ center: [c.lat, c.lng], zoom: map.getZoom() });
    }, [map, properties, hasView, onViewChange]);

    return null;
}

// Listens for user-driven pan/zoom and reports the new view up to the parent
function ViewWatcher({ onViewChange }) {
    useMapEvents({
        moveend: (e) => {
            const map = e.target;
            const c = map.getCenter();
            onViewChange({ center: [c.lat, c.lng], zoom: map.getZoom() });
        },
    });
    return null;
}

// Imperatively re-applies an externally-changed view (e.g. modal just opened
// and should jump to wherever the small map was left), without fighting
// a move that originated from this same map instance.
function ViewSync({ view }) {
    const map = useMap();
    const lastAppliedRef = useRef(null);

    useEffect(() => {
        if (!view) return;
        const [lat, lng] = view.center;
        const current = map.getCenter();
        const sameCenter = Math.abs(current.lat - lat) < 1e-6 && Math.abs(current.lng - lng) < 1e-6;
        const sameZoom = map.getZoom() === view.zoom;

        const isNewExternalChange =
            !lastAppliedRef.current ||
            lastAppliedRef.current.center[0] !== view.center[0] ||
            lastAppliedRef.current.center[1] !== view.center[1] ||
            lastAppliedRef.current.zoom !== view.zoom;

        if ((!sameCenter || !sameZoom) && isNewExternalChange) {
            map.setView(view.center, view.zoom, { animate: false });
        }
        lastAppliedRef.current = view;
    }, [view, map]);

    return null;
}

// properties: array of { id, name, address, latitude, longitude }
// view: { center: [lat, lng], zoom } | null  -- null means "not set yet, auto-fit all markers"
// onViewChange: (nextView) => void
function MapComponent({ properties = [], view = null, onViewChange = () => { }, height = '100%' }) {
    const validProps = properties.filter(
        (p) => typeof p.latitude === 'number' && typeof p.longitude === 'number'
    );

    // Fallback starting center/zoom only used before the first fit-to-markers completes
    const initialCenter = view?.center || [-18.1416, 178.4415];
    const initialZoom = view?.zoom || 12;


    const homeIcon = L.icon({
        iconUrl: homepng, // place image in public folder
        iconSize: [42, 42],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });

    return (
        <div style={{ height, width: '100%' }}>
            <MapContainer
                center={initialCenter}
                zoom={initialZoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {validProps.map((p) => (
                    <Marker key={p.id || p.name} position={[p.latitude, p.longitude]} icon={homeIcon}>
                        <Popup>
                            <strong>{p.name}</strong>
                            <br />
                            {p.address}
                        </Popup>
                    </Marker>
                ))}

                <FitToMarkers properties={properties} hasView={!!view} onViewChange={onViewChange} />
                <ViewWatcher onViewChange={onViewChange} />
                {view && <ViewSync view={view} />}
            </MapContainer>
        </div>
    );
}

export default MapComponent;
