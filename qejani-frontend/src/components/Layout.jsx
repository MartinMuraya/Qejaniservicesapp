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
                  {/* Dashboard link */}
                  <Link to="/dashboard" className="text-gray-700 hover:text-green-600 font-medium text-lg">
                    Dashboard
                  </Link>

                  {/* Admin-specific link */}
                  {user.role === 'admin' && (
                    <Link to="/admin/withdrawals" className="text-gray-700 hover:text-green-600 font-medium text-lg">
                      Withdrawals
                    </Link>
                  )}

                  {/* Provider-specific link (optional) */}
                  {user.role === 'provider' && (
                    <Link to="/provider-dashboard" className="text-gray-700 hover:text-green-600 font-medium text-lg">
                      My Services
                    </Link>
                  )}

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
    <p className="text-gray-400 mb-6">© 2025 Qejani Services. All rights reserved.</p>

    {/* Social Media Icons */}
    <div className="flex justify-center space-x-6 mb-6">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54v-2.892h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.465h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.892h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
        </svg>
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.162 5.656c-.793.352-1.644.588-2.538.696a4.472 4.472 0 001.962-2.462 8.944 8.944 0 01-2.828 1.082 4.468 4.468 0 00-7.616 4.073A12.684 12.684 0 013 4.794a4.468 4.468 0 001.382 5.957 4.448 4.448 0 01-2.024-.559v.056a4.468 4.468 0 003.584 4.377 4.487 4.487 0 01-2.018.077 4.47 4.47 0 004.171 3.106A8.953 8.953 0 012 19.54 12.617 12.617 0 008.29 21c7.547 0 11.675-6.254 11.675-11.675 0-.178-.004-.355-.012-.532a8.344 8.344 0 002.039-2.127z" />
        </svg>
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.31.975.975 1.248 2.243 1.31 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.31 3.608-.975.975-2.243 1.248-3.608 1.31-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.31-.975-.975-1.248-2.243-1.31-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.336-2.633 1.31-3.608.975-.975 2.243-1.248 3.608-1.31C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.77.131 4.644.422 3.678 1.388 2.713 2.354 2.422 3.48 2.363 4.762.013 8.332 0 8.741 0 12s.013 3.668.072 4.948c.059 1.282.35 2.408 1.316 3.374.966.966 2.092 1.257 3.374 1.316C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.282-.059 2.408-.35 3.374-1.316.966-.966 1.257-2.092 1.316-3.374.059-1.28.072-1.689.072-4.948s-.013-3.668-.072-4.948c-.059-1.282-.35-2.408-1.316-3.374-.966-.966-2.092-1.257-3.374-1.316C15.668.013 15.259 0 12 0z" />
          <path d="M12 5.838A6.162 6.162 0 105.838 12 6.169 6.169 0 0012 5.838zm0 10.164A3.996 3.996 0 118 12a3.996 3.996 0 014 4z" />
          <circle cx="18.406" cy="5.594" r="1.44" />
        </svg>
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.026-3.036-1.849-3.036-1.85 0-2.133 1.445-2.133 2.937v5.668H9.356V9h3.414v1.561h.049c.476-.9 1.637-1.849 3.37-1.849 3.602 0 4.268 2.372 4.268 5.456v6.284zM5.337 7.433a2.062 2.062 0 11.001-4.125 2.062 2.062 0 01-.001 4.125zM7.119 20.452H3.554V9h3.565v11.452z" />
        </svg>
      </a>
    </div>

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
