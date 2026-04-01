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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0F] text-[#9CA3AF]">
        <p className="text-lg">Loading invite...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0F]">

        <div className="card p-8 text-center">

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

    <div className="min-h-screen flex items-center justify-center bg-[#0B0B0F]">

      <div className="card p-8 w-[420px]">

        <h1 className="text-2xl font-bold text-center mb-2 text-white">
          {group.group_name}
        </h1>

        <p className="text-[#9CA3AF] text-center mb-6">
          Created by{" "}
          <span className="text-white font-medium">
            {group.creator}
          </span>
        </p>

        <div className="p-4 mb-6 rounded-lg bg-[#1A1B21] border border-[#22232A]">

          <h2 className="font-semibold mb-3 text-[#E5E7EB]">
            Members
          </h2>

          {group.members?.length > 0 ? (
            group.members.map((m) => (
              <div key={m.id} className="text-[#9CA3AF]">
                • {m.name}
              </div>
            ))
          ) : (
            <p className="text-[#6B7280] text-sm">
              No members found
            </p>
          )}

        </div>

        <button
          onClick={handleJoin}
          className="btn-primary w-full"
        >
          Join Group
        </button>

      </div>

    </div>

  );

}

export default JoinGroup;