
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

// Normalize district names for comparison
const normalizeDistrictName = (name: string): string => {
  if (!name) return '';
  return name.toLowerCase().trim().replace(/\s+/g, ' ');
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
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  // Fetch GeoJSON data for Indian districts
  useEffect(() => {
    const fetchGeoJson = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching Indian districts GeoJSON...');
        const response = await fetch('https://raw.githubusercontent.com/datameet/maps/master/Districts/india_district.geojson');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch GeoJSON: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('GeoJSON loaded successfully:', data);
        
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
        
        console.log(`GeoJSON contains ${geoJsonDistricts.size} districts for matching`);
      } catch (error) {
        console.error('Error fetching GeoJSON:', error);
        setError('Could not load map data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGeoJson();
  }, []);

  // Style function for GeoJSON features
  const styleFeature = (feature: any) => {
    const riskLevel = feature?.properties?.floodRiskLevel || 0;
    return {
      fillColor: getColor(riskLevel),
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '',
      fillOpacity: 0.6
    };
  };

  // Highlight feature on mouse over
  const highlightFeature = (e: L.LeafletMouseEvent) => {
    const layer = e.target;
    layer.setStyle({
      weight: 3,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.8
    });
    layer.bringToFront();
  };

  // Reset highlight on mouse out
  const resetHighlight = (e: L.LeafletMouseEvent) => {
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.resetStyle(e.target);
    }
  };

  // Zoom to feature on click
  const zoomToFeature = (e: L.LeafletMouseEvent) => {
    const layer = e.target;
    const map = layer._map;
    if (map) {
      map.fitBounds(layer.getBounds());
    }
  };

  // Event handlers for each feature
  const onEachFeature = (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    
    // Add popup with district information
    if (props) {
      const riskLevel = props.floodRiskLevel || 0;
      const riskText = ['Low Risk', 'Medium Risk', 'High Risk', 'Severe Risk'][riskLevel];
      const districtName = props.NAME_2 || 'Unknown District';
      const stateName = props.NAME_1 || 'Unknown State';
      
      // Check if this district matches our normalized dataset
      const normalizedDistrict = normalizeDistrictName(districtName);
      const isMatched = matchedDistricts.has(normalizedDistrict);
      
      layer.bindPopup(`
        <div>
          <h3><strong>${districtName}</strong></h3>
          <p>State: ${stateName}</p>
          <p>Flood Risk: <span style="color: ${getColor(riskLevel)}"><strong>${riskText}</strong></span></p>
          ${!isMatched ? '<p style="color: #f59e0b; font-size: 12px;">⚠️ Limited data available</p>' : ''}
        </div>
      `);
    }

    // Add event listeners
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });

    // Highlight selected district with improved matching
    if (selectedDistrict && selectedState) {
      const featureDistrict = normalizeDistrictName(props?.NAME_2 || '');
      const featureState = normalizeDistrictName(props?.NAME_1 || '');
      const targetDistrict = normalizeDistrictName(selectedDistrict);
      const targetState = normalizeDistrictName(selectedState);
      
      const isDistrictMatch = featureDistrict.includes(targetDistrict) || targetDistrict.includes(featureDistrict);
      const isStateMatch = featureState.includes(targetState) || targetState.includes(featureState);
      
      if (isDistrictMatch && isStateMatch) {
        setTimeout(() => {
          layer.setStyle({
            weight: 4,
            color: '#000',
            fillOpacity: 0.9
          });
          layer.bringToFront();
          
          // Zoom to the selected district
          const map = (layer as any)._map;
          if (map) {
            map.fitBounds((layer as any).getBounds());
          }
        }, 100);
      }
    }
  };

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

  return (
    <div className={`w-full h-[400px] rounded-lg overflow-hidden ${className}`}>
      <MapContainer
        center={[20.5937, 78.9629] as L.LatLngExpression}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {geoJsonData && (
          <GeoJSON
            key="indian-districts"
            data={geoJsonData}
            pathOptions={styleFeature}
            eventHandlers={{
              add: (e) => {
                const layer = e.target;
                geoJsonLayerRef.current = layer;
                
                // Apply onEachFeature to all features
                layer.eachLayer((featureLayer: L.Layer) => {
                  const feature = (featureLayer as any).feature;
                  if (feature) {
                    onEachFeature(feature, featureLayer);
                  }
                });
              }
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
          </div>
        )}
      </div>
      
      {/* Fallback UI for unmatched districts */}
      {selectedDistrict && selectedState && (
        <div className="absolute top-4 left-4 bg-yellow-50 border border-yellow-200 p-2 rounded-lg z-10 max-w-sm">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> If your selected district isn't highlighted, it might have limited flood data available in our current dataset.
          </p>
        </div>
      )}
    </div>
  );
};

export default FloodMap;
