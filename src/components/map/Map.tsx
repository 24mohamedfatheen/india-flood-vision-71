
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { CircleDot } from 'lucide-react';
import { IMDRegionData } from '../../services/imdApiService';
import MapMarker from './MapMarker';
import 'leaflet/dist/leaflet.css';

// Leaflet icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapProps {
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  mapCenter: L.LatLngExpression;
  setMapCenter: (center: L.LatLngExpression) => void;
  mapZoom: number;
  setMapZoom: (zoom: number) => void;
  aggregatedFloodData: IMDRegionData[];
  userLocation: [number, number] | null;
  setMapInstance: (map: L.Map) => void;
}

// MapRecenter component to handle map events and expose map instance
const MapRecenter: React.FC<{
  center: L.LatLngExpression;
  zoom: number;
  setMapInstance: (map: L.Map) => void;
}> = ({ center, zoom, setMapInstance }) => {
  const map = useMapEvents({
    load: (e) => {
      setMapInstance(e.target);
    },
  });

  useEffect(() => {
    if (map && Array.isArray(center) && (center[0] !== 0 || center[1] !== 0)) {
      map.flyTo(center, zoom, { animate: true, duration: 1 });
    }
  }, [center, zoom, map]);

  return null;
};

const Map: React.FC<MapProps> = ({
  selectedState,
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict,
  mapCenter,
  setMapCenter,
  mapZoom,
  setMapZoom,
  aggregatedFloodData,
  userLocation,
  setMapInstance
}) => {
  const [mapInstance, setLocalMapInstance] = useState<L.Map | null>(null);

  const handleMapInstanceSet = (map: L.Map) => {
    setLocalMapInstance(map);
    setMapInstance(map);
  };

  // Create user location icon
  const createUserLocationIcon = () => {
    return L.divIcon({
      html: `
        <div class="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full animate-pulse border-2 border-white shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="text-white">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
      `,
      className: 'custom-user-location-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      className="h-full w-full rounded-lg"
      zoomControl={true}
      scrollWheelZoom={true}
    >
      <MapRecenter 
        center={mapCenter} 
        zoom={mapZoom} 
        setMapInstance={handleMapInstanceSet}
      />
      
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render flood data markers */}
      {mapInstance && aggregatedFloodData
        .filter(data => data.coordinates && data.coordinates[0] !== 0 && data.coordinates[1] !== 0)
        .map((data, index) => (
          <MapMarker
            key={`${data.state}-${data.district}-${index}`}
            data={data}
            map={mapInstance}
            selectedDistrict={selectedDistrict}
            selectedState={selectedState}
            setSelectedDistrict={setSelectedDistrict}
            setSelectedState={setSelectedState}
          />
        ))
      }

      {/* User location marker */}
      {userLocation && (
        <Marker 
          position={userLocation} 
          icon={createUserLocationIcon()}
        >
          <Popup>
            <div className="text-center">
              <p className="font-medium">Your Location</p>
              <p className="text-sm text-gray-600">
                {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;
