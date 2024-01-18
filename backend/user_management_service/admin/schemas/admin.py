from pydantic import BaseModel


class AdminRegister(BaseModel):
    name: str
    email: str
    password: str
    confirm_password: str
    
    
class OTPRequest(BaseModel):
    email: str
    otp: str
    

class AdminLogin(BaseModel):
    email: str
    password: str