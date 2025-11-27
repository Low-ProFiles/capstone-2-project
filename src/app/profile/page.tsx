'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useAuth } from '@/store/auth-provider';
import { useEffect, useState } from 'react'; // Import useEffect and useState
import { getUserProfile } from '@/lib/api'; // Import getUserProfile API
import type { UserProfileDto } from '@/types'; // Import UserProfileDto type

import { TriangleAlert, Loader2 } from 'lucide-react'; // Import Loader2

// A simple stat component for demonstration
const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="text-center">
    <p className="font-bold text-xl">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

export default function ProfilePage() {
  const { user, token } = useAuth(); // Get user and token from auth context

  const [userProfile, setUserProfile] = useState<UserProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const profile = await getUserProfile(token);
          setUserProfile(profile);
        } catch (err: unknown) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else {
      setLoading(false); // Not logged in, stop loading
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        프로필을 불러오는데 실패했습니다: {error}
      </div>
    );
  }

  // Use userProfile data from context or fetched profile, fallback to placeholders
  const displayName = userProfile?.nickname || user?.nickname || 'Guest';
  const email = userProfile?.email || user?.email || 'guest@example.com';
  const avatarUrl = userProfile?.avatarUrl || 'https://github.com/shadcn.png'; // Placeholder image if no avatarUrl
  const bio = userProfile?.bio || '아직 자기소개가 없습니다.'; // Use fetched bio or default

  const courseCount = userProfile?.courseCount ?? 0;
  const likeCount = userProfile?.likeCount ?? 0;

  return (
    <div className="p-4 md:p-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="items-center text-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{displayName}</CardTitle>
          <CardDescription>{email}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md flex items-center">
            <TriangleAlert className="h-5 w-5 mr-3" />
            <p className="text-sm">데모용 페이지입니다. 표시되는 데이터는 실제 사용자 정보가 아닙니다.</p>
          </div>

          <p className="text-center mb-6">{bio}</p>
          
          <div className="flex justify-around p-4 rounded-lg bg-gray-50 dark:bg-gray-800 mb-6">
            <Stat label="작성한 코스" value={courseCount} />
            <Stat label="받은 좋아요" value={likeCount} />
          </div>

          <Link href="/profile/edit" className="w-full">
            <Button variant="outline" className="w-full">프로필 수정</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
