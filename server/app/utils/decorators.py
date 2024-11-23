from functools import wraps
import jwt
from flask import request, jsonify
from config import secret_key


def JWT_required(f):
    """Decorator to require JSON Web Token for API access."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({
                "success": False,
                "message": "Missing Authorization Header"
            }), 401
        
        auth_header_parts = auth_header.split(" ")
        if len(auth_header_parts) != 2 or not auth_header_parts[1]:
            return jsonify({
                "success": False,
                "message": "Invalid Authorization Header"
            }), 401
            
        token = auth_header_parts[1]
        try:
            payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({
                "success": False,
                "message": "Expired Token"
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                "success": False,
                "message": "Invalid Token"
            }), 401
            
        user_id = payload.get("user_id")
        if not user_id:
            return jsonify({
                "success": False,
                "message": "Invalid Token"
            }), 401
        
        return f(user_id, *args, **kwargs)

    return decorated_function