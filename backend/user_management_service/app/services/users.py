from app.models.models import User
from app.utils.crud import get_user, get_user_data, get_user_interests, get_user_prompts


async def get_user_for_listing(db):
    user = await get_user('86a1ca6d-9015-428b-88bf-6a4719b4d251', db)
    return user
    # if not user:
    #     return {'message' : "invalid user"}
    # print(user, 'user ===================')
    # user_data = await get_user_data(user.id, db)
    # user_prompts = await get_user_prompts(user.id, db)
    # user_interests = await get_user_interests(user.id, db)
    
    # return [user_data, user_prompts, user_interests] 
        