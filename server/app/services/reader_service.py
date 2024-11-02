from datetime import datetime, timezone, timedelta
import jwt
import logging

from werkzeug.security import check_password_hash

from app import db
from ..models.reader import Reader
from ..models.token import Token
from config import secret_key


def validate_login(email, password):
    """Validate the login credentials of a reader."""
    reader = db.session.execute(
        db.select(Reader).where(Reader.email == email)
    ).scalar()

    if reader is None or not check_password_hash(reader.password_hash, password):
        return None
    
    return reader


def generate_access_token(reader_id, expires_in=600):
    """Generate a new access token for the reader."""
    try:
        payload = {
            "reader_id": reader_id,
            "exp":  datetime.now(tz=timezone.utc) + timedelta(seconds=expires_in)
        }
        new_access_token = jwt.encode(payload, secret_key, algorithm="HS256")
        
        existing_token = db.session.execute(
            db.select(Token).where(Token.reader_id == reader_id)
        ).scalar()
        
        if not existing_token:
            new_token = Token(access_token=new_access_token, reader_id=reader_id)
            db.session.add(new_token)
        else:
            existing_token.access_token = new_access_token
            
        db.session.commit()
        return new_access_token
    
    except jwt.PyJWTError as e:
        logging.error(f"JWT Error: {str(e)}")
        raise

    except Exception as e:
        db.session.rollback() 
        logging.error(f"Error generating access token: {str(e)}")
        raise


def generate_refresh_token(reader_id, expires_in=2592000): 
    """Generate a new refresh token for the reader."""
    try:
        payload = {
            "reader_id": reader_id,
            "exp":  datetime.now(tz=timezone.utc) + timedelta(seconds=expires_in)
        }
        new_refresh_token = jwt.encode(payload, secret_key, algorithm="HS256")
        
        existing_token = db.session.execute(
            db.select(Token).where(Token.reader_id == reader_id)
        ).scalar()
        
        if not existing_token:
            new_token = Token(refresh_token=new_refresh_token, reader_id=reader_id)
            db.session.add(new_token)
        else:
            existing_token.refresh_token = new_refresh_token
    
        db.session.commit()
        return new_refresh_token
    
    except jwt.PyJWTError as e:
        logging.error(f"JWT Error: {str(e)}")
        raise

    except Exception as e:
        db.session.rollback() 
        logging.error(f"Error generating access token: {str(e)}")
        raise


def verify_refresh_token(token):
    """Verify if the provided refresh token is valid and not expired."""
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        reader_id = payload.get("reader_id")
        existing_token = db.session.execute(
            db.select(Token).where(Token.reader_id == reader_id)
        ).scalar()
        
        if existing_token is None or existing_token.refresh_token != token:
            return None
        
        return reader_id

    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def is_email_registered(email):
    reader = db.session.execute(
        db.select(Reader).where(Reader.email == email)
    ).scalar()
    
    if reader:
        return True
    return False


def save_new_reader(email, password, name, dob, gender, address, phone_number):
    new_reader = User(email, password, name, dob, gender, address, phone_number)
    db.session.add(new_reader)
    db.session.commit()
    return new_reader


def generate_confirm_token(reader_id, expires_in=3600):
    payload = {
        "reader_id": reader_id,
        "exp":  datetime.now(tz=timezone.utc) + timedelta(seconds=expires_in)
    }
    token = jwt.encode(payload, secret_key, algorithm="HS256")
    return token