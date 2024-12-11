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
        
        
    def list_borrow_records_of_user_by_status(self, user_id, status) -> List[BorrowRecordModel]:
        return db.session.execute(
            db.select(BorrowRecordModel).where(
                (BorrowRecordModel.user_id == user_id) & (BorrowRecordModel.status == status)
            )
        ).scalars().all()
        
        
    def list_borrow_records_of_book_by_status(self, book_id, status) -> List[BorrowRecordModel]:
        return db.session.execute(
            db.select(BorrowRecordModel).where(
                (BorrowRecordModel.book_id == book_id) & (BorrowRecordModel.status == status)
            )
        ).scalars().all()
        
        
    def get_borrow_record_by_id(self, borrow_record_id) -> BorrowRecordModel:
        return BorrowRecordModel.query.get(borrow_record_id)
    
    
    def create_borrow_record(self, user_id, book_id, quantity, borrow_date, due_date) -> BorrowRecordModel:
        try:
            user = UserModel.query.get(user_id)
            book = BookModel.query.get(book_id)
            new_borrow_record = BorrowRecordModel(
                user_name=user.name,
                user_email=user.email,
                book_title=book.title,
                quantity=quantity,
                borrow_date=borrow_date,
                due_date=due_date,
                user_id=user_id,
                book_id=book_id
            )
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
            filters = (
                BorrowRecordModel.user_name.ilike(f"%{query}%") |
                BorrowRecordModel.user_email.ilike(f"%{query}%") |
                BorrowRecordModel.book_title.ilike(f"%{query}%")
            )
            return db.session.query(BorrowRecordModel).filter(filters).all()

        except Exception as e:
            logging.error(f"Error searching borrow records: {str(e)}")
            raise