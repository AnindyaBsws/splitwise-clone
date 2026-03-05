from flask import Blueprint, request, jsonify
from ..extensions.db import db
from ..models.settlement import Settlement
from flask_jwt_extended import jwt_required


settlement_bp = Blueprint("settlements", __name__)

@settlement_bp.route("/", methods=["POST"])
def settle():
    data = request.json

    settlement = Settlement(
        group_id=data["group_id"],
        payer_id=data["payer_id"],
        receiver_id=data["receiver_id"],
        amount=data["amount"]
    )

    db.session.add(settlement)
    db.session.commit()

    return jsonify({"message": "Settlement recorded"})

@settlement_bp.route("/group/<int:group_id>", methods=["GET"])
@jwt_required()
def get_settlements(group_id):
    settlements = Settlement.query.filter_by(group_id=group_id).all()

    result = []
    for s in settlements:
        result.append({
            "id": s.id,
            "payer_id": s.payer_id,
            "receiver_id": s.receiver_id,
            "amount": s.amount
        })

    return jsonify(result)