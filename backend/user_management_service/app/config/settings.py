import os
from functools import lru_cache
from sqlalchemy.engine.url import URL
from pydantic_settings import BaseSettings
from pathlib import Path
from dotenv import load_dotenv
from urllib.parse import quote_plus


env_path = Path(".") / ".env"
load_dotenv(dotenv_path=env_path)


class Settings(BaseSettings):

    # App
    APP_NAME: str = os.environ.get("APP_NAME", "UserManagementService")
    
    # Frontend 
    FRONTEND_HOST: str = os.environ.get("FRONTEND_HOST", 'http://localhost:3000')

    # MySQL
    # MYSQL_HOST: str = os.environ.get("MYSQL_HOST", 'localhost')
    MYSQL_HOST: str = os.environ.get("MYSQL_HOST", 'huddledatingproject-users-mysql-db-1')
    MYSQL_USER: str = os.environ.get("MYSQL_USER", 'root')
    MYSQL_PASS: str = os.environ.get("MYSQL_PASSWORD", 'secret')
    MYSQL_PORT: int = int(os.environ.get("MYSQL_PORT", 3306))
    MYSQL_DB: str = os.environ.get("MYSQL_DB", 'usermanagement')
    DATABASE_URI: str = f"mysql+pymysql://{MYSQL_USER}:%s@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}" % quote_plus(
        MYSQL_PASS)

    # Secret Key
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "secret")
    
    # Kafka
    KAFKA_SERVER: str = os.environ.get("KAFKA_SERVER", 'kafka')
    
    # JWT
    JWT_SECRET: str = os.environ.get("JWT_SECRET")
    JWT_ALGORITHM: str = os.environ.get("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 3))
    REFRESH_TOKEN_EXPIRE_MINUTES: int = int(os.environ.get("REFRESH_TOKEN_EXPIRE_MINUTES", 1440))

    # Email 
    EMAIL_ADDRESS: str = os.environ.get("EMAIL_ADDRESS", "email_address")
    EMAIL_PASSWORD: str = os.environ.get("EMAIL_PASSWORD", "email_password")
    
    # Services
    CHAT_SERVICE: str = os.environ.get('CHAT_SERVICE')


@lru_cache()
def get_settings() -> Settings:
    return Settings()
