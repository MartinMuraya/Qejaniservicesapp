import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { BriefcaseIcon, SparklesIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.getServices()
        setServices(res.data || [])
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-green-600 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            Our Professional Services
          </h1>
          <p className="text-green-100 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10">
            From emergency repairs to daily home maintenance, we've got the best pros in Kenya ready to help.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 absolute left-5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search for a service (e.g. Plumbing, Cleaning...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-400/30 text-lg font-medium"
            />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold">Loading categories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <Link
                  key={service._id}
                  to={`/service/${service._id}`}
                  className="group relative bg-gray-50 rounded-3xl p-10 border-2 border-transparent hover:border-green-500 hover:bg-white hover:shadow-2xl transition duration-500 overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-green-600 transition duration-500">
                      <BriefcaseIcon className="w-8 h-8 text-green-600 group-hover:text-white transition duration-500" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-green-600 transition">
                      {service.name}
                    </h3>
                    <p className="text-gray-500 font-medium leading-relaxed mb-6">
                      {service.description || "Get top-rated professionals for this service category today."}
                    </p>
                    <div className="flex items-center text-green-600 font-black text-sm uppercase tracking-widest group-hover:translate-x-2 transition duration-500">
                      Explore Providers 
                      <SparklesIcon className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                  
                  {/* Decorative background circle */}
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-green-50 rounded-full group-hover:scale-150 transition duration-700 opacity-50"></div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-2xl text-gray-400 font-bold">No services found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Can't find what you're looking for?</h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Our support team is available 24/7 to help you find the right pro for your specific needs.
            </p>
            <Link to="/contact" className="inline-block bg-white text-gray-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-green-500 hover:text-white transition shadow-xl">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
