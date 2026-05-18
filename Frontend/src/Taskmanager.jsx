import React, { useState, useEffect } from 'react'
import axios from 'axios'
import alert from './assets/Gif/notification.png'
import { useUser } from './context/UserContext'

const TaskManager = () => {

  const { user } = useUser()

  const [task, setTask] = useState({
    title: '',
    subject: '',
    deadline: '',
    status: 'Pending'
  })

  const [tasks, setTasks] = useState([])
  const [editId, setEditId] = useState(null)
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks")
      setTasks(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!task.title || !task.subject || !task.deadline) {
      alert("Please fill all fields")
      return
    }

    try {

      const newTask = {
        ...task,
        learnerId: user?.id
      }

      if (editId !== null) {

        await axios.put(
          `http://localhost:5000/api/tasks/${editId}`,
          newTask
        )
        setEditId(null)
      } else {

        await axios.post(
          "http://localhost:5000/api/tasks/add",
          newTask
        )
      }

      fetchTasks()

      setTask({
        title: '',
        subject: '',
        deadline: '',
        status: 'Pending'
      })

    } catch (error) {
      console.log(error)
    }
  }


  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`)
      fetchTasks()
    } catch (error) {
      console.log(error)
    }
  }


  const editTask = (task) => {
    setTask(task)
    setEditId(task._id)
  }


  const getDeadlineMessage = (deadline) => {

    const today = new Date();

    const taskDate = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);

    const diff =
      (taskDate - today) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      return `Deadline in ${diff} day(s)`;

    } else if (diff === 0) {
      return "Today is the last date for task completion";
    }

    else if (diff < 0) {
      return "Deadline crossed";
    }

    else {
      return "";
    }

  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-600 to-black text-white p-10">

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Task Manager</h1>
        <p className="text-gray-400 mt-2">Manage your academic tasks and reminders</p>
      </div>
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block mb-2 text-lg">Task Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter task title"
              value={task.title}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Enter subject"
              value={task.subject}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={task.deadline}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Status</label>
            <select
              name="status"
              value={task.status}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300"
          >
            {editId !== null ? "Update Task" : "Add Task"}
          </button>

        </form>
      </div>
      <div className="max-w-5xl mx-auto mt-14">

  <h2 className="text-3xl font-bold mb-6">
    Task List
  </h2>

  <div className="grid gap-6">

    {
      [...tasks]

        .sort((a, b) => {
          if (
            a.status === "Completed" &&
            b.status !== "Completed"
          ) {
            return 1;
          }

          if (
            a.status !== "Completed" &&
            b.status === "Completed"
          ) {
            return -1;
          }

          return (
            new Date(a.deadline) -
            new Date(b.deadline)
          );

        })

        .length === 0 ? (

        <div className="bg-gray-800 p-6 rounded-2xl text-center text-gray-400 border border-gray-700">

          No tasks added yet

        </div>

      ) : (

        [...tasks]

          .sort((a, b) => {

            if (
              a.status === "Completed" &&
              b.status !== "Completed"
            ) {
              return 1;
            }

            if (
              a.status !== "Completed" &&
              b.status === "Completed"
            ) {
              return -1;
            }

            return (
              new Date(a.deadline) -
              new Date(b.deadline)
            );

          })

          .map((item) => (

            <div
              key={item._id}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 shadow-xl"
            >

              <div>

                <h3 className="text-2xl font-bold">
                  {item.title}
                </h3>

                <p className="text-gray-400 mt-2">
                  Subject: {item.subject}
                </p>

                <p className="text-gray-400">
                  Deadline: {item.deadline}
                </p>

                <p
                  className={`mt-2 font-semibold ${
                    item.status === "Completed"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {item.status}
                </p>

                {
                  getDeadlineMessage(item.deadline) &&
                  item.status !== "Completed" && (

                    <div className="mt-4 bg-red-500/20 border border-red-500 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg">

                      <img
                        src={alert}
                        alt="alert"
                        className="w-8 h-8 object-contain"
                      />

                      <p className="text-red-300 font-semibold text-sm">

                        {getDeadlineMessage(item.deadline)}

                      </p>

                    </div>

                  )
                }

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => deleteTask(item._id)}
                  className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl transition-all duration-300"
                >
                  Delete
                </button>

                <button
                  onClick={() => editTask(item)}
                  className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-xl transition-all duration-300"
                >
                  Edit
                </button>

              </div>

            </div>

          ))

      )

    }
    </div>  
  </div>

    </div>
  )
} 

export default TaskManager