import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "viloqypgpxkwlqmaumjm.supabase.co",
      },
    ],
  },
};

export default nextConfig;