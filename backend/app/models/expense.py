from ..extensions.db import db

class Expense(db.Model):
    __tablename__ = "expenses"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(255), nullable=False)

    amount = db.Column(db.Float, nullable=False)

    group_id = db.Column(
        db.Integer,
        db.ForeignKey("groups.id", ondelete="CASCADE"),
        nullable=False
    )

    paid_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )