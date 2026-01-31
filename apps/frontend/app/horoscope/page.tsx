"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Moon, ArrowLeft, Star, Sparkles, RefreshCw, Calendar } from "lucide-react";

interface RashiData {
    name: string;
    nameHindi: string;
    symbol: string;
    dateRange: string;
    prediction: string;
    luckyColor: string;
    luckyNumber: string;
}

const rashiList = [
    { name: "Aries", nameHindi: "मेष", symbol: "♈", dateRange: "Mar 21 - Apr 19" },
    { name: "Taurus", nameHindi: "वृषभ", symbol: "♉", dateRange: "Apr 20 - May 20" },
    { name: "Gemini", nameHindi: "मिथुन", symbol: "♊", dateRange: "May 21 - Jun 20" },
    { name: "Cancer", nameHindi: "कर्क", symbol: "♋", dateRange: "Jun 21 - Jul 22" },
    { name: "Leo", nameHindi: "सिंह", symbol: "♌", dateRange: "Jul 23 - Aug 22" },
    { name: "Virgo", nameHindi: "कन्या", symbol: "♍", dateRange: "Aug 23 - Sep 22" },
    { name: "Libra", nameHindi: "तुला", symbol: "♎", dateRange: "Sep 23 - Oct 22" },
    { name: "Scorpio", nameHindi: "वृश्चिक", symbol: "♏", dateRange: "Oct 23 - Nov 21" },
    { name: "Sagittarius", nameHindi: "धनु", symbol: "♐", dateRange: "Nov 22 - Dec 21" },
    { name: "Capricorn", nameHindi: "मकर", symbol: "♑", dateRange: "Dec 22 - Jan 19" },
    { name: "Aquarius", nameHindi: "कुम्भ", symbol: "♒", dateRange: "Jan 20 - Feb 18" },
    { name: "Pisces", nameHindi: "मीन", symbol: "♓", dateRange: "Feb 19 - Mar 20" },
];

