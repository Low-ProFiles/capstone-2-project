const API_BASE_URL = '';

// Generic fetch function to handle common headers and errors
const apiFetch = async (url: string, options: RequestInit = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: response.statusText };
    }
    throw new Error(errorData.message || 'API request failed');
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
  apiFetch(`${API_BASE_URL}/api/auth/signup`, { method: 'POST', body: JSON.stringify(userData) });

export const login = (credentials: LoginDto): Promise<TokenDto> => 
  apiFetch(`${API_BASE_URL}/api/auth/login`, { method: 'POST', body: JSON.stringify(credentials) });


// --- Course --- //
export interface CourseCreateDto {
  title: string;
  description: string;
  // Add other fields from backend CreateReq DTO as needed
}

export const createCourse = (courseData: CourseCreateDto, token: string) => {
  return apiFetch(`${API_BASE_URL}/api/courses`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });
};

export const getCourses = (query: string = '') => {
  // For simplicity, not handling full Pageable object yet
  return apiFetch(`${API_BASE_URL}/api/courses?q=${query}`);
};

export const getCourseById = (id: string) => {
  return apiFetch(`${API_BASE_URL}/api/courses/${id}`);
};