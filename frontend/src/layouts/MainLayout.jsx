import Navbar from "../components/group/Navbar";
import { useLocation, useNavigate } from "react-router-dom";

function MainLayout({ children }) {

  const location = useLocation();
  const navigate = useNavigate();

  const showBackButton = location.pathname !== "/dashboard";

  return (

    <div className="min-h-screen relative overflow-x-hidden">

      {/* Background gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#1e293b,#020617)]" />

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="page-container py-6 fade-in">

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

  );

}

export default MainLayout;