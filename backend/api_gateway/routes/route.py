from flask import Blueprint, jsonify, request
from authentication.auth import is_request_valid
from services.request_handling import create_flask_response, forward_request
from service_registry.registry import is_protected_service
from services.logger import logger

bp = Blueprint('routes', __name__)


@bp.route('/<path:path>', methods=['POST'])
def gateway(path):
    
    logger.info(f'Gateway recieved request of {request.url}')
    new_access_token = None
    
    # Getting the service name
    service_name = path.split('/')[0]
    
    # Check whether the request needs to authenticated
    if is_protected_service(service_name):
        # Validate the request
        new_access_token, result = is_request_valid(request)
        
        if not result:
            return jsonify({"message": "Unauthorized"}), 401

    response = forward_request(request, path)
    
    if not response:
        return jsonify({"message": "Server Error"}), 501
    
    # Response from the forward_request is response of 'requests' library which flask won't accept to return.
    # In order to return the response, it should be converted to a Flask response.
    new_response = create_flask_response(response)
   
    if new_access_token:
        logger.info(f"New access token added")
        new_response.set_cookie('access_token', new_access_token, httponly=True)
        
    logger.info(f"Request successfully completed")
    
    return new_response