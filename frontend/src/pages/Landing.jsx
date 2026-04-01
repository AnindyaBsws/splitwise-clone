import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Instagram } from "lucide-react";

import api from "../api/axios";
import useAuth from "../hooks/useAuth";
import AnimatedSection from "../components/animations/AnimatedSection";
import GlowWrapper from "../components/animations/GlowWrapper";
import TiltImage from "../components/animations/TiltImage";
import Particles from "../components/animations/Particles";

function Landing() {

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setTimeout(() => {
        navigate("/dashboard");
      }, 200);
    }
  }, []);

  const handleDemoLogin = async () => {

    try {

      const res = await api.post("/api/auth/login", {
        email: "demo@expense.com",
        password: "1234"
      });

      login(res.data.access_token || res.data.token);
      navigate("/dashboard");

    } catch (error) {

      console.error("Demo login failed", error);
      alert("Demo login failed");

    }

  };

  return (

    <div className="relative min-h-screen bg-[#0B0B0F] text-[#E5E7EB] flex flex-col overflow-hidden">

      <Particles />

      {/* NAVBAR */}

      <div className="flex justify-between items-center px-8 py-6">

        <h1 className="text-2xl font-bold text-indigo-400">
          Smart Expense Tracker
        </h1>

        <div className="flex gap-4">

          <Link
            to="/login"
            className="btn-secondary"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="btn-primary"
          >
            Register
          </Link>

        </div>

      </div>

      {/* HERO */}

      <div className="flex flex-col items-center text-center px-6 mt-20">

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-bold mb-6 text-white"
        >
          Split Expenses
          <br />
          Without Breaking Friendships
        </motion.h1>

        <p className="text-[#9CA3AF] max-w-xl mb-10">
          Track shared expenses, split bills instantly,
          simplify debts and settle payments easily.
        </p>

        <div className="flex gap-4 mb-12">

          <Link
            to="/register"
            className="btn-primary px-8 py-3 text-lg"
          >
            Get Started
          </Link>

          <button
            onClick={handleDemoLogin}
            className="btn-secondary px-8 py-3 text-lg"
          >
            Try Demo
          </button>

        </div>

      </div>

      {/* DEMO CARD */}

      <AnimatedSection>

        <motion.div
          whileHover={{ scale: 1.04 }}
          className="card max-w-md mx-auto p-6 text-center mt-24 mb-20"
        >

          <h3 className="text-lg font-semibold mb-3 text-white">
            Demo Account
          </h3>

          <p className="text-[#9CA3AF] text-sm mb-2">
            Explore the app instantly using:
          </p>

          <div className="text-sm text-[#E5E7EB]">
            <p>Email: demo@expense.com</p>
            <p>Password: 1234</p>
          </div>

        </motion.div>

      </AnimatedSection>

      {/* FEATURES */}

      <div className="max-w-6xl mx-auto px-6 space-y-20 pb-20">

        {/* DASHBOARD */}

        <AnimatedSection>

          <div className="grid md:grid-cols-2 gap-16 items-center">

            <GlowWrapper>
              <TiltImage src="/screenshots/dashboard.png" alt="Dashboard" />
            </GlowWrapper>

            <motion.div>

              <h2 className="text-3xl font-bold mb-4 text-white">
                Smart Dashboard
              </h2>

              <p className="text-[#9CA3AF]">
                Instantly see how much you owe or are owed.
                Track group activity and manage shared expenses.
              </p>

            </motion.div>

          </div>

        </AnimatedSection>

        {/* GROUP */}

        <AnimatedSection>

          <div className="grid md:grid-cols-2 gap-16 items-center">

            <motion.div>

              <h2 className="text-3xl font-bold mb-4 text-white">
                Group Management
              </h2>

              <p className="text-[#9CA3AF]">
                Create groups, invite friends and manage expenses easily.
              </p>

            </motion.div>

            <GlowWrapper>
              <TiltImage src="/screenshots/groups.png" alt="Groups" />
            </GlowWrapper>

          </div>

        </AnimatedSection>

        {/* EXPENSE */}

        <AnimatedSection>

          <div className="grid md:grid-cols-2 gap-16 items-center">

            <GlowWrapper>
              <TiltImage src="/screenshots/groupDetails.png" alt="Expenses" />
            </GlowWrapper>

            <motion.div>

              <h2 className="text-3xl font-bold mb-4 text-white">
                Expense Tracking & Settlements
              </h2>

              <p className="text-[#9CA3AF]">
                Add expenses, split bills and settle balances instantly.
              </p>

            </motion.div>

          </div>

        </AnimatedSection>

      </div>

      {/* DEV CARD */}

      <div className="mt-16 mb-20 flex justify-center px-6">

        <motion.div
          whileHover={{ scale: 1.04 }}
          className="card max-w-xl w-full p-10 text-center"
        >

          <div className="flex flex-col items-center mb-6">

            <div className="w-16 h-16 rounded-full 
              bg-gradient-to-r from-indigo-500 to-purple-600 
              flex items-center justify-center text-white text-xl font-bold mb-3">
              AB
            </div>

            <h3 className="text-xl font-semibold text-white">
              Anindya Biswas
            </h3>

            <p className="text-[#9CA3AF] text-sm">
              Full Stack Developer
            </p>

          </div>

          <div className="flex justify-center gap-10">

            <a href="https://github.com/AnindyaBsws" target="_blank" rel="noreferrer"
              className="text-[#9CA3AF] hover:text-white transition">
              <Github size={34} />
            </a>

            <a href="https://www.linkedin.com/in/anindya-biswas-472897219/" target="_blank" rel="noreferrer"
              className="text-[#9CA3AF] hover:text-blue-400 transition">
              <Linkedin size={34} />
            </a>

            <a href="https://www.instagram.com/draw_of_the_bow/?hl=en" target="_blank" rel="noreferrer"
              className="text-[#9CA3AF] hover:text-pink-400 transition">
              <Instagram size={34} />
            </a>

          </div>

        </motion.div>

      </div>

      {/* FOOTER */}

      <div className="text-center text-[#6B7280] pb-8 text-sm">
        © {new Date().getFullYear()} Smart Expense Tracker
      </div>

    </div>

  );

}

export default Landing;