import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrashIcon, TagIcon, ShoppingCartIcon, PlusIcon, MinusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export default function Cart() {
    const { cart, isLoading, fetchCart, removeFromCart, clearCart } = useCartStore();
    const [promoCode, setPromoCode] = useState('');

    useEffect(() => {
        fetchCart();
    }, []);

    const applyPromo = async (e) => {
        e.preventDefault();
        if (!promoCode) return;
        try {
            const res = await axios.post('http://localhost:5001/api/promo/apply', { code: promoCode }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success(res.data.message);
            fetchCart();
            setPromoCode('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid promo code');
        }
    };

    if (isLoading && !cart) return <div className="text-center py-20 font-bold text-gray-400">Loading your cart...</div>;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto transition-transform hover:rotate-12">
                    <ShoppingCartIcon className="w-12 h-12 text-gray-300" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Your cart looks a bit lonely</h2>
                <p className="text-gray-500 font-medium">Add some top-rated services to get started!</p>
                <Link to="/" className="inline-block bg-green-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-green-700 transition shadow-xl shadow-green-100 active:scale-95">
                    EXPLORE SERVICES
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <h1 className="text-4xl font-black text-gray-900 flex items-center gap-4">
                    <ShoppingCartIcon className="w-10 h-10 text-green-600" />
                    My Booking Cart
                </h1>
                <button
                    onClick={clearCart}
                    className="flex items-center gap-2 text-sm font-black text-red-500 hover:text-red-700 px-4 py-2 bg-red-50 rounded-xl transition active:scale-95"
                >
                    <XMarkIcon className="w-5 h-5" />
                    CLEAR ALL ITEMS
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Items List */}
                <div className="lg:col-span-2 space-y-6">
                    {cart.items.map((item) => (
                        <div key={item._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-wrap sm:flex-nowrap gap-6 items-center hover:shadow-md transition">
                            <div className="w-20 h-20 rounded-2xl bg-green-50 flex items-center justify-center font-black text-green-600 text-xl flex-shrink-0">
                                {item.service?.name?.charAt(0) || 'S'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-gray-900 truncate">{item.service?.name}</h3>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Provider: {item.provider?.name}</p>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    <div className="bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 flex items-center gap-2">
                                        <span className="text-xs font-black text-gray-400">📅</span>
                                        <span className="text-xs font-bold text-gray-600">{new Date(item.scheduledDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 flex items-center gap-2">
                                        <span className="text-xs font-black text-gray-400">⏰</span>
                                        <span className="text-xs font-bold text-gray-600">{item.scheduledTime}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-gray-50">
                                <div className="text-left sm:text-right">
                                    <p className="text-2xl font-black text-gray-900">KSh {item.price.toLocaleString()}</p>
                                    <p className="text-[10px] font-black text-green-600 uppercase tracking-tighter">Fixed Price</p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="p-3 text-red-100 bg-red-500 hover:bg-red-600 rounded-2xl transition shadow-lg shadow-red-100 active:scale-95"
                                >
                                    <TrashIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-8">
                        <h3 className="text-2xl font-black text-gray-900 mb-6">Payment Summary</h3>

                        <div className="space-y-4 border-b border-dashed pb-6 mb-6">
                            <div className="flex justify-between text-gray-600 font-bold">
                                <span>Subtotal ({cart.items.length} items)</span>
                                <span>KSh {cart.items.reduce((s, i) => s + i.price, 0).toLocaleString()}</span>
                            </div>
                            {cart.discount > 0 && (
                                <div className="flex justify-between text-green-600 font-bold">
                                    <span>Discount ({cart.promoCode})</span>
                                    <span>- KSh {cart.discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-400 font-bold text-sm">
                                <span>Platform Fee</span>
                                <span className="uppercase text-[10px]">Waived</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-8">
                            <span className="text-lg font-bold text-gray-900">Total Amount</span>
                            <span className="text-3xl font-black text-green-600">
                                KSh {cart.totalAmount.toLocaleString()}
                            </span>
                        </div>

                        {/* Promo Code Input */}
                        <form onSubmit={applyPromo} className="mb-8 relative">
                            <input
                                type="text"
                                placeholder="PROMO CODE"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-green-600 transition"
                            />
                            <TagIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-black transition active:scale-95"
                            >
                                APPLY
                            </button>
                        </form>

                        <Link to="/checkout" className="block w-full py-5 bg-green-600 text-white rounded-2xl font-black text-center text-xl hover:bg-green-700 transition shadow-2xl shadow-green-100 transform active:scale-[0.98]">
                            PROCEED TO CHECKOUT
                        </Link>

                        <p className="text-center text-[10px] text-gray-400 font-bold mt-6 uppercase tracking-widest flex items-center justify-center gap-2">
                            <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
                            SECURE M-PESA CHECKOUT
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
