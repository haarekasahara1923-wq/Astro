"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../contexts/CartContext";
import { ShoppingBag, Trash2, ArrowLeft, Loader2, MapPin, Phone, Mail, User as UserIcon } from "lucide-react";

export default function Checkout() {
    const router = useRouter();
    const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [buyerDetails, setBuyerDetails] = useState({
        name: "",
        address: "",
        nearbyPlace: "",
        pincode: "",
        mobile: "",
        whatsapp: "",
        email: ""
    });

    useEffect(() => {
        if (cart.length === 0) {
            router.push("/shop");
        }
    }, [cart]);

    const handlePayment = async () => {
        // Validate required fields
        if (!buyerDetails.name || !buyerDetails.address || !buyerDetails.pincode || !buyerDetails.mobile) {
            alert("Please fill all required fields (Name, Address, Pincode, Mobile)");
            return;
        }

        // Validate pincode (6 digits)
        if (!/^\d{6}$/.test(buyerDetails.pincode)) {
            alert("Please enter a valid 6-digit pincode");
            return;
        }

        // Validate mobile (10 digits)
        if (!/^\d{10}$/.test(buyerDetails.mobile)) {
            alert("Please enter a valid 10-digit mobile number");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        setLoading(true);

        try {
            const totalAmount = getTotalPrice();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

            // 1. Create Razorpay Order
            const orderRes = await fetch(`${apiUrl}/payment/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: totalAmount,
                    currency: "INR",
                    receipt: `shop_order_${Date.now()}`
                })
            });

            if (!orderRes.ok) {
                alert("Failed to create order");
                setLoading(false);
                return;
            }

            const order = await orderRes.json();

            // 2. Open Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Cosmic Gems",
                description: "Purchase of spiritual products",
                order_id: order.id,
                prefill: {
                    name: buyerDetails.name,
                    email: buyerDetails.email,
                    contact: buyerDetails.mobile
                },
                theme: {
                    color: "#F59E0B"
                },
                handler: async function (response: any) {
                    // 3. Verify Payment
                    const verifyRes = await fetch(`${apiUrl}/payment/verify`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });

                    if (verifyRes.ok) {
                        // 4. Create Shop Order
                        await createShopOrder(token, totalAmount);
                        alert("Payment successful! Your order has been placed.");
                        clearCart();
                        router.push("/shop");
                    } else {
                        alert("Payment verification failed");
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
            setLoading(false);

        } catch (error) {
            console.error("Payment error:", error);
            alert("Something went wrong with payment");
            setLoading(false);
        }
    };

    const createShopOrder = async (token: string, totalAmount: number) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
            await fetch(`${apiUrl}/shop/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        variant: item.variant
                    })),
                    shippingAddress: {
                        name: buyerDetails.name,
                        address: buyerDetails.address,
                        nearbyPlace: buyerDetails.nearbyPlace,
                        pincode: buyerDetails.pincode,
                        mobile: buyerDetails.mobile,
                        whatsapp: buyerDetails.whatsapp || buyerDetails.mobile,
                        email: buyerDetails.email
                    }
                })
            });
        } catch (error) {
            console.error("Failed to create shop order:", error);
        }
    };

    if (cart.length === 0) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Header */}
            <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <Link href="/shop" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Shop
                </Link>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    Checkout
                </h1>
                <div className="w-8"></div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Buyer Details Form */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 h-fit">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <UserIcon className="w-6 h-6 text-amber-400" />
                        Buyer Details
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-400 flex items-center gap-1">
                                <UserIcon className="w-4 h-4" />
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={buyerDetails.name}
                                onChange={e => setBuyerDetails({ ...buyerDetails, name: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 mt-1 focus:border-amber-500 outline-none"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-400 flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                Complete Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={buyerDetails.address}
                                onChange={e => setBuyerDetails({ ...buyerDetails, address: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 mt-1 focus:border-amber-500 outline-none resize-none"
                                placeholder="House/Flat No., Street, Area, City, State"
                                rows={3}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-400">Nearby Famous Place (for easy location)</label>
                            <input
                                type="text"
                                value={buyerDetails.nearbyPlace}
                                onChange={e => setBuyerDetails({ ...buyerDetails, nearbyPlace: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 mt-1 focus:border-amber-500 outline-none"
                                placeholder="e.g., Near Central Mall, Behind Main Market"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-400">
                                Pincode <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                maxLength={6}
                                value={buyerDetails.pincode}
                                onChange={e => setBuyerDetails({ ...buyerDetails, pincode: e.target.value.replace(/\D/g, '') })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 mt-1 focus:border-amber-500 outline-none"
                                placeholder="6-digit pincode"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-400 flex items-center gap-1">
                                    <Phone className="w-4 h-4" />
                                    Mobile Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    maxLength={10}
                                    value={buyerDetails.mobile}
                                    onChange={e => setBuyerDetails({ ...buyerDetails, mobile: e.target.value.replace(/\D/g, '') })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 mt-1 focus:border-amber-500 outline-none"
                                    placeholder="10-digit number"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-400 flex items-center gap-1">
                                    <Phone className="w-4 h-4 text-green-400" />
                                    WhatsApp Number
                                </label>
                                <input
                                    type="tel"
                                    maxLength={10}
                                    value={buyerDetails.whatsapp}
                                    onChange={e => setBuyerDetails({ ...buyerDetails, whatsapp: e.target.value.replace(/\D/g, '') })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 mt-1 focus:border-green-500 outline-none"
                                    placeholder="Same as mobile (optional)"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-400 flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                Email Address (Optional)
                            </label>
                            <input
                                type="email"
                                value={buyerDetails.email}
                                onChange={e => setBuyerDetails({ ...buyerDetails, email: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 mt-1 focus:border-amber-500 outline-none"
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Order Summary */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 h-fit">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <ShoppingBag className="w-6 h-6 text-amber-400" />
                        Order Summary
                    </h2>

                    <div className="space-y-4 mb-6">
                        {cart.map(item => (
                            <div key={item.productId} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                {item.image && (
                                    <img src={item.image} alt={item.productName} className="w-20 h-20 rounded-lg object-cover" />
                                )}
                                <div className="flex-1">
                                    <h3 className="font-bold">{item.productName}</h3>
                                    {item.variant && <p className="text-sm text-gray-400">Variant: {item.variant}</p>}
                                    <p className="text-amber-400 font-bold mt-1">₹{item.price}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(item.productId)}
                                        className="ml-2 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="border-t border-white/10 pt-4 space-y-2">
                        <div className="flex justify-between text-lg">
                            <span>Subtotal:</span>
                            <span className="font-bold">₹{getTotalPrice()}</span>
                        </div>
                        <div className="flex justify-between text-lg">
                            <span>Shipping:</span>
                            <span className="font-bold text-green-400">FREE</span>
                        </div>
                        <div className="flex justify-between text-2xl font-bold border-t border-white/10 pt-2 mt-2">
                            <span>Total:</span>
                            <span className="text-amber-400">₹{getTotalPrice()}</span>
                        </div>
                    </div>

                    {/* Payment Button */}
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-600 text-black font-bold text-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>Proceed to Payment</>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-4">
                        🔒 Secure payment powered by Razorpay
                    </p>
                </div>
            </main>
        </div>
    );
}
