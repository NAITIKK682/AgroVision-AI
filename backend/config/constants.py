"""
Application Constants
"""

# Crop types
CROP_TYPES = [
    'tomato', 'potato', 'pepper', 'cabbage', 'carrot',
    'onion', 'brinjal', 'apple', 'mango', 'banana',
    'orange', 'grapes', 'strawberry', 'guava'
]

# Disease severity levels
SEVERITY_LEVELS = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'critical': 'Critical'
}

# File upload limits
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

# Pagination
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

# Cache settings
CACHE_TIMEOUT = 3600  # 1 hour
CACHE_PREFIX = 'agroviz:'

# API rate limits
RATE_LIMITS = {
    'predict': '10 per minute',
    'assistant': '20 per minute',
    'weather': '30 per minute'
}

# Response messages
MESSAGES = {
    'en': {
        'scan_success': 'Crop disease detected successfully',
        'scan_failed': 'Failed to analyze image',
        'invalid_image': 'Invalid or unsupported image',
        'no_crop_detected': 'No crop detected in image',
        'blurry_image': 'Image is too blurry',
        'prediction_saved': 'Prediction saved to history',
        'report_generated': 'PDF report generated successfully',
        'unauthorized': 'Unauthorized access',
        'not_found': 'Resource not found',
        'server_error': 'Internal server error'
    },
    'hi': {
        'scan_success': 'फसल रोग सफलतापूर्वक पहचाना गया',
        'scan_failed': 'छवि का विश्लेषण करने में विफल',
        'invalid_image': 'अमान्य या असमर्थित छवि',
        'no_crop_detected': 'छवि में कोई फसल नहीं मिली',
        'blurry_image': 'छवि बहुत धुंधली है',
        'prediction_saved': 'भविष्यवाणी इतिहास में सहेजी गई',
        'report_generated': 'PDF रिपोर्ट सफलतापूर्वक उत्पन्न की गई',
        'unauthorized': 'अनधिकृत पहुंच',
        'not_found': 'संसाधन नहीं मिला',
        'server_error': 'आंतरिक सर्वर त्रुटि'
    }
}