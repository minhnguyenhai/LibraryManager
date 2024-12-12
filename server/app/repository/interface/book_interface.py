from typing import List
from abc import ABC, abstractmethod
from ...models.book import Book as BookModel
from ...models.favorite import Favorite as FavoriteModel


class BookInterface(ABC):
    def __init__(self):
        pass
    
    @abstractmethod
    def count_total_books(self) -> int:
        pass
    
    @abstractmethod
    def count_new_books_from_day(self, day) -> int:
        pass
    
    @abstractmethod
    def count_books_by_borrowing_status(self, status) -> int:
        pass
    
    @abstractmethod
    def get_all_books(self) -> List[BookModel]:
        pass
    
    @abstractmethod
    def list_favorite_books_of_user(self, user_id) -> List[BookModel]:
        pass
    
    @abstractmethod
    def get_book_by_id(self, book_id) -> BookModel:
        pass
    
    @abstractmethod
    def get_book_by_title_author(self, title, author) -> BookModel:
        pass
    
    @abstractmethod
    def create_book(self, title, author, image_url, description, price, quantity) -> BookModel:
        pass
    
    @abstractmethod
    def update_book(self, book, data) -> BookModel:
        pass
    
    @abstractmethod
    def delete_book(self, book):
        pass
    
    @abstractmethod
    def search_books(self, query) -> List[BookModel]:
        pass
    
    
class FavoriteInterface(ABC):
    def __init__(self):
        pass
    
    @abstractmethod
    def get_all_favorites_of_user(self, user_id) -> List[FavoriteModel]:
        pass
    
    @abstractmethod
    def get_all_favorites_of_book(self, book_id) -> List[FavoriteModel]:
        pass
    
    @abstractmethod
    def get_favorite(self, user_id, book_id) -> FavoriteModel:
        pass
    
    @abstractmethod
    def create_favorite(self, user_id, book_id):
        pass
    
    @abstractmethod
    def delete_favorite(self, favorite):
        pass