import { useState } from 'react';
import { ExclamationTriangleIcon, BoltIcon, MapPinIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UrgentSOSButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUrgentRequest = async (isSos = false) => {
        setLoading(true);
        try {
            // Get user location
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;

                await axios.post('http://localhost:5001/api/urgent/request', {
                    serviceId: 'fallback', // Backend will now auto-detect a valid service if this is invalid
                    lat: latitude,
                    lng: longitude,
                    isSos
                }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });

                toast.success(isSos ? 'SOS Alert Sent! Help is coming.' : 'Urgent request broadcasted!');
                setIsOpen(false);
            }, (err) => {
                toast.error('Location access required for urgent services');
            });
        } catch (err) {
            toast.error('Failed to send request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition transform hover:scale-110 ${isOpen ? 'bg-gray-900 rotate-45' : 'bg-red-600 animate-pulse'
                    }`}
            >
                <span className="text-white text-3xl font-black">{isOpen ? '+' : '!'}</span>
            </button>

            {isOpen && (
                <div className="absolute bottom-20 right-0 w-72 space-y-4">
                    <div className="bg-white rounded-3xl p-6 shadow-2xl border border-red-50 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-3 text-red-600">
                            <ExclamationTriangleIcon className="w-6 h-6" />
                            <h3 className="font-bold">Need Help Now?</h3>
                        </div>

                        <button
                            onClick={() => handleUrgentRequest(true)}
                            disabled={loading}
                            className="w-full bg-red-600 text-white p-4 rounded-2xl font-black text-xs hover:bg-red-700 transition flex items-center justify-center gap-2 shadow-lg"
                        >
                            <BoltIcon className="w-5 h-5" />
                            SEND SOS ALERT
                        </button>

                        <button
                            onClick={() => handleUrgentRequest(false)}
                            disabled={loading}
                            className="w-full bg-orange-500 text-white p-4 rounded-2xl font-black text-xs hover:bg-orange-600 transition flex items-center justify-center gap-2 shadow-lg"
                        >
                            <MapPinIcon className="w-5 h-5" />
                            REQUEST URGENT SERVICE
                        </button>

                        <p className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-tighter">
                            Extra fees apply for urgent bookings
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
