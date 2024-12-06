from flask import jsonify
from . import statistic_api
from ...services.statistic.statistic_service import(
    get_book_statistic, get_user_statistic,
    get_books_currently_borrowed,
    get_users_currently_borrowing
)

@statistic_api.route('/user-statistics', methods=['GET'])
def user_statistics():
    """Endpoint to get total user count and new users this month"""
    try:
        stats = get_user_statistic()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@statistic_api.route('/book-statistics', methods=['GET'])
def book_statistics():
    """Endpoint to get total book count and new books added this month"""
    try:
        stats = get_book_statistic()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
@statistic_api.route('/books-currently-borrowed', methods=['GET'])
def books_currently_borrowed():
    """ Endpoint to get the total number of books currently borrowed """
    try:
        total_books_borrowed = get_books_currently_borrowed()
        return jsonify({"total_books_borrowed": total_books_borrowed}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@statistic_api.route('/users-currently-borrowing', methods=['GET'])
def users_currently_borrowing():
    """ Endpoint to get the total number of users currently borrowing books """
    try:
        total_users_borrowing = get_users_currently_borrowing()
        return jsonify({"total_users_borrowing": total_users_borrowing}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500    