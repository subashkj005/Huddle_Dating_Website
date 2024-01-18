from sqlalchemy import update
from app.models.models import Prompt, User, UserGallery, UserInterests, Work
from datetime import datetime


async def strp_date(date):
    return date.strftime('%Y-%m-%d')
    

async def get_user(user_id: str, db):
    return db.query(User).filter(User.id == user_id).first()


async def get_user_data(user_id, db):
    user_obj = await get_user(user_id, db)
    user = {
        'name': user_obj.name ,
        'phone_number': user_obj.phone_number,
        'date_of_birth':  await strp_date(user_obj.date_of_birth) if user_obj.date_of_birth else None,
        'gender': user_obj.gender,
        'height': user_obj.height,
        'weight': user_obj.weight,
        'location': user_obj.location,
        'interested_in': user_obj.interested_in,
        'education_level': user_obj.education_level,
        'bio': user_obj.bio,
        'profile_picture': user_obj.profile_picture
    }
    return user


async def get_user_prompts(user_id, db):
    prompt_obj = db.query(Prompt).filter_by(user_id=user_id).all()
    prompts = [{'prompt': x.prompt} for x in prompt_obj]
    return prompts


async def get_user_work_details(user_id, db):
    work_obj = db.query(Work).filter_by(user_id=user_id).first()
    if work_obj:
        work = {
            'title': work_obj.title if work_obj.title else None,
            'company': work_obj.company if work_obj.company else None
        }
    else:
        work = {
            'title': None,
            'company': None
        }

    return work


async def get_user_interests(user_id, db):
    interests_objs = db.query(UserInterests).filter_by(user_id=user_id).all()
    user_interests = {}
    for interests_obj in interests_objs:
        for interest in interests_obj.__dict__:
            if not interest.startswith("_"):
                user_interests[interest] = getattr(interests_obj, interest)
    return user_interests


async def get_user_gallery_images(user_id, db):
    gallery_objects = db.query(UserGallery).filter_by(user_id=user_id).all()
    user_gallery = [{"id": gallery_object.id, 'image': gallery_object.image} for gallery_object in gallery_objects]
    return user_gallery
