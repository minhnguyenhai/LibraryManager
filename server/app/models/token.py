import uuid
import Optional

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app import db
from app.models.reader import Reader

class Token(db.Model):
    
    __tablename__ = "tokens"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    access_token: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    refresh_token: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    reader_id: Mapped[Optional[str]] = mapped_column(ForeignKey("readers.id"), nullable=True)
    reader: Mapped[Optional[Reader]] = mapped_column(Reader, back_populates="token", nullable=True)