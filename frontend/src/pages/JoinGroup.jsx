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
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p className="text-lg">Loading invite...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">

          <h2 className="text-xl font-semibold mb-3">
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

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">

      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-8 w-[420px]">

        <h1 className="text-2xl font-bold text-center mb-2">
          {group.group_name}
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Created by <span className="text-white">{group.creator}</span>
        </p>

        <div className="border border-slate-700 rounded-lg p-4 mb-6 bg-slate-900">

          <h2 className="font-semibold mb-3 text-gray-300">
            Members
          </h2>

          {group.members?.length > 0 ? (
            group.members.map((m) => (
              <div key={m.id} className="text-gray-400">
                • {m.name}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              No members found
            </p>
          )}

        </div>

        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg font-semibold"
        >
          Join Group
        </button>

      </div>

    </div>

  );

}

export default JoinGroup;