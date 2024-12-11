import logging
from ...repository.book_repository import BookRepository


class BookService:
    def __init__(self):
        self.book_repository = BookRepository()
    
    
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
            self.book_repository.delete_book(book)
            
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
