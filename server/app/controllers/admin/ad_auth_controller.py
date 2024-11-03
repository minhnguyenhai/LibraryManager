from flask import request, jsonify
from . import admin_api
from ...services.admin.ad_auth_service import validate_login, generate_access_token, generate_refresh_token, verify_refresh_token


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
    
    
@admin_api.route("/refresh-token", methods=["POST"])
def refresh_token():
    try:
        data = request.get_json()
        if data is None:
            raise ValueError("Invalid JSON data.")
        
        refresh_token = data.get("refresh_token")
        
        if refresh_token is None:
            return jsonify({
                "success": False,
                "message": "Refresh token is required."
            }), 400
        
        admin_id = verify_refresh_token(refresh_token)
        
        if admin_id is None:
            return jsonify({
                "success": False,
                "message": "Invalid or expired refresh token."
            }), 400
            
        new_access_token = generate_access_token(admin_id)
        new_refresh_token = generate_refresh_token(admin_id)

        return jsonify({
            "success": True,
            "message": "Token refreshed.",
            "access_token": new_access_token,
            "refresh_token": new_refresh_token
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