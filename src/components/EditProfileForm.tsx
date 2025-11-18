'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth-provider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile } from '@/lib/api';

const EditProfileForm = () => {
  const router = useRouter();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['userProfile', token],
    queryFn: () => {
      if (!token) throw new Error('No token found');
      return getUserProfile(token);
    },
    enabled: !!token,
  });

  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/default-avatar.png');

  useEffect(() => {
    if (userProfile) {
      setNickname(userProfile.nickname || '');
      setBio(userProfile.bio || '');
      setAvatarUrl(userProfile.avatarUrl || '/default-avatar.png');
    }
  }, [userProfile]);

  const mutation = useMutation({
    mutationFn: (profileData: { nickname: string; bio: string; avatarUrl: string }) => {
      if (!token) throw new Error('No token found');
      return updateUserProfile(profileData, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      router.back();
    },
    onError: (error) => {
      alert(`Failed to update profile: ${error.message}`);
    },
  });

  const handleSave = () => {
    mutation.mutate({ nickname, bio, avatarUrl });
  };

  const handleCancel = () => {
    router.back();
  };

  const handleImageChange = () => {
    alert('Image change functionality is not implemented yet.');
  };

  if (isLoading) {
    return <div>Loading form...</div>;
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-bold text-center mb-4">프로필 수정</h2>

      <div className="flex flex-col items-center space-y-2">
        <div className="relative w-24 h-24 rounded-full overflow-hidden">
          <Image
            src={avatarUrl}
            alt="Avatar Preview"
            fill
            className="object-cover"
          />
        </div>
        <button
          onClick={handleImageChange}
          className="text-blue-600 text-sm font-semibold"
        >
          이미지 변경
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
            표시 이름
          </label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            자기소개
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={handleCancel}
          className="px-5 py-3 border border-gray-300 rounded-full bg-white text-gray-800 font-semibold shadow-sm"
        >
          취소
        </button>
        <button
          onClick={handleSave}
          disabled={mutation.isPending}
          className="px-5 py-3 bg-black text-white rounded-full font-semibold shadow-sm disabled:bg-gray-400"
        >
          {mutation.isPending ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
};

export default EditProfileForm;
