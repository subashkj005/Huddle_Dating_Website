import base64
import uuid
from logger.config import logger


def save_base64_image(post_image, user_id):
    
    try:
        file_data = post_image.split(',')[1] 
    
        binary_data = base64.b64decode(file_data)
        file_extension = post_image.split(';')[0].split('/')[1]

        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        destination = f"media/posts_images/{user_id}-{unique_filename}"

        with open(destination, 'wb') as f:
            f.write(binary_data)

        return destination, None

    except Exception as e:
        logger.error(f"Error saving image: {e}")
        return None, str(e)