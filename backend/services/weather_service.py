import logging
import os
import requests
from datetime import datetime
from typing import Dict, Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure localized logging
logger = logging.getLogger(__name__)

# Mandatory function export to satisfy blueprint/route imports in app.py
def calculate_disease_risk(temperature: float, humidity: int, rainfall: float = 0, language: str = 'en') -> list:
    """
    Calculate disease risks based on weather conditions.
    """
    risks = []

    # High humidity risks
    if humidity > 70:
        risks.append({
            'level': 'high',
            'disease': 'Fungal diseases (Blight, Mildew)',
            'advice': 'High humidity favors fungal growth. Avoid leaf irrigation.',
        })
    elif humidity > 50:
        risks.append({
            'level': 'medium',
            'disease': 'Some fungal risks',
            'advice': 'Monitor crops for early signs of disease.',
        })

    # Temperature risks
    if temperature > 30:
        risks.append({
            'level': 'high',
            'disease': 'Heat stress, Wilting',
            'advice': 'Irrigate during cooler hours. Provide shade if possible.',
        })
    elif temperature < 15:
        risks.append({
            'level': 'medium',
            'disease': 'Cold stress',
            'advice': 'Protect young plants from frost.',
        })

    return risks

class WeatherService:
    def __init__(self, *args, **kwargs):
        """
        Initialize the Weather Intelligence Service.
        Added *args to prevent 'takes 1 positional argument but 2 were given' crash.
        """
        # Fetches the key from .env; ensure OPENWEATHER_API_KEY is set there
        self.api_key = os.getenv('OPENWEATHER_API_KEY')
        self.base_url = "https://api.openweathermap.org/data/2.5/weather"
        
        # Risk thresholds mapping for various pathogens
        self.pathogen_vectors = {
            "Fungal": {"humidity_threshold": 70, "temp_range": (15, 30)},
            "Bacterial": {"humidity_threshold": 80, "temp_range": (20, 35)},
            "Viral": {"temp_range": (25, 40)}
        }

    def get_weather_data(self, lat: float, lon: float) -> Optional[Dict]:
        """Fetch raw weather data from OpenWeather API."""
        if not self.api_key or 'yahan_apni' in self.api_key:
            logger.warning("Weather API Key missing or invalid. Skipping real-time environmental analysis.")
            return None

        try:
            params = {
                'lat': lat,
                'lon': lon,
                'appid': self.api_key,
                'units': 'metric'
            }
            response = requests.get(self.base_url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Environmental data fetch failed: {e}")
            return None

    def get_current_weather(self, lat: float, lon: float, lang: str = 'en') -> Dict:
        """Fetch and format current weather data."""
        data = self.get_weather_data(lat, lon)
        if not data:
            raise ValueError("Unable to fetch weather data")        
        return {
            'location': {
                'city': data.get('name', 'Unknown'),
                'country': data.get('sys', {}).get('country', 'Unknown'),
                'coordinates': {
                    'lat': data.get('coord', {}).get('lat'),
                    'lon': data.get('coord', {}).get('lon'),
                },
            },
            'current': {
                'temperature': round(data.get('main', {}).get('temp', 0)),
                'feelsLike': round(data.get('main', {}).get('feels_like', 0)),
                'humidity': data.get('main', {}).get('humidity', 0),
                'pressure': data.get('main', {}).get('pressure', 0),
                'windSpeed': data.get('wind', {}).get('speed', 0),
                'description': data.get('weather', [{}])[0].get('description', 'Unknown'),
                'icon': data.get('weather', [{}])[0].get('icon', ''),
            },
            'timestamp': datetime.now().isoformat(),
        }

    def get_disease_risk_advisory(self, disease_name: str, lat: float, lon: float, lang: str = 'en') -> str:
        """
        Correlates disease presence with environmental conditions to generate actionable risk alerts.
        """
        weather = self.get_weather_data(lat, lon)
        
        # Default fallback messages
        advisories = {
            'en': "Weather advisory stable. Monitor for local humidity spikes.",
            'hi': "मौसम की सलाह स्थिर है। स्थानीय आर्द्रता में वृद्धि पर नज़र रखें।"
        }
        
        if not weather:
            return advisories.get(lang, advisories['en'])

        temp = weather.get('main', {}).get('temp')
        humidity = weather.get('main', {}).get('humidity')
        
        # Logic for Environmental Risk Correlation
        # High humidity + moderate temperatures significantly increase fungal spread (e.g., Blights, Mildew)
        is_high_risk = humidity and humidity > 75 and temp and (18 <= temp <= 28)

        if is_high_risk:
            risk_msgs = {
                'en': f"⚠️ HIGH RISK: Current humidity ({humidity}%) and temp ({temp}°C) are ideal for {disease_name} to spread. Ensure proper field drainage and airflow.",
                'hi': f"⚠️ उच्च जोखिम: वर्तमान आर्द्रता ({humidity}%) और तापमान ({temp}°C) {disease_name} के प्रसार के लिए अनुकूल हैं। जल निकासी सुनिश्चित करें।"
            }
            return risk_msgs.get(lang, risk_msgs['en'])

        # General Advisory if not high risk
        return advisories.get(lang, advisories['en'])

    def calculate_disease_risk(self, disease_name: str, lat: float, lon: float, lang: str = 'en') -> str:
        """
        Alias for get_disease_risk_advisory to maintain compatibility with 
        legacy blueprint imports and predict service calls.
        """
        return self.get_disease_risk_advisory(disease_name, lat, lon, lang)

# Export singleton instance for app-wide use
weather_service = WeatherService()