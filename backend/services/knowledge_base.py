# backend/services/knowledge_base.py

KNOWLEDGE_BASE = {
    # --- APPLE CATEGORY ---
    "Apple_Healthy": {
        "crop_name": "Apple",
        "disease_name": "Healthy",
        "symptoms": ["Leaves are vibrant green", "Fruit surface is smooth", "No visible spots or fungal growth"],
        "cause": "Optimal soil nutrition and balanced irrigation.",
        "prevention": ["Regular pruning for sunlight", "Proper spacing between trees"],
        "organic_solution": "Use compost and organic mulch to maintain soil health.",
        "chemical_solution": "None required. Maintain current preventive spray schedule.",
        "recovery_time": "N/A"
    },
    "Apple___Apple_scab": {
        "crop_name": "Apple",
        "disease_name": "Apple Scab",
        "symptoms": ["Olive-green velvety spots on leaves", "Brown corky scabs on fruit", "Premature leaf fall"],
        "cause": "Fungus (Venturia inaequalis), thrives in cool, wet spring weather.",
        "prevention": ["Rake and destroy fallen leaves", "Plant scab-resistant varieties"],
        "organic_solution": "Sulfur or Neem oil sprays applied early in the season.",
        "chemical_solution": "Fungicides containing Myclobutanil or Captan.",
        "recovery_time": "3-5 weeks for recovery of new foliage."
    },
    "Apple___Cedar_apple_rust": {
        "crop_name": "Apple",
        "disease_name": "Cedar Apple Rust",
        "symptoms": ["Bright orange/yellow spots on upper leaf surface", "Small cup-like structures on leaf underside"],
        "cause": "Fungus (Gymnosporangium juniperi-virginianae), requires nearby Juniper trees to complete life cycle.",
        "prevention": ["Remove nearby Red Cedar or Juniper trees", "Use rust-resistant apple cultivars"],
        "organic_solution": "Copper-based fungicides during the 'bud break' stage.",
        "chemical_solution": "Fungicides like Triadimefon or Mancozeb.",
        "recovery_time": "Full season management required."
    },

    # --- CORN CATEGORY ---
    "Corn_Healthy": {
        "crop_name": "Corn",
        "disease_name": "Healthy",
        "symptoms": ["Deep green, upright leaves", "Strong stalk development"],
        "cause": "Good nitrogen levels and adequate water.",
        "prevention": ["Crop rotation", "Balanced NPK fertilization"],
        "organic_solution": "Addition of well-rotted manure.",
        "chemical_solution": "None required.",
        "recovery_time": "N/A"
    },
    "Corn_Diseased": {
        "crop_name": "Corn",
        "disease_name": "General Disease/Stress",
        "symptoms": ["Yellowing of lower leaves", "Stunted growth", "Non-specific wilting"],
        "cause": "Nutrient deficiency or early stage unidentified pathogen.",
        "prevention": ["Soil testing", "Improved field drainage"],
        "organic_solution": "Balanced organic fertilization and bio-fertilizers.",
        "chemical_solution": "General broad-spectrum fungicide if spots appear.",
        "recovery_time": "14-20 days"
    },
    "Corn_(maize)___Common_rust_": {
        "crop_name": "Corn",
        "disease_name": "Common Rust",
        "symptoms": ["Cinnamon-brown pustules on both leaf surfaces", "Pustules turn black as plant matures"],
        "cause": "Fungus (Puccinia sorghi), spreads rapidly via wind-blown spores.",
        "prevention": ["Plant resistant corn hybrids", "Early planting to avoid high humidity months"],
        "organic_solution": "Sprays containing Bacillus subtilis.",
        "chemical_solution": "Fungicides like Pyraclostrobin or Azoxystrobin.",
        "recovery_time": "15-21 days"
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "crop_name": "Corn",
        "disease_name": "Northern Leaf Blight",
        "symptoms": ["Long, cigar-shaped grayish-green lesions", "Lesions can grow to several inches"],
        "cause": "Fungus (Exserohilum turcicum), survives in crop residue.",
        "prevention": ["Crop rotation with non-grasses", "Deep tillage to bury infected stalks"],
        "organic_solution": "Potassium bicarbonate based sprays.",
        "chemical_solution": "Propiconazole or other Group 3 fungicides.",
        "recovery_time": "21-28 days"
    },

    # --- MANGO CATEGORY ---
    "Mango_Healthy": {
        "crop_name": "Mango",
        "disease_name": "Healthy",
        "symptoms": ["Large, dark green waxy leaves", "No spots or powdery residue"],
        "cause": "Good sunlight and proper micronutrient (Zinc/Boron) levels.",
        "prevention": ["Proper spacing", "Post-harvest pruning"],
        "organic_solution": "Maintain health with fish emulsion sprays.",
        "chemical_solution": "None required.",
        "recovery_time": "N/A"
    },
    "Mango_Diseased": {
        "crop_name": "Mango",
        "disease_name": "General Infection",
        "symptoms": ["Blackening of flowers", "Tip dieback of branches", "Sooty mold on leaves"],
        "cause": "Often caused by Anthracnose or Powdery Mildew pathogens.",
        "prevention": ["Prune dead wood before monsoon", "Control leaf-hoppers"],
        "organic_solution": "Neem oil and Trichoderma viride applications.",
        "chemical_solution": "Carbendazim or Copper Oxychloride sprays.",
        "recovery_time": "1 month management"
    },

    # --- ORANGE CATEGORY ---
    "Orange___Haunglongbing_(Citrus_greening)": {
        "crop_name": "Orange/Citrus",
        "disease_name": "Citrus Greening (HLB)",
        "symptoms": ["Yellowing of veins (Mottle)", "Small, lopsided bitter fruit", "Tree dieback"],
        "cause": "Bacterium (Candidatus Liberibacter), spread by Asian Citrus Psyllid.",
        "prevention": ["Control psyllid insects", "Use disease-free nursery trees"],
        "organic_solution": "Nutritional management (Zinc/Iron) to keep tree productive.",
        "chemical_solution": "Systemic insecticides (Imidacloprid) for vector control.",
        "recovery_time": "Incurable (Requires lifelong management or tree removal)"
    },

    # --- POTATO CATEGORY ---
    "Potato_Healthy": {
        "crop_name": "Potato",
        "disease_name": "Healthy",
        "symptoms": ["Vigorous green foliage", "Sturdy stems", "No wilting"],
        "cause": "Certified seed usage and proper hilling.",
        "prevention": ["Crop rotation", "Avoiding water-logged soil"],
        "organic_solution": "Seaweed extract for vigor.",
        "chemical_solution": "None.",
        "recovery_time": "N/A"
    },
    "Potato___Early_blight": {
        "crop_name": "Potato",
        "disease_name": "Early Blight",
        "symptoms": ["Concentric 'target' rings on older leaves", "Leaves turn yellow and die"],
        "cause": "Fungus (Alternaria solani), affects stressed or aging plants.",
        "prevention": ["Maintain high plant vigor", "Avoid overhead irrigation"],
        "organic_solution": "Copper fungicides or Serenade (Bacillus subtilis).",
        "chemical_solution": "Chlorothalonil or Mancozeb.",
        "recovery_time": "14-20 days"
    },
    "Potato___Late_blight": {
        "crop_name": "Potato",
        "disease_name": "Late Blight",
        "symptoms": ["Water-soaked dark spots with white mold underneath", "Rapid rotting of tubers"],
        "cause": "Oomycete (Phytophthora infestans), deadly in cool/humid weather.",
        "prevention": ["Destroy infected cull piles", "Plant resistant varieties"],
        "organic_solution": "Bordeaux mixture (Copper sulfate + Lime).",
        "chemical_solution": "Metalaxyl or Ridomil Gold.",
        "recovery_time": "7-14 days (Must act fast)"
    },

    # --- TOMATO CATEGORY ---
    "Tomato_Healthy": {
        "crop_name": "Tomato",
        "disease_name": "Healthy",
        "symptoms": ["Uniform green leaves", "Consistent fruit set", "No curling"],
        "cause": "Consistent moisture and high soil organic matter.",
        "prevention": ["Mulching", "Staking for airflow"],
        "organic_solution": "Regular compost tea.",
        "chemical_solution": "None.",
        "recovery_time": "N/A"
    },
    "Tomato___Bacterial_spot": {
        "crop_name": "Tomato",
        "disease_name": "Bacterial Spot",
        "symptoms": ["Small water-soaked greasy spots on leaves", "Rough scabby spots on fruit"],
        "cause": "Bacterium (Xanthomonas), spreads through splashing rain/water.",
        "prevention": ["Avoid overhead watering", "Clean tools between plants"],
        "organic_solution": "Copper sprays and sanitizing seeds with hot water.",
        "chemical_solution": "Fixed copper fungicides mixed with Mancozeb.",
        "recovery_time": "21 days"
    },
    "Tomato___Early_blight": {
        "crop_name": "Tomato",
        "disease_name": "Early Blight",
        "symptoms": ["Bullseye-shaped brown spots on lower leaves", "Stem cankers"],
        "cause": "Fungus (Alternaria solani).",
        "prevention": ["Mulch to prevent soil splash", "Remove bottom leaves"],
        "organic_solution": "Potassium bicarbonate or Copper spray.",
        "chemical_solution": "Chlorothalonil or Daconil.",
        "recovery_time": "15-20 days"
    },
    "Tomato___Late_blight": {
        "crop_name": "Tomato",
        "disease_name": "Late Blight",
        "symptoms": ["Large dark brown patches on leaves", "White fuzzy growth under leaves"],
        "cause": "Oomycete (Phytophthora infestans).",
        "prevention": ["Stake plants", "Improve field drainage"],
        "organic_solution": "Strong Copper-based organic sprays.",
        "chemical_solution": "Mancozeb or specialized blight fungicides.",
        "recovery_time": "10-14 days"
    }
}

def get_disease_details(raw_class_name):
    """
    Logic to match classes.txt names to the Knowledge Base.
    """
    # Clean standard names (Handling extra spaces or underscores)
    cleaned_name = raw_class_name.strip()
    
    # Check if exact match exists
    if cleaned_name in KNOWLEDGE_BASE:
        return KNOWLEDGE_BASE[cleaned_name]
    
    # If not, try a loose match for 'Healthy'
    if "Healthy" in cleaned_name:
        for key in KNOWLEDGE_BASE:
            if "Healthy" in key:
                return KNOWLEDGE_BASE[key]
                
    # Default fallback
    return {
        "crop_name": cleaned_name.split('___')[0] if '___' in cleaned_name else "Plant",
        "disease_name": "Unknown Condition",
        "symptoms": ["Detailed symptoms for this specific variety are being updated."],
        "cause": "General plant stress or emerging pathogen.",
        "prevention": ["Ensure proper irrigation", "Check for pests"],
        "organic_solution": "Apply Neem oil as a general precaution.",
        "chemical_solution": "Consult your local Agricultural Extension Office.",
        "recovery_time": "14-21 days"
    }