
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
const CACHE_KEY = 'flood_monitor_geocoded_reservoirs';

// Load cache from localStorage on startup
try {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const parsedCache = JSON.parse(cached);
    Object.entries(parsedCache).forEach(([key, value]) => {
      locationCache.set(key, value as ResolvedLocation);
    });
    console.log(`📦 Loaded ${locationCache.size} cached reservoir locations`);
  }
} catch (error) {
  console.warn('Could not load cached reservoir locations:', error);
}

// Save cache to localStorage
const saveCache = () => {
  try {
    const cacheObject = Object.fromEntries(locationCache);
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
  } catch (error) {
    console.warn('Could not save geocoded locations to cache:', error);
  }
};

/**
 * Geocode a reservoir name using Nominatim OpenStreetMap API
 */
export const geocodeReservoir = async (reservoirName: string): Promise<ResolvedLocation | null> => {
  // Check cache first
  if (locationCache.has(reservoirName)) {
    console.log(`🎯 Cache hit for ${reservoirName}`);
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
              saveCache();
              
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
 * Fetch reservoir names from Supabase
 */
export const fetchReservoirNamesFromSupabase = async (): Promise<string[]> => {
  try {
    console.log('🚀 Fetching reservoir names from Supabase...');
    
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
    console.log(`📊 Found ${uniqueReservoirs.length} unique reservoirs in Supabase`);
    
    return uniqueReservoirs;
  } catch (error) {
    console.error('❌ Error fetching reservoir names from Supabase:', error);
    return [];
  }
};

/**
 * Resolve all reservoir locations from Supabase data
 */
export const resolveAllReservoirLocations = async (): Promise<ResolvedLocation[]> => {
  try {
    console.log('🚀 Starting to resolve all reservoir locations...');
    
    // Get unique reservoir names from Supabase
    const reservoirNames = await fetchReservoirNamesFromSupabase();
    
    if (reservoirNames.length === 0) {
      console.warn('⚠️ No reservoir names to resolve');
      return [];
    }

    const resolvedLocations: ResolvedLocation[] = [];
    const batchSize = 3; // Process in small batches to avoid rate limiting

    for (let i = 0; i < reservoirNames.length; i += batchSize) {
      const batch = reservoirNames.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(reservoirNames.length/batchSize)}`);

      const batchPromises = batch.map(reservoirName => geocodeReservoir(reservoirName));
      const batchResults = await Promise.all(batchPromises);

      for (const result of batchResults) {
        if (result) {
          resolvedLocations.push(result);
        }
      }

      // Delay between batches to respect API limits
      if (i + batchSize < reservoirNames.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`✅ Successfully resolved ${resolvedLocations.length} out of ${reservoirNames.length} reservoirs`);
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
 * Get reservoirs for a specific state/district combination
 */
export const getReservoirsForLocation = (
  locations: ResolvedLocation[], 
  state?: string, 
  district?: string
): ResolvedLocation[] => {
  return locations.filter(loc => {
    if (state && loc.state !== state) return false;
    if (district && loc.district !== district) return false;
    return true;
  });
};

/**
 * Get coordinates for a specific reservoir
 */
export const getCoordinatesForReservoir = (
  locations: ResolvedLocation[], 
  reservoirName: string
): [number, number] | null => {
  const location = locations.find(loc => loc.reservoirName === reservoirName);
  return location ? location.coordinates : null;
};

/**
 * Get location data for a specific reservoir
 */
export const getLocationForReservoir = (
  locations: ResolvedLocation[], 
  reservoirName: string
): ResolvedLocation | null => {
  return locations.find(loc => loc.reservoirName === reservoirName) || null;
};
