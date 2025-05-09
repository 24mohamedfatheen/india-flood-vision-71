
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { floodData, getFloodDataForRegion } from '../../data/floodData';
import { useToast } from '../../hooks/use-toast';
import MapControls from './MapControls';
import MapMarker from './MapMarker';
import MapLegend from './MapLegend';
import MapAttribution from './MapAttribution';
import { createFloodAreaPolygon } from './MapUtils';
import { MapProps } from './types';

// Fix Leaflet icon issues with webpack
// This is needed because Leaflet's default icons reference image files that aren't properly bundled
useEffect(() => {
  // Only run this once when the component mounts
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}, []);

const MapComponent: React.FC<MapProps> = ({ selectedRegion }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const popupRef = useRef<L.Popup | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const layersRef = useRef<{[key: string]: L.Layer}>({});
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const selectedFloodData = getFloodDataForRegion(selectedRegion);
  const { toast } = useToast();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    try {
      // Create the Leaflet map
      map.current = L.map(mapContainer.current).setView([20.5937, 78.9629], 5);
      
      // Add the OpenStreetMap tile layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map.current);
      
      // Add flood areas layer group
      layersRef.current['floodAreas'] = L.layerGroup().addTo(map.current);
      
      setMapLoaded(true);
      
      const now = new Date();
      setLastUpdate(now.toLocaleString());
      
      return () => {
        if (map.current) {
          map.current.remove();
        }
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      toast({
        title: "Map Error",
        description: "Could not initialize map. Please check your connection.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Update map when selected region changes
  useEffect(() => {
    if (!mapLoaded || !map.current || !selectedFloodData) return;

    // Fly to the selected region
    map.current.setView(
      [selectedFloodData.coordinates[0], selectedFloodData.coordinates[1]],
      7,
      { animate: true, duration: 1 }
    );

    // Update the flood affected areas
    updateFloodAreas();

  }, [selectedRegion, mapLoaded, selectedFloodData]);

  // Update flood areas on map
  const updateFloodAreas = () => {
    if (!map.current || !layersRef.current['floodAreas']) return;
    
    // Clear existing flood areas
    const floodAreasLayer = layersRef.current['floodAreas'] as L.LayerGroup;
    floodAreasLayer.clearLayers();
    
    // Generate flood area features
    const filteredFloodData = floodData.filter(data => data.riskLevel !== 'low');
    
    filteredFloodData.forEach(data => {
      const geoJsonPolygon = createFloodAreaPolygon(data);
      if (geoJsonPolygon) {
        // Create Leaflet polygon from GeoJSON
        const color = 
          data.riskLevel === 'severe' ? '#F44336' :
          data.riskLevel === 'high' ? '#FF9800' :
          data.riskLevel === 'medium' ? '#FFC107' : 
          '#4CAF50';
        
        const polygon = L.geoJSON(geoJsonPolygon as any, {
          style: {
            color: color,
            weight: 2,
            opacity: 1,
            fillColor: color,
            fillOpacity: 0.3
          }
        });
        
        // Add popup with information
        polygon.bindPopup(`
          <div class="font-bold">${data.region}, ${data.state}</div>
          <div>Risk Level: ${data.riskLevel.toUpperCase()}</div>
          <div>Area: ${data.affectedArea} km²</div>
          <div>Population: ${data.populationAffected.toLocaleString()}</div>
        `);
        
        // Add to layer group
        polygon.addTo(floodAreasLayer);
      }
    });
  };

  // Handle zoom controls
  const handleZoomIn = () => {
    if (!map.current) return;
    map.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (!map.current) return;
    map.current.zoomOut();
  };

  const handleResetView = () => {
    if (!map.current) return;
    map.current.setView([20.5937, 78.9629], 5, { animate: true });
  };

  // Toggle layer visibility
  const toggleLayerVisibility = (layerId: string) => {
    if (!map.current || !layersRef.current[layerId]) return;
    
    const layer = layersRef.current[layerId];
    const isVisible = map.current.hasLayer(layer);
    
    if (isVisible) {
      map.current.removeLayer(layer);
    } else {
      map.current.addLayer(layer);
    }
  };

  return (
    <div className="map-container mb-6 border rounded-lg overflow-hidden relative">
      <div
        ref={mapContainer}
        className="absolute inset-0 w-full h-full"
        style={{ minHeight: "400px" }}
      />
      
      <MapAttribution lastUpdate={lastUpdate} />
      
      <MapControls 
        map={map.current}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleResetView={handleResetView}
        toggleLayerVisibility={toggleLayerVisibility}
      />
      
      <MapLegend />
      
      {/* Render map markers once the map is loaded */}
      {mapLoaded && map.current && floodData.map(data => (
        <MapMarker 
          key={data.id}
          data={data}
          map={map.current!}
          selectedRegion={selectedRegion}
          popupRef={popupRef}
        />
      ))}
    </div>
  );
};

export default MapComponent;
