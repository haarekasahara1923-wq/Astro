import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  // Needed for ZegoCloud WebRTC which uses native browser APIs
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent WebRTC-related packages from being bundled server-side
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        "zego-express-engine-webrtc",
        "zego-zim-web",
      ];
    }
    return config;
  },
  // Allow images from Cloudinary and other sources
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
