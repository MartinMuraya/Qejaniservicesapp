import { create } from 'zustand'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

axios.defaults.withCredentials = true

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password })
      localStorage.setItem('token', res.data.token)
      set({ user: res.data, token: res.data.token })
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' }
    } finally {
      set({ isLoading: false })
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true })
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password })
      localStorage.setItem('token', res.data.token)
      set({ user: res.data, token: res.data.token })
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' }
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },

  setToken: (token) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}))

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})