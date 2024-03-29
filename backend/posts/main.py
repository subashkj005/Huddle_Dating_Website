from flask import Flask
from flask_cors import CORS
from config.database import init_app
from kafka_conf.config import kafka_init_app, bus
from config.settings import get_settings
from routes.posts import post_route
from routes.admin import adminpost_route

settings = get_settings()


app = Flask(__name__, static_folder='media')

# Secret key
app.config['SECRET_KEY'] = settings.SECRET_KEY

# Kafka
kafka_init_app(app)

allowed_origins = [settings.FRONTEND_HOST, settings.FRONTEND_HOST_ADDRESS]

# Cors headers
cors = CORS(app, 
            resources={r"/*": {"origins": "*"}},
            methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
            supports_credentials=True,
            allow_headers=['Content-Type']
            )


# Routes
app.register_blueprint(post_route, url_prefix='/posts')
app.register_blueprint(adminpost_route, url_prefix='/admin_post')

# MongoDB initialize
init_app(app=app)


if __name__ == '__main__':
    bus.run()
    app.run(host='0.0.0.0', port=9639, debug=True, use_reloader=True)


