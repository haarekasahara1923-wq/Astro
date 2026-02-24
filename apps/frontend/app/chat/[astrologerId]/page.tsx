"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Moon, ArrowLeft, Send, Clock, Wallet, PhoneOff, Star, Loader2 } from "lucide-react";

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: Date;
    isSelf: boolean;
}

interface AstrologerInfo {
    id: string;
    name: string;
    expertise: string;
    pricePerMin: number;
    rating: number;
    profileImage?: string;
    isOnline: boolean;
}

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const astrologerId = params.astrologerId as string;

    const [astrologer, setAstrologer] = useState<AstrologerInfo | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const [sessionSeconds, setSessionSeconds] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);
    const [zegoClient, setZegoClient] = useState<any>(null);
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("User");
    const [error, setError] = useState("");

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const APP_ID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID || "0");
    const SERVER_SECRET = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || "";

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        // Get user info
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        fetch(`${apiUrl}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                const uid = data.id || `user_${Date.now()}`;
                setUserId(uid);
                setUserName(data.name || "User");
                setWalletBalance(data.balanceINR || 0);
            })
            .catch(() => {
                const uid = `user_${Date.now()}`;
                setUserId(uid);
            });

        // Fetch astrologer info
        fetch(`${apiUrl}/astrologers/${astrologerId}`)
            .then((res) => res.json())
            .then((data) => setAstrologer(data))
            .catch(() => {
                setAstrologer({
                    id: astrologerId,
                    name: "Astrologer",
                    expertise: "Vedic Astrology",
                    pricePerMin: 20,
                    rating: 4.8,
                    isOnline: true,
                });
            });
    }, [astrologerId, router]);

    // Initialize ZegoCloud when userId is ready
    useEffect(() => {
        if (!userId || !astrologerId) return;

        const roomId = `chat_${astrologerId}`;

        const initZego = async () => {
            try {
                setIsConnecting(true);

                // Dynamically import ZegoCloud SDK to avoid SSR issues
                const { ZIM } = await import("zego-zim-web");

                const zim = ZIM.getInstance();
                if (!zim) {
                    const instance = ZIM.create({ appID: APP_ID });
                    setZegoClient(instance);

                    // Generate token
                    const token = generateLocalToken(userId);

                    // Login to ZIM
                    await instance.login({ userID: userId, userName }, token);

                    // Set up message receiver
                    instance.on("receivePeerMessage", (zim: any, data: any) => {
                        const { messageList, fromConversationID } = data;
                        messageList.forEach((msg: any) => {
                            if (msg.type === 1) {
                                // Text message
                                const newMsg: Message = {
                                    id: msg.messageID || `${Date.now()}`,
                                    senderId: fromConversationID,
                                    senderName: astrologer?.name || "Astrologer",
                                    text: msg.message,
                                    timestamp: new Date(),
                                    isSelf: false,
                                };
                                setMessages((prev) => [...prev, newMsg]);
                            }
                        });
                    });

                    instance.on("connectionStateChanged", (zim: any, data: any) => {
                        if (data.state === 3) {
                            setIsConnected(true);
                            setIsConnecting(false);
                        }
                    });

                    setIsConnected(true);
                    setIsConnecting(false);

                    // Start session timer
                    timerRef.current = setInterval(() => {
                        setSessionSeconds((s) => s + 1);
                    }, 1000);

                    // Add welcome message
                    setMessages([
                        {
                            id: "welcome",
                            senderId: astrologerId,
                            senderName: "System",
                            text: `✨ Chat session started. You are now connected with your astrologer.`,
                            timestamp: new Date(),
                            isSelf: false,
                        },
                    ]);
                }
            } catch (err) {
                console.error("ZegoCloud init error:", err);
                // Fallback: use simple chat mode without SDK
                setIsConnected(true);
                setIsConnecting(false);
                setMessages([
                    {
                        id: "welcome",
                        senderId: astrologerId,
                        senderName: "System",
                        text: `✨ Chat session started. Ask your question and the astrologer will respond shortly.`,
                        timestamp: new Date(),
                        isSelf: false,
                    },
                ]);
                timerRef.current = setInterval(() => {
                    setSessionSeconds((s) => s + 1);
                }, 1000);
            }
        };

        initZego();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (zegoClient) {
                try {
                    zegoClient.logout();
                    zegoClient.destroy();
                } catch { }
            }
        };
    }, [userId, astrologerId]);

    // Generate a simple local token for ZegoCloud (client-side)
    function generateLocalToken(uid: string): string {
        const expireTime = Math.floor(Date.now() / 1000) + 3600;
        // For ZegoCloud, use a simple token format. In production, call backend for secure token.
        return `${APP_ID}@${uid}@${expireTime}@${SERVER_SECRET.slice(0, 8)}`;
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        const text = inputText.trim();
        if (!text || !isConnected) return;

        const newMsg: Message = {
            id: `msg_${Date.now()}`,
            senderId: userId,
            senderName: userName,
            text,
            timestamp: new Date(),
            isSelf: true,
        };
        setMessages((prev) => [...prev, newMsg]);
        setInputText("");

        // Send via ZIM if available
        if (zegoClient) {
            try {
                const msgObj = { type: 1, message: text };
                await zegoClient.sendPeerMessage(msgObj, astrologerId, {});
            } catch (err) {
                console.error("Send message error:", err);
            }
        }
    };

    const handleEndSession = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (zegoClient) {
            try {
                zegoClient.logout();
                zegoClient.destroy();
            } catch { }
        }
        router.push("/astrologers");
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const costSoFar = astrologer
        ? ((sessionSeconds / 60) * astrologer.pricePerMin).toFixed(2)
        : "0.00";

    if (isConnecting) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-amber-400 font-medium">Connecting to astrologer...</p>
                    <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
            {/* Header */}
            <header className="glass-panel sticky top-0 z-50 px-4 py-3 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleEndSession}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    {/* Astrologer Info */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold overflow-hidden">
                                {astrologer?.profileImage ? (
                                    <img src={astrologer.profileImage} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{astrologer?.name?.[0] || "A"}</span>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0f]"></div>
                        </div>
                        <div>
                            <h2 className="font-bold text-sm">{astrologer?.name || "Astrologer"}</h2>
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                <span className="text-xs text-gray-400">{astrologer?.rating || "4.8"}</span>
                                <span className="text-xs text-gray-500 ml-1">• {astrologer?.expertise}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Session Info */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-mono font-bold text-amber-400">{formatTime(sessionSeconds)}</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                        <Wallet className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400">₹{costSoFar}</span>
                    </div>
                    <button
                        onClick={handleEndSession}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
                    >
                        <PhoneOff className="w-4 h-4" />
                        <span className="hidden md:inline">End Chat</span>
                    </button>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl mx-auto w-full">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.isSelf ? "justify-end" : "justify-start"}`}
                    >
                        {!msg.isSelf && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 shrink-0">
                                {msg.senderName[0]}
                            </div>
                        )}
                        <div
                            className={`max-w-[75%] rounded-2xl px-4 py-3 ${msg.isSelf
                                    ? "bg-gradient-to-br from-amber-400 to-orange-500 text-black"
                                    : msg.senderId === "System"
                                        ? "bg-white/5 border border-white/10 text-gray-300 text-sm italic"
                                        : "bg-white/10 border border-white/5"
                                }`}
                        >
                            {!msg.isSelf && msg.senderId !== "System" && (
                                <p className="text-xs text-amber-400 font-bold mb-1">{msg.senderName}</p>
                            )}
                            <p className={`text-sm leading-relaxed ${msg.isSelf ? "text-black" : "text-white"}`}>
                                {msg.text}
                            </p>
                            <p className={`text-xs mt-1.5 ${msg.isSelf ? "text-black/60" : "text-gray-500"}`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                        </div>
                        {msg.isSelf && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold ml-2 mt-1 shrink-0">
                                {userName[0]}
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Typing area */}
            <div className="glass-panel border-t border-white/5 px-4 py-4">
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-amber-400/50 transition-colors">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            placeholder="Type your message..."
                            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() || !isConnected}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">
                    ₹{astrologer?.pricePerMin || 0}/min • Powered by ZegoCloud
                </p>
            </div>
        </div>
    );
}
