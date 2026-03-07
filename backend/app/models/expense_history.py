from ..extensions.db import db
from datetime import datetime


class ExpenseHistory(db.Model):

    __tablename__ = "expense_history"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(255), nullable=False)

    group_id = db.Column(db.Integer, nullable=False)

    paid_by = db.Column(db.Integer, nullable=False)

    amount = db.Column(db.Float, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)