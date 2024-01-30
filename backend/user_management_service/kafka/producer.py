from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers='localhost:9093',
    value_serializer=lambda v: str(v).encode('utf-8') 
)

def send_message(topic, value):
    try:
        future = producer.send(topic=topic, value=value)
        if future and future.get(timeout=5):
            print(f'Message delivered to topic : {topic}')
        else:
            print(f'Message to topic {topic} delivery report waiting')

        return True
    except Exception as e:
        print(f'Exception in sending msg = {e}')
        return False