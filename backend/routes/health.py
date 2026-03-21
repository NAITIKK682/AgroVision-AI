"""
Health Check Routes
Monitor application health and status
"""

import logging
import os
from datetime import datetime
from flask import Blueprint, jsonify
from database.db import db

logger = logging.getLogger(__name__)
health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    """Basic health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AgroVision AI API',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })


@health_bp.route('/health/detailed', methods=['GET'])
def detailed_health():
    """Detailed health check including dependencies"""
    health_status = {
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'checks': {}
    }
    
    # Check database connection
    try:
        db.session.execute('SELECT 1')
        health_status['checks']['database'] = {
            'status': 'healthy',
            'message': 'Database connection successful'
        }
    except Exception as e:
        health_status['checks']['database'] = {
            'status': 'unhealthy',
            'message': f'Database connection failed: {str(e)}'
        }
        health_status['status'] = 'unhealthy'
    
    # Check file system
    try:
        upload_folder = os.getenv('UPLOAD_FOLDER', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        test_file = os.path.join(upload_folder, '.health_check')
        with open(test_file, 'w') as f:
            f.write('test')
        os.remove(test_file)
        health_status['checks']['filesystem'] = {
            'status': 'healthy',
            'message': 'File system accessible'
        }
    except Exception as e:
        health_status['checks']['filesystem'] = {
            'status': 'unhealthy',
            'message': f'File system error: {str(e)}'
        }
        health_status['status'] = 'unhealthy'
    
    # Check environment variables
    required_env_vars = ['SECRET_KEY']
    missing_vars = [var for var in required_env_vars if not os.getenv(var)]
    
    if missing_vars:
        health_status['checks']['environment'] = {
            'status': 'warning',
            'message': f'Missing environment variables: {", ".join(missing_vars)}'
        }
    else:
        health_status['checks']['environment'] = {
            'status': 'healthy',
            'message': 'All required environment variables set'
        }
    
    return jsonify(health_status)


@health_bp.route('/health/stats', methods=['GET'])
def system_stats():
    """Get system statistics"""
    import psutil
    import platform
    
    stats = {
        'system': {
            'platform': platform.platform(),
            'python_version': platform.python_version(),
            'processor': platform.processor()
        },
        'cpu': {
            'usage_percent': psutil.cpu_percent(interval=1),
            'count': psutil.cpu_count()
        },
        'memory': {
            'total_gb': round(psutil.virtual_memory().total / (1024**3), 2),
            'available_gb': round(psutil.virtual_memory().available / (1024**3), 2),
            'used_percent': psutil.virtual_memory().percent
        },
        'disk': {
            'total_gb': round(psutil.disk_usage('/').total / (1024**3), 2),
            'used_gb': round(psutil.disk_usage('/').used / (1024**3), 2),
            'free_gb': round(psutil.disk_usage('/').free / (1024**3), 2),
            'usage_percent': psutil.disk_usage('/').percent
        },
        'timestamp': datetime.now().isoformat()
    }
    
    return jsonify(stats)