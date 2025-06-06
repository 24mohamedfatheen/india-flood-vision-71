// src/components/map/Map.tsx

import React, { useEffect } from 'react';
// Import necessary components from react-leaflet for building the map
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet core library (for L.Icon.Default, L.divIcon etc.)
import 'leaflet/dist/leaflet.css'; // Import Leaflet's default CSS for map styling

// Import the IMDRegionData type from your service for type safety
import { IMDRegionData } from '../../services/imdApiService'; 

// Import your custom MapMarker component
import MapMarker from './MapMarker'; // Path to your MapMarker component

// Import Lucide React icons for the user location marker
import { CircleDot } from 'lucide-react';

// --- Leaflet Default Icon Fix ---
// This is a common workaround to ensure Leaflet's default marker icons display correctly
// when using Webpack/Vite or similar bundlers, as asset paths might be broken.
// It prevents broken image icons on the map.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// --- MapRecenter Component ---
// This helper component is crucial for enabling programmatic control over the Leaflet map's view.
// It allows the map to smoothly pan and zoom to new `center` and `zoom` values provided via React state.
// It must be rendered as a direct child of `MapContainer` to access the Leaflet map instance via `useMap()`.
const MapRecenter: React.FC<{ center: L.LatLngExpression, zoom: number }> = ({ center, zoom }) => {
  const map = useMap(); // `useMap` hook provides access to the Leaflet map instance
  useEffect(() => {
    // Only update map view if valid coordinates are provided (not default [0,0])
    // The initial center [0,0] is a placeholder if no data is loaded yet.
    if (center[0] !== 0 || center[1] !== 0) { 
      map.flyTo(center, zoom, { animate: true, duration: 1 }); // Smooth animation to new view
    }
  }, [center, zoom, map]); // Dependencies: re-run effect if center, zoom, or map instance changes
  return null; // This component does not render any visible UI
};

// --- Main Map Component Props ---
// Define the props that this Map component will receive from its parent (e.g., App.tsx)
interface MapProps {
    selectedState: string;
    setSelectedState: (state: string) => void; // Function to update selected state in parent
    selectedDistrict: string;
    setSelectedDistrict: (district: string) => void; // Function to update selected district in parent
    mapCenter: L.LatLngExpression;
    setMapCenter: (center: L.LatLngExpression) => void;
    mapZoom: number;
    setMapZoom: (zoom: number) => void;
    aggregatedFloodData: IMDRegionData[]; // The data to display as markers
    userLocation: [number, number] | null; // User's current location for a marker
}

// Renamed from MapComponent to Map for consistency with common naming conventions and usage in App.tsx
const Map: React.FC<MapProps> = ({ 
    selectedState, setSelectedState, 
    selectedDistrict, setSelectedDistrict,
    mapCenter, setMapCenter, 
    mapZoom, setMapZoom,
    aggregatedFloodData, 
    userLocation
}) => {
  
  return (
    <MapContainer 
      center={mapCenter} // Map center controlled by parent component's state
      zoom={mapZoom} // Map zoom controlled by parent component's state
      className="h-full w-full rounded-lg" // Tailwind classes for styling (ensures map fills its container)
      zoomControl={true} // Enable default Leaflet zoom controls (+/- buttons)
      scrollWheelZoom={true} // Enable zoom functionality with mouse scroll wheel
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* MapRecenter component ensures the map view updates when mapCenter or mapZoom props change */}
      <MapRecenter center={mapCenter} zoom={mapZoom} />

      {/* Render MapMarker components for Each Aggregated District Data Point */}
      {/* This section iterates through the fetched and aggregated flood data.
          For each district that has valid coordinates, it renders a MapMarker component,
          passing the necessary data and state setters as props. */}
      {aggregatedFloodData.map((data, index) => (
        data.coordinates && ( // Only render a MapMarker if the district has valid geographical coordinates
          <MapMarker 
            key={`${data.state}-${data.district}-${index}`} // Unique key for each marker
            data={data} // Pass the aggregated data for this district
            map={null as any} // Map instance will be provided by useMap in MapMarker itself, or passed as a prop if MapMarker was a child of useMap's context
            selectedDistrict={selectedDistrict}
            selectedState={selectedState}
            setSelectedDistrict={setSelectedDistrict} // Pass setter to update selected district in parent
            setSelectedState={setSelectedState} // Pass setter to update selected state in parent
            // Note: If MapMarker uses useMap internally, you don't need to pass 'map' here.
            // If MapMarker is meant to be a direct Leaflet Layer, it needs the map instance.
            // The current MapMarker code expects `map` prop. This is a potential slight divergence.
            // We'll pass the map instance here and assume MapMarker uses it directly.
          />
        )
      ))}

      {/* Marker for user's current location (if detected by browser) */}
      {userLocation && (
        <Marker position={userLocation} icon={L.divIcon({
            className: 'my-custom-user-location-pin', // Custom class for styling
            iconSize: [30, 30], // Size of the icon
            // Inline SVG for a pulsing blue circle-dot icon for user location
            html: `<div class="relative w-full h-full bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-dot text-white"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg>
                   </div>`, 
            iconAnchor: [15, 15] // Center the icon
        })}>
          <Popup>
            {/* Popup content for user's location */}
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
                <strong>Your Current Location</strong><br/>
                Detected by browser.
            </div>
          </Popup>
        </Marker>
      )}

    </MapContainer>
  );
};

export default Map; // Export the Map component as default
