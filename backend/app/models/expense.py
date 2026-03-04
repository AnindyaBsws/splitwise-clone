from ..extensions.db import db

class Expense(db.Model):
    __tablename__ = "expenses"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    amount = db.Column(db.Float)
    group_id = db.Column(db.Integer)
    paid_by = db.Column(db.Integer)