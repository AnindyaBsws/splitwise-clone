import { useNavigate } from "react-router-dom";

function GroupHeader({ groupInfo }) {

  const navigate = useNavigate();

  if (!groupInfo) return null;

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

      <button
        onClick={() => navigate(`/groups/${groupInfo.id}/manage`)}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
      >
        Manage Group
      </button>

    </div>
  );
}

export default GroupHeader;