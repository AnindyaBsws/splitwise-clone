import React from "react";

function SimplifiedDebts({
  simplifiedDebts,
  getMemberName,
  handleSettle
}) {

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <h2 className="text-xl font-semibold">
        Settlements
      </h2>

      {/* LIST */}
      <div className="glass-card divide-y divide-white/10">

        {simplifiedDebts.length === 0 ? (

          <div className="p-4 text-gray-400 text-center">
            All settled 🎉
          </div>

        ) : (

          simplifiedDebts.map((txn, index) => (

            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-3 hover:bg-white/5 transition"
            >

              {/* LEFT: FLOW */}
              <div className="flex items-center gap-2 text-sm flex-wrap">

                <span className="font-medium text-white">
                  {getMemberName(txn.from)}
                </span>

                <span className="text-gray-500">→</span>

                <span className="font-medium text-white">
                  {getMemberName(txn.to)}
                </span>

                <span className="text-gray-500">•</span>

                <span className="text-green-400 font-semibold">
                  ₹{txn.amount.toFixed(2)}
                </span>

              </div>

              {/* RIGHT: BUTTON */}
              <button
                onClick={() => handleSettle(txn)}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition"
              >
                Settle
              </button>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default React.memo(SimplifiedDebts);