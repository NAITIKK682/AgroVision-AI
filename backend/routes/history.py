"""
Scan History Routes
Manage and retrieve user scan history
"""

import logging
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from database.models import ScanHistory, db
from flask_jwt_extended import jwt_required, get_jwt_identity

logger = logging.getLogger(__name__)
history_bp = Blueprint('history', __name__)

@history_bp.route('/history', methods=['GET'])
@jwt_required(optional=True)
def get_history():
    """
    Get scan history for authenticated user or session
    
    Query Parameters:
        limit: Number of records to return (default: 20)
        offset: Pagination offset (default: 0)
        crop_type: Filter by crop type
        date_from: Filter by date range start
        date_to: Filter by date range end
    
    Returns:
        JSON with scan history
    """
    try:
        # Get query parameters
        limit = request.args.get('limit', 20, type=int)
        offset = request.args.get('offset', 0, type=int)
        crop_type = request.args.get('crop_type')
        date_from = request.args.get('date_from')
        date_to = request.args.get('date_to')
        
        # Get user identity
        user_id = get_jwt_identity()
        
        # Build query
        query = ScanHistory.query
        
        # Filter by user if authenticated
        if user_id:
            query = query.filter_by(user_id=user_id)
        else:
            # For unauthenticated users, use session-based filtering
            session_id = request.headers.get('X-Session-ID')
            if session_id:
                query = query.filter_by(session_id=session_id)
        
        # Apply filters
        if crop_type:
            query = query.filter(ScanHistory.crop_name.ilike(f'%{crop_type}%'))
        
        if date_from:
            try:
                date_from_dt = datetime.fromisoformat(date_from)
                query = query.filter(ScanHistory.created_at >= date_from_dt)
            except ValueError:
                pass
        
        if date_to:
            try:
                date_to_dt = datetime.fromisoformat(date_to)
                query = query.filter(ScanHistory.created_at <= date_to_dt)
            except ValueError:
                pass
        
        # Order by created_at descending
        query = query.order_by(ScanHistory.created_at.desc())
        
        # Paginate
        scans = query.offset(offset).limit(limit).all()
        
        # Format results
        scan_list = []
        for scan in scans:
            # Build image URL if image exists
            image_url = None
            if hasattr(scan, 'image_filename') and scan.image_filename:
                image_url = f"http://localhost:5000/uploads/{scan.image_filename}"
            
            scan_data = {
                'id': scan.id,
                'crop_name': scan.crop_name,
                'disease_name': scan.disease_name,
                'confidence': f"{scan.confidence:.1f}%",
                'severity': scan.severity,
                'image_filename': getattr(scan, 'image_filename', None),
                'image_url': image_url,
                'symptoms': scan.symptoms,
                'organic_solution': scan.organic_solution,
                'chemical_solution': scan.chemical_solution,
                'prevention': scan.prevention,
                'recovery_time': scan.recovery_time,
                'safety_tips': scan.safety_tips,
                'weather_warning': scan.weather_warning,
                'latitude': scan.latitude,
                'longitude': scan.longitude,
                'created_at': scan.created_at.isoformat(),
                'updated_at': scan.updated_at.isoformat()
            }
            scan_list.append(scan_data)
        
        # Get total count for pagination
        total_count = query.count()
        
        return jsonify({
            'status': 'success',
            'scans': scan_list,
            'pagination': {
                'total': total_count,
                'limit': limit,
                'offset': offset,
                'has_more': offset + limit < total_count
            }
        })
    
    except Exception as e:
        logger.error(f"History endpoint error: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve history',
            'error': str(e)
        }), 500


@history_bp.route('/history/<int:scan_id>', methods=['GET'])
@jwt_required(optional=True)
def get_scan_detail(scan_id):
    """Get detailed information for a specific scan"""
    try:
        scan = ScanHistory.query.get(scan_id)
        
        if not scan:
            return jsonify({
                'status': 'error',
                'message': 'Scan not found'
            }), 404
        
        # Check authorization
        user_id = get_jwt_identity()
        if user_id and scan.user_id != user_id:
            return jsonify({
                'status': 'error',
                'message': 'Unauthorized access'
            }), 403
        
        return jsonify({
            'status': 'success',
            'scan': {
                'id': scan.id,
                'crop_name': scan.crop_name,
                'disease_name': scan.disease_name,
                'confidence': f"{scan.confidence:.1f}%",
                'severity': scan.severity,
                'symptoms': scan.symptoms,
                'cause': scan.cause,
                'spread_risk': scan.spread_risk,
                'prevention': scan.prevention,
                'organic_solution': scan.organic_solution,
                'chemical_solution': scan.chemical_solution,
                'fertilizer_recommendation': scan.fertilizer_recommendation,
                'recovery_time': scan.recovery_time,
                'safety_tips': scan.safety_tips,
                'weather_warning': scan.weather_warning,
                'latitude': scan.latitude,
                'longitude': scan.longitude,
                'created_at': scan.created_at.isoformat(),
                'updated_at': scan.updated_at.isoformat()
            }
        })
    
    except Exception as e:
        logger.error(f"Scan detail error: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve scan details',
            'error': str(e)
        }), 500


@history_bp.route('/history/stats', methods=['GET'])
@jwt_required(optional=True)
def get_statistics():
    """Get statistics about user scans"""
    try:
        user_id = get_jwt_identity()
        
        # Build query
        query = ScanHistory.query
        
        if user_id:
            query = query.filter_by(user_id=user_id)
        else:
            session_id = request.headers.get('X-Session-ID')
            if session_id:
                query = query.filter_by(session_id=session_id)
        
        # Get total scans
        total_scans = query.count()
        
        # Get scans by crop type
        crop_stats = db.session.query(
            ScanHistory.crop_name,
            db.func.count(ScanHistory.id).label('count')
        ).group_by(ScanHistory.crop_name).all()
        
        # Get scans by disease
        disease_stats = db.session.query(
            ScanHistory.disease_name,
            db.func.count(ScanHistory.id).label('count')
        ).group_by(ScanHistory.disease_name).all()
        
        # Get recent scans (last 7 days)
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        recent_scans = query.filter(ScanHistory.created_at >= seven_days_ago).count()
        
        # Get severity distribution
        severity_stats = db.session.query(
            ScanHistory.severity,
            db.func.count(ScanHistory.id).label('count')
        ).group_by(ScanHistory.severity).all()
        
        return jsonify({
            'status': 'success',
            'statistics': {
                'total_scans': total_scans,
                'recent_scans': recent_scans,
                'by_crop': {crop: count for crop, count in crop_stats},
                'by_disease': {disease: count for disease, count in disease_stats},
                'by_severity': {severity: count for severity, count in severity_stats}
            }
        })
    
    except Exception as e:
        logger.error(f"Statistics error: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve statistics',
            'error': str(e)
        }), 500


@history_bp.route('/history/<int:scan_id>', methods=['DELETE'])
@jwt_required()
def delete_scan(scan_id):
    """Delete a specific scan (requires authentication)"""
    try:
        user_id = get_jwt_identity()
        scan = ScanHistory.query.get(scan_id)
        
        if not scan:
            return jsonify({
                'status': 'error',
                'message': 'Scan not found'
            }), 404
        
        if scan.user_id != user_id:
            return jsonify({
                'status': 'error',
                'message': 'Unauthorized access'
            }), 403
        
        db.session.delete(scan)
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Scan deleted successfully'
        })
    
    except Exception as e:
        logger.error(f"Delete scan error: {e}")
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': 'Failed to delete scan',
            'error': str(e)
        }), 500