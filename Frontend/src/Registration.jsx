import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', email: '', password: '', studentId: '' })
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.username || !formData.email || !formData.password || !formData.studentId) {
      setMessage({ text: 'All fields are required!', type: 'error' }); return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setMessage({ text: 'Invalid email format', type: 'error' }); return
    }
    if (formData.password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', type: 'error' }); return
    }
    setLoading(true)
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData)
      setMessage({ text: 'Account created! Redirecting...', type: 'success' })
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Something went wrong', type: 'error' })
    } finally { setLoading(false) }
  }

  const inputClasses = "w-full h-11 px-4 rounded-xl border border-sky-200 bg-sky-100 text-slate-800 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all";

  return (
    <div className="font-sans min-h-screen bg-app-gradient flex items-center justify-center p-4 py-10">
      <div className="bg-white border border-sky-100 rounded-2xl p-8 sm:p-10 w-full max-w-md shadow-xl shadow-sky-100/50">

        <div className="text-center mb-8">
          <div className="text-4xl mb-3 inline-block">📚</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Create Account</h1>
          <p className="text-slate-500 text-sm">Join the AI Student Assistant</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Username', name: 'username', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Password', name: 'password', type: 'password' },
            { label: 'Student ID', name: 'studentId', type: 'text' },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">{f.label}</label>
              <input type={f.type} name={f.name} value={formData[f.name]}
                onChange={handleChange}
                className={inputClasses} required />
            </div>
          ))}

          {message.text && (
            <div className={`p-3 rounded-xl text-sm font-medium border ${message.type === 'error'
              ? "bg-red-50 text-red-600 border-red-100"
              : "bg-emerald-50 text-emerald-600 border-emerald-100"
              }`}>
              {message.text}
            </div>
          )}

          <button type="submit" disabled={loading}
            className={`w-full h-12 mt-2 rounded-xl text-white font-bold text-sm tracking-wide transition-all shadow-md ${loading
              ? "bg-sky-300 cursor-not-allowed shadow-none"
              : "bg-sky-600 hover:bg-sky-700 hover:shadow-lg active:scale-[0.98]"
              }`}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-600 font-bold hover:text-sky-700 hover:underline transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage