from flask_mongoengine2 import MongoEngine
from config.settings import get_settings
from mongoengine import get_connection

settings = get_settings()
db = MongoEngine()

def init_app(app):
    settings = get_settings()
    app.config["MONGODB_SETTINGS"] = [
        {
            "db": settings.DATABASE_NAME,
            "host": settings.DATABASE_HOST,
            "port": settings.DATABASE_PORT,
            "alias": "default",
        }
    ]
    db.init_app(app)
    
    try:
        connection = get_connection()
        connection.database.command("ping")  
        print("<------------------ Post Service Connected to MongoDB! ------------------> ")
    except Exception as e:
        print("Connection error with MongoDB :", e)