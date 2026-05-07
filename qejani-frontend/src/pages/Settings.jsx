import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { UserCircleIcon, Cog6ToothIcon, ShieldCheckIcon, IdentificationIcon, CameraIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

export default function Settings() {
    const { user } = useAuthStore();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        phone: user?.phone || '',
    });
    const [providerData, setProviderData] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user?.role === 'provider') {
            fetchProviderData();
        }
    }, [user]);

    const fetchProviderData = async () => {
        try {
            const res = await api.getCurrentProvider();
            setProviderData(res.data);
            setFormData(prev => ({
                ...prev,
                name: res.data.name || prev.name,
                bio: res.data.bio || '',
                phone: res.data.phone || ''
            }));
        } catch (err) {
            console.error("Failed to fetch provider data:", err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                return toast.error("File size must be less than 2MB");
            }
            setImagePreview(URL.createObjectURL(file));
            handleUpload(file);
        }
    };

    const handleUpload = async (file) => {
        setUploading(true);
        try {
            const fData = new FormData();
            fData.append('image', file);
            const res = await api.uploadProfilePicture(fData);
            toast.success("Profile picture updated!");
            setProviderData(prev => ({ ...prev, image: res.data.image }));
            setImagePreview(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async () => {
        if (!window.confirm("Delete profile picture?")) return;
        try {
            await api.deleteProfilePicture();
            toast.success("Profile picture deleted");
            setProviderData(prev => ({ ...prev, image: null }));
        } catch (err) {
            toast.error("Failed to delete image");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.updateProviderProfile(formData);
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">Settings</h1>
                    <p className="text-gray-500 font-medium">Manage your account preferences and public profile.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Nav */}
                    <div className="space-y-2">
                        {[
                            { id: 'profile', name: 'Profile', icon: UserCircleIcon },
                            { id: 'security', name: 'Security', icon: ShieldCheckIcon },
                            { id: 'verification', name: 'Verification', icon: IdentificationIcon },
                            { id: 'pref', name: 'Preferences', icon: Cog6ToothIcon },
                        ].map(item => (
                            <button key={item.id} className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition">
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </button>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-3 space-y-8">
                        {/* Profile Picture Section (Providers Only) */}
                        {user?.role === 'provider' && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Profile Picture</h2>
                                <div className="flex items-center gap-8">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-3xl bg-gray-100 overflow-hidden border-4 border-white shadow-xl">
                                            {imagePreview || providerData?.image ? (
                                                <img
                                                    src={imagePreview || `http://localhost:5001${providerData.image}`}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <UserCircleIcon className="w-16 h-16" />
                                                </div>
                                            )}
                                        </div>
                                        <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg cursor-pointer hover:bg-blue-700 transition">
                                            <CameraIcon className="w-5 h-5" />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={uploading} />
                                        </label>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm font-bold text-gray-900">Upload a professional photo</p>
                                        <p className="text-xs text-gray-500 font-medium max-w-[200px]">This image will be displayed on your public profile and service listings.</p>
                                        {providerData?.image && (
                                            <button
                                                onClick={handleDeleteImage}
                                                className="flex items-center gap-2 text-red-500 text-xs font-black uppercase tracking-widest hover:text-red-600 transition"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                                Remove Photo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-black mb-8 uppercase tracking-tight">Public Profile</h2>
                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full px-5 py-3 bg-gray-100 border border-gray-100 rounded-xl text-gray-400"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Short Bio</label>
                                    <textarea
                                        rows="4"
                                        value={formData.bio}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        placeholder="Tell us about yourself..."
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                    ></textarea>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-black transition uppercase tracking-widest text-xs">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
