from flask import Flask
from flask_cors import CORS
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

# Cors headers
cors = CORS(app,
            resources={
                r"/*": {"origins": [settings.FRONTEND_HOST_ADDRESS, settings.FRONTEND_HOST]}},
            methods=['GET', 'POST', 'PUT', 'PATCH',
                     'DELETE', 'OPTIONS', 'HEAD'],
            supports_credentials=True,
            allow_headers=['Content-Type']
            )

# Routes
app.register_blueprint(chat_route)


if __name__ == '__main__':
    app.run(port=5236, debug=True,  use_reloader=True)
