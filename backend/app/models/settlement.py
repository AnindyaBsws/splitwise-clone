from ..extensions.db import db

class Settlement(db.Model):
    __tablename__ = "settlements"

    id = db.Column(db.Integer, primary_key=True)

    group_id = db.Column(
        db.Integer,
        db.ForeignKey("groups.id", ondelete="CASCADE")
    )

    payer_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id")
    )

    receiver_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id")
    )

    amount = db.Column(db.Float)