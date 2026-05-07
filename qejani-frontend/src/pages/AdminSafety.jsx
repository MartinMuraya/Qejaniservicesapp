import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldExclamationIcon, EyeIcon, BanknotesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AdminSafety() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [compensation, setCompensation] = useState(0);

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            // In a real app, this would be an admin-only route to get all claims
            const res = await axios.get('http://localhost:5001/api/safety/my-claims', { // Temporary: using my-claims for demo if no admin one exists
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setClaims(res.data);
        } catch (err) {
            toast.error('Failed to load claims');
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id, status) => {
        try {
            await axios.put(`http://localhost:5001/api/safety/${id}`, {
                status,
                compensationAmount: compensation
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success(`Claim ${status}`);
            fetchClaims();
            setSelectedClaim(null);
        } catch (err) {
            toast.error('Update failed');
        }
    };

    if (loading) return <div className="text-center py-20 font-bold text-gray-400">Loading safety claims...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            <div className="flex justify-between items-end border-b pb-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900">Safety & Guarantee</h1>
                    <p className="text-gray-500 font-medium italic">Dispute resolution and insurance claims</p>
                </div>
                <div className="bg-red-50 px-6 py-2 rounded-2xl border border-red-100 flex items-center gap-2">
                    <ShieldExclamationIcon className="w-5 h-5 text-red-600" />
                    <span className="font-black text-red-600 text-sm">{claims.filter(c => c.status === 'pending').length} ACTIVE</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {claims.map((claim) => (
                    <div key={claim._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 font-black">
                                !
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{claim.claimType.toUpperCase()}</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-none mt-1">Order: {claim.order?.id || claim.order}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Status</p>
                                <span className={`text-xs font-black uppercase ${claim.status === 'resolved' ? 'text-green-600' :
                                        claim.status === 'rejected' ? 'text-red-600' : 'text-orange-500'
                                    }`}>
                                    {claim.status}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedClaim(claim)}
                                className="bg-red-600 text-white p-3 rounded-xl hover:bg-black transition flex items-center gap-2"
                            >
                                <EyeIcon className="w-5 h-5" />
                                <span className="text-xs font-black px-2">INVESTIGATE</span>
                            </button>
                        </div>
                    </div>
                ))}

                {claims.length === 0 && (
                    <div className="text-center py-20 opacity-30">
                        <ShieldExclamationIcon className="w-16 h-16 mx-auto mb-4" />
                        <p className="font-black text-xl">NO PENDING CLAIMS</p>
                    </div>
                )}
            </div>

            {/* Investigation Modal */}
            {selectedClaim && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-white rounded-[40px] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-8 border-b flex justify-between items-center bg-red-50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">Claim: {selectedClaim.claimType.toUpperCase()}</h3>
                                <p className="text-xs text-red-600 font-black uppercase tracking-widest mt-1">Resolution Protocol Active</p>
                            </div>
                            <button onClick={() => setSelectedClaim(null)} className="text-gray-400 hover:text-black text-2xl font-black">✕</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h4 className="font-black text-xs uppercase tracking-widest text-gray-400">Claim Details</h4>
                                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                    <p className="text-gray-800 font-medium leading-relaxed">{selectedClaim.description}</p>
                                </div>

                                <h4 className="font-black text-xs uppercase tracking-widest text-gray-400">Evidence</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {selectedClaim.photos.map((url, i) => (
                                        <div key={i} className="rounded-2xl overflow-hidden aspect-square shadow-md border-2 border-white">
                                            <img src={url} alt="Evidence" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-green-50 p-8 rounded-[32px] border border-green-100">
                                    <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                                        <BanknotesIcon className="w-5 h-5 text-green-600" />
                                        Compensation Logic
                                    </h4>
                                    <div className="space-y-4">
                                        <p className="text-sm font-medium text-gray-600">Enter the amount to be refunded or paid out to the user.</p>
                                        <input
                                            type="number"
                                            value={compensation}
                                            onChange={(e) => setCompensation(e.target.value)}
                                            placeholder="Amount in KSh"
                                            className="w-full bg-white border-green-200 rounded-2xl py-4 px-4 font-black text-green-700 focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleResolve(selectedClaim._id, 'resolved')}
                                        className="bg-green-600 text-white py-6 rounded-3xl font-black flex flex-col items-center gap-2 hover:bg-green-700 transition shadow-lg group"
                                    >
                                        <CheckCircleIcon className="w-8 h-8 group-hover:scale-110 transition" />
                                        RESOLVE
                                    </button>
                                    <button
                                        onClick={() => handleResolve(selectedClaim._id, 'rejected')}
                                        className="bg-gray-900 text-white py-6 rounded-3xl font-black flex flex-col items-center gap-2 hover:bg-black transition shadow-lg group"
                                    >
                                        <span className="text-2xl">✕</span>
                                        DISMISS
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
