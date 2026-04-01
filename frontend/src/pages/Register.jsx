import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, []);

  const handleRegister = async (e) => {

    e.preventDefault();

    if (password.length < 4) {
      alert("Password must be at least 4 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      await api.post("/api/auth/register", {
        name,
        email,
        password
      });

      alert("Registration successful");
      navigate("/login");

    } catch (error) {

      alert(error.response?.data?.error || "Registration failed");

    }

  };

  return (

    <div className="
      min-h-screen flex items-center justify-center px-6
      bg-[#020617] relative overflow-hidden
    ">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.15),transparent_60%)]" />

      {/* REGISTER CARD */}
      <div className="
        relative z-10
        card w-full max-w-md p-8 fade-in
        shadow-[0_20px_60px_rgba(0,0,0,0.8)]
      ">

        {/* Header */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-semibold tracking-tight
            bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Smart Expense Tracker
          </h1>

          <p className="text-[#9CA3AF] mt-2 text-sm">
            Create your account and start tracking shared expenses.
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            placeholder="Full name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <input
            type="password"
            placeholder="Confirm password"
            className="input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            className="btn-primary w-full py-2.5"
          >
            Create Account
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-white/5"></div>
          <span className="text-xs text-[#6B7280]">OR</span>
          <div className="h-px flex-1 bg-white/5"></div>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-[#9CA3AF]">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition"
          >
            Login
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Register;