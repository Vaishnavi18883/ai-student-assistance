import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("token");

  const handleProtectedRoute = (path) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-[#111c33]/80 backdrop-blur-md border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-wide">
          Student AI Assistant
        </h1>

        <div className="hidden md:flex items-center space-x-6 text-white/70">
          <Link to="/" className="hover:text-white transition">Home</Link>

          <button onClick={() => handleProtectedRoute("/dashboard")} className="hover:text-white transition">
            Dashboard
          </button>

          <button onClick={() => handleProtectedRoute("/aichat")} className="hover:text-white transition">
            AI Chat
          </button>

          <Link to="/login" className="hover:text-white transition">Login</Link>

          <Link
            to="/register"
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-24">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold leading-tight"
        >
          Learn Smarter with AI
        </motion.h1>

        <p className="mt-6 text-lg max-w-2xl text-white/60">
          Your all-in-one AI study assistant for notes, chat, tasks, and exam preparation.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">

          <button
            onClick={() => handleProtectedRoute("/aichat")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Start AI Chat
          </button>

          <Link
            to="/register"
            className="border border-white/20 px-6 py-3 rounded-xl hover:bg-white hover:text-black transition"
          >
            Create Account
          </Link>

          <button
            onClick={() => handleProtectedRoute("/dashboard")}
            className="bg-white/10 border border-white/10 px-6 py-3 rounded-xl hover:bg-white/20 transition"
          >
            Open Dashboard
          </button>

        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 px-10 mt-24">

        <div className="bg-[#111c33] border border-white/10 p-6 rounded-2xl hover:scale-105 transition">
          <h2 className="text-xl font-semibold">📚 Instant Answers</h2>
          <p className="mt-2 text-white/60">Get accurate explanations instantly.</p>
        </div>

        <div className="bg-[#111c33] border border-white/10 p-6 rounded-2xl hover:scale-105 transition">
          <h2 className="text-xl font-semibold">🧠 AI Notes Generator</h2>
          <p className="mt-2 text-white/60">Convert topics into structured notes.</p>
        </div>

        <div className="bg-[#111c33] border border-white/10 p-6 rounded-2xl hover:scale-105 transition">
          <h2 className="text-xl font-semibold">🚀 Task & Reports</h2>
          <p className="mt-2 text-white/60">Track tasks and monitor progress easily.</p>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="text-center mt-24 px-6">
        <h2 className="text-3xl font-bold text-white">
          Built for Students. Powered by AI.
        </h2>
        <p className="mt-4 text-white/60 max-w-2xl mx-auto">
          A modern learning platform designed to improve productivity and simplify studying.
        </p>
      </div>

      {/* Footer */}
      <footer className="text-center mt-20 pb-10 text-white/40 border-t border-white/10 pt-6">
        © 2026 Student AI Assistant
      </footer>

    </div>
  );
}