# permissions.py
import os
from functools import wraps
from flask import request, jsonify
import jwt
from dotenv import load_dotenv
# tải biến từ file env
load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')


# Decorator để kiểm tra token hợp lệ
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Lấy token từ headers của request
        token = request.headers.get('Authorization')
        
       
        if not token:
            return jsonify({"message": "Token is missing!"}), 403  
        
        try:
            
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user_role = data.get('role') 
        except:
            
            return jsonify({"message": "Token is invalid!"}), 403  
        
        # Gọi hàm được bảo vệ và truyền role hiện tại của người dùng vào
        return f(current_user_role, *args, **kwargs)
    return decorated

# Decorator để giới hạn truy cập chỉ dành cho admin
def admin_required(f):
    @wraps(f)
    def decorated(current_user_role, *args, **kwargs):
        # Kiểm tra nếu vai trò người dùng không phải là admin
        if current_user_role != 'admin':
            return jsonify({"message": "Admin access required!"}), 403  
        
    
        return f(*args, **kwargs)
    return decorated
