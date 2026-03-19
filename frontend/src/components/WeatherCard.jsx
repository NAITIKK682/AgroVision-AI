import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { weatherService } from '../services/weatherService';

const WeatherCard = ({ location = null }) => {
  const { t, lang } = useLanguage();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [risks, setRisks] = useState([]);

  useEffect(() => {
    fetchWeather();
  }, [location, lang]);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      let coords;
      
      if (location) {
        coords = location;
      } else {
        // Get current location
        coords = await weatherService.getCurrentLocation();
      }

      const data = await weatherService.getWeatherData(coords.lat, coords.lon);
      setWeatherData(data);

      // Calculate disease risks
      const diseaseRisks = weatherService.calculateDiseaseRisk(data);
      setRisks(diseaseRisks);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="agro-card text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agro-green mx-auto"></div>
        <p className="mt-2">{t('weather_title')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="agro-card bg-red-50 text-red-700">
        <div className="text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="font-semibold">Weather Error</p>
          <p className="text-sm">{error}</p>
          <button onClick={fetchWeather} className="agro-btn bg-red-500 hover:bg-red-600 mt-2">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="agro-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-agro-dark">{t('weather_title')}</h3>
          <p className="text-gray-600">
            {weatherData.location.city}, {weatherData.location.country}
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold">
            {weatherData.current.temperature}°C
          </div>
          <p className="text-sm text-gray-600 capitalize">
            {weatherData.current.description}
          </p>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-agro-light rounded-lg">
          <div className="text-agro-green text-xl font-bold">
            💧 {weatherData.current.humidity}%
          </div>
          <div className="text-xs text-gray-600">{t('humidity')}</div>
        </div>

        <div className="text-center p-3 bg-agro-light rounded-lg">
          <div className="text-agro-green text-xl font-bold">
            🌡️ {weatherData.current.feelsLike}°C
          </div>
          <div className="text-xs text-gray-600">Feels Like</div>
        </div>

        <div className="text-center p-3 bg-agro-light rounded-lg">
          <div className="text-agro-green text-xl font-bold">
            💨 {weatherData.current.windSpeed} m/s
          </div>
          <div className="text-xs text-gray-600">Wind</div>
        </div>

        <div className="text-center p-3 bg-agro-light rounded-lg">
          <div className="text-agro-green text-xl font-bold">
            📊 {weatherData.current.pressure} hPa
          </div>
          <div className="text-xs text-gray-600">Pressure</div>
        </div>
      </div>

      {/* Disease Risk Alerts */}
      {risks.length > 0 && (
        <div className="mt-4">
          <h4 className="font-bold text-lg mb-2 flex items-center">
            <span className="mr-2">⚠️</span>
            {t('weather_risk')}
          </h4>
          
          <div className="space-y-2">
            {risks.map((risk, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  risk.level === 'high'
                    ? 'bg-red-50 border-red-500'
                    : 'bg-amber-50 border-amber-500'
                }`}
              >
                <div className="font-semibold">{risk.disease}</div>
                <div className="text-sm text-gray-700">{risk.advice}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;