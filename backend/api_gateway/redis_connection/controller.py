from redis_connection.config import redis_instance 

class RedisController:
    def __init__(self):
        self.redis = redis_instance
        
    def set_data(self, key, value):
        """
        Store data in Redis.
        """
        try:
            self.redis.set(key, value)
            return {"status": "success", "message": f"Data set successfully for key: {key}"}
        except Exception as e:
            return {"status": "error", "message": f"Error setting data for key {key}: {str(e)}"}

    def get_data(self, key):
        """
        Retrieve data from Redis using the key.
        """
        try:
            result = self.redis.get(key)
            if result is None:
                raise KeyError(f"Key '{key}' not found in Redis.")
            return {"status": "success", "data": result}
        except Exception as e:
            return {"status": "error", "message": f"Error getting data for key {key}: {str(e)}"}
        
    def get_hash_data(self, key):
        """
        Retrieve hashes data from Redis using the key.
        """
        try:
            self.redis.decode_responses = True
            result = self.redis.hgetall(key)
                 
            if result is None:
                raise KeyError(f"Key '{key}' not found in Redis.")
            
            # Decoding redis binary state data to dictionary
            decoded_result = {key.decode('utf-8'): value.decode('utf-8') for key, value in result.items()}
            return {"status": "success", "data": decoded_result}
        
        except Exception as e:
            return {"status": "error", "message": f"Error getting data for key {key}: {str(e)}"}

    def update_data(self, key, new_value):
        """
        Update data in Redis for a given key.
        """
        try:
            if self.redis.exists(key):
                self.redis.set(key, new_value)
                return {"status": "success", "message": f"Data updated successfully for key: {key}"}
            else:
                raise KeyError(f"Key '{key}' not found in Redis.")
        except Exception as e:
            return {"status": "error", "message": f"Error updating data for key {key}: {str(e)}"}
