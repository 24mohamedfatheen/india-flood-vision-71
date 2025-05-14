
import { FloodData } from '../../data/floodData';

// Function to generate flood area polygons
export const createFloodAreaPolygon = (floodInfo: FloodData) => {
  if (!floodInfo) return null;
  
  const [lat, lng] = floodInfo.coordinates;
  
  // Size of the affected area in degrees (rough approximation)
  // Scale based on actual affected area value
  const areaSize = Math.sqrt(floodInfo.affectedArea) * 0.01;
  
  // Create a simple circle (as a polygon) around the coordinate point
  const points = 36; // Number of points in polygon
  const coords = [];
  
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const x = lng + Math.cos(angle) * areaSize;
    const y = lat + Math.sin(angle) * areaSize;
    coords.push([x, y]);
  }
  
  // Close the polygon
  coords.push(coords[0]);
  
  return {
    type: 'Feature',
    properties: {
      name: floodInfo.region,
      state: floodInfo.state,
      risk_level: floodInfo.riskLevel,
      affected_area: floodInfo.affectedArea,
      population_affected: floodInfo.populationAffected
    },
    geometry: {
      type: 'Polygon',
      coordinates: [coords]
    }
  };
};
