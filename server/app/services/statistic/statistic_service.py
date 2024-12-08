from datetime import datetime

from sqlalchemy import func

from app import db
from ...models.user import User
from ...models.book import Book
from ...models.borrow_record import BorrowRecord


def get_total_number_of_users():
    """Fetch the total number of users in the system"""
    return User.query.count()


def count_new_users_this_month():
    """Fetch the number of new users added in the current month"""
    today = datetime.today()
    first_day_of_month = today.replace(day=1)
    return User.query.filter(User.created_at >= first_day_of_month).count()

    
def count_users_currently_borrowing():
    """ Get the total number of unique users currently borrowing books """
    return db.session.query(func.count(func.distinct(BorrowRecord.user_id)))\
                        .filter(BorrowRecord.status == "borrowing")\
                        .scalar()


def get_total_number_of_books():
    """ Fetch the total number of books in the system """
    return Book.query.count()


def count_new_books_this_month():
    """ Fetch the number of new books added in the current month """
    today = datetime.today()
    first_day_of_month = today.replace(day=1)
    return Book.query.filter(Book.created_at >= first_day_of_month).count()


def count_books_currently_borrowed():
    """ Get the total number of books currently borrowed """
    return db.session.query(func.sum(BorrowRecord.quantity)).filter(BorrowRecord.status == "borrowing").scalar()
