import logging
from typing import List

from werkzeug.security import generate_password_hash
from sqlalchemy import func

from .. import db
from ..models.user import User as UserModel
from ..models.borrow_record import BorrowRecord as BorrowRecordModel
from .interface.user_interface import UserInterface


class UserRepository(UserInterface):
    def __init__(self):
        pass
    
    
    def count_total_users(self) -> int:
        return UserModel.query.filter(UserModel.role == "reader").count()
    
    
    def count_new_users_from_day(self, day) -> int:
        return UserModel.query.filter(
            UserModel.created_at >= day,
            UserModel.role == "reader"
        ).count()
    
    
    def count_users_by_borrowing_status(self, status) -> int:
        return db.session.query(func.count(func.distinct(BorrowRecordModel.user_id)))\
                            .filter(BorrowRecordModel.status == status)\
                            .scalar()
    
    
    def get_all_users(self) -> List[UserModel]:
        return db.session.execute(
            db.select(UserModel).where(UserModel.role == "reader")
        ).scalars().all()
    
    
    def get_user_by_id(self, user_id) -> UserModel:
        return db.session.execute(
            db.select(UserModel).where(UserModel.id == user_id)
        ).scalar()
    
    
    def get_user_by_email(self, email) -> UserModel:
        return db.session.execute(
            db.select(UserModel).where(UserModel.email == email)
        ).scalar()
    
    
    def create_new_user(self, email, password, name, dob, gender, address, phone_number) -> UserModel:
        try:
            new_user = UserModel(
                email=email,
                password=password,
                name=name,
                dob=dob,
                gender=gender,
                address=address,
                phone_number=phone_number
            )
            db.session.add(new_user)
            db.session.commit()
            return new_user
        
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error creating new user: {str(e)}")
            raise
        
        
    def update_verified_status(self, email, status) -> bool:
        try:
            user = self.get_user_by_email(email)
            if not user:
                return False
            
            user.is_verified = status
            db.session.commit()
            return True
        
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error updating user verified status: {str(e)}")
            raise
        
        
    def update_password(self, user, new_password):
        try:
            user.password_hash = generate_password_hash(new_password)
            db.session.commit()
        
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error updating user password: {str(e)}")
            raise
        
        
    def update_user_info(self, user, data) -> UserModel:
        try: 
            for key, value in data.items():
                setattr(user, key, value)
                
            db.session.commit()
            return user
        
        except Exception as e:
            db.session.rollback()  
            logging.error(f"Error updating user info: {str(e)}")
            raise
        
        
    def delete_user(self, user):
        try:
            db.session.delete(user)
            db.session.commit()
        
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error deleting user: {str(e)}")
            raise
        
        
    def search_users(self, query) -> List[UserModel]:
        try:
            filters = (
                UserModel.name.ilike(f"%{query}%") |
                UserModel.email.ilike(f"%{query}%") |
                UserModel.phone_number.ilike(f"%{query}%") |
                UserModel.address.ilike(f"%{query}%")
            )
            filters = filters & (UserModel.role == "reader")
            return db.session.query(UserModel).filter(filters).all()
        
        except Exception as e:
            logging.error(f"Error searching users: {str(e)}")
            raise