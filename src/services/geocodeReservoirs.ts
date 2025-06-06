
export interface GeocodedReservoir {
  name: string;
  latitude: number;
  longitude: number;
  admin1: string;
  admin2: string;
}

export const geocodeReservoirs = async (reservoirNames: string[]): Promise<GeocodedReservoir[]> => {
  const geocodedData: GeocodedReservoir[] = [];

  for (const name of reservoirNames) {
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1`);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        geocodedData.push({
          name: result.name,
          latitude: result.latitude,
          longitude: result.longitude,
          admin1: result.admin1,
          admin2: result.admin2,
        });
      } else {
        console.warn(`No geocoding result for ${name}`);
      }
    } catch (error) {
      console.error(`Error geocoding ${name}:`, error);
    }
  }

  return geocodedData;
};
