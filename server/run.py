from app import create_app
from app.data_initialization.initial_data import initialize_data

app = create_app()

if __name__ == "__main__":
    initialize_data()
    app.run(host="0.0.0.0", port=5000, debug=True)