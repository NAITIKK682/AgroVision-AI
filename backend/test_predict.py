import requests

url = "http://localhost:5000/api/predict"
img_path = r"D:\PERSONAL PROJECTS\Crop_Disease_Predictor\dataset\test\Potato___healthy\04481ca2-f94c-457e-b785-1ac05800b7ec___RS_HL 1930_flipTB.JPG"

with open(img_path, "rb") as f:
    files = {"image": ("leaf.jpg", f, "image/jpeg")}
    resp = requests.post(url, files=files, data={"lat": "0", "lon": "0"})
    print(resp.status_code)
    try:
        print(resp.json())
    except Exception as e:
        print(resp.text)
