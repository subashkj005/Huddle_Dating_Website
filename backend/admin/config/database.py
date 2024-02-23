from config.settings import get_settings
from models.models import db

settings = get_settings()


def init_app(app):
    app.config["SQLALCHEMY_DATABASE_URI"] = settings.DATABASE_URI
    db.init_app(app)

    with app.app_context():
        try:
            db.create_all()
            print('<=========== Admin Database Connected<===========')
        except Exception as e:
            print(
                f"<=========== ERROR: At Connecting or creating table : {e} ===========>")
