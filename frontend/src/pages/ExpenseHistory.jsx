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

    if (!acc[date]) {
      acc[date] = [];
    }

    acc[date].push(h);

    return acc;

  }, {});

  return (

    <div className="page-container space-y-10 fade-in">

      <h1 className="text-3xl font-semibold text-white tracking-tight">
        Expense History
      </h1>

      {/* TOTAL SPENDING */}

      <div className="card">

        <p className="text-[#9CA3AF] text-sm">
          Total Group Spending
        </p>

        <p className="
          text-4xl font-bold mt-2 text-indigo-400
          drop-shadow-[0_0_10px_rgba(99,102,241,0.4)]
        ">
          ₹{totalConsumption}
        </p>

      </div>

      {/* HISTORY LIST */}

      {history.length === 0 ? (

        <div className="card text-[#9CA3AF]">
          No expense history
        </div>

      ) : (

        <div className="space-y-8">

          {Object.keys(groupedHistory).map((date) => (

            <div key={date} className="space-y-3">

              {/* DATE HEADER */}
              <div className="flex items-center gap-3">

                <div className="h-px flex-1 bg-white/5"></div>

                <h2 className="text-sm text-[#9CA3AF] whitespace-nowrap">
                  {date}
                </h2>

                <div className="h-px flex-1 bg-white/5"></div>

              </div>

              {/* ITEMS */}
              <div className="space-y-3">

                {groupedHistory[date].map((h) => (

                  <div
                    key={h.id}
                    className="ui-list-item flex justify-between items-center"
                  >

                    <div>

                      <p className="font-semibold text-white">
                        {h.title}
                      </p>

                      <p className="text-sm text-[#9CA3AF]">
                        Paid by: {h.paid_by}
                      </p>

                    </div>

                    <div className="
                      text-indigo-400 font-semibold
                      drop-shadow-[0_0_6px_rgba(99,102,241,0.4)]
                    ">
                      ₹{h.amount}
                    </div>

                  </div>

                ))}

              </div>

            </div>

          ))}

          {/* DELETE BUTTON */}

          <div className="pt-4">

            <button
              onClick={handleDeleteHistory}
              className="btn-danger px-5 py-2"
            >
              Delete All History
            </button>

          </div>

        </div>

      )}

    </div>

  );

}

export default ExpenseHistory;