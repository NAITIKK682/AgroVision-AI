"""
AgroVision Translation Service
Enterprise-grade multi-lingual support for agricultural advisory.
"""

import logging
from typing import Optional

# Setup logging for the translation service
logger = logging.getLogger(__name__)

def translate_text(text: str, source_lang: str = 'en', target_lang: str = 'en') -> str:
    """
    Translates agricultural insights into the farmer's native language.
    Currently optimized for English to Hindi (hi) translations.
    """
    if not text or source_lang == target_lang:
        return text

    try:
        # Implementation Note: 
        # Using a reliable free translation layer (like deep_translator or similar)
        # for Production-grade stability. 
        from deep_translator import GoogleTranslator
        
        translator = GoogleTranslator(source=source_lang, target=target_lang)
        translated = translator.translate(text)
        
        return translated if translated else text

    except ImportError:
        logger.error("Required library 'deep_translator' not found. Run: pip install deep-translator")
        return text
    except Exception as e:
        logger.error(f"Translation Error ({source_lang} -> {target_lang}): {e}")
        # Fallback to original text to ensure functionality doesn't break
        return text

def get_supported_languages():
    """Returns supported agricultural languages."""
    return [
        {'code': 'en', 'name': 'English'},
        {'code': 'hi', 'name': 'Hindi'}
    ]