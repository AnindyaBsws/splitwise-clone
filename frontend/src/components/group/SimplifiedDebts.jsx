import React from "react";

function SimplifiedDebts({
  simplifiedDebts,
  getMemberName,
  handleSettle
}) {

  return (

    <div className="space-y-5">

      <h2 className="text-xl font-semibold text-white tracking-tight">
        Simplified Debts
      </h2>

      {simplifiedDebts.length === 0 ? (

        <div className="ui-list-item text-center text-[#9CA3AF]">
          All settled 🎉
        </div>

      ) : (

        <div className="space-y-3">

          {simplifiedDebts.map((txn, index) => (

            <div
              key={index}
              className="ui-list-item flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
            >

              {/* TRANSACTION TEXT */}
              <div className="text-sm text-[#9CA3AF] flex flex-wrap items-center gap-1">

                <span className="font-semibold text-white">
                  {getMemberName(txn.from)}
                </span>

                <span>pays</span>

                <span className="font-semibold text-white">
                  {getMemberName(txn.to)}
                </span>

                <span
                  className="
                    ml-2 font-semibold text-green-400
                    drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]
                  "
                >
                  ₹{txn.amount.toFixed(2)}
                </span>

              </div>

              {/* ACTION */}
              <button
                onClick={() => handleSettle(txn)}
                className="
                  px-4 py-2 rounded-xl text-sm font-medium
                  bg-green-500 text-white
                  shadow-[0_0_15px_rgba(34,197,94,0.4)]
                  hover:bg-green-400
                  hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]
                  transition-all
                "
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

export default React.memo(SimplifiedDebts);