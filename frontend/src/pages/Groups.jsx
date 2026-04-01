import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGroups } from "../api/groupApi";
import DeleteGroupModal from "../components/group/DeleteGroupModal";
import api from "../api/axios";

function Groups() {

  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const navigate = useNavigate();

  const getCurrentUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return Number(payload.sub);
  };

  useEffect(() => {

    const fetchGroups = async () => {
      try {
        const data = await getGroups();
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups", error);
      }
    };

    fetchGroups();
    setCurrentUserId(getCurrentUserId());

  }, []);

  const handleCreateGroup = async () => {

    if (!groupName.trim()) return;

    try {

      await api.post("/api/groups", {
        name: groupName
      });

      const data = await getGroups();
      setGroups(data);
      setGroupName("");

    } catch (error) {
      console.error("Error creating group", error);
    }

  };

  const openDeleteModal = (groupId) => {
    setSelectedGroupId(groupId);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const confirmDeleteGroup = async () => {

    try {

      await api.delete(`/api/groups/${selectedGroupId}`);

      setGroups(prev =>
        prev.filter(group => group.id !== selectedGroupId)
      );

      setShowDeleteModal(false);

    } catch (error) {

      if (error.response) {
        setDeleteError(error.response.data.error);
      }

    }

  };

  return (

    <div className="page-container">

      <h1 className="text-3xl font-bold mb-8 text-[#E5E7EB]">
        Groups
      </h1>

      {/* CREATE GROUP */}

      <div className="p-6 mb-10 rounded-2xl 
        bg-[#111217] border border-[#22232A]">

        <h2 className="text-lg font-semibold mb-4 text-white">
          Create New Group
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">

          <input
            type="text"
            placeholder="New group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg
            bg-[#0B0B0F] border border-[#22232A]
            text-[#E5E7EB] placeholder-[#6B7280]
            focus:outline-none focus:border-indigo-500
            transition"
          />

          <button
            onClick={handleCreateGroup}
            className="px-5 py-2 rounded-lg
            bg-gradient-to-r from-indigo-500 to-purple-600
            text-white font-medium
            hover:opacity-90 transition"
          >
            Create
          </button>

        </div>

      </div>

      {/* GROUP LIST */}

      <div className="space-y-4">

        {groups.map((group) => (

          <div
            key={group.id}
            className="p-6 rounded-2xl
            bg-[#111217] border border-[#22232A]
            flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
            hover:bg-[#1A1B21] transition"
          >

            {/* LEFT */}
            <div>

              <p
                onClick={() => navigate(`/groups/${group.id}`)}
                className="font-semibold text-lg text-white cursor-pointer
                hover:text-indigo-400 transition"
              >
                {group.name}
              </p>

              <p className="text-sm text-[#9CA3AF]">
                Members: {group.memberCount}
              </p>

              {Number(group.created_by) === Number(currentUserId) && (

                <p className="text-sm text-[#6B7280]">
                  Created by you
                </p>

              )}

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

              <button
                onClick={() => navigate(`/groups/${group.id}`)}
                className="px-4 py-2 rounded-lg
                bg-gradient-to-r from-indigo-500 to-purple-600
                text-white text-sm font-medium
                hover:opacity-90 transition"
              >
                Open
              </button>

              {Number(group.created_by) === Number(currentUserId) && (

                <button
                  onClick={() => openDeleteModal(group.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg
                  bg-[#1A1B21] hover:bg-red-500/10
                  border border-[#22232A]
                  text-red-400 hover:text-red-300
                  transition"
                >
                  🗑
                </button>

              )}

            </div>

          </div>

        ))}

      </div>

      <DeleteGroupModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        confirmDeleteGroup={confirmDeleteGroup}
        deleteError={deleteError}
      />

    </div>

  );

}

export default Groups;