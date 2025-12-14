import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api";
import { io } from "socket.io-client";

export default function AdminDashboard() {
  const [earnings, setEarnings] = useState([]);
  const [providers, setProviders] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadDashboard();

    // Connect to Socket.IO server
    const socket = io("http://localhost:5000"); // replace with your server URL if different

    socket.on("dashboardUpdate", (data) => {
      switch (data.type) {
        case "payment":
          setEarnings((prev) => [data.payment, ...prev]);
          break;
        case "withdrawal":
          setWithdrawals((prev) => [data.withdrawal, ...prev]);
          break;
        case "provider":
          setProviders((prev) => {
            const idx = prev.findIndex((p) => p._id === data.provider._id);
            if (idx !== -1) {
              const copy = [...prev];
              copy[idx] = data.provider;
              return copy;
            }
            return [data.provider, ...prev];
          });
          break;
        case "wallet":
          setWallet(data.balance);
          break;
        default:
          break;
      }
    });

    return () => socket.disconnect();
  }, []);

  const loadDashboard = async () => {
    try {
      const [earningsRes, providersRes, walletRes, withdrawalsRes] =
        await Promise.all([
          api.getAdminEarnings(),
          fetch("/api/admin/providers").then((r) => r.json()),
          fetch("/api/admin/wallet").then((r) => r.json()),
          fetch("/api/admin/withdrawals").then((r) => r.json()),
        ]);

      setEarnings(earningsRes.data);
      setProviders(providersRes);
      setWallet(walletRes.balance);
      setWithdrawals(withdrawalsRes);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard");
    }
  };

  const handleWithdraw = async () => {
    if (wallet < 200) {
      toast.error("Minimum balance for withdrawal is KSh 200");
      return;
    }

    const phone = prompt(
      "Enter M-Pesa phone number for withdrawal (format 2547XXXXXXXX)"
    );
    if (!phone) return;

    try {
      setWithdrawing(true);
      const res = await fetch("/api/admin/withdraw", {
        method: "POST",
        body: JSON.stringify({ phone }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Withdrawal of KSh ${wallet} sent!`);
        loadDashboard(); // refresh immediately
      } else {
        toast.error("Withdrawal failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error processing withdrawal");
    } finally {
      setWithdrawing(false);
    }
  };

  const filteredProviders = providers.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* FILTER */}
        <input
          type="text"
          placeholder="Search provider..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-6 p-2 border rounded w-full md:w-1/3"
        />

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Stat label="Providers" value={providers.length} />
          <Stat label="Payments" value={earnings.length} />
          <Stat label="Admin Wallet" value={`KSh ${wallet}`} />
          <Stat
            label="Total Earned"
            value={`KSh ${earnings.reduce((s, e) => s + e.amount, 0)}`}
          />
        </div>

        {/* WITHDRAW */}
        {wallet >= 200 && (
          <button
            onClick={handleWithdraw}
            disabled={withdrawing}
            className="mb-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            {withdrawing ? "Processing..." : `Withdraw KSh ${wallet}`}
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
        <table className="w-full bg-white rounded shadow mb-8">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Name</th>
              <th>Service</th>
              <th>Wallet</th>
              <th>Commission %</th>
              <th>Total Commission</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProviders.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td>{p.service?.name}</td>
                <td>KSh {p.walletBalance}</td>
                <td>{p.commissionRate}%</td>
                <td>
                  KSh{" "}
                  {earnings
                    .filter((e) => e.providerId?._id === p._id)
                    .reduce((sum, e) => sum + e.commission, 0)}
                </td>
                <td>{p.isActive ? "Active" : "Suspended"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAYMENTS */}
        <h2 className="text-2xl font-bold mt-10 mb-4">Payments</h2>
        {loading ? (
          "Loading..."
        ) : (
          <div className="grid gap-4 mb-8">
            {earnings.map((e) => (
              <div key={e._id} className="bg-white p-4 rounded shadow">
                <p>Provider: {e.providerId?.name}</p>
                <p>Commission: KSh {e.commission}</p>
                <p>{new Date(e.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        {/* WITHDRAWALS */}
        <h2 className="text-2xl font-bold mt-10 mb-4">Withdrawals</h2>
        <table className="w-full bg-white rounded shadow mb-8">
          <thead className="bg-gray-200">
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr key={w._id} className="border-t">
                <td>{new Date(w.createdAt).toLocaleString()}</td>
                <td>KSh {w.amount}</td>
                <td>{w.phone}</td>
                <td>{w.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
