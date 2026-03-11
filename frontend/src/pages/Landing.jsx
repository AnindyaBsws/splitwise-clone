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

    <div className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">
      <Particles />  

      <div className="gradient-bg">
        <div className="gradient-blob blob1"></div>
        <div className="gradient-blob blob2"></div>
        <div className="gradient-blob blob3"></div>
    </div>

      {/* NAVBAR */}

      <div className="flex justify-between items-center px-8 py-6">

        <h1 className="text-2xl font-bold text-blue-400">
          Smart Expense Tracker
        </h1>

        <div className="flex gap-4">

          <Link
            to="/login"
            className="px-4 py-2 rounded-lg border border-gray-600 hover:border-blue-500 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
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
          className="text-5xl font-bold mb-6"
        >
          Split Expenses
          <br />
          Without Breaking Friendships
        </motion.h1>

        <p className="text-gray-400 max-w-xl mb-10">
          Track shared expenses, split bills instantly,
          simplify debts and settle payments easily.
        </p>

        <div className="flex gap-4 mb-12">

          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl text-lg font-semibold transition"
          >
            Get Started
          </Link>

          <button
            onClick={handleDemoLogin}
            className="border border-gray-500 hover:border-blue-400 px-8 py-3 rounded-xl text-lg font-semibold transition"
          >
            Try Demo
          </button>

        </div>

      </div>

      {/* DEMO ACCOUNT CARD */}

      <AnimatedSection>

        <motion.div
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.25 }}
        className="max-w-md mx-auto bg-gray-900 backdrop-blur 
        border border-gray-700 rounded-xl p-6 text-center 
        mt-32 mb-20 shadow-xl
        transition-all duration-300
        hover:border-blue-500
        hover:shadow-[0_0_35px_rgba(59,130,246,0.6)]"
        >

        <h3 className="text-lg font-semibold mb-3">
            Demo Account
        </h3>

        <p className="text-gray-400 text-sm mb-2">
            Explore the app instantly using:
        </p>

        <div className="text-sm text-gray-300">
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
                <TiltImage
                    src="/screenshots/dashboard.png"
                    alt="Dashboard"
                />
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
                Instantly see how much you owe or are owed.
                Track group activity and manage shared
                expenses in one place.
              </p>

            </motion.div>

          </div>

        </AnimatedSection>

        {/* GROUP MANAGEMENT */}

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
                Create groups, invite friends and manage
                shared expenses easily.
              </p>

            </motion.div>

            <GlowWrapper>
            <TiltImage
                src="/screenshots/groups.png"
                alt="Groups"
            />
            </GlowWrapper>

          </div>

        </AnimatedSection>

        {/* EXPENSE TRACKING */}

        <AnimatedSection>

          <div className="grid md:grid-cols-2 gap-16 items-center">

            <GlowWrapper>
            <TiltImage
                src="/screenshots/groupDetails.png"
                alt="Expenses"
            />
            </GlowWrapper>

            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >

              <h2 className="text-3xl font-bold mb-4">
                Expense Tracking & Settlements
              </h2>

              <p className="text-gray-400">
                Add expenses, split bills automatically
                and settle balances with a single click.
              </p>

            </motion.div>

          </div>

        </AnimatedSection>

      </div>

      {/* DEVELOPER CARD */}

      <div className="mt-16 mb-20 flex justify-center px-6">

        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.45 }}
          whileHover={{ scale: 1.06 }}
          className="max-w-xl w-full bg-gray-800/70 backdrop-blur border border-gray-700 rounded-2xl p-10 text-center shadow-2xl"
        >

          {/* AVATAR */}

          <div className="flex flex-col items-center mb-6">

            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold mb-3">
              AB
            </div>

            <h3 className="text-xl font-semibold">
              Anindya Biswas
            </h3>

            <p className="text-gray-400 text-sm">
              Full Stack Developer
            </p>

          </div>

          {/* SOCIAL LINKS */}

          <div className="flex justify-center gap-10">

            <a
              href="https://github.com/AnindyaBsws"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition transform hover:scale-125"
            >
              <Github size={34} />
            </a>

            <a
              href="https://www.linkedin.com/in/anindya-biswas-472897219/"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-blue-400 transition transform hover:scale-125"
            >
              <Linkedin size={34} />
            </a>

            <a
              href="https://www.instagram.com/draw_of_the_bow/?hl=en"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-pink-400 transition transform hover:scale-125"
            >
              <Instagram size={34} />
            </a>

          </div>

        </motion.div>

      </div>

      {/* FOOTER */}

      <div className="text-center text-gray-500 pb-8 text-sm">
        © {new Date().getFullYear()} Smart Expense Tracker
      </div>

    </div>

  );

}

export default Landing;