from flask import request, jsonify

from . import borrowing_api
from ...services.borrowing.borrowing_service import (
    get_all_borrow_records_of_user, save_new_borrow_record
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
        
        
@borrowing_api.route("/borrowing", methods=["POST"])
@JWT_required
@admin_required
def create_borrow_record():
    try:
        data = request.get_json()
        if data is None:
            raise ValueError("Invalid JSON data.")
        
        REQUIRED_FIELDS = {"user_id", "book_id", "quantity", "borrow_date", "due_date"}
        missing_fields = {field for field in REQUIRED_FIELDS if data.get(field) is None}
        
        if missing_fields:
            return jsonify({
                "error": "Missing required fields.",
                "message": f"Missing fields: {missing_fields}"
            }), 400
            
        new_borrow_record = save_new_borrow_record(data["user_id"], data["book_id"], data["quantity"], data["borrow_date"], data["due_date"])
        return jsonify({
            "success": True,
            "message": "Successfully saved new borrow record.",
            "borrow_record": new_borrow_record.as_dict()
        }), 201
        
    except ValueError as e:
        return jsonify({
            "error": "Invalid data.",
            "message": str(e)
        }), 400
    
    except Exception as e:
        return jsonify({
            "error": "Internal server error.",
            "message": str(e)
        }), 500

