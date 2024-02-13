import asyncio
import json
import uuid
from fastapi.responses import JSONResponse
from sqlalchemy import not_
from app.models.models import Prompt, User, UserGallery, UserInterests, Work
from app.utils.crud import get_user, get_user_data, get_user_gallery_images, get_user_interests, get_user_prompts, get_user_work_details
from app.logger.config import logger
from kafka_conf.producer import send_message
from kafka_conf.topics import UPDATE_USER


async def update_other_services(user_id, data, profile_image_destination ):
    user_data = {}
    user_data['user_id'] = user_id

    if 'name' in data and data['name']:
            user_data.update({'name': data['name']})

    if profile_image_destination:
            user_data.update({'profile_picture': profile_image_destination})
            
    await send_message(topic=UPDATE_USER, key='user_data', value=user_data)
    print('Send message to Kafka for updating user')


async def get_user_details(user_id, db):

    user = await get_user_data(user_id, db)
    prompts = await get_user_prompts(user_id, db)
    works = await get_user_work_details(user_id, db)
    interests = await get_user_interests(user_id, db)
    gallery = await get_user_gallery_images(user_id, db)

    return {
        "user": user,
        "prompts": prompts,
        "works": works,
        "interests": interests,
        "gallery": gallery
    }


async def save_image(profile_pic, user_id, name=None):

    ALLOWED_EXTENSIONS = ['jpg', 'png', 'jpeg']
    MAX_IMAGE_SIZE = 5242880  # 5 MB
    error = None

    try:
        file = profile_pic.file
        filename = profile_pic.filename
        extension = filename.split(".")[-1]
        file_type = profile_pic.content_type.split("/")[0]

        if name == 'Profile Picture':
            dir_name = 'profile_pictures'
        else:
            dir_name = 'user_gallery'

        if extension.lower() not in ALLOWED_EXTENSIONS:
            error = f"Invalid image format for {name}"
            logger.error(error)
            return None, error

        if file_type != 'image':
            error = f"Invalid file type for {name}"
            logger.error(error)
            return None, error

        if profile_pic.size > MAX_IMAGE_SIZE:
            error = f"{name} Image size should be below 5MB"
            logger.error(error)
            return None, error

        unique_filename = f"{uuid.uuid4()}.{extension}"
        destination = f"static/{dir_name}/{user_id}-{unique_filename}"

        contents = file.read()

        with open(destination, 'wb') as buffer:
            buffer.write(contents)

        return destination, None

    except Exception as e:
        logger.error(f"Error saving {name}: {e}")
        error = f"{name}: Error saving image"
        print('\nfile :', profile_pic)
        print('\nType of file :', type(profile_pic))
        print('\nContents :', dir(profile_pic))
        return None, error


async def update_user_profile(user_id, request, db):
    print('1\n')

    profile_pic_error = ""
    gallery_image_error = ""
    error = ""
    global profile_image_destination
    profile_image_destination = ""

    data = await request.form()
    user = await get_user(user_id, db)
    print('2\n')
    if not user:
        return JSONResponse(content={'message': "Invalid User"}, status_code=400)
    print('3\n')
    # Update fields
    if 'name' in data:
        user.name = data.get('name', user.name)
    if 'phone_number' in data:
        user.phone_number = data.get('phone_number', user.phone_number)
    if 'date_of_birth' in data:
        user.date_of_birth = data.get('date_of_birth', user.date_of_birth)
    if 'gender' in data:
        user.gender = data.get('gender', user.gender)
    if 'height' in data:
        user.height = int(data.get('height', user.height))
    if 'weight' in data:
        user.weight = int(data.get('weight', user.weight))
    if 'interested_in' in data:
        user.interested_in = data.get('interested_in', user.interested_in)
    if 'education_level' in data:
        user.education_level = data.get(
            'education_level', user.education_level)
    if 'bio' in data:
        user.bio = data.get('bio', user.bio)
    if 'location' in data:
        user.location = data.get('location', user.location)
    print('4\n')

    # Update Work instance
    if 'works' in data:
        print('5\n')
        works = json.loads(data['works'])

        # If user doesn't have a work instance
        if not user.work:
            print('6\n')
            user.work = Work()

        user.work.title = works[0]['title']
        user.work.company = works[0]['company']
    print('7\n')
    # Update prompts
    if 'prompts' in data:
        print('8\n')
        prompts = json.loads(data['prompts'])

        # Max 3 prompts
        if len(prompts) <= 3:
            print('9\n')
            user_prompts = db.query(Prompt).filter_by(user_id=user_id).delete()
            for prompt_data in prompts:
                user.prompts.append(
                    Prompt(id=str(uuid.uuid4()), prompt=prompt_data['prompt']))
    print('10\n')
    # Update UserInterests
    if 'workout' in data or 'drinks' in data or 'smoking' in data or 'dating_purpose' in data or 'zodiac_sign' in data:
        print('11\n')
        user_interests = user.interests
        if not user_interests:
            print('12\n')
            user_new_interests = UserInterests(user_id=user.id)
            user_interests = user_new_interests

        print('13\n')
        if 'workout' in data:
            user_interests.workout = data.get('workout')
        if 'drinks' in data:
            user_interests.drinks = data.get('drinks')
        if 'smoking' in data:
            user_interests.smoking = data.get('smoking')
        if 'dating_purpose' in data:
            user_interests.dating_purpose = data.get('dating_purpose')
        if 'zodiac_sign' in data:
            user_interests.zodiac_sign = data.get('zodiac_sign')
        print('14\n')
        # for interest in user_interests:
        db.add(user_interests)
        print('15\n')
    # Update profile picture
    if data['profile_picture'] is not None:
        print('16\n')
        profile_picture = data['profile_picture']
        if type(profile_picture) != str:
            destination, error = await save_image(profile_picture, user_id, name='profile Picture')
            if destination:
                profile_image_destination = destination
                user.profile_picture = destination
            profile_pic_error = error
            print('17\n')

    # Update UserGallery instances
    # Retrieving image id from the name of the image obj
    images = [{"id": key.split('-', 1)[1], "image": value}
              for key, value in data.items() if key.startswith('img')]
    print('18\n')
    if images:
        print('19\n')
        for image in images:
            # If its string means image already saved
            if type(image['image']) == str:
                continue

            destination, error = await save_image(image['image'], user_id, name='gallery Image')
            # If the image is not saved, skip that image and goes to next one
            if not destination:
                continue

            image_exists = db.query(UserGallery).filter_by(
                id=image['id']).first()
            if image_exists:
                image_exists.image = destination
            else:
                user.gallery.append(UserGallery(
                    id=image['id'], image=destination))

            gallery_image_error = error
    print('20\n')
    # Commit the changes
    db.commit()
    db.refresh(user)
    print('21\n')

    # Update in other services
    asyncio.create_task(update_other_services(user_id, data, profile_image_destination))

    if profile_pic_error or gallery_image_error:
        return JSONResponse(content={"message": "Updated user profile successfully",
                                     "profile_pic_error": profile_pic_error,
                                     "gallery_image_error": gallery_image_error}, status_code=200)

    return JSONResponse(content={"message": "Updated user profile successfully"}, status_code=200)
