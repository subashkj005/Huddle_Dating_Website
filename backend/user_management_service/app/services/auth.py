from datetime import timedelta
from fastapi import HTTPException
from app.models.models import User
from app.config.database import db_dependency
from app.config.security import create_access_token, create_refresh_token, \
    get_token_payload, verify_password
from app.config.settings import get_settings
from app.response.auth import TokenResponse

settings = get_settings()

# Fuctions:-

# Verify User Access(User)
# Get User's token(User, refresh_token=None)
# Get google login token(data, db)
# Get User login token(User)
# Get refresh token(token, db)


def _verify_user_access(user: User):
    if not user.is_active:
        raise HTTPException(
            status_code=400,
            detail="Your account is inactive, Please contact support",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def _get_user_token(user: User, refresh_token=None):
    payload = {"id": user.id}
    access_token_expiry = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(payload, access_token_expiry)

    if not refresh_token:
        refresh_token = create_refresh_token(payload)

    return TokenResponse(access_token=access_token,
                        refresh_token=refresh_token,
                         expires_in=access_token_expiry.seconds,  # In seconds
                         )


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


async def get_user_login_token(user: User):
    token_response = await _get_user_token(user)
    return token_response
    
    


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
