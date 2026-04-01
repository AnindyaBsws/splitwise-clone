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

    <div className="page-container space-y-8 fade-in">

      <h1 className="text-3xl font-bold text-white">
        Expense History
      </h1>

      {/* TOTAL SPENDING */}

      <div className="card p-6">

        <p className="text-[#9CA3AF] text-sm">
          Total Group Spending
        </p>

        <p className="text-3xl font-bold text-indigo-400 mt-2">
          ₹{totalConsumption}
        </p>

      </div>

      {/* HISTORY LIST */}

      {history.length === 0 ? (

        <div className="card p-6 text-[#9CA3AF]">
          No expense history
        </div>

      ) : (

        <div className="space-y-6">

          {Object.keys(groupedHistory).map((date) => (

            <div key={date}>

              {/* DATE HEADER */}

              <h2 className="text-lg font-semibold text-[#9CA3AF] mb-3">
                {date}
              </h2>

              <div className="space-y-3">

                {groupedHistory[date].map((h) => (

                  <div
                    key={h.id}
                    className="p-4 rounded-xl
                    bg-[#1A1B21] border border-[#22232A]
                    hover:bg-[#22232A] transition"
                  >

                    <p className="font-semibold text-white">
                      {h.title}
                    </p>

                    <p className="text-sm text-[#9CA3AF]">
                      Amount: ₹{h.amount}
                    </p>

                    <p className="text-sm text-[#9CA3AF]">
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
            className="px-5 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition"
          >
            Delete All History
          </button>

        </div>

      )}

    </div>

  );

}

export default ExpenseHistory;