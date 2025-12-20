import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

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

  // 📍 reverse geocode (OpenStreetMap – free)
  const fetchLocationName = async (lat, lng, pid) => {
    if (locations[pid]) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
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
    const load = async () => {
      try {
        const servicesRes = await api.getServices();
        const service = servicesRes.data.find(s => s._id === id);
        if (service) setServiceName(service.name);

        let res = await api.getProvidersByService(id);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async pos => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setUserLocation({ lat, lng });

            try {
              const nearby = await api.getProvidersNearUser(lat, lng, 10000, id);
              setProviders(nearby.data.length ? nearby.data : res.data);
            } catch {
              setProviders(res.data);
            }
          }, () => setProviders(res.data));
        } else {
          setProviders(res.data);
        }
      } catch {
        toast.error("Failed to load providers");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  useEffect(() => {
    providers.forEach(p => {
      if (p.location?.coordinates) {
        const [lng, lat] = p.location.coordinates;
        fetchLocationName(lat, lng, p._id);
      }
    });
  }, [providers]);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="min-h-screen py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Providers for {serviceName}
      </h1>

      {providers.length === 0 ? (
        <p className="text-center text-red-600">No providers nearby</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
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
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                {/* 🖼 IMAGE */}
                <img
                  src={
                    p.image
                      ? `http://localhost:5000${p.image}`
                      : "/placeholder.jpg"
                  }
                  alt={p.name}
                  className="w-full h-40 object-cover"
                />

                <div className="p-5 space-y-2">
                  <h3 className="text-xl font-bold">{p.name}</h3>

                  <p className="text-gray-600">
                    📍 {locations[p._id] || "Loading location..."}
                  </p>

                  {distance && (
                    <p className="text-sm text-gray-500">
                      🚗 {distance} km away
                    </p>
                  )}

                  <p className="font-semibold">KSh {p.price}</p>

                  <Link
                    to={`/book/${p._id}`}
                    className="inline-block mt-3 text-green-600 font-medium"
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
