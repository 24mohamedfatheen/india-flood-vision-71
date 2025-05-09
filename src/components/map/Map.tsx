
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { floodData, getFloodDataForRegion } from '../../data/floodData';
import { useToast } from '../../hooks/use-toast';
import MapControls from './MapControls';
import MapMarker from './MapMarker';
import MapLegend from './MapLegend';
import MapAttribution from './MapAttribution';
import MapPlaceholder from './MapPlaceholder';
import { createFloodAreaPolygon } from './MapUtils';
import { MapProps } from './types';

// Fix: Use import.meta.env instead of process.env for Vite
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja2V5MGkyd28waWRqMnJvZXA3bjA3M3JpIn0._example_mapbox_token";
// Note: This is a placeholder. In production, NEVER hardcode API tokens.
// Instead, use environment variables or another secure method.

const Map: React.FC<MapProps> = ({ selectedRegion }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapLayers, setMapLayers] = useState<string[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const selectedFloodData = getFloodDataForRegion(selectedRegion);
  const { toast } = useToast();
  const [showMapboxTokenWarning, setShowMapboxTokenWarning] = useState<boolean>(
    MAPBOX_TOKEN.includes("_example_mapbox_token")
  );

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    if (showMapboxTokenWarning) return; // Don't initialize if token is not valid

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11', // Light style for better overlay visibility
        center: [78.9629, 20.5937], // Center of India
        zoom: 4,
        projection: 'mercator',
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // On map load event
      map.current.on('load', () => {
        setMapLoaded(true);
        
        // Add source for flood affected areas
        map.current.addSource('flood-areas', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });

        // Add layer for flood affected areas
        map.current.addLayer({
          id: 'flood-areas-fill',
          type: 'fill',
          source: 'flood-areas',
          paint: {
            'fill-color': [
              'match',
              ['get', 'risk_level'],
              'severe', '#F44336',
              'high', '#FF9800',
              'medium', '#FFC107',
              'low', '#4CAF50',
              '#4CAF50'
            ],
            'fill-opacity': 0.3
          }
        });

        // Add layer for flood area outlines
        map.current.addLayer({
          id: 'flood-areas-line',
          type: 'line',
          source: 'flood-areas',
          paint: {
            'line-color': [
              'match',
              ['get', 'risk_level'],
              'severe', '#D32F2F',
              'high', '#F57C00',
              'medium', '#FFA000',
              'low', '#388E3C',
              '#388E3C'
            ],
            'line-width': 2
          }
        });
        
        setMapLayers(['flood-areas-fill', 'flood-areas-line']);
      });

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
  }, [showMapboxTokenWarning, toast]);

  // Update map when selected region changes
  useEffect(() => {
    if (!mapLoaded || !map.current || !selectedFloodData) return;

    // Fly to the selected region
    map.current.flyTo({
      center: [selectedFloodData.coordinates[1], selectedFloodData.coordinates[0]],
      zoom: 6,
      essential: true
    });

    // Update the flood affected areas source
    updateFloodAreas();

  }, [selectedRegion, mapLoaded, selectedFloodData]);

  // Update flood areas on map
  const updateFloodAreas = () => {
    if (!map.current) return;
    
    // Generate flood area features
    const features = floodData
      .filter(data => data.riskLevel !== 'low') // Only show medium, high, and severe risk areas
      .map(createFloodAreaPolygon)
      .filter(Boolean);
    
    // Update the source data
    const source = map.current.getSource('flood-areas') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: features as GeoJSON.Feature[]
      });
    }
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
    map.current.flyTo({
      center: [78.9629, 20.5937], // Center of India
      zoom: 4,
      essential: true
    });
  };

  // Toggle layer visibility
  const toggleLayerVisibility = (layerId: string) => {
    if (!map.current) return;
    
    const visibility = map.current.getLayoutProperty(layerId, 'visibility');
    
    // Toggle layer visibility
    if (visibility === 'visible') {
      map.current.setLayoutProperty(layerId, 'visibility', 'none');
    } else {
      map.current.setLayoutProperty(layerId, 'visibility', 'visible');
    }
  };

  return (
    <div className="map-container mb-6 border rounded-lg overflow-hidden relative">
      <MapPlaceholder showMapboxTokenWarning={showMapboxTokenWarning} />
      
      {!showMapboxTokenWarning && (
        <>
          <div
            ref={mapContainer}
            className="absolute inset-0 w-full h-full"
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
        </>
      )}
    </div>
  );
};

export default Map;
