// src/components/map/MapMarker.tsx

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
// Import the IMDRegionData type from your service for type safety
import { IMDRegionData } from '../../services/imdApiService';

// Define the props for the MapMarker component
interface MapMarkerProps {
  data: IMDRegionData; // The aggregated flood data for this specific district
  map: L.Map; // The Leaflet map instance from the parent Map component
  selectedDistrict: string; // The currently selected district from the app's state
  selectedState: string; // The currently selected state from the app's state
  setSelectedDistrict: (district: string) => void; // Callback to update selected district in parent
  setSelectedState: (state: string) => void; // Callback to update selected state in parent
}

const MapMarker: React.FC<MapMarkerProps> = ({ 
  data, 
  map, 
  selectedDistrict, 
  selectedState,
  setSelectedDistrict,
  setSelectedState
}) => {
  // useRef to hold the Leaflet marker instance, so we can control it directly
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!map || !data.coordinates) return; // Ensure map and data are valid

    // Determine marker color based on the flood risk level from aggregated data
    const color = 
      data.floodRiskLevel === 'severe' ? '#F44336' : // Red
      data.floodRiskLevel === 'high' ? '#FF9800' :   // Orange
      data.floodRiskLevel === 'medium' ? '#FFEB3B' : // Yellow
      '#8BC34A'; // Green (low risk)
    
    // Create custom marker icon using L.divIcon to embed SVG and dynamic styling
    const customIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center p-1 rounded-full shadow-lg" 
             style="background-color: ${color};">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin text-white"><path d="M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/><path d="M19 10c0 7-7 12-7 12S5 17 5 10a7 7 0 0 1 14 0Z"/></svg>
        </div>
      `,
      // Add 'animate-pulse' class for severe/high risk markers for visual emphasis
      className: data.floodRiskLevel === 'severe' || data.floodRiskLevel === 'high' ? 'animate-pulse' : '',
      iconSize: [36, 36],    // Size of the icon
      iconAnchor: [18, 36],  // Point of the icon which will correspond to marker's location
      popupAnchor: [0, -30] // Point from which the popup should open relative to the iconAnchor
    });
    
    // Create Leaflet marker instance if it doesn't exist, or update its icon/position
    if (!markerRef.current) {
      markerRef.current = L.marker([data.coordinates[0], data.coordinates[1]], {
        icon: customIcon
      }).addTo(map);
    } else {
      markerRef.current.setLatLng([data.coordinates[0], data.coordinates[1]]);
      markerRef.current.setIcon(customIcon);
    }

    // --- Prepare Popup Content ---
    const popupContent = `
      <div style="font-family: 'Inter', sans-serif; font-size: 14px; color: #333; padding: 5px;">
        <strong style="font-size: 16px;">${data.district}, ${data.state}</strong><br/>
        <div style="margin-top: 5px;">
            Risk Level: <strong style="color: ${color};">${data.floodRiskLevel.toUpperCase()}</strong>
        </div>
        <div style="margin-top: 5px;">
            Reservoir % Full: ${data.reservoirPercentage ? `<strong>${data.reservoirPercentage.toFixed(1)}%</strong>` : 'N/A'}<br/>
            Inflow (Cusecs): ${data.inflowCusecs ? `<strong>${data.inflowCusecs.toLocaleString()}</strong>` : 'N/A'}<br/>
            Outflow (Cusecs): ${data.outflowCusecs ? `<strong>${data.outflowCusecs.toLocaleString()}</strong>` : 'N/A'}<br/>
            Last Updated: ${data.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString() : 'N/A'}
        </div>
      </div>
    `;
    
    // Bind popup to marker
    markerRef.current.bindPopup(popupContent);

    // Add click event handler to the marker
    markerRef.current.on('click', () => {
      // Update the selected state and district in the parent component's state
      setSelectedState(data.state);
      setSelectedDistrict(data.district);
      // Open the popup when clicked (if it's not already open)
      markerRef.current?.openPopup();
    });

    // --- Highlight marker if it's the currently selected region ---
    const isSelected = data.district.toLowerCase() === selectedDistrict.toLowerCase() &&
                       data.state.toLowerCase() === selectedState.toLowerCase();

    const markerElement = markerRef.current.getElement();
    if (markerElement) {
      // Apply/remove highlight class based on selection status
      if (isSelected) {
        markerElement.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2', 'z-50');
        // Ensure popup is open for the selected marker when it's first selected or on component mount
        if (!markerRef.current.getPopup()?.isOpen()) {
            markerRef.current.openPopup();
        }
      } else {
        markerElement.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2', 'z-50');
        // Close popup if no longer selected
        if (markerRef.current.getPopup()?.isOpen()) {
            markerRef.current.closePopup();
        }
      }
    }

    // Cleanup function: runs when component unmounts or dependencies change
    return () => {
      if (markerRef.current) {
        map.removeLayer(markerRef.current); // Remove the marker from the map
        markerRef.current = null; // Clear the ref
      }
    };
  }, [data, map, selectedDistrict, selectedState, setSelectedDistrict, setSelectedState]); // Dependencies for useEffect

  return null; // This component does not render any visible UI directly
};

export default MapMarker;
