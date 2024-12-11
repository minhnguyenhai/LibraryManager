import logging
from ...repository.book_repository import BookRepository, FavoriteRepository
from ...repository.borrow_record_repository import BorrowRecordRepository


class BookService:
    def __init__(self):
        self.book_repository = BookRepository()
        self.borrow_record_repository = BorrowRecordRepository()
        self.favorite_repository = FavoriteRepository()
    
    
    def list_books(self):
        """ Fetch all books from the database. """
        books_list = self.book_repository.get_all_books()
        return [book.as_dict() for book in books_list]


    def get_book_by_id(self, book_id):
        """ Fetch a book by its id. """
        return self.book_repository.get_book_by_id(book_id)

        
    def save_new_book(self, title, author, image_url, description, price, quantity):
        """ Save a new book to the database. """
        try:
            new_book = self.book_repository.create_book(title, author, image_url, description, price, quantity)
            return new_book
        
        except Exception as e:
            logging.error(f"Error while saving new book: {str(e)}")
            raise
        
        
    def update_book_info(self, book, data):
        """ Update a book in the database. """
        try:
            updated_book = self.book_repository.update_book(book, data)
            return updated_book
        
        except Exception as e:
            logging.error(f"Error while updating book: {str(e)}")
            raise


    def delete_book_from_db(self, book):
        """ Delete a book from the database. """
        try:
            status_borrowing_records = self.borrow_record_repository.list_borrow_records_of_book_by_status(book.id, "borrowing")
            if status_borrowing_records:
                return False
            
            favorites_to_delete = self.favorite_repository.get_all_favorites_of_book(book.id)
            for favorite in favorites_to_delete:
                self.favorite_repository.delete_favorite(favorite)
            
            self.book_repository.delete_book(book)
            return True
            
        except Exception as e:
            logging.error(f"Error while deleting book: {str(e)}")
            raise
        
        
    def search_books_by_query(self, query):
        """ Search books by a query string. """
        try:
            books = self.book_repository.search_books(query)
            return [book.as_dict() for book in books]
        
        except Exception as e:
            logging.error(f"Error while searching books by query: {str(e)}")
            raise
