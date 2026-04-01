import React from "react";

function SimplifiedDebts({
  simplifiedDebts,
  getMemberName,
  handleSettle
}) {

  return (

    <div className="card p-6">

      <h2 className="text-xl font-semibold mb-4 text-white">
        Simplified Debts
      </h2>

      {simplifiedDebts.length === 0 ? (

        <p className="text-[#9CA3AF]">
          All settled 🎉
        </p>

      ) : (

        <div className="space-y-3">

          {simplifiedDebts.map((txn, index) => (

            <div
              key={index}
              className="p-4 rounded-xl
              bg-[#1A1B21] border border-[#22232A]
              flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3
              hover:bg-[#22232A] transition"
            >

              <span className="text-[#9CA3AF]">

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
                className="px-4 py-2 rounded-lg text-sm font-medium
                bg-green-500 text-white
                hover:bg-green-600 transition"
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