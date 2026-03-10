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
      <div className="page-container text-center mt-20">
        Loading profile...
      </div>
    );

  }

  return (

    <div className="page-container flex justify-center">

      <div className="glass-card w-full max-w-xl p-8">

        {/* HEADER */}

        <div className="flex items-center gap-4 mb-8">

          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
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

        {/* PROFILE DETAILS */}

        <div className="space-y-6">

          <div>

            <p className="text-gray-400 text-sm">
              Email
            </p>

            <p className="text-lg font-medium">
              {user.email}
            </p>

          </div>

          <div>

            <p className="text-gray-400 text-sm">
              User Tag
            </p>

            <p className="text-lg font-semibold text-indigo-400">
              {user.user_tag}
            </p>

          </div>

        </div>

        {/* LOGOUT BUTTON */}

        <div className="mt-10">

          <button
            onClick={handleLogout}
            className="gradient-btn w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500"
          >
            Logout
          </button>

        </div>

      </div>

    </div>

  );

}

export default Profile;