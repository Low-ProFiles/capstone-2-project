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
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";



export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      router.push("/"); // Redirect to homepage on successful login
    } catch (error) {
      console.error("Login failed:", error);
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">로그인</CardTitle>
          <CardDescription>
            계속하려면 이메일과 비밀번호를 입력하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
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
          <Button className="w-full" onClick={handleLogin}>
            로그인
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground dark:bg-gray-800">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/google`}
              >
                <div className="flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-black shadow-md">
                  <FcGoogle className="h-6 w-6" />
                  <span>Google로 로그인</span>
                </div>
              </a>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao`}
              >
                <div className="flex items-center justify-center gap-2 rounded-md bg-[#FEE500] px-4 py-2 text-black shadow-md">
                  <RiKakaoTalkFill className="h-6 w-6" />
                  <span>카카오로 로그인</span>
                </div>
              </a>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm">
            계정이 없으신가요.?{" "}
            <Link href="/signup" className="underline">
              회원가입
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
