import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import axios from 'axios';
import FavoriteButton from '../components/FavoriteButton';

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/favorites', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(res.data);
        } catch (error) {
            toast.error('Failed to load favorites');
        } finally {
            setLoading(false);
        }
    };

    const handleFavoriteRemoved = () => {
        fetchFavorites(); // Refresh the list
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="text-center text-2xl">Loading favorites...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 text-center mb-12 tracking-tight">
                    MY FAVORITE <span className="text-green-600">PROS</span>
                </h1>

                {favorites.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-600 mb-6">
                            You haven't saved any favorites yet
                        </p>
                        <Link
                            to="/"
                            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                        >
                            Browse Services
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favorites.map((fav) => {
                            const provider = fav.provider;
                            return (
                                <div
                                    key={fav._id}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
                                >
                                    {/* Provider Image */}
                                    <div className="relative h-48 bg-gradient-to-r from-green-500 to-blue-500">
                                        <FavoriteButton
                                            providerId={provider._id}
                                            className="absolute top-3 right-3 bg-white"
                                        />
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                            {provider.name}
                                        </h3>

                                        <p className="text-gray-600 mb-2">
                                            {provider.service?.name || 'Service'}
                                        </p>

                                        {/* Rating */}
                                        {provider.averageRating > 0 && (
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="flex items-center">
                                                    <StarIcon className="w-5 h-5 text-yellow-400" />
                                                    <span className="ml-1 font-semibold">
                                                        {provider.averageRating.toFixed(1)}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    ({provider.totalReviews} reviews)
                                                </span>
                                            </div>
                                        )}

                                        <p className="text-2xl font-bold text-green-600 mb-4">
                                            KSh {provider.price?.toLocaleString()}
                                        </p>

                                        <Link
                                            to={`/book/${provider._id}`}
                                            className="block text-center bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                                        >
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
