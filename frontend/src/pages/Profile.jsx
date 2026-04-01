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

      <div className="
        relative card w-full max-w-xl p-8
        overflow-hidden
      ">

        {/* subtle glow */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl
          bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_70%)] opacity-60" />

        <div className="relative z-10">

          {/* HEADER */}
          <div className="flex items-center gap-4 mb-8">

            <div className="
              w-14 h-14 rounded-full 
              bg-gradient-to-r from-indigo-500 to-purple-600 
              flex items-center justify-center 
              text-xl font-bold text-white
              shadow-[0_0_15px_rgba(99,102,241,0.5)]
            ">
              {user.name[0].toUpperCase()}
            </div>

            <div>

              <h1 className="text-2xl font-semibold text-white tracking-tight">
                {user.name}
              </h1>

              <p className="text-[#9CA3AF] text-sm">
                Account Profile
              </p>

            </div>

          </div>

          {/* PROFILE DETAILS */}
          <div className="space-y-6">

            <div className="ui-list-item">

              <p className="text-[#9CA3AF] text-sm">
                Email
              </p>

              <p className="text-lg font-medium text-white mt-1">
                {user.email}
              </p>

            </div>

            <div className="ui-list-item">

              <p className="text-[#9CA3AF] text-sm">
                User Tag
              </p>

              <p className="text-lg font-semibold text-indigo-400 mt-1
                drop-shadow-[0_0_6px_rgba(99,102,241,0.4)]">
                {user.user_tag}
              </p>

            </div>

          </div>

          {/* LOGOUT BUTTON */}
          <div className="mt-10">

            <button
              onClick={handleLogout}
              className="btn-danger w-full py-2"
            >
              Logout
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Profile;