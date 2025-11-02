"use client";

import { useAuth } from "@/store/auth-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  // TODO: Add a way to check for admin role from the token or a user profile endpoint
  const isAdmin = false;

  const handleLogout = () => {
    logout();
    // Optional: redirect to home or login page
  };

  return (
    <header className="bg-white border-b sticky top-0 z-20">
      <nav className="container mx-auto flex items-center justify-between p-4 h-16">
        <Link href="/" className="text-xl font-bold text-blue-600">
          링코
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            // Logged-in user
            <>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="ghost">Admin</Button>
                </Link>
              )}
              <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            // Guest user
            <>
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
