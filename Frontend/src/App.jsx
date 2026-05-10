import React from 'react'
import RegisterPage from './Registration'
import LoginPage from './Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <div>
  <Routes>

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/login" element={<LoginPage />} />

      </Routes>
    </div>
  )
}

export default App