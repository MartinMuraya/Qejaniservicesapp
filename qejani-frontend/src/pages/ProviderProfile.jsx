import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StarIcon, MapPinIcon, BriefcaseIcon, CalendarIcon, CheckBadgeIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import axios from 'axios';
import api from '../services/api';
import FavoriteButton from '../components/FavoriteButton';
import ReviewCard from '../components/ReviewCard';
import AvailabilityCalendar from '../components/AvailabilityCalendar';

export default function ProviderProfile() {
    const { id } = useParams();
    const { user } = useAuthStore();
    const [provider, setProvider] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');

    useEffect(() => {
        fetchProviderData();
    }, [id]);

    const fetchProviderData = async () => {
        try {
            const [providerRes, reviewsRes] = await Promise.all([
                api.getProviderById(id),
                api.getProviderReviews(id)
            ]);
            setProvider(providerRes.data);
            setReviews(reviewsRes.data.reviews || []);
        } catch (error) {
            toast.error('Failed to load provider profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-2xl">Loading...</div>;
    if (!provider) return <div className="text-center py-20 text-2xl">Provider not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header / Cover Area */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-green-600 to-blue-600 relative">
                <div className="max-w-7xl mx-auto px-4 h-full relative">
                    <div className="absolute -bottom-16 left-4 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 w-full md:w-auto">
                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-white overflow-hidden bg-white shadow-xl flex-shrink-0">
                            <img
                                src={provider.image ? `http://localhost:5001${provider.image}` : "/placeholder.jpg"}
                                alt={provider.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="pb-0 md:pb-4 text-center md:text-left text-gray-900 md:text-white drop-shadow-sm">
                            <h1 className="text-2xl md:text-4xl font-black">{provider.name}</h1>
                            <p className="text-sm md:text-lg opacity-90 font-bold">{provider.service?.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-24 md:mt-20">
                <div className="flex justify-end gap-3 mb-8 md:absolute md:top-4 md:right-4">
                    <Link
                        to={`/chat/${[user?._id || user?.id, provider._id].sort().join('_')}`}
                        className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2 hover:bg-gray-50 transition font-bold text-gray-700"
                    >
                        <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-600" />
                        <span className="hidden sm:inline">Message</span>
                    </Link>
                    <FavoriteButton providerId={provider._id} className="bg-white" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Info & Booking */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Tabs */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-x-auto flex border-b no-scrollbar">
                        {['about', 'portfolio', 'reviews', 'availability'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 min-w-[100px] py-4 text-center font-bold capitalize transition ${activeTab === tab ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        {activeTab === 'about' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">About Me</h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        {provider.bio || "No bio provided yet."}
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
                                    <div className="flex items-center gap-3">
                                        <BriefcaseIcon className="w-6 h-6 text-green-600" />
                                        <div>
                                            <p className="text-sm text-gray-400">Experience</p>
                                            <p className="font-bold">{provider.experience || 0} Years</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StarIcon className="w-6 h-6 text-yellow-400" />
                                        <div>
                                            <p className="text-sm text-gray-400">Rating</p>
                                            <p className="font-bold">{provider.averageRating?.toFixed(1) || 0} / 5.0</p>
                                        </div>
                                    </div>
                                </div>

                                {provider.certifications?.length > 0 && (
                                    <div className="pt-6 border-t">
                                        <h3 className="font-bold mb-4 flex items-center gap-2">
                                            <CheckBadgeIcon className="w-5 h-5 text-blue-500" />
                                            Certifications
                                        </h3>
                                        <div className="space-y-3">
                                            {provider.certifications.map((cert, idx) => (
                                                <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                                    <div>
                                                        <p className="font-bold">{cert.name}</p>
                                                        <p className="text-sm text-gray-500">{cert.issuedBy}</p>
                                                    </div>
                                                    <p className="text-sm text-gray-400">
                                                        {cert.issuedDate ? new Date(cert.issuedDate).getFullYear() : ''}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'portfolio' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {provider.portfolio?.length > 0 ? (
                                    provider.portfolio.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`Portfolio ${idx}`}
                                            className="w-full h-48 object-cover rounded-xl cursor-pointer hover:opacity-90 transition"
                                        />
                                    ))
                                ) : (
                                    <p className="col-span-full text-center text-gray-500 py-12">No portfolio items yet.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold">Reviews ({provider.totalReviews})</h2>
                                </div>
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <ReviewCard key={review._id} review={review} />
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-12">No reviews yet.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'availability' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-4">Check Availability</h2>
                                <AvailabilityCalendar providerId={provider._id} providerPrice={provider.price} serviceId={provider.service?._id} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Pricing & Quick Stats */}
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm p-8 sticky top-8">
                        <div className="mb-6">
                            <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Standard Price</p>
                            <p className="text-4xl font-black text-green-600">KSh {provider.price?.toLocaleString()}</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPinIcon className="w-5 h-5" />
                                <span>Available in {provider.serviceAreas?.join(', ') || 'Main City'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <CalendarIcon className="w-5 h-5" />
                                <span>Mon - Fri: {provider.workingHours?.monday?.start || '08:00'} - {provider.workingHours?.monday?.end || '18:00'}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {provider.badges?.map(badge => (
                                <span key={badge} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200 uppercase">
                                    {badge.replace('-', ' ')}
                                </span>
                            ))}
                        </div>

                        <Link
                            to={`/book/${provider._id}`}
                            className="block w-full text-center bg-green-600 text-white py-4 rounded-xl font-black text-lg hover:bg-green-700 transition transform hover:scale-[1.02] shadow-lg"
                        >
                            Book Service Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
