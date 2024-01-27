import base64
import binascii
from fastapi import APIRouter, Depends, HTTPException, Request, status
from starlette.responses import JSONResponse
from app.config.database import db_dependency
from app.fastmail.config import send_email_with_otp
from app.models.faker_data import store_fake_data
from app.schemas.schemas import RegisterUserRequest, OTPRequest, UserLoginRequest
from app.models.models import User, UserInterestSettings
from app.services.auth import get_user_login_token
from app.config.security import generate_otp, hash_password, \
    is_password_strong_enough, verify_password, oauth2_scheme
from app.redis.config import redis_instance
from app.redis.controller import RedisController
from app.models.enums import Gender, Role


guest_router = APIRouter(
    prefix='/public',
    tags=['Public'],
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

    print('=============================')
    print(f"OTP: {otp}")
    print('=============================')

    user_data = {"email": user.email, "password": hashed_password, "otp": otp}

    try:
        if redis_instance.exists(user_key):
            redis_instance.hset(user_key, mapping=user_data)
        else:
            redis_instance.hmset(user_key, mapping=user_data)

        redis_instance.expire(user_key, 240)
    except Exception as e:
        print('=============================')
        print(f"Redis Connection ERROR: {e}")
        print('=============================')
        return JSONResponse(status_code=502, content={"message": "Server Issue, services will be available soon..!"})

    # await send_email_with_otp([user.email], str(otp))

    return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Email sent successfully"})


@guest_router.post("/otp_confirm")
async def otp_confimation(data: OTPRequest, db: db_dependency):
    # Key for getting user details
    user_key = f"temp_user:{data.email}"

    print('\n data ==>', data)
    print('data.email ==>', data.email)

    redis = RedisController()
    result = redis.get_hash_data(user_key)

    print('\n result ==>', result)

    if result["status"] == "error":
        return JSONResponse(status_code=400, content={"message": "OTP Expired"})

    user_details = result["data"]

    if not user_details:
        return JSONResponse(status_code=400, content={"message": "OTP Expired"})

    if user_details["email"] != data.email or user_details["otp"] != data.otp:
        return JSONResponse(status_code=400, content={"message": "Invalid OTP"})

    if data.otp is not None:
        if user_details["otp"] == data.otp:
            user = User(email=user_details["email"],
                        password=user_details["password"])
            db.add(user)
            db.commit()

            user.settings = UserInterestSettings(user_id=user.id,
                                                 gender=Gender.FEMALE)

            db.add(user)
            db.commit()

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
            status_code=400, detail="Your account has been deactivated. Please contact support.")

    return await get_user_login_token(user, Role.USER.value)


@guest_router.get('/add_users/{count}')
def add_fake_users(db: db_dependency, count: str):
    users = store_fake_data(db, int(count))
    return users


@guest_router.post('/add_image')
async def add_image(request: Request):
    data = await request.json()
    if not data:
        return
    base64_str = data['image']
    try:
        image = base64.b64decode(base64_str, validate=True)
        file_name = 'converted_image.jpg'
        with open(file_name, "wb") as f:  # Converting to image file
            f.write(image)

        print('typeofImage ==>', type(image))
    except binascii.Error as e:
        print(f"Error while image convertion: {e}")

    try:
        destination = f"static/temp/{file_name}"

        with open(destination, 'wb') as buffer:  # Saving the image file
            buffer.write(image)
    except Exception as e:
        print(f'error while saving = {e}')

    return
