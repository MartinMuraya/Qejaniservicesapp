import { useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ImageUpload({ images, setImages, max = 5 }) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);

        if (images.length + files.length > max) {
            toast.error(`Maximum ${max} images allowed`);
            return;
        }

        setUploading(true);
        try {
            // PROMPT: In a real app, upload to Cloudinary/S3 here
            // For now, creating local blob URLs for demonstration
            const newUrls = files.map(file => URL.createObjectURL(file));
            setImages([...images, ...newUrls]);
        } catch (err) {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((url, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border">
                        <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                        <button
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-md"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {images.length < max && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition group">
                        <PhotoIcon className="w-10 h-10 text-gray-300 group-hover:text-green-400" />
                        <span className="text-xs font-bold text-gray-400 group-hover:text-green-600 mt-2">Add Photo</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </label>
                )}
            </div>
            <p className="text-xs text-gray-400">Supported formats: JPG, PNG. Max {max} files.</p>
        </div>
    );
}
