from flask import request, jsonify
from validate_email_address import validate_email

from . import reader_api
from ...email import send_email
from ...services.reader.auth_service import (
    validate_login, 
    generate_access_token, 
    generate_refresh_token,
    verify_refresh_token,
    is_email_registered,
    save_new_reader,
    generate_verification_code,
    generate_confirm_token,
    is_verified,
    get_reader_by_email,
    verify_code,
    verify_email,
    invalidate_token,
    generate_reset_code,
    generate_reset_token
)


@reader_api.route("/login", methods=["POST"])
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

        reader = validate_login(email, password)
        
        if not reader:
            return jsonify({
                "success": False,
                "message": "Bad email or password."
            }), 400
            
        access_token = generate_access_token(reader.id)
        refresh_token = generate_refresh_token(reader.id)

        return jsonify({
            "success": True,
            "message": "Login successful.",
            "reader": reader.as_dict(),
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
    
    
@reader_api.route("/refresh-token", methods=["POST"])
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
        
        reader_id = verify_refresh_token(refresh_token)
        
        if reader_id is None:
            return jsonify({
                "success": False,
                "message": "Invalid or expired refresh token."
            }), 400
            
        new_access_token = generate_access_token(reader_id)
        new_refresh_token = generate_refresh_token(reader_id)

        return jsonify({
            "success": True,
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
        
        
@reader_api.route("/register", methods=["POST"])
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
            
        new_reader = save_new_reader(data["email"], data["password"], data["name"], data["dob"], data["gender"], data["address"], data["phone_number"])
        verification_code = generate_verification_code(new_reader.email)
        confirm_token = generate_confirm_token(new_reader.email)
        send_email(
            to=data["email"], 
            subject="Your Verification Code from 4M Library",
            template="confirm",
            reader=new_reader,
            code=verification_code
        )
        
        return jsonify({
            "success": True,
            "message": "User registered successfully. An email has been sent to confirm your account.",
            "user": new_reader.as_dict(),
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
        

@reader_api.route("/send-verification-code", methods=["POST"])
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
            reader=get_reader_by_email(email),
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


@reader_api.route("/verify-email", methods=["POST"])
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

        reader = verify_code(confirm_token, verification_code)
        if reader and verify_email(reader.email):
            access_token = generate_access_token(reader.id)
            refresh_token = generate_refresh_token(reader.id)
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
        
        
@reader_api.route("/logout", methods=["POST"])
def logout():
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({
                "success": False,
                "message": "Token is missing or invalid."
            }), 401
        
        token = auth_header.split(" ")[1]
        if invalidate_token(token):
            return "", 204
        else:
            return jsonify({
                "success": False,
                "message": "Failed to log out. Invalid token."
            }), 401

    except Exception as e:
        return jsonify({
            "error": "Internal server error.",
            "message": str(e)
        }), 500
        
        
@reader_api.route("/request-reset-password", methods=["POST"])
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
            reader=get_reader_by_email(email),
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