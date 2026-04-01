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
    return (
      <div className="page-container">
        <div className="card text-[#9CA3AF]">
          Loading group...
        </div>
      </div>
    );
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

  const generateInviteLink = async () => {
    try {
      const res = await api.post(`/api/groups/${id}/invite`);
      setInviteLink(res.data.invite_link);
    } catch {
      alert("Failed to generate invite link");
    }
  };

  const copyInviteLink = async () => {
    try {

      let link = inviteLink;

      if (!link) {
        const res = await api.post(`/api/groups/${id}/invite`);
        link = res.data.invite_link;
        setInviteLink(link);
      }

      await navigator.clipboard.writeText(link);
      alert("Invite link copied");

    } catch {
      alert("Failed to copy invite link");
    }
  };

  const shareWhatsApp = async () => {
    try {

      let link = inviteLink;

      if (!link) {
        const res = await api.post(`/api/groups/${id}/invite`);
        link = res.data.invite_link;
        setInviteLink(link);
      }

      const registerLink = `${window.location.origin}/register`;

      const message = `📊 Smart Expense Tracker

Split expenses easily with friends and never lose track of who paid.

👉 Join my group:
${link}

🆕 Not registered yet?
Create your account:
${registerLink}`;

      window.open(
        `https://wa.me/?text=${encodeURIComponent(message)}`,
        "_blank"
      );

    } catch {
      alert("Failed to generate invite link");
    }
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

    <div className="page-container space-y-12 fade-in">

      <h1 className="text-3xl font-semibold text-white tracking-tight">
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

        <div className="card space-y-5">

          <div>
            <h2 className="text-xl font-semibold text-white">
              Invite Others
            </h2>
            <p className="text-sm text-[#9CA3AF]">
              Share this group with others using a secure invite link.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={copyInviteLink}
              className="btn-primary"
            >
              Copy Invite Link
            </button>

            <button
              onClick={shareWhatsApp}
              className="
                px-4 py-2 rounded-xl text-white
                bg-green-500
                hover:bg-green-400
                shadow-[0_0_15px_rgba(34,197,94,0.4)]
                transition-all
              "
            >
              WhatsApp
            </button>

            <button
              onClick={shareEmail}
              className="btn-secondary"
            >
              Email
            </button>

          </div>

        </div>

      )}

      {/* DANGER ZONE */}
      <div className="
        card space-y-5
        shadow-[0_0_20px_rgba(239,68,68,0.15)]
      ">

        <h2 className="text-xl font-semibold text-red-400">
          Danger Zone
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">

          <button
            onClick={handleLeaveGroup}
            className="btn-secondary"
          >
            Leave Group
          </button>

          {isCreator && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn-danger"
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