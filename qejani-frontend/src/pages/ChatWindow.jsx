import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { PaperAirplaneIcon, PhotoIcon } from '@heroicons/react/24/solid';

export default function ChatWindow() {
    const { conversationId } = useParams();
    const { user } = useAuthStore();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef();
    const socketRef = useRef();

    // Extract recipient from conversationId (logic: current_user_id vs other_id)
    const recipientId = conversationId.split('_').find(id => id !== (user?._id || user?.id));

    useEffect(() => {
        if (user && conversationId) {
            fetchMessages();

            socketRef.current = io('http://localhost:5001');
            socketRef.current.emit('join', user._id || user.id);

            socketRef.current.on('message', (msg) => {
                if (msg.conversationId === conversationId) {
                    setMessages(prev => [...prev, msg]);
                }
            });

            return () => socketRef.current.disconnect();
        }
    }, [conversationId, user]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/api/chat/${conversationId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessages(res.data);
        } catch (err) {
            console.error("Failed to load chat");
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await axios.post('http://localhost:5001/api/chat/send', {
                recipient: recipientId,
                text: newMessage
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setMessages(prev => [...prev, res.data]);
            setNewMessage('');
        } catch (err) {
            console.error("Failed to send message");
        }
    };

    if (loading) return <div className="p-8 text-center font-bold text-gray-400">Loading Conversation...</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {/* Chat Header */}
            <div className="p-4 bg-white border-b flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                    {recipientId?.substring(0, 2).toUpperCase()}
                </div>
                <div>
                    <h3 className="font-bold text-gray-800">Support / Provider</h3>
                    <p className="text-xs text-green-500 font-bold">• Online</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {messages.map((msg, idx) => {
                    const isMine = msg.sender === (user?._id || user?.id);
                    return (
                        <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] p-4 rounded-2xl shadow-sm ${isMine
                                    ? 'bg-green-600 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                }`}>
                                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                                <p className={`text-[10px] mt-1 font-bold uppercase tracking-widest ${isMine ? 'text-green-200' : 'text-gray-400'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-4 bg-white border-t flex items-center gap-3">
                <button type="button" className="p-2 text-gray-400 hover:text-green-600 transition">
                    <PhotoIcon className="w-6 h-6" />
                </button>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-gray-100 border-none focus:ring-2 focus:ring-green-600 rounded-xl px-4 py-3 text-sm font-medium"
                />
                <button
                    type="submit"
                    className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-lg"
                >
                    <PaperAirplaneIcon className="w-6 h-6 -rotate-45" />
                </button>
            </form>
        </div>
    );
}
