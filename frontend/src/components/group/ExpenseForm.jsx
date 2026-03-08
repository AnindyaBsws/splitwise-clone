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

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">

      <h2 className="text-xl font-semibold mb-4">Add Expense</h2>

      <input
        type="text"
        placeholder="Expense title"
        value={expenseTitle}
        onChange={(e) => setExpenseTitle(e.target.value)}
        className="border rounded-lg p-2 w-full mb-3"
      />

      <input
        type="number"
        placeholder="Amount"
        value={expenseAmount}
        onChange={(e) => setExpenseAmount(e.target.value)}
        className="border rounded-lg p-2 w-full mb-3"
      />

      <select
        value={payerId}
        onChange={(e) => setPayerId(e.target.value)}
        className="border rounded-lg p-2 w-full mb-3"
      >
        <option value="">Paid by</option>

        {members.map((member) => (
          <option key={member.user_id} value={member.user_id}>
            {member.name}
          </option>
        ))}

      </select>

      <div className="grid grid-cols-2 gap-2 mb-3">

        {members.map((member) => (
          <label key={member.user_id} className="flex gap-2 items-center">

            <input
              type="checkbox"
              checked={splitBetween.includes(member.user_id)}
              onChange={() => toggleSplitUser(member.user_id)}
            />

            {member.name}

          </label>
        ))}

      </div>

      <button
        onClick={handleAddExpense}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
      >
        Add Expense
      </button>

    </div>
  );
}

export default ExpenseForm;