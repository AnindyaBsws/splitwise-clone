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
      <div className="page-container text-center mt-20 text-[#9CA3AF]">
        Loading profile...
      </div>
    );

  }

  return (

    <div className="page-container flex justify-center">

      <div className="card w-full max-w-xl p-8">

        {/* HEADER */}

        <div className="flex items-center gap-4 mb-8">

          <div className="w-14 h-14 rounded-full 
            bg-gradient-to-r from-indigo-500 to-purple-600 
            flex items-center justify-center 
            text-xl font-bold text-white">
            {user.name[0].toUpperCase()}
          </div>

          <div>

            <h1 className="text-2xl font-bold text-white">
              {user.name}
            </h1>

            <p className="text-[#9CA3AF] text-sm">
              Account Profile
            </p>

          </div>

        </div>

        {/* PROFILE DETAILS */}

        <div className="space-y-6">

          <div>

            <p className="text-[#9CA3AF] text-sm">
              Email
            </p>

            <p className="text-lg font-medium text-white">
              {user.email}
            </p>

          </div>

          <div>

            <p className="text-[#9CA3AF] text-sm">
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
            className="w-full px-4 py-2 rounded-lg 
            text-white bg-red-500 hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>

      </div>

    </div>

  );

}

export default Profile;