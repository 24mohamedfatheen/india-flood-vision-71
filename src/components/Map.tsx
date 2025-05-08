
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
            <svg viewBox="0 0 220 220" className="w-full h-full">
              {/* Background for India */}
              <rect x="0" y="0" width="220" height="220" fill="#f5f5f5" />

              {/* Render state outlines */}
              {stateOutlines.map((state) => {
                const isSelectedState = state.name.toLowerCase() === selectedState.toLowerCase();
                
                // Choose color based on reference image colors
                let fillColor;
                switch (state.name) {
                  case "Jammu and Kashmir": 
                    fillColor = "#FF5252"; // Red
                    break;
                  case "Himachal Pradesh":
                    fillColor = "#FFD740"; // Yellow
                    break;
                  case "Punjab": 
                    fillColor = "#8BC34A"; // Light Green
                    break;
                  case "Uttarakhand":
                    fillColor = "#B39DDB"; // Light Purple
                    break;
                  case "Haryana":
                    fillColor = "#90CAF9"; // Light Blue
                    break;
                  case "Rajasthan":
                    fillColor = "#EF9A9A"; // Light Red/Pink
                    break;
                  case "Uttar Pradesh":
                    fillColor = "#E6EE9C"; // Light Yellow-Green
                    break;
                  case "Bihar":
                    fillColor = "#C5E1A5"; // Very Light Green
                    break;
                  case "Sikkim":
                    fillColor = "#FFE082"; // Light Yellow
                    break;
                  case "Arunachal Pradesh":
                    fillColor = "#FF8A65"; // Orange-Red
                    break;
                  case "Assam":
                    fillColor = "#4FC3F7"; // Blue
                    break;
                  case "West Bengal":
                    fillColor = "#FF80AB"; // Pink
                    break;
                  case "Gujarat":
                    fillColor = "#FFF59D"; // Very Light Yellow
                    break;
                  case "Madhya Pradesh":
                    fillColor = "#9575CD"; // Purple
                    break;
                  case "Jharkhand":
                    fillColor = "#AED581"; // Green
                    break;
                  case "Chhattisgarh":
                    fillColor = "#4DB6AC"; // Teal
                    break;
                  case "Odisha":
                    fillColor = "#64B5F6"; // Blue
                    break;
                  case "Maharashtra":
                    fillColor = "#BA68C8"; // Purple
                    break;
                  case "Telangana":
                    fillColor = "#FFB74D"; // Orange
                    break;
                  case "Andhra Pradesh":
                    fillColor = "#F48FB1"; // Pink
                    break;
                  case "Karnataka":
                    fillColor = "#81C784"; // Green
                    break;
                  case "Goa":
                    fillColor = "#4DD0E1"; // Light Blue
                    break;
                  case "Kerala":
                    fillColor = "#7CB342"; // Green
                    break;
                  case "Tamil Nadu":
                    fillColor = "#FF8A65"; // Orange-Red
                    break;
                  case "Meghalaya":
                    fillColor = "#FFAB00"; // Amber
                    break;
                  case "Tripura":
                    fillColor = "#B2FF59"; // Light Green
                    break;
                  case "Manipur":
                    fillColor = "#69F0AE"; // Green
                    break;
                  case "Mizoram":
                    fillColor = "#18FFFF"; // Cyan
                    break;
                  case "Nagaland":
                    fillColor = "#FF9E80"; // Deep Orange
                    break;
                  case "Delhi":
                    fillColor = "#CFD8DC"; // Blue Grey
                    break;
                  default:
                    fillColor = "#E0E0E0"; // Light Grey
                }
                
                return (
                  <path
                    key={state.name}
                    d={state.path}
                    fill={fillColor}
                    stroke={isSelectedState ? "#1565C0" : "#555555"}
                    strokeWidth={isSelectedState ? 2 : 0.5}
                    className={isSelectedState ? "animate-pulse-opacity" : ""}
                  >
                    <title>{state.name}</title>
                  </path>
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
              
              {/* Add legend for the states */}
              <foreignObject x="5" y="155" width="50" height="60">
                <div className="text-xs bg-white/80 p-1 rounded">
                  <div className="font-bold">States:</div>
                  <div className="text-[8px] mt-1">
                    Hover over each state to see its name
                  </div>
                </div>
              </foreignObject>
            </svg>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            * Colored regions represent Indian states, dots represent current flood-affected areas
          </p>
        </div>
      </div>
    </div>
  );
};

export default Map;
