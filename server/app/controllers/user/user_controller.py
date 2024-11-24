from flask import request, jsonify
from . import user_api
from ...services.user.user_service import(
    list_users, get_user_byId, update_user_byId, delete_user_byId

)
from ...utils.decorators import JWT_required, admin_required


@user_api.route("/", methods = ["GET"])
@JWT_required
@admin_required
def get_all_users():
    """
    API để lấy danh sách tất cả người dùng.
    """
    try:
    
        users = list_users()
        return jsonify({
            "success": True,
            "message": "Successfully fetched all users.",
            "users": [user.as_dict() for user in users]
        }), 200
    except Exception as e:
        return jsonify({
            "error": "Internal server error.",
            "message": str(e)
        }), 500
    
@user_api.route("<user_id>", methods = ["GET "])
@JWT_required
@admin_required
def get_user(user_id):
    """
    API để lấy thông tin chi tiết của một người dùng dựa trên ID.
    """
    try:
        # Gọi hàm get_user_byId từ service
        user = get_user_byId(user_id)
        if not user:
            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404
        return jsonify({
            "success": True,
            "message": "Successfully fetched user.",
            "user": user.as_dict()
        }), 200
    except Exception as e:
        return jsonify({
            "error": "Internal server error.",
            "message": str(e)
        }), 500
        
        
@user_api.route("/<user_id>", methods=["PUT"])
@JWT_required
@admin_required
def update_user(user_id):
    """
    API để cập nhật thông tin người dùng dựa trên ID.
    """
    try:
        
        data = request.get_json()
        if data is None:
            raise ValueError("Invalid JSON data.")

      
        updated_user = update_user_byId(user_id, data)
        if not updated_user:
            return jsonify({
                "success": False,
                "message": "User not found or no data updated."
            }), 404
        return jsonify({
            "success": True,
            "message": "Successfully updated user.",
            "user": updated_user.as_dict()
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

@user_api.route("/<user_id>", methods=["DELETE"])
@JWT_required
@admin_required
def delete_user(user_id):
    """
    API để xóa một người dùng dựa trên ID.
    """
    try:
        
        deleted = delete_user_byId(user_id)
        if not deleted:
            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404
        return jsonify({
            "success": True,
            "message": "User deleted successfully."
        }), 200
    except Exception as e:
        return jsonify({
            "error": "Internal server error.",
            "message": str(e)
        }), 500