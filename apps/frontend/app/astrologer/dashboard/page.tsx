"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, MapPin, Globe, PenTool, CheckCircle, AlertCircle, Camera, Loader2 } from "lucide-react";

interface AstrologerProfile {
    id: string;
    originalName?: string;
    name: string; // Display Name
    isRealNameVisible: boolean;
    email: string;
    phone: string;
    whatsapp?: string;
    age?: number;
    address?: string;
    profileImage?: string;
    bio?: string;
    expertise?: string;
    languages?: string;
    experience?: string; // Should be Int based on schema but used as string in form? Schema says Int.
    experienceDesc?: string;
    quotedRate?: number;
    pricePerMin: number;
    isApproved: boolean;
    rating: number;
    isOnline: boolean;
}

export default function AstrologerDashboard() {
    const router = useRouter();
    const [profile, setProfile] = useState<AstrologerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<AstrologerProfile>>({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/astrologers/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                // Check if profile is incomplete (e.g. no quoted rate or experienceDesc)
                if (!data.quotedRate || !data.experienceDesc) {
                    setIsEditing(true);
                    setFormData(data);
                }
            } else {
                if (res.status === 401 || res.status === 403) router.push("/login");
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/astrologers/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const updated = await res.json();
                setProfile(updated);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f0c29] text-white">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!profile) {
        // Handle case where not loading but profile is null (e.g. failed fetch not caught by 401 redirect)
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0f0c29] text-white p-6">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                            Astrologer Dashboard
                        </h1>
                        <p className="text-gray-400">Manage your profile and services</p>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => {
                                setFormData(profile || {});
                                setIsEditing(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <PenTool className="w-4 h-4" /> Edit Profile
                        </button>
                    )}
                </header>

                {profile?.isApproved ? (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span>Your profile is approved and live! Rate: ₹{profile.pricePerMin}/min</span>
                    </div>
                ) : (
                    <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-3 text-yellow-400">
                        <AlertCircle className="w-5 h-5" />
                        <span>Your profile is under review. Please ensure all details are complete.</span>
                    </div>
                )}

                {isEditing ? (
                    <form onSubmit={handleSave} className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                        {/* Identity Section */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Original Name</label>
                                <input
                                    type="text"
                                    value={formData.originalName || ""}
                                    onChange={e => setFormData({ ...formData, originalName: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Display Name (Public)</label>
                                <input
                                    type="text"
                                    value={formData.name || ""}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-purple-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="showOriginal"
                                checked={formData.isRealNameVisible || false}
                                onChange={e => setFormData({ ...formData, isRealNameVisible: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
                            />
                            <label htmlFor="showOriginal" className="text-sm text-gray-300">Show my Original Name on User Panel</label>
                        </div>

                        {/* Contact & Personal */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Email (Private)</label>
                                <input type="text" value={formData.email} disabled className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Phone (Private)</label>
                                <input type="text" value={formData.phone} disabled className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">WhatsApp Number (Private)</label>
                                <input
                                    type="text"
                                    value={formData.whatsapp || ""}
                                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Age (Private)</label>
                                <input
                                    type="number"
                                    value={formData.age || ""}
                                    onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-purple-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Address (Private)</label>
                            <textarea
                                value={formData.address || ""}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-purple-500 outline-none h-20"
                            />
                        </div>

                        {/* Professional Info */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Expertise (e.g. Vedic, Nadi)</label>
                                <input
                                    type="text"
                                    value={formData.expertise || ""}
                                    onChange={e => setFormData({ ...formData, expertise: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Languages (e.g. Hindi, English)</label>
                                <input
                                    type="text"
                                    value={formData.languages || ""}
                                    onChange={e => setFormData({ ...formData, languages: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-purple-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Experience Description (Max 100 words)</label>
                            <textarea
                                value={formData.experienceDesc || ""}
                                onChange={e => setFormData({ ...formData, experienceDesc: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-purple-500 outline-none h-32"
                                placeholder="Describe your experience and skills..."
                            />
                            <p className="text-xs text-gray-500 mt-1">Found {formData.experienceDesc?.split(' ').length || 0} words.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Years of Experience</label>
                                <input
                                    type="number"
                                    value={formData.experience || 0}
                                    onChange={e => setFormData({ ...formData, experience: e.target.value as any })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Quoted Rate (Per Minute) (Private)</label>
                                <input
                                    type="number"
                                    value={formData.quotedRate || 0}
                                    onChange={e => setFormData({ ...formData, quotedRate: Number(e.target.value) })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-purple-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Bio (Public)</label>
                            <textarea
                                value={formData.bio || ""}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-purple-500 outline-none h-24"
                                placeholder="Short bio for your card..."
                            />
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                            {profile && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData(profile);
                                    }}
                                    className="px-6 py-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        {/* Profile View */}
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-32 h-32 rounded-full bg-purple-500/20 flex items-center justify-center border-2 border-purple-500/50 shrink-0">
                                {profile?.profileImage ? (
                                    <img src={profile.profileImage} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-purple-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
                                <p className="text-gray-400 mb-4">{profile.expertise} • {profile.languages}</p>
                                <p className="text-gray-300 leading-relaxed mb-4">{profile.bio || "No bio added yet."}</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div className="bg-black/20 p-3 rounded-lg">
                                        <div className="text-gray-500 mb-1">Approved Rate</div>
                                        <div className="text-lg font-semibold">₹{profile.pricePerMin}/min</div>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg">
                                        <div className="text-gray-500 mb-1">Experience</div>
                                        <div className="text-lg font-semibold">{profile.experience} Years</div>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg">
                                        <div className="text-gray-500 mb-1">Status</div>
                                        <div className={`text-lg font-semibold ${profile.isApproved ? 'text-green-400' : 'text-yellow-400'}`}>
                                            {profile.isApproved ? 'Active' : 'Pending'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Full Profile Details (Private)</h3>
                            <div className="grid md:grid-cols-2 gap-y-4 gap-x-8">
                                <div>
                                    <span className="text-gray-500 block text-sm">Original Name</span>
                                    <span className="text-gray-200">{profile.originalName || "Not set"}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-sm">Show Original Name</span>
                                    <span className="text-gray-200">{profile.isRealNameVisible ? "Yes" : "No"}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-sm">Phone</span>
                                    <span className="text-gray-200">{profile.phone}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-sm">Email</span>
                                    <span className="text-gray-200">{profile.email}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-sm">WhatsApp</span>
                                    <span className="text-gray-200">{profile.whatsapp || "-"}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-sm">Age</span>
                                    <span className="text-gray-200">{profile.age || "-"}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-gray-500 block text-sm">Address</span>
                                    <span className="text-gray-200">{profile.address || "-"}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-gray-500 block text-sm">Detailed Experience</span>
                                    <p className="text-gray-300 mt-1 text-sm bg-black/20 p-3 rounded-lg">{profile.experienceDesc || "No description provided."}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
