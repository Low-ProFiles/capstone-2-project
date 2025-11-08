'use client';

import { useState } from 'react';
import AddPlaceModal from '@/components/AddPlaceModal';
import { Place } from '@/lib/types';

const CreateCoursePage = () => {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddPlace = (newPlace: Place) => {
    setPlaces((prevPlaces) => [...prevPlaces, newPlace]);
    setIsModalOpen(false);
  };

  const handleCreateCourse = () => {
    const newCourse = {
      title: courseTitle,
      description: courseDescription,
      places: places,
    };
    alert(`코스 생성하기 (데모):\n${JSON.stringify(newCourse, null, 2)}`);
    // In a real app, this would send data to a backend.
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-center mb-4">새로운 코스 만들기</h2>

        {/* Course Title Input */}
        <div>
          <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700 mb-1">
            코스 제목
          </label>
          <input
            type="text"
            id="courseTitle"
            placeholder="예: 홍대 감성 카페 투어"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Course Description Input */}
        <div>
          <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700 mb-1">
            코스 설명
          </label>
          <textarea
            id="courseDescription"
            placeholder="이 코스에 대한 설명을 입력해주세요."
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Course Places Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">코스 장소</h3>
          {places.length > 0 ? (
            <ul className="space-y-2 mb-4">
              {places.map((place, index) => (
                <li key={place.id || index} className="bg-gray-50 p-2 rounded-md flex justify-between items-center">
                  <span>{index + 1}. {place.name}</span>
                  {/* Optionally add a remove button here */}
                </li>
              ))
            }
            </ul>
          ) : (
            <p className="text-gray-500 mb-4">아직 추가된 장소가 없습니다.</p>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 border border-gray-300 rounded-full bg-white text-gray-800 font-semibold shadow-sm"
          >
            + 장소 추가
          </button>
        </div>

        {/* Create Course Button */}
        <button
          onClick={handleCreateCourse}
          className="w-full py-3 bg-black text-white rounded-full font-semibold shadow-sm mt-6"
        >
          코스 생성하기
        </button>
      </div>

      {isModalOpen && (
        <AddPlaceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddPlace}
        />
      )}
    </div>
  );
};

export default CreateCoursePage;
