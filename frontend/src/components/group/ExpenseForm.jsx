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

    <div className="space-y-6">

      <h2 className="text-xl font-semibold text-white tracking-tight">
        Add Expense
      </h2>

      {/* TITLE */}

      <input
        type="text"
        placeholder="Expense title"
        value={expenseTitle}
        onChange={(e) => setExpenseTitle(e.target.value)}
        className="input"
      />

      {/* AMOUNT */}

      <input
        type="number"
        placeholder="Amount"
        value={expenseAmount}
        min="0"
        onChange={(e) => setExpenseAmount(e.target.value)}
        className="input"
      />

      {/* PAYER */}

      <select
        value={payerId}
        onChange={(e) => setPayerId(e.target.value)}
        className="input"
      >
        <option value="">Paid by</option>

        {members.map((member) => (
          <option key={member.user_id} value={member.user_id}>
            {member.name}
          </option>
        ))}

      </select>

      {/* SPLIT MEMBERS */}

      <div className="space-y-3">

        <p className="text-sm text-[#9CA3AF]">
          Split Between
        </p>

        <div className="flex flex-wrap gap-2">

          {members.map((member) => {

            const selected = splitBetween.includes(member.user_id);

            return (

              <button
                key={member.user_id}
                onClick={() => toggleSplitUser(member.user_id)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-200
                  ${
                    selected
                      ? "bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                      : "bg-[#0B0B0F] text-[#9CA3AF] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] hover:text-white hover:shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                  }
                `}
              >
                {member.name}
              </button>

            );

          })}

        </div>

      </div>

      {/* ADD BUTTON */}

      <button
        onClick={handleSubmit}
        className="btn-primary w-full py-2.5"
      >
        Add Expense
      </button>

    </div>

  );

}

export default ExpenseForm;