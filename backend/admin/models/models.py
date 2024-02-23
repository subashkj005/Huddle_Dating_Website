import uuid
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=Base)


class Admin(Base):
    __tablename__ = 'admins'
    
    id = Column(String(36), primary_key=True, default=str(uuid.uuid4()), unique=True, nullable=False)
    name = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(100), nullable=False)
    role = Column(String(100), default='admin') 
    created_at = Column(DateTime(timezone=True), server_default=func.now())  
