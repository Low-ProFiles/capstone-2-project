import type { 
  SignUp,
  Login,
  Token,
  CourseSummary, 
  CourseDetails,
  CreateCourseReq,
  UpdateCourseReq,
  Category,
  LikeToggleRes,
  FileUploadRes,
  UserProfileDto,
  ProfileUpdateDto,
  Page,
} from "@/types";

// Generic fetch function to handle common headers and errors
export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = { ...options.headers as Record<string, string> };

  // Let the browser set the Content-Type for FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + url, { ...options, headers });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw new Error(errorData.message || "API request failed");
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return response.text();
  }
};

// --- Auth --- //
export const signup = (userData: SignUp) =>
  apiFetch(`/api/auth/signup`, {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const login = (credentials: Login): Promise<Token> =>
  apiFetch(`/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const kakaoLogin = (code: string): Promise<Token> =>
  apiFetch(`/api/auth/login/kakao`, { // 참고: 이 엔드포인트는 백엔드에 추가 구현이 필요합니다.
    method: "POST",
    body: JSON.stringify({ code }),
  });

export const setNickname = (nickname: string, token: string): Promise<void> =>
  apiFetch(`/auth/nickname`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nickname }),
  });
  
// --- Course --- //
export const createCourse = (courseData: CreateCourseReq, token: string): Promise<CourseDetails> => {
  return apiFetch(`/api/courses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });
};

export const updateCourse = (
  courseId: string,
  courseData: UpdateCourseReq,
  token: string
): Promise<void> => {
  return apiFetch(
    `/api/courses/${courseId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(courseData),
    }
  );
};

export const deleteCourse = (
  courseId: string,
  token: string
): Promise<void> => {
  return apiFetch(
    `/api/courses/${courseId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export interface GetCoursesParams {
  q?: string;
  categoryId?: string;
  region?: string;
  maxCost?: number;
  sortType?: string;
  page?: number;
  size?: number;
}

export const getCourses = (
  params: GetCoursesParams = {}
): Promise<Page<CourseSummary>> => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  const url = `/api/courses${queryString ? `?${queryString}` : ""}`;

  return apiFetch(url);
};

export const getCourseById = (id: string): Promise<CourseDetails> => {
  return apiFetch(`/api/courses/${id}`);
};


export interface RecommendationDto {
  relatedByLikes: CourseSummary[];
  sameCategory: CourseSummary[];
  sameRegion: CourseSummary[];
}

export const getCourseRecommendations = (
  courseId: string
): Promise<RecommendationDto> => {
  return apiFetch(`/api/courses/${courseId}/recommendations`);
};


// --- Like --- //
export const toggleLike = (
  courseId: string,
  token: string
): Promise<LikeToggleRes> => {
  return apiFetch(
    `/api/courses/${courseId}/likes/toggle`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// --- Category --- //
export const getCategories = (): Promise<Category[]> => {
  return apiFetch(`/api/categories`);
};

// --- Profile --- //
export const getUserProfile = (token: string): Promise<UserProfileDto> => {
  return apiFetch(`/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserProfile = (
  profileData: ProfileUpdateDto,
  token: string
): Promise<UserProfileDto> => {
  return apiFetch(`/api/users/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
};

// --- File Upload --- //
export const uploadFile = (
  formData: FormData,
  token: string
): Promise<FileUploadRes> => {
  return apiFetch(`/api/files/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};