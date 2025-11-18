
export type ReviewState = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';

export interface SpotReq {
  orderNo: number;
  title: string;
  description?: string;
  lat?: number;
  lng?: number;
  images?: string[];
  stayMinutes?: number;
  price?: number;
}

export interface CreateCourseReq {
  categoryId: string; // UUID
  title: string;
  summary?: string;
  coverImageUrl?: string;
  regionCode?: string;
  regionName?: string;
  durationMinutes?: number;
  estimatedCost?: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
  spots: SpotReq[];
}

export interface CourseSummary {
  id: string; // UUID
  title: string;
  summary?: string;
  coverImageUrl?: string;
  regionName?: string;
  durationMinutes?: number;
  estimatedCost?: number;
  likeCount?: number;
  purchaseCount?: number;
  reviewState: ReviewState;
  lat?: number;
  lng?: number;
}

export interface SpotRes {
  orderNo: number;
  title: string;
  description?: string;
  lat?: number;
  lng?: number;
  images?: string[];
  stayMinutes?: number;
  price?: number;
}

export interface CourseDetails {
  id: string; // UUID
  creatorId: string; // UUID
  creatorDisplayName: string;
  categorySlug: string;
  title: string;
  summary?: string;
  coverImageUrl?: string;
  regionCode?: string;
  regionName?: string;
  durationMinutes?: number;
  estimatedCost?: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
  likeCount?: number;
  purchaseCount?: number;
  reviewState: ReviewState;
  publishedAt?: string; // OffsetDateTime
  spots: SpotRes[];
}
