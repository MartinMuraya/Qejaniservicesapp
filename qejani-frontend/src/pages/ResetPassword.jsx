import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();
    const { resetPassword, isLoading } = useAuthStore();

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        const res = await resetPassword(token, password);
        if (res.success) {
            toast.success('Password updated successfully!');
            navigate('/dashboard');
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
                <h2 className="text-4xl font-black text-center mb-6 text-gray-900 tracking-tighter">New Password</h2>
                <p className="text-gray-500 text-center mb-10 font-medium">
                    Choose a strong password you'll remember.
                </p>

                <form onSubmit={handleReset} className="space-y-6">
                    <div>
                        <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-green-500/20 font-bold text-gray-900 transition"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-green-500/20 font-bold text-gray-900 transition"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition disabled:opacity-70 shadow-xl shadow-blue-100"
                    >
                        {isLoading ? 'Updating...' : 'RESET PASSWORD'}
                    </button>
                </form>
            </div>
        </div>
    );
}
