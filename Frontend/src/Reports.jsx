import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Reports = () => {

  const [tasks, setTasks] = useState([])

  // ✅ Fetch real tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks")
        setTasks(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchTasks()
  }, [])

  const completed = tasks.filter(t => t.status === 'Completed').length
  const pending = tasks.filter(t => t.status === 'Pending').length

  // ✅ Real stats
  const reports = [
    { title: "Total Tasks",     value: tasks.length },
    { title: "Completed Tasks", value: completed },
    { title: "Pending Tasks",   value: pending },
    { title: "AI Queries",      value: "—" }
  ]

  // ✅ Real activity from tasks
  const activities = tasks.slice(-5).reverse().map(t => ({
    learner: t.learnerId || "Student",
    activity: `${t.status === 'Completed' ? 'Completed' : 'Added'} task: ${t.title}`,
    date: new Date(t.createdAt).toLocaleDateString()
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-10">

      <div className="mb-10">
        <h1 className="text-5xl font-bold">Reports & Analytics</h1>
        <p className="text-gray-400 mt-3 text-lg">Monitor learner activities and statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-14">
        {reports.map((item, index) => (
          <div
            key={index}
            className="bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-2xl"
          >
            <h2 className="text-xl text-gray-400 mb-4">{item.title}</h2>
            <h1 className="text-5xl font-bold">{item.value}</h1>
          </div>
        ))}
      </div>

      {/* Activity Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-2xl overflow-x-auto">
        <h2 className="text-3xl font-bold mb-8">Recent Activities</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 text-left">
              <th className="pb-4">Learner</th>
              <th className="pb-4">Activity</th>
              <th className="pb-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-6 text-center text-gray-400">
                  No activities yet
                </td>
              </tr>
            ) : (
              activities.map((activity, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-5">{activity.learner}</td>
                  <td className="py-5">{activity.activity}</td>
                  <td className="py-5">{activity.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Reports