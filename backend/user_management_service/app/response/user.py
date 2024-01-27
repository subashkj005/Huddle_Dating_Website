from typing import List
from pydantic import BaseModel


class InterestSchema(BaseModel):
    workout: str | None
    drinks: str | None
    smoking: str | None
    dating_purpose: str | None
    zodiac_sign: str | None


class PromptsSchema(BaseModel):
    prompt: str


class ImageSchema(BaseModel):
    image: str


class UserSchema(BaseModel):
    name: str | None
    is_verified: bool | None
    height: int | None
    gender: str | None
    bio: str | None
    age: int | None
    interests: InterestSchema | None
    prompts: List[str] | None
    images: List[str] | None


class UserSettingsSchema(BaseModel):
    distance: str
    min_age: str
    max_age: str
    gender: str