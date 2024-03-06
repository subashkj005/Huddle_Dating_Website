from flask_kafka import FlaskKafka
from logger.config import logger
from kafka_conf.consumer import update_user_at_post_service
from kafka_conf.topics import UPDATE_USER
from config.settings import get_settings

settings = get_settings()

bus = FlaskKafka()

def kafka_init_app(app):
    try:
        app.config["KAFKA_CONFIG"] = {
            'bootstrap.servers': settings.KAFKA_SERVER, 
            'group.id': settings.KAFKA_GROUP_ID,
            'enable.auto.commit': 'true',
            'auto.offset.reset': 'earliest'
        }
        bus.init_app(app)
        

        @bus.handle(UPDATE_USER)
        def update_user(consumer, msg):
            update_user_at_post_service(consumer, msg)
            
        logger.info("<===== Connected to Kafka Server =====>")
            
    except Exception as e:
        logger.error(f"Exception at connecting with kafka server : {e}")
    