export default function HoroscopePage() {
    const [horoscopes, setHoroscopes] = useState<RashiData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRashi, setSelectedRashi] = useState<RashiData | null>(null);
    const [error, setError] = useState("");

    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    useEffect(() => {
        fetchHoroscopes();
    }, []);

    const fetchHoroscopes = async () => {
        setLoading(true);
        setError("");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
            const res = await fetch(`${apiUrl}/api/horoscope/daily`);

            if (res.ok) {
                const data = await res.json();
                setHoroscopes(data);
            } else {
                // Generate fallback horoscopes using local logic
                generateLocalHoroscopes();
            }
        } catch (err) {
            // Generate fallback horoscopes
            generateLocalHoroscopes();
        } finally {
            setLoading(false);
        }
    };

    const generateLocalHoroscopes = () => {
        const colors = ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "White", "Gold", "Silver"];
        const predictions = [
            "Today brings positive energy for new beginnings. Your hard work will yield excellent results. Focus on personal growth and self-improvement.",
            "Financial opportunities are on the horizon. Be careful with investments and trust your intuition. A loved one may need your support today.",
            "Communication is key today. Express your feelings openly and honestly. Career advancement is possible if you stay focused.",
            "Health should be your priority today. Take time for meditation and self-care. Unexpected good news may arrive by evening.",
            "Romance is in the air. Single individuals may meet someone special. Married couples should plan quality time together.",
            "Professional life takes center stage. A challenging project will test your skills, but success is within reach. Stay confident.",
            "Travel plans may materialize. Family relationships need attention. Be flexible and open to changes in your routine.",
            "Creative energy flows freely today. Artists and writers will find inspiration. Financial matters look stable.",
            "Social connections bring joy. Networking opportunities abound. Don't hesitate to ask for help when needed.",
            "Inner peace is achievable today. Spiritual pursuits will bring clarity. Avoid conflicts and maintain harmony.",
            "Education and learning are favored. Students will excel in studies. Teachers will find satisfaction in their work.",
            "Property matters may need attention. Home improvements are well-starred. Spend quality time with family.",
        ];

        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);

        const generatedHoroscopes: RashiData[] = rashiList.map((rashi, index) => ({
            ...rashi,
            prediction: predictions[(index + dayOfYear) % predictions.length],
            luckyColor: colors[(index + dayOfYear) % colors.length],
            luckyNumber: String(((index + 1 + dayOfYear) % 9) + 1)
        }));

        setHoroscopes(generatedHoroscopes);
    };

    const refreshHoroscopes = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
            await fetch(`${apiUrl}/api/horoscope/regenerate`, { method: 'POST' });
            await fetchHoroscopes();
        } catch {
            generateLocalHoroscopes();
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[150px]" />
            </div>

            {/* Header */}
            <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 rounded-full hover:bg-white/5 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <Link href="/" className="flex items-center gap-2">
                        <Moon className="w-8 h-8 text-amber-400 fill-amber-400" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                            Jyotish
                        </span>
                    </Link>
                </div>
                <button
                    onClick={refreshHoroscopes}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span className="text-sm hidden sm:inline">Refresh</span>
                </button>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-12">
                {/* Page Title */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">
                        <Sparkles className="w-4 h-4" />
                        AI Generated Daily Predictions
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Today's <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Horoscope</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{today}</span>
                    </div>
                </div>

                {/* Selected Rashi Detail Modal */}
                {selectedRashi && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="relative glass-panel rounded-3xl p-8 max-w-lg w-full border border-white/10 max-h-[90vh] overflow-y-auto">
                            <button
                                onClick={() => setSelectedRashi(null)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <span className="text-2xl">&times;</span>
                            </button>

                            <div className="text-center mb-6">
                                <span className="text-6xl mb-4 block">{selectedRashi.symbol}</span>
                                <h2 className="text-3xl font-bold">{selectedRashi.name}</h2>
                                <p className="text-xl text-purple-400">{selectedRashi.nameHindi}</p>
                                <p className="text-sm text-gray-400 mt-1">{selectedRashi.dateRange}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                    <h3 className="font-bold text-purple-400 mb-2">Today's Prediction</h3>
                                    <p className="text-gray-300 leading-relaxed">{selectedRashi.prediction}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                                        <p className="text-xs text-gray-400 mb-1">Lucky Color</p>
                                        <p className="font-bold text-amber-400">{selectedRashi.luckyColor}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                                        <p className="text-xs text-gray-400 mb-1">Lucky Number</p>
                                        <p className="font-bold text-amber-400">{selectedRashi.luckyNumber}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedRashi(null)}
                                className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:opacity-90 transition-opacity"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Horoscope Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400">Generating predictions with AI...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {horoscopes.map((rashi, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedRashi(rashi)}
                                className="glass-panel p-6 rounded-2xl text-center hover:border-purple-500/30 transition-all group border border-white/5 hover:scale-105"
                            >
                                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">{rashi.symbol}</span>
                                <h3 className="font-bold text-lg">{rashi.name}</h3>
                                <p className="text-purple-400 text-sm">{rashi.nameHindi}</p>
                                <p className="text-xs text-gray-500 mt-1">{rashi.dateRange}</p>

                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <p className="text-xs text-gray-400 line-clamp-2">{rashi.prediction?.substring(0, 60)}...</p>
                                </div>

                                <div className="mt-3 flex items-center justify-center gap-1 text-amber-400">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="text-xs font-medium">Read More</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Disclaimer */}
                <div className="mt-12 text-center p-6 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-sm text-gray-400">
                        🌟 Horoscope predictions are generated daily using AI and are for entertainment purposes only.
                        For personalized guidance, consult with our expert astrologers.
                    </p>
                    <Link href="/astrologers" className="inline-flex items-center gap-2 mt-4 text-amber-400 font-medium hover:underline">
                        Talk to an Astrologer →
                    </Link>
                </div>
            </main>
        </div>
    );
}
