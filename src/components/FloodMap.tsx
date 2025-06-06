
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const FloodMap: React.FC = () => {
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer
        center={[25.276987, 55.296249] as [number, number]}
        zoom={8}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
      </MapContainer>
    </div>
  );
};

export default FloodMap;
