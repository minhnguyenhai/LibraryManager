from flask import request, jsonify
from . import user_api
from ...services.user.user_service import (
    list_users, is_admin, get_user_byId, update_user_info, 
    delete_user_from_db, search_users_by_query
    
)
from ...utils.decorators import JWT_required, admin_required


@user_api.route("/", methods = ["GET"])
@JWT_required
@admin_required
def get_all_users(user):
    """
    API để lấy danh sách tất cả người dùng.
    """
    try:
        users = list_users()
        return jsonify({
            "success": True,
            "message": "Successfully fetched all users.",
            "users": users
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": "Internal server error.",
            "message": str(e)
        }), 500
    
    
@user_api.route("/<id>", methods = ["GET"])
@JWT_required
def get_user(user, id):
    """
    API để lấy thông tin chi tiết của một người dùng dựa trên ID.
    """
    try:
        if not is_admin(user) and user.id != id:
            return jsonify({
                "success": False,
                "message": "You are not authorized to access this resource."
            }), 403
        
        user_need_get = get_user_byId(id)
        if not user_need_get:
            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404
            
        return jsonify({
            "success": True,
            "message": "Successfully fetched user.",
            "user": user_need_get.as_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": "Internal server error.",
            "message": str(e)
        }), 500
        
        
@user_api.route("/<id>", methods=["PUT"])
@JWT_required
def update_user(user, id):
    """
    API để cập nhật thông tin người dùng dựa trên ID.
    """
    try:
        if not is_admin(user) and user.id != id:
            return jsonify({
                "success": False,
                "message": "You are not authorized to access this resource."
            }), 403
            
        user_to_update = get_user_byId(id)
        if not user_to_update: 
            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404
            
        data = request.get_json()
        if data is None:
            raise ValueError("Invalid JSON data.")

        ALLOW_FIELDS = {"name", "dob", "gender", "address", "phone_number"}  
        unknown_fields = {field for field in data if field not in ALLOW_FIELDS}
        if unknown_fields:
            return jsonify({
                "success": False,
                "message": f"Unknown fields: {', '.join(unknown_fields)}" 
            }), 400    
             
        updated_user = update_user_info(user_to_update, data)
        return jsonify({
            "success": True,
            "message": "Successfully updated user.",
            "user": updated_user
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


@user_api.route("/<id>", methods=["DELETE"])
@JWT_required
def delete_user(user, id):
    """
    API để xóa một người dùng dựa trên ID.
    """
    try:
        if not is_admin(user) and user.id != id:
            return jsonify({
                "success": False,
                "message": "You are not authorized to access this resource."
            }), 403

        user_to_delete = get_user_byId(id)
        if not user_to_delete:
            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404
            
        delete_user_from_db(user_to_delete)
        return jsonify({
            "success": True,
            "message": "User deleted successfully."
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": "Internal server error.",
            "message": str(e)
        }), 500
        
        
@user_api.route("/search", methods=["GET"])
@JWT_required
@admin_required
def search_users(user):
    """
    API để tìm kiếm người dùng.
    """
    try:
        query = request.args.get("query", type=str, default=None)
        if not query:
            return jsonify({
                "success": False,
                "message": "Missing query parameter."
            }), 400
        
        user_search_results = search_users_by_query(query)
        return jsonify({
            "success": True,
            "message": "Search completed successfully.",
            "total": len(user_search_results),
            "users": user_search_results
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Internal server error.",
            "message": str(e)
        }), 500