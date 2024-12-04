from datetime import datetime, timezone, timedelta
import jwt
import logging
import random

from werkzeug.security import generate_password_hash, check_password_hash

from app import db
from ...models.user import User
from ...models.token import Token
from config import secret_key


def validate_login(email, password):
    """Validate the login credentials of a user."""
    user = db.session.execute(
        db.select(User).where(User.email == email)
    ).scalar()

    if user is None or not check_password_hash(user.password_hash, password):
        return None
    
    return user


def generate_access_token(user_id, expires_in=300):
    """Generate a new access token for the user."""
    try:
        payload = {
            "user_id": user_id,
            "exp":  datetime.now(tz=timezone.utc) + timedelta(seconds=expires_in)
        }
        new_access_token = jwt.encode(payload, secret_key, algorithm="HS256")
        return new_access_token
    
    except jwt.PyJWTError as e:
        logging.error(f"JWT Error: {str(e)}")
        raise

    except Exception as e:
        logging.error(f"Error generating access token: {str(e)}")
        raise


def generate_refresh_token(user_id, expires_in=2592000): 
    """Generate a new refresh token for the user."""
    try:
        payload = {
            "user_id": user_id,
            "exp":  datetime.now(tz=timezone.utc) + timedelta(seconds=expires_in)
        }
        new_refresh_token = jwt.encode(payload, secret_key, algorithm="HS256")
        
        existing_token = db.session.execute(
            db.select(Token).where(Token.user_id == user_id)
        ).scalar()
        
        if not existing_token:
            new_token = Token(refresh_token=new_refresh_token, user_id=user_id)
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
    
    
def verify_access_token(token):
    """Verify if the provided access token is valid and not expired."""
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if not user_id:
            logging.warning("Token missing required field: user_id.")
            return None

        return user_id

    except jwt.ExpiredSignatureError:
        logging.warning("Access token expired.")
        return None
    except jwt.InvalidTokenError:
        logging.warning("Invalid access token.")
        return None
    except Exception as e:
        logging.error(f"Error verifying access token: {str(e)}")
        raise


def verify_refresh_token(token):
    """Verify if the provided refresh token is valid and not expired."""
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if not user_id:
            logging.warning("Token missing required field: user_id.")
            return None

        existing_token = db.session.execute(
            db.select(Token).where(Token.user_id == user_id)
        ).scalar()
        
        if not existing_token or existing_token.refresh_token != token:
            return None
        
        return user_id

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
    user = db.session.execute(
        db.select(User).where(User.email == email)
    ).scalar()
    
    if user:
        return True
    return False


def save_new_user(email, password, name, dob, gender, address, phone_number):
    """Saves a new user to the database."""
    new_user = User(email, password, name, dob, gender, address, phone_number)
    db.session.add(new_user)
    db.session.commit()
    return new_user


