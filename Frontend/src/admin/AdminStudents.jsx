import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from './AdminDashboard'

const AdminStudents = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')
  const admin = JSON.parse(localStorage.getItem('admin') || '{}')
  const headers = { Authorization: `Bearer ${token}` }

  const [students, setStudents] = useState([])
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editStudent, setEditStudent] = useState(null)
  const [form, setForm] = useState({ username: '', email: '', password: '', studentId: '' })
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [search, setSearch] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return }
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/students', { headers })
      setStudents(res.data)
    } catch { setMsg({ text: 'Failed to load students', type: 'error' }) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editStudent) {
        await axios.put(`http://localhost:5000/api/admin/students/${editStudent._id}`, form, { headers })
        setMsg({ text: 'Student updated successfully.', type: 'ok' })
      } else {
        await axios.post('http://localhost:5000/api/admin/students', form, { headers })
        setMsg({ text: 'Student created successfully.', type: 'ok' })
      }
      setShowForm(false); setEditStudent(null)
      setForm({ username: '', email: '', password: '', studentId: '' })
      fetchStudents()
    } catch (err) { setMsg({ text: err.response?.data?.message || 'Something went wrong.', type: 'error' }) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('This will permanently delete the student and all their tasks. Continue?')) return
    try {
      await axios.delete(`http://localhost:5000/api/admin/students/${id}`, { headers })
      setMsg({ text: 'Student removed.', type: 'ok' })
      fetchStudents()
    } catch { setMsg({ text: 'Delete failed.', type: 'error' }) }
  }

  const openEdit = (s) => {
    setEditStudent(s)
    setForm({ username: s.username, email: s.email, password: '', studentId: s.studentId })
    setShowForm(true)
  }

  const viewProfile = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/students/${id}`, { headers })
      setSelected(res.data)
    } catch { setMsg({ text: 'Could not load profile.', type: 'error' }) }
  }

  const resetForm = () => { setShowForm(false); setEditStudent(null); setForm({ username: '', email: '', password: '', studentId: '' }) }

  const filtered = students.filter(s =>
    s.username.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleLogout = () => {
    localStorage.removeItem('adminToken'); localStorage.removeItem('admin')
    navigate('/admin/login')
  }

  return (
    <div className="font-sans min-h-screen bg-app-gradient text-slate-800 flex">
      <Sidebar admin={admin} onLogout={handleLogout} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <div className="border-b border-sky-100 px-4 lg:px-10 py-5 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-sky-600 focus:outline-none">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <h1 className="text-slate-800 font-bold text-lg">Students</h1>
              <p className="text-slate-500 text-xs font-medium hidden sm:block">{students.length} total registered</p>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditStudent(null); setForm({ username: '', email: '', password: '', studentId: '' }) }}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all active:scale-[0.98]">
            <span className="text-lg leading-none">+</span> Add Student
          </button>
        </div>

        <div className="px-4 lg:px-10 py-8 max-w-7xl mx-auto">
          {/* Message */}
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
              type="text" placeholder="Search students by name or email..."
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
                    <th className="text-slate-500 font-bold text-xs uppercase tracking-wider px-6 py-4">Student</th>
                    <th className="text-slate-500 font-bold text-xs uppercase tracking-wider px-6 py-4">Email</th>
                    <th className="text-slate-500 font-bold text-xs uppercase tracking-wider px-6 py-4">Student ID</th>
                    <th className="text-slate-500 font-bold text-xs uppercase tracking-wider px-6 py-4">Joined</th>
                    <th className="text-slate-500 font-bold text-xs uppercase tracking-wider px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-slate-500 py-12 text-sm font-medium">No students found</td></tr>
                  ) : filtered.map((s, i) => (
                    <tr key={s._id} className={`border-b border-sky-50 hover:bg-sky-50/30 transition-colors ${i === filtered.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0 border border-sky-200">
                            <span className="text-xs font-bold text-sky-700">{s.username[0].toUpperCase()}</span>
                          </div>
                          <span className="text-slate-800 font-semibold">{s.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{s.email}</td>
                      <td className="px-6 py-4"><span className="font-mono text-xs font-semibold text-sky-700 bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-md">{s.studentId}</span></td>
                      <td className="px-6 py-4 text-slate-400 text-xs font-medium">{new Date(s.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => viewProfile(s._id)} className="text-xs font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-lg transition-colors">View</button>
                          <button onClick={() => openEdit(s)} className="text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                          <button onClick={() => handleDelete(s._id)} className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
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

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-sky-100 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-sky-100 bg-sky-50/50 rounded-t-2xl">
              <h2 className="text-slate-800 font-bold text-base">{editStudent ? 'Edit Student' : 'Add New Student'}</h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 transition-colors text-2xl leading-none font-light">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
              {[['Username', 'username', 'text'], ['Email', 'email', 'email'], ['Password', 'password', 'password'], ['Student ID', 'studentId', 'text']].map(([label, name, type]) => (
                <div key={name}>
                  <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{label}</label>
                  <input type={type} value={form[name]}
                    onChange={e => setForm({ ...form, [name]: e.target.value })}
                    placeholder={name === 'password' && editStudent ? 'Leave blank to keep current' : `Enter ${label.toLowerCase()}`}
                    className="w-full bg-white border border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-xl px-4 py-3 text-slate-800 text-sm placeholder-slate-400 outline-none transition-all"
                    required={!(name === 'password' && editStudent)}
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl text-sm font-bold shadow-sm transition-colors active:scale-[0.98]">
                  {editStudent ? 'Save Changes' : 'Create Student'}
                </button>
                <button type="button" onClick={resetForm} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 py-3 rounded-xl text-sm font-bold transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {selected && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-sky-100 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-sky-100 bg-sky-50/50 rounded-t-2xl">
              <h2 className="text-slate-800 font-bold text-base">Learner Profile</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 transition-colors text-2xl leading-none font-light">&times;</button>
            </div>
            <div className="px-6 py-6">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-sky-200 border border-sky-300 rounded-full flex items-center justify-center">
                  <span className="text-sky-700 font-bold text-lg">{selected.user?.username?.[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-slate-800 font-bold text-lg">{selected.user?.username}</p>
                  <p className="text-slate-500 text-sm font-medium">{selected.user?.email}</p>
                </div>
              </div>
              <div className="space-y-1 bg-white border border-sky-100 rounded-xl p-2 shadow-sm">
                {[['Student ID', selected.user?.studentId], ['Role', selected.user?.role],
                  ['Full Name', selected.learner?.name], ['Roll No', selected.learner?.rollNo],
                  ['Course', selected.learner?.course], ['Department', selected.learner?.department],
                  ['Semester', selected.learner?.semester], ['Phone', selected.learner?.phone]
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-2.5 px-4 border-b last:border-b-0 border-sky-50 text-sm">
                    <span className="text-slate-500 font-semibold">{label}</span>
                    <span className="text-slate-800 font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>
              {!selected.learner && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl text-center">
                  <p className="text-amber-700 text-sm font-medium">Student hasn't created a learner profile yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminStudents
