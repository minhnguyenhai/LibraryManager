from flask import request, jsonify

from . import borrowing_api
from ...services.borrowing.borrowing_service import (
    get_all_borrow_records_of_user
)
from ...utils.decorators import JWT_required, admin_required


@borrowing_api.route("/user/<user_id>/borrowing")
@JWT_required
def list_borrow_records_of_user(user_id):
    try:
        borrow_records = get_all_borrow_records_of_user(user_id)
        return jsonify({
            "success": True,
            "message": "Successfully fetched all borrow records of the user.",
            "user_id": user_id,
            "borrow_records": borrow_records
        }), 200
    
    except Exception as e:
        return jsonify({
            "error": "Internal server error.",
            "message": str(e)
        }), 500

