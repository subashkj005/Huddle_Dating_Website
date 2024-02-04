from datetime import datetime, timedelta
import uuid
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, event
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.sql import func
from app.models.enums import EducationalLevel, Gender, InterestedIn
from app.models.interests_enums import *
from sqlalchemy.types import Enum


Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    id = Column(String(36), primary_key=True, default=str(
        uuid.uuid4()), unique=True, nullable=False)
    name = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone_number = Column(String(20), nullable=True)
    password = Column(String(100), nullable=False)
    age = Column(Integer, nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    height = Column(Integer, nullable=True)
    weight = Column(Integer, nullable=True)
    location = Column(String(255), nullable=True)
    gender = Column(Enum(Gender), nullable=True)
    profile_picture = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    bio = Column(Text, nullable=True)
    education_level = Column(Enum(EducationalLevel), nullable=True)
    interested_in = Column(Enum(InterestedIn), nullable=True)
    super_likes = Column(Integer, default=0)
    followers = Column(Integer, default=0)
    following = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    is_logged = Column(Boolean, default=False)
    is_premium_user = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    verified_at = Column(DateTime, nullable=True, default=None)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=True,
                        default=None, server_default=func.now(), onupdate=func.now())
    role = Column(String(100), default='user')

    # One to one relationship
    work = relationship("Work", back_populates='user',
                        uselist=False, cascade="all, delete-orphan")
    # One to Many relationship
    prompts = relationship("Prompt", back_populates='user',
                           cascade="all, delete-orphan")
    interests = relationship(
        "UserInterests", back_populates='user', uselist=False, cascade="all, delete-orphan")
    gallery = relationship(
        "UserGallery", back_populates='user', cascade="all, delete-orphan")
    settings = relationship(
        "UserInterestSettings", back_populates='user', uselist=False, cascade="all, delete-orphan")
    visits = relationship("Visit", back_populates='user', cascade="all, delete-orphan",
                          foreign_keys="[Visit.visitor_id, Visit.visited_id]",
                          primaryjoin="User.id == Visit.visitor_id")
    
    
@event.listens_for(User.date_of_birth, 'set')
def update_age(target, value, oldvalue, mapper):
    if value is not None:
# for real data 
        date_of_birth = datetime.strptime(value, "%Y-%m-%d").date()
        today = datetime.now().date()
        age = today.year - date_of_birth.year - ((today.month, today.day) < (date_of_birth.month, date_of_birth.day))
        target.age = age

# for fake data    
        # today = datetime.now().date()
        # age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        # target.age = age
        


class Prompt(Base):
    __tablename__ = 'prompts'

    id = Column(String(36), primary_key=True, default=str(
        uuid.uuid4()), unique=True, nullable=False)
    prompt = Column(String(255), nullable=True)
    user_id = Column(String(36), ForeignKey("users.id"))

    user = relationship("User", back_populates="prompts", single_parent=True)


class Work(Base):
    __tablename__ = 'work'

    id = Column(String(36), primary_key=True, default=str(
        uuid.uuid4()), unique=True, nullable=False)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)

    user_id = Column(String(36), ForeignKey('users.id'), unique=True)
    user = relationship("User", back_populates="work")


class UserInterests(Base):
    __tablename__ = 'interests'

    id = Column(String(36), primary_key=True, default=str(
        uuid.uuid4()), unique=True, nullable=False)
    workout = Column(String(30), nullable=True)
    drinks = Column(String(30), nullable=True)
    smoking = Column(String(30), nullable=True)
    dating_purpose = Column(String(30), nullable=True)
    zodiac_sign = Column(String(30), nullable=True)

    user_id = Column(String(36), ForeignKey('users.id'))
    user = relationship("User", back_populates="interests")


class UserGallery(Base):
    __tablename__ = 'user_gallery'

    id = Column(String(36), primary_key=True, default=str(
        uuid.uuid4()), unique=True, nullable=False)
    image = Column(String(255), nullable=True)

    user_id = Column(String(36), ForeignKey('users.id'))
    user = relationship("User", back_populates="gallery")
    

class UserInterestSettings(Base):
    __tablename__ = 'user_settings'
    
    id = Column(String(36), primary_key=True, default=str(
        uuid.uuid4()), unique=True, nullable=False) 
    max_age = Column(Integer, default=30)
    min_age = Column(Integer, default=18)
    distance = Column(Integer, default=10)
    gender = Column(Enum(Gender), nullable=True)
    
    user_id = Column(String(36), ForeignKey('users.id'))
    user = relationship("User", back_populates="settings", single_parent=True)
    
    
class Visit(Base):
    __tablename__ = 'visits'
    
    id = Column(String(36), primary_key=True, default=str(
        uuid.uuid4()), unique=True, nullable=False)
    visitor_id = Column(String(36), ForeignKey('users.id'), key='visitor_id')
    visited_id = Column(String(36), ForeignKey('users.id'), key='visited_id')
    visited_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates='visits', foreign_keys="[Visit.visitor_id, Visit.visited_id]",
                       primaryjoin="User.id == Visit.visitor_id")
    
    
class UserInterestedAccounts(Base):
    __tablename__ = 'interested_accounts'
    
    id = Column(String(36), primary_key=True, default=str(
        uuid.uuid4()), unique=True, nullable=False)
    liker_id = Column(String(36), ForeignKey('users.id'), key='liker_id', nullable=False)
    liked_by = Column(String(36), ForeignKey('users.id'), key='likes_id', nullable=False)
    liked_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User",
                        primaryjoin="User.id == UserInterestedAccounts.liker_id",
                        backref="interested_accounts_as_liker",
                        )

    liked_by_user = relationship("User",
                                 primaryjoin="User.id == UserInterestedAccounts.liked_by",
                                 backref="interested_accounts_as_liked_by",
                                 )
    
    
class BlacklistUsers(Base):
    __tablename__ = 'blacklists'
    
    id = Column(String(36), primary_key=True, default=str(
        uuid.uuid4()), unique=True, nullable=False)
    user_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    disliked_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    
    user = relationship("User",
                        foreign_keys="[BlacklistUsers.user_id, BlacklistUsers.disliked_id]", 
                        primaryjoin="User.id == BlacklistUsers.user_id",
                        backref='blacklists')
    
    
class Matchings(Base):
    __tablename__ = 'matchings'
    
    id = Column(String(36), primary_key=True, default=str(
        uuid.uuid4()), unique=True, nullable=False)
    user_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    matched_user_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    is_seen = Column(Boolean, default=False)
    expired = Column(Boolean, default=False)
    expiry = Column(DateTime, default=lambda: datetime.now() + timedelta(days=2))
    
    
    user = relationship("User",
                        primaryjoin="User.id == Matchings.user_id",
                        backref='matchings') 
    
    matched_user = relationship("User",
                        primaryjoin="User.id == Matchings.matched_user_id",
                        backref='matched_accounts')
    
    @hybrid_property
    def is_expired(self):
        return datetime.now() >= self.expiry
    
  
 
 
 