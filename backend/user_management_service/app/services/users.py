from fastapi.responses import JSONResponse
from app.models.models import User, UserInterestSettings, Visit
from app.response.user import ImageSchema, InterestSchema, PromptsSchema, UserSchema, UserSettingsSchema
from app.utils.crud import get_user, get_user_data, get_user_interests, get_user_prompts
from app.logger.config import logger


def update_settings(db, user_id, data):

    user = db.query(User).filter_by(id=user_id).first()

    if not user:
        return JSONResponse(content={'message': "User not found"}, status_code=400)

    try:
        user_settings = user.settings
        if not user_settings:
            user.settings = UserInterestSettings(user_id=user_id)
            user_settings = user.settings
            db.add(user)

        user_settings.min_age = data.get('min_age', 18)
        user_settings.max_age = data.get('max_age', 60)
        user_settings.gender = data.get('gender', "Female")
        user_settings.distance = data.get('distance', 10)

        db.commit()

    except Exception as e:
        logger.error(
            f"Error while updating user settings =>\n userId: {user_id}, \n {e}")
        return JSONResponse(content={'error': f'userId: {user_id}, {str(e)}'}, status_code=500)

    return JSONResponse(content={'message': "Settings Updated"}, status_code=200)


async def get_user_settings(db, user_id):
    
    user = await get_user(db=db, user_id=user_id)
    settings = UserSettingsSchema(
        max_age=str(user.settings.max_age),
        min_age=str(user.settings.min_age),
        distance=str(user.settings.distance),
        gender=user.settings.gender.value
    ).model_dump()
    
    return settings


def serialize_user(user):
    return UserSchema(
        name=user.name,
        is_verified=user.is_verified,
        height=user.height,
        gender=user.gender,
        bio=user.bio,
        age=user.age,
        interests=InterestSchema(
            workout=user.interests.workout if user.interests else None,
            drinks=user.interests.drinks if user.interests else None,
            smoking=user.interests.smoking if user.interests else None,
            dating_purpose=user.interests.dating_purpose if user.interests else None,
            zodiac_sign=user.interests.zodiac_sign if user.interests else None
        ),
        prompts=[prompt.prompt
                 for prompt in user.prompts],
        images=[gallery.image for gallery in user.gallery]
    ).model_dump()


def serialize_users(users):
    return [serialize_user(user) for user in users]


def get_recommendations(db, user_id='0d92defe-575e-4d2a-aed6-db53fcebbeaa', batch_number=1, batch_size=10):

    offset = (batch_number - 1) * batch_size
    
    print('batch_number', batch_number)
    print("offset", offset)
    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        return JSONResponse(content={'message': "No User Found"})
    if not user.settings:
        return JSONResponse(content={'message': "User has no settings"})
    # accounts = db.query(User).filter(~db.query(Visit).filter(Visit.visitor_id==user_id).exists(), User.age>=user.visits.min_age or User.age<=user.visits.max_age, User.gender==user.visits.gender).all()

    # accounts = (db.query(User)
    #             .join(User.settings)
    #             .filter(
    #                 ~db.query(Visit)
    #                 .filter(Visit.visitor_id == user_id).exists(),
    #                 User.age >= user.settings.min_age,
    #                 User.age <= user.settings.max_age,
    #                 User.gender == user.settings.gender
    #             )
    #             .offset(offset).limit(batch_size).all()
    # )
    
    accounts = db.query(User).offset(offset).limit(batch_size).all()

    return serialize_users(accounts)

