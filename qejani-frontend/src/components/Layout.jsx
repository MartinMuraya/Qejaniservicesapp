import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Layout({ children }) {
  const { user, logout } = useAuthStore()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-2xl font-bold">Q</span>
                </div>
                <span className="text-3xl font-bold text-green-800">Qejani Services</span>
              </Link>
            </div>

            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-green-600 font-medium text-lg">
                Home
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-green-600 font-medium text-lg">
                    Dashboard
                  </Link>
                  <span className="text-gray-700 font-medium">
                    Hello, {user.name || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-green-600 font-medium text-lg">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-2xl font-bold">Q</span>
            </div>
            <span className="text-3xl font-bold">Qejani Services</span>
          </div>
          <p className="text-lg mb-4">Kenya's #1 Home Services Marketplace</p>
          <p className="text-gray-400">© 2025 Qejani Services. All rights reserved.</p>
          <div className="mt-6">
            <Link to="/" className="text-gray-400 hover:text-white mx-4">Home</Link>
            <Link to="/about" className="text-gray-400 hover:text-white mx-4">About</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white mx-4">Contact</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white mx-4">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}