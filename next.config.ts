import type { NextConfig } from "next";
import path from "path"; // Import path module

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'via.placeholder.com' }],
  },
  outputFileTracingRoot: path.join(__dirname, '../../'), // Set project root for file tracing
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;
