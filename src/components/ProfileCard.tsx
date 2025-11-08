'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MOCK_USER } from '@/lib/types';

const ProfileCard = () => {
  const user = MOCK_USER;

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 space-y-4">
      {/* Yellow Warning Banner */}
      <div className="bg-yellow-100 text-yellow-800 text-sm p-3 rounded-lg text-center">
        데모용 페이지입니다. 표시되는 데이터는 실제 사용자 정보가 아닙니다.
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center space-y-2">
        <div className="relative w-24 h-24 rounded-full overflow-hidden">
          <Image
            src={user.avatarUrl || '/default-avatar.png'}
            alt="Avatar"
            fill
            className="object-cover"
          />
        </div>
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-gray-500">{user.handle}</p>
      </div>

      {/* Bio */}
      <p className="text-center text-gray-700">{user.bio}</p>

      {/* Metrics Row */}
      <div className="flex justify-around bg-gray-100 rounded-lg p-3">
        <div className="text-center">
          <p className="font-semibold">작성한 코스</p>
          <p className="text-lg">{user.stats.courses}</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">받은 좋아요</p>
          <p className="text-lg">{user.stats.likes}</p>
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
