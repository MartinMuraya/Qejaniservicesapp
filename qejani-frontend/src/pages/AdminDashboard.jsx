import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api";

export default function AdminDashboard() {
  const [earnings, setEarnings] = useState([]);
  const [providers, setProviders] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [earningsRes, providersRes, walletRes] = await Promise.all([
        api.getAdminEarnings(),
        fetch("/api/admin/providers").then(r => r.json()),
        fetch("/api/admin/wallet").then(r => r.json())
      ]);

      setEarnings(earningsRes.data);
      setProviders(providersRes);
      setWallet(walletRes.balance);
      setLoading(false);
    } catch {
      toast.error("Failed to load dashboard");
    }
  };

  const withdraw = async () => {
    try {
      await fetch("/api/admin/withdraw", { method: "POST" });
      toast.success("Withdrawal successful");
      loadDashboard();
    } catch {
      toast.error("Withdrawal failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Stat label="Providers" value={providers.length} />
          <Stat label="Payments" value={earnings.length} />
          <Stat label="Admin Wallet" value={`KSh ${wallet}`} />
          <Stat label="Total Earned" value={`KSh ${earnings.reduce((s,e)=>s+e.amount,0)}`} />
        </div>

        {/* WITHDRAW */}
        {wallet >= 200 && (
          <button
            onClick={withdraw}
            className="mb-8 bg-green-600 text-white px-6 py-2 rounded"
          >
            Withdraw KSh {wallet}
          </button>
        )}

        {/* VIEW WITHDRAWALS LINK */}
        <a
          href="/admin/withdrawals"
          className="inline-block mb-8 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          View Withdrawals
        </a>

        {/* PROVIDERS */}
        <h2 className="text-2xl font-bold mb-4">Providers</h2>
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Name</th>
              <th>Service</th>
              <th>Wallet</th>
              <th>Commission %</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {providers.map(p => (
              <tr key={p._id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td>{p.service?.name}</td>
                <td>KSh {p.walletBalance}</td>
                <td>{p.commissionRate}%</td>
                <td>{p.isActive ? "Active" : "Suspended"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAYMENTS */}
        <h2 className="text-2xl font-bold mt-10 mb-4">Payments</h2>
        {loading ? "Loading..." : (
          <div className="grid gap-4">
            {earnings.map(e => (
              <div key={e._id} className="bg-white p-4 rounded shadow">
                <p>Provider: {e.providerId?.name}</p>
                <p>Commission: KSh {e.commission}</p>
                <p>{new Date(e.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="bg-white p-6 rounded shadow">
    <p className="text-gray-500">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);
