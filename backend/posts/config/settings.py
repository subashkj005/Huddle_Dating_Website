import os
from functools import lru_cache
from pathlib import Path
from dotenv import load_dotenv
from urllib.parse import quote_plus

env_path = Path(".") / ".env"
load_dotenv(dotenv_path=env_path)


class Settings():

    APP_NAME: str = os.environ.get("APP_NAME", "PostsService")
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "secret")
    FRONTEND_HOST: str = os.environ.get("FRONTEND_HOST")
    FRONTEND_HOST_ADDRESS: str = os.environ.get("FRONTEND_HOST_ADDRESS")
    
    DATABASE_NAME: str = os.environ.get("DATABASE_NAME", "posts")
    DATABASE_HOST: str = os.environ.get("DATABASE_HOST", "00000")
    DATABASE_PORT: int = int(os.environ.get("DATABASE_PORT", "port"))
    
    KAFKA_SERVER: str = os.environ.get("KAFKA_SERVER", 'kafka')
    KAFKA_GROUP_ID: str = os.environ.get("KAFKA_GROUP_ID", 'group_id')



@lru_cache()
def get_settings() -> Settings:
    return Settings()
