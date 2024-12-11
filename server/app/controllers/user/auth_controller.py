from flask import request, jsonify
from validate_email_address import validate_email

from . import user_api
from ...email import send_email
from ...services.user.auth_service import AuthService
from ...utils.decorators import JWT_required


@user_api.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "message": "Invalid JSON data."
        }), 400
    
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required."
        }), 400
        
    if not validate_email(email):
        return jsonify({
            "success": False,
            "message": "Invalid email address."
        }), 400

    auth_service = AuthService()
    user = auth_service.validate_login(email, password)
    if not user:
        return jsonify({
            "success": False,
            "message": "Bad email or password."
        }), 400
        
    access_token = auth_service.generate_access_token(user.id)
    refresh_token = auth_service.generate_refresh_token(user.id)
    return jsonify({
        "success": True,
        "message": "Login successful.",
        "user": user.as_dict(),
        "access_token": access_token,
        "refresh_token": refresh_token
    }), 200
    
    
@user_api.route("/refresh-token", methods=["POST"])
def refresh_token():
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "message": "Invalid JSON data."
        }), 400
    
    refresh_token = data.get("refresh_token")
    if refresh_token is None:
        return jsonify({
            "success": False,
            "message": "Refresh token is required."
        }), 400
    
    auth_service = AuthService()
    user_id = auth_service.verify_refresh_token(refresh_token)
    if user_id is None:
        return jsonify({
            "success": False,
            "message": "Invalid or expired refresh token."
        }), 400
        
    new_access_token = auth_service.generate_access_token(user_id)
    new_refresh_token = auth_service.generate_refresh_token(user_id)
    return jsonify({
        "success": True,
        "message": "Token refreshed.",
        "access_token": new_access_token,
        "refresh_token": new_refresh_token
    }), 200
        
   
@user_api.route("/logout", methods=["POST"])
@JWT_required
def logout(user_id):
    auth_service = AuthService()
    if auth_service.invalidate_refresh_token(user_id):
        return "", 204
    
    return jsonify({
        "success": False,
        "message": "Failed to log out. Invalid token."
    }), 401

   
@user_api.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "message": "Invalid JSON data."
        }), 400
    
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
    
    auth_service = AuthService()
    existed_user = auth_service.check_email_registered(data["email"])
    if existed_user:
        return jsonify({
            "success": False,
            "message": "Email is already registered."
        }), 400
        
    new_user = auth_service.save_new_user(data["email"], data["password"], data["name"], data["dob"], data["gender"], data["address"], data["phone_number"])
    verification_code = auth_service.generate_verification_code(new_user.email)
    confirm_token = auth_service.generate_confirm_token(new_user.email)
    send_email(
        to=data["email"], 
        subject="Your Verification Code from 4M Library",
        template="confirm",
        user=new_user,
        code=verification_code
    )
    
    return jsonify({
        "success": True,
        "message": "User registered successfully. An email has been sent to confirm your account.",
        "user": new_user.as_dict(),
        "confirm_token": confirm_token
    }), 201
        

@user_api.route("/send-verification-code", methods=["POST"])
def send_verification_code():
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "message": "Invalid JSON data."
        }), 400
    
    email = data.get("email")
    if not email:
        return jsonify({
            "success": False,
            "message": "Email is required."
        }), 400
        
    if not validate_email(email):
        return jsonify({
            "success": False,
            "message": "Invalid email address."
        }), 400

    auth_service = AuthService()
    registered_user = auth_service.check_email_registered(email)
    if not registered_user:
        return jsonify({
            "success": False,
            "message": "Email is not registered."
        }), 400
        
    if auth_service.is_verified(email):
        return jsonify({
            "success": False,
            "message": "Email is already verified."
        }), 400

    verification_code = auth_service.generate_verification_code(email)
    confirm_token = auth_service.generate_confirm_token(email)
    send_email(
        to=data["email"], 
        subject="Your Verification Code from 4M Library",
        template="confirm",
        user=registered_user,
        code=verification_code
    )

    return jsonify({
        "success": True,
        "message": "Verification code sent to email successfully.",
        "confirm_token": confirm_token
    }), 200


@user_api.route("/verify-email", methods=["POST"])
def verify_email():
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "message": "Invalid JSON data."
        }), 400
    
    confirm_token = data.get("confirm_token")
    verification_code = data.get("verification_code")
    if not confirm_token or not verification_code:
        return jsonify({
            "success": False,
            "message": "Confirm token and verification code are required."
        }), 400

    auth_service = AuthService()
    user = auth_service.verify_verification_code(confirm_token, verification_code)
    if user and auth_service.verify_user_email(user.email):
        access_token = auth_service.generate_access_token(user.id)
        refresh_token = auth_service.generate_refresh_token(user.id)
        return jsonify({
            "success": True,
            "message": "Your email address was verified successfully.",
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 200
    else:
        return jsonify({
            "success": False,
            "message": "Invalid confirm token or verification code."
        }), 400
        
 
@user_api.route("/request-reset-password", methods=["POST"])
def request_reset_password():
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "message": "Invalid JSON data."
        }), 400
    
    email = data.get("email")
    if not email:
        return jsonify({
            "success": False,
            "message": "Email is required."
        }), 400
        
    if not validate_email(email):
        return jsonify({
            "success": False,
            "message": "Invalid email address."
        }), 400

    auth_service = AuthService()
    registered_user = auth_service.check_email_registered(email)
    if not registered_user:
        return jsonify({
            "success": False,
            "message": "Email is not registered."
        }), 400
        
    reset_code = auth_service.generate_reset_code(email)
    reset_token = auth_service.generate_reset_token(email)
    send_email(
        to=email, 
        subject="Reset Your Password from 4M Library",
        template="reset-password",
        user=registered_user,
        code=reset_code
    )

    return jsonify({
        "success": True,
        "message": "Reset password code sent to your email successfully.",
        "confirm_token": reset_token
    }), 200
        
        
@user_api.route("/validate-reset-code", methods=["POST"])
def validate_reset_code():
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "message": "Invalid JSON data."
        }), 400
    
    reset_token = data.get("confirm_token")
    reset_code = data.get("verification_code")
    if not reset_token or not reset_code:
        return jsonify({
            "success": False,
            "message": "Reset token and reset code are required."
        }), 400

    auth_service = AuthService()
    user = auth_service.verify_reset_code(reset_token, reset_code)
    if user:
        temp_access_token = auth_service.generate_access_token(user.id)
        return jsonify({
            "success": True,
            "message": "Reset code verified successfully.",
            "temp_access_token": temp_access_token
        }), 200
    else:
        return jsonify({
            "success": False,
            "message": "Invalid reset token or reset code."
        }), 400
       
        
@user_api.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "message": "Invalid JSON data."
        }), 400
    
    temp_access_token = data.get("temp_access_token")
    new_password = data.get("new_password")
    if not temp_access_token or not new_password:
        return jsonify({
            "success": False,
            "message": "Temporary access token and new password are required."
        }), 400

    auth_service = AuthService()
    user_id = auth_service.verify_temp_access_token(temp_access_token)
    if not user_id:
        return jsonify({
            "success": False,
            "message": "Invalid temporary access token."
        }), 400
        
    if auth_service.set_password(user_id, new_password):
        return jsonify({
            "success": True,
            "message": "Password reset successfully."
        }), 200
    
    return jsonify({
        "success": False,
        "message": "Failed to reset password."
    }), 400
