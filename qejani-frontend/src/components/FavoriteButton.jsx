import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function FavoriteButton({ providerId, className = '' }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkFavorite();
    }, [providerId]);

    const checkFavorite = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await axios.get(
                `http://localhost:5001/api/favorites/check/${providerId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setIsFavorite(res.data.isFavorite);
        } catch (error) {
            // Silently fail if not authenticated
        }
    };

    const toggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to save favorites');
            return;
        }

        setLoading(true);
        try {
            if (isFavorite) {
                await axios.delete(
                    `http://localhost:5001/api/favorites/${providerId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setIsFavorite(false);
                toast.success('Removed from favorites');
            } else {
                await axios.post(
                    'http://localhost:5001/api/favorites',
                    { providerId },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setIsFavorite(true);
                toast.success('Added to favorites');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update favorites');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            disabled={loading}
            className={`p-2 rounded-full hover:bg-gray-100 transition ${className}`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
            {isFavorite ? (
                <HeartSolid className="w-6 h-6 text-red-500" />
            ) : (
                <HeartOutline className="w-6 h-6 text-gray-400 hover:text-red-500" />
            )}
        </button>
    );
}
