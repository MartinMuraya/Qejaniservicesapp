// src/pages/ServiceDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../services/api'  

export default function ServiceDetail() {
  const { id } = useParams()
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [serviceName, setServiceName] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get service details
        const serviceRes = await api.getServices()  // get all services
        const service = serviceRes.data.find(s => s._id === id)
        if (service) {
          setServiceName(service.name)
          document.title = `${service.name} Providers - Qejani Services`
        }

        // Get providers for this service
        const providersRes = await api.getProvidersByService(id)
        setProviders(providersRes.data)
      } catch (err) {
        console.error(err)
        toast.error('Error loading service or providers')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-12 text-green-800">
          Available Providers for {serviceName}
        </h1>

        {loading ? (
          <p className="text-center text-2xl">Loading providers...</p>
        ) : providers.length === 0 ? (
          <p className="text-center text-2xl text-red-600">
            No providers available right now. We’re adding more daily!
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {providers.map(p => (
              <div key={p._id} className="bg-white rounded-2xl shadow-xl p-8 text-center hover:scale-105 transition">
                <div className="bg-green-500 w-24 h-24 rounded-full mx-auto mb-6"></div>
                <h3 className="text-3xl font-bold">{p.name}</h3>
                <p className="text-gray-600 mt-2">📞 {p.phone}</p>
                <p className="text-4xl font-bold text-green-600 mt-4">
                  KSh {p.price.toLocaleString()}
                </p>
                <Link
                  to={`/book/${p._id}`}
                  className="mt-8 inline-block bg-green-600 text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-green-700"
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
