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

    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">

      {/* BACKGROUND BLOBS */}
      <div className="gradient-bg">
        <div className="gradient-blob blob1"></div>
        <div className="gradient-blob blob2"></div>
        <div className="gradient-blob blob3"></div>
      </div>

      {/* REGISTER CARD */}
      <div className="glass-card w-full max-w-md p-8 space-y-6 fade-in">

        {/* HEADER */}
        <div className="text-center">

          <h1 className="text-3xl font-bold bg-gradient-main bg-clip-text text-transparent">
            Create Account
          </h1>

          <p className="text-gray-400 mt-2 text-sm">
            Start tracking shared expenses in seconds
          </p>

        </div>

        {/* FORM */}
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

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-400">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-primary hover:text-purple-400 font-medium"
          >
            Login
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Register;