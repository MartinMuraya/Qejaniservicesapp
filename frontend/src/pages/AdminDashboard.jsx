// src/pages/AdminDashboard.jsx
import { useEffect, useState, useMemo } from "react";
import {
  fetchProviders,
  createProvider,
  fetchAdminEarnings,
  fetchAllTransactions,
  adminWithdraw,
  updateProvider,
  deleteProvider,
} from "../api/adminApi";

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("providers");
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    idNumber: "",
    profileImage: null,
    idImage: null,
    price: "",
  });
  const [preview, setPreview] = useState({ profile: null, id: null });
  const [earnings, setEarnings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({ totalEarnings: 0, totalProviders: 0, totalTransactions: 0 });

  useEffect(() => {
    loadProviders();
    loadEarnings();
    loadTransactions();
  }, []);

  const loadProviders = async () => {
    try {
      setLoadingProviders(true);
      const res = await fetchProviders();
      setProviders(res.data.providers || res.data); // accept either shape
      setStats((s) => ({ ...s, totalProviders: (res.data.providers || res.data).length }));
    } catch (err) {
      console.error(err);
      setMessage("Failed to load providers");
    } finally {
      setLoadingProviders(false);
    }
  };

  const loadEarnings = async () => {
    try {
      const res = await fetchAdminEarnings();
      setEarnings(res.data || []);
      const total = (res.data || []).reduce((sum, r) => sum + (r.amount || 0), 0);
      setStats((s) => ({ ...s, totalEarnings: total }));
    } catch (err) {
      console.error(err);
      setMessage("Failed to load earnings");
    }
  };

  const loadTransactions = async () => {
    try {
      const res = await fetchAllTransactions();
      setTransactions(res.data.transactions || res.data || []);
      setStats((s) => ({ ...s, totalTransactions: (res.data.transactions || res.data || []).length }));
    } catch (err) {
      console.error(err);
      setMessage("Failed to load transactions");
    }
  };

  // handle file pick
  const handleFile = (e, which) => {
    const file = e.target.files[0];
    setForm((f) => ({ ...f, [which]: file }));
    setPreview((p) => ({ ...p, [which === "profileImage" ? "profile" : "id"]: URL.createObjectURL(file) }));
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleAddProvider = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("phone", form.phone);
      fd.append("service", form.service);
      fd.append("idNumber", form.idNumber);
      fd.append("price", form.price || 0);
      if (form.profileImage) fd.append("profileImage", form.profileImage);
      if (form.idImage) fd.append("idImage", form.idImage);

      const res = await createProvider(fd);
      setMessage("Provider created");
      setForm({ name: "", phone: "", service: "", idNumber: "", profileImage: null, idImage: null, price: "" });
      setPreview({ profile: null, id: null });
      loadProviders();
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Failed to create provider");
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setMessage("");
    const amount = Number(withdrawAmount);
    if (!amount || amount < 200) {
      setMessage("Minimum withdrawal is KES 200");
      return;
    }
    try {
      const res = await adminWithdraw({ amount });
      setMessage(res.data?.message || "Withdrawal requested");
      setWithdrawAmount("");
      loadEarnings();
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Withdraw failed");
    }
  };

  const handleDeleteProvider = async (id) => {
    if (!confirm("Delete provider? This action is irreversible.")) return;
    try {
      await deleteProvider(id);
      setMessage("Provider deleted");
      loadProviders();
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete provider");
    }
  };

  const formattedProviders = useMemo(() => providers.map((p) => ({
    ...p,
    walletDisplay: p.walletBalance ?? p.wallet ?? 0
  })), [providers]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-3 items-center">
            <div className="text-sm text-gray-600">Admin</div>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Providers" value={stats.totalProviders} />
          <StatCard label="Total Transactions" value={stats.totalTransactions} />
          <StatCard label="Admin Earnings (KES)" value={stats.totalEarnings} />
        </div>

        <div className="bg-white rounded shadow p-4 mb-6">
          <nav className="flex space-x-4">
            <button className={`px-3 py-2 rounded ${tab==="providers" ? "bg-indigo-600 text-white" : "text-gray-600"}`} onClick={()=>setTab("providers")}>Providers</button>
            <button className={`px-3 py-2 rounded ${tab==="add" ? "bg-indigo-600 text-white" : "text-gray-600"}`} onClick={()=>setTab("add")}>Add Provider</button>
            <button className={`px-3 py-2 rounded ${tab==="earnings" ? "bg-indigo-600 text-white" : "text-gray-600"}`} onClick={()=>setTab("earnings")}>Earnings</button>
            <button className={`px-3 py-2 rounded ${tab==="transactions" ? "bg-indigo-600 text-white" : "text-gray-600"}`} onClick={()=>setTab("transactions")}>Transactions</button>
            <button className={`px-3 py-2 rounded ${tab==="withdraw" ? "bg-indigo-600 text-white" : "text-gray-600"}`} onClick={()=>setTab("withdraw")}>Withdraw</button>
          </nav>
        </div>

        {message && <div className="mb-4 text-sm text-red-600">{message}</div>}

        {tab === "providers" && (
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Providers</h2>
            {loadingProviders ? <div>Loading...</div> : (
              <div className="grid md:grid-cols-2 gap-4">
                {formattedProviders.length === 0 && <div className="text-gray-500">No providers yet</div>}
                {formattedProviders.map((p) => (
                  <div key={p._id || p.id} className="border rounded p-3 flex gap-4 items-center">
                    <img src={p.profileImage || p.profile || "/placeholder.png"} alt="profile" className="w-20 h-20 rounded object-cover" />
                    <div className="flex-1">
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-gray-600">{p.service} • {p.phone}</div>
                      <div className="text-sm text-gray-700 mt-2">Wallet: <strong>{p.walletDisplay} KES</strong></div>
                      <div className="text-sm text-gray-500">ID: {p.idNumber || p.idNumberHidden || "—"}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={()=>updateProvider(p._id, { active: !p.active })} className="px-3 py-1 border rounded text-sm">Toggle Active</button>
                      <button onClick={()=>handleDeleteProvider(p._id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "add" && (
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Add Provider</h2>
            <form onSubmit={handleAddProvider} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Full name</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
              </div>
              <div>
                <label className="text-sm">Phone (07...)</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full border p-2 rounded" required />
              </div>
              <div>
                <label className="text-sm">Service</label>
                <input name="service" value={form.service} onChange={handleChange} className="w-full border p-2 rounded" required />
              </div>
              <div>
                <label className="text-sm">Price (KES)</label>
                <input name="price" value={form.price} onChange={handleChange} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="text-sm">ID Number</label>
                <input name="idNumber" value={form.idNumber} onChange={handleChange} className="w-full border p-2 rounded" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm">Profile Image</label>
                <input type="file" accept="image/*" onChange={(e)=>handleFile(e, "profileImage")} />
                {preview.profile && <img src={preview.profile} className="w-28 h-28 object-cover rounded" alt="preview" />}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm">ID Image</label>
                <input type="file" accept="image/*" onChange={(e)=>handleFile(e, "idImage")} />
                {preview.id && <img src={preview.id} className="w-28 h-28 object-cover rounded" alt="id preview" />}
              </div>

              <div className="md:col-span-2">
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Create Provider</button>
              </div>
            </form>
          </div>
        )}

        {tab === "earnings" && (
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Admin Earnings</h2>
            <div className="grid gap-2">
              {earnings.length === 0 && <div className="text-gray-500">No earnings yet</div>}
              {earnings.map(e => (
                <div key={e._id || e.id} className="flex justify-between border-b py-2">
                  <div>Payment: {e.paymentId || e.sourcePayment}</div>
                  <div>{e.amount} KES</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "transactions" && (
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Transactions</h2>
            <div className="overflow-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-600">
                    <th className="py-2">ID</th>
                    <th>Provider</th>
                    <th>Amount</th>
                    <th>Commission</th>
                    <th>Net</th>
                    <th>Mpesa Receipt</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 && (
                    <tr><td colSpan="7" className="py-4 text-center text-gray-500">No transactions</td></tr>
                  )}
                  {transactions.map(t => (
                    <tr key={t._id || t.id} className="border-t">
                      <td className="py-2 text-sm">{t._id}</td>
                      <td className="py-2 text-sm">{t.providerId || t.providerName || "—"}</td>
                      <td className="py-2">{t.amount}</td>
                      <td className="py-2">{t.commission}</td>
                      <td className="py-2">{t.providerAmount}</td>
                      <td className="py-2">{t.mpesaReceipt}</td>
                      <td className="py-2 text-sm">{new Date(t.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "withdraw" && (
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Admin Withdraw</h2>
            <form onSubmit={handleWithdraw} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Amount (KES)</label>
                <input value={withdrawAmount} onChange={(e)=>setWithdrawAmount(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Request Withdraw</button>
              </div>
            </form>
            <div className="text-sm text-gray-500 mt-3">Minimum withdraw: KES 200. Weekly withdraw limit and pending checks enforced on backend.</div>
          </div>
        )}
      </div>
    </div>
  );
}
