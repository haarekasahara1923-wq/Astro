"use client";

import { useState, useEffect } from "react";
import { Moon, Wallet, Plus, CreditCard, ShieldCheck, IndianRupee, DollarSign, ArrowLeft, History, TrendingUp } from "lucide-react";
import Link from "next/link";

declare global {
    interface Window {
        Razorpay: any;
        paypal: any;
    }
}

export default function WalletPage() {
    const [balanceINR, setBalanceINR] = useState(0);
    const [balanceUSD, setBalanceUSD] = useState(0);
    const [amount, setAmount] = useState(100);
    const [loading, setLoading] = useState(false);
    const [isInternational, setIsInternational] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);

    const USD_RATE = 83; // 1 USD = 83 INR (approximate)

    useEffect(() => {
        // Load Razorpay script
        const razorpayScript = document.createElement("script");
        razorpayScript.src = "https://checkout.razorpay.com/v1/checkout.js";
        razorpayScript.async = true;
        document.body.appendChild(razorpayScript);

        // Load PayPal script
        const paypalScript = document.createElement("script");
        paypalScript.src = "https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD";
        paypalScript.async = true;
        document.body.appendChild(paypalScript);

        // Fetch balance from API (mock for now)
        fetchBalance();
        fetchTransactions();
    }, []);

    const fetchBalance = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                // In real app: const res = await fetch('/api/wallet/balance');
                // For demo:
                setBalanceINR(0);
                setBalanceUSD(0);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTransactions = async () => {
        // Mock transactions
        setTransactions([
            // { id: 1, type: 'credit', amount: 500, currency: 'INR', date: '2026-01-30', description: 'Wallet Recharge' },
        ]);
    };

    const handleRecharge = async () => {
        setLoading(true);
        try {
            if (isInternational) {
                // PayPal Flow
                const usdAmount = (amount / USD_RATE).toFixed(2);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

                try {
                    const res = await fetch(`${apiUrl}/api/payment/paypal/order`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify({ amount: parseFloat(usdAmount) }),
                    });

                    if (res.ok) {
                        const order = await res.json();
                        // Redirect to PayPal
                        window.location.href = order.approvalUrl;
                    } else {
                        alert(`Redirecting to PayPal for $${usdAmount}`);
                    }
                } catch {
                    alert(`PayPal payment of $${usdAmount} would be processed. Integration pending.`);
                }
            } else {
                // Razorpay Flow
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

                try {
                    const res = await fetch(`${apiUrl}/api/payment/razorpay/order`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify({ amount }),
                    });

                    if (res.ok) {
                        const order = await res.json();

                        const options = {
                            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_RsbFKZwt1ZtSQF",
                            amount: order.amount,
                            currency: "INR",
                            name: "Jyotish App",
                            description: "Wallet Recharge",
                            order_id: order.id,
                            handler: async function (response: any) {
                                await fetch(`${apiUrl}/api/payment/razorpay/verify`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                                    },
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
                            theme: { color: "#f59e0b" },
                        };
                        const rzp = new window.Razorpay(options);
                        rzp.open();
                    } else {
                        // Demo mode
                        alert(`Razorpay payment of ₹${amount} would be processed. Backend integration pending.`);
                    }
                } catch {
                    alert(`Razorpay payment of ₹${amount} would be processed. Backend integration pending.`);
                }
            }
        } catch (err) {
            console.error(err);
            alert("Payment initialization failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const presetAmountsINR = [100, 500, 1000, 2000];
    const presetAmountsUSD = [5, 10, 25, 50];

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
            {/* Header */}
            <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 rounded-full hover:bg-white/5 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <Link href="/" className="flex items-center gap-2">
                        <Moon className="w-8 h-8 text-amber-400 fill-amber-400" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                            Jyotish
                        </span>
                    </Link>
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* INR Balance Card */}
                    <div className="glass-panel rounded-3xl p-6 relative overflow-hidden bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                                        <IndianRupee className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Indian Rupees</p>
                                        <p className="text-xs text-gray-500">via Razorpay</p>
                                    </div>
                                </div>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-6 opacity-50" onError={(e) => e.currentTarget.style.display = 'none'} />
                            </div>
                            <h1 className="text-4xl font-bold text-amber-400">₹{balanceINR.toFixed(2)}</h1>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    </div>

                    {/* USD Balance Card */}
                    <div className="glass-panel rounded-3xl p-6 relative overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">US Dollars</p>
                                        <p className="text-xs text-gray-500">via PayPal</p>
                                    </div>
                                </div>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 opacity-50" onError={(e) => e.currentTarget.style.display = 'none'} />
                            </div>
                            <h1 className="text-4xl font-bold text-green-400">${balanceUSD.toFixed(2)}</h1>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    </div>
                </div>

                {/* Recharge Section */}
                <div className="glass-panel rounded-3xl p-8 border border-white/5 mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Plus className="w-6 h-6 text-amber-400" />
                        Recharge Wallet
                    </h2>

                    {/* Currency Toggle */}
                    <div className="flex items-center justify-center mb-8 p-1.5 bg-white/5 rounded-2xl border border-white/10 max-w-md mx-auto">
                        <button
                            onClick={() => { setIsInternational(false); setAmount(100); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all ${!isInternational ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <IndianRupee className="w-4 h-4" />
                            Indian (₹ INR)
                        </button>
                        <button
                            onClick={() => { setIsInternational(true); setAmount(5); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all ${isInternational ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <DollarSign className="w-4 h-4" />
                            International ($ USD)
                        </button>
                    </div>

                    {/* Preset Amounts */}
                    <div className="grid grid-cols-4 gap-3 mb-6 max-w-lg mx-auto">
                        {(isInternational ? presetAmountsUSD : presetAmountsINR).map(val => (
                            <button
                                key={val}
                                onClick={() => setAmount(val)}
                                className={`p-4 rounded-xl border text-lg font-bold transition-all ${amount === val ? (isInternational ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-amber-500/20 border-amber-500 text-amber-400') : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                            >
                                {isInternational ? `$${val}` : `₹${val}`}
                            </button>
                        ))}
                    </div>

                    {/* Custom Amount Input */}
                    <div className="relative mb-8 max-w-lg mx-auto">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">
                            {isInternational ? '$' : '₹'}
                        </span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-2xl font-bold outline-none focus:border-amber-400 transition-colors"
                            placeholder="Enter amount"
                            min={isInternational ? 1 : 10}
                        />
                    </div>

                    {/* Payment Info */}
                    <div className="text-center mb-6">
                        <p className="text-sm text-gray-400">
                            {isInternational ? (
                                <span className="flex items-center justify-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Secure payment via PayPal
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    Secure payment via Razorpay
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Pay Button */}
                    <button
                        onClick={handleRecharge}
                        disabled={loading || amount < (isInternational ? 1 : 10)}
                        className={`w-full max-w-lg mx-auto block py-4 rounded-xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${isInternational ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-black hover:shadow-green-500/20' : 'bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:shadow-amber-500/20'}`}
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                {isInternational ? <CreditCard className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                                Pay {isInternational ? `$${amount}` : `₹${amount}`}
                            </>
                        )}
                    </button>
                </div>

                {/* Transaction History */}
                <div className="glass-panel rounded-3xl p-8 border border-white/5">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <History className="w-5 h-5 text-amber-400" />
                        Recent Transactions
                    </h2>

                    {transactions.length === 0 ? (
                        <div className="text-center py-12">
                            <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No transactions yet</p>
                            <p className="text-gray-500 text-sm">Your transaction history will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div>
                                        <p className="font-medium">{tx.description}</p>
                                        <p className="text-xs text-gray-400">{tx.date}</p>
                                    </div>
                                    <span className={`font-bold ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                                        {tx.type === 'credit' ? '+' : '-'}{tx.currency === 'USD' ? '$' : '₹'}{tx.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
