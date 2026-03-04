from flask import Blueprint, request, jsonify
from ..extensions.db import db
from ..models.group import Group

group_bp = Blueprint("groups", __name__)

@group_bp.route("/", methods=["POST"])
def create_group():
    data = request.json

    group = Group(
        name=data["name"],
        created_by=data["created_by"]
    )

    db.session.add(group)
    db.session.commit()

    return jsonify({"message": "Group created"})