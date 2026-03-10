import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Navbar() {

  const navigate = useNavigate();
  const { token } = useAuth();

  let userName = "User";

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userName = payload.name || "User";
    } catch (error) {
      console.error("Token decode failed:", error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">

      <div className="flex items-center gap-6">

        <Link to="/dashboard" className="text-xl font-bold text-blue-600">
          Smart Expense Tracker
        </Link>

        <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
          Dashboard
        </Link>

        <Link to="/groups" className="text-gray-600 hover:text-blue-600">
          Groups
        </Link>

      </div>

      <div className="flex items-center gap-4">

        <Link
          to="/profile"
          className="text-gray-600 hover:text-blue-600"
        >
          👤 {userName}
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;