from flask import jsonify
from . import statistic_api
from ...services.statistic.statistic_service import (
    get_total_number_of_users, count_new_users_this_month, count_users_currently_borrowing,
    get_total_number_of_books, count_new_books_this_month, count_books_currently_borrowed
    
)
from ...utils.decorators import JWT_required, admin_required


@statistic_api.route("/user", methods=["GET"])
@JWT_required
@admin_required
def get_user_statistics(user):
    try:
        total_num_of_users = get_total_number_of_users()
        num_of_new_users_this_month = count_new_users_this_month()
        num_of_users_currently_borrowing = count_users_currently_borrowing()
        return jsonify({
            "success": True,
            "message": "User statistics fetched successfully",
            "total_users": total_num_of_users,
            "new_users_this_month": num_of_new_users_this_month,
            "users_borrowing": num_of_users_currently_borrowing
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": "Internal server error.",
            "message": str(e)
        }), 500
        

@statistic_api.route("/book", methods=["GET"])
@JWT_required
@admin_required
def get_book_statistics(user):
    try:
        total_num_of_books = get_total_number_of_books()
        num_of_new_books_this_month = count_new_books_this_month()
        num_of_books_currently_borrowed = count_books_currently_borrowed()
        return jsonify({
            "success": True,
            "message": "Book statistics fetched successfully",
            "total_books": total_num_of_books,
            "new_books_this_month": num_of_new_books_this_month,
            "books_borrowed": num_of_books_currently_borrowed
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": "Internal server error.",
            "message": str(e)
        }), 500
