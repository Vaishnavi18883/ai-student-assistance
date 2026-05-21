import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import profileGif from '../assets/Gif/profile.gif'
import taskGif from '../assets/Gif/task.gif'

export const Sidebar = ({ admin, onLogout }) => {
  const { pathname } = useLocation()
  const links = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '▪' },
    { label: 'Students', path: '/admin/students', icon: '▪' },
    { label: 'Tasks', path: '/admin/tasks', icon: '▪' },
  ]
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-sky-100 flex flex-col shadow-sm">
      <div className="px-6 py-6 border-b border-sky-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white text-sm font-black">A</span>
          </div>
          <span className="text-slate-800 font-bold text-lg tracking-tight">Admin </span>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest px-3 mb-4">Navigation</p>
        {links.map(l => {
          const active = pathname === l.path
          return (
            <Link key={l.path} to={l.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-sky-50 text-sky-700 shadow-sm border border-sky-100'
                  : 'text-slate-500 hover:text-sky-600 hover:bg-sky-50/50 border border-transparent'
              }`}>
              <span className={`text-[10px] ${active ? 'text-sky-500' : 'text-slate-300'}`}>▪</span>
              {l.label}
            </Link>
          )
        })}
      </nav>


      <div className="p-4 border-t border-sky-50">
        <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-sky-200 rounded-full flex items-center justify-center flex-shrink-0 border border-sky-300">
            <span className="text-sky-700 text-sm font-bold">{admin?.username?.[0]?.toUpperCase()}</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-slate-800 text-sm font-bold truncate">{admin?.username}</p>
            <p className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider">Administrator</p>
          </div>
        </div>
        <button onClick={onLogout}
          className="w-full text-center px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:border-red-100 border border-transparent text-sm font-medium transition-all">
          Sign out
        </button>
      </div>
    </aside>
  )
}

const StatCard = ({ label, value, note, accentText, accentBg }) => (
  <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{label}</p>
      <div className={`w-2 h-2 rounded-full mt-1 ${accentBg}`} />
    </div>
    <p className={`text-4xl font-extrabold tracking-tight mb-2 ${accentText}`}>{value ?? '—'}</p>
    {note && <p className="text-slate-400 text-xs font-medium">{note}</p>}
  </div>
)

const AdminDashboard = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')
  const admin = JSON.parse(localStorage.getItem('admin') || '{}')
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return }
    axios.get('http://localhost:5000/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setStats(r.data)).catch(() => setError('Failed to load stats'))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('admin')
    navigate('/admin/login')
  }

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="font-sans min-h-screen bg-app-gradient text-slate-800 flex">
      <Sidebar admin={admin} onLogout={handleLogout} />

      <main className="flex-1 overflow-y-auto">
  
        <div className="border-b border-sky-100 px-10 py-5 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
          <div>
            <h1 className="text-slate-800 font-bold text-lg">Dashboard</h1>
            <p className="text-slate-500 text-xs font-medium">{today}</p>
          </div>
          <span className="text-xs bg-sky-100 text-sky-700 border border-sky-200 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
            Admin
          </span>
        </div>

        <div className="px-10 py-8 max-w-7xl mx-auto">
        
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">
              Good morning, <span className="text-sky-600">{admin.username}</span> 👋
            </h2>
            <p className="text-slate-500 text-base">Here's what's happening on your platform today.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 text-sm font-medium mb-8 shadow-sm">{error}</div>
          )}

          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard label="Total Students" value={stats?.totalStudents} note="Registered accounts" accentText="text-blue-600" accentBg="bg-blue-400" />
            <StatCard label="Active Today" value={stats?.activeStudents} note="Login in last 24h" accentText="text-emerald-600" accentBg="bg-emerald-400" />
            <StatCard label="Total Tasks" value={stats?.totalTasks} note="Across all students" accentText="text-indigo-600" accentBg="bg-indigo-400" />
            <StatCard label="Completed" value={stats?.completedTasks} note="Tasks marked done" accentText="text-amber-500" accentBg="bg-amber-400" />
          </div>

          
          <div className="mb-8">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-5">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/admin/students"
                className="bg-white border border-sky-100 hover:border-sky-300 hover:shadow-md rounded-2xl p-8 group transition-all">
                <div className="flex items-center justify-between mb-5">
                  <div className="bg-sky-50 p-3 rounded-xl">
                    <img src={profileGif} alt="Students" className="w-10 h-10 object-contain" />
                  </div>
                  <span className="text-slate-300 group-hover:text-sky-500 text-xl transition-colors">→</span>
                </div>
                <h4 className="text-slate-800 font-bold text-lg mb-2 group-hover:text-sky-700 transition-colors">Manage Students</h4>
                <p className="text-slate-500 text-sm leading-relaxed">View, add, edit or remove student accounts from the platform.</p>
              </Link>
              <Link to="/admin/tasks"
                className="bg-white border border-sky-100 hover:border-sky-300 hover:shadow-md rounded-2xl p-8 group transition-all">
                <div className="flex items-center justify-between mb-5">
                  <div className="bg-sky-50 p-3 rounded-xl">
                    <img src={taskGif} alt="Tasks" className="w-10 h-10 object-contain" />
                  </div>
                  <span className="text-slate-300 group-hover:text-sky-500 text-xl transition-colors">→</span>
                </div>
                <h4 className="text-slate-800 font-bold text-lg mb-2 group-hover:text-sky-700 transition-colors">Manage Tasks</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Create and assign tasks directly to students.</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
