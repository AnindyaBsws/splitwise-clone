from flask import Blueprint, request, jsonify
from ..extensions.db import db

from ..models.user import User
from ..models.group import Group
from ..models.group_member import GroupMember
from ..models.expense import Expense
from ..models.expense_split import ExpenseSplit
from ..models.settlement import Settlement
from ..models.expense_history import ExpenseHistory
from ..models.group_invite import GroupInvite

from ..routes.settlement_routes import calculate_balances

from flask_jwt_extended import jwt_required, get_jwt_identity

from heapq import heappush, heappop


group_bp = Blueprint("groups", __name__)


# --------------------------------
# CREATE GROUP
# --------------------------------
@group_bp.route("/", methods=["POST"])
@jwt_required()
def create_group():

    data = request.json
    name = data["name"]
    members = data.get("members", [])

    creator_id = get_jwt_identity()

    group = Group(
        name=name,
        created_by=creator_id
    )

    db.session.add(group)
    db.session.commit()

    creator_member = GroupMember(
        group_id=group.id,
        user_id=creator_id,
        role="creator"
    )

    db.session.add(creator_member)

    for member_id in members:

        if member_id == creator_id:
            continue

        member = GroupMember(
            group_id=group.id,
            user_id=member_id,
            role="member"
        )

        db.session.add(member)

    db.session.commit()

    return jsonify({
        "message": "Group created",
        "id": group.id
    })


# --------------------------------
# GET GROUPS (ONLY USER'S GROUPS)
# --------------------------------
@group_bp.route("", methods=["GET"])
@jwt_required()
def get_groups():

    user_id = int(get_jwt_identity())

    memberships = GroupMember.query.filter_by(user_id=user_id).all()

    group_ids = [m.group_id for m in memberships]

    if not group_ids:
        return jsonify([])

    groups = Group.query.filter(Group.id.in_(group_ids)).all()

    result = []

    for group in groups:

        member_count = GroupMember.query.filter_by(group_id=group.id).count()

        result.append({
            "id": group.id,
            "name": group.name,
            "created_by": group.created_by,
            "memberCount": member_count
        })

    return jsonify(result)


# --------------------------------
# GET SINGLE GROUP
# --------------------------------
@group_bp.route("/<int:group_id>", methods=["GET"])
@jwt_required()
def get_group(group_id):

    group = Group.query.get(group_id)

    if not group:
        return jsonify({"error": "Group not found"}), 404

    creator = User.query.get(group.created_by)

    return jsonify({
        "id": group.id,
        "name": group.name,
        "created_by": group.created_by,
        "creator_name": creator.name,
        "created_at": group.created_at
    })

# --------------------------------
# ADD MEMBER BY USER TAG
# --------------------------------
@group_bp.route("/<int:group_id>/add-by-tag", methods=["POST"])
@jwt_required()
def add_member_by_tag(group_id):

    requester_id = int(get_jwt_identity())

    data = request.json
    user_tag = data.get("user_tag")

    if not user_tag:
        return jsonify({"error": "User tag is required"}), 400

    group = Group.query.get(group_id)

    if not group:
        return jsonify({"error": "Group not found"}), 404

    requester_member = GroupMember.query.filter_by(
        group_id=group_id,
        user_id=requester_id
    ).first()

    if not requester_member:
        return jsonify({"error": "You are not a member of this group"}), 403

    if requester_member.role not in ["creator", "admin"]:
        return jsonify({"error": "Only creator or admin can add members"}), 403

    # find user by tag
    user = User.query.filter_by(user_tag=user_tag).first()

    if not user:
        return jsonify({"error": "User tag not found"}), 404

    # prevent adding self
    if user.id == requester_id:
        return jsonify({"error": "You cannot add yourself"}), 400

    existing_member = GroupMember.query.filter_by(
        group_id=group_id,
        user_id=user.id
    ).first()

    if existing_member:
        return jsonify({"error": "User already in group"}), 400

    member = GroupMember(
        group_id=group_id,
        user_id=user.id,
        role="member"
    )

    db.session.add(member)
    db.session.commit()

    return jsonify({
        "message": f"{user.name} added successfully"
    })


import os

