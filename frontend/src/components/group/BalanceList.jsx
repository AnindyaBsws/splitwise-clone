import { formatCurrency } from "../../utils/formatCurrency";
import React from "react";

function BalanceList({ balances, getMemberName }) {

  const entries = Object.entries(balances);

  return (

    <div className="card p-6">

      <h2 className="text-xl font-semibold mb-5 text-white">
        Balances
      </h2>

      {entries.length === 0 ? (

        <p className="text-[#9CA3AF]">
          No balances yet
        </p>

      ) : (

        <div className="space-y-3">

          {entries.map(([userId, amount]) => {

            const value = Number(amount);
            const isPositive = value > 0;

            return (

              <div
                key={userId}
                className="p-4 rounded-xl
                bg-[#1A1B21] border border-[#22232A]
                flex justify-between items-center
                hover:bg-[#22232A] transition"
              >

                <span className="text-[#9CA3AF]">

                  <span
                    className={`font-semibold ${
                      isPositive
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {getMemberName(userId)}
                  </span>

                  {" "}

                  {isPositive ? "gets" : "owes"}

                </span>

                <span
                  className={`font-semibold ${
                    isPositive
                      ? "text-green-400"
                      : "text-red-400"
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