from ..extensions.db import db

class ExpenseSplit(db.Model):
    __tablename__ = "expense_splits"

    id = db.Column(db.Integer, primary_key=True)

    expense_id = db.Column(
        db.Integer,
        db.ForeignKey("expenses.id", ondelete="CASCADE"),
        nullable=False
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    amount_owed = db.Column(db.Float, nullable=False)