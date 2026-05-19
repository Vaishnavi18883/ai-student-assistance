import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from './AdminDashboard'

const STATUS = {
  Pending: 'text-amber-600 bg-amber-50 border-amber-200',
  Completed: 'text-emerald-600 bg-emerald-50 border-emerald-200',
}

const AdminTasks = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')
  const admin = JSON.parse(localStorage.getItem('admin') || '{}')
  const headers = { Authorization: `Bearer ${token}` }

  const [tasks, setTasks] = useState([])
  const [students, setStudents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [form, setForm] = useState({ title: '', subject: '', deadline: '', status: 'Pending', learnerId: '' })
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return }
    fetchTasks(); fetchStudents()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/tasks', { headers })
      setTasks(res.data)
    } catch { setMsg({ text: 'Failed to load tasks', type: 'error' }) }
  }

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/students', { headers })
      setStudents(res.data)
    } catch {}
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editTask) {
        await axios.put(`http://localhost:5000/api/admin/tasks/${editTask._id}`, form, { headers })
        setMsg({ text: 'Task updated.', type: 'ok' })
      } else {
        await axios.post('http://localhost:5000/api/admin/tasks', form, { headers })
        setMsg({ text: 'Task created and assigned.', type: 'ok' })
      }
      resetForm(); fetchTasks()
    } catch (err) { setMsg({ text: err.response?.data?.message || 'Something went wrong.', type: 'error' }) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await axios.delete(`http://localhost:5000/api/admin/tasks/${id}`, { headers })
      setMsg({ text: 'Task deleted.', type: 'ok' })
      fetchTasks()
    } catch { setMsg({ text: 'Could not delete task.', type: 'error' }) }
  }

  const openEdit = (t) => {
    setEditTask(t)
    setForm({ title: t.title, subject: t.subject, deadline: t.deadline?.slice(0, 10) || '', status: t.status, learnerId: t.learnerId || '' })
    setShowForm(true)
  }

  const resetForm = () => { setShowForm(false); setEditTask(null); setForm({ title: '', subject: '', deadline: '', status: 'Pending', learnerId: '' }) }

  const getStudentName = (id) => students.find(s => s._id === id)?.username || '—'

  const filtered = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  )

  const handleLogout = () => {
    localStorage.removeItem('adminToken'); localStorage.removeItem('admin')
    navigate('/admin/login')
  }

  return (
    <div className="font-sans min-h-screen bg-app-gradient text-slate-800 flex">
      <Sidebar admin={admin} onLogout={handleLogout} />

      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <div className="border-b border-sky-100 px-10 py-5 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
          <div>
            <h1 className="text-slate-800 font-bold text-lg">Tasks</h1>
            <p className="text-slate-500 text-xs font-medium">{tasks.length} total tasks</p>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditTask(null) }}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all active:scale-[0.98]">
            <span className="text-lg leading-none">+</span> Assign Task
          </button>
        </div>

        <div className="px-10 py-8 max-w-7xl mx-auto">
          {msg.text && (
            <div className={`text-sm font-medium px-5 py-3.5 rounded-xl mb-6 border shadow-sm ${msg.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
              {msg.text}
            </div>
          )}

          {/* Search */}
          <div className="relative mb-8 max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text" placeholder="Search tasks by title or subject..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-sky-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 text-sm placeholder-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all shadow-sm"
            />
          </div>

          {/* Table */}
          <div className="bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-sky-100 bg-sky-50/50">
                    {['Title', 'Subject', 'Deadline', 'Status', 'Assigned To', 'Actions'].map(h => (
                      <th key={h} className="text-slate-500 font-bold text-xs uppercase tracking-wider px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-slate-500 py-12 text-sm font-medium">No tasks found</td></tr>
                  ) : filtered.map((t, i) => (
                    <tr key={t._id} className={`hover:bg-sky-50/30 transition-colors ${i < filtered.length - 1 ? 'border-b border-sky-50' : ''}`}>
                      <td className="px-6 py-4 text-slate-800 font-semibold">{t.title}</td>
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        <span className="bg-sky-50 px-2 py-1 rounded text-xs">{t.subject}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-semibold text-slate-500">{t.deadline}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold border px-2.5 py-1 rounded-md ${STATUS[t.status] || 'text-slate-500 bg-slate-50 border-slate-200'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium flex items-center gap-2">
                         <div className="w-6 h-6 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0 border border-sky-200 text-sky-700 text-[10px] font-bold">
                           {getStudentName(t.learnerId)[0]?.toUpperCase() || '-'}
                         </div>
                         {getStudentName(t.learnerId)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(t)} className="text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                          <button onClick={() => handleDelete(t._id)} className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-sky-100 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-sky-100 bg-sky-50/50 rounded-t-2xl">
              <h2 className="text-slate-800 font-bold text-base">{editTask ? 'Edit Task' : 'Create & Assign Task'}</h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 transition-colors text-2xl leading-none font-light">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Task Title</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Complete assignment" required
                  className="w-full bg-white border border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-xl px-4 py-3 text-slate-800 text-sm placeholder-slate-400 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Subject</label>
                <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Mathematics" required
                  className="w-full bg-white border border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-xl px-4 py-3 text-slate-800 text-sm placeholder-slate-400 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} required
                  className="w-full bg-white border border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-white border border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none transition-all">
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Assign To Student</label>
                <select value={form.learnerId} onChange={e => setForm({ ...form, learnerId: e.target.value })}
                  className="w-full bg-white border border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none transition-all">
                  <option value="">— Select a student —</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.username} ({s.email})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl text-sm font-bold shadow-sm transition-colors active:scale-[0.98]">
                  {editTask ? 'Save Changes' : 'Create Task'}
                </button>
                <button type="button" onClick={resetForm} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 py-3 rounded-xl text-sm font-bold transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminTasks
