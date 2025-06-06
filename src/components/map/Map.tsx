
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { floodData, getFloodDataForRegion, fetchImdData } from '../../data/floodData';
import { useToast } from '../../hooks/use-toast';
import MapControls from './MapControls';
import MapMarker from './MapMarker';
import MapLegend from './MapLegend';
import MapAttribution from './MapAttribution';
import { createFloodAreaPolygon } from './MapUtils';
import { MapProps } from './types';

const MapComponent: React.FC<MapProps> = ({ selectedRegion }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const popupRef = useRef<L.Popup | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const layersRef = useRef<{[key: string]: L.Layer}>({});
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const selectedFloodData = getFloodDataForRegion(selectedRegion);
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchImdData();
        setDataLoaded(true);
        console.log('Flood data loaded successfully, total regions:', floodData.length);
      } catch (error) {
        console.error('Error loading flood data:', error);
        toast({
          title: "Data Error",
          description: "Could not load flood data. Please try again later.",
          variant: "destructive"
        });
      }
    };

    loadData();
  }, [toast]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    try {
      // Fix Leaflet icon issues with webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
      
      // Create the Leaflet map centered on India
      map.current = L.map(mapContainer.current, {
        attributionControl: false,
        zoomControl: false
      }).setView([20.5937, 78.9629], 5);
      
      // Add the OpenStreetMap tile layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map.current);
      
      // Add flood areas layer group
      layersRef.current['floodAreas'] = L.layerGroup().addTo(map.current);
      
      // Add state boundaries layer group
      layersRef.current['stateBoundaries'] = L.layerGroup().addTo(map.current);
      
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
    if (!mapLoaded || !map.current || !selectedFloodData || !dataLoaded) return;

    // Fly to the selected region with a closer zoom for smaller viewport
    map.current.flyTo(
      [selectedFloodData.coordinates[0], selectedFloodData.coordinates[1]],
      7,
      { animate: true, duration: 1 }
    );

    // Update the flood affected areas
    updateFloodAreas();

    // Add state boundary highlighting
    updateStateBoundary();

  }, [selectedRegion, mapLoaded, selectedFloodData, dataLoaded]);

  // Update flood areas on map
  const updateFloodAreas = () => {
    if (!map.current || !layersRef.current['floodAreas'] || !dataLoaded) return;
    
    // Clear existing flood areas
    const floodAreasLayer = layersRef.current['floodAreas'] as L.LayerGroup;
    floodAreasLayer.clearLayers();
    
    // Generate flood area features for regions with higher risk
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
          <div>Reservoir Level: ${data.riverLevel || 'N/A'}</div>
          <div>Population: ${data.populationAffected.toLocaleString() || 'N/A'}</div>
        `);
        
        // Add to layer group
        polygon.addTo(floodAreasLayer);
      }
    });
  };
  
  // Add state boundary highlighting for the selected region
  const updateStateBoundary = () => {
    if (!map.current || !layersRef.current['stateBoundaries'] || !selectedFloodData) return;
    
    // Clear existing boundaries
    const stateBoundariesLayer = layersRef.current['stateBoundaries'] as L.LayerGroup;
    stateBoundariesLayer.clearLayers();
    
    // Create a simplified state boundary (placeholder - in a real app, you'd use GeoJSON data for state boundaries)
    const stateCenter = selectedFloodData.coordinates;
    const stateRadius = 50000; // Fixed radius for demo purposes
    
    // Get color based on risk level
    const stateColor = 
      selectedFloodData.riskLevel === 'severe' ? '#F44336' :
      selectedFloodData.riskLevel === 'high' ? '#FF9800' :
      selectedFloodData.riskLevel === 'medium' ? '#FFC107' : 
      '#4CAF50';
    
    // Create circle representing state with color based on risk level
    const stateCircle = L.circle(stateCenter, {
      radius: stateRadius,
      color: stateColor,
      weight: 2,
      opacity: 0.8,
      fill: true,
      fillColor: stateColor,
      fillOpacity: 0.15,
    }).addTo(stateBoundariesLayer);
    
    // Add state label
    const stateName = selectedFloodData.state;
    const icon = L.divIcon({
      className: 'state-label',
      html: `<div style="background-color: white; padding: 3px 5px; border-radius: 3px; font-weight: bold; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">${stateName}</div>`,
      iconSize: [100, 20],
      iconAnchor: [50, 10]
    });
    
    L.marker(stateCenter, { icon: icon }).addTo(stateBoundariesLayer);
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
    <div className="map-container border rounded-lg overflow-hidden relative">
      <div
        ref={mapContainer}
        className="absolute inset-0 w-full h-full"
        style={{ minHeight: "300px" }}
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
      
      {/* Show loading indicator while data is being fetched */}
      {!dataLoaded && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-center">Loading flood data...</div>
          </div>
        </div>
      )}
      
      {/* Render map markers once the map and data are loaded */}
      {mapLoaded && map.current && dataLoaded && floodData.map(data => (
        <MapMarker 
          key={`${data.state}-${data.region}`}
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
