import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import api from "../services/api";
import ProviderFilters from "../components/ProviderFilters";
import FavoriteButton from "../components/FavoriteButton";

// 🌍 distance helper (km)
const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export default function ServiceDetail() {
  const { id } = useParams();

  const [providers, setProviders] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locations, setLocations] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  // 📍 reverse geocode (OpenStreetMap – free)
  const fetchLocationName = async (lat, lng, pid) => {
    if (locations[pid]) return;

    try {
      const res = await fetch(
        `http://localhost:5001/api/data/reverse-geocode?lat=${lat}&lng=${lng}`
      );
      const data = await res.json();

      setLocations(prev => ({
        ...prev,
        [pid]:
          data.address?.suburb ||
          data.address?.neighbourhood ||
          data.address?.town ||
          data.address?.city ||
          "Nearby",
      }));
    } catch {
      setLocations(prev => ({ ...prev, [pid]: "Nearby" }));
    }
  };

  useEffect(() => {
    loadProviders();
  }, [id, filters]);

  const loadProviders = async () => {
    try {
      const servicesRes = await api.getServices();
      const service = servicesRes.data.find(s => s._id === id);
      if (service) setServiceName(service.name);

      // Build query params with filters
      const params = new URLSearchParams();
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.minRating) params.append('minRating', filters.minRating);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);

      const queryString = params.toString();
      const url = `http://localhost:5001/api/providers/service/${id}${queryString ? '?' + queryString : ''}`;

      const res = await fetch(url);
      const data = await res.json();

      setProviders(data.providers || data);
      setLoading(false);
    } catch {
      toast.error("Failed to load providers");
      setLoading(false);
    }
  };

  useEffect(() => {
    providers.forEach(p => {
      if (p.location?.coordinates) {
        const [lng, lat] = p.location.coordinates;
        fetchLocationName(lat, lng, p._id);
      }
    });
  }, [providers]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-16 px-4">
      <h1 className="text-3xl md:text-5xl font-black text-gray-900 text-center mb-10 tracking-tight">
        PROS FOR <span className="text-green-600">{serviceName.toUpperCase()}</span>
      </h1>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <ProviderFilters onFilterChange={handleFilterChange} />
      </div>

      {providers.length === 0 ? (
        <p className="text-center text-red-600">No providers found</p>
      ) : (
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map(p => {
            let distance = null;

            if (userLocation && p.location?.coordinates) {
              const [lng, lat] = p.location.coordinates;
              distance = getDistanceKm(
                userLocation.lat,
                userLocation.lng,
                lat,
                lng
              ).toFixed(1);
            }

            return (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
              >
                {/* 🖼 IMAGE */}
                <div className="relative">
                  <img
                    src={
                      p.image
                        ? `http://localhost:5001${p.image}`
                        : "/placeholder.jpg"
                    }
                    alt={p.name}
                    className="w-full h-40 object-cover"
                  />
                  <FavoriteButton
                    providerId={p._id}
                    className="absolute top-3 right-3 bg-white"
                  />
                </div>

                <div className="p-5 space-y-2">
                  <Link to={`/provider/${p._id}`}>
                    <h3 className="text-xl font-bold hover:text-green-600 transition cursor-pointer">{p.name}</h3>
                  </Link>

                  {/* Rating */}
                  {p.averageRating > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <StarIcon className="w-5 h-5 text-yellow-400" />
                        <span className="ml-1 font-semibold">
                          {p.averageRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({p.totalReviews} reviews)
                      </span>
                    </div>
                  )}

                  <p className="text-gray-600">
                    📍 {locations[p._id] || "Loading location..."}
                  </p>

                  {distance && (
                    <p className="text-sm text-gray-500">
                      🚗 {distance} km away
                    </p>
                  )}

                  <p className="font-semibold text-2xl text-green-600">
                    KSh {p.price?.toLocaleString()}
                  </p>

                  <Link
                    to={`/book/${p._id}`}
                    className="block text-center mt-3 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                  >
                    Book Now →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
