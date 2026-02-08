"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Search, Loader2, User, Shield, Wallet, Ban } from "lucide-react";

interface Astrologer {
    id: string;
    name: string;
    originalName?: string;
    email: string;
    phone: string;
    experience: number;
    experienceDesc: string;
    quotedRate: number;
    pricePerMin: number;
    isApproved: boolean;
    isBlocked: boolean;
    createdAt: string;
}

interface UserData {
    id: string;
    name: string;
    email: string;
    phone: string;
    isBlocked: boolean;
    wallet: {
        balance: number;
        transactions: any[];
    }
}

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'ASTROLOGERS' | 'USERS'>('ASTROLOGERS');
    const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Astrologer Action State
    const [selectedAstrologer, setSelectedAstrologer] = useState<Astrologer | null>(null);
    const [approvalRate, setApprovalRate] = useState<number>(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login"); // Simple client-side redirect
            return;
        }
        fetchData(token);
    }, []);

    const fetchData = async (token: string) => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

            // Parallel fetch
            const [astroRes, userRes] = await Promise.all([
                fetch(`${apiUrl}/astrologers/admin/all`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${apiUrl}/wallet/admin/all`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            if (astroRes.ok) {
                setAstrologers(await astroRes.json());
            }
            if (userRes.ok) {
                // Determine structure: backend returns wallets, which contain users. 
                // We map this to a flatter structure for the table.
                const wallets = await userRes.json();
                const mappedUsers = wallets.map((w: any) => ({
                    id: w.user.id,
                    name: w.user.name,
                    email: w.user.email,
                    phone: w.user.phone,
                    isBlocked: w.user.isBlocked,
                    wallet: {
                        balance: w.balance,
                        transactions: w.transactions
                    }
                }));
                setUsers(mappedUsers);
            }
        } catch (error) {
            console.error("Fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedAstrologer) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/astrologers/admin/approve/${selectedAstrologer.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ rate: approvalRate })
            });

            if (res.ok) {
                setAstrologers(prev => prev.map(a =>
                    a.id === selectedAstrologer.id
                        ? { ...a, isApproved: true, pricePerMin: approvalRate }
                        : a
                ));
                setSelectedAstrologer(null);
            }
        } catch (error) {
            console.error("Failed to approve", error);
        }
    };

    const toggleBlockAstrologer = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/astrologers/admin/block/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ isBlocked: !currentStatus })
            });

            if (res.ok) {
                setAstrologers(prev => prev.map(a =>
                    a.id === id ? { ...a, isBlocked: !currentStatus } : a
                ));
            }
        } catch (error) {
            console.error("Failed to block/unblock", error);
        }
    };

    const filteredAstrologers = astrologers.filter(a =>
        a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.email?.toLowerCase().includes(search.toLowerCase())
    );

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f0c29] text-white">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f0c29] text-white p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                            Super Admin Panel
                        </h1>
                        <p className="text-gray-400 text-sm">Manage Users, Astrologers & Finances</p>
                    </div>
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:border-purple-500 outline-none w-full md:w-64"
                        />
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('ASTROLOGERS')}
                        className={`pb-3 px-2 font-medium transition-colors border-b-2 ${activeTab === 'ASTROLOGERS' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                    >
                        Astrologers ({astrologers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('USERS')}
                        className={`pb-3 px-2 font-medium transition-colors border-b-2 ${activeTab === 'USERS' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                    >
                        Users ({users.length})
                    </button>
                    <div className="ml-auto text-sm text-gray-500 self-center">
                        Total Funds: ₹{users.reduce((acc, u) => acc + u.wallet.balance, 0).toFixed(2)}
                    </div>
                </div>

                {/* ASTROLOGERS TABLE */}
                {activeTab === 'ASTROLOGERS' && (
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Name / ID</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Experience</th>
                                    <th className="px-6 py-4">Rates (Quoted / Approved)</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {filteredAstrologers.map(astrologer => (
                                    <tr key={astrologer.id} className={`hover:bg-white/5 transition-colors ${astrologer.isBlocked ? 'opacity-50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{astrologer.name}</div>
                                            <div className="text-xs text-gray-500">{astrologer.originalName ? `Real: ${astrologer.originalName}` : 'No real name'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            <div>{astrologer.email}</div>
                                            <div>{astrologer.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {astrologer.experience} Years
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">₹{astrologer.quotedRate || 0}</span>
                                                <span className="text-gray-600">/</span>
                                                <span className="text-green-400 font-bold">₹{astrologer.pricePerMin}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium w-fit ${astrologer.isApproved ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                    {astrologer.isApproved ? 'Approved' : 'Pending'}
                                                </span>
                                                {astrologer.isBlocked && <span className="text-xs text-red-500 font-bold">BLOCKED</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedAstrologer(astrologer);
                                                        setApprovalRate(astrologer.quotedRate || 0);
                                                    }}
                                                    className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg"
                                                    title="Approve / Set Rate"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => toggleBlockAstrologer(astrologer.id, astrologer.isBlocked)}
                                                    className={`p-2 rounded-lg ${astrologer.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500/20 hover:bg-red-500/40 text-red-400'}`}
                                                    title={astrologer.isBlocked ? "Unblock" : "Block"}
                                                >
                                                    {astrologer.isBlocked ? <Shield className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* USERS TABLE */}
                {activeTab === 'USERS' && (
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">User Details</th>
                                    <th className="px-6 py-4">Wallet Balance</th>
                                    <th className="px-6 py-4">Recent Transactions</th>
                                    <th className="px-6 py-4">Join Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                    <div className="text-xs text-gray-500">{user.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Wallet className="w-4 h-4 text-gray-400" />
                                                <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                                    ₹{user.wallet.balance.toFixed(2)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.wallet.transactions.length > 0 ? (
                                                <div className="space-y-1">
                                                    {user.wallet.transactions.slice(0, 2).map((tx: any, i: number) => (
                                                        <div key={i} className="text-xs flex items-center justify-between gap-4">
                                                            <span className={tx.type === 'CREDIT' ? 'text-green-400' : 'text-red-400'}>
                                                                {tx.type === 'CREDIT' ? '+' : '-'} ₹{tx.amount}
                                                            </span>
                                                            <span className="text-gray-600">{new Date(tx.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-600 text-xs text-center block">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {/* We rely on Wallet creation date or would need to fetch joined date from user, assumed similar for now */}
                                            Online
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div className="p-8 text-center text-gray-500">No users found.</div>
                        )}
                    </div>
                )}

                {/* Approval Modal */}
                {selectedAstrologer && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#1a1640] border border-white/10 rounded-2xl p-6 w-full max-w-md relative">
                            <button
                                onClick={() => setSelectedAstrologer(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h3 className="text-xl font-bold mb-4">Approve Astrologer</h3>

                            <div className="space-y-4">
                                <div className="bg-black/20 p-4 rounded-lg">
                                    <div className="text-sm text-gray-400">Applicant</div>
                                    <div className="font-medium text-lg">{selectedAstrologer.name}</div>
                                    <div className="text-sm text-gray-500 mt-1">{selectedAstrologer.email}</div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Quoted Rate</label>
                                    <div className="text-lg font-medium">₹{selectedAstrologer.quotedRate} / min</div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Approved Rate (Final)</label>
                                    <input
                                        type="number"
                                        value={approvalRate}
                                        onChange={e => setApprovalRate(Number(e.target.value))}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-purple-500 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">This is the rate visible to users.</p>
                                </div>

                                <button
                                    onClick={handleApprove}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold mt-4"
                                >
                                    Approve & Set Rate
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
