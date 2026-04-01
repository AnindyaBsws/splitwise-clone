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

      <div className="
        relative px-6 py-3 flex items-center justify-between rounded-2xl
        bg-[#0B0B0F]/80 backdrop-blur-xl
        shadow-[0_10px_40px_rgba(0,0,0,0.6)]
        overflow-hidden
      ">

        {/* subtle glow */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none
          bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_70%)] opacity-60" />

        {/* LEFT SIDE */}
        <div className="flex items-center gap-6 relative z-10">

          <Link
            to="/dashboard"
            className="text-lg sm:text-xl font-semibold tracking-tight
            bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"
          >
            Smart Expense Tracker
          </Link>

          <div className="hidden sm:flex items-center gap-6">

            <Link
              to="/dashboard"
              className="text-[#9CA3AF] hover:text-white
              transition-all duration-200
              hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]"
            >
              Dashboard
            </Link>

            <Link
              to="/groups"
              className="text-[#9CA3AF] hover:text-white
              transition-all duration-200
              hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]"
            >
              Groups
            </Link>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 relative z-10">

          <Link
            to="/profile"
            className="
              flex items-center gap-2 px-3 py-2 rounded-full
              bg-[#0B0B0F]
              shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]
              hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]
              transition-all duration-200
            "
          >

            {/* Avatar */}
            <div className="
              w-8 h-8 rounded-full 
              bg-gradient-to-r from-indigo-500 to-purple-600 
              flex items-center justify-center text-sm font-bold text-white
              shadow-[0_0_10px_rgba(99,102,241,0.5)]
            ">
              {userName[0].toUpperCase()}
            </div>

            {/* Name */}
            <span className="hidden sm:block text-[#E5E7EB] font-medium">
              {userName}
            </span>

          </Link>

        </div>

      </div>

    </nav>

  );

}

export default Navbar;