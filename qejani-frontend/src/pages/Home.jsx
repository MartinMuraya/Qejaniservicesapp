import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import UrgentSOSButton from '../components/UrgentSOSButton'
import { CheckBadgeIcon, ShieldCheckIcon, StarIcon, BriefcaseIcon } from '@heroicons/react/24/solid'


export default function Home() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
        <header className="text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-tight">
            PRO SERVICES <br />
            <span className="text-green-600">ON DEMAND.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto px-4">
            Book trusted local professionals for your home, office, or emergency needs in seconds.
          </p>
        </header>

        {loading ? (
          <div className="text-center py-20 text-gray-400 font-bold">Discovering Services...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service) => (
              <Link
                key={service._id}
                to={`/service/${service._id}`}
                className="group bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:border-green-100 transition transform hover:-translate-y-2"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition">
                  <BriefcaseIcon className="w-7 h-7 md:w-8 md:h-8 text-green-600 group-hover:text-white transition" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2 truncate">{service.name}</h3>
                <p className="text-gray-500 font-medium text-sm md:text-base line-clamp-2">{service.description}</p>
                <div className="mt-6 flex items-center text-green-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition underline">
                  View Providers
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center px-4">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <h4 className="font-black text-gray-900">VERIFIED PROS</h4>
            <p className="text-sm text-gray-500 font-medium">Every provider is identity-checked and background-vetted.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto">
              <StarIcon className="w-6 h-6" />
            </div>
            <h4 className="font-black text-gray-900">TOP QUALITY</h4>
            <p className="text-sm text-gray-500 font-medium">Only the best-rated professionals make the cut.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckBadgeIcon className="w-6 h-6" />
            </div>
            <h4 className="font-black text-gray-900">SECURE PAY</h4>
            <p className="text-sm text-gray-500 font-medium">Protected payments and easy M-Pesa integration.</p>
          </div>
        </div>

        <UrgentSOSButton />
      </div>
    </div>
  )
}
