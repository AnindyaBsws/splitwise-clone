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

    <div className="
      min-h-screen flex items-center justify-center px-6
      bg-[#020617] relative overflow-hidden
    ">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_60%)]" />

      {/* LOGIN CARD */}
      <div className="
        relative z-10
        card w-full max-w-md p-8 fade-in
        shadow-[0_20px_60px_rgba(0,0,0,0.8)]
      ">

        {/* Title */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-semibold tracking-tight
            bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Smart Expense Tracker
          </h1>

          <p className="text-[#9CA3AF] mt-2 text-sm">
            Track shared expenses and settle debts effortlessly.
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email address"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn-primary w-full py-2.5">
            Login
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-white/5"></div>
          <span className="text-xs text-[#6B7280]">OR</span>
          <div className="h-px flex-1 bg-white/5"></div>
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-[#9CA3AF]">

          New user?{" "}

          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition"
          >
            Create an account
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Login;