import json
from kafka import KafkaProducer
from kafka.errors import KafkaError, NoBrokersAvailable
from app.logger.config import logger
from app.config.settings import get_settings

settings = get_settings()

try:
    producer = KafkaProducer(
        bootstrap_servers=settings.KAFKA_SERVER,
        key_serializer=lambda k: str(k).encode('utf-8'),
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    logger.info('===== Connected with Kafka server =====')
except NoBrokersAvailable:
    logger.error('No brokers are available to establish a connection')
except KafkaError as e:
    logger.error(f'Exception at kafka connection : {e}')


async def send_message(topic, key, value):
    try:
        future = producer.send(topic=topic, key=key, value=value)
        if future and future.get(timeout=5):
            logger.info(f'Message delivered to topic : {topic}')
        else:
            print(f'Message to topic {topic} delivery report waiting')
        return True

    except KafkaError as e:
        logger.error(f'Exception in sending Kafka Message = {e}')
        return False
