import { create } from 'zustand'
import axios from 'axios'

const API_URL = 'http://localhost:5001/api'
axios.defaults.withCredentials = true

// Safely hydrate user from localStorage
let storedUser = null
try {
  const userString = localStorage.getItem('user')
  if (userString && userString !== 'undefined') {
    storedUser = JSON.parse(userString)
  }
} catch (err) {
  console.warn('Failed to parse stored user:', err)
}

const storedToken = localStorage.getItem('token')
if (storedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
}

export const useAuthStore = create((set) => ({
  user: storedUser,
  token: storedToken || null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data))
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
      set({ user: res.data, token: res.data.token })
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' }
    } finally {
      set({ isLoading: false })
    }
  },

  register: async (name, email, password, role = 'user', serviceId = null, phone = null) => {
    set({ isLoading: true })
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        role,
        serviceId, // New field for providers
        phone
      })
      if (role === 'provider') {
        set({ isLoading: false })
        return { success: true }
      }
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data))
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
      set({ user: res.data, token: res.data.token })
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' }
    } finally {
      set({ isLoading: false })
    }
  },

  googleLogin: async (data) => {
    set({ isLoading: true })
    try {
      const res = await axios.post(`${API_URL}/auth/google`, data)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data))
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
      set({ user: res.data, token: res.data.token })
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Google login failed' }
    } finally {
      set({ isLoading: false })
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true })
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email })
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Request failed' }
    } finally {
      set({ isLoading: false })
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true })
    try {
      const res = await axios.put(`${API_URL}/auth/reset-password/${token}`, { password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data))
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
      // Fetch user profile after reset to ensure state is correct
      const profile = await axios.get(`${API_URL}/auth/me`)
      set({ user: profile.data, token: res.data.token })
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Reset failed' }
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
    delete axios.defaults.headers.common['Authorization']
  },
}))
