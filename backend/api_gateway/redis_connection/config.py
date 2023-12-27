from redis import Redis
from redis_connection.credentials import REDIS_HOST, REDIS_PORT



redis_instance = Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)
