from flask_jwt_extended import get_jwt
from flask import jsonify

def block_demo_user():
    claims = get_jwt()

    if claims.get("is_demo"):
        return jsonify({
            "error": "Demo accounts cannot modify data. Please create a real account."
        }), 403

    return None