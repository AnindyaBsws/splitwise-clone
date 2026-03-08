import Navbar from "../components/group/Navbar";

function MainLayout({ children }) {

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <main className="p-6">
        {children}
      </main>

    </div>
  );

}

export default MainLayout;