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
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      return this.formatWeatherData(data);
    } catch (error) {
      console.error('Weather fetch error:', error);
      throw error;
    }
  }

  formatWeatherData(data) {
    return {
      location: {
        city: data.name,
        country: data.sys.country,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon,
        },
      },
      current: {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      },
      timestamp: new Date().toISOString(),
    };
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
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch forecast');
      }

      const data = await response.json();
      
      // Group by day
      const dailyData = {};
      data.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyData[date]) {
          dailyData[date] = {
            date,
            temps: [],
            humidity: [],
            descriptions: [],
          };
        }
        dailyData[date].temps.push(item.main.temp);
        dailyData[date].humidity.push(item.main.humidity);
        dailyData[date].descriptions.push(item.weather[0].description);
      });

      // Calculate averages
      return Object.values(dailyData).map((day) => ({
        date: day.date,
        avgTemp: Math.round(day.temps.reduce((a, b) => a + b) / day.temps.length),
        avgHumidity: Math.round(day.humidity.reduce((a, b) => a + b) / day.humidity.length),
        conditions: [...new Set(day.descriptions)].join(', '),
      })).slice(0, 3); // Next 3 days
    } catch (error) {
      console.error('Forecast error:', error);
      throw error;
    }
  }
}

export const weatherService = new WeatherService();