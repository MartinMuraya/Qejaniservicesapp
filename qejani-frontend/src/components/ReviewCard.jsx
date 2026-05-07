import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

export default function ReviewCard({ review, onHelpful }) {
    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    star <= rating ? (
                        <StarIcon key={star} className="w-5 h-5 text-yellow-400" />
                    ) : (
                        <StarOutline key={star} className="w-5 h-5 text-gray-300" />
                    )
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h4 className="font-bold text-lg">{review.user?.name || 'Anonymous'}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Comment */}
            <p className="text-gray-700">{review.comment}</p>

            {/* Photos */}
            {review.photos && review.photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                    {review.photos.map((photo, idx) => (
                        <img
                            key={idx}
                            src={photo}
                            alt={`Review photo ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90"
                        />
                    ))}
                </div>
            )}

            {/* Provider Response */}
            {review.providerResponse && (
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                    <p className="font-semibold text-sm text-green-800 mb-1">
                        Provider Response
                    </p>
                    <p className="text-gray-700 text-sm">{review.providerResponse.text}</p>
                    <p className="text-xs text-gray-500 mt-2">
                        {new Date(review.providerResponse.respondedAt).toLocaleDateString()}
                    </p>
                </div>
            )}

            {/* Helpful Button */}
            <div className="flex items-center gap-4 pt-2 border-t">
                <button
                    onClick={() => onHelpful && onHelpful(review._id)}
                    className="text-sm text-gray-600 hover:text-green-600 flex items-center gap-1"
                >
                    <span>👍</span>
                    <span>Helpful ({review.helpfulVotes || 0})</span>
                </button>
            </div>
        </div>
    );
}
