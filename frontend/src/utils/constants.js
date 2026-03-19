export const CROP_TYPES = [
  'Tomato',
  'Potato',
  'Pepper',
  'Cabbage',
  'Carrot',
  'Onion',
  'Brinjal',
  'Apple',
  'Mango',
  'Banana',
  'Orange',
  'Grapes',
  'Strawberry',
  'Guava',
];

export const DISEASE_SEVERITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const API_ENDPOINTS = {
  PREDICT: '/api/predict',
  HISTORY: '/api/history',
  ASSISTANT: '/api/assistant',
  WEATHER: '/api/weather',
  GENERATE_REPORT: '/api/generate-report',
  HEALTH: '/api/health',
};

export const STORAGE_KEYS = {
  LANGUAGE: 'agrovision-lang',
  CACHED_SCANS: 'cached_scans',
  SCAN_KEYS: 'scan_keys',
};

export const FILE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
};

export const WEATHER_ICONS = {
  '01d': '☀️',
  '01n': '🌙',
  '02d': '🌤️',
  '02n': '☁️',
  '03d': '☁️',
  '03n': '☁️',
  '04d': '☁️',
  '04n': '☁️',
  '09d': '🌧️',
  '09n': '🌧️',
  '10d': '🌦️',
  '10n': '🌧️',
  '11d': '⛈️',
  '11n': '⛈️',
  '13d': '❄️',
  '13n': '❄️',
  '50d': '🌫️',
  '50n': '🌫️',
};