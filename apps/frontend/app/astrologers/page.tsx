"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Moon, Star, MessageCircle, Phone, Video, Search, Filter } from "lucide-react";

interface Astrologer {
    id: string;
    name: string;
    expertise: string; // Changed from string[] to string for SQLite compatibility
    languages: string; // Changed from string[] to string
    rating: number;
    pricePerMin: number;
    isOnline: boolean;
}

export default function Astrologers() {
    const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInternational, setIsInternational] = useState(false);
    const [isNewUser, setIsNewUser] = useState(true);
    const [userBalance, setUserBalance] = useState(0);

    // Mock data for initial render if backend is empty
    const mockAstrologers: Astrologer[] = [
        {
            id: "1",
            name: "Pandit Rahul Sharma",
            expertise: "Vedic, Numerology",
            languages: "Hindi, English",
            rating: 4.8,
            pricePerMin: 25,
            isOnline: true,
        },
        {
            id: "2",
            name: "Astro Priya",
            expertise: "Tarot, Love",
            languages: "English, Bengali",
            rating: 4.9,
            pricePerMin: 30,
            isOnline: false,
        },
        {
            id: "3",
            name: "Guru Verma",
            expertise: "Vastu, Career",
            languages: "Hindi, Punjabi",
            rating: 4.5,
            pricePerMin: 15,
            isOnline: true,
        },
    ];

    useEffect(() => {
        // In a real app, fetch from backend. For now, use mock if fetch fails or is empty.
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

        // Fetch user data (mock for now)
        const checkUserStatus = async () => {
            // In real app: const res = await fetch('/api/auth/me');
            // For demo:
            setIsInternational(false);
            setIsNewUser(true);
            setUserBalance(0);
        };
        checkUserStatus();
    }, []);

    const handleChatStart = async (astro: Astrologer) => {
        if (isNewUser) {
            alert(`Starting your free chat session with ${astro.name} for 5 minutes.`);
            // Redirect to chat page with free trial flag
            return;
        }

        if (userBalance < astro.pricePerMin) {
            alert("Insufficient balance. Please recharge your wallet to start a consultation.");
            window.location.href = "/wallet";
            return;
        }

        alert(`Starting paid chat with ${astro.name} at ${isInternational ? '$' + (astro.pricePerMin / 10) : '₹' + astro.pricePerMin}/min.`);
    };


    return (
        <div className="flex flex-col min-h-screen">
            <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <Moon className="w-8 h-8 text-accent fill-accent" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                            Jyotish
                        </span>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {/* Placeholder for user profile if logged in */}
                </div>
            </header>

            <main className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold">Talk to Astrologers</h1>
                    <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/10 w-full md:w-auto">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search by name or skill..." className="bg-transparent outline-none text-sm w-full md:w-64" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {astrologers.map((astro) => (
                            <div key={astro.id} className="glass-panel rounded-2xl p-6 hover:border-accent/50 transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold">
                                            {astro.name[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight">{astro.name}</h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                {astro.expertise}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1">
                                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                        <span className="font-bold text-sm">{astro.rating}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {astro.languages.split(',').map(lang => (
                                        <span key={lang} className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400">{lang.trim()}</span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <div>
                                        <p className="text-xs text-gray-400">Rate</p>
                                        <p className="font-bold text-accent">
                                            {isInternational ? `$${(astro.pricePerMin / 10).toFixed(0)}` : `₹${astro.pricePerMin}`}/min
                                        </p>
                                        {isNewUser && (
                                            <p className="text-[10px] text-green-500 font-bold uppercase mt-1">First 3m FREE</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleChatStart(astro)}
                                        className="px-6 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold hover:opacity-90 transition-opacity"
                                    >
                                        Chat
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
