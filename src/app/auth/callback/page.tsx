'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/store/auth-provider';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      setAuthToken(token);
      router.push('/');
    } else {
      // Handle cases where the token is missing
      console.error('Auth token not found in URL');
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
      router.push('/login');
    }
  }, [router, searchParams, setAuthToken]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>로그인 중입니다...</p>
      </div>
    </div>
  );
}