def generate_verification_code(email):
    """Generates a verification code for a user."""
    try:
        verification_code = "".join([str(random.randint(0, 9)) for _ in range(6)])
        token = db.session.execute(
            db.select(Token)
            .join(User, User.id == Token.user_id)
            .where(User.email == email)
        ).scalar()
        
        if not token:
            new_token = Token(
                verification_code=verification_code,
                verification_code_expiration=datetime.now(tz=timezone.utc) + timedelta(minutes=10),
                user_id=get_user_by_email(email).id
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
    """Generates a confirmation token for the user."""
    try:
        user_id = get_user_by_email(email).id
        payload = {
            "user_id": user_id,
            "exp":  datetime.now(tz=timezone.utc) + timedelta(seconds=expires_in)
        }
        new_confirm_token = jwt.encode(payload, secret_key, algorithm="HS256")
        
        existing_token = db.session.execute(
            db.select(Token).where(Token.user_id == user_id)
        ).scalar()
        
        if not existing_token:
            new_token = Token(confirm_token=new_confirm_token, user_id=user_id)
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
    """Checks if a user has been verified."""
    user = db.session.execute(
        db.select(User).where(User.email == email)
    ).scalar()
    
    if user and user.is_verified:
        return True
    return False


def get_user_by_email(email):
    """Retrieves a user by email."""
    return db.session.execute(
        db.select(User).where(User.email == email)
    ).scalar()
    
    
def verify_verification_code(confirm_token, verification_code):
    """Verifies the confirmation token and verification code."""
    try:
        payload = jwt.decode(confirm_token, secret_key, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if not user_id:
            logging.warning("Token missing required field: user_id.")
            return None

        token = db.session.execute(
            db.select(Token).where(Token.user_id == user_id)
        ).scalar()
        
        if (
            token is None or token.confirm_token != confirm_token or
            token.verification_code != verification_code or
            token.verification_code_expiration < datetime.now(tz=timezone.utc)
        ):
            return None
        
        return db.session.execute(
            db.select(User).where(User.id == user_id)
        ).scalar()
    
    except jwt.ExpiredSignatureError:
        logging.warning("Confirm token expired.")
        return None
    except jwt.InvalidTokenError:
        logging.warning("Invalid confirm token.")
        return None
    except Exception as e:
        logging.error(f"Error verifying verification code: {str(e)}")
        raise
    
    
def verify_user_email(email):
    """Verifies a user's email."""
    try:
        user = db.session.execute(
            db.select(User).where(User.email == email)
        ).scalar()
        
        if user is None:
            return False
        
        user.is_verified = True
        db.session.commit()
        return True
    
    except Exception as e:
        db.session.rollback() 
        logging.error(f"Error verifying email: {str(e)}")
        raise
    
    
def invalidate_refresh_token(user_id):
    """Invalidate a user's refresh token."""
    try:
        existing_token = db.session.execute(
            db.select(Token).where(Token.user_id == user_id)
        ).scalar()
        
        if not existing_token:
            logging.warning("Invalid token.")
            return False

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
    """Generates a reset password code for a user."""
    try:
        reset_code = "".join([str(random.randint(0, 9)) for _ in range(6)])
        token = db.session.execute(
            db.select(Token)
            .join(User, User.id == Token.user_id)
            .where(User.email == email)
        ).scalar()
        
        if not token:
            new_token = Token(
                reset_code=reset_code,
                reset_code_expiration=datetime.now(tz=timezone.utc) + timedelta(minutes=10),
                user_id=get_user_by_email(email).id
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
    """Generates a reset password token for the user."""
    try:
        user_id = get_user_by_email(email).id
        payload = {
            "user_id": user_id,
            "exp":  datetime.now(tz=timezone.utc) + timedelta(seconds=expires_in)
        }
        new_reset_token = jwt.encode(payload, secret_key, algorithm="HS256")
        
        existing_token = db.session.execute(
            db.select(Token).where(Token.user_id == user_id)
        ).scalar()
        
        if not existing_token:
            new_token = Token(reset_token=new_reset_token, user_id=user_id)
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
    
    
def verify_reset_code(reset_token, reset_code):
    """Verifies the reset password token and reset password code."""
    try:
        payload = jwt.decode(reset_token, secret_key, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if not user_id:
            logging.warning("Token missing required field: user_id.")
            return None

        token = db.session.execute(
            db.select(Token).where(Token.user_id == user_id)
        ).scalar()
        
        if (
            token is None or token.reset_token != reset_token or
            token.reset_code != reset_code or
            token.reset_code_expiration < datetime.now(tz=timezone.utc)
        ):
            return None
        
        return db.session.execute(
            db.select(User).where(User.id == user_id)
        ).scalar()
    
    except jwt.ExpiredSignatureError:
        logging.warning("Reset token expired.")
        return None
    except jwt.InvalidTokenError:
        logging.warning("Invalid reset token.")
        return None
    except Exception as e:
        logging.error(f"Error verifying reset code: {str(e)}")
        raise
    
    
def set_password(user_id, new_password):
    """Set a new password for the user."""
    try:
        user = db.session.execute(
            db.select(User).where(User.id == user_id)
        ).scalar()

        if user is None:
            return False
        
        user.password_hash = generate_password_hash(new_password)
        db.session.commit()
        return True
    
    except Exception as e:
        db.session.rollback() 
        logging.error(f"Error setting password: {str(e)}")
        raise