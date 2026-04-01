function ExpenseForm({
  expenseTitle,
  setExpenseTitle,
  expenseAmount,
  setExpenseAmount,
  payerId,
  setPayerId,
  splitBetween,
  toggleSplitUser,
  members,
  handleAddExpense
}) {

  const handleSubmit = () => {

    const amount = Number(expenseAmount);

    if (!expenseTitle.trim()) {
      alert("Expense title is required");
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      alert("Expense amount must be greater than 0");
      return;
    }

    if (!payerId) {
      alert("Please select who paid");
      return;
    }

    if (splitBetween.length === 0) {
      alert("Select at least one member to split");
      return;
    }

    handleAddExpense();

  };

  return (

    <div className="space-y-5">

      {/* TITLE */}
      <div>
        <label className="text-sm text-gray-400 mb-1 block">
          Expense Title
        </label>
        <input
          type="text"
          placeholder="e.g. Dinner, Rent, Groceries"
          value={expenseTitle}
          onChange={(e) => setExpenseTitle(e.target.value)}
          className="neon-input"
        />
      </div>

      {/* AMOUNT */}
      <div>
        <label className="text-sm text-gray-400 mb-1 block">
          Amount
        </label>
        <input
          type="number"
          placeholder="Enter amount"
          value={expenseAmount}
          min="0"
          onChange={(e) => setExpenseAmount(e.target.value)}
          className="neon-input"
        />
      </div>

      {/* PAYER */}
      <div>
        <label className="text-sm text-gray-400 mb-1 block">
          Paid By
        </label>
        <select
          value={payerId}
          onChange={(e) => setPayerId(e.target.value)}
          className="neon-input"
        >
          <option value="">Select member</option>
          {members.map((member) => (
            <option key={member.user_id} value={member.user_id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      {/* SPLIT MEMBERS */}
      <div>

        <p className="text-sm text-gray-400 mb-2">
          Split Between
        </p>

        <div className="flex flex-wrap gap-2">

          {members.map((member) => {

            const selected = splitBetween.includes(member.user_id);

            return (

              <button
                key={member.user_id}
                onClick={() => toggleSplitUser(member.user_id)}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  selected
                    ? "bg-gradient-main text-white shadow-glow"
                    : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                }`}
              >
                {member.name}
              </button>

            );

          })}

        </div>

      </div>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        className="gradient-btn w-full mt-2"
      >
        Add Expense
      </button>

    </div>

  );

}

export default ExpenseForm;