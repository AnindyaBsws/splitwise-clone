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

    <div className="p-6 rounded-2xl bg-[#111217] border border-[#22232A]">

      <h2 className="text-xl font-semibold mb-5 text-white">
        Add Expense
      </h2>

      {/* TITLE */}

      <input
        type="text"
        placeholder="Expense title"
        value={expenseTitle}
        onChange={(e) => setExpenseTitle(e.target.value)}
        className="w-full mb-3 px-4 py-2 rounded-lg
        bg-[#0B0B0F] border border-[#22232A]
        text-[#E5E7EB] placeholder-[#6B7280]
        focus:outline-none focus:border-indigo-500
        transition"
      />

      {/* AMOUNT */}

      <input
        type="number"
        placeholder="Amount"
        value={expenseAmount}
        min="0"
        onChange={(e) => setExpenseAmount(e.target.value)}
        className="w-full mb-3 px-4 py-2 rounded-lg
        bg-[#0B0B0F] border border-[#22232A]
        text-[#E5E7EB] placeholder-[#6B7280]
        focus:outline-none focus:border-indigo-500
        transition"
      />

      {/* PAYER */}

      <select
        value={payerId}
        onChange={(e) => setPayerId(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-lg
        bg-[#0B0B0F] border border-[#22232A]
        text-[#E5E7EB]
        focus:outline-none focus:border-indigo-500
        transition"
      >
        <option value="">Paid by</option>

        {members.map((member) => (
          <option key={member.user_id} value={member.user_id}>
            {member.name}
          </option>
        ))}

      </select>

      {/* SPLIT MEMBERS */}

      <div className="mb-5">

        <p className="text-sm text-[#9CA3AF] mb-2">
          Split Between
        </p>

        <div className="flex flex-wrap gap-2">

          {members.map((member) => {

            const selected = splitBetween.includes(member.user_id);

            return (

              <button
                key={member.user_id}
                onClick={() => toggleSplitUser(member.user_id)}
                className={`px-3 py-1.5 rounded-full text-sm border transition
                ${
                  selected
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-[#1A1B21] text-[#9CA3AF] border-[#22232A] hover:bg-[#22232A] hover:text-white"
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
        className="w-full py-2.5 rounded-lg
        bg-gradient-to-r from-indigo-500 to-purple-600
        text-white font-medium
        hover:opacity-90 transition"
      >
        Add Expense
      </button>

    </div>

  );

}

export default ExpenseForm;