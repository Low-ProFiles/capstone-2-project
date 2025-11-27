"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { useAuth } from "@/store/auth-provider";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const { signup, login } = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!termsAgreed || !privacyAgreed) {
      alert("이용약관과 개인정보 처리방침에 모두 동의해야 합니다.");
      return;
    }
    try {
      await signup({ nickname, email, password, passwordConfirm, termsAgreed, privacyAgreed });
      // After signup, attempt to log in
      await login({ email, password }); // Use the login function from useAuth
      router.push("/"); // Redirect to home
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || "회원가입 또는 로그인에 실패했습니다.");
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
          <CardDescription>계정을 만들려면 정보를 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                type="text"
                placeholder="홍길동"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
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
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-confirm">비밀번호 확인</Label>
              <Input
                id="password-confirm"
                type="password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} />
              <label htmlFor="terms" className="text-sm">이용약관에 동의합니다.</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="privacy" checked={privacyAgreed} onChange={(e) => setPrivacyAgreed(e.target.checked)} />
              <label htmlFor="privacy" className="text-sm">개인정보 처리방침에 동의합니다.</label>
            </div>
            <Button type="submit" className="w-full">
              회원가입
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="underline">
              로그인
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
