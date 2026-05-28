import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import chatbotGif from './assets/Gif/chatbot.gif'
import booksGif from './assets/Gif/books.gif'
import taskGif from './assets/Gif/task.gif'

export default function HomePage() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProtectedRoute = (path) => {
    if (!isLoggedIn) navigate("/login");
    else navigate(path);
  };

  return (
    <div className="font-sans bg-app-gradient min-h-screen text-slate-900">

      {/* Navbar */}
      <nav className="bg-white border-b border-sky-100 sticky top-0 z-50 shadow-sm relative">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-xl text-sky-700 tracking-tight">📚 Student AI</span>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/" className="text-slate-600 hover:text-sky-600 font-medium transition-colors text-sm">Home</Link>
            <button onClick={() => handleProtectedRoute("/dashboard")} className="text-slate-600 hover:text-sky-600 font-medium transition-colors text-sm">Dashboard</button>
            <Link to="/login" className="text-slate-600 hover:text-sky-600 font-medium transition-colors text-sm">Login</Link>
            <Link to="/register" className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-600 hover:text-sky-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-sky-100 overflow-hidden shadow-lg absolute w-full"
            >
              <div className="flex flex-col px-6 py-4 gap-4">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium text-base">Home</Link>
                <button onClick={() => { handleProtectedRoute("/dashboard"); setMobileMenuOpen(false); }} className="text-left text-slate-600 font-medium text-base">Dashboard</button>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium text-base">Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg text-center font-bold shadow-md mt-2">
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <div className="text-center px-6 pt-24 pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-slate-800"
        >
          Learn Smarter with AI
        </motion.h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Your all-in-one study assistant — chat, notes, tasks, and progress tracking.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button onClick={() => handleProtectedRoute("/aichat")}
            className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
            Start AI Chat
          </button>
          <Link to="/register"
            className="bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 px-8 py-3 rounded-xl font-bold shadow-sm hover:shadow transition-all active:scale-[0.98]">
            Create Account
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: chatbotGif, title: "Instant Answers", desc: "Get clear explanations on any subject topic right away." },
          { icon: booksGif, title: "AI Notes", desc: "Turn topics into structured notes you can actually use." },
          { icon: taskGif, title: "Task Tracker", desc: "Manage assignments and never miss a deadline again." },
        ].map((f, i) => (
          <div key={i} className="bg-white border border-sky-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="mb-6 flex justify-center">
              <img src={f.icon} alt={f.title} className="w-20 h-20 object-contain" />
            </div>
            <h3 className="mb-2 font-bold text-lg text-slate-800 text-center">{f.title}</h3>
            <p className="m-0 text-slate-500 leading-relaxed text-sm text-center">{f.desc}</p>
          </div>
        ))}
      </div>

      <footer className="text-center py-6 border-t border-sky-100 text-slate-400 text-sm">
        © 2026 Student AI Assistant
      </footer>
    </div>
  );
}