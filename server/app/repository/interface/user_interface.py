from typing import List
from abc import ABC, abstractmethod
from ...models.user import User as UserModel


class UserInterface(ABC):
    def __init__(self):
        pass
    
    @abstractmethod
    def count_total_users(self) -> int:
        pass
    
    @abstractmethod
    def count_new_users_from_day(self, day) -> int:
        pass
    
    @abstractmethod
    def count_users_by_borrowing_status(self, status) -> int:
        pass
    
    @abstractmethod
    def get_all_users(self) -> List[UserModel]:
        pass
    
    @abstractmethod
    def get_user_by_id(self, user_id) -> UserModel:
        pass
    
    @abstractmethod
    def get_user_by_email(self, email) -> UserModel:
        pass
    
    @abstractmethod
    def create_new_user(self, email, password, name, dob, gender, address, phone_number) -> UserModel:
        pass
    
    @abstractmethod
    def update_verified_status(self, email, status) -> bool:
        pass
    
    @abstractmethod
    def update_password(self, user, new_password):
        pass
    
    @abstractmethod
    def update_user_info(self, user, data) -> UserModel:
        pass
    
    @abstractmethod
    def delete_user(self, user):
        pass
    
    @abstractmethod
    def search_users(self, query) -> List[UserModel]:
        pass