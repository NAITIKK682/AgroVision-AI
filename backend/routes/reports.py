"""
PDF Report Generation Routes
Generate downloadable PDF reports for scans
"""

import logging
import os
from datetime import datetime
from flask import Blueprint, request, jsonify, send_file
from services.pdf_service import PDFGenerator
from database.models import ScanHistory
from flask_jwt_extended import jwt_required, get_jwt_identity

logger = logging.getLogger(__name__)
reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/generate-report', methods=['POST'])
@jwt_required(optional=True)
def generate_report():
    """
    Generate PDF report for a scan
    
    Request Body:
        scan_id: ID of the scan (optional)
        scan_data: Scan data object (if scan_id not provided)
        language: 'en' or 'hi'
        include_images: boolean (default: true)
    
    Returns:
        PDF file or error message
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'status': 'error',
                'message': 'Request body is required'
            }), 400
        
        scan_id = data.get('scan_id')
        scan_data = data.get('scan_data')
        language = data.get('language', 'en')
        include_images = data.get('include_images', True)
        
        # Get scan data
        if scan_id:
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
            
            # Convert scan to dict
            scan_data = {
                'crop_name': scan.crop_name,
                'disease_name': scan.disease_name,
                'confidence': f"{scan.confidence:.1f}%",
                'severity': scan.severity,
                'symptoms': scan.symptoms,
                'cause': scan.cause,
                'prevention': scan.prevention,
                'organic_solution': scan.organic_solution,
                'chemical_solution': scan.chemical_solution,
                'fertilizer_recommendation': scan.fertilizer_recommendation,
                'recovery_time': scan.recovery_time,
                'safety_tips': scan.safety_tips,
                'weather_warning': scan.weather_warning,
                'created_at': scan.created_at.isoformat(),
                'latitude': scan.latitude,
                'longitude': scan.longitude
            }
        elif not scan_data:
            return jsonify({
                'status': 'error',
                'message': 'Either scan_id or scan_data is required'
            }), 400
        
        # Generate PDF
        pdf_generator = PDFGenerator(language=language)
        pdf_buffer = pdf_generator.create_report(scan_data, include_images)
        
        # Save to file for download
        filename = f"agroviz_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        filepath = os.path.join(os.getenv('REPORTS_FOLDER', 'static/reports'), filename)
        
        with open(filepath, 'wb') as f:
            f.write(pdf_buffer.getvalue())
        
        # Return file for download
        return send_file(
            filepath,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=filename
        )
    
    except Exception as e:
        logger.error(f"Report generation error: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to generate report',
            'error': str(e)
        }), 500


@reports_bp.route('/reports/<filename>', methods=['GET'])
def get_report(filename):
    """Download a previously generated report"""
    try:
        filepath = os.path.join(os.getenv('REPORTS_FOLDER', 'static/reports'), filename)
        
        if not os.path.exists(filepath):
            return jsonify({
                'status': 'error',
                'message': 'Report not found'
            }), 404
        
        return send_file(
            filepath,
            mimetype='application/pdf',
            as_attachment=False
        )
    
    except Exception as e:
        logger.error(f"Get report error: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve report',
            'error': str(e)
        }), 500


@reports_bp.route('/reports/templates', methods=['GET'])
def get_templates():
    """Get available report templates"""
    templates = {
        'en': [
            {
                'id': 'detailed',
                'name': 'Detailed Report',
                'description': 'Comprehensive report with all details'
            },
            {
                'id': 'summary',
                'name': 'Summary Report',
                'description': 'Quick summary with key information'
            },
            {
                'id': 'farmer',
                'name': 'Farmer-Friendly Report',
                'description': 'Simple language with visual aids'
            }
        ],
        'hi': [
            {
                'id': 'detailed',
                'name': 'विस्तृत रिपोर्ट',
                'description': 'सभी विवरणों के साथ व्यापक रिपोर्ट'
            },
            {
                'id': 'summary',
                'name': 'सारांश रिपोर्ट',
                'description': 'प्रमुख जानकारी के साथ त्वरित सारांश'
            },
            {
                'id': 'farmer',
                'name': 'किसान-अनुकूल रिपोर्ट',
                'description': 'दृश्य सहायता के साथ सरल भाषा'
            }
        ]
    }
    
    language = request.args.get('language', 'en')
    return jsonify({
        'status': 'success',
        'templates': templates.get(language, templates['en'])
    })


@reports_bp.route('/reports/bulk', methods=['POST'])
@jwt_required()
def generate_bulk_reports():
    """Generate multiple reports at once (for authenticated users)"""
    try:
        data = request.get_json()
        scan_ids = data.get('scan_ids', [])
        language = data.get('language', 'en')
        
        if not scan_ids:
            return jsonify({
                'status': 'error',
                'message': 'Scan IDs are required'
            }), 400
        
        # Get user identity
        user_id = get_jwt_identity()
        
        # Generate reports
        reports = []
        pdf_generator = PDFGenerator(language=language)
        
        for scan_id in scan_ids:
            scan = ScanHistory.query.get(scan_id)
            
            if not scan:
                continue
            
            # Check authorization
            if scan.user_id != user_id:
                continue
            
            scan_data = {
                'crop_name': scan.crop_name,
                'disease_name': scan.disease_name,
                'confidence': f"{scan.confidence:.1f}%",
                'severity': scan.severity,
                'symptoms': scan.symptoms,
                'organic_solution': scan.organic_solution,
                'chemical_solution': scan.chemical_solution,
                'created_at': scan.created_at.isoformat()
            }
            
            pdf_buffer = pdf_generator.create_report(scan_data)
            
            filename = f"agroviz_report_{scan_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            filepath = os.path.join(os.getenv('REPORTS_FOLDER', 'static/reports'), filename)
            
            with open(filepath, 'wb') as f:
                f.write(pdf_buffer.getvalue())
            
            reports.append({
                'scan_id': scan_id,
                'filename': filename,
                'url': f"/api/reports/{filename}"
            })
        
        return jsonify({
            'status': 'success',
            'reports': reports,
            'count': len(reports)
        })
    
    except Exception as e:
        logger.error(f"Bulk report generation error: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to generate bulk reports',
            'error': str(e)
        }), 500