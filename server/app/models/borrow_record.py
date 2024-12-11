import uuid
from datetime import date
from typing import Optional

from sqlalchemy import String, Integer, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app import db


class BorrowRecord(db.Model):
    
    __tablename__ = "borrow_records"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_name: Mapped[str] = mapped_column(String, nullable=False)
    user_email: Mapped[str] = mapped_column(String, nullable=False)
    book_title: Mapped[str] = mapped_column(String, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    borrow_date: Mapped[date] = mapped_column(Date, nullable=False)
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    return_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String(10), default="borrowing")
    user_id: Mapped[Optional[str]] = mapped_column(ForeignKey("users.id"), nullable=True)
    book_id: Mapped[Optional[str]] = mapped_column(ForeignKey("books.id"), nullable=True)
    
    user: Mapped["User"] = relationship(back_populates="borrow_records")
    book: Mapped["Book"] = relationship(back_populates="borrow_records")
    
    
    def __init__(self, user_id, book_id, quantity, borrow_date, due_date):
        self.user_id = user_id
        self.book_id = book_id
        self.quantity = quantity
        self.borrow_date = borrow_date
        self.due_date = due_date
        
        
    def as_dict(self):
        return {c.name: str(getattr(self, c.name)) for c in self.__table__.columns}  