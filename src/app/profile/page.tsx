'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

import { TriangleAlert } from 'lucide-react';

// Mock data based on the ProfileDto
const mockProfile = {
  email: 'user@example.com',
  nickname: 'testuser',
  displayName: '테스트 유저',
  bio: '안녕하세요! 멋진 코스를 만들고 공유하는 것을 좋아합니다. 🚀',
  avatarUrl: 'https://github.com/shadcn.png', // Placeholder image
};

// A simple stat component for demonstration
const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="text-center">
    <p className="font-bold text-xl">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

export default function ProfilePage() {
  const profile = mockProfile;

  return (
    <div className="p-4 md:p-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="items-center text-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
            <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{profile.displayName}</CardTitle>
          <CardDescription>@{profile.nickname}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md flex items-center">
            <TriangleAlert className="h-5 w-5 mr-3" />
            <p className="text-sm">데모용 페이지입니다. 표시되는 데이터는 실제 사용자 정보가 아닙니다.</p>
          </div>

          <p className="text-center mb-6">{profile.bio}</p>
          
          <div className="flex justify-around p-4 rounded-lg bg-gray-50 dark:bg-gray-800 mb-6">
            <Stat label="작성한 코스" value={5} />
            <Stat label="받은 좋아요" value={128} />
          </div>

          <Link href="/profile/edit" className="w-full">
            <Button variant="outline" className="w-full">프로필 수정</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
