from flask_kafka import FlaskKafka
from logger.config import logger
from kafka_conf.consumer import update_user_at_post_service
from kafka_conf.topics import UPDATE_USER


bus = FlaskKafka()

def kafka_init_app(app):
    try:
        app.config["KAFKA_CONFIG"] = {
            'bootstrap.servers': 'localhost:9093', 
            'group.id': 'POSTSERVICE',
            'enable.auto.commit': 'true',
            'auto.offset.reset': 'earliest'
        }
        bus.init_app(app)
        

        @bus.handle(UPDATE_USER)
        def update_user(consumer, msg):
            update_user_at_post_service(consumer, msg)
            
    except Exception as e:
        logger.error(f"Exception at connecting with kafka server : {e}")
    

