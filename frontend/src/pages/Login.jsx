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

    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">

      {/* BACKGROUND BLOBS */}
      <div className="gradient-bg">
        <div className="gradient-blob blob1"></div>
        <div className="gradient-blob blob2"></div>
        <div className="gradient-blob blob3"></div>
      </div>

      {/* LOGIN CARD */}
      <div className="glass-card w-full max-w-md p-8 space-y-6 fade-in">

        {/* TITLE */}
        <div className="text-center">

          <h1 className="text-3xl font-bold bg-gradient-main bg-clip-text text-transparent">
            Welcome Back
          </h1>

          <p className="text-gray-400 mt-2 text-sm">
            Login to continue managing your expenses
          </p>

        </div>

        {/* FORM */}
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

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-400">

          Don’t have an account?{" "}

          <Link
            to="/register"
            className="text-primary hover:text-purple-400 font-medium"
          >
            Register
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Login;