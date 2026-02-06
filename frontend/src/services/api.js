import axios from 'axios';
import { get, set } from 'idb-keyval';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // Increased for large image uploads on slow networks
});

// Request interceptor: Dynamic headers
api.interceptors.request.use(
  async (config) => {
    const lang = localStorage.getItem('agrovision-lang') || 'en';
    config.headers['Accept-Language'] = lang;
    
    // If sending FormData, let the browser set the Content-Type with the boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Intelligent Caching & Offline Recovery
api.interceptors.response.use(
  (response) => {
    // Cache successful GET requests for offline redundancy
    if (response.config.method === 'get' && response.data) {
      set(`api_cache_${response.config.url}`, response.data);
    }
    return response;
  },
  async (error) => {
    const { config } = error;
    
    // Check if we are offline or having network issues
    if (!window.navigator.onLine || error.code === 'ERR_NETWORK') {
      const cachedData = await get(`api_cache_${config.url}`);
      if (cachedData) {
        console.warn('Serving cached data for:', config.url);
        return { data: cachedData, status: 200, cached: true };
      }
    }
    return Promise.reject(error);
  }
);

/**
 * AI Disease Prediction
 * Sends speciman image and geo-coordinates to the neural engine.
 */
export const predictDisease = async (imageFile, location = null) => {
  const formData = new FormData();
  
  // Ensure the file is valid before appending
  if (!(imageFile instanceof File)) {
    throw new Error('Invalid image format: Neural engine requires a File object.');
  }

  formData.append('image', imageFile);
  
  if (location?.lat && location?.lon) {
    formData.append('lat', String(location.lat));
    formData.append('lon', String(location.lon));
  }

  try {
    const response = await api.post('/api/predict', formData);
    return response.data;
  } catch (error) {
    console.error('Neural Analysis Error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Localized Weather Intelligence
 */
export const getWeather = async (lat, lon) => {
  try {
    const response = await api.get('/api/weather', {
      params: { lat, lon }
    });
    return response.data;
  } catch (error) {
    console.error('Weather Sync Error:', error);
    throw error;
  }
};

/**
 * Agro-History Retrieval
 */
export const getHistory = async () => {
  try {
    const response = await api.get('/api/history');
    return response.data;
  } catch (error) {
    console.error('History Retrieval Error:', error);
    throw error;
  }
};

/**
 * AI Agronomist Chat
 */
export const askAssistant = async (query, lang = 'en') => {
  try {
    const response = await api.post('/api/assistant', {
      query,
      language: lang,
    });
    return response.data;
  } catch (error) {
    console.error('Assistant Communication Error:', error);
    throw error;
  }
};

/**
 * Diagnostic PDF Generation
 */
export const generateReport = async (scanData) => {
  try {
    const response = await api.post('/api/generate-report', scanData, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Report Engine Error:', error);
    throw error;
  }
};

export default api;