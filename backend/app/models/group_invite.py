from ..extensions.db import db
import uuid

class GroupInvite(db.Model):

    __tablename__ = "group_invites"

    id = db.Column(db.Integer, primary_key=True)

    group_id = db.Column(
        db.Integer,
        db.ForeignKey("groups.id"),
        nullable=False
    )

    token = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    created_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id")
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    is_active = db.Column(
        db.Boolean,
        default=True
    )

    @staticmethod
    def generate_token():
        return uuid.uuid4().hex