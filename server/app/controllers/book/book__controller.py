from flask import request, jsonify
from services.book import get_all_books, create_book, update_book, delete_book
from untils.permissions import token_required, admin_required
from . import book_bp  # Import Blueprint từ __init__.py

# Lấy danh sách sách ai cũng đc
@book_bp.route('/books', methods=['GET'])
@token_required
def get_books(current_user_role):
    books = get_all_books()
    return jsonify(books), 200

# Thêm sách mới (phải là admin)
@book_bp.route('/books', methods=['POST'])
@token_required
@admin_required
def create_new_book():
    data = request.get_json()
    book = create_book(data)
    if book:
        return jsonify(book), 201
    else:
        return jsonify({"message": "Error creating book"}), 500

# Cập nhật sách (phải là admin)
@book_bp.route('/books/<string:book_id>', methods=['PUT'])
@token_required
@admin_required
def update_existing_book(book_id):
    data = request.get_json()
    book = update_book(book_id, data)
    if book:
        return jsonify(book), 200
    else:
        return jsonify({"message": "Book not found"}), 404

# Xóa sách (phải là admin)
@book_bp.route('/books/<string:book_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_existing_book(book_id):
    success = delete_book(book_id)
    if success:
        return jsonify({"message": "Book deleted"}), 200
    else:
        return jsonify({"message": "Book not found"}), 404
