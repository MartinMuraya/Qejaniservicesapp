import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import NotificationDropdown from './NotificationDropdown'

export default function Layout({ children }) {
  const { user, logout } = useAuthStore()
  const { itemCount, fetchCart } = useCartStore()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (user) {
      fetchCart()
    }
  }, [user])

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const adminLinks = [
    { name: 'Analytics', path: '/admin/analytics' },
    { name: 'Verifications', path: '/admin/verifications' },
    { name: 'Safety', path: '/admin/safety' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                <div className="bg-green-600 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-3 md:mr-4">
                  <span className="text-white text-xl md:text-2xl font-bold">Q</span>
                </div>
                <span className="text-2xl md:text-3xl font-bold text-green-800">Qejani</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-medium text-lg transition-colors ${location.pathname === link.path ? 'text-blue-600' : 'text-gray-700 hover:text-green-600'
                    }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`relative font-medium text-lg transition-colors ${location.pathname.includes('/dashboard') ? 'text-blue-600' : 'text-gray-700 hover:text-green-600'
                      }`}
                  >
                    Dashboard
                    {location.pathname.includes('/dashboard') && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                    )}
                  </Link>

                  {user.role === 'admin' && (
                    <div className="flex items-center space-x-6 border-l pl-6 border-gray-100">
                      {adminLinks.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`relative text-sm font-black uppercase tracking-wider transition-colors ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-400 hover:text-black'
                            }`}
                        >
                          {item.name}
                          {location.pathname === item.path && (
                            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}

                  <Link to="/cart" className="relative p-2 text-gray-600 hover:text-green-600 transition">
                    <ShoppingCartIcon className="w-7 h-7" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">
                        {itemCount}
                      </span>
                    )}
                  </Link>

                  <NotificationDropdown />
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-red-700 shadow-lg shadow-red-100 transition active:scale-95"
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-gray-700 hover:text-green-600 font-bold text-lg">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-green-700 shadow-xl shadow-green-100 transition active:scale-95"
                  >
                    REGISTER
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              {user && (
                <Link to="/cart" className="relative p-2 text-gray-600">
                  <ShoppingCartIcon className="w-6 h-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-white">
                      {itemCount}
                    </span>
                  )}
                </Link>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-green-600 p-2 focus:outline-none"
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen border-t' : 'max-h-0'}`}>
          <div className="px-4 py-6 space-y-4 bg-white shadow-inner">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block text-xl font-bold transition-colors ${location.pathname === link.path ? 'text-blue-600' : 'text-gray-700'}`}
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="pt-4 space-y-4 border-t border-gray-100">
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-xl font-bold ${location.pathname.includes('/dashboard') ? 'text-blue-600' : 'text-gray-700'}`}
                >
                  Dashboard
                </Link>

                {user.role === 'admin' && (
                  <div className="pl-4 space-y-3 border-l-2 border-gray-100">
                    {adminLinks.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block text-lg font-bold uppercase tracking-wider ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-400'}`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <NotificationDropdown />
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-8 py-3 rounded-xl font-black text-sm w-full hover:bg-red-700"
                  >
                    LOGOUT
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 flex flex-col gap-4">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center text-gray-700 font-bold text-xl py-3 border border-gray-200 rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-green-600 text-white text-center py-4 rounded-xl font-black text-sm"
                >
                  REGISTER
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center mb-6">
                <div className="bg-green-600 w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-green-900/20">
                  <span className="text-white text-2xl font-black">Q</span>
                </div>
                <span className="text-3xl font-black tracking-tighter">Qejani Services</span>
              </div>
              <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-sm">
                Kenya's most trusted home services marketplace. Vetted pros, upfront pricing, and 100% safety guarantee.
              </p>
            </div>

            <div>
              <h4 className="font-black uppercase tracking-widest text-sm mb-6 text-gray-500">Company</h4>
              <div className="flex flex-col space-y-4 font-bold">
                <Link to="/" className="hover:text-green-500 transition">Browser Services</Link>
                <Link to="/about" className="hover:text-green-500 transition">Our Story</Link>
                <Link to="/contact" className="hover:text-green-500 transition">Contact Us</Link>
                <Link to="/register" className="hover:text-green-500 transition">Become a Pro</Link>
              </div>
            </div>

            <div>
              <h4 className="font-black uppercase tracking-widest text-sm mb-6 text-gray-500">Support</h4>
              <div className="flex flex-col space-y-4 font-bold">
                <Link to="/help" className="hover:text-green-500 transition">Help Center</Link>
                <Link to="/safety" className="hover:text-green-500 transition">Safety Policy</Link>
                <Link to="/privacy" className="hover:text-green-500 transition">Privacy Terms</Link>
                <Link to="/emergency" className="hover:text-green-500 transition">Emergency SOS</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 font-medium">
            <p>© 2025 Qejani Services. Dedicated to quality living.</p>
            <div className="flex gap-6">
              <a href="https://www.facebook.com/" className="hover:text-white transition">Facebook</a>
              <a href="https://www.instagram.com/" className="hover:text-white transition">Instagram</a>
              <a href="#" className="hover:text-white transition">X (Twitter)</a>
              <a href="https://www.linkedin.com/feed/" className="hover:text-white transition">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
