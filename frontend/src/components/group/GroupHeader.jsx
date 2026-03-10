import { useNavigate } from "react-router-dom";

function GroupHeader({ groupInfo }) {

  const navigate = useNavigate();

  if (!groupInfo) return null;

  return (

    <div className="glass-card p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-6">

      {/* GROUP INFO */}

      <div>

        <h1 className="text-3xl font-bold text-white">
          {groupInfo.name}
        </h1>

        <p className="text-gray-300 mt-1">
          Created by
          <span className="ml-1 font-semibold text-indigo-400">
            {groupInfo.creator_name}
          </span>
        </p>

        <p className="text-sm text-gray-400 mt-1">
          Created on {new Date(groupInfo.created_at).toLocaleDateString()}
        </p>

      </div>

      {/* ACTION BUTTON */}

      <button
        onClick={() => navigate(`/groups/${groupInfo.id}/manage`)}
        className="gradient-btn bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 px-5 py-2 rounded-lg text-white"
      >
        Manage Group
      </button>

    </div>

  );

}

export default GroupHeader;