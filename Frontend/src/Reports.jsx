import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useUser } from './context/UserContext'

const Reports = () => {
  const { user } = useUser()
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:5000/api/tasks/user/${user.id}`)
        .then(r => setTasks(r.data)).catch(console.log)
    }
  }, [user])

  const completed = tasks.filter(t => t.status === 'Completed').length
  const pending = tasks.filter(t => t.status === 'Pending').length
  const rate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

  const stats = [
    { label: 'Total Tasks', value: tasks.length, textColor: "text-sky-600" },
    { label: 'Completed', value: completed, textColor: "text-emerald-600" },
    { label: 'Pending', value: pending, textColor: "text-amber-600" },
    { label: 'Completion Rate', value: `${rate}%`, textColor: "text-indigo-600" },
  ]

  const recent = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8)

  return (
    <div className="font-sans min-h-screen bg-app-gradient text-slate-900">

      <nav className="bg-white border-b border-sky-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link to="/dashboard" className="text-slate-500 hover:text-sky-600 text-lg transition-colors">←</Link>
          <span className="font-semibold text-base text-slate-800">📊 Reports & Analytics</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Your Progress</h1>
          <p className="text-sm text-slate-500">Overview of your task activity.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white border border-sky-100 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
              <p className={`text-3xl font-bold mb-1 ${s.textColor}`}>{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recent activity table */}
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent Activity</h2>
        <div className="bg-white border border-sky-100 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-sky-50/50 border-b border-sky-100">
                  {["Task", "Subject", "Status", "Deadline"].map(h => (
                    <th key={h} className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-8 text-slate-400 text-sm">No activity yet</td>
                  </tr>
                ) : recent.map((t, i) => (
                  <tr key={t._id} className={`border-b border-sky-50 last:border-none hover:bg-sky-50/30 transition-colors`}>
                    <td className="p-4 font-medium text-slate-800">{t.title}</td>
                    <td className="p-4 text-slate-500">{t.subject}</td>
                    <td className="p-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                        t.status === 'Completed' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                          : 'bg-amber-50 text-amber-600 border-amber-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-xs">{t.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports