// src/app/[id]/page.tsx
import { getCourseById } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MapView from "@/components/MapView";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function CoursePage({ params }: any) {
  try {
    const course = await getCourseById(params.id);

    const spotMarkers =
      course?.spots.map((spot) => ({
        id: `${spot.orderNo}`,
        name: spot.title,
        lat: spot.lat || 0,
        lng: spot.lng || 0,
        orderNo: spot.orderNo,
      })) || [];

    const mapCenter =
      spotMarkers.length > 0
        ? {
            lat:
              spotMarkers.reduce((sum, p) => sum + p.lat, 0) /
              spotMarkers.length,
            lng:
              spotMarkers.reduce((sum, p) => sum + p.lng, 0) /
              spotMarkers.length,
          }
        : { lat: 37.5665, lng: 126.978 };

    return (
      <div className="container mx-auto p-4 md:p-6">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            {course.coverImageUrl && (
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={course.coverImageUrl}
                  alt={course.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-t-lg"
                />
              </div>
            )}
            <CardTitle className="text-3xl font-bold">{course.title}</CardTitle>
            <p className="text-lg text-gray-600">{course.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
              <span>By {course.creatorDisplayName}</span>
              <span className="font-semibold">
                📍 {course.spots.length}개 스팟
              </span>
              <span className="font-semibold">🗺️ {course.regionName}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-4">코스 장소들</h3>
              <div className="space-y-4">
                {course.spots.map((spot) => (
                  <div
                    key={spot.orderNo}
                    className="p-4 border rounded-lg bg-gray-50 flex items-start space-x-6"
                  >
                    {spot.images && spot.images.length > 0 && (
                      <div className="relative w-36 h-36 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={spot.images[0]}
                          alt={spot.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <h4 className="text-lg font-bold">
                        {spot.orderNo}. {spot.title}
                      </h4>
                      <p className="text-md text-gray-700 mt-1">
                        {spot.description}
                      </p>
                      <div className="text-sm text-gray-500 mt-2">
                        <span>예상 비용: {spot.price.toLocaleString()}원</span>{" "}
                        |<span> 예상 시간: {spot.stayMinutes}분</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {spotMarkers.length > 0 && (
              <div className="space-y-3 mt-6">
                <h3 className="text-2xl font-semibold">장소 지도</h3>
                <div className="h-96 w-full rounded-lg overflow-hidden">
                  <MapView center={mapCenter} zoom={17} markers={spotMarkers} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    // If getCourseById throws an error (e.g., 404), show the not-found page.
    console.error("Failed to fetch course:", error);
    notFound();
  }
}
