import base64
from datetime import datetime, timedelta
import logging
import random
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from starlette.authentication import AuthCredentials, UnauthenticatedUser
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config.settings import get_settings
from app.config.database import db_dependency
from app.models.models import User

SPECIAL_CHARECTERS = ["!","@","#","$","%","^","&","*","+","=","_","-","(",")","?","/","|"]

settings = get_settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


def get_current_user(token: str = Depends(oauth2_scheme), db=None):
    payload = get_token_payload(token)
    if not payload or type(payload) is not dict:
        return None
    
    user_id = payload.get('id', None)
    if not user_id:
        return None
    
    if not db:
        db = db_dependency
        
    user = db.query(User).filter(User.id==user_id).first()
    return user


class JWTAuth:
    """
    Retrieve the current authenticated user by authenticating the
    function as the Fastapi get the requests.
    """ 
    async def authenticate(self, connection):
        guest = AuthCredentials(['unauthenticated']), UnauthenticatedUser()
        
        if 'authorization' not in connection.headers:
            return guest

        token = connection.headers.get('authorization').split(' ')[1] #Bearer Token
        if not token:
            return guest
        
        user = get_current_user(token=token)
        
        if not user:
            return guest
        
        return AuthCredentials('authenticated'), user
            
            



def hash_password(password):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def is_password_strong_enough(password: str) -> bool:
    if len(password) < 8:
        return False
    if not any(char.isupper() for char in password):
        return False
    if not any(char.islower() for char in password):
        return False
    if not any(char.isdigit() for char in password):
        return False
    if not any(char in SPECIAL_CHARECTERS for char in password):
        return False

    return True


def generate_otp(length=4):
  digits = [str(i) for i in range(10)]
  random.shuffle(digits)
  return "".join(digits[:length])


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


def get_token_payload(token):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=settings.JWT_ALGORITHM)
    except JWTError:
        return None
    return payload























































# def str_encode(string: str) -> str:
#     return base64.b85encode(string.encode('ascii')).decode('ascii')


# def str_decode(string: str) -> str:
#     return base64.b85decode(string.encode('ascii')).decode('ascii')


# def get_token_payload(token: str, secret: str, algo: str):
#     try:
#         payload = jwt.decode(token, secret, algorithms=algo)
#     except Exception as jwt_exec:
#         logging.debug(f"JWT Error: {str(jwt_exec)}")
#         payload = None
#     return payload


# def generate_token(payload: dict, secret: str, algo: str, expiry: timedelta):
#     expire = datetime.utcnow() + expiry
#     payload.update({"exp": expire})
#     return jwt.encode(payload, secret, algorithm=algo)


# async def get_token_user(token: str, db: db_dependency):
#     payload = get_token_payload(token, settings.JWT_SECRET, settings.JWT_ALGORITHM)
#     if payload:
#         token_email = str_decode(payload.get('email'))
#         user = db.query(User).filter(User.email == token_email).first()
#         if user and user.id == int(payload.get('user_id')):
#             return user
#     return None
        
        
# async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_session)):
#     user = await get_token_user(token=token, db=db)
#     if user:
#         return user
#     raise HTTPException(status_code=401, detail="Not authorised.")
