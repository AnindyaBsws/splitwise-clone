from flask import Blueprint, request, jsonify
from ..extensions.db import db
from ..models.expense import Expense
from ..models.expense_split import ExpenseSplit
from ..utils.demo_guard import block_demo_user
from flask_jwt_extended import jwt_required



expense_bp = Blueprint("expenses", __name__)


@expense_bp.route("/", methods=["POST"])
@jwt_required()
def add_expense():

    guard = block_demo_user()
    if guard:
        return guard

    data = request.json

    title = data.get("title")
    group_id = data.get("group_id")
    payer_id = data.get("payer_id")
    amount = data.get("amount")
    split_between = data.get("split_between")

    if not title or not group_id or not payer_id or not amount or not split_between:
        return jsonify({"error": "Missing required fields"}), 400

    # convert to float safely
    try:
        amount = float(amount)
    except:
        return jsonify({"error": "Invalid amount"}), 400

    if amount <= 0:
        return jsonify({"error": "Expense amount must be greater than 0"}), 400

    try:

        # create expense
        expense = Expense(
            title=title,
            group_id=group_id,
            paid_by=payer_id,
            amount=amount
        )

        db.session.add(expense)
        db.session.flush()  # ensures expense.id is available

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

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to add expense"}), 500

    return jsonify({
        "message": "Expense added and split successfully",
        "expense_id": expense.id,
        "group_id": group_id
    })

@expense_bp.route("/group/<int:group_id>", methods=["GET"])
@jwt_required()
def get_group_expenses(group_id):

    # Query all expenses in one go
    expenses = Expense.query.filter_by(group_id=group_id).all()

    if not expenses:
        return jsonify([])

    expense_ids = [e.id for e in expenses]

    # Query all splits for those expenses in one go
    splits = ExpenseSplit.query.filter(
        ExpenseSplit.expense_id.in_(expense_ids)
    ).all()

    # Organize splits by expense_id
    split_map = {}

    for s in splits:
        if s.expense_id not in split_map:
            split_map[s.expense_id] = []

        split_map[s.expense_id].append({
            "user_id": s.user_id,
            "amount_owed": s.amount_owed
        })

    result = []

    for expense in expenses:

        result.append({
            "expense_id": expense.id,
            "title": expense.title,
            "amount": expense.amount,
            "paid_by": expense.paid_by,
            "splits": split_map.get(expense.id, [])
        })

    return jsonify(result)


@expense_bp.route("/<int:expense_id>", methods=["DELETE"])
@jwt_required()
def delete_expense(expense_id):

    expense = Expense.query.get(expense_id)

    if not expense:
        return jsonify({"error": "Expense not found"}), 404

    group_id = expense.group_id

    # check balances
    from ..routes.group_routes import compute_balances
    balances = compute_balances(group_id)

    # if anyone still owes money → block deletion
    if any(balance != 0 for balance in balances.values()):
        return jsonify({
            "error": "Cannot delete expense until all settlements are done"
        }), 400

    # delete splits
    ExpenseSplit.query.filter_by(expense_id=expense_id).delete()

    # delete settlements of this group
    from ..models.settlement import Settlement
    Settlement.query.filter_by(group_id=group_id).delete()

    # delete expense
    db.session.delete(expense)
    db.session.commit()

    return jsonify({"message": "Expense deleted"})