import { useEffect, useState } from 'react';
import { useCourseStore } from '@/store/course.store';
import { useAuthStore } from '@/store/auth.store';
import { useAuth } from '@/store/auth-provider';
import { toggleLike, deleteCourse, getCourseRecommendations, RecommendationDto } from '@/lib/api';
import { X, Heart, Edit, Trash2 } from 'lucide-react';
import type { SpotRes, CourseSummary } from '@/types/course';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import MapView with ssr: false
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

interface CourseDetailSheetProps {
  courseId: string;
  onClose: () => void;
}

const SpotCard = ({ spot }: { spot: SpotRes }) => (
  <div className="border p-3 rounded-lg bg-gray-50">
    <h4 className="font-semibold">{spot.orderNo}. {spot.title}</h4>
    {spot.description && <p className="text-sm text-gray-600 mt-1">{spot.description}</p>}
  </div>
);

const RecommendationCard = ({ course }: { course: CourseSummary }) => (
  <div className="border p-2 rounded-lg text-sm flex items-center space-x-2">
    {course.coverImageUrl && (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={course.coverImageUrl} alt={course.title} className="w-10 h-10 object-cover rounded" />
    )}
    <div>
      <p className="font-semibold">{course.title}</p>
      <p className="text-gray-500 text-xs">{course.regionName}</p>
    </div>
  </div>
);

