"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from "@/store/auth-provider";
import { Loader2, LogIn } from "lucide-react";
import { getMyCourses, getMyLikedCourses } from "@/lib/api";
import type { CourseSummary } from "@/types";
import { CourseCard } from "@/components/course/CourseCard";

const CourseList = ({ title, courses, isLoading, error }: { title: string, courses: CourseSummary[], isLoading: boolean, error: string | null }) => (
  <div className="border-t pt-6 mt-6">
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    {isLoading && <Loader2 className="h-6 w-6 animate-spin text-blue-500" />}
    {error && <p className="text-red-500">오류: {error}</p>}
    {!isLoading && !error && courses.length === 0 && (
      <p className="text-gray-500">표시할 코스가 없습니다.</p>
    )}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  </div>
);

export default function ProfilePage() {
  const { userProfile, isAuthenticated, token } = useAuth();
  
  const [myCourses, setMyCourses] = useState<CourseSummary[]>([]);
  const [likedCourses, setLikedCourses] = useState<CourseSummary[]>([]);
  const [myCoursesLoading, setMyCoursesLoading] = useState(true);
  const [likedCoursesLoading, setLikedCoursesLoading] = useState(true);
  const [myCoursesError, setMyCoursesError] = useState<string | null>(null);
  const [likedCoursesError, setLikedCoursesError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      setMyCoursesLoading(true);
      setMyCoursesError(null);
      getMyCourses(token)
        .then((data) => setMyCourses(data.content))
        .catch(err => setMyCoursesError((err as Error).message))
        .finally(() => setMyCoursesLoading(false));

      setLikedCoursesLoading(true);
      setLikedCoursesError(null);
      getMyLikedCourses(token)
        .then((data) => setLikedCourses(data.content))
        .catch(err => setLikedCoursesError((err as Error).message))
        .finally(() => setLikedCoursesLoading(false));
    }
  }, [isAuthenticated, token]);

  if (isAuthenticated && !userProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <LogIn className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">로그인이 필요합니다</h2>
        <p className="mb-6 text-gray-600">이 페이지에 접근하려면 먼저 로그인해주세요.</p>
        <Link href="/login">
          <Button>로그인 페이지로 이동</Button>
        </Link>
      </div>
    );
  }
  
  const displayName = userProfile?.displayName || userProfile?.nickname || "Guest";
  const email = userProfile?.email || "guest@example.com";
  const avatarUrl = userProfile?.avatarUrl || "/images/profile.avif";
  const bio = userProfile?.bio || "아직 자기소개가 없습니다.";

  return (
    <div className="p-4 md:p-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="items-center text-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{displayName}</CardTitle>
          <CardDescription>{email}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-6">{bio}</p>
          <Link href="/profile/edit">
            <Button variant="outline" className="w-full">
              프로필 수정
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="w-full max-w-4xl mx-auto mt-8">
        <CourseList 
          title="내가 만든 코스" 
          courses={myCourses} 
          isLoading={myCoursesLoading}
          error={myCoursesError}
        />
      </div>

      <div className="w-full max-w-4xl mx-auto mt-8">
        <CourseList 
          title="좋아요한 코스" 
          courses={likedCourses}
          isLoading={likedCoursesLoading}
          error={likedCoursesError}
        />
      </div>
    </div>
  );
}
