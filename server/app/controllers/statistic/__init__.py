from flask import Blueprint

statistic_api = Blueprint("statistic", __name__)

from . import statistic_controller;
