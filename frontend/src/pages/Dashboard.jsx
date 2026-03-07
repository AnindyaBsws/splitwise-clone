import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="flex gap-4">

        <Link to="/groups">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Go to Groups
          </button>
        </Link>

      </div>

    </div>
  );
}