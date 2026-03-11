import { Link } from "react-router-dom";

function NotFound() {

  return (

    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white p-6">

      <h1 className="text-7xl font-bold mb-6 text-indigo-400">
        404
      </h1>

      <h2 className="text-2xl font-semibold mb-4">
        Page Not Found
      </h2>

      <p className="text-gray-400 mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link
        to="/"
        className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-medium"
      >
        Go Back Home
      </Link>

    </div>

  );

}

export default NotFound;