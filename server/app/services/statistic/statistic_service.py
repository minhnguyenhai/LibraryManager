from datetime import datetime
from ...repository.user_repository import UserRepository
from ...repository.book_repository import BookRepository


class StatisticService:
    def __init__(self):
        self.user_repository = UserRepository()
        self.book_repository = BookRepository()
    
    
    def get_total_number_of_users(self):
        """Fetch the total number of users in the system"""
        return self.user_repository.count_total_users()


    def count_new_users_this_month(self):
        """Fetch the number of new users added in the current month"""
        today = datetime.today()
        first_day_of_month = today.replace(day=1)
        return self.user_repository.count_new_users_from_day(first_day_of_month)

        
    def count_users_currently_borrowing(self):
        """ Get the total number of unique users currently borrowing books """
        return self.user_repository.count_users_by_borrowing_status("borrowing")


    def get_total_number_of_books(self):
        """ Fetch the total number of books in the system """
        return self.book_repository.count_total_books()


    def count_new_books_this_month(self):
        """ Fetch the number of new books added in the current month """
        today = datetime.today()
        first_day_of_month = today.replace(day=1)
        return self.book_repository.count_new_books_from_day(first_day_of_month)


    def count_books_currently_borrowed(self):
        """ Get the total number of books currently borrowed """
        return self.book_repository.count_books_by_borrowing_status("borrowing")
