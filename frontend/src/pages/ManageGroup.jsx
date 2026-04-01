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
      <div className="page-container text-gray-400 mt-10">
        Loading group...
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

      {/* HEADER */}
      <h1 className="text-3xl font-bold">
        Manage Group
      </h1>

      {/* MEMBERS */}
      <div className="space-y-4">
        <MemberList
          members={members}
          groupInfo={groupInfo}
          currentUserId={currentUserId}
          groupId={id}
          openRemoveModal={openRemoveModal}
          fetchMembers={fetchMembers}
        />
      </div>

      {/* ADD MEMBER */}
      {(isCreator || isAdmin) && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            Add Member
          </h2>

          <div className="glass-card p-6">
            <AddMember
              groupId={id}
              fetchMembers={fetchMembers}
            />
          </div>
        </div>
      )}

      {/* INVITE */}
      {(isCreator || isAdmin) && (

        <div className="glass-card p-6 space-y-4">

          <h2 className="text-lg font-semibold">
            Invite Others
          </h2>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={copyInviteLink}
              className="gradient-btn"
            >
              Copy Link
            </button>

            <button
              onClick={shareWhatsApp}
              className="px-4 py-2 rounded-xl text-sm bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition"
            >
              WhatsApp
            </button>

            <button
              onClick={shareEmail}
              className="px-4 py-2 rounded-xl text-sm bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              Email
            </button>

          </div>

        </div>

      )}

      {/* DANGER ZONE */}
      <div className="glass-card p-6 border border-red-500/30 space-y-4">

        <h2 className="text-lg font-semibold text-red-400">
          Danger Zone
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">

          <button
            onClick={handleLeaveGroup}
            className="px-4 py-2 rounded-xl text-sm bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            Leave Group
          </button>

          {isCreator && (

            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition"
            >
              Delete Group
            </button>

          )}

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

export default ManageGroup;