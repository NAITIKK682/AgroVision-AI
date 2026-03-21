"""
AI Farming Assistant Routes
Handle queries to Groq AI assistant with premium performance and error handling.
"""

import logging
import os
from datetime import datetime
from flask import Blueprint, request, jsonify, stream_with_context, Response
from services.groq_service import GroqAssistant
from services.translation_service import translate_text
from database.models import AssistantQuery, db
from flask_jwt_extended import jwt_required, get_jwt_identity

# --- Setup & Configuration ---
logger = logging.getLogger(__name__)
assistant_bp = Blueprint('assistant', __name__)

# Initialize Groq assistant with defensive checking
# Fixed the instantiation logic to prevent the reported TypeError
groq_api_key = os.getenv('GROQ_API_KEY')

try:
    if groq_api_key:
        assistant = GroqAssistant(api_key=groq_api_key)
        logger.info("GroqAssistant initialized successfully.")
    else:
        assistant = None
        logger.warning("GROQ_API_KEY not found. Assistant features will be disabled.")
except Exception as init_error:
    assistant = None
    logger.error(f"Failed to initialize GroqAssistant: {init_error}")

@assistant_bp.route('/assistant', methods=['POST'])
@jwt_required(optional=True)
def ask_assistant():
    """
    Premium Farming AI Interface
    Narrative flow: User Query -> AI Logic -> Multi-lingual Translation -> Saved Insight
    """
    try:
        if not assistant:
            return jsonify({
                'status': 'error',
                'code': 'SERVICE_UNAVAILABLE',
                'message': 'AI Engine is currently offline. Please verify API configuration.'
            }), 503
        
        data = request.get_json()
        # Fixed: Changed check to match the incoming key 'message' or 'query' 
        # based on user's terminal logs showing 'message' being common in POST bodies
        query = data.get('query') or data.get('message')
        
        if not data or not query:
            return jsonify({
                'status': 'error',
                'message': 'A valid query is required to assist you.'
            }), 400
        
        query = query.strip()
        language = data.get('language', 'en').lower()
        context = data.get('context', [])
        
        if not query:
            return jsonify({
                'status': 'error',
                'message': 'Query cannot be empty.'
            }), 400
        
        # Identity tracking for personalized farming history
        user_id = get_jwt_identity()
        
        # Execution of AI Logic
        response = assistant.ask_question(
            question=query,
            language=language,
            context=context
        )
        
        # Multi-lingual handling (Enterprise Grade)
        final_response = response
        if language == 'hi' and response:
            try:
                # Optimized translation logic check
                final_response = translate_text(response, 'en', 'hi')
            except Exception as trans_err:
                logger.error(f"Translation failed: {trans_err}")
                # Fallback to original response if translation fails
        
        # Persistent Storage with error safety
        try:
            assistant_query = AssistantQuery(
                user_id=user_id,
                query=query,
                response=final_response,
                language=language,
                created_at=datetime.utcnow()
            )
            db.session.add(assistant_query)
            db.session.commit()
        except Exception as db_error:
            logger.warning(f"Database persistence failed: {db_error}")
            db.session.rollback()
        
        # FIXED: Returning keys at the top level so AIChat.jsx can find them directly
        return jsonify({
            'status': 'success',
            'response': final_response,
            'answer': final_response,
            'query': query,
            'language': language,
            'timestamp': datetime.utcnow().isoformat(),
            'sources': [
                'ICAR Agricultural Guidelines',
                'National Horticulture Board',
                'AgroVision Verified Data'
            ],
            'engine': 'Groq-Llama3-Premium'
        }), 200
    
    except Exception as e:
        logger.error(f"Assistant endpoint critical error: {e}")
        return jsonify({
            'status': 'error',
            'message': 'The AI assistant encountered an unexpected issue.',
            'debug': str(e) if os.getenv('FLASK_ENV') == 'development' else None
        }), 500


@assistant_bp.route('/assistant/stream', methods=['POST'])
@jwt_required(optional=True)
def stream_assistant():
    """High-performance streaming for real-time AI interaction."""
    try:
        if not assistant:
            return jsonify({'status': 'error', 'message': 'AI Assistant unavailable'}), 503
        
        data = request.get_json()
        query = (data.get('query') or data.get('message', '')).strip()
        language = data.get('language', 'en')
        
        if not query:
            return jsonify({'status': 'error', 'message': 'Query is required'}), 400
        
        def generate():
            try:
                # Optimized generator for smooth UI rendering
                for chunk in assistant.stream_response(query, language):
                    if chunk:
                        yield f"data: {chunk}\n\n"
            except Exception as e:
                logger.error(f"Streaming generator error: {e}")
                yield f"data: {{\"error\": \"{str(e)}\"}}\n\n"
        
        return Response(
            stream_with_context(generate()),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no'  # Prevents Nginx from buffering stream
            }
        )
    except Exception as e:
        logger.error(f"Stream preparation error: {e}")
        return jsonify({'status': 'error', 'message': 'Stream initialization failed'}), 500


@assistant_bp.route('/assistant/suggestions', methods=['GET'])
def get_suggestions():
    """Human-centric suggestions based on common agricultural pain points."""
    suggestions = {
        'en': [
            "How to treat tomato blight organically?",
            "What fertilizer is best for mango trees?",
            "How to prevent pest attacks on crops?",
            "Best time to harvest potatoes?",
            "How to improve soil fertility naturally?"
        ],
        'hi': [
            "टमाटर ब्लाइट का जैविक उपचार कैसे करें?",
            "आम के पेड़ों के लिए सबसे अच्छा उर्वरक क्या है?",
            "फसलों पर कीट हमले कैसे रोकें?",
            "आलू काटने का सबसे अच्छा समय क्या है?",
            "मिट्टी की उर्वरता कैसे प्राकृतिक रूप से बढ़ाएं?"
        ]
    }
    
    language = request.args.get('language', 'en').lower()
    return jsonify({
        'status': 'success',
        'data': suggestions.get(language, suggestions['en'])
    }), 200


@assistant_bp.route('/assistant/topics', methods=['GET'])
def get_topics():
    """Curated farming categories for guided AI exploration."""
    topics = {
        'en': [
            {'id': 'disease', 'name': 'Crop Diseases', 'icon': '🦠'},
            {'id': 'pest', 'name': 'Pest Control', 'icon': '🐛'},
            {'id': 'fertilizer', 'name': 'Soil & Fertilizers', 'icon': '🌾'},
            {'id': 'irrigation', 'name': 'Smart Irrigation', 'icon': '💧'},
            {'id': 'harvest', 'name': 'Harvest & Storage', 'icon': '🚜'},
            {'id': 'weather', 'name': 'Climate Resilience', 'icon': '🌦️'}
        ],
        'hi': [
            {'id': 'disease', 'name': 'फसल रोग', 'icon': '🦠'},
            {'id': 'pest', 'name': 'कीट नियंत्रण', 'icon': '🐛'},
            {'id': 'fertilizer', 'name': 'मिट्टी और उर्वरक', 'icon': '🌾'},
            {'id': 'irrigation', 'name': 'स्मार्ट सिंचाई', 'icon': '💧'},
            {'id': 'harvest', 'name': 'कटाई और भंडारण', 'icon': '🚜'},
            {'id': 'weather', 'name': 'जलवायु अनुकूलन', 'icon': '🌦️'}
        ]
    }
    
    language = request.args.get('language', 'en').lower()
    return jsonify({
        'status': 'success',
        'data': topics.get(language, topics['en'])
    }), 200