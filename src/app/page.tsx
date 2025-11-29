"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useCourseStore } from "@/store/course.store";
import type { Place } from "@/lib/types";
import CourseDetailSheet from "@/components/course/CourseDetailSheet";
import { Loader2 } from "lucide-react";

// Dynamically import CourseMap with ssr: false
const CourseMap = dynamic(
  () => import("@/components/domain/course/CourseMap").then((mod) => mod.CourseMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    ),
  }
);

const HomePage = () => {
  const { coursesPage, error, loading, fetchCourses, fetchCourseDetails } =
    useCourseStore();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isSheetReady, setIsSheetReady] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 37.228, lng: 127.18654 });

  useEffect(() => {
    fetchCourses({});
  }, [fetchCourses]);

  const displayCourses = useMemo(() => coursesPage?.content || [], [coursesPage]);

  const handleMarkerClick = async (marker: Place) => {
    setMapCenter({ lat: marker.lat, lng: marker.lng });
    setSelectedCourseId(marker.id);
    setIsSheetReady(false);
    await fetchCourseDetails(marker.id);
    setIsSheetReady(true);
  };

  const handleSheetClose = () => {
    setSelectedCourseId(null);
    setIsSheetReady(false);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 bg-white shadow-sm z-10 text-center">
        <h1 className="text-xl font-bold">지도에서 코스 둘러보기</h1>
        {error && (
          <p className="text-xs text-red-500 mt-1">
            코스 로딩 중 에러가 발생했습니다: {error}
          </p>
        )}
      </div>
      <div className="flex-grow relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          </div>
        )}
        <CourseMap 
          courses={displayCourses} 
          onMarkerClick={handleMarkerClick}
          mapCenter={mapCenter}
        />
      </div>
      {selectedCourseId && isSheetReady && (
        <CourseDetailSheet
          courseId={selectedCourseId}
          onClose={handleSheetClose}
        />
      )}
    </div>
  );
};

export default HomePage;
