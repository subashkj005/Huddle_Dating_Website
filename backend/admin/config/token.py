from datetime import datetime, timedelta
from jose import jwt, JWTError
from config.settings import get_settings
from redis_conf.controller import RedisController
from logger.config import logger


settings = get_settings()
redis = RedisController()

def create_access_token(data, expiry:timedelta):
    payload = data.copy()
    expire_in = datetime.utcnow() + expiry
    payload.update({"exp": expire_in})
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def create_refresh_token(data, expiry:timedelta):
    payload = data.copy()
    expire_in = datetime.utcnow() + expiry
    payload.update({"exp": expire_in})
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def set_refresh_token(token, payload):
    key = "ref_token" + str(payload['id'])
    res = redis.set_data(key=key, value=token)
    if res['status'] == 'success':
        logger.info(f'Refresh token with key: {key} set successfully')
    else:
        logger.error(f'Refresh token with key: {key} failed to set')
    return

def _get_admin_token(admin, refresh_token=None, role=None):
    payload = {"id": admin.id, "role": role}
    access_token_expiry = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(payload, access_token_expiry)

    if not refresh_token:
        refresh_token_expiry = timedelta(
        minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
        refresh_token = create_refresh_token(payload, refresh_token_expiry)
        set_refresh_token(refresh_token, payload)

    return access_token