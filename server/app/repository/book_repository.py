import logging
from typing import List

from sqlalchemy import func

from .. import db
from ..models.book import Book as BookModel
from ..models.favorite import Favorite as FavoriteModel
from ..models.borrow_record import BorrowRecord as BorrowRecordModel
from .interface.book_interface import BookInterface, FavoriteInterface


class BookRepository(BookInterface):
    def __init__(self):
        pass
    
    
    def count_total_books(self) -> int:
        return BookModel.query.count()
    
    
    def count_new_books_from_day(self, day) -> int:
        return BookModel.query.filter(BookModel.created_at >= day).count()
    
    
    def count_books_by_borrowing_status(self, status) -> int:
        return db.session.query(func.sum(BorrowRecordModel.quantity)).filter(BorrowRecordModel.status == status).scalar()
    
    
    def get_all_books(self) -> List[BookModel]:
        return BookModel.query.all()
    
    
    def list_favorite_books_of_user(self, user_id) -> List[BookModel]:
        return db.session.execute(
            db.select(BookModel)
            .join(FavoriteModel, FavoriteModel.book_id == BookModel.id)
            .where(FavoriteModel.user_id == user_id)
        ).scalars().all()
    
    
    def get_book_by_id(self, book_id) -> BookModel:
        return BookModel.query.get(book_id)
    
    
    def create_book(self, title, author, image_url, description, price, quantity) -> BookModel:
        try:
            new_book = BookModel(title, author, image_url, description, price, quantity)
            db.session.add(new_book)
            db.session.commit()
            return new_book
        
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error creating book: {str(e)}")
            raise
    
    
    def update_book(self, book, data) -> BookModel:
        try:
            for key, value in data.items():
                setattr(book, key, value)
                
            db.session.commit()
            return book
        
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error updating book: {str(e)}")
            raise
        
        
    def delete_book(self, book):
        try:
            db.session.delete(book)
            db.session.commit()
            
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error deleting book: {str(e)}")
            raise
        
        
    def search_books(self, query) -> List[BookModel]:
        try:
            filters = (
                BookModel.title.ilike(f"%{query}%") |
                BookModel.author.ilike(f"%{query}%") |
                BookModel.description.ilike(f"%{query}%")
            )
            return db.session.query(BookModel).filter(filters).all()
        
        except Exception as e:
            logging.error(f"Error searching books: {str(e)}")
            raise


class FavoriteRepository(FavoriteInterface):
    def __init__(self):
        pass
    
    
    def get_all_favorites_of_user(self, user_id) -> List[FavoriteModel]:
        return FavoriteModel.query.filter_by(user_id=user_id).all()
    
    
    def get_all_favorites_of_book(self, book_id) -> List[FavoriteModel]:
        return FavoriteModel.query.filter_by(book_id=book_id).all()
    
    
    def get_favorite(self, user_id, book_id) -> FavoriteModel:
        return FavoriteModel.query.filter_by(user_id=user_id, book_id=book_id).first()
    
    
    def create_favorite(self, user_id, book_id):
        try:
            new_favorite = FavoriteModel(user_id, book_id)
            db.session.add(new_favorite)
            db.session.commit()
            
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error creating favorites: {str(e)}")
            raise
        
        
    def delete_favorite(self, favorite):
        try:
            db.session.delete(favorite)
            db.session.commit()
            
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error deleting favorite: {str(e)}")
            raise
        