from flask import request, jsonify

from . import borrowing_api
from ...services.borrowing.borrowing_service import (
    get_all_borrow_records_of_user, save_new_borrow_record, get_borrow_record_by_id,
    update_borrow_record_info, list_borrow_records
)
from ...services.user.user_service import get_user_byId
from ...services.book.book_service import get_book_by_id
from ...utils.decorators import JWT_required, admin_required


@borrowing_api.route("/borrowing")
@JWT_required
@admin_required
def get_all_borrow_records(user):
    try:
        data_results = []
        borrow_records = list_borrow_records()
        for record in borrow_records:
            user_borrowing = get_user_byId(record["user_id"])
            borrowed_book = get_book_by_id(record["book_id"])
            record.update({
                "user_name": user_borrowing.name,
                "user_email": user_borrowing.email,
                "book_title": borrowed_book.title,
            })
            data_results.append(record)
            
        return jsonify({
            "success": True,
            "message": "Successfully fetched all borrow records.",
            "borrow_records": data_results
        }), 200
    
    except Exception as e:
        return jsonify({
            "error": "Internal server error.",
            "message": str(e)
        }), 500 


@borrowing_api.route("/user/<id>/borrowing")
@JWT_required
def list_borrow_records_of_user(user, id):
    try:
        if user.role != "admin" and user.id != id:
            return jsonify({
                "success": False,
                "message": "You are not authorized to access this resource."
            }), 403

        borrow_records = get_all_borrow_records_of_user(id)
        for record in borrow_records:
            borrowed_book = get_book_by_id(record["book_id"])
            record.update({
                "book_title": borrowed_book.title,
            })
        return jsonify({
            "success": True,
            "message": "Successfully fetched all borrow records of the user.",
            "user_id": id,
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
def create_borrow_record(user):
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


@borrowing_api.route("/borrowing/<borrow_record_id>/return", methods=["PUT"])
@JWT_required
@admin_required
def update_borrow_record(user, borrow_record_id):
    try:
        borrow_record = get_borrow_record_by_id(borrow_record_id)
        if not borrow_record:
            return jsonify({
                "success": False,
                "message": "Borrow record not found"
            }), 404
            
        data = request.get_json()
        if data is None:
            raise ValueError("Invalid JSON data.")
        
        return_date = data.get("return_date")
        if not return_date:
            return jsonify({
                "success": False,
                "message": "Missing field: return_date"
            }), 400
        
        updated_borrow_record = update_borrow_record_info(borrow_record, return_date)
        return jsonify({
            "success": True,
            "message": "Successfully updated return date for borrow record.",
            "updated_borrow_record": updated_borrow_record.as_dict()
        }), 200
        
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