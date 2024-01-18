from fastapi import APIRouter, Request
from app.config.database import db_dependency
from app.models.models import User


user_related_router = APIRouter(
    prefix='/admin/users',
    tags=["Admin Routes"],
)


@user_related_router.get('/', status_code=200)
def get_all_users(db: db_dependency):
    users = db.query(User).all()
    values = ['id','profile_picture', 'name', 'is_premium_user','is_active', 'created_at']
    users_data = [{key: getattr(user, key) for key in values} for user in users]
    return users_data


