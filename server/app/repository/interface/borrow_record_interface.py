from typing import List
from abc import ABC, abstractmethod
from ...models.borrow_record import BorrowRecord as BorrowRecordModel


class BorrowRecordInterface(ABC):
    def __init__(self):
        pass
    
    @abstractmethod
    def get_all_borrow_records(self) -> List[BorrowRecordModel]:
        pass
    
    @abstractmethod
    def list_borrow_records_of_user(self, user_id) -> List[BorrowRecordModel]:
        pass
    
    @abstractmethod
    def list_borrow_records_of_user_by_status(self, user_id, status) -> List[BorrowRecordModel]:
        pass
    
    @abstractmethod
    def list_borrow_records_of_book_by_status(self, book_id, status) -> List[BorrowRecordModel]:
        pass
    
    @abstractmethod
    def get_borrow_record_by_id(self, borrow_record_id) -> BorrowRecordModel:
        pass
    
    @abstractmethod
    def create_borrow_record(self, user_id, book_id, quantity, borrow_date, due_date) -> BorrowRecordModel:
        pass
    
    @abstractmethod
    def update_borrow_record(self, borrow_record, return_date) -> BorrowRecordModel:
        pass
    
    @abstractmethod
    def delete_borrow_record(self, record):
        pass
    
    @abstractmethod
    def search_borrow_records(self, query) -> List[BorrowRecordModel]:
        pass