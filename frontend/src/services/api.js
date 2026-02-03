import axios from 'axios';
import { get } from 'idb-keyval';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add language header
api.interceptors.request.use(
  async (config) => {
    const lang = localStorage.getItem('agrovision-lang') || 'en';
    config.headers['Accept-Language'] = lang;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle offline caching
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      // Try to get cached data
      const cachedData = await get(`api_cache_${error.config.url}`);
      if (cachedData) {
        return { data: cachedData, cached: true };
      }
    }
    return Promise.reject(error);
  }
);

// Disease prediction
export const predictDisease = async (imageFile, location = null) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  if (location) {
    formData.append('lat', location.lat);
    formData.append('lon', location.lon);
  }

  try {
    const response = await api.post('/api/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Prediction error:', error);
    throw error;
  }
};

// Get weather data
export const getWeather = async (lat, lon) => {
  try {
    const response = await api.get(`/api/weather?lat=${lat}&lon=${lon}`);
    return response.data;
  } catch (error) {
    console.error('Weather error:', error);
    throw error;
  }
};

// Get prediction history
export const getHistory = async () => {
  try {
    const response = await api.get('/api/history');
    return response.data;
  } catch (error) {
    console.error('History error:', error);
    throw error;
  }
};

// AI Assistant query
export const askAssistant = async (query, lang = 'en') => {
  try {
    const response = await api.post('/api/assistant', {
      query,
      language: lang,
    });
    return response.data;
  } catch (error) {
    console.error('Assistant error:', error);
    throw error;
  }
};

// Generate PDF report
export const generateReport = async (scanData) => {
  try {
    const response = await api.post('/api/generate-report', scanData, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Report generation error:', error);
    throw error;
  }
};

export default api;