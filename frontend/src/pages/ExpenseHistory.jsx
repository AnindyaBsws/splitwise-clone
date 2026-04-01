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

  const totalConsumption = history.reduce((sum, h) => {
    return sum + Number(h.amount);
  }, 0);

  const groupedHistory = history.reduce((acc, h) => {

    const date = new Date(h.created_at).toLocaleDateString();

    if (!acc[date]) acc[date] = [];

    acc[date].push(h);

    return acc;

  }, {});

  return (

    <div className="page-container space-y-10 fade-in">

      {/* HEADER */}
      <h1 className="text-3xl font-bold">
        Expense History
      </h1>

      {/* TOTAL */}
      <div className="glass-card p-6 flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-400">
            Total Group Spending
          </p>
          <p className="text-3xl font-bold text-primary mt-1">
            ₹{totalConsumption}
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleDeleteHistory}
            className="px-4 py-2 rounded-xl text-sm bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition"
          >
            Clear History
          </button>
        )}

      </div>

      {/* HISTORY */}
      {history.length === 0 ? (

        <div className="glass-card p-6 text-gray-400 text-center">
          No expense history
        </div>

      ) : (

        <div className="space-y-8">

          {Object.keys(groupedHistory).map((date) => (

            <div key={date} className="space-y-3">

              {/* DATE */}
              <p className="text-sm text-gray-400">
                {date}
              </p>

              {/* LIST */}
              <div className="glass-card divide-y divide-white/10">

                {groupedHistory[date].map((h) => (

                  <div
                    key={h.id}
                    className="flex justify-between items-center p-4 hover:bg-white/5 transition"
                  >

                    {/* LEFT */}
                    <div className="space-y-1">

                      <p className="font-medium text-white">
                        {h.title}
                      </p>

                      <p className="text-sm text-gray-400">
                        Paid by {h.paid_by}
                      </p>

                    </div>

                    {/* RIGHT */}
                    <div className="font-semibold text-primary">
                      ₹{h.amount}
                    </div>

                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default ExpenseHistory;