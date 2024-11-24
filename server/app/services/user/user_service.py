import logging
from app import db
from ...models.user import User
def list_users():
    """Fecth all from the db"""
    try:
        users_list = User.query.all()
        return [user.as_dict() for user in users_list]
    except Exception as e:
        logging.error(f"Error while fetching all user: {str(e)}")
        raise


def get_user_byId(user_id):
    """"Fecth a user by id"""
    try: 
        user = User.query.get(user_id)
        if not user:
            return None
        return user.as_dict()
    except Exception as e: 
        logging.error(f"Error while fetching user_id: {str(e)}")
        raise

def update_user_byId(user_id, data):
    """Change user information by Id"""
    try: 
        user = User.query.get(user_id)
        if not user:
            return None
       
        for key, value in data.items():
            setattr(user,key, value )
        db.session.commit()
        return  user.as_dict()
    except Exception as e:
        db.session.rollback()  # Hoàn tác nếu commit thất bại       
        logging.error(f"Error while updating user by ID: {str(e)}")
        raise  
    
def delete_user_byId(user_id):
    """Delete a user"""
    try:
        user = User.query.get(user_id)
        if not user:
            return "User does not exist"
        db.session.delete(user)
        db.session.commit()
        return( f"User with ID {user_id} has been deleted successfully.")
    except Exception as e: 
        db.session.rollback() 
        
        logging.error(f"Error while deleting user with ID {user_id}: {str(e)}")
        raise 
        