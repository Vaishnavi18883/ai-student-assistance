import React from 'react'
import Homepage from './Home'
import RegisterPage from './Registration'
import LoginPage from './Login'
import Dashboard from './Dashboard'
import TaskManager from './Taskmanager'
import AIChat from './Aichat'
import LearnerProfile from './LearnerProfile' 
import Reports from './Reports'
import StudyMaterials from './StudyMaterials'
import AdminDashboard from './admin/AdminDashboard'
import AdminStudents from './admin/AdminStudents'
import AdminTasks from './admin/AdminTasks'
import AdminProtectedRoute from './admin/AdminProtectedRoute'
import { Route, Routes, Navigate } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/taskmanager' element={<TaskManager/>} />
        <Route path='/aichat' element={<AIChat/>} />
        <Route path='/learnerprofile' element={<LearnerProfile/>} />
        <Route path='/studyMaterials' element={<StudyMaterials/>} />
        <Route path='/studentreport' element={<Reports/>} />

        {/* Admin Routes — /admin/login just redirects to the unified login */}
        <Route path='/admin/login' element={<Navigate to="/login" replace />} />
        <Route path='/admin/dashboard' element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path='/admin/students' element={<AdminProtectedRoute><AdminStudents /></AdminProtectedRoute>} />
        <Route path='/admin/tasks' element={<AdminProtectedRoute><AdminTasks /></AdminProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App