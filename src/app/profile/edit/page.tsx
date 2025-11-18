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
import { updateUserProfile as apiUpdateProfile } from "@/lib/api";
import ImageUpload from "@/components/common/ImageUpload"; // Import ImageUpload

import { TriangleAlert } from "lucide-react";

export default function ProfileEditPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [nickname, setNickname] = useState(user?.nickname || "");
  const [bio, setBio] = useState(
    "안녕하세요! 멋진 코스를 만들고 공유하는 것을 좋아합니다. 🚀"
  ); // Mock bio
  const [avatarUrlState, setAvatarUrlState] = useState(
    "https://github.com/shadcn.png"
  ); // State for avatar URL

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || "");
      // If backend provided bio, set it here. For now, using mock.
    }
  }, [user]);

  const handleSave = async () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    try {
      await apiUpdateProfile(
        { nickname, bio, avatarUrl: avatarUrlState },
        token
      );
      alert("프로필이 저장되었습니다. (데모 기능)");
      router.push("/profile");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("프로필 저장에 실패했습니다.");
    }
  };

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
              <AvatarImage src={avatarUrlState} alt={nickname} />
              <AvatarFallback>{nickname.charAt(0)}</AvatarFallback>
            </Avatar>
            <ImageUpload
              onUploadSuccess={setAvatarUrlState}
              currentImageUrl={avatarUrlState}
              label="프로필 이미지 변경"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">표시 이름</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
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
