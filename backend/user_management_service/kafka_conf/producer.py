import json
from kafka import KafkaProducer
from kafka.errors import KafkaError
from app.logger.config import logger

producer = KafkaProducer(
    bootstrap_servers='localhost:9093',
    key_serializer=lambda k: str(k).encode('utf-8'),
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

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