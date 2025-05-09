
import React, { useEffect, useRef, useState } from 'react';
import { floodData, getFloodDataForRegion, regions } from '../data/floodData';
import { ExternalLink, ZoomIn, ZoomOut, Map as MapIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface MapProps {
  selectedRegion: string;
}

const Map: React.FC<MapProps> = ({ selectedRegion }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [mapMessage, setMapMessage] = useState<string>('Interactive map loading...');
  const selectedFloodData = getFloodDataForRegion(selectedRegion);
  const selectedState = selectedFloodData?.state || '';
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // For a real application, you would integrate with a map API like MapBox, Google Maps, or Leaflet
  useEffect(() => {
    if (selectedFloodData) {
      setMapMessage(`Viewing ${selectedFloodData.region.charAt(0).toUpperCase() + selectedFloodData.region.slice(1)}, ${selectedFloodData.state}`);
    } else {
      setMapMessage(`Map data not available for the selected region`);
    }
    
    // Set last update time
    const now = new Date();
    setLastUpdate(now.toLocaleString());
    
    // In a real application, you would set up an interval to fetch new data every 12 hours
    const updateInterval = setInterval(() => {
      const updateTime = new Date();
      setLastUpdate(updateTime.toLocaleString());
      console.log("Map data updated at:", updateTime);
      // Here you would fetch fresh data from your API
    }, 12 * 60 * 60 * 1000); // 12 hours in milliseconds
    
    return () => clearInterval(updateInterval);
  }, [selectedRegion, selectedFloodData]);

  const handleDotHover = (region: string) => {
    setHoveredRegion(region);
  };

  const handleDotLeave = () => {
    setHoveredRegion(null);
  };

  const handleZoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel(prev => prev + 0.25);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.5) {
      setZoomLevel(prev => prev - 0.25);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };
  
  // Generate flood affected area polygons based on the flood data
  const generateFloodAreaPolygon = (data: typeof floodData[0]) => {
    if (!data || data.riskLevel === 'low') return null;
    
    // In a real app you'd use actual GIS data
    // This is a simple circle around the coordinate point
    const radius = data.affectedArea / 5; // Scale based on affected area
    const [lat, lng] = data.coordinates;
    
    // Normalize coordinates to fit our map image
    const x = ((lng - 70) / 30) * 800 + 250;
    const y = ((lat - 8) / 30) * 1100 + 250;
    
    // Create a simple circle for the affected area
    return (
      <circle
        key={`floodarea-${data.id}`}
        cx={x}
        cy={y}
        r={radius}
        className={`flood-area ${data.riskLevel === 'severe' ? 'fill-flood-danger/30' : 
                             data.riskLevel === 'high' ? 'fill-flood-warning/30' : 
                             'fill-yellow-400/20'}`}
        strokeWidth={2}
        fillOpacity={0.3}
      />
    );
  };

  return (
    <div className="map-container mb-6 border rounded-lg overflow-hidden relative">
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-flood-light to-white"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="text-center p-4">
          <h3 className="font-medium mb-2">{mapMessage}</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Showing flood-affected areas and state boundaries in India
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Last updated: {lastUpdate}
          </p>
          
          {/* India map with the provided image */}
          <div className="relative mx-auto w-full h-full overflow-hidden">
            <div 
              className="relative w-full h-full transition-transform duration-200 ease-out"
              style={{ 
                transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                transformOrigin: 'center center'
              }}
            >
              <img 
                src="/lovable-uploads/4cb07a0d-3ee5-4eeb-812b-39da5332c812.png" 
                alt="Map of India" 
                className="w-full h-full object-contain"
              />
              
              {/* SVG overlay for flood areas and data points */}
              <svg 
                ref={svgRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 1200 1480" 
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Render flood affected areas */}
                {floodData.map(data => generateFloodAreaPolygon(data))}
                
                {/* Plot dots for each region with flood data */}
                {floodData.map((data) => {
                  // Normalize coordinates to fit our map image
                  // Adjusted coordinates for better positioning
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
                      className={`${pulseAnimation} pointer-events-auto`}
                      onMouseEnter={() => handleDotHover(data.region)}
                      onMouseLeave={handleDotLeave}
                      style={{ cursor: 'pointer' }}
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
                          {data.estimatedDamage && (
                            <text 
                              x={x} 
                              y={y + 30} 
                              textAnchor="middle" 
                              fill="#D32F2F" 
                              fontSize="10"
                              fontWeight="medium"
                            >
                              Estimated damage: ₹{data.estimatedDamage.crops}Cr (crops)
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
      
      {/* Zoom controls */}
      <div className="zoom-controls">
        <Button variant="outline" size="icon" onClick={handleZoomIn} className="bg-white/90 hover:bg-white">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut} className="bg-white/90 hover:bg-white">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleResetView} className="bg-white/90 hover:bg-white">
          <MapIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Map;
