"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useCourseStore } from "@/store/course.store";
import type { Place } from "@/lib/types";
import CourseDetailSheet from "@/components/course/CourseDetailSheet";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/store/auth-provider";

// Dynamically import CourseMap with ssr: false
const CourseMap = dynamic(
  () => import("../components/domain/course/CourseMap").then((mod) => mod.CourseMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    ),
  }
);

const HomePageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthToken } = useAuth();

  const { coursesPage, error, fetchCourses, fetchCourseDetails } =
    useCourseStore();

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const [isSheetReady, setIsSheetReady] = useState(false);

  const [isClosing, setIsClosing] = useState(false);

  const [mapCenter, setMapCenter] = useState({ lat: 37.228, lng: 127.18654 });

  // Effect to handle token from URL query param
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setAuthToken(token);
      router.replace('/', { scroll: false });
    }
  }, [searchParams, setAuthToken, router]);

  useEffect(() => {
    fetchCourses({});
  }, [fetchCourses]);

  const displayCourses = useMemo(
    () => coursesPage?.content || [],

    [coursesPage]
  );

  const handleMarkerClick = useCallback(
    async (marker: Place) => {
      setMapCenter({ lat: marker.lat, lng: marker.lng });

      setSelectedCourseId(marker.id);

      setIsSheetReady(false);

      await fetchCourseDetails(marker.id);

      setIsSheetReady(true);

      // Update URL without reloading page

      router.replace(`/?courseId=${marker.id}`, { scroll: false });
    },
    [router, fetchCourseDetails]
  );

  const handleSheetClose = () => {
    setSelectedCourseId(null);

    setIsSheetReady(false);

    setIsClosing(true);

    // Update URL to remove query param

    router.replace(`/`, { scroll: false });
  };

  // Effect to handle opening sheet from URL query param
  useEffect(() => {
    const courseIdFromQuery = searchParams.get("courseId");
    if (isClosing) {
      if (!courseIdFromQuery) {
        setIsClosing(false);
      }
      return;
    }
    if (courseIdFromQuery && displayCourses.length > 0 && !selectedCourseId) {
      const courseToSelect = displayCourses.find(
        (c) => c.id === courseIdFromQuery
      );
      if (courseToSelect) {
        // We need a `Place` object for handleMarkerClick
        const marker: Place = {
          id: courseToSelect.id,
          name: courseToSelect.title,
          lat: courseToSelect.lat,
          lng: courseToSelect.lng,
        };
        handleMarkerClick(marker);
      }
    }
  }, [
    searchParams,
    displayCourses,
    selectedCourseId,
    handleMarkerClick,
    isClosing,
  ]); // Rerun when courses are loaded

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

export default HomePageClient;
