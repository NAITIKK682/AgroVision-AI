import axios from 'axios';
import { get, set, del } from 'idb-keyval'; // 'del' add kiya cache saaf karne ke liye

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  // URL format ko clean karne ke liye check
  baseURL: API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL,
  timeout: 45000, 
});

// Request interceptor: Dynamic headers
api.interceptors.request.use(
  async (config) => {
    const lang = localStorage.getItem('agrovision-lang') || 'en';
    config.headers['Accept-Language'] = lang;
    
    // Auth token check
    const token = localStorage.getItem('agrovision-token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
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
    if (response.config.method === 'get' && response.data) {
      set(`api_cache_${response.config.url}`, response.data);
    }
    return response;
  },
  async (error) => {
    const { config } = error;
    
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
 */
export const predictDisease = async (imageFile, location = null) => {
  const formData = new FormData();
  
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
 * Delete Agro-History Entry
 * @param {string|number} id - Scan ID to delete
 */
export const deleteScan = async (id) => {
  try {
    const response = await api.delete(`/api/history/${id}`);
    
    // Delete ke baad cache clear karna zaroori hai taaki purana data na dikhe
    await del(`api_cache_/api/history`); 
    
    return response.data;
  } catch (error) {
    console.error('Delete Engine Error:', error);
    throw error;
  }
};

/**
 * AI Agronomist Chat
 */
export const askAssistant = async (query, lang = 'en') => {
  try {
    const response = await api.post('/api/assistant', {
      query: query,
      language: lang,
    });
    return response.data;
  } catch (error) {
    console.error('Assistant Communication Error:', error.response?.data || error.message);
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