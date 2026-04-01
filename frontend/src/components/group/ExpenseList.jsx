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

    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Current Expenses
        </h2>
      </div>

      {/* LIST */}
      <div className="glass-card divide-y divide-white/10">

        {expenses.length === 0 ? (

          <div className="p-4 text-gray-400">
            No expenses yet
          </div>

        ) : (

          expenses.map((expense) => (

            <div
              key={expense.expense_id}
              className="flex justify-between items-center p-4 hover:bg-white/5 transition"
            >

              {/* LEFT */}
              <div className="space-y-1 max-w-[70%]">

                <p className="font-medium text-white truncate">
                  💸 {expense.title}
                </p>

                <p className="text-sm text-gray-400">
                  Paid by {getMemberName(expense.paid_by)}
                </p>

              </div>

              {/* RIGHT */}
              <div className="text-right">

                <p className="font-semibold text-primary text-lg">
                  {formatCurrency(expense.amount)}
                </p>

              </div>

            </div>

          ))

        )}

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3">

        <button
          onClick={handleClearExpenses}
          disabled={!allSettled}
          className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition ${
            allSettled
              ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
              : "bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed"
          }`}
        >
          Clear Expenses
        </button>

        <button
          onClick={() => navigate(`/groups/${id}/history`)}
          className="gradient-btn flex-1"
        >
          View History
        </button>

      </div>

    </div>

  );

}

export default React.memo(ExpenseList);