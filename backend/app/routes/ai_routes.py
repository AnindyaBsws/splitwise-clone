from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
import os

from openai import OpenAI

from ..models.expense import Expense
from ..models.expense_split import ExpenseSplit
from ..routes.settlement_routes import calculate_balances

ai_bp = Blueprint("ai", __name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# --------------------------------
# AI EXPLAIN DEBTS
# --------------------------------
@ai_bp.route("/explain/<int:group_id>", methods=["GET"])
@jwt_required()
def explain_debts(group_id):

    try:

        # 1️⃣ Get balances
        balances = calculate_balances(group_id)

        # 2️⃣ Get expenses
        expenses = Expense.query.filter_by(group_id=group_id).all()

        expense_data = []

        for e in expenses:

            splits = ExpenseSplit.query.filter_by(expense_id=e.id).all()

            expense_data.append({
                "title": e.title,
                "amount": e.amount,
                "paid_by": e.paid_by,
                "splits": [
                    {
                        "user_id": s.user_id,
                        "amount": s.amount_owed
                    }
                    for s in splits
                ]
            })

        # 3️⃣ Build prompt
        prompt = f"""
You are a financial assistant explaining a Splitwise-style app.

Balances:
{balances}

Expenses:
{expense_data}

Explain clearly:
- Who owes whom
- Why each person owes money
- How debts were simplified

Use simple language like explaining to a beginner.
"""

        # 4️⃣ Call OpenAI
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You explain financial calculations clearly."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        explanation = response.choices[0].message.content

        return jsonify({
            "explanation": explanation
        })

    except Exception as e:
        print("AI ERROR:", str(e))
        return jsonify({"error": str(e)}), 500