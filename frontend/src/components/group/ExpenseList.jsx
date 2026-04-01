import { formatCurrency } from "../../utils/formatCurrency";
import React from "react";

function ExpenseList({
  expenses,
  getMemberName,
  handleClearExpenses,
  allSettled,
  navigate,
  id
}) {

  return (

    <div className="card p-6">

      <h2 className="text-xl font-semibold mb-5 text-white">
        Current Expenses
      </h2>

      {expenses.length === 0 ? (

        <p className="text-[#9CA3AF]">
          No expenses yet
        </p>

      ) : (

        <div className="space-y-3">

          {expenses.map((expense) => (

            <div
              key={expense.expense_id}
              className="p-4 rounded-xl
              bg-[#1A1B21] border border-[#22232A]
              flex justify-between items-center
              hover:bg-[#22232A] transition"
            >

              <div>

                <p className="font-semibold text-white truncate max-w-[220px]">
                  💸 {expense.title}
                </p>

                <p className="text-sm text-[#9CA3AF]">
                  Paid by {getMemberName(expense.paid_by)}
                </p>

              </div>

              <div className="font-semibold text-lg text-indigo-400 break-all max-w-[120px] text-right">
                {formatCurrency(expense.amount)}
              </div>

            </div>

          ))}

        </div>

      )}

      {/* ACTION BUTTONS */}

      <div className="flex flex-col gap-3 mt-6">

        <button
          onClick={handleClearExpenses}
          disabled={!allSettled}
          className={`px-4 py-2 rounded-lg text-white transition
          ${
            allSettled
              ? "bg-red-500 hover:bg-red-600"
              : "bg-[#1A1B21] border border-[#22232A] text-[#6B7280] cursor-not-allowed"
          }`}
        >
          Clear Current Expenses
        </button>

        <button
          onClick={() => navigate(`/groups/${id}/history`)}
          className="btn-primary"
        >
          Expense History
        </button>

      </div>

    </div>

  );

}

export default React.memo(ExpenseList);