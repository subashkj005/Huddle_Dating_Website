from pydantic import BaseModel, EmailStr


class RegisterUserRequest(BaseModel):
    email: EmailStr
    password: str
    confirm_password: str


class OTPRequest(BaseModel):
    email: str
    otp: str
    
class UserLoginRequest(BaseModel):
    email: str
    password: str
