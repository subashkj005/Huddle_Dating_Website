from flask import Blueprint, request
from services.admin_services import authenticate_admin, confirm_otp, register_new_admin


auth_route = Blueprint('auth_route', __name__)


@auth_route.post('/register')
def admin_signup():
    data = request.get_json()
    return register_new_admin(data)

@auth_route.post('/otp_confirm')
def otp_confirmation():
    data = request.get_json()
    return confirm_otp(data)

@auth_route.post('/admin_login')
def admin_login():
    return authenticate_admin(request)

