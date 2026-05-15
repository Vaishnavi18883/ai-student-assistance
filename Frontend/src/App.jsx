import React from 'react'
import Homepage from './Home'
import RegisterPage from './Registration'
import LoginPage from './Login'
import Dashboard from './Dashboard'
import TaskManager from './Taskmanager'
import AIChat from './Aichat'
import LearnerProfile from './LearnerProfile' 
import Reports from './Reports'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <div>
  <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path='/dashboard' element = {<Dashboard/>}></Route>
        <Route path='/taskmanager' element = {<TaskManager/>}></Route>
        <Route path='/aichat' element = {<AIChat/>}></Route>
        <Route path='/learnerprofile' element = {<LearnerProfile/>}></Route>
        <Route path='/studentreport' element = {<Reports/>}></Route>

      </Routes>
    </div>
  )
}

export default App