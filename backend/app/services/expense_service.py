def split_equal(amount, users):
    share = amount / len(users)
    return {user: share for user in users}