// src/app/profile/setup-nickname/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { setNickname as apiSetNickname } from '@/lib/api'; // Assuming an API call for setting nickname

export default function SetupNicknamePage() {
  const [nickname, setNickname] = useState('');
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Redirect to login if not authenticated
    }
    // TODO: Check if nickname is already set. If so, redirect to home.
  }, [isAuthenticated, router]);

  const handleSetNickname = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    if (!token) {
      alert('인증 토큰이 없습니다. 다시 로그인해주세요.');
      router.push('/login');
      return;
    }

    try {
      await apiSetNickname(nickname, token); // Assuming this API exists
      alert('닉네임이 설정되었습니다!');
      router.push('/'); // Redirect to home after setting nickname
    } catch (error) {
      console.error('Failed to set nickname:', error);
      alert('닉네임 설정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>인증 중...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">닉네임 설정</CardTitle>
          <CardDescription>
            서비스 이용을 위해 닉네임을 설정해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              type="text"
              placeholder="예: 여행가김철수"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleSetNickname}>
            닉네임 설정 완료
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
