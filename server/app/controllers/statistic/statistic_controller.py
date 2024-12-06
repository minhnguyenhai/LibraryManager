from flask import jsonify
from . import statistic_api
from ...services.statistic.statistic_service import get_user_statistics  # Import dịch vụ thống kê người dùng

@statistic_api.route('/user-statistics', methods=['GET'])
def user_statistics():
    """Endpoint to get total user count and new users this month"""
    try:
        stats = get_user_statistics()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
