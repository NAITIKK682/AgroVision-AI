from flask_sqlalchemy import SQLAlchemy

# Global database object
db = SQLAlchemy()

def init_db(app):
    """Initialize the database with the Flask app"""
    db.init_app(app)
    with app.app_context():
        # CRITICAL: Models MUST be imported here before create_all()
        # so SQLAlchemy can detect the table schemas.
        try:
            from database.models import ScanResult, ScanHistory
            # Add any other models here if they exist (e.g., User, Report)
        except ImportError:
            pass

        # Yeh command automatic 'agroviz.db' file aur tables bana degi
        db.create_all()

def get_db():
    """Get database connection for direct queries"""
    return db