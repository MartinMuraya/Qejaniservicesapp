import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    const res = await register(name, email, password)
    if (res.success) {
      toast.success('Account created! Welcome to Qejani')
      navigate('/dashboard')
    } else {
      toast.error(res.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full">
        <h2 className="text-4xl font-bold text-center mb-8 text-primary">Create Account</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-4 rounded-lg font-bold hover:bg-accent transition disabled:opacity-70"
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600">
          Already have an account? <a href="/login" className="text-primary font-bold hover:underline">Login here</a>
        </p>
      </div>
    </div>
  )
}