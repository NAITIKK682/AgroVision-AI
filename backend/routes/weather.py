"""
Weather Integration Routes
Fetch weather data and disease risk advisories
"""

import logging
import os
import requests
from datetime import datetime
from flask import Blueprint, request, jsonify
from services.weather_service import WeatherService, calculate_disease_risk

logger = logging.getLogger(__name__)
weather_bp = Blueprint('weather', __name__)

# Initialize weather service
weather_service = WeatherService(os.getenv('OPENWEATHER_API_KEY'))

@weather_bp.route('/weather', methods=['GET'])
def get_weather():
    """
    Get current weather for a location
    
    Query Parameters:
        lat: Latitude
        lon: Longitude
        language: 'en' or 'hi' (default: 'en')
    
    Returns:
        JSON with weather data and advisories
    """
    try:
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        language = request.args.get('language', 'en')
        
        if not lat or not lon:
            return jsonify({
                'status': 'error',
                'message': {
                    'en': 'Latitude and longitude are required',
                    'hi': 'अक्षांश और देशांतर आवश्यक हैं'
                }[language]
            }), 400
        
        # Get weather data
        weather_data = weather_service.get_current_weather(lat, lon, language)
        
        # Calculate disease risk using normalized current values
        disease_risks = calculate_disease_risk(
            temperature=weather_data.get('current', {}).get('temperature', 0),
            humidity=weather_data.get('current', {}).get('humidity', 0),
            rainfall=0,
            language=language
        )
        
        return jsonify({
            'status': 'success',
            'weather': weather_data,
            'disease_risks': disease_risks,
            'timestamp': datetime.now().isoformat()
        })
    
    except requests.exceptions.RequestException as e:
        logger.error(f"Weather API error: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to fetch weather data. Please try again later.',
            'error': str(e)
        }), 503
    
    except Exception as e:
        logger.error(f"Weather endpoint error: {e}")
        return jsonify({
            'status': 'error',
            'message': 'An unexpected error occurred',
            'error': str(e)
        }), 500


@weather_bp.route('/weather/forecast', methods=['GET'])
def get_forecast():
    """Get weather forecast for next 5 days"""
    try:
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        language = request.args.get('language', 'en')
        
        if not lat or not lon:
            return jsonify({
                'status': 'error',
                'message': 'Latitude and longitude are required'
            }), 400
        
        forecast_data = weather_service.get_forecast(lat, lon, language, days=5)
        
        return jsonify({
            'status': 'success',
            'forecast': forecast_data,
            'timestamp': datetime.now().isoformat()
        })
    
    except requests.exceptions.RequestException as e:
        logger.error(f"Forecast API error: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to fetch forecast data',
            'error': str(e)
        }), 503
    
    except Exception as e:
        logger.error(f"Forecast endpoint error: {e}")
        return jsonify({
            'status': 'error',
            'message': 'An unexpected error occurred',
            'error': str(e)
        }), 500


@weather_bp.route('/weather/advisory', methods=['POST'])
def get_weather_advisory():
    """Get weather-based farming advisory"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'status': 'error',
                'message': 'Request body is required'
            }), 400
        
        crop_type = data.get('crop_type')
        disease = data.get('disease')
        lat = data.get('lat')
        lon = data.get('lon')
        language = data.get('language', 'en')
        
        if not lat or not lon:
            return jsonify({
                'status': 'error',
                'message': 'Location coordinates are required'
            }), 400
        
        # Get weather data
        weather_data = weather_service.get_current_weather(lat, lon, language)
        
        # Generate advisory
        advisory = weather_service.generate_farming_advisory(
            crop_type=crop_type,
            disease=disease,
            weather_data=weather_data,
            language=language
        )
        
        return jsonify({
            'status': 'success',
            'advisory': advisory,
            'weather': weather_data,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Weather advisory error: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to generate advisory',
            'error': str(e)
        }), 500


@weather_bp.route('/weather/alerts', methods=['GET'])
def get_weather_alerts():
    """Get severe weather alerts for a location"""
    try:
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        language = request.args.get('language', 'en')
        
        if not lat or not lon:
            return jsonify({
                'status': 'error',
                'message': 'Location coordinates are required'
            }), 400
        
        # This would integrate with a weather alert API
        # For now, return mock alerts based on current conditions
        weather_data = weather_service.get_current_weather(lat, lon, language)
        
        alerts = []
        
        # Check for extreme conditions
        temp = weather_data.get('temperature', 0)
        humidity = weather_data.get('humidity', 0)
        wind_speed = weather_data.get('wind_speed', 0)
        
        if temp > 38:
            alerts.append({
                'type': 'heat_warning',
                'severity': 'high',
                'message': {
                    'en': f'Extreme heat warning: {temp}°C. Irrigate crops during cooler hours.',
                    'hi': f'चरम गर्मी चेतावनी: {temp}°C। फसलों में ठंडे समय में सिंचाई करें।'
                }[language]
            })
        
        if temp < 5:
            alerts.append({
                'type': 'frost_warning',
                'severity': 'high',
                'message': {
                    'en': f'Frost warning: {temp}°C. Protect young plants from cold.',
                    'hi': f'पाला चेतावनी: {temp}°C। नए पौधों को ठंड से बचाएं।'
                }[language]
            })
        
        if humidity > 85:
            alerts.append({
                'type': 'humidity_warning',
                'severity': 'medium',
                'message': {
                    'en': f'High humidity ({humidity}%). Risk of fungal diseases. Avoid leaf irrigation.',
                    'hi': f'उच्च आर्द्रता ({humidity}%)। फंगल रोग का खतरा। पत्तियों में पानी न दें।'
                }[language]
            })
        
        if wind_speed > 20:
            alerts.append({
                'type': 'wind_warning',
                'severity': 'medium',
                'message': {
                    'en': f'High wind speed ({wind_speed} m/s). Secure loose items and young plants.',
                    'hi': f'तेज हवा ({wind_speed} m/s)। ढीली वस्तुओं और नए पौधों को सुरक्षित करें।'
                }[language]
            })
        
        return jsonify({
            'status': 'success',
            'alerts': alerts,
            'count': len(alerts),
            'location': weather_data.get('location', {}),
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Weather alerts error: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to fetch weather alerts',
            'error': str(e)
        }), 500