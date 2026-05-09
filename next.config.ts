import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
   /*  domains: ["ahhequkilzwvituhbsmc.supabase.co"], */
   remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ahhequkilzwvituhbsmc.supabase.co',
      },
    ],
  },
};

export default nextConfig;
