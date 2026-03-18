from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from ..models.expense import Expense
from ..models.expense_split import ExpenseSplit
from ..routes.settlement_routes import calculate_balances
from ..models.user import User

import requests
import os

ai_bp = Blueprint("ai", __name__)

# 🔥 SIMPLE CACHE (VERY IMPORTANT FOR FREE TIER)
ai_cache = {}


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


# --------------------------------
# GEMINI AI EXPLANATION
# --------------------------------
@ai_bp.route("/gemini/<int:group_id>", methods=["GET"])
@jwt_required()
def gemini_explain(group_id):

    try:

        # 🔥 CACHE CHECK (CRITICAL)
        cache_key = f"gemini_{group_id}"

        if cache_key in ai_cache:
            print("⚡ CACHE HIT")
            return jsonify({
                "explanation": ai_cache[cache_key],
                "cached": True
            })

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            return jsonify({"error": "Gemini API key not configured"}), 500

        # --------------------------------
        # GET DATA
        # --------------------------------
        raw_balances = calculate_balances(group_id)

        balances = {}
        for user_id, amount in raw_balances.items():
            user = User.query.get(int(user_id))
            balances[user.name] = amount


        expenses = Expense.query.filter_by(group_id=group_id).all()

        expense_data = []

        for e in expenses:

            payer = User.query.get(e.paid_by)   # get payer name

            splits = ExpenseSplit.query.filter_by(expense_id=e.id).all()

            split_data = []

            for s in splits:
                user = User.query.get(s.user_id)

                split_data.append({
                    "user": user.name,                 
                    "amount": s.amount_owed
                })

            expense_data.append({
                "title": e.title,
                "amount": e.amount,
                "paid_by": payer.name,               
                "splits": split_data                 
            })

        # --------------------------------
        # PROMPT (CLEAN UI OUTPUT)
        # --------------------------------
        prompt = f"""
You are a financial assistant explaining a Splitwise-style expense system.

IMPORTANT:
- Use clean formatting
- Use headings and bullet points
- Keep explanation short but clear
- Do NOT use complex words

DATA:

Balances:
{balances}

Expenses:
{expense_data}

TASK:

1. Give a short summary of the situation
2. Explain who owes whom (bullet points)
3. Explain WHY each person owes money
4. Explain how debt simplification works

FORMAT STRICTLY LIKE THIS:

## Summary
...

## Who Owes Whom
- Person A → Person B: ₹X

## Why They Owe
- Reason...

## Simplification
- Explanation...

Keep it beginner-friendly.
"""

        # --------------------------------
        # GEMINI API CALL (FINAL WORKING)
        # --------------------------------
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": api_key
        }

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ]
        }

        response = requests.post(url, headers=headers, json=payload)

        data = response.json()

        print("GEMINI RAW RESPONSE:", data)

        # --------------------------------
        # ERROR HANDLING (IMPORTANT)
        # --------------------------------
        if "candidates" not in data:
            return jsonify({
                "error": "Gemini API failed",
                "details": data
            }), 500

        explanation = data["candidates"][0]["content"]["parts"][0]["text"]

        # 🔥 SAVE TO CACHE
        ai_cache[cache_key] = explanation

        return jsonify({
            "explanation": explanation,
            "cached": False
        })

    except Exception as e:
        print("GEMINI ERROR:", str(e))
        return jsonify({"error": str(e)}), 500