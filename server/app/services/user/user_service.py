import logging
from app import db
from ...models.user import User
from ...models.token import Token
from ...models.borrow_record import BorrowRecord


def list_users():
    """Fecth all from the db"""
    try:
        users_list = User.query.all()
        return [user.as_dict() for user in users_list]
    except Exception as e:
        logging.error(f"Error while fetching all user: {str(e)}")
        raise


def is_admin(user):
    """Check if a user is an admin"""
    return user.role == "admin"
    

def get_user_byId(user_id):
    """"Fecth a user by id"""
    try: 
        user = User.query.get(user_id)
        if not user:
            return None
        return user
    except Exception as e: 
        logging.error(f"Error while fetching user by ID: {str(e)}")
        raise


def update_user_info(user, data):
    """Update user information"""
    try: 
        for key, value in data.items():
            setattr(user, key, value)
        db.session.commit()
        return user.as_dict()
    except Exception as e:
        db.session.rollback()  
        logging.error(f"Error while updating user: {str(e)}")
        raise  
    
    
def delete_user_from_db(user):
    """Delete a user from the database"""
    try:
        token_to_delete = db.session.execute(
            db.select(Token).where(Token.user_id == user.id)
        ).scalar()
        db.session.delete(token_to_delete)
        
        borrow_records_to_delete = db.session.execute(
            db.select(BorrowRecord).where(BorrowRecord.user_id == user.id)
        ).scalars().all()
        db.session.delete(borrow_records_to_delete)
        
        db.session.delete(user)
        db.session.commit()
        
    except Exception as e: 
        db.session.rollback() 
        logging.error(f"Error while deleting user from database: {str(e)}")
        raise 
        