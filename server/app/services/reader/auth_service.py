from datetime import datetime, timezone, timedelta
import jwt
import logging
import random

from werkzeug.security import check_password_hash

from app import db
from ...models.reader import Reader
from ...models.token import Token
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
        if not reader_id:
            logging.warning("Token missing required field: reader_id.")
            return None

        existing_token = db.session.execute(
            db.select(Token).where(Token.reader_id == reader_id)
        ).scalar()
        
        if existing_token is None or existing_token.refresh_token != token:
            return None
        
        return reader_id

    except jwt.ExpiredSignatureError:
        logging.warning("Refresh token expired.")
        return None
    except jwt.InvalidTokenError:
        logging.warning("Invalid refresh token.")
        return None
    except Exception as e:
        logging.error(f"Error verifying refresh token: {str(e)}")
        raise


def is_email_registered(email):
    """Checks if an email is already registered."""
    reader = db.session.execute(
        db.select(Reader).where(Reader.email == email)
    ).scalar()
    
    if reader:
        return True
    return False


def save_new_reader(email, password, name, dob, gender, address, phone_number):
    """Saves a new reader to the database."""
    new_reader = User(email, password, name, dob, gender, address, phone_number)
    db.session.add(new_reader)
    db.session.commit()
    return new_reader


def generate_verification_code(email):
    """Generates a verification code for a reader."""
    try:
        verification_code = "".join([str(random.randint(0, 9)) for _ in range(6)])
        token = db.session.execute(
            db.select(Token)
            .join(Reader, Reader.id == Token.reader_id)
            .where(Reader.email == email)
        ).scalar()
        
        if not token:
            new_token = Token(
                verification_code=verification_code,
                verification_code_expiration=datetime.now(tz=timezone.utc) + timedelta(minutes=10),
                reader_id=get_reader_by_email(email).id
            )
            db.session.add(new_token)
        else:
            token.verification_code = verification_code
            token.verification_code_expiration = datetime.now(tz=timezone.utc) + timedelta(minutes=10)
            
        db.session.commit()
        return verification_code
    
    except Exception as e:
        db.session.rollback() 
        logging.error(f"Error generating verification code: {str(e)}")
        raise


def generate_confirm_token(email, expires_in=3600):
    """Generates a confirmation token for the reader."""
    try:
        reader_id = get_reader_by_email(email).id
        payload = {
            "reader_id": reader_id,
            "exp":  datetime.now(tz=timezone.utc) + timedelta(seconds=expires_in)
        }
        new_confirm_token = jwt.encode(payload, secret_key, algorithm="HS256")
        
        existing_token = db.session.execute(
            db.select(Token).where(Token.reader_id == reader_id)
        ).scalar()
        
        if not existing_token:
            new_token = Token(confirm_token=new_confirm_token, reader_id=reader_id)
            db.session.add(new_token)
        else:
            existing_token.confirm_token = new_confirm_token
    
        db.session.commit()
        return new_confirm_token
    
    except jwt.PyJWTError as e:
        logging.error(f"JWT Error: {str(e)}")
        raise

    except Exception as e:
        db.session.rollback() 
        logging.error(f"Error generating confirm token: {str(e)}")
        raise


def is_verified(email):
    """Checks if a reader has been verified."""
    reader = db.session.execute(
        db.select(Reader).where(Reader.email == email)
    ).scalar()
    
    if reader and reader.is_verified:
        return True
    return False


def get_reader_by_email(email):
    """Retrieves a reader by email."""
    return db.session.execute(
        db.select(Reader).where(Reader.email == email)
    ).scalar()
    
    
def verify_code(confirm_token, verification_code):
    """Verifies the confirmation token and verification code."""
    try:
        payload = jwt.decode(confirm_token, secret_key, algorithms=["HS256"])
        reader_id = payload.get("reader_id")
        if not reader_id:
            logging.warning("Token missing required field: reader_id.")
            return None

        token = db.session.execute(
            db.select(Token).where(Token.reader_id == reader_id)
        ).scalar()
        
        if (
            token is None or token.confirm_token != confirm_token or
            token.verification_code != verification_code or
            token.verification_code_expiration < datetime.now(tz=timezone.utc)
        ):
            return None
        
        return db.session.execute(
            db.select(Reader).where(Reader.id == reader_id)
        ).scalar()
    
    except jwt.ExpiredSignatureError:
        logging.warning("Confirm token expired.")
        return None
    except jwt.InvalidTokenError:
        logging.warning("Invalid confirm token.")
        return None
    except Exception as e:
        logging.error(f"Error verifying code: {str(e)}")
        raise
    
    
def verify_email(email):
    """Verifies a reader's email."""
    try:
        reader = db.session.execute(
            db.select(Reader).where(Reader.email == email)
        ).scalar()
        
        if reader is None:
            return False
        
        reader.is_verified = True
        db.session.commit()
        return True
    
    except Exception as e:
        db.session.rollback() 
        logging.error(f"Error verifying email: {str(e)}")
        raise
    
    
def invalidate_token(token):
    """Invalidate the provided token by removing it from the database."""
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        reader_id = payload.get("reader_id")
        if not reader_id:
            logging.warning("Token missing required field: reader_id.")
            return False
        
        existing_token = db.session.execute(
            db.select(Token).where(Token.reader_id == reader_id)
        ).scalar()
        
        if not existing_token or existing_token.access_token != token:
            logging.warning("Invalid token.")
            return False

        existing_token.access_token = None
        existing_token.refresh_token = None
        db.session.commit()
        return True

    except jwt.ExpiredSignatureError:
        logging.warning("Token already expired.")
        return False
    except jwt.InvalidTokenError:
        logging.warning("Invalid token.")
        return False
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error invalidating token: {str(e)}")
        raise
    
    
def generate_reset_code(email):
    """Generates a reset password code for a reader."""
    try:
        reset_code = "".join([str(random.randint(0, 9)) for _ in range(6)])
        token = db.session.execute(
            db.select(Token)
            .join(Reader, Reader.id == Token.reader_id)
            .where(Reader.email == email)
        ).scalar()
        
        if not token:
            new_token = Token(
                reset_code=reset_code,
                reset_code_expiration=datetime.now(tz=timezone.utc) + timedelta(minutes=10),
                reader_id=get_reader_by_email(email).id
            )
            db.session.add(new_token)
        else:
            token.reset_code = reset_code
            token.reset_code_expiration = datetime.now(tz=timezone.utc) + timedelta(minutes=10)
            
        db.session.commit()
        return reset_code
    
    except Exception as e:
        db.session.rollback() 
        logging.error(f"Error generating reset code: {str(e)}")
        raise
    
    
def generate_reset_token(email, expires_in=1800):
    """Generates a reset password token for the reader."""
    try:
        reader_id = get_reader_by_email(email).id
        payload = {
            "reader_id": reader_id,
            "exp":  datetime.now(tz=timezone.utc) + timedelta(seconds=expires_in)
        }
        new_reset_token = jwt.encode(payload, secret_key, algorithm="HS256")
        
        existing_token = db.session.execute(
            db.select(Token).where(Token.reader_id == reader_id)
        ).scalar()
        
        if not existing_token:
            new_token = Token(reset_token=new_reset_token, reader_id=reader_id)
            db.session.add(new_token)
        else:
            existing_token.reset_token = new_reset_token
    
        db.session.commit()
        return new_reset_token
    
    except jwt.PyJWTError as e:
        logging.error(f"JWT Error: {str(e)}")
        raise

    except Exception as e:
        db.session.rollback() 
        logging.error(f"Error generating reset token: {str(e)}")
        raise