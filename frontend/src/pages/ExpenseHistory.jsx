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

  // DELETE HISTORY FUNCTION
  const handleDeleteHistory = async () => {

    try {

      await api.delete(`/api/groups/${id}/history`);

      // clear UI
      setHistory([]);

      alert("Expense history deleted");

    } catch (error) {

      if (error.response) {
        alert(error.response.data.error);
      }

      console.error("Error deleting history", error);

    }
  };

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">Expense History</h1>

      {history.length === 0 ? (

        <p className="text-gray-500">No expense history</p>

      ) : (

        <>
          {history.map((h) => (

            <div
              key={h.id}
              className="p-4 border rounded bg-white shadow-sm mb-3"
            >
              <p className="font-semibold">{h.title}</p>
              <p>Amount: ₹{h.amount}</p>
              <p>Paid by: {h.paid_by}</p>
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