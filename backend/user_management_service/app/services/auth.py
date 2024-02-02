from datetime import timedelta
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from app.models.models import User
from app.config.database import db_dependency
from app.config.security import create_access_token, create_refresh_token, \
    get_token_payload, verify_password
from app.config.settings import get_settings
from app.redis.controller import RedisController
from app.logger.config import logger
from app.response.auth import TokenResponse

settings = get_settings()
redis = RedisController()

# Fuctions:-

# Verify User Access(User)
# Get User's token(User, refresh_token=None)
# Get google login token(data, db)
# Get User login token(User)
# Get refresh token(token, db)


def set_refresh_token(token, payload):
    key = "ref_token" + str(payload['id'])
    res = redis.set_data(key=key, value=token)
    if res['status'] == 'success':
        logger.info(f'Refresh token with key: {key} set successfully')
    else:
        logger.error(f'Refresh token with key: {key} failed to set')
    return


def _verify_user_access(user: User):
    if not user.is_active:
        raise HTTPException(
            status_code=400,
            detail="Your account is inactive, Please contact support",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def _get_user_token(user: User, refresh_token=None, role=None):
    payload = {"id": user.id, "role": role}
    access_token_expiry = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(payload, access_token_expiry)

    if not refresh_token:
        refresh_token_expiry = timedelta(
        minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
        refresh_token = create_refresh_token(payload, refresh_token_expiry)
        set_refresh_token(refresh_token, payload)

    return access_token


async def get_google_login_token(data, db: db_dependency):

    user = db.query(User).filter(User.email == data.username).first()

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Email is not registered",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=400,
            detail="Invalid Login Credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    _verify_user_access(user=user)

    return await _get_user_token(user=user)


async def get_user_login_token(user, role=None):

    access_token = await _get_user_token(user)
    response = JSONResponse(
        content={
            "message": f"Login Successful",
            "user": {
                'id': user.id,
                'name': user.name if user.name else "User",
                'role': user.role,
                'status': user.is_active if user.role == 'user' else ""
            },
        },
        status_code=200)
    response.set_cookie(
        'access_token', access_token, httponly=True, samesite='None', secure=True, path='/')
    return response


async def get_refresh_token(token, db):

    payload = get_token_payload(token=token)
    user_id = payload.get('id', None)

    if not user_id:
        raise HTTPException(
            status_code=400,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Email is not registered",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return await _get_user_token(user=user, refresh_token=token)
