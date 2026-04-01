import Navbar from "../components/group/Navbar";
import { useLocation, useNavigate } from "react-router-dom";

function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const showBackButton = location.pathname !== "/dashboard";

  return (
    <div className="min-h-screen flex bg-transparent relative overflow-hidden">

      {/* Background blobs */}
      <div className="gradient-bg">
        <div className="gradient-blob blob1"></div>
        <div className="gradient-blob blob2"></div>
        <div className="gradient-blob blob3"></div>
      </div>

      {/* LEFT SIDEBAR (DESKTOP ONLY) */}
      <aside className="hidden md:flex flex-col w-64 p-6 border-r border-white/10 bg-white/5 backdrop-blur-xl">

        <h1 className="text-xl font-bold mb-10 text-white">
          Luminous
        </h1>

        <nav className="flex flex-col gap-4">

          <button
            onClick={() => navigate("/dashboard")}
            className="text-left px-4 py-3 rounded-xl hover:bg-white/10"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/groups")}
            className="text-left px-4 py-3 rounded-xl hover:bg-white/10"
          >
            Groups
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="text-left px-4 py-3 rounded-xl hover:bg-white/10"
          >
            Profile
          </button>

        </nav>

        {/* Bottom CTA */}
        <div className="mt-auto">
          <button className="gradient-btn w-full">
            Add Expense
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">

        {/* Top Navbar (keep your existing one) */}
        <Navbar />

        <main className="flex-1 page-container py-6 fade-in">

          {/* Back Button */}
          {showBackButton && (
            <div className="mb-6">
              <button
                onClick={() => navigate(-1)}
                className="circle-icon-btn"
              >
                ←
              </button>
            </div>
          )}

          {children}

        </main>
      </div>

    </div>
  );
}

export default MainLayout;