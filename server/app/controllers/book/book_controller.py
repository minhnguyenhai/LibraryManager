from flask import request, jsonify

from . import book_api
from ...services.book.book_service import (
    list_books, get_book_by_id, save_new_book
)
from ...utils.decorators import JWT_required, admin_required


@book_api.route('/')
@JWT_required
def get_all_books():
    try:
        books_data = list_books()
        return jsonify({
            "success": True,
            "message": "Successfully fetched all books.",
            "books": books_data
        }), 200
    
    except Exception as e:
        return jsonify({
            "error": "Internal server error.",
            "message": str(e)
        }), 500


@book_api.route('/<book_id>')
@JWT_required
def get_book(book_id):
    try:
        book_data = get_book_by_id(book_id)
        return jsonify({
            "success": True,
            "message": "Successfully fetched book.",
            "book": book_data
        }), 200
    
    except Exception as e:
        return jsonify({
            "error": "Internal server error.",
            "message": str(e)
        }), 500
        
        
@book_api.route('/', methods=['POST'])
@JWT_required
@admin_required
def add_book():
    try:
        data = request.get_json()
        if data is None:
            raise ValueError("Invalid JSON data.")
        
        REQUIRED_FIELDS = {"title", "author", "image_url", "description", "price"}
        missing_fields = {field for field in REQUIRED_FIELDS if data.get(field) is None}
        
        if missing_fields:
            return jsonify({
                "success": False,
                "message": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400
            
        new_book = save_new_book(data["title"], data["author"], data["image_url"], data["description"], data["price"])
        return jsonify({
            "success": True,
            "message": "Successfully added new book.",
            "new_book": new_book.as_dict()
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
