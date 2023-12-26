from fastapi import APIRouter, Depends, Request
from app.config.database import db_dependency


profile_router = APIRouter(
    prefix='/users/profile',
    tags=['Profile Route'],
    responses={404: {"description": "Not found"}},
)

@profile_router.post('update/')
async def create_profile(request: Request, db:db_dependency):
    data = request.json()