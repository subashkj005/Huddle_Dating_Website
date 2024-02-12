# Custom deserializing decorator
def deserialize_message(func):
    def wrapper(consumer, msg):
        deserialized_key = msg.key().decode('utf-8')
        deserialized_value = msg.value().decode('utf-8')
        return func(consumer, msg, deserialized_key, deserialized_value)
    
    return wrapper
