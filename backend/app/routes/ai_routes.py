from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from ..models.expense import Expense
from ..models.expense_split import ExpenseSplit
from ..routes.settlement_routes import calculate_balances
from ..models.user import User

ai_bp = Blueprint("ai", __name__)


# --------------------------------
# CUSTOM AI (LOGIC BASED)
# --------------------------------
@ai_bp.route("/custom/<int:group_id>", methods=["GET"])
@jwt_required()
def custom_explain(group_id):

    try:

        balances = calculate_balances(group_id)
        expenses = Expense.query.filter_by(group_id=group_id).all()

        explanation = "📊 Debt Explanation:\n\n"

        # Explain expenses
        for e in expenses:

            payer = User.query.get(e.paid_by)
            splits = ExpenseSplit.query.filter_by(expense_id=e.id).all()

            explanation += f"• {payer.name} paid ₹{e.amount} for {e.title}.\n"

            for s in splits:
                user = User.query.get(s.user_id)

                if user.id != payer.id:
                    explanation += f"  → {user.name} owes ₹{round(s.amount_owed,2)}\n"

            explanation += "\n"

        # Explain balances
        explanation += "💰 Final Balances:\n"

        for user_id, amount in balances.items():

            user = User.query.get(int(user_id))

            if amount > 0:
                explanation += f"• {user.name} should receive ₹{round(amount,2)}\n"
            elif amount < 0:
                explanation += f"• {user.name} owes ₹{round(-amount,2)}\n"

        explanation += "\n🔁 Debts are simplified to reduce number of transactions."

        return jsonify({
            "explanation": explanation
        })

    except Exception as e:
        print("CUSTOM AI ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


import requests
import os

# --------------------------------
# GEMINI AI EXPLANATION
# --------------------------------
@ai_bp.route("/gemini/<int:group_id>", methods=["GET"])
@jwt_required()
def gemini_explain(group_id):

    try:

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            return jsonify({
                "error": "Gemini API key not configured"
            }), 500

        balances = calculate_balances(group_id)
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

        prompt = f"""
Explain how debts were calculated and simplified.

Balances:
{balances}

Expenses:
{expense_data}

Explain clearly in simple terms.
"""

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"

        response = requests.post(
            url,
            json={
                "contents": [
                    {
                        "parts": [
                            {"text": prompt}
                        ]
                    }
                ]
            }
        )

        data = response.json()

        if "candidates" in data:
            explanation = data["candidates"][0]["content"]["parts"][0]["text"]
        else:
            print("GEMINI FULL RESPONSE:", data)
            return jsonify({
                "error": data
            }), 500

        return jsonify({
            "explanation": explanation
        })

    except Exception as e:
        print("GEMINI ERROR:", str(e))
        return jsonify({"error": str(e)}), 500