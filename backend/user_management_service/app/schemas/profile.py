from datetime import date
from typing import Any, List
from fastapi import Form, UploadFile
from pydantic import BaseModel
from app.models.enums import EducationalLevel, Gender, InterestedIn
from app.models.interests_enums import DatingPurpose, Drinks, Smoking, Workout, ZodiacSign


def form_body(cls):
    cls.__signature__ = cls.__signature__.replace(
        parameters=[
            arg.replace(default=Form(...))
            for arg in cls.__signature__.parameters.values()
        ]
    )
    return cls 

 
class Work(BaseModel):
    title: str
    company: str


class Prompt(BaseModel):
    id: int
    prompt: str


@form_body
class UserProfileUpdate(BaseModel):
    name: str = None
    phone_number: int = None
    date_of_birth: date = None
    gender: Gender = None
    height: int = None
    weight: int = None
    location: str = None
    interested_in: InterestedIn = None
    education_level: EducationalLevel = None
    bio: str = None
    profile_picture: UploadFile = None
    prompts: List[Prompt] = None
    images: List[Any] = None
    works: List[Work] = []
    workout: Workout = None
    drinks: Drinks = None
    smoking: Smoking = None
    dating_purpose: DatingPurpose = None
    zodiac_sign: ZodiacSign = None
