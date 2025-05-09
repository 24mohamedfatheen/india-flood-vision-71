
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { floodData, getFloodDataForRegion, FloodData } from '../data/floodData';
import { ExternalLink, ZoomIn, ZoomOut, Map as MapIcon, Layers, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useToast } from '../hooks/use-toast';

interface MapProps {
  selectedRegion: string;
}

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

        // Add data points
        addDataPointsToMap();
        
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
  }, [showMapboxTokenWarning]);

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

  // Function to generate flood area polygons
  const createFloodAreaPolygon = (floodInfo: FloodData) => {
    if (!floodInfo) return null;
    
    const [lat, lng] = floodInfo.coordinates;
    // Size of the affected area in degrees (rough approximation)
    // In a real application, you would use actual GIS data
    const areaSize = Math.sqrt(floodInfo.affectedArea) * 0.01;
    
    // Create a simple circle (as a polygon) around the coordinate point
    const points = 36; // Number of points in polygon
    const coords = [];
    
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const x = lng + Math.cos(angle) * areaSize;
      const y = lat + Math.sin(angle) * areaSize;
      coords.push([x, y]);
    }
    
    // Close the polygon
    coords.push(coords[0]);
    
    return {
      type: 'Feature',
      properties: {
        name: floodInfo.region,
        state: floodInfo.state,
        risk_level: floodInfo.riskLevel,
        affected_area: floodInfo.affectedArea,
        population_affected: floodInfo.populationAffected
      },
      geometry: {
        type: 'Polygon',
        coordinates: [coords]
      }
    };
  };

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

  // Add data points to map
  const addDataPointsToMap = () => {
    if (!map.current) return;
    
    floodData.forEach(data => {
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
      .addTo(map.current);
      
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
        popup.addTo(map.current!);
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
      {showMapboxTokenWarning ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
          <div className="text-center p-6 max-w-md">
            <MapPin className="h-12 w-12 text-flood-warning mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Mapbox Token Required</h3>
            <p className="mb-4">
              To display the interactive map of India, a valid Mapbox API token is required. 
              For security reasons, we don't include a real token in demo projects.
            </p>
            <div className="text-sm text-muted-foreground mb-2">
              <p>For demonstration purposes, we're showing a static image of the map.</p>
            </div>
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline flex items-center justify-center mt-4"
            >
              Get your free Mapbox token <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="mt-4 relative w-full h-[400px] overflow-hidden">
            <img 
              src="/lovable-uploads/4cb07a0d-3ee5-4eeb-812b-39da5332c812.png" 
              alt="Map of India" 
              className="w-full h-full object-contain opacity-70"
            />
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow">
                <h3 className="font-semibold">Static Map Preview</h3>
                <p className="text-sm text-muted-foreground">Interactive map requires a valid Mapbox token</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            ref={mapContainer}
            className="absolute inset-0 w-full h-full"
          />
          <div className="absolute top-0 left-0 p-3 bg-white/80 backdrop-blur-sm rounded-br m-2 z-10 shadow-sm">
            <h3 className="font-medium text-sm">India Flood Vision Dashboard</h3>
            <p className="text-xs text-muted-foreground">
              Showing flood-affected areas across India
            </p>
            <p className="text-xs italic">Last updated: {lastUpdate}</p>
          </div>
          
          {/* Layer controls */}
          <div className="absolute top-16 right-4 z-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => toggleLayerVisibility('flood-areas-fill')}
                    className="bg-white/90 hover:bg-white mb-2"
                  >
                    <Layers className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Toggle flood areas</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Zoom controls */}
          <div className="zoom-controls">
            <Button variant="outline" size="icon" onClick={handleZoomIn} className="bg-white/90 hover:bg-white">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut} className="bg-white/90 hover:bg-white">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleResetView} className="bg-white/90 hover:bg-white">
              <MapIcon className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Map legend */}
          <div className="absolute bottom-0 left-0 p-2 bg-white/80 backdrop-blur-sm rounded-tr m-2 shadow-sm">
            <div className="text-xs font-medium mb-1">Risk Levels</div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                <span className="text-xs">Low</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-amber-400 mr-1"></span>
                <span className="text-xs">Medium</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-1"></span>
                <span className="text-xs">High</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                <span className="text-xs">Severe</span>
              </div>
            </div>
          </div>
          
          {/* Attribution */}
          <div className="absolute bottom-0 right-0 p-2 bg-white/80 backdrop-blur-sm rounded-tl m-2 shadow-sm">
            <div className="text-xs flex flex-wrap gap-x-2">
              <a href="https://mausam.imd.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">IMD</a>
              <a href="https://cwc.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">CWC</a>
              <a href="https://ndma.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">NDMA</a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Map;
