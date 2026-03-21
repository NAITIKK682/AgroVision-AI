import os
import numpy as np
from PIL import Image
import logging
import tensorflow as tf

# Standard logger
logger = logging.getLogger(__name__)

class ModelService:
    def __init__(self):
        self.model = None
        self.classes = []
        # Path configuration - Fixed path logic to ensure classes.txt is found
        base_path = os.path.dirname(__file__)
        self.model_path = os.path.normpath(os.path.join(base_path, '..', 'model', 'crop_disease_model.keras'))
        self.classes_path = os.path.normpath(os.path.join(base_path, '..', 'model', 'classes.txt'))
        self._load_model()

    def _load_model(self):
        try:
            if os.path.exists(self.model_path):
                # Load Keras model
                self.model = tf.keras.models.load_model(self.model_path)
                
                if os.path.exists(self.classes_path):
                    with open(self.classes_path, 'r', encoding='utf-8') as f:
                        self.classes = [line.strip() for line in f.readlines()]
                    logger.info(f"✅ Loaded {len(self.classes)} classes.")
                else:
                    logger.warning(f"⚠️ Classes file missing at: {self.classes_path}")
                
                logger.info("✅ AgroVision AI Engine: ONLINE & OPTIMIZED")
            else:
                logger.error(f"Model file missing at: {self.model_path}")
        except Exception as e:
            logger.critical(f"❌ Inference Engine Error: {str(e)}")

    def predict(self, image_path, lang='en'):
        if self.model is None:
            logger.error("Model is not initialized")
            return {"error": "AI Engine not initialized", "status": "failed"}

        try:
            # Preprocessing - EfficientNet style (160x160, raw [0-255] pixels)
            logger.info(f"Loading image from: {image_path}")
            
            # Open and validate image
            img = Image.open(image_path)
            logger.info(f"Original image size: {img.size}, mode: {img.mode}")
            
            # Convert to RGB (handles RGBA, grayscale, etc.)
            img = img.convert('RGB')
            
            # Resize to model input size
            img = img.resize((160, 160), Image.Resampling.LANCZOS)
            logger.info(f"Resized image to: {img.size}")
            
            # Convert to numpy array
            img_array = np.array(img, dtype=np.float32)
            logger.info(f"Image array shape: {img_array.shape}, dtype: {img_array.dtype}, range: [{img_array.min()}, {img_array.max()}]")
            
            # Add batch dimension
            img_array = np.expand_dims(img_array, axis=0)
            logger.info(f"After expand_dims: {img_array.shape}")
            
            # Apply EfficientNet preprocessing (handles [0-255] pixels internally)
            img_array = tf.keras.applications.efficientnet.preprocess_input(img_array)
            logger.info(f"After preprocess_input: shape={img_array.shape}, range=[{img_array.min():.2f}, {img_array.max():.2f}]")

            # Inference
            logger.info("Running model inference...")
            predictions = self.model.predict(img_array, verbose=0)
            logger.info(f"Raw predictions shape: {predictions.shape}")
            
            preds = predictions[0]
            logger.info(f"Predictions for all classes: {preds}")
            
            # Validate predictions
            if preds is None or len(preds) == 0:
                logger.error(f"Invalid predictions received: {preds}")
                return {"error": "Model returned empty predictions", "status": "failed"}
            
            # Find maximum prediction
            index = np.argmax(preds)
            confidence = float(preds[index])
            logger.info(f"Top prediction - Index: {index}, Confidence: {confidence:.4f}")

            # Check for out of bounds index
            if index >= len(self.classes):
                logger.error(f"⚠️ INDEX OUT OF BOUNDS: Index {index} >= Number of classes {len(self.classes)}")
                logger.error(f"Predictions shape: {predictions.shape}, Classes count: {len(self.classes)}")
                return {"error": f"Model returned invalid class index {index}", "status": "failed"}
            
            raw_name = self.classes[index]
            logger.info(f"Predicted class: {raw_name}")
            
            # Semantic Splitting
            if '___' in raw_name:
                parts = raw_name.split('___')
                crop = parts[0].replace('_', ' ')
                disease = parts[1].replace('_', ' ')
            else:
                crop = "Crop"
                disease = raw_name.replace('_', ' ')

            result = {
                "crop_name": crop,
                "disease_name": disease,
                "confidence": round(confidence * 100, 2),
                "severity": "High" if confidence > 0.8 else "Medium" if confidence > 0.4 else "Low",
                "status": "success",
                # Add all predictions for chart display
                "all_predictions": {
                    self.classes[i].split('___')[-1].replace('_', ' '): round(float(preds[i]) * 100, 2) 
                    for i in range(len(self.classes))
                }
            }
            logger.info(f"✅ Prediction successful: {result}")
            return result
            
        except Exception as e:
            logger.error(f"❌ Prediction failed: {e}", exc_info=True)
            return {"error": str(e), "status": "failed"}

# Singleton instance
model_service = ModelService()