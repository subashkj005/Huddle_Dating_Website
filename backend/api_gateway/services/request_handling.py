import requests
from flask import Response
from service_registry.registry import get_service_url
from services.logger import logger


def construct_url(path):
    service_name = path.split('/')[0]
    # return get_service_url(service_name) + path.split('/', 1)[1]
    return get_service_url(service_name) + path


def forward_request(request, path):
    # Extract information from the original request

    method = request.method
    headers = request.headers or {}
    data = request.data or b''
    params = request.args or {}
    files = request.files or {}

    # Construct the new URL on the second server
    url = construct_url(path)

    # Forward the request to the second server
    try:
        response = requests.request(
            method=method, url=url, headers=headers, data=data, params=params, files=files)
        
        if response.status_code == 200:
            logger.info(f"Forwarded request to {url} with status code: {response.status_code}")
        else:
            logger.error(f"Forward request: {url} FAILED.. with status code: {response.status_code}")
            

        # Return the response from the second server to the original client
        return response
    except requests.RequestException as e:
        # Handle the case where the second request fails
        logger.error(f"Request forwarding to {url} failed: {e}")
        return None
    
    
def create_flask_response(res):
    content = res.content
    status_code = res.status_code
    headers = dict(res.headers)
    
    logger.info(f"API Response headers {headers}")
    
    # Create a Flask response
    flask_response = Response(content, status=status_code, headers=headers)

    return flask_response
