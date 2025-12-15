import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ServiceDetail from './pages/ServiceDetail'
import BookProvider from './pages/BookProvider'
import UserDashboard from './pages/UserDashboard'
import ProviderDashboard from './pages/ProviderDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminWithdrawals from "./pages/AdminWithdrawals"; 
import PrivateRoute from "./components/PrivateRoute";

// Role-based dashboard redirect
function DashboardRedirect() {
  const { user } = useAuthStore()

  if (!user) return <Navigate to="/login" replace />

  if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />
  if (user.role === 'provider') return <Navigate to="/provider-dashboard" replace />
  
  return <UserDashboard />
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route 
            path="/book/:providerId" 
              element={
              <PrivateRoute>
               <BookProvider />
              </PrivateRoute>
            } 
          />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardRedirect />
            </PrivateRoute>
          } />

          <Route path="/provider-dashboard" element={
            <PrivateRoute>
              <ProviderDashboard />
            </PrivateRoute>
          } />

          <Route path="/admin-dashboard" element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } />
           
          <Route
            path="/admin/withdrawals"
               element={
            <PrivateRoute>
              <AdminWithdrawals />
            </PrivateRoute>
            }
          />
          
          {/* Catch all — redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App