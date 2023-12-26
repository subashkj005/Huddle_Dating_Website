from flask import jsonify, make_response
from datetime import timedelta
import datetime
from jose import ExpiredSignatureError, JWTError, jwt
from config.settings import get_settings
from services.logger import logger

settings = get_settings()


def create_new_access_token(refresh_token):
    try:
        payload = jwt.decode(refresh_token, settings.JWT_SECRET,
                             algorithms=settings.JWT_ALGORITHM)
        new_access_token = create_access_token(payload)
        return new_access_token, payload
    except ExpiredSignatureError:
        logger.error("Refresh token expired")
        return None, None
    except JWTError as e:
        logger.error("Error creating new access token: %s", {e})
        return None, None


def create_access_token(data):
    payload = data.copy()
    expiry = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    expire_in = datetime.utcnow() + expiry
    payload.update({"exp": expire_in})
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def validate_token(access_token, refresh_token):
    try:
        payload = jwt.decode(access_token, settings.JWT_SECRET,
                             algorithms=settings.JWT_ALGORITHM)
        return None, payload
    except ExpiredSignatureError:
        logger.error('Access token expired')
        return create_new_access_token(refresh_token)
    except JWTError as e:
        logger.error("Error decoding token: %s", {e})
        return None, None
