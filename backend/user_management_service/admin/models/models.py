import uuid
from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func


Base = declarative_base()


class Admin(Base):
    __tablename__ = 'admins'
    id = Column(String(36), primary_key=True, default=str(uuid.uuid4()), unique=True, nullable=False)
    name = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(100), nullable=False)
    role = Column(String(100), default='admin') 
    created_at = Column(DateTime(timezone=True), server_default=func.now())  