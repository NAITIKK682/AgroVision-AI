"""
Image Validation Service
Validates uploaded images before processing
"""

import os
import cv2
import numpy as np
import logging
from PIL import Image

logger = logging.getLogger(__name__)

def validate_image(image_path, language='en'):
    """
    Validate image quality and content
    
    Returns:
        tuple: (is_valid: bool, error_message: dict or None)
    """
    try:
        # Check file exists
        if not os.path.exists(image_path):
            return False, {
                'en': 'Image file not found',
                'hi': 'छवि फ़ाइल नहीं मिली'
            }
        
        # Check file size
        file_size = os.path.getsize(image_path)
        if file_size > 16 * 1024 * 1024:  # 16MB
            return False, {
                'en': 'Image too large. Maximum size is 16MB.',
                'hi': 'छवि बहुत बड़ी है। अधिकतम आकार 16MB है।'
            }
        
        # Open image with PIL first to check format
        try:
            img_pil = Image.open(image_path)
            img_pil.verify()  # Verify image integrity
        except Exception as e:
            logger.error(f"PIL validation error: {e}")
            return False, {
                'en': 'Invalid or corrupted image file',
                'hi': 'अमान्य या दूषित छवि फ़ाइल'
            }
        
        # Read with OpenCV for processing
        img = cv2.imread(image_path)
        if img is None:
            return False, {
                'en': 'Unable to read image. Supported formats: JPG, PNG, WebP',
                'hi': 'छवि पढ़ने में असमर्थ। समर्थित प्रारूप: JPG, PNG, WebP'
            }
        
        # Check image dimensions
        height, width = img.shape[:2]
        if width < 100 or height < 100:
            return False, {
                'en': 'Image too small. Minimum size is 100x100 pixels.',
                'hi': 'छवि बहुत छोटी है। न्यूनतम आकार 100x100 पिक्सेल है।'
            }
        
        # Blur detection using Laplacian variance
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        
        if laplacian_var < 50:
            return False, {
                'en': 'Image is too blurry. Please upload a clear, focused image.',
                'hi': 'छवि बहुत धुंधली है। कृपया स्पष्ट, फोकस की गई छवि अपलोड करें।'
            }
        
        # Check for plant material (green, yellow, brown - to include healthy AND diseased leaves)
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        
        # Define color ranges for plant material
        # Green (healthy leaves)
        lower_green = np.array([35, 40, 40])
        upper_green = np.array([85, 255, 255])
        
        # Yellow/Brown (diseased/aging leaves)
        lower_yellow = np.array([15, 40, 40])
        upper_yellow = np.array([35, 255, 255])
        
        # Brown tones
        lower_brown = np.array([10, 30, 30])
        upper_brown = np.array([25, 255, 150])
        
        # Create masks for all plant color ranges
        mask_green = cv2.inRange(hsv, lower_green, upper_green)
        mask_yellow = cv2.inRange(hsv, lower_yellow, upper_yellow)
        mask_brown = cv2.inRange(hsv, lower_brown, upper_brown)
        
        # Combine all plant material masks
        combined_mask = cv2.bitwise_or(cv2.bitwise_or(mask_green, mask_yellow), mask_brown)
        plant_pixels = np.count_nonzero(combined_mask)
        total_pixels = combined_mask.size
        plant_percentage = (plant_pixels / total_pixels) * 100
        
        # If less than 5% plant material, likely not a crop image
        if plant_percentage < 5:
            return False, {
                'en': 'No crop detected. Please upload an image of crop leaves.',
                'hi': 'कोई फसल नहीं मिली। कृपया फसल की पत्तियों की छवि अपलोड करें।'
            }
        
        # Check brightness
        brightness = np.mean(gray)
        if brightness < 30:
            return False, {
                'en': 'Image is too dark. Please ensure good lighting.',
                'hi': 'छवि बहुत अंधेरी है। कृपया अच्छी रोशनी सुनिश्चित करें।'
            }
        elif brightness > 230:
            return False, {
                'en': 'Image is overexposed. Please reduce lighting.',
                'hi': 'छवि ओवरएक्सपोज्ड है। कृपया रोशनी कम करें।'
            }
        
        # All validations passed
        return True, None
    
    except Exception as e:
        logger.error(f"Image validation error: {e}")
        return False, {
            'en': f'Error validating image: {str(e)}',
            'hi': f'छवि सत्यापित करने में त्रुटि: {str(e)}'
        }


def validate_file_extension(filename):
    """Validate file extension"""
    allowed_extensions = {'png', 'jpg', 'jpeg', 'webp'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions


def get_image_metadata(image_path):
    """Extract image metadata"""
    try:
        img = cv2.imread(image_path)
        if img is None:
            return None
        
        height, width = img.shape[:2]
        size = os.path.getsize(image_path)
        
        # Calculate blur score
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
        
        # Calculate brightness
        brightness = np.mean(gray)
        
        return {
            'width': width,
            'height': height,
            'size_bytes': size,
            'blur_score': blur_score,
            'brightness': brightness,
            'aspect_ratio': width / height if height > 0 else 0
        }
    except Exception as e:
        logger.error(f"Metadata extraction error: {e}")
        return None