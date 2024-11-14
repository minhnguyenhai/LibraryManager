from flask import Blueprint

# Khởi tạo Blueprint cho module book
book_bp = Blueprint('books', __name__)

# Import các route từ book_controller
from . import book_controller
