import uuid

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app import db


class Favorite(db.Model):
    
    __tablename__ = "favorites"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    book_id: Mapped[str] = mapped_column(ForeignKey("books.id"), nullable=False)
    
    user: Mapped["User"] = relationship(back_populates="favorites")
    book: Mapped["Book"] = relationship(back_populates="favorites")
    
    
    def __init__(self, user_id, book_id):
        self.user_id = user_id
        self.book_id = book_id
        
        
    def as_dict(self):
        return {c.name: str(getattr(self, c.name)) for c in self.__table__.columns}