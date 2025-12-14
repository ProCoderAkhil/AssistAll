import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Custom Icons
const UserIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

const VolunteerIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

// Car Icon for animation
const CarIcon = L.divIcon({
    html: '<div style="font-size: 24px;">🚖</div>',
    className: 'dummy',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

// --- HELPER: MOVE MAP VIEW ---
const MapController = ({ location }) => {
    const map = useMap();
    useEffect(() => {
        if (location) {
            map.flyTo(location, 15, { duration: 2 });
        }
    }, [location, map]);
    return null;
};

const MapBackground = ({ activeRequest }) => {
  // Default: Kottayam Center
  const defaultPos = [9.5916, 76.5222]; 
  
  // User Position (From Request or Default)
  const userPos = activeRequest?.location ? [activeRequest.location.lat, activeRequest.location.lng] : defaultPos;
  
  // Volunteer Position (Simulated Start Point)
  const [volPos, setVolPos] = useState([9.5940, 76.5240]); 

  // --- ANIMATION LOGIC: Move Volunteer to User ---
  useEffect(() => {
      if (activeRequest && (activeRequest.status === 'accepted' || activeRequest.status === 'in_progress')) {
          const interval = setInterval(() => {
              setVolPos(prev => {
                  const latDiff = userPos[0] - prev[0];
                  const lngDiff = userPos[1] - prev[1];
                  
                  // Stop if close enough
                  if (Math.abs(latDiff) < 0.0001 && Math.abs(lngDiff) < 0.0001) return prev;

                  // Move 5% closer every tick
                  return [prev[0] + latDiff * 0.05, prev[1] + lngDiff * 0.05];
              });
          }, 500); // Update every 500ms
          return () => clearInterval(interval);
      }
  }, [activeRequest, userPos]);

  return (
    <div className="h-full w-full absolute inset-0 z-0">
      <MapContainer 
        center={userPos} 
        zoom={14} 
        style={{ height: "100%", width: "100%" }} 
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        
        <MapController location={userPos} />

        {/* User Marker */}
        <Marker position={userPos} icon={UserIcon}>
          <Popup>Customer Location</Popup>
        </Marker>

        {/* Volunteer Marker (Only show if active) */}
        {activeRequest && (
            <>
                <Marker position={volPos} icon={activeRequest.status === 'in_progress' ? CarIcon : VolunteerIcon}>
                    <Popup>{activeRequest.volunteerName || "Volunteer"}</Popup>
                </Marker>
                {/* Route Line */}
                <Polyline positions={[volPos, userPos]} color="blue" dashArray="10, 10" opacity={0.5} />
            </>
        )}

      </MapContainer>
    </div>
  );
};

export default MapBackground;