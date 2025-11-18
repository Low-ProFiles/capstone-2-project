const API_BASE_URL = "";

import type { CourseSummary, SpotReq } from "@/types/course";
export type { CourseSummary };

// Generic fetch function to handle common headers and errors
export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw new Error(errorData.message || "API request failed");
  }

  // Handle cases with no content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// --- Auth --- //
export interface SignUpDto {
  nickname: string;
  email: string;
  password: string;
}
export interface LoginDto {
  email: string;
  password: string;
}
export interface TokenDto {
  token: string;
}

export const signup = (userData: SignUpDto) =>
  apiFetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const login = (credentials: LoginDto): Promise<TokenDto> =>
  apiFetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const setNickname = (nickname: string, token: string): Promise<void> =>
  apiFetch(`${API_BASE_URL}/auth/nickname`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nickname }),
  });

// --- Course --- //
export interface CourseCreateDto {
  title: string;
  summary: string;
  categoryId: string;
  regionCode: string;
  regionName: string;
  estimatedCost: number;
  coverImageUrl?: string;
  spots: SpotReq[];
}

export const createCourse = (courseData: CourseCreateDto, token: string) => {
  return apiFetch(`${API_BASE_URL}/api/courses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });
};

export interface CourseUpdateDto {
  title?: string;
  summary?: string;
  coverImageUrl?: string;
  spots?: SpotReq[];
  categoryId?: string;
  regionCode?: string;
  regionName?: string;
  durationMinutes?: number;
  estimatedCost?: number;
  tags?: string[];
}

export const updateCourse = (
  courseId: string,
  courseData: CourseUpdateDto,
  token: string
): Promise<void> => {
  return apiFetch(`${API_BASE_URL}/api/courses/${courseId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });
};

export const deleteCourse = (
  courseId: string,
  token: string
): Promise<void> => {
  return apiFetch(`${API_BASE_URL}/api/courses/${courseId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export interface GetCoursesParams {
  q?: string;
  categoryId?: string;
  region?: string;
  maxCost?: number;
}

export const getCourses = (params: GetCoursesParams = {}): Promise<CourseSummary[]> => {
  const query = new URLSearchParams();
  if (params.q) query.append('q', params.q);
  if (params.categoryId) query.append('categoryId', params.categoryId);
  if (params.region) query.append('region', params.region);
  if (params.maxCost) query.append('maxCost', params.maxCost.toString());

  const queryString = query.toString();
  const url = `${API_BASE_URL}/api/courses${queryString ? `?${queryString}` : ''}`;
  
  return apiFetch(url);
};

export const getCourseById = (id: string) => {
  return apiFetch(`${API_BASE_URL}/api/courses/${id}`);
};

// --- Like --- //

export interface LikeDto {
  liked: boolean;

  likeCount: number;
}

export const toggleLike = (
  courseId: string,
  token: string
): Promise<LikeDto> => {
  return apiFetch(`${API_BASE_URL}/api/courses/${courseId}/likes/toggle`, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// --- Recommendation --- //

export interface RecommendationDto {
  relatedByLikes: CourseSummary[];

  sameCategory: CourseSummary[];

  sameRegion: CourseSummary[];
}

export const getCourseRecommendations = (
  courseId: string
): Promise<RecommendationDto> => {
  return apiFetch(`${API_BASE_URL}/api/courses/${courseId}/recommendations`);
};

// --- Category --- //

export interface CategoryDto {
  id: string;

  name: string;

  slug: string;
}

export const getCategories = (): Promise<CategoryDto[]> => {
  return apiFetch(`${API_BASE_URL}/api/categories`);
};

// --- Profile --- //

export interface UserProfileDto {
  id: string;
  email: string;
  nickname: string;
  bio?: string;
  avatarUrl?: string;
  courseCount: number;
  likeCount: number;
}

export interface ProfileUpdateDto {
  nickname?: string;
  bio?: string;
  avatarUrl?: string;
}

export const getUserProfile = (token: string): Promise<UserProfileDto> => {
  return apiFetch(`${API_BASE_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserProfile = (
  profileData: ProfileUpdateDto,
  token: string
): Promise<UserProfileDto> => {
  return apiFetch(`${API_BASE_URL}/api/users/me`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
};

// --- File Upload --- //

export interface FileUploadResponse {
  url: string;
}

export const uploadFile = (
  formData: FormData,
  token: string
): Promise<FileUploadResponse> => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // 'Content-Type': 'multipart/form-data' - DO NOT SET THIS HEADER, BROWSER DOES IT AUTOMATICALLY

  return apiFetch(`${API_BASE_URL}/api/files/upload`, {
    method: "POST",

    headers: headers, // Pass the explicitly constructed headers

    body: formData,
  });
};
