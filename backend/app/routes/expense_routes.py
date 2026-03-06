from flask import Blueprint, request, jsonify
from ..extensions.db import db
from ..models.expense import Expense
from ..models.expense_split import ExpenseSplit
from flask_jwt_extended import jwt_required


expense_bp = Blueprint("expenses", __name__)


@expense_bp.route("/", methods=["POST"])
@jwt_required()
def add_expense():

    data = request.json

    title = data.get("title")
    group_id = data.get("group_id")
    payer_id = data.get("payer_id")
    amount = data.get("amount")
    split_between = data.get("split_between")

    if not title or not group_id or not payer_id or not amount or not split_between:
        return jsonify({"error": "Missing required fields"}), 400

    # create expense
    expense = Expense(
        title=title,
        group_id=group_id,
        paid_by=payer_id,
        amount=amount
    )

    db.session.add(expense)
    db.session.commit()

    # equal split
    split_amount = amount / len(split_between)

    for user_id in split_between:
        split = ExpenseSplit(
            expense_id=expense.id,
            user_id=user_id,
            amount_owed=split_amount
        )

        db.session.add(split)

    db.session.commit()

    return jsonify({
        "message": "Expense added and split successfully",
        "expense_id": expense.id,
        "group_id": group_id
    })

@expense_bp.route("/group/<int:group_id>", methods=["GET"])
@jwt_required()
def get_group_expenses(group_id):

    expenses = Expense.query.filter_by(group_id=group_id).all()

    result = []

    for expense in expenses:

        splits = ExpenseSplit.query.filter_by(expense_id=expense.id).all()

        split_data = []

        for s in splits:
            split_data.append({
                "user_id": s.user_id,
                "amount_owed": s.amount_owed
            })

        result.append({
            "expense_id": expense.id,
            "title": expense.title,
            "amount": expense.amount,
            "paid_by": expense.paid_by,
            "splits": split_data
        })

    return jsonify(result)

@expense_bp.route("/<int:expense_id>", methods=["DELETE"])
@jwt_required()
def delete_expense(expense_id):

    expense = Expense.query.get(expense_id)

    if not expense:
        return jsonify({"error": "Expense not found"}), 404

    # delete splits first
    ExpenseSplit.query.filter_by(expense_id=expense_id).delete()

    db.session.delete(expense)
    db.session.commit()

    return jsonify({"message": "Expense deleted"})