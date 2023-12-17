from fastapi import APIRouter, Depends, Header, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from app.config.database import db_dependency
from app.services.auth import get_refresh_token, get_token
from app.response.auth import TokenResponse


auth_router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
    responses={404: {"description":"Not found"}},
)

@auth_router.post("/token", status_code=status.HTTP_200_OK, response_model=TokenResponse)
async def authenticate_user(db: db_dependency,data: OAuth2PasswordRequestForm = Depends()):
    return await get_token(data=data, db=db)


@auth_router.post("/refresh", status_code=status.HTTP_200_OK)
async def refresh_access_token(db: db_dependency, refresh_token: str = Header()):
    return await get_refresh_token(token=refresh_token, db=db)




