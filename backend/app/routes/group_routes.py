from flask import Blueprint, request, jsonify
from ..extensions.db import db

from ..models.user import User
from ..models.group import Group
from ..models.group_member import GroupMember
from ..models.expense import Expense
from ..models.expense_split import ExpenseSplit
from ..models.settlement import Settlement

from flask_jwt_extended import jwt_required

from heapq import heappush, heappop

from datetime import datetime
from ..models.expense_history import ExpenseHistory



group_bp = Blueprint("groups", __name__)


# --------------------------------
# BALANCE COMPUTATION FUNCTION
# --------------------------------
def compute_balances(group_id):

    members = GroupMember.query.filter_by(group_id=group_id).all()

    # Initialize every member with 0
    balances = {m.user_id: 0 for m in members}

    expenses = Expense.query.filter_by(group_id=group_id).all()
    settlements = Settlement.query.filter_by(group_id=group_id).all()

    # -----------------------------
    # PROCESS EXPENSES
    # -----------------------------
    for expense in expenses:

        payer = expense.paid_by
        amount = expense.amount

        splits = ExpenseSplit.query.filter_by(expense_id=expense.id).all()

        balances[payer] += amount

        for split in splits:
            balances[split.user_id] -= split.amount_owed

    # -----------------------------
    # PROCESS SETTLEMENTS
    # -----------------------------
    for s in settlements:

        balances[s.payer_id] += s.amount
        balances[s.receiver_id] -= s.amount

    return balances


# --------------------------------
# CREATE GROUP
# --------------------------------
@group_bp.route("/", methods=["POST"])
@jwt_required()
def create_group():

    from flask_jwt_extended import get_jwt_identity

    data = request.json
    name = data["name"]
    members = data.get("members", [])

    creator_id = get_jwt_identity()

    # -------------------------
    # CREATE GROUP
    # -------------------------
    group = Group(
        name=name,
        created_by=creator_id
    )

    db.session.add(group)
    db.session.commit()

    # -------------------------
    # ADD CREATOR AS MEMBER
    # -------------------------
    creator_member = GroupMember(
        group_id=group.id,
        user_id=creator_id
    )

    db.session.add(creator_member)

    # -------------------------
    # ADD OTHER MEMBERS
    # -------------------------
    for member_id in members:

        # avoid duplicate if creator included
        if member_id == creator_id:
            continue

        member = GroupMember(
            group_id=group.id,
            user_id=member_id
        )

        db.session.add(member)

    db.session.commit()

    return jsonify({
        "message": "Group created",
        "id": group.id
    })


# --------------------------------
# GET GROUPS
# --------------------------------
@group_bp.route("", methods=["GET"])
@jwt_required()
def get_groups():

    groups = Group.query.all()

    result = []

    for g in groups:
        result.append({
            "id": g.id,
            "name": g.name,
            "created_by": g.created_by
        })

    return jsonify(result)

# --------------------------------
# GET SINGLE GROUP
# --------------------------------
@group_bp.route("/<int:group_id>", methods=["GET"])
@jwt_required()
def get_group(group_id):

    from ..models.user import User

    group = Group.query.get(group_id)

    if not group:
        return jsonify({"error": "Group not found"}), 404

    creator = User.query.get(group.created_by)

    return jsonify({
        "id": group.id,
        "name": group.name,
        "created_by": creator.name if creator else "Unknown",
        "created_at": group.created_at
    })


# --------------------------------
# ADD GROUP MEMBER
# --------------------------------
@group_bp.route("/<int:group_id>/members", methods=["POST"])
@jwt_required()
def add_member(group_id):

    data = request.json

    member = GroupMember(
        group_id=group_id,
        user_id=data["user_id"]
    )

    db.session.add(member)
    db.session.commit()

    return jsonify({"message": "Member added"})


# --------------------------------
# GET GROUP MEMBERS
# --------------------------------
@group_bp.route("/<int:group_id>/members", methods=["GET"])
@jwt_required()
def get_members(group_id):

    members = GroupMember.query.filter_by(group_id=group_id).all()

    result = []

    for m in members:

        user = User.query.get(m.user_id)

        if user:
            result.append({
                "user_id": user.id,
                "name": user.name,
                "email": user.email
            })

    return jsonify(result)


# --------------------------------
# GET BALANCES
# --------------------------------
@group_bp.route("/<int:group_id>/balances", methods=["GET"])
@jwt_required()
def get_balances(group_id):

    balances = compute_balances(group_id)

    return jsonify(balances)


