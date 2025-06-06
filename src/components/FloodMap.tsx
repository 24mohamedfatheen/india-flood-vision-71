
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface FloodMapProps {
  selectedState?: string;
  selectedDistrict?: string;
  className?: string;
}

// Color scale function based on flood risk level
const getColor = (riskLevel: number): string => {
  switch (riskLevel) {
    case 0: return '#16A34A'; // green - Low risk
    case 1: return '#EAB308'; // yellow - Medium risk  
    case 2: return '#F97316'; // orange - High risk
    case 3: return '#DC2626'; // red - Severe risk
    default: return '#9CA3AF'; // gray - No data
  }
};

// Enhanced normalize function for better district name matching
const normalizeDistrictName = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\b(district|dist|city|municipal|corporation)\b/g, '') // Remove common suffixes
    .trim();
};

// Enhanced matching function - moved to top level to avoid hoisting issues
const isDistrictMatch = (geoJsonName: string, targetName: string): boolean => {
  const normalized1 = normalizeDistrictName(geoJsonName);
  const normalized2 = normalizeDistrictName(targetName);
  
  // Exact match
  if (normalized1 === normalized2) return true;
  
  // Partial match (either contains the other)
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return true;
  
  // Word-based matching for compound names
  const words1 = normalized1.split(' ').filter(w => w.length > 2);
  const words2 = normalized2.split(' ').filter(w => w.length > 2);
  
  // Check if any significant words match
  return words1.some(word1 => words2.some(word2 => word1.includes(word2) || word2.includes(word1)));
};

