import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBagIcon, PhoneIcon, ShieldCheckIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useCartStore } from '../store/cartStore';

export default function Checkout() {
    const { cart, isLoading, fetchCart, clearCart } = useCartStore();
    const [phone, setPhone] = useState('254');
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!cart) fetchCart();
    }, []);

    if (isLoading && !cart) return <div className="text-center py-20 font-bold text-gray-400">Loading checkout...</div>;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-black text-gray-900">Your cart is empty</h2>
                <button onClick={() => navigate('/')} className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl font-bold">
                    Go Back Home
                </button>
            </div>
        );
    }

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!/^254\d{9}$/.test(phone)) {
            return toast.error('Please enter a valid M-Pesa number (254XXXXXXXXX)');
        }

        setIsProcessing(true);
        try {
            // This would trigger a bulk STK push or multiple push requests
            // For now, let's simulate the process using the existing mpesa controller
            // Ideally, we'd have a specific checkoutCart endpoint
            const res = await axios.post('http://localhost:5001/api/mpesa/stkpush', {
                phone,
                amount: cart.totalAmount,
                isCartCheckout: true // Signal to backend to convert cart to orders
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (res.data.success) {
                toast.success('STK Push sent! Please enter your PIN.');
                // In a real app, we'd poll for status, here we anticipate success for demo
                // Clear cart and redirect after a delay if success
                setTimeout(() => {
                    clearCart();
                    navigate('/order-success');
                    toast.success('Orders confirmed successfully!');
                }, 10000);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Checkout failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-black text-gray-900 mb-12 flex items-center gap-4">
                <ShieldCheckIcon className="w-10 h-10 text-blue-600" />
                Secure Checkout
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Summary */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                            <ShoppingBagIcon className="w-5 h-5 text-green-600" />
                            Booking Summary
                        </h2>
                        <div className="space-y-4">
                            {cart.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="font-black text-gray-900">{item.service?.name}</p>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                                            {item.provider?.name} • {item.scheduledTime}
                                        </p>
                                    </div>
                                    <p className="font-black text-gray-900">KSh {item.price.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100 space-y-2">
                            <div className="flex justify-between font-bold text-gray-500">
                                <span>Subtotal</span>
                                <span>KSh {cart.items.reduce((s, i) => s + i.price, 0).toLocaleString()}</span>
                            </div>
                            {cart.discount > 0 && (
                                <div className="flex justify-between font-bold text-green-600">
                                    <span>Discount</span>
                                    <span>- KSh {cart.discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-2xl font-black text-gray-900 pt-4">
                                <span>Total</span>
                                <span className="text-green-600 underline underline-offset-8">KSh {cart.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100 flex gap-4">
                        <ShieldCheckIcon className="w-8 h-8 text-blue-600 flex-shrink-0" />
                        <div>
                            <p className="font-black text-blue-900 text-sm italic">Qejani Safety Guarantee</p>
                            <p className="text-xs text-blue-700 font-medium">Your payment is held securely and only released to providers once the service is completed and you're satisfied.</p>
                        </div>
                    </div>
                </div>

                {/* Right: Payment */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
                        <h2 className="text-xl font-black text-gray-800 mb-8">Payment Details</h2>

                        <div className="mb-8">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Pay via M-Pesa</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="2547XXXXXXXX"
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-5 pl-14 pr-4 text-xl font-black focus:border-green-600 focus:ring-0 transition"
                                />
                                <PhoneIcon className="w-6 h-6 text-gray-400 absolute left-5 top-1/2 -translate-y-1/2" />
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold mt-3 uppercase tracking-tighter">Enter number starting with 254</p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className="w-full bg-green-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-green-700 transition shadow-2xl shadow-green-100 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        PROCESSING...
                                    </>
                                ) : (
                                    <>
                                        <CreditCardIcon className="w-6 h-6" />
                                        PAY KSh {cart.totalAmount.toLocaleString()}
                                    </>
                                )}
                            </button>

                            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                Instant Confirmation via M-Pesa Express
                            </p>
                        </div>
                    </div>

                    <div className="p-4 flex items-center justify-center gap-6 grayscale opacity-50">
                        <img src="/mpesa-logo.png" alt="M-Pesa" className="h-8 object-contain" onError={(e) => e.target.style.display = 'none'} />
                        <span className="font-black text-gray-400 italic">SECURE GATEWAY</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
