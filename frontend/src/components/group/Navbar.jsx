import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Navbar() {

  const { token } = useAuth();
  const location = useLocation();

  let userName = "User";

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userName = payload.name || "User";
    } catch (error) {
      console.error("Token decode failed:", error);
    }
  }

  const isActive = (path) =>
    location.pathname === path
      ? "text-white"
      : "text-gray-400 hover:text-white";

  return (

    <nav className="sticky top-6 z-50 px-4">

      <div className="max-w-6xl mx-auto">

        <div className="glass-card px-6 py-3 flex items-center justify-between shadow-glow">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-8">

            {/* LOGO */}
            <Link
              to="/dashboard"
              className="text-lg sm:text-xl font-bold bg-gradient-main bg-clip-text text-transparent"
            >
              Luminous
            </Link>

            {/* NAV LINKS */}
            <div className="hidden md:flex items-center gap-6">

              <Link
                to="/dashboard"
                className={`${isActive("/dashboard")} transition`}
              >
                Dashboard
              </Link>

              <Link
                to="/groups"
                className={`${isActive("/groups")} transition`}
              >
                Groups
              </Link>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* PROFILE */}
            <Link
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur transition"
            >

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-main flex items-center justify-center text-sm font-bold shadow-glow">
                {userName[0].toUpperCase()}
              </div>

              {/* Name */}
              <span className="hidden sm:block text-gray-200 font-medium">
                {userName}
              </span>

            </Link>

          </div>

        </div>

      </div>

    </nav>

  );

}

export default Navbar;