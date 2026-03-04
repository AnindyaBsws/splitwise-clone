def calculate_balances(expenses):
    balances = {}

    for e in expenses:
        payer = e["paid_by"]
        amount = e["amount"]
        users = e["users"]

        share = amount / len(users)

        for u in users:
            balances[u] = balances.get(u, 0) - share

        balances[payer] += amount

    return balances