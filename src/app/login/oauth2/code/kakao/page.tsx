// src/app/login/oauth2/code/kakao/page.tsx
"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/store/auth-provider';
import { kakaoLogin } from '@/lib/api';

const KakaoRedirectHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthToken } = useAuth();

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      const processCode = async () => {
        try {
          // 프론트엔드에서 받은 code를 백엔드로 보내 토큰을 요청합니다.
          // 참고: 이 로직이 동작하려면 백엔드에 `/api/auth/login/kakao` POST 엔드포인트가 필요합니다.
          const tokenData = await kakaoLogin(code);
          if (tokenData.token) {
            setAuthToken(tokenData.token);
            router.push('/');
          } else {
            throw new Error('토큰이 응답에 포함되지 않았습니다.');
          }
        } catch (error) {
          console.error('Kakao login processing error:', error);
          const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
          alert(`카카오 로그인 처리 중 오류가 발생했습니다: ${errorMessage}`);
          router.push('/login');
        }
      };
      processCode();
    } else {
      // 코드가 없는 경우
      alert('카카오 인증 코드를 받지 못했습니다.');
      router.push('/login');
    }
  }, [searchParams, setAuthToken, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>카카오 로그인 처리 중입니다. 잠시만 기다려주세요...</p>
    </div>
  );
};

export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<div>Loading Kakao Login...</div>}>
      <KakaoRedirectHandler />
    </Suspense>
  );
}
