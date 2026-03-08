function SimplifiedDebts({
  simplifiedDebts,
  getMemberName,
  handleSettle
}) {

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">

      <h2 className="text-xl font-semibold mb-4">Simplified Debts</h2>

      {simplifiedDebts.length === 0 ? (

        <p className="text-gray-500">All settled 🎉</p>

      ) : (

        simplifiedDebts.map((txn, index) => (

          <div
            key={index}
            className="border rounded-lg p-3 flex justify-between items-center mb-2"
          >

            <span>
              {getMemberName(txn.from)} pays {getMemberName(txn.to)} {txn.amount.toFixed(2)} ₹
            </span>

            <button
              onClick={() => handleSettle(txn)}
              className="bg-green-600 text-white px-3 py-1 rounded-lg"
            >
              Settle
            </button>

          </div>

        ))

      )}

    </div>
  );
}

export default SimplifiedDebts;