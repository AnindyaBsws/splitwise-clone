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

    // password length check
    if (password.length < 4) {
      alert("Password must be at least 4 characters");
      return;
    }

    // confirm password check
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

      navigate("/"); // redirect to login

    } catch (error) {

      alert(error.response?.data?.error || "Registration failed");

    }

  };

  return (

    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">

      {/* HEADER */}

      <div className="text-center mb-8">

        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          Smart Expense Tracker
        </h1>

        <p className="text-gray-600 max-w-md">
          Manage group expenses, split bills instantly, and keep friendships
          stress-free. Track every rupee transparently.
        </p>

      </div>

      {/* REGISTER CARD */}

      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow w-96"
      >

        <h1 className="text-2xl font-bold mb-6 text-center">
          Register
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 mb-4 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-2 mb-4 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">

          Already have an account?{" "}

          <Link
            className="text-blue-600 hover:underline font-medium"
            to="/"
          >
            Login
          </Link>

        </p>

      </form>

    </div>

  );
}

export default Register;