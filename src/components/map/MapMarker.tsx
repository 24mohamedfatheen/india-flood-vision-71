
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { MapMarkerProps } from './types';

const MapMarker = ({ data, map, selectedRegion, popupRef }: MapMarkerProps) => {
  React.useEffect(() => {
    if (!map) return;

    // Create custom marker element
    const markerEl = document.createElement('div');
    markerEl.className = 'flex items-center justify-center';
    markerEl.style.width = '24px';
    markerEl.style.height = '24px';
    
    // Set marker color based on risk level
    const color = 
      data.riskLevel === 'severe' ? '#F44336' :
      data.riskLevel === 'high' ? '#FF9800' :
      data.riskLevel === 'medium' ? '#FFC107' : 
      '#4CAF50';
    
    // Create marker icon
    markerEl.innerHTML = `
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="${color}" stroke-width="3" fill="white" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    `;
    
    // Add pulse effect for severe and high risk locations
    if (data.riskLevel === 'severe' || data.riskLevel === 'high') {
      markerEl.classList.add('animate-pulse');
    }
    
    // Create and add marker
    const marker = new mapboxgl.Marker({
      element: markerEl,
      anchor: 'bottom',
    })
    .setLngLat([data.coordinates[1], data.coordinates[0]])
    .addTo(map);
    
    // Create popup with info
    const popupContent = `
      <div class="map-tooltip">
        <div class="font-bold text-sm">${data.region.charAt(0).toUpperCase() + data.region.slice(1)}, ${data.state}</div>
        <div class="mt-1">
          <div class="flex justify-between">
            <span>Risk Level:</span>
            <span class="font-semibold ${
              data.riskLevel === 'severe' ? 'text-red-600' :
              data.riskLevel === 'high' ? 'text-orange-500' :
              data.riskLevel === 'medium' ? 'text-amber-500' :
              'text-green-600'
            }">${data.riskLevel.toUpperCase()}</span>
          </div>
          <div class="flex justify-between">
            <span>Affected Area:</span>
            <span>${data.affectedArea} km²</span>
          </div>
          <div class="flex justify-between">
            <span>Population:</span>
            <span>${data.populationAffected.toLocaleString()}</span>
          </div>
          ${data.predictedFlood ? `
            <div class="mt-2 pt-1 border-t border-gray-200">
              <div class="font-medium">Flood Prediction</div>
              <div class="flex justify-between">
                <span>Probability:</span>
                <span class="${
                  data.predictedFlood.probabilityPercentage > 75 ? 'text-red-600' :
                  data.predictedFlood.probabilityPercentage > 50 ? 'text-orange-500' :
                  'text-amber-500'
                }">${data.predictedFlood.probabilityPercentage}%</span>
              </div>
              <div class="flex justify-between">
                <span>Expected Date:</span>
                <span>${new Date(data.predictedFlood.date).toLocaleDateString()}</span>
              </div>
              ${data.predictedFlood.source ? `
                <div class="mt-1 text-xs flex items-center">
                  <span>Source: </span>
                  <a href="${data.predictedFlood.source.url}" target="_blank" class="text-blue-600 ml-1 hover:underline">
                    ${data.predictedFlood.source.name}
                  </a>
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
    
    // Create popup but don't add to map yet (will be added on click)
    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: true,
      closeOnClick: true,
      maxWidth: '300px'
    }).setHTML(popupContent);
    
    // Show popup on marker click
    marker.getElement().addEventListener('click', () => {
      // If there's an existing popup, remove it
      if (popupRef.current) {
        popupRef.current.remove();
      }
      
      // Set and display the new popup
      popup.addTo(map);
      marker.setPopup(popup);
      popupRef.current = popup;
      
      // If this is the selected region, highlight it
      if (data.region === selectedRegion) {
        marker.getElement().classList.add('ring-2', 'ring-blue-500');
      }
    });
    
    // Highlight the marker if it's the selected region
    if (data.region === selectedRegion) {
      marker.getElement().classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
    }

    return () => {
      marker.remove();
    };
  }, [data, map, selectedRegion, popupRef]);

  return null; // This is a functional component that interacts with the map directly
};

export default MapMarker;
