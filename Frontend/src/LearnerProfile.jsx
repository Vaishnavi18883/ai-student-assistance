import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useUser } from './context/UserContext'

const LearnerProfile = () => {

  const { user } = useUser()

  const [learner, setLearner] = useState({
    learnerId: user?.id || '',
    name: user?.username || '',     
    email: user?.email || '',       
    rollNo: user?.studentId || '',  
    course: '',
    department: '',
    semester: '',
    phone: ''
  })

  useEffect(() => {
    // If user has an ID, try to fetch their existing profile
    if (user?.id) {
      const fetchProfile = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/learner/${user.id}`);
          if (res.data) {
            setLearner({
              learnerId: user.id,
              name: res.data.name || user.username || '',
              email: res.data.email || user.email || '',
              rollNo: res.data.rollNo || user.studentId || '',
              course: res.data.course || '',
              department: res.data.department || '',
              semester: res.data.semester || '',
              phone: res.data.phone || ''
            });
          }
        } catch (error) {
          console.log("No existing profile found or error fetching", error);
        }
      };
      fetchProfile();
    }
  }, [user]);

  // Update learnerId if user context loads later
  useEffect(() => {
    if (user?.id && !learner.learnerId) {
      setLearner(prev => ({
        ...prev,
        learnerId: user.id,
        name: prev.name || user.username || '',
        email: prev.email || user.email || '',
        rollNo: prev.rollNo || user.studentId || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setLearner({
      ...learner,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !learner.name ||
      !learner.rollNo ||
      !learner.course ||
      !learner.department ||
      !learner.semester ||
      !learner.phone
    ) {
      alert("Please fill all fields")
      return
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/learner/add",  
        learner
      )
      console.log(res.data)
      alert(res.data.message || "Learner Profile Saved Successfully")

    } catch (error) {
      console.log(error)
      alert(error.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-10">

      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold">Learner Profile</h1>
        <p className="text-gray-400 mt-3 text-lg">Manage learner academic information</p>
      </div>

      <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-3xl p-10 shadow-2xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <label className="block mb-2 text-lg">Name</label>
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
            <label className="block mb-2 text-lg">Roll Number</label>
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
            <label className="block mb-2 text-lg">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={learner.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            />
          </div>

          {/* Course */}
          <div>
            <label className="block mb-2 text-lg">Course</label>
            <input
              type="text"
              name="course"
              placeholder="Enter course"
              value={learner.course}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block mb-2 text-lg">Department</label>
            <input
              type="text"
              name="department"
              placeholder="Enter department"
              value={learner.department}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block mb-2 text-lg">Semester</label>
            <input
              type="text"
              name="semester"
              placeholder="Enter semester"
              value={learner.semester}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            />
          </div>

          {/* Phone */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-lg">Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={learner.phone}
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