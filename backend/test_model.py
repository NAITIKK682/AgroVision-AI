"""
Quick model test script
"""
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import tensorflow as tf
import numpy as np
from PIL import Image
from services.model_service import model_service

# Test model
print("🔍 Model loaded:", model_service.model is not None)
print("📚 Classes:", model_service.classes)
print("Model Input Shape:", model_service.model.input_shape)
print("Model Output Shape:", model_service.model.output_shape)

# Test with a sample image - find any image in dataset
test_image_path = None
dataset_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'PERSONAL PROJECTS', 'Crop_Disease_Predictor', 'dataset', 'test')

# Find any test image
for class_name in ['Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy']:
    class_path = os.path.join(dataset_dir, 'Potato___Early_blight')
    if os.path.exists(class_path):
        images = os.listdir(class_path)
        if images:
            test_image_path = os.path.join(class_path, images[0])
            break

if test_image_path and os.path.exists(test_image_path):
    print(f"\n✅ Testing with: {test_image_path}")
    result = model_service.predict(test_image_path)
    print("Prediction Result:", result)
else:
    print("✅ Test image not found - model loaded successfully but no test data available")
