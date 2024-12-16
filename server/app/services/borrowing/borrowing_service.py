import logging
from ...repository.borrow_record_repository import BorrowRecordRepository
from ...repository.user_repository import UserRepository
from ...repository.book_repository import BookRepository


class BorrowingService:
    def __init__(self):
        self.borrow_record_repository = BorrowRecordRepository()
        self.user_repository = UserRepository()
        self.book_repository = BookRepository()
    
    
    def get_all_borrow_records_of_user(self, user_id):
        """ Fetch all borrow records of a user. """
        try:
            borrow_records = self.borrow_record_repository.list_borrow_records_of_user(user_id)
            return [record.as_dict() for record in borrow_records]
        
        except Exception as e:
            logging.error(f"Error while fetching all borrow records of a user: {str(e)}")
            raise
        
        
    def get_borrow_record_by_id(self, borrow_record_id):
        """ Fetch a borrow record by its id. """
        return self.borrow_record_repository.get_borrow_record_by_id(borrow_record_id)
        
        
    def list_borrow_records(self):
        """ Fetch all borrow records from the database. """
        try:
            borrow_records = self.borrow_record_repository.get_all_borrow_records()
            return [record.as_dict() for record in borrow_records]
        
        except Exception as e:
            logging.error(f"Error while fetching all borrow records: {str(e)}")
            raise
        
        
    def save_new_borrow_record(self, user_id, book_id, quantity, borrow_date, due_date):
        """ Save a new borrow record to the database. """
        try:
            user = self.user_repository.get_user_by_id(user_id)
            book = self.book_repository.get_book_by_id(book_id)
            if not user or not book:
                return None
            
            new_borrow_record = self.borrow_record_repository.create_borrow_record(user_id, book_id, quantity, borrow_date, due_date)
            data_to_update_book = {
                "available_quantity": book.available_quantity - quantity,
            }
            updated_book = self.book_repository.update_book(book, data_to_update_book)
            return new_borrow_record
        
        except Exception as e:
            logging.error(f"Error while saving new borrow record: {str(e)}")
            raise
        
        
    def update_borrow_record_info(self, borrow_record, return_date):
        """ Update a borrow record in the database. """
        try:
            updated_borrow_record = self.borrow_record_repository.update_borrow_record(borrow_record, return_date)
            book = self.book_repository.get_book_by_id(updated_borrow_record.book_id)
            data_to_update_book = {
                "available_quantity": book.available_quantity + updated_borrow_record.quantity
            }
            updated_book = self.book_repository.update_book(book, data_to_update_book)
            return updated_borrow_record
        
        except Exception as e:
            logging.error(f"Error while updating borrow record: {str(e)}")
            raise
        
        
    def search_borrow_records_by_query(self, query):
        """ Search borrow records by a query string. """
        try:
            borrow_records = self.borrow_record_repository.search_borrow_records(query)
            return [record.as_dict() for record in borrow_records]

        except Exception as e:
            logging.error(f"Error while searching borrow records by query: {str(e)}")
            raise