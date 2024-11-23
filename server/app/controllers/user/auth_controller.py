from flask import request, jsonify
from validate_email_address import validate_email

from . import user_api
from ...email import send_email
from ...services.user.auth_service import (
    validate_login, generate_access_token, generate_refresh_token, verify_access_token,
    verify_refresh_token, is_email_registered, save_new_user, generate_verification_code,
    generate_confirm_token, is_verified, get_user_by_email, verify_verification_code, verify_user_email,
    invalidate_refresh_token, generate_reset_code, generate_reset_token,verify_reset_code,set_password
)
from ...utils.decorators import JWT_required


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
            
        if not validate_email(email):
            return jsonify({
                "success": False,
                "message": "Invalid email address."
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
            "user": user.as_dict(),
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
    
    
@user_api.route("/refresh-token", methods=["POST"])
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
        
        user_id = verify_refresh_token(refresh_token)
        
        if user_id is None:
            return jsonify({
                "success": False,
                "message": "Invalid or expired refresh token."
            }), 400
            
        new_access_token = generate_access_token(user_id)
        new_refresh_token = generate_refresh_token(user_id)

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
        verification_code = generate_verification_code(new_user.email)
        confirm_token = generate_confirm_token(new_user.email)
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
        

@user_api.route("/send-verification-code", methods=["POST"])
def send_verification_code():
    try:
        data = request.get_json()
        if data is None:
            raise ValueError("Invalid JSON data.")
        
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

        if not is_email_registered(email):
            return jsonify({
                "success": False,
                "message": "Email is not registered."
            }), 400
            
        if is_verified(email):
            return jsonify({
                "success": False,
                "message": "Email is already verified."
            }), 400

        verification_code = generate_verification_code(email)
        confirm_token = generate_confirm_token(email)
        send_email(
            to=data["email"], 
            subject="Your Verification Code from 4M Library",
            template="confirm",
            user=get_user_by_email(email),
            code=verification_code
        )

        return jsonify({
            "success": True,
            "message": "Verification code sent to email successfully.",
            "confirm_token": confirm_token
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


@user_api.route("/verify-email", methods=["POST"])
def verify_email():
    try:
        data = request.get_json()
        if data is None:
            raise ValueError("Invalid JSON data.")
        
        confirm_token = data.get("confirm_token")
        verification_code = data.get("verification_code")

        if not confirm_token or not verification_code:
            return jsonify({
                "success": False,
                "message": "Confirm token and verification code are required."
            }), 400

        user = verify_verification_code(confirm_token, verification_code)
        if user and verify_user_email(user.email):
            access_token = generate_access_token(user.id)
            refresh_token = generate_refresh_token(user.id)
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
        
        
@user_api.route("/logout", methods=["POST"])
@JWT_required
def logout(user_id):
    try:
        if invalidate_refresh_token(user_id):
            return "", 204
        
        return jsonify({
            "success": False,
            "message": "Failed to log out. Invalid token."
        }), 401

    except Exception as e:
        return jsonify({
            "error": "Internal server error.",
            "message": str(e)
        }), 500
        
        
@user_api.route("/request-reset-password", methods=["POST"])
def request_reset_password():
    try:
        data = request.get_json()
        if data is None:
            raise ValueError("Invalid JSON data.")
        
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

        if not is_email_registered(email):
            return jsonify({
                "success": False,
                "message": "Email is not registered."
            }), 400
            
        reset_code = generate_reset_code(email)
        reset_token = generate_reset_token(email)
        send_email(
            to=email, 
            subject="Reset Your Password from 4M Library",
            template="reset-password",
            user=get_user_by_email(email),
            code=reset_code
        )

        return jsonify({
            "success": True,
            "message": "Reset password code sent to your email successfully.",
            "reset_token": reset_token
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
        
        
@user_api.route("/validate-reset-code", methods=["POST"])
def validate_reset_code():
    try:
        data = request.get_json()
        if data is None:
            raise ValueError("Invalid JSON data.")
        
        reset_token = data.get("reset_token")
        reset_code = data.get("reset_code")

        if not reset_token or not reset_code:
            return jsonify({
                "success": False,
                "message": "Reset token and reset code are required."
            }), 400

        user = verify_reset_code(reset_token, reset_code)
        if user:
            temp_access_token = generate_access_token(user.id)
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
       
        
@user_api.route("/reset-password", methods=["POST"])
def reset_password():
    try:
        data = request.get_json()
        if data is None:
            raise ValueError("Invalid JSON data.")
        
        temp_access_token = data.get("temp_access_token")
        new_password = data.get("new_password")

        if not temp_access_token or not new_password:
            return jsonify({
                "success": False,
                "message": "Temporary access token and new password are required."
            }), 400

        user_id = verify_access_token(temp_access_token)
        if not user_id:
            return jsonify({
                "success": False,
                "message": "Invalid temporary access token."
            }), 400
            
        if set_password(user_id, new_password):
            return jsonify({
                "success": True,
                "message": "Password reset successfully."
            }), 200
        
        return jsonify({
            "success": False,
            "message": "Failed to reset password."
        }), 400
        
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