import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLocationContext } from '../../lib/context/LocationContext';

// Fix for default leaflet icons in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for user location
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icon for business locations
const businessIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to dynamically fit bounds of all markers
function MapBoundsFit({ businesses, userLocation }: { businesses: any[], userLocation: any }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    const bounds = L.latLngBounds([]);
    
    if (userLocation?.lat && userLocation?.lng) {
      bounds.extend([userLocation.lat, userLocation.lng]);
    }
    
    businesses.forEach(b => {
      if (b.latitude && b.longitude) {
        bounds.extend([b.latitude, b.longitude]);
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, businesses, userLocation]);

  return null;
}

export default function MapView({ businesses }: { businesses: any[] }) {
  const { location } = useLocationContext();
  
  // Default center (India)
  const defaultCenter: [number, number] = [20.5937, 78.9629];
  
  const center: [number, number] = location.lat && location.lng 
    ? [location.lat, location.lng]
    : defaultCenter;

  const zoom = location.lat && location.lng ? 13 : 5;

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User Location Marker */}
        {location.lat && location.lng && (
          <Marker position={[location.lat, location.lng]} icon={userIcon}>
            <Popup>
              <div className="font-bold text-slate-900">Your Location</div>
              <div className="text-xs text-slate-500">{location.city}</div>
            </Popup>
          </Marker>
        )}

        {/* Business Markers */}
        {businesses.map((biz, idx) => (
          biz.latitude && biz.longitude && (
            <Marker key={idx} position={[biz.latitude, biz.longitude]} icon={businessIcon}>
              <Popup>
                <div className="min-w-[150px]">
                  <h3 className="font-bold text-sm text-slate-900 mb-1">{biz.business_name}</h3>
                  <p className="text-[10px] text-slate-500 mb-2">{biz.address || biz.area || biz.city}</p>
                  {biz.distance && <p className="text-[10px] font-bold text-blue-600 mb-2">{biz.distance} km away</p>}
                  <a 
                    href={biz.google_map_url || `https://www.google.com/maps/search/?api=1&query=${biz.latitude},${biz.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded block text-center font-medium hover:bg-blue-100"
                  >
                    Get Directions
                  </a>
                </div>
              </Popup>
            </Marker>
          )
        ))}
        
        <MapBoundsFit businesses={businesses} userLocation={location} />
      </MapContainer>
    </div>
  );
}
