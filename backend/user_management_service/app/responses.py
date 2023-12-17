from pydantic import BaseModel, ConfigDict, EmailStr


class BaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)
    
    
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    
    

    
    
