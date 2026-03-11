from app import create_app
from app.extensions.db import db
from flask_migrate import upgrade
from flask_cors import CORS

app = create_app()

# Run migrations automatically on startup
with app.app_context():
    upgrade()

if __name__ == "__main__":
    app.run(debug=True)