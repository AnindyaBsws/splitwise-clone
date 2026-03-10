import { useState } from "react";
import api from "../../api/axios";

function AddMember({ groupId, fetchMembers }) {

  const [userTag, setUserTag] = useState("");

  const handleAdd = async () => {

    if (!userTag) {
      alert("Enter user tag");
      return;
    }

    try {

      await api.post(`/api/groups/${groupId}/add-by-tag`, {
        user_tag: userTag
      });

      alert("Member added");

      setUserTag("");

      fetchMembers();

    } catch (err) {

      alert(err.response?.data?.error || "Failed to add member");

    }

  };

  return (

    <div className="bg-white border rounded-xl shadow-sm p-6">

      <h2 className="text-xl font-semibold mb-4">Add Member</h2>

      <input
        type="text"
        placeholder="Enter User Tag (ex: #GVO94D)"
        value={userTag}
        onChange={(e) => setUserTag(e.target.value)}
        className="border rounded-lg p-2 w-full mb-3"
      />

      <button
        onClick={handleAdd}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Add
      </button>

    </div>

  );
}

export default AddMember;