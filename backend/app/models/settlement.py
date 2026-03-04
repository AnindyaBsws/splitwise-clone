from ..extensions.db import db

class Settlement(db.Model):
    __tablename__ = "settlements"

    id = db.Column(db.Integer, primary_key=True)
    payer_id = db.Column(db.Integer)
    receiver_id = db.Column(db.Integer)
    amount = db.Column(db.Float)