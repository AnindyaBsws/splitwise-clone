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

    <div className="space-y-4">

      {/* INPUT + BUTTON */}
      <div className="flex flex-col sm:flex-row gap-3">

        <input
          type="text"
          placeholder="Enter User Tag (e.g. #GVO94D)"
          value={userTag}
          onChange={(e) => setUserTag(e.target.value)}
          className="neon-input flex-1"
        />

        <button
          onClick={handleAdd}
          className="px-5 py-2 rounded-xl text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition"
        >
          Add Member
        </button>

      </div>

      {/* SUCCESS */}
      {message && (

        <div className="text-sm px-4 py-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/30">
          {message}
        </div>

      )}

      {/* ERROR */}
      {error && (

        <div className="text-sm px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30">
          {error}
        </div>

      )}

    </div>

  );

}

export default AddMember;