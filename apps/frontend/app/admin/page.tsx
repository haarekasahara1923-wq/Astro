"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Search, Loader2 } from "lucide-react";

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
    createdAt: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedAstrologer, setSelectedAstrologer] = useState<Astrologer | null>(null);
    const [approvalRate, setApprovalRate] = useState<number>(0);

    useEffect(() => {
        fetchAstrologers();
    }, []);

    const fetchAstrologers = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login"); // In real app, check role on server/middleware but client redirect is fine for now
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/astrologers/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setAstrologers(data);
            } else {
                if (res.status === 403) alert("Access Denied: Admin only");
            }
        } catch (error) {
            console.error("Failed to fetch astrologers", error);
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
                // Update local state
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

    const filteredAstrologers = astrologers.filter(a =>
        a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f0c29] text-white">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f0c29] text-white p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search astrologers..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:border-purple-500 outline-none w-64"
                        />
                    </div>
                </header>

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
                                <tr key={astrologer.id} className="hover:bg-white/5 transition-colors">
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
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${astrologer.isApproved ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                            {astrologer.isApproved ? 'Active' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => {
                                                setSelectedAstrologer(astrologer);
                                                setApprovalRate(astrologer.quotedRate || 0); // Default to quoted rate
                                            }}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs"
                                        >
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
