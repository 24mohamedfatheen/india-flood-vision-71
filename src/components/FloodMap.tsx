

import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import * as L from 'leaflet';
import { AlertCircle, Loader2, MapPin } from 'lucide-react';

interface FloodMapProps {
  selectedState?: string;
  selectedDistrict?: string;
  floodRiskLevel?: 'low' | 'medium' | 'high' | 'severe';
  coordinates?: [number, number] | null;
  className?: string;
  onDistrictClick?: (district: string, state: string) => void;
}

interface GeoJSONData {
  type: 'FeatureCollection';
  features: any[];
}

const FloodMap: React.FC<FloodMapProps> = ({ 
  selectedState, 
  selectedDistrict, 
  floodRiskLevel = 'medium',
  coordinates,
  className = '',
  onDistrictClick 
}) => {
  // Normalize district name for comparison
  const normalizeDistrictName = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' '); // Normalize whitespace
  };

  // Check if district matches
  const isDistrictMatch = (featureDistrictName: string): boolean => {
    if (!selectedDistrict) return false;
    
    const normalizedFeature = normalizeDistrictName(featureDistrictName);
    const normalizedSelected = normalizeDistrictName(selectedDistrict);
    
    return normalizedFeature === normalizedSelected ||
           normalizedFeature.includes(normalizedSelected) ||
           normalizedSelected.includes(normalizedFeature);
  };

  const [geoJsonData, setGeoJsonData] = useState<GeoJSONData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    const loadGeoJsonData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/india_district_boundaries.geojson');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: GeoJSONData = await response.json();
        setGeoJsonData(data);
      } catch (e: any) {
        console.error('Failed to load GeoJSON data:', e);
        setError(e.message || 'Failed to load district boundaries.');
      } finally {
        setLoading(false);
      }
    };

    loadGeoJsonData();
  }, []);

  // Style function for districts
  const getDistrictStyle = (feature: any) => {
    const districtName = feature.properties?.district || feature.properties?.DISTRICT || feature.properties?.name || '';
    const isSelected = isDistrictMatch(districtName);
    
    let fillColor = '#3388ff'; // Default blue
    if (isSelected) {
      switch (floodRiskLevel) {
        case 'low': fillColor = '#00ff00'; break;
        case 'medium': fillColor = '#ffff00'; break;
        case 'high': fillColor = '#ff8800'; break;
        case 'severe': fillColor = '#ff0000'; break;
        default: fillColor = '#3388ff'; break;
      }
    }
    
    return {
      fillColor,
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? '#000' : '#666',
      dashArray: isSelected ? '' : '3',
      fillOpacity: isSelected ? 0.7 : 0.3
    };
  };

  // Event handlers for GeoJSON features
  const onEachFeature = (feature: any, layer: L.Layer) => {
    const districtName = feature.properties?.district || feature.properties?.DISTRICT || feature.properties?.name || 'Unknown';
    
    layer.bindPopup(`
      <div>
        <strong>${districtName}</strong><br/>
        State: ${feature.properties?.state || feature.properties?.STATE || 'Unknown'}<br/>
        ${isDistrictMatch(districtName) ? `<em>Selected District</em><br/>Flood Risk: ${floodRiskLevel}` : ''}
      </div>
    `);
    
    layer.on({
      click: () => {
        if (onDistrictClick) {
          onDistrictClick(districtName, feature.properties?.state || feature.properties?.STATE || '');
        }
      }
    });
  };

  // Get map center
  const getMapCenter = (): [number, number] => {
    if (coordinates) {
      return coordinates;
    }
    if (selectedState) {
      // Default state centers (you could make this more precise)
      const stateCenters: Record<string, [number, number]> = {
        'maharashtra': [19.0760, 72.8777],
        'karnataka': [15.3173, 75.7139],
        'tamil nadu': [11.1271, 78.6569],
        'andhra pradesh': [15.9129, 79.7400],
        'kerala': [10.8505, 76.2711],
        'gujarat': [23.0225, 72.5714],
        'rajasthan': [27.0238, 74.2179],
        'madhya pradesh': [22.9734, 78.6569],
        'uttar pradesh': [26.8467, 80.9462],
        'bihar': [25.0961, 85.3131],
        'west bengal': [22.9868, 87.8550],
        'odisha': [20.9517, 85.0985],
        'jharkhand': [23.6102, 85.2799],
        'chhattisgarh': [21.2787, 81.8661],
        'punjab': [31.1471, 75.3412],
        'haryana': [29.0588, 76.0856],
        'himachal pradesh': [31.1048, 77.1734],
        'uttarakhand': [30.0668, 79.0193],
        'jammu and kashmir': [34.0837, 74.7973],
        'ladakh': [34.1526, 77.5770],
        'assam': [26.2006, 92.9376],
        'meghalaya': [25.4670, 91.3662],
        'manipur': [24.6637, 93.9063],
        'mizoram': [23.1645, 92.9376],
        'tripura': [23.9408, 91.9882],
        'nagaland': [26.1584, 94.5624],
        'arunachal pradesh': [28.2180, 94.7278],
        'sikkim': [27.5330, 88.5122],
        'goa': [15.2993, 74.1240],
        'andaman and nicobar islands': [11.7401, 92.6586],
        'chandigarh': [30.7333, 76.7794],
        'dadra and nagar haveli and daman and diu': [20.1809, 73.0169],
        'lakshadweep': [10.5667, 72.6417],
        'delhi': [28.7041, 77.1025],
        'puducherry': [11.9416, 79.8083]
      };
      
      const center = stateCenters[selectedState.toLowerCase()];
      if (center) return center;
    }
    return [20.5937, 78.9629]; // Default center of India
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">Loading district boundaries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-96 bg-red-50 rounded-lg ${className}`}>
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
          <p className="text-sm text-red-600 mb-2">Failed to load map data</p>
          <p className="text-xs text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={getMapCenter()}
        zoom={coordinates ? 10 : (selectedState ? 7 : 5)}
        style={{ height: '400px', width: '100%' }}
        scrollWheelZoom={false}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {geoJsonData && (
          <GeoJSON
            key={`geojson-${selectedState}-${selectedDistrict}`}
            data={geoJsonData}
            style={getDistrictStyle}
            eventHandlers={{
              add: onEachFeature
            }}
            ref={geoJsonRef}
          />
        )}
      </MapContainer>
      
      {/* Status Information */}
      <div className="absolute top-2 left-2 bg-white/90 rounded px-3 py-2 shadow-md">
        {selectedDistrict ? (
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-1 text-green-600" />
            <span>{selectedDistrict}, {selectedState}</span>
          </div>
        ) : selectedState ? (
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-1 text-blue-600" />
            <span>{selectedState}</span>
          </div>
        ) : (
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>India Overview</span>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-white/90 rounded px-3 py-2 shadow-md">
        <h4 className="text-xs font-medium mb-1">Flood Risk</h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
            <span>Low</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
            <span>Medium</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-orange-500 rounded-full mr-1"></span>
            <span>High</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
            <span>Severe</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloodMap;

