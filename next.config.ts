import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "via.placeholder.com" }],
  },

  // async headers() {
  //   return [
  //     {
  //       source: "/:path*",
  //       headers: [
  //         {
  //           key: "Content-Security-Policy",
  //           value: "upgrade-insecure-requests",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
