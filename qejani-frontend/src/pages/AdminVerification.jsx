import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheckIcon, EyeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AdminVerification() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/verification/all', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRequests(res.data);
        } catch (err) {
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5001/api/verification/${id}`, { status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success(`Request ${status}`);
            fetchRequests();
            setSelectedRequest(null);
        } catch (err) {
            toast.error('Update failed');
        }
    };

    if (loading) return <div className="text-center py-20 font-bold text-gray-400">Loading verification requests...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            <div className="flex justify-between items-end border-b pb-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900">Provider Verifications</h1>
                    <p className="text-gray-500 font-medium italic">Identity and document verification queue</p>
                </div>
                <div className="bg-blue-50 px-6 py-2 rounded-2xl border border-blue-100 flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                    <span className="font-black text-blue-600 text-sm">{requests.filter(r => r.status === 'pending').length} PENDING</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {requests.map((request) => (
                    <div key={request._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-bold text-gray-400">
                                {request.provider?.name?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{request.provider?.name}</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{request.provider?.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Status</p>
                                <span className={`text-xs font-black uppercase ${request.status === 'approved' ? 'text-green-600' :
                                        request.status === 'rejected' ? 'text-red-600' : 'text-orange-500'
                                    }`}>
                                    {request.status}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(request)}
                                className="bg-gray-900 text-white p-3 rounded-xl hover:bg-black transition flex items-center gap-2"
                            >
                                <EyeIcon className="w-5 h-5" />
                                <span className="text-xs font-black px-2">REVIEW</span>
                            </button>
                        </div>
                    </div>
                ))}

                {requests.length === 0 && (
                    <div className="text-center py-20 opacity-30">
                        <ShieldCheckIcon className="w-16 h-16 mx-auto mb-4" />
                        <p className="font-black text-xl">QUEUE EMPTY</p>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-white rounded-[40px] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-8 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">Review: {selectedRequest.provider?.name}</h3>
                                <p className="text-xs text-gray-500 font-black uppercase tracking-widest mt-1">Provider ID: {selectedRequest.provider?._id}</p>
                            </div>
                            <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-black text-2xl font-black">✕</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h4 className="font-black text-xs uppercase tracking-widest text-gray-400">Submitted Documents</h4>
                                <div className="space-y-4">
                                    {selectedRequest.documents.map((doc, i) => (
                                        <div key={i} className="group relative bg-gray-900 rounded-3xl overflow-hidden aspect-video shadow-xl">
                                            <img src={doc.fileUrl} alt={doc.type} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                                                <p className="text-white font-black text-sm uppercase tracking-widest">{doc.type}</p>
                                                <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-blue-400 text-[10px] font-black underline mt-1">OPEN FULL IMAGE</a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-blue-50 p-8 rounded-[32px] border border-blue-100">
                                    <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                                        <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                                        Review Checklist
                                    </h4>
                                    <ul className="space-y-3 text-sm font-medium text-gray-600">
                                        <li className="flex gap-2">🔘 Check name against ID document</li>
                                        <li className="flex gap-2">🔘 Verify expiration dates of licenses</li>
                                        <li className="flex gap-2">🔘 Ensure image clarity and no tampering</li>
                                    </ul>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleStatus(selectedRequest._id, 'approved')}
                                        className="bg-green-600 text-white py-6 rounded-3xl font-black flex flex-col items-center gap-2 hover:bg-green-700 transition shadow-lg group"
                                    >
                                        <CheckCircleIcon className="w-8 h-8 group-hover:scale-125 transition" />
                                        APPROVE
                                    </button>
                                    <button
                                        onClick={() => handleStatus(selectedRequest._id, 'rejected')}
                                        className="bg-red-600 text-white py-6 rounded-3xl font-black flex flex-col items-center gap-2 hover:bg-red-700 transition shadow-lg group"
                                    >
                                        <XCircleIcon className="w-8 h-8 group-hover:scale-125 transition" />
                                        REJECT
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
