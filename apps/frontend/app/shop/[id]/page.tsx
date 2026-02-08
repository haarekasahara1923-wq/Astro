"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, Heart, ArrowLeft, Star, Phone, Truck, ShieldCheck, RefreshCw, Loader2 } from "lucide-react";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    salePrice?: number;
    images: string[];
    category: string;
    variants: any[]; // JSON
}

export default function ProductDetail() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

    useEffect(() => {
        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
            const res = await fetch(`${apiUrl}/shop/products/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setProduct(data);
                if (data.variants && data.variants.length > 0 && data.variants[0].options) {
                    setSelectedVariant(data.variants[0].options[0]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch product", error);
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppInquiry = () => {
        if (!product) return;
        const message = `Hello, I'm interested in *${product.name}* (Price: ₹${product.salePrice || product.price}). Can you tell me more?`;
        // Replace with Admin WhatsApp Number from Env or Context
        const adminNumber = "919876543210";
        window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleBuyNow = async () => {
        if (!product) return;

        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            setLoading(true);
            // 1. Create Order on Backend
            const currentPrice = product.salePrice || product.price;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/payment/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: currentPrice,
                    currency: "INR",
                    receipt: `product_${product.id}`
                })
            });

            if (!res.ok) {
                alert("Failed to initiate payment");
                setLoading(false);
                return;
            }

            const order = await res.json();

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Cosmic Gems",
                description: `Purchase: ${product.name}`,
                order_id: order.id,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/payment/verify`, {
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
                        alert("Payment Successful! Your order has been placed.");
                        await createShopOrder(token, currentPrice);
                        router.push("/shop");
                    } else {
                        alert("Payment verification failed");
                    }
                },
                prefill: {
                    // name: user.name, // If we had user context
                    // email: user.email,
                    // contact: user.phone
                },
                theme: {
                    color: "#F59E0B"
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
            setLoading(false);

        } catch (error) {
            console.error("Payment Error", error);
            setLoading(false);
            alert("Something went wrong with payment");
        }
    };

    const createShopOrder = async (token: string, amount: number) => {
        if (!product) return;
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/shop/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: [{
                        productId: product.id,
                        quantity: 1,
                        variant: selectedVariant
                    }],
                    shippingAddress: { address: "User Address from Profile" }
                })
            });
        } catch (e) { console.error("Failed to create shop order record", e); }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold">Product Not Found</h2>
                <Link href="/shop" className="text-amber-400 hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Shop
                </Link>
            </div>
        );
    }

    const currentPrice = product.salePrice || product.price;
    const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
            {/* Nav */}
            <nav className="p-4 border-b border-white/10 sticky top-0 bg-[#0a0a0f]/90 backdrop-blur-lg z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/shop" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Shop
                    </Link>
                    <Link href="/" className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                        Cosmic Gems
                    </Link>
                    <div className="w-8"></div> {/* Spacer */}
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square bg-white/5 rounded-3xl overflow-hidden border border-white/10 relative group">
                        {product.images[selectedImage] ? (
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-600">No Image</div>
                        )}
                        {discount > 0 && (
                            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                -{discount}% OFF
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${selectedImage === idx ? "border-amber-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                                    }`}
                            >
                                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col h-full">
                    <div className="mb-1 text-amber-400 font-medium tracking-wide uppercase text-sm">{product.category}</div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{product.name}</h1>

                    <div className="flex items-end gap-3 mb-6">
                        <span className="text-4xl font-bold text-white">₹{currentPrice}</span>
                        {product.salePrice && (
                            <span className="text-xl text-gray-500 line-through mb-1">₹{product.price}</span>
                        )}
                        <div className="flex items-center gap-1 ml-auto bg-green-900/30 px-3 py-1 rounded-lg border border-green-500/30 text-green-400 text-sm font-bold">
                            <Star className="w-4 h-4 fill-green-400" />
                            4.9 (Verified)
                        </div>
                    </div>

                    <p className="text-gray-300 leading-relaxed mb-8 text-lg border-b border-white/10 pb-8">
                        {product.description}
                    </p>

                    {/* Variants */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Select Options</label>
                            <div className="flex flex-wrap gap-3">
                                {product.variants[0].options.map((opt: string) => (
                                    <button
                                        key={opt}
                                        onClick={() => setSelectedVariant(opt)}
                                        className={`px-6 py-2 rounded-lg border transition-all font-medium ${selectedVariant === opt
                                            ? "bg-white text-black border-white"
                                            : "bg-transparent border-white/20 hover:border-white/50 text-gray-300"
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-4 mt-auto">
                        <button
                            onClick={handleWhatsAppInquiry}
                            className="bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all hover:scale-[1.02] shadow-lg shadow-green-900/20"
                        >
                            <Phone className="w-5 h-5 fill-white" />
                            WhatsApp Inquiry
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="bg-gradient-to-r from-amber-400 to-orange-600 text-black py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all hover:scale-[1.02] shadow-lg shadow-amber-900/20"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Grab Now
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10 text-center">
                        <div className="flex flex-col items-center gap-2 text-xs text-gray-400">
                            <ShieldCheck className="w-6 h-6 text-amber-400" />
                            <span>100% Authentic</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-xs text-gray-400">
                            <Truck className="w-6 h-6 text-amber-400" />
                            <span>Pan-India Shipping</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-xs text-gray-400">
                            <RefreshCw className="w-6 h-6 text-amber-400" />
                            <span>Energized (Prana Pratishta)</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
