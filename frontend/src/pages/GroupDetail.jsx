import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

function GroupDetail() {
  const { id } = useParams();

  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [simplifiedDebts, setSimplifiedDebts] = useState([]);

  const [newMemberId, setNewMemberId] = useState("");

  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [payerId, setPayerId] = useState("");
  const [splitBetween, setSplitBetween] = useState([]);

  const fetchMembers = async () => {
    try {
      const res = await api.get(`/api/groups/${id}/members`);
      setMembers(res.data);
    } catch (error) {
      console.error("Error fetching members", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await api.get(`/api/expenses/group/${id}`);
      setExpenses(res.data);
    } catch (error) {
      console.error("Error fetching expenses", error);
    }
  };

  const fetchBalances = async () => {
    try {
      const res = await api.get(`/api/groups/${id}/balances`);
      setBalances(res.data);
    } catch (error) {
      console.error("Error fetching balances", error);
    }
  };

  const fetchSimplifiedDebts = async () => {
    try {
      const res = await api.get(`/api/groups/${id}/simplify`);
      setSimplifiedDebts(res.data);
    } catch (error) {
      console.error("Error fetching simplified debts", error);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchExpenses();
    fetchBalances();
    fetchSimplifiedDebts();
  }, [id]);

  const handleAddMember = async () => {
    if (!newMemberId.trim()) return;

    try {
      await api.post(`/api/groups/${id}/members`, {
        user_id: Number(newMemberId),
      });

      setNewMemberId("");
      fetchMembers();
    } catch (error) {
      console.error("Error adding member", error);
    }
  };

  const toggleSplitUser = (userId) => {
    if (splitBetween.includes(userId)) {
      setSplitBetween(splitBetween.filter((id) => id !== userId));
    } else {
      setSplitBetween([...splitBetween, userId]);
    }
  };

  const handleAddExpense = async () => {
    if (!expenseTitle || !expenseAmount || !payerId || splitBetween.length === 0) {
      alert("Please fill all fields and select members.");
      return;
    }

    try {
      await api.post("/api/expenses/", {
        title: expenseTitle,
        group_id: Number(id),
        payer_id: Number(payerId),
        amount: Number(expenseAmount),
        split_between: splitBetween,
      });

      setExpenseTitle("");
      setExpenseAmount("");
      setPayerId("");
      setSplitBetween([]);

      fetchExpenses();
      fetchBalances();
      fetchSimplifiedDebts();

    } catch (error) {
      console.error("Error adding expense", error);
    }
  };
  //HANDLE SETTLE FUNCTION (MOST BUGS)
  const handleSettle = async (txn) => {
  try {
    await api.post("/api/settlements/", {
      group_id: Number(id),
      payer_id: Number(txn.from),
      receiver_id: Number(txn.to),
      amount: Number(txn.amount),
    });

    // refresh UI in correct order
    await fetchBalances();
    await fetchSimplifiedDebts();
    await fetchExpenses();

  } catch (error) {
    if (error.response) {
      console.log("Backend message:", error.response.data);

      // ignore already settled payments
      if (error.response.data.error === "Payer does not owe money") {
        await fetchBalances();
        await fetchSimplifiedDebts();
      }
    }

    console.error("Error settling payment", error);
  }
};

  const getMemberName = (userId) => {
    const member = members.find((m) => m.user_id === Number(userId));
    return member ? member.name : `User ${userId}`;
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-4">Group Detail</h1>

      <p className="text-gray-600 mb-6">
        Viewing details for group ID: {id}
      </p>

      {/* MEMBERS */}
      <h2 className="text-xl font-semibold mb-3">Members</h2>

      <div className="space-y-2 mb-6">
        {members.map((member) => (
          <div
            key={member.user_id}
            className="p-3 border rounded bg-white shadow-sm"
          >
            {member.name} ({member.email})
          </div>
        ))}
      </div>

      {/* ADD MEMBER */}
      <h2 className="text-xl font-semibold mb-2">Add Member</h2>

      <div className="flex gap-2 mb-8">
        <input
          type="number"
          placeholder="User ID"
          value={newMemberId}
          onChange={(e) => setNewMemberId(e.target.value)}
          className="border p-2 rounded w-40"
        />

        <button
          onClick={handleAddMember}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>

      {/* ADD EXPENSE */}
      <h2 className="text-xl font-semibold mb-3">Add Expense</h2>

      <div className="space-y-3 mb-8">

        <input
          type="text"
          placeholder="Title"
          value={expenseTitle}
          onChange={(e) => setExpenseTitle(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <input
          type="number"
          placeholder="Amount"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <div>
          <p className="font-semibold mb-1">Paid by</p>

          <select
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select payer</option>

            {members.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="font-semibold mb-1">Split between</p>

          {members.map((member) => (
            <label key={member.user_id} className="block">
              <input
                type="checkbox"
                checked={splitBetween.includes(member.user_id)}
                onChange={() => toggleSplitUser(member.user_id)}
                className="mr-2"
              />
              {member.name}
            </label>
          ))}
        </div>

        <button
          onClick={handleAddExpense}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Expense
        </button>

      </div>

      {/* EXPENSE LIST */}
      <h2 className="text-xl font-semibold mb-3">Expenses</h2>

      <div className="space-y-3 mb-8">
        {expenses.map((expense) => (
          <div
            key={expense.expense_id}
            className="p-4 border rounded bg-white shadow-sm"
          >
            <p className="font-semibold">{expense.title}</p>
            <p className="text-gray-600">Amount: ₹{expense.amount}</p>
            <p className="text-gray-600">
              Paid by: {getMemberName(expense.paid_by)}
            </p>
          </div>
        ))}
      </div>

      {/* BALANCES */}
      <h2 className="text-xl font-semibold mb-3">Balances</h2>

      <div className="space-y-2">
        {Object.entries(balances).map(([userId, amount]) => (
          <div
            key={userId}
            className="p-3 border rounded bg-white shadow-sm"
          >
            {amount > 0
              ? `${getMemberName(userId)} is owed ₹${amount}`
              : `${getMemberName(userId)} owes ₹${Math.abs(amount)}`}
          </div>
        ))}
      </div>

      {/* SIMPLIFIED DEBTS */}
      <h2 className="text-xl font-semibold mb-3 mt-8">Simplified Debts</h2>

      <div className="space-y-2">
        {simplifiedDebts.length === 0 ? (
          <p className="text-gray-500">All settled 🎉</p>
        ) : (
          simplifiedDebts.map((txn, index) => (
            <div
              key={index}
              className="p-3 border rounded bg-white shadow-sm flex justify-between items-center"
            >
              <span>
                <span className="font-medium">{getMemberName(txn.from)}</span> pays{" "}
                <span className="font-medium">{getMemberName(txn.to)}</span>
                <span className="text-green-600 font-semibold ml-2">
                  ₹{txn.amount}
                </span>
              </span>

              <button
                onClick={() => handleSettle(txn)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
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

export default GroupDetail;