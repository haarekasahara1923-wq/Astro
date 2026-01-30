"use client";

import Link from "next/link";
import { Moon, Check, Star, Zap, Shield, ArrowRight } from "lucide-react";

export default function Plans() {
    const plans = [
        {
            name: "Free",
            price: "0",
            description: "Perfect for starting your cosmic journey",
            icon: Moon,
            features: [
                "1 Free Consultation (5 min)",
                "Daily Horoscope",
                "Community Access",
                "Email Support"
            ],
            buttonText: "Get Started",
            popular: false,
            color: "gray"
        },
        {
            name: "Basic",
            price: "499",
            description: "Enhanced guidance for your everyday life",
            icon: Zap,
            features: [
                "3 Consultations per month",
                "Detailed Kundli Reading",
                "Priority Chat Support",
                "Ad-free Experience",
                "Monthly Newsletter"
            ],
            buttonText: "Upgrade Now",
            popular: true,
            color: "accent"
        },
        {
            name: "Premium",
            price: "999",
            description: "Professional level insights and care",
            icon: Star,
            features: [
                "Unlimited Consultations",
                "Advanced Matchmaking",
                "Personalized Remedies",
                "24/7 Dedicated Support",
                "Video Sessions Included",
                "Early Access to Events"
            ],
            buttonText: "Go Premium",
            popular: false,
            color: "secondary"
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[#0a0a0f] -z-20" />
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -z-10" />

            {/* Navigation */}
            <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Moon className="w-8 h-8 text-accent fill-accent" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                        Jyotish
                    </span>
                </Link>
                <div className="flex items-center gap-6">
                    <Link href="/astrologers" className="text-sm font-medium hover:text-accent transition-colors">Astrologers</Link>
                    <Link href="/login" className="px-5 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-sm font-medium">Log In</Link>
                </div>
            </header>

            <main className="flex-1 py-16 px-6">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold text-accent uppercase tracking-widest mb-4">
                        <Shield className="w-3 h-3" />
                        Pricing Plans
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        Choose Your <span className="text-accent underline decoration-white/10 italic">Cosmic</span> Plan
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Unlock deeper insights and personalized guidance with our subscription plans designed for every seeker.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, i) => (
                        <div key={i} className={`relative glass-panel p-8 rounded-3xl flex flex-col border-white/5 hover:border-accent/30 transition-all duration-500 scale-100 hover:scale-[1.02] ${plan.popular ? 'ring-2 ring-accent shadow-[0_0_40px_rgba(255,184,0,0.1)]' : ''}`}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/5`}>
                                    <plan.icon className={`w-8 h-8 ${plan.popular ? 'text-accent' : 'text-gray-300'}`} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black">₹{plan.price}</span>
                                    <span className="text-gray-500 text-sm">/month</span>
                                </div>
                                <p className="text-gray-400 text-sm mt-4">{plan.description}</p>
                            </div>

                            <ul className="flex-1 space-y-4 mb-8">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-start gap-3 text-sm text-gray-300">
                                        <div className={`mt-1 rounded-full p-0.5 ${plan.popular ? 'bg-accent/20 text-accent' : 'bg-white/10 text-gray-400'}`}>
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${plan.popular ? 'bg-accent text-black hover:opacity-90' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                                {plan.buttonText}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center glass-panel p-8 rounded-3xl max-w-4xl mx-auto border-white/5">
                    <h3 className="text-xl font-bold mb-2">Need a custom plan?</h3>
                    <p className="text-gray-400 text-sm mb-6">If you are a corporate or have special requirements, feel free to reach out to us.</p>
                    <Link href="/contact" className="text-accent font-bold hover:underline underline-offset-4">Contact Support Team</Link>
                </div>
            </main>

            <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
                <p>&copy; 2026 Jyotish. Clear your path through the stars.</p>
            </footer>
        </div>
    );
}
