"use client";

import { useState } from "react";
import Link from "next/link";
import { Moon, ArrowLeft, Sparkles, FileText, Download, Loader2, Calendar, Clock, MapPin, User } from "lucide-react";

export default function KundaliPage() {
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [kundaliData, setKundaliData] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: "",
        dateOfBirth: "",
        timeOfBirth: "",
        placeOfBirth: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.dateOfBirth || !formData.timeOfBirth || !formData.placeOfBirth) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
            const res = await fetch(`${apiUrl}/api/kundali/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                setKundaliData(data);
            } else {
                // Generate local kundali
                generateLocalKundali();
            }
        } catch {
            generateLocalKundali();
        } finally {
            setLoading(false);
            setGenerated(true);
        }
    };

    const generateLocalKundali = () => {
        const dob = new Date(formData.dateOfBirth);
        const dayOfWeek = dob.toLocaleDateString('en-US', { weekday: 'long' });
        const month = dob.getMonth();

        // Calculate Rashi based on birth month (simplified)
        const rashis = ["Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini",
            "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"];
        const rashisHindi = ["मकर", "कुम्भ", "मीन", "मेष", "वृषभ", "मिथुन",
            "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु"];

        // Calculate Nakshatra (simplified based on day of month)
        const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
            "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
            "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
            "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
            "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];

        const day = dob.getDate();
        const nakshatraIndex = (day + month) % 27;

        // Generate Lagna based on time
        const timeParts = formData.timeOfBirth.split(':');
        const hour = parseInt(timeParts[0]) || 6;
        const lagnaIndex = Math.floor(hour / 2) % 12;

        setKundaliData({
            name: formData.name,
            dateOfBirth: formData.dateOfBirth,
            timeOfBirth: formData.timeOfBirth,
            placeOfBirth: formData.placeOfBirth,
            dayOfBirth: dayOfWeek,
            rashi: rashis[month],
            rashiHindi: rashisHindi[month],
            nakshatra: nakshatras[nakshatraIndex],
            lagna: rashis[lagnaIndex],
            lagnaHindi: rashisHindi[lagnaIndex],
            planets: {
                sun: rashis[(month + 0) % 12],
                moon: rashis[(month + nakshatraIndex) % 12],
                mars: rashis[(month + 3) % 12],
                mercury: rashis[(month + 1) % 12],
                jupiter: rashis[(month + 5) % 12],
                venus: rashis[(month + 2) % 12],
                saturn: rashis[(month + 7) % 12],
                rahu: rashis[(month + 9) % 12],
                ketu: rashis[(month + 3) % 12],
            }
        });
    };

    const downloadPDF = () => {
        // Create printable content
        const printContent = `
            <html>
            <head>
                <title>Kundali - ${kundaliData?.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; }
                    h1 { color: #f59e0b; text-align: center; }
                    h2 { color: #333; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; }
                    .info { margin: 20px 0; }
                    .info p { margin: 8px 0; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                    .planet { background: #f5f5f5; padding: 10px; border-radius: 8px; }
                    .chart { border: 2px solid #333; width: 300px; height: 300px; margin: 20px auto; display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, 1fr); }
                    .chart div { border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 10px; }
                    .disclaimer { margin-top: 40px; padding: 20px; background: #fff3cd; border-radius: 8px; }
                </style>
            </head>
            <body>
                <h1>🌟 Janam Kundali 🌟</h1>
                <h2>Birth Details</h2>
                <div class="info">
                    <p><strong>Name:</strong> ${kundaliData?.name}</p>
                    <p><strong>Date of Birth:</strong> ${kundaliData?.dateOfBirth} (${kundaliData?.dayOfBirth})</p>
                    <p><strong>Time of Birth:</strong> ${kundaliData?.timeOfBirth}</p>
                    <p><strong>Place of Birth:</strong> ${kundaliData?.placeOfBirth}</p>
                </div>
                
                <h2>Kundali Details</h2>
                <div class="grid">
                    <div class="planet"><strong>Rashi:</strong> ${kundaliData?.rashi} (${kundaliData?.rashiHindi})</div>
                    <div class="planet"><strong>Nakshatra:</strong> ${kundaliData?.nakshatra}</div>
                    <div class="planet"><strong>Lagna:</strong> ${kundaliData?.lagna} (${kundaliData?.lagnaHindi})</div>
                </div>

                <h2>Planetary Positions</h2>
                <div class="grid">
                    <div class="planet"><strong>Sun (सूर्य):</strong> ${kundaliData?.planets?.sun}</div>
                    <div class="planet"><strong>Moon (चंद्र):</strong> ${kundaliData?.planets?.moon}</div>
                    <div class="planet"><strong>Mars (मंगल):</strong> ${kundaliData?.planets?.mars}</div>
                    <div class="planet"><strong>Mercury (बुध):</strong> ${kundaliData?.planets?.mercury}</div>
                    <div class="planet"><strong>Jupiter (गुरु):</strong> ${kundaliData?.planets?.jupiter}</div>
                    <div class="planet"><strong>Venus (शुक्र):</strong> ${kundaliData?.planets?.venus}</div>
                    <div class="planet"><strong>Saturn (शनि):</strong> ${kundaliData?.planets?.saturn}</div>
                    <div class="planet"><strong>Rahu (राहु):</strong> ${kundaliData?.planets?.rahu}</div>
                    <div class="planet"><strong>Ketu (केतु):</strong> ${kundaliData?.planets?.ketu}</div>
                </div>

                <div class="disclaimer">
                    <strong>Note:</strong> This is a basic AI-generated Kundali. For detailed predictions and remedies, please consult our expert astrologers.
                </div>

                <p style="text-align: center; margin-top: 40px; color: #888;">
                    Generated by Jyotish App | ${new Date().toLocaleDateString()}
                </p>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[150px]" />
            </div>

            {/* Header */}
            <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 rounded-full hover:bg-white/5 transition-colors">
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

            <main className="max-w-3xl mx-auto px-4 py-12">
                {/* Page Title */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">
                        <Sparkles className="w-4 h-4" />
                        Free AI Kundali
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Generate Your <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Janam Kundali</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Get your birth chart generated instantly using AI. Enter your birth details below.
                    </p>
                </div>

                {!generated ? (
                    /* Form */
                    <div className="glass-panel rounded-3xl p-8 border border-white/5">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name *</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-amber-400 transition-colors"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Date of Birth *</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-amber-400 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Time of Birth */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Time of Birth *</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="time"
                                        value={formData.timeOfBirth}
                                        onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-amber-400 transition-colors"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Enter as accurate as possible for better results</p>
                            </div>

                            {/* Place of Birth */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Place of Birth *</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.placeOfBirth}
                                        onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-amber-400 transition-colors"
                                        placeholder="City, State, Country"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Generating Kundali...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-6 h-6" />
                                        Generate Kundali
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-xs text-gray-500 mt-6">
                            This is a free basic Kundali. For detailed predictions and remedies,
                            <Link href="/plans" className="text-amber-400 hover:underline ml-1">upgrade your plan</Link>
                        </p>
                    </div>
                ) : (
                    /* Kundali Result */
                    <div className="space-y-6">
                        <div className="glass-panel rounded-3xl p-8 border border-amber-500/20">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-2">Janam Kundali</h2>
                                <p className="text-amber-400">{kundaliData?.name}</p>
                            </div>

                            {/* Birth Details */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <p className="text-xs text-gray-400">Date of Birth</p>
                                    <p className="font-medium">{kundaliData?.dateOfBirth}</p>
                                    <p className="text-sm text-amber-400">{kundaliData?.dayOfBirth}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <p className="text-xs text-gray-400">Time of Birth</p>
                                    <p className="font-medium">{kundaliData?.timeOfBirth}</p>
                                </div>
                                <div className="col-span-2 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <p className="text-xs text-gray-400">Place of Birth</p>
                                    <p className="font-medium">{kundaliData?.placeOfBirth}</p>
                                </div>
                            </div>

                            {/* Kundali Details */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                                    <p className="text-xs text-gray-400">Rashi (राशि)</p>
                                    <p className="text-xl font-bold text-amber-400">{kundaliData?.rashi}</p>
                                    <p className="text-sm">{kundaliData?.rashiHindi}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                                    <p className="text-xs text-gray-400">Nakshatra</p>
                                    <p className="text-xl font-bold text-purple-400">{kundaliData?.nakshatra}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                                    <p className="text-xs text-gray-400">Lagna (लग्न)</p>
                                    <p className="text-xl font-bold text-green-400">{kundaliData?.lagna}</p>
                                    <p className="text-sm">{kundaliData?.lagnaHindi}</p>
                                </div>
                            </div>

                            {/* Planetary Positions */}
                            <h3 className="text-xl font-bold mb-4">Planetary Positions (ग्रह स्थिति)</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { name: "Sun", hindi: "सूर्य", sign: kundaliData?.planets?.sun },
                                    { name: "Moon", hindi: "चंद्र", sign: kundaliData?.planets?.moon },
                                    { name: "Mars", hindi: "मंगल", sign: kundaliData?.planets?.mars },
                                    { name: "Mercury", hindi: "बुध", sign: kundaliData?.planets?.mercury },
                                    { name: "Jupiter", hindi: "गुरु", sign: kundaliData?.planets?.jupiter },
                                    { name: "Venus", hindi: "शुक्र", sign: kundaliData?.planets?.venus },
                                    { name: "Saturn", hindi: "शनि", sign: kundaliData?.planets?.saturn },
                                    { name: "Rahu", hindi: "राहु", sign: kundaliData?.planets?.rahu },
                                    { name: "Ketu", hindi: "केतु", sign: kundaliData?.planets?.ketu },
                                ].map((planet, i) => (
                                    <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                                        <p className="text-xs text-gray-400">{planet.name} ({planet.hindi})</p>
                                        <p className="font-medium text-sm">{planet.sign}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => { setGenerated(false); setKundaliData(null); }}
                                className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-colors"
                            >
                                Generate New
                            </button>
                            <button
                                onClick={downloadPDF}
                                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Download PDF
                            </button>
                        </div>

                        {/* Upgrade CTA */}
                        <div className="glass-panel rounded-2xl p-6 border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-center">
                            <FileText className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                            <h3 className="text-xl font-bold mb-2">Want Detailed Predictions?</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Get comprehensive life predictions, Dasha analysis, and personalized remedies from our expert astrologers.
                            </p>
                            <Link href="/plans">
                                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:opacity-90 transition-opacity">
                                    View Premium Plans
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
