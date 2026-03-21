"""
AgroVision Data Models
Enterprise-grade SQLAlchemy schema for crop diagnostics and AI history.
"""

from datetime import datetime
from .db import db

class ScanHistory(db.Model):
    """Database model for storing high-fidelity crop scan results."""
    __tablename__ = 'scan_history'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=True, index=True)
    crop_name = db.Column(db.String(100), nullable=False)
    disease_name = db.Column(db.String(100), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    severity = db.Column(db.String(50))
    image_filename = db.Column(db.String(255), nullable=True)  # Store image filename for history
    
    # Core Diagnostic Data (Stored as JSON for flexible schema evolution)
    symptoms = db.Column(db.JSON)
    cause = db.Column(db.JSON)
    prevention = db.Column(db.JSON)
    organic_solution = db.Column(db.JSON)
    chemical_solution = db.Column(db.JSON)
    fertilizer_recommendation = db.Column(db.JSON)
    
    # Geospatial data for regional outbreak mapping
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Convert database record to dictionary for premium API delivery."""
        # Build image URL if image exists
        image_url = None
        if self.image_filename:
            image_url = f"http://localhost:5000/uploads/{self.image_filename}"
        
        return {
            'id': self.id,
            'crop_name': self.crop_name,
            'disease_name': self.disease_name,
            'confidence': f"{self.confidence:.1f}%",
            'severity': self.severity,
            'image_filename': self.image_filename,
            'image_url': image_url,
            'symptoms': self.symptoms,
            'prevention': self.prevention,
            'organic_solution': self.organic_solution,
            'chemical_solution': self.chemical_solution,
            'fertilizer_recommendation': self.fertilizer_recommendation,
            'location': {'lat': self.latitude, 'lng': self.longitude} if self.latitude else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class ScanResult:
    """Enterprise Data Class for facilitating scan result transfers."""
    def __init__(self, scan_id=None, user_id=None, image_filename=None, crop_name=None, 
                 disease_name=None, confidence=None, severity=None, symptoms=None, 
                 cause=None, prevention=None, organic_solution=None, chemical_solution=None,
                 fertilizer_recommendation=None, recovery_time=None, safety_tips=None,
                 weather_warning=None, latitude=None, longitude=None):
        self.scan_id = scan_id
        self.user_id = user_id
        self.image_filename = image_filename
        self.crop_name = crop_name
        self.disease_name = disease_name
        self.confidence = confidence
        self.severity = severity
        self.symptoms = symptoms
        self.cause = cause
        self.prevention = prevention
        self.organic_solution = organic_solution
        self.chemical_solution = chemical_solution
        self.fertilizer_recommendation = fertilizer_recommendation
        self.recovery_time = recovery_time
        self.safety_tips = safety_tips
        self.weather_warning = weather_warning
        self.latitude = latitude
        self.longitude = longitude


class AssistantQuery(db.Model):
    """Database model for persistent storage of AI Assistant interactions."""
    __tablename__ = 'assistant_queries'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=True, index=True)
    query = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=False)
    language = db.Column(db.String(10), default='en')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Convert assistant interaction to dictionary for historical UI rendering."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'query': self.query,
            'response': self.response,
            'language': self.language,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }