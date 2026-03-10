import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Navbar() {

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

  return (

    <nav className="sticky top-4 z-50 page-container">

      <div className="glass-card px-6 py-3 flex items-center justify-between">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-6">

          <Link
            to="/dashboard"
            className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"
          >
            Smart Expense Tracker
          </Link>

          <div className="hidden sm:flex items-center gap-6">

            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              to="/groups"
              className="text-gray-300 hover:text-white"
            >
              Groups
            </Link>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          <Link
            to="/profile"
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20"
          >

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">
              {userName[0].toUpperCase()}
            </div>

            {/* Name (hidden on mobile) */}
            <span className="hidden sm:block text-gray-200">
              {userName}
            </span>

          </Link>

        </div>

      </div>

    </nav>

  );

}

export default Navbar;