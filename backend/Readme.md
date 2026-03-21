Backend mai age kya karna hai 


Bilkul, images collect karna sabse bada kaam hai. Jab aapke paas 14 crops ki images aa jayengi, tab aapko niche diye gaye steps ko order mein follow karna hoga.

Maine ise **5 Steps** mein divide kiya hai taaki aapka project system-wise chale.

---

### Step 1: Dataset Preparation (Sabse Pehle)

Apne `dataset/` folder mein images ko sahi se bhariye.

* **Quantity:** Har folder mein kam se kam 100-200 photos honi chahiye.
* **Quality:** Photos alag-alag angles se honi chahiye (kuch close-up leaf ki, kuch thoda door se).
* **Balance:** Aisa na ho ki Tomato ki 500 photos ho aur Brinjal ki sirf 10. Sabko barabar rakhein.

### Step 2: Model Training

Jab images ready ho jayein, tab aapko model ko "seekhana" hai.

1. Terminal mein jayein: `cd backend/model`.
2. Script run karein: `python train.py`.
3. **Check Output:** Training khatam hone ke baad aapke paas 2 nayi files aani chahiye:
* `agrovision_model.h5` (AI ka dimaag)
* `classes.txt` (Crops ki list)



### Step 3: Backend Integration (Connecting Brain to Server)

Ab is dimaag ko Flask server ke saath jodna hai.

1. `backend/services/model_service.py` mein upar bataya gaya code paste karein jo `.h5` file ko load karta hai.
2. `backend/app.py` ko run karein: `python app.py`.
3. **Test:** Postman ya kisi tool se check karein ki `/predict` API sahi response de rahi hai ya nahi.

### Step 4: Frontend Connection (Connecting UI to Server)

Ab React ko batana hai ki images kahan bhejni hain.

1. `frontend/src/services/api.js` mein Axios ka code likhein.
2. `DetectionPage.jsx` mein image upload hone par loading spinner dikhayein.
3. API se jo `crop_name` aur `disease_name` aaye, use screen par sundar tarike se display karein.

### Step 5: Final Review & Weather/Voice Features

Jab prediction chalne lage, tab baki features check karein:

1. **Weather:** Mumbai ke coordinates (lat: 19.07, lon: 72.87) ke liye weather sahi aa raha hai?
2. **Voice Assistant:** Kya AI bol kar bata raha hai ki "Aapke tamatar ko blight hai"?
3. **Report:** Kya PDF download ho rahi hai?

---

### 🔥 Pro-Tip: Images kahan se layein?

Agar aapko khet (farm) mein jaakar photos lene ka time nahi hai, toh:

1. **Kaggle:** [PlantVillage Dataset](https://www.google.com/search?q=https://www.kaggle.com/datasets/abdallahalansary/plantvillage-dataset) download karein.
2. **Google Images:** Ek extension aati hai "Download All Images", usse search karke bulk mein download kar lein.

**Kya aap chahte hain main ek "Web Scraper" script bana doon jo aapke liye in 14 crops ki images Google se automatically download kar de?**