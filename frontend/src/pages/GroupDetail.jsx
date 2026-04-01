import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";

import useGroupData from "../hooks/useGroupData";
import getCurrentUserId from "../utils/getCurrentUserId";
import api from "../api/axios";

import GroupHeader from "../components/group/GroupHeader";
import ExpenseForm from "../components/group/ExpenseForm";
import ExpenseList from "../components/group/ExpenseList";
import BalanceList from "../components/group/BalanceList";
import SimplifiedDebts from "../components/group/SimplifiedDebts";
import RemoveMemberModal from "../components/group/RemoveMemberModal";
import DeleteGroupModal from "../components/group/DeleteGroupModal";

function GroupDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const {
    loading,
    groupInfo,
    members,
    expenses,
    balances,
    simplifiedDebts,
    fetchMembers,
    fetchExpenses,
    fetchBalances,
    fetchSimplifiedDebts
  } = useGroupData(id);

  const [newMemberId, setNewMemberId] = useState("");

  const [selectedMember, setSelectedMember] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [memberDetails, setMemberDetails] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [payerId, setPayerId] = useState("");
  const [splitBetween, setSplitBetween] = useState([]);

  // 🔥 NEW STATE
  const [totalExpense, setTotalExpense] = useState(0);

  const currentUserId = getCurrentUserId();

  // --------------------------------
  // FETCH TOTAL EXPENSE
  // --------------------------------
  const fetchTotalExpense = async () => {
    try {
      const res = await api.get(`/api/groups/${id}/total-expense`);
      setTotalExpense(res.data.total_expense);
    } catch (err) {
      console.error("Error fetching total expense");
    }
  };

  useEffect(() => {
    fetchTotalExpense();
  }, [id]);

  // --------------------------------
  // RESET TOTAL EXPENSE
  // --------------------------------
  const handleResetTotalExpense = async () => {

    const confirm = window.confirm(
      "Do you want to reset the group's total expense to zero?"
    );

    if (!confirm) return;

    try {
      await api.post(`/api/groups/${id}/reset-total-expense`);
      fetchTotalExpense();
    } catch (err) {
      alert("Only creator or admin can reset");
    }
  };

  //Hooks First
  const allSettled = useMemo(() => {
    return (
      Object.values(balances).length > 0 &&
      Object.values(balances).every((b) => Math.abs(Number(b)) <= 0.01)
    );
  }, [balances]);

  const getMemberName = (userId) => {
    const member = members.find((m) => m.user_id === Number(userId));
    return member ? member.name : `User ${userId}`;
  };

  const openRemoveModal = async (member) => {

    setMemberDetails(null);

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

  const confirmDeleteGroup = async () => {

    try {

      await api.delete(`/api/groups/${id}`);
      navigate("/groups");

    } catch (error) {

      if (error.response) {
        setDeleteError(error.response.data.error);
        setShowDeleteModal(true);
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
    fetchTotalExpense(); // 🔥 update total

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

    try {

      await api.delete(`/api/groups/${id}/members/${selectedMember.user_id}`);

      setShowRemoveModal(false);

      fetchMembers();
      fetchBalances();
      fetchSimplifiedDebts();
      fetchExpenses();

    } catch (error) {

      if (error.response) {
        setMemberDetails(error.response.data);
        setShowRemoveModal(true);
      }

    }

  };

  // Prevent UI from rendering before group data arrives
  if (loading) {
    return (
      <div className="page-container">
        <div className="glass-card p-8 text-center text-gray-300">
          Loading group...
        </div>
      </div>
    );
  }

  return (

    <div className="page-container space-y-12 fade-in">

      {/* HEADER */}
      <GroupHeader
        groupInfo={groupInfo}
        currentUserId={currentUserId}
        deleteGroup={() => setShowDeleteModal(true)}
      />

      {/* TOTAL EXPENSE */}
      <div className="glass-card p-6 flex items-center justify-between glass-hover">

        <div>
          <p className="text-sm text-gray-400">Total Expense</p>
          <p className="text-3xl font-bold text-primary mt-1">
            ₹{Number(totalExpense).toFixed(2)}
          </p>
        </div>

        {(groupInfo?.created_by === currentUserId ||
          members.find(m => m.user_id === currentUserId)?.role === "admin") && (

          <button
            onClick={handleResetTotalExpense}
            className="px-4 py-2 rounded-xl border border-red-500 text-red-400 hover:bg-red-500/10 transition"
          >
            Reset
          </button>

        )}

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT SIDE */}
        <div className="space-y-8">

          {/* ADD EXPENSE */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">
              Add Expense
            </h2>

            <ExpenseForm
              expenseTitle={expenseTitle}
              setExpenseTitle={setExpenseTitle}
              expenseAmount={expenseAmount}
              setExpenseAmount={setExpenseAmount}
              payerId={payerId}
              setPayerId={setPayerId}
              splitBetween={splitBetween}
              toggleSplitUser={toggleSplitUser}
              members={members}
              handleAddExpense={handleAddExpense}
            />
          </div>

          {/* EXPENSE LIST */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">
              Expenses
            </h2>

            <ExpenseList
              expenses={expenses}
              getMemberName={getMemberName}
              handleClearExpenses={handleClearExpenses}
              allSettled={allSettled}
              navigate={navigate}
              id={id}
            />
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-8">

          {/* BALANCES */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">
              Balances
            </h2>

            <BalanceList
              balances={balances}
              getMemberName={getMemberName}
            />
          </div>

          {/* AI INSIGHTS */}
          <div className="glass-card p-6 space-y-4">

            <div>
              <p className="font-semibold text-lg">AI Insights</p>
              <p className="text-sm text-gray-400">
                Understand how debts are calculated
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              <button
                onClick={() => navigate(`/groups/${id}/ai?mode=gemini`)}
                className="gradient-btn flex-1"
              >
                🤖 Gemini AI
              </button>

              <button
                onClick={() => navigate(`/groups/${id}/ai?mode=custom`)}
                className="glass-card p-3 flex-1 text-center"
              >
                🧮 Custom Logic
              </button>

            </div>

            <p className="text-xs text-gray-400 text-center">
              Get simplified explanations of your group's balances
            </p>

          </div>

          {/* SIMPLIFIED DEBTS */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">
              Settlements
            </h2>

            <SimplifiedDebts
              simplifiedDebts={simplifiedDebts}
              getMemberName={getMemberName}
              handleSettle={handleSettle}
            />
          </div>

        </div>

      </div>

      {/* MODALS */}
      <RemoveMemberModal
        showRemoveModal={showRemoveModal}
        setShowRemoveModal={setShowRemoveModal}
        memberDetails={memberDetails}
        selectedMember={selectedMember}
        deleteMember={deleteMember}
      />

      <DeleteGroupModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        confirmDeleteGroup={confirmDeleteGroup}
        deleteError={deleteError}
      />

    </div>

  );

}

export default GroupDetail;