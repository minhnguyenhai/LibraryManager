import uuid
from typing import Optional
from datetime import datetime

from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app import db


class Token(db.Model):
    
    __tablename__ = "tokens"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    access_token: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    refresh_token: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    confirm_token: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    reset_token: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    verification_code: Mapped[Optional[str]] = mapped_column(String(6), nullable=True)
    reset_code: Mapped[Optional[str]] = mapped_column(String(6), nullable=True)
    verification_code_expiration: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    reset_code_expiration: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    reader_id: Mapped[Optional[str]] = mapped_column(ForeignKey("readers.id"), unique=True, nullable=True)
    admin_id: Mapped[Optional[str]] = mapped_column(ForeignKey("admins.id"), unique=True, nullable=True)
    
    reader: Mapped["Reader"] = relationship("Reader", backref="token")
    admin: Mapped["Admin"] = relationship("Admin", backref="token")