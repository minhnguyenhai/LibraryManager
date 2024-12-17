from flask import request, jsonify
from flasgger.utils import swag_from

from . import user_api
from ...services.user.user_service import UserService
from ...utils.decorators import JWT_required, admin_required


@user_api.route("/", methods = ["GET"])
@JWT_required
@admin_required
@swag_from("../../apidocs/user/get_all_users.yaml", endpoint="user_api.get_all_users", methods=["GET"])
def get_all_users(user):
    user_service = UserService()
    users = user_service.list_users()
    return jsonify({
        "success": True,
        "message": "Successfully fetched all users.",
        "users": users
    }), 200
    
    
@user_api.route("/<id>", methods = ["GET"])
@JWT_required
@swag_from("../../apidocs/user/get_user.yaml", endpoint="user_api.get_user", methods=["GET"])
def get_user(user, id):
    user_service = UserService()
    if not user_service.is_admin(user) and user.id != id:
        return jsonify({
            "success": False,
            "message": "You are not authorized to access this resource."
        }), 403
    
    user_need_get = user_service.get_user_byId(id)
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
        
        
@user_api.route("/<id>", methods=["PUT"])
@JWT_required
@swag_from("../../apidocs/user/update_user.yaml", endpoint="user_api.update_user", methods=["PUT"])
def update_user(user, id):
    user_service = UserService()
    if not user_service.is_admin(user) and user.id != id:
        return jsonify({
            "success": False,
            "message": "You are not authorized to access this resource."
        }), 403

    user_to_update = user_service.get_user_byId(id)
    if not user_to_update: 
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    if user_service.is_admin(user_to_update):
        return jsonify({
            "success": False,
            "message": "Can not update admin user."
        }), 403
        
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "message": "Invalid JSON data."
        }), 400

    ALLOW_FIELDS = {"name", "dob", "gender", "address", "phone_number"}  
    unknown_fields = {field for field in data if field not in ALLOW_FIELDS}
    if unknown_fields:
        return jsonify({
            "success": False,
            "message": f"Unknown fields: {', '.join(unknown_fields)}" 
        }), 400    
            
    updated_user = user_service.update_user_info(user_to_update, data)
    return jsonify({
        "success": True,
        "message": "Successfully updated user.",
        "user": updated_user
    }), 200


@user_api.route("/<id>", methods=["DELETE"])
@JWT_required
@swag_from("../../apidocs/user/delete_user.yaml", endpoint="user_api.delete_user", methods=["DELETE"])
def delete_user(user, id):
    user_service = UserService()
    if not user_service.is_admin(user) and user.id != id:
        return jsonify({
            "success": False,
            "message": "You are not authorized to access this resource."
        }), 403

    user_to_delete = user_service.get_user_byId(id)
    if not user_to_delete:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404
        
    if user_service.is_admin(user_to_delete):
        return jsonify({
            "success": False,
            "message": "Can not delete admin user."
        }), 403
        
    is_deleted = user_service.delete_user_from_db(user_to_delete)
    if not is_deleted:
        return jsonify({
            "success": False,
            "message": "User has borrowing records, can not be deleted."
        }), 409

    return jsonify({
        "success": True,
        "message": "User deleted successfully."
    }), 200


@user_api.route("/search", methods=["GET"])
@JWT_required
@admin_required
@swag_from("../../apidocs/user/search_users.yaml", endpoint="user_api.search_users", methods=["GET"])
def search_users(user):
    query = request.args.get("query", type=str, default=None)
    if not query:
        return jsonify({
            "success": False,
            "message": "Missing query parameter."
        }), 400
    
    user_service = UserService()
    user_search_results = user_service.search_users_by_query(query)
    return jsonify({
        "success": True,
        "message": "Search completed successfully.",
        "total": len(user_search_results),
        "users": user_search_results
    }), 200
        