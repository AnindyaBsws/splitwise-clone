from flask import Flask
from .config import Config
from .extensions.db import db
from .extensions.jwt import jwt
from flask_migrate import Migrate
from .routes.user_routes import user_bp
from .models.group_invite import GroupInvite

# Import all models so Alembic can detect them
from .models.user import User
from .models.group import Group
from .models.group_member import GroupMember
from .models.expense import Expense
from .models.expense_split import ExpenseSplit
from .models.settlement import Settlement
from .models.expense_history import ExpenseHistory

from flask_cors import CORS

# NEW IMPORTS
from flask_migrate import upgrade
import threading


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:5173",
                    "https://splitwise-clone-liart.vercel.app"
                ]
            }
        },
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        supports_credentials=True
    )

    db.init_app(app)
    jwt.init_app(app)

    migrate = Migrate(app, db)

    from .routes.auth_routes import auth_bp
    from .routes.group_routes import group_bp
    from .routes.expense_routes import expense_bp
    from .routes.settlement_routes import settlement_bp
    from .routes.ai_routes import ai_bp


    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(group_bp, url_prefix="/api/groups")
    app.register_blueprint(expense_bp, url_prefix="/api/expenses")
    app.register_blueprint(settlement_bp, url_prefix="/api/settlements")
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")

    # RUN MIGRATIONS AFTER SERVER START
    def run_migrations():
        with app.app_context():
            upgrade()

    threading.Thread(target=run_migrations).start()

    return app