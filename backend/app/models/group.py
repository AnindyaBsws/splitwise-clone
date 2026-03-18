from ..extensions.db import db

class Group(db.Model):
    __tablename__ = "groups"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    created_by = db.Column(db.Integer)

    total_expense = db.Column(db.Float, default=0)
    
    created_at = db.Column(db.DateTime, server_default=db.func.now())