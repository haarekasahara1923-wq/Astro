"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Mic, MicOff, Video, VideoOff, PhoneOff, Clock,
    ArrowLeft, Star, Wallet, MessageSquare
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

export default function VideoCallPage() {
    const params = useParams();
    const router = useRouter();
    const astrologerId = params.astrologerId as string;

    const [astrologer, setAstrologer] = useState<AstrologerInfo | null>(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [sessionSeconds, setSessionSeconds] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("User");
    const [zegoEngine, setZegoEngine] = useState<any>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const APP_ID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID || "0");
    const SERVER_SECRET = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || "";

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

        // Get user info
        fetch(`${apiUrl}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                const uid = data.id || `user_${Date.now()}`;
                setUserId(uid);
                setUserName(data.name || "User");
            })
            .catch(() => setUserId(`user_${Date.now()}`));

        // Fetch astrologer info
        fetch(`${apiUrl}/astrologers/${astrologerId}`)
            .then((res) => res.json())
            .then((data) => setAstrologer(data))
            .catch(() =>
                setAstrologer({
                    id: astrologerId,
                    name: "Astrologer",
                    expertise: "Vedic Astrology",
                    pricePerMin: 30,
                    rating: 4.9,
                    isOnline: true,
                })
            );
    }, [astrologerId, router]);

    useEffect(() => {
        if (!userId) return;

        const initZegoVideo = async () => {
            try {
                setIsConnecting(true);
                const roomId = `video_${astrologerId}`;

                // Dynamically import ZegoCloud Express SDK
                const { ZegoExpressEngine } = await import("zego-express-engine-webrtc");

                const zg = new ZegoExpressEngine(APP_ID, SERVER_SECRET);
                setZegoEngine(zg);

                // Generate token (client-side for demo; use backend endpoint for production)
                const token = generateSimpleToken(userId);

                // Login to room
                const loginResult = await zg.loginRoom(
                    roomId,
                    token,
                    { userID: userId, userName },
                    { userUpdate: true }
                );

                // Create local stream
                const stream = await zg.createStream({
                    camera: { video: true, audio: true },
                });
                setLocalStream(stream);

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Publish local stream
                const publishStreamId = `${userId}_${roomId}`;
                zg.startPublishingStream(publishStreamId, stream);

                // Listen for remote streams
                zg.on("roomStreamUpdate", async (roomID: string, updateType: string, streamList: any[]) => {
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

                timerRef.current = setInterval(() => {
                    setSessionSeconds((s) => s + 1);
                }, 1000);
            } catch (err) {
                console.error("ZegoCloud video init error:", err);
                // Fallback: show local camera only
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    setLocalStream(stream);
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                } catch { }
                setIsConnected(true);
                setIsConnecting(false);
                timerRef.current = setInterval(() => {
                    setSessionSeconds((s) => s + 1);
                }, 1000);
            }
        };

        initZegoVideo();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            cleanup();
        };
    }, [userId, astrologerId]);

    function generateSimpleToken(uid: string): string {
        const expireTime = Math.floor(Date.now() / 1000) + 3600;
        return `${APP_ID}@${uid}@${expireTime}`;
    }

    const cleanup = () => {
        if (localStream) {
            localStream.getTracks().forEach((t) => t.stop());
        }
        if (zegoEngine) {
            try {
                zegoEngine.stopPublishingStream();
                zegoEngine.logoutRoom();
                zegoEngine.destroyEngine();
            } catch { }
        }
    };

    const handleToggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach((t) => (t.enabled = isMuted));
        }
        if (zegoEngine) {
            zegoEngine.muteMicrophone(!isMuted);
        }
        setIsMuted(!isMuted);
    };

    const handleToggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach((t) => (t.enabled = isVideoOff));
        }
        if (zegoEngine) {
            zegoEngine.mutePublishStreamVideo(!isVideoOff);
        }
        setIsVideoOff(!isVideoOff);
    };

    const handleEndCall = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        cleanup();
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
            <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center">
                <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-amber-400/30 rounded-full animate-ping"></div>
                    <div className="absolute inset-2 border-4 border-amber-400/50 rounded-full animate-ping animation-delay-200"></div>
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold text-2xl">
                        {astrologer?.name?.[0] || "A"}
                    </div>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Calling Astrologer...</h2>
                <p className="text-gray-400 text-sm mb-8">Please wait while we connect you</p>
                <button
                    onClick={handleEndCall}
                    className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                >
                    <PhoneOff className="w-6 h-6" />
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden">
            {/* Remote Video (Full Background) */}
            <div className="absolute inset-0 bg-gray-900">
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />
                {!isConnected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white">
                                {astrologer?.name?.[0] || "A"}
                            </div>
                            <p className="text-white font-bold text-xl">{astrologer?.name}</p>
                            <p className="text-gray-400 text-sm">Waiting for astrologer to join...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Header Overlay */}
            <div className="relative z-10 flex items-center justify-between px-4 py-4 bg-gradient-to-b from-black/70 to-transparent">
                <button
                    onClick={handleEndCall}
                    className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                >
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

            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-20 right-4 z-20 w-32 h-44 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-gray-800">
                <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
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

            {/* Control Bar (Bottom) */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent px-6 pb-8 pt-12">
                <div className="flex items-center justify-center gap-6">
                    {/* Mute */}
                    <button
                        onClick={handleToggleMute}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted
                                ? "bg-red-500/30 border border-red-500/50 text-red-400"
                                : "bg-white/20 border border-white/20 text-white hover:bg-white/30"
                            }`}
                    >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>

                    {/* End Call */}
                    <button
                        onClick={handleEndCall}
                        className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                    >
                        <PhoneOff className="w-7 h-7" />
                    </button>

                    {/* Toggle Video */}
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

                {/* Rate info */}
                <p className="text-center text-xs text-gray-400 mt-4">
                    ₹{astrologer?.pricePerMin || 0}/min • Video secured by ZegoCloud
                </p>
            </div>
        </div>
    );
}
