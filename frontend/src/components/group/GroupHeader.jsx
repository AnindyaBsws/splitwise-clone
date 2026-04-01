import { useNavigate } from "react-router-dom";
import React from "react";

function GroupHeader({ groupInfo }) {

  const navigate = useNavigate();

  if (!groupInfo) return null;

  return (

    <div className="
      relative card flex flex-col md:flex-row md:justify-between md:items-center gap-6
      overflow-hidden
    ">

      {/* subtle glow */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl
        bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.15),transparent_60%)] opacity-70" />

      {/* CONTENT */}
      <div className="relative z-10">

        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
          {groupInfo.name}
        </h1>

        <p className="text-[#9CA3AF] mt-2 text-sm">

          Created by
          <span className="ml-1 font-semibold text-indigo-400">
            {groupInfo.creator_name}
          </span>

        </p>

        <p className="text-xs text-[#6B7280] mt-1">
          Created on {new Date(groupInfo.created_at).toLocaleDateString()}
        </p>

      </div>

      {/* ACTION */}
      <div className="relative z-10">

        <button
          onClick={() => navigate(`/groups/${groupInfo.id}/manage`)}
          className="btn-primary px-5 py-2"
        >
          Manage Group
        </button>

      </div>

    </div>

  );

}

export default React.memo(GroupHeader);