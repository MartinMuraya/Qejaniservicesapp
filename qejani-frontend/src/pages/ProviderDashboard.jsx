import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import {
  CurrencyDollarIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import VerificationForm from '../components/VerificationForm';
import ChatList from '../components/ChatList';

export default function ProviderDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalEarnings: 0, bookingCount: 0, completedCount: 0 });
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [providerData, setProviderData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, paymentsRes, providerRes] = await Promise.all([
        axios.get(`http://localhost:5001/api/analytics/provider/${user?._id || user?.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:5001/api/providers/payments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`http://localhost:5001/api/providers/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      setStats(statsRes.data);
      setPayments(paymentsRes.data);
      setProviderData(providerRes.data);
    } catch (err) {
      console.error("Failed to load provider data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-gray-400">Loading Dashboard...</div>;

  const isVerified = providerData?.badges?.includes('verified');

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl overflow-hidden">
              {providerData?.image ? (
                <img src={`http://localhost:5001${providerData.image}`} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-gray-900">Partner: {user.name}</h1>
                {isVerified && <CheckBadgeIcon className="w-7 h-7 text-blue-600" title="Verified Provider" />}
              </div>
              <p className="text-gray-500 font-medium">Business Account • Active</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-lg border border-gray-800 flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest opacity-80 leading-none mb-1">Total Earnings</p>
                <p className="text-xl font-black">KSh {stats.totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-2">
            {[
              { id: 'overview', name: 'Performance', icon: ChartBarIcon },
              { id: 'messages', name: 'Messages', icon: ChatBubbleLeftRightIcon },
              { id: 'availability', name: 'Availability', icon: CalendarIcon },
              { id: 'payments', name: 'Payments', icon: CurrencyDollarIcon },
              { id: 'verification', name: 'Verification', icon: ShieldCheckIcon },
              { id: 'settings', name: 'Settings', icon: Cog6ToothIcon },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'settings') navigate('/settings');
                  else setActiveTab(tab.id);
                }}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </div>

          {!isVerified && (
            <div className="bg-gradient-to-br from-orange-400 to-red-500 p-6 rounded-3xl text-white shadow-xl">
              <h4 className="font-black text-xs uppercase tracking-widest mb-2">Verification Required</h4>
              <p className="text-sm font-medium mb-4">Complete your verification to unlock more bookings and get the blue badge.</p>
              <button onClick={() => setActiveTab('verification')} className="w-full bg-white text-red-600 py-3 rounded-xl text-xs font-black uppercase hover:bg-gray-50 transition border-none">Start Now</button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Bookings', value: stats.bookingCount, color: 'bg-green-100 text-green-700' },
                  { label: 'Completion Rate', value: `${((stats.completedCount / stats.bookingCount) * 100 || 0).toFixed(0)}%`, color: 'bg-blue-100 text-blue-700' },
                  { label: 'Provider Rating', value: '4.8 ★', color: 'bg-yellow-100 text-yellow-700' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className={`text-3xl font-black ${stat.color.split(' ')[1]}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 mb-6">Recent Earnings</h3>
                <div className="space-y-4">
                  {payments.length > 0 ? (
                    payments.slice(0, 5).map((pay, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                            <CurrencyDollarIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">M-Pesa Payment</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(pay.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <p className="font-black text-green-600 text-lg">+ KSh {pay.amount}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400 py-10 font-medium">No payments recorded yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Messenger</h2>
              <ChatList />
            </div>
          )}

          {activeTab === 'availability' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6 font-space">Schedule Management</h2>
              <div className="p-12 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                <CalendarIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold">Slot management coming soon.</p>
              </div>
            </div>
          )}

          {activeTab === 'verification' && (
            <VerificationForm providerId={providerData?._id} />
          )}

          {activeTab === 'payments' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Transaction History</h2>
              <div className="space-y-4">
                {payments.map((pay, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 border-b last:border-0">
                    <div>
                      <p className="font-bold text-gray-900">Payment ID: {pay._id?.substring(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-gray-500 font-medium">User phone: {pay.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900">KSh {pay.amount}</p>
                      <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">{pay.status || 'PAID'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
