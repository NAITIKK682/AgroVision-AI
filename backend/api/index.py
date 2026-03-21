from app import app

def handler(request):
    """
    Vercel serverless function handler for Flask app.
    Handles incoming requests by delegating to the Flask WSGI app.
    """
    from werkzeug.test import Client

    # Create a test client for the Flask app
    client = Client(app, response_wrapper=None)

    # Forward the request to Flask
    response = client.open(
        path=request.path,
        method=request.method,
        data=request.body,
        headers=dict(request.headers),
        query_string=request.query_string
    )

    # Return Vercel-compatible response
    return {
        'statusCode': response.status_code,
        'headers': dict(response.headers),
        'body': response.data.decode('utf-8') if isinstance(response.data, bytes) else response.data
    }