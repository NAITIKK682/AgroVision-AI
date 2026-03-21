# final_fix.py
from app import create_app
from database.db import db
import os

app = create_app()
with app.app_context():
    print("Deleting old database...")
    db.drop_all()
    print("Creating new database with updated columns...")
    db.create_all()
    
    # Ensure uploads folder exists
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
        
    print("✅ System Ready! Ab 'python app.py' chalao.")