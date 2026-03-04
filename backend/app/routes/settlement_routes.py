from flask import Blueprint, request, jsonify
from ..extensions.db import db
from ..models.settlement import Settlement

settlement_bp = Blueprint("settlements", __name__)

@settlement_bp.route("/", methods=["POST"])
def settle():
    data = request.json

    settlement = Settlement(
        payer_id=data["payer_id"],
        receiver_id=data["receiver_id"],
        amount=data["amount"]
    )

    db.session.add(settlement)
    db.session.commit()

    return jsonify({"message": "Settlement recorded"})