# --------------------------------
# GENERATE GROUP INVITE LINK
# --------------------------------
@group_bp.route("/<int:group_id>/invite", methods=["POST"])
@jwt_required()
def generate_invite_link(group_id):

    requester_id = int(get_jwt_identity())

    group = Group.query.get(group_id)

    if not group:
        return jsonify({"error": "Group not found"}), 404

    requester_member = GroupMember.query.filter_by(
        group_id=group_id,
        user_id=requester_id
    ).first()

    if not requester_member:
        return jsonify({"error": "You are not a member"}), 403

    if requester_member.role not in ["creator", "admin"]:
        return jsonify({
            "error": "Only creator or admin can generate invite links"
        }), 403

    from ..models.group_invite import GroupInvite

    token = GroupInvite.generate_token()

    invite = GroupInvite(
        group_id=group_id,
        token=token,
        created_by=requester_id
    )

    db.session.add(invite)
    db.session.commit()

    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

    invite_link = f"{FRONTEND_URL}/join/group/{token}"

    return jsonify({
        "invite_link": invite_link
    })


# --------------------------------
# JOIN GROUP USING INVITE TOKEN
# --------------------------------
@group_bp.route("/join/<token>", methods=["POST"])
@jwt_required()
def join_group_by_invite(token):

    user_id = int(get_jwt_identity())

    from ..models.group_invite import GroupInvite

    invite = GroupInvite.query.filter_by(
        token=token,
        is_active=True
    ).first()

    if not invite:
        return jsonify({"error": "Invalid or expired invite"}), 404

    group_id = invite.group_id

    existing_member = GroupMember.query.filter_by(
        group_id=group_id,
        user_id=user_id
    ).first()

    # If already a member → just return group id
    if existing_member:
        return jsonify({
            "message": "Already a member",
            "group_id": group_id
        })

    member = GroupMember(
        group_id=group_id,
        user_id=user_id,
        role="member"
    )

    db.session.add(member)
    db.session.commit()

    return jsonify({
        "message": "Joined group successfully",
        "group_id": group_id
    })


# --------------------------------
# INVITE PREVIEW
# --------------------------------
@group_bp.route("/invite/<token>", methods=["GET"])
def preview_invite(token):

    from ..models.group_invite import GroupInvite

    invite = GroupInvite.query.filter_by(
        token=token,
        is_active=True
    ).first()

    if not invite:
        return jsonify({"error": "Invalid invite link"}), 404

    group = Group.query.get(invite.group_id)

    members = GroupMember.query.filter_by(
        group_id=group.id
    ).all()

    member_list = []

    for m in members:

        user = User.query.get(m.user_id)

        if user:
            member_list.append({
                "id": user.id,
                "name": user.name
            })

    creator = User.query.get(group.created_by)

    return jsonify({
        "group_id": group.id,
        "group_name": group.name,
        "creator": creator.name if creator else "Unknown",
        "members": member_list
    })



# --------------------------------
# ADD GROUP MEMBER
# --------------------------------
@group_bp.route("/<int:group_id>/members", methods=["POST"])
@jwt_required()
def add_member(group_id):

    requester_id = int(get_jwt_identity())
    data = request.json
    user_to_add = data["user_id"]

    group = Group.query.get(group_id)

    if not group:
        return jsonify({"error": "Group not found"}), 404

    # Check requester membership
    requester_member = GroupMember.query.filter_by(
        group_id=group_id,
        user_id=requester_id
    ).first()

    if not requester_member:
        return jsonify({"error": "You are not a member of this group"}), 403

    # Authorization: only creator or admin can add members
    if requester_member.role not in ["creator", "admin"]:
        return jsonify({
            "error": "Only creator or admin can add members"
        }), 403

    # Prevent duplicate membership
    existing_member = GroupMember.query.filter_by(
        group_id=group_id,
        user_id=user_to_add
    ).first()

    if existing_member:
        return jsonify({
            "error": "User already exists in this group"
        }), 400

    member = GroupMember(
        group_id=group_id,
        user_id=user_to_add,
        role="member"
    )

    db.session.add(member)
    db.session.commit()

    return jsonify({"message": "Member added successfully"})


# --------------------------------
# GET GROUP MEMBERS
# --------------------------------
@group_bp.route("/<int:group_id>/members", methods=["GET"])
@jwt_required()
def get_members(group_id):

    group = Group.query.get(group_id)

    members = GroupMember.query.filter_by(group_id=group_id).all()

    result = []

    for m in members:

        user = User.query.get(m.user_id)

        if user:

            role = m.role

            # Force creator role
            if user.id == group.created_by:
                role = "creator"

            result.append({
                "user_id": user.id,
                "name": user.name,
                "email": user.email,
                "role": role
            })

    return jsonify(result)

# --------------------------------
# GET TOTAL EXPENSE
# --------------------------------
@group_bp.route("/<int:group_id>/total-expense", methods=["GET"])
@jwt_required()
def get_total_expense(group_id):

    group = Group.query.get(group_id)

    if not group:
        return jsonify({"error": "Group not found"}), 404

    return jsonify({
        "total_expense": group.total_expense or 0
    })

