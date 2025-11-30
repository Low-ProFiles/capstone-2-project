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
import { Loader2, LogIn } from "lucide-react";

export default function ProfilePage() {
  const { userProfile, isAuthenticated } = useAuth();

  // While authenticated but profile is being fetched
  if (isAuthenticated && !userProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // If not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <LogIn className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">로그인이 필요합니다</h2>
        <p className="mb-6 text-gray-600">이 페이지에 접근하려면 먼저 로그인해주세요.</p>
        <Link href="/login">
          <Button>로그인 페이지로 이동</Button>
        </Link>
      </div>
    );
  }
  
  // If authenticated and profile is loaded
  const displayName = userProfile?.displayName || userProfile?.nickname || "Guest";
  const email = userProfile?.email || "guest@example.com";
  const avatarUrl = userProfile?.avatarUrl || "/images/profile.avif";
  const bio = userProfile?.bio || "아직 자기소개가 없습니다.";

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
