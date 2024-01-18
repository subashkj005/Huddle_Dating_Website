from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import JSONResponse
from app.config.database import db_dependency
from app.schemas.profile import UserProfileUpdate
from app.services.profile import update_user_profile



profile_router = APIRouter(
    prefix='/users/profile',
    tags=['Profile Route'],
    responses={404: {"description": "Not found"}},
)

@profile_router.post('update/' )
async def update_profile(request: Request, user_id: str, db:db_dependency):
    datas = await request.form()
    for key, value in datas.items():
        print(f"{key} = {value}\n")

    return await update_user_profile(user_id, request, db)
    
    
    
@profile_router.get('/checking')
async def create_profile():
    return "Authentication Working"
