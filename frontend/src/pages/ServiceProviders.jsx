// src/pages/ServiceProviders.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProvidersByService, bookProvider } from "../api/userApi";

export default function ServiceProviders() {
  const { serviceId } = useParams();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const res = await fetchProvidersByService(serviceId);
        setProviders(res.data || res.data.providers || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load providers");
      } finally {
        setLoading(false);
      }
    };
    loadProviders();
  }, [serviceId]);

  const handleBook = async (providerId) => {
    setBookingMsg("");
    try {
      const res = await bookProvider(providerId, serviceId);
      setBookingMsg("Service booked successfully!");
      // Optionally redirect to user's dashboard or orders page
      // navigate("/dashboard/user");
    } catch (err) {
      console.error(err);
      setBookingMsg("Booking failed. Try again.");
    }
  };

  if (loading) return <div className="p-6 text-gray-700">Loading providers...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Available Providers</h1>
      {bookingMsg && <div className="mb-4 text-green-600">{bookingMsg}</div>}
      <div className="grid md:grid-cols-3 gap-6">
        {providers.length === 0 && <div>No providers found for this service</div>}
        {providers.map((p) => (
          <div key={p._id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
            <img
              src={p.profileImage || "/placeholder.png"}
              alt={p.name}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-gray-600">{p.service}</p>
            <p className="text-gray-700">Price: {p.price} KES</p>
            <p className="text-gray-500">Phone: {p.phone}</p>
            <button
              onClick={() => handleBook(p._id)}
              className="mt-2 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
