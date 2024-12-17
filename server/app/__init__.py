from flask import Flask
from flasgger import Swagger
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail
from sqlalchemy.orm import DeclarativeBase
from celery import Celery

from config import Config
from .errors import handle_exception


swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "🏢 Library Manager API 📖",
        "description": "API documentation for the Library Manager system.\nMade with 🧡 by Group 34 - IT4409 - HUST",
        "version": "1.0.0"
    },
    "host": "librarymanager-aict.onrender.com",  
    "schemes": ["https"],
    "tags": [
        {
            "name": "User - Auth",
            "description": "Endpoints for user authentication, login, register, forgot password, token manager, etc."
        },
        {
            "name": "User",
            "description": "Endpoints for managing user profiles."
        },
        {
            "name": "Book",
            "description": "Endpoints for managing books in the system."
        },
        {
            "name": "Book - Favorite",
            "description": "Endpoints for managing favorite books of users."
        },
        {
            "name": "Borrowing",
            "description": "Endpoints for managing borrowing records in the system."
        },
        {
            "name": "Statistic",
            "description": "Endpoints for getting statistics of the system."
        }
    ]
}


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)
migrate = Migrate()
mail = Mail()
celery = Celery(__name__, broker=Config.CELERY_BROKER_URL)


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    swagger = Swagger(app, template=swagger_template)
    CORS(app, resources={r"/*": {
        "origins": "*", 
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        "allow_headers": "*",
        "expose_headers": "*"
    }})
    
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    
    celery.conf.update(app.config)
    
    from .models import user, token, book, borrow_record, favorite
    
    from .controllers.user import user_api
    app.register_blueprint(user_api, url_prefix="/user")
    
    from .controllers.book import book_api
    app.register_blueprint(book_api)
    
    from .controllers.borrowing import borrowing_api
    app.register_blueprint(borrowing_api)
    
    from.controllers.statistic import statistic_api
    app.register_blueprint(statistic_api, url_prefix="/statistic")
    
    app.register_error_handler(Exception, handle_exception)
    
    return app