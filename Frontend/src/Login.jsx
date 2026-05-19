import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from './context/UserContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useUser()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setMessage({ text: 'All fields are required!', type: 'error' }); return
    }
    if (formData.password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', type: 'error' }); return
    }
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData)
      const { role, token, user, admin } = res.data
      if (role === 'admin') {
        localStorage.setItem('adminToken', token)
        localStorage.setItem('admin', JSON.stringify(admin))
        navigate('/admin/dashboard'); return
      }
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      login(user)
      navigate('/dashboard')
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Login failed', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const inputClasses = "w-full h-12 px-4 rounded-xl border border-sky-200 bg-sky-50 text-slate-800 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all";

  return (
    <div className="font-sans min-h-screen bg-app-gradient flex items-center justify-center p-4">
      <div className="bg-white border border-sky-100 rounded-2xl p-8 sm:p-10 w-full max-w-md shadow-xl shadow-sky-100/50">

        <div className="text-center mb-8">
          <div className="text-5xl mb-4 inline-block transform hover:scale-110 transition-transform">📚</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Sign in to your AI Student Assistant</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Email or Username</label>
            <input type="text" name="email" value={formData.email} onChange={handleChange}
              className={inputClasses} required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange}
              className={inputClasses} required />
          </div>

          {message.text && (
            <div className={`p-3 rounded-xl text-sm font-medium border ${message.type === 'error'
              ? "bg-red-50 text-red-600 border-red-100"
              : "bg-emerald-50 text-emerald-600 border-emerald-100"
              }`}>
              {message.text}
            </div>
          )}

          <button type="submit" disabled={loading}
            className={`w-full h-12 rounded-xl text-white font-bold text-sm tracking-wide transition-all shadow-md ${loading
              ? "bg-sky-300 cursor-not-allowed shadow-none"
              : "bg-sky-600 hover:bg-sky-700 hover:shadow-lg active:scale-[0.98]"
              }`}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-sky-600 font-bold hover:text-sky-700 hover:underline transition-colors">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage