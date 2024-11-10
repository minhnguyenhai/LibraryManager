from datetime import datetime, timezone, timedelta
import jwt
import logging

from werkzeug.security import check_password_hash

from app import db
from ...models.admin import Admin
from ...models.token import Token
from config import secret_key


def validate_login(username, password):
    """Validate the login credentials of a admin."""
    admin = db.session.execute(
        db.select(Admin).where(Admin.username == username)
    ).scalar()

    if admin is None or not check_password_hash(admin.password_hash, password):
        return None
    
    return admin


def generate_access_token(admin_id, expires_in=600):
    """Generate a new access token for the admin."""
    try:
        payload = {
            "admin_id": admin_id,
            "exp":  datetime.now(tz=timezone.utc) + timedelta(seconds=expires_in)
        }
        new_access_token = jwt.encode(payload, secret_key, algorithm="HS256")
        
        existing_token = db.session.execute(
            db.select(Token).where(Token.admin_id == admin_id)
        ).scalar()
        
        if not existing_token:
            new_token = Token(access_token=new_access_token, admin_id=admin_id)
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


def generate_refresh_token(admin_id, expires_in=2592000): 
    """Generate a new refresh token for the admin."""
    try:
        payload = {
            "admin_id": admin_id,
            "exp":  datetime.now(tz=timezone.utc) + timedelta(seconds=expires_in)
        }
        new_refresh_token = jwt.encode(payload, secret_key, algorithm="HS256")
        
        existing_token = db.session.execute(
            db.select(Token).where(Token.admin_id == admin_id)
        ).scalar()
        
        if not existing_token:
            new_token = Token(refresh_token=new_refresh_token, admin_id=admin_id)
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
        admin_id = payload.get("admin_id")
        if not admin_id:
            logging.warning("Token missing required field: admin_id.")
            return None

        existing_token = db.session.execute(
            db.select(Token).where(Token.admin_id == admin_id)
        ).scalar()
        
        if not existing_token or existing_token.refresh_token != token:
            return None
        
        return admin_id

    except jwt.ExpiredSignatureError:
        logging.warning("Refresh token expired.")
        return None
    except jwt.InvalidTokenError:
        logging.warning("Invalid refresh token.")
        return None
    except Exception as e:
        logging.error(f"Error verifying refresh token: {str(e)}")
        raise
    
    
def invalidate_token(token):
    """Invalidate the provided token by removing it from the database."""
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        admin_id = payload.get("admin_id")
        if not admin_id:
            logging.warning("Token missing required field: admin_id.")
            return False
        
        existing_token = db.session.execute(
            db.select(Token).where(Token.admin_id == admin_id)
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