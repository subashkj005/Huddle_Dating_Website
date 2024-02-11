from flask import Flask
import eventlet
from eventlet import wsgi
from flask_cors import CORS
from socket_config.events import sio
from config.database import init_app
from config.settings import get_settings
from routes.chat import chat_route
from flask_mongoengine2 import MongoEngine


settings = get_settings()

db = MongoEngine()
app = Flask(__name__)

# Initializing database connection
init_app(app)

# Secret key
app.config['SECRET_KEY'] = settings.SECRET_KEY

allowed_origins = [
    settings.FRONTEND_HOST_ADDRESS,
    settings.FRONTEND_HOST,
    settings.CHAT_SERVICE
]

# Cors headers
cors = CORS(app,
            resources={
                r"/*": {"origins": allowed_origins}},
            methods=['GET', 'POST', 'PUT', 'PATCH',
                     'DELETE', 'OPTIONS', 'HEAD'],
            supports_credentials=True,
            allow_headers=['Content-Type']
            )

# Routes
app.register_blueprint(chat_route, url_prefix='/chat')

sio.init_app(app=app)


if __name__ == '__main__':
    wsgi.server(eventlet.listen(('0.0.0.0', 5236)), app)
