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
  const [passwordError, setPasswordError] = useState(""); // Added passwordError state
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [serverError, setServerError] = useState(""); // For server-side errors
  const { signup } = useAuth();
  const router = useRouter();

  // New validation function
  const validatePassword = (pw: string) => {
    if (pw.length > 0 && pw.length < 8) {
      setPasswordError("비밀번호는 8자 이상이어야 합니다.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Modified password change handler
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(""); // Reset server error on new submission

    if (!validatePassword(password)) return; // Client-side password length validation

    if (password !== passwordConfirm) {
      setPasswordError("비밀번호가 일치하지 않습니다."); // Use state for mismatch error
      return;
    }
    if (!termsAgreed || !privacyAgreed) {
      setServerError("이용약관과 개인정보 처리방침에 모두 동의해야 합니다.");
      return;
    }
    try {
      // The 'signup' function now correctly handles a text response
      const responseMessage = await signup({ nickname, email, password, passwordConfirm, termsAgreed, privacyAgreed });
      alert(responseMessage || "회원가입 요청에 성공했습니다. 이메일로 전송된 코드를 확인해주세요.");
      // Redirect to the new verification page
      router.push("/signup/verify-email");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message || "회원가입에 실패했습니다.");
      } else {
        setServerError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  // isSubmitDisabled logic
  const isSubmitDisabled =
    !nickname ||
    !email ||
    !password ||
    !passwordConfirm ||
    password.length < 8 || // Password length check
    !termsAgreed ||
    !privacyAgreed ||
    !!passwordError; // Disable if there's a password format error

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
          <CardDescription>계정을 만들려면 정보를 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          {serverError && <p className="text-sm text-red-500 text-center mb-4">{serverError}</p>}
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
                onChange={handlePasswordChange} // Use new handler
              />
              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>} {/* Display password error */}
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
              {password && passwordConfirm && password !== passwordConfirm && (
                <p className="text-sm text-red-500">비밀번호가 일치하지 않습니다.</p>
              )} {/* Display password mismatch error */}
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} />
              <label htmlFor="terms" className="text-sm">이용약관에 동의합니다.</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="privacy" checked={privacyAgreed} onChange={(e) => setPrivacyAgreed(e.target.checked)} />
              <label htmlFor="privacy" className="text-sm">개인정보 처리방침에 동의합니다.</label>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitDisabled}> {/* Disable button */}
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
