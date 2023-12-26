import os
from functools import lru_cache
from pathlib import Path
from dotenv import load_dotenv


env_path = Path(".") / ".env"
load_dotenv(dotenv_path=env_path)


class Settings():

    # App
    APP_NAME: str = os.environ.get("APP_NAME", "APIGateway")

    # Secret Key
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "secret")
    
    # JWT
    JWT_SECRET: str = os.environ.get("JWT_SECRET")
    JWT_ALGORITHM: str = os.environ.get("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 3))
    REFRESH_TOKEN_EXPIRE_MINUTES: int = int(os.environ.get("REFRESH_TOKEN_EXPIRE_MINUTES", 1440))
    
    # Frontend application
    FRONTEND_HOST: str = os.environ.get("FRONTEND_HOST")


@lru_cache()
def get_settings() -> Settings:
    return Settings()
