// src/app/signup/verify-email/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from '@/lib/api';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    try {
      // This uses the /api/auth/verify endpoint from ApiAuthController
      const responseMessage = await apiFetch('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ email, code }),
      });
      alert(responseMessage || '이메일 인증이 완료되었습니다. 로그인 페이지로 이동합니다.');
      router.push('/login');
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message || '인증에 실패했습니다. 이메일과 코드를 다시 확인해주세요.');
      } else {
        setServerError('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">이메일 인증</CardTitle>
          <CardDescription>
            가입 시 사용한 이메일과 메일로 받은 인증 코드를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {serverError && <p className="text-sm text-red-500 text-center mb-4">{serverError}</p>}
          <form onSubmit={handleVerification} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">인증 코드</Label>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              인증 확인
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
