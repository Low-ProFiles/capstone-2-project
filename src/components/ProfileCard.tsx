'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/store/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/lib/api';

const ProfileCard = () => {
  const { token } = useAuth();

  const { data: userProfile, isLoading, error } = useQuery({
    queryKey: ['userProfile', token],
    queryFn: () => {
      if (!token) throw new Error('No token found');
      return getUserProfile(token);
    },
    enabled: !!token, // Only run the query if the token exists
  });

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error loading profile: {error.message}</div>;
  }

  if (!userProfile) {
    return <div>No profile data found.</div>;
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 space-y-4">
      {/* Profile Info */}
      <div className="flex flex-col items-center space-y-2">
        <div className="relative w-24 h-24 rounded-full overflow-hidden">
          <Image
            src={userProfile.avatarUrl || '/default-avatar.png'}
            alt="Avatar"
            fill
            className="object-cover"
          />
        </div>
        <h2 className="text-xl font-bold">{userProfile.nickname}</h2>
        <p className="text-gray-500">{userProfile.email}</p>
      </div>

      {/* Bio */}
      <p className="text-center text-gray-700">{userProfile.bio}</p>

      {/* Metrics Row */}
      <div className="flex justify-around bg-gray-100 rounded-lg p-3">
        <div className="text-center">
          <p className="font-semibold">작성한 코스</p>
          <p className="text-lg">{userProfile.courseCount}</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">받은 좋아요</p>
          <p className="text-lg">{userProfile.likeCount}</p>
        </div>
      </div>

      {/* Edit Profile Button */}
      <Link href="/profile/edit">
        <button className="w-full py-3 border border-gray-300 rounded-full bg-white text-gray-800 font-semibold shadow-sm">
          프로필 수정
        </button>
      </Link>
    </div>
  );
};

export default ProfileCard;
