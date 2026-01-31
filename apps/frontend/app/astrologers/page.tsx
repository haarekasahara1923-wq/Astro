"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Moon, Star, MessageCircle, Phone, Video, Search, Filter, X, LogIn, UserPlus } from "lucide-react";

interface Astrologer {
    id: string;
    name: string;
    expertise: string;
    languages: string;
    rating: number;
    experience?: number;
    isOnline: boolean;
}

export default function Astrologers() {
    const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedAstrologer, setSelectedAstrologer] = useState<Astrologer | null>(null);

    // Mock data for initial render if backend is empty
    const mockAstrologers: Astrologer[] = [
        {
            id: "1",
            name: "Pandit Rahul Sharma",
            expertise: "Vedic, Numerology",
            languages: "Hindi, English",
            rating: 4.8,
            experience: 15,
            isOnline: true,
        },
        {
            id: "2",
            name: "Astro Priya",
            expertise: "Tarot, Love",
            languages: "English, Bengali",
            rating: 4.9,
            experience: 8,
            isOnline: false,
        },
        {
            id: "3",
            name: "Guru Verma",
            expertise: "Vastu, Career",
            languages: "Hindi, Punjabi",
            rating: 4.5,
            experience: 20,
            isOnline: true,
        },
        {
            id: "4",
            name: "Jyotishi Meera",
            expertise: "Kundali, Matchmaking",
            languages: "Hindi, Marathi",
            rating: 4.7,
            experience: 12,
            isOnline: true,
        },
        {
            id: "5",
            name: "Acharya Deepak",
            expertise: "Havan, Mantra",
            languages: "Sanskrit, Hindi",
            rating: 4.9,
            experience: 25,
            isOnline: false,
        },
        {
            id: "6",
            name: "Pandit Suresh Ji",
            expertise: "Karm Kriya, Remedies",
            languages: "Hindi, English",
            rating: 4.6,
            experience: 18,
            isOnline: true,
        },
    ];

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);

        // Fetch astrologers
        const fetchAstrologers = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
                const res = await fetch(`${apiUrl}/astrologers`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setAstrologers(data);
                    } else {
                        setAstrologers(mockAstrologers);
                    }
                } else {
                    setAstrologers(mockAstrologers);
                }
            } catch (err) {
                setAstrologers(mockAstrologers);
            } finally {
                setLoading(false);
            }
        };
        fetchAstrologers();
    }, []);

    const handleChatClick = (astro: Astrologer) => {
        if (!isLoggedIn) {
            setSelectedAstrologer(astro);
            setShowAuthModal(true);
            return;
        }
        // If logged in, redirect to chat page
        window.location.href = `/chat/${astro.id}`;
    };

    const handleCallClick = (astro: Astrologer) => {
        if (!isLoggedIn) {
            setSelectedAstrologer(astro);
            setShowAuthModal(true);
            return;
        }
        window.location.href = `/call/${astro.id}`;
    };

    const handleVideoClick = (astro: Astrologer) => {
        if (!isLoggedIn) {
            setSelectedAstrologer(astro);
            setShowAuthModal(true);
            return;
        }
        window.location.href = `/video/${astro.id}`;
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0f]">
            {/* Auth Modal */}
            {showAuthModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="relative glass-panel rounded-3xl p-8 max-w-md w-full mx-4 border border-white/10">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowAuthModal(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>

                        {/* Modal Content */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mx-auto mb-4 flex items-center justify-center">
                                <Moon className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Login Required</h2>
                            <p className="text-gray-400 text-sm">
                                Please login or signup to start consultation with
                                {selectedAstrologer && <span className="text-amber-400 font-medium"> {selectedAstrologer.name}</span>}
                            </p>
                        </div>

                        {/* Features */}
                        <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5">
                            <p className="text-sm font-bold text-amber-400 mb-3">🎁 New User Benefits:</p>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</span>
                                    5 Minutes FREE Chat
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</span>
                                    5 Minutes FREE Voice Call
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</span>
                                    5 Minutes FREE Video Call
                                </li>
                            </ul>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3">
                            <Link href="/login" className="block">
                                <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                    <LogIn className="w-5 h-5" />
                                    Login
                                </button>
                            </Link>
                            <Link href="/signup" className="block">
                                <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                                    <UserPlus className="w-5 h-5" />
                                    Create New Account
                                </button>
                            </Link>
                        </div>

                        <p className="text-center text-xs text-gray-500 mt-6">
                            By continuing, you agree to our Terms of Service
                        </p>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <Moon className="w-8 h-8 text-amber-400 fill-amber-400" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                            Jyotish
                        </span>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <Link href="/dashboard" className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-bold hover:opacity-90 transition-opacity">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-sm font-medium transition-colors">
                                Login
                            </Link>
                            <Link href="/signup" className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-bold hover:opacity-90 transition-opacity">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </header>

            <main className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Talk to Astrologers</h1>
                        <p className="text-gray-400 text-sm mt-1">Connect with verified experts for guidance</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/10 w-full md:w-auto">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search by name or skill..." className="bg-transparent outline-none text-sm w-full md:w-64" />
                    </div>
                </div>

                {/* Freemium Banner */}
                {!isLoggedIn && (
                    <div className="glass-panel rounded-2xl p-6 mb-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Star className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-green-400">🎁 First Consultation FREE!</h3>
                                    <p className="text-gray-400 text-sm">New users get 5 minutes free on chat, call & video</p>
                                </div>
                            </div>
                            <Link href="/signup">
                                <button className="px-6 py-3 rounded-full bg-green-500 text-black font-bold text-sm hover:bg-green-400 transition-colors">
                                    Claim Now
                                </button>
                            </Link>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {astrologers.map((astro) => (
                            <div key={astro.id} className="glass-panel rounded-2xl p-6 hover:border-amber-400/30 transition-all group border border-white/5">
                                {/* Astrologer Info */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl font-bold text-white">
                                                {astro.name[0]}
                                            </div>
                                            {astro.isOnline && (
                                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0f]"></div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight">{astro.name}</h3>
                                            <div className="text-xs text-gray-400 mt-1">{astro.expertise}</div>
                                            {astro.experience && (
                                                <div className="text-xs text-amber-400 mt-1">{astro.experience} years exp.</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1">
                                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                        <span className="font-bold text-sm">{astro.rating}</span>
                                    </div>
                                </div>

                                {/* Languages */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {astro.languages.split(',').map(lang => (
                                        <span key={lang} className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400">{lang.trim()}</span>
                                    ))}
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${astro.isOnline ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                        {astro.isOnline ? '🟢 Online' : '⚫ Offline'}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10">
                                    <button
                                        onClick={() => handleChatClick(astro)}
                                        disabled={!astro.isOnline}
                                        className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${astro.isOnline ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        <span className="text-xs font-medium">Chat</span>
                                    </button>
                                    <button
                                        onClick={() => handleCallClick(astro)}
                                        disabled={!astro.isOnline}
                                        className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${astro.isOnline ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        <Phone className="w-5 h-5" />
                                        <span className="text-xs font-medium">Call</span>
                                    </button>
                                    <button
                                        onClick={() => handleVideoClick(astro)}
                                        disabled={!astro.isOnline}
                                        className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${astro.isOnline ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        <Video className="w-5 h-5" />
                                        <span className="text-xs font-medium">Video</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
