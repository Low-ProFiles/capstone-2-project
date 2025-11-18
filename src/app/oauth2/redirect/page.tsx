// src/app/oauth2/redirect/page.tsx
"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/store/auth-provider';

const OAuth2RedirectPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (token) {
      setAuthToken(token);
      router.push('/');
    } else if (error) {
      console.error('OAuth Login Error:', error);
      alert(`OAuth 로그인 실패: ${error}`);
      router.push('/login');
    } else {
      router.push('/login');
    }
  }, [searchParams, setAuthToken, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>로그인 처리 중...</p>
    </div>
  );
};

export default function OAuth2RedirectPage() {
  return (
    <Suspense fallback={<div>Loading OAuth...</div>}>
      <OAuth2RedirectPageContent />
    </Suspense>
  );
}