const FloodMap: React.FC<FloodMapProps> = ({ 
  selectedState, 
  selectedDistrict, 
  className = "" 
}) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [matchedDistricts, setMatchedDistricts] = useState<Set<string>>(new Set());
  const [selectedDistrictFound, setSelectedDistrictFound] = useState<boolean>(false);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Fetch GeoJSON data for Indian districts
  useEffect(() => {
    const fetchGeoJson = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🗺️ Fetching Indian districts GeoJSON...');
        const response = await fetch('https://raw.githubusercontent.com/datameet/maps/master/Districts/india_district.geojson');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch GeoJSON: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ GeoJSON loaded successfully:', data);
        
        // Create a set of normalized district names from GeoJSON for matching
        const geoJsonDistricts = new Set<string>();
        
        // Add random flood risk levels for demonstration and collect district names
        data.features.forEach((feature: any) => {
          feature.properties.floodRiskLevel = Math.floor(Math.random() * 4);
          
          // Collect district names for matching validation
          if (feature.properties.NAME_2) {
            geoJsonDistricts.add(normalizeDistrictName(feature.properties.NAME_2));
          }
        });
        
        setMatchedDistricts(geoJsonDistricts);
        setGeoJsonData(data);
        
        console.log(`📊 GeoJSON contains ${geoJsonDistricts.size} districts for matching`);
      } catch (error) {
        console.error('❌ Error fetching GeoJSON:', error);
        setError('Could not load map data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGeoJson();
  }, []);

  // Check if selected district exists in GeoJSON when selection changes
  useEffect(() => {
    if (selectedDistrict && geoJsonData) {
      let found = false;
      
      geoJsonData.features.forEach((feature: any) => {
        if (feature.properties.NAME_2) {
          if (isDistrictMatch(feature.properties.NAME_2, selectedDistrict)) {
            found = true;
          }
        }
      });
      
      setSelectedDistrictFound(found);
      console.log(`🔍 District "${selectedDistrict}" ${found ? 'found' : 'not found'} in GeoJSON`);
    }
  }, [selectedDistrict, geoJsonData]);

  // Style function for GeoJSON features with improved highlighting
  const styleFeature = (feature: any) => {
    const riskLevel = feature?.properties?.floodRiskLevel || 0;
    let isSelected = false;
    
    // Check if this feature matches the selected district
    if (selectedDistrict && selectedState) {
      const featureDistrict = feature.properties?.NAME_2 || '';
      const featureState = feature.properties?.NAME_1 || '';
      
      const isDistrictNameMatch = featureDistrict && isDistrictMatch(featureDistrict, selectedDistrict);
      const isStateMatch = featureState && normalizeDistrictName(featureState).includes(normalizeDistrictName(selectedState));
      
      isSelected = isDistrictNameMatch && isStateMatch;
    }
    
    return {
      fillColor: getColor(riskLevel),
      weight: isSelected ? 4 : 1,
      opacity: 1,
      color: isSelected ? '#000' : 'white',
      dashArray: '',
      fillOpacity: isSelected ? 0.9 : 0.6
    };
  };

  // Event handlers for map features
  const onEachFeature = (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    
    // Add popup with district information
    if (props) {
      const riskLevel = props.floodRiskLevel || 0;
      const riskText = ['Low Risk', 'Medium Risk', 'High Risk', 'Severe Risk'][riskLevel];
      const districtName = props.NAME_2 || 'Unknown District';
      const stateName = props.NAME_1 || 'Unknown State';
      
      // Check if this district matches our selection
      const isSelected = selectedDistrict && selectedState && 
                        isDistrictMatch(districtName, selectedDistrict) &&
                        normalizeDistrictName(stateName).includes(normalizeDistrictName(selectedState));
      
      layer.bindPopup(`
        <div>
          <h3><strong>${districtName}</strong></h3>
          <p>State: ${stateName}</p>
          <p>Flood Risk: <span style="color: ${getColor(riskLevel)}"><strong>${riskText}</strong></span></p>
          ${isSelected ? '<p style="color: #059669; font-size: 12px;">📍 Currently Selected</p>' : ''}
        </div>
      `);
    }

    // Add event listeners for interactivity
    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.8
        });
        layer.bringToFront();
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        if (geoJsonLayerRef.current) {
          geoJsonLayerRef.current.resetStyle(e.target);
        }
      },
      click: (e: L.LeafletMouseEvent) => {
        const layer = e.target;
        if (mapRef.current) {
          mapRef.current.fitBounds(layer.getBounds());
        }
      }
    });
  };

  // Zoom to selected district when selection changes
  useEffect(() => {
    if (selectedDistrict && selectedState && geoJsonData && geoJsonLayerRef.current && mapRef.current) {
      let targetLayer: L.Layer | null = null;
      
      geoJsonLayerRef.current.eachLayer((layer: L.Layer) => {
        const feature = (layer as any).feature;
        if (feature?.properties?.NAME_2 && feature?.properties?.NAME_1) {
          const isDistrictNameMatch = isDistrictMatch(feature.properties.NAME_2, selectedDistrict);
          const isStateMatch = normalizeDistrictName(feature.properties.NAME_1).includes(normalizeDistrictName(selectedState));
          
          if (isDistrictNameMatch && isStateMatch) {
            targetLayer = layer;
          }
        }
      });
      
      if (targetLayer) {
        setTimeout(() => {
          mapRef.current?.fitBounds((targetLayer as any).getBounds());
          console.log(`🎯 Zoomed to selected district: ${selectedDistrict}, ${selectedState}`);
        }, 500);
      }
    }
  }, [selectedDistrict, selectedState, geoJsonData]);

  if (loading) {
    return (
      <div className={`w-full h-[400px] bg-gray-100 flex items-center justify-center rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading flood risk map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full h-[400px] bg-red-50 flex items-center justify-center rounded-lg border border-red-200 ${className}`}>
        <div className="text-center">
          <p className="text-red-600 mb-2">Map Error</p>
          <p className="text-red-500 text-sm">{error}</p>
          <p className="text-red-400 text-xs mt-2">Please check your internet connection and try again</p>
        </div>
      </div>
    );
  }

  const mapCenter: L.LatLngExpression = [20.5937, 78.9629];

  return (
    <div className={`w-full h-[400px] rounded-lg overflow-hidden relative ${className}`}>
      <MapContainer
        {...{
          center: mapCenter,
          zoom: 5,
          style: { height: '100%', width: '100%' },
          scrollWheelZoom: true,
          ref: mapRef
        }}
      >
        <TileLayer
          {...{
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }}
        />
        
        {geoJsonData && (
          <GeoJSON
            {...{
              key: `geojson-${selectedDistrict}-${selectedState}`,
              data: geoJsonData,
              pathOptions: styleFeature,
              eventHandlers: {
                add: (e) => {
                  const layer = e.target;
                  if (layer.eachLayer) {
                    layer.eachLayer((subLayer: L.Layer) => {
                      const feature = (subLayer as any).feature;
                      if (feature) {
                        onEachFeature(feature, subLayer);
                      }
                    });
                  }
                }
              },
              ref: geoJsonLayerRef
            }}
          />
        )}
      </MapContainer>
      
      {/* Enhanced Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg border z-10">
        <h4 className="text-sm font-semibold mb-2">Flood Risk Levels</h4>
        <div className="space-y-1">
          <div className="flex items-center">
            <span className="w-4 h-4 rounded" style={{ backgroundColor: getColor(0) }}></span>
            <span className="ml-2 text-xs">Low Risk</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded" style={{ backgroundColor: getColor(1) }}></span>
            <span className="ml-2 text-xs">Medium Risk</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded" style={{ backgroundColor: getColor(2) }}></span>
            <span className="ml-2 text-xs">High Risk</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded" style={{ backgroundColor: getColor(3) }}></span>
            <span className="ml-2 text-xs">Severe Risk</span>
          </div>
        </div>
        {selectedDistrict && selectedState && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600">Selected:</p>
            <p className="text-xs font-medium">{selectedDistrict}, {selectedState}</p>
            <p className="text-xs text-gray-500">
              {selectedDistrictFound ? '✅ Found in map' : '⚠️ Not found in map data'}
            </p>
          </div>
        )}
      </div>
      
      {/* District not found warning */}
      {selectedDistrict && selectedState && !selectedDistrictFound && (
        <div className="absolute top-4 left-4 bg-yellow-50 border border-yellow-200 p-2 rounded-lg z-10 max-w-sm">
          <p className="text-xs text-yellow-800">
            <strong>District not found:</strong> {selectedDistrict} could not be located in the map data. This may be due to different naming conventions.
          </p>
        </div>
      )}
    </div>
  );
};

export default FloodMap;
