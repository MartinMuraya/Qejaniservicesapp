// src/pages/BookProvider.jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function BookProvider() {
  const { providerId } = useParams()
  const [provider, setProvider] = useState(null)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [payLoading, setPayLoading] = useState(false)

  useEffect(() => {
    // Fetch provider details
    fetch(`http://localhost:5000/api/providers/${providerId}`)
      .then(res => res.json())
      .then(data => {
        setProvider(data)
        setLoading(false)
      })
      .catch(err => {
        toast.error('Failed to load provider')
        setLoading(false)
      })
  }, [providerId])

  const handlePay = async () => {
    if (!phone) return toast.error('Enter your phone number')
    if (!phone.startsWith('254') || phone.length !== 12) return toast.error('Use format 2547XXXXXXXX')

    setPayLoading(true)

    try {
      // Create real order
      const orderRes = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // if you have auth
        },
        body: JSON.stringify({
          providerId,
          serviceId: provider.service._id // real service ID
        })
      })

      const orderData = await orderRes.json()

      if (!orderRes.ok) throw new Error(orderData.message || 'Order failed')

      // Trigger M-Pesa STK Push with real amount
      const mpesaRes = await fetch(`http://localhost:5000/api/mpesa/stkpush?providerId=${providerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          amount: provider.price // real provider price
        })
      })

      const mpesaData = await mpesaRes.json()

      if (mpesaRes.ok) {
        toast.success(mpesaData.message || 'Check your phone for M-Pesa prompt!')
      } else {
        toast.error(mpesaData.message || 'Payment request failed')
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setPayLoading(false)
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

        <p className="text-center mt-6 text-sm text-gray-600">
          You will receive an M-Pesa prompt to complete payment of KSh {provider.price}
        </p>
      </div>
    </div>
  )
}