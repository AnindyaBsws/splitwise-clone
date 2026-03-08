import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";

function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);

  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [simplifiedDebts, setSimplifiedDebts] = useState([]);

  const [newMemberId, setNewMemberId] = useState("");

  const [selectedMember, setSelectedMember] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [memberDetails, setMemberDetails] = useState(null);

  const [currentUserId, setCurrentUserId] = useState(null);

  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [payerId, setPayerId] = useState("");
  const [splitBetween, setSplitBetween] = useState([]);

  const availableUsers = allUsers.filter(
    (user) => !members.some((member) => member.user_id === user.user_id)
  );

  const allSettled = Object.values(balances).every(
    (b) => Math.abs(Number(b)) < 0.01
  );

  const fetchMembers = async () => {
    const res = await api.get(`/api/groups/${id}/members`);
    setMembers(res.data);
  };

  const fetchGroupInfo = async () => {
    const res = await api.get(`/api/groups/${id}`);
    setGroupInfo(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get("/api/users/");
    setAllUsers(res.data);
  };

  const fetchExpenses = async () => {
    const res = await api.get(`/api/expenses/group/${id}`);
    setExpenses(res.data);
  };

  const fetchBalances = async () => {
    const res = await api.get(`/api/groups/${id}/balances`);
    setBalances(res.data);
  };

  const fetchSimplifiedDebts = async () => {
    const res = await api.get(`/api/groups/${id}/simplify`);
    setSimplifiedDebts(res.data);
  };

  const getCurrentUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Number(payload.sub);
  };

  useEffect(() => {
    fetchGroupInfo();
    fetchMembers();
    fetchUsers();
    fetchExpenses();
    fetchBalances();
    fetchSimplifiedDebts();
    setCurrentUserId(getCurrentUserId());
  }, [id]);

  const getMemberName = (userId) => {
    const member = members.find((m) => m.user_id === Number(userId));
    return member ? member.name : `User ${userId}`;
  };

  const openRemoveModal = async (member) => {
    try {
      const res = await api.get(`/api/groups/${id}/members/${member.user_id}`);
      setMemberDetails(res.data);
      setSelectedMember(member);
      setShowRemoveModal(true);
    } catch (error) {
      if (error.response) {
        setMemberDetails(error.response.data);
        setSelectedMember(member);
        setShowRemoveModal(true);
      }
    }
  };

  const handleAddMember = async () => {
    if (!newMemberId.trim()) return;

    await api.post(`/api/groups/${id}/members`, {
      user_id: Number(newMemberId),
    });

    setNewMemberId("");
    fetchMembers();
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
  };

  const handleClearExpenses = async () => {
    await api.post(`/api/groups/${id}/clear-expenses`);
    fetchExpenses();
    fetchBalances();
    fetchSimplifiedDebts();
  };

  const handleSettle = async (txn) => {
    await api.post("/api/settlements/", {
      group_id: Number(id),
      payer_id: Number(txn.from),
      receiver_id: Number(txn.to),
      amount: Number(txn.amount),
    });

    fetchBalances();
    fetchSimplifiedDebts();
    fetchExpenses();
  };

  const deleteMember = async () => {
    await api.delete(`/api/groups/${id}/members/${selectedMember.user_id}`);

    setShowRemoveModal(false);

    fetchMembers();
    fetchBalances();
    fetchSimplifiedDebts();
    fetchExpenses();
  };

  const deleteGroup = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this group?"
    );

    if (!confirmDelete) return;

    await api.delete(`/api/groups/${id}`);
    navigate("/groups");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">

      {/* GROUP HEADER */}

      {groupInfo && (
        <div className="bg-white border rounded-xl shadow-sm p-6 flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold">{groupInfo.name}</h1>
            <p className="text-gray-600">
              Created by: {groupInfo.creator_name}
            </p>
            <p className="text-gray-500 text-sm">
              Created on: {new Date(groupInfo.created_at).toLocaleDateString()}
            </p>
          </div>

          {Number(groupInfo.created_by) === Number(currentUserId) && (
            <button
              onClick={deleteGroup}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Delete Group
            </button>
          )}
        </div>
      )}

      {/* DASHBOARD GRID */}

      <div className="grid md:grid-cols-2 gap-8">

        {/* LEFT COLUMN */}

        <div className="space-y-8">

          {/* ADD EXPENSE */}

          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Add Expense</h2>

            <input
              type="text"
              placeholder="Expense title"
              value={expenseTitle}
              onChange={(e) => setExpenseTitle(e.target.value)}
              className="border rounded-lg p-2 w-full mb-3"
            />

            <input
              type="number"
              placeholder="Amount"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              className="border rounded-lg p-2 w-full mb-3"
            />

            <select
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className="border rounded-lg p-2 w-full mb-3"
            >
              <option value="">Paid by</option>
              {members.map((member) => (
                <option key={member.user_id} value={member.user_id}>
                  {member.name}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {members.map((member) => (
                <label key={member.user_id} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={splitBetween.includes(member.user_id)}
                    onChange={() => toggleSplitUser(member.user_id)}
                  />
                  {member.name}
                </label>
              ))}
            </div>

            <button
              onClick={handleAddExpense}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
            >
              Add Expense
            </button>
          </div>

          {/* CURRENT EXPENSES */}
          <div className="bg-white border rounded-xl shadow-sm p-6">

            <h2 className="text-xl font-semibold mb-4">Current Expenses</h2>

            {expenses.length === 0 ? (
              <p className="text-gray-500">No expenses yet</p>
            ) : (
              expenses.map((expense) => (
                <div
                  key={expense.expense_id}
                  className="border rounded-lg p-4 flex justify-between items-center mb-3 hover:bg-gray-50"
                >

                  <div>
                    <p className="font-semibold">💸 {expense.title}</p>

                    <p className="text-sm text-gray-500">
                      Paid by {getMemberName(expense.paid_by)}
                    </p>
                  </div>

                  <div className="font-semibold text-lg">
                    {formatCurrency(expense.amount)}
                  </div>

                </div>
              ))
            )}

            {/* ACTION BUTTONS */}

            <div className="flex flex-col gap-3 mt-6">

              <button
                onClick={handleClearExpenses}
                disabled={!allSettled}
                className={`px-4 py-2 rounded-lg text-white ${
                  allSettled
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Clear Current Expenses
              </button>

              <button
                onClick={() => navigate(`/groups/${id}/history`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Expense History
              </button>

            </div>

          </div>
        </div>

        {/* RIGHT COLUMN */}

        <div className="space-y-8">

          {/* MEMBERS */}

          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Members</h2>

            {members.map((member) => (
              <div
                key={member.user_id}
                className="flex justify-between items-center border rounded-lg p-3 mb-2"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    {member.name[0]}
                  </div>

                  {member.name}
                </div>

                {groupInfo &&
                  Number(groupInfo.created_by) === Number(currentUserId) &&
                  member.user_id !== currentUserId && (
                    <button
                      onClick={() => openRemoveModal(member)}
                      className="text-red-600"
                    >
                      🗑
                    </button>
                  )}
              </div>
            ))}
          </div>

          {/* ADD MEMBER */}

          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Add Member</h2>

            <div className="flex gap-3">
              <select
                value={newMemberId}
                onChange={(e) => setNewMemberId(e.target.value)}
                className="border rounded-lg p-2 flex-1"
              >
                <option value="">Select User</option>

                {availableUsers.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddMember}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>

          {/* BALANCES */}

          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Balances</h2>

            {Object.entries(balances).map(([userId, amount]) => {
              const value = Number(amount);

              return (
                <div
                  key={userId}
                  className="border rounded-lg p-3 flex justify-between mb-2"
                >
                  <span>
                    {value > 0 ? (
                      <span className="text-green-600 font-semibold">
                        {getMemberName(userId)} gets
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        {getMemberName(userId)} owes
                      </span>
                    )}
                  </span>

                  <span>{formatCurrency(Math.abs(value))}</span>
                </div>
              );
            })}
          </div>

          {/* SIMPLIFIED DEBTS */}

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
                    {getMemberName(txn.from)} → {getMemberName(txn.to)}
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
        </div>
      </div>
    </div>
  );
}

export default GroupDetail;