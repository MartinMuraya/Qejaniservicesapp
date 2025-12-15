import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api"; 

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await api.getWithdrawals(); 
      setWithdrawals(res.data);
    } catch (err) {
      toast.error("Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
          Withdrawal History
        </h1>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : withdrawals.length === 0 ? (
          <p className="text-center text-gray-600">No withdrawals yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-6 text-left">Amount (KSh)</th>
                  <th className="py-3 px-6 text-left">Phone</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w._id} className="border-b">
                    <td className="py-3 px-6">{w.amount.toLocaleString()}</td>
                    <td className="py-3 px-6">{w.phone}</td>
                    <td className="py-3 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-white ${
                          w.status === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      {new Date(w.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
