from fastapi.responses import JSONResponse
from app.logger.config import logger
from app.models.models import User
from app.serializers.serializer import ListUsers


async def search_user_from_database(db, request, page_number):
    try:
        data = await request.json()
        search_key = data.get('key', None)
        
        if not search_key:
            return JSONResponse(content={'error': "Invalid details"}, status_code=400)
        
        users_obj = db.query(User).filter(User.name.startswith(search_key)).all()
        users = [
            {
                "id": user.id,
                "name": user.name,
                "profile_picture": user.profile_picture if user.profile_picture else None,
                "is_active": user.is_active
            }
            for user in users_obj
        ]
        
        return JSONResponse(content={'users': users }, status_code=200)
    
    except Exception as e:
        logger.error(f"Exception at user searching : {e}")
        return JSONResponse(content={'error': "Exception at searching users "}, status_code=500)
    
    
async def get_userdetails_with_user_id(db, user_id):
    if not user_id:
        return JSONResponse(content={'error': "Invalid details"}, status_code=400)
    
    user_obj = db.query(User).filter_by(id=user_id).first()
    
    if not user_obj:
        return JSONResponse(content={'error': "User not found"}, status_code=404)
    
    user = {
        'id': user_obj.id,
        'name' : user_obj.name if user_obj.name else "User",
        'email' : user_obj.email,
        'age' : user_obj.age if user_obj.age else "Not provided",
        'profile_picture' : user_obj.profile_picture if user_obj.profile_picture else None,
        'location' : user_obj.location if user_obj.location else "Not Provided",
        'is_active' : user_obj.is_active,
        'created_at' : user_obj.created_at.strftime('%d %B %Y at %I:%M %p') or user_obj.created_at,
    }
    
    return JSONResponse(content={'user': user}, status_code=200)
    
