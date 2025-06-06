
import { supabase } from '../integrations/supabase/client';

export interface ResolvedLocation {
  reservoirName: string;
  state: string;
  district: string;
  coordinates: [number, number];
  country: string;
}

// Cache for resolved locations to avoid repeated API calls
const locationCache = new Map<string, ResolvedLocation>();

/**
 * Geocode a reservoir name using Nominatim OpenStreetMap API
 */
export const geocodeReservoir = async (reservoirName: string): Promise<ResolvedLocation | null> => {
  // Check cache first
  if (locationCache.has(reservoirName)) {
    return locationCache.get(reservoirName)!;
  }

  try {
    console.log(`🔍 Geocoding reservoir: ${reservoirName}`);
    
    // Clean the reservoir name for better search results
    const cleanName = reservoirName.replace(/\s*(dam|reservoir|lake|river)\s*/gi, '').trim();
    const searchQueries = [
      `${reservoirName}, India`,
      `${cleanName} dam, India`,
      `${cleanName} reservoir, India`,
      `${cleanName}, India`
    ];

    for (const query of searchQueries) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'India-Flood-Vision-Dashboard/1.0'
            }
          }
        );

        if (!response.ok) {
          console.warn(`Geocoding API error for query "${query}":`, response.status);
          continue;
        }

        const results = await response.json();
        
        if (results && results.length > 0) {
          for (const result of results) {
            // Look for results that mention water features or dams
            const isWaterFeature = result.class === 'waterway' || 
                                  result.type === 'reservoir' || 
                                  result.type === 'dam' ||
                                  result.display_name.toLowerCase().includes('dam') ||
                                  result.display_name.toLowerCase().includes('reservoir');

            if (result.address && (isWaterFeature || results.indexOf(result) === 0)) {
              const resolved: ResolvedLocation = {
                reservoirName,
                state: result.address.state || result.address.province || 'Unknown State',
                district: result.address.county || result.address.district || result.address.city || 'Unknown District',
                coordinates: [parseFloat(result.lat), parseFloat(result.lon)],
                country: result.address.country || 'India'
              };

              console.log(`✅ Geocoded ${reservoirName}:`, resolved);
              locationCache.set(reservoirName, resolved);
              
              // Small delay to be respectful to the API
              await new Promise(resolve => setTimeout(resolve, 100));
              return resolved;
            }
          }
        }
      } catch (error) {
        console.warn(`Error with query "${query}":`, error);
        continue;
      }
    }

    console.warn(`⚠️ Could not geocode reservoir: ${reservoirName}`);
    return null;
  } catch (error) {
    console.error('❌ Geocoding error:', error);
    return null;
  }
};

/**
 * Resolve all reservoir locations from Supabase data
 */
export const resolveAllReservoirLocations = async (): Promise<ResolvedLocation[]> => {
  try {
    console.log('🚀 Starting to resolve all reservoir locations...');
    
    // Get unique reservoir names from Supabase
    const { data, error } = await supabase
      .from('indian_reservoir_levels')
      .select('reservoir_name')
      .not('reservoir_name', 'is', null)
      .neq('reservoir_name', '');

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ No reservoir data found in Supabase');
      return [];
    }

    // Get unique reservoir names
    const uniqueReservoirs = [...new Set(data.map(item => item.reservoir_name))];
    console.log(`📊 Found ${uniqueReservoirs.length} unique reservoirs to resolve`);

    const resolvedLocations: ResolvedLocation[] = [];
    const batchSize = 5; // Process in small batches to avoid rate limiting

    for (let i = 0; i < uniqueReservoirs.length; i += batchSize) {
      const batch = uniqueReservoirs.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(uniqueReservoirs.length/batchSize)}`);

      const batchPromises = batch.map(reservoirName => geocodeReservoir(reservoirName));
      const batchResults = await Promise.all(batchPromises);

      for (const result of batchResults) {
        if (result) {
          resolvedLocations.push(result);
        }
      }

      // Delay between batches to respect API limits
      if (i + batchSize < uniqueReservoirs.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`✅ Successfully resolved ${resolvedLocations.length} out of ${uniqueReservoirs.length} reservoirs`);
    return resolvedLocations;
  } catch (error) {
    console.error('❌ Error resolving reservoir locations:', error);
    return [];
  }
};

/**
 * Get unique states from resolved locations
 */
export const getStatesFromResolvedLocations = (locations: ResolvedLocation[]): string[] => {
  const states = [...new Set(locations.map(loc => loc.state))];
  return states.filter(state => state && state !== 'Unknown State').sort();
};

/**
 * Get districts for a specific state from resolved locations
 */
export const getDistrictsForState = (locations: ResolvedLocation[], state: string): string[] => {
  const districts = locations
    .filter(loc => loc.state === state)
    .map(loc => loc.district);
  
  return [...new Set(districts)].filter(district => district && district !== 'Unknown District').sort();
};

/**
 * Get coordinates for a specific state/district combination
 */
export const getCoordinatesForLocation = (
  locations: ResolvedLocation[], 
  state: string, 
  district: string
): [number, number] | null => {
  const location = locations.find(loc => loc.state === state && loc.district === district);
  return location ? location.coordinates : null;
};
