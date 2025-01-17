from flask import request, jsonify
from flasgger.utils import swag_from

from . import book_api
from ...services.book.book_service import BookService
from ...utils.decorators import JWT_required, admin_required


@book_api.route("/book", methods=["GET"])
@swag_from("../../apidocs/book/get_all_books.yaml", endpoint="book_api.get_all_books", methods=["GET"])
def get_all_books():
    book_service = BookService()
    books_data = book_service.list_books()
    return jsonify({
        "success": True,
        "message": "Successfully fetched all books.",
        "books": books_data
    }), 200


@book_api.route("/book/<book_id>", methods=["GET"])
@swag_from("../../apidocs/book/get_book.yaml", endpoint="book_api.get_book", methods=["GET"])
def get_book(book_id):
    book_service = BookService()
    book = book_service.get_book_by_id(book_id)
    if not book:
        return jsonify({
            "success": False,
            "message": "Book not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Successfully fetched book.",
        "book": book.as_dict()
    }), 200
        
        
@book_api.route("/book", methods=["POST"])
@JWT_required
@admin_required
@swag_from("../../apidocs/book/add_book.yaml", endpoint="book_api.add_book", methods=["POST"])
def add_book(user):
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "message": "Invalid JSON data."
        }), 400
    
    REQUIRED_FIELDS = {"title", "author", "image_url", "description", "price", "quantity"}
    missing_fields = {field for field in REQUIRED_FIELDS if data.get(field) is None}
    if missing_fields:
        return jsonify({
            "success": False,
            "message": f"Missing required fields: {', '.join(missing_fields)}"
        }), 400
    
    book_service = BookService()
    existed_book = book_service.get_bool_by_title_author(data["title"], data["author"])
    if existed_book:
        return jsonify({
            "success": False,
            "message": "Book already exists."
        }), 409

    new_book = book_service.save_new_book(data["title"], data["author"], data["image_url"], data["description"], data["price"], data["quantity"])
    return jsonify({
        "success": True,
        "message": "Successfully added new book.",
        "new_book": new_book.as_dict()
    }), 201


@book_api.route("/book/<book_id>", methods=["PUT"])
@JWT_required
@admin_required
@swag_from("../../apidocs/book/update_book.yaml", endpoint="book_api.update_book", methods=["PUT"])
def update_book(user, book_id):
    book_service = BookService()
    book = book_service.get_book_by_id(book_id)
    if not book:
        return jsonify({
            "success": False,
            "message": "Book not found."
        }), 404
        
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "message": "Invalid JSON data."
        }), 400
    
    ALLOW_FIELDS = {"title", "author", "image_url", "description", "price", "total_quantity", "available_quantity"}
    unknown_fields = {field for field in data if field not in ALLOW_FIELDS}
    if unknown_fields:
        return jsonify({
            "success": False,
            "message": f"Unknown fields: {', '.join(unknown_fields)}"
        }), 400
        
    total_quantity = data.get("total_quantity", book.total_quantity)
    available_quantity = data.get("available_quantity", book.available_quantity)
    if total_quantity < available_quantity:
        return jsonify({
            "success": False,
            "message": "Total quantity must be greater than or equal to available quantity."
        }), 400

    updated_book = book_service.update_book_info(book, data)
    return jsonify({
        "success": True,
        "message": "Successfully updated book.",
        "updated_book": updated_book.as_dict()
    }), 200
        
        
@book_api.route("/book/<book_id>", methods=["DELETE"])
@JWT_required
@admin_required
@swag_from("../../apidocs/book/delete_book.yaml", endpoint="book_api.delete_book", methods=["DELETE"])
def delete_book(user, book_id):
    book_service = BookService()
    book = book_service.get_book_by_id(book_id)
    if not book:
        return jsonify({
            "success": False,
            "message": "Book not found."
        }), 404
        
    is_deleted = book_service.delete_book_from_db(book)
    if not is_deleted:
        return jsonify({
            "success": False,
            "message": "Book has borrowing records."
        }), 409
        
    return "", 204
        
     
@book_api.route("/book/search", methods=["GET"])
@swag_from("../../apidocs/book/search_books.yaml", endpoint="book_api.search_books", methods=["GET"])
def search_books():
    query = request.args.get("query", type=str, default=None)
    if not query:
        return jsonify({
            "success": False,
            "message": "Missing query parameter."
        }), 400
    
    book_service = BookService()
    book_search_results = book_service.search_books_by_query(query)
    return jsonify({
        "success": True,
        "message": "Search completed successfully.",
        "total": len(book_search_results),
        "books": book_search_results
    }), 200
