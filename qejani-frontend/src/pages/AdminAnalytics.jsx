import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CurrencyDollarIcon,
    UserGroupIcon,
    ClipboardDocumentCheckIcon,
    ArrowTrendingUpIcon,
    ShoppingBagIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AdminAnalytics() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/analytics/admin', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStats(res.data);
        } catch (err) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 font-bold text-gray-400">Loading Analytics...</div>;

    const statCards = [
        { name: 'Total Revenue', value: stats.totalRevenue, icon: CurrencyDollarIcon, color: 'bg-green-100 text-green-600', prefix: 'KSh ' },
        { name: 'Total Bookings', value: stats.bookingsCount.reduce((a, b) => a + b.count, 0), icon: ClipboardDocumentCheckIcon, color: 'bg-blue-100 text-blue-600' },
        { name: 'Active Providers', value: stats.topProviders.length, icon: UserGroupIcon, color: 'bg-purple-100 text-purple-600' },
        { name: 'Growth Rate', value: '12%', icon: ArrowTrendingUpIcon, color: 'bg-orange-100 text-orange-600' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Platform Analytics</h1>
                    <p className="text-gray-500 font-medium">Real-time performance metrics and business growth</p>
                </div>
                <button onClick={fetchStats} className="bg-white border p-3 rounded-xl shadow-sm hover:bg-gray-50 transition">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-gray-400" />
                </button>
            </div>

            {/* Stat Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4`}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.name}</p>
                        <p className="text-3xl font-black text-gray-900 mt-1">
                            {stat.prefix}{stat.value.toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Bookings */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-800">Recent Transactions</h3>
                        <button className="text-xs font-bold text-green-600 hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Provider</th>
                                    <th className="px-6 py-4">Service</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.recentBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50 transition group">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900 text-sm">{booking.user?.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{booking.user?.email}</p>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-700 text-sm">{booking.provider?.name}</td>
                                        <td className="px-6 py-4 font-medium text-gray-500 text-sm">{booking.service?.name}</td>
                                        <td className="px-6 py-4 font-black text-green-600 text-sm">KSh {booking.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Providers */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-6">
                    <h3 className="font-bold text-lg text-gray-800">Top Performing Providers</h3>
                    <div className="space-y-4">
                        {stats.topProviders.map((p, idx) => (
                            <div key={p._id} className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">
                                    #{idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 text-sm truncate">{p.name}</p>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{p.popularity} Bookings</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-green-600 text-sm">★ {p.averageRating?.toFixed(1) || '0.0'}</p>
                                    <p className="text-[10px] text-gray-400 font-bold">RATING</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black transition shadow-lg">
                        MANAGE ALL PROVIDERS
                    </button>
                </div>
            </div>
        </div>
    );
}
