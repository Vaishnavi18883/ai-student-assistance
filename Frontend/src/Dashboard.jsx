import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "./context/UserContext"
import axios from "axios"
import aiGif from './assets/Gif/chatbot.gif'
import taskGif from './assets/Gif/task.gif'
import profileGif from './assets/Gif/profile.gif'
import reportGif from './assets/Gif/report.gif'
import notesGif from './assets/Gif/books.gif'

const modules = [
  { title: 'AI Chat Assistant', desc: 'Ask doubts and get AI-powered answers instantly.', gif: aiGif, path: '/aichat' },
  { title: 'Task Manager', desc: 'Create and manage your study tasks and deadlines.', gif: taskGif, path: '/taskmanager' },
  { title: 'Study Materials', desc: 'Upload notes, PDFs and subject-wise resources.', gif: notesGif, path: '/studyMaterials' },
  { title: 'Student Profile', desc: 'View and update your personal information.', gif: profileGif, path: '/learnerprofile' },
  { title: 'Reports', desc: 'Check task statistics and activity history.', gif: reportGif, path: '/studentreport' },
]

function Dashboard() {
  const { user, logout } = useUser()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:5000/api/tasks/user/${user.id}`)
        .then(r => setTasks(r.data)).catch(console.error)
    }
  }, [user])

  const handleLogout = () => { logout(); navigate("/login") }
  const completed = tasks.filter(t => t.status === 'Completed').length
  const pending = tasks.filter(t => t.status === 'Pending').length

  return (
    <div className="font-sans min-h-screen bg-app-gradient text-slate-900 pb-16">

      {/* Topbar */}
      <nav className="bg-white border-b border-sky-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-xl text-sky-700 tracking-tight">📚 Student AI</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:block">
              Hi, <strong className="text-slate-800">{user?.username}</strong>
            </span>
            <button onClick={handleLogout}
              className="bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-red-600 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-10">

        {/* Welcome + Stats */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12 justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Welcome back, <span className="text-white">{user?.username}</span> 👋</h1>
            <p className="text-slate-500 text-base">Here's your academic overview and quick access to all modules.</p>
          </div>

          <div className="flex gap-3 sm:gap-4 flex-wrap">
            {[
              { label: "Total Tasks", value: tasks.length, color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-100" },
              { label: "Completed", value: completed, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
              { label: "Pending", value: pending, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
            ].map((s, i) => (
              <div key={i} className={`bg-white border ${s.border} rounded-2xl p-5 min-w-[120px] text-center shadow-sm hover:shadow-md transition-shadow`}>
                <p className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modules */}
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5">Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m, i) => (
            <Link key={i} to={m.path} className="group">
              <div className="bg-white border border-sky-100 rounded-2xl p-6 flex items-start gap-5 cursor-pointer hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100/50 transition-all duration-300 h-full">
                <div className="bg-sky-50 rounded-xl p-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <img src={m.gif} alt={m.title} className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <p className="font-bold text-base text-slate-800 mb-1.5 group-hover:text-sky-600 transition-colors">{m.title}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="text-center py-8 text-slate-400 text-xs mt-12">
        AI Student Assistant © 2026
      </footer>
    </div>
  )
}

export default Dashboard