from flask import Blueprint, request, jsonify
from ..extensions.db import db
from ..models.settlement import Settlement
from ..models.expense import Expense
from ..models.expense_split import ExpenseSplit
from flask_jwt_extended import jwt_required


settlement_bp = Blueprint("settlements", __name__)


# --------------------------------
# HELPER: CALCULATE BALANCES
# --------------------------------
def calculate_balances(group_id):

    expenses = Expense.query.filter_by(group_id=group_id).all()
    settlements = Settlement.query.filter_by(group_id=group_id).all()

    balances = {}

    # EXPENSES
    for expense in expenses:

        payer = expense.paid_by
        amount = expense.amount

        splits = ExpenseSplit.query.filter_by(expense_id=expense.id).all()

        balances[payer] = balances.get(payer, 0) + amount

        for split in splits:

            user = split.user_id
            owed = split.amount_owed

            balances[user] = balances.get(user, 0) - owed

    # SETTLEMENTS
    for s in settlements:

        balances[s.payer_id] = balances.get(s.payer_id, 0) + s.amount
        balances[s.receiver_id] = balances.get(s.receiver_id, 0) - s.amount

    return balances


# --------------------------------
# CREATE SETTLEMENT
# --------------------------------
@settlement_bp.route("/", methods=["POST"])
@jwt_required()
def settle():

    data = request.json

    group_id = int(data.get("group_id"))
    payer_id = int(data.get("payer_id"))
    receiver_id = int(data.get("receiver_id"))
    amount = float(data.get("amount"))

    # validation
    if not group_id or not payer_id or not receiver_id or not amount:
        return jsonify({"error": "Missing required fields"}), 400

    if amount <= 0:
        return jsonify({"error": "Amount must be positive"}), 400

    if payer_id == receiver_id:
        return jsonify({"error": "Payer and receiver cannot be same"}), 400

    # --------------------------------
    # CHECK CURRENT BALANCE
    # --------------------------------
    balances = calculate_balances(group_id)

    payer_balance = balances.get(payer_id, 0)

    # payer must owe money
    if payer_balance >= 0:
        return jsonify({"error": "Payer does not owe money"}), 400

    # cannot pay more than owed
    if amount > abs(payer_balance):
        return jsonify({"error": "Amount exceeds what payer owes"}), 400


    # --------------------------------
    # CREATE SETTLEMENT
    # --------------------------------
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