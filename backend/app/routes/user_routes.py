from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..models.expense import Expense
from ..models.expense_split import ExpenseSplit
from ..models.settlement import Settlement

user_bp = Blueprint("users", __name__)


@user_bp.route("/me/balances", methods=["GET"])
@jwt_required()
def user_balances():

    user_id = get_jwt_identity()

    balances = {}

    # expenses paid by user
    expenses = Expense.query.filter_by(paid_by=user_id).all()

    for expense in expenses:

        splits = ExpenseSplit.query.filter_by(expense_id=expense.id).all()

        for split in splits:

            if split.user_id != user_id:

                balances[split.user_id] = balances.get(split.user_id, 0) + split.amount_owed

    # expenses where user owes others
    splits = ExpenseSplit.query.filter_by(user_id=user_id).all()

    for split in splits:

        expense = Expense.query.get(split.expense_id)

        if expense.paid_by != user_id:

            balances[expense.paid_by] = balances.get(expense.paid_by, 0) - split.amount_owed

    # apply settlements
    settlements = Settlement.query.all()

    for s in settlements:

        if s.payer_id == user_id:
            balances[s.receiver_id] = balances.get(s.receiver_id, 0) - s.amount

        if s.receiver_id == user_id:
            balances[s.payer_id] = balances.get(s.payer_id, 0) + s.amount

    you_owe = []
    you_are_owed = []

    for user, amount in balances.items():

        if amount < 0:
            you_owe.append({
                "user_id": user,
                "amount": abs(amount)
            })

        elif amount > 0:
            you_are_owed.append({
                "user_id": user,
                "amount": amount
            })

    net_balance = sum(balances.values())

    return jsonify({
        "you_owe": you_owe,
        "you_are_owed": you_are_owed,
        "net_balance": net_balance
    })