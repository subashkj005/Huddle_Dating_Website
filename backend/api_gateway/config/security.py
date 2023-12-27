from flask import jsonify, make_response
from datetime import timedelta
import datetime
from jose import ExpiredSignatureError, JWTError, jwt
from config.settings import get_settings
from services.logger import logger
from redis_connection.controller import RedisController

settings = get_settings()
redis = RedisController()


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


def get_refresh_token_from_redis(payload):
    key = "ref_token" + str(payload['id'])
    res = redis.get_data(key)
    if res['status'] == 'success':
        logger.info(f'Refresh token with key: {key} retrieved successfully')
        return res['data']
    else:
        logger.error(f'Refresh token with key: {key} failed to retrieve')
    return None


def validate_token(access_token):
    try:
        payload = jwt.decode(access_token, settings.JWT_SECRET,
                             algorithms=settings.JWT_ALGORITHM)
        return None, payload
    except ExpiredSignatureError:
        logger.error('Access token expired')
        return get_refresh_token_from_redis(payload), payload
    except JWTError as e:
        logger.error("Error decoding token: %s", {e})
        return None, None
