from flask import Blueprint, request, jsonify
from ..extensions.db import db
from ..models.settlement import Settlement
from flask_jwt_extended import jwt_required


settlement_bp = Blueprint("settlements", __name__)


# --------------------------------
# CREATE SETTLEMENT
# --------------------------------
@settlement_bp.route("/", methods=["POST"])
@jwt_required()
def settle():

    data = request.json

    group_id = data.get("group_id")
    payer_id = data.get("payer_id")
    receiver_id = data.get("receiver_id")
    amount = data.get("amount")

    # validation
    if not group_id or not payer_id or not receiver_id or not amount:
        return jsonify({"error": "Missing required fields"}), 400

    if amount <= 0:
        return jsonify({"error": "Amount must be positive"}), 400

    if payer_id == receiver_id:
        return jsonify({"error": "Payer and receiver cannot be same"}), 400


    settlement = Settlement(
        group_id=group_id,
        payer_id=payer_id,
        receiver_id=receiver_id,
        amount=amount
    )

    db.session.add(settlement)
    db.session.commit()

    return jsonify({
        "message": "Settlement recorded",
        "settlement_id": settlement.id
    })


# --------------------------------
# GET GROUP SETTLEMENTS
# --------------------------------
@settlement_bp.route("/group/<int:group_id>", methods=["GET"])
@jwt_required()
def get_settlements(group_id):

    settlements = Settlement.query.filter_by(group_id=group_id).all()

    result = []

    for s in settlements:

        result.append({
            "id": s.id,
            "group_id": s.group_id,
            "payer_id": s.payer_id,
            "receiver_id": s.receiver_id,
            "amount": s.amount
        })

    return jsonify(result)