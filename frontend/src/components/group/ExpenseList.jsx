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

    <div className="space-y-5">

      <h2 className="text-xl font-semibold text-white tracking-tight">
        Current Expenses
      </h2>

      {expenses.length === 0 ? (

        <div className="ui-list-item text-[#9CA3AF] text-sm">
          No expenses yet
        </div>

      ) : (

        <div className="space-y-3">

          {expenses.map((expense) => (

            <div
              key={expense.expense_id}
              className="ui-list-item flex justify-between items-center"
            >

              <div>

                <p className="font-semibold text-white truncate max-w-[220px]">
                  💸 {expense.title}
                </p>

                <p className="text-sm text-[#9CA3AF]">
                  Paid by {getMemberName(expense.paid_by)}
                </p>

              </div>

              <div className="
                font-semibold text-lg text-indigo-400 
                break-all max-w-[120px] text-right
                drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]
              ">
                {formatCurrency(expense.amount)}
              </div>

            </div>

          ))}

        </div>

      )}

      {/* ACTION BUTTONS */}

      <div className="flex flex-col gap-3 pt-2">

        <button
          onClick={handleClearExpenses}
          disabled={!allSettled}
          className={`
            px-4 py-2 rounded-xl font-medium transition-all
            ${
              allSettled
                ? "btn-danger"
                : "bg-[#0B0B0F] text-[#6B7280] cursor-not-allowed shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
            }
          `}
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