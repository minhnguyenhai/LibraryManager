import logging

from app import db
from ...models.book import Book


def list_books():
    try:
        books_list = Book.query.all()
        return [book.as_dict() for book in books_list]
    except Exception as e:
        logging.error(f"Error while fetching all books: {str(e)}")
        raise


def get_book_by_id(book_id):
    try:
        book = Book.query.get(book_id)
        if not book:
            return None
        return book.as_dict()
    except Exception as e:
        logging.error(f"Error while fetching book by id: {str(e)}")
        raise