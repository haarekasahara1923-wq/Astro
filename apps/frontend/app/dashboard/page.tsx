"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Moon, User, Wallet, History, Star, Settings, LogOut, MessageCircle,
    Phone, Video, Clock, Heart, FileText, Award, TrendingUp, Calendar,
    ChevronRight, Bell, Shield, Globe, IndianRupee, DollarSign
} from "lucide-react";

interface UserData {
    name: string;
    email: string;
    phone?: string;
    role: string;
    balanceINR: number;
    balanceUSD: number;
    plan: string;
    freemiumUsed: boolean;
    freemiumMinutesLeft: number;
    totalConsultations: number;
    totalMinutes: number;
    joinedDate: string;
}

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [isInternational, setIsInternational] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        // Fetch user profile from API
        const fetchUserProfile = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
                const res = await fetch(`${apiUrl}/api/auth/profile`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser({
                        name: data.name || "User",
                        email: data.email || "user@example.com",
                        phone: data.phone || "",
                        role: data.role || "USER",
                        balanceINR: data.balanceINR || 0,
                        balanceUSD: data.balanceUSD || 0,
                        plan: data.plan || "FREEMIUM",
                        freemiumUsed: data.freemiumUsed || false,
                        freemiumMinutesLeft: data.freemiumMinutesLeft || 5,
                        totalConsultations: data.totalConsultations || 0,
                        totalMinutes: data.totalMinutes || 0,
                        joinedDate: data.createdAt || new Date().toISOString()
                    });
                } else {
                    // Use mock data
                    setUser({
                        name: "User",
                        email: "user@example.com",
                        phone: "",
                        role: "USER",
                        balanceINR: 0,
                        balanceUSD: 0,
                        plan: "FREEMIUM",
                        freemiumUsed: false,
                        freemiumMinutesLeft: 5,
                        totalConsultations: 0,
                        totalMinutes: 0,
                        joinedDate: new Date().toISOString()
                    });
                }
            } catch {
                setUser({
                    name: "User",
                    email: "user@example.com",
                    phone: "",
                    role: "USER",
                    balanceINR: 0,
                    balanceUSD: 0,
                    plan: "FREEMIUM",
                    freemiumUsed: false,
                    freemiumMinutesLeft: 5,
                    totalConsultations: 0,
                    totalMinutes: 0,
                    joinedDate: new Date().toISOString()
                });
            }
        };
        fetchUserProfile();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const menuItems = [
        { id: "profile", icon: User, label: "My Profile" },
        { id: "chats", icon: MessageCircle, label: "My Chats" },
        { id: "history", icon: History, label: "Consultation History" },
        { id: "favorites", icon: Heart, label: "Favorite Astrologers" },
        { id: "settings", icon: Settings, label: "Settings" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileSection user={user} />;
            case "chats":
                return <ChatsSection />;
            case "history":
                return <HistorySection />;
            case "favorites":
                return <FavoritesSection />;
            case "settings":
                return <SettingsSection user={user} />;
            default:
                return <ProfileSection user={user} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Header */}
            <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <Link href="/" className="flex items-center gap-2">
                    <Moon className="w-8 h-8 text-amber-400 fill-amber-400" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                        Jyotish
                    </span>
                </Link>
                <div className="flex items-center gap-4">
                    {/* Wallet */}
                    <Link href="/wallet" className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-1">
                            <IndianRupee className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium">₹{user.balanceINR}</span>
                        </div>
                        <div className="w-px h-4 bg-white/20"></div>
                        <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium">${user.balanceUSD}</span>
                        </div>
                    </Link>

                    {/* Notifications */}
                    <button className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-amber-400 transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Logout */}
                    <button onClick={handleLogout} className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-red-400 transition-colors">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <div className="glass-panel p-6 rounded-2xl text-center border border-white/5">
                            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <User className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-sm text-gray-400 mb-4">{user.email}</p>

                            {/* Plan Badge */}
                            <div className={`inline-flex px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${user.plan === 'PREMIUM' ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400' :
                                    user.plan === 'STANDARD' ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400' :
                                        'bg-green-500/20 border border-green-500/30 text-green-400'
                                }`}>
                                {user.plan} Plan
                            </div>

                            {/* Freemium Status */}
                            {user.plan === 'FREEMIUM' && !user.freemiumUsed && (
                                <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <p className="text-xs text-amber-400 font-medium">🎁 Free Trial Available</p>
                                    <p className="text-lg font-bold text-amber-400">{user.freemiumMinutesLeft} min left</p>
                                </div>
                            )}
                        </div>

                        {/* Navigation Menu */}
                        <nav className="glass-panel p-2 rounded-2xl space-y-1 border border-white/5">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold'
                                            : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </button>
                            ))}
                        </nav>

                        {/* Quick Links */}
                        <div className="glass-panel p-4 rounded-2xl border border-white/5">
                            <Link href="/plans" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Award className="w-5 h-5 text-purple-400" />
                                    <span className="text-sm font-medium">Upgrade Plan</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Link>
                            <Link href="/astrologers" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-amber-400" />
                                    <span className="text-sm font-medium">Find Astrologers</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Link>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-3 space-y-8">
                        {/* Welcome Banner */}
                        <div className="glass-panel p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20">
                            <h1 className="text-3xl font-bold mb-2">Hello, {user.name}! 🌟</h1>
                            <p className="text-gray-300 mb-6">Your cosmic journey is waiting. Connect with our expert astrologers today.</p>
                            <Link href="/astrologers" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-xl hover:opacity-90 transition-opacity">
                                <Star className="w-5 h-5" />
                                Consult Now
                            </Link>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-colors">
                                <MessageCircle className="w-8 h-8 text-amber-400 mb-4" />
                                <p className="text-gray-400 text-sm mb-1">Total Consultations</p>
                                <p className="text-3xl font-bold">{user.totalConsultations}</p>
                            </div>
                            <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-green-500/30 transition-colors">
                                <Clock className="w-8 h-8 text-green-400 mb-4" />
                                <p className="text-gray-400 text-sm mb-1">Minutes Talked</p>
                                <p className="text-3xl font-bold">{user.totalMinutes}</p>
                            </div>
                            <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors">
                                <Award className="w-8 h-8 text-purple-400 mb-4" />
                                <p className="text-gray-400 text-sm mb-1">Plan Status</p>
                                <p className="text-xl font-bold text-purple-400">{user.plan}</p>
                            </div>
                        </div>

                        {/* Dynamic Content */}
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
}

