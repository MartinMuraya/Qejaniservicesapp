import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import {
  ClipboardDocumentCheckIcon,
  MapPinIcon,
  CalendarIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  ShieldExclamationIcon,
  GiftIcon,
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';
import SafetyClaimForm from '../components/SafetyClaimForm';
import ChatList from '../components/ChatList';

export default function UserDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  const [selectedOrderForSafety, setSelectedOrderForSafety] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/orders/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(user.referralCode);
    toast.success('Referral code copied!');
  };

  if (loading) return <div className="text-center py-20 font-bold text-gray-400">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
              <UserIcon className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Welcome, {user.name}</h1>
              <p className="text-gray-500 font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-green-600 text-white p-4 rounded-2xl shadow-lg border border-green-500 flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <GiftIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest opacity-80 leading-none mb-1">Loyalty Points</p>
                <p className="text-xl font-black">{user.loyaltyPoints || 0} PTS</p>
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
              { id: 'bookings', name: 'My Bookings', icon: ClipboardDocumentCheckIcon },
              { id: 'messages', name: 'Messages', icon: ChatBubbleLeftRightIcon },
              { id: 'referrals', name: 'Refer & Earn', icon: GiftIcon },
              { id: 'claims', name: 'Safety Claims', icon: ShieldExclamationIcon },
              { id: 'settings', name: 'Settings', icon: Cog6ToothIcon },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'settings') navigate('/settings');
                  else setActiveTab(tab.id);
                }}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition ${activeTab === tab.id ? 'bg-green-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl">
            <h4 className="font-black text-xs uppercase tracking-widest mb-2 opacity-80">Referral Program</h4>
            <p className="text-sm font-medium mb-4">Share Qejani with friends and earn 50 points per signup!</p>
            <div className="bg-white/10 p-3 rounded-xl border border-white/20 flex justify-between items-center group">
              <span className="font-black tracking-widest">{user.referralCode || 'REFCODE'}</span>
              <button onClick={copyReferral} className="text-[10px] font-black underline uppercase hover:text-green-300">Copy</button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-wrap lg:flex-nowrap gap-6 items-center hover:shadow-md transition">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center font-black text-blue-600 text-xl">
                      {order.service?.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900">{order.service?.name}</h3>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Provider: {order.provider?.name}</p>
                      <div className="flex gap-4 mt-2">
                        <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
                          📅 {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
                          💵 KSh {order.amount}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-end">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter self-center mr-2 ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                        {order.status}
                      </span>

                      {order.status === 'completed' && (
                        <button
                          onClick={() => setSelectedOrderForReview(order)}
                          className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md hover:bg-green-700 transition"
                        >
                          RATE & REVIEW
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedOrderForSafety(order)}
                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
                        title="Report issue"
                      >
                        <ShieldExclamationIcon className="w-5 h-5" />
                      </button>

                      <Link
                        to={`/chat/${[user?._id || user?.id, order.provider?._id || order.provider].sort().join('_')}`}
                        className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition"
                      >
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 font-bold">No bookings found yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Active Conversations</h2>
              <ChatList />
            </div>
          )}

          {activeTab === 'referrals' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center space-y-8">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <GiftIcon className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-900">Invite Your Friend</h2>
                <p className="text-gray-500 font-medium">Earn loyalty points when they sign up using your code.</p>
              </div>
              <div className="max-w-xs mx-auto p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex justify-between items-center">
                <span className="text-2xl font-black text-gray-900 tracking-widest">{user.referralCode}</span>
                <button onClick={copyReferral} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Copy</button>
              </div>
            </div>
          )}

          {activeTab === 'claims' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-900">Safety Claims</h2>
                <button className="text-xs font-black text-red-600 underline">Claim Policy</button>
              </div>
              <p className="text-gray-400 font-medium">To submit a claim, go to your Bookings and click the safety icon next to the order.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedOrderForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">Review Service</h3>
              <button onClick={() => setSelectedOrderForReview(null)} className="text-gray-400 hover:text-black">✕</button>
            </div>
            <div className="p-6">
              <ReviewForm
                providerId={selectedOrderForReview.provider?._id || selectedOrderForReview.provider}
                orderId={selectedOrderForReview._id}
                onSuccess={() => {
                  setSelectedOrderForReview(null);
                  fetchOrders();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {selectedOrderForSafety && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">Submit Safety Claim</h3>
              <button onClick={() => setSelectedOrderForSafety(null)} className="text-gray-400 hover:text-black">✕</button>
            </div>
            <div className="p-6">
              <SafetyClaimForm
                orderId={selectedOrderForSafety._id}
                onSuccess={() => setSelectedOrderForSafety(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
