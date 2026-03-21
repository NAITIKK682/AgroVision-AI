import os
import uuid
import numpy as np
from PIL import Image
import io
from werkzeug.utils import secure_filename
from datetime import datetime
from database.db import db
from database.models import ScanHistory

def allowed_file(filename):
    """Check if file extension is valid"""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_bytes, target_size=(224, 224)):
    """
    Preprocess the image for AI model prediction.
    Resize, convert to array, and normalize.
    """
    try:
        # Load image from bytes
        img = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if it's not (for RGBA/PNG)
        if img.mode != 'RGB':
            img = img.convert('RGB')
            
        # Resize image
        img = img.resize(target_size)
        
        # Convert to numpy array
        img_array = np.array(img)
        
        # Normalize to [0, 1] range
        img_array = img_array.astype('float32') / 255.0
        
        # Add batch dimension (1, 224, 224, 3)
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        print(f"Preprocessing Error: {e}")
        return None

def save_scan_to_db(prediction, user_id=None, lat=None, lon=None):
    """Save AI prediction results to the database"""
    try:
        # Confidence string "95.5%" ko float 95.5 mein badalna
        conf_val = prediction.get('confidence', '0')
        if isinstance(conf_val, str):
            conf_val = float(conf_val.replace('%', ''))
            
        new_scan = ScanHistory(
            user_id=user_id,
            crop_name=prediction.get('crop_name', 'Unknown'),
            disease_name=prediction.get('disease_name', 'Unknown'),
            confidence=conf_val,
            severity=prediction.get('severity', 'Medium'),
            symptoms=prediction.get('symptoms'),
            cause=prediction.get('cause'),
            prevention=prediction.get('prevention'),
            organic_solution=prediction.get('organic_solution'),
            chemical_solution=prediction.get('chemical_solution'),
            latitude=float(lat) if lat else None,
            longitude=float(lon) if lon else None
        )
        
        db.session.add(new_scan)
        db.session.commit()
        return new_scan
    except Exception as e:
        db.session.rollback()
        print(f"ERROR saving to DB: {str(e)}")
        raise e

def generate_unique_filename(original_filename):
    """Generate a unique ID for the uploaded image"""
    ext = os.path.splitext(original_filename)[1]
    return f"{uuid.uuid4().hex}{ext}"

def format_response(data, status='success', message=None):
    """Standard API response format"""
    return {
        'status': status,
        'data': data,
        'message': message,
        'timestamp': datetime.utcnow().isoformat()
    }