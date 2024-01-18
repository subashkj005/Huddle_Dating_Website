from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from admin.schemas.admin import AdminLogin, AdminRegister, OTPRequest
from app.config.database import db_dependency
from app.config.security import generate_otp, hash_password,\
                                is_password_strong_enough, verify_password
from admin.models.models import Admin
from app.fastmail.config import send_email_with_otp
from app.redis.config import redis_instance
from admin.models.models import Admin
from app.redis.controller import RedisController
from app.services.auth import get_user_login_token
from admin.models.enums import Role


admin_router = APIRouter(
    prefix='/admin_auth',
    tags=["Admin Auth"],
)

@admin_router.post('/signup', status_code=200)
async def admin_signup(admin: AdminRegister, db: db_dependency):
        # Check if passwords match
    if admin.password != admin.confirm_password:
        return JSONResponse(status_code=400, content={"message": "Passwords do not match"})

    # Check if the admin already exists
    user_exists = db.query(Admin).filter(Admin.email == admin.email).first()
    if user_exists:
        return JSONResponse(status_code=400, content={"message": "Email is already exists"})

    # Check if the password is not strong
    if not is_password_strong_enough(admin.password):
        return JSONResponse(status_code=400, content={"message": "Password is not strong enough"})

    hashed_password = hash_password(admin.password)

    admin_key = f"admin_temp_user:{admin.email}"

    otp = generate_otp()
    
    print('=============================')
    print(f"Admin OTP: {otp}")
    print('=============================')

    user_data = {"name": admin.name,
                 "email": admin.email, 
                 "password": hashed_password, 
                 "otp": otp
                 }

    try:
        if redis_instance.exists(admin_key):
            redis_instance.hset(admin_key, mapping=user_data)
        else:
            redis_instance.hmset(admin_key, mapping=user_data)

        redis_instance.expire(admin_key, 240)
    except Exception as e:
        print('=============================')
        print(f"Redis Connection ERROR: {e}")
        print('=============================')
        return JSONResponse(status_code=502, content={"message": "Server Issue, services will be available soon..!"})

    # await send_email_with_otp([admin.email], str(otp))

    return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Email sent successfully"})


@admin_router.post("/otp_confirm")
async def otp_confimation(data: OTPRequest, db: db_dependency):
    # Key for getting user details
    admin_key = f"admin_temp_user:{data.email}"

    redis = RedisController()
    result = redis.get_hash_data(admin_key)

    if result["status"] == "error":
        return JSONResponse(status_code=400, content={"message": "OTP Expired"})

    admin_details = result["data"]
    
    if not admin_details:
        return JSONResponse(status_code=400, content={"message": "OTP Expired"})

    if admin_details["email"] != data.email or admin_details["otp"] != data.otp:
        return JSONResponse(status_code=400, content={"message": "Invalid OTP"})
    
    if data.otp:
        if admin_details["otp"] == data.otp:
            admin = Admin(name=admin_details["name"],
                         email=admin_details["email"],
                         password=admin_details["password"]
                         )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            return JSONResponse(status_code=status.HTTP_201_CREATED, content={"message": "Admin created Successfully"})
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"message": "Invalid OTP"})
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"message": "Invalid request"})


@admin_router.post('/login')
async def admin_login(data: AdminLogin, db: db_dependency):

    admin = db.query(Admin).filter(Admin.email == data.email).first()
    if not admin:
        raise HTTPException(
            status_code=400, detail="Email is not registered with us.")

    if not verify_password(plain_password=data.password,
                           hashed_password=admin.password):
        raise HTTPException(
            status_code=400, detail="Incorrect email or password.")

    return await get_user_login_token(admin, Role.ADMIN.value)