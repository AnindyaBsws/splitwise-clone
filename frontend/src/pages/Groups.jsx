import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGroups } from "../api/groupApi";
import api from "../api/axios";

function Groups() {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getGroups();

        // fetch member counts
        const groupsWithMembers = await Promise.all(
          data.map(async (group) => {
            try {
              const res = await api.get(`/api/groups/${group.id}/members`);
              return {
                ...group,
                memberCount: res.data.length
              };
            } catch {
              return {
                ...group,
                memberCount: 0
              };
            }
          })
        );

        setGroups(groupsWithMembers);

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
        name: groupName,
      });

      const data = await getGroups();

      const groupsWithMembers = await Promise.all(
        data.map(async (group) => {
          const res = await api.get(`/api/groups/${group.id}/members`);
          return {
            ...group,
            memberCount: res.data.length
          };
        })
      );

      setGroups(groupsWithMembers);
      setGroupName("");

    } catch (error) {
      console.error("Error creating group", error);
    }
  };

  const getCurrentUserId = () => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return Number(payload.sub);
  };

  const deleteGroup = async (groupId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this group?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/groups/${groupId}`);

      setGroups(prev =>
        prev.filter(group => group.id !== groupId)
      );

    } catch (error) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-8">Groups</h1>

      {/* Create Group Card */}
      <div className="bg-white border rounded-xl shadow-sm p-6 mb-8">

        <h2 className="text-lg font-semibold mb-4">
          Create New Group
        </h2>

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="New group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="border p-2 rounded-lg flex-1"
          />

          <button
            onClick={handleCreateGroup}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Create
          </button>

        </div>

      </div>

      {/* Groups List */}
      <div className="space-y-5">

        {groups.map((group) => (

          <div
            key={group.id}
            className="bg-white border rounded-xl shadow-sm p-6 flex justify-between items-center hover:shadow-md transition"
          >

            {/* Group Info */}
            <div>

              <p
                onClick={() => navigate(`/groups/${group.id}`)}
                className="font-semibold text-lg cursor-pointer hover:text-blue-600"
              >
                {group.name}
              </p>

              <p className="text-sm text-gray-500">
                Members: {group.memberCount}
              </p>

              {Number(group.created_by) === Number(currentUserId) && (
                <p className="text-sm text-gray-500">
                  Created by you
                </p>
              )}

            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">

              <button
                onClick={() => navigate(`/groups/${group.id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Open
              </button>

              {Number(group.created_by) === Number(currentUserId) && (
                <button
                  onClick={() => deleteGroup(group.id)}
                  className="text-red-600 hover:text-red-800 text-xl"
                >
                  🗑
                </button>
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Groups;