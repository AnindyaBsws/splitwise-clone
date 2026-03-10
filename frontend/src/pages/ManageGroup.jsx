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
    groupInfo,
    members,
    fetchMembers
  } = useGroupData(id);

  const currentUserId = getCurrentUserId();

  const [selectedMember, setSelectedMember] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [memberDetails, setMemberDetails] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [inviteLink, setInviteLink] = useState("");

  if (!members || !groupInfo) {
    return <div className="page-container">Loading group...</div>;
  }

  const currentUser = members.find(
    (m) => Number(m.user_id) === Number(currentUserId)
  );

  const isCreator =
    Number(groupInfo.created_by) === Number(currentUserId);

  const isAdmin =
    currentUser?.role === "admin";

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

  // ---------------- INVITE ----------------

  const generateInviteLink = async () => {

    try {

      const res = await api.post(`/api/groups/${id}/invite`);

      setInviteLink(res.data.invite_link);

    } catch {

      alert("Failed to generate invite link");

    }

  };

  const copyInviteLink = async () => {

    if (!inviteLink) {
      await generateInviteLink();
    }

    navigator.clipboard.writeText(inviteLink);

    alert("Invite link copied");

  };

  const shareWhatsApp = async () => {

    if (!inviteLink) {
      await generateInviteLink();
    }

    const message = `Join my expense group: ${inviteLink}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank"
    );

  };

  const shareEmail = async () => {

    if (!inviteLink) {
      await generateInviteLink();
    }

    const subject = "Join my expense group";
    const body = `Join my expense group using this link:\n\n${inviteLink}`;

    window.location.href =
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  };

  return (

    <div className="page-container space-y-10 fade-in">

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
          groupId={id}
          fetchMembers={fetchMembers}
        />

      )}

      {/* INVITE SECTION */}

      {(isCreator || isAdmin) && (

        <div className="glass-card p-6">

          <h2 className="text-xl font-semibold mb-4">
            Invite Others
          </h2>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={copyInviteLink}
              className="gradient-btn"
            >
              Copy Invite Link
            </button>

            <button
              onClick={shareWhatsApp}
              className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-white"
            >
              WhatsApp
            </button>

            <button
              onClick={shareEmail}
              className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
            >
              Email
            </button>

          </div>

        </div>

      )}

      {/* DANGER ZONE */}

      <div className="glass-card p-6 border border-red-400/40">

        <h2 className="text-xl font-semibold text-red-400 mb-4">
          Danger Zone
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">

          <button
            onClick={handleLeaveGroup}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
          >
            Leave Group
          </button>

          {isCreator && (

            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white"
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