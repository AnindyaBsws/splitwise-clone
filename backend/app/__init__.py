from flask import Flask
from .config import Config
from .extensions.db import db
from .extensions.jwt import jwt
from flask_migrate import Migrate
from .routes.user_routes import user_bp
from .models.expense_history import ExpenseHistory
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ENABLE CORS HERE
    CORS(
        app,resources={r"/api/*": {"origins": "http://localhost:5173"}},
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

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(group_bp, url_prefix="/api/groups")
    app.register_blueprint(expense_bp, url_prefix="/api/expenses")
    app.register_blueprint(settlement_bp, url_prefix="/api/settlements")
    app.register_blueprint(user_bp, url_prefix="/api/users")

    return app