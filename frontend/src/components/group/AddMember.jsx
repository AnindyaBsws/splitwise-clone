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

    <div className="card space-y-5">

      <h2 className="text-xl font-semibold text-white tracking-tight">
        Add Member
      </h2>

      <div className="flex flex-col sm:flex-row gap-3">

        <input
          type="text"
          placeholder="Enter User Tag (ex: #GVO94D)"
          value={userTag}
          onChange={(e) => setUserTag(e.target.value)}
          className="input flex-1"
        />

        <button
          onClick={handleAdd}
          className="btn-primary px-4 py-2"
        >
          Add
        </button>

      </div>

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="
          text-sm rounded-xl px-4 py-2
          bg-green-500/10 text-green-400
          shadow-[0_0_10px_rgba(34,197,94,0.2)]
        ">
          {message}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="
          text-sm rounded-xl px-4 py-2
          bg-red-500/10 text-red-400
          shadow-[0_0_10px_rgba(239,68,68,0.2)]
        ">
          {error}
        </div>
      )}

    </div>

  );

}

export default AddMember;