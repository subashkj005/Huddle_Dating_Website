from fastapi.responses import JSONResponse
from app.models.models import User, UserInterestSettings, Visit
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

        user_settings.min_age = data.get('age_min', 18)
        user_settings.max_age = data.get('age_max', 60)
        user_settings.gender = data.get('gender', "Female")
        user_settings.distance = data.get('distance', 10)
        
        db.commit()
        
    except Exception as e:
        logger.error(f"Error while updating user settings =>\n userId: {user_id}, \n {e}")
        return JSONResponse(content={'error': f'userId: {user_id}, {str(e)}'}, status_code=500)
    
    return JSONResponse(content={'message': "Settings Updated"},status_code=200)


def get_not_visited_users(db, user_id='0d92defe-575e-4d2a-aed6-db53fcebbeaa', batch_number=1, batch_size=10):
    
    offset = (batch_number - 1) * batch_size
    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        return JSONResponse(content={'message':"No User Found"})
    if not user.settings:
        return JSONResponse(content={'message':"User has no settings"})
    # accounts = db.query(User).filter(~db.query(Visit).filter(Visit.visitor_id==user_id).exists(), User.age>=user.visits.min_age or User.age<=user.visits.max_age, User.gender==user.visits.gender).all()
    
    accounts = (db.query(User)\
                .join(User.settings)\
                .filter(
                    ~db.query(Visit)\
                    .filter(Visit.visitor_id == user_id).exists(),
                    User.age >= user.settings.min_age,
                    User.age <= user.settings.max_age,
                    User.gender == user.settings.gender
                )\
                .all()
            )
    
    print('length ==>',len(accounts))
    
    
    
    return