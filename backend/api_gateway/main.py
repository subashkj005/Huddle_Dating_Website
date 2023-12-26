from flask import Flask
import logging
from routes.route import bp as routes_bp
from flask_cors import CORS


app = Flask(__name__)

# Cors headers
cors = CORS(app, 
            resources={r"/*": {"origins": "http://localhost:3000"}},
            methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'])


# Routes
app.register_blueprint(routes_bp)


@app.route('/', methods=['POST'])
def status():
    return "Working"


# logger
logger = logging.getLogger(__name__)


if __name__ == '__main__':
    app.run(port=5001, debug=True)


# Assuming you have defined the 'settings' object
