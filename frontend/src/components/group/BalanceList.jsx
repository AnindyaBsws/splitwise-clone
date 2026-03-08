import { formatCurrency } from "../../utils/formatCurrency";

function BalanceList({ balances, getMemberName }) {

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">

      <h2 className="text-xl font-semibold mb-4">Balances</h2>

      {Object.entries(balances).map(([userId, amount]) => {

        const value = Number(amount);

        return (

          <div
            key={userId}
            className="border rounded-lg p-3 flex justify-between mb-2"
          >

            <span>

              {value > 0 ? (

                <span className="text-green-600 font-semibold">
                  {getMemberName(userId)} gets
                </span>

              ) : (

                <span className="text-red-600 font-semibold">
                  {getMemberName(userId)} owes
                </span>

              )}

            </span>

            <span>{formatCurrency(Math.abs(value))}</span>

          </div>

        );

      })}

    </div>
  );
}

export default BalanceList;