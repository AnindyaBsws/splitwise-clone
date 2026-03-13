from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from ..extensions.db import db
from ..models.user import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    # check required fields
    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # password length validation
    if len(password) < 4:
        return jsonify({"error": "Password must be at least 4 characters"}), 400

    # duplicate email check
    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"error": "Email already registered"}), 400

    user = User(
        name=name,
        email=email,
        password_hash=generate_password_hash(password)
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully"
    })


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    user = User.query.filter_by(email=data["email"]).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not check_password_hash(user.password_hash, data["password"]):
        return jsonify({"error": "Invalid password"}), 401

    token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "name": user.name,
            "email": user.email
        }
    )

    return jsonify({"token": token})


# --------------------------------
# Backend wake-up endpoint
# --------------------------------

@auth_bp.route("/ping", methods=["GET"])
def ping():
    return jsonify({"status": "awake"}), 200