def validate_expense(data):
    required = ["title", "amount", "group_id", "paid_by"]

    for r in required:
        if r not in data:
            return False

    return True