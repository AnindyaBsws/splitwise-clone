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
    navigate("/login");
  };

  if (!user) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (

    <div className="max-w-2xl mx-auto bg-white border rounded-xl shadow-sm p-6">

      <h1 className="text-2xl font-bold mb-6">
        Profile
      </h1>

      <div className="space-y-4">

        <div>
          <p className="text-gray-500 text-sm">Name</p>
          <p className="text-lg font-medium">{user.name}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Email</p>
          <p className="text-lg font-medium">{user.email}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">User Tag</p>
          <p className="text-lg font-medium text-blue-600">
            {user.user_tag}
          </p>
        </div>

      </div>

      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

    </div>

  );

}

export default Profile;