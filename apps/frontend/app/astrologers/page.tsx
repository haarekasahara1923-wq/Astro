"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Moon, Star, MessageCircle, Phone, Video, Search, Filter, X, LogIn, UserPlus } from "lucide-react";

interface Astrologer {
    id: string;
    name: string;
    profileImage?: string;
    expertise: string;
    languages: string;
    rating: number;
    experience?: number;
    pricePerMin: number;
    isOnline: boolean;
}

export default function Astrologers() {
    const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedAstrologer, setSelectedAstrologer] = useState<Astrologer | null>(null);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);

        // Fetch astrologers
        const fetchAstrologers = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
                const res = await fetch(`${apiUrl}/astrologers`); // This now returns only approved astrologers
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setAstrologers(data);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch astrologers", err);
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
        <div className="flex flex-col min-h-screen bg-[#0a0a0f] text-white">
            {/* Auth Modal */}
            {showAuthModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="relative glass-panel rounded-3xl p-8 max-w-md w-full border border-white/10">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowAuthModal(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>

                        {/* Modal Content */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                                {selectedAstrologer?.profileImage ? (
                                    <img src={selectedAstrologer.profileImage} alt="Astro" className="w-full h-full object-cover" />
                                ) : (
                                    <Moon className="w-8 h-8 text-white" />
                                )}
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

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : astrologers.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p>No astrologers currently available.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {astrologers.map((astro) => (
                            <div key={astro.id} className="glass-panel rounded-2xl p-6 hover:border-amber-400/30 transition-all group border border-white/5 relative overflow-hidden">

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl font-bold text-white overflow-hidden">
                                                {astro.profileImage ? (
                                                    <img src={astro.profileImage} alt={astro.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span>{astro.name[0]}</span>
                                                )}
                                            </div>
                                            {astro.isOnline && (
                                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0f]"></div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight">{astro.name}</h3>
                                            <div className="text-xs text-gray-400 mt-1 line-clamp-1">{astro.expertise}</div>
                                            <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{astro.languages}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-4 bg-black/20 rounded-lg p-3">
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                        <span className="font-bold">{astro.rating.toFixed(1)}</span>
                                        <span className="text-xs text-gray-500">Rating</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 justify-end">
                                            <span className="font-bold text-lg text-green-400">₹{astro.pricePerMin}</span>
                                            <span className="text-xs text-gray-500">/min</span>
                                        </div>
                                        {astro.experience && <div className="text-xs text-amber-400">{astro.experience} Yrs Exp.</div>}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleChatClick(astro)}
                                        className="w-full py-2.5 rounded-xl border border-amber-500/50 text-amber-400 font-medium text-sm hover:bg-amber-500/10 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Chat
                                    </button>
                                    <button
                                        onClick={() => handleCallClick(astro)}
                                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        <Phone className="w-4 h-4" />
                                        Call
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
