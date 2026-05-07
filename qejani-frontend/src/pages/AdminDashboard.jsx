import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { io } from "socket.io-client";

export default function AdminDashboard() {
  const [earnings, setEarnings] = useState([]);
  const [providers, setProviders] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadDashboard();
    const socket = io("http://localhost:5001");
    // socket.on(...) etc.
    return () => socket.disconnect();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [earningsRes, providersRes, walletRes, withdrawalsRes, servicesRes, usersRes] = await Promise.all([
        api.getAdminEarnings(),
        api.getAdminProviders(),
        api.getAdminWallet(),
        api.getAdminWithdrawals(),
        api.getAdminServices(),
        api.getAdminUsers(),
      ]);

      setEarnings(earningsRes.data);
      setProviders(providersRes.data);
      setWallet(walletRes.data.balance);
      setWithdrawals(withdrawalsRes.data);
      setServices(servicesRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard");
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (wallet < 200) {
      toast.error("Minimum balance for withdrawal is KSh 200");
      return;
    }
    const phone = prompt("Enter M-Pesa phone number (2547XXXXXXXX):");
    if (!phone) return;
    try {
      setWithdrawing(true);
      const res = await api.withdrawAdminWallet(phone);
      if (res.data.success) {
        toast.success(`Withdrawal of KSh ${wallet} sent!`);
        loadDashboard();
      } else {
        toast.error(res.data.message || "Withdrawal failed");
      }
    } catch (err) {
      toast.error("Error processing withdrawal");
    } finally {
      setWithdrawing(false);
    }
  };

  const handleVerifyUser = async (id) => {
    try {
      await api.verifyAdminUser(id);
      toast.success("User verified!");
      loadDashboard();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to verify user");
    }
  };

  const handleDeclineUser = async (id) => {
    if (!window.confirm("Decline and remove this application?")) return;
    try {
      await api.declineAdminUser(id);
      toast.success("Application declined");
      loadDashboard();
    } catch (err) {
      toast.error("Failed to decline user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.deleteAdminUser(id);
      toast.success("User deleted");
      loadDashboard();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleUpdateUser = async (user) => {
    const newName = prompt("New Name:", user.name);
    const newEmail = prompt("New Email:", user.email);
    const newRole = prompt("New Role (user/provider/admin):", user.role);
    if (!newName || !newEmail || !newRole) return;
    try {
      await api.updateAdminUser(user._id, { name: newName, email: newEmail, role: newRole });
      toast.success("User updated");
      loadDashboard();
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  const handleUpdateProvider = async (provider) => {
    const newName = prompt("New Business Name:", provider.name);
    const newPrice = prompt("New Price:", provider.price);
    const newPhone = prompt("New Phone:", provider.phone);
    if (!newName || !newPrice || !newPhone) return;
    try {
      await api.updateAdminProvider(provider._id, { name: newName, price: newPrice, phone: newPhone });
      toast.success("Provider updated");
      loadDashboard();
    } catch (err) {
      toast.error("Failed to update provider");
    }
  };

  const handleCreateService = async () => {
    const name = prompt("Service Name:");
    const description = prompt("Service Description:");
    if (!name) return;
    try {
      await api.createAdminService({ name, description });
      toast.success("Service created");
      loadDashboard();
    } catch (err) {
      toast.error("Failed to create service");
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await api.deleteAdminService(id);
      toast.success("Service deleted");
      loadDashboard();
    } catch (err) {
      toast.error("Failed to delete service");
    }
  };

  const handleToggleProviderStatus = async (id) => {
    try {
      await api.toggleAdminProviderStatus(id);
      toast.success("Provider status updated");
      loadDashboard();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteProvider = async (id) => {
    if (!window.confirm("Delete this provider profile?")) return;
    try {
      await api.deleteAdminProvider(id);
      toast.success("Provider deleted");
      loadDashboard();
    } catch (err) {
      toast.error("Failed to delete provider");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-400">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">ADMIN PANEL</h1>
            <p className="text-gray-500 font-medium">Manage Qejani platform operations.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={loadDashboard} className="bg-white border-2 border-gray-100 p-3 rounded-xl hover:bg-gray-50 transition">
              Refresh Data
            </button>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-6 mb-10 border-b-2 border-gray-100 overflow-x-auto pb-1 items-center justify-between">
          <div className="flex gap-6">
            {["Overview", "Services", "Providers", "Users", "Payments"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`pb-4 px-2 font-black text-sm uppercase tracking-widest transition whitespace-nowrap ${activeTab === tab.toLowerCase() ? "border-b-4 border-green-600 text-green-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mb-4 md:mb-0 w-full md:w-64">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-green-500 transition font-medium"
            />
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard label="Partner Net" value={providers.length} />
              <StatCard label="Total Users" value={users.length} />
              <StatCard label="Admin Wallet" value={`KSh ${wallet}`} color="text-green-600" />
              <StatCard label="Platform Revenue" value={`KSh ${earnings.reduce((s, e) => s + (e.commission || 0), 0)}`} />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Financial Actions</h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleWithdraw}
                  disabled={wallet < 200 || withdrawing}
                  className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {withdrawing ? "Wait..." : `Withdraw KSh ${wallet}`}
                </button>
                <a href="/admin/withdrawals" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition">
                  Withdrawal History
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black uppercase tracking-tight">Service Catalog</h2>
              <button onClick={handleCreateService} className="bg-gray-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition">+ Add New</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 uppercase text-[10px] tracking-widest font-black border-b border-gray-100">
                    <th className="pb-4">Service Name</th>
                    <th className="pb-4">Description</th>
                    <th className="pb-4 text-right">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {services
                    .filter(s => s.name.toLowerCase().includes(filter.toLowerCase()) || s.description.toLowerCase().includes(filter.toLowerCase()))
                    .map((s) => (
                      <tr key={s._id} className="group hover:bg-gray-50/50 transition">
                        <td className="py-6 font-bold text-gray-900">{s.name}</td>
                        <td className="py-6 text-gray-500 font-medium text-sm max-w-md">{s.description}</td>
                        <td className="py-6 text-right">
                          <button onClick={() => handleDeleteService(s._id)} className="text-red-500 font-black text-xs uppercase hover:underline">Remove</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-10">User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 uppercase text-[10px] tracking-widest font-black border-b border-gray-100">
                    <th className="pb-4">User Details</th>
                    <th className="pb-4">Role</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users
                    .filter(u => u.name.toLowerCase().includes(filter.toLowerCase()) || u.email.toLowerCase().includes(filter.toLowerCase()))
                    .map((u) => (
                      <tr key={u._id} className="group hover:bg-gray-50/50 transition">
                        <td className="py-6">
                          <p className="font-bold text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400 font-medium">{u.email}</p>
                        </td>
                        <td className="py-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'provider' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-6">
                          {u.isVerified ? (
                            <span className="flex items-center gap-1 text-green-600 font-black text-[10px] uppercase tracking-wider">Verified ✓</span>
                          ) : (
                            <div className="flex gap-2">
                              <button onClick={() => handleVerifyUser(u._id)} className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-green-200 transition">Approve</button>
                              <button onClick={() => handleDeclineUser(u._id)} className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-200 transition">Decline</button>
                            </div>
                          )}
                        </td>
                        <td className="py-6 text-right">
                          <div className="flex justify-end gap-4">
                            <button onClick={() => handleUpdateUser(u)} className="text-blue-500 hover:text-blue-700 font-black text-xs uppercase transition">Edit</button>
                            <button onClick={() => handleDeleteUser(u._id)} className="text-gray-400 hover:text-red-500 font-black text-xs uppercase transition">Ban</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "providers" && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-10">Provider Registry</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 uppercase text-[10px] tracking-widest font-black border-b border-gray-100">
                    <th className="pb-4">Provider</th>
                    <th className="pb-4">Service</th>
                    <th className="pb-4">Wallet</th>
                    <th className="pb-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {providers
                    .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()) || p.service?.name.toLowerCase().includes(filter.toLowerCase()))
                    .map((p) => (
                      <tr key={p._id} className="group hover:bg-gray-50/50 transition">
                        <td className="py-6 font-bold">{p.name}</td>
                        <td className="py-6 text-sm font-medium text-gray-500">{p.service?.name}</td>
                        <td className="py-6 font-black text-green-600">KSh {p.walletBalance}</td>
                        <td className="py-6 text-right flex gap-2 justify-end items-center">
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {p.isActive ? 'Active' : 'Suspended'}
                          </span>
                          <button onClick={() => handleToggleProviderStatus(p._id)} className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-[9px] font-black uppercase hover:bg-gray-200 transition">
                            {p.isActive ? 'Suspend' : 'Activate'}
                          </button>
                          <button onClick={() => handleUpdateProvider(p)} className="text-blue-500 hover:text-blue-700 font-black text-[10px] uppercase transition ml-2">Edit</button>
                          <button onClick={() => handleDeleteProvider(p._id)} className="text-red-400 hover:text-red-600 font-black text-[10px] uppercase transition ml-1">Del</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-10">Payment Stream</h2>
            <div className="space-y-4">
              {earnings
                .filter(e => e.providerId?.name?.toLowerCase().includes(filter.toLowerCase()))
                .map(e => (
                  <div key={e._id} className="flex justify-between items-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-green-200 transition">
                    <div>
                      <p className="font-bold text-gray-900">Partner: {e.providerId?.name || 'Deleted'}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(e.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-green-600 text-xl">+ KSh {e.commission}</p>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Platform Cut</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ label, value, color = "text-gray-900" }) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-3xl font-black ${color}`}>{value}</p>
  </div>
);
