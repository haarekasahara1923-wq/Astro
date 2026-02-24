"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
    Mic, MicOff, Video, VideoOff, PhoneOff, Clock,
    ArrowLeft, Star, Wallet, Phone
} from "lucide-react";

interface AstrologerInfo {
    id: string;
    name: string;
    expertise: string;
    pricePerMin: number;
    rating: number;
    profileImage?: string;
    isOnline: boolean;
}

// Inner component uses useSearchParams — must be inside Suspense
function VideoCallInner() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const astrologerId = params.astrologerId as string;
    const isCallMode = searchParams.get("mode") === "call"; // voice-only when true

    const [astrologer, setAstrologer] = useState<AstrologerInfo | null>(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [sessionSeconds, setSessionSeconds] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(isCallMode); // call mode = camera off
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("User");
    const [zegoEngine, setZegoEngine] = useState<any>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const APP_ID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID || "0");
    const SERVER_SECRET = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || "";

    // Auth + data fetch
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

        fetch(`${apiUrl}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setUserId(data.id || `user_${Date.now()}`);
                setUserName(data.name || "User");
            })
            .catch(() => setUserId(`user_${Date.now()}`));

        fetch(`${apiUrl}/astrologers/${astrologerId}`)
            .then((res) => res.json())
            .then((data) => setAstrologer(data))
            .catch(() =>
                setAstrologer({
                    id: astrologerId,
                    name: "Astrologer",
                    expertise: "Vedic Astrology",
                    pricePerMin: isCallMode ? 15 : 30,
                    rating: 4.9,
                    isOnline: true,
                })
            );
    }, [astrologerId, router, isCallMode]);

    // ZegoCloud init
    useEffect(() => {
        if (!userId) return;

        const initZego = async () => {
            setIsConnecting(true);
            const roomId = `${isCallMode ? "call" : "video"}_${astrologerId}`;

            try {
                const { ZegoExpressEngine } = await import("zego-express-engine-webrtc");
                const zg = new ZegoExpressEngine(APP_ID, SERVER_SECRET);
                setZegoEngine(zg);

                const token = `${APP_ID}_${userId}_${Math.floor(Date.now() / 1000) + 3600}`;

                await zg.loginRoom(
                    roomId,
                    token,
                    { userID: userId, userName },
                    { userUpdate: true }
                );

                // Create stream — audio only in call mode
                const stream = await zg.createStream({
                    camera: {
                        video: !isCallMode,
                        audio: true,
                    },
                });
                setLocalStream(stream);

                if (localVideoRef.current && !isCallMode) {
                    localVideoRef.current.srcObject = stream;
                }

                zg.startPublishingStream(`${userId}_${roomId}`, stream);

                zg.on("roomStreamUpdate", async (_roomID: string, updateType: string, streamList: any[]) => {
                    if (updateType === "ADD" && streamList.length > 0) {
                        const remoteStream = await zg.startPlayingStream(streamList[0].streamID);
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream;
                        }
                        setIsConnected(true);
                    }
                });

                setIsConnected(true);
                setIsConnecting(false);
                timerRef.current = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
            } catch (err) {
                console.error("ZegoCloud init error:", err);
                // Fallback: use native getUserMedia
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: !isCallMode,
                        audio: true,
                    });
                    setLocalStream(stream);
                    if (localVideoRef.current && !isCallMode) {
                        localVideoRef.current.srcObject = stream;
                    }
                } catch { }

                setIsConnected(true);
                setIsConnecting(false);
                timerRef.current = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
            }
        };

        initZego();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            cleanup();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const cleanup = () => {
        localStream?.getTracks().forEach((t) => t.stop());
        if (zegoEngine) {
            try {
                zegoEngine.stopPublishingStream();
                zegoEngine.logoutRoom();
                zegoEngine.destroyEngine();
            } catch { }
        }
    };

    const handleToggleMute = () => {
        localStream?.getAudioTracks().forEach((t) => (t.enabled = isMuted));
        zegoEngine?.muteMicrophone(!isMuted);
        setIsMuted(!isMuted);
    };

    const handleToggleVideo = () => {
        localStream?.getVideoTracks().forEach((t) => (t.enabled = isVideoOff));
        zegoEngine?.mutePublishStreamVideo(!isVideoOff);
        setIsVideoOff(!isVideoOff);
    };

    const handleEndCall = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        cleanup();
        router.push("/astrologers");
    };

    const formatTime = (s: number) =>
        `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

    const costSoFar = astrologer
        ? ((sessionSeconds / 60) * astrologer.pricePerMin).toFixed(2)
        : "0.00";

    /* ── Connecting screen ── */
    if (isConnecting) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center">
                <div className="relative w-28 h-28 mb-6">
                    <div className="absolute inset-0 border-4 border-amber-400/20 rounded-full animate-ping" />
                    <div className="absolute inset-3 border-4 border-amber-400/40 rounded-full animate-ping" style={{ animationDelay: "0.3s" }} />
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold text-3xl overflow-hidden">
                        {astrologer?.profileImage
                            ? <img src={astrologer.profileImage} alt="" className="w-full h-full object-cover" />
                            : astrologer?.name?.[0] || "A"}
                    </div>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">
                    {isCallMode ? "Calling Astrologer..." : "Starting Video Call..."}
                </h2>
                <p className="text-gray-400 text-sm mb-8">Please wait while we connect you</p>
                <button
                    onClick={handleEndCall}
                    className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                    <PhoneOff className="w-6 h-6" />
                </button>
            </div>
        );
    }

    /* ── Call mode UI (voice only — no video background) ── */
    if (isCallMode) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
                    <button onClick={handleEndCall} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <div className="text-center">
                        <h2 className="font-bold">{astrologer?.name}</h2>
                        <div className="flex items-center justify-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs text-gray-400">{astrologer?.rating}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-mono font-bold text-amber-400">{formatTime(sessionSeconds)}</span>
                        <span className="text-xs text-green-400">₹{costSoFar}</span>
                    </div>
                </div>

                {/* Voice call center */}
                <div className="flex-1 flex flex-col items-center justify-center gap-6">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-5xl font-bold text-white overflow-hidden relative z-10">
                            {astrologer?.profileImage
                                ? <img src={astrologer.profileImage} alt="" className="w-full h-full object-cover" />
                                : astrologer?.name?.[0] || "A"}
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold">{astrologer?.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">{astrologer?.expertise}</p>
                        <div className="mt-3 flex items-center gap-2 justify-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-green-400 text-sm font-medium">Voice Connected</span>
                        </div>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <p className="text-xs text-gray-400">₹{astrologer?.pricePerMin}/min • Voice Call via ZegoCloud</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="pb-12 flex items-center justify-center gap-8">
                    <button
                        onClick={handleToggleMute}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isMuted
                            ? "bg-red-500/30 border border-red-500/50 text-red-400"
                            : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                            }`}
                    >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>

                    <button
                        onClick={handleEndCall}
                        className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-xl shadow-red-500/40"
                    >
                        <PhoneOff className="w-8 h-8" />
                    </button>

                    {/* Switch to video button */}
                    <button
                        onClick={handleToggleVideo}
                        className="w-16 h-16 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 flex items-center justify-center transition-all"
                        title="Switch to Video"
                    >
                        <Video className="w-6 h-6" />
                    </button>
                </div>
            </div>
        );
    }

    /* ── Video mode UI ── */
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden">
            {/* Remote Video (Full Background) */}
            <div className="absolute inset-0 bg-gray-900">
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                {!isConnected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
                                {astrologer?.profileImage
                                    ? <img src={astrologer.profileImage} alt="" className="w-full h-full object-cover" />
                                    : astrologer?.name?.[0] || "A"}
                            </div>
                            <p className="text-white font-bold text-xl">{astrologer?.name}</p>
                            <p className="text-gray-400 text-sm">Waiting for astrologer to join...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Header Overlay */}
            <div className="relative z-10 flex items-center justify-between px-4 py-4 bg-gradient-to-b from-black/70 to-transparent">
                <button onClick={handleEndCall} className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-center">
                    <h2 className="font-bold">{astrologer?.name}</h2>
                    <div className="flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs text-gray-300">{astrologer?.rating}</span>
                        <span className="text-xs text-gray-400 ml-1">• {astrologer?.expertise}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-amber-400/30">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-sm font-mono font-bold text-amber-400">{formatTime(sessionSeconds)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40">
                        <Wallet className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-xs text-green-400">₹{costSoFar}</span>
                    </div>
                </div>
            </div>

            {/* Local Video (PiP) */}
            <div className="absolute top-20 right-4 z-20 w-32 h-44 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-gray-800">
                <video
                    ref={localVideoRef}
                    autoPlay playsInline muted
                    className={`w-full h-full object-cover ${isVideoOff ? "hidden" : ""}`}
                />
                {isVideoOff && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <VideoOff className="w-8 h-8 text-gray-400" />
                    </div>
                )}
                <div className="absolute bottom-1 left-0 right-0 text-center">
                    <span className="text-xs text-white/70 font-medium">{userName}</span>
                </div>
            </div>

            {/* Control Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent px-6 pb-8 pt-12">
                <div className="flex items-center justify-center gap-6">
                    <button
                        onClick={handleToggleMute}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted
                            ? "bg-red-500/30 border border-red-500/50 text-red-400"
                            : "bg-white/20 border border-white/20 text-white hover:bg-white/30"
                            }`}
                    >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>

                    <button
                        onClick={handleEndCall}
                        className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                    >
                        <PhoneOff className="w-7 h-7" />
                    </button>

                    <button
                        onClick={handleToggleVideo}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isVideoOff
                            ? "bg-red-500/30 border border-red-500/50 text-red-400"
                            : "bg-white/20 border border-white/20 text-white hover:bg-white/30"
                            }`}
                    >
                        {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                    </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">
                    ₹{astrologer?.pricePerMin || 0}/min • Video Call via ZegoCloud
                </p>
            </div>
        </div>
    );
}

// Outer default export wraps inner in Suspense (required for useSearchParams in Next.js)
export default function VideoCallPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <VideoCallInner />
        </Suspense>
    );
}
