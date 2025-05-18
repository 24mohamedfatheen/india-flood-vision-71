
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
import { stateOutlines } from '../../data/stateOutlines';

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
  const [statePolygons, setStatePolygons] = useState<L.Layer[]>([]);

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
      
      // Add state outlines layer group
      layersRef.current['stateOutlines'] = L.layerGroup().addTo(map.current);
      
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

    // Render state outlines with risk colors
    renderStateOutlines();

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
        const color = getRiskLevelColor(data.riskLevel);
        
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
  
  // Helper function to get color based on risk level
  const getRiskLevelColor = (riskLevel: 'low' | 'medium' | 'high' | 'severe'): string => {
    switch (riskLevel) {
      case 'severe': return '#F44336'; // Red
      case 'high': return '#FF9800';   // Orange
      case 'medium': return '#FFC107'; // Yellow
      case 'low': return '#4CAF50';    // Green
      default: return '#4CAF50';
    }
  };
  
  // Add state boundary highlighting for the selected region
  const updateStateBoundary = () => {
    if (!map.current || !layersRef.current['stateBoundaries'] || !selectedFloodData) return;
    
    // Clear existing boundaries
    const stateBoundariesLayer = layersRef.current['stateBoundaries'] as L.LayerGroup;
    stateBoundariesLayer.clearLayers();
    
    // Create a simplified state boundary (placeholder - in a real app, you'd use GeoJSON data for state boundaries)
    // This is a simplified circle representing the state boundary for demo purposes
    const stateCenter = selectedFloodData.coordinates;
    const stateRadius = Math.sqrt(selectedFloodData.affectedArea) * 500; // Scale based on affected area
    
    // Get color based on risk level
    const stateColor = getRiskLevelColor(selectedFloodData.riskLevel);
    
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

  // Render state outlines with risk-based colors
  const renderStateOutlines = () => {
    if (!map.current || !layersRef.current['stateOutlines']) return;
    
    // Clear existing state outlines
    const stateOutlinesLayer = layersRef.current['stateOutlines'] as L.LayerGroup;
    stateOutlinesLayer.clearLayers();
    
    // Clean up previous state polygons
    statePolygons.forEach(polygon => {
      if (map.current && polygon) {
        try {
          map.current.removeLayer(polygon);
        } catch (err) {
          console.error("Error removing layer:", err);
        }
      }
    });
    
    const newStatePolygons: L.Layer[] = [];
    
    // For each state outline in our data
    stateOutlines.forEach(state => {
      // Find flood data for this state if available
      const stateFloodData = floodData.find(data => 
        data.state.toLowerCase() === state.name.toLowerCase()
      );
      
      // Determine the risk level and color
      let riskLevel: 'low' | 'medium' | 'high' | 'severe' = 'low';
      if (stateFloodData) {
        riskLevel = stateFloodData.riskLevel;
      }
      
      const color = getRiskLevelColor(riskLevel);
      
      try {
        // Create a proper Leaflet DivIcon instead of using raw SVG
        const stateIcon = L.divIcon({
          className: 'state-outline-icon',
          html: `<svg xmlns="http://www.w3.org/2000/svg" width="230" height="230">
                   <path d="${state.path}" fill="${color}" fill-opacity="0.4" stroke="${color}" stroke-width="2" />
                 </svg>`,
          iconSize: [230, 230],
          iconAnchor: [115, 115]
        });
        
        // Create a marker with the state icon
        const marker = L.marker([20.5937, 78.9629], { 
          icon: stateIcon,
          interactive: true
        });
        
        // Bind tooltip and popup
        if (stateFloodData) {
          marker.bindTooltip(state.name + ` - ${riskLevel.toUpperCase()} risk`);
          marker.bindPopup(`
            <div class="font-bold">${state.name}</div>
            <div>Risk Level: ${riskLevel.toUpperCase()}</div>
            <div>Affected Area: ${stateFloodData.affectedArea} km²</div>
            <div>Population: ${stateFloodData.populationAffected.toLocaleString()}</div>
          `);
        } else {
          marker.bindTooltip(state.name + ' - No data');
        }
        
        // Add to the layer group
        marker.addTo(stateOutlinesLayer);
        
        // Store the marker
        newStatePolygons.push(marker);
      } catch (err) {
        console.error(`Error creating outline for state ${state.name}:`, err);
      }
    });
    
    // Update state
    setStatePolygons(newStatePolygons);
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
