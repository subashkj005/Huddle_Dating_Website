from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from app.models.models import Matchings, User


class UserMatchedList(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        
    id = auto_field
    name = auto_field
    
    
class ListUsers(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        
    id = auto_field
    name = auto_field
    profile_picture = auto_field
    is_active = auto_field
    