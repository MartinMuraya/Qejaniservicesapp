// src/pages/BookProvider.jsx
import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'

// Connect to backend socket
const socket = io('http://localhost:5000') // adjust

export default function BookProvider() {
  const { providerId } = useParams()
  const [provider, setProvider] = useState(null)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [payLoading, setPayLoading] = useState(false)
  const [finishLoading, setFinishLoading] = useState(false)
  const [payment, setPayment] = useState(null)

  const token = localStorage.getItem('token')
  if (!token) {
    toast.error('You must be logged in to book a service!')
    return <Navigate to="/login" replace />
  }

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/providers/${providerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed to fetch provider')
        setProvider(data)
      } catch (err) {
        console.error(err)
        toast.error(err.message || 'Failed to load provider')
      } finally {
        setLoading(false)
      }
    }
    fetchProvider()
  }, [providerId, token])

  useEffect(() => {
    // Listen for provider wallet updates in real-time
    socket.on('provider', (updatedProvider) => {
      if (updatedProvider._id === providerId) setProvider(updatedProvider)
    })

    // Listen for dashboard/payment updates
    socket.on('dashboardUpdate', (data) => {
      if (data.type === 'paymentCompleted' && payment && data.payment._id === payment.paymentId) {
        toast.success('Payment released to provider successfully (real-time)!')
        setPayment(null) // reset payment state
      }
    })

    return () => {
      socket.off('provider')
      socket.off('dashboardUpdate')
    }
  }, [providerId, payment])

  const handlePay = async () => {
    if (!phone) return toast.error('Enter your phone number')
    if (!/^2547\d{8}$/.test(phone)) return toast.error('Use format 2547XXXXXXXX')

    setPayLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/api/mpesa/stkpush?providerId=${providerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phone, amount: provider.price })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success(data.message || 'Check your phone for M-Pesa prompt!')
        setPayment({ paymentId: data.data.CheckoutRequestID }) // store payment ID for finish
      } else {
        toast.error(data.message || 'Payment request failed')
      }
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Something went wrong')
    } finally {
      setPayLoading(false)
    }
  }

  const handleFinishService = async () => {
    if (!payment || !payment.paymentId) return toast.error('No payment to finish')
    setFinishLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/mpesa/finish-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentId: payment.paymentId })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success('Payment released to provider successfully!')
        setPayment(null)
      } else {
        toast.error(data.message || 'Failed to finish payment')
      }
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Something went wrong')
    } finally {
      setFinishLoading(false)
    }
  }

  if (loading) return <div className="text-center py-20">Loading provider...</div>
  if (!provider) return <div className="text-center py-20">Provider not found</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-green-800">Book Service</h1>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">{provider.name}</h2>
          <p className="text-xl text-gray-600 mt-2">{provider.service.name}</p>
          <p className="text-4xl font-bold text-green-600 mt-6">
            KSh {provider.price.toLocaleString()}
          </p>
        </div>

        {!payment && (
          <>
            <div className="mb-8">
              <label className="block text-lg font-medium mb-3">Your M-Pesa Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="254712345678"
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:outline-none text-lg"
              />
            </div>

            <button
              onClick={handlePay}
              disabled={payLoading}
              className="w-full bg-green-600 text-white py-5 rounded-xl font-bold text-xl hover:bg-green-700 transition disabled:opacity-70"
            >
              {payLoading ? 'Processing...' : 'Pay with M-Pesa'}
            </button>
          </>
        )}

        {payment && (
          <button
            onClick={handleFinishService}
            disabled={finishLoading}
            className="w-full bg-blue-600 text-white py-5 rounded-xl font-bold text-xl hover:bg-blue-700 transition disabled:opacity-70 mt-6"
          >
            {finishLoading ? 'Releasing Payment...' : 'Finish Service & Release Payment'}
          </button>
        )}

        <p className="text-center mt-6 text-sm text-gray-600">
          {payment
            ? 'Service booked. Click "Finish Service" when the provider completes the task.'
            : `You will receive an M-Pesa prompt to complete payment of KSh ${provider.price}`}
        </p>
      </div>
    </div>
  )
}
