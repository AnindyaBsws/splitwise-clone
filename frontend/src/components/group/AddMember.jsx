import { useState } from "react";
import api from "../../api/axios";

function AddMember({ groupId, fetchMembers }) {

  const [userTag, setUserTag] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleAdd = async () => {

    if (!userTag.trim()) {
      setError("Please enter a user tag");
      setMessage(null);
      return;
    }

    try {

      await api.post(`/api/groups/${groupId}/add-by-tag`, {
        user_tag: userTag.trim()
      });

      setMessage("Member added successfully");
      setError(null);

      setUserTag("");

      fetchMembers();

    } catch (err) {

      setError(err.response?.data?.error || "Failed to add member");
      setMessage(null);

    }

  };

  return (

    <div className="glass-card p-6">

      <h2 className="text-xl font-semibold mb-4">
        Add Member
      </h2>

      <div className="flex flex-col sm:flex-row gap-3">

        <input
          type="text"
          placeholder="Enter User Tag (ex: #GVO94D)"
          value={userTag}
          onChange={(e) => setUserTag(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none"
        />

        <button
          onClick={handleAdd}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white"
        >
          Add
        </button>

      </div>

      {/* SUCCESS MESSAGE */}

      {message && (

        <div className="mt-4 bg-green-500/20 text-green-300 p-3 rounded-lg">
          {message}
        </div>

      )}

      {/* ERROR MESSAGE */}

      {error && (

        <div className="mt-4 bg-red-500/20 text-red-300 p-3 rounded-lg">
          {error}
        </div>

      )}

    </div>

  );

}

export default AddMember;