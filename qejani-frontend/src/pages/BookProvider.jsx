import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

export default function BookProvider() {
  const { providerId } = useParams()
  const { user } = useAuthStore()
  const [phone, setPhone] = useState(user?.phone || '')
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    if (!phone) return toast.error('Enter phone number')
    setLoading(true)
    try {
      // First create order
      const orderRes = await api.createOrder({ providerId, serviceId: 'dummy' }) // adjust if needed

      // Then trigger STK Push
      const res = await api.stkPush(phone, orderRes.data.order.price || 500, providerId)
      toast.success(res.data.message || 'Check your phone for M-Pesa prompt!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Complete Payment</h1>
      <div className="mb-6">
        <label className="block text-lg mb-2">Phone Number</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="254712345678"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary"
        />
      </div>
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay with M-Pesa'}
      </button>
    </div>
  )
}