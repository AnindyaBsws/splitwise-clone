import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

function ExpenseHistory() {

  const { id } = useParams();

  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {

      const res = await api.get(`/api/groups/${id}/history`);
      setHistory(res.data);

    } catch (error) {

      console.error("Error fetching history", error);

    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDeleteHistory = async () => {

    try {

      await api.delete(`/api/groups/${id}/history`);
      setHistory([]);

      alert("Expense history deleted");

    } catch (error) {

      if (error.response) {
        alert(error.response.data.error);
      }

      console.error("Error deleting history", error);

    }
  };

  /* -----------------------------
     Calculate total consumption
  ----------------------------- */

  const totalConsumption = history.reduce((sum, h) => {
    return sum + Number(h.amount);
  }, 0);

  /* -----------------------------
     Group history by date
  ----------------------------- */

  const groupedHistory = history.reduce((acc, h) => {

    const date = new Date(h.created_at).toLocaleDateString();

    if (!acc[date]) {
      acc[date] = [];
    }

    acc[date].push(h);

    return acc;

  }, {});

  return (

    <div className="p-8 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-4">
        Expense History
      </h1>

      {/* TOTAL CONSUMPTION */}

      <div className="bg-white border rounded-xl shadow-sm p-6 mb-6">

        <p className="text-gray-500 text-sm">
          Total Group Spending
        </p>

        <p className="text-2xl font-bold text-blue-600">
          ₹{totalConsumption}
        </p>

      </div>

      {history.length === 0 ? (

        <p className="text-gray-500">No expense history</p>

      ) : (

        <>
          {Object.keys(groupedHistory).map((date) => (

            <div key={date} className="mb-6">

              {/* DATE HEADER */}

              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                {date}
              </h2>

              {groupedHistory[date].map((h) => (

                <div
                  key={h.id}
                  className="p-4 border rounded bg-white shadow-sm mb-3"
                >
                  <p className="font-semibold">{h.title}</p>
                  <p>Amount: ₹{h.amount}</p>
                  <p>Paid by: {h.paid_by}</p>
                </div>

              ))}

            </div>

          ))}

          {/* DELETE HISTORY BUTTON */}

          <button
            onClick={handleDeleteHistory}
            className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete All History
          </button>

        </>
      )}

    </div>

  );
}

export default ExpenseHistory;