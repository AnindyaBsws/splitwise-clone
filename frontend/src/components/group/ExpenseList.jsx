import { formatCurrency } from "../../utils/formatCurrency";

function ExpenseList({
  expenses,
  getMemberName,
  handleClearExpenses,
  allSettled,
  navigate,
  id
}) {

  return (

    <div className="glass-card p-6">

      <h2 className="text-xl font-semibold mb-5">
        Current Expenses
      </h2>

      {expenses.length === 0 ? (

        <p className="text-gray-400">
          No expenses yet
        </p>

      ) : (

        <div className="space-y-3">

          {expenses.map((expense) => (

            <div
              key={expense.expense_id}
              className="glass-card p-4 flex justify-between items-center hover:-translate-y-1"
            >

              <div>

                <p className="font-semibold text-white truncate max-w-[220px]">
                  💸 {expense.title}
                </p>

                <p className="text-sm text-gray-400">
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
          className={`px-4 py-2 rounded-lg text-white ${
            allSettled
              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          Clear Current Expenses
        </button>

        <button
          onClick={() => navigate(`/groups/${id}/history`)}
          className="gradient-btn bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500"
        >
          Expense History
        </button>

      </div>

    </div>

  );

}

import React from "react";

export default React.memo(ExpenseList);