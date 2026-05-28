import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useUser } from './context/UserContext'
import { Link } from 'react-router-dom'
import alertIcon from './assets/Gif/notification.png'

const TaskManager = () => {
  const { user } = useUser()
  const [task, setTask] = useState({ title: '', subject: '', deadline: '', status: 'Pending' })
  const [tasks, setTasks] = useState([])
  const [editId, setEditId] = useState(null)

  useEffect(() => { if (user?.id) fetchTasks() }, [user])

  const fetchTasks = async () => {
    if (!user?.id) return
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/user/${user.id}`)
      setTasks(res.data)
    } catch (err) { console.log(err) }
  }

  const handleChange = (e) => setTask({ ...task, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!task.title || !task.subject || !task.deadline) { window.alert('Please fill all fields'); return }
    try {
      const payload = { ...task, learnerId: user?.id }
      if (editId) { await axios.put(`http://localhost:5000/api/tasks/${editId}`, payload); setEditId(null) }
      else { await axios.post('http://localhost:5000/api/tasks/add', payload) }
      fetchTasks()
      setTask({ title: '', subject: '', deadline: '', status: 'Pending' })
    } catch (err) { console.log(err) }
  }

  const deleteTask = async (id) => {
    try { await axios.delete(`http://localhost:5000/api/tasks/${id}`); fetchTasks() }
    catch (err) { console.log(err) }
  }

  const editTask = (t) => { setTask(t); setEditId(t._id) }

  const getDeadlineMsg = (deadline) => {
    const today = new Date(); today.setHours(0,0,0,0)
    const d = new Date(deadline); d.setHours(0,0,0,0)
    const diff = (d - today) / (1000*60*60*24)
    if (diff === 0) return 'Due today!'
    if (diff === 1) return 'Due tomorrow'
    if (diff < 0) return 'Overdue'
    return null
  }

  const sorted = [...tasks].sort((a, b) => {
    if (a.status === 'Completed' && b.status !== 'Completed') return 1
    if (a.status !== 'Completed' && b.status === 'Completed') return -1
    return new Date(a.deadline) - new Date(b.deadline)
  })

  const inputClasses = "w-full h-11 px-3 rounded-lg border border-sky-200 bg-sky-100 text-slate-800 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors";
  const labelClasses = "block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide";

  return (
    <div className="font-sans min-h-screen bg-app-gradient text-slate-900 pb-12">

      <nav className="bg-white border-b border-sky-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link to="/dashboard" className="text-slate-400 hover:text-sky-600 text-xl leading-none transition-colors">←</Link>
          <span className="font-semibold text-base text-slate-800">✅ Task Manager</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">

     
        <div className="bg-white border border-sky-100 rounded-xl p-5 sm:p-6 shadow-md shadow-sky-100/50 mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
            {editId ? ' Edit Task' : 'Add New Task'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <div>
                <label className={labelClasses}>Task Title</label>
                <input type="text" name="title" value={task.title} onChange={handleChange}
                  placeholder="e.g. Complete assignment" className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Subject</label>
                <input type="text" name="subject" value={task.subject} onChange={handleChange}
                  placeholder="e.g. Mathematics" className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Deadline</label>
                <input type="date" name="deadline" value={task.deadline} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Status</label>
                <select name="status" value={task.status} onChange={handleChange} className={inputClasses}>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-6 rounded-lg text-sm transition-colors shadow-sm">
                {editId ? 'Update Task' : 'Add Task'}
              </button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setTask({ title: '', subject: '', deadline: '', status: 'Pending' }) }}
                  className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 font-medium py-2 px-6 rounded-lg text-sm transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

    
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            Your Tasks <span className="ml-1 bg-sky-100 text-sky-700 py-0.5 px-2 rounded-full text-xs">{sorted.length}</span>
          </h2>
        </div>

        {sorted.length === 0 ? (
          <div className="bg-white border border-sky-100 rounded-xl p-10 text-center text-slate-500 text-sm shadow-sm">
            No tasks yet. Add your first task above.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sorted.map(item => {
              const msg = getDeadlineMsg(item.deadline)
              const done = item.status === 'Completed'
              return (
                <div key={item._id} className={`bg-white border ${done ? 'border-sky-50' : 'border-sky-100 hover:border-sky-300'} rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all shadow-sm ${done ? 'opacity-70 bg-slate-50' : ''}`}>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl mt-0.5">{done ? '✅' : '🔵'}</span>
                    <div>
                      <p className={`font-semibold text-base mb-1 ${done ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 mb-1 font-medium bg-sky-50 inline-block px-2 py-0.5 rounded mr-2">{item.subject}</p>
                      <span className="text-xs text-slate-400">{item.deadline}</span>
                      {msg && !done && (
                        <div className="flex items-center gap-1.5 mt-2 bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-semibold w-fit">
                          <img src={alertIcon} alt="alert" className="w-4 h-4" />
                          <span>{msg}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => editTask(item)}
                      className="flex-1 sm:flex-none bg-white hover:bg-sky-50 border border-sky-200 text-sky-700 font-medium py-1.5 px-4 rounded-md text-xs transition-colors">
                      Edit
                    </button>
                    <button onClick={() => deleteTask(item._id)}
                      className="flex-1 sm:flex-none bg-white hover:bg-red-50 border border-red-200 text-red-600 font-medium py-1.5 px-4 rounded-md text-xs transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskManager