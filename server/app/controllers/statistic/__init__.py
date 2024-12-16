from flask import Blueprint

statistic_api = Blueprint("statistic_api", __name__)

from . import statistic_controller