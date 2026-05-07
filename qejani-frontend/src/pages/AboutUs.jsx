import { useNavigate } from 'react-router-dom';
import {
    HeartIcon,
    ShieldCheckIcon,
    UsersIcon,
    LightBulbIcon
} from '@heroicons/react/24/outline';

export default function AboutUs() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-br from-green-600 to-blue-700 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                        We Connect You to <br />
                        <span className="text-green-300">Trusted Experts.</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-medium opacity-90 max-w-3xl mx-auto mb-10">
                        Qejani is Kenya's premier marketplace for home services. We're on a mission to simplify urban living by bringing professionalism and reliability to your doorstep.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition"
                        >
                            Join the Community
                        </button>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gray-50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { label: 'Verified Pros', value: '150+' },
                        { label: 'Service Types', value: '40+' },
                        { label: 'Happy Users', value: '5k+' },
                        { label: 'Support 24/7', value: 'Yes' },
                    ].map((stat, i) => (
                        <div key={i} className="p-6">
                            <p className="text-4xl font-black text-gray-900 mb-2">{stat.value}</p>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-24 max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Our Core Values</h2>
                    <div className="w-20 h-2 bg-green-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {[
                        {
                            title: 'Trust First',
                            desc: 'Every provider undergoes rigorous identity and skill verification.',
                            icon: ShieldCheckIcon,
                            color: 'bg-blue-100 text-blue-600'
                        },
                        {
                            title: 'User Love',
                            desc: 'We obsess over making your experience seamless and delightful.',
                            icon: HeartIcon,
                            color: 'bg-red-100 text-red-600'
                        },
                        {
                            title: 'Empowerment',
                            desc: 'We provide local experts with digital tools to grow their businesses.',
                            icon: UsersIcon,
                            color: 'bg-green-100 text-green-600'
                        },
                        {
                            title: 'Innovation',
                            desc: 'Using technology to solve the unique challenges of the African market.',
                            icon: LightBulbIcon,
                            color: 'bg-yellow-100 text-yellow-600'
                        },
                    ].map((v, i) => (
                        <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group">
                            <div className={`w-14 h-14 ${v.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                                <v.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">{v.title}</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="bg-gradient-to-tr from-green-500 to-blue-500 aspect-video rounded-[40px] shadow-2xl p-1 flex items-center justify-center">
                            <div className="bg-gray-800 w-full h-full rounded-[38px] flex items-center justify-center p-8">
                                <p className="text-2xl font-black text-center text-white italic">
                                    "Qejani was built with the idea that quality help shouldn't be hard to find in Nairobi."
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-6">
                        <h2 className="text-4xl font-black leading-tight">Born in Nairobi, <br /> Built for Africa.</h2>
                        <p className="text-lg text-gray-400 font-medium leading-relaxed">
                            Founded in 2024, Qejani started as a small project to help neighbors find reliable plumbers and electricians. Today, it's a rapidly growing platform connecting thousands of households to hundreds of vetted service professionals.
                        </p>
                        <p className="text-lg text-gray-400 font-medium">
                            We're more than just an app; we're a community built on the spirit of *Harambee*—pulling together to build a more efficient, trust-based service economy.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
