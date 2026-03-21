"""
AgroVision AI - Main Application Entry Point
Enterprise-grade Flask configuration with integrated JWT security, rate limiting, and diagnostic logging.
"""

import os
import logging
import sys
import io
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

# --- Windows Unicode Console Fix ---
# Ensures emoji and multi-lingual logging (Hindi/English) renders correctly in PowerShell/CMD
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# --- Production Logging Configuration ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("server.log", encoding='utf-8'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

def create_app():
    """
    Factory pattern for app initialization to ensure scalability and easier testing.
    """
    app = Flask(__name__, static_folder='static', static_url_path='/static')
    
    # --- Configuration & Security ---
    app.config.update(
        SECRET_KEY=os.getenv('SECRET_KEY', 'agro-secure-v1-highly-confidential'),
        JWT_SECRET_KEY=os.getenv('JWT_SECRET_KEY', 'agro-jwt-secret-99'),
        JWT_TOKEN_LOCATION=['headers'],
        MAX_CONTENT_LENGTH=16 * 1024 * 1024,  # 16MB limit for high-res crop images
        UPLOAD_FOLDER=os.path.normpath(os.path.join(os.getcwd(), 'uploads')),
        REPORTS_FOLDER=os.path.normpath(os.path.join(os.getcwd(), 'static', 'reports')),
        SQLALCHEMY_DATABASE_URI=os.getenv('DATABASE_URL', 'sqlite:///agroviz.db'),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        JSON_SORT_KEYS=False
    )
    
    # Initialize JWT Authentication Manager
    jwt = JWTManager(app)

    # Ensure required directories exist for file persistence
    for folder in [app.config['UPLOAD_FOLDER'], app.config['REPORTS_FOLDER']]:
        os.makedirs(folder, exist_ok=True)
    
    # Enable Cross-Origin Resource Sharing (CORS) for Frontend access
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True) 
    
    # Rate Limiting: Protection against DDoS and API abuse
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=["500 per day", "100 per hour"],
        storage_uri="memory://"
    )

    # --- Database Initialization ---
    try:
        from database.db import init_db
        init_db(app)
        logger.info("✅ Database initialized successfully.")
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
    
    # --- Blueprint Registration ---
    # Modular routing for Prediction, AI Assistant, Weather, and History
    try:
        from routes.predict import predict_bp
        from routes.assistant import assistant_bp
        from routes.weather import weather_bp
        from routes.history import history_bp

        app.register_blueprint(predict_bp, url_prefix='/api')
        app.register_blueprint(assistant_bp, url_prefix='/api')
        app.register_blueprint(weather_bp, url_prefix='/api')
        app.register_blueprint(history_bp, url_prefix='/api')
        
        logger.info("✅ Blueprints registered successfully.")
    except Exception as e:
        logger.critical(f"🛑 Critical failure in blueprint registration: {e}")

    # --- Static File Serving ---
    @app.route('/uploads/<filename>')
    def serve_upload(filename):
        """Serves uploaded crop images for the Frontend UI."""
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    
    # --- Error & Health Handlers ---
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "status": "error", 
            "message": "The requested resource was not found.", 
            "code": 404
        }), 404

    @app.route('/')
    @app.route('/api/health')
    def status():
        """Health check endpoint for production monitoring."""
        return jsonify({
            "service": "AgroVision AI Engine",
            "status": "Healthy",
            "uptime": "Active",
            "api_version": "1.0.0-PRO"
        }), 200

    return app

if __name__ == '__main__':
    # Suppress TensorFlow logging for cleaner terminal output
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
    
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    logger.info(f"🚀 AgroVision AI starting on port {port} (Debug: {debug_mode})...")
    
    # Use threaded=True to handle multiple farmer queries simultaneously
    app.run(host='0.0.0.0', port=port, debug=debug_mode, threaded=True)