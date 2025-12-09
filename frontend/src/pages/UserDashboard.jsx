import { useState, useEffect } from "react";
import { getServices, createOrder, getUserOrders } from "../api/userApi";

export default function UserDashboard() {
  const [tab, setTab] = useState("services");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadServices();
    loadOrders();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await getServices();
      setServices(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await getUserOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load orders");
    }
  };

  const handleBook = async (providerId) => {
    try {
      setMessage("");
      const res = await createOrder({ providerId });
      setMessage("Order created! Proceed to payment.");
      loadOrders();
    } catch (err) {
      console.error(err);
      setMessage("Failed to create order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Dashboard</h1>

          <button
            className="bg-red-500 text-white px-4 py-1 rounded"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              window.location.href = "/login/user";
            }}
          >
            Logout
          </button>
        </header>

        {/* Tabs */}
        <div className="bg-white p-3 rounded shadow mb-6">
          <nav className="flex gap-4">
            <button
              className={`px-3 py-2 rounded ${tab === "services" ? "bg-indigo-600 text-white" : "text-gray-600"}`}
              onClick={() => setTab("services")}
            >
              Services
            </button>

            <button
              className={`px-3 py-2 rounded ${tab === "orders" ? "bg-indigo-600 text-white" : "text-gray-600"}`}
              onClick={() => setTab("orders")}
            >
              My Orders
            </button>
          </nav>
        </div>

        {message && <div className="mb-3 text-green-700 text-sm">{message}</div>}

        {/* SERVICES TAB */}
        {tab === "services" && (
          <div className="bg-white p-4 rounded shadow grid md:grid-cols-2 gap-4">
            {loading && <div>Loading...</div>}

            {!loading && services.length === 0 && (
              <div className="text-gray-500">No services available</div>
            )}

            {services.map((s) => (
              <div
                key={s._id}
                className="border rounded p-3 flex gap-4 items-center"
              >
                <img
                  src={s.profileImage}
                  className="w-20 h-20 rounded object-cover"
                  alt="provider"
                />

                <div className="flex-1">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm text-gray-600">{s.service}</div>

                  <div className="mt-2 text-sm font-semibold">
                    Price: {s.price} KES
                  </div>
                </div>

                <button
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                  onClick={() => handleBook(s._id)}
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === "orders" && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-3">My Orders</h2>

            {orders.length === 0 ? (
              <div className="text-gray-500">No orders yet</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-500">
                    <th className="py-2">Provider</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} className="border-t">
                      <td className="py-2">{o.providerName}</td>
                      <td className="py-2">{o.status}</td>
                      <td className="py-2">{o.amount} KES</td>
                      <td className="py-2">{o.paymentStatus}</td>
                      <td className="py-2">
                        {new Date(o.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
