from flask import jsonify
from config.security import validate_token


def is_request_valid(req):
    access_token = req.cookies.get('access_token', None)
    refresh_token = req.cookies.get('refresh_token', None)

    # No access token
    if not access_token or not refresh_token:
        return None, False

    # Verify the token
    new_access_token, payload = validate_token(access_token, refresh_token)

    if not new_access_token and not payload:
        return None, False
    
    if new_access_token:
        return new_access_token, True

    return None, True
