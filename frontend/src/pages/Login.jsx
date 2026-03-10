import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import useAuth from "../hooks/useAuth";

function Login() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    if (!email.includes("@")) {
      alert("Enter a valid email address");
      return;
    }

    try {
      const data = await loginUser(email, password);

      login(data.access_token || data.token);

      navigate("/dashboard");

    } catch (error) {

      alert(error.response?.data?.error || "Login failed");

    }

  };

  return (

    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">

      {/* HEADER SECTION */}

      <div className="text-center mb-8">

        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          Smart Expense Tracker
        </h1>

        <p className="text-gray-600 max-w-md">
          Split bills effortlessly, track group spending clearly,
          and settle debts without awkward reminders.
          Smart expense sharing for smarter friendships.
        </p>

      </div>

      {/* LOGIN CARD */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow w-96"
      >

        <h1 className="text-2xl font-bold mb-6 text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>

        {/* REGISTER LINK */}

        <p className="text-sm text-center text-gray-600 mt-4">

          New user?{" "}

          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register first
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Login;