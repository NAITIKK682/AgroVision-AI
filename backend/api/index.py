from app import app

def handler(request):
    """
    Vercel serverless function handler for Flask WSGI app.
    Routes all incoming requests to the Flask application.
    """
    # Use WSGI environment to handle the request
    environ = {
        'REQUEST_METHOD': request.method,
        'SCRIPT_NAME': '',
        'PATH_INFO': request.path or '/',
        'QUERY_STRING': request.query_string or '',
        'CONTENT_TYPE': request.headers.get('content-type', ''),
        'CONTENT_LENGTH': request.headers.get('content-length', ''),
        'SERVER_NAME': request.headers.get('host', 'localhost').split(':')[0],
        'SERVER_PORT': request.headers.get('host', 'localhost').split(':')[1] if ':' in request.headers.get('host', '') else '443',
        'SERVER_PROTOCOL': 'HTTP/1.1',
        'wsgi.version': (1, 0),
        'wsgi.url_scheme': 'https',
        'wsgi.input': request.body if hasattr(request, 'body') else None,
        'wsgi.errors': None,
        'wsgi.multithread': True,
        'wsgi.multiprocess': False,
        'wsgi.run_once': False,
    }
    
    # Add all headers to environ
    for header, value in request.headers.items():
        header = header.upper().replace('-', '_')
        if header not in ('CONTENT_TYPE', 'CONTENT_LENGTH'):
            environ[f'HTTP_{header}'] = value
    
    # Call Flask app with WSGI interface
    response_started = []
    
    def start_response(status, response_headers):
        response_started.append((status, response_headers))
    
    response_data = b''.join(app(environ, start_response))
    status = response_started[0][0]
    status_code = int(status.split(' ')[0])
    headers = dict(response_started[0][1])
    
    return {
        'statusCode': status_code,
        'headers': headers,
        'body': response_data.decode('utf-8') if isinstance(response_data, bytes) else response_data,
        'isBase64Encoded': False
    }