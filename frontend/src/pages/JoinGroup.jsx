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
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white border rounded-xl shadow-sm p-8 w-[450px]">

        <h1 className="text-2xl font-bold text-center mb-4">
          {group.group_name}
        </h1>

        <p className="text-gray-600 text-center mb-4">
          Created by {group.creator}
        </p>

        <div className="border rounded-lg p-4 mb-6">

          <h2 className="font-semibold mb-2">
            Members
          </h2>

          {group.members.map((m) => (
            <div key={m.id} className="text-gray-700">
              • {m.name}
            </div>
          ))}

        </div>

        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Join Group
        </button>

      </div>

    </div>

  );

}

export default JoinGroup;