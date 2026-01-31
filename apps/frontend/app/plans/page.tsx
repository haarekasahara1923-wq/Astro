"use client";

import Link from "next/link";
import { useState } from "react";
import {
    Moon, Check, Star, Zap, Shield, ArrowRight, Clock,
    MessageCircle, Phone, Video, FileText, Heart, Sparkles,
    Globe, IndianRupee, DollarSign, CreditCard
} from "lucide-react";

export default function Plans() {
    const [isInternational, setIsInternational] = useState(false);

    const mainPlans = [
        {
            name: "Freemium",
            priceINR: "0",
            priceUSD: "0",
            period: "one-time",
            description: "Start your spiritual journey with a free consultation",
            icon: Sparkles,
            features: [
                { text: "5 Minutes Free Call", icon: Phone },
                { text: "5 Minutes Free Chat", icon: MessageCircle },
                { text: "5 Minutes Free Video Call", icon: Video },
                { text: "Daily Horoscope Access", icon: Star },
                { text: "Basic Astrology Tips", icon: Zap }
            ],
            buttonText: "Start Free",
            popular: false,
            gradient: "from-emerald-500 to-teal-600",
            bgGlow: "bg-emerald-500/10"
        },
        {
            name: "Standard",
            priceINR: "10",
            priceUSD: "2",
            period: "per minute",
            description: "Professional consultation for all your queries",
            icon: Zap,
            features: [
                { text: "Chat Consultation", icon: MessageCircle },
                { text: "Voice Call Consultation", icon: Phone },
                { text: "Video Call Consultation", icon: Video },
                { text: "Real-time Guidance", icon: Clock },
                { text: "Session Recording", icon: FileText }
            ],
            buttonText: "Get Started",
            popular: true,
            gradient: "from-amber-400 to-orange-500",
            bgGlow: "bg-amber-500/10"
        },
        {
            name: "Premium",
            priceINR: "70",
            priceUSD: "5",
            period: "per minute",
            description: "Advanced spiritual services & remedies",
            icon: Star,
            features: [
                { text: "Samsya Nivaran (Problem Solving)", icon: Shield },
                { text: "Havan & Pooja Services", icon: Sparkles },
                { text: "Mantra Chanting Sessions", icon: Star },
                { text: "Karm Kriya Guidance", icon: Heart },
                { text: "Specific Timing & Repetitions", icon: Clock }
            ],
            buttonText: "Go Premium",
            popular: false,
            gradient: "from-purple-500 to-pink-600",
            bgGlow: "bg-purple-500/10"
        }
    ];

    const specialServices = [
        {
            name: "Detailed Kundali Report",
            priceINR: "500",
            priceUSD: "7",
            description: "Complete birth chart analysis with predictions",
            icon: FileText,
            features: [
                "Complete Janam Kundali",
                "Dasha Analysis",
                "Planetary Positions",
                "Life Predictions",
                "Career & Finance Insights",
                "Health & Relationship Guidance"
            ]
        },
        {
            name: "Kundali Milan Report",
            priceINR: "2100",
            priceUSD: "15",
            description: "Comprehensive matchmaking & compatibility analysis",
            icon: Heart,
            features: [
                "Gun Milan (36 Gunas)",
                "Mangal Dosha Check",
                "Bhakoot & Nadi Analysis",
                "Compatibility Score",
                "Relationship Predictions",
                "Remedies if Required"
            ]
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col bg-[#0a0a0f]">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Navigation */}
            <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <Link href="/" className="flex items-center gap-2">
                    <Moon className="w-8 h-8 text-amber-400 fill-amber-400" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                        Jyotish
                    </span>
                </Link>
                <div className="flex items-center gap-6">
                    <Link href="/astrologers" className="text-sm font-medium hover:text-amber-400 transition-colors">Astrologers</Link>
                    <Link href="/login" className="px-5 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-sm font-medium">Log In</Link>
                </div>
            </header>

            <main className="flex-1 py-12 px-4 md:px-6">
                {/* Header Section */}
                <div className="max-w-7xl mx-auto text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 uppercase tracking-widest mb-6">
                        <Shield className="w-4 h-4" />
                        Transparent Pricing
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        Choose Your <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Spiritual</span> Journey
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">
                        Unlock divine guidance with our flexible pricing plans designed for seekers worldwide
                    </p>

                    {/* Currency Toggle */}
                    <div className="inline-flex items-center gap-4 p-1.5 rounded-full bg-white/5 border border-white/10">
                        <button
                            onClick={() => setIsInternational(false)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${!isInternational ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            <IndianRupee className="w-4 h-4" />
                            Indian (₹ INR)
                        </button>
                        <button
                            onClick={() => setIsInternational(true)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${isInternational ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            <DollarSign className="w-4 h-4" />
                            International ($ USD)
                        </button>
                    </div>

                    {/* Payment Info */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                        <CreditCard className="w-4 h-4" />
                        <span>Payment via {isInternational ? 'PayPal' : 'Razorpay'} - Secure & Fast</span>
                    </div>
                </div>

                {/* Main Plans */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
                    {mainPlans.map((plan, i) => (
                        <div
                            key={i}
                            className={`relative group rounded-3xl transition-all duration-500 ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
                        >
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 ${plan.bgGlow} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className={`relative glass-panel p-8 rounded-3xl flex flex-col border border-white/5 group-hover:border-white/20 transition-all duration-500 h-full ${plan.popular ? 'ring-2 ring-amber-400/50' : ''}`}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-black px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-500/20">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br ${plan.gradient} shadow-lg`}>
                                        <plan.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black">
                                            {isInternational ? '$' : '₹'}{isInternational ? plan.priceUSD : plan.priceINR}
                                        </span>
                                        <span className="text-gray-500 text-sm">/{plan.period}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-3">{plan.description}</p>
                                </div>

                                <ul className="flex-1 space-y-3 mb-8">
                                    {plan.features.map((feature, j) => (
                                        <li key={j} className="flex items-center gap-3 text-sm text-gray-300">
                                            <div className={`rounded-lg p-1.5 bg-gradient-to-br ${plan.gradient} bg-opacity-20`}>
                                                <feature.icon className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            {feature.text}
                                        </li>
                                    ))}
                                </ul>

                                <Link href="/signup">
                                    <button className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${plan.popular ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:shadow-lg hover:shadow-amber-500/20' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                                        {plan.buttonText}
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Special Services Section */}
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">
                            <FileText className="w-4 h-4" />
                            Special Services
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">
                            Detailed <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Reports & Analysis</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Get comprehensive written reports for life-changing decisions
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {specialServices.map((service, i) => (
                            <div key={i} className="group relative">
                                <div className="absolute inset-0 bg-purple-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative glass-panel p-8 rounded-3xl border border-white/5 group-hover:border-purple-500/30 transition-all duration-500">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                                                <service.icon className="w-7 h-7 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">{service.name}</h3>
                                                <p className="text-gray-400 text-sm mt-1">{service.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-black text-purple-400">
                                                {isInternational ? '$' : '₹'}{isInternational ? service.priceUSD : service.priceINR}
                                            </div>
                                            <div className="text-xs text-gray-500">one-time</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        {service.features.map((feature, j) => (
                                            <div key={j} className="flex items-center gap-2 text-sm text-gray-300">
                                                <Check className="w-4 h-4 text-purple-400" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    <Link href="/signup">
                                        <button className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2">
                                            Order Now
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Custom Services */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-purple-500/5 rounded-3xl blur-xl" />
                        <div className="relative glass-panel p-8 md:p-12 rounded-3xl border border-white/5 text-center">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-purple-500 shadow-lg mx-auto mb-6">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-3">Custom Services</h3>
                            <p className="text-gray-400 max-w-xl mx-auto mb-6">
                                Need something specific? Our expert astrologers offer personalized services tailored to your unique requirements at mutually agreed pricing.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-sm">
                                    <Globe className="w-4 h-4 text-amber-400" />
                                    Available for Indian & International Users
                                </div>
                                <Link href="/contact">
                                    <button className="px-8 py-3 rounded-full font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2">
                                        Request Custom Service
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: Shield, text: "Secure Payments" },
                        { icon: Clock, text: "24/7 Support" },
                        { icon: Star, text: "Verified Astrologers" },
                        { icon: Heart, text: "1M+ Happy Users" }
                    ].map((badge, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5">
                            <badge.icon className="w-6 h-6 text-amber-400" />
                            <span className="text-sm font-medium text-gray-300">{badge.text}</span>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
                <p>&copy; 2026 Jyotish. Clear your path through the stars.</p>
            </footer>
        </div>
    );
}
