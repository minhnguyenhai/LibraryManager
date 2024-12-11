from flask import request, jsonify

from . import book_api
from ...services.book.book_service import BookService
from ...services.book.favorite_service import FavoriteService
from ...utils.decorators import JWT_required


@book_api.route("/user/favorite", methods=["GET"])
@JWT_required
def get_favorite_books_for_user(user_id):
    favorite_service = FavoriteService()
    favorite_books = favorite_service.list_favorite_books(user_id)
    return jsonify({
        "success": True,
        "message": "Successfully fetched favorite books.",
        "books": favorite_books
    }), 200
        
        
@book_api.route("/user/favorite", methods=["POST"])
@JWT_required
def add_favorite_book_for_user(user_id):
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "message": "Invalid JSON data."
        }), 400
    
    book_id = data.get("book_id")
    if not book_id:
        return jsonify({
            "success": False,
            "message": "Missing 'book_id' field."
        }), 400
    
    book_service = BookService()
    book = book_service.get_book_by_id(book_id)
    if not book:
        return jsonify({
            "success": False,
            "message": "Book not found."
        }), 404
    
    favorite_service = FavoriteService()
    favorite_service.add_book_to_favorites(user_id, book_id)
    return jsonify({
        "success": True,
        "message": "Successfully added book to favorites."
    }), 200
        
        
@book_api.route("/user/favorite/<book_id>", methods=["DELETE"])
@JWT_required
def remove_book_from_favorites(user_id, book_id):
    book_service = BookService()
    book = book_service.get_book_by_id(book_id)
    if not book:
        return jsonify({
            "success": False,
            "message": "Book not found."
        }), 404
        
    favorite_service = FavoriteService()
    is_removed = favorite_service.remove_favorite_relationship(user_id, book_id)
    if is_removed:
        return jsonify({
            "success": True,
            "message": "Successfully removed book from favorites."
        }), 200
    
    return jsonify({
        "success": False,
        "message": "Book not found in favorites."
    }), 404
