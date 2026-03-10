from ..extensions.db import db
import random
import string


def generate_user_tag():
    characters = string.ascii_uppercase + string.digits
    return "#" + "".join(random.choices(characters, k=6))


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100))

    email = db.Column(db.String(120), unique=True, nullable=False)

    password_hash = db.Column(db.String(255), nullable=False)

    user_tag = db.Column(
        db.String(10),
        unique=True,
        nullable=False,
        default=generate_user_tag
    )