import logging
from typing import List
from datetime import datetime

from .. import db
from ..models.borrow_record import BorrowRecord as BorrowRecordModel
from ..models.user import User as UserModel
from ..models.book import Book as BookModel
from .interface.borrow_record_interface import BorrowRecordInterface


class BorrowRecordRepository(BorrowRecordInterface):
    def __init__(self):
        pass
    
    
    def get_all_borrow_records(self) -> List[BorrowRecordModel]:
        return BorrowRecordModel.query.all()
    
    
    def list_borrow_records_of_user(self, user_id) -> List[BorrowRecordModel]:
        return db.session.execute(
            db.select(BorrowRecordModel).where(BorrowRecordModel.user_id == user_id)
        ).scalars().all()
        
        
    def get_borrow_record_by_id(self, borrow_record_id) -> BorrowRecordModel:
        return BorrowRecordModel.query.get(borrow_record_id)
    
    
    def create_borrow_record(self, user_id, book_id, quantity, borrow_date, due_date) -> BorrowRecordModel:
        try:
            new_borrow_record = BorrowRecordModel(user_id, book_id, quantity, borrow_date, due_date)
            db.session.add(new_borrow_record)
            db.session.commit()
            return new_borrow_record

        except Exception as e:
            db.session.rollback()
            logging.error(f"Error creating borrow record: {str(e)}")
            raise
        
        
    def update_borrow_record(self, borrow_record, return_date) -> BorrowRecordModel:
        try:
            if isinstance(return_date, str):
                return_date = datetime.strptime(return_date, "%Y-%m-%d").date()
            
            borrow_record.return_date = return_date
            
            if return_date <= borrow_record.due_date:
                borrow_record.status = "returned-ontime"
            else:
                borrow_record.status = "returned-late"   
            db.session.commit()
            return borrow_record
        
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error updating borrow record: {str(e)}")
            raise
        
        
    def delete_borrow_record(self, record):
        try:
            db.session.delete(record)
            db.session.commit()
        
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error deleting borrow record: {str(e)}")
            raise
        
        
    def search_borrow_records(self, query) -> List[BorrowRecordModel]:
        try:
            search_results = []
            user_filters = (
                UserModel.name.ilike(f"%{query}%") |
                UserModel.email.ilike(f"%{query}%")
            )
            users = db.session.query(UserModel).filter(user_filters).all()
            if users:
                for user in users:
                    borrow_records_for_user_query = BorrowRecordModel.query.filter_by(user_id=user.id).all()
                    for record_for_user_query in borrow_records_for_user_query:
                        search_results.append(record_for_user_query)
            
            book_filters = BookModel.title.ilike(f"%{query}%")
            books = db.session.query(BookModel).filter(book_filters).all()
            if books:
                for book in books:
                    borrow_records_for_book_query = BorrowRecordModel.query.filter_by(book_id=book.id).all()
                    for record_for_book_query in borrow_records_for_book_query:
                        search_results.append(record_for_book_query)
                        
            return search_results

        except Exception as e:
            logging.error(f"Error searching borrow records: {str(e)}")
            raise