
// src/services/imdApiService.ts
// This file is responsible for fetching all reservoir data from Supabase
// with pagination, aggregating it by state/district, and calculating flood risk levels.

import { supabase } from '../integrations/supabase/client';

// Define the structure for raw reservoir data coming directly from Supabase
// All properties are potentially null/undefined from database
export interface RawReservoirData {
  id?: number | null;
  reservoir_name?: string | null;
  state?: string | null;
  district?: string | null;
  current_level_mcm?: number | null;
  capacity_mcm?: number | null;
  percentage_full?: number | null;
  inflow_cusecs?: number | null;
  outflow_cusecs?: number | null;
  last_updated?: string | null;
  lat?: number | null;
  long?: number | null;
}

// Define the aggregated data structure with guaranteed non-null properties
export type IMDRegionData = {
  state: string;
  district: string;
  reservoirPercentage: number;
  inflowCusecs: number;
  outflowCusecs: number;
  floodRiskLevel: 'low' | 'medium' | 'high' | 'severe';
  populationAffected: number;
  affectedArea: number;
  coordinates: [number, number];
  lastUpdated: string;
};

const SUPABASE_FETCH_LIMIT = 1000;

export const imdApiService = {
  fetchAggregatedFloodData: async (): Promise<IMDRegionData[]> => {
    console.log('--- imdApiService: Starting comprehensive data fetch and aggregation ---');

    let allRawReservoirData: RawReservoirData[] = [];
    let offset = 0;
    let hasMore = true;

    try {
      while (hasMore) {
        console.log(`Fetching batch from Supabase: offset=${offset}, limit=${SUPABASE_FETCH_LIMIT}`);
        const { data: currentBatch, error } = await supabase
          .from('indian_reservoir_levels')
          .select('reservoir_name, state, district, current_level_mcm, capacity_mcm, percentage_full, inflow_cusecs, outflow_cusecs, last_updated, lat, long')
          .range(offset, offset + SUPABASE_FETCH_LIMIT - 1);

        if (error) {
          console.error('ERROR: Supabase data fetch failed during pagination:', error);
          break;
        }

        if (!currentBatch || currentBatch.length === 0) {
          hasMore = false;
        } else {
          allRawReservoirData = allRawReservoirData.concat(currentBatch);
          console.log(`Fetched ${currentBatch.length} records in current batch. Total raw records fetched: ${allRawReservoirData.length}`);
          offset += currentBatch.length;

          if (currentBatch.length < SUPABASE_FETCH_LIMIT) {
            hasMore = false;
          }
        }
      }

      if (allRawReservoirData.length === 0) {
        console.warn('WARNING: No raw reservoir data found in Supabase after all pagination attempts.');
        return [];
      }

      console.log(`SUCCESS: Finished fetching all ${allRawReservoirData.length} raw reservoir records from Supabase.`);

      const regionDataMap = new Map<string, IMDRegionData>();

      allRawReservoirData.forEach((res: RawReservoirData) => {
        // Robust data extraction with defaults
        const stateName = res.state?.trim() || 'Unknown State';
        const districtName = res.district?.trim() || 'Unknown District';
        const mapKey = `${stateName.toLowerCase()}_${districtName.toLowerCase()}`;

        // Safe number extraction
        const lat = typeof res.lat === 'number' && !isNaN(res.lat) ? res.lat : 20.5937;
        const long = typeof res.long === 'number' && !isNaN(res.long) ? res.long : 78.9629;
        const percentageFull = typeof res.percentage_full === 'number' && !isNaN(res.percentage_full) 
          ? Math.min(100, Math.max(0, res.percentage_full)) 
          : 0;
        const inflowCusecs = typeof res.inflow_cusecs === 'number' && !isNaN(res.inflow_cusecs) ? res.inflow_cusecs : 0;
        const outflowCusecs = typeof res.outflow_cusecs === 'number' && !isNaN(res.outflow_cusecs) ? res.outflow_cusecs : 0;
        const lastUpdated = res.last_updated || new Date().toISOString();

        if (!regionDataMap.has(mapKey)) {
          regionDataMap.set(mapKey, {
            state: stateName,
            district: districtName,
            reservoirPercentage: 0,
            inflowCusecs: 0,
            outflowCusecs: 0,
            floodRiskLevel: 'low', // Always initialize to a valid value
            populationAffected: 0,
            affectedArea: 0,
            coordinates: [lat, long],
            lastUpdated: lastUpdated,
          });
        }

        const regionEntry = regionDataMap.get(mapKey)!;

        // Aggregate values
        if (percentageFull > regionEntry.reservoirPercentage) {
          regionEntry.reservoirPercentage = percentageFull;
        }
        regionEntry.inflowCusecs += inflowCusecs;
        regionEntry.outflowCusecs += outflowCusecs;

        if (new Date(lastUpdated) > new Date(regionEntry.lastUpdated)) {
          regionEntry.lastUpdated = lastUpdated;
        }

        // Calculate flood risk level - always assign a valid value
        let currentReservoirRisk: IMDRegionData['floodRiskLevel'] = 'low';
        if (percentageFull >= 90 || inflowCusecs > 10000) {
          currentReservoirRisk = 'severe';
        } else if (percentageFull >= 75 || inflowCusecs > 5000) {
          currentReservoirRisk = 'high';
        } else if (percentageFull >= 50 || inflowCusecs > 1000) {
          currentReservoirRisk = 'medium';
        }

        const riskLevelOrder = { 'low': 0, 'medium': 1, 'high': 2, 'severe': 3 };
        if (riskLevelOrder[currentReservoirRisk] > riskLevelOrder[regionEntry.floodRiskLevel]) {
          regionEntry.floodRiskLevel = currentReservoirRisk;
        }
      });

      const aggregatedResult = Array.from(regionDataMap.values());
      console.log(`SUCCESS: Aggregated data for ${aggregatedResult.length} unique regions.`);
      
      return aggregatedResult;

    } catch (error: any) {
      console.error('CRITICAL ERROR in imdApiService.fetchAggregatedFloodData:', error);
      return [];
    }
  },
};
