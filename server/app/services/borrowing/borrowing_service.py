import logging

from app import db
from ...models.borrow_record import BorrowRecord


def get_all_borrow_records_of_user(user_id):
    """ Fetch all borrow records of a user. """
    try:
        borrow_records = BorrowRecord.query.filter_by(user_id=user_id).all()
        return [record.as_dict() for record in borrow_records]
    except Exception as e:
        logging.error(f"Error while fetching all borrow records of a user: {str(e)}")
        raise