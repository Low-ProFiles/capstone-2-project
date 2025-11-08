'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MOCK_USER } from '@/lib/types';

const EditProfileForm = () => {
  const router = useRouter();
  const [name, setName] = useState(MOCK_USER.name);
  const [bio, setBio] = useState(MOCK_USER.bio || '');
  const [avatarUrl] = useState(MOCK_USER.avatarUrl || '/default-avatar.png');

  const handleSave = () => {
    // In a real app, this would send data to a backend.
    // For this demo, we just alert.
    alert('데모용 페이지입니다. 여기서 저장해도 실제 정보는 변경되지 않습니다.\n' +
          `저장된 정보: \n표시 이름: ${name}\n자기소개: ${bio}`);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  // Placeholder for image change functionality
  const handleImageChange = () => {
    alert('이미지 변경 기능은 데모에서 지원하지 않습니다.');
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-bold text-center mb-4">프로필 수정</h2>

      {/* Yellow Warning Banner */}
      <div className="bg-yellow-100 text-yellow-800 text-sm p-3 rounded-lg text-center">
        데모용 페이지입니다. 여기서 저장해도 실제 정보는 변경되지 않습니다.
      </div>

      {/* Avatar Preview */}
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

      {/* Input Fields */}
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            표시 이름
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

      {/* Footer Buttons */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={handleCancel}
          className="px-5 py-3 border border-gray-300 rounded-full bg-white text-gray-800 font-semibold shadow-sm"
        >
          취소
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-3 bg-black text-white rounded-full font-semibold shadow-sm"
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default EditProfileForm;
