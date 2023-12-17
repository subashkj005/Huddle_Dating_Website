from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum
from sqlalchemy.ext.declarative import declarative_base
from geoalchemy2 import Geometry
from sqlalchemy.sql import func


Base = declarative_base()


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone_number = Column(Integer, nullable=True)
    password = Column(String(100), nullable=False)
    date_of_birth = Column(DateTime, nullable=True)
    height = Column(Integer, nullable=True) 
    weight = Column(Integer, nullable=True)
    location = Column(String(255), nullable=True)
    geolocation = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    education_level = Column(String(255), nullable=True)
    super_likes = Column(Integer, default=0)
    followers = Column(Integer, default=0)
    following = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    is_logged = Column(Boolean, default=False)
    is_premium_user = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    verified_at = Column(DateTime, nullable=True, default=None)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=True, default=None, server_default=func.now(), onupdate=func.now())
    role = Column(String(100), default='user')
    
    
    



