import Navbar from "../components/group/Navbar";
import { useLocation, useNavigate } from "react-router-dom";

function MainLayout({ children }) {

  const location = useLocation();
  const navigate = useNavigate();

  const showBackButton = location.pathname !== "/dashboard";

  return (

    <div className="min-h-screen relative overflow-x-hidden bg-[#0B0B0F] text-[#E5E7EB]">

      {/* Subtle radial glow (instead of blue gradient) */}
      <div className="absolute inset-0 -z-10 
        bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.08),transparent_40%),
             radial-gradient(circle_at_80%_0%,rgba(37,99,235,0.06),transparent_40%)]" 
      />

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="page-container py-6 fade-in">

        {/* Back Button */}
        {showBackButton && (

          <div className="mb-6">

            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full
              bg-[#111217] hover:bg-[#1A1B21]
              border border-[#22232A]
              text-[#9CA3AF] hover:text-white
              transition-all duration-200"
            >
              ←
            </button>

          </div>

        )}

        {children}

      </main>

    </div>

  );

}

export default MainLayout;