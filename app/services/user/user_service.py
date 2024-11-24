import logging
from app import db
from ...models.user import User
def list_users(page = 1, per_page = 10):
    """Fecth all from the db"""
    try:
        pagination = User.query.paginate(page =page , per_page= per_page, error_out=False)
        users =  [user.as_dict() for user in pagination.items]
        return{
            "total_user":pagination.total,
            "total_page":pagination.pages,
            "current_page": pagination.page,
            "user": users
        }
          
            
            

    except Exception as e: 
        logging.error(f"Error while fetching all book: {str(e)}")
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
        if not data: 
            return "No changes"
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
        