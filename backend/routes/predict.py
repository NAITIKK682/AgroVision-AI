"""
AgroVision AI - Prediction Route
Premium implementation with automated cleanup, multi-lingual support, and telemetry.
"""

from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
import uuid
import json
from datetime import datetime
import traceback

# Internal Service Imports
from services.model_service import model_service 
from services.validation_service import validate_image
from services.weather_service import weather_service, calculate_disease_risk
from services.knowledge_base import get_disease_details # FIX: Added Knowledge Base Import
from database.queries import ScanQueries
from database.models import ScanResult, ScanHistory, db

# --- Blueprint Configuration ---
predict_bp = Blueprint('predict', __name__)

def allowed_file(filename):
    """Production-grade extension validation."""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@predict_bp.route('/predict', methods=['POST'])
def predict():
    """
    High-Performance AI Diagnosis Endpoint
    Flow: Secure Upload -> A11y Validation -> AI Inference -> Weather Context -> Persistence
    """
    filepath = None
    try:
        # 1. Request Validation
        if 'image' not in request.files:
            return jsonify({
                'status': 'error', 
                'message': 'No diagnostic image provided. Please upload a clear photo of the crop.'
            }), 400
        
        file = request.files['image']
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({
                'status': 'error', 
                'message': 'Unsupported file format. Use JPG, PNG, or WEBP.'
            }), 400

        # 2. Extract Metadata (Investor-Ready Telemetry)
        lat = request.form.get('lat')
        lon = request.form.get('lon')
        user_id = request.form.get('user_id')
        
        # Language handling for global scalability
        accept_language = request.headers.get('Accept-Language', 'en')
        lang = 'hi' if accept_language.lower().startswith('hi') else 'en'

        # 3. Secure Asset Management
        ext = file.filename.rsplit('.', 1)[1].lower()
        now = datetime.utcnow()
        unique_filename = f"{uuid.uuid4().hex}_{now.strftime('%Y%m%d')}.{ext}"
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)

        # 4. Image Quality & Semantic Validation
        is_valid, validation_error = validate_image(filepath)
        if not is_valid:
            if os.path.exists(filepath): os.remove(filepath)
            return jsonify({
                'status': 'invalid', 
                'error': validation_error,
                'suggestion': 'Please ensure the plant is centered and well-lit.'
            }), 400

        # 5. Core AI Inference
        prediction = model_service.predict(filepath, lang)
        
        # Check if prediction failed
        if prediction.get('status') == 'failed' or 'error' in prediction:
            current_app.logger.error(f"AI Inference failed: {prediction}")
            return jsonify({
                'status': 'error',
                'message': 'Model inference failed: ' + prediction.get('error', 'Unknown error'),
                'code': 'MODEL_INFERENCE_FAILED'
            }), 500
        
        # 5.1 Enrichment from Knowledge Base
        # Constructing the raw class name to match Knowledge Base keys
        disease_name = prediction.get('disease_name', 'Unknown').strip()
        crop_name = prediction.get('crop_name', 'Unknown').strip()
        
        # Build knowledge base key - handle both formats
        if disease_name.lower() == 'healthy':
            raw_class_name = f"{crop_name}_Healthy"
        else:
            # Replace spaces with underscores for disease name
            disease_key = disease_name.replace(' ', '_')
            raw_class_name = f"{crop_name}___{disease_key}"
        
        current_app.logger.info(f"Looking up knowledge base key: {raw_class_name}")
        try:
            details = get_disease_details(raw_class_name)
            prediction.update(details)
        except Exception as kb_error:
            current_app.logger.warning(f"Knowledge base enrichment warning: {kb_error}")
            # Continue with basic prediction if knowledge base fails

        # 6. Environmental Context (Weather Risk Advisory)
        weather_warning = { 'en': 'Advisory unavailable', 'hi': 'सलाह उपलब्ध नहीं' }[lang]
        if lat and lon:
            try:
                weather_warning = calculate_disease_risk(
                    prediction.get('disease_name', 'General'), 
                    float(lat), 
                    float(lon), 
                    lang
                )
            except Exception as e:
                current_app.logger.warning(f"Weather context enrichment failed: {e}")

        prediction['weather_warning'] = weather_warning

        # 7. Enterprise Persistence Layer
        scan_id = str(uuid.uuid4())
        
        try:
            # Save scan using SQLAlchemy ORM (for history endpoint)
            new_scan = ScanHistory(
                user_id=user_id,
                crop_name=prediction.get('crop_name', 'Unknown'),
                disease_name=prediction.get('disease_name', 'Healthy'),
                confidence=float(prediction.get('confidence', 0)),
                severity=prediction.get('severity', 'Normal'),
                image_filename=unique_filename,
                symptoms=prediction.get('symptoms', []),
                cause=prediction.get('cause', ''),
                prevention=prediction.get('prevention', []),
                organic_solution=prediction.get('organic_solution', ''),
                chemical_solution=prediction.get('chemical_solution', ''),
                fertilizer_recommendation=prediction.get('fertilizer_recommendation', []),
                latitude=float(lat) if lat else None,
                longitude=float(lon) if lon else None
            )
            db.session.add(new_scan)
            db.session.commit()
            current_app.logger.info(f"✅ Scan saved successfully: {scan_id}")
        except Exception as db_error:
            db.session.rollback()
            current_app.logger.error(f"Persistence Failure (Scan: {scan_id}): {db_error}")

        # 8. Temporary Asset Cleanup - DISABLED
        # We no longer remove filepath here so history can display images.
        # if os.path.exists(filepath): os.remove(filepath)

        # 9. Polished API Response
        # FIX: Added image_url to the response for frontend display
        return jsonify({
            'status': 'success',
            'data': {
                'scan_id': scan_id,
                'timestamp': now.isoformat(),
                'prediction': {
                    **prediction,
                    'image_url': f"http://localhost:5000/uploads/{unique_filename}"
                },
                'advisory_sources': ['AgroVision Proprietary Model v1.2', 'OpenWeather Intelligence']
            }
        }), 200

    except Exception as e:
        if filepath and os.path.exists(filepath): 
            os.remove(filepath)
        
        current_app.logger.error(f"Critical Prediction Failure: {traceback.format_exc()}")
        return jsonify({
            'status': 'error', 
            'message': 'An internal engine error occurred while processing the image.',
            'code': 'INFERENCE_ENGINE_CRASH'
        }), 500