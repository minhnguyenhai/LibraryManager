from flask import Blueprint

book_api = Blueprint("book_api", __name__)

from . import book_controller