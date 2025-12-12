import { useEffect, useState } from 'react'
import { api } from '../services/api'
import toast from 'react-hot-toast'

export default function UserDashboard() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    api.getUserOrders()
      .then(res => setOrders(res.data))
      .catch(() => toast.error('Failed to load orders'))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      <div className="grid gap-6">
        {orders.map(order => (
          <div key={order._id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold">{order.service.name}</h3>
            <p>Provider: {order.provider.name}</p>
            <p>Status: {order.status}</p>
            <p>Price: KSh {order.service.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}