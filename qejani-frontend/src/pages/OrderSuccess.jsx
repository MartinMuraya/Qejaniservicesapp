import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ShoppingBagIcon, HomeIcon } from '@heroicons/react/24/outline';
import confetti from 'canvas-confetti';

export default function OrderSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        // Trigger celebration confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[3rem] p-6 sm:p-12 text-center shadow-2xl border border-gray-100">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <CheckCircleIcon className="w-16 h-16" />
                </div>

                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Payment Received!</h1>
                <p className="text-gray-500 font-medium mb-12">
                    Your bookings have been confirmed. You'll receive real-time updates as providers accept your requests.
                </p>

                <div className="space-y-4">
                    <Link
                        to="/dashboard"
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-green-700 transition shadow-xl shadow-green-100"
                    >
                        <ShoppingBagIcon className="w-6 h-6" />
                        MY BOOKINGS
                    </Link>

                    <Link
                        to="/"
                        className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-700 py-5 rounded-2xl font-black text-lg hover:bg-gray-100 transition"
                    >
                        <HomeIcon className="w-6 h-6" />
                        BACK TO HOME
                    </Link>
                </div>

                <p className="mt-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Checkout ID: REQ-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
            </div>
        </div>
    );
}
