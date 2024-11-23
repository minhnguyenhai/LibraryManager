import logging

from app import db
from ...models.book import Book


def list_books():
    """ Fetch all books from the database. """
    try:
        books_list = Book.query.all()
        return [book.as_dict() for book in books_list]
    except Exception as e:
        logging.error(f"Error while fetching all books: {str(e)}")
        raise


def get_book_by_id(book_id):
    """ Fetch a book by its id. """
    try:
        book = Book.query.get(book_id)
        if not book:
            return None
        return book.as_dict()
    except Exception as e:
        logging.error(f"Error while fetching book by id: {str(e)}")
        raise
    
    
def save_new_book(title, author, image_url, description, price):
    """ Save a new book to the database. """
    try:
        new_book = Book(title, author, image_url, description, price)
        db.session.add(new_book)
        db.session.commit()
        return new_book
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error while saving new book: {str(e)}")
        raise