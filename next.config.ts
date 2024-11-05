import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "https://zershop.vercel.app",
  },
  reactStrictMode: true,
  // tambahkan konfigurasi lain di sini jika diperlukan
};

export default nextConfig;