// Profile Section Component
function ProfileSection({ user }: { user: UserData }) {
    return (
        <div className="glass-panel p-8 rounded-3xl border border-white/5">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-amber-400" />
                My Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-xs text-gray-400 mb-1">Full Name</p>
                        <p className="font-medium">{user.name}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-xs text-gray-400 mb-1">Email Address</p>
                        <p className="font-medium">{user.email}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-xs text-gray-400 mb-1">Phone Number</p>
                        <p className="font-medium">{user.phone || "Not provided"}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-xs text-gray-400 mb-1">Current Plan</p>
                        <p className="font-medium text-amber-400">{user.plan}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-xs text-gray-400 mb-1">Member Since</p>
                        <p className="font-medium">{new Date(user.joinedDate).toLocaleDateString()}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-xs text-gray-400 mb-1">Account Type</p>
                        <p className="font-medium">{user.role}</p>
                    </div>
                </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/5">
                <Link href="/settings">
                    <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold hover:opacity-90 transition-opacity">
                        Edit Profile
                    </button>
                </Link>
            </div>
        </div>
    );
}

// Chats Section Component
function ChatsSection() {
    const [chats, setChats] = useState<any[]>([]);

    return (
        <div className="glass-panel p-8 rounded-3xl border border-white/5">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-amber-400" />
                My Chats
            </h2>
            {chats.length === 0 ? (
                <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No Active Chats</h3>
                    <p className="text-gray-400 mb-6">Start a consultation with an astrologer to see your chats here.</p>
                    <Link href="/astrologers">
                        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold hover:opacity-90 transition-opacity">
                            Find Astrologers
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {chats.map((chat, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                                    {chat.astrologerName?.[0] || "A"}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold">{chat.astrologerName}</h4>
                                    <p className="text-sm text-gray-400">{chat.lastMessage}</p>
                                </div>
                                <span className="text-xs text-gray-500">{chat.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// History Section Component
function HistorySection() {
    const [history, setHistory] = useState<any[]>([]);

    return (
        <div className="glass-panel p-8 rounded-3xl border border-white/5">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <History className="w-6 h-6 text-amber-400" />
                Consultation History
            </h2>
            {history.length === 0 ? (
                <div className="text-center py-12">
                    <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No History Yet</h3>
                    <p className="text-gray-400 mb-6">Your past consultations will appear here.</p>
                    <Link href="/astrologers">
                        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold hover:opacity-90 transition-opacity">
                            Start Your First Consultation
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((item, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'chat' ? 'bg-amber-500/20 text-amber-400' :
                                            item.type === 'call' ? 'bg-green-500/20 text-green-400' :
                                                'bg-purple-500/20 text-purple-400'
                                        }`}>
                                        {item.type === 'chat' ? <MessageCircle className="w-5 h-5" /> :
                                            item.type === 'call' ? <Phone className="w-5 h-5" /> :
                                                <Video className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{item.astrologerName}</h4>
                                        <p className="text-xs text-gray-400">{item.date} • {item.duration} min</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold">₹{item.amount}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Favorites Section Component
function FavoritesSection() {
    const [favorites, setFavorites] = useState<any[]>([]);

    return (
        <div className="glass-panel p-8 rounded-3xl border border-white/5">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-400" />
                Favorite Astrologers
            </h2>
            {favorites.length === 0 ? (
                <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No Favorites Yet</h3>
                    <p className="text-gray-400 mb-6">Add astrologers to your favorites for quick access.</p>
                    <Link href="/astrologers">
                        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold hover:opacity-90 transition-opacity">
                            Browse Astrologers
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favorites.map((astro, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                                    {astro.name?.[0] || "A"}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold">{astro.name}</h4>
                                    <p className="text-sm text-gray-400">{astro.expertise}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                        <span className="text-xs font-medium">{astro.rating}</span>
                                    </div>
                                </div>
                                <button className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                                    <Heart className="w-5 h-5 fill-current" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Settings Section Component
function SettingsSection({ user }: { user: UserData }) {
    const [notifications, setNotifications] = useState(true);
    const [language, setLanguage] = useState("English");

    return (
        <div className="glass-panel p-8 rounded-3xl border border-white/5">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6 text-amber-400" />
                Settings
            </h2>

            <div className="space-y-6">
                {/* Notifications */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Bell className="w-6 h-6 text-amber-400" />
                        <div>
                            <p className="font-medium">Push Notifications</p>
                            <p className="text-sm text-gray-400">Receive alerts for consultations</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setNotifications(!notifications)}
                        className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-amber-400' : 'bg-gray-600'}`}
                    >
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                    </button>
                </div>

                {/* Language */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Globe className="w-6 h-6 text-green-400" />
                        <div>
                            <p className="font-medium">Language</p>
                            <p className="text-sm text-gray-400">Select your preferred language</p>
                        </div>
                    </div>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-amber-400"
                    >
                        <option value="English">English</option>
                        <option value="Hindi">हिन्दी</option>
                        <option value="Bengali">বাংলা</option>
                        <option value="Tamil">தமிழ்</option>
                    </select>
                </div>

                {/* Privacy */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Shield className="w-6 h-6 text-purple-400" />
                        <div>
                            <p className="font-medium">Privacy & Security</p>
                            <p className="text-sm text-gray-400">Manage your privacy settings</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                {/* Account Actions */}
                <div className="pt-6 border-t border-white/5 space-y-3">
                    <button className="w-full p-4 rounded-xl bg-white/5 border border-white/5 text-left hover:bg-white/10 transition-colors">
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-gray-400">Update your account password</p>
                    </button>
                    <button className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-left hover:bg-red-500/20 transition-colors">
                        <p className="font-medium text-red-400">Delete Account</p>
                        <p className="text-sm text-gray-400">Permanently delete your account</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
