"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth-provider";
import {
  updateUserProfile as apiUpdateProfile,
  getUserProfile as apiGetUserProfile,
} from "@/lib/api"; // Import getUserProfile
import ImageUpload from "@/components/common/ImageUpload";

import { TriangleAlert, Loader2 } from "lucide-react"; // Import Loader2

export default function ProfileEditPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [nickname, setNickname] = useState(""); // For display purposes
  const [displayName, setDisplayName] = useState(""); // For editing
  const [bio, setBio] = useState("");
  const [avatarUrlState, setAvatarUrlState] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const profile = await apiGetUserProfile(token);
          setNickname(profile.nickname);
          setDisplayName(profile.displayName);
          setBio(profile.bio || "");
          setAvatarUrlState(profile.avatarUrl || "");
        } catch (err: unknown) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleSave = async () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    try {
      await apiUpdateProfile(
        { displayName, bio, avatarUrl: avatarUrlState }, // Send displayName
        token
      );
      alert("프로필이 성공적으로 저장되었습니다.");
      router.push("/profile");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("프로필 저장에 실패했습니다.");
    }
  };

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

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        프로필을 불러오는데 실패했습니다: {error}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">프로필 수정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md flex items-center">
            <TriangleAlert className="h-5 w-5 mr-3" />
            <p className="text-sm">
              데모용 페이지입니다. 여기서 저장해도 실제 정보는 변경되지
              않습니다.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={avatarUrlState || "/images/profile.avif"}
                alt={nickname}
              />
              <AvatarFallback>
                {(displayName || nickname).charAt(0)}
              </AvatarFallback>
            </Avatar>
            <ImageUpload
              onUploadSuccess={setAvatarUrlState}
              currentImageUrl={avatarUrlState}
              label="프로필 이미지 변경"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">표시 이름</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">자기소개</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Link href="/profile">
            <Button variant="ghost">취소</Button>
          </Link>
          <Button onClick={handleSave}>저장</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
