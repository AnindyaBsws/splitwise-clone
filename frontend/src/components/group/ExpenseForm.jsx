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

    <div className="glass-card p-6">

      <h2 className="text-xl font-semibold mb-5">
        Add Expense
      </h2>

      {/* TITLE */}

      <input
        type="text"
        placeholder="Expense title"
        value={expenseTitle}
        onChange={(e) => setExpenseTitle(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none"
      />

      {/* AMOUNT */}

      <input
        type="number"
        placeholder="Amount"
        value={expenseAmount}
        min="0"
        onChange={(e) => setExpenseAmount(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none"
      />

      {/* PAYER */}

      <select
        value={payerId}
        onChange={(e) => setPayerId(e.target.value)}
        className="w-full mb-4 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white"
      >

        <option value="">Paid by</option>

        {members.map((member) => (

          <option key={member.user_id} value={member.user_id}>
            {member.name}
          </option>

        ))}

      </select>

      {/* SPLIT MEMBERS */}

      <div className="mb-4">

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
                className={`px-3 py-1 rounded-full text-sm ${
                  selected
                    ? "bg-indigo-500 text-white"
                    : "bg-white/10 text-gray-300"
                }`}
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
        className="gradient-btn w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 py-2 rounded-lg text-white"
      >
        Add Expense
      </button>

    </div>

  );

}

export default ExpenseForm;