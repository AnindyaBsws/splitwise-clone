import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import useGroupData from "../hooks/useGroupData";
import getCurrentUserId from "../utils/getCurrentUserId";
import api from "../api/axios";

import MemberList from "../components/group/MemberList";
import AddMember from "../components/group/AddMember";
import RemoveMemberModal from "../components/group/RemoveMemberModal";
import DeleteGroupModal from "../components/group/DeleteGroupModal";

function ManageGroup() {

  const { id } = useParams();
  const navigate = useNavigate();

  const {
    allUsers,
    groupInfo,
    members,
    fetchMembers
  } = useGroupData(id);

  const currentUserId = getCurrentUserId();

  const [newMemberId, setNewMemberId] = useState("");

  const [selectedMember, setSelectedMember] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [memberDetails, setMemberDetails] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  if (!members || !groupInfo) {
    return <div className="p-8">Loading group...</div>;
  }

  const currentUser = members.find(
    (m) => Number(m.user_id) === Number(currentUserId)
  );

  const isCreator =
    Number(groupInfo.created_by) === Number(currentUserId);

  const isAdmin =
    currentUser?.role === "admin";

  const availableUsers = allUsers.filter(
    (user) => !members.some((member) => member.user_id === user.user_id)
  );


  const openRemoveModal = (member) => {

    setMemberDetails(member);
    setSelectedMember(member);
    setShowRemoveModal(true);

    };

  const deleteMember = async () => {

    try {

      await api.delete(`/api/groups/${id}/members/${selectedMember.user_id}`);

      setShowRemoveModal(false);

      fetchMembers();

    } catch (error) {

      if (error.response) {
        setMemberDetails(error.response.data);
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

  const handleLeaveGroup = async () => {

    try {

      await api.post(`/api/groups/${id}/leave`);

      navigate("/groups");

    } catch (error) {

      alert(error.response?.data?.error || "Failed to leave group");

    }

  };

  const handleAddMember = async () => {

    if (!newMemberId.trim()) return;

    await api.post(`/api/groups/${id}/members`, {
      user_id: Number(newMemberId)
    });

    setNewMemberId("");

    fetchMembers();

  };

  return (

    <div className="p-8 max-w-5xl mx-auto space-y-8">

      <h1 className="text-3xl font-bold">
        Manage Group
      </h1>

      <MemberList
        members={members}
        groupInfo={groupInfo}
        currentUserId={currentUserId}
        groupId={id}
        openRemoveModal={openRemoveModal}
        fetchMembers={fetchMembers}
      />

      {(isCreator || isAdmin) && (
        <AddMember
          newMemberId={newMemberId}
          setNewMemberId={setNewMemberId}
          availableUsers={availableUsers}
          handleAddMember={handleAddMember}
        />
      )}

      <div className="bg-white border rounded-xl shadow-sm p-6">

        <h2 className="text-xl font-semibold text-red-600 mb-4">
          Danger Zone
        </h2>

        <div className="flex gap-4">

          <button
            onClick={handleLeaveGroup}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Leave Group
          </button>

          {isCreator && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Delete Group
            </button>
          )}

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

export default ManageGroup;