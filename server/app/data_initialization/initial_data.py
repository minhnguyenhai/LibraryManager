import json
from werkzeug.security import generate_password_hash
from app import create_app, db
from app.models.user import User


def load_admin_accounts_from_json():
    with open("app/data_initialization/admin_accounts.json", "r", encoding="utf-8") as file:
        data = json.load(file)
    return data


admin_accounts = load_admin_accounts_from_json()


def generate_admin_accounts_data():
    data = []
    for account in admin_accounts:
        admin_account = User(
            email=account["email"],
            password=account["password"],
            name=account["name"],
            dob=account["dob"],
            gender=account["gender"],
            address=account["address"],
            phone_number=account["phone_number"]
        )
        admin_account.role = "admin"
        admin_account.is_verified = True
        data.append(admin_account)

    return data


def initialize_data():
    app = create_app()
    with app.app_context():
        existed_admin = User.query.filter_by(role="admin").first()
        if not existed_admin:
            admin_accounts_data = generate_admin_accounts_data()
            db.session.bulk_save_objects(admin_accounts_data)
            db.session.commit()
            print(f"{len(admin_accounts_data)} admin accounts have been initialized.")
        else:
            print("Admin accounts already exist in the database.")