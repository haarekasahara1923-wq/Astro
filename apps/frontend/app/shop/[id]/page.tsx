"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, Heart, ArrowLeft, Star, Phone, Truck, ShieldCheck, RefreshCw, Loader2, Plus, Minus } from "lucide-react";
import { useCart } from "../../../contexts/CartContext";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    salePrice?: number;
    images: string[];
    category: string;
    variants: any[];
}

export default function ProductDetail() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

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
        const adminNumber = "919876543210";
        window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleAddToCart = () => {
        if (!product) return;
        const currentPrice = product.salePrice || product.price;
        addToCart({
            productId: product.id,
            productName: product.name,
            price: currentPrice,
            quantity: quantity,
            variant: selectedVariant || undefined,
            image: product.images[0] || undefined
        });
        alert(`${product.name} added to cart!`);
    };

    const handleBuyNow = () => {
        if (!product) return;
        handleAddToCart();
        router.push('/checkout');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-white">
                <p className="text-xl">Product not found</p>
                <Link href="/shop" className="mt-4 text-amber-400 hover:underline">
                    Back to Shop
                </Link>
            </div>
        );
    }

    const currentPrice = product.salePrice || product.price;
    const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Header */}
            <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <Link href="/shop" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Shop
                </Link>
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    Product Details
                </h1>
                <div className="w-8"></div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Images */}
                    <div className="space-y-4">
                        {product.images && product.images.length > 0 ? (
                            <>
                                <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                                    <img
                                        src={product.images[selectedImage]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {product.images.length > 1 && (
                                    <div className="flex gap-4">
                                        {product.images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedImage(idx)}
                                                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                                                    ? 'border-amber-500'
                                                    : 'border-white/10 hover:border-white/30'
                                                    }`}
                                            >
                                                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="aspect-square rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                                <p className="text-gray-500">No image available</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                            <p className="text-gray-400">{product.category}</p>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-amber-400">₹{currentPrice}</span>
                            {product.salePrice && (
                                <>
                                    <span className="text-2xl text-gray-500 line-through">₹{product.price}</span>
                                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-bold">
                                        {discount}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        <div className="glass-panel p-4 rounded-xl border border-white/5">
                            <h3 className="font-bold mb-2">Description</h3>
                            <p className="text-gray-300">{product.description}</p>
                        </div>

                        {/* Variants */}
                        {product.variants && product.variants.length > 0 && product.variants[0].options && (
                            <div className="glass-panel p-4 rounded-xl border border-white/5">
                                <h3 className="font-bold mb-3">Select Variant</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants[0].options.map((option: string) => (
                                        <button
                                            key={option}
                                            onClick={() => setSelectedVariant(option)}
                                            className={`px-4 py-2 rounded-lg border transition-all ${selectedVariant === option
                                                ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                                                : 'border-white/10 bg-white/5 hover:border-white/30'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="glass-panel p-4 rounded-xl border border-white/5">
                            <h3 className="font-bold mb-3">Quantity</h3>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 py-4 rounded-xl border-2 border-amber-500 text-amber-400 font-bold hover:bg-amber-500/10 transition-all flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-600 text-black font-bold hover:scale-[1.02] transition-all"
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* WhatsApp Button */}
                        <button
                            onClick={handleWhatsAppInquiry}
                            className="w-full py-3 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 font-bold hover:bg-green-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Phone className="w-5 h-5" />
                            Inquire on WhatsApp
                        </button>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                            <div className="text-center">
                                <Truck className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                                <p className="text-sm font-bold">Free Shipping</p>
                                <p className="text-xs text-gray-500">On all orders</p>
                            </div>
                            <div className="text-center">
                                <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-green-400" />
                                <p className="text-sm font-bold">Authentic</p>
                                <p className="text-xs text-gray-500">100% Genuine</p>
                            </div>
                            <div className="text-center">
                                <RefreshCw className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                                <p className="text-sm font-bold">Easy Returns</p>
                                <p className="text-xs text-gray-500">7-day policy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
