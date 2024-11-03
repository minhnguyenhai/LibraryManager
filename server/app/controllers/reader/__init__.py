from flask import Blueprint

reader_api = Blueprint("reader_api", __name__)

from ..reader import auth_controller