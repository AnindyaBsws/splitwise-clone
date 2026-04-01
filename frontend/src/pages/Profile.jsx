import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";

function Profile() {

  const [user, setUser] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {

    const fetchUser = async () => {

      try {
        const res = await api.get("/api/users/me");
        setUser(res.data);
      } catch (error) {
        console.error("Failed to load profile", error);
      }

    };

    fetchUser();

  }, []);

  const handleLogout = () => {

    logout();
    navigate("/");

  };

  if (!user) {

    return (
      <div className="page-container text-center mt-20 text-gray-400">
        Loading profile...
      </div>
    );

  }

  return (

    <div className="page-container flex justify-center">

      <div className="glass-card w-full max-w-xl p-8 space-y-8 fade-in">

        {/* HEADER */}
        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-full bg-gradient-main flex items-center justify-center text-xl font-bold text-white shadow-glow">
            {user.name[0].toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              {user.name}
            </h1>
            <p className="text-gray-400 text-sm">
              Account Profile
            </p>
          </div>

        </div>

        {/* DETAILS */}
        <div className="space-y-6">

          <div className="glass-card p-4">

            <p className="text-gray-400 text-sm">
              Email
            </p>

            <p className="text-lg font-medium text-white mt-1">
              {user.email}
            </p>

          </div>

          <div className="glass-card p-4">

            <p className="text-gray-400 text-sm">
              User Tag
            </p>

            <p className="text-lg font-semibold text-primary mt-1">
              {user.user_tag}
            </p>

          </div>

        </div>

        {/* ACTION */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition"
        >
          Logout
        </button>

      </div>

    </div>

  );

}

export default Profile;