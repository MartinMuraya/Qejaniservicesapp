import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Auth Pages
import AdminLogin from "./pages/AdminLogin";
import ProviderLogin from "./pages/ProviderLogin";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";

import Services from "./pages/Services";
import ServiceProviders from "./pages/ServiceProviders";

// Dashboards
function AdminDashboard() {
  return <div className="p-6 text-2xl font-bold">Admin Dashboard</div>;
}

function ProviderDashboard() {
  return <div className="p-6 text-2xl font-bold">Provider Dashboard</div>;
}

function UserDashboard() {
  return <div className="p-6 text-2xl font-bold">User Dashboard</div>;
}

// Service Booking Page
import BookService from "./pages/BookService";

// Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Redirect root → user login */}
          <Route path="/" element={<Navigate to="/login/user" replace />} />

          {/* Auth Routes */}
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/login/provider" element={<ProviderLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />

          {/* Dashboards */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/provider"
            element={
              <ProtectedRoute role="provider">
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* services */}
          <Route
  path="/dashboard/user/services"
  element={
    <ProtectedRoute role="user">
      <Services />
    </ProtectedRoute>
  }
/>

       <Route
  path="/services/:serviceId/providers"
  element={
    <ProtectedRoute role="user">
      <ServiceProviders />
    </ProtectedRoute>
  }
  />

          {/* Service Booking */}
          <Route
            path="/dashboard/user/book"
            element={
              <ProtectedRoute role="user">
                <BookService />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<div className="p-6 text-xl">Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}
