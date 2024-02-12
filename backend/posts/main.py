from flask import Flask
from flask_cors import CORS
from config.database import init_app
from kafka_conf.config import kafka_init_app, bus
from config.settings import get_settings
from routes.posts import post_route

settings = get_settings()


app = Flask(__name__)

# Kafka
kafka_init_app(app)

allowed_origins = [settings.FRONTEND_HOST, settings.FRONTEND_HOST_ADDRESS]

# Cors headers
cors = CORS(app, 
            resources={r"/*": {"origins": allowed_origins}},
            methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
            supports_credentials=True,
            allow_headers=['Content-Type']
            )


# Routes
app.register_blueprint(post_route, url_prefix='/posts')

# MongoDB initialize
init_app(app=app)


if __name__ == '__main__':
    bus.run()
    app.run(port=9639, debug=True,  use_reloader=True)


