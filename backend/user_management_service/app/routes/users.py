from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from starlette.responses import JSONResponse
from app.config.database import db_dependency
from app.schemas import RegisterUserRequest, OTPRequest, UserLoginRequest
from app.responses import UserResponse
from app.models import User
from app.config.security import generate_otp, get_current_user, hash_password,\
                                is_password_strong_enough, verify_password, oauth2_scheme
from app.redis.config import redis_instance
from app.fastmail.config import send_email_with_otp
from app.redis.controller import RedisController


# Routes for those invalid urls
user_router = APIRouter(
    prefix='/users',
    tags=['Guest User'],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(oauth2_scheme)]
)


guest_router = APIRouter(
    prefix='/users',
    tags=['Users'],
    responses={404: {"description": "Not found"}},
)


@guest_router.post("/signup", status_code=status.HTTP_200_OK)
async def user_signup(user: RegisterUserRequest, db: db_dependency):
    # Check if passwords match
    if user.password != user.confirm_password:
        return JSONResponse(status_code=400, content={"message": "Passwords do not match"})

    # Check if the user already exists
    user_exists = db.query(User).filter(User.email == user.email).first()
    if user_exists:
        return JSONResponse(status_code=400, content={"message": "Email is already exists"})

    # Check if the password is not strong
    if not is_password_strong_enough(user.password):
        return JSONResponse(status_code=400, content={"message": "Password is not strong enough"})

    hashed_password = hash_password(user.password)

    user_key = f"temp_user:{user.email}"

    otp = generate_otp()

    user_data = {"email": user.email, "password": hashed_password, "otp": otp}

    if redis_instance.exists(user_key):
        redis_instance.hset(user_key, mapping=user_data)
    else:
        redis_instance.hmset(user_key, mapping=user_data)

    redis_instance.expire(user_key, 200)

    await send_email_with_otp([user.email], str(otp))

    return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Email sent successfully"})


@guest_router.post("/otp_confirm")
async def otp_confimation(data: OTPRequest, db: db_dependency):
    # Key for getting user details
    user_key = f"temp_user:{data.email}"

    redis = RedisController()
    result = redis.get_hash_data(user_key)

    if result["status"] == "error":
        return JSONResponse(status_code=400, content={"message": "OTP Expired"})

    user_details = result["data"]

    if data.otp is not None:
        if user_details["otp"] == data.otp:
            user = User(email=user_details["email"],
                        password=user_details["password"])
            db.add(user)
            db.commit()
            db.refresh(user)
            return JSONResponse(status_code=status.HTTP_201_CREATED, content={"message": "User created Successfully"})
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"message": "Invalid OTP"})
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"message": "Invalid request"})


@guest_router.post('/login')
async def user_login(data: UserLoginRequest, db: db_dependency):

    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=400, detail="Email is not registered with us.")

    if not verify_password(plain_password=data.password,
                           hashed_password=user.password):
        raise HTTPException(
            status_code=400, detail="Incorrect email or password.")

    if not user.is_active:
        raise HTTPException(
            status_code=400, detail="Your account has been dactivated. Please contact support.")
        
        
@user_router.post('/me', status_code=status.HTTP_200_OK)
def get_user_detail(request: Request):
    return request.user
