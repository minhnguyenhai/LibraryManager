from flask import request, jsonify

from . import book_api
from ...services.book.book_service import (
    list_books
)
from ...utils.decorators import JWT_required


@book_api.route('/', methods=['GET'])
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
        