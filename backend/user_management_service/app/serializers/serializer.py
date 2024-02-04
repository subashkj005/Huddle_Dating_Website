from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from app.models.models import Matchings, User


class UserMatchedList(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        
    id = auto_field
    name = auto_field