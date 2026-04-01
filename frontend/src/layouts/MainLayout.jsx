import Navbar from "../components/group/Navbar";
import { useLocation, useNavigate } from "react-router-dom";

function MainLayout({ children }) {

  const location = useLocation();
  const navigate = useNavigate();

  const showBackButton = location.pathname !== "/dashboard";

  return (

    <div className="
      min-h-screen relative overflow-x-hidden
      bg-[#020617] text-[#E5E7EB]
    ">

      {/* GLOBAL BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 pointer-events-none">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px]
          bg-[radial-gradient(circle,rgba(99,102,241,0.12),transparent_70%)] blur-3xl" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[300px]
          bg-[radial-gradient(circle,rgba(139,92,246,0.08),transparent_70%)] blur-3xl" />

      </div>

      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <main className="page-container py-6 fade-in">

        {/* BACK BUTTON */}
        {showBackButton && (

          <div className="mb-6">

            <button
              onClick={() => navigate(-1)}
              className="btn-icon"
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