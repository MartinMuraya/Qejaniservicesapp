import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function ReviewForm({ orderId, providerId, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [photos, setPhotos] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handlePhotoUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length + photos.length > 5) {
            toast.error('Maximum 5 photos allowed');
            return;
        }

        setUploading(true);
        try {
            // TODO: Implement actual photo upload to Cloudinary/S3
            // For now, using placeholder URLs
            const uploadedUrls = files.map((file, idx) =>
                URL.createObjectURL(file)
            );
            setPhotos([...photos, ...uploadedUrls]);
            toast.success('Photos uploaded');
        } catch (error) {
            toast.error('Failed to upload photos');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            toast.error('Please write a review');
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5001/api/reviews',
                {
                    orderId,
                    providerId,
                    rating,
                    comment,
                    photos
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            toast.success('Review submitted successfully!');
            setRating(0);
            setComment('');
            setPhotos([]);
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-4">Write a Review</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Rating */}
                <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="focus:outline-none"
                            >
                                {star <= (hoverRating || rating) ? (
                                    <StarIcon className="w-8 h-8 text-yellow-400" />
                                ) : (
                                    <StarOutline className="w-8 h-8 text-gray-300" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-sm font-medium mb-2">Your Review</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        maxLength={1000}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Share your experience with this provider..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        {comment.length}/1000 characters
                    </p>
                </div>

                {/* Photo Upload */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Photos (Optional)
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        disabled={uploading || photos.length >= 5}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />

                    {photos.length > 0 && (
                        <div className="mt-3 grid grid-cols-5 gap-2">
                            {photos.map((photo, idx) => (
                                <div key={idx} className="relative">
                                    <img
                                        src={photo}
                                        alt={`Upload ${idx + 1}`}
                                        className="w-full h-20 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={submitting || rating === 0}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
}
