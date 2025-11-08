import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import QueryProvider from "@/components/common/QueryProvider";
import CustomNavermapsProvider from "@/components/common/NavermapsProvider";

import { AuthProvider } from "@/store/auth-provider";

import BottomNav from "@/components/common/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Play Course",
  description: "Share your own play course!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full">
      {/* Added h-full w-full */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full flex flex-col`} // Added h-full w-full flex flex-col
      >
        <QueryProvider>
          <AuthProvider>
            <CustomNavermapsProvider>
              <Header />
              <main className="flex-grow pb-16 md:pb-0">{children}</main>
              <BottomNav />
            </CustomNavermapsProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
