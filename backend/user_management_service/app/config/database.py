from fastapi import Depends
from app.config.settings import get_settings
from sqlalchemy import create_engine
from typing import Annotated, Generator
from sqlalchemy.orm import sessionmaker, declarative_base, Session


settings = get_settings()

Base = declarative_base() 


engine = create_engine(settings.DATABASE_URI)


SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False) 


def get_session() -> Generator:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
        
db_dependency = Annotated[Session, Depends(get_session)]