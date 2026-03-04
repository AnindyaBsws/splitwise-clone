from flask import Blueprint, request, jsonify
from ..extensions.db import db
from ..models.expense import Expense

expense_bp = Blueprint("expenses", __name__)

@expense_bp.route("/", methods=["POST"])
def add_expense():
    data = request.json

    expense = Expense(
        title=data["title"],
        amount=data["amount"],
        group_id=data["group_id"],
        paid_by=data["paid_by"]
    )

    db.session.add(expense)
    db.session.commit()

    return jsonify({"message": "Expense added"})