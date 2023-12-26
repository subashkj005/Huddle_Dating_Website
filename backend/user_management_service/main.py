import uvicorn
from fastapi import FastAPI
from app.routes.users import user_router, guest_router
from app.routes.auth import auth_router
from app.routes.profile import profile_router
from starlette.middleware.authentication import AuthenticationMiddleware
from app.config.security import JWTAuth
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(guest_router) # /auth
app.include_router(auth_router) # /auth
app.include_router(user_router) # /users
app.include_router(profile_router) # /users/profile

# Middlewares
app.add_middleware(AuthenticationMiddleware, backend=JWTAuth())


if __name__ == "__main__":
    uvicorn.run('main:app', host='0.0.0.0', port=7614)
