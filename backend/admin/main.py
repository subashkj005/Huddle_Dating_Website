from flask import Flask, Blueprint                                 
from flask_cors import CORS
from config.settings import get_settings
from config.database import init_app
from config.mail import mail_init_app
from routes.auth_routes import auth_route
from routes.admin_route import admin_route

settings = get_settings()

app = Flask(__name__, static_folder='media')

init_app(app)
mail_init_app(app)


allowed_origins = [settings.FRONTEND_HOST, settings.FRONTEND_HOST_ADDRESS]

# Cors headers
cors = CORS(app, 
            resources={r"/*": {"origins": "*"}},
            methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
            supports_credentials=True,
            allow_headers=['Content-Type']
            )

# Routes
app.register_blueprint(auth_route, url_prefix='/admin_auth')
app.register_blueprint(admin_route, url_prefix='/admin')


if __name__ == '__main__':
    app.run(port=8931, debug=True,  use_reloader=True)