# --------------------------------
# SIMPLIFY DEBTS (Splitwise Algorithm)
# --------------------------------
@group_bp.route("/<int:group_id>/simplify", methods=["GET"])
@jwt_required()
def simplify_debts(group_id):

    balances = compute_balances(group_id)

    creditors = []
    debtors = []

    for user, amount in balances.items():

        if amount > 0:
            heappush(creditors, (-amount, user))

        elif amount < 0:
            heappush(debtors, (amount, user))

    transactions = []

    while creditors and debtors:

        credit, creditor = heappop(creditors)
        debt, debtor = heappop(debtors)

        credit = -credit
        debt = -debt

        payment = min(credit, debt)

        transactions.append({
            "from": debtor,
            "to": creditor,
            "amount": payment
        })

        credit -= payment
        debt -= payment

        if credit > 0:
            heappush(creditors, (-credit, creditor))

        if debt > 0:
            heappush(debtors, (-debt, debtor))

    return jsonify(transactions)


# --------------------------------
# GET GROUP EXPENSES
# --------------------------------
@group_bp.route("/<int:group_id>/expenses", methods=["GET"])
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


# --------------------------------
# DELETE GROUP
# --------------------------------
@group_bp.route("/<int:group_id>", methods=["DELETE"])
@jwt_required()
def delete_group(group_id):

    group = Group.query.get(group_id)

    if not group:
        return jsonify({"error": "Group not found"}), 404

    db.session.delete(group)
    db.session.commit()

    return jsonify({"message": "Group deleted"})


# --------------------------------
# REMOVE MEMBER FROM GROUP
# --------------------------------
@group_bp.route("/<int:group_id>/members/<int:user_id>", methods=["DELETE"])
@jwt_required()
def remove_member(group_id, user_id):

    member = GroupMember.query.filter_by(
        group_id=group_id,
        user_id=user_id
    ).first()

    if not member:
        return jsonify({"error": "Member not found in group"}), 404

    db.session.delete(member)
    db.session.commit()

    return jsonify({"message": "Member removed from group"})



@group_bp.route("/<int:group_id>/clear-expenses", methods=["POST"])
@jwt_required()
def clear_current_expenses(group_id):

    from ..models.expense import Expense
    from ..models.expense_split import ExpenseSplit
    from ..models.settlement import Settlement
    from ..models.expense_history import ExpenseHistory

    # get balances
    balances = compute_balances(group_id)

    # block if debts still exist
    if any(b != 0 for b in balances.values()):
        return jsonify({
            "error": "Settle all debts before clearing expenses"
        }), 400

    # get all current expenses
    expenses = Expense.query.filter_by(group_id=group_id).all()

    # move expenses to history
    for expense in expenses:

        history = ExpenseHistory(
            title=expense.title,
            group_id=expense.group_id,
            paid_by=expense.paid_by,
            amount=expense.amount
        )

        db.session.add(history)

        # delete splits
        ExpenseSplit.query.filter_by(expense_id=expense.id).delete()

    # delete expenses
    Expense.query.filter_by(group_id=group_id).delete()

    # delete settlements
    Settlement.query.filter_by(group_id=group_id).delete()

    db.session.commit()

    return jsonify({
        "message": "Current expenses moved to history and cleared"
    })

@group_bp.route("/<int:group_id>/history", methods=["GET"])
@jwt_required()
def get_expense_history(group_id):

    histories = ExpenseHistory.query.filter_by(group_id=group_id).all()

    result = []

    for h in histories:

        result.append({
            "id": h.id,
            "title": h.title,
            "amount": h.amount,
            "paid_by": h.paid_by,
            "created_at": h.created_at
        })

    return jsonify(result)

@group_bp.route("/<int:group_id>/history", methods=["DELETE"])
@jwt_required()
def delete_expense_history(group_id):

    from flask_jwt_extended import get_jwt_identity
    from ..models.group import Group
    from ..models.expense_history import ExpenseHistory

    user_id = get_jwt_identity()

    group = Group.query.get(group_id)

    if not group:
        return jsonify({"error": "Group not found"}), 404

    # only group creator can delete history
    if group.created_by != user_id:
        return jsonify({
            "error": "Only group creator can delete expense history"
        }), 403

    ExpenseHistory.query.filter_by(group_id=group_id).delete()

    db.session.commit()

    return jsonify({
        "message": "Expense history deleted"
    })