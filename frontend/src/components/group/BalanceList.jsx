import { formatCurrency } from "../../utils/formatCurrency";
import React from "react";

function BalanceList({ balances, getMemberName }) {

  const entries = Object.entries(balances);

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <h2 className="text-xl font-semibold">
        Balances
      </h2>

      {/* LIST */}
      <div className="glass-card divide-y divide-white/10">

        {entries.length === 0 ? (

          <div className="p-4 text-gray-400">
            No balances yet
          </div>

        ) : (

          entries.map(([userId, amount]) => {

            const value = Number(amount);
            const isPositive = value > 0;

            return (

              <div
                key={userId}
                className="flex justify-between items-center p-4 hover:bg-white/5 transition"
              >

                {/* LEFT */}
                <div className="text-sm">

                  <span className="font-medium text-white">
                    {getMemberName(userId)}
                  </span>

                  <span className="text-gray-400 ml-2">
                    {isPositive ? "gets" : "owes"}
                  </span>

                </div>

                {/* RIGHT */}
                <div
                  className={`font-semibold ${
                    isPositive
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formatCurrency(Math.abs(value))}
                </div>

              </div>

            );

          })

        )}

      </div>

    </div>

  );

}

export default React.memo(BalanceList);