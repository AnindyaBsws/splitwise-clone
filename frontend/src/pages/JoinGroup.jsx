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
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading invite...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">

        <div className="glass-card p-8 text-center space-y-4 max-w-md">

          <h2 className="text-xl font-semibold">
            Invite Error
          </h2>

          <p className="text-red-400 text-sm">
            {error}
          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">

      {/* BACKGROUND BLOBS */}
      <div className="gradient-bg">
        <div className="gradient-blob blob1"></div>
        <div className="gradient-blob blob2"></div>
        <div className="gradient-blob blob3"></div>
      </div>

      <div className="glass-card w-full max-w-md p-8 space-y-6 fade-in">

        {/* HEADER */}
        <div className="text-center">

          <h1 className="text-2xl font-bold">
            {group.group_name}
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Created by{" "}
            <span className="text-white font-medium">
              {group.creator}
            </span>
          </p>

        </div>

        {/* MEMBERS */}
        <div className="glass-card p-4 space-y-2">

          <p className="text-sm text-gray-400">
            Members
          </p>

          {group.members?.length > 0 ? (

            <div className="space-y-1">

              {group.members.map((m) => (

                <div
                  key={m.id}
                  className="text-sm text-gray-300"
                >
                  • {m.name}
                </div>

              ))}

            </div>

          ) : (

            <p className="text-gray-500 text-sm">
              No members yet
            </p>

          )}

        </div>

        {/* ACTION */}
        <button
          onClick={handleJoin}
          className="gradient-btn w-full"
        >
          Join Group
        </button>

      </div>

    </div>

  );

}

export default JoinGroup;