from fastapi import APIRouter, Depends, Query, Request, status
from app.config.security import oauth2_scheme
from app.models.models import Prompt, User, UserInterests, Work
from app.config.database import db_dependency
from app.response.user import UserSettingsSchema
from app.schemas.users import RecommendationRequest
from app.services.profile import get_user_details
from app.utils.crud import get_user
from app.services.users import add_test_matchList, add_to_blacklist, add_to_interested, \
                            get_recommendations, get_user_matched_list, get_user_settings, \
                                update_match_accounts_seen, update_settings, get_profile_picture


user_router = APIRouter(
    prefix='/users',
    tags=['Users'],
    responses={404: {"description": "Not found"}},
)


@user_router.post('/logout', status_code=status.HTTP_200_OK)
def user_logout(request: Request):
    request.delete_cookie("access_token")
    return {"message": "Logged out successfully"}


@user_router.get('/recommendations/{user_id}', status_code=200)
async def get_recommended_users(db: db_dependency, user_id: str, batch_number: int = 1, batch_size: int = 10):
    return get_recommendations(db=db, user_id=user_id, batch_number=batch_number, batch_size=batch_size)


@user_router.post('/update_settings/{user_id}', response_model=UserSettingsSchema)
async def update_user_search_settings(db: db_dependency, user_id: str, data: dict):
    response = update_settings(db, user_id, data)
    return response


@user_router.get('/get_settings/{user_id}')
async def get_user_search_settings(db: db_dependency, user_id: str ):
    return await get_user_settings(db, user_id)


@user_router.get('/get_user_details/{user_id}', status_code=200)
async def get_profile_user(db: db_dependency, user_id: str):
    return await get_user_details(user_id, db)


@user_router.post('/like/{user_id}', status_code=200)
async def user_like(db: db_dependency, user_id: str, data: dict):
    return await add_to_interested(db=db, user_id=user_id, liked_id=data.get('liked_id'))


@user_router.post('/dislike/{user_id}', status_code=200)
async def user_dislike(db: db_dependency, user_id: str, data: dict):
    return await add_to_blacklist(db=db, user_id=user_id, disliked_id=data.get('disliked_id'))


@user_router.get('/get_matched_list/{user_id}', status_code=200)
async def user_matched_list(db:db_dependency, user_id:str):
    return await get_user_matched_list(db=db, user_id=user_id)


@user_router.post('/update_seen', status_code=200)
async def update_seen_matches(db:db_dependency, data: dict):
    return await update_match_accounts_seen(db=db, data=data)


@user_router.get('/get_profile_picture/{user_id}', status_code=200)
async def get_user_profile_picture(db:db_dependency, user_id:str):
    return await get_profile_picture(db=db, user_id=user_id)






# test case
@user_router.post('/add_test_match')
async def add_test_match(db: db_dependency, data: dict ):
    return await add_test_matchList(db=db, data=data)
