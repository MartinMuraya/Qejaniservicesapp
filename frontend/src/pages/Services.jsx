// src/pages/Services.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchServices } from "../api/userApi"; // API call to get services

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetchServices();
        setServices(res.data || res.data.services || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  if (loading) return <div className="p-6 text-gray-700">Loading services...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Available Services</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {services.length === 0 && <div>No services found</div>}
        {services.map((s) => (
          <div
            key={s._id}
            className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/services/${s._id}/providers`)}
          >
            <h2 className="text-xl font-semibold">{s.name}</h2>
            <p className="text-gray-600 mt-2">{s.description || "No description available"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
