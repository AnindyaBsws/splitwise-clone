import { formatCurrency } from "../../utils/formatCurrency";

function BalanceList({ balances, getMemberName }) {

  const entries = Object.entries(balances);

  return (

    <div className="glass-card p-6">

      <h2 className="text-xl font-semibold mb-5">
        Balances
      </h2>

      {entries.length === 0 ? (

        <p className="text-gray-400">
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
                className="glass-card p-4 flex justify-between items-center hover:-translate-y-1"
              >

                <span className="text-gray-300">

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

export default BalanceList;