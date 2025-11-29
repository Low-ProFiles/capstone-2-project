"use client";

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useNavermaps } from 'react-naver-maps';
import type { Place } from '@/lib/types';
import type { CourseSummary } from '@/types';
import { CourseEmptyState } from '@/components/common/CourseEmptyState';

// Dynamically import MapView with ssr: false
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

interface CourseMapProps {
    courses: CourseSummary[];
    onMarkerClick: (place: Place) => void;
    mapCenter: { lat: number; lng: number };
}

export const CourseMap = ({ courses, onMarkerClick, mapCenter }: CourseMapProps) => {
    const navermaps = useNavermaps();
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

    const handleBoundsChanged = (bounds: naver.maps.Bounds) => {
        if (!navermaps || !courseMarkers || courseMarkers.length === 0) {
            setIsViewportEmpty(true);
            return;
        }
        const visibleMarkers = courseMarkers.filter((marker) =>
            bounds.hasPoint(new navermaps.LatLng(marker.lat, marker.lng))
        );
        setIsViewportEmpty(visibleMarkers.length === 0);
    };

    const handleMarkerClick = (place: Place) => {
        setActivePlaceId(place.id === activePlaceId ? null : place.id); // Toggle active state
        onMarkerClick(place); // Also call the parent's onMarkerClick
    };

    return (
        <div className="w-full h-full"> {/* Use w-full h-full instead of flex-grow relative */}
            {isViewportEmpty && <CourseEmptyState />}
            <MapView
                center={mapCenter}
                zoom={16}
                markers={courseMarkers}
                onMarkerClick={handleMarkerClick}
                onBoundsChanged={handleBoundsChanged}
                activePlaceId={activePlaceId}
            />
        </div>
    );
};
