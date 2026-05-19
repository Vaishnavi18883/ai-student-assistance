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

  const inputClasses = "w-full p-3 rounded-lg bg-sky-100 border border-sky-200 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all text-slate-700";
  const labelClasses = "block mb-1.5 text-sm font-medium text-slate-600";

  return (
    <div className="font-sans min-h-screen bg-app-gradient text-slate-900 py-12 px-4 sm:px-6">

      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-800">Learner Profile</h1>
        <p className="text-slate-500 mt-2 text-base">Manage your academic information seamlessly</p>
      </div>

      <div className="max-w-4xl mx-auto bg-white border border-sky-100 rounded-2xl p-8 sm:p-10 shadow-lg shadow-sky-100/50">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

          {/* Name */}
          <div>
            <label className={labelClasses}>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter learner name"
              value={learner.name}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          {/* Roll Number */}
          <div>
            <label className={labelClasses}>Roll Number</label>
            <input
              type="text"
              name="rollNo"
              placeholder="Enter roll number"
              value={learner.rollNo}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelClasses}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={learner.email}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          {/* Course */}
          <div>
            <label className={labelClasses}>Course</label>
            <input
              type="text"
              name="course"
              placeholder="Enter course"
              value={learner.course}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          {/* Department */}
          <div>
            <label className={labelClasses}>Department</label>
            <input
              type="text"
              name="department"
              placeholder="Enter department"
              value={learner.department}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          {/* Semester */}
          <div>
            <label className={labelClasses}>Semester</label>
            <input
              type="text"
              name="semester"
              placeholder="Enter semester"
              value={learner.semester}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          {/* Phone */}
          <div className="md:col-span-2">
            <label className={labelClasses}>Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={learner.phone}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="md:col-span-2 mt-4 bg-sky-600 text-white py-3.5 rounded-xl text-base font-semibold hover:bg-sky-700 active:scale-[0.98] transition-all shadow-md hover:shadow-lg"
          >
            Save Learner Profile
          </button>

        </form>
      </div>
    </div>
  )
}

export default LearnerProfile