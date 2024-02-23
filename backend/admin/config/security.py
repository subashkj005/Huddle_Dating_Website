import random
from flask import jsonify
from passlib.context import CryptContext
from config.token import _get_admin_token
from config.settings import get_settings

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SPECIAL_CHARECTERS = ["!", "@", "#", "$", "%", "^", "&",
                      "*", "+", "=", "_", "-", "(", ")", "?", "/", "|"]


def hash_password(password):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def is_password_strong_enough(password):
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


def get_admin_login_token(admin, role=None):

    access_token = _get_admin_token(admin)
    response = jsonify({
        "message": f"Login Successful",
        "user": {
            'id': admin.id,
            'name': admin.name if admin.name else "Admin",
            'role': admin.role,
        },
    })
    response.set_cookie(
        'access_token', access_token, httponly=True, samesite='None', secure=True, path='/')
    return response
