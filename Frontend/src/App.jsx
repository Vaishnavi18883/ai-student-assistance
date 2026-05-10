import React from 'react'
import RegisterPage from './Registration'
import LoginPage from './Login'
import Dashboard from './Dashboard'
import TaskManager from './Taskmanager'
import AIChat from './Aichat'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <div>
  <Routes>

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path='/dashboard' element = {<Dashboard/>}></Route>
        <Route path='/taskmanager' element = {<TaskManager/>}></Route>
        <Route path='/aichat' element = {<AIChat/>}></Route>

      </Routes>
    </div>
  )
}

export default App