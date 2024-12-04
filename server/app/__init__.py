from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail
from sqlalchemy.orm import DeclarativeBase
from celery import Celery

from config import Config


class Base(DeclarativeBase):
    pass


cors = CORS()
db = SQLAlchemy(model_class=Base)
migrate = Migrate()
mail = Mail()
celery = Celery(__name__, broker=Config.CELERY_BROKER_URL)


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    cors.init_app(app, resources={r"/*": {"origins": app.config["CORS_ALLOWED_ORIGINS"]}})
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    
    celery.conf.update(app.config)
    
    from .controllers.user import user_api
    app.register_blueprint(user_api, url_prefix="/user")
    
    from .controllers.book import book_api
    app.register_blueprint(book_api, url_prefix="/book")
    
    from .controllers.borrowing import borrowing_api
    app.register_blueprint(borrowing_api)
    
    return app