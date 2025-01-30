import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes ,  Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import HomePage from './components/HomePage'
import SignUp from './components/SignUp'
import SettingsPage from './components/SettingsPage'
import ProfilePage from './components/ProfilePage'
import { useAuthStore } from './store/useAuthStore.js'
import { useThemeStore } from './store/useThemeStore.js'
import {Loader} from "lucide-react"
import { Toaster } from 'react-hot-toast'

const App = () => {
  const {authUser , checkAuth , isCheckingAuth , onlineUsers} = useAuthStore()
  const {theme} = useThemeStore()

  console.log({onlineUsers})

  useEffect(()=>{
    checkAuth()
  } , [checkAuth])

  // console.log({authUser})

  if(isCheckingAuth && ! authUser) return (
    <div className="flex justify-center items-center h-screen">
      <Loader className = "size-10 animate-spin" />
    </div>
     
  )



  return (
    <div data-theme = {theme} >
      <Navbar  />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to ="/login"  />} />
        <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to ="/"  />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to ="/"  />} />
        <Route path="/settings" element={ <SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        

      </Routes>

    <Toaster/>
    </div>
  )
}

export default App
