import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function GroupHeader({ groupInfo, currentUserId, deleteGroup }) {

  const navigate = useNavigate();

  if (!groupInfo) return null;

  const isCreator = Number(groupInfo.created_by) === Number(currentUserId);

  const handleLeaveGroup = async () => {
    try {
      await api.post(`/api/groups/${groupInfo.id}/leave`);
      navigate("/groups");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to leave group");
    }
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 flex justify-between items-center">

      <div>
        <h1 className="text-3xl font-bold">{groupInfo.name}</h1>

        <p className="text-gray-600">
          Created by: {groupInfo.creator_name}
        </p>

        <p className="text-gray-500 text-sm">
          Created on: {new Date(groupInfo.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-3">

        {isCreator && (
          <button
            onClick={deleteGroup}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Delete Group
          </button>
        )}

        {!isCreator && (
          <button
            onClick={handleLeaveGroup}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Leave Group
          </button>
        )}

      </div>

    </div>
  );
}

export default GroupHeader;