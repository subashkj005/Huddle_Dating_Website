import json
from kafka_conf.topics import UPDATE_USER
from services.posts import create_or_update_user
from logger.config import logger


def update_user_at_post_service(consumer, msg):
    try:  
        data = json.loads(msg.value().decode('utf-8'))
        
        response = create_or_update_user(data)

        if response.status_code == 200:
            logger.info(
                f"Updated user in post service using kafka")
            consumer.commit(offset=message.offset())
        else:
            message = response.data.decode("utf-8")
            logger.error(
                f"Error while updating user through kafka : {message}-{response.status_code} ")

    except Exception as e:
        print(f"Error consuming messages: {e}")