# --------------------------------
# RESET TOTAL EXPENSE (CREATOR + ADMIN)
# --------------------------------
@group_bp.route("/<int:group_id>/reset-total-expense", methods=["POST"])
@jwt_required()
def reset_total_expense(group_id):

    requester_id = int(get_jwt_identity())

    group = Group.query.get(group_id)

    if not group:
        return jsonify({"error": "Group not found"}), 404

    # check membership
    member = GroupMember.query.filter_by(
        group_id=group_id,
        user_id=requester_id
    ).first()

    if not member:
        return jsonify({"error": "You are not a member"}), 403

    # 🔥 allow BOTH creator + admin
    if member.role not in ["creator", "admin"]:
        return jsonify({
            "error": "Only creator or admin can reset total expense"
        }), 403

    # reset
    group.total_expense = 0
    db.session.commit()

    return jsonify({
        "message": "Total expense reset successfully"
    })

# --------------------------------
# GET BALANCES
# --------------------------------
@group_bp.route("/<int:group_id>/balances", methods=["GET"])
@jwt_required()
def get_balances(group_id):

    balances = calculate_balances(group_id)

    return jsonify(balances)


# --------------------------------
# SIMPLIFY DEBTS
# --------------------------------
@group_bp.route("/<int:group_id>/simplify", methods=["GET"])
@jwt_required()
def simplify_debts(group_id):

    balances = calculate_balances(group_id)

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

    requester_id = int(get_jwt_identity())

    try:

        group = Group.query.get(group_id)

        if not group:
            return jsonify({"error": "Group not found"}), 404

        if group.created_by != requester_id:
            return jsonify({
                "error": "Only group creator can delete the group"
            }), 403

        balances = calculate_balances(group_id)

        if any(balance != 0 for balance in balances.values()):
            return jsonify({
                "error": "All debts must be settled before deleting the group"
            }), 400

        # -------------------------------
        # DELETE ALL RELATED DATA
        # -------------------------------

        # ✅ FIX: delete invites FIRST (new bug)
        GroupInvite.query.filter_by(group_id=group_id).delete()

        # settlements
        Settlement.query.filter_by(group_id=group_id).delete()

        # expense splits + expenses
        expenses = Expense.query.filter_by(group_id=group_id).all()
        for expense in expenses:
            ExpenseSplit.query.filter_by(expense_id=expense.id).delete()

        Expense.query.filter_by(group_id=group_id).delete()

        # history
        ExpenseHistory.query.filter_by(group_id=group_id).delete()

        # members
        GroupMember.query.filter_by(group_id=group_id).delete()

        # delete group
        db.session.delete(group)

        db.session.commit()

        return jsonify({
            "message": "Group deleted successfully"
        })

    except Exception as e:
        print("DELETE GROUP ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


# --------------------------------
# REMOVE MEMBER
# --------------------------------
@group_bp.route("/<int:group_id>/members/<int:user_id>", methods=["DELETE"])
@jwt_required()
def remove_member(group_id, user_id):

    requester_id = int(get_jwt_identity())

    group = Group.query.get(group_id)

    if not group:
        return jsonify({"error": "Group not found"}), 404

    requester_member = GroupMember.query.filter_by(
        group_id=group_id,
        user_id=requester_id
    ).first()

    if not requester_member:
        return jsonify({
            "error": "You are not a member of this group"
        }), 403
    
    if requester_member.role not in ["creator", "admin"]:
        return jsonify({
            "error": "Only creator or admin can remove members"
        }), 403

    if user_id == group.created_by:
        return jsonify({
            "error": "Group creator cannot be removed"
        }), 400

    member = GroupMember.query.filter_by(
        group_id=group_id,
        user_id=user_id
    ).first()

    if not member:
        return jsonify({
            "error": "Member not found in group"
        }), 404

    balances = calculate_balances(group_id)

    member_balance = balances.get(user_id, 0)

    if abs(member_balance) > 0.01:

        user = User.query.get(user_id)

        return jsonify({
            "name": user.name,
            "email": user.email,
            "balance": member_balance,
            "status": "Debts not cleared, Removal not possible"
        }), 400

    db.session.delete(member)
    db.session.commit()

    return jsonify({
        "message": "Member removed successfully"
    })

# --------------------------------
# LEAVE GROUP (FOR MEMBERS AND ADMINS)
# --------------------------------
@group_bp.route("/<int:group_id>/leave", methods=["POST"])
@jwt_required()
def leave_group(group_id):

    user_id = int(get_jwt_identity())

    group = Group.query.get(group_id)

    if not group:
        return jsonify({"error": "Group not found"}), 404

    member = GroupMember.query.filter_by(
        group_id=group_id,
        user_id=user_id
    ).first()

    if not member:
        return jsonify({
            "error": "You are not a member of this group"
        }), 403

    # Creator cannot leave
    if member.role == "creator":
        return jsonify({
            "error": "Group creator cannot leave the group"
        }), 400

    balances = calculate_balances(group_id)

    user_balance = balances.get(user_id, 0)

    if abs(user_balance) > 0.01:
        return jsonify({
            "error": "Settle all debts before leaving the group"
        }), 400

    db.session.delete(member)
    db.session.commit()

    return jsonify({
        "message": "You have left the group successfully"
    })


# --------------------------------
# ROLE UPDATE
# --------------------------------
@group_bp.route("/<int:group_id>/members/<int:user_id>/role", methods=["PUT"])
@jwt_required()
def update_member_role(group_id, user_id):

    requester_id = int(get_jwt_identity())

    group = Group.query.get(group_id)

    if not group:
        return jsonify({"error": "Group not found"}), 404

    # only creator can change roles
    if group.created_by != requester_id:
        return jsonify({"error": "Only creator can change roles"}), 403

    member = GroupMember.query.filter_by(
        group_id=group_id,
        user_id=user_id
    ).first()

    if not member:
        return jsonify({"error": "Member not found"}), 404

    data = request.json
    role = data.get("role")

    if role not in ["admin", "member"]:
        return jsonify({"error": "Invalid role"}), 400

    member.role = role

    db.session.commit()

    return jsonify({
        "message": f"Role updated to {role}"
    })


# --------------------------------
# CLEAR CURRENT EXPENSES
# --------------------------------
@group_bp.route("/<int:group_id>/clear-expenses", methods=["POST"])
@jwt_required()
def clear_current_expenses(group_id):

    balances = calculate_balances(group_id)

    if any(abs(float(b)) > 0.01 for b in balances.values()):
        return jsonify({
            "error": "Settle all debts before clearing expenses"
        }), 400

    expenses = Expense.query.filter_by(group_id=group_id).all()

    for expense in expenses:

        history = ExpenseHistory(
            title=expense.title,
            group_id=expense.group_id,
            paid_by=expense.paid_by,
            amount=expense.amount
        )

        db.session.add(history)

        ExpenseSplit.query.filter_by(expense_id=expense.id).delete()

    Expense.query.filter_by(group_id=group_id).delete()

    Settlement.query.filter_by(group_id=group_id).delete()

    db.session.commit()

    return jsonify({
        "message": "Current expenses moved to history and cleared"
    })

# --------------------------------
# GET EXPENSE HISTORY
# --------------------------------
@group_bp.route("/<int:group_id>/history", methods=["GET"])
@jwt_required()
def get_expense_history(group_id):

    histories = ExpenseHistory.query.filter_by(group_id=group_id).all()

    result = []

    for h in histories:

        user = User.query.get(h.paid_by)

        result.append({
            "id": h.id,
            "title": h.title,
            "amount": h.amount,
            "paid_by": user.name if user else "Unknown",
            "created_at": h.created_at
        })

    return jsonify(result)

from datetime import datetime, timedelta


# --------------------------------
# DELETE OLD HISTORY
# --------------------------------
@group_bp.route("/<int:group_id>/history/old", methods=["DELETE"])
@jwt_required()
def delete_old_history(group_id):

    requester_id = int(get_jwt_identity())

    group = Group.query.get(group_id)

    if group.created_by != requester_id:
        return jsonify({
            "error": "Only creator can delete history"
        }), 403

    one_day_ago = datetime.utcnow() - timedelta(days=1)

    ExpenseHistory.query.filter(
        ExpenseHistory.group_id == group_id,
        ExpenseHistory.created_at < one_day_ago
    ).delete()

    db.session.commit()

    return jsonify({
        "message": "Old history deleted"
    })

# --------------------------------
# DELETE ALL HISTORY
# --------------------------------
@group_bp.route("/<int:group_id>/history", methods=["DELETE"])
@jwt_required()
def delete_all_history(group_id):

    requester_id = int(get_jwt_identity())

    group = Group.query.get(group_id)

    if not group:
        return jsonify({"error": "Group not found"}), 404

    # Only creator can delete history
    if group.created_by != requester_id:
        return jsonify({
            "error": "Only creator can delete history"
        }), 403

    ExpenseHistory.query.filter_by(group_id=group_id).delete()

    db.session.commit()

    return jsonify({
        "message": "All expense history deleted"
    })