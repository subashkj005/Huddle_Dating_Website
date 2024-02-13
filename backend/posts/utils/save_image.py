import uuid
from logger.config import logger

def save_image(post_image, user_id):

    ALLOWED_EXTENSIONS = ['jpg', 'png', 'jpeg']
    MAX_IMAGE_SIZE = 5242880  # 5 MB
    error = None

    try:
        file = post_image.file
        filename = post_image.filename
        extension = filename.split(".")[-1]
        file_type = post_image.content_type.split("/")[0]

        if extension.lower() not in ALLOWED_EXTENSIONS:
            error = f"Invalid image format"
            logger.error(error)
            return None, error

        if file_type != 'image':
            error = f"Invalid file type"
            logger.error(error)
            return None, error

        if post_image.size > MAX_IMAGE_SIZE:
            error = f"Image size should be below 5MB"
            logger.error(error)
            return None, error

        unique_filename = f"{uuid.uuid4()}-{filename}"
        destination = f"media/posts_images/{user_id}-{unique_filename}"

        contents = file.read()

        with open(destination, 'wb') as buffer:
            buffer.write(contents)

        return destination, None

    except Exception as e:
        logger.error(f"Error saving image: {e}")
 
        return None, error