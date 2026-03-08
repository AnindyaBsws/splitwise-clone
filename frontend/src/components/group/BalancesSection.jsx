import { formatCurrency } from "../../utils/formatCurrency";

function BalancesSection({
  balances,
  getMemberName,
  simplifiedDebts,
  handleSettle
}) {
  return (
    <>
      <div className="bg-white border rounded-xl shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-4">Balances</h2>

        <div className="space-y-2">

          {Object.entries(balances).map(([userId, amount]) => {

            const value = Number(amount);

            return (
              <div
                key={userId}
                className="border rounded-lg p-3 flex justify-between items-center"
              >

                <span>
                  {value > 0 ? (
                    <>
                      <span className="text-green-600 font-semibold">
                        {getMemberName(userId)}
                      </span>{" "}
                      is owed
                    </>
                  ) : (
                    <>
                      <span className="text-red-600 font-semibold">
                        {getMemberName(userId)}
                      </span>{" "}
                      owes
                    </>
                  )}
                </span>

                <span
                  className={`font-semibold ${
                    value > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(Math.abs(value))}
                </span>

              </div>
            );
          })}

        </div>

      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-4">Simplified Debts</h2>

        <div className="space-y-3">

          {simplifiedDebts.length === 0 ? (
            <p className="text-gray-500">All settled 🎉</p>
          ) : (
            simplifiedDebts.map((txn, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 flex justify-between items-center"
              >

                <span>
                  <b>{getMemberName(txn.from)}</b> pays{" "}
                  <b>{getMemberName(txn.to)}</b>

                  <span className="text-green-600 font-semibold ml-2">
                    {formatCurrency(txn.amount)}
                  </span>
                </span>

                <button
                  onClick={() => handleSettle(txn)}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                >
                  Settle
                </button>

              </div>
            ))
          )}

        </div>

      </div>
    </>
  );
}

export default BalancesSection;