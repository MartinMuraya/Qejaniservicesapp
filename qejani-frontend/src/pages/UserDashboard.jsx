import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function UserDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/api/orders/user', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // if you have auth
      }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load bookings')
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-12 text-green-800">My Bookings</h1>

        {loading ? (
          <p className="text-center text-2xl">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-2xl text-gray-600">No bookings yet. Book a service now!</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold">{order.provider.name}</h3>
                <p className="text-lg text-gray-600 mt-2">Service: {order.service.name}</p>
                <p className="text-lg text-gray-600 mt-2">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-xl font-bold text-green-600 mt-4">KSh {order.amount.toLocaleString()}</p>
                <p className="mt-4 inline-block px-4 py-2 rounded-full text-white font-bold
                  {order.paymentStatus === 'paid' ? 'bg-green-600' : 'bg-yellow-600'}">
                  {order.paymentStatus.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}