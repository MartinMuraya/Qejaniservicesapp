import { useState } from 'react';
import {
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Contact() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.sendContactMessage(formData);
            toast.success('Message sent! Our team will get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Contact Form Error:', error);
            toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white py-20 border-b">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter">Get in Touch</h1>
                    <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
                        Questions about our services? Need support? We're here to help you every step of the way.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-16 pb-20 grid lg:grid-cols-3 gap-10 w-full">
                {/* Contact Info Cards */}
                <div className="lg:col-span-1 space-y-6">
                    {[
                        { title: 'Email Us', desc: 'gathongomoses14@gmail.com', icon: EnvelopeIcon, color: 'bg-blue-600' },
                        { title: 'Call Us', desc: '+254 718 571 870', icon: PhoneIcon, color: 'bg-green-600' },
                        { title: 'Office', desc: 'Sarit Centre, Westlands, Nairobi', icon: MapPinIcon, color: 'bg-purple-600' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-6 hover:shadow-md transition">
                            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white`}>
                                <item.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{item.title}</p>
                                <p className="font-bold text-gray-900 border-none">{item.desc}</p>
                            </div>
                        </div>
                    ))}

                    <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden">
                        <h4 className="text-xl font-black mb-4 relative z-10">Live Support</h4>
                        <p className="text-gray-400 font-medium text-sm mb-6 relative z-10">Chat with our team directly for instant assistance during business hours.</p>
                        <button className="bg-green-600 hover:bg-green-700 w-full py-4 rounded-2xl font-black text-sm transition relative z-10">
                            START CHAT
                        </button>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100 h-full">
                        <div className="flex items-center gap-3 mb-10">
                            <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-green-600" />
                            <h2 className="text-3xl font-black text-gray-900">Send a Message</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Moses Muraya"
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-900 focus:ring-2 focus:ring-green-500 transition"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="example@gmail.com"
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-900 focus:ring-2 focus:ring-green-500 transition"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Partnership inquiry, Support, etc."
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-900 focus:ring-2 focus:ring-green-500 transition"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    required
                                    rows="5"
                                    placeholder="How can we help you today?"
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-900 focus:ring-2 focus:ring-green-500 transition resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gray-900 hover:bg-black text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-gray-200 transition-all hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'SENDING...' : 'SEND ENQUIRY'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
