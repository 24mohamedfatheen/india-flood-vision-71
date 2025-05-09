
import React, { useEffect, useRef, useState } from 'react';
import { floodData, getFloodDataForRegion, regions } from '../data/floodData';
import { stateOutlines } from '../data/stateOutlines';
import { ExternalLink } from 'lucide-react';

interface MapProps {
  selectedRegion: string;
}

const Map: React.FC<MapProps> = ({ selectedRegion }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapMessage, setMapMessage] = useState<string>('Interactive map loading...');
  const selectedFloodData = getFloodDataForRegion(selectedRegion);
  const selectedState = selectedFloodData?.state || '';
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // For a real application, you would integrate with a map API like MapBox, Google Maps, or Leaflet
  useEffect(() => {
    if (selectedFloodData) {
      setMapMessage(`Viewing ${selectedFloodData.region.charAt(0).toUpperCase() + selectedFloodData.region.slice(1)}, ${selectedFloodData.state}`);
    } else {
      setMapMessage(`Map data not available for the selected region`);
    }
  }, [selectedRegion, selectedFloodData]);

  const handleDotHover = (region: string) => {
    setHoveredRegion(region);
  };

  const handleDotLeave = () => {
    setHoveredRegion(null);
  };

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
                  const isHovered = data.region === hoveredRegion;
                  const dotSize = isSelected ? 16 : isHovered ? 14 : 12;
                  const pulseAnimation = isSelected ? 'animate-pulse-opacity' : '';
                  
                  // Add source information to tooltip for selected or hovered region
                  const sourceInfo = data.predictedFlood?.source;
                  
                  return (
                    <g 
                      key={data.id} 
                      className={pulseAnimation}
                      onMouseEnter={() => handleDotHover(data.region)}
                      onMouseLeave={handleDotLeave}
                      style={{ pointerEvents: 'all', cursor: 'pointer' }}
                    >
                      <circle 
                        cx={x} 
                        cy={y} 
                        r={dotSize} 
                        fill={dotColor}
                        stroke={isSelected || isHovered ? '#000' : 'none'}
                        strokeWidth={isSelected || isHovered ? 2 : 0}
                      />
                      {(isSelected || isHovered) && (
                        <>
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
                          {sourceInfo && (
                            <text 
                              x={x} 
                              y={y - 36} 
                              textAnchor="middle" 
                              fill="#444" 
                              fontSize="10"
                              className="font-light"
                            >
                              Source: {sourceInfo.name}
                            </text>
                          )}
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
          
          <div className="flex items-center justify-center mt-4 text-xs flex-wrap gap-2">
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
          
          <div className="mt-3 text-xs text-muted-foreground">
            <p>Flood predictions based on data from <a href="https://mausam.imd.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">IMD <ExternalLink className="h-3 w-3 ml-0.5" /></a> and <a href="https://chennaimetrowater.tn.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">CMWSSB <ExternalLink className="h-3 w-3 ml-0.5" /></a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
