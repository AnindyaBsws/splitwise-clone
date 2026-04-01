import { formatCurrency } from "../../utils/formatCurrency";
import React from "react";

function BalanceList({ balances, getMemberName }) {

  const entries = Object.entries(balances);

  return (

    <div className="space-y-5">

      <h2 className="text-xl font-semibold text-white tracking-tight">
        Balances
      </h2>

      {entries.length === 0 ? (

        <div className="ui-list-item text-[#9CA3AF] text-sm">
          No balances yet
        </div>

      ) : (

        <div className="space-y-3">

          {entries.map(([userId, amount]) => {

            const value = Number(amount);
            const isPositive = value > 0;

            return (

              <div
                key={userId}
                className="ui-list-item flex justify-between items-center"
              >

                {/* LEFT TEXT */}
                <span className="text-[#9CA3AF] text-sm">

                  <span
                    className={`font-semibold ${
                      isPositive
                        ? "text-green-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.4)]"
                        : "text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.4)]"
                    }`}
                  >
                    {getMemberName(userId)}
                  </span>

                  {" "}

                  <span>
                    {isPositive ? "gets" : "owes"}
                  </span>

                </span>

                {/* AMOUNT */}
                <span
                  className={`font-semibold text-lg ${
                    isPositive
                      ? "text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                      : "text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                  }`}
                >
                  {formatCurrency(Math.abs(value))}
                </span>

              </div>

            );

          })}

        </div>

      )}

    </div>

  );

}

export default React.memo(BalanceList);