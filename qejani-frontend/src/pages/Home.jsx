import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../services/api'

export default function Home() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.getServices()  
        setServices(res.data)               
      } catch (err) {
        console.error(err)
        toast.error('Failed to load services')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-12 text-green-800">Qejani Services</h1>
        
        {loading ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No services available</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(service => (
              <div key={service._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-32"></div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">{service.name}</h2>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <Link 
                    to={`/service/${service._id}`} 
                    className="block text-center bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                  >
                    View Providers
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}