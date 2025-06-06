
import { IMDRegionData } from '../services/imdApiService';
import { FloodData } from '../data/floodData';

export const convertIMDRegionDataToFloodData = (imdData: IMDRegionData): FloodData => {
  return {
    id: Math.random(), // Generate a random ID since IMDRegionData doesn't have one
    region: imdData.district,
    state: imdData.state,
    riskLevel: imdData.floodRiskLevel,
    affectedArea: imdData.affectedArea,
    populationAffected: imdData.populationAffected,
    coordinates: imdData.coordinates,
    timestamp: imdData.lastUpdated,
    currentRainfall: imdData.reservoirPercentage * 2, // Simple conversion
    historicalRainfallData: [],
    predictionAccuracy: 85,
    riverLevel: imdData.riverData?.currentLevel,
    predictedFlood: imdData.predictedFlood,
    riverData: imdData.riverData,
    activeWarnings: imdData.activeWarnings,
    estimatedDamage: { crops: 0, properties: 0, infrastructure: 0 }
  };
};
