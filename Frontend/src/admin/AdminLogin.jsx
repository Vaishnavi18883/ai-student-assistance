import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', form)
      localStorage.setItem('adminToken', res.data.token)
      localStorage.setItem('admin', JSON.stringify(res.data.admin))
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Wrong credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}
      className="min-h-screen bg-app-gradient flex">

      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-zinc-900 border-r border-zinc-800 p-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-violet-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-black">A</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">AdminOS</span>
          </div>
          <span className="text-zinc-600 text-xs">AI Student Assistance Platform</span>
        </div>

        <div>
          <blockquote className="text-zinc-300 text-2xl font-semibold leading-snug mb-4">
            "Manage students,<br />track progress, stay<br />in control."
          </blockquote>
          <p className="text-zinc-600 text-sm">Full administrative access to the platform.</p>
        </div>

        <div className="flex gap-4">
          {['Students', 'Tasks', 'Analytics', 'Profiles'].map(t => (
            <span key={t} className="text-zinc-700 text-xs border border-zinc-800 px-3 py-1.5 rounded">{t}</span>
          ))}
        </div>
      </div>

  
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          <div className="mb-8">
            <h1 className="text-white text-3xl font-bold tracking-tight mb-1.5">Sign in</h1>
            <p className="text-zinc-500 text-sm">Admin access only. Students use the main portal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-xs font-medium mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="admin"
                autoComplete="username"
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-violet-500 rounded-lg px-4 py-3 text-white text-sm placeholder-zinc-600 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-xs font-medium mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-violet-500 rounded-lg px-4 py-3 text-white text-sm placeholder-zinc-600 outline-none transition-colors"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-950 border border-red-900 rounded-lg px-4 py-3">
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-900 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg text-sm transition-colors mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in to Admin Panel'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-zinc-700 text-xs text-center">
              Default credentials: <span className="font-mono text-zinc-500">admin</span> / <span className="font-mono text-zinc-500">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
