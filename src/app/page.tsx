"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useCourseStore } from "@/store/course.store";
import type { Place } from "@/lib/types";
import CourseDetailSheet from "@/components/course/CourseDetailSheet";
import { CourseEmptyState } from "@/components/common/CourseEmptyState";
import CategoryFilter from "@/components/common/CategoryFilter";
import { Loader2 } from "lucide-react";

// Dynamically import MapView with ssr: false
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const HomePage = () => {
  const { courses, error, loading, fetchCourses, fetchCourseDetails } =
    useCourseStore();

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const [isSheetReady, setIsSheetReady] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const [mapCenter, setMapCenter] = useState({ lat: 37.22800, lng: 127.18654 });

  const [mapRerenderKey, setMapRerenderKey] = useState(0);

  const [isViewportEmpty, setIsViewportEmpty] = useState(false);

  useEffect(() => {
    fetchCourses({ categoryId: selectedCategoryId || undefined });
  }, [fetchCourses, selectedCategoryId]);

  const displayCourses = courses;

  const courseMarkers: Place[] = useMemo(() => {
    return (displayCourses || [])

      .filter((course) => course.lat != null && course.lng != null)

      .map((course) => ({
        id: course.id,

        name: course.title,

        desc: course.summary,

        lat: course.lat!,

        lng: course.lng!,
      }));
  }, [displayCourses]);

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

    setMapRerenderKey((prevKey) => prevKey + 1);
  };

  const handleBoundsChanged = (bounds: naver.maps.Bounds) => {
    if (!courseMarkers || courseMarkers.length === 0) {
      setIsViewportEmpty(true);

      return;
    }

    const visibleMarkers = courseMarkers.filter((marker) =>
      bounds.hasPoint(new naver.maps.LatLng(marker.lat, marker.lng))
    );

    setIsViewportEmpty(visibleMarkers.length === 0);
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

      <CategoryFilter
        onSelectCategory={setSelectedCategoryId}
        selectedCategoryId={selectedCategoryId}
      />

      <div className="flex-grow relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          </div>
        )}

        {!loading && isViewportEmpty && <CourseEmptyState />}

        <MapView
          key={mapRerenderKey}
          center={mapCenter}
          zoom={15}
          markers={courseMarkers}
          onMarkerClick={handleMarkerClick}
          onBoundsChanged={handleBoundsChanged}
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
