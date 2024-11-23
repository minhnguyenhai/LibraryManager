from flask import Blueprint

borrowing_api = Blueprint("borrowing_api", __name__)

from . import borrowing_controller