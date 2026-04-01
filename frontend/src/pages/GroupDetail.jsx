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

  const [totalExpense, setTotalExpense] = useState(0);

  const currentUserId = getCurrentUserId();

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
    fetchTotalExpense();

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

  if (loading) {
    return (
      <div className="page-container">
        <div className="p-8 text-center rounded-2xl bg-[#111217] border border-[#22232A] text-[#9CA3AF]">
          Loading group...
        </div>
      </div>
    );
  }

  return (

    <div className="page-container space-y-12 fade-in">

      <GroupHeader
        groupInfo={groupInfo}
        currentUserId={currentUserId}
        deleteGroup={() => setShowDeleteModal(true)}
      />

      {/* TOTAL EXPENSE */}
      <div className="p-6 rounded-2xl bg-[#111217] border border-[#22232A] flex items-center justify-between">

        <div>
          <p className="text-sm text-[#9CA3AF]">Total Expense</p>
          <p className="text-3xl font-bold text-white mt-1">
            ₹{Number(totalExpense).toFixed(2)}
          </p>
        </div>

        {(groupInfo?.created_by === currentUserId ||
          members.find(m => m.user_id === currentUserId)?.role === "admin") && (

          <button
            onClick={handleResetTotalExpense}
            className="px-4 py-2 rounded-lg border border-red-500 text-red-400 hover:bg-red-500/10 transition"
          >
            Reset
          </button>

        )}

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT */}
        <div className="space-y-8">

          <div className="p-6 rounded-2xl bg-[#111217] border border-[#22232A]">
            <h2 className="text-lg font-semibold mb-4 text-white">Add Expense</h2>
            <ExpenseForm {...{
              expenseTitle, setExpenseTitle,
              expenseAmount, setExpenseAmount,
              payerId, setPayerId,
              splitBetween, toggleSplitUser,
              members, handleAddExpense
            }} />
          </div>

          <div className="p-6 rounded-2xl bg-[#111217] border border-[#22232A]">
            <h2 className="text-lg font-semibold mb-4 text-white">Expenses</h2>
            <ExpenseList {...{
              expenses, getMemberName,
              handleClearExpenses, allSettled,
              navigate, id
            }} />
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-8">

          <div className="p-6 rounded-2xl bg-[#111217] border border-[#22232A]">
            <h2 className="text-lg font-semibold mb-4 text-white">Balances</h2>
            <BalanceList balances={balances} getMemberName={getMemberName} />
          </div>

          <div className="p-6 rounded-2xl bg-[#111217] border border-[#22232A] space-y-4">

            <div>
              <p className="font-semibold text-lg text-white">AI Insights</p>
              <p className="text-sm text-[#9CA3AF]">
                Understand how debts are calculated
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              <button
                onClick={() => navigate(`/groups/${id}/ai?mode=gemini`)}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 transition"
              >
                🤖 Gemini AI
              </button>

              <button
                onClick={() => navigate(`/groups/${id}/ai?mode=custom`)}
                className="flex-1 px-4 py-2 rounded-lg bg-[#1A1B21] border border-[#22232A] text-[#E5E7EB] hover:bg-[#22232A] transition"
              >
                🧮 Custom Logic
              </button>

            </div>

            <p className="text-xs text-[#6B7280] text-center">
              Get simplified explanations of your group's balances
            </p>

          </div>

          <div className="p-6 rounded-2xl bg-[#111217] border border-[#22232A]">
            <h2 className="text-lg font-semibold mb-4 text-white">Settlements</h2>
            <SimplifiedDebts
              simplifiedDebts={simplifiedDebts}
              getMemberName={getMemberName}
              handleSettle={handleSettle}
            />
          </div>

        </div>

      </div>

      <RemoveMemberModal {...{
        showRemoveModal,
        setShowRemoveModal,
        memberDetails,
        selectedMember,
        deleteMember
      }} />

      <DeleteGroupModal {...{
        showDeleteModal,
        setShowDeleteModal,
        confirmDeleteGroup,
        deleteError
      }} />

    </div>

  );

}

export default GroupDetail;