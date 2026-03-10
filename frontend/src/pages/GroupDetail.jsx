import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import useGroupData from "../hooks/useGroupData";
import getCurrentUserId from "../utils/getCurrentUserId";
import api from "../api/axios";

import GroupHeader from "../components/group/GroupHeader";
import ExpenseForm from "../components/group/ExpenseForm";
import ExpenseList from "../components/group/ExpenseList";
import MemberList from "../components/group/MemberList";
import AddMember from "../components/group/AddMember";
import BalanceList from "../components/group/BalanceList";
import SimplifiedDebts from "../components/group/SimplifiedDebts";
import RemoveMemberModal from "../components/group/RemoveMemberModal";
import DeleteGroupModal from "../components/group/DeleteGroupModal";

function GroupDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const {

    allUsers,
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

  const currentUserId = getCurrentUserId();

  const availableUsers = allUsers.filter(
    (user) => !members.some((member) => member.user_id === user.user_id)
  );

  const allSettled =
    Object.values(balances).length > 0 &&
    Object.values(balances).every((b) => Math.abs(Number(b)) <= 0.01);

  const getMemberName = (userId) => {

    const member = members.find((m) => m.user_id === Number(userId));

    return member ? member.name : `User ${userId}`;

  };

  const openRemoveModal = async (member) => {
    setMemberDetails(null); // reset old state

    try {

      const res = await api.get(`/api/groups/${id}/members/${member.user_id}`);

      console.log("Member details:", res.data);

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

  return (

    <div className="p-8 max-w-7xl mx-auto space-y-10">

      <GroupHeader
        groupInfo={groupInfo}
        currentUserId={currentUserId}
        deleteGroup={() => setShowDeleteModal(true)}
      />

      <div className="grid md:grid-cols-2 gap-8">

        <div className="space-y-8">

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

          <ExpenseList
            expenses={expenses}
            getMemberName={getMemberName}
            handleClearExpenses={handleClearExpenses}
            allSettled={allSettled}
            navigate={navigate}
            id={id}
          />

        </div>

        <div className="space-y-8">

          <BalanceList
            balances={balances}
            getMemberName={getMemberName}
          />

          <SimplifiedDebts
            simplifiedDebts={simplifiedDebts}
            getMemberName={getMemberName}
            handleSettle={handleSettle}
          />

        </div>

      </div>

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