import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useCartStore = create((set, get) => ({
    cart: null,
    isLoading: false,
    itemCount: 0,

    fetchCart: async () => {
        set({ isLoading: true });
        try {
            const res = await axios.get('http://localhost:5001/api/bookings/cart', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            set({
                cart: res.data,
                itemCount: res.data?.items?.length || 0,
                isLoading: false
            });
        } catch (err) {
            set({ isLoading: false });
            console.error('Failed to load cart');
        }
    },

    addToCart: async (providerId, serviceId, scheduledDate, scheduledTime, price) => {
        set({ isLoading: true });
        try {
            const res = await axios.post('http://localhost:5001/api/bookings/cart', {
                providerId,
                serviceId,
                scheduledDate,
                scheduledTime,
                price
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            set({
                cart: res.data,
                itemCount: res.data?.items?.length || 0,
                isLoading: false
            });
            toast.success('Added to cart');
            return { success: true };
        } catch (err) {
            set({ isLoading: false });
            toast.error(err.response?.data?.message || 'Failed to add to cart');
            return { success: false };
        }
    },

    removeFromCart: async (itemId) => {
        try {
            const res = await axios.delete(`http://localhost:5001/api/bookings/cart/${itemId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            set({
                cart: res.data,
                itemCount: res.data?.items?.length || 0
            });
            toast.success('Item removed');
        } catch (err) {
            toast.error('Failed to remove item');
        }
    },

    clearCart: async () => {
        try {
            await axios.delete('http://localhost:5001/api/bookings/cart/clear', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            set({ cart: null, itemCount: 0 });
            toast.success('Cart cleared');
        } catch (err) {
            toast.error('Failed to clear cart');
        }
    }
}));
