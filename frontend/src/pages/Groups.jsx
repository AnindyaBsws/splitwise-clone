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

  // --------------------------------
  // FETCH GROUPS
  // --------------------------------
  useEffect(() => {

    const fetchGroups = async () => {

      try {

        const data = await getGroups();

        // Backend already returns memberCount
        setGroups(data);

      } catch (error) {

        console.error("Error fetching groups", error);

      }

    };

    fetchGroups();
    setCurrentUserId(getCurrentUserId());

  }, []);

  // --------------------------------
  // CREATE GROUP
  // --------------------------------
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

      <h1 className="text-3xl font-bold mb-8">
        Groups
      </h1>

      <div className="glass-card p-6 mb-10">

        <h2 className="text-lg font-semibold mb-4">
          Create New Group
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">

          <input
            type="text"
            placeholder="New group name"
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

      <div className="space-y-5">

        {groups.map((group) => (

          <div
            key={group.id}
            className="glass-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:-translate-y-1"
          >

            <div>

              <p
                onClick={() => navigate(`/groups/${group.id}`)}
                className="font-semibold text-lg cursor-pointer hover:text-indigo-400"
              >
                {group.name}
              </p>

              <p className="text-sm text-gray-400">
                Members: {group.memberCount}
              </p>

              {Number(group.created_by) === Number(currentUserId) && (

                <p className="text-sm text-gray-400">
                  Created by you
                </p>

              )}

            </div>

            <div className="flex items-center gap-4">

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