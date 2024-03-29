import asyncio
from datetime import datetime, timedelta
import requests
import uuid
from app.config.settings import get_settings
from fastapi import BackgroundTasks
from fastapi.responses import JSONResponse, StreamingResponse
from app.models.models import BlacklistUsers, Matchings, User, UserInterestSettings, UserInterestedAccounts, Visit
from app.response.user import ImageSchema, InterestSchema, PromptsSchema, UserSchema, UserSettingsSchema
from app.serializers.serializer import UserMatchedList
from app.utils.crud import get_user, get_user_data, get_user_interests, get_user_prompts
from app.logger.config import logger
from sqlalchemy import desc, not_, or_, update, and_
from sqlalchemy.exc import SQLAlchemyError
from socket_config.crud import connections
from socket_config.socket import match_found

settings = get_settings()


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
        user_id=user.id,
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

    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        return JSONResponse(content={'message': "No User Found"})
    if not user.settings:
        return JSONResponse(content={'message': "User has no settings"})
    # accounts = db.query(User).filter(~db.query(Visit).filter(Visit.visitor_id==user_id).exists(), User.age>=user.visits.min_age or User.age<=user.visits.max_age, User.gender==user.visits.gender).all()

    subquery = db.query(Visit.visited_id).filter(Visit.visitor_id == user_id)
    
    accounts = (db.query(User)
                .join(User.settings)
                .filter(
                    User.name != None,
                    User.age != None,
                    User.age >= user.settings.min_age,
                    User.age <= user.settings.max_age,
                    User.gender == user.settings.gender,
                    User.id != user_id,
                    ~User.visits.any(and_(Visit.visitor_id == user_id, Visit.visited_id == User.id))
                )
                .order_by(desc(User.created_at))
                .offset(offset).limit(batch_size).all()
    )
    
    logger.error(f'===== Length of Accounts fetched : {len(accounts)} ======')

    # accounts = db.query(User).filter(not_(User.id == user_id)
    #                                  ).order_by(desc(User.created_at)).offset(offset).limit(batch_size).all()

    return serialize_users(accounts)


async def add_to_visited(db, visitor_id, visited_id):
    try:
        existing_visit = db.query(Visit).filter_by(
            visitor_id=visitor_id, visited_id=visited_id).first()

        if existing_visit:
            print(f"Already visited")
            return

        new_visit = Visit(id=str(uuid.uuid4()),
                          visitor_id=visitor_id, visited_id=visited_id)
        db.add(new_visit)
        db.commit()

        print('Successfully added visit')
        return

    except Exception as e:
        logger.error(f"Exception at adding visit: {e}")
        return JSONResponse(content={'error': f"Exception at adding visit: {e}"}, status_code=400)


async def send_match_notification(liked):
    print('sending notification ......')
    liker = liked.user
    liked_user = liked.liked_by_user

    data_for_liker = {
        "name": liked_user.name if liked_user.name else None,
        "age": liked_user.age if liked_user.age else None,
        "profile_picture": liked_user.profile_picture if liked_user.profile_picture else None
    }

    data_for_liked_user = {
        "name": liker.name if liker.name else None,
        "age": liker.age if liker.age else None,
        "profile_picture": liker.profile_picture if liker.profile_picture else None
    }

    print('connections before sending notification => ', connections)
    await match_found(user_id=liker.id, match=data_for_liker)
    await match_found(user_id=liked_user.id, match=data_for_liked_user)

    return


async def create_chat_room( liker_id, liked_id):
    data = {
        'user1': liker_id,
        'user2': liked_id
    }
    response = requests.post(f'{settings.CHAT_SERVICE}/create_room', json=data, headers={'Content-Type': 'application/json'})
    content = response.content.decode('utf-8')
    
    if response.status_code == 200:
        logger.info('Created chat room successfully')
    else:
        logger.error(f'Chatroom creation failed : {content}')
    return
    


async def has_liked_back(db, liker_id, liked_id):
    try:
        liked = db.query(UserInterestedAccounts).filter_by(
            liker_id=liked_id, liked_by=liker_id).first()

        if not liked:
            return False

        new_match = Matchings(id=str(uuid.uuid4()),
                              user_id=liker_id, matched_user_id=liked_id)
        db.add(new_match)
        db.commit()

        asyncio.create_task(send_match_notification(liked=liked))
        asyncio.create_task(create_chat_room(liker_id, liked_id))
        return True

    except Exception as e:
        logger.error(f"Exception at match checking: {e}")


