import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './Pages/Home'
import Navbar from './components/Navbar'
import Notifications from './components/Notifications'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import Login from './Pages/Login'
import Register from './Pages/Register'
import CreateEvent from './Pages/CreateEvent'
import EventDashboard from './Pages/EventDashboard'
import EventDetails from './Pages/EventDetails'
import EditEvent from './Pages/EditEvent'

const App = () => {

  const {isCheckingAuth,authUser,checkAuth} = useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  if (isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme="autumn">
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!authUser ? <Login/> : <Home />} />
          <Route path="/register" element= {!authUser ? <Register/> : <Home />} />
          <Route path="/createevent" element={authUser? <CreateEvent/> : <Login/>} />
          <Route path="/dashboard" element={authUser? <EventDashboard/> : <Login/>} />
          <Route path="/events/:id" element={authUser? <EventDetails/> : <Login/>} />
          <Route path="/updateevent/:id" element={authUser? <EditEvent/> : <Login/>} />
        </Routes>
      </Router>
      <Notifications/>
    </div>
  )
}

export default App