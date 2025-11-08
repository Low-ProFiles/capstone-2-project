"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { MOCK_COURSE, MOCK_COURSE_2, Place, Course } from "@/lib/types";
import SpotDetailSheet from "@/components/SpotDetailSheet";
import CourseSelectionBottomSheet from "@/components/course/CourseSelectionBottomSheet"; // Import new component
// Removed Button import
// Removed Menu import

// Dynamically import MapView with ssr: false
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const ALL_MOCK_COURSES: Course[] = [MOCK_COURSE, MOCK_COURSE_2]; // Combine all mock courses

const HomePage = () => {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null); // Start with no course selected
  const [activeSpotIndex, setActiveSpotIndex] = useState<number | null>(null); // State for active spot within the selected course
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false); // State for bottom sheet visibility

  const currentCourse = ALL_MOCK_COURSES.find(
    (course) => course.id === activeCourseId
  );

  const activeSpot =
    activeSpotIndex !== null && currentCourse
      ? currentCourse.places[activeSpotIndex]
      : null;

  const handleMarkerClick = (place: Place) => {
    if (!currentCourse) return; // Cannot click marker if no course is selected
    const index = currentCourse.places.findIndex((p) => p.id === place.id);
    if (index !== -1) {
      if (activeSpotIndex === index) {
        // If the clicked marker is already active, deactivate it
        setActiveSpotIndex(null);
      } else {
        // Otherwise, activate the clicked marker
        setActiveSpotIndex(index);
      }
    }
  };

  // Calculate center of the map
  const mapCenter = activeSpot
    ? { lat: activeSpot.lat, lng: activeSpot.lng } // Center on active spot
    : currentCourse
    ? {
        lat:
          currentCourse.places.reduce((sum, p) => sum + p.lat, 0) /
          currentCourse.places.length,
        lng:
          currentCourse.places.reduce((sum, p) => sum + p.lng, 0) /
          currentCourse.places.length,
      } // Center on the average of all places in the current course
    : { lat: 37.551167, lng: 126.988 }; // Default to Namsan/Seoul if no course selected

  const mapZoom = activeSpot ? 15 : 12; // Zoom in when a spot is active, otherwise default zoom

  const polylinePath = currentCourse
    ? currentCourse.places.map((place) => ({ lat: place.lat, lng: place.lng }))
    : [];

  return (
    <div className="flex flex-col h-full w-full">
      {/* 선택된 코스에 대한 동적 제목 및 설명 */}
      {currentCourse && (
        <div className="p-4 bg-white shadow-sm z-10">
          <h1 className="text-xl font-bold">{currentCourse.title}</h1>
          <p className="text-gray-600 text-sm">{currentCourse.desc}</p>
        </div>
      )}

      <div className="flex-grow relative">
        <MapView
          center={mapCenter}
          zoom={mapZoom}
          markers={currentCourse ? currentCourse.places : []} // 현재 코스의 장소 전달
          showNumberedMarkers={true}
          polylinePath={polylinePath}
          activeMarkerId={activeSpot?.id || null}
          onMarkerClick={handleMarkerClick}
        />

        {/* 코스 선택 하단 시트를 여는 버튼 */}
        <button
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 shadow-lg bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
          onClick={() => setIsBottomSheetOpen(true)}
        >
          {/* <Menu className="mr-2 h-4 w-4" /> */} {/* Menu 아이콘 제거 */}
          코스 선택
        </button>

        {activeSpotIndex !== null && currentCourse && (
          <SpotDetailSheet
            spots={currentCourse.places}
            activeSpotIndex={activeSpotIndex}
            onSetActiveSpotIndex={setActiveSpotIndex}
          />
        )}
      </div>

      {/* 코스 선택 하단 시트 */}
      <CourseSelectionBottomSheet
        courses={ALL_MOCK_COURSES}
        activeCourseId={activeCourseId}
        setActiveCourseId={(id) => {
          setActiveCourseId(id);
          setActiveSpotIndex(null); // 코스 변경 시 활성 스팟 재설정
        }}
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
      />
    </div>
  );
};

export default HomePage;
