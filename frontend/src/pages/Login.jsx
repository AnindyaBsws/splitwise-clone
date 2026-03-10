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

    <div className="min-h-screen flex items-center justify-center px-6">

      {/* Login Card */}

      <div className="glass-card w-full max-w-md p-8 fade-in">

        {/* Logo / Title */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Smart Expense Tracker
          </h1>

          <p className="text-gray-300 mt-2 text-sm">
            Track shared expenses and settle debts effortlessly.
          </p>

        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email address"
            className="neon-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="neon-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="gradient-btn w-full">
            Login
          </button>

        </form>

        {/* Register Link */}

        <p className="text-center text-sm text-gray-300 mt-6">

          New user?{" "}

          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Register here
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Login;