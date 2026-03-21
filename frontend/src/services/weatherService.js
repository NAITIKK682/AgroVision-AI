import api from './api.js';

export class WeatherService {
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  }

  async getWeatherData(lat, lon) {
    try {
      const response = await api.get('/api/weather', {
        params: { lat, lon }
      });
      
      return response.data;
    } catch (error) {
      console.error('Weather fetch error:', error);
      throw error;
    }
  }

  // Calculate disease risk based on weather
  calculateDiseaseRisk(weatherData, cropType) {
    const { humidity, temperature } = weatherData.current;
    const risks = [];

    // High humidity risks
    if (humidity > 70) {
      risks.push({
        level: 'high',
        disease: 'Fungal diseases (Blight, Mildew)',
        advice: 'High humidity favors fungal growth. Avoid leaf irrigation.',
      });
    } else if (humidity > 50) {
      risks.push({
        level: 'medium',
        disease: 'Some fungal risks',
        advice: 'Monitor crops for early signs of disease.',
      });
    }

    // Temperature risks
    if (temperature > 30) {
      risks.push({
        level: 'high',
        disease: 'Heat stress, Wilting',
        advice: 'Irrigate during cooler hours. Provide shade if possible.',
      });
    } else if (temperature < 15) {
      risks.push({
        level: 'medium',
        disease: 'Cold stress',
        advice: 'Protect young plants from frost.',
      });
    }

    return risks;
  }

  // Get weather forecast (3 days)
  async getForecast(lat, lon) {
    try {
      const response = await api.get('/api/weather/forecast', {
        params: { lat, lon }
      });
      
      if (!response || !response.data || response.status !== 200) {
        throw new Error('Failed to fetch forecast');
      }

      const data = response.data.forecast || [];

      // already formatted by backend, return directly
      return data;
    } catch (error) {
      console.error('Forecast error:', error);
      throw error;
    }
  }
}

export const weatherService = new WeatherService();