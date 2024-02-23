from fastapi import APIRouter, Request
from app.config.database import db_dependency
from app.services.admin import get_userdetails_with_user_id, search_user_from_database


admin_router = APIRouter(
    prefix='/admin_access',
    tags=['Admin Access Routes'],
    responses={404: {"description": "Not found"}},
)


@admin_router.post("/search_users/{page_number}")
async def search_users(db: db_dependency, request: Request, page_number: str):
    return await search_user_from_database(db, request, page_number)


@admin_router.post('/user_details/{user_id}')
async def get_user_details(db: db_dependency, user_id: str):
    return await get_userdetails_with_user_id(db, user_id)