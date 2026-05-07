import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { BellIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function NotificationDropdown() {
    const { user } = useAuthStore();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const socketRef = useRef();

    useEffect(() => {
        if (user) {
            fetchNotifications();

            // Setup socket
            socketRef.current = io('http://localhost:5001');
            socketRef.current.emit('join', user._id || user.id);

            socketRef.current.on('notification', (notif) => {
                setNotifications(prev => [notif, ...prev]);
                setUnreadCount(prev => prev + 1);
                toast.success(`New notification: ${notif.title}`, {
                    icon: '🔔',
                    position: 'bottom-right'
                });
            });

            return () => socketRef.current.disconnect();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/notifications', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.isRead).length);
        } catch (err) {
            console.error("Failed to load notifications");
        }
    };

    const markRead = async (id) => {
        try {
            await axios.put(`http://localhost:5001/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            toast.error('Failed to update notification');
        }
    };

    const markAllRead = async () => {
        try {
            await axios.put('http://localhost:5001/api/notifications/read-all', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            toast.success('All notifications marked as read');
        } catch (err) {
            toast.error('Failed to mark all as read');
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition"
            >
                <BellIcon className="w-7 h-7" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden transform origin-top-right transition-all">
                        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Notifications</h3>
                            <button
                                onClick={markAllRead}
                                className="text-xs text-green-600 font-bold hover:underline"
                            >
                                Mark all read
                            </button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <div
                                        key={notif._id}
                                        onClick={() => markRead(notif._id)}
                                        className={`p-4 border-b last:border-0 hover:bg-gray-50 transition cursor-pointer ${!notif.isRead ? 'bg-green-50/30' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`p-2 rounded-xl h-fit ${notif.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                                                notif.type === 'payment' ? 'bg-green-100 text-green-600' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                {notif.type === 'message' ? <ChatBubbleLeftRightIcon className="w-4 h-4" /> : <BellIcon className="w-4 h-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-bold truncate ${!notif.isRead ? 'text-gray-900' : 'text-gray-500'}`}>
                                                    {notif.title}
                                                </p>
                                                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{notif.message}</p>
                                                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">
                                                    {new Date(notif.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center">
                                    <BellIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                    <p className="text-sm text-gray-400 font-medium">All caught up!</p>
                                </div>
                            )}
                        </div>

                        <Link
                            to="/notifications"
                            className="block p-3 text-center text-xs font-bold text-gray-500 hover:bg-gray-50 border-t"
                            onClick={() => setIsOpen(false)}
                        >
                            View All Notifications
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
