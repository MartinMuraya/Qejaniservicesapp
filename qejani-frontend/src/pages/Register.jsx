import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('user')
  const { register, googleLogin, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState('')

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.getServices()
        setServices(res.data)
      } catch (err) {
        console.error('Failed to fetch services')
      }
    }
    fetchServices()
  }, [])

  const [phone, setPhone] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (role === 'provider') {
      if (!selectedService) return toast.error('Please select a service')
      if (!phone) return toast.error('Phone number is required for providers')
    }

    const res = await register(name, email, password, role, selectedService, phone)
    if (res.success) {
      if (role === 'provider') {
        toast.success('Registration successful! Please wait for admin approval.')
        navigate('/login')
      } else {
        toast.success('Account created! Welcome to Qejani')
        navigate('/dashboard')
      }
    } else {
      toast.error(res.message || 'Registration failed')
    }
  }

  const handleGoogleRegister = async () => {
    const res = await googleLogin({
      credential: 'demo-google-token',
      email: email || 'user@example.com',
      name: name || 'Google User'
    })
    if (res.success) {
      toast.success('Google Registration successful!')
      navigate('/dashboard')
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 max-w-md w-full border border-gray-100">
        <h2 className="text-5xl font-bold text-center mb-10 text-primary">Create Account</h2>

        <div className="flex gap-4 p-1 bg-gray-100 rounded-2xl mb-8">
          <button
            type="button"
            onClick={() => setRole('user')}
            className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition ${role === 'user' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('provider')}
            className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition ${role === 'provider' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}
          >
            Provider
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Your Full Name"
              className="w-full px-6 py-4 border-2 border-gray-100 bg-gray-50 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-6 py-4 border-2 border-gray-100 bg-gray-50 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition font-medium"
              required
            />
          </div>

          {role === 'provider' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 text-green-600">Service Category</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-green-200 bg-green-50/30 rounded-xl focus:outline-none focus:border-green-500 transition font-bold text-gray-700"
                  required
                >
                  <option value="">Select your specialty...</option>
                  {services.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 text-green-600">Business Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="2547XXXXXXXX"
                  className="w-full px-6 py-4 border-2 border-green-200 bg-green-50/30 rounded-xl focus:outline-none focus:border-green-500 transition font-bold text-gray-700"
                  required
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 border-2 border-gray-100 bg-gray-50 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Verify</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 border-2 border-gray-100 bg-gray-50 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-5 rounded-xl font-bold text-xl hover:bg-green-700 transition disabled:opacity-70 shadow-lg"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-primary font-bold hover:underline text-lg">
            Login here
          </a>
        </p>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm uppercase"><span className="bg-white px-4 text-gray-400 font-bold tracking-widest">Or register with</span></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-4 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm hover:shadow-md"
          >
            <svg className="w-6 h-6" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            <span className="text-lg">Google Account</span>
          </button>
        </div>
      </div>
    </div>
  )
}
