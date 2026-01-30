"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Moon, User, Wallet, History, Star, Settings, LogOut, MessageCircle } from "lucide-react";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        // In a real app, you'd fetch the user profile from the API
        // For now, we'll decode or use placeholder
        setUser({
            name: "User",
            email: "user@example.com",
            role: "USER",
            balance: 0,
            plan: "FREE"
        });
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar / Top Nav */}
            <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Moon className="w-8 h-8 text-accent fill-accent" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                        Jyotish
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/wallet" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                        <Wallet className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium">₹{user.balance}</span>
                    </Link>
                    <button onClick={handleLogout} className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-red-400 transition-colors">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Profile Section */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="glass-panel p-6 rounded-2xl text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                                <User className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-sm text-gray-400 mb-4">{user.email}</p>
                            <div className="inline-flex px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold text-accent uppercase tracking-wider">
                                {user.plan} PLAN
                            </div>
                        </div>

                        <nav className="glass-panel p-2 rounded-2xl space-y-1">
                            {[
                                { icon: User, label: "My Profile", active: true },
                                { icon: MessageCircle, label: "My Chats" },
                                { icon: History, label: "History" },
                                { icon: Star, label: "Favorites" },
                                { icon: Settings, label: "Settings" },
                            ].map((item, i) => (
                                <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-primary text-white' : 'hover:bg-white/5 text-gray-400'}`}>
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-3 space-y-8">
                        {/* Welcome Banner */}
                        <div className="glass-panel p-8 rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/20 border-accent/20">
                            <h1 className="text-3xl font-bold mb-2">Hello, {user.name}! 🌟</h1>
                            <p className="text-gray-300">Your cosmic journey is waiting for you. Consult with our top astrologers today.</p>
                            <Link href="/astrologers" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-black font-bold rounded-xl mt-6 hover:opacity-90 transition-opacity">
                                Find Astrologers
                            </Link>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { label: "Consultations", value: "0", icon: MessageCircle },
                                { label: "Minutes Talked", value: "0", icon: History },
                                { label: "Plan Status", value: "Active", icon: Star },
                            ].map((stat, i) => (
                                <div key={i} className="glass-panel p-6 rounded-2xl border-white/5">
                                    <stat.icon className="w-6 h-6 text-accent mb-4" />
                                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Recommended section placeholder */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold px-1">Recommended for You</h2>
                            <div className="glass-panel p-12 rounded-3xl border-dashed border-white/10 text-center">
                                <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400">Consult with an astrologer to see personalized recommendations.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
