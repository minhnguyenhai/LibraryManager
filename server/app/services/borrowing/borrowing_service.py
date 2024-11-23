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
    
    
def get_borrow_record_by_id(borrow_record_id):
    """ Fetch a borrow record by its id. """
    try:
        borrow_record = BorrowRecord.query.get(borrow_record_id)
        if not borrow_record:
            return None
        return borrow_record.as_dict()
    except Exception as e:
        logging.error(f"Error while fetching borrow record by id: {str(e)}")
        raise
    
    
def save_new_borrow_record(user_id, book_id, quantity, borrow_date, due_date):
    """ Save a new borrow record to the database. """
    try:
        new_borrow_record = BorrowRecord(user_id, book_id, quantity, borrow_date, due_date)
        db.session.add(new_borrow_record)
        db.session.commit()
        return new_borrow_record
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error while saving new borrow record: {str(e)}")
        raise
    
    
def update_borrow_record_info(borrow_record, return_date):
    """ Update a borrow record in the database. """
    try:
        borrow_record.return_date = return_date
        db.session.commit()
        return borrow_record
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error while updating borrow record: {str(e)}")
        raise