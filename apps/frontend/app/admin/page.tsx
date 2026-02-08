"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Search, Loader2, User, Shield, Wallet, Ban, ShoppingBag, Plus, Trash2, Edit2, Camera } from "lucide-react";

interface Astrologer {
    id: string;
    name: string;
    originalName?: string;
    email: string;
    phone: string;
    experience: number;
    experienceDesc: string;
    quotedRate: number;
    pricePerMin: number;
    isApproved: boolean;
    isBlocked: boolean;
    createdAt: string;
}

interface UserData {
    id: string;
    name: string;
    email: string;
    phone: string;
    isBlocked: boolean;
    wallet: {
        balance: number;
        transactions: any[];
    }
}

interface Product {
    id?: string;
    name: string;
    description: string;
    price: number;
    salePrice?: number;
    images: string[];
    category: string;
    stock: number;
    isAvailable: boolean;
    variants: any[];
}

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'ASTROLOGERS' | 'USERS' | 'SHOP'>('ASTROLOGERS');

    // Data States
    const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
    const [users, setUsers] = useState<UserData[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Astrologer Action State
    const [selectedAstrologer, setSelectedAstrologer] = useState<Astrologer | null>(null);
    const [approvalRate, setApprovalRate] = useState<number>(0);

    // Shop Action State
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [productForm, setProductForm] = useState<Product>({
        name: "", description: "", price: 0, salePrice: 0, images: [], category: "Gemstone", stock: 1, isAvailable: true, variants: []
    });
    const [shopStats, setShopStats] = useState({ revenue: 0, orders: 0 });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        fetchData(token);
    }, []);

    const fetchData = async (token: string) => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

            const [astroRes, userRes, productRes, shopStatsRes] = await Promise.all([
                fetch(`${apiUrl}/astrologers/admin/all`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${apiUrl}/wallet/admin/all`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${apiUrl}/shop/products`),
                fetch(`${apiUrl}/shop/stats`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            if (astroRes.ok) setAstrologers(await astroRes.json());

            if (userRes.ok) {
                const wallets = await userRes.json();
                const mappedUsers = wallets.map((w: any) => ({
                    id: w.user.id,
                    name: w.user.name,
                    email: w.user.email,
                    phone: w.user.phone,
                    isBlocked: w.user.isBlocked,
                    wallet: {
                        balance: w.balance,
                        transactions: w.transactions
                    }
                }));
                setUsers(mappedUsers);
            }

            if (productRes.ok) {
                const productsData = await productRes.json();
                console.log("Loaded products from API:", productsData);
                setProducts(productsData);
            } else {
                console.error("Failed to fetch products. Status:", productRes.status);
            }

            if (shopStatsRes.ok) {
                const stats = await shopStatsRes.json();
                setShopStats({ revenue: stats.revenue, orders: stats.totalOrders });
            }

        } catch (error) {
            console.error("Fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedAstrologer) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/astrologers/admin/approve/${selectedAstrologer.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ rate: approvalRate })
            });

            if (res.ok) {
                setAstrologers(prev => prev.map(a => a.id === selectedAstrologer.id ? { ...a, isApproved: true, pricePerMin: approvalRate } : a));
                setSelectedAstrologer(null);
            }
        } catch (error) { console.error("Failed to approve", error); }
    };

    const toggleBlockAstrologer = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/astrologers/admin/block/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ isBlocked: !currentStatus })
            });
            if (res.ok) {
                setAstrologers(prev => prev.map(a => a.id === id ? { ...a, isBlocked: !currentStatus } : a));
            }
        } catch (error) { console.error("Failed", error); }
    };

    // --- Shop Actions ---

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if ((e.target as any).disabled) return;
        (e.target as any).disabled = true;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login to continue");
                (e.target as any).disabled = false;
                return;
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            const method = productForm.id ? "PUT" : "POST";
            const url = productForm.id ? `${apiUrl}/shop/products/${productForm.id}` : `${apiUrl}/shop/products`;

            const finalData = { ...productForm };
            if (!finalData.variants || finalData.variants.length === 0) {
                finalData.variants = [{ type: "Standard", options: ["Default"] }];
            }

            // Validate payload size (Vercel limit is ~4.5MB per request)
            const payloadSize = new Blob([JSON.stringify(finalData)]).size;
            const payloadSizeKB = payloadSize / 1024;
            const payloadSizeMB = payloadSizeKB / 1024;

            console.log(`Total payload size: ${payloadSizeMB.toFixed(2)}MB`);

            if (payloadSizeMB > 4) {
                alert(`Payload too large (${payloadSizeMB.toFixed(2)}MB). Vercel limit is 4.5MB. Please use smaller/fewer images.`);
                (e.target as any).disabled = false;
                return;
            }

            console.log("Sending product data:", finalData);

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(finalData)
            });

            console.log("Response status:", res.status);

            if (res.ok) {
                const updated = await res.json();
                console.log("Product saved successfully:", updated);
                if (productForm.id) {
                    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
                } else {
                    setProducts(prev => [updated, ...prev]);
                }
                setIsProductModalOpen(false);
                setProductForm({ name: "", description: "", price: 0, salePrice: 0, images: [], category: "Gemstone", stock: 1, isAvailable: true, variants: [] });
                alert("Product saved successfully!");
            } else {
                const errorData = await res.text();
                console.error("Failed to save product. Status:", res.status, "Error:", errorData);
                alert(`Failed to save product: ${res.status} - ${errorData}`);
            }
        } catch (error) {
            console.error("Failed to save product", error);
            alert("An error occurred while saving the product. Check console for details.");
        } finally {
            (e.target as any).disabled = false;
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/shop/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== id));
            }
        } catch (error) { console.error("Failed to delete", error); }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            // Aggressive compression to fit Vercel's 4.5MB limit
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Resize to max 400px width (smaller for Vercel limits)
                    const maxWidth = 400;
                    const scale = Math.min(1, maxWidth / img.width);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;

                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Convert to base64 with heavy compression (quality: 0.5)
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);

                    // Check size (base64 ~1.37x original size)
                    const sizeInKB = (compressedBase64.length * 0.75) / 1024;
                    console.log(`Image ${index + 1} compressed to ${sizeInKB.toFixed(2)}KB`);

                    if (sizeInKB > 500) {
                        alert(`Image is still too large (${sizeInKB.toFixed(0)}KB). Please use a smaller image or lower resolution.`);
                        return;
                    }

                    const newImages = [...productForm.images];
                    while (newImages.length <= index) newImages.push("");
                    newImages[index] = compressedBase64;
                    setProductForm({ ...productForm, images: newImages });
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };


    const filteredAstrologers = astrologers.filter(a => a.name?.toLowerCase().includes(search.toLowerCase()));
    const filteredUsers = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()));
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f0c29] text-white">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f0c29] text-white p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                            Super Admin Panel
                        </h1>
                        <p className="text-gray-400 text-sm">Manage Ecosystem</p>
                    </div>
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:border-purple-500 outline-none w-full md:w-64"
                        />
                    </div>
                </header>

                <div className="flex gap-4 mb-6 border-b border-white/10 overflow-x-auto">
                    {['ASTROLOGERS', 'USERS', 'SHOP'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-3 px-4 font-bold transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                        >
                            {tab} {tab === 'SHOP' ? `(${products.length})` :
                                tab === 'USERS' ? `(${users.length})` :
                                    `(${astrologers.length})`}
                        </button>
                    ))}
                    {activeTab === 'SHOP' && (
                        <div className="ml-auto flex gap-4 text-sm text-gray-400 items-center">
                            <span>Revenue: <span className="text-green-400 font-bold">₹{shopStats.revenue}</span></span>
                            <span>Orders: <span className="text-white font-bold">{shopStats.orders}</span></span>
                        </div>
                    )}
                </div>

                {activeTab === 'ASTROLOGERS' && (
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Name / ID</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Experience</th>
                                    <th className="px-6 py-4">Rates</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {filteredAstrologers.map(astrologer => (
                                    <tr key={astrologer.id} className={`hover:bg-white/5 transition-colors ${astrologer.isBlocked ? 'opacity-50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{astrologer.name}</div>
                                            <div className="text-xs text-gray-500">{astrologer.originalName}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            <div>{astrologer.email}</div>
                                            <div>{astrologer.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">{astrologer.experience} Yrs</td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-400">₹{astrologer.quotedRate || 0}</span> / <span className="text-green-400 font-bold">₹{astrologer.pricePerMin}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${astrologer.isApproved ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                {astrologer.isApproved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button onClick={() => { setSelectedAstrologer(astrologer); setApprovalRate(astrologer.quotedRate || 0); }} className="bg-purple-600 p-2 rounded-lg text-white"><Check className="w-4 h-4" /></button>
                                            <button onClick={() => toggleBlockAstrologer(astrologer.id, astrologer.isBlocked)} className="bg-red-500/20 text-red-400 p-2 rounded-lg"><Ban className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'USERS' && (
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Wallet</th>
                                    <th className="px-6 py-4">Transactions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-green-400">₹{user.wallet.balance}</td>
                                        <td className="px-6 py-4 text-xs text-gray-400">{user.wallet.transactions.length} txns</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'SHOP' && (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    setProductForm({ name: "", description: "", price: 0, salePrice: 0, images: [], category: "Gemstone", stock: 1, isAvailable: true, variants: [] });
                                    setIsProductModalOpen(true);
                                }}
                                className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold px-6 py-2 rounded-lg flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> Add Product
                            </button>
                        </div>

                        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-black/20 text-gray-400 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Price / Sale</th>
                                        <th className="px-6 py-4">Stock</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm">
                                    {filteredProducts.map(product => (
                                        <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                                                    {product.images[0] && <img src={product.images[0]} className="w-full h-full object-cover" />}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{product.name}</div>
                                                    <div className="text-xs text-gray-500 truncate w-32">{product.description}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-amber-400">{product.category}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-400 line-through text-xs">₹{product.price}</span>
                                                    <span className="font-bold text-green-400">₹{product.salePrice || product.price}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{product.stock}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.isAvailable ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                    {product.isAvailable ? 'Active' : 'Hidden'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <button
                                                    onClick={() => { setProductForm(product); setIsProductModalOpen(true); }}
                                                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id!)}
                                                    className="p-2 bg-red-500/20 text-red-400 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {isProductModalOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60] overflow-y-auto">
                        <div className="bg-[#1a1640] border border-white/10 rounded-2xl p-6 w-full max-w-2xl relative my-auto">
                            <button
                                onClick={() => setIsProductModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-2xl font-bold mb-6">{productForm.id ? 'Edit Product' : 'Add New Product'}</h2>

                            <form onSubmit={handleSaveProduct} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-sm text-gray-400">Product Name</label>
                                        <input
                                            value={productForm.name}
                                            onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 mt-1 focus:border-amber-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-sm text-gray-400">Description</label>
                                        <textarea
                                            value={productForm.description}
                                            onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 mt-1 focus:border-amber-500 outline-none h-24"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400">Category</label>
                                        <select
                                            value={productForm.category}
                                            onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 mt-1 focus:border-amber-500 outline-none text-white"
                                        >
                                            <option value="Gemstone">Gemstone</option>
                                            <option value="Rudraksha">Rudraksha</option>
                                            <option value="Yantra">Yantra</option>
                                            <option value="Book">Book</option>
                                            <option value="Mala">Mala</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400">Stock</label>
                                        <input
                                            type="number"
                                            value={productForm.stock || ""}
                                            onChange={e => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 mt-1 focus:border-amber-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400">Regular Price (₹)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={productForm.price || ""}
                                            onChange={e => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 mt-1 focus:border-amber-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400">Sale Price (₹)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={productForm.salePrice || ""}
                                            onChange={e => setProductForm({ ...productForm, salePrice: parseFloat(e.target.value) || 0 })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 mt-1 focus:border-amber-500 outline-none"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="text-sm text-gray-400 mb-2 block">Product Images (Max 3)</label>
                                        <div className="flex gap-4">
                                            {[0, 1, 2].map((idx) => (
                                                <div key={idx} className="relative w-24 h-24 bg-white/5 rounded-xl border border-dashed border-white/20 flex items-center justify-center overflow-hidden group">
                                                    {productForm.images[idx] ? (
                                                        <>
                                                            <img src={productForm.images[idx]} className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newImages = [...productForm.images];
                                                                    newImages[idx] = '';
                                                                    setProductForm({ ...productForm, images: newImages });
                                                                }}
                                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 transition-opacity"
                                                            >
                                                                <Trash2 className="w-6 h-6" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <label className="cursor-pointer w-full h-full flex items-center justify-center">
                                                            <Camera className="w-6 h-6 text-gray-400" />
                                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, idx)} />
                                                        </label>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex items-center gap-2 mt-2">
                                        <input
                                            type="checkbox"
                                            checked={productForm.isAvailable}
                                            onChange={e => setProductForm({ ...productForm, isAvailable: e.target.checked })}
                                            className="w-5 h-5"
                                        />
                                        <label className="text-sm text-gray-300">Product is available for sale</label>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold py-3 rounded-xl mt-6">
                                    Save Product
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {selectedAstrologer && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#1a1640] border border-white/10 rounded-2xl p-6 w-full max-w-md relative">
                            <button
                                onClick={() => setSelectedAstrologer(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h3 className="text-xl font-bold mb-4">Approve Astrologer</h3>

                            <div className="space-y-4">
                                <div className="bg-black/20 p-4 rounded-lg">
                                    <div className="text-sm text-gray-400">Applicant</div>
                                    <div className="font-medium text-lg">{selectedAstrologer.name}</div>
                                    <div className="text-sm text-gray-500 mt-1">{selectedAstrologer.email}</div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Quoted Rate</label>
                                    <div className="text-lg font-medium">₹{selectedAstrologer.quotedRate} / min</div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Approved Rate (Final)</label>
                                    <input
                                        type="number"
                                        value={approvalRate}
                                        onChange={e => setApprovalRate(Number(e.target.value))}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-purple-500 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">This is the rate visible to users.</p>
                                </div>

                                <button
                                    onClick={handleApprove}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold mt-4"
                                >
                                    Approve & Set Rate
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
