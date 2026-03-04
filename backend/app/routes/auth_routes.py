from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from ..extensions.db import db
from ..models.user import User

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    user = User(
        name=data["name"],
        email=data["email"],
        password_hash=generate_password_hash(data["password"])
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered"})


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    user = User.query.filter_by(email=data["email"]).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not check_password_hash(user.password_hash, data["password"]):
        return jsonify({"error": "Invalid password"}), 401

    token = create_access_token(identity=user.id)

    return jsonify({"token": token})