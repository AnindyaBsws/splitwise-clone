import { useNavigate } from "react-router-dom";
import React from "react";

function GroupHeader({ groupInfo }) {

  const navigate = useNavigate();

  if (!groupInfo) return null;

  return (

    <div className="card p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-6">

      {/* GROUP INFO */}

      <div>

        <h1 className="text-3xl font-bold text-white">
          {groupInfo.name}
        </h1>

        <p className="text-[#9CA3AF] mt-1">
          Created by
          <span className="ml-1 font-semibold text-indigo-400">
            {groupInfo.creator_name}
          </span>
        </p>

        <p className="text-sm text-[#6B7280] mt-1">
          Created on {new Date(groupInfo.created_at).toLocaleDateString()}
        </p>

      </div>

      {/* ACTION BUTTON */}

      <button
        onClick={() => navigate(`/groups/${groupInfo.id}/manage`)}
        className="btn-primary px-5 py-2"
      >
        Manage Group
      </button>

    </div>

  );

}

export default React.memo(GroupHeader);