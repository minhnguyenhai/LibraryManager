from flask import request, jsonify
from validate_email_address import validate_email

from . import user_api
from ...email import send_email
from ...services.user_service import (
    validate_login, 
    generate_access_token, 
    generate_refresh_token,
    is_email_registered,
    save_new_user,
    generate_confirm_token
)


@user_api.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        
        if data is None:
            raise ValueError("Invalid JSON data.")
        
        email = data.get("email")
        password = data.get("password")
        
        if email is None or password is None:
            return jsonify({
                "success": False,
                "message": "Email and password are required."
            }), 400

        user = validate_login(email, password)
        
        if not user:
            return jsonify({
                "success": False,
                "message": "Bad email or password."
            }), 400
            
        access_token = generate_access_token(user.id)
        refresh_token = generate_refresh_token(user.id)

        return jsonify({
            "success": True,
            "message": "Login successful.",
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
    
    
@user_api.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        
        if data is None:
            raise ValueError("Invalid JSON data.")
        
        REQUIRED_FIELDS = {"email", "password", "name", "dob", "gender", "address", "phone_number"}
        missing_fields = {field for field in REQUIRED_FIELDS if data.get(field) is None}
        
        if missing_fields:
            return jsonify({
                "success": False,
                "message": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400
        
        if not validate_email(data["email"]):
            return jsonify({
                "success": False,
                "message": "Invalid email address."
            }), 400
        
        if is_email_registered(data["email"]):
            return jsonify({
                "success": False,
                "message": "Email is already registered."
            }), 400
            
        new_user = save_new_user(data["email"], data["password"], data["name"], data["dob"], data["gender"], data["address"], data["phone_number"])
        confirm_token = generate_confirm_token(new_user.id)
        send_email(
            to=data["email"], 
            subject="Confirm Your Account",
            template="confirm",
            user=new_user
            # token=confirm_token
        )
        
        return jsonify({
            "success": True,
            "message": "User registered successfully. An email has been sent to confirm your account."
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