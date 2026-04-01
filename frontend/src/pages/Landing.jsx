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

    <div className="relative min-h-screen text-white flex flex-col overflow-hidden">

      <Particles />

      {/* BACKGROUND BLOBS */}
      <div className="gradient-bg">
        <div className="gradient-blob blob1"></div>
        <div className="gradient-blob blob2"></div>
        <div className="gradient-blob blob3"></div>
      </div>

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-8 py-6 backdrop-blur-md bg-white/5 border-b border-white/10">

        <h1 className="text-2xl font-bold bg-gradient-main bg-clip-text text-transparent">
          Luminous Expense
        </h1>

        <div className="flex gap-4">

          <Link
            to="/login"
            className="px-5 py-2 rounded-xl glass-card hover:bg-white/10"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="gradient-btn"
          >
            Register
          </Link>

        </div>

      </div>

      {/* HERO SECTION */}
      <div className="flex flex-col items-center text-center px-6 mt-24">

        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-bold leading-tight mb-6"
        >
          Shared expenses,
          <br />
          <span className="bg-gradient-main bg-clip-text text-transparent">
            perfectly balanced.
          </span>
        </motion.h1>

        <p className="text-gray-400 max-w-xl mb-10 text-lg">
          Organize trips, household bills, and dinners.
          Track every shared expense with clarity.
        </p>

        <div className="flex gap-4 mb-12">

          <Link to="/register">
            <button className="gradient-btn text-lg px-8 py-3">
              Get Started
            </button>
          </Link>

          <button
            onClick={handleDemoLogin}
            className="glass-card px-8 py-3 text-lg"
          >
            Try Demo
          </button>

        </div>

      </div>

      {/* DEMO CARD */}
      <AnimatedSection>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card max-w-md mx-auto p-6 text-center mt-20"
        >

          <h3 className="text-lg font-semibold mb-3">
            Demo Account
          </h3>

          <p className="text-gray-400 text-sm mb-2">
            Use demo credentials:
          </p>

          <div className="text-sm text-gray-300">
            <p>Email: demo@expense.com</p>
            <p>Password: 1234</p>
          </div>

        </motion.div>

      </AnimatedSection>

      {/* FEATURES */}
      <div className="max-w-6xl mx-auto px-6 space-y-24 py-24">

        {/* SECTION 1 */}
        <AnimatedSection>
          <div className="grid md:grid-cols-2 gap-16 items-center">

            <GlowWrapper>
              <TiltImage src="/screenshots/dashboard.png" />
            </GlowWrapper>

            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl font-bold mb-4">
                Smart Dashboard
              </h2>
              <p className="text-gray-400">
                Instantly see balances and track activity in one place.
              </p>
            </motion.div>

          </div>
        </AnimatedSection>

        {/* SECTION 2 */}
        <AnimatedSection>
          <div className="grid md:grid-cols-2 gap-16 items-center">

            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl font-bold mb-4">
                Group Management
              </h2>
              <p className="text-gray-400">
                Create groups, invite friends, manage expenses easily.
              </p>
            </motion.div>

            <GlowWrapper>
              <TiltImage src="/screenshots/groups.png" />
            </GlowWrapper>

          </div>
        </AnimatedSection>

        {/* SECTION 3 */}
        <AnimatedSection>
          <div className="grid md:grid-cols-2 gap-16 items-center">

            <GlowWrapper>
              <TiltImage src="/screenshots/groupDetails.png" />
            </GlowWrapper>

            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl font-bold mb-4">
                Expense Tracking
              </h2>
              <p className="text-gray-400">
                Split bills automatically and settle balances instantly.
              </p>
            </motion.div>

          </div>
        </AnimatedSection>

      </div>

      {/* DEVELOPER CARD */}
      <div className="flex justify-center px-6 pb-20">

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card max-w-xl w-full p-10 text-center"
        >

          <div className="flex flex-col items-center mb-6">

            <div className="w-16 h-16 rounded-full bg-gradient-main flex items-center justify-center font-bold mb-3">
              AB
            </div>

            <h3 className="text-xl font-semibold">
              Anindya Biswas
            </h3>

            <p className="text-gray-400 text-sm">
              Full Stack Developer
            </p>

          </div>

          <div className="flex justify-center gap-10">

            <a href="https://github.com/AnindyaBsws" target="_blank">
              <Github size={32} />
            </a>

            <a href="https://linkedin.com" target="_blank">
              <Linkedin size={32} />
            </a>

            <a href="https://instagram.com" target="_blank">
              <Instagram size={32} />
            </a>

          </div>

        </motion.div>

      </div>

      {/* FOOTER */}
      <div className="text-center text-gray-500 pb-8 text-sm">
        © {new Date().getFullYear()} Luminous Expense
      </div>

    </div>

  );

}

export default Landing;