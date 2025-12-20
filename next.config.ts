import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.qrserver.com", // ✅ อนุญาต API สร้าง QR Code
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org", // ✅ อนุญาตโลโก้ PromptPay จาก Wikipedia
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com", // เผื่อไว้สำหรับรูปอื่นๆ จาก GitHub
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com", // สำหรับรูป Avatar การ์ตูน (ถ้าใช้)
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
