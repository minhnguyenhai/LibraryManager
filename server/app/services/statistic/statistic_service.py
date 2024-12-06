import logging
from datetime import datetime
from app import db
from ...models.user import User
from ...models.book import Book

def get_user_statistic():
    """Fecth total number of users and new users in the current month"""
    try:
        today = datetime.today()
        first_day_of_month  = today.replace(day = 1)
        total_users = User.query.count()
        new_users_this_month = User.query.filter(User.dob >= first_day_of_month).count()
        return{
            "total_users": total_users,
            "new_users_this_month": new_users_this_month
        }
    except Exception as e:
        logging.error(f"Error while fetching user statistics: {str(e)}")
        raise


def get_book_statistic():
    """Fetch total number of books and new books added in the current month."""
    try:
        today = datetime.today()
        first_day_of_month = today.replace(day=1)
        total_books = Book.query.count() 
        new_books_this_month = Book.query.filter(Book.created_at >= first_day_of_month).count()
        return {
            "total_books": total_books,
            "new_books_this_month": new_books_this_month
        }
        
    except Exception as e:
        logging.error(f"Error while fetching book statistics: {str(e)}")
        raise