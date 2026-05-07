import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ChevronLeftIcon, ChevronRightIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '../store/cartStore';

export default function AvailabilityCalendar({ providerId, providerPrice, serviceId }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addToCart } = useCartStore();

    useEffect(() => {
        fetchAvailability();
    }, [currentMonth]);

    const fetchAvailability = async () => {
        setLoading(true);
        try {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();
            const startDate = new Date(year, month, 1).toISOString();
            const endDate = new Date(year, month + 1, 0).toISOString();

            const res = await axios.get(`http://localhost:5001/api/providers/${providerId}/availability`, {
                params: { startDate, endDate }
            });
            setAvailability(res.data);
        } catch (error) {
            toast.error('Failed to load availability');
        } finally {
            setLoading(false);
        }
    };

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="grid grid-cols-7 mb-2">
                {days.map(day => (
                    <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const totalDays = daysInMonth(year, month);
        const startOffset = firstDayOfMonth(year, month);
        const cells = [];

        // Empty cells for offset
        for (let i = 0; i < startOffset; i++) {
            cells.push(<div key={`empty-${i}`} className="h-16 border border-gray-50 bg-gray-50/30"></div>);
        }

        // Actual days
        for (let day = 1; day <= totalDays; day++) {
            const dateString = new Date(year, month, day).toISOString().split('T')[0];
            const dayAvailability = availability.find(a => new Date(a.date).toISOString().split('T')[0] === dateString);
            const isAvailable = dayAvailability?.timeSlots.some(slot => slot.status === 'available');
            const isPast = new Date(year, month, day + 1) < new Date();

            cells.push(
                <button
                    key={day}
                    disabled={isPast || !isAvailable}
                    onClick={() => setSelectedDate(dayAvailability)}
                    className={`h-16 border relative flex flex-col items-center justify-center transition p-1 ${selectedDate?._id === dayAvailability?._id ? 'bg-green-600 border-green-600 text-white z-10 shadow-lg' :
                        isPast ? 'bg-gray-50 text-gray-300 cursor-not-allowed' :
                            isAvailable ? 'hover:bg-green-50 hover:border-green-300 cursor-pointer' : 'bg-red-50 text-red-300 cursor-not-allowed'
                        }`}
                >
                    <span className="text-sm font-bold">{day}</span>
                    {isAvailable && !isPast && (
                        <span className={`w-1.5 h-1.5 rounded-full mt-1 ${selectedDate?._id === dayAvailability?._id ? 'bg-white' : 'bg-green-500'}`}></span>
                    )}
                </button>
            );
        }

        return <div className="grid grid-cols-7 border border-gray-100 rounded-xl overflow-hidden shadow-sm">{cells}</div>;
    };

    const handleAddToCart = async (slot) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to add to cart');
            return;
        }

        const success = await addToCart(
            providerId,
            serviceId,
            selectedDate.date,
            slot.start,
            providerPrice
        );

        if (success) {
            setSelectedDate(null);
        }
    };

    const handleBookNow = async (slot) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to book');
            return;
        }

        try {
            await axios.post('http://localhost:5001/api/bookings/schedule', {
                providerId,
                serviceId,
                amount: providerPrice,
                scheduledDate: selectedDate.date,
                scheduledTime: slot.start
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Successfully booked!');
            fetchAvailability(); // Refresh
            setSelectedDate(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
        }
    };

    return (
        <div className="bg-white rounded-2xl p-4">
            {renderHeader()}
            {renderDays()}
            {renderCells()}

            {selectedDate && (
                <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-4">
                        Available Slots for {new Date(selectedDate.date).toLocaleDateString()}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedDate.timeSlots.map((slot, idx) => (
                            <div key={idx} className={`p-4 rounded-2xl border flex flex-col gap-3 ${slot.status === 'available' ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-50 opacity-60'}`}>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm font-black ${slot.status === 'available' ? 'text-gray-900' : 'text-gray-400'}`}>{slot.start}</span>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${slot.status === 'available' ? 'bg-green-50 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                        {slot.status === 'available' ? 'AVAILABLE' : 'BOOKED'}
                                    </span>
                                </div>
                                {slot.status === 'available' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(slot)}
                                            className="flex-1 py-1.5 bg-gray-50 text-gray-700 rounded-xl text-[10px] font-black hover:bg-gray-100 transition border border-gray-200 flex items-center justify-center gap-1 active:scale-95"
                                        >
                                            <ShoppingCartIcon className="w-3.5 h-3.5" />
                                            + CART
                                        </button>
                                        <button
                                            onClick={() => handleBookNow(slot)}
                                            className="flex-1 py-1.5 bg-green-600 text-white rounded-xl text-[10px] font-black hover:bg-green-700 transition shadow-lg shadow-green-100 active:scale-95"
                                        >
                                            BOOK NOW
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
