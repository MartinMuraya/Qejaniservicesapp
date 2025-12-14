import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function ProviderDashboard() {
  const [payments, setPayments] = useState([])
  const [wallet, setWallet] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Replace with your provider ID or get from auth
    const providerId = 'YOUR_PROVIDER_ID_HERE' // or from auth

    fetch(`http://localhost:5000/api/data/payments/provider/${providerId}`)
      .then(res => res.json())
      .then(data => {
        setPayments(data.payments)
        setWallet(data.walletBalance)
        setLoading(false)
      })
      .catch(() => toast.error('Failed to load data'))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-8 text-green-800">Provider Dashboard</h1>
        <div className="text-center mb-12">
          <p className="text-2xl text-gray-600">Wallet Balance</p>
          <p className="text-6xl font-bold text-green-600">KSh {wallet.toLocaleString()}</p>
        </div>

        <h2 className="text-3xl font-bold mb-6">Payment History</h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : payments.length === 0 ? (
          <p className="text-center text-xl text-gray-600">No payments yet</p>
        ) : (
          <div className="grid gap-6">
            {payments.map(payment => (
              <div key={payment._id} className="bg-white rounded-xl shadow p-6">
                <p className="text-lg">Receipt: {payment.mpesaReceipt}</p>
                <p className="text-lg">Amount: KSh {payment.amount.toLocaleString()}</p>
                <p className="text-lg text-green-600">You received: KSh {payment.providerAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">{new Date(payment.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}