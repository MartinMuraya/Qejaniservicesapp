import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ServiceDetail from './pages/ServiceDetail'
import BookProvider from './pages/BookProvider'
import UserDashboard from './pages/UserDashboard'
import ProviderDashboard from './pages/ProviderDashboard'
import AdminDashboard from './pages/AdminDashboard'

function PrivateRoute({ children }) {
  const { user } = useAuthStore()
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <div class="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/book/:providerId" element={<BookProvider />} />
          <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
          <Route path="/provider-dashboard" element={<PrivateRoute><ProviderDashboard /></PrivateRoute>} />
          <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App