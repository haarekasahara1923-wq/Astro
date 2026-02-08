"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Moon, ArrowRight, X } from "lucide-react";

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
            const res = await fetch(`${apiUrl}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Login failed");
            }

            const data = await res.json();
            handleLoginSuccess(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSuccess = (data: any) => {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user info

        if (data.user.role === 'ADMIN') {
            router.push("/admin");
        } else if (data.user.role === 'ASTROLOGER') {
            router.push("/astrologer/dashboard");
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background via-[#1a1640] to-background -z-20" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10" />

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                        <Moon className="w-8 h-8 text-accent fill-accent group-hover:scale-110 transition-transform" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                            Jyotish
                        </span>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Continue your cosmic journey</p>
                </div>

                <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between animate-in fade-in slide-in-from-top-4">
                            <span>{error}</span>
                            <button onClick={() => setError("")}><X className="w-4 h-4" /></button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-1.5">
                                <label className="block text-sm font-medium text-gray-300">Password</label>
                                <Link href="/forgot-password" className="text-xs text-accent hover:underline">Forgot?</Link>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-gray-400">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-accent hover:underline">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
