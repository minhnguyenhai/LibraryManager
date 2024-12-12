import logging
from ...repository.book_repository import BookRepository, FavoriteRepository


class FavoriteService:
    def __init__(self):
        self.book_repository = BookRepository()
        self.favorite_repository = FavoriteRepository()
    
    
    def list_favorite_books(self, user_id):
        """ Fetch all favorite books for a user. """
        try:
            favorite_books = self.book_repository.list_favorite_books_of_user(user_id)
            return [book.as_dict() for book in favorite_books]
        
        except Exception as e:
            logging.error(f"Error while fetching favorite books: {str(e)}")
            raise
        
        
    def get_favorite_relationship(self, user_id, book_id):
        """ Fetch a favorite relationship between a user and a book. """
        return self.favorite_repository.get_favorite(user_id, book_id)


    def add_book_to_favorites(self, user_id, book_id):
        """ Add book to user's favorites. """
        try:
            self.favorite_repository.create_favorite(user_id, book_id)
            
        except Exception as e:
            logging.error(f"Error while adding book to favorites: {str(e)}")
            raise

        
    def remove_favorite_relationship(self, user_id, book_id):
        """ Remove a book from the user's favorites. """
        try:
            favorite_to_delete = self.favorite_repository.get_favorite(user_id, book_id)
            if not favorite_to_delete:
                return False
            
            self.favorite_repository.delete_favorite(favorite_to_delete)
            return True
            
        except Exception as e:
            logging.error(f"Error while removing favorite relationship: {str(e)}")
            raise