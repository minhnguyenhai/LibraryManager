from flask import request, jsonify
from . import admin_api
from ...services.admin.ad_auth_service import validate_login, generate_access_token, generate_refresh_token


@admin_api.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        if data is None:
            raise ValueError("Invalid JSON data.")
        
        username = data.get("username")
        password = data.get("password")
        
        if username is None or password is None:
            return jsonify({
                "success": False,
                "message": "Admin username and password are required."
            }), 400

        admin = validate_login(username, password)
        
        if not admin:
            return jsonify({
                "success": False,
                "message": "Bad email or password."
            }), 400
            
        access_token = generate_access_token(admin.id)
        refresh_token = generate_refresh_token(admin.id)

        return jsonify({
            "success": True,
            "message": "Login successful.",
            "admin": admin.as_dict(),
            "access_token": access_token,
            "refresh_token": refresh_token
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