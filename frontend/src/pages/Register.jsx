import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

      navigate("/");

    } catch (error) {

      alert(error.response?.data?.error || "Registration failed");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center px-6">

      {/* Register Card */}

      <div className="glass-card w-full max-w-md p-8 fade-in">

        {/* Header */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Smart Expense Tracker
          </h1>

          <p className="text-gray-300 mt-2 text-sm">
            Create your account and start tracking shared expenses.
          </p>

        </div>

        {/* Form */}

        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            placeholder="Full name"
            className="neon-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <input
            type="password"
            placeholder="Confirm password"
            className="neon-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            className="gradient-btn w-full"
          >
            Register
          </button>

        </form>

        {/* Login Link */}

        <p className="text-center text-sm text-gray-300 mt-6">

          Already have an account?{" "}

          <Link
            to="/"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Login
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Register;