
import React, { useEffect, useState } from 'react';

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

const WeatherPanel: React.FC<{ latitude: number; longitude: number }> = ({ latitude, longitude }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=rain_sum&timezone=auto`
        );
        const data = await response.json();

        setWeatherData({
          temperature: data.current_weather.temperature,
          humidity: data.current_weather.relativehumidity,
          rainfall: data.daily.rain_sum[0],
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  if (!weatherData) {
    return <div>Loading weather data...</div>;
  }

  return (
    <div>
      <p>Temperature: {weatherData.temperature}°C</p>
      <p>Humidity: {weatherData.humidity}%</p>
      <p>Rainfall: {weatherData.rainfall} mm</p>
    </div>
  );
};

export default WeatherPanel;
