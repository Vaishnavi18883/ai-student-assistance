import React, { useState } from 'react'

const TaskManager = () => {

  const [task, setTask] = useState({
    title: '',
    subject: '',
    deadline: '',
    status: 'Pending'
  })

  const [tasks, setTasks] = useState([])

  // Handle Input Change
  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value
    })
  }

  // Add Task
  const handleSubmit = (e) => {
    e.preventDefault()

    if (
      !task.title ||
      !task.subject ||
      !task.deadline
    ) {
      alert("Please fill all fields")
      return
    }

    setTasks([...tasks, task])

    setTask({
      title: '',
      subject: '',
      deadline: '',
      status: 'Pending'
    })
  }

  // Delete Task
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter(
      (_, i) => i !== index
    )

    setTasks(updatedTasks)
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-600 to-black text-white p-10">

      {/* Heading */}

      <div className="text-center mb-10">

        <h1 className="text-4xl font-bold">
          Task Manager
        </h1>

        <p className="text-gray-400 mt-2">
          Manage your academic tasks and reminders
        </p>

      </div>

      {/* Form */}

      <div className="max-w-3xl mx-auto bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Task Title */}

          <div>

            <label className="block mb-2 text-lg">
              Task Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="Enter task title"
              value={task.title}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            />

          </div>

          {/* Subject */}

          <div>

            <label className="block mb-2 text-lg">
              Subject
            </label>

            <input
              type="text"
              name="subject"
              placeholder="Enter subject"
              value={task.subject}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            />

          </div>

          {/* Deadline */}

          <div>

            <label className="block mb-2 text-lg">
              Deadline
            </label>

            <input
              type="date"
              name="deadline"
              value={task.deadline}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            />

          </div>

          {/* Status */}

          <div>

            <label className="block mb-2 text-lg">
              Status
            </label>

            <select
              name="status"
              value={task.status}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            >

              <option>Pending</option>
              <option>Completed</option>

            </select>

          </div>

          {/* Button */}

          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300"
          >
            Add Task
          </button>

        </form>

      </div>

      {/* Task List */}

      <div className="max-w-5xl mx-auto mt-14">

        <h2 className="text-3xl font-bold mb-6">
          Task List
        </h2>

        <div className="grid gap-6">

          {tasks.length === 0 ? (

            <div className="bg-gray-800 p-6 rounded-2xl text-center text-gray-400 border border-gray-700">
              No tasks added yet
            </div>

          ) : (

            tasks.map((item, index) => (

              <div
                key={index}
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
                      item.status === 'Completed'
                        ? 'text-green-400'
                        : 'text-yellow-400'
                    }`}
                  >
                    {item.status}
                  </p>

                </div>

                {/* Delete Button */}

                <button
                  onClick={() => deleteTask(index)}
                  className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl transition-all duration-300"
                >
                  Delete
                </button>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  )
}

export default TaskManager