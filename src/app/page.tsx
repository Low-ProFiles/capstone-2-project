'use client';

import dynamic from 'next/dynamic';
// import { useQueries, useQuery } from "@tanstack/react-query";
// import { getCourseById, getCourses } from "@/lib/api";
import { CourseDetails } from "@/types";

// Dynamically import the Map component to ensure it only runs on the client-side
const Map = dynamic(() => import('@/components/common/Map'), {
  ssr: false, // This is the key to disable server-side rendering for the map
  loading: () => <p>Map is loading...</p>, // Optional: show a loading message
});

// Mock Data for a date course
const mockDateCourse: CourseDetails[] = [
  {
    id: "course-1",
    creatorId: "user-1",
    creatorDisplayName: "낭만가이드",
    categorySlug: "date-night",
    title: "서울 야경 데이트 코스",
    summary: "N서울타워부터 세빛섬까지, 로맨틱한 서울의 밤을 즐겨보세요.",
    reviewState: "APPROVED",
    spots: [
      {
        orderNo: 1,
        title: "N서울타워",
        description: "서울의 전경을 한눈에 담을 수 있는 로맨틱한 장소",
        lat: 37.5512, // 위도
        lng: 126.9882, // 경도
      },
      {
        orderNo: 2,
        title: "낙산공원",
        description: "성곽길을 따라 걸으며 감상하는 도심의 야경",
        lat: 37.5808,
        lng: 127.0078,
      },
      {
        orderNo: 3,
        title: "세빛섬",
        description: "한강 위에서 빛나는 아름다운 인공섬",
        lat: 37.5119,
        lng: 126.9956,
      },
    ],
  },
];

export default function Home() {
  // NOTE: Temporarily using mock data. Uncomment the section below to use real API data.
  const courses = mockDateCourse;
  const areDetailsLoading = false;

  /*
  // 1. 모든 코스 목록(요약)을 가져옵니다.
  const { data: coursesData } = useQuery({
    queryKey: ['courses'],
    queryFn: () => getCourses(''),
  });

  const courseSummaries = coursesData?.content || [];

  // 2. 각 코스의 상세 정보를 병렬로 가져옵니다.
  const courseDetailQueries = useQueries({
    queries: courseSummaries.map((course: CourseSummary) => ({
      queryKey: ['course', course.id],
      queryFn: () => getCourseById(course.id),
      staleTime: Infinity, // 한 번 받은 데이터는 만료되지 않도록 설정
    })),
  });

  // 모든 상세 정보가 로드될 때까지 기다립니다.
  const areDetailsLoading = courseDetailQueries.some(query => query.isLoading);

  // 성공적으로 로드된 코스 상세 정보만 필터링합니다.
  const courses: CourseDetails[] = courseDetailQueries
    .filter(query => query.isSuccess && query.data)
    .map(query => query.data);
  */

  return (
    <div className="relative h-[calc(100vh-65px)] w-full">
      {areDetailsLoading ? <p>Loading map data...</p> : <Map courses={courses} />}
    </div>
  );
}
