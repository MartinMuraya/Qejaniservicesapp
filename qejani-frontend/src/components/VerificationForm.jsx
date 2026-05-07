import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldCheckIcon, CloudArrowUpIcon, CheckIcon } from '@heroicons/react/24/solid';

export default function VerificationForm({ providerId }) {
    const [step, setStep] = useState(1);
    const [docs, setDocs] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (type, file) => {
        setUploading(true);
        try {
            // Logic for Cloudinary upload here
            setDocs([...docs, { type, fileUrl: URL.createObjectURL(file) }]);
            toast.success(`${type} uploaded`);
        } catch (err) {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const submitVerification = async () => {
        try {
            await axios.post('http://localhost:5001/api/verification/request', {
                providerId,
                documents: docs
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('Verification submitted for review');
            setStep(3);
        } catch (err) {
            toast.error('Submission failed');
        }
    };

    return (
        <div className="bg-white rounded-3xl p-8 border border-blue-50 shadow-xl max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-100 rounded-2xl">
                    <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 leading-tight">Provider Verification</h2>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Build trust with the verified badge</p>
                </div>
            </div>

            {step === 1 && (
                <div className="space-y-6">
                    <p className="text-gray-600 font-medium">To verify your identity, we need clear copies of your government-issued documents.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['National ID', 'Business License'].map(doc => (
                            <label key={doc} className="border-2 border-dashed border-gray-100 p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition">
                                <CloudArrowUpIcon className="w-8 h-8 text-gray-300" />
                                <span className="text-sm font-bold text-gray-500 mt-2">{doc}</span>
                                <input type="file" className="hidden" onChange={(e) => handleUpload(doc, e.target.files[0])} />
                            </label>
                        ))}
                    </div>
                    <button
                        onClick={() => setStep(2)}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-lg"
                    >
                        CONTINUE
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <h3 className="font-bold text-gray-800">Review Documents</h3>
                    <div className="space-y-3">
                        {docs.map((d, i) => (
                            <div key={i} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                                <span className="font-bold text-sm">{d.type}</span>
                                <CheckIcon className="w-5 h-5 text-green-500" />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={submitVerification}
                        className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-green-700 transition shadow-lg"
                    >
                        SUBMIT FOR REVIEW
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="text-center py-12 space-y-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckIcon className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">Application Received!</h3>
                    <p className="text-gray-500 font-medium">Our team will review your documents within 24-48 hours. You'll be notified of the result.</p>
                </div>
            )}
        </div>
    );
}
