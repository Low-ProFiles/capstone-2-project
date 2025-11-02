
export * from './auth';
export * from './course';

export interface Category {
  id: string; // UUID
  name: string;
  slug: string;
  parentId?: string; // UUID
}

export interface Like {
  userId: string; // UUID
  courseId: string; // UUID
  liked: boolean;
}

export interface User {
  id: string; // UUID
  email: string;
  nickname: string;
  avatarUrl?: string;
  role: string;
  status: string;
}
