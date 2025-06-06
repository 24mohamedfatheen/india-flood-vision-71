
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CircleDot } from 'lucide-react';
import { IMDRegionData } from '../../services/imdApiService';
import MapMarker from './MapMarker';

// Fix Leaflet icon issues
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

interface MapRecenterProps {
  center: L.LatLngExpression;
  zoom: number;
  mapInstance: L.Map | null;
  setMapInstance: (map: L.Map) => void;
}

const MapRecenter: React.FC<MapRecenterProps> = ({ center, zoom, mapInstance, setMapInstance }) => {
  const map = useMapEvents({
    load: (e) => {
      if (!mapInstance) {
        setMapInstance(e.target);
      }
    }
  });

  useEffect(() => {
    if (map && (Array.isArray(center) ? center[0] !== 0 || center[1] !== 0 : true)) {
      map.flyTo(center, zoom, { animate: true, duration: 1 });
    }
  }, [center, zoom, map]);

  return null;
};

const MapComponent: React.FC<MapProps> = ({
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

  const handleSetMapInstance = (map: L.Map) => {
    setLocalMapInstance(map);
    setMapInstance(map);
  };

  // Create user location icon
  const userLocationIcon = L.divIcon({
    html: `
      <div class="user-location-marker" style="width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;">
        <div style="width: 16px; height: 16px; background: #3B82F6; border: 2px solid white; border-radius: 50%; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      className="h-full w-full rounded-lg"
      zoomControl={true}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <MapRecenter 
        center={mapCenter} 
        zoom={mapZoom} 
        mapInstance={mapInstance}
        setMapInstance={handleSetMapInstance}
      />
      
      {/* Render markers for all flood data */}
      {mapInstance && aggregatedFloodData.map((data, index) => (
        data.coordinates && data.coordinates[0] && data.coordinates[1] ? (
          <MapMarker
            key={`${data.state}-${data.district}-${index}`}
            data={data}
            map={mapInstance}
            selectedDistrict={selectedDistrict}
            selectedState={selectedState}
            setSelectedDistrict={setSelectedDistrict}
            setSelectedState={setSelectedState}
          />
        ) : null
      ))}
      
      {/* User location marker */}
      {userLocation && (
        <Marker position={userLocation} icon={userLocationIcon} />
      )}
    </MapContainer>
  );
};

export default MapComponent;
