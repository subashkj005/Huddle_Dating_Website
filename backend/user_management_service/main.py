import uvicorn
from fastapi import FastAPI
from app.routes.users import user_router, guest_router
from app.routes.auth import auth_router
from starlette.middleware.authentication import AuthenticationMiddleware
from app.config.security import JWTAuth


app = FastAPI()

# Routes
app.include_router(guest_router) # /auth
app.include_router(auth_router) # /auth
app.include_router(user_router) # /users

# Middlewares
app.add_middleware(AuthenticationMiddleware, backend=JWTAuth())


if __name__ == "__main__":
    uvicorn.run('main:app', host='0.0.0.0', port=8000)
