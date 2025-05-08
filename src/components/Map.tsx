
import React, { useEffect, useRef, useState } from 'react';
import { floodData, getFloodDataForRegion, regions } from '../data/floodData';
import { stateOutlines } from '../data/stateOutlines';

interface MapProps {
  selectedRegion: string;
}

const Map: React.FC<MapProps> = ({ selectedRegion }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapMessage, setMapMessage] = useState<string>('Interactive map loading...');
  const selectedFloodData = getFloodDataForRegion(selectedRegion);
  const selectedState = selectedFloodData?.state || '';

  // For a real application, you would integrate with a map API like MapBox, Google Maps, or Leaflet
  useEffect(() => {
    if (selectedFloodData) {
      setMapMessage(`Viewing ${selectedFloodData.region.charAt(0).toUpperCase() + selectedFloodData.region.slice(1)}, ${selectedFloodData.state}`);
    } else {
      setMapMessage(`Map data not available for the selected region`);
    }
  }, [selectedRegion, selectedFloodData]);

  return (
    <div className="map-container mb-6 border rounded-lg overflow-hidden h-[400px] relative">
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-flood-light to-white">
        <div className="text-center p-4">
          <h3 className="font-medium mb-2">{mapMessage}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Showing flood-affected areas and state boundaries in India
          </p>
          
          {/* India map with state outlines */}
          <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Simplified India outline */}
              <path 
                d="M110,20 C120,20 130,25 140,35 C150,45 155,60 160,70 C165,80 170,85 175,95 C180,105 185,115 185,125 C185,135 180,145 175,155 C170,165 160,170 150,175 C140,180 130,180 120,180 C110,180 100,175 90,170 C80,165 75,160 70,150 C65,140 60,130 55,120 C50,110 45,100 40,90 C35,80 30,70 30,60 C30,50 35,40 45,35 C55,30 65,25 75,25 C85,25 100,20 110,20 Z" 
                fill="#E3F2FD"
                stroke="#2196F3"
                strokeWidth="1"
              />
              
              {/* Render state outlines */}
              {stateOutlines.map((state) => {
                const isSelectedState = state.name.toLowerCase() === selectedState.toLowerCase();
                return (
                  <path
                    key={state.name}
                    d={state.path}
                    fill={isSelectedState ? "#BBDEFB" : "transparent"}
                    stroke={isSelectedState ? "#1565C0" : "#90CAF9"}
                    strokeWidth={isSelectedState ? 2 : 0.5}
                    className={isSelectedState ? "animate-pulse-opacity" : ""}
                  />
                );
              })}
              
              {/* Plot dots for each region with flood data */}
              {floodData.map((data) => {
                // Normalize coordinates to fit our SVG viewBox
                const x = ((data.coordinates[1] - 70) / 30) * 150 + 50;
                const y = ((data.coordinates[0] - 8) / 30) * 150 + 30;
                
                // Determine color based on risk level
                const dotColor = 
                  data.riskLevel === 'severe' ? '#F44336' :
                  data.riskLevel === 'high' ? '#FF9800' :
                  data.riskLevel === 'medium' ? '#FFC107' : '#4CAF50';
                
                // Highlight selected region
                const isSelected = data.region === selectedRegion;
                const dotSize = isSelected ? 8 : 6;
                const pulseAnimation = isSelected ? 'animate-pulse-opacity' : '';
                
                return (
                  <g key={data.id} className={pulseAnimation}>
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={dotSize} 
                      fill={dotColor}
                      stroke={isSelected ? '#FFF' : 'none'}
                      strokeWidth={isSelected ? 2 : 0}
                    />
                    {isSelected && (
                      <text 
                        x={x} 
                        y={y - 10} 
                        textAnchor="middle" 
                        fill="#000" 
                        fontSize="8"
                        fontWeight="bold"
                      >
                        {data.region.charAt(0).toUpperCase() + data.region.slice(1)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            * Dots represent current flood-affected areas colored by risk level
          </p>
        </div>
      </div>
    </div>
  );
};

export default Map;
