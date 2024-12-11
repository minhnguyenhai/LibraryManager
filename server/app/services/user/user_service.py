import logging
from ...repository.user_repository import UserRepository
from ...repository.token_repository import TokenRepository
from ...repository.book_repository import FavoriteRepository
from ...repository.borrow_record_repository import BorrowRecordRepository


class UserService:
    def __init__(self):
        self.user_repository = UserRepository()
        self.token_repository = TokenRepository()
        self.favorite_repository = FavoriteRepository()
        self.borrow_record_repository = BorrowRecordRepository()
    
    
    def list_users(self):
        """Fecth all from the db"""
        try:
            users_list = self.user_repository.get_all_users()
            return [user.as_dict() for user in users_list]
        except Exception as e:
            logging.error(f"Error while fetching all user: {str(e)}")
            raise


    def is_admin(self, user):
        """Check if a user is an admin"""
        return user.role == "admin"
        

    def get_user_byId(self, user_id):
        """"Fecth a user by id"""
        return self.user_repository.get_user_by_id(user_id)


    def update_user_info(self, user, data):
        """Update user information"""
        try: 
            updated_user = self.user_repository.update_user_info(user, data)
            return updated_user.as_dict()
        
        except Exception as e:
            logging.error(f"Error while updating user: {str(e)}")
            raise  
        
        
    def delete_user_from_db(self, user):
        """Delete a user from the database"""
        try:
            status_borrowing_records = self.borrow_record_repository.list_borrow_records_of_user_by_status(user.id, "borrowing")
            if status_borrowing_records:
                return False
            
            token_to_delete = self.token_repository.get_token_by_user_id(user.id)
            self.token_repository.delete_token(token_to_delete)
            
            favorites_to_delete = self.favorite_repository.get_all_favorites_of_user(user.id)
            for favorite in favorites_to_delete:
                self.favorite_repository.delete_favorite(favorite)
            
            self.user_repository.delete_user(user)
            return True
            
        except Exception as e:  
            logging.error(f"Error while deleting user from database: {str(e)}")
            raise 


    def search_users_by_query(self, query):
        """Search users by a query string"""
        try:
            users = self.user_repository.search_users(query)
            users_data = [user.as_dict() for user in users]
            return users_data
        
        except Exception as e:
            logging.error(f"Error while searching users by query: {str(e)}")
            raise