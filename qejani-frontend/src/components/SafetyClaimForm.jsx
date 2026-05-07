import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldCheckIcon, CameraIcon } from '@heroicons/react/24/outline';
import ImageUpload from './ImageUpload';

export default function SafetyClaimForm({ orderId }) {
    const [claimType, setClaimType] = useState('unprofessional');
    const [description, setDescription] = useState('');
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description) return toast.error('Please describe the issue');

        setLoading(true);
        try {
            await axios.post('http://localhost:5001/api/safety/claim', {
                orderId,
                claimType,
                description,
                photos
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('Claim submitted. Our safety team will investigate.');
            setDescription('');
            setPhotos([]);
        } catch (err) {
            toast.error('Failed to submit claim');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-8 border border-red-50 shadow-xl max-w-2xl mx-auto mt-12">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-red-100 rounded-2xl text-red-600">
                    <ShieldCheckIcon className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 leading-tight">Qejani Safety Claim</h2>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Submit a guarantee claim</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">ISSUE CATEGORY</label>
                    <select
                        value={claimType}
                        onChange={(e) => setClaimType(e.target.value)}
                        className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-4 font-bold text-gray-700 focus:ring-2 focus:ring-red-500 transition"
                    >
                        <option value="damage">Property Damage</option>
                        <option value="theft">Missing Items/Theft</option>
                        <option value="unprofessional">Unprofessional Behavior</option>
                        <option value="missed-service">Service Not Performed</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">DESCRIPTION</label>
                    <textarea
                        rows="4"
                        placeholder="Tell us exactly what happened..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-4 font-bold text-gray-700 focus:ring-2 focus:ring-red-500 transition"
                    />
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">EVIDENCE PHOTOS</label>
                    <ImageUpload images={photos} setImages={setPhotos} max={4} />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition shadow-2xl flex items-center justify-center gap-2"
                >
                    {loading ? 'Submitting...' : 'SUBMIT SAFETY CLAIM'}
                </button>

                <p className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-tighter">
                    Claims are subject to the Qejani Guarantee Terms & Conditions
                </p>
            </form>
        </div>
    );
}
