
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
          
          {/* India map with the provided image */}
          <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80">
            <div className="relative w-full h-full">
              <img 
                src="/lovable-uploads/4cb07a0d-3ee5-4eeb-812b-39da5332c812.png" 
                alt="Map of India" 
                className="w-full h-full object-contain"
              />
              
              {/* Plot dots for each region with flood data */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 1200 1480" // Adjusted for the image aspect ratio
                preserveAspectRatio="xMidYMid meet"
              >
                {floodData.map((data) => {
                  // Normalize coordinates to fit our map image
                  // Adjusted to better position dots on the provided map
                  const x = ((data.coordinates[1] - 70) / 30) * 800 + 250;
                  const y = ((data.coordinates[0] - 8) / 30) * 1100 + 250;
                  
                  // Determine color based on risk level
                  const dotColor = 
                    data.riskLevel === 'severe' ? '#F44336' :
                    data.riskLevel === 'high' ? '#FF9800' :
                    data.riskLevel === 'medium' ? '#FFC107' : '#4CAF50';
                  
                  // Highlight selected region
                  const isSelected = data.region === selectedRegion;
                  const dotSize = isSelected ? 16 : 12;
                  const pulseAnimation = isSelected ? 'animate-pulse-opacity' : '';
                  
                  return (
                    <g key={data.id} className={pulseAnimation}>
                      <circle 
                        cx={x} 
                        cy={y} 
                        r={dotSize} 
                        fill={dotColor}
                        stroke={isSelected ? '#000' : 'none'}
                        strokeWidth={isSelected ? 2 : 0}
                      />
                      {isSelected && (
                        <text 
                          x={x} 
                          y={y - 20} 
                          textAnchor="middle" 
                          fill="#000" 
                          fontSize="16"
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
          </div>
          
          <div className="flex items-center justify-center mt-4 text-xs">
            <div className="flex items-center mr-4">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span>Low Risk</span>
            </div>
            <div className="flex items-center mr-4">
              <span className="inline-block w-3 h-3 rounded-full bg-amber-400 mr-2"></span>
              <span>Medium Risk</span>
            </div>
            <div className="flex items-center mr-4">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
              <span>High Risk</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              <span>Severe Risk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
