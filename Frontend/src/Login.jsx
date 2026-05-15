import React, { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

const LoginPage = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState({
    text: "",
    type: ""
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle Submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password) {
      setMessage({
        text: 'All fields are required!',
        type: 'error'
      });
      return;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setMessage({
        text: 'Invalid email format',
        type: 'error'
      });
      return;
    }

    // Password Validation
    if (formData.password.length < 6) {
      setMessage({
        text: 'Password must be at least 6 characters',
        type: 'error'
      });
      return;
    }

    try {

      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData
      );

      setMessage({
        text: 'Login Successful!',
        type: 'success'
      });

      // Store Token
      localStorage.setItem('token', res.data.token);

      // Redirect
      navigate('/dashboard');

    } catch (error) {

      setMessage({
        text: error.response?.data?.message || 'Login Failed',
        type: 'error'
      });

    }
  };

  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="w-[90%] md:w-[35vw] bg-gray-200 rounded-xl shadow-xl p-8 flex flex-col items-center">

        <h2 className="text-3xl font-bold mb-2">
          AI Student Assistant
        </h2>

        <h3 className="text-xl mb-6">
          Login
        </h3>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-11 mb-4 px-4 rounded-md border border-gray-300 
            transition duration-300 ease-in-out hover:scale-105 
            hover:border-black outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full h-11 mb-4 px-4 rounded-md border border-gray-300 
            transition duration-300 ease-in-out hover:scale-105 
            hover:border-black outline-none"
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full h-11 bg-gray-800 text-white rounded-md"
             onClick={() => navigate('/dashboard')}
          >
            Login
          </motion.button>

          <p
            className={`mt-4 font-medium ${
              message.type === 'error'
                ? 'text-red-500'
                : 'text-green-600'
            }`}
          >
            {message.text}
          </p>

        </form>

        <p className="mt-4">
          Don't have an account?
          <Link to="/register">
            <span className="text-blue-600 font-semibold cursor-pointer">
              {" "}Register
            </span>
          </Link>
        </p>

      </div>

    </div>
  )
}

export default LoginPage;