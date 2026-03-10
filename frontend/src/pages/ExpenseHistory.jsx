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

    <div className="page-container space-y-8 fade-in">

      <h1 className="text-3xl font-bold">
        Expense History
      </h1>

      {/* TOTAL SPENDING */}

      <div className="glass-card p-6">

        <p className="text-gray-400 text-sm">
          Total Group Spending
        </p>

        <p className="text-3xl font-bold text-indigo-400 mt-2">
          ₹{totalConsumption}
        </p>

      </div>

      {/* HISTORY LIST */}

      {history.length === 0 ? (

        <div className="glass-card p-6 text-gray-400">
          No expense history
        </div>

      ) : (

        <div className="space-y-6">

          {Object.keys(groupedHistory).map((date) => (

            <div key={date}>

              {/* DATE HEADER */}

              <h2 className="text-lg font-semibold text-gray-300 mb-3">
                {date}
              </h2>

              <div className="space-y-3">

                {groupedHistory[date].map((h) => (

                  <div
                    key={h.id}
                    className="glass-card p-4 hover:-translate-y-1"
                  >

                    <p className="font-semibold">
                      {h.title}
                    </p>

                    <p className="text-sm text-gray-400">
                      Amount: ₹{h.amount}
                    </p>

                    <p className="text-sm text-gray-400">
                      Paid by: {h.paid_by}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          ))}

          {/* DELETE BUTTON */}

          <button
            onClick={handleDeleteHistory}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white"
          >
            Delete All History
          </button>

        </div>

      )}

    </div>

  );

}

export default ExpenseHistory;