// This file is generated based on the API documentation provided.
// It should be the single source of truth for course-related types.

/**
 * 코스 목록 조회 아이템
 * GET /api/courses
 */
export interface CourseSummary {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  regionName: string;
  likeCount: number;
  createdAt: string;
  lat: number;
  lng: number;
  estimatedCost: number;
  creatorDisplayName: string;
}

/**
 * 코스 상세 정보의 장소(spot) 정보
 */
export interface SpotRes {
  orderNo: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  images: string[];
  stayMinutes: number;
  price: number;
}

/**
 * 코스 상세 정보
 * GET /api/courses/{id}
 */
export interface CourseDetails {
  id: string;
  creatorId: string;
  creatorDisplayName: string;
  title: string;
  description: string;
  spots: SpotRes[];
  isCurrentUserLiked: boolean;
  categoryId: string;
  // Add fields from summary for completeness
  coverImageUrl: string;
  regionName: string;
  likeCount: number;
  createdAt: string;
  tags: string[]; // Also add tags, which is logical for details
}

/**
 * 코스 생성/수정 시 장소(spot) 정보
 */
export interface SpotReq {
  orderNo: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  images: string[];
  stayMinutes: number;
  price: number;
}

/**
 * 코스 생성 요청 DTO
 * POST /api/courses
 */
export interface CreateCourseReq {
  categoryId: string;
  title: string;
  description: string;
  coverImageUrl?: string;
  regionCode: string;
  regionName: string;
  tags: string[];
  spots: SpotReq[];
}

/**
 * 코스 수정 요청 DTO
 * PUT /api/courses/{id}
 * Note: API doc does not specify this, creating a partial from CreateCourseReq
 * and adding description from CourseDetails for consistency.
 */
export type UpdateCourseReq = Partial<{
  categoryId: string;
  title: string;
  description: string;
  coverImageUrl: string;
  regionCode: string;
  regionName: string;
  tags: string[];
  spots: SpotReq[];
}>
