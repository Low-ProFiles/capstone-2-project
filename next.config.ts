import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "via.placeholder.com" },
      {
        protocol: "https",
        hostname: "linko-s3-images-2025.s3.ap-northeast-2.amazonaws.com",
      },
    ],
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
