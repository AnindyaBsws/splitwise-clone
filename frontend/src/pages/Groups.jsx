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

    <div className="page-container space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Groups</h1>
      </div>

      {/* CREATE GROUP CARD */}
      <div className="glass-card p-6">

        <h2 className="text-lg font-semibold mb-4">
          Create New Group
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">

          <input
            type="text"
            placeholder="Enter group name..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="neon-input flex-1"
          />

          <button
            onClick={handleCreateGroup}
            className="gradient-btn"
          >
            Create
          </button>

        </div>

      </div>

      {/* GROUP LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {groups.map((group) => (

          <div
            key={group.id}
            className="glass-card p-6 flex flex-col justify-between glass-hover"
          >

            {/* GROUP INFO */}
            <div className="space-y-2">

              <p
                onClick={() => navigate(`/groups/${group.id}`)}
                className="font-semibold text-lg cursor-pointer hover:text-primary"
              >
                {group.name}
              </p>

              <p className="text-sm text-gray-400">
                {group.memberCount} members
              </p>

              {Number(group.created_by) === Number(currentUserId) && (
                <p className="text-xs text-gray-500">
                  Created by you
                </p>
              )}

            </div>

            {/* ACTIONS */}
            <div className="flex items-center justify-between mt-6">

              <button
                onClick={() => navigate(`/groups/${group.id}`)}
                className="gradient-btn"
              >
                Open
              </button>

              {Number(group.created_by) === Number(currentUserId) && (

                <button
                  onClick={() => openDeleteModal(group.id)}
                  className="text-red-400 hover:text-red-300 text-xl"
                >
                  🗑
                </button>

              )}

            </div>

          </div>

        ))}

      </div>

      {/* MODAL */}
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