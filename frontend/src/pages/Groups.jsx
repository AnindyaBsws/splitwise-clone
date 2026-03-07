import { useEffect, useState } from "react";
import { getGroups } from "../api/groupApi";
import api from "../api/axios";

function Groups() {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");

  // Fetch groups when page loads
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
  }, []);

  // Create a new group
  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;

    try {
      await api.post("/api/groups", {
        name: groupName,
      });

      // refresh group list
      const data = await getGroups();
      setGroups(data);

      // clear input
      setGroupName("");
    } catch (error) {
      console.error("Error creating group", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Groups</h1>

      {/* Create group form */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="New group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <button
          onClick={handleCreateGroup}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>

      {/* Group list */}
      <div className="space-y-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="p-4 border rounded-lg shadow-sm bg-white"
          >
            {group.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Groups;