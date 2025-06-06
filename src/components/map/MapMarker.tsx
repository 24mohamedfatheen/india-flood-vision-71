
import React, { useEffect } from 'react';
import L from 'leaflet';
import { IMDRegionData } from '../../services/imdApiService';

interface MapMarkerProps {
  data: IMDRegionData;
  map: L.Map;
  selectedDistrict: string;
  selectedState: string;
  setSelectedDistrict: (district: string) => void;
  setSelectedState: (state: string) => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ 
  data, 
  map, 
  selectedDistrict, 
  selectedState, 
  setSelectedDistrict, 
  setSelectedState 
}) => {
  useEffect(() => {
    if (!map || !data) return;

    const riskLevel = data.floodRiskLevel || 'low';
    
    // Set marker color based on risk level
    const color = 
      riskLevel === 'severe' ? '#F44336' :
      riskLevel === 'high' ? '#FF9800' :
      riskLevel === 'medium' ? '#FFC107' : 
      '#4CAF50';
    
    // Create custom marker icon
    const customIcon = L.divIcon({
      html: `
        <div class="flood-marker" style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="${color}" stroke-width="3" fill="white" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      `,
      className: riskLevel === 'severe' || riskLevel === 'high' ? 'animate-pulse' : '',
      iconSize: [24, 24],
      iconAnchor: [12, 24]
    });
    
    // Create and add marker
    const marker = L.marker([data.coordinates[0], data.coordinates[1]], {
      icon: customIcon
    }).addTo(map);
    
    // Create popup content with defensive checks
    const reservoirPercentage = data.reservoirPercentage ? data.reservoirPercentage.toFixed(1) + '%' : 'N/A';
    const inflowCusecs = data.inflowCusecs ? data.inflowCusecs.toLocaleString() : 'N/A';
    const riskDisplay = (data.floodRiskLevel || 'N/A').toUpperCase();
    
    const popupContent = `
      <div class="map-tooltip">
        <div class="font-bold text-sm">${data.district}, ${data.state}</div>
        <div class="mt-1">
          <div class="flex justify-between">
            <span>Risk Level:</span>
            <span class="font-semibold ${
              riskLevel === 'severe' ? 'text-red-600' :
              riskLevel === 'high' ? 'text-orange-500' :
              riskLevel === 'medium' ? 'text-amber-500' :
              'text-green-600'
            }">${riskDisplay}</span>
          </div>
          <div class="flex justify-between">
            <span>Reservoir Level:</span>
            <span>${reservoirPercentage}</span>
          </div>
          <div class="flex justify-between">
            <span>Inflow:</span>
            <span>${inflowCusecs} cusecs</span>
          </div>
        </div>
      </div>
    `;
    
    // Add popup to marker
    const popup = L.popup({
      closeButton: true,
      closeOnClick: true,
      maxWidth: 300
    }).setContent(popupContent);
    
    marker.bindPopup(popup);
    
    // Add click event
    marker.on('click', () => {
      setSelectedState(data.state);
      setSelectedDistrict(data.district);
      map.flyTo(data.coordinates, 10);
    });
    
    // Highlight if selected
    if (data.district === selectedDistrict && data.state === selectedState) {
      const markerElement = marker.getElement();
      if (markerElement) {
        markerElement.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2', 'z-50');
      }
      marker.openPopup();
    }

    return () => {
      map.removeLayer(marker);
    };
  }, [data, map, selectedDistrict, selectedState, setSelectedDistrict, setSelectedState]);

  return null;
};

export default MapMarker;
