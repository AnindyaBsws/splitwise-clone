import { formatCurrency } from "../../utils/formatCurrency";

function ExpensesSection({
  expenses,
  getMemberName,
  handleClearExpenses,
  navigate,
  id,
  allSettled
}) {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">

      <h2 className="text-xl font-semibold mb-4">Current Expenses</h2>

      <div className="space-y-3">

        {expenses.length === 0 ? (
          <p className="text-gray-500">No Current Expenses Right Now</p>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.expense_id}
              className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition"
            >

              <div>
                <p className="font-semibold text-lg">{expense.title}</p>

                <p className="text-sm text-gray-500">
                  Paid by {getMemberName(expense.paid_by)}
                </p>
              </div>

              <div className="text-lg font-semibold text-gray-800">
                {formatCurrency(expense.amount)}
              </div>

            </div>
          ))
        )}

      </div>

      <div className="flex flex-col gap-3 mt-6">

        <button
          onClick={handleClearExpenses}
          disabled={!allSettled}
          className={`px-4 py-2 rounded-lg text-white ${
            allSettled
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Clear Current Expenses
        </button>

        <button
          onClick={() => navigate(`/groups/${id}/history`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Expense History
        </button>

      </div>

    </div>
  );
}

export default ExpensesSection;