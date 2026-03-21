"""
Test Scan Prediction Pipeline
"""
import json
from PIL import Image
import numpy as np
import os
from app import create_app

# Create Flask app
app = create_app()
app.config['TESTING'] = True

# Create test image
def create_test_image():
    """Create a test potato leaf image with texture for blur detection"""
    import cv2
    
    # Start with a base pattern
    img_array = np.zeros((160, 160, 3), dtype=np.uint8)
    
    # Create a leaf-like pattern with veins (high frequency details)
    # Main leaf structure - greenish
    img_array[20:140, 20:140] = [80, 120, 60]  # Green base
    
    # Add leaf veins (high contrast lines)
    for i in range(25, 140, 3):
        img_array[i:i+1, 40:120] = [50, 80, 30]  # Dark vein lines
        if i % 10 == 0:
            img_array[40:120, i:i+1] = [50, 80, 30]
    
    # Add spotted disease areas with texture
    img_array[50:70, 60:80] = [140, 100, 60]  # Brown disease spots
    img_array[80:100, 50:70] = [180, 140, 80]  # Yellow spots
    
    # Add fine texture noise to ensure high Laplacian variance
    noise = np.random.randint(-20, 20, img_array.shape, dtype=np.int16)
    img_array = np.clip(img_array.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    
    img = Image.fromarray(img_array, 'RGB')
    img.save('test_leaf.jpg')
    return 'test_leaf.jpg'

# Test prediction
def test_predict():
    with app.app_context():
        client = app.test_client()
        
        # Create test image
        image_path = create_test_image()
        
        # Create request
        with open(image_path, 'rb') as f:
            response = client.post(
                '/api/predict',
                data={
                    'image': (f, 'test.jpg'),
                    'lat': '28.6139',
                    'lon': '77.2090'
                }
            )
        
        # Check response
        print(f"Status Code: {response.status_code}")
        print(f"Response Type: {type(response.json)}")
        
        result = response.get_json()
        print(f"\n📋 Response Structure:")
        print(json.dumps(result, indent=2, default=str))
        
        # Validate response
        if response.status_code == 200:
            if 'status' in result:
                print(f"\n✅ Status: {result['status']}")
            if 'data' in result:
                print(f"✅ Has data field")
                if 'prediction' in result['data']:
                    pred = result['data']['prediction']
                    print(f"  ✅ Crop: {pred.get('crop_name')}")
                    print(f"  ✅ Disease: {pred.get('disease_name')}")
                    print(f"  ✅ Confidence: {pred.get('confidence')}%")
                    print(f"  ✅ Severity: {pred.get('severity')}")
                    print(f"  ✅ Has symptoms: {'symptoms' in pred}")
                    print(f"  ✅ Has cause: {'cause' in pred}")
                    print(f"  ✅ Has organic_solution: {'organic_solution' in pred}")
                    print(f"  ✅ Has chemical_solution: {'chemical_solution' in pred}")
                else:
                    print("❌ No prediction in data")
            else:
                print(f"❌ No data field in response")
        else:
            print(f"❌ Request failed with status {response.status_code}")
        
        # Cleanup
        os.remove(image_path)

if __name__ == '__main__':
    test_predict()
