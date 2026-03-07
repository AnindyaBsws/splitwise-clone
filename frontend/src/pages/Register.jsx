import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 mb-4 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-4 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
        />

        <button className="w-full bg-green-600 text-white p-2 rounded">
          Register
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link className="text-blue-600" to="/">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;