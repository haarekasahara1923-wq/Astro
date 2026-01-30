"use client";

import { useState, useEffect } from "react";
import { Moon, Wallet, Plus, CreditCard, PieChart, ShieldCheck } from "lucide-react";
import Link from "next/link";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function WalletPage() {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState(100);
    const [loading, setLoading] = useState(false);
    const [isInternational, setIsInternational] = useState(false);

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        // Fetch balance (mock for now, should call /wallet)
        setBalance(0);
    }, []);

    const handleRecharge = async () => {
        setLoading(true);
        try {
            if (isInternational) {
                // PayPal Flow
                alert("Redirecting to PayPal for USD $" + (amount / 80).toFixed(2));
                // In real app, call /payment/paypal/order
            } else {
                // Razorpay Flow
                const res = await fetch("/api/payment/razorpay/order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount }),
                });
                const order = await res.json();

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_RsbFKZwt1ZtSQF",
                    amount: order.amount,
                    currency: "INR",
                    name: "Jyotish App",
                    description: "Wallet Recharge",
                    order_id: order.id,
                    handler: async function (response: any) {
                        await fetch("/api/payment/razorpay/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                paymentId: response.razorpay_payment_id,
                                orderId: response.razorpay_order_id,
                                signature: response.razorpay_signature,
                                amount: amount,
                            }),
                        });
                        alert("Payment Successful!");
                        window.location.reload();
                    },
                    theme: { color: "#8b5cf6" },
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            }
        } catch (err) {
            console.error(err);
            alert("Payment Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Moon className="w-8 h-8 text-accent fill-accent" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                        Jyotish
                    </span>
                </Link>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Balance Card */}
                    <div className="glass-panel rounded-3xl p-8 relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/10">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold">Your Wallet</h2>
                            </div>
                            <p className="text-gray-400 text-sm mb-1">Available Balance</p>
                            <h1 className="text-5xl font-bold mb-8">₹{balance.toFixed(2)}</h1>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                                    <span className="text-sm text-gray-400">Total Consultations</span>
                                    <span className="font-bold">0</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                                    <span className="text-sm text-gray-400">Next Plan</span>
                                    <span className="font-bold text-accent">Basic Tier</span>
                                </div>
                            </div>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    </div>

                    {/* Recharge Section */}
                    <div className="glass-panel rounded-3xl p-8 border-accent/30">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Plus className="w-6 h-6 text-accent" />
                            Recharge Wallet
                        </h2>

                        <div className="flex items-center justify-between mb-6 p-1 bg-white/5 rounded-2xl border border-white/10">
                            <button
                                onClick={() => setIsInternational(false)}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${!isInternational ? 'bg-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Indian (₹)
                            </button>
                            <button
                                onClick={() => setIsInternational(true)}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${isInternational ? 'bg-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                International ($)
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {[100, 500, 1000, 2000].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setAmount(val)}
                                    className={`p-4 rounded-xl border text-lg font-bold transition-all ${amount === val ? 'bg-accent/10 border-accent text-accent' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                                >
                                    {isInternational ? `$${(val / 80).toFixed(0)}` : `₹${val}`}
                                </button>
                            ))}
                        </div>

                        <div className="relative mb-8">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                                {isInternational ? '$' : '₹'}
                            </span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-xl font-bold outline-none focus:border-accent"
                                placeholder="Enter custom amount"
                            />
                        </div>

                        <button
                            onClick={handleRecharge}
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {isInternational ? <CreditCard className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                                    Proceed to Pay
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Plan Details */}
                <div className="mt-16 text-center">
                    <h3 className="text-3xl font-bold mb-12">Flexible Pricing Plans</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-panel p-6 rounded-2xl text-left border-white/5 hover:border-accent/30 transition-all">
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-500/20 text-green-500 mb-4 inline-block">Active</span>
                            <h4 className="text-xl font-bold mb-2">Freemium</h4>
                            <p className="text-gray-400 text-sm mb-6">For new explorers</p>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2">✅ first chat for 3-5 mins FREE</li>
                                <li className="flex items-center gap-2">✅ first call for 3 mins FREE</li>
                            </ul>
                        </div>
                        <div className="glass-panel p-6 rounded-2xl text-left border-white/5 hover:border-accent/30 transition-all">
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-500 mb-4 inline-block">Standard</span>
                            <h4 className="text-xl font-bold mb-2">Basic Plan</h4>
                            <p className="text-gray-400 text-sm mb-6">Expert guidance</p>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2 text-accent font-bold">₹10 / min (India)</li>
                                <li className="flex items-center gap-2 text-accent font-bold">$2 / min (Intl)</li>
                                <li className="flex items-center gap-2">✅ Consultation upto wallet balance</li>
                                <li className="flex items-center gap-2">✅ Real-time notifications</li>
                            </ul>
                        </div>
                        <div className="glass-panel p-6 rounded-2xl text-left border-secondary/50 border-2 relative">
                            <div className="absolute top-0 right-6 -translate-y-1/2 bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">HIGH VALUE</div>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-500 mb-4 inline-block">Advanced</span>
                            <h4 className="text-xl font-bold mb-2">Premium Plan</h4>
                            <p className="text-gray-400 text-sm mb-6">Deep spiritual insight</p>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2 text-secondary font-bold">₹70 / min (India)</li>
                                <li className="flex items-center gap-2 text-secondary font-bold">$5 / min (Intl)</li>
                                <li className="flex items-center gap-2">✨ Samasya Nidan & Havan</li>
                                <li className="flex items-center gap-2">📜 Personal Kundali: ₹551 / $11</li>
                                <li className="flex items-center gap-2">🤝 Kundali Milan: ₹2100 / $21</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
