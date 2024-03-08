from flask import Blueprint, jsonify, request
from authentication.auth import is_request_valid
from services.request_handling import create_flask_response, forward_request
from service_registry.registry import is_protected_service
from services.logger import logger

bp = Blueprint('routes', __name__)


@bp.route('/health', methods=['GET'])
def server_health_check():
    return "Working", 200


@bp.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'])
def gateway(path):
    
    if request.method == 'OPTIONS':
        return '', 204
    
    logger.info(f'Gateway recieved request for <{request.url}>')
    new_access_token = None
    
    # Getting the service name
    service_name = path.split('/')[0]
    
    # Check whether the request needs to authenticated
    if is_protected_service(service_name):
        logger.info('Protected service request')
        # Validate the request
        new_access_token, result = is_request_valid(request)
        if result:
            logger.info("Request Verified")
        if new_access_token:
            logger.info('New access token created')
        
        if not result:
            return jsonify({"message": "Unauthorized"}), 401

    response = forward_request(request, path)
    
    if response is None:
        logger.error('No response from the service')
        return jsonify({"message": "Server Error"}), 500
    
    # Response from the forward_request is response of 'requests' library which flask won't accept to return.
    # In order to return the response, it should be converted to a Flask response.
    new_response = create_flask_response(response) 
   
    if new_access_token:
        logger.info(f"New access token added")
        new_response.set_cookie('access_token', new_access_token, httponly=True, samesite='None', secure=True, path='/')
        
    logger.info(f"Request successfully returned to source")
    
    return new_response