import tensorflow as tf
import numpy as np
from PIL import Image
import os

# Files ke paths set karein
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'crop_disease_model.h5')
LABEL_PATH = os.path.join(BASE_DIR, 'model', 'labels.txt')

class ModelInference:
    def __init__(self):
        # 1. Model aur Labels ko memory mein load karein
        self.model = tf.keras.models.load_model(MODEL_PATH)
        with open(LABEL_PATH, 'r') as f:
            self.labels = [line.strip() for line in f.readlines()]

    def predict(self, image_path):
        # 2. Image ko preprocess karein (Wahi settings jo training mein thi)
        img = Image.open(image_path).convert('RGB').resize((224, 224))
        img_array = np.array(img) / 127.5 - 1.0  # MobileNetV2 Normalization
        img_array = np.expand_dims(img_array, axis=0)

        # 3. Prediction karein
        predictions = self.model.predict(img_array)
        index = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]))

        return {
            "disease": self.labels[index],
            "confidence": round(confidence * 100, 2), # e.g., 95.45
            "status": "Success"
        }