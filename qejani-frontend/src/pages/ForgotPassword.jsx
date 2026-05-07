import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const { forgotPassword, isLoading } = useAuthStore();

    const handleForgot = async (e) => {
        e.preventDefault();
        const res = await forgotPassword(email);
        if (res.success) {
            setSubmitted(true);
            toast.success('Reset link sent to your email!');
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
                <h2 className="text-4xl font-black text-center mb-6 text-gray-900 tracking-tighter">Forgot Password?</h2>

                {!submitted ? (
                    <>
                        <p className="text-gray-500 text-center mb-8 font-medium">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        <form onSubmit={handleForgot} className="space-y-6">
                            <div>
                                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-green-500/20 font-bold text-gray-900 transition"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-green-600 text-white py-5 rounded-xl font-black text-lg hover:bg-green-700 transition disabled:opacity-70 shadow-xl shadow-green-100"
                            >
                                {isLoading ? 'Sending...' : 'SEND RESET LINK'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-gray-900 font-bold text-xl mb-4">Check your email</p>
                        <p className="text-gray-500 font-medium mb-8">
                            We've sent a password recovery link to <span className="text-gray-900 font-black">{email}</span>.
                            Please check your inbox and spam folder.
                        </p>
                    </div>
                )}

                <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                    <Link to="/login" className="text-green-600 font-black hover:underline uppercase tracking-widest text-xs">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
