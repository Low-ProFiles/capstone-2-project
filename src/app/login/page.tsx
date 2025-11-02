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

import { Chrome, MessageCircle } from "lucide-react"; // Using generic icons for now

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
            <a href="http://localhost:8080/oauth2/authorization/google">
              <Button variant="outline" className="w-full">
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
            </a>
            <a href="http://localhost:8080/oauth2/authorization/kakao">
              <Button variant="outline" className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-black">
                <MessageCircle className="mr-2 h-4 w-4" />
                Kakao
              </Button>
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