const CourseDetailSheet = ({ courseId, onClose }: CourseDetailSheetProps) => {
  const { courseDetails, loading, error, fetchCourseDetails, clearCourseDetails } = useCourseStore();
  const { token } = useAuthStore();
  const { user } = useAuth();

  const [isLikedState, setIsLikedState] = useState(false);
  const [likeCountState, setLikeCountState] = useState(0);
  const [recommendations, setRecommendations] = useState<RecommendationDto | null>(null);
  const [recoLoading, setRecoLoading] = useState(false);
  const [recoError, setRecoError] = useState<string | null>(null);
  const router = useRouter();

  const isCreator = user && courseDetails && user.sub === courseDetails.creatorId;

  useEffect(() => {
    if (courseDetails) {
      setIsLikedState(false);
      setLikeCountState(courseDetails.likeCount || 0);
    }
  }, [courseDetails]);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(courseId);
      setRecoLoading(true);
      setRecoError(null);
      getCourseRecommendations(courseId)
        .then(setRecommendations)
        .catch((err: unknown) => setRecoError((err as Error).message))
        .finally(() => setRecoLoading(false));
    }
    return () => {
      clearCourseDetails();
      setRecommendations(null);
    };
  }, [courseId, fetchCourseDetails, clearCourseDetails]);

  const handleLike = async () => {
    if (!token) {
      alert('Please log in to like a course.');
      return;
    }

    const previousIsLiked = isLikedState;
    const previousLikeCount = likeCountState;
    setIsLikedState(!previousIsLiked);
    setLikeCountState(previousIsLiked ? previousLikeCount - 1 : previousLikeCount + 1);

    try {
      const result = await toggleLike(courseId, token);
      setIsLikedState(result.liked);
      setLikeCountState(result.likeCount);
    } catch (err: unknown) {
      setIsLikedState(previousIsLiked);
      setLikeCountState(previousLikeCount);
      alert(`Error liking course: ${(err as Error).message}`);
    }
  };

  const handleDeleteCourse = async () => {
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }
    if (confirm('정말로 이 코스를 삭제하시겠습니까?')) {
      try {
        await deleteCourse(courseId, token);
        alert('코스가 성공적으로 삭제되었습니다.');
        onClose();
        router.push('/');
      } catch (err: unknown) {
        alert(`코스 삭제 실패: ${(err as Error).message}`);
      }
    }
  };

  // Calculate map center and zoom for spots
  const spotMarkers = courseDetails?.spots.map(spot => ({
    id: `${spot.orderNo}`,
    name: spot.title,
    lat: spot.lat || 0,
    lng: spot.lng || 0,
  })) || [];

  const mapCenter = spotMarkers.length > 0
    ? {
        lat: spotMarkers.reduce((sum, p) => sum + p.lat, 0) / spotMarkers.length,
        lng: spotMarkers.reduce((sum, p) => sum + p.lng, 0) / spotMarkers.length,
      }
    : { lat: 37.5665, lng: 126.978 };

  const mapZoom = spotMarkers.length > 1 ? 12 : 15;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Bottom Sheet Container */}
      <AnimatePresence>
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="fixed inset-x-0 bottom-0 z-50 flex justify-center"
          style={{ pointerEvents: 'none' }}
        >
          <div // Corrected: This should be a regular div
            className="bg-white rounded-t-2xl shadow-lg w-full max-w-2xl flex flex-col h-fit max-h-[80vh] min-h-[4rem]"
            style={{ pointerEvents: 'auto' }}
          >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
            <div className="w-8"></div> {/* Spacer */}
            <h2 className="text-lg font-bold text-center">코스 상세 정보</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-grow overflow-y-auto p-4">
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">Error: {error}</div>}
            {courseDetails && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">{courseDetails.title}</h1>
                  <p className="text-gray-600 mt-1">{courseDetails.summary}</p>
                  <p className="text-sm text-gray-500 mt-2">By {courseDetails.creatorDisplayName}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    <Heart
                      className={`h-5 w-5 ${isLikedState ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                    />
                    <span className="font-medium">{likeCountState}</span>
                  </button>
                  {isCreator && (
                    <>
                      <button
                        onClick={() => router.push(`/courses/${courseId}/edit`)}
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        <Edit className="h-4 w-4" />
                        <span>수정</span>
                      </button>
                      <button
                        onClick={handleDeleteCourse}
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>삭제</span>
                      </button>
                    </>
                  )}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Spots</h3>
                  {courseDetails.spots.map((spot) => (
                    <SpotCard key={spot.orderNo} spot={spot} />
                  ))}
                </div>

                {/* Map View for Spots */}
                {spotMarkers.length > 0 && (
                  <div className="space-y-3 mt-6">
                    <h3 className="text-xl font-semibold">장소 지도</h3>
                    <div className="h-64 w-full rounded-lg overflow-hidden">
                      <MapView
                        center={mapCenter}
                        zoom={mapZoom}
                        markers={spotMarkers}
                      />
                    </div>
                  </div>
                )}

                {/* Recommendations Section */}
                <div className="space-y-3 mt-6">
                  <h3 className="text-xl font-semibold">추천 코스</h3>
                  {recoLoading && <div>추천 코스를 불러오는 중...</div>}
                  {recoError && <div className="text-red-500">추천 코스 로드 중 오류: {recoError}</div>}
                  {recommendations && (
                    <div className="space-y-2">
                      {recommendations.relatedByLikes && recommendations.relatedByLikes.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-700">비슷한 코스</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                            {recommendations.relatedByLikes.map((course: CourseSummary) => (
                              <RecommendationCard key={course.id} course={course} />
                            ))}
                          </div>
                        </div>
                      )}
                      {recommendations.sameCategory && recommendations.sameCategory.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-700">같은 카테고리</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                            {recommendations.sameCategory.map((course: CourseSummary) => (
                              <RecommendationCard key={course.id} course={course} />
                            ))}
                          </div>
                        </div>
                      )}
                      {recommendations.sameRegion && recommendations.sameRegion.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-700">같은 지역</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                            {recommendations.sameRegion.map((course: CourseSummary) => (
                              <RecommendationCard key={course.id} course={course} />
                            ))}
                          </div>
                        </div>
                      )}
                      {(!recommendations.relatedByLikes?.length &&
                       !recommendations.sameCategory?.length &&
                       !recommendations.sameRegion?.length) && (
                        <p className="text-gray-500 text-sm">추천 코스가 없습니다.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
    </>
  );
};

export default CourseDetailSheet;