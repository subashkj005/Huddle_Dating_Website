import os
from fastapi.staticfiles import StaticFiles
import uvicorn
import socketio
from fastapi import FastAPI
from app.routes.public import guest_router
from app.routes.users import user_router
from admin.routes.admin import admin_router
from admin.routes.users import user_related_router
from app.routes.auth import auth_router
from app.routes.profile import profile_router
from app.routes.admin import admin_router
from starlette.middleware.authentication import AuthenticationMiddleware
from app.config.security import JWTAuth
from fastapi.middleware.cors import CORSMiddleware
from socket_config.socket import socket_app


app = FastAPI()



origins = [
    "http://localhost",
    "http://34.165.86.84:5001",
    "http://localhost:3000", "https://huddle-frontend-nu.vercel.app"
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
app.include_router(admin_router) # /admin_access

# Admin
app.include_router(admin_router) # /admin
app.include_router(user_related_router) # /user_related_route

# Middlewares
app.add_middleware(AuthenticationMiddleware, backend=JWTAuth())

# Static files
app.mount("/static", StaticFiles(directory='static'), name='static')

# socketio
app.mount("/", socket_app)

if __name__ == "__main__":
    uvicorn.run('main:app', host='0.0.0.0', port=7614, reload=True)