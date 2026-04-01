import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";

function JoinGroup() {

  const { token } = useParams();
  const navigate = useNavigate();
  const { token: authToken } = useAuth();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchPreview = async () => {

      try {
        const res = await api.get(`/api/groups/invite/${token}`);
        setGroup(res.data);
      } catch (err) {
        setError("Invalid or expired invite link");
      } finally {
        setLoading(false);
      }

    };

    fetchPreview();

  }, [token]);

  const handleJoin = async () => {

    if (!authToken) {
      navigate("/");
      return;
    }

    try {

      const res = await api.post(`/api/groups/join/${token}`);
      navigate(`/groups/${res.data.group_id}`);

    } catch (err) {

      setError(
        err.response?.data?.error || "Failed to join group"
      );

    }

  };

  /* LOADING */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-[#9CA3AF]">
        <p className="text-lg">Loading invite...</p>
      </div>
    );
  }

  /* ERROR */

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">

        <div className="card text-center">

          <h2 className="text-xl font-semibold mb-3 text-white">
            Invite Error
          </h2>

          <p className="text-red-400">
            {error}
          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="
      min-h-screen flex items-center justify-center px-6
      bg-[#020617] relative overflow-hidden
    ">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_60%)]" />

      <div className="
        relative z-10
        card w-full max-w-md p-8
        shadow-[0_20px_60px_rgba(0,0,0,0.8)]
        space-y-6
      ">

        {/* GROUP HEADER */}
        <div className="text-center">

          <div className="
            w-14 h-14 mx-auto rounded-full
            bg-gradient-to-r from-indigo-500 to-purple-600
            flex items-center justify-center text-white font-bold text-lg mb-3
            shadow-[0_0_15px_rgba(99,102,241,0.5)]
          ">
            {group.group_name[0].toUpperCase()}
          </div>

          <h1 className="text-2xl font-semibold text-white tracking-tight">
            {group.group_name}
          </h1>

          <p className="text-[#9CA3AF] text-sm mt-1">
            Created by{" "}
            <span className="text-white font-medium">
              {group.creator}
            </span>
          </p>

        </div>

        {/* MEMBERS */}
        <div className="space-y-3">

          <p className="text-sm text-[#9CA3AF]">
            Members
          </p>

          <div className="space-y-2">

            {group.members?.length > 0 ? (
              group.members.map((m) => (

                <div key={m.id} className="ui-list-item">

                  <span className="text-[#E5E7EB] font-medium">
                    {m.name}
                  </span>

                </div>

              ))
            ) : (
              <div className="ui-list-item text-sm text-[#6B7280]">
                No members found
              </div>
            )}

          </div>

        </div>

        {/* CTA */}
        <button
          onClick={handleJoin}
          className="btn-primary w-full py-2.5"
        >
          Join Group
        </button>

      </div>

    </div>

  );

}

export default JoinGroup;