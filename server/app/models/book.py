import uuid
from sqlalchemy import String, Integer, DateTime, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app import db

# Bảng trung gian để tạo mối quan hệ nhiều-nhiều giữa Book và Category
book_categories = Table(
    "book_categories",
    db.Model.metadata,
    db.Column("book_id", String(36), ForeignKey("books.id"), primary_key=True),
    db.Column("category_id", String(36), ForeignKey("categories.id"), primary_key=True),
)

class Book(db.Model):
    __tablename__ = "books"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    author: Mapped[str] = mapped_column(String(255), nullable=False)
    total_quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    available_quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Quan hệ nhiều-nhiều với Category qua bảng trung gian book_categories
    categories = relationship("Category", secondary=book_categories, back_populates="books")

    def __init__(self, name, author, total_quantity, available_quantity):
        self.name = name
        self.author = author
        self.total_quantity = total_quantity
        self.available_quantity = available_quantity

    def as_dict(self):
        return {c.name: str(getattr(self, c.name)) for c in self.__table__.columns}

class Category(db.Model):
    __tablename__ = "categories"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    # Quan hệ nhiều-nhiều với Book qua bảng trung gian book_categories
    books = relationship("Book", secondary=book_categories, back_populates="categories")
    
    def as_dict(self):
        return {c.name: str(getattr(self, c.name)) for c in self.__table__.columns}
