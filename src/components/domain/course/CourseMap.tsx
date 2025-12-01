"use client";

import { useMemo, useState } from "react";
import type { Place } from "@/lib/types";
import type { CourseSummary } from "@/types";
import { CourseEmptyState } from "@/components/common/CourseEmptyState";
import MapView from "@/components/MapView";

interface CourseMapProps {
  courses: CourseSummary[];
  onMarkerClick: (place: Place) => void;
  mapCenter: { lat: number; lng: number };
}

export const CourseMap = ({
  courses,
  onMarkerClick,
  mapCenter,
}: CourseMapProps) => {
  const [isViewportEmpty, setIsViewportEmpty] = useState(false);
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);

  const courseMarkers: Place[] = useMemo(() => {
    return (courses || [])
      .filter((course) => course.lat != null && course.lng != null)
      .map((course) => ({
        id: course.id,
        name: course.title,
        desc: course.description,
        lat: course.lat!,
        lng: course.lng!,
        imageUrl: course.coverImageUrl,
      }));
  }, [courses]);

  const handleMarkerClick = (place: Place) => {
    setActivePlaceId(place.id === activePlaceId ? null : place.id); // Toggle active state
    onMarkerClick(place); // Also call the parent's onMarkerClick
  };

  return (
    <div className="w-full h-full">
      {isViewportEmpty && <CourseEmptyState />}
      <MapView
        center={mapCenter}
        zoom={16}
        markers={courseMarkers}
        onMarkerClick={handleMarkerClick}
        onViewportChange={setIsViewportEmpty}
        activePlaceId={activePlaceId}
      />
    </div>
  );
};
