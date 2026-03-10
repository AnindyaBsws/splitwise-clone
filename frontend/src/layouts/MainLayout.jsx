import Navbar from "../components/group/Navbar";
import { useLocation, useNavigate } from "react-router-dom";

function MainLayout({ children }) {

  const location = useLocation();
  const navigate = useNavigate();

  const showBackButton = location.pathname !== "/dashboard";

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <main className="p-6">

        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center text-gray-700 hover:text-black"
          >
            ← Back
          </button>
        )}

        {children}

      </main>

    </div>
  );

}

export default MainLayout;