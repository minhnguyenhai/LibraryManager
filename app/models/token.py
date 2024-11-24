import uuid
from typing import Optional
from datetime import datetime

from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app import db


class Token(db.Model):
    
    __tablename__ = "tokens"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    refresh_token: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    confirm_token: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    reset_token: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    verification_code: Mapped[Optional[str]] = mapped_column(String(6), nullable=True)
    reset_code: Mapped[Optional[str]] = mapped_column(String(6), nullable=True)
    verification_code_expiration: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    reset_code_expiration: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    user: Mapped["User"] = relationship("User", back_populates="token")