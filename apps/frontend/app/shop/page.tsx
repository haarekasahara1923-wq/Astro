"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Star, Search, Filter, ArrowRight, Loader2, Sparkles } from "lucide-react";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    salePrice?: number;
    images: string[];
    category: string;
}

export default function Shop() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("All");

    useEffect(() => {
        fetchProducts();
    }, [category]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
            let url = `${apiUrl}/shop/products`;
            if (category !== "All") {
                url += `?category=${category}`;
            }
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ["All", "Gemstone", "Rudraksha", "Yantra", "Book", "Mala"];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Header */}
            <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <Sparkles className="w-8 h-8 text-amber-400" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                            Cosmic Gems
                        </span>
                    </Link>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-200">
                    <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
                    <Link href="/astrologers" className="hover:text-amber-400 transition-colors">Astrologers</Link>
                    <Link href="/shop" className="text-amber-400">Shop</Link>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <ShoppingBag className="w-6 h-6 text-gray-200 hover:text-amber-400 cursor-pointer transition-colors" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">0</span>
                    </div>
                </div>
            </header>

            {/* Hero Banner */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-amber-900/50 z-0" />
                <div className="absolute inset-0 bg-[url('/bg-stars.png')] opacity-20 z-0" />
                <div className="text-center z-10 space-y-4 px-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Sacred <span className="text-amber-400">Energies</span>
                    </h1>
                    <p className="text-lg text-gray-300 max-w-xl mx-auto">
                        Authentic Gemstones, Rudrakshas, and Yantras energized by Vedic rituals for your spiritual growth.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-12">
                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-6 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${category === cat
                                    ? "bg-amber-500 border-amber-500 text-black"
                                    : "border-white/10 hover:border-amber-500/50 hover:bg-white/5"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-xl">No celestial treasures found in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Link href={`/shop/${product.id}`} key={product.id} className="group glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all hover:scale-[1.02]">
                                <div className="aspect-square relative bg-white/5 overflow-hidden">
                                    {product.images[0] ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                            <Sparkles className="w-12 h-12" />
                                        </div>
                                    )}
                                    {product.salePrice && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                                            SALE
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="text-xs text-amber-400 font-medium mb-1 uppercase tracking-wider">{product.category}</div>
                                    <h3 className="text-lg font-bold mb-1 truncate group-hover:text-amber-400 transition-colors">{product.name}</h3>
                                    <div className="flex items-end gap-2 mt-2">
                                        <span className="text-xl font-bold">₹{product.salePrice || product.price}</span>
                                        {product.salePrice && (
                                            <span className="text-sm text-gray-500 line-through mb-1">₹{product.price}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