async def add_to_interested(db, user_id, liked_id):
    try:
        liker_user = await get_user(user_id=user_id, db=db)
        if not liker_user:
            return JSONResponse(content={'error': "Invalid entry"}, status_code=400)

        liked_user = await get_user(user_id=liked_id, db=db)
        if not liked_user:
            return JSONResponse(content={'error': "Invalid like entry"}, status_code=400)

        existing_interest = db.query(UserInterestedAccounts).filter_by(
            liker_id=user_id, liked_by=liked_id).first()

        if existing_interest:
            return JSONResponse(content={'message': "Already liked"}, status_code=200)

        new_interest = UserInterestedAccounts(
            id=str(uuid.uuid4()), liker_id=user_id, liked_by=liked_id)
        db.add(new_interest)
        db.commit()

        match_check = asyncio.create_task(has_liked_back(
            db=db, liker_id=user_id, liked_id=liked_id))
        print('match_check = ', match_check)

        task = asyncio.create_task(add_to_visited(
            db=db, visitor_id=user_id, visited_id=liked_id))
        print("Background task created:", task)

        return JSONResponse(content={'message': "Successfully liked"}, status_code=200)

    except Exception as e:
        logger.error(f"Exception: {e}")
        return JSONResponse(content={'error': f"Exception when adding like : {e}"}, status_code=400)

# test case


async def add_test_matchList(db, data):
    try:
        liker_id = data.get('liker_id', None)
        liked_id = data.get('liked_id', None)

        new_match = Matchings(id=str(uuid.uuid4()),
                              user_id=liker_id, matched_user_id=liked_id)
        db.add(new_match)
        db.commit()
        return JSONResponse({'message': 'success'}, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse({'message': 'success'}, status_code=400)


async def add_to_blacklist(db, user_id, disliked_id):
    try:
        disliker_user = await get_user(user_id=user_id, db=db)

        if not disliker_user:
            return JSONResponse(content={'error': "Invalid entry"}, status_code=400)

        disliked_user = await get_user(user_id=disliked_id, db=db)
        if not disliked_user:
            return JSONResponse(content={'error': "Invalid dislike entry"}, status_code=400)

        existing_dislike = db.query(BlacklistUsers).filter_by(
            user_id=user_id, disliked_id=disliked_id).first()

        if existing_dislike:
            return JSONResponse(content={'message': "Already disliked"}, status_code=200)

        new_dislike = BlacklistUsers(
            id=str(uuid.uuid4()), user_id=user_id, disliked_id=disliked_id)
        db.add(new_dislike)
        db.commit()

        add_to_visited(db=db, visitor_id=user_id, visited_id=disliked_id)

        return JSONResponse(content={'message': "Successfully disliked"}, status_code=200)

    except Exception as e:
        logger.error(f"Exception when adding dislike : {e}")
        return JSONResponse(content={'error': f"Exception: {e}"}, status_code=500)


async def get_user_matched_list(db, user_id, is_seen=False):
    # Query which filter the matches of the user as from both user and matched_user sides
    try:
        bi_side_matches = db.query(Matchings).filter(
            or_(
                Matchings.user_id == user_id,
                Matchings.matched_user_id == user_id
            ),
            Matchings.expired == False
        ).all()
        logger.info(f"Length of bi side matches == {len(bi_side_matches)}")
    except SQLAlchemyError as e:
        print(f"Exception at filtering matches : {e}")
        return JSONResponse(content={'error': e}, status_code=500)

    partner_accounts = []

    try:
        # Finding the accounts of partners
        for match in bi_side_matches:
            if user_id == match.user_id:
                partner = match.matched_user
            else:
                partner = match.user

            obj = {
                'id': match.id,
                'name': partner.name if partner.name else None,
                'profile_picture': partner.profile_picture if partner.profile_picture else None,
                'age': partner.age if partner.age else None,
                'is_seen':match.is_seen,
                'expires_at': match.expiry,
                'chatroom_name': match.chatroom_name
            }
            partner_accounts.append(obj)
    except Exception as e:
        print(f"Exception at creating matches  : {e}")
        return JSONResponse(content={'error': e}, status_code=500)

    return partner_accounts


async def update_match_accounts_seen(db, data):
    match_ids = data.get('match_ids', None)
    if not match_ids:
        return JSONResponse(content={'error': "Invalid data"}, status_code=400)

    try:
        update_query = update(Matchings).where(Matchings.id.in_(match_ids)).values(is_seen=True)

        db.execute(update_query)
        db.commit()
        return JSONResponse(content={'message': 'Updated match seen..'}, status_code=200)
    
    except SQLAlchemyError as e:
        logger.error(f"Exception at updating match seen : ", {e})
        return JSONResponse(content={'error': e}, status_code=500)
    
    
async def get_profile_picture(db, user_id):
    if not user_id:
        return JSONResponse(content={'error': "Invalid details"}, status_code=400)
    
    user = db.query(User).filter_by(id=user_id).first()    
    if not user:
        return JSONResponse(content={'error': "User doesn't exists"}, status_code=404)
    
    return {'userImage': user.profile_picture, 'name': user.name}
    