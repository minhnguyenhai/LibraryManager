import logging
from datetime import datetime
from app import db
from ...models.user import User

def get_user_statistic():
    """Fecth total number of users and new users in the current month"""
    try:
        today = datetime.today()
        first_day_of_month  = today.replace(day = 1)
        total_users = User.query.count()
        new_users_this_month = User.query.filter(User.dob >= first_day_of_month).count()
        return{
            "total_users": total_users,
            "new_users_this_month": new_users_this_month
        }
    except Exception as e:
        logging.error(f"Error while fetching user statistics: {str(e)}")
        raise