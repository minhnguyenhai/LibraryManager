from flask import jsonify
from . import statistic_api
from ...services.statistic.statistic_service import StatisticService
from ...utils.decorators import JWT_required, admin_required


@statistic_api.route("/user", methods=["GET"])
@JWT_required
@admin_required
def get_user_statistics(user):
    statistic_service = StatisticService()
    total_num_of_users = statistic_service.get_total_number_of_users()
    num_of_new_users_this_month = statistic_service.count_new_users_this_month()
    num_of_users_currently_borrowing = statistic_service.count_users_currently_borrowing()
    return jsonify({
        "success": True,
        "message": "User statistics fetched successfully",
        "total_users": total_num_of_users,
        "new_users_this_month": num_of_new_users_this_month,
        "users_borrowing": num_of_users_currently_borrowing
    }), 200
        

@statistic_api.route("/book", methods=["GET"])
@JWT_required
@admin_required
def get_book_statistics(user):
    statistic_service = StatisticService()
    total_num_of_books = statistic_service.get_total_number_of_books()
    num_of_new_books_this_month = statistic_service.count_new_books_this_month()
    num_of_books_currently_borrowed = statistic_service.count_books_currently_borrowed()
    return jsonify({
        "success": True,
        "message": "Book statistics fetched successfully",
        "total_books": total_num_of_books,
        "new_books_this_month": num_of_new_books_this_month,
        "books_borrowed": num_of_books_currently_borrowed
    }), 200
