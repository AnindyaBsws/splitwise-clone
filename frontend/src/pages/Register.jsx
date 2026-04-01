import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Redirect if already logged in
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

    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0B0B0F]">

      {/* Register Card */}

      <div className="card w-full max-w-md p-8 fade-in">

        {/* Header */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
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
            className="btn-primary w-full"
          >
            Register
          </button>

        </form>

        {/* Login Link */}

        <p className="text-center text-sm text-[#9CA3AF] mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
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