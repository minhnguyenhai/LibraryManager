import uuid
from datetime import date

from sqlalchemy import String, Date, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import generate_password_hash

from app import db


class User(db.Model):
    
    __tablename__ = "users"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    dob: Mapped[date] = mapped_column(Date, nullable=False)
    gender: Mapped[str] = mapped_column(String(10), nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(15), nullable=False)
    role: Mapped[str] = mapped_column(String(10), default="reader")
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    
    token: Mapped["Token"] = relationship("Token", uselist=False, back_populates="user")
    borrow_records: Mapped[list["BorrowRecord"]] = relationship(back_populates="user")

    
    def __init__(self, email, password, name, dob, gender, address, phone_number):
        self.email = email
        self.password_hash = generate_password_hash(password)
        self.name = name
        self.dob = dob
        self.gender = gender
        self.address = address
        self.phone_number = phone_number
    
    
    def as_dict(self):
        return {c.name: str(getattr(self, c.name)) for c in self.__table__.columns if c.name != "password_hash"}