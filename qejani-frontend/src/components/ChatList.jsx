import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { ChatBubbleLeftRightIcon, UserIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function ChatList() {
    const { user } = useAuthStore();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/chat/conversations', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setConversations(res.data);
        } catch (err) {
            console.error("Failed to load conversations");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-sm text-gray-400 font-bold p-4">Loading chats...</div>;

    return (
        <div className="space-y-3">
            {conversations.length > 0 ? (
                conversations.map((conv) => {
                    // Identify the other participant (recipient for the current user)
                    const otherParticipant = conv.participants.find(p => p._id !== (user?._id || user?.id));

                    return (
                        <Link
                            key={conv.conversationId}
                            to={`/chat/${conv.conversationId}`}
                            className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-green-50 rounded-2xl transition border border-transparent hover:border-green-100 group"
                        >
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-green-600 shadow-sm">
                                <UserIcon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-end mb-0.5">
                                    <h4 className="font-bold text-gray-900 truncate">{otherParticipant?.name || 'User'}</h4>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                        {new Date(conv.lastMessage?.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 truncate font-medium">
                                    {conv.lastMessage?.text || 'No messages yet'}
                                </p>
                            </div>
                            {conv.unreadCount > 0 && (
                                <span className="w-5 h-5 bg-green-600 text-white text-[10px] font-black flex items-center justify-center rounded-full">
                                    {conv.unreadCount}
                                </span>
                            )}
                        </Link>
                    );
                })
            ) : (
                <div className="text-center py-10 opacity-50">
                    <ChatBubbleLeftRightIcon className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-xs font-bold uppercase tracking-widest">No active chats</p>
                </div>
            )}
        </div>
    );
}
