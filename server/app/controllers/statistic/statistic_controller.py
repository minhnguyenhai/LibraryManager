from flask import jsonify
from . import statistic_api
from ...services.statistic.statistic_service import(
    get_book_statistic, get_user_statistic
)

@statistic_api.route('/user-statistics', methods=['GET'])
def user_statistics():
    """Endpoint to get total user count and new users this month"""
    try:
        stats = get_user_statistic()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@statistic_api.route('/book-statistics', methods=['GET'])
def book_statistics():
    """Endpoint to get total book count and new books added this month"""
    try:
        stats = get_book_statistic()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500