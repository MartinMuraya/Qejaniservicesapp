import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [earnings, setEarnings] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/api/data/adminEarnings')
      .then(res => res.json())
      .then(data => {
        setEarnings(data)
        setTotal(data.reduce((sum, e) => sum + e.amount, 0))
        setLoading(false)
      })
      .catch(() => toast.error('Failed to load earnings'))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-8 text-green-800">Admin Dashboard</h1>
        <div className="text-center mb-12">
          <p className="text-2xl text-gray-600">Total Commission Earned</p>
          <p className="text-6xl font-bold text-green-600">KSh {total.toLocaleString()}</p>

          {/* Withdrawals button */}
        <a
           href="/admin/withdrawals"
           className="inline-block mt-6 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
             View Withdrawals
          </a>
        </div>

        <h2 className="text-3xl font-bold mb-6">Commission History</h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : earnings.length === 0 ? (
          <p className="text-center text-xl text-gray-600">No earnings yet</p>
        ) : (
          <div className="grid gap-6">
            {earnings.map(earning => (
              <div key={earning._id} className="bg-white rounded-xl shadow p-6">
                <p className="text-lg">Payment ID: {earning.paymentId}</p>
                <p className="text-lg text-green-600">Commission: KSh {earning.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">{new Date(earning.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
          
        )}
      </div>
    </div>
  )
}