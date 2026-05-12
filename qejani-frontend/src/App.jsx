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
import Favorites from "./pages/Favorites";
import ProviderProfile from "./pages/ProviderProfile";
import ChatWindow from "./pages/ChatWindow";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminVerification from "./pages/AdminVerification";
import AdminSafety from "./pages/AdminSafety";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Settings from "./pages/Settings";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import OrderSuccess from "./pages/OrderSuccess";
import Services from "./pages/Services";


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
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/provider/:id" element={<ProviderProfile />} />
          <Route
            path="/chat/:conversationId"
            element={
              <PrivateRoute>
                <ChatWindow />
              </PrivateRoute>
            }
          />
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

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

          <Route
            path="/admin/verifications"
            element={
              <PrivateRoute>
                <AdminVerification />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/safety"
            element={
              <PrivateRoute>
                <AdminSafety />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <PrivateRoute>
                <AdminAnalytics />
              </PrivateRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <PrivateRoute>
                <OrderSuccess />
              </PrivateRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <Favorites />
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
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
