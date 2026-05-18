import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "./context/UserContext"  
import axios from "axios"
import ai from './assets/Gif/chatbot.gif'
import task from './assets/Gif/task.gif'
import profile from './assets/Gif/profile.gif'
import report from './assets/Gif/report.gif'
import notes from './assets/Gif/books.gif'

function Dashboard() {

  const { user, logout } = useUser()  
  const navigate = useNavigate()     
  const [tasks, setTasks] = useState([])

  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks")
        setTasks(res.data)
      } catch (err) {
        console.error("Failed to fetch tasks", err)
      }
    }
    fetchTasks()
  }, [])

 
  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const completed = tasks.filter(t => t.status === 'Completed').length

  const cards = [
    { title: 'AI Chat Assistant', desc: 'Ask doubts, generate notes and get AI-powered answers instantly.', image: ai, btn: 'Open AI Chat', path: '/aichat' },
    { title: 'Task Manager', desc: 'Create, update and manage your study tasks and reminders.', image: task, btn: 'Manage Tasks', path: '/taskmanager' },
    {title: 'Study Materials',desc: 'Upload notes, download PDFs and manage subject-wise study materials.',image: notes,btn: 'Open Materials',path: '/studyMaterials'},
    { title: 'Student Profile', desc: 'View your personal information and account details.', image: profile, btn: 'View Profile', path: '/learnerprofile' },
    { title: 'Reports & Analytics', desc: 'Check activity reports, task statistics and AI history.', image: report, btn: 'View Reports', path: '/studentreport' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-500 via-gray-380 to-black text-white overflow-hidden">
      <nav className="w-full flex justify-between items-center px-10 py-5 border-b border-gray-500 backdrop-blur-lg">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">AI Student Assistant</h1>
          <p className="text-gray-400 text-sm mt-1">Smart Learning & Productivity Platform</p>
        </div>
       
        <button
          onClick={handleLogout}
          className="bg-red-400 hover:bg-red-500 transition-all duration-300 px-5 py-2 rounded-xl shadow-lg"
        >
          Logout
        </button>
      </nav>
      <div className="px-10 py-12">
        <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-3xl p-10 shadow-2xl border border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div>
             
              <h2 className="text-5xl font-bold leading-tight mb-5">
                Welcome Back, {user?.username} 👋
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
                Manage your academic tasks, interact with AI,
                track performance and organize your student life
                efficiently using the AI Student Assistant.
              </p>
              <button className="mt-8 bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 shadow-xl">
                Explore Dashboard
              </button>
            </div>

            <div className="bg-black/30 border border-gray-600 rounded-3xl p-8 w-[320px] shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-center">Quick Stats</h3>
              <div className="space-y-5">
                <div className="bg-gray-800 rounded-2xl p-4 flex justify-between items-center">
                  <span>Total Tasks</span>
                  <span className="text-2xl font-bold">{tasks.length}</span>
                </div>
                <div className="bg-gray-800 rounded-2xl p-4 flex justify-between items-center">
                  <span>Completed</span>
                  <span className="text-2xl font-bold text-green-400">{completed}</span>
                </div>
                <div className="bg-gray-800 rounded-2xl p-4 flex justify-between items-center">
                  <span>AI Queries</span>
                  <span className="text-2xl font-bold text-blue-400">—</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="px-10 pb-14">
        <h2 className="text-3xl font-bold mb-8">Dashboard Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl p-7 shadow-2xl hover:-translate-y-2 hover:shadow-gray-900/60 transition-all duration-500"
            >
              <div className="mb-5 flex justify-center">
                <img src={card.image} alt={card.title} className="w-24 h-24 object-contain" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">{card.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-7 text-center">{card.desc}</p>
              <Link to={card.path}>
                <button className="w-full bg-white text-black py-3 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300">
                  {card.btn}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

    
      <footer className="border-t border-gray-700 py-6 text-center text-gray-400">
        AI Student Assistant © 2026
      </footer>

    </div>
  )
}

export default Dashboard