from redis import Redis
from app.config.settings import get_settings
from app.redis.credentials import REDIS_HOST, REDIS_PORT


settings = get_settings

redis_instance = Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)
