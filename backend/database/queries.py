from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import uuid
import json  # FIX: JSON import missing tha, isliye dumps/loads fail ho rahe the
from database.db import get_db
from database.models import ScanResult, AssistantQuery


class ScanQueries:
    """Database queries for scan results"""
    
    @staticmethod
    def create_scan(scan: ScanResult) -> bool:
        """Insert a new scan result"""
        db = get_db()
        
        query = '''
            INSERT INTO scans (
                scan_id, user_id, image_filename, crop_name, disease_name,
                confidence, severity, symptoms, cause, prevention,
                organic_solution, chemical_solution, fertilizer_recommendation,
                recovery_time, safety_tips, weather_warning, latitude, longitude
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        '''
        
        try:
            # FIX: Ensure all dictionary/list fields are safely handled if they are already strings or None
            def safe_json(data):
                if data is None: return "[]"
                return json.dumps(data) if not isinstance(data, str) else data

            db.execute_query(query, (
                scan.scan_id,
                scan.user_id,
                scan.image_filename,
                scan.crop_name,
                scan.disease_name,
                scan.confidence,
                scan.severity,
                safe_json(getattr(scan, 'symptoms', [])),
                safe_json(getattr(scan, 'cause', [])),
                safe_json(getattr(scan, 'prevention', [])),
                safe_json(getattr(scan, 'organic_solution', [])),
                safe_json(getattr(scan, 'chemical_solution', [])),
                safe_json(getattr(scan, 'fertilizer_recommendation', [])),
                getattr(scan, 'recovery_time', 'N/A'),
                safe_json(getattr(scan, 'safety_tips', [])),
                safe_json(getattr(scan, 'weather_warning', 'No advisory')),
                scan.latitude,
                scan.longitude
            ))
            return True
        except Exception as e:
            print(f"Error creating scan: {e}")
            return False
    
    @staticmethod
    def get_scan_by_id(scan_id: str) -> Optional[ScanResult]:
        """Get scan by ID"""
        db = get_db()
        
        query = 'SELECT * FROM scans WHERE scan_id = ?'
        row = db.fetch_one(query, (scan_id,))
        
        if row:
            return ScanQueries._row_to_scan(row)
        return None
    
    @staticmethod
    def get_user_scans(user_id: str, limit: int = 20) -> List[ScanResult]:
        """Get scans for a user"""
        db = get_db()
        
        query = '''
            SELECT * FROM scans 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT ?
        '''
        rows = db.fetch_all(query, (user_id, limit))
        
        return [ScanQueries._row_to_scan(row) for row in rows]
    
    @staticmethod
    def get_all_scans(limit: int = 50) -> List[ScanResult]:
        """Get all scans (for admin)"""
        db = get_db()
        
        query = 'SELECT * FROM scans ORDER BY created_at DESC LIMIT ?'
        rows = db.fetch_all(query, (limit,))
        
        return [ScanQueries._row_to_scan(row) for row in rows]
    
    @staticmethod
    def delete_scan(scan_id: str) -> bool:
        """Delete a scan"""
        db = get_db()
        
        query = 'DELETE FROM scans WHERE scan_id = ?'
        try:
            db.execute_query(query, (scan_id,))
            return True
        except Exception as e:
            print(f"Error deleting scan: {e}")
            return False
    
    @staticmethod
    def _row_to_scan(row) -> ScanResult:
        """Convert database row to ScanResult"""
        # Helper to safely load JSON
        def safe_load(field):
            try:
                return json.loads(row[field]) if row[field] else []
            except:
                return row[field]

        return ScanResult(
            scan_id=row['scan_id'],
            user_id=row['user_id'],
            image_filename=row['image_filename'],
            crop_name=row['crop_name'],
            disease_name=row['disease_name'],
            confidence=row['confidence'],
            severity=row['severity'],
            symptoms=safe_load('symptoms'),
            cause=safe_load('cause'),
            prevention=safe_load('prevention'),
            organic_solution=safe_load('organic_solution'),
            chemical_solution=safe_load('chemical_solution'),
            fertilizer_recommendation=safe_load('fertilizer_recommendation'),
            recovery_time=row['recovery_time'],
            safety_tips=safe_load('safety_tips'),
            weather_warning=safe_load('weather_warning'),
            latitude=row['latitude'],
            longitude=row['longitude'],
            created_at=row['created_at']
        )


class AssistantQueries:
    """Database queries for assistant interactions"""
    
    @staticmethod
    def create_query(query: AssistantQuery) -> bool:
        """Insert a new assistant query"""
        db = get_db()
        
        query_sql = '''
            INSERT INTO assistant_queries (
                query_id, user_id, query_text, response_text, language
            ) VALUES (?, ?, ?, ?, ?)
        '''
        
        try:
            db.execute_query(query_sql, (
                query.query_id,
                query.user_id,
                query.query_text,
                query.response_text,
                query.language
            ))
            return True
        except Exception as e:
            print(f"Error creating assistant query: {e}")
            return False
    
    @staticmethod
    def get_user_queries(user_id: str, limit: int = 20) -> List[AssistantQuery]:
        """Get queries for a user"""
        db = get_db()
        
        query_sql = '''
            SELECT * FROM assistant_queries 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT ?
        '''
        rows = db.fetch_all(query_sql, (user_id, limit))
        
        return [AssistantQueries._row_to_query(row) for row in rows]
    
    @staticmethod
    def _row_to_query(row) -> AssistantQuery:
        """Convert database row to AssistantQuery"""
        return AssistantQuery(
            query_id=row['query_id'],
            user_id=row['user_id'],
            query_text=row['query_text'],
            response_text=row['response_text'],
            language=row['language'],
            created_at=row['created_at']
        )