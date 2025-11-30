"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from "@/store/auth-provider";
import { useEffect, useState } from "react"; // Import useEffect and useState
import { getUserProfile } from "@/lib/api"; // Import getUserProfile API
import type { UserProfileDto } from "@/types"; // Import UserProfileDto type

import { TriangleAlert, Loader2 } from "lucide-react"; // Import Loader2

export default function ProfilePage() {
  const { user, token } = useAuth(); // Get user and token from auth context

  const [userProfile, setUserProfile] = useState<UserProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const profile = await getUserProfile(token);
          setUserProfile(profile);
        } catch (err: unknown) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else {
      setLoading(false); // Not logged in, stop loading
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <TriangleAlert className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">로그인이 필요합니다</h2>
        <p className="mb-6 text-gray-600">
          이 페이지에 접근하려면 먼저 로그인해주세요.
        </p>
        <Link href="/login">
          <Button>로그인 페이지로 이동</Button>
        </Link>
      </div>
    );
  }

  console.log(error, "error");

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        프로필을 불러오는데 실패했습니다: {error}
      </div>
    );
  }

  // Use userProfile data from context or fetched profile, fallback to placeholders
  const displayName = userProfile?.nickname || user?.nickname || "Guest";
  const email = userProfile?.email || user?.email || "guest@example.com";
  const avatarUrl = userProfile?.avatarUrl || "/images/profile.avif"; // Placeholder image if no avatarUrl
  const bio = userProfile?.bio || "아직 자기소개가 없습니다."; // Use fetched bio or default

  return (
    <div className="p-4 md:p-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="items-center text-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{displayName}</CardTitle>
          <CardDescription>{email}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-6">{bio}</p>

          <Link href="/profile/edit" className="w-full">
            <Button variant="outline" className="w-full">
              프로필 수정
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
