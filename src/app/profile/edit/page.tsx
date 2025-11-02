'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

import { TriangleAlert } from 'lucide-react';

// Mock data - in a real app, this would be fetched
const mockProfile = {
  displayName: '테스트 유저',
  bio: '안녕하세요! 멋진 코스를 만들고 공유하는 것을 좋아합니다. 🚀',
  avatarUrl: 'https://github.com/shadcn.png',
};

export default function ProfileEditPage() {
  const [displayName, setDisplayName] = useState(mockProfile.displayName);
  const [bio, setBio] = useState(mockProfile.bio);
  const [avatarUrl] = useState(mockProfile.avatarUrl);

  const handleSave = () => {
    // TODO: Implement actual profile update logic
    console.log('Saving profile:', { displayName, bio, avatarUrl });
    alert('프로필이 저장되었습니다. (데모 기능)');
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
            <p className="text-sm">데모용 페이지입니다. 여기서 저장해도 실제 정보는 변경되지 않습니다.</p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button variant="outline">이미지 변경</Button>
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
