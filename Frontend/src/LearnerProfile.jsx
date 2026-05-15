import React, { useState } from 'react'
import axios from 'axios'

const LearnerProfile = () => {

  const [learner, setLearner] = useState({
    name: '',
    rollNo: '',
    email: '',
    password: '',
    course: ''
  })

  // Handle Change

  const handleChange = (e) => {

    setLearner({
      ...learner,
      [e.target.name]: e.target.value
    })

  }

  // Handle Submit

  const handleSubmit = async(e) => {

    e.preventDefault()

    console.log(learner)

    alert("Learner Profile Saved Successfully")
    try {

  const res = await axios.post(
    "http://localhost:5000/api/learner/add",
    learner
  )

  console.log(res.data)

  alert("Learner Profile Saved Successfully")

  setLearner({
    name: '',
    rollNo: '',
    email: '',
    password: '',
    course: ''
  })

} catch (error) {

  console.log(error)

  alert("Something went wrong")

}

    // Reset Form

    setLearner({
      name: '',
      rollNo: '',
      email: '',
      password: '',
      course: ''
    })

  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-10">

      {/* Heading */}

      <div className="text-center mb-10">

        <h1 className="text-5xl font-bold">
          Learner Profile
        </h1>

        <p className="text-gray-400 mt-3 text-lg">
          Manage learner academic information
        </p>

      </div>

      {/* Form Container */}

      <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-3xl p-10 shadow-2xl">

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          {/* Name */}

          <div>

            <label className="block mb-2 text-lg">
              Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter learner name"
              value={learner.name}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            />

          </div>

          {/* Roll Number */}

          <div>

            <label className="block mb-2 text-lg">
              Roll Number
            </label>

            <input
              type="text"
              name="rollNo"
              placeholder="Enter roll number"
              value={learner.rollNo}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            />

          </div>

          {/* Email */}

          <div>

            <label className="block mb-2 text-lg">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={learner.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            />

          </div>

          {/* Password */}

          <div>

            <label className="block mb-2 text-lg">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={learner.password}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            />

          </div>

          {/* Course */}

          <div className="md:col-span-2">

            <label className="block mb-2 text-lg">
              Course
            </label>

            <input
              type="text"
              name="course"
              placeholder="Enter course"
              value={learner.course}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            />

          </div>

          {/* Submit Button */}

          <button
            type="submit"
            className="md:col-span-2 bg-white text-black py-4 rounded-2xl text-lg font-semibold hover:bg-gray-200 transition-all duration-300"
          >
            Save Learner Profile
          </button>

        </form>

      </div>

    </div>
  )
}

export default LearnerProfile