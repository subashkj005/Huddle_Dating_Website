from fastapi import APIRouter, Depends, Request, status
from app.config.security import oauth2_scheme
from app.models.models import Prompt, User, UserInterests, Work
from app.config.database import db_dependency
from app.services.profile import get_user_details
from app.services.users import get_not_visited_users, update_settings
from app.utils.crud import get_user


user_router = APIRouter(
    prefix='/users',
    tags=['Users'],
    responses={404: {"description": "Not found"}},
)


@user_router.post('/logout', status_code=status.HTTP_200_OK)
def user_logout(request: Request):
    request.delete_cookie("access_token")
    return {"message": "Logged out successfully"}

@user_router.get('/not_visited_users', status_code=200)
async def get_users_for_display(db: db_dependency):

    accounts = get_not_visited_users(db=db)
    return accounts


@user_router.post('/update_settings/{user_id}')
async def update_user_search_settings(db: db_dependency, user_id: str, data: dict):
    response = update_settings(db, user_id, data)
    return response


@user_router.get('/{user_id}', status_code=200)
async def get_profile_user(db: db_dependency, user_id: str):
    return await get_user_details(user_id, db)