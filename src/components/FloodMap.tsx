
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

const FloodMap: React.FC<FloodMapProps> = ({ 
  selectedState, 
  selectedDistrict, 
  className = "" 
}) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
        
        // Add random flood risk levels for demonstration
        // In a real app, this would come from your flood data
        data.features.forEach((feature: any) => {
          feature.properties.floodRiskLevel = Math.floor(Math.random() * 4);
        });
        
        setGeoJsonData(data);
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
  const style = (feature: any) => {
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
      
      layer.bindPopup(`
        <div>
          <h3><strong>${props.NAME_2 || 'Unknown District'}</strong></h3>
          <p>State: ${props.NAME_1 || 'Unknown State'}</p>
          <p>Flood Risk: <span style="color: ${getColor(riskLevel)}"><strong>${riskText}</strong></span></p>
        </div>
      `);
    }

    // Add event listeners
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });

    // Highlight selected district
    if (selectedDistrict && selectedState) {
      const isSelected = 
        props?.NAME_2?.toLowerCase().includes(selectedDistrict.toLowerCase()) &&
        props?.NAME_1?.toLowerCase().includes(selectedState.toLowerCase());
      
      if (isSelected) {
        setTimeout(() => {
          layer.setStyle({
            weight: 4,
            color: '#000',
            fillOpacity: 0.9
          });
          layer.bringToFront();
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
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-[400px] rounded-lg overflow-hidden ${className}`}>
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
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
            data={geoJsonData}
            style={style}
            onEachFeature={onEachFeature}
            ref={geoJsonLayerRef}
          />
        )}
      </MapContainer>
      
      {/* Map Legend */}
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
      </div>
    </div>
  );
};

export default FloodMap;
