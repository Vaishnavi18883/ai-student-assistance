import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col justify-center items-center px-10">

      {/* Heading */}

      <h1 className="text-6xl font-bold text-center mb-6">
        AI Student Assistant
      </h1>

      <p className="text-gray-400 text-xl text-center max-w-3xl mb-10">
        Smart platform for learners to manage tasks,
        interact with AI, track reports and organize
        academic activities efficiently.
      </p>

      {/* Buttons */}

      <div className="flex gap-6">

        <Link to="/register">

          <button className="bg-white text-black px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-200 transition-all duration-300">
            Get Started
          </button>

        </Link>

        <Link to="/login">

          <button className="border border-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white hover:text-black transition-all duration-300">
            Login
          </button>

        </Link>

      </div>

    </div>
  )
}

export default Home