import { useNavigate } from "react-router-dom";
import React from "react";

function GroupHeader({ groupInfo }) {

  const navigate = useNavigate();

  if (!groupInfo) return null;

  return (

    <div className="glass-card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 glass-hover">

      {/* LEFT: GROUP INFO */}
      <div className="space-y-2">

        <h1 className="text-3xl font-bold text-white">
          {groupInfo.name}
        </h1>

        <p className="text-sm text-gray-400">
          Created by{" "}
          <span className="text-primary font-medium">
            {groupInfo.creator_name}
          </span>
        </p>

        <p className="text-xs text-gray-500">
          {new Date(groupInfo.created_at).toLocaleDateString()}
        </p>

      </div>

      {/* RIGHT: ACTION */}
      <button
        onClick={() => navigate(`/groups/${groupInfo.id}/manage`)}
        className="gradient-btn px-6 py-2 whitespace-nowrap"
      >
        Manage Group
      </button>

    </div>

  );

}

export default React.memo(GroupHeader);