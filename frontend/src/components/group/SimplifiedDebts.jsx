function SimplifiedDebts({
  simplifiedDebts,
  getMemberName,
  handleSettle
}) {

  return (

    <div className="glass-card p-6">

      <h2 className="text-xl font-semibold mb-4">
        Simplified Debts
      </h2>

      {simplifiedDebts.length === 0 ? (

        <p className="text-gray-400">
          All settled 🎉
        </p>

      ) : (

        <div className="space-y-3">

          {simplifiedDebts.map((txn, index) => (

            <div
              key={index}
              className="glass-card p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 hover:-translate-y-1"
            >

              <span className="text-gray-300">

                <span className="font-semibold text-white">
                  {getMemberName(txn.from)}
                </span>

                {" "}pays{" "}

                <span className="font-semibold text-white">
                  {getMemberName(txn.to)}
                </span>

                {" "}

                <span className="text-green-400 font-semibold">
                  ₹{txn.amount.toFixed(2)}
                </span>

              </span>

              <button
                onClick={() => handleSettle(txn)}
                className="gradient-btn bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 px-4 py-2 rounded-lg text-sm"
              >
                Settle
              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

import React from "react";

export default React.memo(SimplifiedDebts);