import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

export default function ServiceDetail() {
  const { id } = useParams();
  const [providers, setProviders] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const servicesRes = await api.getServices();
        const service = servicesRes.data.find(s => s._id === id);
        if (service) setServiceName(service.name);

        // Fallback first
        let res = await api.getProvidersByService(id);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
              const nearby = await api.getProvidersNearUser(
                pos.coords.latitude,
                pos.coords.longitude,
                10000,
                id
              );

              setProviders(
                nearby.data.length ? nearby.data : res.data
              );
            } catch {
              setProviders(res.data);
            }
          }, () => setProviders(res.data));
        } else {
          setProviders(res.data);
        }

      } catch (err) {
        toast.error("Failed to load providers");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="min-h-screen py-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        Providers for {serviceName}
      </h1>

      {providers.length === 0 ? (
        <p className="text-center text-red-600">
          No providers nearby
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {providers.map(p => (
            <div key={p._id} className="bg-white p-6 rounded shadow">
              <h3 className="text-xl font-bold">{p.name}</h3>
              <p>KSh {p.price}</p>
              <Link to={`/book/${p._id}`} className="text-green-600">
                Book Now
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
