"""Routes package initialization"""
from flask import Blueprint

# Create blueprints
predict_bp = Blueprint('predict', __name__)
history_bp = Blueprint('history', __name__)
assistant_bp = Blueprint('assistant', __name__)
weather_bp = Blueprint('weather', __name__)
reports_bp = Blueprint('reports', __name__)
health_bp = Blueprint('health', __name__)

# Import route handlers
from . import predict, history, assistant, weather, reports, health